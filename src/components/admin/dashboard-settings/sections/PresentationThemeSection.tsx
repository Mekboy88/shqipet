import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Globe, Clock, Accessibility } from "lucide-react";

interface PresentationThemeSectionProps {
  settings: any;
  updateSettings: (updates: any) => void;
}

const PresentationThemeSection: React.FC<PresentationThemeSectionProps> = ({
  settings,
  updateSettings
}) => {
  const themes = [
    { value: 'system', label: 'Follow System' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];

  const locales = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'de-DE', label: 'German' },
    { value: 'fr-FR', label: 'French' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'ja-JP', label: 'Japanese' },
  ];

  const currencies = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' },
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Theme & Appearance</span>
          </CardTitle>
          <CardDescription>Configure visual appearance and theme settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Global Theme</Label>
              <Select
                value={settings?.theme?.mode || 'system'}
                onValueChange={(value) => updateSettings({
                  theme: {
                    ...settings?.theme,
                    mode: value
                  }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themes.map(theme => (
                    <SelectItem key={theme.value} value={theme.value}>
                      {theme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Card Accent Color</Label>
              <Input
                type="color"
                value={settings?.theme?.accentColor || '#3b82f6'}
                onChange={(e) => updateSettings({
                  theme: {
                    ...settings?.theme,
                    accentColor: e.target.value
                  }
                })}
                className="h-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Localization</span>
          </CardTitle>
          <CardDescription>Configure number formatting and currency display</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Number Format Locale</Label>
              <Select
                value={settings?.theme?.locale || 'en-US'}
                onValueChange={(value) => updateSettings({
                  theme: {
                    ...settings?.theme,
                    locale: value
                  }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locales.map(locale => (
                    <SelectItem key={locale.value} value={locale.value}>
                      {locale.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Default Currency</Label>
              <Select
                value={settings?.theme?.currency || 'USD'}
                onValueChange={(value) => updateSettings({
                  theme: {
                    ...settings?.theme,
                    currency: value
                  }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(currency => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Time & Date</span>
          </CardTitle>
          <CardDescription>Configure timezone and business hours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select
                value={settings?.theme?.timezone || 'UTC'}
                onValueChange={(value) => updateSettings({
                  theme: {
                    ...settings?.theme,
                    timezone: value
                  }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map(tz => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Business Day Start (24h format)</Label>
              <Input
                type="time"
                value={settings?.theme?.businessDayStart || '09:00'}
                onChange={(e) => updateSettings({
                  theme: {
                    ...settings?.theme,
                    businessDayStart: e.target.value
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
            <Accessibility className="h-5 w-5" />
            <span>Accessibility</span>
          </CardTitle>
          <CardDescription>Configure accessibility and motion preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <Label className="font-medium">High Contrast Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Increase contrast for better visibility
                </p>
              </div>
              <Switch
                checked={settings?.theme?.highContrast || false}
                onCheckedChange={(checked) => updateSettings({
                  theme: {
                    ...settings?.theme,
                    highContrast: checked
                  }
                })}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <Label className="font-medium">Reduced Motion</Label>
                <p className="text-xs text-muted-foreground">
                  Minimize animations and transitions
                </p>
              </div>
              <Switch
                checked={settings?.theme?.reducedMotion || false}
                onCheckedChange={(checked) => updateSettings({
                  theme: {
                    ...settings?.theme,
                    reducedMotion: checked
                  }
                })}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <Label className="font-medium">Large Text Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Increase font sizes for better readability
                </p>
              </div>
              <Switch
                checked={settings?.theme?.largeText || false}
                onCheckedChange={(checked) => updateSettings({
                  theme: {
                    ...settings?.theme,
                    largeText: checked
                  }
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PresentationThemeSection;