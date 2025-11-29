interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
  source: 'browser' | 'ip' | 'denied';
}

interface GeolocationPermissionStatus {
  granted: boolean;
  denied: boolean;
  prompt: boolean;
}

class GeolocationService {
  private currentPosition: GeolocationData | null = null;
  private watchId: number | null = null;

  /**
   * Check current geolocation permission status
   */
  async checkPermissionStatus(): Promise<GeolocationPermissionStatus> {
    if (!navigator.permissions) {
      return { granted: false, denied: false, prompt: true };
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      return {
        granted: result.state === 'granted',
        denied: result.state === 'denied',
        prompt: result.state === 'prompt',
      };
    } catch (error) {
      console.warn('Permission query failed:', error);
      return { granted: false, denied: false, prompt: true };
    }
  }

  /**
   * Request geolocation permission and get current position
   */
  async requestLocation(): Promise<GeolocationData | null> {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const data: GeolocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            source: 'browser',
          };
          this.currentPosition = data;
          console.log('Geolocation obtained:', data);
          resolve(data);
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes cache
        }
      );
    });
  }

  /**
   * Start watching position changes (for real-time tracking)
   */
  startWatching(callback: (position: GeolocationData) => void): void {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return;
    }

    if (this.watchId !== null) {
      console.warn('Already watching position');
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const data: GeolocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          source: 'browser',
        };
        this.currentPosition = data;
        callback(data);
      },
      (error) => {
        console.warn('Watch position error:', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // 1 minute cache for watching
      }
    );

    console.log('Started watching position');
  }

  /**
   * Stop watching position changes
   */
  stopWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      console.log('Stopped watching position');
    }
  }

  /**
   * Get current cached position
   */
  getCurrentPosition(): GeolocationData | null {
    return this.currentPosition;
  }

  /**
   * Calculate distance between two coordinates (in kilometers)
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   */
  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Format coordinates for display
   */
  formatCoordinates(latitude: number, longitude: number): string {
    const latDir = latitude >= 0 ? 'N' : 'S';
    const lonDir = longitude >= 0 ? 'E' : 'W';
    return `${Math.abs(latitude).toFixed(4)}°${latDir}, ${Math.abs(longitude).toFixed(4)}°${lonDir}`;
  }

  /**
   * Check if coordinates are valid
   */
  isValidCoordinates(latitude?: number, longitude?: number): boolean {
    if (latitude === undefined || longitude === undefined) return false;
    return (
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  }
}

export const geolocationService = new GeolocationService();
export type { GeolocationData, GeolocationPermissionStatus };
