
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface SecureSessionData {
  authUserId: string;
  accessToken: string;
  refreshToken: string;
  email: string;
  phone: string | null;
  sessionId: string;
  createdAt: string;
  lastValidated: string;
  userRole: string;
}

class SecureSessionManager {
  private readonly SESSION_PREFIX = 'shqipet-secure-session';
  private readonly ACTIVE_SESSION_KEY = 'shqipet-active-session';
  private readonly SESSION_VALIDATION_KEY = 'shqipet-session-validation';
  private readonly MAX_SESSION_AGE = 24 * 60 * 60 * 1000; // 24 hours
  private readonly VALIDATION_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private currentSessionId: string | null = null;

  // Generate cryptographically secure session ID
  private generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 15);
    const userAgent = navigator.userAgent.slice(-10).replace(/[^a-zA-Z0-9]/g, '');
    return `${timestamp}-${random}-${userAgent}`;
  }

  private getSessionKey(authUserId: string): string {
    return `${this.SESSION_PREFIX}-${authUserId}`;
  }

  // Enhanced session integrity validation
  private async validateSessionIntegrity(sessionData: SecureSessionData): Promise<boolean> {
    if (!sessionData.authUserId || !sessionData.accessToken || !sessionData.refreshToken) {
      console.error('🚨 Session integrity check failed - missing required fields');
      return false;
    }

    const now = Date.now();
    const sessionAge = now - new Date(sessionData.createdAt).getTime();
    const lastValidationAge = now - new Date(sessionData.lastValidated).getTime();

    // Check if session has expired
    if (sessionAge > this.MAX_SESSION_AGE) {
      console.error('🚨 Session expired - age exceeded maximum');
      return false;
    }

    // Check if validation is stale
    if (lastValidationAge > this.VALIDATION_INTERVAL) {
      console.warn('⚠️ Session validation is stale, revalidating...');
      return await this.revalidateSession(sessionData);
    }

    return true;
  }

  private async revalidateSession(sessionData: SecureSessionData): Promise<boolean> {
    try {
      // Verify session with Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session || session.user.id !== sessionData.authUserId) {
        console.error('🚨 Session revalidation failed');
        return false;
      }

      // Update validation timestamp
      sessionData.lastValidated = new Date().toISOString();
      const sessionKey = this.getSessionKey(sessionData.authUserId);
      localStorage.setItem(sessionKey, JSON.stringify(sessionData));
      
      console.log('✅ Session revalidated successfully');
      return true;
    } catch (error) {
      console.error('🚨 Error during session revalidation:', error);
      return false;
    }
  }

  // Store secure session with enhanced validation
  async storeSession(session: Session): Promise<SecureSessionData> {
    if (!session.user || !session.access_token || !session.refresh_token) {
      throw new Error('Invalid session data - missing required fields');
    }

    // Check for existing sessions and enforce single session per user
    const existingActiveSession = await this.getActiveSession();
    if (existingActiveSession && existingActiveSession.authUserId !== session.user.id) {
      console.warn('🚨 SECURITY: Different user session detected during login');
      this.clearSession();
    }

    // Get user role securely
    let userRole = 'user';
    try {
      const { data: roleData } = await supabase.rpc('get_current_user_role');
      userRole = roleData || 'user';
    } catch (error) {
      console.warn('⚠️ Could not fetch user role, defaulting to user');
    }

    const sessionId = this.generateSessionId();
    const now = new Date().toISOString();
    
    const sessionData: SecureSessionData = {
      authUserId: session.user.id,
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      email: session.user.email || '',
      phone: session.user.phone || null,
      sessionId,
      createdAt: now,
      lastValidated: now,
      userRole
    };

    // Validate before storing
    if (!(await this.validateSessionIntegrity(sessionData))) {
      throw new Error('Session integrity validation failed during storage');
    }

    // Store securely
    const sessionKey = this.getSessionKey(session.user.id);
    localStorage.setItem(sessionKey, JSON.stringify(sessionData));
    localStorage.setItem(this.ACTIVE_SESSION_KEY, session.user.id);
    localStorage.setItem(this.SESSION_VALIDATION_KEY, now);
    
    this.currentSessionId = sessionId;
    
    // Log security event
    this.logSecurityEvent('session_created', {
      sessionId,
      userRole,
      timestamp: now
    });
    
    console.log('🔐 Secure session stored and validated for user:', session.user.id);
    return sessionData;
  }

  // Get active session with enhanced security checks
  async getActiveSession(): Promise<SecureSessionData | null> {
    try {
      const activeUserId = localStorage.getItem(this.ACTIVE_SESSION_KEY);
      if (!activeUserId) {
        return null;
      }

      const sessionKey = this.getSessionKey(activeUserId);
      const sessionDataStr = localStorage.getItem(sessionKey);
      if (!sessionDataStr) {
        console.error('🚨 Active session reference exists but no session data found');
        this.clearSession();
        return null;
      }

      const sessionData: SecureSessionData = JSON.parse(sessionDataStr);
      
      // Validate session integrity
      if (!(await this.validateSessionIntegrity(sessionData))) {
        console.error('🚨 Session integrity validation failed - clearing session');
        this.clearSession();
        return null;
      }

      // Cross-check with Supabase session
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session || session.user.id !== sessionData.authUserId) {
        console.error('🚨 Session mismatch with Supabase - clearing local session');
        this.clearSession();
        return null;
      }

      return sessionData;
    } catch (error) {
      console.error('🚨 Error retrieving active session:', error);
      this.clearSession();
      return null;
    }
  }

  // Validate user identity with enhanced checks
  async validateUserIdentity(requestedUserId: string): Promise<boolean> {
    const activeSession = await this.getActiveSession();
    if (!activeSession) {
      console.error('🚨 No active session for identity validation');
      return false;
    }

    if (activeSession.authUserId !== requestedUserId) {
      console.error('🚨 CRITICAL: User identity validation failed');
      console.error('Active session user:', activeSession.authUserId);
      console.error('Requested user:', requestedUserId);
      
      // Log security event
      this.logSecurityEvent('identity_validation_failed', {
        activeUser: activeSession.authUserId,
        requestedUser: requestedUserId,
        sessionId: activeSession.sessionId
      });
      
      return false;
    }

    return true;
  }

  // Clear session securely
  clearSession(): void {
    const activeUserId = localStorage.getItem(this.ACTIVE_SESSION_KEY);
    
    if (activeUserId) {
      const sessionKey = this.getSessionKey(activeUserId);
      localStorage.removeItem(sessionKey);
      
      // Log security event
      this.logSecurityEvent('session_cleared', {
        userId: activeUserId,
        timestamp: new Date().toISOString()
      });
    }
    
    localStorage.removeItem(this.ACTIVE_SESSION_KEY);
    localStorage.removeItem(this.SESSION_VALIDATION_KEY);
    this.currentSessionId = null;
    
    console.log('🗑️ Session completely cleared and secured');
  }

  // Enhanced session validation
  async isSessionValid(): Promise<boolean> {
    const sessionData = await this.getActiveSession();
    return sessionData !== null;
  }

  getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }

  // Log security events
  private async logSecurityEvent(eventType: string, metadata: any): Promise<void> {
    try {
      await supabase.from('security_events').insert({
        event_type: eventType,
        event_description: `Session security event: ${eventType}`,
        metadata,
        risk_level: eventType.includes('failed') ? 'high' : 'medium'
      });
    } catch (error) {
      console.warn('⚠️ Could not log security event:', error);
    }
  }
}

export const secureSessionManager = new SecureSessionManager();
