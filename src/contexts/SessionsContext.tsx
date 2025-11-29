import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';
import type { RealtimeChannel } from '@supabase/supabase-js';

type UserSession = Database['public']['Tables']['user_sessions']['Row'];

interface SessionsContextValue {
  sessions: UserSession[];
  loading: boolean;
  error: string | null;
  currentDeviceId: string | null;
  refreshSessions: () => Promise<void>;
  trustDevice: (deviceStableId: string) => Promise<void>;
  revokeSession: (deviceStableId: string) => Promise<void>;
  revokeAllOtherDevices: () => Promise<void>;
}

const SessionsContext = createContext<SessionsContextValue | undefined>(undefined);

export const SessionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);

  // Create stable device fingerprint for bulletproof one-card-per-device
  const createDeviceFingerprint = (s: UserSession): string => {
    const os = (s.operating_system || '').toLowerCase().trim();
    const browser = (s.browser_name || '').toLowerCase().trim();
    const browserVersion = (s.browser_version || '').split('.')[0] || '';
    const platform = (s.platform || '').toLowerCase().trim();
    const resolution = (s.screen_resolution || '').toLowerCase().trim();
    
    return `${os}::${browser}::${browserVersion}::${platform}::${resolution}`;
  };

  const deduplicateSessions = (sessionsArray: UserSession[]): UserSession[] => {
    const groups = new Map<string, UserSession[]>();
    
    // Group sessions by fingerprint
    for (const session of sessionsArray) {
      const fingerprint = createDeviceFingerprint(session);
      const group = groups.get(fingerprint) || [];
      group.push(session);
      groups.set(fingerprint, group);
    }
    
    // Aggregate each group into a single canonical session
    const deduplicated: UserSession[] = [];
    const currentDeviceStableId = localStorage.getItem('device_stable_id')?.toLowerCase();
    
    for (const [fingerprint, group] of groups.entries()) {
      // Find canonical: prefer current device's stable_id, otherwise most recent
      let canonical = group.find(s => 
        s.device_stable_id?.toLowerCase() === currentDeviceStableId
      ) || group.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )[0];
      
      // Aggregate data from all sessions in group
      const aggregated: UserSession = {
        ...canonical,
        active_tabs_count: canonical.active_tabs_count, // Use canonical count, not sum
        is_current_device: group.some(s => s.is_current_device),
        is_trusted: group.some(s => s.is_trusted),
        created_at: group.reduce((earliest, s) => 
          s.created_at < earliest ? s.created_at : earliest, 
          group[0].created_at
        ),
        updated_at: group.reduce((latest, s) => 
          s.updated_at > latest ? s.updated_at : latest,
          group[0].updated_at
        ),
        device_stable_id: canonical.device_stable_id || fingerprint,
      };
      
      deduplicated.push(aggregated);
    }
    
    if (groups.size < sessionsArray.length) {
      console.warn(`⚠️ Merged ${sessionsArray.length - groups.size} duplicate device entries into ${groups.size} cards`);
    }
    
    return deduplicated;
  };

  // Fetch all sessions for the user
  const refreshSessions = async () => {
    if (!user) {
      setSessions([]);
      setCurrentDeviceId(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get current device ID from local storage (instant detection)
      const localDeviceId = localStorage.getItem('device_stable_id');
      if (localDeviceId) {
        setCurrentDeviceId(localDeviceId);
      }

      const { data, error: fetchError } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const dedupedSessions = deduplicateSessions(data || []);
      setSessions(dedupedSessions);

      // Verify current device from database (fallback)
      if (!localDeviceId) {
        const current = dedupedSessions.find(s => s.is_current_device);
        if (current) {
          setCurrentDeviceId(current.device_stable_id);
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch sessions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Trust a device
  const trustDevice = async (deviceStableId: string) => {
    if (!user) return;

    try {
      const session = sessions.find(s => s.device_stable_id === deviceStableId);
      if (!session) return;

      const newTrustedState = !session.is_trusted;

      console.log('🔄 Toggling trust for device:', deviceStableId, 'from', session.is_trusted, 'to', newTrustedState);

      const { error: invokeError } = await supabase.functions.invoke('manage-session', {
        body: {
          action: 'trust',
          sessionData: {
            deviceStableId,
            isTrusted: newTrustedState,
          },
        },
      });

      if (invokeError) throw invokeError;

      console.log('✅ Trust toggle successful');
      toast.success(newTrustedState ? 'Device trusted' : 'Device untrusted');
    } catch (err: any) {
      console.error('❌ Failed to trust device:', err);
      toast.error('Failed to update device trust status');
    }
  };

  // Revoke a session
  const revokeSession = async (deviceStableId: string) => {
    if (!user) return;

    // Prevent revoking current device
    if (deviceStableId === currentDeviceId) {
      toast.error('Cannot revoke current device');
      return;
    }

    try {
      const { error: invokeError } = await supabase.functions.invoke('manage-session', {
        body: {
          action: 'revoke',
          deviceStableId: deviceStableId.toLowerCase(), // Normalize for consistent matching
        },
      });

      if (invokeError) throw invokeError;

      toast.success('Device logged out successfully');
    } catch (err: any) {
      console.error('Failed to revoke session:', err);
      toast.error('Failed to log out device');
    }
  };

  // Revoke all other devices
  const revokeAllOtherDevices = async () => {
    if (!user || !currentDeviceId) return;

    const otherDevices = sessions.filter(s => s.device_stable_id !== currentDeviceId);
    if (otherDevices.length === 0) {
      toast.info('No other devices to log out');
      return;
    }

    try {
      for (const session of otherDevices) {
        await supabase.functions.invoke('manage-session', {
          body: {
            action: 'revoke',
            deviceStableId: session.device_stable_id.toLowerCase(), // Normalize for consistent matching
          },
        });
      }

      toast.success(`Logged out ${otherDevices.length} device(s)`);
    } catch (err: any) {
      console.error('Failed to revoke all devices:', err);
      toast.error('Failed to log out all devices');
    }
  };

  // Optimistic UI updates via BroadcastChannel
  useEffect(() => {
    if (!user) return;
    
    const bc = new BroadcastChannel('lovable_session_tabs');
    
    const adjustTabCount = (deviceId: string, delta: number, sequence: number) => {
      setSessions(prev => prev.map(s => {
        if (s.device_stable_id?.toLowerCase() === deviceId?.toLowerCase()) {
          // Use sequence instead of timestamp to avoid clock skew issues
          const lastSequence = (s as any).__optimisticSequence || 0;
          if (sequence <= lastSequence) {
            console.log(`⏭️ Skipping duplicate optimistic update (seq ${sequence} <= ${lastSequence})`);
            return s;
          }
          
          const newCount = Math.max((s.active_tabs_count || 0) + delta, 0);
          console.log(`📊 Optimistic update: ${s.device_stable_id} ${delta > 0 ? '+' : ''}${delta} → ${newCount} tabs (seq ${sequence})`);
          return { 
            ...s, 
            active_tabs_count: newCount,
            __optimisticSequence: sequence 
          };
        }
        return s;
      }));
    };
    
    bc.onmessage = (e) => {
      const { type, deviceStableId, sequence } = e.data || {};
      if (!deviceStableId || typeof sequence !== 'number') return;
      
      if (type === 'tab_opened') {
        adjustTabCount(deviceStableId, +1, sequence);
      } else if (type === 'tab_closed') {
        adjustTabCount(deviceStableId, -1, sequence);
      }
    };
    
    return () => bc.close();
  }, [user]);

  // Setup realtime subscriptions
  useEffect(() => {
    if (!user) {
      setSessions([]);
      setCurrentDeviceId(null);
      return;
    }

    // Set current device immediately from localStorage
    const localDeviceId = localStorage.getItem('device_stable_id');
    if (localDeviceId) {
      setCurrentDeviceId(localDeviceId);
    }

    console.log('📡 Setting up global sessions realtime subscriptions');

    let sessionsChannel: RealtimeChannel | null = null;
    let revocationsChannel: RealtimeChannel | null = null;

    const setupSubscriptions = async () => {
      // Initial fetch
      await refreshSessions();

      // Subscribe to user_sessions changes
      sessionsChannel = supabase
        .channel('global-sessions-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_sessions',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('📡 Session realtime event:', payload.eventType, payload);

            if (payload.eventType === 'UPDATE') {
              const updatedSession = payload.new as UserSession;
              
              // Fast path for tab count updates - update in-place without full deduplication
              setSessions(prev => {
                const index = prev.findIndex(s => s.id === updatedSession.id);
                
                if (index === -1) {
                  // Session doesn't exist yet, add it with deduplication
                  return deduplicateSessions([...prev, updatedSession]);
                }
                
                // Update the specific session in-place
                const updated = [...prev];
                const oldSession = updated[index];
                
                const optimisticSeq = (oldSession as any).__optimisticSequence || 0;
                const realtimeAge = Date.now() - new Date(updatedSession.updated_at).getTime();
                
                // If we have optimistic updates AND realtime data is old, keep optimistic
                if (optimisticSeq > 0 && realtimeAge > 800) {
                  console.log(`⏭️ Keeping optimistic count (${oldSession.active_tabs_count}) over stale realtime (${updatedSession.active_tabs_count}), age: ${realtimeAge}ms`);
                  return prev;
                }
                
                // Apply realtime update and clear optimistic sequence
                updated[index] = { ...oldSession, ...updatedSession, __optimisticSequence: 0 } as UserSession;
                console.log(`📊 Realtime tab count: ${updatedSession.device_stable_id} → ${updatedSession.active_tabs_count} tabs`);
                
                // Only run deduplication if hardware characteristics changed (not just tab count)
                if (
                  oldSession.operating_system !== updatedSession.operating_system ||
                  oldSession.platform !== updatedSession.platform ||
                  oldSession.screen_resolution !== updatedSession.screen_resolution ||
                  oldSession.browser_name !== updatedSession.browser_name
                ) {
                  console.log('🔄 Device characteristics changed, running deduplication');
                  return deduplicateSessions(updated);
                }
                
                return updated;
              });
            } else if (payload.eventType === 'INSERT') {
              const newSession = payload.new as UserSession;
              setSessions(prev => {
                const allSessions = [...prev.filter(s => s.id !== newSession.id), newSession];
                return deduplicateSessions(allSessions);
              });
            } else if (payload.eventType === 'DELETE') {
              const oldSession = payload.old as Partial<UserSession>;
              setSessions(prev => {
                const filtered = prev.filter(s => s.id !== oldSession.id);
                return deduplicateSessions(filtered);
              });
              console.log('🗑️ Session deleted, card removed instantly');
            }
          }
        )
        .subscribe((status) => {
          console.log('📡 Global sessions subscription status:', status);
        });

      // Subscribe to session_revocations (instant card removal signal)
      revocationsChannel = supabase
        .channel('global-revocations-signal')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'session_revocations',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('🚨 Revocation signal received:', payload);
            const revocation = payload.new as { device_stable_id: string };
            
            // Remove card instantly (before DELETE event arrives)
            setSessions(prev => prev.filter(s => s.device_stable_id !== revocation.device_stable_id));
            console.log('🗑️ Card removed instantly via revocation signal');
          }
        )
        .subscribe((status) => {
          console.log('📡 Global revocations subscription status:', status);
        });
    };

    setupSubscriptions();

    return () => {
      console.log('🔌 Cleaning up global sessions subscriptions');
      if (sessionsChannel) supabase.removeChannel(sessionsChannel);
      if (revocationsChannel) supabase.removeChannel(revocationsChannel);
    };
  }, [user]);

  const value: SessionsContextValue = {
    sessions,
    loading,
    error,
    currentDeviceId,
    refreshSessions,
    trustDevice,
    revokeSession,
    revokeAllOtherDevices,
  };

  return <SessionsContext.Provider value={value}>{children}</SessionsContext.Provider>;
};

export const useSessions = () => {
  const context = useContext(SessionsContext);
  if (context === undefined) {
    throw new Error('useSessions must be used within a SessionsProvider');
  }
  return context;
};
