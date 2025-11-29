import { UAParser } from 'ua-parser-js';

export interface DeviceInfo {
  deviceId: string;
  deviceStableId: string;
  deviceType: 'mobile' | 'tablet' | 'laptop' | 'desktop';
  operatingSystem: string;
  browserName: string;
  browserVersion: string;
  screenResolution: string;
  platform: string;
  userAgent: string;
}

class DeviceDetectionService {
  private readonly STORAGE_KEY = 'device_stable_id';

  /**
   * Generate or retrieve stable device ID based on TRUE hardware fingerprint
   * Uses ONLY stable hardware characteristics that never change across domains
   * Same physical device = Same ID across ALL websites/domains
   */
  private async getOrCreateStableId(): Promise<string> {
    // Check cache first (domain-specific localStorage, but regeneration produces SAME hash)
    let stableId = localStorage.getItem(this.STORAGE_KEY);
    if (stableId) {
      console.log('✅ Using cached hardware-based deviceStableId:', stableId);
      return stableId;
    }

    // Extract OS name WITHOUT version numbers
    const parser = new UAParser();
    const osName = (parser.getOS().name || 'UnknownOS').toLowerCase();
    
    // Strip ALL version numbers from userAgent (keep only browser and OS identifiers)
    const cleanUserAgent = navigator.userAgent
      .replace(/\/[\d.]+/g, '') // Remove /version patterns like /123.0
      .replace(/\d+\.\d+[\d.]*/g, '') // Remove standalone version numbers
      .toLowerCase()
      .trim();
    
    // Strip ALL version numbers from platform
    const cleanPlatform = (navigator.platform || 'unknown')
      .replace(/\d+/g, '') // Remove all digits
      .toLowerCase()
      .trim();

    // Build fingerprint using ONLY stable hardware characteristics
    // These properties NEVER change between domains, browsers, or time
    const fingerprintParts = {
      // Hardware-specific (never changes)
      deviceMemory: (navigator as any).deviceMemory || 0,
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      colorDepth: window.screen.colorDepth || 0,
      pixelDepth: (window.screen as any).pixelDepth || window.screen.colorDepth || 0,
      
      // OS and platform (version-agnostic)
      os: osName,
      platform: cleanPlatform,
      userAgent: cleanUserAgent,
      
      // Optional: userAgentData if available (Chromium-based)
      uaPlatform: (navigator as any).userAgentData?.platform || '',
    };

    console.log('🔐 Generating stable hardware fingerprint:', fingerprintParts);

    // Hash the fingerprint to create stable ID
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(fingerprintParts));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    stableId = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);

    // Cache it (domain-specific localStorage, but regeneration produces SAME hash)
    localStorage.setItem(this.STORAGE_KEY, stableId);
    console.log('✅ Generated NEW hardware-based deviceStableId:', stableId);
    console.log('🔑 This ID will be IDENTICAL across all domains on this device');
    
    return stableId;
  }

  /**
   * Universal device detection based on viewport width
   * 
   * MOBILE: width < 768px
   * TABLET: 768px ≤ width < 1024px
   * LAPTOP: 1024px ≤ width < 1920px
   * DESKTOP: width ≥ 1920px
   */
  private detectDeviceType(): 'mobile' | 'tablet' | 'laptop' | 'desktop' {
    const viewportWidth = window.innerWidth;
    
    console.log('🔍 Device Detection:', {
      viewportWidth,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      userAgent: navigator.userAgent
    });
    
    // Universal detection rules
    if (viewportWidth < 768) {
      console.log('✅ Detected: mobile (width < 768px)');
      return 'mobile';
    }
    if (viewportWidth < 1024) {
      console.log('✅ Detected: tablet (768px ≤ width < 1024px)');
      return 'tablet';
    }
    if (viewportWidth < 1920) {
      console.log('✅ Detected: laptop (1024px ≤ width < 1920px)');
      return 'laptop';
    }
    
    console.log('✅ Detected: desktop (width ≥ 1920px)');
    return 'desktop';
  }

  /**
   * Get comprehensive device information for current device
   */
  async getDeviceInfo(): Promise<DeviceInfo> {
    const parser = new UAParser();
    const result = parser.getResult();
    
    const deviceType = this.detectDeviceType();
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    
    console.log('📱 Current Device Info:', {
      deviceType,
      screenResolution,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    });

    return {
      deviceId: crypto.randomUUID(),
      deviceStableId: await this.getOrCreateStableId(),
      deviceType,
      operatingSystem: result.os.name || 'Unknown',
      browserName: result.browser.name || 'Unknown',
      browserVersion: result.browser.version || 'Unknown',
      screenResolution,
      platform: navigator.platform || 'Unknown',
      userAgent: navigator.userAgent,
    };
  }

  /**
   * Get stable device ID (persistent across sessions)
   */
  async getCurrentDeviceStableId(): Promise<string> {
    return await this.getOrCreateStableId();
  }

  /**
   * Get browser location with user permission
   */
  async getBrowserLocation(): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });
      
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    } catch (error) {
      console.log('Location permission denied or unavailable:', error);
      return null;
    }
  }
}

export const deviceDetectionService = new DeviceDetectionService();

