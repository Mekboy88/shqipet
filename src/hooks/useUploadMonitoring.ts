import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UploadLog {
  id: string;
  user_id: string | null;
  post_id: string | null;
  file_name: string | null;
  file_size: number | null;
  file_type: string | null;
  upload_status: string;
  progress: number;
  error_message: string | null;
  upload_url: string | null;
  started_at: string;
  completed_at: string | null;
  metadata: any;
}

export interface UploadStats {
  total: number;
  completed: number;
  failed: number;
  pending: number;
  successRate: number;
}

export const useUploadMonitoring = () => {
  const [logs, setLogs] = useState<UploadLog[]>([]);
  const [stats, setStats] = useState<UploadStats>({
    total: 0,
    completed: 0,
    failed: 0,
    pending: 0,
    successRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('upload_logs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setLogs(data || []);
      
      // Calculate stats
      const total = data?.length || 0;
      const completed = data?.filter(log => log.upload_status === 'completed').length || 0;
      const failed = data?.filter(log => log.upload_status === 'failed').length || 0;
      const pending = data?.filter(log => log.upload_status === 'pending' || log.upload_status === 'processing').length || 0;
      const successRate = total > 0 ? (completed / total) * 100 : 0;

      setStats({
        total,
        completed,
        failed,
        pending,
        successRate
      });
    } catch (error: any) {
      console.error('Error fetching upload logs:', error);
      toast.error('Failed to load upload logs');
    } finally {
      setIsLoading(false);
    }
  };

  const retryUpload = async (logId: string) => {
    try {
      const { error } = await supabase
        .from('upload_logs')
        .update({ 
          upload_status: 'pending',
          error_message: null,
          progress: 0
        })
        .eq('id', logId);

      if (error) throw error;

      toast.success('Upload queued for retry');
      fetchLogs();
    } catch (error: any) {
      console.error('Error retrying upload:', error);
      toast.error('Failed to retry upload');
    }
  };

  const clearLogs = async () => {
    try {
      const { error } = await supabase
        .from('upload_logs')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) throw error;

      toast.success('Upload logs cleared');
      fetchLogs();
    } catch (error: any) {
      console.error('Error clearing logs:', error);
      toast.error('Failed to clear logs');
    }
  };

  useEffect(() => {
    fetchLogs();

    // Set up real-time subscription
    const channel = supabase
      .channel('upload_logs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'upload_logs'
        },
        () => {
          fetchLogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    logs,
    stats,
    isLoading,
    refetch: fetchLogs,
    retryUpload,
    clearLogs
  };
};
