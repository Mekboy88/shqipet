import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface SessionPersistenceConfig {
  maxRetries: number;
  retryDelay: number;
  heartbeatInterval: number;
  sessionCheckInterval: number;
}

class SessionPersistenceService {
  private config: SessionPersistenceConfig = {
    maxRetries: 3,
    retryDelay: 2000,
    heartbeatInterval: 10 * 60 * 1000, // 10 minutes (less aggressive)
    sessionCheckInterval: 5 * 60 * 1000, // 5 minutes (much less aggressive)
  };

  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private sessionCheckTimer: ReturnType<typeof setInterval> | null = null;
  private currentSession: Session | null = null;
  private refreshInProgress = false;
  private lastActivity = Date.now();

  // Initialize session persistence
  initialize() {
    console.log('🔐 Initializing session persistence service...');
    
    // Track user activity
    this.trackUserActivity();
    
    // Start session monitoring
    this.startSessionMonitoring();
    
    // Start session heartbeat
    this.startHeartbeat();
    
    console.log('✅ Session persistence service initialized');
  }

  // Track user activity to prevent unnecessary session checks
  private trackUserActivity() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        this.lastActivity = Date.now();
      }, { passive: true });
    });
  }

  // Start session monitoring - very conservative approach
  private startSessionMonitoring() {
    this.sessionCheckTimer = setInterval(async () => {
      // Only check session if user has been active recently and we have a session
      const timeSinceActivity = Date.now() - this.lastActivity;
      if (timeSinceActivity > 20 * 60 * 1000 || !this.currentSession) { // 20 minutes of inactivity or no session
        return;
      }

      await this.ensureSessionValid();
    }, this.config.sessionCheckInterval);
  }

  // Start heartbeat to keep session alive
  private startHeartbeat() {
    this.heartbeatTimer = setInterval(async () => {
      // Only send heartbeat if user has been active
      const timeSinceActivity = Date.now() - this.lastActivity;
      if (timeSinceActivity > 5 * 60 * 1000) { // 5 minutes of inactivity
        return;
      }

      await this.sendHeartbeat();
    }, this.config.heartbeatInterval);
  }

  // Ensure session is valid and refresh if needed
  private async ensureSessionValid(): Promise<boolean> {
    if (this.refreshInProgress) {
      return true; // Another refresh is in progress
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Session check error:', error);
        return false;
      }

      if (!session) {
        // Only log if user is supposed to be logged in
        return false;
      }

      this.currentSession = session;

      // Check if token is close to expiry (refresh 5 minutes before expiry)
      const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;
      const fiveMinutes = 5 * 60 * 1000;

      if (timeUntilExpiry < fiveMinutes && timeUntilExpiry > 0) {
        console.log('🔄 Session expiring soon, refreshing...');
        return await this.refreshSessionWithRetry();
      }

      return true;
    } catch (error) {
      console.error('❌ Session validation error:', error);
      return false;
    }
  }

  // Refresh session with retry logic
  private async refreshSessionWithRetry(): Promise<boolean> {
    if (this.refreshInProgress) {
      return true;
    }

    this.refreshInProgress = true;
    
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempting session refresh (${attempt}/${this.config.maxRetries})`);
        
        const { data, error } = await supabase.auth.refreshSession();
        
        if (error) {
          console.error(`❌ Session refresh attempt ${attempt} failed:`, error);
          
          if (attempt === this.config.maxRetries) {
            console.error('❌ All session refresh attempts failed');
            this.refreshInProgress = false;
            return false;
          }
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * attempt));
          continue;
        }

        if (data.session) {
          console.log('✅ Session refreshed successfully');
          this.currentSession = data.session;
          this.refreshInProgress = false;
          return true;
        }
      } catch (error) {
        console.error(`❌ Session refresh attempt ${attempt} error:`, error);
      }
    }

    this.refreshInProgress = false;
    return false;
  }

  // Send heartbeat to keep session alive
  private async sendHeartbeat(): Promise<void> {
    try {
      if (!this.currentSession) {
        return;
      }

      // Simple query to keep the connection alive
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (error && error.code !== 'PGRST116') {
        console.warn('⚠️ Heartbeat query failed:', error);
      }
    } catch (error) {
      console.warn('⚠️ Heartbeat error:', error);
    }
  }

  // Update session reference
  updateSession(session: Session | null) {
    this.currentSession = session;
    if (session) {
      this.lastActivity = Date.now();
    }
  }

  // Get current session
  getCurrentSession(): Session | null {
    return this.currentSession;
  }

  // Cleanup timers
  cleanup() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    
    if (this.sessionCheckTimer) {
      clearInterval(this.sessionCheckTimer);
      this.sessionCheckTimer = null;
    }
    
    console.log('🧹 Session persistence service cleaned up');
  }

  // Prevent automatic logout
  preventAutoLogout() {
    // Override any automatic logout mechanisms
    console.log('🔒 Auto-logout prevention activated');
    
    // Prevent session timeout redirects
    window.addEventListener('beforeunload', (e) => {
      // Only prevent if we have an active session
      if (this.currentSession) {
        // Store session data for quick recovery
        localStorage.setItem('shqipet_session_backup', JSON.stringify({
          session: this.currentSession,
          timestamp: Date.now()
        }));
      }
    });
  }

  // Recover session from backup
  async recoverSession(): Promise<boolean> {
    try {
      const backup = localStorage.getItem('shqipet_session_backup');
      if (!backup) {
        return false;
      }

      const { session, timestamp } = JSON.parse(backup);
      const age = Date.now() - timestamp;
      
      // Only recover if backup is less than 1 hour old
      if (age > 60 * 60 * 1000) {
        localStorage.removeItem('shqipet_session_backup');
        return false;
      }

      console.log('🔄 Attempting session recovery from backup...');
      
      const { data, error } = await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token
      });

      if (error || !data.session) {
        localStorage.removeItem('shqipet_session_backup');
        return false;
      }

      console.log('✅ Session recovered successfully');
      this.currentSession = data.session;
      localStorage.removeItem('shqipet_session_backup');
      return true;
    } catch (error) {
      console.error('❌ Session recovery failed:', error);
      localStorage.removeItem('shqipet_session_backup');
      return false;
    }
  }
}

export const sessionPersistenceService = new SessionPersistenceService();
