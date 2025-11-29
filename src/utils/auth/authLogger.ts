
interface AuthEvent {
  event: string;
  userId?: string;
  email?: string;
  timestamp: string;
  location?: string;
  userAgent?: string;
  sessionId?: string;
  isRefresh?: boolean; // NEW: Add isRefresh property
  metadata?: any;
}

class AuthLogger {
  private static instance: AuthLogger;
  private events: AuthEvent[] = [];
  private maxEvents = 200; // Increased for better debugging
  private readonly STORAGE_KEY = 'auth-events';

  static getInstance(): AuthLogger {
    if (!AuthLogger.instance) {
      AuthLogger.instance = new AuthLogger();
    }
    return AuthLogger.instance;
  }

  logEvent(event: string, data?: Partial<AuthEvent>): void {
    const authEvent: AuthEvent = {
      event,
      timestamp: new Date().toISOString(),
      location: window.location.pathname,
      userAgent: navigator.userAgent.substring(0, 100), // Truncate for storage
      ...data
    };

    this.events.unshift(authEvent);
    
    // Keep only the last maxEvents
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }

    // Enhanced console logging with better formatting
    const eventColor = this.getEventColor(event);
    console.log(`%c🔐 [AUTH EVENT] ${event}`, `color: ${eventColor}; font-weight: bold;`, authEvent);

    // SECURITY FIX: Store in memory only - no localStorage for sensitive auth data
    // Events are kept in memory for debugging but not persisted client-side
    if (this.events.length > 50) {
      this.events = this.events.slice(0, 50); // Keep only recent 50 events in memory
    }
  }

  getRecentEvents(count = 20): AuthEvent[] {
    return this.events.slice(0, count);
  }

  logSecurityAlert(message: string, data?: any): void {
    this.logEvent('SECURITY_ALERT', {
      metadata: { 
        message, 
        data,
        severity: 'HIGH',
        requiresAttention: true 
      }
    });
    
    console.error(`%c🚨 SECURITY ALERT: ${message}`, 'color: red; font-weight: bold; font-size: 14px;', data);
  }

  logLoginAttempt(email: string, success: boolean, error?: string): void {
    this.logEvent(success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED', {
      email,
      metadata: { 
        success, 
        error,
        timestamp: Date.now(),
        attempt: success ? 'successful' : 'failed'
      }
    });
  }

  logProfileSync(userId: string, success: boolean, data?: any): void {
    this.logEvent('PROFILE_SYNC', {
      userId,
      metadata: { 
        success, 
        data: typeof data === 'object' ? JSON.stringify(data).substring(0, 200) : data,
        syncTime: Date.now()
      }
    });
  }

  logSessionValidation(userId: string, valid: boolean, reason?: string): void {
    this.logEvent('SESSION_VALIDATION', {
      userId,
      metadata: { 
        valid, 
        reason,
        validationTime: Date.now(),
        result: valid ? 'PASSED' : 'FAILED'
      }
    });
  }

  logLogout(userId: string, reason?: string): void {
    this.logEvent('LOGOUT', {
      userId,
      metadata: { 
        reason,
        logoutTime: Date.now(),
        initiatedBy: reason || 'user'
      }
    });
  }

  // Get authentication statistics
  getAuthStats() {
    const recentEvents = this.getRecentEvents(100);
    const now = Date.now();
    const lastHour = now - (60 * 60 * 1000);
    
    const stats = {
      totalEvents: recentEvents.length,
      recentEvents: recentEvents.filter(e => new Date(e.timestamp).getTime() > lastHour).length,
      securityAlerts: recentEvents.filter(e => e.event === 'SECURITY_ALERT').length,
      loginAttempts: recentEvents.filter(e => e.event.includes('LOGIN')).length,
      sessionValidations: recentEvents.filter(e => e.event === 'SESSION_VALIDATION').length,
      profileSyncs: recentEvents.filter(e => e.event === 'PROFILE_SYNC').length
    };
    
    return stats;
  }

  // Get events by type
  getEventsByType(eventType: string, limit = 10): AuthEvent[] {
    return this.events
      .filter(event => event.event === eventType)
      .slice(0, limit);
  }

  // Get security alerts
  getSecurityAlerts(limit = 10): AuthEvent[] {
    return this.getEventsByType('SECURITY_ALERT', limit);
  }

  clearEvents(): void {
    this.events = [];
    // SECURITY FIX: No localStorage removal since we don't store events there anymore
    console.log('🗑️ Auth events cleared from memory');
  }

  // Export events for debugging
  exportEvents(): string {
    return JSON.stringify(this.events, null, 2);
  }

  // Load events from storage on initialization
  private loadStoredEvents(): void {
    // SECURITY FIX: Don't load auth events from localStorage
    // Initialize with empty events array for security
    this.events = [];
    console.debug('Auth events initialized (no client storage for security)');
  }

  // Get color for different event types
  private getEventColor(event: string): string {
    if (event.includes('SECURITY_ALERT')) return '#dc2626'; // red
    if (event.includes('LOGIN_SUCCESS')) return '#16a34a'; // green
    if (event.includes('LOGIN_FAILED')) return '#dc2626'; // red
    if (event.includes('LOGOUT')) return '#2563eb'; // blue
    if (event.includes('SESSION')) return '#7c3aed'; // purple
    if (event.includes('PROFILE')) return '#ea580c'; // orange
    return '#6b7280'; // gray for others
  }

  constructor() {
    this.loadStoredEvents();
  }
}

export const authLogger = AuthLogger.getInstance();
