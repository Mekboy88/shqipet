import type { Database } from '@/integrations/supabase/types';

type UserSession = Database['public']['Tables']['user_sessions']['Row'];

type DeviceType = 'mobile' | 'tablet' | 'laptop' | 'desktop';

// Heuristic to correct display-only device type without mutating stored data
export function getDisplayDeviceType(session: UserSession): DeviceType {
  const stored = (session.device_type as DeviceType) || 'desktop';
  const ua = (session.user_agent || '').toLowerCase();
  const res = session.screen_resolution || '';
  const match = res.match(/(\d+)x(\d+)/);
  const w = match ? parseInt(match[1], 10) : undefined;
  const h = match ? parseInt(match[2], 10) : undefined;

  // Respect explicit non-desktop types
  if (stored === 'mobile' || stored === 'tablet') return stored;

  // Strong laptop indicators from UA
  if (/\blaptop\b|\bnotebook\b|macbook|thinkpad|elitebook|xps|surface laptop|chromebook|pixelbook|zenbook|vivobook/.test(ua)) {
    return 'laptop';
  }

  // macOS: "Macintosh" appears on both MacBook and iMac. Use known scaled resolutions only.
  if (/macintosh/.test(ua) && !/ipad/.test(ua)) {
    if (w && h) {
      // Known iMac scaled CSS resolutions (treat as desktop)
      const macDesktopScaled: Array<[number, number]> = [
        [2240, 1260], // iMac 24" default scaled
        [2048, 1152], // iMac 21.5" 4K scaled
        [2560, 1440], // iMac 27" scaled
        [2880, 1620],
      ];
      if (macDesktopScaled.some(([cw, ch]) => cw === w && ch === h)) return 'desktop';

      // Common MacBook scaled resolutions (treat as laptop)
      const macLaptopScaled: Array<[number, number]> = [
        [1728, 1117], // 14"/16" MBP default scaled
        [1680, 1050],
        [1440, 900],
        [1512, 982],
        [1800, 1169],
        [2056, 1329],
        [1920, 1200],
      ];
      if (macLaptopScaled.some(([cw, ch]) => cw === w && ch === h)) return 'laptop';

      // Fallback threshold for Macs: widths >= 2560 are desktops; else laptops
      if (w >= 2560 || h >= 1440) return 'desktop';
      return 'laptop';
    }
    return 'laptop';
  }

  // For Windows/Linux where UA is ambiguous, only classify as laptop on common laptop resolutions
  if (w && h) {
    const commonLaptop = [
      [1366, 768], [1440, 900], [1536, 864], [1600, 900], [1680, 1050], [1920, 1080], [1920, 1200]
    ];
    if (commonLaptop.some(([cw, ch]) => cw === w && ch === h)) {
      // Prefer stored value unless it says desktop; then correct to laptop
      if (stored !== 'laptop') return 'laptop';
    }

    // Ultra-wide or very large monitors are desktops
    const aspect = w / h;
    if (aspect >= 2.0 || w >= 2560 || h >= 1440) return 'desktop';
  }

  // Fallback to stored type to avoid over-correction
  return stored;
}

export function getDisplayTitle(session: UserSession, deviceType: DeviceType) {
  const browser = session.browser_name || 'Browser';
  const os = session.operating_system || 'OS';
  const typeLabel = deviceType.charAt(0).toUpperCase() + deviceType.slice(1);
  return `${browser} on ${os} • ${typeLabel}`;
}

export function getDisplayDeviceName(session: UserSession, deviceType: DeviceType) {
  const browser = session.browser_name || 'Browser';
  const bver = session.browser_version || '';
  const os = session.operating_system || 'OS';
  const typeLabel = deviceType.charAt(0).toUpperCase() + deviceType.slice(1);
  return `${browser} ${bver} on ${os} • ${typeLabel}`.replace(/\s+/g, ' ').trim();
}
