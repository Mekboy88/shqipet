import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  user_id: string;
  auth_user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  cover_photo_url?: string;
  role?: string;
  account_status?: string;
  phone_number?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
}

interface CachedUser {
  profile: UserProfile;
  timestamp: number;
  expiresAt: number;
}

class UltraStableUserFetchingService {
  private userCache = new Map<string, CachedUser>();
  private activeRequests = new Map<string, Promise<UserProfile | null>>();
  private retryQueue: Array<{ userId: string; resolve: Function; reject: Function }> = [];
  private isOnline = navigator.onLine;
  private readonly CACHE_TTL = 300000; // 5 minutes
  private readonly MAX_RETRIES = 5;
  private readonly RETRY_DELAY = 1000;

  constructor() {
    this.setupNetworkListeners();
    this.startPeriodicCleanup();
    console.log('🚀 UltraStableUserFetchingService initialized');
  }

  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      console.log('🌐 Network online - processing retry queue');
      this.isOnline = true;
      this.processRetryQueue();
    });

    window.addEventListener('offline', () => {
      console.log('📵 Network offline - will queue requests');
      this.isOnline = false;
    });
  }

  private startPeriodicCleanup() {
    setInterval(() => {
      this.cleanupExpiredCache();
    }, 60000); // Cleanup every minute
  }

  private cleanupExpiredCache() {
    const now = Date.now();
    for (const [userId, cached] of this.userCache.entries()) {
      if (cached.expiresAt < now) {
        this.userCache.delete(userId);
      }
    }
  }

  // Main method to get user profile with ultra-stable retry logic
  async getUserProfile(userId: string, forceRefresh = false): Promise<UserProfile | null> {
    try {
      console.log(`👤 Getting user profile for: ${userId}`);

      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = this.getCachedUser(userId);
        if (cached) {
          console.log(`✅ Returning cached profile for: ${userId}`);
          return cached.profile;
        }
      }

      // Check if request is already in progress
      const existingRequest = this.activeRequests.get(userId);
      if (existingRequest) {
        console.log(`⏳ Request already in progress for: ${userId}`);
        return existingRequest;
      }

      // Create new request with retry logic
      const requestPromise = this.fetchWithRetry(userId);
      this.activeRequests.set(userId, requestPromise);

      try {
        const result = await requestPromise;
        if (result) {
          this.cacheUser(userId, result);
        }
        return result;
      } finally {
        this.activeRequests.delete(userId);
      }
    } catch (error) {
      console.error(`❌ Failed to get user profile for ${userId}:`, error);
      
      // If offline or network error, queue for retry
      if (!this.isOnline || this.isNetworkError(error)) {
        return this.queueForRetry(userId);
      }
      
      return null;
    }
  }

  private async fetchWithRetry(userId: string, attempt = 1): Promise<UserProfile | null> {
    try {
      console.log(`🔄 Fetching user profile (attempt ${attempt}/${this.MAX_RETRIES}): ${userId}`);

      // Try multiple query strategies
      let data, error;
      
      // Strategy 1: Query by auth_user_id (most common)
      ({ data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', userId)
        .single()
      );

      // Strategy 2: If not found, try by user_id field
      if (error && error.code === 'PGRST116') {
        console.log(`🔄 Trying alternative query for: ${userId}`);
        ({ data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single()
        );
      }

      // Strategy 3: If still not found, try by id field
      if (error && error.code === 'PGRST116') {
        console.log(`🔄 Trying id field query for: ${userId}`);
        ({ data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        );
      }

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn(`⚠️ No profile found for user: ${userId}`);
          return null;
        }
        throw error;
      }

      if (data) {
        console.log(`✅ Successfully fetched profile for: ${userId}`);
        return data as UserProfile;
      }

      return null;
    } catch (error) {
      console.error(`❌ Fetch attempt ${attempt} failed for ${userId}:`, error);

      if (attempt < this.MAX_RETRIES) {
        const delay = this.RETRY_DELAY * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`⏳ Retrying in ${delay}ms...`);
        await this.delay(delay);
        return this.fetchWithRetry(userId, attempt + 1);
      }

      throw error;
    }
  }

  private getCachedUser(userId: string): CachedUser | null {
    const cached = this.userCache.get(userId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached;
    }
    return null;
  }

  private cacheUser(userId: string, profile: UserProfile) {
    const now = Date.now();
    this.userCache.set(userId, {
      profile,
      timestamp: now,
      expiresAt: now + this.CACHE_TTL
    });
    console.log(`💾 Cached profile for: ${userId}`);
  }

  private isNetworkError(error: any): boolean {
    return (
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('NetworkError') ||
      error.message?.includes('fetch') ||
      error.code === 'NETWORK_ERROR' ||
      !this.isOnline
    );
  }

  private async queueForRetry(userId: string): Promise<UserProfile | null> {
    return new Promise((resolve, reject) => {
      this.retryQueue.push({ userId, resolve, reject });
      console.log(`📝 Queued user ${userId} for retry when online`);
      
      // Return cached data if available
      const cached = this.getCachedUser(userId);
      if (cached) {
        resolve(cached.profile);
      } else {
        resolve(null);
      }
    });
  }

  private async processRetryQueue() {
    if (this.retryQueue.length === 0) return;

    console.log(`🔄 Processing ${this.retryQueue.length} queued requests`);
    
    const queue = [...this.retryQueue];
    this.retryQueue = [];

    for (const { userId, resolve, reject } of queue) {
      try {
        const profile = await this.getUserProfile(userId, true);
        resolve(profile);
      } catch (error) {
        reject(error);
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Batch fetch multiple users
  async getUserProfiles(userIds: string[]): Promise<Map<string, UserProfile | null>> {
    console.log(`👥 Batch fetching ${userIds.length} user profiles`);
    
    const results = new Map<string, UserProfile | null>();
    const uncachedIds: string[] = [];

    // Check cache first
    for (const userId of userIds) {
      const cached = this.getCachedUser(userId);
      if (cached) {
        results.set(userId, cached.profile);
      } else {
        uncachedIds.push(userId);
      }
    }

    if (uncachedIds.length === 0) {
      console.log(`✅ All profiles found in cache`);
      return results;
    }

    try {
      // Batch fetch uncached profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('auth_user_id', uncachedIds);

      if (error) throw error;

      if (data) {
        for (const profile of data) {
          const userId = profile.auth_user_id || profile.user_id || profile.id;
          results.set(userId, profile as UserProfile);
          this.cacheUser(userId, profile as UserProfile);
        }
      }

      // Mark missing profiles as null
      for (const userId of uncachedIds) {
        if (!results.has(userId)) {
          results.set(userId, null);
        }
      }

      console.log(`✅ Batch fetch completed: ${data?.length || 0}/${uncachedIds.length} found`);
    } catch (error) {
      console.error(`❌ Batch fetch failed:`, error);
      
      // Fall back to individual fetches
      for (const userId of uncachedIds) {
        if (!results.has(userId)) {
          try {
            const profile = await this.getUserProfile(userId);
            results.set(userId, profile);
          } catch (err) {
            results.set(userId, null);
          }
        }
      }
    }

    return results;
  }

  // Get avatar URL with fallback logic
  async getUserAvatar(userId: string): Promise<string | null> {
    try {
      const profile = await this.getUserProfile(userId);
      
      if (profile?.profile_image_url) {
        // Validate avatar URL is accessible
        const isValid = await this.validateImageUrl(profile.profile_image_url);
        if (isValid) {
          return profile.profile_image_url;
        }
      }

      return null;
    } catch (error) {
      console.error(`❌ Failed to get avatar for ${userId}:`, error);
      return null;
    }
  }

  private async validateImageUrl(url: string): Promise<boolean> {
    try {
      // For Supabase storage URLs, we can assume they're valid if they follow the pattern
      if (url.includes('supabase.co/storage/v1/object/public/')) {
        return true;
      }

      // For other URLs, do a quick HEAD request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(url, { 
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.warn(`⚠️ Avatar URL validation failed for ${url}:`, error);
      return false;
    }
  }

  // Real-time profile updates
  setupRealtimeUpdates(onProfileUpdate: (profile: UserProfile) => void) {
    const channel = supabase
      .channel('profile-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('🔄 Profile update received:', payload);
          
          if (payload.new) {
            const profile = payload.new as UserProfile;
            const userId = profile.auth_user_id || profile.user_id || profile.id;
            
            // Update cache
            this.cacheUser(userId, profile);
            
            // Notify callback
            onProfileUpdate(profile);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }

  // Force refresh specific user
  async refreshUser(userId: string): Promise<UserProfile | null> {
    this.userCache.delete(userId);
    return this.getUserProfile(userId, true);
  }

  // Clear all cache
  clearCache() {
    this.userCache.clear();
    this.activeRequests.clear();
    console.log('🧹 User cache cleared');
  }

  // Get cache status
  getCacheStatus() {
    return {
      cachedUsers: this.userCache.size,
      activeRequests: this.activeRequests.size,
      queuedRequests: this.retryQueue.length,
      isOnline: this.isOnline
    };
  }
}

export const ultraStableUserFetching = new UltraStableUserFetchingService();
export { UltraStableUserFetchingService };