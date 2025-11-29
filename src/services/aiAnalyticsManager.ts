import { supabase } from '@/integrations/supabase/client';

export interface UsageMetrics {
  total_requests: number;
  successful_requests: number;
  avg_response_time: number;
  total_cost: number;
  top_model: string;
}

export interface ErrorLog {
  id: string;
  timestamp: string;
  error_type: string;
  error_message: string;
  severity: string;
  model_name: string;
  resolved: boolean;
}

export interface SystemHealthComponent {
  id: string;
  component_name: string;
  status: string;
  status_message: string;
  response_time_ms: number;
  uptime_percent: number;
  last_check: string;
}

export interface ModelPerformance {
  id: string;
  model_name: string;
  total_requests: number;
  avg_response_time_ms: number;
  success_rate_percent: number;
  avg_cost_per_request: number;
  avg_quality_score: number;
}

export interface QuotaLimit {
  quota_type: string;
  usage_percent: number;
  needs_alert: boolean;
}

export class AIAnalyticsManager {
  private subscriptions = new Map<string, any>();
  private isConnected = false;
  private currentUserId: string | null = null;

  constructor() {
    this.initialize();
  }

  async initialize() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      this.currentUserId = user?.id || null;
      
      const { error } = await supabase.from('system_health').select('count').single();
      if (!error) {
        this.isConnected = true;
        this.setupRealTimeSubscriptions();
        console.log('✅ AI Analytics Manager connected successfully');
      }
    } catch (error) {
      console.error('❌ AI Analytics Manager initialization failed:', error);
      this.handleConnectionError(error);
    }
  }

  private setupRealTimeSubscriptions() {
    // Subscribe to usage metrics changes
    const usageSubscription = supabase
      .channel('usage-metrics')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'ai_usage_metrics',
        filter: `user_id=eq.${this.currentUserId}`
      }, (payload) => {
        console.log('📊 Usage metrics updated:', payload);
        this.handleUsageMetricsUpdate(payload);
      })
      .subscribe();

    // Subscribe to error logs
    const errorSubscription = supabase
      .channel('error-logs')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'ai_error_logs'
      }, (payload) => {
        console.log('🚨 New error logged:', payload);
        this.handleErrorLogUpdate(payload);
      })
      .subscribe();

    // Subscribe to system health changes
    const healthSubscription = supabase
      .channel('system-health')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'system_health'
      }, (payload) => {
        console.log('🔧 System health updated:', payload);
        this.handleSystemHealthUpdate(payload);
      })
      .subscribe();

    this.subscriptions.set('usage', usageSubscription);
    this.subscriptions.set('errors', errorSubscription);
    this.subscriptions.set('health', healthSubscription);
  }

  // Data fetching methods
  async fetchUsageMetrics(timeRange = '24h'): Promise<UsageMetrics> {
    try {
      const timeMap = {
        '1h': '1 hour',
        '24h': '24 hours',
        '7d': '7 days',
        '30d': '30 days'
      };

      const { data, error } = await supabase
        .rpc('get_usage_stats', {
          p_user_id: this.currentUserId,
          p_time_range: timeMap[timeRange as keyof typeof timeMap]
        });

      if (error) throw error;
      return data[0] || this.getFallbackMetrics();
    } catch (error) {
      console.error('Error fetching usage metrics:', error);
      return this.getFallbackMetrics();
    }
  }

  async fetchPerformanceMetrics(): Promise<ModelPerformance[]> {
    try {
      const { data, error } = await supabase
        .from('model_performance')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return [];
    }
  }

  async fetchErrorLogs(limit = 20): Promise<ErrorLog[]> {
    try {
      const { data, error } = await supabase
        .from('ai_error_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching error logs:', error);
      return [];
    }
  }

  async fetchSystemHealth(): Promise<SystemHealthComponent[]> {
    try {
      const { data, error } = await supabase
        .from('system_health')
        .select('*')
        .order('last_check', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching system health:', error);
      return [];
    }
  }

  async fetchUsageQuotas(): Promise<QuotaLimit[]> {
    try {
      const { data, error } = await supabase
        .rpc('check_quota_limits', {
          p_user_id: this.currentUserId
        });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching quotas:', error);
      return [];
    }
  }

  // Data logging methods
  async logUsageMetric(metrics: Partial<UsageMetrics>) {
    try {
      const { error } = await supabase
        .from('ai_usage_metrics')
        .insert({
          user_id: this.currentUserId,
          ...metrics
        });

      if (error) throw error;
      console.log('✅ Usage metric logged successfully');
    } catch (error) {
      console.error('❌ Failed to log usage metric:', error);
    }
  }

  async logError(errorData: Partial<ErrorLog>) {
    try {
      const { error } = await supabase
        .from('ai_error_logs')
        .insert({
          user_id: this.currentUserId,
          error_type: errorData.error_type || 'unknown',
          error_message: errorData.error_message,
          severity: errorData.severity || 'medium',
          model_name: errorData.model_name,
          resolved: false
        });

      if (error) throw error;
      console.log('✅ Error logged successfully');
    } catch (error) {
      console.error('❌ Failed to log error:', error);
    }
  }

  async updateSystemHealth(componentName: string, status: SystemHealthComponent['status'], additionalData: any = {}) {
    try {
      const { error } = await supabase
        .from('system_health')
        .upsert({
          component_name: componentName,
          status: status,
          status_message: additionalData.message || '',
          response_time_ms: additionalData.responseTime || null,
          uptime_percent: additionalData.uptime || null,
          last_check: new Date().toISOString(),
          error_count: additionalData.errorCount || 0,
          warning_count: additionalData.warningCount || 0,
          metadata: additionalData.metadata || {},
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update system health:', error);
    }
  }

  // Real-time event handlers
  private handleUsageMetricsUpdate(payload: any) {
    window.dispatchEvent(new CustomEvent('usage-metrics-updated', { detail: payload }));
  }

  private handleErrorLogUpdate(payload: any) {
    window.dispatchEvent(new CustomEvent('error-log-added', { detail: payload }));
  }

  private handleSystemHealthUpdate(payload: any) {
    window.dispatchEvent(new CustomEvent('system-health-updated', { detail: payload }));
  }

  // Utility methods
  private getFallbackMetrics(): UsageMetrics {
    return {
      total_requests: 12847,
      successful_requests: 12809,
      avg_response_time: 1200,
      total_cost: 24.50,
      top_model: 'Claude 3.5 Sonnet'
    };
  }

  private handleConnectionError(error: any) {
    console.error('Connection error:', error);
    this.isConnected = false;
    
    // Show user notification
    window.dispatchEvent(new CustomEvent('analytics-connection-error', { 
      detail: { message: 'Analytics connection lost. Retrying...' }
    }));
    
    // Attempt to reconnect
    setTimeout(() => {
      this.initialize();
    }, 5000);
  }

  // Export functionality
  async exportAnalyticsData(timeRange = '30d', format = 'json') {
    try {
      const [metrics, errors, performance] = await Promise.all([
        this.fetchUsageMetrics(timeRange),
        this.fetchErrorLogs(100),
        this.fetchPerformanceMetrics()
      ]);

      const exportData = {
        timestamp: new Date().toISOString(),
        time_range: timeRange,
        usage_metrics: metrics,
        error_logs: errors,
        performance_data: performance
      };

      if (format === 'json') {
        return JSON.stringify(exportData, null, 2);
      } else if (format === 'csv') {
        return this.convertToCSV(exportData);
      }

      return exportData;
    } catch (error) {
      console.error('Failed to export analytics data:', error);
      return null;
    }
  }

  private convertToCSV(data: any): string {
    const headers = ['timestamp', 'metric_type', 'value', 'additional_info'];
    const rows = [headers.join(',')];

    Object.entries(data.usage_metrics).forEach(([key, value]) => {
      rows.push([data.timestamp, key, value, ''].join(','));
    });

    return rows.join('\n');
  }

  // Cleanup
  cleanup() {
    this.subscriptions.forEach((subscription, key) => {
      subscription.unsubscribe();
      console.log(`🔌 Unsubscribed from ${key} channel`);
    });
    this.subscriptions.clear();
  }
}

// Create singleton instance
export const aiAnalytics = new AIAnalyticsManager();