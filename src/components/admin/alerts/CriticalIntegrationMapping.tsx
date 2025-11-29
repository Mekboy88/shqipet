import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Shield, 
  Activity, 
  ArrowRight,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Fingerprint,
  Brain,
  GitBranch,
  Monitor,
  Key,
  UserCheck,
  Globe,
  Zap
} from 'lucide-react';

interface SessionMapping {
  field: string;
  purpose: string;
  debugUse: string;
  icon: React.ReactNode;
  status: 'active' | 'monitored' | 'critical';
}

interface LoginChainStep {
  step: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'failed';
  timing: string;
  icon: React.ReactNode;
}

interface RiskRule {
  condition: string;
  action: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  examples: string[];
  icon: React.ReactNode;
}

export const CriticalIntegrationMapping: React.FC = () => {
  const sessionMappings: SessionMapping[] = [
    {
      field: 'user_id',
      purpose: 'Links session to specific user account',
      debugUse: 'Identify orphaned sessions, trace user activity',
      icon: <UserCheck className="h-4 w-4" />,
      status: 'active'
    },
    {
      field: 'session_id',
      purpose: 'Unique identifier for each login instance',
      debugUse: 'Track concurrent sessions, detect duplicates',
      icon: <Key className="h-4 w-4" />,
      status: 'active'
    },
    {
      field: 'created_at',
      purpose: 'Session initiation timestamp',
      debugUse: 'Calculate session duration, identify stale sessions',
      icon: <Clock className="h-4 w-4" />,
      status: 'monitored'
    },
    {
      field: 'last_active_at',
      purpose: 'Most recent user interaction',
      debugUse: 'Detect inactive sessions, auto-logout timing',
      icon: <Activity className="h-4 w-4" />,
      status: 'critical'
    },
    {
      field: 'device_fingerprint',
      purpose: 'Unique device identification hash',
      debugUse: 'Detect device spoofing, session hijacking',
      icon: <Fingerprint className="h-4 w-4" />,
      status: 'critical'
    }
  ];

  const loginChainSteps: LoginChainStep[] = [
    {
      step: 'Login',
      description: 'User submits credentials',
      status: 'completed',
      timing: '~200ms',
      icon: <Shield className="h-4 w-4" />
    },
    {
      step: 'Verify',
      description: 'Credential validation & 2FA',
      status: 'completed',
      timing: '~500ms',
      icon: <CheckCircle className="h-4 w-4" />
    },
    {
      step: 'Session',
      description: 'Create secure session token',
      status: 'in-progress',
      timing: '~100ms',
      icon: <Key className="h-4 w-4" />
    },
    {
      step: 'Role',
      description: 'Assign user permissions',
      status: 'pending',
      timing: '~50ms',
      icon: <UserCheck className="h-4 w-4" />
    },
    {
      step: 'Access',
      description: 'Grant platform access',
      status: 'pending',
      timing: '~25ms',
      icon: <Database className="h-4 w-4" />
    }
  ];

  const riskRules: RiskRule[] = [
    {
      condition: 'IP Address Mismatch',
      action: 'Flag for Review',
      severity: 'medium',
      examples: ['Login from new country', 'VPN detection', 'Proxy usage'],
      icon: <Globe className="h-4 w-4" />
    },
    {
      condition: 'Sudden Geo Change',
      action: 'Block Access',
      severity: 'high',
      examples: ['Cross-continent travel <2hrs', 'Impossible location change'],
      icon: <MapPin className="h-4 w-4" />
    },
    {
      condition: 'Pattern Deviation',
      action: 'Require MFA',
      severity: 'medium',
      examples: ['Unusual login time', 'New device type', 'Behavioral anomaly'],
      icon: <Brain className="h-4 w-4" />
    },
    {
      condition: 'Device Spoofing',
      action: 'Immediate Block',
      severity: 'critical',
      examples: ['Fingerprint mismatch', 'Browser signature change'],
      icon: <Fingerprint className="h-4 w-4" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return 'text-green-600';
      case 'monitored':
      case 'in-progress':
        return 'text-blue-600';
      case 'critical':
      case 'failed':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-300',
      monitored: 'bg-blue-100 text-blue-800 border-blue-300',
      critical: 'bg-red-100 text-red-800 border-red-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      failed: 'bg-red-100 text-red-800 border-red-300'
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300'}>
        {status}
      </Badge>
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-orange-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Service Mapping */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-600" />
            Session Service Mapping
          </CardTitle>
          <CardDescription>
            Maps each user_session to the authentication lifecycle chain for debugging ghost sessions and stuck tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Field</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Purpose</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Debug Use</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Status</th>
                </tr>
              </thead>
              <tbody>
                {sessionMappings.map((mapping, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className={getStatusColor(mapping.status)}>
                          {mapping.icon}
                        </span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {mapping.field}
                        </code>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{mapping.purpose}</td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{mapping.debugUse}</td>
                    <td className="py-4 px-4">
                      {getStatusBadge(mapping.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Login Chain Flow Audit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-blue-600" />
            Login Chain Flow Audit
          </CardTitle>
          <CardDescription>
            Visual representation of the entire login lifecycle with live tracking and session snapshots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Flow Visualization */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              {loginChainSteps.map((step, index) => (
                <React.Fragment key={index}>
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step.status === 'completed' ? 'bg-green-100' :
                      step.status === 'in-progress' ? 'bg-blue-100' :
                      step.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <span className={getStatusColor(step.status)}>
                        {step.icon}
                      </span>
                    </div>
                    <div className="text-center">
                      <h4 className="font-medium text-gray-800 text-sm">{step.step}</h4>
                      <p className="text-xs text-gray-600">{step.timing}</p>
                      {getStatusBadge(step.status)}
                    </div>
                  </div>
                  {index < loginChainSteps.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Live Tracking Controls */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-800">Live Session Tracking</h4>
                  <p className="text-sm text-blue-600">Monitor authentication flows in real-time</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View Snapshots
                </Button>
                <Button variant="default" size="sm">
                  Start Monitoring
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Risk Rule Routing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-orange-600" />
            AI Risk Rule Routing
          </CardTitle>
          <CardDescription>
            Shows how AI-powered anomaly detection routes decisions and explains trust levels to auditors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskRules.map((rule, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={getSeverityColor(rule.severity)}>
                      {rule.icon}
                    </span>
                    <h4 className="font-medium text-gray-800">{rule.condition}</h4>
                  </div>
                  <Badge className={
                    rule.severity === 'critical' ? 'bg-red-100 text-red-800 border-red-300' :
                    rule.severity === 'high' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                    rule.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                    'bg-green-100 text-green-800 border-green-300'
                  }>
                    {rule.severity}
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-700">{rule.action}</span>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-600 mb-2">Examples:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {rule.examples.map((example, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* AI Decision Tree Visualization */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="h-5 w-5 text-purple-600" />
              <h4 className="font-medium text-purple-800">AI Decision Tree</h4>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 bg-white rounded border">
                <div className="text-xs text-gray-600">Input</div>
                <div className="font-medium">Risk Signals</div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 mt-6" />
              <div className="p-2 bg-white rounded border">
                <div className="text-xs text-gray-600">Process</div>
                <div className="font-medium">AI Analysis</div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 mt-6" />
              <div className="p-2 bg-white rounded border">
                <div className="text-xs text-gray-600">Output</div>
                <div className="font-medium">Action Taken</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};