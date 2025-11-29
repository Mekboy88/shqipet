
import { supabase } from '@/integrations/supabase/client';
import { perTabSupabase } from '@/integrations/supabase/perTabClient';
import { authLogger } from './authLogger';

interface AuthValidationResult {
  isValid: boolean;
  shouldRedirect: boolean;
  redirectPath?: string;
}

class AuthGuard {
  private static instance: AuthGuard;

  static getInstance(): AuthGuard {
    if (!AuthGuard.instance) {
      AuthGuard.instance = new AuthGuard();
    }
    return AuthGuard.instance;
  }

  // CRITICAL: Immediate session validation without leniency
  async validateSessionImmediately(): Promise<AuthValidationResult> {
    try {
      console.log('🔒 CRITICAL: Performing immediate session validation');
      
      // Get current session with strict validation
      const { data: { session }, error } = await perTabSupabase.auth.getSession();
      
      if (error) {
        console.error('🚨 Session retrieval error:', error);
        authLogger.logSecurityAlert('Session retrieval failed during immediate validation');
        return { isValid: false, shouldRedirect: true, redirectPath: '/' };
      }

      if (!session || !session.user) {
        console.log('🚨 No valid session found - redirecting to login');
        return { isValid: false, shouldRedirect: true, redirectPath: '/' };
      }

      // CRITICAL: Validate user actually exists in auth
      const { data: authUser, error: userError } = await perTabSupabase.auth.getUser();
      if (userError || !authUser.user || authUser.user.id !== session.user.id) {
        console.error('🚨 CRITICAL: User validation failed');
        authLogger.logSecurityAlert('User validation failed during immediate validation');
        return { isValid: false, shouldRedirect: true, redirectPath: '/' };
      }

      // CRITICAL: Verify user has a real profile (not empty/anonymous)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('auth_user_id, email, first_name, last_name, username')
        .eq('auth_user_id', session.user.id)
        .single();

      if (profileError || !profile) {
        console.error('🚨 CRITICAL: No valid profile found for user');
        authLogger.logSecurityAlert('Profile validation failed - no profile found');
        return { isValid: false, shouldRedirect: true, redirectPath: '/' };
      }

      // CRITICAL: Check for empty/anonymous profile data
      const hasValidData = profile.email || profile.first_name || profile.last_name || profile.username;
      if (!hasValidData) {
        console.error('🚨 CRITICAL: Profile contains no valid user data - preventing anonymous account display');
        authLogger.logSecurityAlert('Empty profile data detected - blocking anonymous account');
        return { isValid: false, shouldRedirect: true, redirectPath: '/' };
      }

      console.log('✅ Session validation successful - user has valid profile data');
      return { isValid: true, shouldRedirect: false };

    } catch (error) {
      console.error('🚨 CRITICAL: Session validation exception:', error);
      authLogger.logSecurityAlert('Session validation exception', { error: error.message });
      return { isValid: false, shouldRedirect: true, redirectPath: '/' };
    }
  }

  // Force logout and redirect for security violations
  async forceSecurityLogout(reason: string): Promise<void> {
    console.error('🚨 FORCING SECURITY LOGOUT:', reason);
    authLogger.logSecurityAlert('Forced security logout', { reason });
    
    try {
      await perTabSupabase.auth.signOut({ scope: 'local' });
    } catch (error) {
      console.error('Error during security logout:', error);
    }
    
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Force redirect to root
    window.location.replace('/');
  }
}

export const authGuard = AuthGuard.getInstance();
