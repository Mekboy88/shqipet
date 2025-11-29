import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ActivityMetrics {
  activeUploadSessions: number;
  flaggedUsers: number;
  queueStatus: number;
  autoPausedUsers: number;
  successRate: string;
}

export const useActivityMonitor = () => {
  const [metrics, setMetrics] = useState<ActivityMetrics>({
    activeUploadSessions: 0,
    flaggedUsers: 0,
    queueStatus: 0,
    autoPausedUsers: 0,
    successRate: 'No data'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivityMetrics = async () => {
    try {
      setError(null);

      // Get active upload sessions (users with recent activity)
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const { data: activeSessions, error: sessionsError } = await supabase
        .from('user_activity_logs')
        .select('user_id')
        .gte('created_at', tenMinutesAgo)
        .eq('action', 'file_upload');

      if (sessionsError) throw sessionsError;

      // Get flagged users in last 24h
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: flaggedEvents, error: flaggedError } = await supabase
        .from('security_events')
        .select('user_id')
        .gte('created_at', twentyFourHoursAgo)
        .in('event_type', ['abuse_detected', 'rapid_upload_flagged', 'suspicious_activity']);

      if (flaggedError) throw flaggedError;

      // Get processing queue status (no actual queue system implemented)
      const queueSize = 0;

      // Get auto-paused users (no pause system implemented)
      const pausedUsers = 0;

      // Calculate success rate from recent uploads
      const { data: recentUploads, error: uploadsError } = await supabase
        .from('user_activity_logs')
        .select('details')
        .gte('created_at', twentyFourHoursAgo)
        .eq('action', 'file_upload');

      if (uploadsError) throw uploadsError;

      let successfulUploads = 0;
      let totalUploads = recentUploads?.length || 0;

      if (recentUploads) {
        successfulUploads = recentUploads.filter(upload => 
          upload.details && typeof upload.details === 'object' && 
          (upload.details as any).status === 'success'
        ).length;
      }

      const successRate = totalUploads > 0 
        ? ((successfulUploads / totalUploads) * 100).toFixed(1) + '%'
        : 'No data';

      // Get unique active sessions
      const uniqueActiveSessions = new Set(activeSessions?.map(s => s.user_id)).size;
      
      // Get unique flagged users
      const uniqueFlaggedUsers = new Set(flaggedEvents?.map(e => e.user_id)).size;

      setMetrics({
        activeUploadSessions: uniqueActiveSessions,
        flaggedUsers: uniqueFlaggedUsers,
        queueStatus: queueSize,
        autoPausedUsers: pausedUsers,
        successRate
      });
    } catch (err) {
      console.error('Error fetching activity metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch activity metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchActivityMetrics();
    
    // Set up real-time subscriptions for activity monitoring
    const activityChannel = supabase
      .channel('activity-monitor')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_activity_logs'
        },
        (payload) => {
          console.log('🔄 Real-time activity update:', payload);
          fetchActivityMetrics();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'security_events'
        },
        (payload) => {
          console.log('🔄 Real-time security update:', payload);
          fetchActivityMetrics();
        }
      )
      .subscribe();

    // Periodic refresh every 60 seconds for metric updates
    const interval = setInterval(() => {
      fetchActivityMetrics();
    }, 60000);
    
    return () => {
      supabase.removeChannel(activityChannel);
      clearInterval(interval);
    };
  }, []);

  return {
    metrics,
    loading,
    error,
    refetch: fetchActivityMetrics
  };
};