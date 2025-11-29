// DO NOT EDIT — Location & Preferences core (map, offline, geolocation, privacy, sync).

import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PreferencesData {
  country_code?: string;
  timezone?: string;
  language?: string;
}

export function usePreferencesSync() {
  const { toast } = useToast();

  const syncPreferences = useCallback(async (preferences: PreferencesData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          ...preferences,
          updated_at: new Date().toISOString(),
        })
        .eq('auth_user_id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Preferences Updated',
        description: 'Your preferences have been saved successfully.',
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to sync preferences:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to save preferences. Please try again.',
        variant: 'destructive',
      });
      
      return { success: false, error };
    }
  }, [toast]);

  const getUserPreferences = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('country_code, timezone, language')
        .eq('auth_user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      return null;
    }
  }, []);

  const subscribeToPreferencesUpdates = useCallback((callback: (payload: any) => void) => {
    const channel = supabase
      .channel('preferences-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: 'country_code=is.not.null,timezone=is.not.null,language=is.not.null'
        },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const suggestTimezoneFromLocation = useCallback((lat: number, lng: number) => {
    // Simple timezone suggestion based on longitude
    const offset = Math.round(lng / 15);
    const timezones = [
      'Pacific/Honolulu', 'America/Anchorage', 'America/Los_Angeles',
      'America/Denver', 'America/Chicago', 'America/New_York',
      'America/Sao_Paulo', 'UTC', 'Europe/London',
      'Europe/Paris', 'Europe/Rome', 'Europe/Athens',
      'Europe/Moscow', 'Asia/Dubai', 'Asia/Karachi',
      'Asia/Kolkata', 'Asia/Dhaka', 'Asia/Bangkok',
      'Asia/Shanghai', 'Asia/Tokyo', 'Australia/Sydney',
      'Pacific/Auckland'
    ];
    
    const index = Math.max(0, Math.min(timezones.length - 1, offset + 7));
    return timezones[index];
  }, []);

  const suggestTimezoneFromCountry = useCallback((countryCode: string) => {
    const countryTimezones: { [key: string]: string } = {
      'AL': 'Europe/Tirane', 'AD': 'Europe/Andorra', 'AM': 'Asia/Yerevan',
      'AT': 'Europe/Vienna', 'AZ': 'Asia/Baku', 'BY': 'Europe/Minsk',
      'BE': 'Europe/Brussels', 'BA': 'Europe/Sarajevo', 'BG': 'Europe/Sofia',
      'HR': 'Europe/Zagreb', 'CY': 'Asia/Nicosia', 'CZ': 'Europe/Prague',
      'DK': 'Europe/Copenhagen', 'EE': 'Europe/Tallinn', 'FI': 'Europe/Helsinki',
      'FR': 'Europe/Paris', 'GE': 'Asia/Tbilisi', 'DE': 'Europe/Berlin',
      'GR': 'Europe/Athens', 'HU': 'Europe/Budapest', 'IS': 'Atlantic/Reykjavik',
      'IE': 'Europe/Dublin', 'IT': 'Europe/Rome', 'KZ': 'Asia/Almaty',
      'XK': 'Europe/Belgrade', 'LV': 'Europe/Riga', 'LI': 'Europe/Vaduz',
      'LT': 'Europe/Vilnius', 'LU': 'Europe/Luxembourg', 'MT': 'Europe/Malta',
      'MD': 'Europe/Chisinau', 'MC': 'Europe/Monaco', 'ME': 'Europe/Podgorica',
      'NL': 'Europe/Amsterdam', 'MK': 'Europe/Skopje', 'NO': 'Europe/Oslo',
      'PL': 'Europe/Warsaw', 'PT': 'Europe/Lisbon', 'RO': 'Europe/Bucharest',
      'RU': 'Europe/Moscow', 'SM': 'Europe/San_Marino', 'RS': 'Europe/Belgrade',
      'SK': 'Europe/Bratislava', 'SI': 'Europe/Ljubljana', 'ES': 'Europe/Madrid',
      'SE': 'Europe/Stockholm', 'CH': 'Europe/Zurich', 'TR': 'Europe/Istanbul',
      'UA': 'Europe/Kiev', 'GB': 'Europe/London', 'VA': 'Europe/Vatican',
      'US': 'America/New_York', 'CA': 'America/Toronto', 'MX': 'America/Mexico_City',
      'BR': 'America/Sao_Paulo', 'AR': 'America/Buenos_Aires', 'CL': 'America/Santiago',
      'JP': 'Asia/Tokyo', 'KR': 'Asia/Seoul', 'CN': 'Asia/Shanghai',
      'IN': 'Asia/Kolkata', 'AU': 'Australia/Sydney', 'NZ': 'Pacific/Auckland',
      'ZA': 'Africa/Johannesburg', 'EG': 'Africa/Cairo', 'NG': 'Africa/Lagos'
    };
    
    return countryTimezones[countryCode] || 'UTC';
  }, []);

  return {
    syncPreferences,
    getUserPreferences,
    subscribeToPreferencesUpdates,
    suggestTimezoneFromLocation,
    suggestTimezoneFromCountry,
  };
}