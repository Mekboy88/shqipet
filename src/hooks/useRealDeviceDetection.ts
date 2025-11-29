import { useState, useEffect } from 'react';

interface DeviceInfo {
  isRealMobile: boolean;
  isRealTablet: boolean;
  isRealDesktop: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  userAgent: string;
  isTouchDevice: boolean;
  screenSize: 'small' | 'medium' | 'large';
}

// Detect real device type based on multiple factors
const detectRealDevice = (): DeviceInfo => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Check for mobile/tablet user agents
  const mobileKeywords = [
    'iphone', 'ipad', 'ipod', 'android', 'blackberry', 
    'windows phone', 'mobile', 'webos', 'opera mini'
  ];
  
  const tabletKeywords = [
    'ipad', 'android tablet', 'kindle', 'silk', 'playbook'
  ];
  
  const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
  const isTabletUA = tabletKeywords.some(keyword => userAgent.includes(keyword));
  
  // Check for touch capability
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Get screen dimensions
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const pixelRatio = window.devicePixelRatio || 1;
  
  // Actual physical screen size (not browser window)
  const physicalWidth = screenWidth * pixelRatio;
  const physicalHeight = screenHeight * pixelRatio;
  
  // Determine device type based on multiple factors
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  let screenSize: 'small' | 'medium' | 'large' = 'large';
  
  // Mobile detection (small screens, touch, mobile UA)
  if (isMobileUA && !isTabletUA && (screenWidth < 768 || physicalWidth < 1536)) {
    deviceType = 'mobile';
    screenSize = 'small';
  }
  // Tablet detection (medium screens, touch, tablet UA)
  else if (isTabletUA || (isTouchDevice && screenWidth >= 768 && screenWidth < 1024)) {
    deviceType = 'tablet';
    screenSize = 'medium';
  }
  // Desktop detection (large screens, no mobile UA, keyboard/mouse)
  else if (!isMobileUA && !isTabletUA && screenWidth >= 1024) {
    deviceType = 'desktop';
    screenSize = 'large';
  }
  // Fallback: if touch device with large screen but no clear UA, treat as tablet
  else if (isTouchDevice && screenWidth >= 1024) {
    deviceType = 'tablet';
    screenSize = 'large';
  }
  
  return {
    isRealMobile: deviceType === 'mobile',
    isRealTablet: deviceType === 'tablet',
    isRealDesktop: deviceType === 'desktop',
    deviceType,
    userAgent,
    isTouchDevice,
    screenSize
  };
};

export const useRealDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => detectRealDevice());
  
  useEffect(() => {
    // Re-detect only on orientation change (not resize)
    const handleOrientationChange = () => {
      setTimeout(() => {
        setDeviceInfo(detectRealDevice());
      }, 100);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);
  
  return deviceInfo;
};

// Enhanced breakpoint hook that respects real device type
export const useSmartBreakpoint = () => {
  const realDevice = useRealDeviceDetection();
  const [windowSize, setWindowSize] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight
  }));
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    // Only listen to resize for layout adjustments, not device type changes
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Determine layout based on real device + current window size
  const getLayoutType = () => {
    // For real mobile devices, always use mobile layout regardless of window size
    if (realDevice.isRealMobile) {
      return 'mobile';
    }
    
    // For real tablets, use tablet layout unless window is very small
    if (realDevice.isRealTablet) {
      return windowSize.width < 600 ? 'mobile' : 'tablet';
    }
    
    // For real desktop devices, never use mobile layout
    // Use desktop/laptop layout based on window size
    if (realDevice.isRealDesktop) {
      if (windowSize.width >= 1280) return 'desktop';
      if (windowSize.width >= 1024) return 'laptop';
      return 'tablet'; // Minimum layout for desktop devices
    }
    
    return 'desktop';
  };
  
  const layoutType = getLayoutType();
  
  return {
    // Real device info
    ...realDevice,
    
    // Current window size
    windowSize,
    
    // Layout decisions
    layoutType,
    isMobile: layoutType === 'mobile',
    isTablet: layoutType === 'tablet',
    isLaptop: layoutType === 'laptop',
    isDesktop: layoutType === 'desktop',
    
    // Computed states
    isMobileOrTablet: layoutType === 'mobile' || layoutType === 'tablet',
    isLaptopOrLarger: layoutType === 'laptop' || layoutType === 'desktop',
    
    // Force desktop layout (for testing)
    forceDesktopLayout: realDevice.isRealDesktop
  };
};