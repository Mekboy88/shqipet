import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface IntegrationHealth {
  service_name: 'website' | 'supabase' | 's3';
  status: 'healthy' | 'unhealthy' | 'unknown';
  last_check_at: string;
  response_time_ms: number | null;
  uptime_percentage: number;
  error_count: number;
  last_error_message: string | null;
}

export interface IntegrationHealthState {
  website: IntegrationHealth | null;
  supabase: IntegrationHealth | null;
  s3: IntegrationHealth | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const useIntegrationHealth = () => {
  const [health, setHealth] = useState<IntegrationHealthState>({
    website: null,
    supabase: null,
    s3: null,
    loading: true,
    error: null,
    lastUpdated: null
  });

  const fetchHealthStatus = useCallback(async () => {
    try {
      setHealth(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase
        .from('integration_health_status')
        .select('*');

      if (error) throw error;

      const healthMap = {
        website: null as IntegrationHealth | null,
        supabase: null as IntegrationHealth | null,
        s3: null as IntegrationHealth | null,
        loading: false,
        lastUpdated: new Date()
      };

      data?.forEach((item: any) => {
        if (item.service_name === 'website' || item.service_name === 'supabase' || item.service_name === 's3') {
          healthMap[item.service_name] = item as IntegrationHealth;
        }
      });

      setHealth(prev => ({ ...prev, ...healthMap }));
    } catch (error) {
      console.error('Failed to fetch integration health:', error);
      setHealth(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch health status'
      }));
    }
  }, []);

  const updateHealthStatus = useCallback(async (
    serviceName: string,
    status: 'healthy' | 'unhealthy' | 'unknown',
    responseTime?: number,
    errorMessage?: string,
    metadata: Record<string, any> = {}
  ) => {
    try {
      const { error } = await supabase.rpc('update_integration_health_status', {
        p_service_name: serviceName,
        p_status: status,
        p_response_time_ms: responseTime || null,
        p_error_message: errorMessage || null,
        p_metadata: metadata
      });

      if (error) throw error;

      // Show toast for status changes
      const statusIcon = status === 'healthy' ? '✅' : status === 'unhealthy' ? '❌' : '⚠️';
      
      if (status !== 'healthy') {
        if (status === 'unhealthy') {
          toast.error(`${statusIcon} ${serviceName.toUpperCase()} Status Update`, {
            description: `Status changed to ${status}${errorMessage ? `: ${errorMessage}` : ''}`,
            duration: 8000,
          });
        } else {
          toast.warning(`${statusIcon} ${serviceName.toUpperCase()} Status Update`, {
            description: `Status changed to ${status}${errorMessage ? `: ${errorMessage}` : ''}`,
            duration: 4000,
          });
        }
      }

    } catch (error) {
      console.error('Failed to update integration health:', error);
      toast.error('Failed to update health status', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    fetchHealthStatus();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('integration-health-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'integration_health_status'
        },
        (payload) => {
          console.log('🔄 Integration health update:', payload);
          
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const newRecord = payload.new as IntegrationHealth;
            setHealth(prev => ({
              ...prev,
              [newRecord.service_name]: newRecord,
              lastUpdated: new Date()
            }));
          }
        }
      )
      .subscribe();

    // Polling fallback (in case realtime is not enabled on the table)
    const pollId = window.setInterval(() => {
      fetchHealthStatus();
    }, 10000);

    return () => {
      supabase.removeChannel(channel);
      window.clearInterval(pollId);
    };
  }, [fetchHealthStatus]);

  const getOverallHealth = useCallback(() => {
    const services = [health.website, health.supabase, health.s3];
    const validServices = services.filter(s => s !== null);
    
    if (validServices.length === 0) return 'unknown';
    
    const hasUnhealthy = validServices.some(s => s?.status === 'unhealthy');
    const hasUnknown = validServices.some(s => s?.status === 'unknown');
    
    if (hasUnhealthy) return 'unhealthy';
    if (hasUnknown) return 'unknown';
    return 'healthy';
  }, [health]);

  const getHealthyServicesCount = useCallback(() => {
    const services = [health.website, health.supabase, health.s3];
    return services.filter(s => s?.status === 'healthy').length;
  }, [health]);

  const getTotalServicesCount = useCallback(() => {
    const services = [health.website, health.supabase, health.s3];
    return services.filter(s => s !== null).length;
  }, [health]);

  return {
    health,
    updateHealthStatus,
    refetch: fetchHealthStatus,
    getOverallHealth,
    getHealthyServicesCount,
    getTotalServicesCount
  };
};