// DO NOT EDIT — Location & Preferences core (map, offline, geolocation, privacy, sync).

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Navigation, ArrowLeft, Settings, Globe, Clock, Languages, Loader2 } from 'lucide-react';
import { LiveMap } from '@/components/location/LiveMap';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useLocationSync } from '@/hooks/useLocationSync';
import { usePreferencesSync } from '@/hooks/usePreferencesSync';
import { useServiceWorker } from '@/hooks/useServiceWorker';
import { useToast } from '@/hooks/use-toast';

const LocationPreferences: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Location state
  const { location, error, isLoading, isWatching, permission, getCurrentPosition, startWatching, stopWatching } = useGeolocation();
  const { syncLocation, getUserLocation, subscribeToLocationUpdates } = useLocationSync();
  const { syncPreferences, getUserPreferences, subscribeToPreferencesUpdates, suggestTimezoneFromLocation } = usePreferencesSync();
  const { isOfflineReady } = useServiceWorker();

  // UI state
  const [hasConsent, setHasConsent] = useState(false);
  const [shareLevel, setShareLevel] = useState<'private' | 'friends' | 'public'>('private');
  const [manualLocation, setManualLocation] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [locationMethod, setLocationMethod] = useState<'gps' | 'manual' | 'ip' | null>(null);
  
  // Preferences state
  const [preferences, setPreferences] = useState({
    country_code: '',
    timezone: '',
    language: 'en'
  });
  const [originalPreferences, setOriginalPreferences] = useState(preferences);
  const [hasPreferencesChanges, setHasPreferencesChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing data on mount
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
          language: preferencesData.language || 'en'
        };
        setPreferences(prefs);
        setOriginalPreferences(prefs);
      }
    };

    loadData();
  }, [getUserLocation, getUserPreferences]);

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
          language: payload.new.language || 'en'
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

  // Suggest timezone when location changes
  useEffect(() => {
    if (location && !preferences.timezone) {
      const suggestedTimezone = suggestTimezoneFromLocation(location.lat, location.lng);
      setPreferences(prev => ({ ...prev, timezone: suggestedTimezone }));
    }
  }, [location, preferences.timezone, suggestTimezoneFromLocation]);

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

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/profile/settings')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Settings
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Location & Preferences</h1>
        </div>

        {/* Live Location Card */}
        <Card id="live-location" className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Live Location
            </CardTitle>
            <CardDescription>
              Share your real-time location with friends or keep it private
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                />
                <Button variant="outline" onClick={handleManualLocation}>
                  Set
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Card */}
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Globe className="w-4 h-4" />
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
                    <SelectItem value="AL">Albania</SelectItem>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                    <SelectItem value="IT">Italy</SelectItem>
                    <SelectItem value="ES">Spain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="w-4 h-4" />
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
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="Europe/Tirane">Europe/Tirane</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                    <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                    <SelectItem value="Europe/Berlin">Europe/Berlin</SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Languages className="w-4 h-4" />
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
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="sq">Albanian (Shqip)</SelectItem>
                    <SelectItem value="fr">French (Français)</SelectItem>
                    <SelectItem value="de">German (Deutsch)</SelectItem>
                    <SelectItem value="it">Italian (Italiano)</SelectItem>
                    <SelectItem value="es">Spanish (Español)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button 
                onClick={handleSavePreferences}
                disabled={!hasPreferencesChanges || isSaving}
              >
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LocationPreferences;