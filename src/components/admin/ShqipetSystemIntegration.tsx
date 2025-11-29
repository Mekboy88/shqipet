import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Shield, 
  Database, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Download, 
  Settings, 
  Zap, 
  Brain,
  Eye,
  Wrench,
  Bell,
  BarChart3,
  Server,
  Lock,
  TrendingUp,
  Clock,
  FileText,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';
import supabase from '@/lib/relaxedSupabase';
import { useUserRole } from '@/hooks/useUserRole';

interface SystemIntegrationProps {
  className?: string;
}

const ShqipetSystemIntegration: React.FC<SystemIntegrationProps> = ({ className }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [monitoringActive, setMonitoringActive] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);
  const [integrationHealth, setIntegrationHealth] = useState({
    database: 'healthy',
    security: 'healthy', 
    performance: 'healthy',
    monitoring: 'active'
  });
  const [criticalIssues, setCriticalIssues] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [securityStatus, setSecurityStatus] = useState<any>(null);
  const [realDatabaseErrors, setRealDatabaseErrors] = useState<any>(null);
  const [foreignKeyViolations, setForeignKeyViolations] = useState<any[]>([]);
  const [constraintViolations, setConstraintViolations] = useState<any[]>([]);

  const { isSuperAdmin, userRole } = useUserRole();

  // Real-time monitoring setup
  useEffect(() => {
    if (monitoringActive) {
      const interval = setInterval(async () => {
        await performErrorMonitoring();
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [monitoringActive]);

  // Initial system scan on component mount
  useEffect(() => {
    if (isSuperAdmin) {
      performFullSystemScan();
      setMonitoringActive(true);
    }
  }, [isSuperAdmin]);

  // Perform comprehensive system scan
  const performFullSystemScan = async () => {
    setIsScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke('luna-system-monitor', {
        body: { 
          action: 'full_system_scan'
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        setSystemStatus(data.analysis);
        setLastScanTime(new Date());
        
        // Update individual status components
        updateIntegrationHealth(data.analysis);
        setCriticalIssues(extractCriticalIssues(data.analysis));
        setRecommendations(data.analysis.recommendations || []);
        
        // Set real database errors
        setRealDatabaseErrors(data.analysis.real_database_errors);
        setForeignKeyViolations(data.analysis.foreign_key_violations || []);
        setConstraintViolations(data.analysis.constraint_violations || []);
        
        toast.success('System scan completed successfully - Real errors detected!');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('System scan failed:', error);
      toast.error(`System scan failed: ${error.message}`);
    } finally {
      setIsScanning(false);
    }
  };

  // Real-time PostgreSQL error detection
  const detectRealErrors = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('luna-error-detector', {
        body: { 
          action: 'scan_postgres_errors'
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        setCriticalIssues(prev => [...prev, ...data.errors.critical_issues]);
        setForeignKeyViolations(data.errors.foreign_key_violations || []);
        setConstraintViolations(data.errors.constraint_violations || []);
        
        if (data.urgent_attention_required) {
          toast.error(`🚨 URGENT: ${data.errors.total_errors_found} critical database errors detected!`);
        } else {
          toast.success('PostgreSQL error scan completed');
        }
      }
    } catch (error) {
      console.error('Real error detection failed:', error);
      toast.error(`Error detection failed: ${error.message}`);
    }
  };
  const performErrorMonitoring = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('luna-system-monitor', {
        body: { 
          action: 'monitor_errors'
        }
      });

      if (error) {
        console.error('Error monitoring failed:', error);
        return;
      }

      if (data.success && data.monitoring.critical_issues_found > 0) {
        setCriticalIssues(prev => [...prev, ...data.monitoring.issues]);
        toast.error(`${data.monitoring.critical_issues_found} critical issues detected!`);
      }
    } catch (error) {
      console.error('Error monitoring failed:', error);
    }
  };

  // Performance analysis
  const analyzePerformance = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('luna-system-monitor', {
        body: { 
          action: 'analyze_performance'
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        setPerformanceMetrics(data.performance);
        toast.success('Performance analysis completed');
      }
    } catch (error) {
      console.error('Performance analysis failed:', error);
      toast.error(`Performance analysis failed: ${error.message}`);
    }
  };

  // Security audit
  const performSecurityAudit = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('luna-system-monitor', {
        body: { 
          action: 'security_audit'
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        setSecurityStatus(data.security);
        toast.success('Security audit completed');
      }
    } catch (error) {
      console.error('Security audit failed:', error);
      toast.error(`Security audit failed: ${error.message}`);
    }
  };

  // Generate automated fix suggestions
  const suggestFixes = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('luna-system-monitor', {
        body: { 
          action: 'suggest_fixes'
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        toast.success(`Generated ${data.fixes.length} automated fix suggestions`);
      }
    } catch (error) {
      console.error('Fix suggestion failed:', error);
      toast.error(`Fix suggestion failed: ${error.message}`);
    }
  };

  // Export system logs
  const exportLogs = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('luna-system-monitor', {
        body: { 
          action: 'export_logs',
          filters: {
            types: ['security_events', 'system_issues', 'analytics_events'],
            limit: 5000
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        // Open download link in new tab
        window.open(data.export.export_url, '_blank');
        toast.success('System logs exported successfully');
      }
    } catch (error) {
      console.error('Log export failed:', error);
      toast.error(`Log export failed: ${error.message}`);
    }
  };

  // Helper functions
  const updateIntegrationHealth = (analysis: any) => {
    const newHealth = { ...integrationHealth };
    
    if (analysis.database_analysis?.total_issues_found > 0) {
      newHealth.database = analysis.database_analysis.critical_issues > 0 ? 'critical' : 'warning';
    }
    
    if (analysis.security_audit?.critical_events > 0) {
      newHealth.security = 'critical';
    } else if (analysis.security_audit?.recent_events > 10) {
      newHealth.security = 'warning';
    }
    
    if (analysis.performance_metrics?.average_latency_ms > 1000) {
      newHealth.performance = 'warning';
    }
    
    setIntegrationHealth(newHealth);
  };

  const extractCriticalIssues = (analysis: any): any[] => {
    const issues = [];
    
    if (analysis.error_detection?.critical_issues > 0) {
      issues.push(...analysis.error_detection.issues.map((issue: any) => ({
        ...issue,
        type: 'system_error'
      })));
    }
    
    if (analysis.security_audit?.critical_threats > 0) {
      issues.push(...analysis.security_audit.recent_threats.slice(0, 5).map((threat: any) => ({
        ...threat,
        type: 'security_threat'
      })));
    }
    
    return issues;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      case 'active': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'active': return <Activity className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  // Don't render for non-super admins
  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Luna System Integration
          </h2>
          <p className="text-muted-foreground mt-1">
            Real-time database error detection and comprehensive system monitoring
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant={monitoringActive ? "default" : "secondary"} className="gap-1">
            <Eye className="h-3 w-3" />
            {monitoringActive ? 'Monitoring Active' : 'Monitoring Paused'}
          </Badge>

          <Button
            onClick={detectRealErrors}
            variant="outline"
            className="gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Detect Real Errors
          </Button>
          
          <Button
            onClick={performFullSystemScan}
            disabled={isScanning}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Full System Scan'}
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${integrationHealth.database === 'healthy' ? 'bg-green-100' : integrationHealth.database === 'warning' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                <Database className={`h-5 w-5 ${getStatusColor(integrationHealth.database)}`} />
              </div>
              <div>
                <p className="text-sm font-medium">Database</p>
                <div className="flex items-center gap-1">
                  {getStatusIcon(integrationHealth.database)}
                  <span className={`text-xs ${getStatusColor(integrationHealth.database)}`}>
                    {integrationHealth.database}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${integrationHealth.security === 'healthy' ? 'bg-green-100' : integrationHealth.security === 'warning' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                <Shield className={`h-5 w-5 ${getStatusColor(integrationHealth.security)}`} />
              </div>
              <div>
                <p className="text-sm font-medium">Security</p>
                <div className="flex items-center gap-1">
                  {getStatusIcon(integrationHealth.security)}
                  <span className={`text-xs ${getStatusColor(integrationHealth.security)}`}>
                    {integrationHealth.security}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${integrationHealth.performance === 'healthy' ? 'bg-green-100' : integrationHealth.performance === 'warning' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                <TrendingUp className={`h-5 w-5 ${getStatusColor(integrationHealth.performance)}`} />
              </div>
              <div>
                <p className="text-sm font-medium">Performance</p>
                <div className="flex items-center gap-1">
                  {getStatusIcon(integrationHealth.performance)}
                  <span className={`text-xs ${getStatusColor(integrationHealth.performance)}`}>
                    {integrationHealth.performance}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${monitoringActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Activity className={`h-5 w-5 ${monitoringActive ? 'text-blue-600' : 'text-gray-600'}`} />
              </div>
              <div>
                <p className="text-sm font-medium">Monitoring</p>
                <div className="flex items-center gap-1">
                  {getStatusIcon(monitoringActive ? 'active' : 'inactive')}
                  <span className={`text-xs ${monitoringActive ? 'text-blue-600' : 'text-gray-600'}`}>
                    {monitoringActive ? 'active' : 'inactive'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="errors">Real Errors</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="fixes">Auto-Fixes</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  System Status
                </CardTitle>
                <CardDescription>
                  Real-time system health and integration status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {systemStatus ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Last Scan:</p>
                        <p className="text-muted-foreground">
                          {lastScanTime ? lastScanTime.toLocaleString() : 'Never'}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">System Health:</p>
                        <p className="text-muted-foreground">
                          {systemStatus.system_health?.overall_status || 'Unknown'}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Open Issues:</p>
                        <p className="text-muted-foreground">
                          {systemStatus.error_detection?.open_issues || 0}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Critical Issues:</p>
                        <p className="text-muted-foreground">
                          {systemStatus.error_detection?.critical_issues || 0}
                        </p>
                      </div>
                    </div>
                    
                    {systemStatus.system_health?.overall_status && (
                      <Progress 
                        value={systemStatus.system_health.overall_status === 'healthy' ? 100 : 
                               systemStatus.system_health.overall_status === 'warning' ? 60 : 30} 
                        className="w-full"
                      />
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No system data available</p>
                    <Button onClick={performFullSystemScan} className="mt-2">
                      Run Initial Scan
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Critical Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Critical Issues
                </CardTitle>
                <CardDescription>
                  Issues requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  {criticalIssues.length > 0 ? (
                    <div className="space-y-3">
                      {criticalIssues.map((issue, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-sm">{issue.issue_description || issue.event_description}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Type: {issue.type} | Severity: {issue.severity || issue.risk_level}
                              </p>
                            </div>
                            <Badge variant="destructive" className="text-xs">
                              {issue.severity || issue.risk_level}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No critical issues detected</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Recommendations
                </CardTitle>
                <CardDescription>
                  AI-generated system optimization suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          rec.priority === 'critical' ? 'bg-red-100' :
                          rec.priority === 'high' ? 'bg-yellow-100' : 'bg-blue-100'
                        }`}>
                          <Wrench className={`h-4 w-4 ${
                            rec.priority === 'critical' ? 'text-red-600' :
                            rec.priority === 'high' ? 'text-yellow-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{rec.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                          <p className="text-xs mt-2 font-medium">Action: {rec.action}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Real Database Errors Detected
              </CardTitle>
              <CardDescription>
                Actual PostgreSQL errors currently happening in your system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Foreign Key Violations */}
                {foreignKeyViolations.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-900 mb-3 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Foreign Key Violations ({foreignKeyViolations.length})
                    </h4>
                    <div className="space-y-3">
                      {foreignKeyViolations.map((violation, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-red-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-red-900">
                                Table: {violation.table_affected}
                              </p>
                              <p className="text-sm text-red-700 mt-1">
                                Constraint: {violation.constraint}
                              </p>
                              <p className="text-xs text-red-600 mt-2 font-mono bg-red-100 p-2 rounded">
                                {violation.error}
                              </p>
                            </div>
                            <Badge variant="destructive">Critical</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Constraint Violations */}
                {constraintViolations.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-900 mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Constraint Violations ({constraintViolations.length})
                    </h4>
                    <div className="space-y-3">
                      {constraintViolations.map((violation, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-red-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-red-900">
                                Table: {violation.table_affected}
                              </p>
                              <p className="text-sm text-red-700 mt-1">
                                Column: {violation.column_affected}
                              </p>
                              <p className="text-xs text-red-600 mt-2 font-mono bg-red-100 p-2 rounded">
                                {violation.error}
                              </p>
                            </div>
                            <Badge variant="destructive">Critical</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real Database Error Summary */}
                {realDatabaseErrors && (
                  <div>
                    <h4 className="font-medium mb-3">Database Error Summary (24h)</h4>
                    <Card>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-red-600">
                              {realDatabaseErrors.total_errors_24h}
                            </p>
                            <p className="text-sm text-muted-foreground">Total Errors</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-orange-600">
                              {realDatabaseErrors.error_patterns?.foreign_key_errors || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">FK Violations</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-600">
                              {realDatabaseErrors.error_patterns?.constraint_errors || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">Constraints</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* No Errors State */}
                {foreignKeyViolations.length === 0 && constraintViolations.length === 0 && !realDatabaseErrors && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No critical database errors detected</p>
                    <Button onClick={detectRealErrors} className="mt-4" variant="outline">
                      Scan for Errors
                    </Button>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button onClick={detectRealErrors} variant="destructive" className="gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Re-scan for Errors
                  </Button>
                  <Button onClick={suggestFixes} variant="outline" className="gap-2">
                    <Wrench className="h-4 w-4" />
                    Generate Fixes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Real-time Monitoring
              </CardTitle>
              <CardDescription>
                Continuous system monitoring and alerting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Monitoring Status</p>
                    <p className="text-sm text-muted-foreground">
                      Real-time error detection and alerting
                    </p>
                  </div>
                  <Button
                    variant={monitoringActive ? "destructive" : "default"}
                    onClick={() => setMonitoringActive(!monitoringActive)}
                  >
                    {monitoringActive ? 'Stop Monitoring' : 'Start Monitoring'}
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Bell className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <p className="font-medium">Active Alerts</p>
                        <p className="text-2xl font-bold text-blue-600">{criticalIssues.length}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <p className="font-medium">Uptime</p>
                        <p className="text-2xl font-bold text-green-600">99.9%</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Activity className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                        <p className="font-medium">Response Time</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {performanceMetrics?.connection_performance?.avg_latency || 0}ms
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Security Audit
                  </CardTitle>
                  <CardDescription>
                    Comprehensive security monitoring and threat detection
                  </CardDescription>
                </div>
                <Button onClick={performSecurityAudit}>Run Security Audit</Button>
              </div>
            </CardHeader>
            <CardContent>
              {securityStatus ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <Shield className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                          <p className="text-sm font-medium">Security Events (7d)</p>
                          <p className="text-2xl font-bold">{securityStatus.threat_summary?.total_events_7d || 0}</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
                          <p className="text-sm font-medium">Critical Threats</p>
                          <p className="text-2xl font-bold text-red-600">{securityStatus.threat_summary?.critical_threats || 0}</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <XCircle className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                          <p className="text-sm font-medium">Brute Force (24h)</p>
                          <p className="text-2xl font-bold text-orange-600">{securityStatus.threat_summary?.brute_force_attempts_24h || 0}</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <Globe className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                          <p className="text-sm font-medium">Unique IPs</p>
                          <p className="text-2xl font-bold text-purple-600">{securityStatus.threat_summary?.unique_ips_attacking || 0}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {securityStatus.security_recommendations?.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Security Recommendations</h4>
                      <div className="space-y-3">
                        {securityStatus.security_recommendations.map((rec: any, index: number) => (
                          <div key={index} className="p-3 border rounded-lg bg-red-50">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                              <div>
                                <p className="font-medium text-red-900">{rec.issue}</p>
                                <p className="text-sm text-red-700 mt-1">{rec.suggestion}</p>
                                <Badge variant="destructive" className="mt-2 text-xs">
                                  {rec.priority}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No security audit data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Analysis
                  </CardTitle>
                  <CardDescription>
                    System performance metrics and optimization suggestions
                  </CardDescription>
                </div>
                <Button onClick={analyzePerformance}>Analyze Performance</Button>
              </div>
            </CardHeader>
            <CardContent>
              {performanceMetrics ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                          <p className="text-sm font-medium">Avg Response Time</p>
                          <p className="text-2xl font-bold text-green-600">
                            {Math.round(performanceMetrics.connection_performance?.avg_latency || 0)}ms
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <Activity className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                          <p className="text-sm font-medium">Connections (24h)</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {performanceMetrics.connection_performance?.total_connections_24h || 0}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                          <p className="text-sm font-medium">Connection Quality</p>
                          <p className="text-lg font-bold text-purple-600">
                            {performanceMetrics.connection_performance?.quality_distribution?.good || 0} Good
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {performanceMetrics.optimization_suggestions?.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Optimization Suggestions</h4>
                      <div className="space-y-3">
                        {performanceMetrics.optimization_suggestions.map((suggestion: any, index: number) => (
                          <div key={index} className="p-3 border rounded-lg bg-yellow-50">
                            <div className="flex items-start gap-3">
                              <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
                              <div>
                                <p className="font-medium text-yellow-900">{suggestion.issue}</p>
                                <p className="text-sm text-yellow-700 mt-1">{suggestion.suggestion}</p>
                                <Badge variant="secondary" className="mt-2 text-xs">
                                  {suggestion.priority}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No performance data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fixes">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Automated Fixes
                  </CardTitle>
                  <CardDescription>
                    AI-generated automated fix suggestions for detected issues
                  </CardDescription>
                </div>
                <Button onClick={suggestFixes}>Generate Fix Suggestions</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Automated fix suggestions will appear here once generated
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Click "Generate Fix Suggestions" to analyze current issues and create automated solutions
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    System Logs
                  </CardTitle>
                  <CardDescription>
                    Export and analyze comprehensive system logs
                  </CardDescription>
                </div>
                <Button onClick={exportLogs} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Logs
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>Available log types for export:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Security Events - Authentication, authorization, and security incidents</li>
                    <li>System Issues - Application errors, performance issues, and system failures</li>
                    <li>Analytics Events - User interactions, page views, and application usage</li>
                    <li>Connection Monitoring - Network performance and connectivity data</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h4 className="font-medium mb-2">Export Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Time Range:</strong> Last 7 days</p>
                      <p><strong>Format:</strong> JSON</p>
                    </div>
                    <div>
                      <p><strong>Max Records:</strong> 5,000 per log type</p>
                      <p><strong>Compression:</strong> Enabled</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShqipetSystemIntegration;