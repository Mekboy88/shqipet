import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Languages, 
  Settings, 
  Shield,
  Download,
  Upload
} from 'lucide-react';
import LanguageManagement from '@/components/admin/localization/LanguageManagement';
import TranslationEditor from '@/components/admin/localization/TranslationEditor';
import { useI18nSettings } from '@/hooks/useI18nSettings';
import { toast } from '@/hooks/use-toast';

export default function LocalizationPage() {
  const [activeTab, setActiveTab] = useState('languages');
  const [previewLocale, setPreviewLocale] = useState<string>('none');
  const [selectedLocale, setSelectedLocale] = useState<string>('en');
  const [forceAdminEnglish, setForceAdminEnglish] = useState(true);
  const [syncUserSettings, setSyncUserSettings] = useState(true);

  const { 
    settings, 
    loading: settingsLoading, 
    updateSystemSettings
  } = useI18nSettings();

  const handleSystemSettingsUpdate = async (updates: any) => {
    try {
      await updateSystemSettings(updates);
      toast({
        title: "System Settings Updated",
        description: "Settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update system settings",
        variant: "destructive",
      });
    }
  };

  const LanguagesTab = () => (
    <LanguageManagement 
      previewLocale={previewLocale}
      onPreviewLocaleChange={setPreviewLocale}
    />
  );

  const TranslateTab = () => (
    <TranslationEditor 
      selectedLocale={selectedLocale}
      onLocaleChange={setSelectedLocale}
    />
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      {/* Admin English Lock */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Production Security Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-red-800">Force Admin Login & Settings in English (Production)</label>
              <p className="text-sm text-red-600">
                LOCKED: Admin login and settings pages ALWAYS render in English for security
              </p>
            </div>
            <Badge variant="destructive" className="bg-red-600">
              LOCKED
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Preview Locale for Admins</label>
              <p className="text-sm text-muted-foreground">
                Query parameter ?previewLocale=xx for testing (never persists)
              </p>
            </div>
            <Switch checked={true} />
          </div>
        </CardContent>
      </Card>

      {/* Detection Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Language Detection Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Path Detection (/xx/page)</label>
                <p className="text-sm text-muted-foreground">Detect language from URL path</p>
              </div>
              <Switch checked={true} onCheckedChange={() => {}} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Cookie Detection</label>
                <p className="text-sm text-muted-foreground">Use stored language preference</p>
              </div>
              <Switch checked={true} onCheckedChange={() => {}} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Browser Language Detection</label>
                <p className="text-sm text-muted-foreground">Use navigator.language</p>
              </div>
              <Switch checked={true} onCheckedChange={() => {}} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle>System Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Sync with User Settings</label>
              <p className="text-sm text-muted-foreground">
                User language dropdown shows exactly the enabled languages here
              </p>
            </div>
            <Switch 
              checked={syncUserSettings} 
              onCheckedChange={(checked) => {
                setSyncUserSettings(checked);
                handleSystemSettingsUpdate({ sync_user_settings: checked });
              }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Real-time Manifest Sync</label>
              <p className="text-sm text-muted-foreground">
                Clients auto-update when languages change (version bump)
              </p>
            </div>
            <Switch checked={true} />
          </div>
        </CardContent>
      </Card>

      {/* Import/Export */}
      <Card>
        <CardHeader>
          <CardTitle>Import / Export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Download className="w-6 h-6 mb-2" />
              Export All Locales (ZIP)
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Upload className="w-6 h-6 mb-2" />
              Import Locales (ZIP/JSON)
            </Button>
          </div>
          <div className="mt-4 p-3 bg-muted rounded text-sm">
            <p><strong>Export format:</strong> ZIP archive with locales/[locale]/[namespace].json + manifest.json</p>
            <p><strong>Import validation:</strong> JSON schema validation with BCP-47 code verification</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {previewLocale && previewLocale !== 'none' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              Preview Mode: {previewLocale}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPreviewLocale('none')}
            >
              Exit Preview
            </Button>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex w-full gap-4 bg-transparent p-1 justify-center">
          <TabsTrigger 
            value="languages" 
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-100 text-blue-700 border border-blue-200 shadow-sm hover:shadow-md hover:bg-blue-200 transition-all duration-200 data-[state=active]:bg-blue-200 data-[state=active]:shadow-md data-[state=active]:border-blue-300 font-medium"
          >
            <Globe className="w-4 h-4" />
            Languages
          </TabsTrigger>
          <TabsTrigger 
            value="translate" 
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-100 text-green-700 border border-green-200 shadow-sm hover:shadow-md hover:bg-green-200 transition-all duration-200 data-[state=active]:bg-green-200 data-[state=active]:shadow-md data-[state=active]:border-green-300 font-medium"
          >
            <Languages className="w-4 h-4" />
            Translate
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-purple-100 text-purple-700 border border-purple-200 shadow-sm hover:shadow-md hover:bg-purple-200 transition-all duration-200 data-[state=active]:bg-purple-200 data-[state=active]:shadow-md data-[state=active]:border-purple-300 font-medium"
          >
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="languages" className="mt-6">
          <LanguagesTab />
        </TabsContent>

        <TabsContent value="translate" className="mt-6">
          <TranslateTab />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}