import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Users, Eye, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface AlertLog {
  id: string;
  type: 'SuspiciousLoginDetected' | 'VerificationSpamDetected' | 'SessionRefreshSuccess' | 'RoleChangeLog';
  severity: 'critical' | 'warning' | 'success' | 'info';
  timestamp: string;
  trigger: string;
  purpose: string;
  suggestedActions: string[];
  metadata?: {
    ip?: string;
    userId?: string;
    countries?: string[];
    requestCount?: number;
    roleGrantedBy?: string;
    newRole?: string;
  };
}

const mockAlertLogs: AlertLog[] = [
  {
    id: '1',
    type: 'SuspiciousLoginDetected',
    severity: 'critical',
    timestamp: '2 minutes ago',
    trigger: 'Login attempts from 3+ countries within 30 minutes',
    purpose: 'Detect potential credential stuffing, session hijack, or botnet-based attacks',
    suggestedActions: ['Trigger MFA enforcement', 'Flag account', 'Auto-log out of all sessions'],
    metadata: {
      ip: '192.168.1.100',
      userId: 'user_123',
      countries: ['US', 'RU', 'CN']
    }
  },
  {
    id: '2',
    type: 'VerificationSpamDetected',
    severity: 'warning',
    timestamp: '5 minutes ago',
    trigger: '10+ verification code requests from the same IP in under 5 minutes',
    purpose: 'Prevent brute-force or SMS/email abuse',
    suggestedActions: ['Temporarily block verification form on that IP', 'Notify security ops'],
    metadata: {
      ip: '203.0.113.42',
      requestCount: 15
    }
  },
  {
    id: '3',
    type: 'SessionRefreshSuccess',
    severity: 'success',
    timestamp: '8 minutes ago',
    trigger: 'Successful JWT refresh (user token renewal)',
    purpose: 'Confirms secure ongoing session continuity',
    suggestedActions: ['Used more for validation than reaction'],
    metadata: {
      userId: 'user_456'
    }
  },
  {
    id: '4',
    type: 'RoleChangeLog',
    severity: 'info',
    timestamp: '12 minutes ago',
    trigger: 'User granted Admin/Pro role (automatically or manually)',
    purpose: 'Tracks permission elevation to sensitive roles',
    suggestedActions: ['Confirm if expected', 'Review who performed the change'],
    metadata: {
      userId: 'user_789',
      newRole: 'admin',
      roleGrantedBy: 'super_admin_001'
    }
  }
];

const getAlertIcon = (type: AlertLog['type']) => {
  switch (type) {
    case 'SuspiciousLoginDetected':
      return <AlertTriangle className="h-5 w-5" />;
    case 'VerificationSpamDetected':
      return <Shield className="h-5 w-5" />;
    case 'SessionRefreshSuccess':
      return <CheckCircle className="h-5 w-5" />;
    case 'RoleChangeLog':
      return <Users className="h-5 w-5" />;
    default:
      return <Eye className="h-5 w-5" />;
  }
};

const getSeverityColor = (severity: AlertLog['severity']) => {
  switch (severity) {
    case 'critical':
      return 'bg-destructive/10 border-destructive text-destructive';
    case 'warning':
      return 'bg-orange-50 border-orange-200 text-orange-800';
    case 'success':
      return 'bg-green-50 border-green-200 text-green-800';
    case 'info':
      return 'bg-blue-50 border-blue-200 text-blue-800';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-800';
  }
};

const getSeverityBadge = (severity: AlertLog['severity']) => {
  switch (severity) {
    case 'critical':
      return <Badge variant="destructive">Critical</Badge>;
    case 'warning':
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Warning</Badge>;
    case 'success':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Success</Badge>;
    case 'info':
      return <Badge variant="secondary">Info</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export function AdminNotificationLogs() {
  const [selectedAlert, setSelectedAlert] = useState<AlertLog | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">🔔 Notifications/Logs for Admin</h3>
          <p className="text-sm text-muted-foreground">
            System-triggered logs for admin actions, user behavior anomalies, and authentication events
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Configure Alerts
        </Button>
      </div>

      <div className="grid gap-3">
        {mockAlertLogs.map((alert) => (
          <Card
            key={alert.id}
            className={`transition-all duration-200 hover:shadow-md cursor-pointer border-l-4 ${getSeverityColor(alert.severity)}`}
            onClick={() => setSelectedAlert(alert)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  {getAlertIcon(alert.type)}
                  {alert.type.replace(/([A-Z])/g, ' $1').trim()}
                  {getSeverityBadge(alert.severity)}
                </CardTitle>
                <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-foreground">Trigger: </span>
                  <span className="text-sm text-muted-foreground">{alert.trigger}</span>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-foreground">Purpose: </span>
                  <span className="text-sm text-muted-foreground">{alert.purpose}</span>
                </div>

                <div>
                  <span className="text-sm font-medium text-foreground">Suggested Actions: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {alert.suggestedActions.map((action, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="text-xs cursor-help">
                            {action}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to execute: {action}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>

                {alert.metadata && (
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {alert.metadata.ip && (
                        <span className="bg-muted px-2 py-1 rounded">IP: {alert.metadata.ip}</span>
                      )}
                      {alert.metadata.userId && (
                        <span className="bg-muted px-2 py-1 rounded">User: {alert.metadata.userId}</span>
                      )}
                      {alert.metadata.countries && (
                        <span className="bg-muted px-2 py-1 rounded">
                          Countries: {alert.metadata.countries.join(', ')}
                        </span>
                      )}
                      {alert.metadata.requestCount && (
                        <span className="bg-muted px-2 py-1 rounded">
                          Requests: {alert.metadata.requestCount}
                        </span>
                      )}
                      {alert.metadata.newRole && (
                        <span className="bg-muted px-2 py-1 rounded">
                          Role: {alert.metadata.newRole}
                        </span>
                      )}
                      {alert.metadata.roleGrantedBy && (
                        <span className="bg-muted px-2 py-1 rounded">
                          By: {alert.metadata.roleGrantedBy}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}