
import * as React from "react";

// Standardized breakpoint constants matching CSS
export const SMALL_MOBILE_BREAKPOINT = 480;
export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;
export const LAPTOP_BREAKPOINT = 1280;
export const DESKTOP_BREAKPOINT = 1536;

// Initialize with current window size
const getInitialWindowSize = () => {
  if (typeof window !== 'undefined') {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
  return { width: 1280, height: 720 };
};

const getDeviceType = (width: number): 'mobile' | 'tablet' | 'laptop' | 'desktop' => {
  if (width < MOBILE_BREAKPOINT) return 'mobile';
  if (width < TABLET_BREAKPOINT) return 'tablet';
  if (width < LAPTOP_BREAKPOINT) return 'laptop';
  return 'desktop';
};

export function useIsMobile() {
  // Use real device detection instead of just window size
  const [realDeviceType] = React.useState(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['iphone', 'ipod', 'android', 'blackberry', 'windows phone', 'mobile', 'webos', 'opera mini'];
    const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword)) && !userAgent.includes('ipad');
    const screenWidth = window.screen.width;
    
    return isMobileDevice && screenWidth < 768 ? 'mobile' : 'desktop';
  });

  const [windowSize, setWindowSize] = React.useState(() => getInitialWindowSize());

  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Real mobile devices are always mobile, desktop devices never become mobile from resize
  return realDeviceType === 'mobile';
}

export function useIsSmallMobile() {
  const [isSmallMobile, setIsSmallMobile] = React.useState<boolean>(() => {
    const { width } = getInitialWindowSize();
    return width < SMALL_MOBILE_BREAKPOINT;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${SMALL_MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsSmallMobile(window.innerWidth < SMALL_MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsSmallMobile(window.innerWidth < SMALL_MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isSmallMobile;
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean>(() => {
    const { width } = getInitialWindowSize();
    return width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsTablet(window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsTablet(window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isTablet;
}

export function useIsLaptop() {
  const [isLaptop, setIsLaptop] = React.useState<boolean>(() => {
    const { width } = getInitialWindowSize();
    return width >= TABLET_BREAKPOINT && width < LAPTOP_BREAKPOINT;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${TABLET_BREAKPOINT}px) and (max-width: ${LAPTOP_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsLaptop(window.innerWidth >= TABLET_BREAKPOINT && window.innerWidth < LAPTOP_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsLaptop(window.innerWidth >= TABLET_BREAKPOINT && window.innerWidth < LAPTOP_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isLaptop;
}

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState<boolean>(() => {
    const { width } = getInitialWindowSize();
    return width >= LAPTOP_BREAKPOINT;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${LAPTOP_BREAKPOINT}px)`);
    const onChange = () => {
      setIsDesktop(window.innerWidth >= LAPTOP_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsDesktop(window.innerWidth >= LAPTOP_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}

// Enhanced breakpoint hook with real device detection to prevent mobile layout on desktop browsers
export function useBreakpoint() {
  const [windowSize, setWindowSize] = React.useState(getInitialWindowSize);
  
  // Detect real device type only once on mount
  const [realDeviceType] = React.useState(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Mobile device detection
    const mobileKeywords = ['iphone', 'ipod', 'android', 'blackberry', 'windows phone', 'mobile', 'webos', 'opera mini'];
    const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword)) && !userAgent.includes('ipad');
    
    // Tablet detection
    const tabletKeywords = ['ipad', 'tablet', 'kindle', 'silk', 'playbook'];
    const isTabletDevice = tabletKeywords.some(keyword => userAgent.includes(keyword));
    
    // Touch capability
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Screen size detection
    const screenWidth = window.screen.width;
    
    if (isMobileDevice && screenWidth < 768) return 'mobile';
    if (isTabletDevice || (isTouchDevice && screenWidth >= 768 && screenWidth < 1024)) return 'tablet';
    if (!isMobileDevice && !isTabletDevice && screenWidth >= 1024) return 'desktop';
    
    return 'desktop'; // Default to desktop for unknown devices
  });

  React.useEffect(() => {
    const handleResize = () => {
      const newSize = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      setWindowSize(newSize);
    };

    // Only update window size, never change device type based on resize
    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedHandleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedHandleResize);
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Compute layout type based on real device + window size constraints
  const getLayoutType = () => {
    // Real mobile devices: always mobile layout
    if (realDeviceType === 'mobile') return 'mobile';
    
    // Real tablet devices: tablet or mobile based on window size
    if (realDeviceType === 'tablet') {
      return windowSize.width < 600 ? 'mobile' : 'tablet';
    }
    
    // Desktop devices: never go below tablet layout, even when resized small
    if (realDeviceType === 'desktop') {
      if (windowSize.width >= 1280) return 'desktop';
      if (windowSize.width >= 1024) return 'laptop';
      return 'tablet'; // Minimum layout for desktop browsers
    }
    
    return 'desktop';
  };
  
  const layoutType = getLayoutType();

  // Compute all breakpoint states based on layout type
  const isMobile = layoutType === 'mobile';
  const isTablet = layoutType === 'tablet';
  const isLaptop = layoutType === 'laptop';
  const isDesktop = layoutType === 'desktop';
  const isSmallMobile = realDeviceType === 'mobile' && windowSize.width < SMALL_MOBILE_BREAKPOINT;

  // Additional computed breakpoints
  const isMobileOrTablet = isMobile || isTablet;
  const isTabletOrLarger = isTablet || isLaptop || isDesktop;
  const isLaptopOrLarger = isLaptop || isDesktop;

  return {
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
    isSmallMobile,
    isMobileOrTablet,
    isTabletOrLarger,
    isLaptopOrLarger,
    deviceType: layoutType,
    realDeviceType,
    windowSize
  };
}

// Device orientation hook
export function useDeviceOrientation() {
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }
    return 'portrait';
  });

  React.useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  return orientation;
}
