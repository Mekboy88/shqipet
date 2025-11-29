import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RefreshRealtimeSectionProps {
  settings: any;
  updateSettings: (updates: any) => void;
}

const RefreshRealtimeSection: React.FC<RefreshRealtimeSectionProps> = ({
  settings,
  updateSettings
}) => {
  const refreshOptions = [
    { value: "off", label: "Off" },
    { value: "15000", label: "15 seconds" },
    { value: "30000", label: "30 seconds" },
    { value: "60000", label: "60 seconds" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Global Refresh Settings</CardTitle>
          <CardDescription>Configure automatic refresh intervals for all cards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Global Refresh Interval</Label>
              <Select
                value={settings?.refresh?.globalInterval?.toString() || "30000"}
                onValueChange={(value) => updateSettings({
                  refresh: {
                    ...settings?.refresh,
                    globalInterval: value === "off" ? null : parseInt(value)
                  }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {refreshOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Card Override Allowed</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings?.refresh?.allowCardOverrides || false}
                  onCheckedChange={(checked) => updateSettings({
                    refresh: {
                      ...settings?.refresh,
                      allowCardOverrides: checked
                    }
                  })}
                />
                <span className="text-sm text-muted-foreground">
                  Allow individual cards to override global settings
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Realtime Subscriptions</CardTitle>
          <CardDescription>Configure realtime updates and fallback strategies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {Object.keys(settings?.cards || {}).map(cardId => (
              <div key={cardId} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="font-medium capitalize">{cardId.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <Badge variant="outline" className="text-xs">
                    {settings?.cards?.[cardId]?.realtimeEnabled ? 'Realtime' : 'Polling'}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label className="text-xs">Realtime</Label>
                    <Switch
                      checked={settings?.cards?.[cardId]?.realtimeEnabled || false}
                      onCheckedChange={(checked) => updateSettings({
                        cards: {
                          ...settings?.cards,
                          [cardId]: {
                            ...settings?.cards?.[cardId],
                            realtimeEnabled: checked
                          }
                        }
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Label className="text-xs">Throttle (ms)</Label>
                    <Input
                      type="number"
                      className="w-20 h-8"
                      value={settings?.cards?.[cardId]?.throttleMs || 1000}
                      onChange={(e) => updateSettings({
                        cards: {
                          ...settings?.cards,
                          [cardId]: {
                            ...settings?.cards?.[cardId],
                            throttleMs: parseInt(e.target.value)
                          }
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Fallback Strategy</h4>
            <p className="text-sm text-muted-foreground mb-3">
              When realtime connections fail, the system will automatically switch to polling mode and display a connection status badge.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label className="text-sm">Fallback Poll Interval (ms)</Label>
                <Input
                  type="number"
                  className="w-32"
                  value={settings?.refresh?.fallbackPollInterval || 60000}
                  onChange={(e) => updateSettings({
                    refresh: {
                      ...settings?.refresh,
                      fallbackPollInterval: parseInt(e.target.value)
                    }
                  })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RefreshRealtimeSection;