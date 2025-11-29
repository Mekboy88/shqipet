import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { perTabSupabase } from '@/integrations/supabase/perTabClient';
import { deviceDetectionService } from '@/services/deviceDetectionService';
import { toast } from 'sonner';
import { immediateLogoutService } from '@/utils/auth/immediateLogoutService';

const SessionBootstrapper = () => {
  const { user } = useAuth();
  const registrationPendingRef = useRef(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    console.log('📍 SessionBootstrapper: Registering user session', user.id);

    const TAB_FLAG = '__tab_session_registered_v1';
    let registered = sessionStorage.getItem(TAB_FLAG) === '1';
    let pending = sessionStorage.getItem(TAB_FLAG) === 'pending';
    let decremented = false;

    // Per-tab stable ID to detect reload vs real close
    const TAB_ID_KEY = '__tab_instance_id_v1';
    let tabId = sessionStorage.getItem(TAB_ID_KEY);
    if (!tabId) {
      try {
        tabId = crypto.randomUUID();
      } catch {
        tabId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      }
      sessionStorage.setItem(TAB_ID_KEY, tabId);
    }

    // Sequence counter for BroadcastChannel messages (avoids clock skew issues)
    let broadcastSequence = 0;

    // BroadcastChannel for cross-tab coordination
    const channel = new BroadcastChannel('lovable_session_tabs');
    let gotPong = false;
    let cancelPending = false;
    let hideTimer: number | null = null;
    let decrementLock = false;

    const cancelDecrement = () => {
      cancelPending = true;
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
    };

    const scheduleDecrement = () => {
      if (decremented || hideTimer || decrementLock) return;
      cancelPending = false;
      hideTimer = window.setTimeout(() => {
        if (!cancelPending && !decrementLock) {
          decrementLock = true;
          decrementTabCount();
        }
        hideTimer = null;
      }, 500); // Reduced delay for faster response
    };

    const announceGoodbye = async () => {
      try {
        const deviceStableId = await deviceDetectionService.getCurrentDeviceStableId();
        channel.postMessage({ type: 'goodbye', tabId, deviceStableId });
        // Fallback local decrement attempt
        scheduleDecrement();
      } catch (e) {
        console.warn('Failed to announce goodbye', e);
      }
    };

    channel.onmessage = (event) => {
      const data = event.data;
      if (data?.type === 'ping') {
        channel.postMessage({ type: 'pong' });
      } else if (data?.type === 'pong') {
        gotPong = true;
      } else if (data?.type === 'hello' && data?.tabId === tabId) {
        // Same-tab reload detected: cancel any pending decrement
        cancelDecrement();
      } else if (data?.type === 'decrementing') {
        // Another tab is handling decrement, back off
        decrementLock = true;
        cancelDecrement();
      } else if (data?.type === 'goodbye' && data?.tabId !== tabId) {
        // A peer is closing: one tab should handle decrement immediately
        const tryHandle = async () => {
          try {
            const hasLocks = (navigator as any).locks && typeof (navigator as any).locks.request === 'function';
            if (hasLocks) {
              await (navigator as any).locks.request('manage-session-decrement', { ifAvailable: true, mode: 'exclusive' }, async (lock: any) => {
                if (!lock) return;
                if (!decrementLock) {
                  decrementLock = true;
                  await decrementTabCount();
                }
              });
            } else {
              if (!decrementLock) {
                decrementLock = true;
                await decrementTabCount();
              }
            }
          } catch (e) {
            console.warn('Peer-assisted decrement failed', e);
          }
        };
        tryHandle();
      }
    };

    // Announce presence immediately (used to cancel pending decrement on reload)
    const announceHello = async () => {
      try {
        const deviceStableId = await deviceDetectionService.getCurrentDeviceStableId();
        channel.postMessage({ type: 'hello', tabId, deviceStableId });
      } catch (e) {
        channel.postMessage({ type: 'hello', tabId });
      }
    };
    announceHello();
    
    const registerSession = async () => {
      if (registered || pending || registrationPendingRef.current) {
        console.log('ℹ️ Session already registered for this tab — skipping');
        return;
      }
      
      registrationPendingRef.current = true;
      sessionStorage.setItem(TAB_FLAG, 'pending');
      
      try {
        // Probe for other open tabs
        gotPong = false;
        channel.postMessage({ type: 'ping' });
        await new Promise((r) => setTimeout(r, 100)); // Reduced wait time
        const hasPeers = gotPong;

        const deviceInfo = await deviceDetectionService.getDeviceInfo();
        const location = await deviceDetectionService.getBrowserLocation().catch(() => null);

        const sessionData = {
          ...deviceInfo,
          latitude: location?.latitude,
          longitude: location?.longitude,
          resetTabs: !hasPeers, // if no peers responded, re-baseline to 1
        } as const;

        console.log('📍 Registering session with device info:', deviceInfo.deviceStableId, 'resetTabs:', sessionData.resetTabs);

        const { data: response, error: invokeError } = await supabase.functions.invoke('manage-session', {
          body: {
            action: 'upsert',
            sessionData,
          },
        });

        if (invokeError) {
          const status = (invokeError as any)?.context?.status || (invokeError as any)?.status;
          const body = (invokeError as any)?.context?.body || (invokeError as any)?.body;
          const code = body?.error || body?.code || (invokeError as any)?.code;
          const message = body?.message || (invokeError as any)?.message || '';
          const isRevoked = code === 'DEVICE_REVOKED' || String(message).includes('DEVICE_REVOKED') || status === 403;

          if (isRevoked) {
            console.log('🚫 DEVICE_REVOKED detected during registration - signing out immediately');
            toast.error('This device was revoked', {
              description: 'You have been signed out for security reasons.',
              duration: 5000,
            });
            await immediateLogoutService.performImmediateLogout(false);
            return;
          }

          throw invokeError;
        }

        registered = true;
        sessionStorage.setItem(TAB_FLAG, '1');
        console.log('✅ Session registered successfully, new tab count:', response?.count || 'unknown');
        
        // Broadcast tab_opened for optimistic UI update
        channel.postMessage({ 
          type: 'tab_opened', 
          deviceStableId: deviceInfo.deviceStableId, 
          tabId,
          sequence: ++broadcastSequence // Use incrementing sequence
        });
      } catch (err: any) {
        console.error('Failed to register session:', err);
        toast.error('Failed to register device session', { description: err.message });
      } finally {
        registrationPendingRef.current = false;
      }
    };

    const decrementTabCount = async () => {
      if (!registered || decremented || decrementLock) return;
      
      // Signal to other tabs that this one is handling the decrement
      channel.postMessage({ type: 'decrementing' });
      
      decremented = true;
      let deviceStableId: string | null = null;
      
      try {
        deviceStableId = await deviceDetectionService.getCurrentDeviceStableId();
        console.log('📍 Tab closing/hidden, decrementing count for:', deviceStableId);

        const { data: response, error: decrementError } = await supabase.functions.invoke('manage-session', {
          body: {
            action: 'tab_close',
            deviceStableId,
          },
        });
        
        if (decrementError) {
          console.error('❌ Tab decrement error:', decrementError);
        } else {
          console.log('✅ Tab count decremented successfully, new count:', response?.count || 'unknown');
          // Broadcast tab_closed for optimistic UI update
          if (deviceStableId) {
            channel.postMessage({ 
              type: 'tab_closed', 
              deviceStableId, 
              tabId,
              sequence: ++broadcastSequence // Use incrementing sequence
            });
          }
        }
      } catch (err) {
        console.error('Failed to decrement tab count (best effort):', err);
      } finally {
        // Keep TAB_FLAG during tab lifetime; sessionStorage clears on real tab close
      }
    };

    // Register on mount (guarded)
    registerSession();

    // Decrement on explicit logout instantly
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        announceGoodbye();
        decrementTabCount();
      }
    });

    // Decrement only on real close/unload. Do NOT decrement on tab hide/switch.
    const onPageHide = () => {
      announceGoodbye();
      
      // sendBeacon fallback: guaranteed delivery even if page unloads
      if (!decremented && registered) {
        (async () => {
          try {
            const deviceStableId = await deviceDetectionService.getCurrentDeviceStableId();
            const session = await supabase.auth.getSession();
            const authToken = session?.data?.session?.access_token;
            
            if (authToken) {
              const payload = JSON.stringify({ 
                action: 'tab_close', 
                deviceStableId 
              });
              const beaconUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-session`;
              
              // Create FormData for beacon (more reliable than Blob in some browsers)
              const formData = new FormData();
              formData.append('Authorization', `Bearer ${authToken}`);
              formData.append('payload', payload);
              
              const success = navigator.sendBeacon(beaconUrl, new Blob([payload], { type: 'application/json' }));
              if (success) {
                console.log('📡 Sent beacon fallback for tab close');
              }
            }
          } catch (e) {
            console.warn('Beacon fallback failed:', e);
          }
        })();
      }
      
      scheduleDecrement();
    };
    const onBeforeUnload = () => {
      announceGoodbye();
      scheduleDecrement();
    };

    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('beforeunload', onBeforeUnload);
      // Unsubscribe auth listener
      (authListener as any)?.subscription?.unsubscribe?.();
    };
  }, [user]);

  return null;
};

export default SessionBootstrapper;
