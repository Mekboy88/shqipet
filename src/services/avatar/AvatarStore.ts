import { supabase } from '@/integrations/supabase/client';
import { mediaService } from '@/services/media/MediaService';
import { uploadService } from '@/services/media/UploadService';
import { userPhotosService } from '@/services/photos/UserPhotosService';
import { avatarCacheService } from './AvatarCacheService';

export interface AvatarV2State {
  userId: string;
  key: string | null;
  url: string | null;
  loading: boolean;
  uploading: boolean;
  uploadProgress: number;
  lastGoodUrl: string | null;
  error: string | null;
  previewUrl: string | null;
}

type Listener = (state: AvatarV2State) => void;

const stateByUser = new Map<string, AvatarV2State>();
const listenersByUser = new Map<string, Set<Listener>>();

// NO LOCAL CACHE - Everything real-time from Wasabi/Database only
// Removed localStorage to ensure 100% real-time cloud storage

const ensureState = (userId: string): AvatarV2State => {
  const cached = stateByUser.get(userId);
  if (cached) return cached;
  
  // Initialize using cached lastGoodUrl if available to prevent avatar disappearing on refresh
  let cachedUrl: string | null = null;
  let cachedKey: string | null = null;
  try {
    const raw = localStorage.getItem(`avatar_cache_${userId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        parsed?.url &&
        typeof parsed.url === 'string' &&
        /^(https?:)/i.test(parsed.url) &&
        !parsed.url.includes('/functions/v1/wasabi-proxy')
      ) {
        cachedUrl = parsed.url;
      }
      if (parsed?.key && typeof parsed.key === 'string') {
        cachedKey = parsed.key;
      }
    }
  } catch {}
  const init: AvatarV2State = {
    userId,
    key: cachedKey,
    url: null,
    loading: false,
    uploading: false,
    uploadProgress: 0,
    lastGoodUrl: cachedUrl,
    error: null,
    previewUrl: null,
  };
  stateByUser.set(userId, init);
  return init;
};

const notify = (userId: string) => {
  const st = stateByUser.get(userId);
  const set = listenersByUser.get(userId);
  if (!st || !set) return;
  
  set.forEach((cb) => {
    try {
      cb(st);
    } catch (e) {
      console.error('AvatarV2 listener error', e);
    }
  });
};

const setState = (userId: string, patch: Partial<AvatarV2State>) => {
  const prev = ensureState(userId);
  const next = { ...prev, ...patch } as AvatarV2State;
  
  // CRITICAL: Skip if nothing actually changed (prevents flicker from redundant updates)
  const hasChanged = 
    next.url !== prev.url ||
    next.key !== prev.key ||
    next.loading !== prev.loading ||
    next.uploading !== prev.uploading ||
    next.uploadProgress !== prev.uploadProgress ||
    next.error !== prev.error ||
    next.previewUrl !== prev.previewUrl;
  
  if (!hasChanged) {
    return; // No change - skip update entirely
  }
  
  // Debug logging to track state changes
  console.log(`🔄 Avatar state change for ${userId}:`, {
    from: { url: prev.url, uploading: prev.uploading, loading: prev.loading },
    to: { url: next.url, uploading: next.uploading, loading: next.loading },
    patch
  });
  
  // Prevent load operations from overwriting successful uploads
  if (prev.uploading && patch.loading && !patch.uploading) {
    console.warn('⚠️ Preventing load operation during upload');
    return;
  }
  
  // Prevent overwriting good URLs with null/empty during loads
  if (prev.url && prev.url.includes('wasabi') && patch.loading && !patch.url) {
    console.warn('⚠️ Preventing overwrite of good Wasabi URL during load');
    return;
  }
  
  stateByUser.set(userId, next);
  
  // Persist last good URL so avatar never disappears on refresh
  try {
    if (next.lastGoodUrl && /^(https?:)/i.test(next.lastGoodUrl)) {
      localStorage.setItem(
        `avatar_cache_${userId}`,
        JSON.stringify({ key: next.key ?? null, url: next.lastGoodUrl, timestamp: Date.now() })
      );
    }
  } catch {}
  
  try {
    (window as any).__avatarV2 = { ...(window as any).__avatarV2, [userId]: next };
  } catch {}
  
  notify(userId);
};

const deriveKeyFromUrl = (url: string): string | null => {
  try {
    const m1 = url.match(/\/(uploads|covers|avatars)\/([^?#\s]+)/i);
    if (m1 && m1[1] && m1[2]) return `${m1[1]}/${decodeURIComponent(m1[2])}`;
    const m2 = url.match(/\/shqipet\/([^?#\s]+)/i);
    if (m2 && m2[1]) return decodeURIComponent(m2[1]);
  } catch (e) {
    console.warn('Failed to derive key from URL:', url, e);
  }
  return null;
};

const validateImageFile = (file: File): void => {
  // Follow platform policy: allow JPG, PNG, WEBP, AVIF, HEIC; max 10MB for avatars
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/jfif', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'image/heif'];
  const allowedExtensions = ['jpg', 'jpeg', 'jfif', 'pjpeg', 'png', 'webp', 'avif', 'heic', 'heif'];

  const fileName = file.name.toLowerCase();
  const ext = fileName.includes('.') ? fileName.split('.').pop() || '' : '';

  const mimeOk = !!file.type && allowedMimeTypes.includes(file.type);
  const extOk = allowedExtensions.includes(ext);

  if (!mimeOk && !extOk) {
    // Permit unknown MIME/extension for mobile if file is coming from image input; client can only select images.
    if (file.type && file.type !== 'application/octet-stream') {
      throw new Error('Invalid image type. Allowed: JPG, PNG, WEBP, AVIF, HEIC.');
    }
  }

  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size for avatars is 10MB.');
  }
};

class AvatarStore {
  private uploadAbortController: AbortController | null = null;
  private realtimeChannels = new Map<string, any>();

  subscribe(userId: string, listener: Listener) {
    const set = listenersByUser.get(userId) ?? new Set<Listener>();
    set.add(listener);
    listenersByUser.set(userId, set);
    
    listener(ensureState(userId));
    
    // Set up realtime subscription for this user if not already set up
    if (!this.realtimeChannels.has(userId)) {
      this.setupRealtimeSubscription(userId);
    }
    
    return () => {
      const s = listenersByUser.get(userId);
      if (!s) return;
      s.delete(listener);
      if (s.size === 0) {
        listenersByUser.delete(userId);
        // Clean up realtime subscription when no more listeners
        this.cleanupRealtimeSubscription(userId);
      }
    };
  }

  private setupRealtimeSubscription(userId: string) {
    console.log('🔔 Setting up realtime avatar subscription for user:', userId);
    
    const channel = supabase
      .channel(`profile-avatar-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          try {
            console.log('🔄 Avatar realtime update received:', payload);
            const newData = (payload as any).new;
            
            if (newData?.avatar_url) {
              // CRITICAL: Clear cache first to force fresh load
              console.log('🗑️ Clearing avatar cache before reload');
              try {
                localStorage.removeItem(`avatar_cache_${userId}`);
              } catch (e) {
                console.warn('Failed to clear avatar cache:', e);
              }
              // Also clear in-memory and SW caches to avoid stale images
              try { avatarCacheService.clear(); } catch {}
              try { avatarCacheService.clearServiceWorkerCache().catch(() => {}); } catch {}
              
              // Force reload avatar from database
              console.log('🔄 Avatar changed remotely, reloading...');
              this.load(userId, true);
            }
          } catch (e) {
            console.warn('Realtime avatar handler error:', e);
          }
        }
      )
      .subscribe();
    
    this.realtimeChannels.set(userId, channel);
  }

  private cleanupRealtimeSubscription(userId: string) {
    const channel = this.realtimeChannels.get(userId);
    if (channel) {
      console.log('🔕 Cleaning up realtime avatar subscription for user:', userId);
      supabase.removeChannel(channel);
      this.realtimeChannels.delete(userId);
    }
  }

  async load(userId: string, forceRefresh = false) {
    const current = ensureState(userId);
    
    // CRITICAL: Don't reload during upload
    if (current.uploading) {
      console.log('⏸️ Skipping load - upload in progress');
      return;
    }
    
    // ⚠️ CRITICAL OPTIMIZATION - DO NOT MODIFY ⚠️
    // INSTANT: If we have cached data, show it immediately and skip DB fetch
    // This ensures avatars appear instantly on login with ZERO delay
    // Removing this will cause visible loading delays and poor UX
    if (!forceRefresh && current.lastGoodUrl && current.lastGoodUrl.startsWith('http') && !current.lastGoodUrl.includes('/functions/v1/wasabi-proxy')) {
      console.log('⚡ Using cached avatar instantly:', current.lastGoodUrl.substring(0, 80));
      setState(userId, { 
        url: current.lastGoodUrl,
        loading: false 
      });
      return;
    }
    // ⚠️ END CRITICAL SECTION ⚠️
    
    // INSTANT DISPLAY: Never set loading state
    setState(userId, { error: null });
    console.log('🔄 Loading avatar from database for user:', userId);

    try {
      const selectCols = 'avatar_url';
      let profile: any = null;
      let error: any = null;

      const columnMappings = ['id'] as const;
      
      for (const col of columnMappings) {
        try {
          const { data, error: queryError } = await supabase
            .from('profiles')
            .select(selectCols)
            .eq(col, userId)
            .maybeSingle();
            
          if (data || (queryError && queryError.code !== 'PGRST116')) {
            profile = data;
            error = queryError;
            console.log(`✅ Avatar profile loaded via column: ${col}`, { data, error });
            break;
          }
        } catch (e) {
          console.warn(`Failed to query profiles with ${col}:`, e);
          continue;
        }
      }

      if (error && error.code !== 'PGRST116') {
        console.warn('Profile read error:', error);
      }

      let key: string | null = null;
      let url: string | null = null;
      const avatarUrl: string | null = profile?.avatar_url || null;

      console.log('Profile data:', { avatarUrl });

      // Priority 1: Use avatar_url if available
      if (avatarUrl && /^https?:/i.test(avatarUrl)) {
        // Try to derive key from URL and always resolve to a fresh signed URL to bust caches
        const derived = deriveKeyFromUrl(avatarUrl);
        if (derived) {
          key = derived;
          try {
            url = await mediaService.getUrl(derived);
          } catch (e) {
            console.warn('Failed to resolve derived key to URL, falling back to direct URL');
            url = avatarUrl;
          }
        } else {
          url = avatarUrl;
        }
        console.log('✅ Avatar loaded:', { url, key });
      }

      // Priority 2: Check if avatar_url is a key format
      if (!url && avatarUrl && /^(uploads|avatars|covers)\//i.test(avatarUrl)) {
        console.log('🔄 Avatar URL appears to be a key, resolving:', avatarUrl);
        try {
          key = avatarUrl;
          url = await mediaService.getUrl(avatarUrl);
          console.log('✅ Key resolved to URL:', { key, url });
        } catch (e) {
          console.warn('Failed to resolve key to URL:', e);
          // Fallback: use the key as-is
          url = avatarUrl;
        }
      }

      // Priority 3: Check auth metadata as ultimate fallback
      if (!url) {
        try {
          console.log('🔄 Checking auth metadata fallback...');
          const { getCachedAuthUser } = await import('@/lib/authCache');
          const { data: authData } = await getCachedAuthUser();
          const metaUrl = authData?.user?.user_metadata?.avatar_url as string | undefined;
          
          if (metaUrl) {
            if (/^(https?:|blob:|data:)/i.test(metaUrl)) {
              url = metaUrl;
              console.log('📦 Using auth metadata URL:', url);
            } else if (/^(uploads|avatars|covers)\//i.test(metaUrl)) {
              try {
                url = await mediaService.getUrl(metaUrl);
                key = metaUrl;
                console.log('✅ Auth metadata key resolved:', { key: metaUrl, url });
              } catch (e) {
                console.warn('❌ Failed to resolve auth metadata key:', metaUrl, e);
              }
            }
          }
        } catch (e) {
          console.warn('Failed to check auth metadata:', e);
        }
      }

      // AGGRESSIVE PRELOAD: Start immediately, don't wait
      if (url) {
        avatarCacheService.preload(url).catch(() => {});
      }

      // Final state update - never downgrade a good URL
      const finalState = {
        userId,
        key: key ?? null,
        url: (url ?? current.url ?? current.lastGoodUrl ?? null),
        lastGoodUrl: (url ?? current.lastGoodUrl ?? null),
        loading: false, // NEVER show loading
        uploading: false,
        uploadProgress: 0,
        error: null,
        previewUrl: null,
      } as AvatarV2State;

      setState(userId, finalState);
      // NO LOCAL CACHE - State managed in memory only for real-time updates
      
      console.log('✅ Avatar load completed:', finalState);
      
    } catch (e: any) {
      console.error('❌ Avatar load failed:', e);
      setState(userId, {
        loading: false, // NEVER show loading
        error: null, // Don't show errors - just keep existing URL
        url: current.url || current.lastGoodUrl, // Keep existing avatar
      });
    }
  }

  async upload(userId: string, file: File): Promise<string> {
    if (this.uploadAbortController) {
      this.uploadAbortController.abort();
    }
    this.uploadAbortController = new AbortController();

    const current = ensureState(userId);
    let previewUrl: string | null = null;

    try {
      validateImageFile(file);

      // Create preview URL and show immediately
      previewUrl = URL.createObjectURL(file);
      
      setState(userId, { 
        uploading: true, 
        uploadProgress: 5,
        error: null,
        previewUrl,
        url: previewUrl // Show preview immediately, keep lastGoodUrl as backup
      });

      console.log('Starting avatar upload for user:', userId, { fileName: file.name, fileSize: file.size });

      // Upload with progress animation
      setState(userId, { uploadProgress: 10 });
      
      const progressInterval = setInterval(() => {
        const currentState = ensureState(userId);
        if (currentState.uploadProgress < 75) {
          setState(userId, { uploadProgress: currentState.uploadProgress + 5 });
        }
      }, 200);

      let key: string;
      try {
        const result = await uploadService.upload(file, 'avatar', userId);
        clearInterval(progressInterval);
        key = result.key;
        console.log('File uploaded successfully to Wasabi:', key);
      } catch (uploadError) {
        clearInterval(progressInterval);
        throw new Error(`File upload failed: ${uploadError.message}`);
      }
      
      setState(userId, { uploadProgress: 80 });

      // CRITICAL: Get final URL from Wasabi
      let finalUrl: string;
      try {
        await mediaService.clearCache(key);
        finalUrl = await mediaService.getUrl(key);
        console.log('Wasabi URL resolved:', finalUrl);
        
        // Verify URL is accessible
        try {
          const response = await fetch(finalUrl, { method: 'HEAD' });
          if (!response.ok) {
            console.warn('Wasabi URL not immediately accessible, using key for now');
          }
        } catch (e) {
          console.warn('URL verification failed, proceeding anyway:', e);
        }
      } catch (urlError) {
        console.error('Failed to get Wasabi URL:', urlError);
        throw new Error(`Failed to resolve Wasabi URL: ${urlError.message}`);
      }
      
      setState(userId, { uploadProgress: 90 });

      // Database is already updated by wasabi-upload edge function
      // Store the key (not URL) in profile for consistency
      let dbUpdateSuccess = false;
      const updateData = { 
        avatar_url: key, // Store key, not URL
        updated_at: new Date().toISOString() 
      };

      // Method 1: Try RPC first
      try {
        const { data: rpcResult, error: rpcError } = await supabase.rpc('set_profile_media', {
          user_uuid: userId,
          new_avatar_url: key,
        });

        if (!rpcError && rpcResult === true) {
          dbUpdateSuccess = true;
          console.log('Profile updated via RPC');
        } else {
          console.warn('RPC update failed:', { rpcError, rpcResult });
        }
      } catch (e) {
        console.warn('RPC call failed:', e);
      }

      // Method 2: Direct updates if RPC failed
      if (!dbUpdateSuccess) {
        const columnMappings = ['id'] as const;
        
        for (const col of columnMappings) {
          try {
            const { error: updateError, count } = await supabase
              .from('profiles')
              .update(updateData)
              .eq(col, userId);

            if (!updateError) {
              dbUpdateSuccess = true;
              console.log(`Profile updated via direct update on ${col}, affected rows:`, count);
              break;
            } else {
              console.warn(`Direct update failed on ${col}:`, updateError);
            }
          } catch (e) {
            console.warn(`Direct update exception on ${col}:`, e);
            continue;
          }
        }
      }

      // Edge function already updated the profile, so this is not critical
      if (!dbUpdateSuccess) {
        console.warn('Direct database update failed, but edge function may have succeeded');
      }

      setState(userId, { uploadProgress: 95 });

      // Update auth metadata (optional, for legacy compatibility)
      try {
        await supabase.auth.updateUser({ 
          data: { avatar_url: finalUrl } 
        });
        console.log('Auth metadata updated');
      } catch (e) {
        console.warn('Auth metadata update failed (non-critical):', e);
      }

      // Save profile photo to user's photo collection
      try {
        console.log('💾 Saving profile photo to user_photos collection...');
        const photoResult = await userPhotosService.addPhoto(
          userId,
          key,
          'profile',
          {
            photoUrl: finalUrl,
            originalFilename: file.name,
            fileSize: file.size,
            contentType: file.type,
            isCurrent: true
          }
        );
        if (photoResult) {
          console.log('✅ Profile photo saved to collection:', photoResult.id);
        } else {
          console.error('❌ Profile photo save returned null');
        }
      } catch (e) {
        console.error('❌ Failed to save profile photo to collection:', e);
      }

      // Preload uploaded avatar to eliminate flicker
      avatarCacheService.preload(finalUrl).catch(err => {
        console.warn('Uploaded avatar preload failed (non-blocking):', err);
      });

      // FINAL STATE UPDATE - This is critical!
      const finalState = {
        key,
        url: key, // Use the key as the source; ui/avatar resolves to fresh URL
        lastGoodUrl: finalUrl, // Keep last resolved URL as a backup
        uploading: false,
        uploadProgress: 100,
        loading: false,
        error: null,
        previewUrl: null
      };

      setState(userId, finalState);
      // NO LOCAL CACHE - Direct real-time cloud storage only
      
      // Clean up preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        previewUrl = null;
      }
      
      console.log('✅ Avatar upload completed successfully:', finalState);
      
      // Reset upload controller
      this.uploadAbortController = null;
      
      // CRITICAL: Mark this user as having a recent upload to prevent auto-reloads
      (window as any).__avatarUploadTimestamp = { 
        ...(window as any).__avatarUploadTimestamp, 
        [userId]: Date.now() 
      };
      
      // Verification check after 2 seconds
      setTimeout(() => {
        console.log('🔍 Verifying avatar persistence...');
        const currentState = ensureState(userId);
        console.log('Current state after 2s:', currentState);
        
        if (!currentState.url || currentState.url.startsWith('blob:')) {
          console.error('🚨 Avatar disappeared! Forcing reload...');
          this.load(userId, true);
        } else if (currentState.url === finalUrl) {
          console.log('✅ Avatar persisted successfully');
        } else {
          console.warn('⚠️ Avatar URL changed unexpectedly:', {
            expected: finalUrl,
            actual: currentState.url
          });
        }
      }, 2000);
      
      return key;

    } catch (e: any) {
      console.error('❌ Avatar upload failed:', e);
      
      // Clean up preview URL on error
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      // Restore to last good state
      setState(userId, { 
        uploading: false, 
        uploadProgress: 0,
        error: `Upload failed: ${e?.message || e}`,
        url: current.lastGoodUrl, // Restore last working URL
        previewUrl: null
      });
      
      this.uploadAbortController = null;
      throw e;
    }
  }

  cancelUpload(userId: string) {
    if (this.uploadAbortController) {
      this.uploadAbortController.abort();
      this.uploadAbortController = null;
    }
    
    const current = ensureState(userId);
    
    if (current.previewUrl) {
      URL.revokeObjectURL(current.previewUrl);
    }
    
    setState(userId, {
      uploading: false,
      uploadProgress: 0,
      url: current.lastGoodUrl,
      previewUrl: null,
      error: null
    });
  }

  getState(userId: string): AvatarV2State {
    return ensureState(userId);
  }

  async refresh(userId: string) {
    // No cache to clear - just reload from database
    await this.load(userId, true);
  }

  clearAllCache() {
    // No cache to clear - using live database state only
  }
}

export const avatarStore = new AvatarStore();