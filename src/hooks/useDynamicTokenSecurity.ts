import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dynamicTokenManager, TokenLifetimeConfig } from '@/services/dynamicTokenManager';
import { useSecureRoles } from './users/use-secure-roles';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface SecurityStatus {
  tokenConfig: TokenLifetimeConfig | null;
  mfaRequired: boolean;
  mfaReason: string | null;
  timeUntilRefresh: number;
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
  deviceTrustStatus: 'new' | 'trusted' | 'untrusted';
  loading: boolean;
}

export const useDynamicTokenSecurity = () => {
  const { user } = useAuth();
  const { currentUserRole } = useSecureRoles();
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    tokenConfig: null,
    mfaRequired: false,
    mfaReason: null,
    timeUntilRefresh: 0,
    securityLevel: 'medium',
    deviceTrustStatus: 'new',
    loading: true
  });

  const [refreshTimer, setRefreshTimer] = useState<ReturnType<typeof setInterval> | null>(null);

  /**
   * Initialize dynamic token security when user logs in
   */
  const initializeSecurity = useCallback(async () => {
    if (!user) {
      setSecurityStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      setSecurityStatus(prev => ({ ...prev, loading: true }));

      // Apply dynamic token lifetime
      const success = await dynamicTokenManager.applyDynamicTokenLifetime(user.id);
      
      if (success) {
        // Get the calculated token configuration
        const tokenConfig = await dynamicTokenManager.calculateTokenLifetime(user.id, currentUserRole);
        
        // Check MFA requirements
        const mfaRequired = localStorage.getItem('shqipet_mfa_required') === 'true';
        const mfaReason = localStorage.getItem('shqipet_mfa_reason');
        
        // Determine security level
        const securityLevel = determineSecurityLevel(tokenConfig);
        
        // Determine device trust status
        const deviceTrustStatus = tokenConfig.isDeviceTrusted ? 'trusted' : 
          tokenConfig.isNewDevice ? 'new' : 'untrusted';

        setSecurityStatus({
          tokenConfig,
          mfaRequired,
          mfaReason,
          timeUntilRefresh: tokenConfig.lifetimeMinutes * 60, // Convert to seconds
          securityLevel,
          deviceTrustStatus,
          loading: false
        });

        // Start countdown timer
        startRefreshCountdown(tokenConfig.lifetimeMinutes);

        // Show security notifications if needed
        if (mfaRequired) {
          toast.warning('MFA verification required for new device', {
            description: 'Please complete multi-factor authentication to secure your session.',
            duration: 10000
          });
        }

        if (tokenConfig.isNewDevice) {
          toast.info(`New device detected - Session expires in ${tokenConfig.lifetimeMinutes} minutes`, {
            description: 'Trust this device after MFA to extend session lifetime.',
            duration: 8000
          });
        }

        console.log('🔐 Dynamic token security initialized:', tokenConfig);
      }
    } catch (error) {
      console.error('Error initializing dynamic token security:', error);
      setSecurityStatus(prev => ({ 
        ...prev, 
        loading: false,
        securityLevel: 'critical'
      }));
    }
  }, [user, currentUserRole]);

  /**
   * Determine security level based on token configuration
   */
  const determineSecurityLevel = (config: TokenLifetimeConfig): 'low' | 'medium' | 'high' | 'critical' => {
    if (config.requiresMFA && config.isNewDevice) return 'critical';
    if (config.role === 'super_admin') return 'high';
    if (config.isNewDevice) return 'high';
    if (config.role === 'admin') return 'medium';
    return 'low';
  };

  /**
   * Start countdown timer for token refresh
   */
  const startRefreshCountdown = (lifetimeMinutes: number) => {
    if (refreshTimer) {
      clearInterval(refreshTimer);
    }

    let timeLeft = lifetimeMinutes * 60; // Convert to seconds
    
    const timer = setInterval(() => {
      timeLeft -= 1;
      
      setSecurityStatus(prev => ({
        ...prev,
        timeUntilRefresh: Math.max(0, timeLeft)
      }));

      // Show warnings at specific intervals
      if (timeLeft === 300) { // 5 minutes
        toast.warning('Session expires in 5 minutes', {
          description: 'Your session will expire soon. Activity will refresh the token.',
          duration: 5000
        });
      } else if (timeLeft === 120) { // 2 minutes
        toast.error('Session expires in 2 minutes', {
          description: 'Please save your work. The session will expire soon.',
          duration: 10000
        });
      }

      if (timeLeft <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    setRefreshTimer(timer);
  };

  /**
   * Trust current device after successful MFA
   */
  const trustCurrentDevice = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const success = await dynamicTokenManager.markDeviceAsTrusted(user.id);
      
      if (success) {
        // Re-initialize security with new trusted status
        await initializeSecurity();
        
        toast.success('Device marked as trusted', {
          description: 'Your session lifetime has been extended for this device.',
          duration: 5000
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error trusting device:', error);
      toast.error('Failed to trust device');
      return false;
    }
  };

  /**
   * Get security analytics for current user
   */
  const getSecurityAnalytics = async () => {
    if (!user) return null;
    
    try {
      return await dynamicTokenManager.getTokenLifetimeAnalytics(user.id);
    } catch (error) {
      console.error('Error getting security analytics:', error);
      return null;
    }
  };

  /**
   * Force session refresh
   */
  const forceTokenRefresh = async (): Promise<boolean> => {
    try {
      // This would typically be handled by Supabase's auto-refresh
      // But we can manually trigger it if needed
      const { error } = await supabase.auth.refreshSession();
      
      if (!error) {
        toast.success('Session refreshed successfully');
        await initializeSecurity(); // Re-initialize after refresh
        return true;
      } else {
        toast.error('Failed to refresh session');
        return false;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      toast.error('Failed to refresh session');
      return false;
    }
  };

  /**
   * Get formatted time remaining
   */
  const getFormattedTimeRemaining = (): string => {
    const minutes = Math.floor(securityStatus.timeUntilRefresh / 60);
    const seconds = securityStatus.timeUntilRefresh % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  /**
   * Check if MFA is required
   */
  const checkMFARequired = (): boolean => {
    return localStorage.getItem('shqipet_mfa_required') === 'true';
  };

  /**
   * Clear MFA requirement after successful verification
   */
  const clearMFARequirement = () => {
    localStorage.removeItem('shqipet_mfa_required');
    localStorage.removeItem('shqipet_mfa_reason');
    setSecurityStatus(prev => ({
      ...prev,
      mfaRequired: false,
      mfaReason: null
    }));
  };

  // Initialize security when user or role changes
  useEffect(() => {
    if (user && currentUserRole) {
      initializeSecurity();
    }
  }, [user, currentUserRole, initializeSecurity]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
      dynamicTokenManager.cleanup();
    };
  }, [refreshTimer]);

  return {
    securityStatus,
    trustCurrentDevice,
    getSecurityAnalytics,
    forceTokenRefresh,
    getFormattedTimeRemaining,
    checkMFARequired,
    clearMFARequirement,
    initializeSecurity
  };
};