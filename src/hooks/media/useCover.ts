/**
 * useCover - New unified cover photo management hook
 * Handles loading, uploading, positioning, and real-time sync
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { mediaService } from '@/services/media/MediaService';
import { uploadService } from '@/services/media/UploadService';
import { toast } from '@/utils/toastToNotification';
import { errorRecoveryService } from '@/utils/errorBoundary/ErrorRecoveryService';
import { userPhotosService } from '@/services/photos/UserPhotosService';

// Simplified persistence function that uses only the edge function
const persistCoverToDatabase = async (userId: string, coverKey: string, position?: string): Promise<boolean> => {
  console.log('💾 Persisting cover directly to DB:', { userId, coverKey, position });
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ cover_url: coverKey, cover_position: position || null, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (!error) {
      console.log('✅ Cover persisted successfully via DB update');
      return true;
    }
    console.warn('⚠️ Cover DB update failed:', error);
    return false;
  } catch (e) {
    console.error('❌ Cover DB update error:', e);
    return false;
  }
};

interface CoverState {
  userId: string; // CRITICAL: Track which user this state belongs to
  key: string | null;
  resolvedUrl: string | null;
  position: string;
  loading: boolean;
  lastGoodUrl: string | null;
  isPositionChanging: boolean;
  isPositionSaving: boolean;
}

// SECURITY FIX: Per-user state isolation instead of global shared state
const stateByUser = new Map<string, CoverState>();
const listenersByUser = new Map<string, Set<(state: CoverState) => void>>();

const getDefaultState = (userId: string): CoverState => ({
  userId,
  key: null,
  resolvedUrl: null,
  position: 'center 50%',
  loading: false, // ⚠️ CRITICAL: NEVER show loading skeleton - instant display only
  lastGoodUrl: null,
  isPositionChanging: false,
  isPositionSaving: false
});

const getCoverState = (userId: string): CoverState => {
  if (!stateByUser.has(userId)) {
    stateByUser.set(userId, getDefaultState(userId));
  }
  return stateByUser.get(userId)!;
};

const notifyCoverChange = (userId: string, newState: CoverState) => {
  // SECURITY: Verify userId matches state
  if (newState.userId !== userId) {
    console.error('🚨 SECURITY: User ID mismatch detected!', { expected: userId, actual: newState.userId });
    return;
  }
  
  // CRITICAL: Skip if state didn't actually change (prevents flicker)
  const prevState = stateByUser.get(userId);
  if (prevState && 
      prevState.resolvedUrl === newState.resolvedUrl &&
      prevState.position === newState.position &&
      prevState.loading === newState.loading &&
      prevState.isPositionChanging === newState.isPositionChanging &&
      prevState.isPositionSaving === newState.isPositionSaving) {
    return; // No actual change - skip notification
  }
  
  // Update per-user state
  stateByUser.set(userId, newState);
  
  // Real-time debug logging with user ID
  console.log(`🖼️ Cover Photo Debug [User: ${userId.slice(0, 8)}]:`, {
    userId,
    globalCoverUrl: newState.resolvedUrl,
    resolvedUrl: newState.resolvedUrl,
    baseCandidate: newState.resolvedUrl,
    displayUrl: newState.resolvedUrl,
    coverPositionGlobal: newState.position,
    coverPositionV2: newState.position,
    effectivePosition: newState.position,
    coverLoadingCombined: newState.loading,
    isPositionChanging: newState.isPositionChanging,
    isPositionSaving: newState.isPositionSaving
  });
  
  // Notify only listeners for this specific user
  const listeners = listenersByUser.get(userId);
  if (listeners) {
    listeners.forEach(listener => {
      try {
        listener(newState);
      } catch (error) {
        console.error(`Error in cover listener for user ${userId}:`, error);
      }
    });
  }
  
  // Emit user-specific position change event
  window.dispatchEvent(new CustomEvent('cover-position-changed', { 
    detail: { userId, position: newState.position, isChanging: newState.isPositionChanging } 
  }));
};

// Normalize background-position to vertical-only 'center N%'
const normalizePosition = (input: string | null | undefined): string => {
  if (!input) return 'center 50%';
  const s = String(input).trim().toLowerCase();
  // Prefer explicit 'center <y>%' if present
  const mCenter = s.match(/center\s+(-?\d+(?:\.\d+)?)%/);
  if (mCenter) return `center ${Math.round(parseFloat(mCenter[1]))}%`;
  // Extract last percentage number as Y
  const mAll = s.match(/(-?\d+(?:\.\d+)?)%/g);
  if (mAll && mAll.length > 0) {
    const y = parseFloat(mAll[mAll.length - 1]);
    return `center ${Math.round(y)}%`;
  }
  return 'center 50%';
};

export const useCover = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  
  // Initialize with cached data immediately to prevent position shake
  const [coverState, setCoverState] = useState<CoverState>(() => {
    if (!targetUserId) return getDefaultState('__no_user__');
    
    // Try to load from per-user cache
    try {
      const cachedRaw = localStorage.getItem(`cover:last:${targetUserId}`);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        const cachedUrl = typeof cached?.url === 'string' ? cached.url : null;
        const isValidUrl = cachedUrl && !/^blob:|^data:/.test(cachedUrl);
        const cachedPos = normalizePosition(cached?.position || 'center');
        
        if (isValidUrl) {
          const initialState: CoverState = {
            userId: targetUserId,
            key: cached?.key || null,
            resolvedUrl: cachedUrl as string,
            lastGoodUrl: cachedUrl as string,
            position: cachedPos,
            loading: false, // INSTANT: Never show loading on initial render
            isPositionChanging: false,
            isPositionSaving: false
          };
          // Update per-user state
          stateByUser.set(targetUserId, initialState);
          return initialState;
        }
      }
    } catch (e) {
      console.warn('Failed to load cached cover on init:', e);
    }
    
    return getCoverState(targetUserId);
  });

  // Subscribe to per-user changes only
  useEffect(() => {
    if (!targetUserId) return;
    
    const handleStateChange = (newState: CoverState) => {
      // SECURITY: Only update if state is for this user
      if (newState.userId === targetUserId) {
        setCoverState(newState);
      }
    };

    // Get or create listener set for this user
    if (!listenersByUser.has(targetUserId)) {
      listenersByUser.set(targetUserId, new Set());
    }
    const listeners = listenersByUser.get(targetUserId)!;
    listeners.add(handleStateChange);
    
    return () => {
      listeners.delete(handleStateChange);
      // Clean up empty listener sets
      if (listeners.size === 0) {
        listenersByUser.delete(targetUserId);
      }
    };
  }, [targetUserId]);

  // Load cover when user changes
  useEffect(() => {
    if (!targetUserId) {
      const emptyState = getDefaultState('__no_user__');
      emptyState.loading = false;
      setCoverState(emptyState);
      return;
    }

    loadCover();
  }, [targetUserId]);

  // Set up real-time subscription for cover photo updates
  useEffect(() => {
    if (!targetUserId) return;

    console.log('🔄 [COVER REAL-TIME] Setting up cover realtime subscription for user:', targetUserId);
    
    const channel = supabase
      .channel(`cover-realtime-${targetUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${targetUserId}`
        },
        (payload) => {
          console.log('✏️ [COVER REAL-TIME] Profile cover updated:', payload);
          
          // CRITICAL: Clear cache first to force fresh load
          console.log('🗑️ Clearing cover cache before reload');
          try {
            localStorage.removeItem(`cover:last:${targetUserId}`);
          } catch (e) {
            console.warn('Failed to clear cover cache:', e);
          }
          
          // Force reload from database
          loadCover(true);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'personal_introduction',
          filter: `user_id=eq.${targetUserId}`
        },
        (payload) => {
          console.log('✏️ [COVER REAL-TIME] Personal introduction cover updated:', payload);
          
          // CRITICAL: Clear cache first to force fresh load
          try {
            localStorage.removeItem(`cover:last:${targetUserId}`);
          } catch (e) {
            console.warn('Failed to clear cover cache:', e);
          }
          
          // Force reload from database
          loadCover(true);
        }
      )
      .subscribe((status) => {
        console.log('🔌 [COVER REAL-TIME] Cover channel status:', status);
      });

    return () => {
      console.log('🧹 [COVER REAL-TIME] Cleaning up cover realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [targetUserId]);

  const loadCover = async (force: boolean = false) => {
    if (!targetUserId) return;

    // CRITICAL: Don't reload during upload
    const currentState = getCoverState(targetUserId);
    if (currentState.loading && currentState.resolvedUrl?.startsWith('blob:')) {
      console.log('⏸️ Skipping cover load - upload in progress');
      return;
    }

    // ⚠️ CRITICAL OPTIMIZATION - DO NOT MODIFY (bypass when force=true) ⚠️
    if (!force) {
      // INSTANT: If we have cached data, show it and skip DB fetch entirely
      // This ensures cover photos appear instantly on login with ZERO delay
      // Removing this will cause visible loading delays and poor UX
      try {
        const cachedRaw = localStorage.getItem(`cover:last:${targetUserId}`);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          const cachedUrl = typeof cached?.url === 'string' ? cached.url : null;
          const isValidUrl = cachedUrl && !/^blob:|^data:/.test(cachedUrl);
          const cachedPos = normalizePosition(cached?.position || coverState.position);
          if (isValidUrl) {
            console.log('⚡ Using cached cover instantly:', cachedUrl.substring(0, 80));
            const cachedState: CoverState = { 
              userId: targetUserId,
              key: cached?.key || null,
              resolvedUrl: cachedUrl as string, 
              lastGoodUrl: cachedUrl as string, 
              position: cachedPos, 
              loading: false,
              isPositionChanging: false,
              isPositionSaving: false
            };
            setCoverState(cachedState);
            notifyCoverChange(targetUserId, cachedState);
            return; // INSTANT: Skip DB fetch, show cached immediately
          }
        }
      } catch {}
    }
    // ⚠️ END CRITICAL SECTION ⚠️

    try {
      console.log('🔄 Loading cover from database for user:', targetUserId);
      
      // Always load fresh from database with comprehensive fallbacks
      let anyProfile: any = null;
      let position = 'center';
      
      try {
        const baseSelect = 'cover_url, cover_position, id, updated_at';

        const tryFetch = async () => {
          try {
            const { data, error } = await supabase
              .from('profiles')
              .select(baseSelect)
              .eq('id', targetUserId)
              .maybeSingle();

            if (!error && data) {
              console.log(`✅ Found profile in public schema:`, { 
                hasCoverUrl: !!data.cover_url,
                userId: data.id,
                updatedAt: data.updated_at
              });
              return data;
            }
          } catch (e) {
            console.warn('⚠️ Failed to fetch profile from public schema:', e);
          }
          return null;
        };

        anyProfile = await tryFetch();
        
        if (!anyProfile) {
          console.log('❌ No profile found in any schema');
        }
      } catch (err) {
        console.error('❌ Critical error during profile fetch:', err);
      }

      const candidate = anyProfile?.cover_url || anyProfile?.cover_photo_url || anyProfile?.cover_image_url;
      position = normalizePosition(anyProfile?.cover_position || anyProfile?.cover_photo_position || 'center 50%');
      
      console.log('🔍 Cover loading debug:', { 
        anyProfile: anyProfile ? `${anyProfile.id}` : null,
        cover_url: anyProfile?.cover_url, 
        cover_photo_url: anyProfile?.cover_photo_url,
        cover_image_url: anyProfile?.cover_image_url,
        candidate,
        position,
        updatedAt: anyProfile?.updated_at
      });
      
      if (!candidate) {
        console.log('❌ No cover candidate found for user:', targetUserId);
        // Fallback: try last cached cover from localStorage to avoid blank on refresh
        try {
          const cachedRaw = localStorage.getItem(`cover:last:${targetUserId}`);
          if (cachedRaw) {
            const cached = JSON.parse(cachedRaw);
            const cachedUrl = typeof cached?.url === 'string' ? cached.url : null;
            if (cachedUrl && !/^blob:|^data:/.test(cachedUrl)) {
              const cachedState: CoverState = { 
                userId: targetUserId,
                key: cached?.key ?? null, 
                resolvedUrl: cachedUrl as string, 
                position, 
                loading: false, 
                lastGoodUrl: cachedUrl as string, 
                isPositionChanging: false, 
                isPositionSaving: false 
              };
              setCoverState(cachedState);
              notifyCoverChange(targetUserId, cachedState);
              console.log('✅ Using cached cover from localStorage');
              // Best-effort: derive key from URL and persist so next refresh uses DB
              setTimeout(async () => {
                try {
                  if (!user?.id) return;
                  const url = cachedUrl as string;
                  let derivedKey: string | null = null;
                  try {
                    const u = new URL(url);
                    derivedKey = u.searchParams.get('key');
                    if (!derivedKey && u.hostname.includes('wasabisys.com')) {
                      const parts = u.pathname.split('/').filter(Boolean);
                      if (parts.length >= 2) derivedKey = parts.slice(1).join('/');
                    }
                  } catch {
                    // Not a full URL (maybe already a key)
                    if (!/^blob:|^data:|^https?:/.test(url)) derivedKey = url;
                  }
                  if (derivedKey) {
                    console.log('🛠️ Persisting derived cover key from cache');
                    await persistCoverToDatabase(user.id, derivedKey);
                  }
                } catch (e) {
                  console.warn('Cache persistence attempt failed:', e);
                }
              }, 0);
              return;
            }
          }
        } catch (e) {
          console.warn('LocalStorage cover cache read failed:', e);
        }
        const emptyState: CoverState = { 
          userId: targetUserId,
          key: null, 
          resolvedUrl: null, 
          position, 
          loading: false, 
          lastGoodUrl: coverState.lastGoodUrl, 
          isPositionChanging: false, 
          isPositionSaving: false 
        };
        setCoverState(emptyState);
        notifyCoverChange(targetUserId, emptyState);
        return;
      }

      // Don't reload if same key/url and we have a resolved URL
      // ENHANCED: More aggressive check to prevent reloads
      if (candidate === coverState.key && coverState.resolvedUrl && 
          coverState.resolvedUrl.startsWith('http') && 
          position === coverState.position &&
          !coverState.loading) {
        console.log('⏸️ Skipping cover reload - already have valid cover');
        return;
      }

      // INSTANT: Skip loading state, keep showing cached image
      const currentKey = anyProfile?.cover_url || candidate;

      // Resolve URL (support both keys and direct URLs)
      const isDirectUrl = typeof candidate === 'string' && /^(https?:|blob:|data:)/.test(candidate);
      let resolvedUrl: string;
      if (isDirectUrl) {
        const direct = String(candidate);
        try {
          // If it's a Wasabi/S3 signed URL, normalize to a key to get a fresh URL for every pane
          const u = new URL(direct);
          const looksWasabi = /wasabisys\.com|s3\.|shqipet\//i.test(u.hostname + u.pathname);
          let derivedKey: string | null = u.searchParams.get('key');
          if (!derivedKey && looksWasabi) {
            const parts = u.pathname.split('/').filter(Boolean);
            // Expect something like /shqipet/<folder>/<rest-of-key>
            const idx = parts.findIndex(p => p === 'shqipet');
            if (idx >= 0 && parts.length > idx + 1) {
              derivedKey = parts.slice(idx + 1).join('/');
            } else if (parts.length >= 2) {
              derivedKey = parts.slice(1).join('/');
            }
          }
          if (derivedKey) {
            resolvedUrl = await mediaService.getUrl(derivedKey);
            await mediaService.preloadImage(resolvedUrl);
          } else {
            resolvedUrl = direct;
          }
        } catch {
          // Not a full URL (or URL parsing failed) — just use the direct string
          resolvedUrl = direct;
        }
      } else {
        try {
          resolvedUrl = await mediaService.getUrl(candidate as string);
          // Preload to prevent flicker
          await mediaService.preloadImage(resolvedUrl);
        } catch (e) {
          // Ultimate fallback: use any persisted media cache for this key
          try {
            const raw = localStorage.getItem(`media:last:${String(candidate)}`);
            if (raw) {
              const j = JSON.parse(raw);
              if (typeof j?.url === 'string') {
                console.warn('🟡 Falling back to persisted media cache for cover');
                resolvedUrl = j.url as string;
              } else {
                throw e;
              }
            } else {
              throw e;
            }
          } catch {
            throw e;
          }
        }
      }

      const finalState: CoverState = {
        userId: targetUserId,
        key: currentKey,
        resolvedUrl,
        position,
        loading: false,
        lastGoodUrl: resolvedUrl,
        isPositionChanging: false,
        isPositionSaving: false
      };

      setCoverState(finalState);
      try { localStorage.setItem(`cover:last:${targetUserId}`, JSON.stringify({ url: finalState.resolvedUrl, key: finalState.key, position: finalState.position, ts: Date.now() })); } catch {}
      notifyCoverChange(targetUserId, finalState);

      // No local cache - rely on database + in-memory resolution

      console.log('✅ Cover loaded:', { key: currentKey, position, resolvedUrl: resolvedUrl.substring(0, 100) + '...' });

    } catch (error) {
      console.error('❌ Failed to load cover:', error);
      
      // Keep last good URL on error
      const errorState = {
        ...coverState,
        loading: false,
        resolvedUrl: coverState.lastGoodUrl,
        isPositionChanging: false,
        isPositionSaving: false
      };
      
      setCoverState(errorState);
      notifyCoverChange(targetUserId, errorState);
    }
  };

  const updatePosition = useCallback(async (newPosition: string, persist: boolean = false): Promise<boolean> => {
    if (!targetUserId) return false;
    
    const normalizedPosition = normalizePosition(newPosition);
    
    // Optimistic update - show immediately
    const optimisticState = {
      ...coverState,
      position: normalizedPosition,
      isPositionChanging: true,
      isPositionSaving: persist
    };
    
    setCoverState(optimisticState);
    notifyCoverChange(targetUserId, optimisticState);
    
    console.log('🎯 Position update:', { newPosition: normalizedPosition, persist });
    
    if (persist && user?.id) {
      try {
        // Persist to database via edge function
        const success = await persistCoverToDatabase(user.id, coverState.key || '', normalizedPosition);
        
        const finalState = {
          ...coverState,
          position: normalizedPosition,
          isPositionChanging: false,
          isPositionSaving: false
        };
        
        if (success) {
          // Cache locally for resilience
          try {
            localStorage.setItem(`cover:last:${user.id}`, JSON.stringify({ 
              url: coverState.resolvedUrl, 
              key: coverState.key, 
              position: normalizedPosition, 
              ts: Date.now() 
            }));
          } catch {}
          
          setCoverState(finalState);
          notifyCoverChange(targetUserId, finalState);
          console.log('✅ Position persisted successfully');
          return true;
        } else {
          // Rollback on failure
          const rollbackState = {
            ...coverState,
            isPositionChanging: false,
            isPositionSaving: false
          };
          setCoverState(rollbackState);
          notifyCoverChange(targetUserId, rollbackState);
          console.error('❌ Position persistence failed');
          return false;
        }
      } catch (error) {
        console.error('❌ Position update error:', error);
        // Rollback on error
        const rollbackState = {
          ...coverState,
          isPositionChanging: false,
          isPositionSaving: false
        };
        setCoverState(rollbackState);
        notifyCoverChange(targetUserId, rollbackState);
        return false;
      }
    } else {
      // Just update position without persistence
      const tempState = {
        ...coverState,
        position: normalizedPosition,
        isPositionChanging: false,
        isPositionSaving: false
      };
      setCoverState(tempState);
      notifyCoverChange(targetUserId, tempState);
      return true;
    }
  }, [coverState, targetUserId, user?.id]);

  const updateCover = useCallback(async (file: File): Promise<string> => {
    if (!user?.id) {
      throw new Error('You must be logged in to upload a cover photo');
    }
    if (!targetUserId) {
      throw new Error('User must be authenticated');
    }

    try {
      console.log('📤 Uploading new cover...', { user: user?.id, targetUserId });

      // Emit upload start event for animation
      window.dispatchEvent(new CustomEvent('cover-upload-start'));

      // Set uploading state without changing the currently displayed image (no local preview)
      const optimisticState = { ...coverState, loading: true };
      setCoverState(optimisticState);
      notifyCoverChange(targetUserId, optimisticState);

      console.log('🔄 Starting Wasabi upload...');
      const { key } = await uploadService.upload(file, 'cover', targetUserId);
      console.log('✅ Wasabi upload complete:', key);

      // Resolve final URL now so we can persist both key and URL
      mediaService.clearCache(key);
      const finalUrl = await mediaService.getUrl(key);

      // Save to localStorage immediately for resilience (before persistence)
      try {
        const cacheData = { url: finalUrl, key, position: coverState.position, ts: Date.now() };
        localStorage.setItem(`cover:last:${user.id}`, JSON.stringify(cacheData));
        console.log('💾 Cover cached to localStorage before persistence');
      } catch (e) {
        console.warn('localStorage save failed:', e);
      }

      // Step 1: Ensure persistence via dedicated cover RPC
      const profilePersisted = await persistCoverToDatabase(user.id, key, coverState.position);
      
      // Prepare mirror payload for api schema
      const updatePayload = {
        cover_key: key,
        cover_photo_url: key,
        cover_image_url: key,
        updated_at: new Date().toISOString()
      };

      // Step 2: Verify persistence was successful
      console.log('📊 Cover persistence result:', { profilePersisted });
      if (!profilePersisted) {
        throw new Error('Failed to persist cover photo to database after all attempts');
      }

      // Notify UI of persistence success
      try { window.dispatchEvent(new CustomEvent('cover-persisted')); } catch {}

      // Step 3: Edge function handles all persistence - no manual mirroring needed
      console.log('✅ Cover persistence completed via edge function');

      // Save cover photo to user's photo collection
      try {
        console.log('💾 Saving cover photo to user_photos collection...');
        const photoResult = await userPhotosService.addPhoto(
          user.id,
          key,
          'cover',
          {
            photoUrl: finalUrl,
            originalFilename: file.name,
            fileSize: file.size,
            contentType: file.type,
            isCurrent: true
          }
        );
        if (photoResult) {
          console.log('✅ Cover photo saved to collection:', photoResult.id);
        } else {
          console.error('❌ Cover photo save returned null');
        }
      } catch (e) {
        console.error('❌ Failed to save cover photo to collection:', e);
      }

      // Step 4: Update local state and refresh
      const finalState: CoverState = {
        userId: targetUserId,
        key,
        resolvedUrl: finalUrl,
        position: coverState.position,
        loading: false,
        lastGoodUrl: finalUrl,
        isPositionChanging: false,
        isPositionSaving: false
      };
      setCoverState(finalState);
      try { localStorage.setItem(`cover:last:${user.id}`, JSON.stringify({ url: finalState.resolvedUrl, key: finalState.key, position: finalState.position, ts: Date.now() })); } catch {}
      notifyCoverChange(targetUserId, finalState);

      // Step 5: Background refresh to verify persistence
      setTimeout(() => loadCover(true), 100);

      console.log('✅ Cover updated successfully:', key);
      toast.success('Cover updated successfully');
      
      // Emit upload end event for animation
      window.dispatchEvent(new CustomEvent('cover-upload-end'));
      
      return key;
    } catch (error) {
      console.error('❌ Failed to update cover:', error);
      const errorState = { ...coverState, loading: false };
      setCoverState(errorState);
      notifyCoverChange(targetUserId, errorState);
      
      // Emit upload end event for animation
      window.dispatchEvent(new CustomEvent('cover-upload-end'));
      
      if (error instanceof Error) {
        toast.error(`Failed to update cover: ${error.message}`);
      } else {
        toast.error('Failed to update cover. Please try again.');
      }
      throw error;
    }
  }, [user, targetUserId, coverState]);

  return {
    key: coverState.key,
    resolvedUrl: coverState.resolvedUrl,
    position: coverState.position,
    loading: coverState.loading,
    lastGoodUrl: coverState.lastGoodUrl,
    isPositionChanging: coverState.isPositionChanging,
    isPositionSaving: coverState.isPositionSaving,
    updateCover,
    updatePosition,
    refresh: loadCover,
    preloadImage: mediaService.preloadImage,
    clearCache: mediaService.clearCache,
    loadCover
  };
};
