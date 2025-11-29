/**
 * GlobalAvatarBootstrap - Ensures avatar system is initialized globally
 */

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { avatarStore } from '@/services/avatar/AvatarStore';
import { avatarCacheService } from '@/services/avatar/AvatarCacheService';

const GlobalAvatarBootstrap = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      console.log('⚡ GlobalAvatarBootstrap: Instant display for user', user.id);
      // INSTANT: Use cached avatar immediately, no database fetch
      const state = avatarStore.getState(user.id);
      if (state.lastGoodUrl) {
        console.log('⚡ Showing cached avatar instantly');
      }
      // Load in background without blocking
      avatarStore.load(user.id, false).catch(() => {});
    }
  }, [user?.id]);

  // Listen for visibility changes to optionally refresh stale avatars (throttled)
  useEffect(() => {
    const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

    const handleVisibilityChange = () => {
      if (document.hidden || !user?.id) return;

      const lastMap = ((window as any).__avatarLastVisibleRefresh ||= {});
      const last = lastMap[user.id] || 0;
      const recentUpload = (window as any).__avatarUploadTimestamp?.[user.id] || 0;

      // Skip if refreshed recently or right after an upload
      if (Date.now() - last < REFRESH_INTERVAL_MS) return;
      if (Date.now() - recentUpload < 60 * 1000) return;

      console.log('🔄 GlobalAvatarBootstrap: Page visible, refreshing avatar (throttled)');
      lastMap[user.id] = Date.now();
      avatarStore.load(user.id);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user?.id]);

  // Setup global debug commands
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__avatarV2 = {
        reload: (userId?: string) => {
          const targetId = userId || user?.id;
          if (targetId) {
            console.log('🔄 Manual avatar reload for:', targetId);
            avatarStore.load(targetId, true);
          }
        },
        print: (userId?: string) => {
          const targetId = userId || user?.id;
          if (targetId) {
            const state = avatarStore.getState(targetId);
            console.log('📊 Avatar state for:', targetId, state);
          }
        },
        clearCache: () => {
          console.log('🗑️ Clearing all avatar caches...');
          avatarStore.clearAllCache();
          avatarCacheService.clear();
          avatarCacheService.clearServiceWorkerCache();
          const keys = Object.keys(localStorage).filter(k => k.startsWith('avatar_cache_'));
          keys.forEach(k => localStorage.removeItem(k));
          console.log('✅ All avatar caches cleared');
        },
        preload: (url: string) => {
          console.log('🎯 Manual preload:', url);
          return avatarCacheService.preload(url);
        },
        cache: avatarCacheService
      };
    }
  }, [user?.id]);

  return null; // This is a bootstrap component, renders nothing
};

export default GlobalAvatarBootstrap;