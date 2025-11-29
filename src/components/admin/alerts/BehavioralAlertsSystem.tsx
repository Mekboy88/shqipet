import React, { useState, useEffect } from 'react';
import { Brain, Shield, AlertTriangle, Eye, Settings2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface BehavioralAlert {
  id: string;
  type: 'GhostLoginDetected' | 'MultiRoleSwitchAttempt' | 'BackdoorAccessDetected';
  severity: 'critical' | 'warning' | 'high';
  timestamp: string;
  trigger: string;
  value: string;
  suggestedEnhancements: string[];
  metadata?: {
    userId?: string;
    sessionToken?: string;
    roleFrom?: string;
    roleTo?: string;
    switchCount?: number;
    accessPath?: string;
    ipAddress?: string;
  };
  isActive: boolean;
}

const mockBehavioralAlerts: BehavioralAlert[] = [
  {
    id: '1',
    type: 'GhostLoginDetected',
    severity: 'critical',
    timestamp: '3 minutes ago',
    trigger: 'User appears with active session token but no login recorded',
    value: 'Detects cloned tokens or client-side manipulation',
    suggestedEnhancements: ['Auto-prompt re-authentication', 'Link with token signature integrity checker'],
    metadata: {
      userId: 'user_ghost_123',
      sessionToken: 'jwt_xyz789',
      ipAddress: '192.168.1.50'
    },
    isActive: true
  },
  {
    id: '2',
    type: 'MultiRoleSwitchAttempt',
    severity: 'warning',
    timestamp: '7 minutes ago',
    trigger: 'Repeated switching between elevated roles (e.g., admin ↔️ normal)',
    value: 'Highlights possible abuse attempts or probing for privilege-based flaws',
    suggestedEnhancements: ['Set soft lock on role switch frequency'],
    metadata: {
      userId: 'user_switcher_456',
      roleFrom: 'admin',
      roleTo: 'user',
      switchCount: 5,
      ipAddress: '10.0.0.25'
    },
    isActive: true
  },
  {
    id: '3',
    type: 'BackdoorAccessDetected',
    severity: 'high',
    timestamp: '15 minutes ago',
    trigger: 'Login through legacy route or debug path',
    value: 'Surfaces bypass attempts of modern auth flows or hidden login forms',
    suggestedEnhancements: ['Auto-disable outdated routes and notify security'],
    metadata: {
      userId: 'user_backdoor_789',
      accessPath: '/legacy/admin/debug',
      ipAddress: '203.0.113.15'
    },
    isActive: false
  }
];

const getAlertIcon = (type: BehavioralAlert['type']) => {
  switch (type) {
    case 'GhostLoginDetected':
      return <Eye className="h-5 w-5" />;
    case 'MultiRoleSwitchAttempt':
      return <RefreshCw className="h-5 w-5" />;
    case 'BackdoorAccessDetected':
      return <Shield className="h-5 w-5" />;
    default:
      return <Brain className="h-5 w-5" />;
  }
};

const getSeverityColor = (severity: BehavioralAlert['severity']) => {
  switch (severity) {
    case 'critical':
      return 'bg-destructive/10 border-destructive text-destructive';
    case 'high':
      return 'bg-orange-50 border-orange-200 text-orange-800';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-800';
  }
};

const getSeverityBadge = (severity: BehavioralAlert['severity']) => {
  switch (severity) {
    case 'critical':
      return <Badge variant="destructive">Critical</Badge>;
    case 'high':
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">High</Badge>;
    case 'warning':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Warning</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getAlertEmoji = (type: BehavioralAlert['type']) => {
  switch (type) {
    case 'GhostLoginDetected':
      return '👻';
    case 'MultiRoleSwitchAttempt':
      return '🕹️';
    case 'BackdoorAccessDetected':
      return '🚪';
    default:
      return '🧠';
  }
};

export function BehavioralAlertsSystem() {
  const [alerts, setAlerts] = useState<BehavioralAlert[]>(mockBehavioralAlerts);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshAlerts = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const activeAlertsCount = alerts.filter(alert => alert.isActive).length;
  const criticalAlertsCount = alerts.filter(alert => alert.severity === 'critical' && alert.isActive).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            🧠 Behavioral Alerts (Smart Signals)
            <Badge variant="outline">{activeAlertsCount} Active</Badge>
          </h3>
          <p className="text-sm text-muted-foreground">
            Detects unusual session patterns, token anomalies, and misuse of admin paths
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshAlerts}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {criticalAlertsCount > 0 && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-medium">
            {criticalAlertsCount} critical behavioral alert{criticalAlertsCount > 1 ? 's' : ''} detected! 
            Immediate action required.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {alerts.map((alert) => (
          <Card
            key={alert.id}
            className={`transition-all duration-300 hover:shadow-md border-l-4 ${getSeverityColor(alert.severity)} ${
              alert.isActive ? 'animate-fade-in' : 'opacity-60'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className="text-lg">{getAlertEmoji(alert.type)}</span>
                  {getAlertIcon(alert.type)}
                  {alert.type.replace(/([A-Z])/g, ' $1').trim()}
                  {getSeverityBadge(alert.severity)}
                  {alert.isActive && (
                    <Badge variant="outline" className="animate-pulse">
                      Active
                    </Badge>
                  )}
                </CardTitle>
                <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-sm font-medium text-foreground">Trigger: </span>
                    <p className="text-sm text-muted-foreground">{alert.trigger}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-foreground">Why It's Valuable: </span>
                    <p className="text-sm text-muted-foreground">{alert.value}</p>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-foreground">Suggested Enhancements: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {alert.suggestedEnhancements.map((enhancement, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <Badge 
                            variant="outline" 
                            className="text-xs cursor-help hover-scale"
                          >
                            {enhancement}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to implement: {enhancement}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>

                {alert.metadata && (
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {alert.metadata.userId && (
                        <span className="bg-muted px-2 py-1 rounded">
                          User: {alert.metadata.userId}
                        </span>
                      )}
                      {alert.metadata.sessionToken && (
                        <span className="bg-muted px-2 py-1 rounded">
                          Token: {alert.metadata.sessionToken.slice(0, 10)}...
                        </span>
                      )}
                      {alert.metadata.roleFrom && alert.metadata.roleTo && (
                        <span className="bg-muted px-2 py-1 rounded">
                          {alert.metadata.roleFrom} → {alert.metadata.roleTo}
                        </span>
                      )}
                      {alert.metadata.switchCount && (
                        <span className="bg-muted px-2 py-1 rounded">
                          Switches: {alert.metadata.switchCount}
                        </span>
                      )}
                      {alert.metadata.accessPath && (
                        <span className="bg-muted px-2 py-1 rounded">
                          Path: {alert.metadata.accessPath}
                        </span>
                      )}
                      {alert.metadata.ipAddress && (
                        <span className="bg-muted px-2 py-1 rounded">
                          IP: {alert.metadata.ipAddress}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline">
                    <Settings2 className="h-3 w-3 mr-1" />
                    Configure
                  </Button>
                  {alert.isActive && (
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Investigate
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}