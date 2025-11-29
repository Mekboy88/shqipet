// DO NOT EDIT — Location & Preferences core. Breaking this may disable real-time location and user privacy controls.

import { supabase } from "@/integrations/supabase/client";

export interface LocationData {
  lat: number;
  lng: number;
  accuracy_m?: number;
  method: 'gps' | 'manual' | 'ip';
  share_level: 'private' | 'friends' | 'public';
  city?: string;
  region?: string;
  country_code?: string;
}

export interface GeolocationService {
  getCurrentPosition(): Promise<LocationData>;
  watchPosition(callback: (location: LocationData) => void): number;
  clearWatch(watchId: number): void;
  geocodeAddress(address: string): Promise<LocationData>;
}

class BrowserGeolocationService implements GeolocationService {
  private watchIds: Map<number, number> = new Map();
  private nextWatchId = 1;

  async getCurrentPosition(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy_m: Math.round(position.coords.accuracy),
            method: 'gps',
            share_level: 'private',
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 5000,
        }
      );
    });
  }

  watchPosition(callback: (location: LocationData) => void): number {
    if (!navigator.geolocation) {
      throw new Error('Geolocation not supported');
    }

    const watchId = this.nextWatchId++;
    
    const browserWatchId = navigator.geolocation.watchPosition(
      (position) => {
        callback({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy_m: Math.round(position.coords.accuracy),
          method: 'gps',
          share_level: 'private',
        });
      },
      (error) => {
        console.error('Geolocation watch error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
      }
    );

    this.watchIds.set(watchId, browserWatchId);
    return watchId;
  }

  clearWatch(watchId: number): void {
    const browserWatchId = this.watchIds.get(watchId);
    if (browserWatchId !== undefined) {
      navigator.geolocation.clearWatch(browserWatchId);
      this.watchIds.delete(watchId);
    }
  }

  async geocodeAddress(address: string): Promise<LocationData> {
    // For now, we'll use a simple geocoding service
    // In production, you'd use Google Maps Geocoding API or similar
    throw new Error('Geocoding not implemented - need API key configuration');
  }
}

// Map provider interface
export interface MapProvider {
  createMap(container: HTMLElement, options: MapOptions): Promise<MapInstance>;
  createAutocomplete(input: HTMLInputElement): Promise<AutocompleteInstance>;
}

export interface MapOptions {
  center: { lat: number; lng: number };
  zoom: number;
}

export interface MapInstance {
  setCenter(lat: number, lng: number): void;
  addMarker(lat: number, lng: number, options?: MarkerOptions): MarkerInstance;
  removeMarker(marker: MarkerInstance): void;
  setZoom(zoom: number): void;
  destroy(): void;
}

export interface MarkerOptions {
  title?: string;
  draggable?: boolean;
  icon?: string;
}

export interface MarkerInstance {
  setPosition(lat: number, lng: number): void;
  remove(): void;
}

export interface AutocompleteInstance {
  on(event: 'place_changed', callback: (place: PlaceResult) => void): void;
  destroy(): void;
}

export interface PlaceResult {
  name: string;
  formatted_address: string;
  geometry: {
    location: { lat: number; lng: number };
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

// Simple OpenStreetMap provider (fallback)
class OSMMapProvider implements MapProvider {
  async createMap(container: HTMLElement, options: MapOptions): Promise<MapInstance> {
    // This would integrate with Leaflet + OpenStreetMap
    throw new Error('OSM provider not implemented yet');
  }

  async createAutocomplete(input: HTMLInputElement): Promise<AutocompleteInstance> {
    throw new Error('OSM autocomplete not implemented yet');
  }
}

// Location service for Supabase integration
export class LocationService {
  private geolocation: GeolocationService;
  private mapProvider: MapProvider;

  constructor() {
    this.geolocation = new BrowserGeolocationService();
    this.mapProvider = new OSMMapProvider();
  }

  async updateLocation(locationData: LocationData): Promise<void> {
    const { data, error } = await supabase.functions.invoke('location-update', {
      body: locationData,
    });

    if (error) {
      throw new Error(`Failed to update location: ${error.message}`);
    }
  }

  async getCurrentLocation(): Promise<LocationData | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase.functions.invoke('location-update', {
      method: 'GET',
      body: { user_id: user.id },
    });

    if (error) return null;
    return data?.data || null;
  }

  async clearLocation(): Promise<void> {
    const { error } = await supabase.functions.invoke('location-update', {
      method: 'DELETE',
    });

    if (error) {
      throw new Error(`Failed to clear location: ${error.message}`);
    }
  }

  getGeolocationService(): GeolocationService {
    return this.geolocation;
  }

  getMapProvider(): MapProvider {
    return this.mapProvider;
  }

  // Check if geolocation is supported and permitted
  async checkGeolocationPermission(): Promise<'granted' | 'denied' | 'prompt' | 'unsupported'> {
    if (!navigator.geolocation) {
      return 'unsupported';
    }

    if (!navigator.permissions) {
      return 'prompt'; // Assume we need to prompt
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state;
    } catch {
      return 'prompt';
    }
  }
}

export const locationService = new LocationService();