import { useState, useEffect } from 'react';
import { aiAnalytics, UsageMetrics, ErrorLog, SystemHealthComponent } from '@/services/aiAnalyticsManager';

export const useAIAnalytics = (timeRange = '24h', autoRefresh = true) => {
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics | null>(null);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealthComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [metrics, errors, health] = await Promise.all([
        aiAnalytics.fetchUsageMetrics(timeRange),
        aiAnalytics.fetchErrorLogs(20),
        aiAnalytics.fetchSystemHealth()
      ]);

      setUsageMetrics(metrics);
      setErrorLogs(errors);
      setSystemHealth(health);
    } catch (err) {
      console.error('Failed to fetch AI analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up real-time listeners
    const handleUsageUpdate = () => fetchData();
    const handleErrorUpdate = (event: CustomEvent) => {
      setErrorLogs(prev => [event.detail.new, ...prev.slice(0, 19)]);
    };
    const handleHealthUpdate = (event: CustomEvent) => {
      setSystemHealth(prev => prev.map(component => 
        component.component_name === event.detail.new.component_name 
          ? event.detail.new 
          : component
      ));
    };

    window.addEventListener('usage-metrics-updated', handleUsageUpdate);
    window.addEventListener('error-log-added', handleErrorUpdate as EventListener);
    window.addEventListener('system-health-updated', handleHealthUpdate as EventListener);

    // Auto-refresh interval
    const interval = autoRefresh ? setInterval(fetchData, 30000) : null;

    return () => {
      window.removeEventListener('usage-metrics-updated', handleUsageUpdate);
      window.removeEventListener('error-log-added', handleErrorUpdate as EventListener);
      window.removeEventListener('system-health-updated', handleHealthUpdate as EventListener);
      if (interval) clearInterval(interval);
    };
  }, [timeRange, autoRefresh]);

  return {
    usageMetrics,
    errorLogs,
    systemHealth,
    loading,
    error,
    refetch: fetchData
  };
};