// DO NOT EDIT — Location & Preferences core (map, offline, geolocation, privacy, sync).

import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LocationData {
  lat: number;
  lng: number;
  accuracy_m: number;
  method: 'gps' | 'manual' | 'ip';
  share_level?: 'private' | 'friends' | 'public';
  city?: string;
  region?: string;
  country_code?: string;
}

export function useLocationSync() {
  const { toast } = useToast();

  const syncLocation = useCallback(async (locationData: LocationData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('user_locations')
        .upsert({
          user_id: user.id,
          ...locationData,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      // If offline, queue for background sync
      if (!navigator.onLine) {
        await queueLocationUpdate(locationData);
        return { success: true, queued: true };
      }
      
      console.error('Failed to sync location:', error);
      toast({
        title: 'Sync Failed',
        description: 'Failed to update location. Will retry when online.',
        variant: 'destructive',
      });
      
      return { success: false, error };
    }
  }, [toast]);

  const getUserLocation = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to get user location:', error);
      return null;
    }
  }, []);

  const subscribeToLocationUpdates = useCallback((callback: (payload: any) => void) => {
    const channel = supabase
      .channel('location-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_locations'
        },
        callback
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Queue location update for background sync
  const queueLocationUpdate = async (locationData: LocationData) => {
    try {
      // Store in localStorage for now (in production, use IndexedDB)
      const queue = JSON.parse(localStorage.getItem('location-queue') || '[]');
      queue.push({
        id: Date.now(),
        data: locationData,
        timestamp: Date.now(),
      });
      localStorage.setItem('location-queue', JSON.stringify(queue));

      // Register background sync if available
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        // Background sync would be implemented here
      }
    } catch (error) {
      console.error('Failed to queue location update:', error);
    }
  };

  return {
    syncLocation,
    getUserLocation,
    subscribeToLocationUpdates,
  };
}