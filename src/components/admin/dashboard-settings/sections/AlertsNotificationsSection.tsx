import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bell, Mail, MessageSquare, Webhook, Phone } from "lucide-react";

interface AlertsNotificationsSectionProps {
  settings: any;
  updateSettings: (updates: any) => void;
}

const AlertsNotificationsSection: React.FC<AlertsNotificationsSectionProps> = ({
  settings,
  updateSettings
}) => {
  const channels = [
    { id: 'toast', label: 'In-app Toast', icon: Bell },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'sms', label: 'SMS', icon: Phone },
    { id: 'slack', label: 'Slack', icon: MessageSquare },
    { id: 'discord', label: 'Discord', icon: MessageSquare },
    { id: 'webhook', label: 'Custom Webhook', icon: Webhook },
  ];

  const teams = ['Engineering', 'Operations', 'Content', 'Finance'];
  const severities = ['low', 'medium', 'high', 'critical'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>Configure how and where alerts are sent</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {channels.map(channel => {
              const Icon = channel.icon;
              return (
                <div key={channel.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <Label>{channel.label}</Label>
                  </div>
                  <Switch
                    checked={settings?.alerts?.channels?.[channel.id]?.enabled || false}
                    onCheckedChange={(checked) => updateSettings({
                      alerts: {
                        ...settings?.alerts,
                        channels: {
                          ...settings?.alerts?.channels,
                          [channel.id]: {
                            ...settings?.alerts?.channels?.[channel.id],
                            enabled: checked
                          }
                        }
                      }
                    })}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alert Routing</CardTitle>
          <CardDescription>Route alerts by severity and team</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {severities.map(severity => (
              <div key={severity} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium capitalize">{severity} Alerts</h4>
                  <Switch
                    checked={settings?.alerts?.routing?.[severity]?.enabled || false}
                    onCheckedChange={(checked) => updateSettings({
                      alerts: {
                        ...settings?.alerts,
                        routing: {
                          ...settings?.alerts?.routing,
                          [severity]: {
                            ...settings?.alerts?.routing?.[severity],
                            enabled: checked
                          }
                        }
                      }
                    })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Channels</Label>
                    <div className="space-y-1">
                      {channels.map(channel => (
                        <div key={channel.id} className="flex items-center space-x-2">
                          <Checkbox
                            checked={settings?.alerts?.routing?.[severity]?.channels?.includes(channel.id) || false}
                            onCheckedChange={(checked) => {
                              const currentChannels = settings?.alerts?.routing?.[severity]?.channels || [];
                              const newChannels = checked 
                                ? [...currentChannels, channel.id]
                                : currentChannels.filter((c: string) => c !== channel.id);
                              
                              updateSettings({
                                alerts: {
                                  ...settings?.alerts,
                                  routing: {
                                    ...settings?.alerts?.routing,
                                    [severity]: {
                                      ...settings?.alerts?.routing?.[severity],
                                      channels: newChannels
                                    }
                                  }
                                }
                              });
                            }}
                          />
                          <Label className="text-xs">{channel.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Teams</Label>
                    <div className="space-y-1">
                      {teams.map(team => (
                        <div key={team} className="flex items-center space-x-2">
                          <Checkbox
                            checked={settings?.alerts?.routing?.[severity]?.teams?.includes(team) || false}
                            onCheckedChange={(checked) => {
                              const currentTeams = settings?.alerts?.routing?.[severity]?.teams || [];
                              const newTeams = checked 
                                ? [...currentTeams, team]
                                : currentTeams.filter((t: string) => t !== team);
                              
                              updateSettings({
                                alerts: {
                                  ...settings?.alerts,
                                  routing: {
                                    ...settings?.alerts?.routing,
                                    [severity]: {
                                      ...settings?.alerts?.routing?.[severity],
                                      teams: newTeams
                                    }
                                  }
                                }
                              });
                            }}
                          />
                          <Label className="text-xs">{team}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alert Behavior</CardTitle>
          <CardDescription>Configure cooldowns and auto-resolution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cooldown Window (minutes)</Label>
              <Input
                type="number"
                value={settings?.alerts?.cooldownMinutes || 15}
                onChange={(e) => updateSettings({
                  alerts: {
                    ...settings?.alerts,
                    cooldownMinutes: parseInt(e.target.value)
                  }
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Auto-resolve After (minutes)</Label>
              <Input
                type="number"
                value={settings?.alerts?.autoResolveMinutes || 60}
                onChange={(e) => updateSettings({
                  alerts: {
                    ...settings?.alerts,
                    autoResolveMinutes: parseInt(e.target.value)
                  }
                })}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={settings?.alerts?.includeSnapshot || true}
              onCheckedChange={(checked) => updateSettings({
                alerts: {
                  ...settings?.alerts,
                  includeSnapshot: checked
                }
              })}
            />
            <Label>Include data snapshot in alerts</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsNotificationsSection;