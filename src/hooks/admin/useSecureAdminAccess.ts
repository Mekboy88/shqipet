import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SecureAdminAccess {
  hasAccess: boolean;
  portalUrl: string | null;
  role: string | null;
  loading: boolean;
  accessValidated: boolean;
}

export const useSecureAdminAccess = (): SecureAdminAccess => {
  const { user, userProfile, adminRole, isAdmin } = useAuth();
  const [adminAccess, setAdminAccess] = useState<SecureAdminAccess>({
    hasAccess: false,
    portalUrl: null,
    role: null,
    loading: true,
    accessValidated: false
  });

  useEffect(() => {
    const validateAdminAccess = async () => {
      if (!user || !userProfile) {
        setAdminAccess({
          hasAccess: false,
          portalUrl: null,
          role: null,
          loading: false,
          accessValidated: true
        });
        return;
      }

      try {
        console.log('🔐 [ADMIN-ACCESS] Validating admin access for user:', user.id);
        
        // Use server-side validation for admin access with retry mechanism
        let accessGranted = false;
        let userRole = adminRole || 'user';
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries && !accessGranted) {
          try {
            const { data: accessData, error: accessError } = await supabase.rpc('validate_admin_access', {
              user_uuid: user.id,
              required_action: 'admin_dashboard_access'
            });

            if (accessError) {
              console.error(`🚨 [ADMIN-ACCESS] Access validation error (attempt ${retryCount + 1}):`, accessError);
              
              // If it's a function not found error, break out of retry loop
              if (accessError.message?.includes('function') && accessError.message?.includes('does not exist')) {
                console.error('🚨 [ADMIN-ACCESS] Admin function missing, falling back to profile check');
                break;
              }
              
              retryCount++;
              if (retryCount < maxRetries) {
                console.log(`🔄 [ADMIN-ACCESS] Retrying in ${retryCount * 1000}ms...`);
                await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
                continue;
              }
              throw accessError;
            }

            accessGranted = accessData;
            console.log('✅ [ADMIN-ACCESS] Access validation successful:', accessGranted);
            break;
            
          } catch (retryError) {
            console.error(`🚨 [ADMIN-ACCESS] Retry ${retryCount + 1} failed:`, retryError);
            retryCount++;
            
            if (retryCount >= maxRetries) {
              throw retryError;
            }
            
            await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
          }
        }

        // Get user role with fallback
        try {
          const { data: roleData, error: roleError } = await supabase.rpc('get_current_user_role');
          
          if (roleError) {
            console.warn('⚠️ [ADMIN-ACCESS] Role fetch error, using auth context fallback:', roleError);
            userRole = adminRole || 'user';
          } else {
            userRole = roleData || adminRole || 'user';
          }
        } catch (roleError) {
          console.warn('⚠️ [ADMIN-ACCESS] Role fetch failed, using auth context:', roleError);
          userRole = adminRole || 'user';
        }

        // Final fallback: check auth context directly if RPC failed
        if (!accessGranted && (retryCount >= maxRetries)) {
          console.log('🔄 [ADMIN-ACCESS] RPC failed, checking auth context directly');
          accessGranted = isAdmin;
          console.log('🔍 [ADMIN-ACCESS] Auth context-based check result:', accessGranted);
        }

        setAdminAccess({
          hasAccess: accessGranted,
          portalUrl: accessGranted ? '/admin' : null,
          role: userRole,
          loading: false,
          accessValidated: true
        });

        console.log('✅ [ADMIN-ACCESS] Final access state:', {
          hasAccess: accessGranted,
          role: userRole,
          method: retryCount >= maxRetries ? 'auth-context-fallback' : 'rpc-validation'
        });

      } catch (error) {
        console.error('🚨 [ADMIN-ACCESS] Critical validation error:', error);
        
        // Emergency fallback: check auth context directly
        try {
          const isEmergencyAdmin = isAdmin;
          console.log('🚨 [ADMIN-ACCESS] Emergency fallback - auth context check:', isEmergencyAdmin);
          
          setAdminAccess({
            hasAccess: isEmergencyAdmin,
            portalUrl: isEmergencyAdmin ? '/admin' : null,
            role: adminRole || 'user',
            loading: false,
            accessValidated: true
          });
          
          if (!isEmergencyAdmin) {
            toast.error('Admin access validation failed. Please try refreshing the page.');
          }
          
        } catch (emergencyError) {
          console.error('🚨 [ADMIN-ACCESS] Emergency fallback failed:', emergencyError);
          
          setAdminAccess({
            hasAccess: false,
            portalUrl: null,
            role: 'user',
            loading: false,
            accessValidated: true
          });
          
          toast.error('Unable to validate admin access. Please refresh and try again.');
        }
      }
    };

    validateAdminAccess();

    // Listen for role changes (but don't rely on client-side events for security)
    const handleRoleUpdate = () => {
      // Re-validate access when role might have changed
      setTimeout(validateAdminAccess, 500);
    };

    // Optional: Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        validateAdminAccess();
      }
    });

    window.addEventListener('newAdminGranted', handleRoleUpdate);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('newAdminGranted', handleRoleUpdate);
    };
  }, [user, userProfile]);

  return adminAccess;
};

// Additional utility for validating specific admin actions
export const validateAdminAction = async (action: string): Promise<boolean> => {
  try {
    const { data: isValid, error } = await supabase.rpc('validate_admin_access', {
      user_uuid: (await supabase.auth.getUser()).data.user?.id,
      required_action: action
    });

    if (error) {
      console.error(`🚨 Admin action validation failed for ${action}:`, error);
      return false;
    }

    return isValid === true;
  } catch (error) {
    console.error(`🚨 Critical error validating admin action ${action}:`, error);
    return false;
  }
};