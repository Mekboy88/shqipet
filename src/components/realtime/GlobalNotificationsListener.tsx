import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { notificationManager } from '@/utils/notificationManager';

// Maps DB notification_type to sound types
const mapTypeToSound = (type?: string): 'alert' | 'warning' | 'success' | 'music' | 'default' => {
  if (!type) return 'default';
  const t = type.toLowerCase();
  if (t.includes('critical') || t.includes('alert') || t.includes('security')) return 'alert';
  if (t.includes('warning')) return 'warning';
  if (t.includes('success')) return 'success';
  if (t.includes('music') || t.includes('audio') || t.includes('song') || t.includes('track')) return 'music';
  return 'default';
};

export const GlobalNotificationsListener = () => {
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let channelAdmin: ReturnType<typeof supabase.channel> | null = null;
    let mounted = true;

    const init = async () => {
      await notificationManager.initializeNotifications();

      const { getCachedAuthUserId } = await import('@/lib/authCache');
      const uid = await getCachedAuthUserId();
      if (!uid || !mounted) return;

      // General user notifications
      channel = supabase
        .channel(`global_notifications_${uid}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${uid}` }, (payload) => {
          const n: any = payload.new;
          // Sound selection handled via Notification Settings
          const title = n?.title || 'New notification';
          const message = n?.description || n?.message || '';

          
          notificationManager.showNotification(title, { body: message, tag: 'user-notification' });
          notificationManager.playSound();
        })
        .subscribe();

      // Admin notifications - listen to ALL admin notifications, not just user-specific
      channelAdmin = supabase
        .channel(`global_admin_notifications_${uid}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'admin_notifications' }, (payload) => {
          const n: any = payload.new;
          const sound = mapTypeToSound(n?.notification_type);
          const title = n?.title || 'Admin notification';
          const message = n?.message || '';

          console.log('🔔 Admin notification received:', {
            title,
            message,
            notification_type: n?.notification_type,
            sound,
            user_id: n?.user_id,
            fullPayload: n
          });
          
          notificationManager.showNotification(title, { body: message, tag: 'admin-notification', requireInteraction: sound === 'alert' });
          notificationManager.playSound();
        })
        .subscribe();
    };

    init();

    return () => {
      mounted = false;
      if (channel) supabase.removeChannel(channel);
      if (channelAdmin) supabase.removeChannel(channelAdmin);
    };
  }, []);

  return null;
};

export default GlobalNotificationsListener;
