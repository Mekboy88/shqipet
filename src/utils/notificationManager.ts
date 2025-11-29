import { supabase } from '@/integrations/supabase/client';

export interface NotificationPermissionManager {
  requestPermission: () => Promise<NotificationPermission>;
  hasPermission: () => boolean;
  showNotification: (title: string, options?: NotificationOptions) => void;
  playSound: (soundType?: 'default' | 'alert' | 'success' | 'warning' | 'music') => Promise<void>;
}

class NotificationManager implements NotificationPermissionManager {
  private static instance: NotificationManager;
  private audioContext: AudioContext | null = null;
  private customSoundUrl: string | null = null;

  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  public hasPermission(): boolean {
    return 'Notification' in window && Notification.permission === 'granted';
  }

  public showNotification(title: string, options?: NotificationOptions): void {
    if (!this.hasPermission()) {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  public async playSound(soundType: 'default' | 'alert' | 'success' | 'warning' | 'music' = 'default'): Promise<void> {
    try {
      // Only play sounds that are selected in Notification Settings (owner-provided)
      if (!this.customSoundUrl) {
        console.warn('No active notification sound selected in Notification Settings.');
        return;
      }
      const audio = new Audio(this.customSoundUrl);
      audio.volume = 0.9;
      await audio.play();
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }

  private async loadActiveSound() {
    try {
      const { getCachedAuthUserId } = await import('@/lib/authCache');
      const uid = await getCachedAuthUserId();
      if (!uid) {
        this.customSoundUrl = null;
        return;
      }
      const { data, error } = await supabase
        .from('notification_sounds')
        .select('file_path, is_active')
        .eq('user_id', uid)
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();
      if (error) {
        console.warn('Failed to load active notification sound:', error.message);
        this.customSoundUrl = null;
        return;
      }
      if (data?.file_path) {
        const { data: signed } = await supabase.storage
          .from('notification-sounds')
          .createSignedUrl(data.file_path, 3600);
        this.customSoundUrl = signed?.signedUrl || null;
      } else {
        this.customSoundUrl = null;
      }
    } catch (e) {
      console.warn('Error loading active notification sound', e);
      this.customSoundUrl = null;
    }
  }

  private addPlaybackUnlock() {
    const handler = async () => {
      try {
        await this.loadActiveSound();
        if (!this.customSoundUrl) return;
        const audio = new Audio(this.customSoundUrl);
        audio.volume = 0.0001;
        await audio.play().catch(() => {});
        setTimeout(() => {
          try {
            audio.pause();
            audio.currentTime = 0;
          } catch {}
        }, 50);
      } catch {}
    };
    window.addEventListener('click', handler, { once: true, capture: true } as any);
    window.addEventListener('touchstart', handler, { once: true, capture: true } as any);
  }

  public async initializeNotifications(): Promise<void> {
    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      console.warn('⚠️ Notification permissions denied or not supported');
    }

    // Preload user's active custom sound (if any) and keep it in sync
    await this.loadActiveSound();
    this.addPlaybackUnlock();
    try {
      const { getCachedAuthUserId } = await import('@/lib/authCache');
      const uid = await getCachedAuthUserId();
      if (!uid) return;
      supabase
        .channel(`notification-sounds-active-${uid}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notification_sounds', filter: `user_id=eq.${uid}` }, async () => {
          await this.loadActiveSound();
        })
        .subscribe();
    } catch {}
  }
}

export const notificationManager = NotificationManager.getInstance();