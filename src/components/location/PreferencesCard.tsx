// @ts-nocheck
// DO NOT EDIT — Location & Preferences core. Breaking this may disable real-time location and user privacy controls.

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Globe, Clock, Languages } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import supabase from '@/lib/relaxedSupabase';

interface PreferencesData {
  country_code: string;
  timezone: string;
  language: string;
}

export const PreferencesCard: React.FC = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<PreferencesData>({
    country_code: '',
    timezone: '',
    language: ''
  });
  const [originalPreferences, setOriginalPreferences] = useState<PreferencesData>({
    country_code: '',
    timezone: '',
    language: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'AL', name: 'Albania' }
  ];

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'America/Denver',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Rome',
    'Europe/Amsterdam',
    'Europe/Tirane',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney'
  ];

  const languages = [
    { code: 'en-US', name: 'Anglisht (SHBA)' },
    { code: 'en-GB', name: 'Anglisht (MB)' },
    { code: 'en-CA', name: 'Anglisht (Kanada)' },
    { code: 'en-AU', name: 'Anglisht (Australi)' },
    { code: 'en-IE', name: 'Anglisht (Irlandë)' },
    { code: 'en-NZ', name: 'Anglisht (Zelandë e Re)' },
    { code: 'bs', name: 'Boshnjakisht' },
    { code: 'bg', name: 'Bullgarisht' },
    { code: 'hr', name: 'Kroatisht' },
    { code: 'mk', name: 'Maqedonisht' },
    { code: 'sl', name: 'Sllovenisht' },
    { code: 'el', name: 'Greqisht' },
    { code: 'ro', name: 'Rumanisht' },
    { code: 'fr', name: 'Frëngjisht' },
    { code: 'de', name: 'Gjermanisht' },
    { code: 'it', name: 'Italisht' },
    { code: 'es', name: 'Spanjisht' },
    { code: 'pt', name: 'Portugalisht' },
    { code: 'pl', name: 'Polonisht' },
    { code: 'nl', name: 'Holandisht' },
    { code: 'cs', name: 'Çekisht' },
    { code: 'sk', name: 'Sllovakisht' },
    { code: 'hu', name: 'Hungarisht' },
    { code: 'sv', name: 'Suedisht' },
    { code: 'da', name: 'Danisht' },
    { code: 'no', name: 'Norvegjisht' },
    { code: 'ru', name: 'Rusisht' },
    { code: 'fi', name: 'Finlandisht' },
    { code: 'uk', name: 'Ukrainisht' },
    { code: 'tr', name: 'Turqisht' },
    { code: 'ja', name: 'Japonisht' },
    { code: 'zh', name: 'Kinezisht' },
    { code: 'ko', name: 'Koreanisht' },
    { code: 'hi', name: 'Hindisht' },
    { code: 'th', name: 'Tajlandisht' },
    { code: 'ar', name: 'Arabisht' },
    { code: 'vi', name: 'Vietnamisht' },
    { code: 'id', name: 'Indonezisht' },
    { code: 'ms', name: 'Malajisht' },
    { code: 'tl', name: 'Filipinisht' },
    { code: 'bn', name: 'Bengalisht' },
    { code: 'fa', name: 'Persianisht' },
    { code: 'he', name: 'Hebraisht' },
    { code: 'ur', name: 'Urdisht' }
  ];

  useEffect(() => {
    loadPreferences();
  }, [user]);

  useEffect(() => {
    const changed = JSON.stringify(preferences) !== JSON.stringify(originalPreferences);
    setHasChanges(changed);
  }, [preferences, originalPreferences]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('country_code, timezone, language')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const prefs = {
        country_code: data?.country_code || '',
        timezone: data?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: data?.language || 'en'
      };

      setPreferences(prefs);
      setOriginalPreferences(prefs);
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast.error('Failed to load preferences');
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          country_code: preferences.country_code,
          timezone: preferences.timezone,
          language: preferences.language,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setOriginalPreferences({ ...preferences });
      toast.success('Preferences saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = (field: keyof PreferencesData, value: string) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card id="preferences" className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Preferences
        </CardTitle>
        <CardDescription>
          Set your country, timezone, and language preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Country
            </Label>
            <Select 
              value={preferences.country_code} 
              onValueChange={(value) => handlePreferenceChange('country_code', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <Label htmlFor="timezone" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timezone
            </Label>
            <Select 
              value={preferences.timezone} 
              onValueChange={(value) => handlePreferenceChange('timezone', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((timezone) => (
                  <SelectItem key={timezone} value={timezone}>
                    {timezone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Language */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="language" className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              Language
            </Label>
            <Select 
              value={preferences.language} 
              onValueChange={(value) => handlePreferenceChange('language', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language.code} value={language.code}>
                    {language.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={savePreferences}
            disabled={!hasChanges || isLoading}
            className="min-w-24"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};