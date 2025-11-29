import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter,
  GripVertical,
  AlertCircle,
  CheckCircle,
  Eye,
  Download,
  Upload
} from 'lucide-react';
import { useI18nLanguages } from '@/hooks/useI18nLanguages';
import { useI18nSettings } from '@/hooks/useI18nSettings';
import { useI18nMissingKeys } from '@/hooks/useI18nMissingKeys';
import { toast } from '@/hooks/use-toast';

interface LanguageManagementProps {
  previewLocale: string;
  onPreviewLocaleChange: (locale: string) => void;
}

export default function LanguageManagement({ previewLocale, onPreviewLocaleChange }: LanguageManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [isDirty, setIsDirty] = useState(false);

  const { 
    languages, 
    loading: languagesLoading, 
    updateLanguage, 
    reorderLanguages 
  } = useI18nLanguages();

  const { 
    settings, 
    loading: settingsLoading, 
    updateDefaults, 
    updateDetectionOrder 
  } = useI18nSettings();

  const { 
    missingKeys,
    getKeyStats
  } = useI18nMissingKeys();

  const regions = React.useMemo(() => {
    const regionCounts = languages?.reduce((acc, lang) => {
      acc[lang.region] = (acc[lang.region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return [
      { name: 'all', count: languages?.length || 0, active: selectedRegion === 'all' },
      ...Object.entries(regionCounts).map(([region, count]) => ({
        name: region,
        count,
        active: selectedRegion === region
      }))
    ];
  }, [languages, selectedRegion]);

  const filteredLanguages = React.useMemo(() => {
    const filtered = languages?.filter(lang => {
      const matchesSearch = lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lang.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'all' || lang.region === selectedRegion;
      return matchesSearch && matchesRegion;
    }) || [];

    return filtered.sort((a, b) => a.sort_index - b.sort_index);
  }, [languages, searchQuery, selectedRegion]);

  const handleLanguageToggle = async (code: string, enabled: boolean) => {
    try {
      await updateLanguage(code, { enabled });
      setIsDirty(true);
      toast({
        title: "Language Updated",
        description: `${code} ${enabled ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update language",
        variant: "destructive",
      });
    }
  };

  const handleSaveDefaults = async (defaultLocale: string, fallbackLocale: string) => {
    try {
      await updateDefaults(defaultLocale, fallbackLocale);
      setIsDirty(false);
      toast({
        title: "Settings Saved",
        description: "Default and fallback locales updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  const keyStats = getKeyStats();

  if (languagesLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Languages & Localization</h2>
          <p className="text-muted-foreground">Manage supported languages and localization settings</p>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              <AlertCircle className="w-3 h-3 mr-1" />
              Unsaved changes
            </Badge>
          )}
          <Select value={previewLocale} onValueChange={onPreviewLocaleChange}>
            <SelectTrigger className="w-48">
              <Eye className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Preview locale" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No preview</SelectItem>
              {languages?.filter(l => l.enabled).map(lang => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search languages by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {regions.map(region => (
              <SelectItem key={region.name} value={region.name}>
                {region.name === 'all' ? 'All Regions' : region.name} ({region.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Default & Fallback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Default Locale</label>
              <Select 
                value={settings?.default_locale} 
                onValueChange={(value) => settings && handleSaveDefaults(value, settings.fallback_locale)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages?.filter(l => l.enabled).map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Fallback Locale</label>
              <Select 
                value={settings?.fallback_locale}
                onValueChange={(value) => settings && handleSaveDefaults(settings.default_locale, value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages?.filter(l => l.enabled).map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detection Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {settings?.detection_order?.map((method, index) => (
                <div key={method} className="flex items-center gap-2">
                  <Badge variant="outline">{index + 1}</Badge>
                  <span className="capitalize">{method}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Import/Export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export All Locales
            </Button>
            <Button variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Import Locales (ZIP)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Languages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLanguages.map((language, index) => (
          <Card key={language.code} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                  <span className="text-2xl">{language.flag}</span>
                  <div>
                    <h3 className="font-medium">{language.name}</h3>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs font-mono">
                        {language.code}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Switch
                  checked={language.enabled}
                  onCheckedChange={(checked) => handleLanguageToggle(language.code, checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Badge 
                  variant={language.region === 'Balkans' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {language.region}
                </Badge>
                <div className="flex gap-1">
                  {language.code === settings?.default_locale && (
                    <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                      Default
                    </Badge>
                  )}
                  {language.code === settings?.fallback_locale && (
                    <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                      Fallback
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {languages?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Languages</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {languages?.filter(l => l.enabled).length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Enabled</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {regions.filter(r => r.name !== 'all').length}
              </div>
              <div className="text-sm text-muted-foreground">Regions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {keyStats.unresolved || 0}
              </div>
              <div className="text-sm text-muted-foreground">Missing Keys</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-600">
                {keyStats.namespaces || 0}
              </div>
              <div className="text-sm text-muted-foreground">Namespaces</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}