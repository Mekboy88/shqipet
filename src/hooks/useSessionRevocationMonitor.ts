import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { deviceDetectionService } from '@/services/deviceDetectionService';
import { toast } from 'sonner';
import { immediateLogoutService } from '@/utils/auth/immediateLogoutService';

/**
 * Monitor for explicit session revocations only (via session_revocations table)
 * Does NOT auto-logout on user_sessions DELETE or heartbeat failures
 * 
 * FIXED: Proper async handling, refs, lowercase normalization, subscription status checking
 */
export const useSessionRevocationMonitor = () => {
  const { user, signOut } = useAuth();
  const deviceStableIdRef = useRef<string | null>(null);
  const deviceInfoRef = useRef<any>(null); // Store full device info for hardware comparison
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const isSettingUpRef = useRef(false);

  useEffect(() => {
    if (!user || isSettingUpRef.current) return;

    isSettingUpRef.current = true;

    const setupMonitoring = async () => {
      try {
        // Get current device info including hardware characteristics
        const deviceInfo = await deviceDetectionService.getDeviceInfo();
        const deviceStableId = deviceInfo.deviceStableId;
        deviceStableIdRef.current = deviceStableId.toLowerCase(); // Normalize to lowercase
        deviceInfoRef.current = deviceInfo; // Store for hardware comparison

        console.log('🔒 Session revocation monitor: Setting up');
        console.log('👤 User ID:', user.id);
        console.log('🖥️ Current Device:', {
          id: deviceStableIdRef.current,
          os: deviceInfo.operatingSystem,
          screen: deviceInfo.screenResolution,
          platform: deviceInfo.platform,
          browser: deviceInfo.browserName
        });

        // Create unique channel name to avoid conflicts
        const channelName = `session-revocation-${deviceStableId}-${Date.now()}`;
        const channel = supabase.channel(channelName);

        // Subscribe ONLY to explicit revocation signals (session_revocations INSERT)
        channel
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'session_revocations',
              filter: `user_id=eq.${user.id}`,
            },
          async (payload) => {
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('🚨 REVOCATION SIGNAL RECEIVED (INSERT event)');
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('Payload:', JSON.stringify(payload, null, 2));
              
              const revokedDeviceId = (payload.new?.device_stable_id || '').toLowerCase().trim();
              const currentDeviceId = (deviceStableIdRef.current || '').toLowerCase().trim();
              
              console.log('📋 Step 1: ID Comparison');
              console.log('  Revoked ID:', revokedDeviceId);
              console.log('  Current ID:', currentDeviceId);
              console.log('  Direct Match:', revokedDeviceId === currentDeviceId);
              
              // Step 1: Check if device IDs match directly
              let shouldLogout = revokedDeviceId === currentDeviceId;
              
              // Step 2: If no direct match, check hardware characteristics
              // This handles different browsers on the same physical device
              if (!shouldLogout) {
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('🔍 No ID match - Checking hardware characteristics');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                
                try {
                  // Fetch the revoked session's hardware info
                  const { data: revokedSession, error } = await supabase
                    .from('user_sessions')
                    .select('operating_system, screen_resolution, platform, device_type')
                    .eq('device_stable_id', revokedDeviceId)
                    .eq('user_id', user.id)
                    .single();
                  
                  if (error) {
                    console.error('❌ Failed to fetch revoked session:', error);
                  } else if (revokedSession) {
                    const currentDevice = deviceInfoRef.current;
                    console.log('📋 Revoked Session Hardware:', revokedSession);
                    console.log('📋 Current Device Hardware:', {
                      os: currentDevice.operatingSystem,
                      screen: currentDevice.screenResolution,
                      platform: currentDevice.platform,
                      type: currentDevice.deviceType
                    });
                    
                    // Compare hardware characteristics (ignoring browser differences)
                    const osMatch = revokedSession.operating_system === currentDevice.operatingSystem;
                    const screenMatch = revokedSession.screen_resolution === currentDevice.screenResolution;
                    const platformMatch = revokedSession.platform === currentDevice.platform;
                    
                    console.log('🔍 Hardware Comparison:');
                    console.log('  OS Match:', osMatch, `(${revokedSession.operating_system} vs ${currentDevice.operatingSystem})`);
                    console.log('  Screen Match:', screenMatch, `(${revokedSession.screen_resolution} vs ${currentDevice.screenResolution})`);
                    console.log('  Platform Match:', platformMatch, `(${revokedSession.platform} vs ${currentDevice.platform})`);
                    
                    // If all hardware characteristics match, it's the same physical device
                    shouldLogout = osMatch && screenMatch && platformMatch;
                    
                    if (shouldLogout) {
                      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                      console.log('⚠️ HARDWARE MATCH - Same physical device detected!');
                      console.log('   This is likely a different browser on the same device');
                      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    } else {
                      console.log('✅ Hardware does NOT match - Different physical device');
                    }
                  }
                } catch (err) {
                  console.error('❌ Error checking hardware characteristics:', err);
                }
              }
              
              // Step 3: Log out if either ID matched or hardware matched
              if (shouldLogout) {
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('⚠️ LOGOUT TRIGGERED - Closing session NOW');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                
                toast.error('Your session was revoked from another device', {
                  description: 'You have been logged out for security reasons.',
                  duration: 5000,
                });

                await new Promise(resolve => setTimeout(resolve, 500));
                
                console.log('🚪 Calling DEVICE-WIDE logout (all tabs will be logged out)...');
                await immediateLogoutService.performDeviceWideLogout();
                console.log('✅ Device-wide logout completed');
                
                console.log('🚪 Calling signOut() for cleanup...');
                await signOut();
                console.log('✅ signOut() completed');
              } else {
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('✅ NO MATCH - Different device, ignoring revocation');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              }
            }
          )
          .subscribe((status, err) => {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📡 Session Revocation Monitor Status:', status);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            if (err) {
              console.error('❌ Subscription error:', err);
              isSettingUpRef.current = false;
              return;
            }
            
            if (status === 'SUBSCRIBED') {
              console.log('✅ MONITOR ACTIVE - Listening for revocations');
              console.log('   User ID:', user.id);
              console.log('   Device ID:', deviceStableIdRef.current);
              console.log('   Channel:', channelName);
              channelRef.current = channel;
              isSettingUpRef.current = false;
            } else if (status === 'CHANNEL_ERROR') {
              console.error('❌ CHANNEL ERROR - Monitor failed to subscribe');
              isSettingUpRef.current = false;
            } else if (status === 'TIMED_OUT') {
              console.warn('⏱️ SUBSCRIPTION TIMED OUT - Retrying in 2 seconds...');
              setTimeout(() => {
                if (user && !channelRef.current) {
                  console.log('🔄 Retrying subscription...');
                  isSettingUpRef.current = false;
                  setupMonitoring(); // Retry once
                }
              }, 2000);
            } else if (status === 'CLOSED') {
              console.log('🔒 Channel closed');
              isSettingUpRef.current = false;
            }
          });

      } catch (error) {
        console.error('❌ Failed to setup session revocation monitor:', error);
        isSettingUpRef.current = false;
      }
    };

    setupMonitoring();

    // Cleanup
    return () => {
      if (channelRef.current) {
        console.log('🔓 Session revocation monitor: Cleaning up');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      deviceStableIdRef.current = null;
      deviceInfoRef.current = null;
      isSettingUpRef.current = false;
    };
  }, [user, signOut]);
};
