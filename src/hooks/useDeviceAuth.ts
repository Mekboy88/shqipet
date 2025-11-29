import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { deviceAuthService } from '@/services/deviceAuthService';

export const useDeviceAuth = () => {
  const [isDeviceTrusted, setIsDeviceTrusted] = useState(false);
  const [canAutoLogin, setCanAutoLogin] = useState(false);
  const [isNewDevice, setIsNewDevice] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkDeviceStatus = async () => {
      if (!user) {
        setIsDeviceTrusted(false);
        setCanAutoLogin(false);
        setIsNewDevice(false);
        setLoading(false);
        return;
      }

      try {
        // Check if device is trusted
        const trusted = await deviceAuthService.checkDeviceTrust(user.id);
        setIsDeviceTrusted(trusted);

        // Check if auto-login is available
        const deviceState = deviceAuthService.getDeviceAuthState();
        setCanAutoLogin(deviceState?.autoLoginEnabled || false);

        // Check if this is a new device
        const newDevice = await deviceAuthService.isNewDevice(user.id);
        setIsNewDevice(newDevice);

      } catch (error) {
        console.error('Error checking device status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkDeviceStatus();
  }, [user]);

  const trustCurrentDevice = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const success = await deviceAuthService.trustCurrentDevice(user.id);
      if (success) {
        setIsDeviceTrusted(true);
        setCanAutoLogin(true);
        setIsNewDevice(false);
      }
      return success;
    } catch (error) {
      console.error('Error trusting device:', error);
      return false;
    }
  };

  const clearDeviceTrust = () => {
    deviceAuthService.clearDeviceAuthState();
    setIsDeviceTrusted(false);
    setCanAutoLogin(false);
  };

  const attemptAutoLogin = async () => {
    return await deviceAuthService.attemptAutoLogin();
  };

  return {
    isDeviceTrusted,
    canAutoLogin,
    isNewDevice,
    loading,
    trustCurrentDevice,
    clearDeviceTrust,
    attemptAutoLogin
  };
};