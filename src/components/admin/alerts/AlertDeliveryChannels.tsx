import React, { useState } from 'react';
import { Mail, Bell, Webhook, Settings, Check, X, ExternalLink, AlertTriangle, ToggleLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface DeliveryChannel {
  id: string;
  name: string;
  description: string;
  status: 'Configured' | 'Ready' | 'Setup Integration' | 'Error';
  useCase: string;
  icon: React.ReactNode;
  enabled: boolean;
  config?: {
    emails?: string[];
    webhookUrl?: string;
    slackChannel?: string;
    priority?: 'high' | 'medium' | 'low';
  };
}

interface AlertType {
  id: string;
  name: string;
  severity: 'Critical' | 'Warning' | 'Info';
  channels: {
    email: boolean;
    banner: boolean;
    webhook: boolean;
  };
  fallback: string[];
}

const deliveryChannels: DeliveryChannel[] = [
  {
    id: 'email',
    name: 'Email',
    description: 'Sends critical alerts directly to Admin/Owner inbox',
    status: 'Configured',
    useCase: 'Immediate notification of security threats',
    icon: <Mail className="h-5 w-5" />,
    enabled: true,
    config: {
      emails: ['admin@company.com', 'security@company.com'],
      priority: 'high'
    }
  },
  {
    id: 'banner',
    name: 'In-App Banner',
    description: 'Display a banner in the admin panel UI',
    status: 'Ready',
    useCase: 'Persistent visibility during dashboard usage; helpful for all admins',
    icon: <Bell className="h-5 w-5" />,
    enabled: true
  },
  {
    id: 'webhook',
    name: 'Webhook/API',
    description: 'Sends alert payloads to Slack, SIEM, or any monitoring system',
    status: 'Setup Integration',
    useCase: 'Integrate with advanced off-platform incident tracking or alert correlation',
    icon: <Webhook className="h-5 w-5" />,
    enabled: false,
    config: {
      webhookUrl: '',
      slackChannel: '#security-alerts'
    }
  }
];

const alertTypes: AlertType[] = [
  {
    id: 'suspicious-login',
    name: 'Suspicious Login Detected',
    severity: 'Critical',
    channels: { email: true, banner: true, webhook: true },
    fallback: ['email', 'banner']
  },
  {
    id: 'verification-spam',
    name: 'Verification Spam Detected',
    severity: 'Warning',
    channels: { email: false, banner: true, webhook: true },
    fallback: ['banner']
  },
  {
    id: 'settings-change',
    name: 'Settings Change Alert',
    severity: 'Info',
    channels: { email: false, banner: true, webhook: false },
    fallback: []
  }
];

const getStatusColor = (status: DeliveryChannel['status']) => {
  switch (status) {
    case 'Configured':
      return 'bg-green-100 text-green-800';
    case 'Ready':
      return 'bg-blue-100 text-blue-800';
    case 'Setup Integration':
      return 'bg-orange-100 text-orange-800';
    case 'Error':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: DeliveryChannel['status']) => {
  switch (status) {
    case 'Configured':
      return <Check className="h-4 w-4 text-green-600" />;
    case 'Ready':
      return <Check className="h-4 w-4 text-blue-600" />;
    case 'Setup Integration':
      return <Settings className="h-4 w-4 text-orange-600" />;
    case 'Error':
      return <X className="h-4 w-4 text-red-600" />;
    default:
      return <Settings className="h-4 w-4 text-gray-600" />;
  }
};

export function AlertDeliveryChannels() {
  const [channels, setChannels] = useState<DeliveryChannel[]>(deliveryChannels);
  const [alerts, setAlerts] = useState<AlertType[]>(alertTypes);
  const [showWebhookSetup, setShowWebhookSetup] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [slackChannel, setSlackChannel] = useState('#security-alerts');

  const toggleChannel = (channelId: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === channelId 
        ? { ...channel, enabled: !channel.enabled }
        : channel
    ));
  };

  const toggleAlertChannel = (alertId: string, channelType: 'email' | 'banner' | 'webhook') => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { 
            ...alert, 
            channels: { 
              ...alert.channels, 
              [channelType]: !alert.channels[channelType] 
            }
          }
        : alert
    ));
  };

  const setupWebhook = () => {
    setChannels(prev => prev.map(channel => 
      channel.id === 'webhook' 
        ? { 
            ...channel, 
            status: 'Configured',
            enabled: true,
            config: { 
              ...channel.config, 
              webhookUrl,
              slackChannel 
            }
          }
        : channel
    ));
    setShowWebhookSetup(false);
  };

  const needsSetup = channels.some(channel => channel.status === 'Setup Integration');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            📨 Alert Delivery Channels
            <Badge variant="outline">
              {channels.filter(c => c.enabled).length}/{channels.length} Active
            </Badge>
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure how and where alerts are sent when triggered
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Test All Channels
        </Button>
      </div>

      {needsSetup && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Some delivery channels need configuration. Complete setup to ensure all alerts reach their destinations.
          </AlertDescription>
        </Alert>
      )}

      {/* Delivery Methods */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Available Methods
        </h4>
        
        <div className="grid gap-4">
          {channels.map((channel) => (
            <Card key={channel.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    {channel.icon}
                    {channel.name}
                    <Badge className={getStatusColor(channel.status)}>
                      {getStatusIcon(channel.status)}
                      {channel.status}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={channel.enabled}
                      onCheckedChange={() => toggleChannel(channel.id)}
                      disabled={channel.status === 'Setup Integration'}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{channel.description}</p>
                  <div className="text-xs text-muted-foreground">
                    <strong>Use Case:</strong> {channel.useCase}
                  </div>
                  
                  {channel.config && (
                    <div className="pt-2 border-t border-border/50">
                      <div className="flex flex-wrap gap-2 text-xs">
                        {channel.config.emails && (
                          <div className="bg-muted px-2 py-1 rounded">
                            Recipients: {channel.config.emails.length}
                          </div>
                        )}
                        {channel.config.webhookUrl && (
                          <div className="bg-muted px-2 py-1 rounded">
                            Webhook: Configured
                          </div>
                        )}
                        {channel.config.slackChannel && (
                          <div className="bg-muted px-2 py-1 rounded">
                            Slack: {channel.config.slackChannel}
                          </div>
                        )}
                        {channel.config.priority && (
                          <div className="bg-muted px-2 py-1 rounded">
                            Priority: {channel.config.priority}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    {channel.status === 'Setup Integration' && (
                      <Dialog open={showWebhookSetup} onOpenChange={setShowWebhookSetup}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3 mr-1" />
                            Setup Integration
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Configure Webhook Integration</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Webhook URL</label>
                              <Input
                                placeholder="https://hooks.slack.com/services/..."
                                value={webhookUrl}
                                onChange={(e) => setWebhookUrl(e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Slack Channel</label>
                              <Input
                                placeholder="#security-alerts"
                                value={slackChannel}
                                onChange={(e) => setSlackChannel(e.target.value)}
                              />
                            </div>
                            <Button onClick={setupWebhook} className="w-full">
                              Configure Webhook
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Test Channel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Alert Type Configuration */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <ToggleLeft className="h-4 w-4" />
          Channel Configuration per Alert Type
        </h4>
        
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium">{alert.name}</h5>
                    <Badge 
                      variant={alert.severity === 'Critical' ? 'destructive' : 
                              alert.severity === 'Warning' ? 'default' : 'secondary'}
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">Email</span>
                    </div>
                    <Switch
                      checked={alert.channels.email}
                      onCheckedChange={() => toggleAlertChannel(alert.id, 'email')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span className="text-sm">In-App Banner</span>
                    </div>
                    <Switch
                      checked={alert.channels.banner}
                      onCheckedChange={() => toggleAlertChannel(alert.id, 'banner')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Webhook className="h-4 w-4" />
                      <span className="text-sm">Webhook</span>
                    </div>
                    <Switch
                      checked={alert.channels.webhook}
                      onCheckedChange={() => toggleAlertChannel(alert.id, 'webhook')}
                    />
                  </div>
                </div>

                {alert.fallback.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <div className="text-xs text-muted-foreground">
                      <strong>Fallback Order:</strong> {alert.fallback.join(' → ')}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-medium text-blue-800 mb-2">📧 Email Setup Required</h5>
        <p className="text-sm text-blue-700 mb-3">
          To enable email delivery, you need to configure Resend for sending emails.
        </p>
        <div className="space-y-2">
          <Button size="sm" variant="outline" asChild>
            <a href="https://resend.com" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-1" />
              Sign up for Resend
            </a>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-1" />
              Get API Key
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}