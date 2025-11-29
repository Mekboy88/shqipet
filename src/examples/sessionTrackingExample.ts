import { supabase } from '@/integrations/supabase/client';
import { createSession, updateSessionActivity, endSession, SessionTracker } from '@/utils/sessionTracking';

/**
 * Example integration of session tracking with authentication
 */
export const sessionTrackingExamples = {
  
  /**
   * Example 1: Basic session tracking on sign-in
   */
  handleSignIn: async (email: string, password: string) => {
    try {
      // 1. Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) throw authError;
      
      const { user, session } = authData;
      if (!user || !session) throw new Error('Authentication failed');
      
      // 2. Create session tracking record
      const sessionId = await createSession(
        user.id, 
        session.access_token,
        // Optional: Get client IP from headers if available server-side
        undefined // clientIp would go here if available
      );
      
      console.log('✅ Sign-in successful with session tracking:', {
        userId: user.id,
        sessionId,
        email: user.email
      });
      
      return { user, session, sessionId };
    } catch (error) {
      console.error('❌ Sign-in failed:', error);
      throw error;
    }
  },
  
  /**
   * Example 2: Automated session tracking with SessionTracker class
   */
  handleSignInWithTracker: async (email: string, password: string) => {
    try {
      // 1. Authenticate
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) throw authError;
      
      const { user, session } = authData;
      if (!user || !session) throw new Error('Authentication failed');
      
      // 2. Start automated session tracking
      const tracker = new SessionTracker(user.id);
      await tracker.start(session.access_token);
      
      // Store tracker instance for later cleanup
      (window as any).__sessionTracker = tracker;
      
      console.log('✅ Sign-in with automated tracking started');
      return { user, session, tracker };
    } catch (error) {
      console.error('❌ Automated sign-in failed:', error);
      throw error;
    }
  },
  
  /**
   * Example 3: Manual heartbeat updates
   */
  sendHeartbeat: async (userId: string) => {
    try {
      const success = await updateSessionActivity(userId);
      if (success) {
        console.log('💓 Heartbeat sent successfully');
      } else {
        console.warn('⚠️ Heartbeat failed');
      }
      return success;
    } catch (error) {
      console.error('❌ Heartbeat error:', error);
      return false;
    }
  },
  
  /**
   * Example 4: Sign-out with session cleanup
   */
  handleSignOut: async () => {
    try {
      // Get current user before signing out
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // End session tracking first
        await endSession(user.id);
        console.log('✅ Session tracking ended');
      }
      
      // Stop automated tracker if running
      if ((window as any).__sessionTracker) {
        await (window as any).__sessionTracker.stop();
        (window as any).__sessionTracker = null;
        console.log('✅ Automated tracker stopped');
      }
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('✅ Sign-out successful');
    } catch (error) {
      console.error('❌ Sign-out error:', error);
      throw error;
    }
  },
  
  /**
   * Example 5: React component integration
   */
  ReactComponentExample: `
  // In your main App component or authentication wrapper
  
  import { useSessionTracking } from '@/hooks/useSessionTracking';
  import { useAuth } from '@/contexts/AuthContext';
  
  const App = () => {
    const { user } = useAuth();
    const { isTracking, updateActivity } = useSessionTracking();
    
    // Session tracking is automatically handled by the hook
    // It starts when user signs in and stops when user signs out
    
    useEffect(() => {
      console.log('Session tracking status:', isTracking);
    }, [isTracking]);
    
    // Manual activity update on important actions
    const handleImportantAction = async () => {
      await updateActivity();
      // ... rest of your action logic
    };
    
    return (
      <div>
        {user && (
          <div className="session-status">
            Tracking: {isTracking ? '✅' : '❌'}
          </div>
        )}
        {/* Your app content */}
      </div>
    );
  };
  `,
  
  /**
   * Example 6: Custom activity tracking
   */
  setupCustomActivityTracking: () => {
    // Track specific user actions
    const trackActivity = async (action: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await updateSessionActivity(user.id);
        console.log(`📊 Activity tracked: ${action}`);
      }
    };
    
    // Example: Track when user interacts with important features
    document.addEventListener('click', (e) => {
      const target = e.target as Element;
      if (target.closest('[data-track-activity]')) {
        const action = target.getAttribute('data-track-activity') || 'click';
        trackActivity(action);
      }
    });
    
    // Example: Track form submissions
    document.addEventListener('submit', (e) => {
      trackActivity('form_submit');
    });
    
    // Example: Track navigation
    let lastPath = window.location.pathname;
    setInterval(() => {
      if (window.location.pathname !== lastPath) {
        lastPath = window.location.pathname;
        trackActivity('navigation');
      }
    }, 1000);
  },
  
  /**
   * Example 7: Real-time session monitoring (optional)
   */
  setupRealtimeSessionMonitoring: () => {
    return supabase
      .channel('session-monitoring')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_sessions'
        },
        (payload) => {
          console.log('Session change detected:', payload);
          
          // Handle different events
          switch (payload.eventType) {
            case 'INSERT':
              console.log('New session created:', payload.new);
              break;
            case 'UPDATE':
              console.log('Session updated:', payload.new);
              break;
            case 'DELETE':
              console.log('Session ended:', payload.old);
              break;
          }
        }
      )
      .subscribe();
  }
};

/**
 * Complete authentication integration example
 */
export const completeAuthExample = {
  // In your authentication context or service
  signIn: async (email: string, password: string) => {
    const { user, session, sessionId } = await sessionTrackingExamples.handleSignIn(email, password);
    
    // Store session ID for later use
    localStorage.setItem('current_session_id', sessionId || '');
    
    return { user, session, sessionId };
  },
  
  signOut: async () => {
    await sessionTrackingExamples.handleSignOut();
    
    // Clean up stored session ID
    localStorage.removeItem('current_session_id');
  },
  
  // Periodic heartbeat (optional - the hook handles this automatically)
  startHeartbeat: (userId: string) => {
    return setInterval(async () => {
      await sessionTrackingExamples.sendHeartbeat(userId);
    }, 5 * 60 * 1000); // Every 5 minutes
  }
};

/**
 * Usage with existing authentication flow
 */
export const integrationInstructions = `
# Session Tracking Integration Guide

## 1. Automatic Integration (Recommended)

Simply use the useSessionTracking hook in your main App component:

\`\`\`tsx
import { useSessionTracking } from '@/hooks/useSessionTracking';

function App() {
  const { isTracking } = useSessionTracking();
  
  // That's it! Session tracking is now automatic:
  // - Starts on sign-in
  // - Updates activity automatically
  // - Ends on sign-out
  
  return <YourAppContent />;
}
\`\`\`

## 2. Manual Integration

For more control, use the session tracking utilities directly:

\`\`\`tsx
import { createSession, updateSessionActivity, endSession } from '@/utils/sessionTracking';

// On sign-in success
const handleSignIn = async (user, session) => {
  const sessionId = await createSession(user.id, session.access_token);
  // Store sessionId if needed for later reference
};

// Periodic heartbeat (every 5 minutes)
setInterval(() => {
  updateSessionActivity(user.id);
}, 5 * 60 * 1000);

// On sign-out
const handleSignOut = async () => {
  await endSession(user.id);
  await supabase.auth.signOut();
};
\`\`\`

## 3. Session Management UI

Use the SessionManager component to let users view and manage their active sessions:

\`\`\`tsx
import SessionManager from '@/components/auth/SessionManager';

function AccountPage() {
  return (
    <div>
      <h1>Account Settings</h1>
      <SessionManager />
    </div>
  );
}
\`\`\`

## 4. Database Schema

The session tracking works with the existing user_sessions table with these key fields:
- user_id: Links to the authenticated user
- session_token: The Supabase access token
- device_info: JSON with device details
- ip_address: User's IP address
- last_activity: Timestamp of last activity
- is_active: Boolean flag for active sessions
- expires_at: When the session expires

## 5. Security Features

- Automatic cleanup of expired sessions
- Device fingerprinting for security
- Multiple device session management
- Real-time activity tracking
- Secure RLS policies ensure users only see their own sessions
`;

export default sessionTrackingExamples;