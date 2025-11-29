import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export type FetchHealthStatus = 'healthy' | 'recovering' | 'degraded' | 'offline';

interface Options {
  notify?: boolean; // show toast to super admin on recovery
  checkIntervalMs?: number; // default 20s
}

export function useFetchGuardian(options: Options = {}) {
  const { notify = true, checkIntervalMs = 20000 } = options;
  const { user } = useAuth();
  const [status, setStatus] = useState<FetchHealthStatus>('healthy');
  const recoveredRef = useRef(false);
  const lastNotifiedAtRef = useRef(0);

  const isSuperAdmin = () => {
    const role = (user as any)?.user_metadata?.role || (user as any)?.app_metadata?.role || (user as any)?.role;
    return role === 'super_admin' || role === 'admin';
  };

  // Log event for auditing/visibility
  const logEvent = async (action: string, details: Record<string, any>) => {
    try {
      await supabase.from('user_activity_logs').insert({
        action,
        details,
        user_id: user?.id ?? null,
      });
    } catch {
      // Silently ignore logging failures
    }
  };

  const probeSupabase = async (): Promise<boolean> => {
    // Try a few lightweight, progressively permissive checks
    try {
      const sessionRes = await supabase.auth.getSession();
      if (sessionRes?.data?.session) return true;
    } catch {}

    try {
      const userRes = await supabase.auth.getUser();
      if (userRes?.data?.user) return true;
    } catch {}

    try {
      const { error } = await supabase.from('app_settings').select('id').limit(1);
      if (!error) return true;
    } catch {}

    try {
      const { error } = await supabase.rpc('get_upload_configuration');
      if (!error) return true;
    } catch {}

    return false;
  };

  const resubscribeRealtimeChannels = () => {
    try {
      const channels = (supabase as any).getChannels?.() || [];
      channels.forEach((ch: any) => {
        try {
          // Attempt to subscribe if not already; Realtime client will no-op if already subscribed
          ch.subscribe?.();
        } catch {}
      });
    } catch {}
  };

  const attemptRecover = async (reason: string) => {
    setStatus((s) => (s === 'offline' ? 'recovering' : s));
    try {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess?.session) {
        // try refreshing the session
        try {
          await supabase.auth.refreshSession();
        } catch {}
      }

      // Probe DB/Realtime health
      const ok = await probeSupabase();

      if (ok) {
        setStatus('healthy');
        resubscribeRealtimeChannels();

        // Notify super admin once per minute at most
        if (!recoveredRef.current) {
          recoveredRef.current = true;
          logEvent('fetch_auto_recovered', { reason, at: new Date().toISOString() });
          if (notify && isSuperAdmin() && Date.now() - lastNotifiedAtRef.current > 60000) {
            toast.success('Connection recovered', {
              description: 'Systems are back in real-time sync.',
            });
            lastNotifiedAtRef.current = Date.now();
          }
        }
      } else {
        setStatus('degraded');
      }
    } catch (e: any) {
      setStatus('degraded');
    }
  };

  useEffect(() => {
    const onOffline = () => {
      setStatus('offline');
      recoveredRef.current = false;
      logEvent('fetch_offline_detected', { at: new Date().toISOString() });
    };
    const onOnline = () => {
      setStatus('recovering');
      attemptRecover('online_event');
    };

    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);

    // Initial probe
    attemptRecover('initial_probe');

    const id = window.setInterval(() => {
      attemptRecover('periodic_probe');
    }, checkIntervalMs);

    return () => {
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
      window.clearInterval(id);
    };
  }, [checkIntervalMs]);

  return { status };
}
