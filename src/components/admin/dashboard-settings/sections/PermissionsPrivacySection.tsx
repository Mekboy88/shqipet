import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, EyeOff, FileText } from "lucide-react";

interface PermissionsPrivacySectionProps {
  settings: any;
  updateSettings: (updates: any) => void;
}

const PermissionsPrivacySection: React.FC<PermissionsPrivacySectionProps> = ({
  settings,
  updateSettings
}) => {
  const roles = ['super_admin', 'admin', 'moderator', 'analyst', 'viewer'];
  const cardIds = ['totalUsers', 'onlineUsers', 'contentPosts', 'comments', 'groups', 'messages', 'revenue', 'platformHealth'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Role-Based Permissions</span>
          </CardTitle>
          <CardDescription>Configure which roles can view each dashboard card</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cardIds.map(cardId => (
              <div key={cardId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium capitalize">
                    {cardId.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {settings?.permissions?.[cardId] ? Object.keys(settings.permissions[cardId]).filter(role => settings.permissions[cardId][role]).length : 0} roles
                  </Badge>
                </div>
                
                <div className="grid grid-cols-5 gap-2">
                  {roles.map(role => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${cardId}-${role}`}
                        checked={settings?.permissions?.[cardId]?.[role] || false}
                        onCheckedChange={(checked) => updateSettings({
                          permissions: {
                            ...settings?.permissions,
                            [cardId]: {
                              ...settings?.permissions?.[cardId],
                              [role]: checked
                            }
                          }
                        })}
                      />
                      <Label htmlFor={`${cardId}-${role}`} className="text-xs capitalize">
                        {role.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <EyeOff className="h-5 w-5" />
            <span>Privacy Controls</span>
          </CardTitle>
          <CardDescription>Configure data privacy and PII protection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-1">
              <Label className="font-medium">PII Safe Mode</Label>
              <p className="text-xs text-muted-foreground">
                Hide emails, IP addresses, and user IDs from all dashboard cards
              </p>
            </div>
            <Switch
              checked={settings?.permissions?.piiSafeMode || false}
              onCheckedChange={(checked) => updateSettings({
                permissions: {
                  ...settings?.permissions,
                  piiSafeMode: checked
                }
              })}
            />
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-1">
              <Label className="font-medium">Hide Sensitive Data</Label>
              <p className="text-xs text-muted-foreground">
                Mask revenue figures and financial metrics for non-admin users
              </p>
            </div>
            <Switch
              checked={settings?.permissions?.hideSensitiveData || false}
              onCheckedChange={(checked) => updateSettings({
                permissions: {
                  ...settings?.permissions,
                  hideSensitiveData: checked
                }
              })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Audit Logging</span>
          </CardTitle>
          <CardDescription>All settings changes are automatically logged with full audit trail</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Audit Trail Features</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Who made the change (user ID and role)</li>
              <li>• What was changed (before → after values)</li>
              <li>• When the change was made (timestamp)</li>
              <li>• Source IP address and user agent</li>
              <li>• Change reason (if provided)</li>
            </ul>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Audit Log Retention</span>
                <Badge variant="secondary">90 days</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsPrivacySection;