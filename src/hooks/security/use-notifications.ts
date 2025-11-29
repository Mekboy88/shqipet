import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export interface NotificationData {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  linked_module: string;
  linked_scan_id: string;
  tags: string[];
  source: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // Listen for real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as NotificationData[];
    },
    // Stop aggressive polling; rely on realtime + manual invalidations
    refetchInterval: false,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('status', 'unread');
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const createNotification = useMutation({
    mutationFn: async (notificationData: { title: string; description?: string; type?: string; priority?: string; linked_module?: string; linked_scan_id?: string; source?: string }) => {
      const { data, error } = await supabase
        .from('notifications')
        .insert([notificationData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const getUnreadCount = () => {
    return notifications?.filter(n => n.status === 'unread').length || 0;
  };

  const getCriticalNotifications = () => {
    return notifications?.filter(n => n.priority === 'critical' && n.status === 'unread') || [];
  };

  return {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
    createNotification,
    getUnreadCount,
    getCriticalNotifications
  };
};