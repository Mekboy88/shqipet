import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Clock,
  Shield,
  Database,
  Key,
  Users,
  Activity,
  Wrench,
  Eye,
  RefreshCw
} from 'lucide-react';

interface ModuleStatus {
  name: string;
  status: 'complete' | 'incomplete' | 'error';
  description: string;
  icon: React.ReactNode;
  details?: string;
}

interface SyncStatus {
  component: string;
  lastSync: string;
  minutesAgo: number;
  status: 'fresh' | 'stale' | 'outdated';
  icon: React.ReactNode;
}

interface SetupAlert {
  id: string;
  severity: 'warning' | 'error' | 'info';
  title: string;
  description: string;
  action: string;
  icon: React.ReactNode;
}

export const SystemSetupChecklistUI: React.FC = () => {
  const moduleStatuses: ModuleStatus[] = [
    {
      name: 'Auth Core',
      status: 'complete',
      description: 'User authentication and session management',
      icon: <Shield className="h-4 w-4" />,
      details: 'All authentication providers configured'
    },
    {
      name: 'Sessions',
      status: 'incomplete',
      description: 'Session tracking and device management',
      icon: <Activity className="h-4 w-4" />,
      details: 'Device fingerprinting needs configuration'
    },
    {
      name: 'MFA',
      status: 'error',
      description: 'Multi-factor authentication setup',
      icon: <Key className="h-4 w-4" />,
      details: 'SMS provider configuration failed'
    },
    {
      name: 'Role Management',
      status: 'complete',
      description: 'User roles and permissions system',
      icon: <Users className="h-4 w-4" />,
      details: 'All role policies active'
    },
    {
      name: 'Database Security',
      status: 'incomplete',
      description: 'RLS policies and data protection',
      icon: <Database className="h-4 w-4" />,
      details: 'Some tables missing RLS policies'
    },
    {
      name: 'API Security',
      status: 'complete',
      description: 'Rate limiting and endpoint protection',
      icon: <Shield className="h-4 w-4" />,
      details: 'All endpoints secured'
    }
  ];

  const syncStatuses: SyncStatus[] = [
    {
      component: 'Auth',
      lastSync: '2 minutes ago',
      minutesAgo: 2,
      status: 'fresh',
      icon: <Shield className="h-4 w-4" />
    },
    {
      component: 'Roles',
      lastSync: '5 minutes ago',
      minutesAgo: 5,
      status: 'fresh',
      icon: <Users className="h-4 w-4" />
    },
    {
      component: 'Tokens',
      lastSync: '15 minutes ago',
      minutesAgo: 15,
      status: 'stale',
      icon: <Key className="h-4 w-4" />
    },
    {
      component: 'Sessions',
      lastSync: '45 minutes ago',
      minutesAgo: 45,
      status: 'outdated',
      icon: <Activity className="h-4 w-4" />
    }
  ];

  const setupAlerts: SetupAlert[] = [
    {
      id: 'sessions-disabled',
      severity: 'warning',
      title: 'Sessions Tracking Incomplete',
      description: 'Device fingerprinting is not fully enabled. Some security features may not work properly.',
      action: 'Configure Now',
      icon: <Activity className="h-4 w-4" />
    },
    {
      id: 'mfa-broken',
      severity: 'error',
      title: 'MFA Provider Configuration Failed',
      description: 'SMS verification service is not responding. Users cannot complete two-factor authentication.',
      action: 'Fix Now',
      icon: <AlertTriangle className="h-4 w-4" />
    },
    {
      id: 'rls-missing',
      severity: 'warning',
      title: 'Database Security Gaps',
      description: 'Some database tables are missing Row Level Security policies.',
      action: 'Review Policies',
      icon: <Database className="h-4 w-4" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
      case 'fresh':
        return 'text-green-600';
      case 'incomplete':
      case 'stale':
        return 'text-yellow-600';
      case 'error':
      case 'outdated':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Complete
          </Badge>
        );
      case 'incomplete':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Incomplete
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <XCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return null;
    }
  };

  const getSyncStatusBadge = (status: string) => {
    switch (status) {
      case 'fresh':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            Fresh
          </Badge>
        );
      case 'stale':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Stale
          </Badge>
        );
      case 'outdated':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            Outdated
          </Badge>
        );
      default:
        return null;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const completedModules = moduleStatuses.filter(module => module.status === 'complete').length;
  const totalModules = moduleStatuses.length;
  const completionPercentage = Math.round((completedModules / totalModules) * 100);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-green-600" />
            System Setup Overview
          </CardTitle>
          <CardDescription>
            Platform health status and configuration completion tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600">{completionPercentage}%</div>
              <div className="text-sm text-green-700">Setup Complete</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">{completedModules}/{totalModules}</div>
              <div className="text-sm text-blue-700">Modules Ready</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600">{setupAlerts.filter(a => a.severity === 'warning').length}</div>
              <div className="text-sm text-yellow-700">Warnings</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-3xl font-bold text-red-600">{setupAlerts.filter(a => a.severity === 'error').length}</div>
              <div className="text-sm text-red-700">Critical Issues</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Module Completion Status
          </CardTitle>
          <CardDescription>
            Color-coded status indicators for all core platform modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moduleStatuses.map((module, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      module.status === 'complete' ? 'bg-green-100' :
                      module.status === 'incomplete' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <span className={getStatusColor(module.status)}>
                        {module.icon}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{module.name}</h4>
                      <p className="text-sm text-gray-600">{module.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(module.status)}
                </div>
                {module.details && (
                  <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded border-l-2 border-gray-300">
                    {module.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Last Sync Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Component Sync Status
          </CardTitle>
          <CardDescription>
            Last synchronization times for core system components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {syncStatuses.map((sync, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    sync.status === 'fresh' ? 'bg-green-100' :
                    sync.status === 'stale' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <span className={getStatusColor(sync.status)}>
                      {sync.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{sync.component}</h4>
                    <p className="text-sm text-gray-600">{sync.lastSync}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getSyncStatusBadge(sync.status)}
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Setup Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Setup Alerts & Issues
          </CardTitle>
          <CardDescription>
            Configuration warnings and critical issues requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {setupAlerts.map((alert, index) => (
              <Alert key={index} className={
                alert.severity === 'error' ? 'border-red-200 bg-red-50' :
                alert.severity === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                'border-blue-200 bg-blue-50'
              }>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(alert.severity)}
                    <div>
                      <AlertTitle className="text-sm font-medium mb-1">
                        {alert.title}
                      </AlertTitle>
                      <AlertDescription className="text-sm">
                        {alert.description}
                      </AlertDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    <Button 
                      variant={alert.severity === 'error' ? 'destructive' : 'default'} 
                      size="sm"
                    >
                      <Wrench className="h-3 w-3 mr-1" />
                      {alert.action}
                    </Button>
                  </div>
                </div>
              </Alert>
            ))}
          </div>

          {setupAlerts.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">All Systems Operational</h3>
              <p className="text-gray-600">No configuration issues or setup alerts detected.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};