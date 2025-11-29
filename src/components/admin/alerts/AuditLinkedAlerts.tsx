import React, { useState, useEffect } from 'react';
import { FileText, Settings, RefreshCw, User, Download, ExternalLink, Diff, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AuditAlert {
  id: string;
  type: 'FlaggedUserReviewed' | 'SettingsChangeAlert' | 'TokenFlushTriggered';
  status: 'Active' | 'Monitoring' | 'Enable Alert';
  timestamp: string;
  actionTriggered: string;
  benefit: string;
  metadata?: {
    adminId?: string;
    adminName?: string;
    targetUserId?: string;
    settingChanged?: string;
    oldValue?: string;
    newValue?: string;
    sessionCount?: number;
    reportId?: string;
    moderatorAction?: string;
  };
  diffLog?: {
    before: Record<string, any>;
    after: Record<string, any>;
    changes: string[];
  };
}

const mockAuditAlerts: AuditAlert[] = [
  {
    id: '1',
    type: 'FlaggedUserReviewed',
    status: 'Active',
    timestamp: '4 minutes ago',
    actionTriggered: 'Moderator or admin manually reviewed or resolved a user report',
    benefit: 'Provides assurance that reported users are not ignored; confirms moderator activity',
    metadata: {
      adminId: 'admin_001',
      adminName: 'John Smith',
      targetUserId: 'user_flagged_123',
      reportId: 'report_456',
      moderatorAction: 'Account Warning Issued'
    }
  },
  {
    id: '2',
    type: 'SettingsChangeAlert',
    status: 'Monitoring',
    timestamp: '12 minutes ago',
    actionTriggered: 'Admin edits critical system settings (e.g., toggle MFA, set age restrictions)',
    benefit: 'Tracks internal configuration drift or risky setting modifications',
    metadata: {
      adminId: 'admin_002',
      adminName: 'Sarah Wilson',
      settingChanged: 'MFA_REQUIRED',
      oldValue: 'false',
      newValue: 'true'
    },
    diffLog: {
      before: { mfa_required: false, age_restriction: 13 },
      after: { mfa_required: true, age_restriction: 13 },
      changes: ['mfa_required: false → true']
    }
  },
  {
    id: '3',
    type: 'TokenFlushTriggered',
    status: 'Enable Alert',
    timestamp: '25 minutes ago',
    actionTriggered: 'Admin clears all user sessions or performs a JWT key rotation',
    benefit: 'Monitors for emergency actions and forces account-wide logout for security',
    metadata: {
      adminId: 'admin_003',
      adminName: 'Mike Johnson',
      sessionCount: 1247
    }
  }
];

const getAlertIcon = (type: AuditAlert['type']) => {
  switch (type) {
    case 'FlaggedUserReviewed':
      return <User className="h-5 w-5" />;
    case 'SettingsChangeAlert':
      return <Settings className="h-5 w-5" />;
    case 'TokenFlushTriggered':
      return <RefreshCw className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

const getStatusColor = (status: AuditAlert['status']) => {
  switch (status) {
    case 'Active':
      return 'bg-green-50 border-green-200 text-green-800';
    case 'Monitoring':
      return 'bg-blue-50 border-blue-200 text-blue-800';
    case 'Enable Alert':
      return 'bg-orange-50 border-orange-200 text-orange-800';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-800';
  }
};

const getStatusBadge = (status: AuditAlert['status']) => {
  switch (status) {
    case 'Active':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>;
    case 'Monitoring':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Monitoring</Badge>;
    case 'Enable Alert':
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Enable Alert</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getAlertEmoji = (type: AuditAlert['type']) => {
  switch (type) {
    case 'FlaggedUserReviewed':
      return '👤';
    case 'SettingsChangeAlert':
      return '⚙️';
    case 'TokenFlushTriggered':
      return '🔄';
    default:
      return '📦';
  }
};

interface DiffViewerProps {
  diffLog: AuditAlert['diffLog'];
}

function DiffViewer({ diffLog }: DiffViewerProps) {
  if (!diffLog) return null;

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">Configuration Changes:</div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <div className="text-xs font-medium text-red-800 mb-2">Before</div>
          <pre className="text-xs text-red-700">
            {JSON.stringify(diffLog.before, null, 2)}
          </pre>
        </div>
        <div className="bg-green-50 border border-green-200 rounded p-3">
          <div className="text-xs font-medium text-green-800 mb-2">After</div>
          <pre className="text-xs text-green-700">
            {JSON.stringify(diffLog.after, null, 2)}
          </pre>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded p-3">
        <div className="text-xs font-medium text-blue-800 mb-2">Summary of Changes</div>
        <ul className="text-xs text-blue-700 space-y-1">
          {diffLog.changes.map((change, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              {change}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function AuditLinkedAlerts() {
  const [alerts, setAlerts] = useState<AuditAlert[]>(mockAuditAlerts);
  const [selectedAlert, setSelectedAlert] = useState<AuditAlert | null>(null);

  const exportToSlack = (alert: AuditAlert) => {
    console.log('Exporting to Slack:', alert);
    // Implementation for Slack export
  };

  const exportToSIEM = (alert: AuditAlert) => {
    console.log('Exporting to SIEM:', alert);
    // Implementation for SIEM export
  };

  const activeAlertsCount = alerts.filter(alert => alert.status === 'Active').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            📦 Audit-Linked Alerts
            <Badge variant="outline">{activeAlertsCount} Active</Badge>
          </h3>
          <p className="text-sm text-muted-foreground">
            Connected to internal audit trails and tied to action-based admin events
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Audit Logs
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {alerts.map((alert) => (
          <Card
            key={alert.id}
            className={`transition-all duration-200 hover:shadow-md border-l-4 ${getStatusColor(alert.status)}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className="text-lg">{getAlertEmoji(alert.type)}</span>
                  {getAlertIcon(alert.type)}
                  {alert.type.replace(/([A-Z])/g, ' $1').trim()}
                  {getStatusBadge(alert.status)}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {alert.timestamp}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-foreground">Action Triggered: </span>
                  <p className="text-sm text-muted-foreground">{alert.actionTriggered}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-foreground">Benefit: </span>
                  <p className="text-sm text-muted-foreground">{alert.benefit}</p>
                </div>

                {alert.metadata && (
                  <div className="pt-2 border-t border-border/50">
                    <div className="grid gap-2 text-xs">
                      {alert.metadata.adminName && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Admin:</span>
                          <span className="font-medium bg-muted px-2 py-1 rounded">
                            {alert.metadata.adminName} ({alert.metadata.adminId})
                          </span>
                        </div>
                      )}
                      {alert.metadata.targetUserId && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Target User:</span>
                          <span className="bg-muted px-2 py-1 rounded">{alert.metadata.targetUserId}</span>
                        </div>
                      )}
                      {alert.metadata.settingChanged && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Setting:</span>
                          <span className="bg-muted px-2 py-1 rounded">{alert.metadata.settingChanged}</span>
                        </div>
                      )}
                      {alert.metadata.oldValue && alert.metadata.newValue && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Change:</span>
                          <span className="bg-muted px-2 py-1 rounded">
                            {alert.metadata.oldValue} → {alert.metadata.newValue}
                          </span>
                        </div>
                      )}
                      {alert.metadata.sessionCount && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Sessions Cleared:</span>
                          <span className="bg-muted px-2 py-1 rounded">{alert.metadata.sessionCount}</span>
                        </div>
                      )}
                      {alert.metadata.moderatorAction && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Action Taken:</span>
                          <span className="bg-muted px-2 py-1 rounded">{alert.metadata.moderatorAction}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  {alert.diffLog && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Diff className="h-3 w-3 mr-1" />
                          View Diff
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Configuration Changes</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="max-h-96">
                          <DiffViewer diffLog={alert.diffLog} />
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => exportToSlack(alert)}>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Slack
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Export to Slack</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => exportToSIEM(alert)}>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        SIEM
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Export to SIEM system</TooltipContent>
                  </Tooltip>

                  <Button size="sm" variant="outline">
                    <FileText className="h-3 w-3 mr-1" />
                    Full Log
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}