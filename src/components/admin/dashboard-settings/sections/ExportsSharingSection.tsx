import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Share, Mail, Calendar } from "lucide-react";

interface ExportsSharingSectionProps {
  settings: any;
  updateSettings: (updates: any) => void;
}

const ExportsSharingSection: React.FC<ExportsSharingSectionProps> = ({
  settings,
  updateSettings
}) => {
  const exportFormats = [
    { value: 'json', label: 'JSON', icon: '{}' },
    { value: 'csv', label: 'CSV', icon: '📊' },
    { value: 'png', label: 'PNG Image', icon: '🖼️' },
    { value: 'pdf', label: 'PDF Report', icon: '📄' },
  ];

  const scheduleOptions = [
    { value: 'disabled', label: 'Disabled' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export Settings</span>
          </CardTitle>
          <CardDescription>Configure data export options and formats</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Enabled Export Formats</Label>
            <div className="grid grid-cols-2 gap-3">
              {exportFormats.map(format => (
                <div key={format.value} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <span className="text-lg">{format.icon}</span>
                  <div className="flex-1">
                    <Label className="font-medium">{format.label}</Label>
                  </div>
                  <Switch
                    checked={settings?.exports?.formats?.[format.value] || false}
                    onCheckedChange={(checked) => updateSettings({
                      exports: {
                        ...settings?.exports,
                        formats: {
                          ...settings?.exports?.formats,
                          [format.value]: checked
                        }
                      }
                    })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Max Export Rows</Label>
              <Input
                type="number"
                value={settings?.exports?.maxRows || 10000}
                onChange={(e) => updateSettings({
                  exports: {
                    ...settings?.exports,
                    maxRows: parseInt(e.target.value)
                  }
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Export Timeout (seconds)</Label>
              <Input
                type="number"
                value={settings?.exports?.timeoutSeconds || 300}
                onChange={(e) => updateSettings({
                  exports: {
                    ...settings?.exports,
                    timeoutSeconds: parseInt(e.target.value)
                  }
                })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={settings?.exports?.respectPiiMode || true}
              onCheckedChange={(checked) => updateSettings({
                exports: {
                  ...settings?.exports,
                  respectPiiMode: checked
                }
              })}
            />
            <Label>Respect PII Safe Mode in exports</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Scheduled Exports</span>
          </CardTitle>
          <CardDescription>Automate regular data exports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Schedule Frequency</Label>
              <Select
                value={settings?.exports?.schedule?.frequency || 'disabled'}
                onValueChange={(value) => updateSettings({
                  exports: {
                    ...settings?.exports,
                    schedule: {
                      ...settings?.exports?.schedule,
                      frequency: value
                    }
                  }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {scheduleOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Export Time</Label>
              <Input
                type="time"
                value={settings?.exports?.schedule?.time || '02:00'}
                onChange={(e) => updateSettings({
                  exports: {
                    ...settings?.exports,
                    schedule: {
                      ...settings?.exports?.schedule,
                      time: e.target.value
                    }
                  }
                })}
                disabled={settings?.exports?.schedule?.frequency === 'disabled'}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email Recipients</Label>
            <Input
              placeholder="email1@example.com, email2@example.com"
              value={settings?.exports?.schedule?.emails || ''}
              onChange={(e) => updateSettings({
                exports: {
                  ...settings?.exports,
                  schedule: {
                    ...settings?.exports?.schedule,
                    emails: e.target.value
                  }
                }
              })}
              disabled={settings?.exports?.schedule?.frequency === 'disabled'}
            />
          </div>

          <div className="space-y-2">
            <Label>S3 Bucket (optional)</Label>
            <Input
              placeholder="s3://your-bucket-name/path"
              value={settings?.exports?.schedule?.s3Bucket || ''}
              onChange={(e) => updateSettings({
                exports: {
                  ...settings?.exports,
                  schedule: {
                    ...settings?.exports?.schedule,
                    s3Bucket: e.target.value
                  }
                }
              })}
              disabled={settings?.exports?.schedule?.frequency === 'disabled'}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share className="h-5 w-5" />
            <span>Public Sharing</span>
          </CardTitle>
          <CardDescription>Configure public access to dashboard views</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-1">
              <Label className="font-medium">Enable Public Sharing</Label>
              <p className="text-xs text-muted-foreground">
                Allow creation of public dashboard links
              </p>
            </div>
            <Switch
              checked={settings?.exports?.publicSharing?.enabled || false}
              onCheckedChange={(checked) => updateSettings({
                exports: {
                  ...settings?.exports,
                  publicSharing: {
                    ...settings?.exports?.publicSharing,
                    enabled: checked
                  }
                }
              })}
            />
          </div>

          {settings?.exports?.publicSharing?.enabled && (
            <div className="space-y-4 pl-4 border-l-2 border-muted">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Link Expiration (hours)</Label>
                  <Input
                    type="number"
                    value={settings?.exports?.publicSharing?.expirationHours || 24}
                    onChange={(e) => updateSettings({
                      exports: {
                        ...settings?.exports,
                        publicSharing: {
                          ...settings?.exports?.publicSharing,
                          expirationHours: parseInt(e.target.value)
                        }
                      }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Max Views per Link</Label>
                  <Input
                    type="number"
                    value={settings?.exports?.publicSharing?.maxViews || 100}
                    onChange={(e) => updateSettings({
                      exports: {
                        ...settings?.exports,
                        publicSharing: {
                          ...settings?.exports?.publicSharing,
                          maxViews: parseInt(e.target.value)
                        }
                      }
                    })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings?.exports?.publicSharing?.requireSignature || true}
                  onCheckedChange={(checked) => updateSettings({
                    exports: {
                      ...settings?.exports,
                      publicSharing: {
                        ...settings?.exports?.publicSharing,
                        requireSignature: checked
                      }
                    }
                  })}
                />
                <Label>Require signed URLs</Label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportsSharingSection;