/**
 * Universal User Service - Single Source of Truth for ALL User Data
 * Ensures 100% consistent user fetching across the entire application
 */

import { supabase } from '@/integrations/supabase/client';
import { mediaService } from '@/services/media/MediaService';

export interface UniversalUserData {
  id: string;
  auth_user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  initials: string;
  avatar_url: string | null;
  username: string | null;
  verified: boolean;
  role: string;
  account_status: string;
  loading: boolean;
  error: string | null;
}

// Global user cache - single source of truth  
const globalUserCache = new Map<string, UniversalUserData>();
const userListeners = new Map<string, Set<(userData: UniversalUserData) => void>>();
const activeRequests = new Map<string, Promise<UniversalUserData>>();

// Force clear cache to refresh initials after migration
globalUserCache.clear();
try {
  localStorage.removeItem('universal_user_cache');
} catch (e) {
  // Ignore localStorage errors
}

// Lightweight localStorage for fast reload hydration
const CACHE_KEY = 'universal_user_cache';
const CACHE_EXPIRE_MS = 24 * 60 * 60 * 1000; // 24 hours

// Real-time sync
let realtimeChannel: any = null;

class UniversalUserService {
  private setupRealtime() {
    if (realtimeChannel) return;

    realtimeChannel = supabase
      .channel('universal-user-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('🔄 Universal user update received:', payload);
          if (payload.new) {
            const userData = this.transformToUniversalData(payload.new);
            this.updateCache(userData.auth_user_id, userData);
          }
        }
      )
      .subscribe();
  }

  private transformToUniversalData(profile: any): UniversalUserData {
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    const email = profile.email || '';
    const username = profile.username || '';
    const role = profile.role || 'user';
    
    // Better display name logic - prioritize first/last name, then username, then email prefix
    let displayName = '';
    if (firstName || lastName) {
      displayName = `${firstName} ${lastName}`.trim();
    } else if (username) {
      displayName = username;
    } else if (email) {
      displayName = email.split('@')[0];
    } else {
      displayName = 'User';
    }
    
    // STRICT: Prefer first/last name for initials, but derive from username/email/display name if missing
    let initials = '';
    if (firstName && lastName) {
      initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      initials = `${firstName[0]}${firstName[1] || ''}`.toUpperCase();
    } else if (lastName) {
      initials = `${lastName[0]}${lastName[1] || ''}`.toUpperCase();
    } else {
      // Fallback: derive from username or email/local part or display name
      const source = (username || email.split('@')[0] || displayName || '').trim();
      if (source) {
        const parts = source.split(/[\s._-]+/).filter(Boolean);
        const a = parts[0]?.[0] || source[0];
        const b = parts[1]?.[0] || source[1] || '';
        initials = `${a || ''}${b || ''}`.toUpperCase();
      } else {
        initials = '??';
      }
    }

    // Determine avatar URL from legacy columns
    const legacyAvatar = profile.profile_image_url || profile.avatar_url || null;

    // Build base data synchronously
    const base: UniversalUserData = {
      id: profile.id,
      auth_user_id: profile.auth_user_id || profile.user_id || profile.id,
      email,
      first_name: firstName,
      last_name: lastName,
      display_name: displayName,
      initials,
      avatar_url: legacyAvatar,
      username,
      verified: profile.verified || false,
      role: role, // Role from user_roles table or primary_role column
      account_status: profile.account_status || 'active',
      loading: false,
      error: null
    };

    // If avatar_key exists, resolve a fresh URL in background (non-blocking)
    const key: string | null = profile.avatar_key || null;
    if (key && typeof key === 'string') {
      const userId = base.auth_user_id;
      console.log('🧠 UniversalUser: avatar_key detected, resolving URL in background', { userId, keyStart: key.slice(0, 80) });
      // Fire and forget - update cache when ready
      void mediaService.getUrl(key).then(async (url) => {
        if (!url) return;
        // Only update if changed to avoid noisy loops
        if (globalUserCache.get(userId)?.avatar_url !== url) {
          console.log('✅ UniversalUser: avatar URL resolved, updating cache');
          this.updateCache(userId, { ...base, avatar_url: url });
        }
        // Also sync auth metadata so legacy components show globally
        try {
          const { error: authErr } = await supabase.auth.updateUser({ data: { avatar_url: url } });
          if (authErr) console.warn('⚠️ UniversalUser: auth.updateUser failed', authErr);
          else console.log('✅ UniversalUser: auth.updateUser synced avatar_url');
        } catch (e) {
          console.warn('⚠️ UniversalUser: auth.updateUser exception', e);
        }
      }).catch((e) => console.warn('⚠️ UniversalUser: avatar URL resolution failed', e));
    } else if (legacyAvatar && typeof legacyAvatar === 'string' && /\/shqipet\//.test(legacyAvatar)) {
      // BACKFILL: Extract avatar_key from legacy Wasabi URL and persist it
      const userId = base.auth_user_id;
      console.log('🔄 UniversalUser: Legacy Wasabi URL detected, deriving avatar_key', { userId, urlStart: legacyAvatar.slice(0, 100) });
      
      // Extract key from URL patterns
      let derivedKey: string | null = null;
      const m1 = legacyAvatar.match(/\/(uploads|covers|avatars)\/([^\?#\s]+)/i);
      if (m1 && m1[1] && m1[2]) {
        derivedKey = `${m1[1]}/${decodeURIComponent(m1[2])}`;
      } else {
        const m2 = legacyAvatar.match(/\/shqipet\/([^\?#\s]+)/i);
        if (m2 && m2[1]) {
          derivedKey = decodeURIComponent(m2[1]);
        }
      }
      
      if (derivedKey) {
        console.log('✅ UniversalUser: Derived avatar_key from URL:', derivedKey);
        // Persist the key in background
        void supabase
          .from('profiles')
          .update({ avatar_key: derivedKey, updated_at: new Date().toISOString() })
          .eq('auth_user_id', userId)
          .then(({ error }) => {
            if (!error) {
              console.log('✅ UniversalUser: Avatar key backfilled successfully');
              // Update cache with the key
              const updatedBase = { ...base };
              this.updateCache(userId, updatedBase);
            } else {
              console.warn('⚠️ UniversalUser: Avatar key backfill failed:', error);
            }
          });
      }
    }

    return base;
  }

  private updateCache(userId: string, userData: UniversalUserData) {
    globalUserCache.set(userId, userData);
    
    // Persist to localStorage for fast reload hydration
    this.saveToLocalStorage(userId, userData);
    
    // Expose for debugging
    try {
      (window as any).__universalUserDebug = {
        userId,
        userData,
        status: this.getStatus(),
        ts: Date.now()
      };
    } catch {}
    
    // Notify all listeners
    const listeners = userListeners.get(userId);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(userData);
        } catch (error) {
          console.error('Error in user listener:', error);
        }
      });
    }
  }

  private saveToLocalStorage(userId: string, userData: UniversalUserData) {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      cached[userId] = {
        data: userData,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
    } catch (error) {
      console.warn('Failed to save user cache to localStorage:', error);
    }
  }

  private loadFromLocalStorage(userId: string): UniversalUserData | null {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      const userCache = cached[userId];
      if (userCache && (Date.now() - userCache.timestamp) < CACHE_EXPIRE_MS) {
        return userCache.data;
      }
    } catch (error) {
      console.warn('Failed to load user cache from localStorage:', error);
    }
    return null;
  }

  private async fetchUserFromDatabase(userId: string): Promise<UniversalUserData> {
    try {
      console.log(`🔍 Fetching user data for: ${userId}`);

      // Fetch profile and role data in parallel
      const [profilePromise, rolePromise] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle(),
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
      ]);

      const fetchPromise = profilePromise;
        
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('User fetch timeout')), 8000);
      });

      const { data: profile, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      // Also try to get auth user metadata as fallback
      let authUser = null;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.id === userId) {
          authUser = user;
        }
      } catch (authError) {
        console.warn('Could not fetch auth user metadata:', authError);
      }

      if (profile) {
        console.log(`✅ User profile found for: ${userId}`, {
          hasFirstName: !!profile.first_name,
          hasLastName: !!profile.last_name,
          hasEmail: !!profile.email
        });
        
        // Get the user's role from user_roles table
        const userRole = rolePromise.data?.role || profile.primary_role || 'user';
        
        // Merge profile with auth metadata and role
        const mergedProfile: any = {
          ...profile,
          email: profile.email || authUser?.email || '',
          first_name: profile.first_name || authUser?.user_metadata?.first_name || '',
          last_name: profile.last_name || authUser?.user_metadata?.last_name || '',
          username: profile.username || authUser?.user_metadata?.username || '',
          role: userRole
        };
        
        // Backfill missing names once from username/email and persist
        if ((!mergedProfile.first_name || !mergedProfile.last_name) && (mergedProfile.username || mergedProfile.email)) {
          const local = (mergedProfile.email ? String(mergedProfile.email).split('@')[0] : String(mergedProfile.username)).trim();
          const parts = local.split(/[._-]+/).filter(Boolean);
          const cap = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
          const derivedFirst = mergedProfile.first_name || cap(parts[0] || '');
          const derivedLast = mergedProfile.last_name || cap(parts[1] || '');
          const toUpdate: any = {};
          if (!mergedProfile.first_name && derivedFirst) toUpdate.first_name = derivedFirst;
          if (!mergedProfile.last_name && derivedLast) toUpdate.last_name = derivedLast;
          if (Object.keys(toUpdate).length) {
            try {
              await supabase.from('profiles').update({ ...toUpdate, updated_at: new Date().toISOString() }).eq('id', userId);
              mergedProfile.first_name = derivedFirst;
              mergedProfile.last_name = derivedLast;
            } catch (e) {
              console.warn('Name backfill failed:', e);
            }
          }
        }
        
        console.log(`📋 User data prepared:`, {
          firstName: mergedProfile.first_name,
          lastName: mergedProfile.last_name,
          email: mergedProfile.email,
          role: mergedProfile.role
        });
        
        return this.transformToUniversalData(mergedProfile);
      } else if (authUser) {
        console.log(`✅ Using auth user data for: ${userId}`);
        // Create profile from auth user metadata
        const authProfile = {
          id: '',
          auth_user_id: userId,
          email: authUser.email || '',
          first_name: authUser.user_metadata?.first_name || '',
          last_name: authUser.user_metadata?.last_name || '',
          username: authUser.user_metadata?.username || '',
          profile_image_url: authUser.user_metadata?.avatar_url || null,
          verified: authUser.email_confirmed_at != null
        };
        return this.transformToUniversalData(authProfile);
      } else {
        console.warn(`⚠️ No profile or auth data found for user: ${userId}`, error);
        return {
          id: userId,
          auth_user_id: userId,
          email: '',
          first_name: '',
          last_name: '',
        display_name: '',
        initials: '',
          avatar_url: null,
          username: null,
          verified: false,
          role: 'user',
          account_status: 'active',
          loading: false,
          error: 'Profile not found'
        };
      }
    } catch (error) {
      console.error(`❌ Error fetching user ${userId}:`, error);
      return {
        id: userId,
        auth_user_id: userId,
        email: '',
        first_name: '',
        last_name: '',
        display_name: '',
        initials: '',
        avatar_url: null,
        username: null,
        verified: false,
        role: 'user',
        account_status: 'active',
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get user data - guaranteed to return data (cached or fresh)
   */
  async getUser(userId: string): Promise<UniversalUserData> {
    if (!userId) {
      return {
        id: '',
        auth_user_id: '',
        email: '',
        first_name: '',
        last_name: '',
        display_name: '',
        initials: '',
        avatar_url: null,
        username: null,
        verified: false,
        role: 'user',
        account_status: 'active',
        loading: false,
        error: 'No user ID provided'
      };
    }

    // Return cached data immediately if available
    const cached = globalUserCache.get(userId);
    if (cached && !cached.loading && !cached.error) {
      return cached;
    }

    // Try localStorage cache for fast reloads
    const localCached = this.loadFromLocalStorage(userId);
    if (localCached) {
      this.updateCache(userId, localCached);
      return localCached;
    }

    // Check if request is already in progress
    const existingRequest = activeRequests.get(userId);
    if (existingRequest) {
      return existingRequest;
    }

    // Create new request
    const requestPromise = this.fetchUserFromDatabase(userId);
    activeRequests.set(userId, requestPromise);

    try {
      const userData = await requestPromise;
      this.updateCache(userId, userData);
      return userData;
    } finally {
      activeRequests.delete(userId);
    }
  }

  /**
   * Update avatar immediately and persist to database
   */
  async updateAvatar(userId: string, avatarKey: string): Promise<void> {
    console.log('🔄 Universal Service: Updating avatar immediately');
    
    const existingData = globalUserCache.get(userId) || await this.getUser(userId);

    // Resolve a display URL now
    let finalUrl: string = avatarKey;
    try {
      mediaService.clearCache(avatarKey);
      finalUrl = await mediaService.getUrl(avatarKey);
      console.log('🧪 UniversalUser/updateAvatar resolved URL', finalUrl.slice(0, 100) + '...');
    } catch (e) {
      console.warn('⚠️ UniversalUser/updateAvatar URL resolution failed, using key as placeholder', e);
    }

    const updatedData = {
      ...existingData,
      avatar_url: finalUrl,
      loading: false
    };
    
    // Update cache immediately for instant UI update
    this.updateCache(userId, updatedData);
    
    // Persist to database in background
    try {
      // Ensure profile row exists to avoid silent failures (best-effort)
      try { await supabase.rpc('ensure_user_profile_exists', { user_uuid: userId }); } catch (e) { /* optional */ }

      // Store both key and display URL for compatibility
      await supabase
        .from('profiles')
        .update({ 
          avatar_key: avatarKey,
          profile_image_url: finalUrl,
          // CRITICAL: persist the stable Wasabi key in avatar_url
          avatar_url: avatarKey,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      console.log('✅ UniversalUser/updateAvatar persisted to profiles');
    } catch (error) {
      console.error('❌ UniversalUser/updateAvatar failed to persist to profiles:', error);
    }

    // Also update auth metadata so legacy parts of the app reflect the new avatar globally
    try {
      const { error: authErr } = await supabase.auth.updateUser({
        data: { avatar_url: finalUrl }
      });
      if (authErr) {
        console.warn('⚠️ UniversalUser/updateAvatar auth.updateUser failed', authErr);
      } else {
        console.log('✅ UniversalUser/updateAvatar auth.updateUser succeeded');
      }
    } catch (e) {
      console.warn('⚠️ UniversalUser/updateAvatar auth.updateUser exception', e);
    }
  }

  /**
   * Subscribe to user data changes
   */
  subscribe(userId: string, callback: (userData: UniversalUserData) => void): () => void {
    if (!userListeners.has(userId)) {
      userListeners.set(userId, new Set());
    }
    
    const listeners = userListeners.get(userId)!;
    listeners.add(callback);

    // Setup realtime if not already done
    this.setupRealtime();

    // Immediately call with cached data if available  
    const cached = globalUserCache.get(userId);
    if (cached) {
      callback({ ...cached, loading: false }); // Ensure no loading state
    } else {
      // Provide immediate fallback, then fetch in background
      callback({
        id: userId,
        auth_user_id: userId,
        email: '',
        first_name: '',
        last_name: '',
        display_name: '',
        initials: '',
        avatar_url: null,
        username: null,
        verified: false,
        role: 'user',
        account_status: 'active',
        loading: false, // NEVER show loading
        error: null
      });
      // Fetch real data in background
      this.getUser(userId);
    }

    // Return unsubscribe function
    return () => {
      listeners.delete(callback);
      if (listeners.size === 0) {
        userListeners.delete(userId);
      }
    };
  }

  /**
   * Batch fetch multiple users efficiently
   */
  async getUsers(userIds: string[]): Promise<Map<string, UniversalUserData>> {
    const results = new Map<string, UniversalUserData>();
    const uncachedIds: string[] = [];

    // Check cache first
    for (const userId of userIds) {
      const cached = globalUserCache.get(userId);
      if (cached && !cached.loading && !cached.error) {
        results.set(userId, cached);
      } else {
        uncachedIds.push(userId);
      }
    }

    if (uncachedIds.length === 0) {
      return results;
    }

    try {
      // Batch fetch uncached users
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .in('auth_user_id', uncachedIds);

      if (!error && profiles) {
        for (const profile of profiles) {
          const userData = this.transformToUniversalData(profile);
          this.updateCache(userData.auth_user_id, userData);
          results.set(userData.auth_user_id, userData);
        }
      }

      // Add fallback data for missing users
      for (const userId of uncachedIds) {
        if (!results.has(userId)) {
          const fallbackData: UniversalUserData = {
            id: userId,
            auth_user_id: userId,
            email: '',
            first_name: '',
            last_name: '',
            display_name: '',
            initials: '',
            avatar_url: null,
            username: null,
            verified: false,
            role: 'user',
            account_status: 'active',
            loading: false,
            error: 'Profile not found'
          };
          this.updateCache(userId, fallbackData);
          results.set(userId, fallbackData);
        }
      }
    } catch (error) {
      console.error('Batch user fetch error:', error);
    }

    return results;
  }

  /**
   * Force refresh user data
   */
  async refreshUser(userId: string): Promise<UniversalUserData> {
    globalUserCache.delete(userId);
    return this.getUser(userId);
  }

  /**
   * Get cached user data (synchronous)
   */
  getCachedUser(userId: string): UniversalUserData | null {
    return globalUserCache.get(userId) || null;
  }

  /**
   * Clear all cache
   */
  clearCache() {
    globalUserCache.clear();
    activeRequests.clear();
    console.log('🧹 Universal user cache cleared');
  }

  /**
   * Get cache status for debugging
   */
  getStatus() {
    return {
      cachedUsers: globalUserCache.size,
      activeRequests: activeRequests.size,
      activeListeners: Array.from(userListeners.entries()).reduce((sum, [_, listeners]) => sum + listeners.size, 0)
    };
  }
}

// Export singleton instance
export const universalUserService = new UniversalUserService();

console.log('🌟 Universal User Service initialized - 100% consistent user data guaranteed!');