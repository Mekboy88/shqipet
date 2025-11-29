import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type AlertSource = 'admin_notifications' | 'security_events' | 'system_issues' | 'brute_force_alerts' | 'notifications';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface UnifiedAlert {
  id: string;
  source: AlertSource;
  title: string;
  message: string;
  severity: AlertSeverity;
  status: 'open' | 'resolved' | 'dismissed';
  created_at: string;
  updated_at?: string;
  metadata?: any;
  user_id?: string;
  resolved_at?: string;
}

const mapToUnifiedAlert = (data: any, source: AlertSource): UnifiedAlert => {
  switch (source) {
    case 'admin_notifications':
      return {
        id: data.id,
        source,
        title: data.title,
        message: data.message,
        severity: data.notification_type === 'critical' ? 'critical' : 'high',
        status: data.read ? 'resolved' : 'open',
        created_at: data.created_at,
        updated_at: data.updated_at,
        metadata: data.metadata,
        user_id: data.user_id,
      };
    case 'security_events':
      return {
        id: data.id,
        source,
        title: data.event_type,
        message: data.event_description || 'Security event detected',
        severity: data.risk_level === 'critical' ? 'critical' : data.risk_level === 'high' ? 'high' : 'medium',
        status: 'open',
        created_at: data.created_at,
        metadata: data.metadata,
        user_id: data.user_id,
      };
    case 'system_issues':
      return {
        id: data.id,
        source,
        title: data.issue_type,
        message: data.issue_description || 'System issue detected',
        severity: data.severity === 'critical' ? 'critical' : data.severity === 'high' ? 'high' : data.severity === 'medium' ? 'medium' : 'low',
        status: data.status || 'open',
        created_at: data.created_at,
        resolved_at: data.resolved_at,
        metadata: data.metadata,
      };
    case 'brute_force_alerts':
      return {
        id: data.id,
        source,
        title: data.alert_type,
        message: `${data.attempt_count} failed attempts detected`,
        severity: 'high',
        status: 'open',
        created_at: data.created_at,
        metadata: { ...data.metadata, ip_address: data.ip_address, attempt_count: data.attempt_count },
        user_id: data.user_id,
      };
    case 'notifications':
      return {
        id: data.id,
        source,
        title: data.title,
        message: data.description || '',
        severity: data.priority === 'critical' ? 'critical' : data.priority === 'high' ? 'high' : data.priority === 'medium' ? 'medium' : 'low',
        status: data.status === 'read' ? 'resolved' : 'open',
        created_at: data.created_at,
        updated_at: data.updated_at,
        metadata: data.metadata,
        user_id: data.user_id,
      };
    default:
      return {
        id: data.id,
        source,
        title: 'Unknown Alert',
        message: 'Alert detected',
        severity: 'info',
        status: 'open',
        created_at: data.created_at,
      };
  }
};

export const useRealtimeAlerts = (filters?: {
  severity?: AlertSeverity[];
  status?: string[];
  source?: AlertSource[];
  timeRange?: string;
  search?: string;
}) => {
  const queryClient = useQueryClient();
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Fetch all alerts
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['realtime-alerts', filters],
    queryFn: async () => {
      const allAlerts: UnifiedAlert[] = [];

      // Fetch from all sources
      const sources: AlertSource[] = filters?.source?.length 
        ? filters.source 
        : ['admin_notifications', 'security_events', 'system_issues', 'brute_force_alerts', 'notifications'];

      for (const source of sources) {
        try {
          const { data, error } = await supabase
            .from(source)
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

          if (error) throw error;
          if (data) {
            allAlerts.push(...data.map((item: any) => mapToUnifiedAlert(item, source)));
          }
        } catch (err) {
          console.error(`Error fetching ${source}:`, err);
        }
      }

      // Sort by created_at DESC
      let filtered = allAlerts.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      // Apply filters
      if (filters?.severity?.length) {
        filtered = filtered.filter(alert => filters.severity!.includes(alert.severity));
      }

      if (filters?.status?.length) {
        filtered = filtered.filter(alert => filters.status!.includes(alert.status));
      }

      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(alert => 
          alert.title.toLowerCase().includes(search) || 
          alert.message.toLowerCase().includes(search)
        );
      }

      if (filters?.timeRange) {
        const now = Date.now();
        const ranges: Record<string, number> = {
          '1h': 60 * 60 * 1000,
          '6h': 6 * 60 * 60 * 1000,
          '24h': 24 * 60 * 60 * 1000,
          '7d': 7 * 24 * 60 * 60 * 1000,
          '30d': 30 * 24 * 60 * 60 * 1000,
        };
        const range = ranges[filters.timeRange];
        if (range) {
          filtered = filtered.filter(alert => 
            now - new Date(alert.created_at).getTime() <= range
          );
        }
      }

      return filtered;
    },
    refetchInterval: 10000, // Refetch every 10 seconds
    staleTime: 5000,
  });

  // Real-time subscriptions
  useEffect(() => {
    const channels = [
      'admin_notifications',
      'security_events',
      'system_issues',
      'brute_force_alerts',
      'notifications'
    ].map(table => {
      return supabase
        .channel(`${table}-realtime`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table
          },
          (payload) => {
            console.log(`Real-time update from ${table}:`, payload);
            
            // Play sound for critical alerts
            if (soundEnabled && payload.eventType === 'INSERT') {
              const alert = mapToUnifiedAlert(payload.new, table as AlertSource);
              if (alert.severity === 'critical') {
                const audio = new Audio('/notification.mp3');
                audio.volume = 0.3;
                audio.play().catch(() => {});
                
                toast.error(alert.title, {
                  description: alert.message,
                  duration: 5000,
                });
              }
            }
            
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['realtime-alerts'] });
          }
        )
        .subscribe();
    });

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [queryClient, soundEnabled]);

  // Calculate statistics
  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical' && a.status === 'open').length,
    open: alerts.filter(a => a.status === 'open').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    resolutionRate: alerts.length > 0 
      ? Math.round((alerts.filter(a => a.status === 'resolved').length / alerts.length) * 100)
      : 0,
  };

  return {
    alerts,
    stats,
    isLoading,
    soundEnabled,
    setSoundEnabled,
  };
};
