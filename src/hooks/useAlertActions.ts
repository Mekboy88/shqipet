import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UnifiedAlert, AlertSource } from './useRealtimeAlerts';

export const useAlertActions = () => {
  const queryClient = useQueryClient();

  const resolveAlert = useMutation({
    mutationFn: async ({ alert }: { alert: UnifiedAlert }) => {
      switch (alert.source) {
        case 'admin_notifications':
          return await supabase
            .from('admin_notifications')
            .update({ read: true, updated_at: new Date().toISOString() })
            .eq('id', alert.id);
        
        case 'system_issues':
          return await supabase
            .from('system_issues')
            .update({ status: 'resolved', resolved_at: new Date().toISOString() })
            .eq('id', alert.id);
        
        case 'notifications':
          return await supabase
            .from('notifications')
            .update({ status: 'read', updated_at: new Date().toISOString() })
            .eq('id', alert.id);
        
        case 'security_events':
          return await supabase
            .from('security_events')
            .delete()
            .eq('id', alert.id);
        
        case 'brute_force_alerts':
          return await supabase
            .from('brute_force_alerts')
            .delete()
            .eq('id', alert.id);
        
        default:
          return { data: null, error: null };
      }
    },
    onSuccess: () => {
      toast.success('Alert resolved successfully');
      queryClient.invalidateQueries({ queryKey: ['realtime-alerts'] });
    },
    onError: (error) => {
      toast.error('Failed to resolve alert');
      console.error('Resolve alert error:', error);
    },
  });

  const dismissAlert = useMutation({
    mutationFn: async ({ alert }: { alert: UnifiedAlert }) => {
      switch (alert.source) {
        case 'admin_notifications':
          return await supabase
            .from('admin_notifications')
            .delete()
            .eq('id', alert.id);
        
        case 'notifications':
          return await supabase
            .from('notifications')
            .delete()
            .eq('id', alert.id);
        
        case 'security_events':
          return await supabase
            .from('security_events')
            .delete()
            .eq('id', alert.id);
        
        case 'brute_force_alerts':
          return await supabase
            .from('brute_force_alerts')
            .delete()
            .eq('id', alert.id);
        
        default:
          return { data: null, error: null };
      }
    },
    onSuccess: () => {
      toast.success('Alert dismissed');
      queryClient.invalidateQueries({ queryKey: ['realtime-alerts'] });
    },
    onError: (error) => {
      toast.error('Failed to dismiss alert');
      console.error('Dismiss alert error:', error);
    },
  });

  const createTestAlert = useMutation({
    mutationFn: async ({ type }: { type: AlertSource }) => {
      const testData = {
        admin_notifications: {
          title: 'Test Admin Alert',
          message: 'This is a test admin notification',
          notification_type: 'info',
          read: false,
        },
        security_events: {
          event_type: 'Test Security Event',
          event_description: 'This is a test security event',
          risk_level: 'medium',
        },
        brute_force_alerts: {
          ip_address: '192.168.1.100',
          attempt_count: 5,
          alert_level: 'medium',
          last_attempt: new Date().toISOString(),
        },
        system_issues: {
          issue_type: 'Test System Issue',
          issue_description: 'This is a test system issue',
          severity: 'low',
          status: 'open',
        },
        notifications: {
          title: 'Test Notification',
          description: 'This is a test notification',
          type: 'info',
          priority: 'medium',
          status: 'unread',
        },
      };

      const data = testData[type as keyof typeof testData];
      if (!data) throw new Error('Invalid alert type');

      return await supabase.from(type).insert([data]);
    },
    onSuccess: () => {
      toast.success('Test alert created');
      queryClient.invalidateQueries({ queryKey: ['realtime-alerts'] });
    },
    onError: (error) => {
      toast.error('Failed to create test alert');
      console.error('Create test alert error:', error);
    },
  });

  return {
    resolveAlert,
    dismissAlert,
    createTestAlert,
  };
};
