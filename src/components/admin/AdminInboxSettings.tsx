import React, { useState } from 'react';
import { X, Settings, Palette, Shield, MessageCircle, Users, Eye, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface AdminInboxSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  onThemeChange: (theme: string) => void;
}

const AdminInboxSettings: React.FC<AdminInboxSettingsProps> = ({
  isOpen,
  onClose,
  theme,
  onThemeChange
}) => {
  const [settings, setSettings] = useState({
    autoRefresh: true,
    readReceipts: true,
    aiSuggestions: true,
    voiceMessages: false,
    defaultSLA: '24h',
    autoPrioritize: true,
    autoAssign: true,
    flagDetection: true,
    compactMode: false
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  console.log('AdminInboxSettings: Rendering settings panel', { isOpen, settings });

  return (
    <div className="fixed inset-0 z-[999999] flex justify-end">
      <div className="bg-background border-l border-border shadow-xl w-[420px] h-screen flex flex-col max-w-[90vw]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Admin Settings</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          {/* General Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              <h3 className="font-medium">General Settings</h3>
            </div>
            
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label>Auto Refresh</Label>
                <Switch
                  checked={settings.autoRefresh}
                  onCheckedChange={(checked) => updateSetting('autoRefresh', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Read Receipts</Label>
                <Switch
                  checked={settings.readReceipts}
                  onCheckedChange={(checked) => updateSetting('readReceipts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>AI Suggestions</Label>
                <Switch
                  checked={settings.aiSuggestions}
                  onCheckedChange={(checked) => updateSetting('aiSuggestions', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Voice Messages</Label>
                <Switch
                  checked={settings.voiceMessages}
                  onCheckedChange={(checked) => updateSetting('voiceMessages', checked)}
                />
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              <h3 className="font-medium">Theme</h3>
            </div>
            
            <div className="pl-6">
              <Select value={theme} onValueChange={onThemeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="white-black">White & Black</SelectItem>
                  <SelectItem value="white-blue">White & Blue</SelectItem>
                  <SelectItem value="white-honey">White & Honey</SelectItem>
                  <SelectItem value="light-grey">Light Grey</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pro Support */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <h3 className="font-medium">Pro Support</h3>
            </div>
            
            <div className="space-y-3 pl-6">
              <div className="space-y-2">
                <Label>Default SLA</Label>
                <Select 
                  value={settings.defaultSLA} 
                  onValueChange={(value) => updateSetting('defaultSLA', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12 Hours</SelectItem>
                    <SelectItem value="24h">24 Hours</SelectItem>
                    <SelectItem value="48h">48 Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Auto-prioritize Pro Users</Label>
                <Switch
                  checked={settings.autoPrioritize}
                  onCheckedChange={(checked) => updateSetting('autoPrioritize', checked)}
                />
              </div>
            </div>
          </div>

          {/* Message Handling */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="font-medium">Message Handling</h3>
            </div>
            
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label>Auto-assign Messages</Label>
                <Switch
                  checked={settings.autoAssign}
                  onCheckedChange={(checked) => updateSetting('autoAssign', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Flag Detection</Label>
                <Switch
                  checked={settings.flagDetection}
                  onCheckedChange={(checked) => updateSetting('flagDetection', checked)}
                />
              </div>
            </div>
          </div>

          {/* View Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <h3 className="font-medium">View Settings</h3>
            </div>
            
            <div className="pl-6">
              <div className="flex items-center justify-between">
                <Label>Compact Mode</Label>
                <Switch
                  checked={settings.compactMode}
                  onCheckedChange={(checked) => updateSetting('compactMode', checked)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button onClick={onClose} className="w-full">
            <Check className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminInboxSettings;