import { perTabSupabase } from '@/integrations/supabase/perTabClient';
import { deviceAuthService } from '@/services/deviceAuthService';

class ImmediateLogoutService {
  private static instance: ImmediateLogoutService;
  private logoutInProgress = false;

  static getInstance(): ImmediateLogoutService {
    if (!ImmediateLogoutService.instance) {
      ImmediateLogoutService.instance = new ImmediateLogoutService();
    }
    return ImmediateLogoutService.instance;
  }

  // Tab-only logout - only logs out current tab, keeps other tabs logged in
  async performTabOnlyLogout(): Promise<void> {
    if (this.logoutInProgress) {
      console.log('⏳ Logout already in progress, skipping...');
      return;
    }

    this.logoutInProgress = true;
    console.log('🚪 Starting TAB-ONLY logout - only this tab will be logged out');
    
    try {
      // Clear device auth state immediately
      deviceAuthService.clearDeviceAuthState();
      console.log('✅ Device auth state cleared');
      
      // Sign out from Supabase (this will trigger the auth state change)
      const { error } = await perTabSupabase.auth.signOut({ scope: 'local' });
      if (error) {
        console.error('❌ Supabase signOut error:', error);
      } else {
        console.log('✅ Supabase session cleared');
      }
      
      // CRITICAL: Only clear sessionStorage (tab-specific)
      // Do NOT clear localStorage so other tabs remain logged in
      sessionStorage.clear();
      console.log('✅ Session storage cleared (tab-only)');
      
      console.log('✅ TAB-ONLY logout completed - other tabs remain logged in');
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      this.logoutInProgress = false;
    }
  }

  // Device-wide logout - logs out ALL tabs and clears all auth data
  // Used for session revocation
  async performDeviceWideLogout(isAdminLogout = false): Promise<void> {
    if (this.logoutInProgress) {
      console.log('⏳ Logout already in progress, skipping...');
      return;
    }

    this.logoutInProgress = true;
    console.log('🚪 Starting DEVICE-WIDE logout - all tabs will be logged out');
    
    try {
      // Clear device auth state immediately
      deviceAuthService.clearDeviceAuthState();
      console.log('✅ Device auth state cleared');
      
      // Sign out from Supabase (this will trigger the auth state change)
      const { error } = await perTabSupabase.auth.signOut({ scope: 'local' });
      if (error) {
        console.error('❌ Supabase signOut error:', error);
      } else {
        console.log('✅ Supabase session cleared');
      }
      
      // Clear session storage immediately
      sessionStorage.clear();
      console.log('✅ Session storage cleared');
      
      // SECURITY FIX: Clear ALL auth-related data including last profile
      // Keep device_stable_id to preserve device identity across logouts
      const keysToKeep = ['theme', 'language', 'device_stable_id'];
      const allKeys = Object.keys(localStorage);
      
      allKeys.forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });
      console.log('✅ Auth-related localStorage cleared');
      
      console.log('✅ DEVICE-WIDE logout completed - all tabs logged out');
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      this.logoutInProgress = false;
    }
  }

  // DEPRECATED: Use performTabOnlyLogout or performDeviceWideLogout instead
  async performImmediateLogout(isAdminLogout = false): Promise<void> {
    console.warn('⚠️ DEPRECATED: Use performTabOnlyLogout() or performDeviceWideLogout() instead');
    return this.performDeviceWideLogout(isAdminLogout);
  }

  // Admin-only logout
  async performAdminOnlyLogout(): Promise<void> {
    if (this.logoutInProgress) {
      return;
    }

    this.logoutInProgress = true;
    console.log('🔧 Starting admin-only logout...');
    
    try {
      // SECURITY FIX: Clear ALL storage on admin logout for maximum security
      // Remove all potential admin-related data from both storage types
      localStorage.clear();
      sessionStorage.clear();
      console.log('🔒 All client storage cleared for admin security');
      
      console.log('✅ Admin logout completed - redirecting to admin login');
      
      // Redirect to admin login page
      window.location.replace('/admin/login');
      
    } catch (error) {
      console.error('❌ Admin logout error:', error);
      // Force redirect even on error
      window.location.replace('/admin/login');
    } finally {
      this.logoutInProgress = false;
    }
  }
  
  isLogoutInProgress(): boolean {
    return this.logoutInProgress;
  }
}

export const immediateLogoutService = ImmediateLogoutService.getInstance();
