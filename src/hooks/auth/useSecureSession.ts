
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { secureSessionManager, SecureSessionData } from '@/utils/security/secureSessionManager';
import { toast } from 'sonner';
import { immediateLogoutService } from '@/utils/auth/immediateLogoutService';

export const useSecureSession = () => {
  const [sessionData, setSessionData] = useState<SecureSessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Immediate force logout without delays
  const forceLogout = useCallback(async (reason: string) => {
    console.error('🚨 CRITICAL: Force logout triggered:', reason);
    
    // Clear session data immediately
    secureSessionManager.clearSession();
    setSessionData(null);
    setIsAuthenticated(false);
    
    // SECURITY: Clear professional presentation cache to prevent cross-account leakage
    try {
      localStorage.removeItem('pp:last:avatar_url');
      localStorage.removeItem('pp:avatar_meta');
    } catch {}
    
    toast.error(`Session terminated - ${reason}`);
    
    // Use immediate logout service
    await immediateLogoutService.performImmediateLogout();
  }, []);

  // Simplified session loading
  const loadSession = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session || !session.user) {
        const storedSession = await secureSessionManager.getActiveSession();
        if (storedSession) {
          secureSessionManager.clearSession();
        }
        setSessionData(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Validate and store session
      try {
        const secureSession = await secureSessionManager.storeSession(session);
        setSessionData(secureSession);
        setIsAuthenticated(true);
      } catch (error: any) {
        await forceLogout(error.message);
        return;
      }
      
    } catch (error: any) {
      await forceLogout('Session loading failed');
    } finally {
      setIsLoading(false);
    }
  }, [forceLogout]);

  // Simplified auth state change handler
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          secureSessionManager.clearSession();
          setSessionData(null);
          setIsAuthenticated(false);
          
          // SECURITY: Clear professional presentation cache to prevent cross-account leakage
          try {
            localStorage.removeItem('pp:last:avatar_url');
            localStorage.removeItem('pp:avatar_meta');
          } catch {}
          return;
        }

        if (event === 'SIGNED_IN' && session) {
          try {
            const secureSession = await secureSessionManager.storeSession(session);
            setSessionData(secureSession);
            setIsAuthenticated(true);
            toast.success('Secure login successful');
          } catch (error: any) {
            await forceLogout(error.message);
          }
        }

        if (event === 'TOKEN_REFRESHED' && session) {
          const currentSession = await secureSessionManager.getActiveSession();
          if (!currentSession || currentSession.authUserId !== session.user.id) {
            await forceLogout('Token refresh validation failed');
            return;
          }

          try {
            const updatedSession = await secureSessionManager.storeSession(session);
            setSessionData(updatedSession);
          } catch (error: any) {
            await forceLogout('Token refresh validation failed');
          }
        }
      }
    );

    loadSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [loadSession, forceLogout]);

  const validateUserAccess = useCallback(async (requestedUserId: string): Promise<boolean> => {
    if (!sessionData) {
      return false;
    }
    
    return await secureSessionManager.validateUserIdentity(requestedUserId);
  }, [sessionData]);

  const getCurrentAuthUserId = useCallback((): string | null => {
    return sessionData?.authUserId || null;
  }, [sessionData]);

  return {
    sessionData,
    isLoading,
    isAuthenticated,
    validateUserAccess,
    getCurrentAuthUserId,
    forceLogout
  };
};
