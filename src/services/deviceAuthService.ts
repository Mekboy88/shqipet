import { supabase } from '@/integrations/supabase/client';

export interface TrustedDevice {
  id: string;
  user_id: string;
  device_fingerprint: string;
  device_name: string;
  device_type: string;
  is_trusted: boolean;
  last_activity: string;
  created_at: string;
}

export interface DeviceAuthState {
  isDeviceTrusted: boolean;
  deviceId: string | null;
  lastLogin: string | null;
  autoLoginEnabled: boolean;
  refreshToken?: string;
  accessToken?: string;
}

class DeviceAuthService {
  private readonly STORAGE_KEY = 'shqipet_device_auth';
  private readonly TRUST_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Get device fingerprint
  generateDeviceFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('Device fingerprint', 10, 10);
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
      canvas: canvas.toDataURL(),
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as any).deviceMemory || 0,
    };

    // Simple hash function
    let hash = 0;
    const str = JSON.stringify(fingerprint);
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  // Save device auth state
  saveDeviceAuthState(state: DeviceAuthState): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
      ...state,
      timestamp: Date.now()
    }));
  }

  // Get device auth state
  getDeviceAuthState(): DeviceAuthState | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const data = JSON.parse(stored);
      const now = Date.now();
      
      // Check if trust has expired (24 hours)
      if (data.timestamp && (now - data.timestamp) > this.TRUST_DURATION) {
        this.clearDeviceAuthState();
        return null;
      }

      return {
        isDeviceTrusted: data.isDeviceTrusted || false,
        deviceId: data.deviceId || null,
        lastLogin: data.lastLogin || null,
        autoLoginEnabled: data.autoLoginEnabled || false,
        refreshToken: data.refreshToken,
        accessToken: data.accessToken
      };
    } catch {
      return null;
    }
  }

  // Clear device auth state
  clearDeviceAuthState(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Check if device is trusted in database
  async checkDeviceTrust(userId: string): Promise<boolean> {
    try {
      const fingerprint = this.generateDeviceFingerprint();
      
      const { data, error } = await supabase
        .from('user_sessions')
        .select('is_trusted, last_activity')
        .eq('user_id', userId)
        .eq('device_fingerprint', fingerprint)
        .eq('is_active', true)
        .single();

      if (error || !data) return false;

      // Check if last activity was within 24 hours
      const lastActivity = new Date(data.last_activity);
      const now = new Date();
      const hoursDiff = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

      return data.is_trusted && hoursDiff <= 24;
    } catch {
      return false;
    }
  }

  // Trust current device and store session tokens
  async trustCurrentDevice(userId: string): Promise<boolean> {
    try {
      const fingerprint = this.generateDeviceFingerprint();
      
      // Get current session for tokens
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase
        .from('user_sessions')
        .update({ 
          is_trusted: true,
          last_activity: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('device_fingerprint', fingerprint);

      if (!error && session) {
        // Save to local storage with session tokens
        this.saveDeviceAuthState({
          isDeviceTrusted: true,
          deviceId: fingerprint,
          lastLogin: new Date().toISOString(),
          autoLoginEnabled: true,
          refreshToken: session.refresh_token,
          accessToken: session.access_token
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Perform auto-login using stored refresh token
  async attemptAutoLogin(): Promise<{ success: boolean; user?: any }> {
    try {
      const deviceState = this.getDeviceAuthState();
      if (!deviceState?.autoLoginEnabled || !deviceState.refreshToken) {
        return { success: false };
      }

      // Try to restore session using refresh token
      const { data, error } = await supabase.auth.setSession({
        access_token: deviceState.accessToken || '',
        refresh_token: deviceState.refreshToken
      });

      if (error || !data.session) {
        // If refresh fails, clear stored auth data
        this.clearDeviceAuthState();
        return { success: false };
      }

      // Update stored tokens with new ones
      this.saveDeviceAuthState({
        ...deviceState,
        refreshToken: data.session.refresh_token,
        accessToken: data.session.access_token,
        lastLogin: new Date().toISOString()
      });

      return { success: true, user: data.session.user };
    } catch {
      return { success: false };
    }
  }

  // Check if this is a new device
  async isNewDevice(userId: string): Promise<boolean> {
    try {
      const fingerprint = this.generateDeviceFingerprint();
      
      const { data, error } = await supabase
        .from('user_sessions')
        .select('id')
        .eq('user_id', userId)
        .eq('device_fingerprint', fingerprint)
        .eq('is_active', true)
        .single();

      return error?.code === 'PGRST116'; // No rows returned
    } catch {
      return true;
    }
  }
}

export const deviceAuthService = new DeviceAuthService();