import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Global hook to manage "show cover controls" preference
 * - Loads instantly from localStorage (no flicker)
 * - Syncs with backend if user is logged in
 * - Broadcasts changes via CustomEvent and BroadcastChannel
 * - Optimistic updates (doesn't revert on backend failure)
 */
export function useCoverControlsPreference() {
  const { user } = useAuth();
  const [value, setValue] = useState<boolean>(true);
  const storageKey = user?.id ? `profile:showCoverControls:${user.id}` : null;

  // Load from localStorage immediately (no flicker)
  useEffect(() => {
    if (!storageKey) return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        setValue(stored === '1' || stored === 'true');
      }
    } catch {}
  }, [storageKey]);

  // Sync with backend once on mount (if logged in)
  useEffect(() => {
    if (!user?.id) return;

    const syncFromBackend = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('show_cover_controls')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        const backendValue = data.show_cover_controls ?? true;
        setValue(backendValue);
        if (storageKey) {
          try {
            localStorage.setItem(storageKey, backendValue ? '1' : '0');
          } catch {}
        }
      }
    };

    syncFromBackend();
  }, [user?.id, storageKey]);

  // Listen for changes from other components/tabs
  useEffect(() => {
    if (!storageKey) return;

    const handleCustomEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.value === 'boolean') {
        setValue(detail.value);
      }
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue !== null) {
        setValue(e.newValue === '1' || e.newValue === 'true');
      }
    };

    const bc = new BroadcastChannel('cover-controls');
    const handleBroadcast = (e: MessageEvent) => {
      if (typeof e.data?.value === 'boolean' && e.data?.userId === user?.id) {
        setValue(e.data.value);
      }
    };

    window.addEventListener('cover-controls-changed', handleCustomEvent as EventListener);
    window.addEventListener('storage', handleStorageEvent);
    bc.addEventListener('message', handleBroadcast);

    return () => {
      window.removeEventListener('cover-controls-changed', handleCustomEvent as EventListener);
      window.removeEventListener('storage', handleStorageEvent);
      bc.removeEventListener('message', handleBroadcast);
      bc.close();
    };
  }, [storageKey, user?.id]);

  // Optimistic setter: update immediately, sync to backend in background
  const updateValue = useCallback(
    (newValue: boolean) => {
      // 1. Update state immediately (optimistic)
      setValue(newValue);

      // 2. Update localStorage
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, newValue ? '1' : '0');
        } catch {}
      }

      // 3. Broadcast to other components/tabs
      try {
        window.dispatchEvent(
          new CustomEvent('cover-controls-changed', {
            detail: { value: newValue, userId: user?.id || null },
          })
        );
      } catch {}

      try {
        const bc = new BroadcastChannel('cover-controls');
        bc.postMessage({ value: newValue, userId: user?.id || null });
        bc.close();
      } catch {}

      // 4. Persist to backend in background (do not revert on failure)
      if (user?.id) {
        queueMicrotask(async () => {
          const { error } = await supabase
            .from('profiles')
            .update({ show_cover_controls: newValue })
            .eq('id', user.id);

          if (error) {
            console.error('Failed to sync cover controls preference:', error);
            // Do not revert UI
          }
        });
      }
    },
    [storageKey, user?.id]
  );

  return { value, setValue: updateValue };
}
