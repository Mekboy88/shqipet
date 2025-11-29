import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, ExternalLink, Webhook, CreditCard, MessageSquare, Zap } from "lucide-react";

interface IntegrationsSectionProps {
  settings: any;
  updateSettings: (updates: any) => void;
}

const IntegrationsSection: React.FC<IntegrationsSectionProps> = ({
  settings,
  updateSettings
}) => {
  const integrations = [
    {
      id: 'stripe',
      name: 'Stripe',
      icon: CreditCard,
      description: 'Revenue tracking and billing integration',
      connected: !!settings?.integrations?.stripe?.apiKey,
      status: 'active'
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: MessageSquare,
      description: 'Send alerts and notifications to Slack channels',
      connected: !!settings?.integrations?.slack?.webhookUrl,
      status: 'active'
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: MessageSquare,
      description: 'Send alerts and notifications to Discord channels',
      connected: !!settings?.integrations?.discord?.webhookUrl,
      status: 'active'
    },
    {
      id: 'topology',
      name: 'Live Topology',
      icon: Zap,
      description: 'Deep link to network topology visualization',
      connected: !!settings?.integrations?.topology?.enabled,
      status: 'beta'
    }
  ];

  const testConnection = async (integrationId: string) => {
    // Mock connection test
    console.log(`Testing connection for ${integrationId}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>External Integrations</span>
          </CardTitle>
          <CardDescription>Connect external services for enhanced functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {integrations.map(integration => {
              const Icon = integration.icon;
              return (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Icon className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{integration.name}</h4>
                        <Badge variant={integration.status === 'beta' ? 'secondary' : 'outline'}>
                          {integration.status}
                        </Badge>
                        {integration.connected ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testConnection(integration.id)}
                      disabled={!integration.connected}
                    >
                      Test
                    </Button>
                    <Switch
                      checked={settings?.integrations?.[integration.id]?.enabled || false}
                      onCheckedChange={(checked) => updateSettings({
                        integrations: {
                          ...settings?.integrations,
                          [integration.id]: {
                            ...settings?.integrations?.[integration.id],
                            enabled: checked
                          }
                        }
                      })}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Stripe Configuration</span>
          </CardTitle>
          <CardDescription>Configure Stripe integration for revenue tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Stripe Publishable Key</Label>
              <Input
                type="password"
                placeholder="pk_live_..."
                value={settings?.integrations?.stripe?.publishableKey || ''}
                onChange={(e) => updateSettings({
                  integrations: {
                    ...settings?.integrations,
                    stripe: {
                      ...settings?.integrations?.stripe,
                      publishableKey: e.target.value
                    }
                  }
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Stripe Secret Key</Label>
              <Input
                type="password"
                placeholder="sk_live_..."
                value={settings?.integrations?.stripe?.secretKey || ''}
                onChange={(e) => updateSettings({
                  integrations: {
                    ...settings?.integrations,
                    stripe: {
                      ...settings?.integrations?.stripe,
                      secretKey: e.target.value
                    }
                  }
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Webhook Endpoint</Label>
              <Input
                placeholder="https://your-domain.com/webhooks/stripe"
                value={settings?.integrations?.stripe?.webhookEndpoint || ''}
                onChange={(e) => updateSettings({
                  integrations: {
                    ...settings?.integrations,
                    stripe: {
                      ...settings?.integrations?.stripe,
                      webhookEndpoint: e.target.value
                    }
                  }
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Messaging Integrations</span>
          </CardTitle>
          <CardDescription>Configure Slack and Discord webhooks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Slack Webhook URL</Label>
              <Input
                placeholder="https://hooks.slack.com/services/..."
                value={settings?.integrations?.slack?.webhookUrl || ''}
                onChange={(e) => updateSettings({
                  integrations: {
                    ...settings?.integrations,
                    slack: {
                      ...settings?.integrations?.slack,
                      webhookUrl: e.target.value
                    }
                  }
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Discord Webhook URL</Label>
              <Input
                placeholder="https://discord.com/api/webhooks/..."
                value={settings?.integrations?.discord?.webhookUrl || ''}
                onChange={(e) => updateSettings({
                  integrations: {
                    ...settings?.integrations,
                    discord: {
                      ...settings?.integrations?.discord,
                      webhookUrl: e.target.value
                    }
                  }
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Webhook className="h-5 w-5" />
            <span>Custom Webhooks</span>
          </CardTitle>
          <CardDescription>Configure custom webhook endpoints for automation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Alert Webhook URL</Label>
              <Input
                placeholder="https://your-automation-service.com/webhook"
                value={settings?.integrations?.customWebhooks?.alertUrl || ''}
                onChange={(e) => updateSettings({
                  integrations: {
                    ...settings?.integrations,
                    customWebhooks: {
                      ...settings?.integrations?.customWebhooks,
                      alertUrl: e.target.value
                    }
                  }
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Data Export Webhook URL</Label>
              <Input
                placeholder="https://your-data-service.com/webhook"
                value={settings?.integrations?.customWebhooks?.exportUrl || ''}
                onChange={(e) => updateSettings({
                  integrations: {
                    ...settings?.integrations,
                    customWebhooks: {
                      ...settings?.integrations?.customWebhooks,
                      exportUrl: e.target.value
                    }
                  }
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Authentication Token</Label>
              <Input
                type="password"
                placeholder="Bearer token or API key"
                value={settings?.integrations?.customWebhooks?.authToken || ''}
                onChange={(e) => updateSettings({
                  integrations: {
                    ...settings?.integrations,
                    customWebhooks: {
                      ...settings?.integrations?.customWebhooks,
                      authToken: e.target.value
                    }
                  }
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ExternalLink className="h-5 w-5" />
            <span>Live Topology Integration</span>
          </CardTitle>
          <CardDescription>Configure deep linking to topology visualization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Topology Service URL</Label>
              <Input
                placeholder="https://topology.your-domain.com"
                value={settings?.integrations?.topology?.serviceUrl || ''}
                onChange={(e) => updateSettings({
                  integrations: {
                    ...settings?.integrations,
                    topology: {
                      ...settings?.integrations?.topology,
                      serviceUrl: e.target.value
                    }
                  }
                })}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={settings?.integrations?.topology?.openInNewTab !== false}
                onCheckedChange={(checked) => updateSettings({
                  integrations: {
                    ...settings?.integrations,
                    topology: {
                      ...settings?.integrations?.topology,
                      openInNewTab: checked
                    }
                  }
                })}
              />
              <Label>Open in new tab</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsSection;