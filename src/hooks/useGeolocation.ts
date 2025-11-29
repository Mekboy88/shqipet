// DO NOT EDIT — Location & Preferences core (map, offline, geolocation, privacy, sync).

import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface GeolocationData {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const [location, setLocation] = useState<GeolocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [permission, setPermission] = useState<PermissionState | null>(null);
  
  const watchId = useRef<number | null>(null);
  const { toast } = useToast();

  const defaultOptions: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 5000,
    ...options,
  };

  // Check permission status
  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermission(result.state);
        
        result.addEventListener('change', () => {
          setPermission(result.state);
        });
      });
    }
  }, []);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = position.coords;
    
    setLocation({
      lat: latitude,
      lng: longitude,
      accuracy: Math.round(accuracy),
      timestamp: position.timestamp,
    });
    
    setError(null);
    setIsLoading(false);
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = 'Unable to get location';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location access denied. Please enable location permissions.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable.';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out.';
        break;
    }
    
    setError(errorMessage);
    setIsLoading(false);
    
    toast({
      title: 'Location Error',
      description: errorMessage,
      variant: 'destructive',
    });
  }, [toast]);

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      defaultOptions
    );
  }, [handleSuccess, handleError, defaultOptions]);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    if (watchId.current !== null) {
      return; // Already watching
    }

    setIsLoading(true);
    setError(null);
    setIsWatching(true);

    watchId.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      defaultOptions
    );
  }, [handleSuccess, handleError, defaultOptions]);

  const stopWatching = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    
    setIsWatching(false);
    setIsLoading(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  return {
    location,
    error,
    isLoading,
    isWatching,
    permission,
    getCurrentPosition,
    startWatching,
    stopWatching,
    isSupported: 'geolocation' in navigator,
  };
}