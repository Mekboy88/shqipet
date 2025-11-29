import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Shield, 
  Activity, 
  Settings, 
  Users, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  Lock,
  History,
  Link
} from 'lucide-react';

interface SystemModule {
  name: string;
  description: string;
  status: 'healthy' | 'warning' | 'error';
  lastUpdated: string;
  icon: React.ReactNode;
  linkPath?: string;
}

interface AdminPanelFeature {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'configured' | 'pending';
  category: 'monitoring' | 'security' | 'management';
}

export const SystemPlacementSummary: React.FC = () => {
  const systemRequirements: SystemModule[] = [
    {
      name: 'Supabase Auth Provider',
      description: 'Authentication backend connection',
      status: 'healthy',
      lastUpdated: '2 minutes ago',
      icon: <Database className="h-4 w-4" />
    },
    {
      name: 'Token/Session Tables',
      description: 'User session management database',
      status: 'healthy',
      lastUpdated: '5 minutes ago',
      icon: <Shield className="h-4 w-4" />
    },
    {
      name: 'API Connection States',
      description: 'Real-time API health monitoring',
      status: 'healthy',
      lastUpdated: '1 minute ago',
      icon: <Activity className="h-4 w-4" />
    }
  ];

  const adminPanelFeatures: AdminPanelFeature[] = [
    {
      title: 'Login Rate Abuse Monitor',
      description: 'Tracks rapid login attempts and suspicious patterns',
      icon: <AlertTriangle className="h-4 w-4" />,
      status: 'active',
      category: 'monitoring'
    },
    {
      title: 'Role Sync Logs',
      description: 'Monitors role mismatches and permission changes',
      icon: <Users className="h-4 w-4" />,
      status: 'active',
      category: 'security'
    },
    {
      title: 'Ghost Detector',
      description: 'Identifies abnormal behaviors and phantom sessions',
      icon: <Eye className="h-4 w-4" />,
      status: 'configured',
      category: 'security'
    }
  ];

  const userSecurityFeatures = [
    {
      title: 'Logout from All Devices',
      description: 'Global session termination control',
      icon: <Lock className="h-4 w-4" />
    },
    {
      title: 'Login History Table',
      description: 'Complete authentication timeline',
      icon: <History className="h-4 w-4" />
    },
    {
      title: 'Linked Accounts Manager',
      description: 'External account connection oversight',
      icon: <Link className="h-4 w-4" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
        return 'text-green-600';
      case 'warning':
      case 'configured':
        return 'text-yellow-600';
      case 'error':
      case 'pending':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            {status === 'healthy' ? 'Healthy' : 'Active'}
          </Badge>
        );
      case 'warning':
      case 'configured':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {status === 'warning' ? 'Warning' : 'Configured'}
          </Badge>
        );
      case 'error':
      case 'pending':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {status === 'error' ? 'Error' : 'Pending'}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* System Requirements & Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-indigo-600" />
            System Requirements & Status
          </CardTitle>
          <CardDescription>
            Authentication health and backend system readiness monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {systemRequirements.map((module, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={getStatusColor(module.status)}>
                      {module.icon}
                    </span>
                    <h4 className="font-medium text-gray-800">{module.name}</h4>
                  </div>
                  {getStatusBadge(module.status)}
                </div>
                <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  Last updated: {module.lastUpdated}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pro System Admin Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            Pro System Admin Panel
          </CardTitle>
          <CardDescription>
            Advanced control center modules for comprehensive security monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {adminPanelFeatures.map((feature, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={getStatusColor(feature.status)}>
                      {feature.icon}
                    </span>
                    <h4 className="font-medium text-gray-800">{feature.title}</h4>
                  </div>
                  {getStatusBadge(feature.status)}
                </div>
                <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {feature.category}
                  </Badge>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Configure
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Settings → Security Tab */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            User Settings → Security Tab
          </CardTitle>
          <CardDescription>
            User-accessible security controls for session management and account oversight
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userSecurityFeatures.map((feature, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600">
                      {feature.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="text-xs">
                    Access Feature
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Summary */}
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              🎯 Complete System Integration
            </h3>
            <p className="text-gray-600 mb-4">
              Your admin alert system is now fully integrated across all security touchpoints, 
              providing comprehensive monitoring from authentication to user session management.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="default" size="sm">
                View Full Dashboard
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" size="sm">
                Export Configuration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};