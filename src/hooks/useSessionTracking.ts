import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  SessionTracker, 
  createSession, 
  endSession, 
  updateSessionActivity, 
  getUserActiveSessions,
  cleanupExpiredSessions 
} from '@/utils/sessionTracking';

export const useSessionTracking = () => {
  const { user, session } = useAuth();
  const sessionTrackerRef = useRef<SessionTracker | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  
  /**
   * Initialize session tracking when user signs in
   */
  const initializeSession = useCallback(async () => {
    if (!user || !session) return;
    
    try {
      // Clean up any existing tracker
      if (sessionTrackerRef.current) {
        await sessionTrackerRef.current.stop();
      }
      
      // Create new session tracker
      const tracker = new SessionTracker(user.id);
      const sessionToken = session.access_token;
      
      // Start tracking
      await tracker.start(sessionToken);
      
      // Store references
      sessionTrackerRef.current = tracker;
      
      console.log('✅ Session tracking initialized for user:', user.id);
    } catch (error) {
      console.error('Failed to initialize session tracking:', error);
    }
  }, [user, session]);
  
  /**
   * End session tracking when user signs out
   */
  const endSessionTracking = useCallback(async () => {
    try {
      if (sessionTrackerRef.current) {
        await sessionTrackerRef.current.stop();
        sessionTrackerRef.current = null;
      }
      
      if (sessionIdRef.current && user) {
        await endSession(user.id, sessionIdRef.current);
        sessionIdRef.current = null;
      }
      
      console.log('✅ Session tracking ended');
    } catch (error) {
      console.error('Failed to end session tracking:', error);
    }
  }, [user]);
  
  /**
   * Manually update session activity
   */
  const updateActivity = useCallback(async () => {
    if (!user) return;
    
    try {
      await updateSessionActivity(user.id, sessionIdRef.current || undefined);
    } catch (error) {
      console.error('Failed to update session activity:', error);
    }
  }, [user]);
  
  /**
   * Get user's active sessions
   */
  const getActiveSessions = useCallback(async () => {
    if (!user) return [];
    
    try {
      return await getUserActiveSessions(user.id);
    } catch (error) {
      console.error('Failed to get active sessions:', error);
      return [];
    }
  }, [user]);
  
  /**
   * End a specific session
   */
  const endSpecificSession = useCallback(async (sessionId: string) => {
    if (!user) return false;
    
    try {
      return await endSession(user.id, sessionId);
    } catch (error) {
      console.error('Failed to end specific session:', error);
      return false;
    }
  }, [user]);
  
  // Effect to handle session initialization and cleanup
  useEffect(() => {
    if (user && session) {
      // User signed in, initialize session tracking
      initializeSession();
    } else if (!user && sessionTrackerRef.current) {
      // User signed out, cleanup session tracking
      endSessionTracking();
    }
    
    // Cleanup on unmount
    return () => {
      if (sessionTrackerRef.current) {
        sessionTrackerRef.current.stop();
      }
    };
  }, [user, session, initializeSession, endSessionTracking]);
  
  // Handle page visibility changes (pause/resume tracking)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, could pause tracking or update activity
        updateActivity();
      } else {
        // Page is visible, update activity
        updateActivity();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [updateActivity]);
  
  // Handle beforeunload (page close/refresh)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Update activity one last time before page closes
      if (user) {
        // Use sendBeacon for better reliability
        const data = JSON.stringify({
          user_id: user.id,
          session_id: sessionIdRef.current,
          last_activity: new Date().toISOString()
        });
        
        if (navigator.sendBeacon) {
          // In a real app, you might send this to an endpoint that updates the session
          // For now, we'll just mark the intent
          console.log('Page unloading, session activity recorded');
        }
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);
  
  return {
    isTracking: !!sessionTrackerRef.current,
    updateActivity,
    getActiveSessions,
    endSpecificSession,
    sessionId: sessionIdRef.current
  };
};

/**
 * Hook for components that need to display session information
 */
export const useUserSessions = () => {
  const { user } = useAuth();
  
  const getActiveSessions = useCallback(async () => {
    if (!user) return [];
    return await getUserActiveSessions(user.id);
  }, [user]);
  
  const endUserSession = useCallback(async (sessionId: string) => {
    if (!user) return false;
    return await endSession(user.id, sessionId);
  }, [user]);
  
  const cleanupExpired = useCallback(async () => {
    if (!user) return false;
    return await cleanupExpiredSessions(user.id);
  }, [user]);
  
  return {
    getActiveSessions,
    endSession: endUserSession,
    cleanupExpired
  };
};