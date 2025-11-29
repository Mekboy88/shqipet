import { Monitor, Smartphone, Tablet, Laptop, Chrome, Globe } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type UserSession = Database['public']['Tables']['user_sessions']['Row'];

/**
 * Map browser name to appropriate icon
 */
export const getBrowserIcon = (browserName: string | null) => {
  if (!browserName) return Globe;
  
  const browser = browserName.toLowerCase();
  
  // Chrome, Edge, Brave all use Chrome icon
  if (browser.includes('chrome') || browser.includes('edge') || browser.includes('brave')) {
    return Chrome;
  }
  
  // Default to Globe for other browsers
  return Globe;
};

/**
 * Map device_type to icon component based on screen size detection
 * 
 * Screen size ranges:
 * - Mobile (< 768px): Smartphone icon
 * - Tablet (768px - 1024px): Tablet icon
 * - Laptop (1024px - 1920px): Laptop icon
 * - Desktop (>= 1920px): Monitor icon
 */
export const getDeviceIcon = (deviceType: string | null) => {
  switch (deviceType) {
    case 'mobile':
      return Smartphone;
    case 'tablet':
      return Tablet;
    case 'laptop':
      return Laptop;
    case 'desktop':
      return Monitor;
    default:
      // Default to Monitor for unrecognized types
      return Monitor;
  }
};

/**
 * Map device_type to display label with screen size context
 * 
 * Labels match the comprehensive screen size ranges:
 * - Mobile: < 768px (320px - 768px range)
 * - Tablet: 768px - 1024px
 * - Laptop: 1024px - 1920px (includes 1728x1117)
 * - Desktop: >= 1920px (Full HD and above)
 */
export const getDeviceLabel = (deviceType: string | null): string => {
  switch (deviceType) {
    case 'mobile':
      return 'Mobile';
    case 'tablet':
      return 'Tablet';
    case 'laptop':
      return 'Laptop';
    case 'desktop':
      return 'Desktop';
    default:
      // If deviceType is not recognized, return it as-is (capitalized) or 'Unknown Device'
      return deviceType ? deviceType.charAt(0).toUpperCase() + deviceType.slice(1) : 'Unknown Device';
  }
};

export const deriveTitle = (browserName: string | null, operatingSystem: string | null, deviceType: string | null): string => {
  const browser = browserName || 'Unknown Browser';
  const os = operatingSystem || 'Unknown OS';
  const type = getDeviceLabel(deviceType);
  
  return `${browser} on ${os} • ${type}`;
};
