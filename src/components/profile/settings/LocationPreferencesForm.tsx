import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { MapPin, Navigation, Settings, Globe, Clock, Languages, Loader2, Search, ChevronDown, X } from 'lucide-react';
import TimezoneDisplay from './TimezoneDisplay';
import { COUNTRIES, Country } from '@/data/countries';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/hooks/useLocalization';
import { LiveMap } from '@/components/location/LiveMap';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useLocationSync } from '@/hooks/useLocationSync';
import { usePreferencesSync } from '@/hooks/usePreferencesSync';
import { useServiceWorker } from '@/hooks/useServiceWorker';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminLanguage {
  id: string;
  language_code: string;
  language_name: string;
  native_name: string;
  flag_emoji: string;
  is_enabled: boolean;
  is_default: boolean;
  sort_order: number;
}

const LocationPreferencesForm: React.FC<{ userInfo: any; setUserInfo: any }> = () => {
  const { toast } = useToast();
  const [allLanguages, setAllLanguages] = useState<AdminLanguage[]>([]);
  const [languagesLoading, setLanguagesLoading] = useState(true);
  
  // Location state
  const { location, error, isLoading, isWatching, permission, getCurrentPosition, startWatching, stopWatching } = useGeolocation();
  const { syncLocation, getUserLocation, subscribeToLocationUpdates } = useLocationSync();
  const { syncPreferences, getUserPreferences, subscribeToPreferencesUpdates, suggestTimezoneFromLocation } = usePreferencesSync();
  const { isOfflineReady } = useServiceWorker();

  // UI state - Auto-enable consent for persistent location
  const [hasConsent, setHasConsent] = useState(true);
  const [shareLevel, setShareLevel] = useState<'private' | 'friends' | 'public'>('private');
  const [manualLocation, setManualLocation] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [locationMethod, setLocationMethod] = useState<'gps' | 'manual' | 'ip' | null>(null);
  
  // Language selection panel state
  const [isLanguagePanelOpen, setIsLanguagePanelOpen] = useState(false);
  const [languageSearchQuery, setLanguageSearchQuery] = useState('');
  
  // Country selection panel state
  const [isCountryPanelOpen, setIsCountryPanelOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [autoDetectedCountry, setAutoDetectedCountry] = useState<string | null>(null);
  
  const { currentLanguage } = useLocalization();
  
  // Preferences state
  const [preferences, setPreferences] = useState({
    country_code: '',
    timezone: '',
    language: 'sq'  // Default to Albanian
  });
  const [originalPreferences, setOriginalPreferences] = useState(preferences);
  const [hasPreferencesChanges, setHasPreferencesChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Fetch all languages from admin settings
  const fetchAllLanguages = async () => {
    try {
      setLanguagesLoading(true);
      const { data, error } = await supabase
        .from('admin_language_settings')
        .select('*')
        .eq('is_enabled', true)  // Only fetch enabled languages
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      console.log('Fetched admin languages:', data);
      setAllLanguages(data || []);
    } catch (err) {
      console.error('Error fetching admin languages:', err);
      setAllLanguages([]);
    } finally {
      setLanguagesLoading(false);
    }
  };

  // Load languages on mount and subscribe to real-time updates
  useEffect(() => {
    fetchAllLanguages();
    
    // Subscribe to real-time changes in admin language settings
    const languageChannel = supabase
      .channel('admin-language-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admin_language_settings'
        },
        (payload) => {
          console.log('Admin language settings changed:', payload);
          // Refetch languages when admin settings change
          fetchAllLanguages();
        }
      )
      .subscribe();

    // Also subscribe to profile changes to update language preference
    const profileChannel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('Profile updated:', payload);
          // Refresh user preferences when profile changes
          if (payload.new && payload.new.auth_user_id === supabase.auth.getUser()?.then(u => u.data?.user?.id)) {
            const updatedPrefs = {
              country_code: payload.new.country_code || '',
              timezone: payload.new.timezone || '',
              language: payload.new.language || 'sq'
            };
            setPreferences(updatedPrefs);
            setOriginalPreferences(updatedPrefs);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(languageChannel);
      supabase.removeChannel(profileChannel);
    };
  }, []);

  // Load existing data on mount and auto-start location sharing
  useEffect(() => {
    const loadData = async () => {
      const [locationData, preferencesData] = await Promise.all([
        getUserLocation(),
        getUserPreferences()
      ]);

      if (locationData) {
        setShareLevel((locationData.share_level as 'private' | 'friends' | 'public') || 'private');
        setLastUpdated(new Date(locationData.updated_at));
        setLocationMethod(locationData.method as 'gps' | 'manual' | 'ip');
      }

      if (preferencesData) {
        const prefs = {
          country_code: preferencesData.country_code || '',
          timezone: preferencesData.timezone || '',
          language: preferencesData.language || 'sq'  // Default to Albanian for profile interface
        };
        setPreferences(prefs);
        setOriginalPreferences(prefs);
      } else {
        // Set Albanian as default for profile interface, but respect admin default if available
        const defaultFromAdmin = allLanguages.find(l => l.is_default && l.is_enabled)?.language_code;
        const prefs = {
          country_code: '',
          timezone: '',
          language: defaultFromAdmin || 'sq'  // Albanian as fallback
        };
        setPreferences(prefs);
        setOriginalPreferences(prefs);
      }

      // Auto-start location sharing after data is loaded
      if (permission === 'granted' && !isWatching && hasConsent) {
        setTimeout(() => {
          startWatching();
        }, 1000); // Small delay to ensure everything is loaded
      }
    };

    loadData();
  }, [getUserLocation, getUserPreferences, allLanguages, permission, isWatching, hasConsent, startWatching]);

  // Watch for preferences changes
  useEffect(() => {
    setHasPreferencesChanges(
      preferences.country_code !== originalPreferences.country_code ||
      preferences.timezone !== originalPreferences.timezone ||
      preferences.language !== originalPreferences.language
    );
  }, [preferences, originalPreferences]);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribeLocation = subscribeToLocationUpdates((payload) => {
      if (payload.eventType === 'UPDATE' && payload.new) {
        setLastUpdated(new Date(payload.new.updated_at));
        setLocationMethod(payload.new.method);
      }
    });

    const unsubscribePreferences = subscribeToPreferencesUpdates((payload) => {
      if (payload.eventType === 'UPDATE' && payload.new) {
        const updatedPrefs = {
          country_code: payload.new.country_code || '',
          timezone: payload.new.timezone || '',
          language: payload.new.language || 'sq'  // Default to Albanian
        };
        setPreferences(updatedPrefs);
        setOriginalPreferences(updatedPrefs);
      }
    });

    return () => {
      unsubscribeLocation();
      unsubscribePreferences();
    };
  }, [subscribeToLocationUpdates, subscribeToPreferencesUpdates]);

  // Get selected country
  const selectedCountry = useMemo(() => {
    return preferences.country_code ? COUNTRIES.find(country => country.code === preferences.country_code) : null;
  }, [preferences.country_code]);

  // Auto-detect country on component mount - consolidated and controlled
  useEffect(() => {
    const detectCountry = async () => {
      // Only run if we don't have a country and aren't already detecting
      if (preferences.country_code || isDetectingLocation) return;
      
      setIsDetectingLocation(true);
      
      try {
        // Method 1: Try geolocation first
        if (navigator.geolocation) {
          await new Promise<void>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                try {
                  // Use reverse geocoding to get country from coordinates
                  const response = await fetch(
                    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
                  );
                  const data = await response.json();
                  
                  if (data.countryCode) {
                    const detectedCountry = data.countryCode.toUpperCase();
                    console.log('Auto-detected country from geolocation:', detectedCountry);
                    setAutoDetectedCountry(detectedCountry);
                    setPreferences(prev => ({ ...prev, country_code: detectedCountry }));
                  }
                  resolve();
                } catch (error) {
                  console.warn('Reverse geocoding failed:', error);
                  reject(error);
                }
              },
              (error) => {
                console.warn('Geolocation failed:', error);
                reject(error);
              },
              { timeout: 5000 }
            );
          });
        } else {
          throw new Error('Geolocation not available');
        }
      } catch (geoError) {
        console.warn('Geolocation detection failed, trying browser locale:', geoError);
        
        // Method 2: Fallback to browser locale/timezone
        try {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const locale = navigator.language || 'en-US';
          
          // Map common timezones to countries
          const timezoneToCountry: { [key: string]: string } = {
            'Europe/Tirane': 'AL', 'Europe/Vienna': 'AT', 'Europe/Brussels': 'BE',
            'Europe/Sofia': 'BG', 'Europe/Zagreb': 'HR', 'Europe/Prague': 'CZ',
            'Europe/Copenhagen': 'DK', 'Europe/Tallinn': 'EE', 'Europe/Helsinki': 'FI',
            'Europe/Paris': 'FR', 'Europe/Berlin': 'DE', 'Europe/Athens': 'GR',
            'Europe/Budapest': 'HU', 'Europe/Dublin': 'IE', 'Europe/Rome': 'IT',
            'Europe/Riga': 'LV', 'Europe/Vilnius': 'LT', 'Europe/Luxembourg': 'LU',
            'Europe/Amsterdam': 'NL', 'Europe/Oslo': 'NO', 'Europe/Warsaw': 'PL',
            'Europe/Lisbon': 'PT', 'Europe/Bucharest': 'RO', 'Europe/Stockholm': 'SE',
            'Europe/Ljubljana': 'SI', 'Europe/Bratislava': 'SK', 'Europe/Madrid': 'ES',
            'Europe/Zurich': 'CH', 'Europe/London': 'GB', 'America/New_York': 'US',
            'America/Chicago': 'US', 'America/Denver': 'US', 'America/Los_Angeles': 'US',
            'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'Asia/Tokyo': 'JP',
            'Asia/Shanghai': 'CN', 'Asia/Kolkata': 'IN', 'Australia/Sydney': 'AU'
          };
          
          // Try timezone mapping first
          let detectedCountry = timezoneToCountry[timezone];
          
          // If not found, try locale mapping
          if (!detectedCountry && locale.includes('-')) {
            const countryFromLocale = locale.split('-')[1]?.toUpperCase();
            if (countryFromLocale && COUNTRIES.find(c => c.code === countryFromLocale)) {
              detectedCountry = countryFromLocale;
            }
          }
          
          if (detectedCountry) {
            console.log('Auto-detected country from browser:', detectedCountry);
            setAutoDetectedCountry(detectedCountry);
            setPreferences(prev => ({ ...prev, country_code: detectedCountry }));
          }
        } catch (localeError) {
          console.warn('Browser-based detection failed:', localeError);
        }
      }
      
      setIsDetectingLocation(false);
    };

    // Only run once when component mounts
    detectCountry();
  }, []); // Empty dependency array - only run once

  // Handle location sharing
  const handleShareLocation = async () => {
    if (!hasConsent) {
      toast({
        title: 'Consent Required',
        description: 'Please agree to share your location first.',
        variant: 'destructive',
      });
      return;
    }

    if (isWatching) {
      stopWatching();
    } else {
      startWatching();
    }
  };

  // Handle single location update
  const handleUpdateOnce = async () => {
    if (!hasConsent) {
      toast({
        title: 'Consent Required',
        description: 'Please agree to share your location first.',
        variant: 'destructive',
      });
      return;
    }

    getCurrentPosition();
  };

  // Handle manual location entry
  const handleManualLocation = async () => {
    if (!manualLocation.trim()) {
      toast({
        title: 'Location Required',
        description: 'Please enter a location.',
        variant: 'destructive',
      });
      return;
    }

    // Geocoding would be implemented here
    // For now, just show a message
    toast({
      title: 'Manual Location',
      description: 'Geocoding feature coming soon. Use GPS location for now.',
    });
  };

  // Auto-maintain persistent location sharing
  useEffect(() => {
    // Ensure location sharing stays active
    if (hasConsent && permission === 'granted' && !isWatching && !error) {
      const timeoutId = setTimeout(() => {
        startWatching();
      }, 2000); // Restart if it stops
      
      return () => clearTimeout(timeoutId);
    }
  }, [hasConsent, permission, isWatching, error, startWatching]);

  // Sync location when it changes
  useEffect(() => {
    if (location && hasConsent) {
      syncLocation({
        lat: location.lat,
        lng: location.lng,
        accuracy_m: location.accuracy,
        method: 'gps',
        share_level: shareLevel,
      }).then(() => {
        setLastUpdated(new Date());
        setLocationMethod('gps');
      });
    }
  }, [location, hasConsent, shareLevel, syncLocation]);

  // Handle preferences save
  const handleSavePreferences = async () => {
    setIsSaving(true);
    
    try {
      const result = await syncPreferences(preferences);
      
      if (result.success) {
        setOriginalPreferences(preferences);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Handle preference change
  const handlePreferenceChange = (key: keyof typeof preferences, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };


  // Simple coordinate to country mapping
  const getCountryFromCoordinates = (lat: number, lng: number): string | null => {
    // Albania
    if (lat >= 39.6 && lat <= 42.7 && lng >= 19.3 && lng <= 21.1) return 'al';
    // United States
    if (lat >= 24.7 && lat <= 49.4 && lng >= -125.0 && lng <= -66.9) return 'us';
    // United Kingdom
    if (lat >= 49.9 && lat <= 60.9 && lng >= -8.2 && lng <= 1.8) return 'gb';
    // Germany
    if (lat >= 47.3 && lat <= 55.0 && lng >= 5.9 && lng <= 15.0) return 'de';
    // France
    if (lat >= 41.3 && lat <= 51.1 && lng >= -5.1 && lng <= 9.6) return 'fr';
    // Add more coordinate mappings as needed
    return null;
  };

  // Get selected language with Albanian as profile default
  const selectedLanguage = useMemo(() => {
    // Always provide Albanian as fallback for profile interface
    const albanianFallback = { 
      language_code: 'sq', 
      language_name: 'Albanian', 
      native_name: 'Shqip', 
      flag_emoji: '🇦🇱', 
      is_default: true, 
      sort_order: 1 
    };
    
    if (languagesLoading || allLanguages.length === 0) {
      return albanianFallback;
    }
    
    // First try to find the user's selected language
    const userSelected = allLanguages.find(lang => lang.language_code === preferences.language && lang.is_enabled);
    if (userSelected) {
      return userSelected;
    }
    
    // If user hasn't selected anything, try Albanian from admin settings if enabled
    const albanianFromAdmin = allLanguages.find(lang => lang.language_code === 'sq' && lang.is_enabled);
    if (albanianFromAdmin) {
      return albanianFromAdmin;
    }
    
    // Then try admin default if it exists and is enabled
    const adminDefault = allLanguages.find(lang => lang.is_default && lang.is_enabled);
    if (adminDefault) {
      return adminDefault;
    }
    
    // Finally, first enabled language or Albanian fallback
    const firstEnabled = allLanguages.find(lang => lang.is_enabled);
    return firstEnabled || albanianFallback;
  }, [preferences.language, allLanguages, languagesLoading]);

  // Filter languages for search - show only enabled languages from admin settings
  const filteredLanguages = useMemo(() => {
    if (languagesLoading || allLanguages.length === 0) {
      return [];
    }
    
    // Filter to only show enabled languages
    const enabledLanguages = allLanguages.filter(lang => lang.is_enabled);
    
    if (!languageSearchQuery || !languageSearchQuery.trim()) {
      return enabledLanguages;
    }
    
    const query = languageSearchQuery.toLowerCase().trim();
    
    return enabledLanguages.filter(language => {
      const name = language.language_name.toLowerCase();
      const nativeName = language.native_name.toLowerCase();
      const code = language.language_code.toLowerCase();
      
      return name.includes(query) || nativeName.includes(query) || code.includes(query);
    });
  }, [languageSearchQuery, allLanguages, languagesLoading]);

  const handleLanguageSelect = (languageCode: string) => {
    handlePreferenceChange('language', languageCode);
    setIsLanguagePanelOpen(false);
    setLanguageSearchQuery('');
    
    // Auto-save immediately
    const updatedPrefs = { ...preferences, language: languageCode };
    syncPreferences(updatedPrefs);
  };

  // Filter countries for search
  const filteredCountries = useMemo(() => {
    const sortedCountries = [...COUNTRIES].sort((a, b) => {
      const nameA = currentLanguage === 'sq' ? a.nameAlbanian : a.name;
      const nameB = currentLanguage === 'sq' ? b.nameAlbanian : b.name;
      return nameA.toLowerCase().localeCompare(nameB.toLowerCase());
    });

    if (!countrySearchQuery || !countrySearchQuery.trim()) {
      return sortedCountries;
    }
    
    const query = countrySearchQuery.toLowerCase().trim();
    
    const filtered = sortedCountries.filter(country => {
      const albanianName = country.nameAlbanian.toLowerCase();
      const englishName = country.name.toLowerCase();
      const countryCode = country.code.toLowerCase();
      
      return albanianName.startsWith(query) || 
             englishName.startsWith(query) ||
             albanianName.includes(query) ||
             englishName.includes(query) ||
             countryCode.startsWith(query);
    });

    return filtered.sort((a, b) => {
      const aAlbanian = a.nameAlbanian.toLowerCase();
      const aEnglish = a.name.toLowerCase();
      const aCode = a.code.toLowerCase();
      const bAlbanian = b.nameAlbanian.toLowerCase();
      const bEnglish = b.name.toLowerCase();
      const bCode = b.code.toLowerCase();

      const aExact = aAlbanian === query || aEnglish === query || aCode === query;
      const bExact = bAlbanian === query || bEnglish === query || bCode === query;
      if (aExact !== bExact) return aExact ? -1 : 1;

      const aStarts = aAlbanian.startsWith(query) || aEnglish.startsWith(query) || aCode.startsWith(query);
      const bStarts = bAlbanian.startsWith(query) || bEnglish.startsWith(query) || bCode.startsWith(query);
      if (aStarts !== bStarts) return aStarts ? -1 : 1;

      const nameA = currentLanguage === 'sq' ? aAlbanian : aEnglish;
      const nameB = currentLanguage === 'sq' ? bAlbanian : bEnglish;
      return nameA.localeCompare(nameB);
    });
  }, [countrySearchQuery, currentLanguage]);

  const displayCountryName = (country: Country) => {
    return currentLanguage === 'sq' ? country.nameAlbanian : country.name;
  };

  const handleCountrySelect = (countryCode: string) => {
    handlePreferenceChange('country_code', countryCode);
    setIsCountryPanelOpen(false);
    setCountrySearchQuery('');
    
    // Auto-save immediately
    const updatedPrefs = { ...preferences, country_code: countryCode };
    syncPreferences(updatedPrefs);
  };

  return (
    <div className="space-y-6">
      {/* Preferences Card */}
      <Card id="preferences" className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">location and languages</h2>
              <p className="text-sm text-muted-foreground">Configure your language and regional settings</p>
            </div>
          </div>

          <div className="space-y-4">


            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Languages className="w-4 h-4" />
                Language
              </Label>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isLanguagePanelOpen}
                className="w-full justify-between border-2 border-gray-300 bg-gray-50 hover:bg-gray-50 focus:border-primary focus:ring-primary"
                onClick={() => setIsLanguagePanelOpen(true)}
              >
                 {preferences.language && selectedLanguage ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{selectedLanguage.flag_emoji}</span>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{selectedLanguage.native_name}</span>
                        {selectedLanguage.is_default && (
                          <span className="text-xs text-primary">(Default)</span>
                        )}
                      </div>
                    </div>
                  ) : languagesLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="font-normal text-muted-foreground">
                        {currentLanguage === 'sq' ? 'Duke ngarkuar gjuhët...' : 'Loading languages...'}
                      </span>
                    </div>
                  ) : allLanguages.length === 0 ? (
                    <span className="font-normal text-orange-600">
                      {currentLanguage === 'sq' ? 'Nuk ka gjuhë të konfiguruar' : 'No languages configured'}
                    </span>
                  ) : (
                  <span className="font-normal text-muted-foreground">
                    {currentLanguage === 'sq' ? 'Zgjidhni gjuhën' : 'Select your language'}
                  </span>
                )}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </div>
          </div>

        </div>
      </Card>

      {/* Live Location Card */}
      <Card id="live-location" className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Live Location</h2>
              <p className="text-sm text-muted-foreground">Share your real-time location</p>
            </div>
          </div>

          {/* Map */}
          <div className="h-64 w-full rounded-lg overflow-hidden border">
            <LiveMap 
              lat={location?.lat} 
              lng={location?.lng} 
              accuracy={location?.accuracy} 
            />
          </div>

          {/* Location Info */}
          {location && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label className="text-xs text-muted-foreground">Coordinates</Label>
                <div className="text-sm font-mono">
                  {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Accuracy</Label>
                <div className="text-sm">±{location.accuracy}m</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Last Updated</Label>
                <div className="text-sm">
                  {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
                </div>
              </div>
            </div>
          )}

          {/* Share Level Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Share with:</Label>
            <RadioGroup value={shareLevel} onValueChange={(value: any) => setShareLevel(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="text-sm">Only me</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friends" id="friends" />
                <Label htmlFor="friends" className="text-sm">Friends</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="text-sm">Public</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="consent" 
              checked={hasConsent}
              onCheckedChange={(checked) => setHasConsent(checked === true)}
            />
            <Label htmlFor="consent" className="text-sm leading-relaxed">
              I agree to share my location as described. Your location data will be stored securely.
            </Label>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="default" 
              className="flex items-center gap-2"
              onClick={handleShareLocation}
              disabled={!hasConsent || isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <Navigation className="w-4 h-4" />
              {isWatching ? 'Stop Sharing' : 'Share Live Location'}
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleUpdateOnce}
              disabled={!hasConsent || isLoading}
            >
              <MapPin className="w-4 h-4" />
              Update Once
            </Button>
          </div>

          {/* Permission Status */}
          {permission === 'denied' && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">
                Location access denied. Please enable location permissions in your browser settings.
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Manual Location Entry */}
          <div className="space-y-3 pt-4 border-t">
            <Label className="text-sm font-medium">Set location manually:</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter city or address..." 
                className="flex-1"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleManualLocation();
                  }
                }}
              />
              <Button variant="outline" onClick={handleManualLocation}>
                Set
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Country Selection Panel */}
      {isCountryPanelOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
          <div className="absolute right-0 w-full max-w-2xl bg-background shadow-2xl" style={{ top: '32px', height: 'calc(100vh - 32px)' }}>
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur-sm">
                <div>
                  <h2 className="text-xl font-semibold">
                    {currentLanguage === 'sq' ? 'Zgjidhni Vendin' : 'Select Country'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {currentLanguage === 'sq' 
                      ? 'Zgjidhni vendin ku jetoni aktualisht' 
                      : 'Choose the country where you currently live'
                    }
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setIsCountryPanelOpen(false);
                    setCountrySearchQuery('');
                  }}
                  className="h-10 w-10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Search */}
              <div className="p-6 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={currentLanguage === 'sq' ? "Kërkoni vendin..." : "Search country..."}
                    value={countrySearchQuery}
                    onChange={(e) => setCountrySearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {autoDetectedCountry && (
                  <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <p className="text-sm text-primary">
                      <Globe className="w-4 h-4 inline mr-2" />
                      {currentLanguage === 'sq' 
                        ? 'Vendi i zbuluar automatikisht: ' 
                        : 'Auto-detected country: '
                      }
                      <strong>
                        {COUNTRIES.find(c => c.code === autoDetectedCountry)?.flag} {' '}
                        {displayCountryName(COUNTRIES.find(c => c.code === autoDetectedCountry) || COUNTRIES[0])}
                      </strong>
                    </p>
                  </div>
                )}
              </div>

              {/* Countries List */}
              <div className="flex-1 overflow-y-auto">
                <Command className="h-full" shouldFilter={false}>
                  <CommandList className="max-h-none">
                    <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                      {currentLanguage === 'sq' ? "Nuk u gjet asnjë vend." : "No country found."}
                    </CommandEmpty>
                    <CommandGroup>
                      {filteredCountries.map((country) => (
                        <CommandItem
                          key={country.code}
                          value={country.code}
                          onSelect={() => handleCountrySelect(country.code)}
                          className="flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-muted/50 border-b border-border/50 last:border-b-0"
                        >
                          <span className="text-2xl flex-shrink-0">{country.flag}</span>
                          <div className="flex-1">
                            <div className="font-medium text-base">
                              {displayCountryName(country)}
                            </div>
                            {currentLanguage === 'sq' && country.nameAlbanian !== country.name && (
                              <div className="text-sm text-muted-foreground">{country.name}</div>
                            )}
                            {currentLanguage === 'en' && country.nameAlbanian !== country.name && (
                              <div className="text-sm text-muted-foreground">{country.nameAlbanian}</div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {autoDetectedCountry === country.code && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium">
                                {currentLanguage === 'sq' ? 'Auto' : 'Auto'}
                              </span>
                            )}
                            {preferences.country_code === country.code && (
                              <div className="h-3 w-3 rounded-full bg-primary" />
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>

              {/* Footer */}
              <div className="absolute bottom-4 left-0 right-0 px-3 py-2 border-t border-border bg-muted/90 backdrop-blur-sm">
                <div className="flex items-center justify-between text-base text-foreground/80">
                  <span>
                    {currentLanguage === 'sq' 
                      ? `${filteredCountries.length} vende të disponueshme`
                      : `${filteredCountries.length} countries available`
                    }
                  </span>
                  <span>
                    {currentLanguage === 'sq' 
                      ? 'Përditësimet ruhen automatikisht'
                      : 'Changes saved automatically'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Language Selection Panel */}
      {isLanguagePanelOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
          <div className="absolute right-0 w-full max-w-2xl bg-background shadow-2xl" style={{ top: '32px', height: 'calc(100vh - 32px)' }}>
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur-sm">
                <div>
                  <h2 className="text-xl font-semibold">
                    {currentLanguage === 'sq' ? 'Zgjidhni Gjuhën' : 'Select Language'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {currentLanguage === 'sq' 
                      ? 'Zgjidhni gjuhën që preferoni për ndërfaqen' 
                      : 'Choose your preferred language for the interface'
                    }
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setIsLanguagePanelOpen(false);
                    setLanguageSearchQuery('');
                  }}
                  className="h-10 w-10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Search */}
              <div className="p-6 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={currentLanguage === 'sq' ? "Kërkoni gjuhën..." : "Search language..."}
                    value={languageSearchQuery}
                    onChange={(e) => setLanguageSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Languages Grid */}
              <div className="flex-1 overflow-y-auto p-4 pb-20">
                <div className="grid grid-cols-2 gap-2">
                  {filteredLanguages.map((language) => (
                    <div
                      key={language.language_code}
                      onClick={() => handleLanguageSelect(language.language_code)}
                      className={cn(
                        "flex items-center gap-3 p-3 cursor-pointer transition-colors relative rounded-full border",
                        preferences.language === language.language_code 
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                      )}
                    >
                      <div className="flex-shrink-0">
                        <span className="text-sm">{language.flag_emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-normal text-sm text-gray-900 dark:text-gray-100 truncate">
                          {language.native_name} ({language.language_name})
                        </div>
                      </div>
                      {preferences.language === language.language_code && (
                        <div className="flex-shrink-0">
                          <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {filteredLanguages.length === 0 && (
                  <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                    {currentLanguage === 'sq' ? "Nuk u gjet asnjë gjuhë." : "No language found."}
                  </div>
                )}
              </div>

               {/* Footer - positioned higher with rounded edges */}
               <div className="absolute bottom-8 left-4 right-4 px-4 py-3 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 backdrop-blur-sm rounded-xl shadow-sm">
                 <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                   <span>
                     {currentLanguage === 'sq' 
                       ? `${filteredLanguages.length} gjuhë të disponueshme`
                       : `${filteredLanguages.length} languages available`
                     }
                   </span>
                   <span className="flex items-center gap-2">
                      <span className="hidden text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                        {currentLanguage === 'sq' ? 'Admin Sinkronizuar' : 'Admin Synced'}
                      </span>
                     <span>
                     {currentLanguage === 'sq' 
                       ? 'Përditësimet ruhen automatikisht'
                       : 'Changes saved automatically'
                     }
                     </span>
                   </span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPreferencesForm;