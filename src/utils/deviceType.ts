import { UAParser } from 'ua-parser-js';

export type DeviceCategory = 'desktop' | 'laptop' | 'tablet' | 'mobile' | 'unknown';

/**
 * Get device brand from user agent (Samsung, Google, Xiaomi, Huawei, etc.)
 */
const getDeviceBrand = (ua: string): string => {
  const u = ua.toLowerCase();
  
  // Samsung devices
  if (/(samsung|sm-|galaxy|gt-)/i.test(u)) return 'Samsung';
  
  // Google devices
  if (/(pixel|nexus)/i.test(u)) return 'Google';
  
  // Xiaomi devices
  if (/(xiaomi|mi |redmi|poco)/i.test(u)) return 'Xiaomi';
  
  // Huawei devices
  if (/(huawei|honor|hms)/i.test(u)) return 'Huawei';
  
  // OnePlus
  if (/oneplus/i.test(u)) return 'OnePlus';
  
  // Oppo
  if (/(oppo|cph)/i.test(u)) return 'Oppo';
  
  // Vivo
  if (/vivo/i.test(u)) return 'Vivo';
  
  // Motorola
  if (/(motorola|moto)/i.test(u)) return 'Motorola';
  
  // LG
  if (/lg-|lge/i.test(u)) return 'LG';
  
  // Sony
  if (/(sony|xperia)/i.test(u)) return 'Sony';
  
  // Nokia
  if (/nokia/i.test(u)) return 'Nokia';
  
  // HTC
  if (/htc/i.test(u)) return 'HTC';
  
  // Lenovo
  if (/(lenovo|ideapad|thinkpad)/i.test(u)) return 'Lenovo';
  
  // Asus
  if (/(asus|zenbook|vivobook)/i.test(u)) return 'Asus';
  
  // Acer
  if (/(acer|aspire)/i.test(u)) return 'Acer';
  
  // HP
  if (/(hp |hewlett)/i.test(u)) return 'HP';
  
  // Dell
  if (/(dell|inspiron|xps)/i.test(u)) return 'Dell';
  
  // Microsoft
  if (/(microsoft|surface)/i.test(u)) return 'Microsoft';
  
  // Apple
  if (/(iphone|ipad|ipod|macbook|imac|mac)/i.test(u)) return 'Apple';
  
  return 'Unknown';
};

/**
 * Get specific device model name from user agent
 */
const getDeviceModel = (ua: string): string | null => {
  const u = ua.toLowerCase();
  
  // Samsung Galaxy models
  if (/galaxy s24/i.test(u)) return 'Galaxy S24';
  if (/galaxy s23/i.test(u)) return 'Galaxy S23';
  if (/galaxy s22/i.test(u)) return 'Galaxy S22';
  if (/galaxy s21/i.test(u)) return 'Galaxy S21';
  if (/galaxy s20/i.test(u)) return 'Galaxy S20';
  if (/galaxy note/i.test(u)) return 'Galaxy Note';
  if (/galaxy a/i.test(u)) return 'Galaxy A Series';
  if (/galaxy z fold/i.test(u)) return 'Galaxy Z Fold';
  if (/galaxy z flip/i.test(u)) return 'Galaxy Z Flip';
  if (/galaxy tab/i.test(u)) return 'Galaxy Tab';
  
  // Google Pixel
  if (/pixel 9/i.test(u)) return 'Pixel 9';
  if (/pixel 8/i.test(u)) return 'Pixel 8';
  if (/pixel 7/i.test(u)) return 'Pixel 7';
  if (/pixel 6/i.test(u)) return 'Pixel 6';
  if (/pixel 5/i.test(u)) return 'Pixel 5';
  if (/pixel 4/i.test(u)) return 'Pixel 4';
  
  // Xiaomi
  if (/redmi note/i.test(u)) return 'Redmi Note';
  if (/redmi/i.test(u)) return 'Redmi';
  if (/poco/i.test(u)) return 'Poco';
  if (/mi 1\d/i.test(u)) return 'Mi Series';
  
  // OnePlus
  if (/oneplus \d+/i.test(u)) return u.match(/oneplus \d+/i)?.[0].toUpperCase() || 'OnePlus';
  
  // iPhone models
  if (/iphone 16/i.test(u)) return 'iPhone 16';
  if (/iphone 15/i.test(u)) return 'iPhone 15';
  if (/iphone 14/i.test(u)) return 'iPhone 14';
  if (/iphone 13/i.test(u)) return 'iPhone 13';
  if (/iphone 12/i.test(u)) return 'iPhone 12';
  if (/iphone 11/i.test(u)) return 'iPhone 11';
  if (/iphone x/i.test(u)) return 'iPhone X';
  if (/iphone se/i.test(u)) return 'iPhone SE';
  
  // iPad models
  if (/ipad pro/i.test(u)) return 'iPad Pro';
  if (/ipad air/i.test(u)) return 'iPad Air';
  if (/ipad mini/i.test(u)) return 'iPad Mini';
  
  // Mac models
  if (/macbook pro/i.test(u)) return 'MacBook Pro';
  if (/macbook air/i.test(u)) return 'MacBook Air';
  if (/macbook/i.test(u)) return 'MacBook';
  if (/imac/i.test(u)) return 'iMac';
  if (/mac pro/i.test(u)) return 'Mac Pro';
  if (/mac studio/i.test(u)) return 'Mac Studio';
  if (/mac mini/i.test(u)) return 'Mac mini';
  
  // Windows laptops
  if (/surface laptop/i.test(u)) return 'Surface Laptop';
  if (/surface pro/i.test(u)) return 'Surface Pro';
  if (/surface book/i.test(u)) return 'Surface Book';
  if (/thinkpad/i.test(u)) return 'ThinkPad';
  if (/ideapad/i.test(u)) return 'IdeaPad';
  if (/zenbook/i.test(u)) return 'ZenBook';
  if (/vivobook/i.test(u)) return 'VivoBook';
  if (/(xps|inspiron)/i.test(u)) return u.match(/(xps|inspiron)/i)?.[0] || 'Dell Laptop';
  
  return null;
};

const mapOS = (name?: string, version?: string) => {
  const n = (name || '').toLowerCase();
  const normalize = (ver?: string) => {
    if (!ver) return '';
    const cleaned = ver.replace(/_/g, '.').replace(/[^\d.]/g, '');
    // Show up to major.minor for clearer, more accurate info (e.g., 10.15 or 14.1)
    const parts = cleaned.split('.').filter(Boolean);
    const majorMinor = parts.length >= 2 ? `${parts[0]}.${parts[1]}` : parts[0] || '';
    return majorMinor ? ` ${majorMinor}` : '';
  };
  const v = normalize(version);
  
  if (n.includes('ios')) return `iOS${v}`;
  if (n.includes('ipados')) return `iPadOS${v}`;
  if (n.includes('android')) return `Android${v}`;
  if (n.includes('windows')) {
    // Better Windows version names
    if (v.startsWith(' 11')) return 'Windows 11';
    if (v.startsWith(' 10')) return 'Windows 10';
    return `Windows${v}`;
  }
  if (n.includes('chrome')) return 'ChromeOS';
  if (n.includes('mac')) return `macOS${v}`;
  if (n.includes('linux')) {
    if (n.includes('ubuntu')) return 'Ubuntu';
    if (n.includes('fedora')) return 'Fedora';
    if (n.includes('debian')) return 'Debian';
    return 'Linux';
  }
  return 'Unknown OS';
};

const fromRules = (ua: string): DeviceCategory => {
  const u = ua.toLowerCase();
  
  console.log('🔍 Device detection UA:', ua);
  
  // Priority 1: Mobile phones (MUST be first - most specific)
  // iPhone
  if (/(iphone|ipod)/i.test(u)) {
    console.log('📱 iPhone detected');
    return 'mobile';
  }
  
  // Android phones (with "mobile" keyword)
  if (/android/i.test(u) && /mobile/i.test(u)) {
    console.log('📱 Android phone detected (has mobile keyword)');
    return 'mobile';
  }
  
  // Other mobile phones
  if (/(windows phone|blackberry|bb10)/i.test(u)) {
    console.log('📱 Other mobile phone detected');
    return 'mobile';
  }
  
  // Priority 2: Tablets
  // iPad detection (iPadOS 13+ reports as Macintosh)
  const isMacintosh = /macintosh/i.test(ua);
  const maxTouchPoints = typeof navigator !== 'undefined' ? navigator.maxTouchPoints : 0;
  if (isMacintosh && maxTouchPoints > 1) {
    console.log('📲 iPad detected via Macintosh + touch points');
    return 'tablet';
  }
  
  // Explicit iPad
  if (/ipad/i.test(u)) {
    console.log('📲 iPad explicitly detected');
    return 'tablet';
  }
  
  // Android tablets (Android WITHOUT "mobile")
  if (/android/i.test(u) && !/mobile/i.test(u)) {
    console.log('📲 Android tablet detected (no mobile keyword)');
    return 'tablet';
  }
  
  // Other tablets
  if (/(tablet|kindle|silk|playbook|galaxy tab)/i.test(u)) {
    console.log('📲 Other tablet detected');
    return 'tablet';
  }
  
  // Priority 3: Chromebooks
  if (/cros|chromebook/i.test(u)) {
    console.log('💻 Chromebook detected');
    return 'laptop';
  }
  
  // Priority 4: Explicit laptop indicators
  if (/(macbook|notebook|laptop)/i.test(u)) {
    console.log('💻 Laptop explicitly detected via UA');
    return 'laptop';
  }
  
  // Priority 5: Explicit desktop indicators
  if (/(imac|mac\s?pro|mac\s?studio|mac\s?mini)/i.test(u)) {
    console.log('🖥️ Desktop Mac explicitly detected via UA');
    return 'desktop';
  }
  
  // Priority 6: Windows/Linux - need battery detection
  if (/(windows nt|linux x86_64|x11)/i.test(u)) {
    console.log('🔍 Windows/Linux detected - will use battery heuristics');
    return 'unknown';
  }
  
  // Priority 7: Generic macOS without explicit model
  if (/mac os x|macintosh/i.test(u)) {
    console.log('🔍 Generic macOS detected - will use battery heuristics');
    return 'unknown';
  }
  
  return 'unknown';
};

const guessDesktopVsLaptop = async (): Promise<'desktop' | 'laptop'> => {
  if (typeof window === 'undefined') return 'desktop';
  
  const ua = navigator.userAgent.toLowerCase();
  const nav = navigator as any;
  
  console.log('🔍 Starting desktop/laptop heuristics for:', ua);
  
  // Priority 1: Explicit MacBook keyword = definitive laptop
  if (/macbook/i.test(ua)) {
    console.log('💻 MacBook explicitly detected - LAPTOP');
    return 'laptop';
  }
  
  // Priority 2: Explicit desktop Mac keywords = definitive desktop
  if (/(imac|mac\s?pro|mac\s?studio|mac\s?mini)/i.test(ua)) {
    console.log('🖥️ Desktop Mac explicitly detected - DESKTOP');
    return 'desktop';
  }
  
  // Priority 3: Battery API for Windows/Linux laptops
  if (nav.getBattery) {
    try {
      const battery = await nav.getBattery();
      if (battery && battery.charging !== undefined) {
        console.log('🔋 Battery API detected - LAPTOP');
        return 'laptop';
      } else {
        console.log('🔌 No battery detected - DESKTOP');
        return 'desktop';
      }
    } catch (e) {
      console.log('⚠️ Battery API blocked/unavailable');
    }
  }
  
  // Priority 4: For generic macOS (without explicit model), check screen size and battery signal
  const isMac = /mac os x|macintosh/i.test(ua);
  if (isMac) {
    const w = window.screen?.width || 0;
    const h = window.screen?.height || 0;
    const hasBatteryApi = 'getBattery' in (navigator as any);
    
    // If Battery API exists, it's almost certainly a laptop
    if (hasBatteryApi) {
      console.log('🔋 Battery API present on macOS - treating as LAPTOP');
      return 'laptop';
    }
    
    // Desktop Macs/external displays: >=1680 width OR >=1050 height
    // Examples: 1920x1080, 2240x1260, 2560x1440, 5120x2880
    if (w >= 1680 || h >= 1050) {
      console.log(`🖥️ macOS with desktop-size display ${w}x${h} - DESKTOP`);
      return 'desktop';
    } else {
      console.log(`💻 macOS with laptop-size display ${w}x${h} - LAPTOP`);
      return 'laptop';
    }
  }
  
  // Priority 5: Screen size heuristics for Windows/Linux
  const w = window.screen?.width || 0;
  const h = window.screen?.height || 0;
  
  console.log('📐 Screen heuristics:', {
    width: w,
    height: h,
    platform: navigator.platform
  });
  
  // Very high resolution (4K+) → Desktop
  if (w >= 3840 || h >= 2160) {
    console.log('🖥️ 4K+ display detected - DESKTOP');
    return 'desktop';
  }
  
  // Typical laptop resolution range
  if (w >= 1280 && w <= 1920 && h >= 720 && h <= 1200) {
    console.log('💻 Typical laptop resolution - LAPTOP');
    return 'laptop';
  }
  
  // Priority 6: Final fallback - DESKTOP (safest assumption)
  console.log('🖥️ No definitive indicators - defaulting to DESKTOP');
  return 'desktop';
};

export async function detectFromUserAgent(
  ua: string,
  hints?: { platform?: string; model?: string; mobile?: boolean }
): Promise<{ deviceType: DeviceCategory; deviceName: string; browser: string; operatingSystem: string }> {
  const parser = new UAParser(ua);
  const res = parser.getResult();

  console.log('🔍 Device Detection Debug:', {
    userAgent: ua,
    uaParserDevice: res.device?.type,
    uaParserOS: res.os?.name,
    uaParserBrowser: res.browser?.name,
    screenSize: `${screen?.width}x${screen?.height}`,
    platform: hints?.platform || navigator?.platform
  });

  let deviceType: DeviceCategory = 'unknown';
  const uaRuleType = fromRules(ua);

  // Special case: iPadOS 13+ (and later) often reports as "Macintosh" but has touch input
  const isMacLike = /macintosh|mac os x/i.test(ua);
  const maxTouchPoints = (navigator as any)?.maxTouchPoints || 0;
  const isIPadDesktopUA = isMacLike && maxTouchPoints > 1;

  if (res.device?.type === 'mobile' || hints?.mobile === true) {
    deviceType = 'mobile';
  } else if (res.device?.type === 'tablet' || isIPadDesktopUA) {
    deviceType = 'tablet';
    if (isIPadDesktopUA) {
      console.log('🧠 Heuristic: Detected iPad masquerading as macOS via touch points → tablet');
    }
  } else if (uaRuleType !== 'unknown') {
    deviceType = uaRuleType;
  } else {
    deviceType = await guessDesktopVsLaptop();
  }

  const osName = mapOS(res.os?.name, res.os?.version);
  const browserBase = res.browser?.name || 'Unknown Browser';
  const browserVersion = res.browser?.version ? ` ${res.browser.version.split('.')[0]}` : '';
  const browserName = `${browserBase}${browserVersion}`.trim();

  // Generate descriptive device names
  let deviceName = 'Unknown Device';
  if (deviceType === 'mobile') {
    if (/iphone/i.test(ua)) deviceName = 'iPhone';
    else if (/android/i.test(ua)) deviceName = 'Android Phone';
    else deviceName = 'Mobile Phone';
  } else if (deviceType === 'tablet') {
    if (/ipad/i.test(ua) || isIPadDesktopUA) deviceName = 'iPad';
    else if (/android/i.test(ua)) deviceName = 'Android Tablet';
    else deviceName = 'Tablet';
  } else if (deviceType === 'laptop') {
    if (osName === 'macOS') deviceName = 'MacBook';
    else if (osName === 'Windows') deviceName = 'Windows Laptop';
    else deviceName = `${osName} Laptop`;
  } else if (deviceType === 'desktop') {
    if (/imac/i.test(ua)) deviceName = 'iMac';
    else if (/mac\s?pro/i.test(ua)) deviceName = 'Mac Pro';
    else if (/mac\s?studio/i.test(ua)) deviceName = 'Mac Studio';
    else if (/mac\s?mini/i.test(ua)) deviceName = 'Mac mini';
    else if (osName === 'macOS') deviceName = 'Mac Desktop';
    else if (osName === 'Windows') deviceName = 'Windows Desktop PC';
    else deviceName = `${osName} Desktop`;
  }

  console.log('✅ Final Detection Result:', {
    deviceType,
    deviceName,
    browser: browserName,
    operatingSystem: osName
  });

  return {
    deviceType,
    deviceName,
    browser: browserName,
    operatingSystem: osName,
  };
}
