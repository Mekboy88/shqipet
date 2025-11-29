/**
 * useAvatar - New unified avatar management hook
 * Handles loading, uploading, and real-time sync
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { mediaService } from '@/services/media/MediaService';
import { uploadService } from '@/services/media/UploadService';
import { toast } from '@/utils/toastToNotification';
import { errorRecoveryService } from '@/utils/errorBoundary/ErrorRecoveryService';

interface AvatarState {
  key: string | null;
  resolvedUrl: string | null;
  loading: boolean; // fetching state
  uploading: boolean; // active while user is uploading a new avatar
  lastGoodUrl: string | null;
}

// Per-user avatar state store
 type Listener = (state: AvatarState) => void;
 const avatarStateByUser = new Map<string, AvatarState>();
 const listenersByUser = new Map<string, Set<Listener>>();
 
 const getOrInitState = (uid: string): AvatarState => {
   const existing = avatarStateByUser.get(uid);
   if (existing) return existing;
   const init: AvatarState = {
     key: null,
     resolvedUrl: null,
     loading: true,
     uploading: false,
     lastGoodUrl: null
   };
   avatarStateByUser.set(uid, init);
   return init;
 };
 
 const addListener = (uid: string, listener: Listener) => {
   const set = listenersByUser.get(uid) ?? new Set<Listener>();
   set.add(listener);
   listenersByUser.set(uid, set);
 };
 
 const removeListener = (uid: string, listener: Listener) => {
   const set = listenersByUser.get(uid);
   if (set) {
     set.delete(listener);
     if (set.size === 0) listenersByUser.delete(uid);
   }
 };
 
 const notifyAvatarChange = (uid: string, newState: AvatarState) => {
   avatarStateByUser.set(uid, newState);
   try {
     (window as any).__avatarDebugMap = {
       ...(window as any).__avatarDebugMap,
       [uid]: { state: newState, ts: Date.now() }
     };
   } catch {}
   const listeners = listenersByUser.get(uid);
   if (listeners) {
     listeners.forEach(listener => {
       try {
         listener(newState);
       } catch (error) {
         console.error('Error in avatar listener:', error);
       }
     });
   }
 };

export const useAvatar = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  
  // Initialize with cached state if available, otherwise use default
  const getCachedInitialState = (): AvatarState => {
    if (targetUserId) {
      // Check if we have cached data for immediate display
      try {
        const cached = localStorage.getItem(`avatar_cache_${targetUserId}`);
        if (cached) {
        const { key, url, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        if (age < 24 * 60 * 60 * 1000 && url && !String(url).includes('/functions/v1/wasabi-proxy')) {
          console.log('🚀 AvatarDebug/initial state from cache for user:', targetUserId);
          return {
            key,
            resolvedUrl: url,
            loading: false,
            uploading: false,
            lastGoodUrl: url
          };
        }
        }
      } catch (e) {
        console.warn('⚠️ Initial cache read failed:', e);
      }
      return getOrInitState(targetUserId);
    }
    return { key: null, resolvedUrl: null, loading: false, uploading: false, lastGoodUrl: null };
  };
  
  const [avatarState, setAvatarState] = useState<AvatarState>(getCachedInitialState);
  // Local notifier bound to current target user
  const notifyLocal = (newState: AvatarState) => {
    if (!targetUserId) return;
    notifyAvatarChange(targetUserId, newState);
  };

  // Subscribe to per-user changes - improved with debugging
  useEffect(() => {
    if (!targetUserId) {
      console.log('🧪 AvatarDebug/no targetUserId for subscription, auth state:', { 
        hasUser: !!user, 
        userLoading: user === undefined 
      });
      return;
    }
    
    console.log('🧪 AvatarDebug/subscribing to changes for user:', targetUserId);
    const handleStateChange = (newState: AvatarState) => {
      console.log('🔄 AvatarDebug/state changed for user:', targetUserId, newState);
      setAvatarState(newState);
    };
    addListener(targetUserId, handleStateChange);
    // Emit current state immediately
    const currentState = getOrInitState(targetUserId);
    setAvatarState(currentState);
    console.log('🚀 AvatarDebug/initial subscription state:', currentState);
    
    return () => {
      console.log('🧹 AvatarDebug/unsubscribing from user:', targetUserId);
      removeListener(targetUserId, handleStateChange);
    };
  }, [targetUserId, user]);

  // Load avatar when user changes - improved initialization handling
  useEffect(() => {
    if (!targetUserId) {
      console.log('🧪 AvatarDebug/no targetUserId yet - keeping previous avatar state, auth loading:', user === undefined);
      // Keep current avatar state during auth initialization to prevent disappearing on refresh
      return;
    }

    console.log('🧪 AvatarDebug/loading avatar for user:', targetUserId);
    loadAvatar();
  }, [targetUserId]);

  // Set up real-time subscription
  useEffect(() => {
    if (!targetUserId) return;

    const channel = supabase
      .channel(`profile-avatar-${targetUserId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          try {
            const row: any = (payload as any).new || (payload as any).old || {};
            const changedUserId = row.auth_user_id || row.user_id || row.id;
            if (changedUserId === targetUserId) {
              console.log('🔄 Avatar real-time update:', payload);
              // If we're in the middle of an upload preview, debounce the reload
              const uploading = getOrInitState(targetUserId).uploading;
              if (uploading) {
                setTimeout(() => {
                  // Only reload if still targeting same user
                  if (!getOrInitState(targetUserId).uploading) {
                    loadAvatar();
                  } else {
                    // One more delayed try after upload completes
                    setTimeout(() => loadAvatar(), 800);
                  }
                }, 800);
              } else {
                loadAvatar();
              }
            }
          } catch (e) {
            console.warn('Realtime handler error:', e);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [targetUserId]);

  // External debug event listeners (reload/print)
  useEffect(() => {
    const onReload = (ev: Event) => {
      const anyEv = ev as CustomEvent;
      const requestedUserId = anyEv.detail?.userId as string | undefined;
      if (!targetUserId) return;
      if (!requestedUserId || requestedUserId === targetUserId) {
        console.log('🧪 AvatarDebug/event: reload', { targetUserId, requestedUserId });
        loadAvatar();
      }
    };
    const onPrint = () => {
      console.log('🧪 AvatarDebug/print state', { targetUserId, state: getOrInitState(targetUserId!) });
    };
    window.addEventListener('avatar:reload', onReload as EventListener);
    window.addEventListener('avatar:printState', onPrint as EventListener);
    return () => {
      window.removeEventListener('avatar:reload', onReload as EventListener);
      window.removeEventListener('avatar:printState', onPrint as EventListener);
    };
  }, [targetUserId]);

  const loadAvatar = async () => {
    if (!targetUserId) {
      console.log('🧪 AvatarDebug/loadAvatar called without targetUserId');
      return;
    }

    try {
      console.log('🔄 Loading avatar for user:', targetUserId, 'current state:', {
        hasKey: !!avatarState.key,
        hasUrl: !!avatarState.resolvedUrl,
        loading: avatarState.loading,
        uploading: avatarState.uploading
      });
      
      // First check local cache - prioritize immediate display
      try {
        const cached = localStorage.getItem(`avatar_cache_${targetUserId}`);
        if (cached) {
          const { key, url, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;
          // Use cache if less than 24 hours old - show immediately, but avoid protected function URLs
          if (age < 24 * 60 * 60 * 1000 && url && !String(url).includes('/functions/v1/wasabi-proxy')) {
            const cachedState = {
              key,
              resolvedUrl: url,
              loading: false,
              uploading: avatarState.uploading, // Preserve upload state
              lastGoodUrl: url
            };
            console.log('✅ AvatarDebug/cache HIT - showing immediately', { 
              ageMs: age, 
              key, 
              urlStart: String(url).slice(0, 100) 
            });
            setAvatarState(cachedState);
            notifyLocal(cachedState);
            
            // Still verify in background but don't clear current display
            setTimeout(() => {
              if (!avatarState.uploading) {
                console.log('🔄 AvatarDebug/background verification after cache hit');
                // Continue with database check but don't clear current avatar
              }
            }, 100);
            return;
          } else {
            console.log('🧪 AvatarDebug/cache STALE', { ageMs: age });
          }
        } else {
          console.log('🧪 AvatarDebug/cache MISS - fetching from database');
        }
      } catch (e) {
        console.warn('⚠️ AvatarDebug/cache read failed:', e);
      }
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('avatar_key, avatar_url, profile_image_url')
        .or(`auth_user_id.eq.${targetUserId},id.eq.${targetUserId},user_id.eq.${targetUserId}`)
        .maybeSingle();

      console.log('🧪 AvatarDebug/profile row', profile);

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Failed to load profile:', error);
        return;
      }

      // Determine avatar source: prefer key, then legacy profile columns, then auth user metadata
      let candidate = (profile as any)?.avatar_key || (profile as any)?.avatar_url || (profile as any)?.profile_image_url;
      if (!candidate && user?.user_metadata?.avatar_url) {
        candidate = user.user_metadata.avatar_url;
        console.log('🧪 AvatarDebug/candidateFromAuth', candidate);
      }
      console.log('🧪 AvatarDebug/candidate', candidate, {
        hasUploadsPrefix: typeof candidate === 'string' && candidate.startsWith('uploads/'),
        looksLikeUrl: typeof candidate === 'string' && /^(https?:|blob:|data:)/.test(candidate)
      });

      // Normalize: if we got a temporary URL, try to derive a stable Wasabi key (uploads/... or covers/...)
      let effectiveCandidate: string = candidate as string;
      try {
        if (typeof candidate === 'string' && /^https?:/i.test(candidate)) {
          // Try common folders first
          let derivedKey: string | null = null;
          const m = candidate.match(/\/(uploads|covers|avatars)\/([^\?#\s]+)/i);
          if (m && m[1] && m[2]) {
            derivedKey = `${m[1]}/${decodeURIComponent(m[2])}`;
          } else {
            // Fallback: capture everything after bucket name (shqipet)
            const m2 = candidate.match(/\/shqipet\/([^\?#\s]+)/i);
            if (m2 && m2[1]) {
              derivedKey = decodeURIComponent(m2[1]);
            }
          }
          if (derivedKey) {
            console.log('🧪 AvatarDebug/derivedKeyFromUrl', { derivedKey });
            effectiveCandidate = derivedKey;
            // Persist key in background if missing
            if (!(profile as any)?.avatar_key) {
              void supabase.rpc('set_profile_media', {
                user_uuid: targetUserId,
                new_avatar_key: derivedKey
              }).then(
                ({ error }) => {
                  if (error) console.warn('⚠️ set_profile_media (background) failed:', error);
                  else console.log('✅ set_profile_media (background) persisted avatar_key');
                },
                (e) => console.warn('⚠️ set_profile_media (background) exception', e)
              );
            }
          } else {
            console.log('🧪 AvatarDebug/deriveKey FAILED for URL, will use direct URL', { candidateStart: candidate.slice(0, 120) });
          }
        }
      } catch (normErr) {
        console.warn('⚠️ AvatarDebug/normalize failed', normErr);
      }
      
      if (!effectiveCandidate) {
        console.log('🧪 AvatarDebug/no candidate found - keeping lastGoodUrl', avatarState.lastGoodUrl);
        // Do not clear current preview; keep whatever we have and just stop loading
        const noChangeState: AvatarState = {
          ...avatarState,
          key: avatarState.key,
          resolvedUrl: avatarState.resolvedUrl || getOrInitState(targetUserId).lastGoodUrl || avatarState.lastGoodUrl,
          loading: false,
          // Preserve uploading flag (optimistic preview)
          uploading: avatarState.uploading,
          lastGoodUrl: avatarState.lastGoodUrl || getOrInitState(targetUserId).lastGoodUrl
        };
        setAvatarState(noChangeState);
        notifyLocal(noChangeState);
        return;
      }

      // Don't reload if same key/url and we have a resolved URL
      if (effectiveCandidate === avatarState.key && avatarState.resolvedUrl) {
        if (avatarState.uploading) {
          const settled = { ...avatarState, uploading: false, loading: false };
          setAvatarState(settled);
          notifyLocal(settled);
        }
        return;
      }

      // Set loading state
      const currentKey = (profile as any)?.avatar_key || effectiveCandidate;
      const loadingState = { ...avatarState, key: currentKey, loading: true };
      setAvatarState(loadingState);
      notifyLocal(loadingState);

      // Resolve URL (support both keys and direct URLs)
      const isDirectUrl = typeof effectiveCandidate === 'string' && /^(https?:|blob:|data:)/.test(effectiveCandidate);
      console.log('🧪 AvatarDebug/isDirectUrl', isDirectUrl);
      let resolvedUrl: string;
      if (isDirectUrl) {
        resolvedUrl = effectiveCandidate as string;
      } else {
        resolvedUrl = await mediaService.getUrl(effectiveCandidate as string);
        console.log('🧪 AvatarDebug/preloading', resolvedUrl);
        // Preload to prevent flicker
        await mediaService.preloadImage(resolvedUrl);
      }

      const finalState = {
        key: currentKey,
        resolvedUrl,
        loading: false,
        uploading: false,
        lastGoodUrl: resolvedUrl
      };

      setAvatarState(finalState);
      notifyLocal(finalState);

      // Cache the result
      localStorage.setItem(`avatar_cache_${targetUserId}`, JSON.stringify({
        key: currentKey,
        url: resolvedUrl,
        timestamp: Date.now()
      }));

      console.log('✅ Avatar loaded:', { key: currentKey, resolvedUrl: resolvedUrl.substring(0, 100) + '...' });

    } catch (error) {
      console.error('❌ Failed to load avatar:', error);
      
      // Keep last good URL on error
      const errorState = {
        ...avatarState,
        loading: false,
        uploading: avatarState.uploading,
        resolvedUrl: avatarState.lastGoodUrl
      };
      
      setAvatarState(errorState);
      notifyLocal(errorState);
    }
  };

  const updateAvatar = useCallback(async (file: File): Promise<string> => {
    if (!user?.id) {
      throw new Error('You must be logged in to upload an avatar');
    }

    if (!targetUserId) {
      throw new Error('User must be authenticated');
    }

    try {
      console.log('📤 Uploading new avatar...', { user: user?.id, targetUserId });

      // Create local preview for instant feedback
      const previewUrl = URL.createObjectURL(file);

      // Set optimistic uploading state with local preview
      const optimisticState = { ...avatarState, uploading: true, resolvedUrl: previewUrl, lastGoodUrl: previewUrl };
      setAvatarState(optimisticState);
      notifyLocal(optimisticState);

      // Upload to Wasabi
      const { key } = await uploadService.upload(file, 'avatar');

      // Resolve final URL now for display and caching
      mediaService.clearCache(key);
      const finalUrl = await mediaService.getUrl(key);

      // Immediate UI update so loader disappears even if DB is slow
      const settledState = { 
        key,
        resolvedUrl: finalUrl,
        uploading: false,
        loading: false,
        lastGoodUrl: finalUrl
      };
      setAvatarState(settledState);
      notifyLocal(settledState);

      // Try secure RPC first to persist the key
      const { data: rpcOk, error: rpcError } = await supabase
        .rpc('set_profile_media', {
          user_uuid: user?.id,
          new_avatar_key: key
        });

      if (rpcError || rpcOk !== true) {
        console.warn('⚠️ RPC set_profile_media failed or returned false, falling back to direct update', {
          rpcOk,
          rpcError
        });
        // Fallback: try direct updates to profiles with multiple key columns
        let updated = false;
        let lastError: any = null;

        const tryUpdate = async (column: 'auth_user_id' | 'id' | 'user_id') => {
          const { data: upRow, error: upErr, count } = await supabase
            .from('profiles')
            .update({ 
              avatar_key: key,
              updated_at: new Date().toISOString() 
            }, { count: 'exact' as const })
            .eq(column, user!.id)
            .select('id');
          console.log(`🧪 profiles.update (${column}) result`, { upRow, upErr, count });
          if (!upErr && (count ?? (upRow ? 1 : 0)) > 0) {
            updated = true;
            return true;
          }
          lastError = upErr;
          return false;
        };

        await tryUpdate('auth_user_id') || await tryUpdate('id') || await tryUpdate('user_id');

        if (!updated) {
          console.error('❌ Direct profiles.update fallback failed on all columns', lastError);
          throw lastError || new Error('Update failed');
        }
        console.info('✅ Direct profiles.update fallback succeeded');
      } else {
        console.info('✅ RPC set_profile_media succeeded for avatar');
      }

      // Keep legacy fields in sync for compatibility with older components
      try {
        let legacyUpdated = false;
        const legacyPayload = { 
          avatar_url: finalUrl,
          profile_image_url: finalUrl,
          updated_at: new Date().toISOString()
        };
        const tryLegacyUpdate = async (column: 'auth_user_id' | 'id' | 'user_id') => {
          const { error: legacyErr, count } = await supabase
            .from('profiles')
            .update(legacyPayload, { count: 'exact' as const })
            .eq(column, user.id);
          console.log(`🧪 legacy avatar fields update via ${column}`, { legacyErr, count });
          if (!legacyErr && (count ?? 0) > 0) {
            legacyUpdated = true;
            return true;
          }
          return false;
        };

        await tryLegacyUpdate('auth_user_id') || await tryLegacyUpdate('id') || await tryLegacyUpdate('user_id');
        if (!legacyUpdated) console.warn('⚠️ Legacy avatar fields update failed on all columns');
      } catch (e) {
        console.warn('⚠️ Legacy avatar fields update exception:', e);
      }

      // Also update auth user metadata so legacy parts of the app reflect the new avatar globally
      try {
        const { data: authUpdate, error: authErr } = await supabase.auth.updateUser({
          data: { avatar_url: finalUrl }
        });
        if (authErr) {
          console.warn('⚠️ AvatarDebug/auth.updateUser failed', authErr);
        } else {
          console.log('✅ AvatarDebug/auth.updateUser succeeded');
        }
      } catch (e) {
        console.warn('⚠️ AvatarDebug/auth.updateUser exception', e);
      }

      // Cache the URL locally to prevent disappearing
      localStorage.setItem(`avatar_cache_${targetUserId}`, JSON.stringify({
        key,
        url: finalUrl,
        timestamp: Date.now()
      }));

      // Mark uploading complete with final URL
      const finalState = { 
        key,
        resolvedUrl: finalUrl,
        uploading: false, 
        loading: false,
        lastGoodUrl: finalUrl
      };
      setAvatarState(finalState);
      notifyLocal(finalState);

      console.log('✅ Avatar updated successfully:', key);
      toast.success('Avatar updated successfully');
      return key;

    } catch (error) {
      console.error('❌ Failed to update avatar:', error);
      
      // Reset uploading state on error
      const errorState = { ...avatarState, uploading: false, loading: false };
      setAvatarState(errorState);
      notifyLocal(errorState);
      
      // Show user-friendly error message
      if (error instanceof Error) {
        toast.error(`Failed to update avatar: ${error.message}`);
      } else {
        toast.error('Failed to update avatar. Please try again.');
      }
      
      throw error;
    }
  }, [user, targetUserId, avatarState]);

return {
    ...avatarState,
    updateAvatar,
    refresh: loadAvatar
  };
};
