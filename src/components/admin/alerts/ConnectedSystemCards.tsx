import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Database, 
  Mail, 
  Phone, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  Eye,
  Zap,
  Globe,
  Link,
  BarChart3,
  Users,
  Shield,
  Webhook,
  Settings
} from 'lucide-react';

interface IntegrationService {
  name: string;
  type: 'email' | 'sms' | 'database' | 'api' | 'monitoring';
  status: 'active' | 'error' | 'warning' | 'inactive';
  lastUsed: string;
  errorCount: number;
  description: string;
  icon: React.ReactNode;
  details: {
    requests: number;
    uptime: string;
    lastError?: string;
    responseTime: string;
  };
}

interface DatabaseTable {
  name: string;
  syncStatus: 'synced' | 'lagging' | 'error';
  lastSync: string;
  recordCount: number;
  description: string;
}

interface ExternalAPI {
  name: string;
  status: 'active' | 'inactive' | 'error';
  type: 'webhook' | 'oauth' | 'rest' | 'graphql';
  lastCheck: string;
  endpoint: string;
}

export const ConnectedSystemCards: React.FC = () => {
  const [selectedService, setSelectedService] = useState<IntegrationService | null>(null);

  const integrationServices: IntegrationService[] = [
    {
      name: 'SendGrid',
      type: 'email',
      status: 'active',
      lastUsed: '2 minutes ago',
      errorCount: 0,
      description: 'Email delivery service for notifications and verification',
      icon: <Mail className="h-5 w-5" />,
      details: {
        requests: 1247,
        uptime: '99.9%',
        responseTime: '120ms'
      }
    },
    {
      name: 'Twilio SMS',
      type: 'sms',
      status: 'active',
      lastUsed: '15 minutes ago',
      errorCount: 2,
      description: 'SMS verification and notification service',
      icon: <Phone className="h-5 w-5" />,
      details: {
        requests: 892,
        uptime: '99.7%',
        lastError: 'Invalid phone number format',
        responseTime: '95ms'
      }
    },
    {
      name: 'Supabase Auth',
      type: 'database',
      status: 'active',
      lastUsed: '30 seconds ago',
      errorCount: 0,
      description: 'Authentication and user management backend',
      icon: <Database className="h-5 w-5" />,
      details: {
        requests: 3421,
        uptime: '100%',
        responseTime: '45ms'
      }
    },
    {
      name: 'Analytics API',
      type: 'api',
      status: 'warning',
      lastUsed: '1 hour ago',
      errorCount: 5,
      description: 'User behavior and system analytics tracking',
      icon: <BarChart3 className="h-5 w-5" />,
      details: {
        requests: 567,
        uptime: '98.2%',
        lastError: 'Rate limit exceeded',
        responseTime: '230ms'
      }
    }
  ];

  const databaseTables: DatabaseTable[] = [
    {
      name: 'auth.users → profiles',
      syncStatus: 'synced',
      lastSync: '1 minute ago',
      recordCount: 15847,
      description: 'User authentication to profile data synchronization'
    },
    {
      name: 'profiles → user_sessions',
      syncStatus: 'synced',
      lastSync: '30 seconds ago',
      recordCount: 3241,
      description: 'Profile data to active session mapping'
    },
    {
      name: 'user_roles → security_events',
      syncStatus: 'lagging',
      lastSync: '5 minutes ago',
      recordCount: 892,
      description: 'Role changes to security audit trail'
    },
    {
      name: 'device_fingerprints → sessions',
      syncStatus: 'synced',
      lastSync: '45 seconds ago',
      recordCount: 5632,
      description: 'Device tracking to session correlation'
    }
  ];

  const externalAPIs: ExternalAPI[] = [
    {
      name: 'Payment Webhook',
      status: 'active',
      type: 'webhook',
      lastCheck: '2 minutes ago',
      endpoint: 'https://api.stripe.com/webhooks'
    },
    {
      name: 'Google OAuth',
      status: 'active',
      type: 'oauth',
      lastCheck: '1 minute ago',
      endpoint: 'https://accounts.google.com/oauth2'
    },
    {
      name: 'Content Moderation API',
      status: 'error',
      type: 'rest',
      lastCheck: '30 minutes ago',
      endpoint: 'https://api.moderatecontent.com/v1'
    },
    {
      name: 'Social Media Sync',
      status: 'inactive',
      type: 'rest',
      lastCheck: '2 hours ago',
      endpoint: 'https://graph.facebook.com/v18.0'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'synced':
        return 'text-green-600';
      case 'warning':
      case 'lagging':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      case 'inactive':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-300',
      synced: 'bg-green-100 text-green-800 border-green-300',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      lagging: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      error: 'bg-red-100 text-red-800 border-red-300',
      inactive: 'bg-gray-100 text-gray-800 border-gray-300'
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Integration Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Third-Party Service Integrations
          </CardTitle>
          <CardDescription>
            Real-time status and connectivity monitoring for external services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrationServices.map((service, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      service.status === 'active' ? 'bg-green-100' :
                      service.status === 'warning' ? 'bg-yellow-100' :
                      service.status === 'error' ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      <span className={getStatusColor(service.status)}>
                        {service.icon}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{service.name}</h4>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(service.status)}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div>
                    <span className="text-gray-600">Last used:</span>
                    <div className="font-medium">{service.lastUsed}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Errors:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{service.errorCount}</span>
                      {service.errorCount > 0 && (
                        <Badge className="bg-red-100 text-red-800 border-red-300 text-xs">
                          {service.errorCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedService(service)}>
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          {service.icon}
                          {service.name} Details
                        </DialogTitle>
                        <DialogDescription>
                          Service performance and status information
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Total Requests</div>
                            <div className="text-2xl font-bold text-blue-600">{service.details.requests}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Uptime</div>
                            <div className="text-2xl font-bold text-green-600">{service.details.uptime}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Response Time</div>
                            <div className="text-2xl font-bold text-purple-600">{service.details.responseTime}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Status</div>
                            <div>{getStatusBadge(service.status)}</div>
                          </div>
                        </div>
                        {service.details.lastError && (
                          <div className="p-3 bg-red-50 rounded border border-red-200">
                            <div className="text-sm font-medium text-red-800">Last Error:</div>
                            <div className="text-sm text-red-600">{service.details.lastError}</div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Reconnect
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Database Tables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-600" />
            Supabase Table Linkages
          </CardTitle>
          <CardDescription>
            Database synchronization status and table relationships
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {databaseTables.map((table, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    table.syncStatus === 'synced' ? 'bg-green-100' :
                    table.syncStatus === 'lagging' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <span className={getStatusColor(table.syncStatus)}>
                      <Link className="h-4 w-4" />
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{table.name}</h4>
                    <p className="text-sm text-gray-600">{table.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <div className="text-gray-600">Last sync: {table.lastSync}</div>
                    <div className="text-gray-500">{table.recordCount.toLocaleString()} records</div>
                  </div>
                  {getStatusBadge(table.syncStatus)}
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    View Logs
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* External APIs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-orange-600" />
            External API Monitoring
          </CardTitle>
          <CardDescription>
            Health checks and connectivity status for external API integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {externalAPIs.map((api, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      api.status === 'active' ? 'bg-green-100' :
                      api.status === 'error' ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      <span className={getStatusColor(api.status)}>
                        {api.type === 'webhook' ? <Webhook className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{api.name}</h4>
                      <p className="text-xs text-gray-500 font-mono">{api.endpoint}</p>
                    </div>
                  </div>
                  {getStatusBadge(api.status)}
                </div>

                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-gray-600">Type: {api.type.toUpperCase()}</span>
                  <span className="text-gray-600">Last check: {api.lastCheck}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Activity className="h-3 w-3 mr-1" />
                    Check API
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-800">API Health Monitoring</h4>
                  <p className="text-sm text-blue-600">Automated checks every 5 minutes for all external endpoints</p>
                </div>
              </div>
              <Button variant="default" size="sm">
                View Status Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};