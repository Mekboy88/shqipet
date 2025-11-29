import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Play,
  RefreshCw,
  Eye,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useSecurityScans } from '@/hooks/security/use-security-scans';
import { useModuleStatus } from '@/hooks/security/use-module-status';
import { useNotifications } from '@/hooks/security/use-notifications';

export const RealTimeSecurityMonitor = () => {
  const { scans, logs, isLoading: scansLoading, runSecurityScan } = useSecurityScans();
  const { modules, getIncompleteModules, getOverallCompletion } = useModuleStatus();
  const { notifications, getUnreadCount, getCriticalNotifications } = useNotifications();
  const [isScanning, setIsScanning] = useState(false);

  const latestScan = scans?.[0];
  const incompleteModules = getIncompleteModules();
  const overallCompletion = getOverallCompletion();
  const recentLogs = logs?.slice(0, 10) || [];

  const handleRunScan = async () => {
    setIsScanning(true);
    try {
      await runSecurityScan();
    } finally {
      setIsScanning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'incomplete':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'secondary';
      case 'medium':
        return 'outline';
      default:
        return 'default';
    }
  };

  if (scansLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading real-time security data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">🔍 Real-Time Security Diagnostic Monitor</h2>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
        </div>
        <Button 
          onClick={handleRunScan} 
          disabled={isScanning}
          className="flex items-center gap-2"
        >
          {isScanning ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {isScanning ? 'Scanning...' : 'Run Security Scan'}
        </Button>
      </div>

      {/* Overall Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Overall Completion</p>
                <p className="text-2xl font-bold">{overallCompletion}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Incomplete Modules</p>
                <p className="text-2xl font-bold text-yellow-600">{incompleteModules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Notifications</p>
                <p className="text-2xl font-bold text-blue-600">{getUnreadCount()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {latestScan ? (
                latestScan.critical_issues > 0 ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )
              ) : (
                <Clock className="h-5 w-5 text-gray-500" />
              )}
              <div>
                <p className="text-sm text-muted-foreground">Security Grade</p>
                <p className="text-2xl font-bold">{latestScan?.security_grade || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Incomplete Modules Warning */}
      {incompleteModules.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Modules Need Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {incompleteModules.map((module) => (
                <div key={module.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(module.status)}
                    <div>
                      <p className="font-medium">{module.module_name}</p>
                      <p className="text-sm text-muted-foreground">{module.note}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{module.completion_percentage}%</Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Not Finished - Need to be finished:</strong> These modules require completion for full security coverage.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Latest Scan Results */}
      {latestScan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Latest Security Scan
              <Badge variant={latestScan.status === 'completed' ? 'default' : 'secondary'}>
                {latestScan.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{latestScan.risk_score}</p>
                <p className="text-sm text-muted-foreground">Risk Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{latestScan.security_grade}</p>
                <p className="text-sm text-muted-foreground">Grade</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{latestScan.critical_issues}</p>
                <p className="text-sm text-muted-foreground">Critical</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{latestScan.warnings}</p>
                <p className="text-sm text-muted-foreground">Warnings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{latestScan.passed}</p>
                <p className="text-sm text-muted-foreground">Passed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Critical Notifications */}
      {getCriticalNotifications().length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <XCircle className="h-5 w-5" />
              Critical Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getCriticalNotifications().map((notification) => (
                <div key={notification.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={getPriorityColor(notification.priority)}>
                        {notification.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-Time Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentLogs.length > 0 ? (
              recentLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <div className={`h-2 w-2 rounded-full mt-2 ${
                    log.level === 'error' ? 'bg-red-500' : 
                    log.level === 'warning' ? 'bg-yellow-500' : 
                    'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{log.module_name}</span>
                      <Badge variant="outline" className="text-xs">{log.event_type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.message}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No recent activity. Run a security scan to see live logs.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};