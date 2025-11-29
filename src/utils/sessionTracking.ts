import { supabase } from '@/integrations/supabase/client';

interface DeviceInfo {
  deviceName?: string;
  deviceType?: string;
  browserInfo?: string;
  operatingSystem?: string;
  screenResolution?: string;
  timezone?: string;
}

interface SessionData {
  user_id: string;
  session_token: string;
  device_info?: string;
  ip_address?: string;
  location?: string;
  user_agent: string;
  device_name?: string;
  device_type?: string;
  browser_info?: string;
  operating_system?: string;
  device_fingerprint?: string;
  expires_at?: string;
}

/**
 * Detects device information from the browser
 */
export const detectDeviceInfo = (): DeviceInfo => {
  const userAgent = navigator.userAgent;
  
  // Detect device type
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|Android(?=.*Tablet)|(?=.*\\bAndroid\\b)(?=.*\\b(?:Large|Tab)\\b)/i.test(userAgent);
  const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';
  
  // Detect OS
  let operatingSystem = 'Unknown';
  if (userAgent.indexOf('Windows') !== -1) operatingSystem = 'Windows';
  else if (userAgent.indexOf('Mac') !== -1) operatingSystem = 'macOS';
  else if (userAgent.indexOf('Linux') !== -1) operatingSystem = 'Linux';
  else if (userAgent.indexOf('Android') !== -1) operatingSystem = 'Android';
  else if (userAgent.indexOf('iPhone') !== -1 || userAgent.indexOf('iPad') !== -1) operatingSystem = 'iOS';
  
  // Detect browser
  let browserInfo = 'Unknown';
  if (userAgent.indexOf('Chrome') !== -1) browserInfo = 'Chrome';
  else if (userAgent.indexOf('Firefox') !== -1) browserInfo = 'Firefox';
  else if (userAgent.indexOf('Safari') !== -1) browserInfo = 'Safari';
  else if (userAgent.indexOf('Edge') !== -1) browserInfo = 'Edge';
  else if (userAgent.indexOf('Opera') !== -1) browserInfo = 'Opera';
  
  return {
    deviceType,
    operatingSystem,
    browserInfo,
    deviceName: `${operatingSystem} ${browserInfo}`,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
};

/**
 * Generates a simple device fingerprint based on browser characteristics
 */
export const generateDeviceFingerprint = (): string => {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.platform,
    navigator.cookieEnabled ? 'cookies-enabled' : 'cookies-disabled'
  ];
  
  // Simple hash function
  let hash = 0;
  const str = components.join('|');
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(16);
};

/**
 * Creates a new session record on successful sign-in
 */
export const createSession = async (userId: string, sessionToken: string, clientIp?: string): Promise<string | null> => {
  try {
    const deviceInfo = detectDeviceInfo();
    const deviceFingerprint = generateDeviceFingerprint();
    
    // Calculate session expiry (default: 30 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    const sessionData: SessionData = {
      user_id: userId,
      session_token: sessionToken,
      device_info: JSON.stringify(deviceInfo),
      ip_address: clientIp,
      user_agent: navigator.userAgent,
      device_name: deviceInfo.deviceName,
      device_type: deviceInfo.deviceType,
      browser_info: deviceInfo.browserInfo,
      operating_system: deviceInfo.operatingSystem,
      device_fingerprint: deviceFingerprint,
      expires_at: expiresAt.toISOString()
    };
    
    // End any existing active sessions for this device fingerprint
    await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('device_fingerprint', deviceFingerprint)
      .eq('is_active', true);
    
    // Insert new session
    const { data, error } = await supabase
      .from('user_sessions')
      .insert(sessionData)
      .select('id')
      .single();
    
    if (error) {
      console.error('Failed to create session:', error);
      return null;
    }
    
    console.log('✅ Session created successfully:', data.id);
    return data.id;
  } catch (error) {
    console.error('Error creating session:', error);
    return null;
  }
};

/**
 * Updates session activity (heartbeat)
 */
export const updateSessionActivity = async (userId: string, sessionId?: string): Promise<boolean> => {
  try {
    let query = supabase
      .from('user_sessions')
      .update({ 
        last_activity: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('is_active', true);
    
    // If sessionId is provided, update specific session
    if (sessionId) {
      query = query.eq('id', sessionId);
    } else {
      // Otherwise, update the most recent active session
      query = query.order('created_at', { ascending: false }).limit(1);
    }
    
    const { error } = await query;
    
    if (error) {
      console.error('Failed to update session activity:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating session activity:', error);
    return false;
  }
};

/**
 * Ends a session (on sign-out)
 */
export const endSession = async (userId: string, sessionId?: string): Promise<boolean> => {
  try {
    let query = supabase
      .from('user_sessions')
      .update({ 
        is_active: false,
        last_activity: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    if (sessionId) {
      query = query.eq('id', sessionId);
    } else {
      // End all active sessions for the user
      query = query.eq('is_active', true);
    }
    
    const { error } = await query;
    
    if (error) {
      console.error('Failed to end session:', error);
      return false;
    }
    
    console.log('✅ Session(s) ended successfully');
    return true;
  } catch (error) {
    console.error('Error ending session:', error);
    return false;
  }
};

/**
 * Gets active sessions for a user
 */
export const getUserActiveSessions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('last_activity', { ascending: false });
    
    if (error) {
      console.error('Failed to get user sessions:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error getting user sessions:', error);
    return [];
  }
};

/**
 * Cleans up expired sessions
 */
export const cleanupExpiredSessions = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('user_id', userId)
      .lt('expires_at', new Date().toISOString())
      .eq('is_active', true);
    
    if (error) {
      console.error('Failed to cleanup expired sessions:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
    return false;
  }
};

/**
 * Session tracking hook for React components
 */
export class SessionTracker {
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private userId: string;
  private sessionId: string | null = null;
  
  constructor(userId: string) {
    this.userId = userId;
  }
  
  /**
   * Starts session tracking with automatic heartbeat
   */
  async start(sessionToken: string, clientIp?: string): Promise<void> {
    // Create initial session
    this.sessionId = await createSession(this.userId, sessionToken, clientIp);
    
    // Start heartbeat every 5 minutes
    this.startHeartbeat();
    
    // Cleanup expired sessions
    await cleanupExpiredSessions(this.userId);
  }
  
  /**
   * Starts the heartbeat interval
   */
  startHeartbeat(): void {
    // Clear existing interval
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    // Update activity every 5 minutes
    this.heartbeatInterval = setInterval(async () => {
      await updateSessionActivity(this.userId, this.sessionId || undefined);
    }, 5 * 60 * 1000); // 5 minutes
    
    // Also update on user activity
    const updateActivity = () => updateSessionActivity(this.userId, this.sessionId || undefined);
    
    // Listen for user activity events
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    let lastUpdate = Date.now();
    const handleActivity = () => {
      const now = Date.now();
      // Throttle updates to once per minute
      if (now - lastUpdate > 60000) {
        lastUpdate = now;
        updateActivity();
      }
    };
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });
    
    // Store event listeners for cleanup
    (this as any).activityListeners = { events, handler: handleActivity };
  }
  
  /**
   * Stops session tracking
   */
  async stop(): Promise<void> {
    // Clear heartbeat interval
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    // Remove activity listeners
    if ((this as any).activityListeners) {
      const { events, handler } = (this as any).activityListeners;
      events.forEach((event: string) => {
        document.removeEventListener(event, handler);
      });
    }
    
    // End session
    if (this.sessionId) {
      await endSession(this.userId, this.sessionId);
    }
  }
  
  /**
   * Manual activity update
   */
  async updateActivity(): Promise<void> {
    await updateSessionActivity(this.userId, this.sessionId || undefined);
  }
}

// Example usage functions
export const exampleSessionTracking = () => {
  return {
    // On successful sign-in
    onSignIn: async (user: any, sessionToken: string, clientIp?: string) => {
      try {
        const sessionId = await createSession(user.id, sessionToken, clientIp);
        console.log('Session tracking started:', sessionId);
        
        // Start automated tracking
        const tracker = new SessionTracker(user.id);
        await tracker.start(sessionToken, clientIp);
        
        return { sessionId, tracker };
      } catch (error) {
        console.error('Failed to start session tracking:', error);
        throw error;
      }
    },
    
    // Manual heartbeat (if needed)
    heartbeat: async (userId: string) => {
      await updateSessionActivity(userId);
    },
    
    // On sign-out
    onSignOut: async (userId: string, sessionId?: string) => {
      await endSession(userId, sessionId);
    }
  };
};
