import { supabase } from '@/integrations/supabase/client';
import { perTabSupabase } from '@/integrations/supabase/perTabClient';
import { deviceAuthService } from './deviceAuthService';
import { secureSessionManager } from '@/utils/security/secureSessionManager';

export interface TokenLifetimeConfig {
  role: string;
  isNewDevice: boolean;
  isDeviceTrusted: boolean;
  lifetimeMinutes: number;
  requiresMFA: boolean;
}

export interface SessionAnalytics {
  userId: string;
  sessionId: string;
  deviceFingerprint: string;
  ipAddress: string;
  userAgent: string;
  loginTimestamp: string;
  tokenLifetime: number;
  role: string;
  isNewDevice: boolean;
  mfaRequired: boolean;
  geoLocation?: string;
}

class DynamicTokenManager {
  private readonly TOKEN_LIFETIME_RULES = {
    super_admin: {
      new_device: 10, // 10 minutes
      known_device: 15 // 15 minutes
    },
    admin: {
      new_device: 15, // 15 minutes
      known_device: 30 // 30 minutes
    },
    moderator: {
      new_device: 20, // 20 minutes
      known_device: 30 // 30 minutes
    },
    user: {
      new_device: 20, // 20 minutes
      known_device: 30 // 30 minutes
    },
    guest: {
      new_device: 5, // 5 minutes
      known_device: 10 // 10 minutes max
    }
  };

  private readonly MFA_REQUIRED_ROLES = ['super_admin', 'admin'];
  private readonly NEW_DEVICE_MFA_THRESHOLD = 20; // minutes

  /**
   * Calculate dynamic token lifetime based on user role and device status
   */
  async calculateTokenLifetime(userId: string, userRole: string): Promise<TokenLifetimeConfig> {
    try {
      // Check if this is a new device
      const isNewDevice = await deviceAuthService.isNewDevice(userId);
      
      // Check if device is trusted
      const isDeviceTrusted = await deviceAuthService.checkDeviceTrust(userId);
      
      // Normalize role to lowercase
      const normalizedRole = userRole.toLowerCase();
      
      // Get lifetime rules for this role
      const roleRules = this.TOKEN_LIFETIME_RULES[normalizedRole as keyof typeof this.TOKEN_LIFETIME_RULES] 
        || this.TOKEN_LIFETIME_RULES.user;
      
      // Calculate lifetime based on device status
      const lifetimeMinutes = isNewDevice || !isDeviceTrusted 
        ? roleRules.new_device 
        : roleRules.known_device;
      
      // Determine if MFA is required
      const requiresMFA = this.MFA_REQUIRED_ROLES.includes(normalizedRole) || 
        (isNewDevice && lifetimeMinutes >= this.NEW_DEVICE_MFA_THRESHOLD);

      const config: TokenLifetimeConfig = {
        role: normalizedRole,
        isNewDevice,
        isDeviceTrusted,
        lifetimeMinutes,
        requiresMFA
      };

      // Log the token lifetime decision
      await this.logTokenLifetimeDecision(userId, config);

      return config;
    } catch (error) {
      console.error('Error calculating token lifetime:', error);
      
      // Fallback to most restrictive settings
      return {
        role: 'user',
        isNewDevice: true,
        isDeviceTrusted: false,
        lifetimeMinutes: 10,
        requiresMFA: true
      };
    }
  }

  /**
   * Apply dynamic token lifetime to current session
   */
  async applyDynamicTokenLifetime(userId: string): Promise<boolean> {
    try {
      // Get user role
      const { data: roleData } = await supabase.rpc('get_current_user_role');
      const userRole = roleData || 'user';

      // Calculate token lifetime
      const config = await this.calculateTokenLifetime(userId, userRole);

      // Log session analytics
      await this.logSessionAnalytics(userId, config);

      // If new device and requires MFA, trigger MFA flow
      if (config.requiresMFA && config.isNewDevice) {
        await this.triggerMFAForNewDevice(userId);
      }

      // Create refresh schedule based on calculated lifetime
      this.scheduleTokenRefresh(config.lifetimeMinutes);

      // Update session metadata
      await this.updateSessionMetadata(userId, config);

      console.log(`🔐 Dynamic token lifetime applied: ${config.lifetimeMinutes} minutes for ${config.role} on ${config.isNewDevice ? 'new' : 'known'} device`);
      
      return true;
    } catch (error) {
      console.error('Error applying dynamic token lifetime:', error);
      return false;
    }
  }

  /**
   * Schedule automatic token refresh based on calculated lifetime
   */
  private scheduleTokenRefresh(lifetimeMinutes: number): void {
    // Clear any existing refresh timer
    if ((window as any).tokenRefreshTimer) {
      clearTimeout((window as any).tokenRefreshTimer);
    }

    // Schedule refresh 2 minutes before expiry
    const refreshTime = Math.max(1, lifetimeMinutes - 2) * 60 * 1000; // Convert to milliseconds

    (window as any).tokenRefreshTimer = setTimeout(async () => {
      try {
        console.log('🔄 Auto-refreshing token due to dynamic lifetime');
        const { error } = await perTabSupabase.auth.refreshSession();
        
        if (error) {
          console.error('Token refresh failed:', error);
          // Force logout on refresh failure (tab-only)
          await perTabSupabase.auth.signOut({ scope: 'local' });
        } else {
          console.log('✅ Token refreshed successfully');
        }
      } catch (error) {
        console.error('Error during token refresh:', error);
      }
    }, refreshTime);
  }

  /**
   * Log token lifetime decision for analytics
   */
  private async logTokenLifetimeDecision(userId: string, config: TokenLifetimeConfig): Promise<void> {
    try {
      await supabase.from('security_events').insert({
        user_id: userId,
        event_type: 'dynamic_token_lifetime_applied',
        event_description: `Token lifetime set to ${config.lifetimeMinutes} minutes for ${config.role} on ${config.isNewDevice ? 'new' : 'trusted'} device`,
        metadata: {
          role: config.role,
          lifetime_minutes: config.lifetimeMinutes,
          is_new_device: config.isNewDevice,
          is_device_trusted: config.isDeviceTrusted,
          requires_mfa: config.requiresMFA,
          device_fingerprint: deviceAuthService.generateDeviceFingerprint(),
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        },
        risk_level: config.isNewDevice ? 'medium' : 'low'
      });
    } catch (error) {
      console.warn('Could not log token lifetime decision:', error);
    }
  }

  /**
   * Log comprehensive session analytics
   */
  private async logSessionAnalytics(userId: string, config: TokenLifetimeConfig): Promise<void> {
    try {
      const analytics: SessionAnalytics = {
        userId,
        sessionId: secureSessionManager.getCurrentSessionId() || 'unknown',
        deviceFingerprint: deviceAuthService.generateDeviceFingerprint(),
        ipAddress: await this.getClientIP(),
        userAgent: navigator.userAgent,
        loginTimestamp: new Date().toISOString(),
        tokenLifetime: config.lifetimeMinutes,
        role: config.role,
        isNewDevice: config.isNewDevice,
        mfaRequired: config.requiresMFA,
        geoLocation: await this.getGeoLocation()
      };

      // Store in session_analytics table
      await supabase.rpc('log_session_analytics', {
        p_session_id: analytics.sessionId,
        p_device_fingerprint: analytics.deviceFingerprint,
        p_token_lifetime_minutes: config.lifetimeMinutes,
        p_is_new_device: config.isNewDevice,
        p_mfa_required: config.requiresMFA,
        p_ip_address: analytics.ipAddress,
        p_user_agent: analytics.userAgent
      });

      console.log('📊 Session analytics logged successfully');
    } catch (error) {
      console.warn('Could not log session analytics:', error);
    }
  }

  /**
   * Update session metadata with token lifetime info
   */
  private async updateSessionMetadata(userId: string, config: TokenLifetimeConfig): Promise<void> {
    try {
      const fingerprint = deviceAuthService.generateDeviceFingerprint();
      
      await supabase.from('user_sessions').update({
        last_activity: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('device_fingerprint', fingerprint);
    } catch (error) {
      console.warn('Could not update session metadata:', error);
    }
  }

  /**
   * Trigger MFA requirement for new devices
   */
  private async triggerMFAForNewDevice(userId: string): Promise<void> {
    try {
      // Log MFA requirement
      await supabase.from('security_events').insert({
        user_id: userId,
        event_type: 'mfa_required_new_device',
        event_description: 'MFA required due to login from unrecognized device',
        metadata: {
          device_fingerprint: deviceAuthService.generateDeviceFingerprint(),
          trigger_reason: 'new_device_detection',
          timestamp: new Date().toISOString()
        },
        risk_level: 'high'
      });

      // Set flag for MFA requirement (this would be used by the UI)
      localStorage.setItem('shqipet_mfa_required', 'true');
      localStorage.setItem('shqipet_mfa_reason', 'new_device');

      console.log('🔐 MFA required for new device login');
    } catch (error) {
      console.warn('Could not trigger MFA requirement:', error);
    }
  }

  /**
   * Mark device as trusted after successful MFA
   */
  async markDeviceAsTrusted(userId: string): Promise<boolean> {
    try {
      const success = await deviceAuthService.trustCurrentDevice(userId);
      
      if (success) {
        // Clear MFA requirement flags
        localStorage.removeItem('shqipet_mfa_required');
        localStorage.removeItem('shqipet_mfa_reason');
        
      // Mark device as trusted using RPC function
      await supabase.rpc('update_device_trust_status', {
        p_device_fingerprint: deviceAuthService.generateDeviceFingerprint(),
        p_action: 'trusted',
        p_reason: 'MFA verification completed successfully',
        p_verification_method: 'mfa'
      });

        console.log('✅ Device marked as trusted');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error marking device as trusted:', error);
      return false;
    }
  }

  /**
   * Get analytics for token lifetime decisions
   */
  async getTokenLifetimeAnalytics(userId?: string): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('get_token_lifetime_analytics', {
        target_user_id: userId || null
      });
      
      if (error) throw error;

      // Process analytics data - data is already structured from the function
      return data?.[0] || {
        totalSessions: 0,
        avgTokenLifetime: 0,
        newDevicePercentage: 0,
        roleDistribution: {},
        mfaRequiredPercentage: 0
      };
    } catch (error) {
      console.error('Error getting token lifetime analytics:', error);
      return null;
    }
  }

  /**
   * Get client IP address
   */
  private async getClientIP(): Promise<string> {
    try {
      // This is a placeholder - in production you'd use a proper IP detection service
      return 'unknown';
    } catch {
      return 'unknown';
    }
  }

  /**
   * Get approximate geo location
   */
  private async getGeoLocation(): Promise<string> {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return timezone;
    } catch {
      return 'unknown';
    }
  }

  /**
   * Clean up token refresh timers
   */
  cleanup(): void {
    if ((window as any).tokenRefreshTimer) {
      clearTimeout((window as any).tokenRefreshTimer);
      (window as any).tokenRefreshTimer = null;
    }
  }
}

export const dynamicTokenManager = new DynamicTokenManager();