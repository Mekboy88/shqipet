// Backend disabled: all location and preferences operations are no-ops

export interface UserLocation {
  user_id: string;
  lat: number | null;
  lng: number | null;
  accuracy_m: number | null;
  method: 'gps' | 'manual' | 'ip' | null;
  share_level: 'private' | 'friends' | 'public';
  city: string | null;
  region: string | null;
  country_code: string | null;
  updated_at: string;
  created_at: string;
}

export interface UserPreferences {
  country_code: string | null;
  timezone: string | null;
  language: string | null;
}

class NoopLocationService {
  // Location methods
  async getUserLocation(_userId?: string): Promise<UserLocation | null> {
    console.warn('[Location] Backend disabled: getUserLocation');
    return null;
  }

  async updateUserLocation(_location: Partial<UserLocation>): Promise<UserLocation | null> {
    console.warn('[Location] Backend disabled: updateUserLocation');
    return null;
  }

  async clearUserLocation(): Promise<void> {
    console.warn('[Location] Backend disabled: clearUserLocation');
  }

  // Preferences methods
  async getUserPreferences(_userId?: string): Promise<UserPreferences | null> {
    console.warn('[Location] Backend disabled: getUserPreferences');
    return null;
  }

  async updateUserPreferences(_preferences: Partial<UserPreferences>): Promise<void> {
    console.warn('[Location] Backend disabled: updateUserPreferences');
  }

  // Realtime subscriptions
  subscribeToLocationUpdates(
    _callback: (payload: any) => void,
    _userId?: string
  ): () => void {
    console.warn('[Location] Backend disabled: subscribeToLocationUpdates');
    return () => {};
  }

  subscribeToPreferencesUpdates(
    _callback: (payload: any) => void,
    _userId?: string
  ): () => void {
    console.warn('[Location] Backend disabled: subscribeToPreferencesUpdates');
    return () => {};
  }

  // Utility methods
  async getPublicLocations(_limit = 10): Promise<UserLocation[]> {
    console.warn('[Location] Backend disabled: getPublicLocations');
    return [];
  }

  destroy(): void {
    // no-op
  }
}

export const supabaseLocationService = new NoopLocationService();