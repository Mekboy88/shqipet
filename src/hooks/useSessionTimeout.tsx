import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SessionTimeoutOptions {
  warningTime?: number; // Minutes before expiry to show warning
  checkInterval?: number; // How often to check session status (ms)
  onWarning?: (minutesLeft: number) => void;
  onExpired?: () => void;
  onRefreshed?: () => void;
}

interface SessionState {
  isExpiring: boolean;
  minutesLeft: number;
  isRefreshing: boolean;
  lastRefresh: Date | null;
}

export const useSessionTimeout = (options: SessionTimeoutOptions = {}) => {
  const {
    warningTime = 5, // 5 minutes warning
    checkInterval = 30000, // Check every 30 seconds
    onWarning,
    onExpired,
    onRefreshed
  } = options;

  const [sessionState, setSessionState] = useState<SessionState>({
    isExpiring: false,
    minutesLeft: 0,
    isRefreshing: false,
    lastRefresh: null
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionExpiryRef = useRef<Date | null>(null);

  // Calculate time until session expires
  const getTimeUntilExpiry = useCallback(() => {
    if (!sessionExpiryRef.current) return Infinity;
    const now = new Date();
    const expiryTime = sessionExpiryRef.current;
    return Math.max(0, expiryTime.getTime() - now.getTime());
  }, []);

  // Refresh the session
  const refreshSession = useCallback(async () => {
    setSessionState(prev => ({ ...prev, isRefreshing: true }));
    
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh failed:', error);
        onExpired?.();
        return false;
      }

      if (data.session) {
        // Calculate new expiry time (sessions typically last 1 hour)
        const expiryTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
        sessionExpiryRef.current = expiryTime;
        
        setSessionState(prev => ({
          ...prev,
          isRefreshing: false,
          isExpiring: false,
          lastRefresh: new Date()
        }));
        
        onRefreshed?.();
        return true;
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      setSessionState(prev => ({ ...prev, isRefreshing: false }));
      onExpired?.();
      return false;
    }
    
    return false;
  }, [onExpired, onRefreshed]);

  // Check session status
  const checkSessionStatus = useCallback(() => {
    const timeLeft = getTimeUntilExpiry();
    const minutesLeft = Math.floor(timeLeft / (1000 * 60));

    if (timeLeft <= 0) {
      // Session has expired
      setSessionState(prev => ({ ...prev, isExpiring: false, minutesLeft: 0 }));
      onExpired?.();
      return;
    }

    if (minutesLeft <= warningTime && !sessionState.isExpiring) {
      // Show warning
      setSessionState(prev => ({ ...prev, isExpiring: true, minutesLeft }));
      onWarning?.(minutesLeft);
    } else if (minutesLeft > warningTime && sessionState.isExpiring) {
      // Clear warning
      setSessionState(prev => ({ ...prev, isExpiring: false, minutesLeft }));
    } else {
      // Update minutes left
      setSessionState(prev => ({ ...prev, minutesLeft }));
    }
  }, [getTimeUntilExpiry, warningTime, sessionState.isExpiring, onWarning, onExpired]);

  // Initialize session tracking
  useEffect(() => {
    const initializeSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Assume session expires in 1 hour from now (this is typical for Supabase)
        const expiryTime = new Date(Date.now() + 60 * 60 * 1000);
        sessionExpiryRef.current = expiryTime;
      }
    };

    initializeSession();
  }, []);

  // Set up periodic checking
  useEffect(() => {
    if (sessionExpiryRef.current) {
      intervalRef.current = setInterval(checkSessionStatus, checkInterval);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [checkSessionStatus, checkInterval]);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        sessionExpiryRef.current = null;
        setSessionState({
          isExpiring: false,
          minutesLeft: 0,
          isRefreshing: false,
          lastRefresh: null
        });
      } else if (event === 'SIGNED_IN' && session) {
        const expiryTime = new Date(Date.now() + 60 * 60 * 1000);
        sessionExpiryRef.current = expiryTime;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Extend session (manual refresh)
  const extendSession = useCallback(async () => {
    return await refreshSession();
  }, [refreshSession]);

  // Dismiss warning (user acknowledges)
  const dismissWarning = useCallback(() => {
    setSessionState(prev => ({ ...prev, isExpiring: false }));
  }, []);

  return {
    ...sessionState,
    extendSession,
    dismissWarning,
    refreshSession
  };
};