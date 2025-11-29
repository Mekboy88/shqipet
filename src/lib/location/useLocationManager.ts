// DO NOT EDIT — Location & Preferences core. Breaking this may disable real-time location and user privacy controls.

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Location {
  lat: number;
  lng: number;
}

interface LocationData extends Location {
  accuracy_m?: number;
  method: 'gps' | 'manual' | 'ip';
  share_level: 'private' | 'friends' | 'public';
  city?: string;
  region?: string;
  country_code?: string;
  updated_at?: string;
}

export const useLocationManager = () => {
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareLevel, setShareLevel] = useState<'private' | 'friends' | 'public'>('private');
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [method, setMethod] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<string>('prompt');
  const [watchId, setWatchId] = useState<number | null>(null);

  // Check geolocation permission on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          setPermissionState(result.state);
          result.addEventListener('change', () => {
            setPermissionState(result.state);
          });
        });
      }
    } else {
      setPermissionState('unsupported');
    }
  }, []);

  // Load existing location data
  useEffect(() => {
    if (user) {
      loadLocationData();
    }
  }, [user]);

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user_location_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_locations',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Location data changed:', payload);
          loadLocationData();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const loadLocationData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setCurrentLocation({ lat: data.lat, lng: data.lng });
        setShareLevel(data.share_level as 'private' | 'friends' | 'public');
        setAccuracy(data.accuracy_m);
        setMethod(data.method);
        setLastUpdated(data.updated_at);
      }
    } catch (error) {
      console.error('Error loading location data:', error);
    }
  };

  const updateLocationInDB = async (locationData: Partial<LocationData>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_locations')
        .upsert({
          user_id: user.id,
          ...locationData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating location:', error);
      toast.error('Failed to update location');
    }
  };

  const startSharing = useCallback(async () => {
    if (!('geolocation' in navigator)) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 15000
    };

    const successCallback = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      const locationData = {
        lat: latitude,
        lng: longitude,
        accuracy_m: Math.round(accuracy),
        method: 'gps' as const,
        share_level: shareLevel
      };

      setCurrentLocation({ lat: latitude, lng: longitude });
      setAccuracy(Math.round(accuracy));
      setMethod('gps');
      setLastUpdated(new Date().toISOString());
      
      updateLocationInDB(locationData);
    };

    const errorCallback = (error: GeolocationPositionError) => {
      console.error('Geolocation error:', error);
      setIsSharing(false);
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          toast.error('Location access denied. Please enable location permissions.');
          setPermissionState('denied');
          break;
        case error.POSITION_UNAVAILABLE:
          toast.error('Location information is unavailable.');
          break;
        case error.TIMEOUT:
          toast.error('Location request timed out.');
          break;
        default:
          toast.error('An unknown error occurred while retrieving location.');
      }
    };

    try {
      const id = navigator.geolocation.watchPosition(
        successCallback,
        errorCallback,
        options
      );
      
      setWatchId(id);
      setIsSharing(true);
      toast.success('Started sharing location');
    } catch (error) {
      toast.error('Failed to start location sharing');
    }
  }, [shareLevel, user]);

  const stopSharing = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsSharing(false);
    toast.success('Stopped sharing location');
  }, [watchId]);

  const updateOnce = useCallback(async () => {
    if (!('geolocation' in navigator)) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 15000
    };

    return new Promise<void>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const locationData = {
            lat: latitude,
            lng: longitude,
            accuracy_m: Math.round(accuracy),
            method: 'gps' as const,
            share_level: shareLevel
          };

          setCurrentLocation({ lat: latitude, lng: longitude });
          setAccuracy(Math.round(accuracy));
          setMethod('gps');
          setLastUpdated(new Date().toISOString());
          
          updateLocationInDB(locationData);
          toast.success('Location updated');
          resolve();
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Failed to get current location');
          reject(error);
        },
        options
      );
    });
  }, [shareLevel]);

  const setManualLocation = useCallback(async (location: { lat: number; lng: number; city: string; country_code: string }) => {
    const locationData = {
      lat: location.lat,
      lng: location.lng,
      method: 'manual' as const,
      share_level: shareLevel,
      city: location.city,
      country_code: location.country_code
    };

    setCurrentLocation({ lat: location.lat, lng: location.lng });
    setMethod('manual');
    setLastUpdated(new Date().toISOString());
    setAccuracy(null);

    await updateLocationInDB(locationData);
  }, [shareLevel]);

  const handleShareLevelChange = useCallback(async (newShareLevel: 'private' | 'friends' | 'public') => {
    setShareLevel(newShareLevel);
    
    if (currentLocation) {
      await updateLocationInDB({
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        share_level: newShareLevel
      });
    }
  }, [currentLocation]);

  return {
    currentLocation,
    isSharing,
    shareLevel,
    accuracy,
    method,
    lastUpdated,
    permissionState,
    startSharing,
    stopSharing,
    updateOnce,
    setShareLevel: handleShareLevelChange,
    setManualLocation
  };
};