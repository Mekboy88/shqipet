import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UploadConfigurationStatus {
  service_name: 's3' | 'supabase' | 'upload_handler';
  is_enabled: boolean;
  status: 'healthy' | 'warning' | 'error' | 'maintenance';
  last_test_at: string;
  last_success_at: string | null;
  error_count: number;
  success_count: number;
  response_time_ms: number | null;
  configuration_hash: string | null;
  error_details: Record<string, any>;
  metadata: Record<string, any>;
}

export interface UploadAnalytics {
  total_events: number;
  successful_uploads: number;
  failed_uploads: number;
  success_rate: number;
  average_upload_time: number | null;
  total_data_uploaded: number | null;
  upload_sources: Record<string, number>;
  file_types: Record<string, number>;
  time_window: string;
}

export interface UploadEvent {
  id: string;
  event_type: string;
  user_id: string | null;
  file_name: string | null;
  file_size: number | null;
  file_type: string | null;
  upload_source: string | null;
  upload_duration_ms: number | null;
  error_message: string | null;
  success: boolean;
  metadata: Record<string, any>;
  created_at: string;
}

interface UploadConfigurationState {
  statuses: {
    s3: UploadConfigurationStatus | null;
    supabase: UploadConfigurationStatus | null;
    upload_handler: UploadConfigurationStatus | null;
  };
  analytics: UploadAnalytics | null;
  recentEvents: UploadEvent[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const useUploadConfigurationStatus = () => {
  const [state, setState] = useState<UploadConfigurationState>({
    statuses: {
      s3: null,
      supabase: null,
      upload_handler: null
    },
    analytics: null,
    recentEvents: [],
    loading: true,
    error: null,
    lastUpdated: null
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Fetch configuration statuses
      const { data: statusData, error: statusError } = await supabase
        .from('upload_configuration_status')
        .select('*');

      if (statusError) throw statusError;

      // Fetch analytics
      const { data: analyticsData, error: analyticsError } = await supabase
        .rpc('get_upload_analytics', { p_time_window: '24h' });

      if (analyticsError) throw analyticsError;

      // Fetch recent events
      const { data: eventsData, error: eventsError } = await supabase
        .from('upload_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (eventsError) throw eventsError;

      // Process status data
      const statusMap: UploadConfigurationState['statuses'] = {
        s3: null,
        supabase: null,
        upload_handler: null
      };

      statusData?.forEach((status: any) => {
        statusMap[status.service_name as keyof typeof statusMap] = status;
      });

      setState(prev => ({
        ...prev,
        statuses: statusMap,
        analytics: (analyticsData as unknown) as UploadAnalytics,
        recentEvents: (eventsData || []).map((event: any) => ({
          ...event,
          metadata: typeof event.metadata === 'string' ? JSON.parse(event.metadata) : event.metadata || {}
        })),
        loading: false,
        lastUpdated: new Date()
      }));

    } catch (error) {
      console.error('Failed to fetch upload configuration data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch data'
      }));
    }
  }, []);

  const updateConfigurationStatus = useCallback(async (
    serviceName: string,
    status: 'healthy' | 'warning' | 'error' | 'maintenance',
    responseTime?: number,
    errorDetails: Record<string, any> = {},
    metadata: Record<string, any> = {}
  ) => {
    try {
      const { error } = await supabase.rpc('update_upload_configuration_status', {
        p_service_name: serviceName,
        p_status: status,
        p_response_time_ms: responseTime || null,
        p_error_details: errorDetails,
        p_metadata: metadata
      });

      if (error) throw error;

      // Show toast for status changes
      const statusIcon = status === 'healthy' ? '✅' : status === 'error' ? '❌' : '⚠️';
      
      if (status !== 'healthy') {
        if (status === 'error') {
          toast.error(`${statusIcon} ${serviceName.toUpperCase()} Status Update`, {
            description: `Status changed to ${status}`,
            duration: 8000,
          });
        } else {
          toast.warning(`${statusIcon} ${serviceName.toUpperCase()} Status Update`, {
            description: `Status changed to ${status}`,
            duration: 4000,
          });
        }
      }

    } catch (error) {
      console.error('Failed to update configuration status:', error);
      toast.error('Failed to update status', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }, []);

  const logUploadEvent = useCallback(async (
    eventType: string,
    fileName?: string,
    fileSize?: number,
    fileType?: string,
    uploadSource?: string,
    uploadDuration?: number,
    errorMessage?: string,
    success: boolean = false,
    metadata: Record<string, any> = {}
  ) => {
    try {
      const { error } = await supabase.rpc('log_upload_event', {
        p_event_type: eventType,
        p_file_name: fileName || null,
        p_file_size: fileSize || null,
        p_file_type: fileType || null,
        p_upload_source: uploadSource || null,
        p_upload_duration_ms: uploadDuration || null,
        p_error_message: errorMessage || null,
        p_success: success,
        p_metadata: metadata
      });

      if (error) throw error;

    } catch (error) {
      console.error('Failed to log upload event:', error);
    }
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    fetchData();

    // Subscribe to configuration status changes
    const statusChannel = supabase
      .channel('upload-configuration-status-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'upload_configuration_status'
        },
        (payload) => {
          console.log('🔄 Upload configuration status update:', payload);
          
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const newRecord = payload.new as UploadConfigurationStatus;
            setState(prev => ({
              ...prev,
              statuses: {
                ...prev.statuses,
                [newRecord.service_name]: newRecord
              },
              lastUpdated: new Date()
            }));
          }
        }
      )
      .subscribe();

    // Subscribe to upload events
    const eventsChannel = supabase
      .channel('upload-events-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'upload_events'
        },
        (payload) => {
          console.log('🔄 New upload event:', payload);
          
          const newEvent = payload.new as UploadEvent;
          setState(prev => ({
            ...prev,
            recentEvents: [newEvent, ...prev.recentEvents.slice(0, 9)],
            lastUpdated: new Date()
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(statusChannel);
      supabase.removeChannel(eventsChannel);
    };
  }, [fetchData]);

  const getOverallHealth = useCallback(() => {
    const services = Object.values(state.statuses).filter(s => s !== null);
    
    if (services.length === 0) return 'unknown';
    
    const hasError = services.some(s => s?.status === 'error');
    const hasWarning = services.some(s => s?.status === 'warning');
    const hasMaintenance = services.some(s => s?.status === 'maintenance');
    
    if (hasError) return 'error';
    if (hasWarning) return 'warning';
    if (hasMaintenance) return 'maintenance';
    return 'healthy';
  }, [state.statuses]);

  const getHealthyServicesCount = useCallback(() => {
    const services = Object.values(state.statuses).filter(s => s !== null);
    return services.filter(s => s?.status === 'healthy').length;
  }, [state.statuses]);

  const getTotalServicesCount = useCallback(() => {
    const services = Object.values(state.statuses).filter(s => s !== null);
    return services.length;
  }, [state.statuses]);

  return {
    ...state,
    updateConfigurationStatus,
    logUploadEvent,
    refetch: fetchData,
    getOverallHealth,
    getHealthyServicesCount,
    getTotalServicesCount
  };
};