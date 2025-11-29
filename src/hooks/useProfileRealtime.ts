import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useProfileRealtime = (userId: string | undefined, onUpdate: () => void) => {
  useEffect(() => {
    if (!userId) return;

    console.log('🔄 [PROFILE REAL-TIME] Setting up profile realtime subscription for user:', userId);
    let backoff = 1000;
    let retryTimer: number | null = null;
    let channel = createChannel();

    function createChannel() {
      const newChannel = supabase
        .channel(`profile-realtime-${userId}`)
        .on(
          'postgres_changes',
          { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'profiles',
            filter: `id=eq.${userId}`
          },
          (payload) => {
            console.log('✏️ [PROFILE REAL-TIME] Profile updated:', payload);
            onUpdate();
          }
        )
        .on(
          'postgres_changes',
          { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'personal_introduction',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            console.log('✏️ [PROFILE REAL-TIME] Personal introduction updated:', payload);
            onUpdate();
          }
        )
        .on(
          'postgres_changes',
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'personal_introduction',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            console.log('🆕 [PROFILE REAL-TIME] Personal introduction created:', payload);
            onUpdate();
          }
        )
        .subscribe((status) => {
          console.log('🔌 [PROFILE REAL-TIME] Profile channel status:', status);
          if (status === 'SUBSCRIBED') {
            backoff = 1000;
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            if (retryTimer) window.clearTimeout(retryTimer);
            retryTimer = window.setTimeout(() => {
              try { supabase.removeChannel(newChannel); } catch {}
              channel = createChannel();
            }, backoff);
            backoff = Math.min(backoff * 2, 30000);
          }
        });

      return newChannel;
    }

    return () => {
      console.log('🧹 [PROFILE REAL-TIME] Cleaning up profile realtime subscription');
      if (retryTimer) window.clearTimeout(retryTimer);
      try { supabase.removeChannel(channel); } catch {}
    };
  }, [userId, onUpdate]);
};
