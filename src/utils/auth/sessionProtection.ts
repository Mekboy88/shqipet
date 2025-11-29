/**
 * Session Protection Service
 * Prevents automatic logouts and session invalidation
 * Ensures users stay logged in unless they explicitly log out
 */

import { supabase } from '@/integrations/supabase/client';

class SessionProtectionService {
  private static instance: SessionProtectionService;
  private sessionCheckInterval: NodeJS.Timeout | null = null;
  private lastSessionCheck: number = 0;
  private CHECK_INTERVAL = 60000; // Check every 60 seconds

  static getInstance(): SessionProtectionService {
    if (!SessionProtectionService.instance) {
      SessionProtectionService.instance = new SessionProtectionService();
    }
    return SessionProtectionService.instance;
  }

  /**
   * Start monitoring and protecting the session
   */
  startProtection(): void {
    if (this.sessionCheckInterval) {
      console.log('🛡️ Session protection already active');
      return;
    }

    console.log('🛡️ Session protection activated - monitoring session health');
    
    this.sessionCheckInterval = setInterval(async () => {
      await this.checkAndProtectSession();
    }, this.CHECK_INTERVAL);

    // Initial check
    this.checkAndProtectSession();
  }

  /**
   * Stop session protection
   */
  stopProtection(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
      console.log('🛡️ Session protection deactivated');
    }
  }

  /**
   * Check session health and refresh if needed
   */
  private async checkAndProtectSession(): Promise<void> {
    const now = Date.now();
    
    // Prevent too frequent checks
    if (now - this.lastSessionCheck < 30000) {
      return;
    }
    
    this.lastSessionCheck = now;

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.warn('⚠️ Session check error:', error.message);
        return;
      }

      if (!session) {
        console.log('ℹ️ No active session found');
        return;
      }

      // Check if token is about to expire (within 5 minutes)
      const expiresAt = session.expires_at;
      if (expiresAt) {
        const expiresIn = expiresAt - (now / 1000);
        
        if (expiresIn < 300) { // Less than 5 minutes
          console.log('🔄 Token expiring soon, refreshing session...');
          
          const { data, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            console.error('❌ Session refresh failed:', refreshError.message);
          } else if (data.session) {
            console.log('✅ Session refreshed successfully');
          }
        }
      }

      console.log('✅ Session healthy');
    } catch (error: any) {
      console.error('❌ Session protection error:', error?.message || error);
    }
  }

  /**
   * Force refresh the current session
   */
  async forceRefresh(): Promise<boolean> {
    try {
      console.log('🔄 Force refreshing session...');
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('❌ Force refresh failed:', error.message);
        return false;
      }

      if (data.session) {
        console.log('✅ Session force refreshed successfully');
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('❌ Force refresh error:', error?.message || error);
      return false;
    }
  }

  /**
   * Get current session status
   */
  async getSessionStatus(): Promise<{
    hasSession: boolean;
    expiresIn: number | null;
    isHealthy: boolean;
  }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return {
          hasSession: false,
          expiresIn: null,
          isHealthy: false
        };
      }

      const now = Date.now();
      const expiresAt = session.expires_at;
      const expiresIn = expiresAt ? (expiresAt - (now / 1000)) : null;
      
      return {
        hasSession: true,
        expiresIn,
        isHealthy: expiresIn ? expiresIn > 300 : false
      };
    } catch (error) {
      return {
        hasSession: false,
        expiresIn: null,
        isHealthy: false
      };
    }
  }
}

export const sessionProtection = SessionProtectionService.getInstance();
