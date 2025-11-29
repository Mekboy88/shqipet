import { supabase } from '@/integrations/supabase/client';

export interface SystemIntegrationStatus {
  database: 'healthy' | 'warning' | 'critical';
  security: 'healthy' | 'warning' | 'critical';
  performance: 'healthy' | 'warning' | 'critical';
  monitoring: 'active' | 'inactive';
}

export interface SystemAnalysis {
  timestamp: string;
  system_health: any;
  database_analysis: any;
  security_audit: any;
  performance_metrics: any;
  error_detection: any;
  recommendations: any[];
}

export interface CriticalIssue {
  id: string;
  type: 'system_error' | 'security_threat' | 'performance_issue';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved';
  metadata?: any;
}

export interface SystemRecommendation {
  type: 'database' | 'security' | 'performance' | 'monitoring';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  estimated_impact: string;
}

export interface AutomatedFix {
  fix_id: string;
  issue_id: string;
  fix_type: 'performance_optimization' | 'security_hardening' | 'database_maintenance';
  fix_description: string;
  fix_commands: string[];
  requires_approval: boolean;
  rollback_available: boolean;
  execution_status: 'pending' | 'approved' | 'executing' | 'completed' | 'failed';
}

export class ShqipetSystemIntegrationService {
  
  /**
   * Perform comprehensive system analysis and health check
   */
  static async performSystemAnalysis(): Promise<{ success: boolean; analysis?: SystemAnalysis; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('luna-system-monitor', {
        body: { action: 'full_system_scan' }
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: data.success, analysis: data.analysis, error: data.error };
    } catch (error) {
      console.error('System analysis failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Monitor for real-time errors and critical incidents
   */
  static async monitorSystemErrors(): Promise<{ success: boolean; issues?: CriticalIssue[]; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('luna-system-monitor', {
        body: { action: 'monitor_errors' }
      });

      if (error) {
        throw new Error(error.message);
      }

      return { 
        success: data.success, 
        issues: data.monitoring?.issues || [],
        error: data.error 
      };
    } catch (error) {
      console.error('Error monitoring failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Analyze system performance metrics
   */
  static async analyzePerformance(): Promise<{ success: boolean; metrics?: any; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('luna-system-monitor', {
        body: { action: 'analyze_performance' }
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: data.success, metrics: data.performance, error: data.error };
    } catch (error) {
      console.error('Performance analysis failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Perform comprehensive security audit
   */
  static async performSecurityAudit(): Promise<{ success: boolean; audit?: any; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('luna-system-monitor', {
        body: { action: 'security_audit' }
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: data.success, audit: data.security, error: data.error };
    } catch (error) {
      console.error('Security audit failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate automated fix suggestions for detected issues
   */
  static async generateAutomatedFixes(): Promise<{ success: boolean; fixes?: AutomatedFix[]; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('luna-system-monitor', {
        body: { action: 'suggest_fixes' }
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: data.success, fixes: data.fixes, error: data.error };
    } catch (error) {
      console.error('Fix generation failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Export comprehensive system logs
   */
  static async exportSystemLogs(filters?: {
    types?: string[];
    start_date?: string;
    end_date?: string;
    limit?: number;
  }): Promise<{ success: boolean; export_url?: string; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('luna-system-monitor', {
        body: { 
          action: 'export_logs',
          filters: filters || {
            types: ['security_events', 'system_issues', 'analytics_events', 'connection_monitoring'],
            limit: 5000
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return { 
        success: data.success, 
        export_url: data.export?.export_url,
        error: data.error 
      };
    } catch (error) {
      console.error('Log export failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Set up real-time monitoring with webhooks
   */
  static async setupRealTimeMonitoring(): Promise<{ success: boolean; error?: string }> {
    try {
      // Set up real-time subscriptions for critical tables
      const channel = supabase
        .channel('system-monitoring')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'security_events',
          filter: 'risk_level=eq.critical'
        }, (payload) => {
          console.log('🚨 Critical security event detected:', payload);
          this.handleCriticalIncident(payload);
        })
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'system_issues',
          filter: 'severity=eq.critical'
        }, (payload) => {
          console.log('⚠️ Critical system issue detected:', payload);
          this.handleCriticalIncident(payload);
        })
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'brute_force_alerts'
        }, (payload) => {
          console.log('🔒 Brute force alert:', payload);
          this.handleSecurityAlert(payload);
        })
        .subscribe();

      console.log('✅ Real-time monitoring established');
      return { success: true };
    } catch (error) {
      console.error('Failed to setup real-time monitoring:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle critical incidents with immediate alerting
   */
  private static async handleCriticalIncident(incident: any): Promise<void> {
    try {
      // Trigger webhook alert
      await supabase.functions.invoke('luna-system-monitor', {
        body: {
          action: 'webhook_alert',
          data: {
            incidents: [incident],
            alert_level: 'critical',
            timestamp: new Date().toISOString()
          }
        }
      });

      // Log to admin notifications
      await supabase.from('admin_notifications').insert({
        notification_type: 'critical_incident',
        title: 'Critical System Incident Detected',
        message: `Critical incident detected: ${incident.issue_description || incident.event_description}`,
        metadata: {
          incident_id: incident.id,
          severity: incident.severity || incident.risk_level,
          timestamp: incident.created_at
        }
      });

      console.log('🚨 Critical incident handled and alerts sent');
    } catch (error) {
      console.error('Failed to handle critical incident:', error);
    }
  }

  /**
   * Handle security alerts with appropriate response
   */
  private static async handleSecurityAlert(alert: any): Promise<void> {
    try {
      // Log security incident
      await supabase.from('security_events').insert({
        event_type: 'automated_alert_response',
        event_description: `Automated response to security alert: ${alert.alert_type}`,
        metadata: alert,
        risk_level: 'medium'
      });

      console.log('🔒 Security alert processed');
    } catch (error) {
      console.error('Failed to handle security alert:', error);
    }
  }

  /**
   * Get current system integration status
   */
  static async getSystemStatus(): Promise<{ status: SystemIntegrationStatus; last_check: string }> {
    try {
      // Get latest system health data
      const { data: healthData } = await supabase.rpc('get_system_health_overview');
      const { data: securityEvents } = await supabase
        .from('security_events')
        .select('risk_level')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .eq('risk_level', 'critical');
      
      const { data: connectionData } = await supabase
        .from('connection_monitoring')
        .select('latency_ms')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

      const status: SystemIntegrationStatus = {
        database: (healthData as any)?.critical_issues > 0 ? 'critical' : 
                  (healthData as any)?.warning_components > 0 ? 'warning' : 'healthy',
        
        security: (securityEvents?.length || 0) > 0 ? 'critical' : 'healthy',
        
        performance: connectionData && connectionData.length > 0 ? 
          (connectionData.reduce((sum, c) => sum + c.latency_ms, 0) / connectionData.length > 1000 ? 'warning' : 'healthy') : 
          'healthy',
        
        monitoring: 'active'
      };

      return {
        status,
        last_check: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to get system status:', error);
      return {
        status: {
          database: 'warning',
          security: 'warning',
          performance: 'warning',
          monitoring: 'inactive'
        },
        last_check: new Date().toISOString()
      };
    }
  }

  /**
   * Validate system integrations and access
   */
  static async validateIntegrations(): Promise<{ 
    success: boolean; 
    integrations: {
      database: boolean;
      storage: boolean;
      analytics: boolean;
      monitoring: boolean;
    };
    error?: string;
  }> {
    try {
      const integrations = {
        database: false,
        storage: false,
        analytics: false,
        monitoring: false
      };

      // Test database access
      try {
        await supabase.from('profiles').select('count').limit(1);
        integrations.database = true;
      } catch (error) {
        console.error('Database integration test failed:', error);
      }

      // Test storage access
      try {
        const { data } = await supabase.storage.from('uploads').list('', { limit: 1 });
        integrations.storage = true;
      } catch (error) {
        console.error('Storage integration test failed:', error);
      }

      // Test analytics access
      try {
        await supabase.from('analytics_events').select('count').limit(1);
        integrations.analytics = true;
      } catch (error) {
        console.error('Analytics integration test failed:', error);
      }

      // Test monitoring access
      try {
        await supabase.from('system_health_metrics').select('count').limit(1);
        integrations.monitoring = true;
      } catch (error) {
        console.error('Monitoring integration test failed:', error);
      }

      const allIntegrationsWorking = Object.values(integrations).every(Boolean);
      
      return {
        success: allIntegrationsWorking,
        integrations,
        error: allIntegrationsWorking ? undefined : 'Some integrations are not working properly'
      };
    } catch (error) {
      console.error('Integration validation failed:', error);
      return {
        success: false,
        integrations: {
          database: false,
          storage: false,
          analytics: false,
          monitoring: false
        },
        error: error.message
      };
    }
  }
}

export default ShqipetSystemIntegrationService;