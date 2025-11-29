import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
// Removed toast system - using notification system instead
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// AuthProvider is now handled at App.tsx level - removed duplicate
import { AuthProvider } from "@/contexts/AuthContext";
import { VideoSettingsProvider } from "@/contexts/VideoSettingsContext";
import { PostsProvider } from "@/contexts/PostsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PublishingProgressProvider } from "@/contexts/PublishingProgressContext";
import { SessionsProvider } from '@/contexts/SessionsContext';
import { ProfileSettingsProvider } from '@/contexts/ProfileSettingsContext';
import GlobalSessionRevocationMonitor from '@/components/auth/GlobalSessionRevocationMonitor';
import SessionBootstrapper from '@/components/sessions/SessionBootstrapper';

import LaptopApp from '@/components/apps/LaptopApp';
import DesktopApp from '@/components/apps/DesktopApp';
import TermsOfUse from '@/pages/TermsOfUse';
import SafetyWrapper from '@/components/SafetyWrapper';
import RootLoadingWrapper from '@/components/RootLoadingWrapper';
import CentralizedAuthGuard from '@/components/auth/CentralizedAuthGuard';
import GlobeLoader from '@/components/ui/GlobeLoader';
import RoutePersistence from '@/components/routing/RoutePersistence';
import GlobalScrollIndicator from '@/components/ui/GlobalScrollIndicator';
import { isPrimaryDomain, isMobileSubdomain, buildUrlFor, isAdminPath, MOBILE_SUBDOMAIN, PRIMARY_DOMAINS } from '@/utils/domainConfig';
import { supabase } from '@/integrations/supabase/client';
import { DesktopMobileToggle } from './DesktopMobileToggle';


// Import unified responsive styles
import '@/styles/responsive.css';
import '@/styles/mobile.css';
import '@/styles/desktop.css';

// Use standard query client for now
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});


// Check if current page is a public page
const isPublicPage = (pathname: string): boolean => {
  try {
    return pathname === '/terms-of-use' || pathname === '/privacy-policy';
  } catch (error) {
    console.warn('Public page check failed:', error);
    return false;
  }
};

const ViewSwitcher: React.FC = () => {
  const isRedirecting = false;

  // Mobile redirect logic - runs synchronously before first paint
  React.useLayoutEffect(() => {
    try {
      const hostname = window.location.hostname;
      const pathname = window.location.pathname;
      
      // Normalize auth paths on mobile subdomain early (no reload, no flicker)
      try {
        if (isMobileSubdomain(hostname)) {
          const isAuthPath = /^\/auth(\/|$)/.test(pathname);
          if (isAuthPath) {
            const { search, hash } = window.location;
            history.replaceState(null, '', `/${search}${hash}`);
          }
        }
      } catch {}
      
      // Parse URL parameters FIRST (before guard check)
      const urlParams = new URLSearchParams(window.location.search);
      const forceDesktop = urlParams.get('forceDesktop') === '1';
      const forceMobile = urlParams.get('forceMobile') === '1';
      const resetRedirectGuard = urlParams.get('resetMobileRedirect') === '1';
      const clearPrefers = urlParams.get('clearPrefersDesktop') === '1';
      
      // Clear preferences if requested
      if (clearPrefers) {
        try { 
          localStorage.removeItem('prefersDesktop');
          console.log('🧹 Cleared prefersDesktop from localStorage');
        } catch {}
      }

      // Reset redirect guard if requested
      if (resetRedirectGuard) {
        try { 
          sessionStorage.removeItem('mobileRedirectChecked');
          console.log('🔄 Reset mobileRedirectChecked guard');
        } catch {}
      }
      
      // Check guard AFTER potentially clearing it
      if (sessionStorage.getItem('mobileRedirectChecked') === '1') {
        console.log('✋ Redirect already checked this session, skipping');
        return;
      }
      
      // Skip redirect for admin paths
      if (isAdminPath(pathname)) {
        console.log('🔐 Admin path detected, skipping redirect');
        sessionStorage.setItem('mobileRedirectChecked', '1');
        return;
      }

      // Read user preference
      const prefersDesktop = localStorage.getItem('prefersDesktop') === '1';
      console.log('👤 User preferences:', { prefersDesktop, forceDesktop, forceMobile });

      if (forceDesktop) {
        console.log('💻 Force desktop override active');
        sessionStorage.setItem('mobileRedirectChecked', '1');
        return;
      }
      
      // Detect device
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['iphone','ipod','android','blackberry','windows phone','mobile','webos','opera mini'];
      const tabletKeywords = ['ipad','android tablet','kindle','silk','playbook','tablet'];
      const isMobileUA = mobileKeywords.some(k => userAgent.includes(k));
      const isTabletUA = tabletKeywords.some(k => userAgent.includes(k));
      const isRealMobile = isMobileUA && !isTabletUA;
      const isRealTablet = isTabletUA;

      // Robust desktop detection: real Macs/Windows/Linux (exclude iPadOS masquerading as Mac by checking touch points)
      const isMacDesktop = (userAgent.includes('macintosh') || userAgent.includes('mac os x')) && (navigator.maxTouchPoints || 0) < 2;
      const isWindowsDesktop = userAgent.includes('windows nt');
      const isLinuxDesktop = userAgent.includes('linux') && !userAgent.includes('android');
      const isDesktopBrowser = isMacDesktop || isWindowsDesktop || isLinuxDesktop || (userAgent.includes('safari') && !userAgent.includes('mobile'));
      
      console.log('🔍 Mobile redirect check:', {
        hostname,
        pathname,
        isRealMobile,
        isRealTablet,
        isDesktopBrowser,
        isPrimaryDomain: isPrimaryDomain(hostname),
        isMobileSubdomain: isMobileSubdomain(hostname),
        userAgent: userAgent.substring(0, 100),
        maxTouchPoints: navigator.maxTouchPoints
      });
      
      // Force mobile override param on primary (ignored in single-domain mode)
      if (forceMobile && isPrimaryDomain(hostname)) {
        console.log('⚡ forceMobile=1 detected, staying on primary domain (single-domain mode)');
        sessionStorage.setItem('mobileRedirectChecked', '1');
        return;
      }

      // Mobile/Tablet users on primary domain → redirect to mobile subdomain (unless they prefer desktop)
      if ((isRealMobile || isRealTablet) && !isDesktopBrowser && isPrimaryDomain(hostname)) {
        
        // Redirect to mobile subdomain
        sessionStorage.setItem('mobileRedirectChecked', '1');
        
        // Strip /auth and /auth/* paths when redirecting to mobile subdomain
        const { search, hash } = window.location;
        const isAuthPath = /^\/auth(\/|$)/.test(pathname);
        const targetPath = isAuthPath ? '/' : pathname;
        const targetUrl = `https://${MOBILE_SUBDOMAIN}${targetPath}${search}${hash}`;
        
        console.log('📱 Redirecting mobile/tablet user to mobile subdomain:', targetUrl);
        window.location.replace(targetUrl);
        return;
      }
      
      // Desktop on mobile subdomain → redirect back to primary (instant, no DB lookup)
      if (isDesktopBrowser && isMobileSubdomain(hostname)) {
        sessionStorage.setItem('mobileRedirectChecked', '1');
        const targetUrl = buildUrlFor(PRIMARY_DOMAINS[0]);
        console.log('💻 Redirecting desktop user to primary domain:', targetUrl);
        window.location.replace(targetUrl);
        return;
      }
      
      console.log('✅ No redirect needed, staying on current domain');
      sessionStorage.setItem('mobileRedirectChecked', '1');
    } catch (error) {
      console.warn('❌ Mobile redirect check failed:', error);
      sessionStorage.setItem('mobileRedirectChecked', '1');
    }
  }, []);

  // Show loading while redirecting

  // Fallback device detection without hooks for initial render
  const getBasicDeviceInfo = () => {
    try {
      const userAgent = navigator.userAgent.toLowerCase();
      // Robust desktop detection as above
      const isMacDesktop = (userAgent.includes('macintosh') || userAgent.includes('mac os x')) && (navigator.maxTouchPoints || 0) < 2;
      const isWindowsDesktop = userAgent.includes('windows nt');
      const isLinuxDesktop = userAgent.includes('linux') && !userAgent.includes('android');
      const isDesktopBrowser = isMacDesktop || isWindowsDesktop || isLinuxDesktop || (userAgent.includes('safari') && !userAgent.includes('mobile'));
      
      const mobileKeywords = ['iphone','ipod','android','blackberry','windows phone','mobile','webos','opera mini'];
      const tabletKeywords = ['ipad','android tablet','kindle','silk','playbook','tablet'];
      const isMobileUA = mobileKeywords.some(k => userAgent.includes(k));
      const isTabletUA = tabletKeywords.some(k => userAgent.includes(k));
      
      return {
        isRealMobile: isMobileUA && !isTabletUA,
        isRealTablet: isTabletUA,
        isRealDesktop: isDesktopBrowser
      };
    } catch (error) {
      console.warn('Basic device detection failed:', error);
      return { isRealMobile: false, isRealTablet: false, isRealDesktop: true };
    }
  };

  // Use basic device info for now - will enhance with hooks after React is stable
  const deviceInfo = getBasicDeviceInfo();
  
  const getWindowSize = () => {
    try {
      if (typeof window !== 'undefined') {
        return {
          width: window.innerWidth,
          height: window.innerHeight
        };
      }
    } catch (error) {
      console.warn('Window size detection failed:', error);
    }
    return { width: 1280, height: 720 };
  };
  
  const windowSize = getWindowSize();

  // Safe domain detection with error handling
  const currentPath = (() => {
    try {
      return typeof window !== 'undefined' ? window.location.pathname : '/';
    } catch (error) {
      console.warn('Path detection failed:', error);
      return '/';
    }
  })();
  
  const isOnPublicPage = isPublicPage(currentPath);

  // If we're on a public page, render it directly with error boundary
  if (isOnPublicPage) {
    try {
      return (
        <SafetyWrapper>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <BrowserRouter>
                <div className="min-h-screen bg-gray-50">
                  <RoutePersistence />
                  <TermsOfUse />
                  <GlobalScrollIndicator />
                  {/* Removed toast system - using notification system */}
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </SafetyWrapper>
      );
    } catch (error) {
      console.error('Public page render error:', error);
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <GlobeLoader size="lg" showText={true} />
        </div>
      );
    }
  }

  // Determine layout type based on real device + window size
  const getLayoutType = () => {
    // Desktop browsers: robust detection (avoid classifying Android/iPad as desktop)
    const userAgent = navigator.userAgent.toLowerCase();
    const isMacDesktop = (userAgent.includes('macintosh') || userAgent.includes('mac os x')) && (navigator.maxTouchPoints || 0) < 2;
    const isWindowsDesktop = userAgent.includes('windows nt');
    const isLinuxDesktop = userAgent.includes('linux') && !userAgent.includes('android');
    const isDesktopBrowser = isMacDesktop || isWindowsDesktop || isLinuxDesktop || (userAgent.includes('safari') && !userAgent.includes('mobile'));
    
    if (isDesktopBrowser) {
      // Desktop browsers: laptop or desktop based on width
      if (windowSize.width >= 1280) return 'desktop';
      return 'laptop';
    }
    
    // Mobile/tablet devices: use laptop layout (it's responsive)
    if (deviceInfo.isRealMobile || deviceInfo.isRealTablet) {
      return 'laptop';
    }
    
    // Fallback for other devices
    if (windowSize.width >= 1280) return 'desktop';
    if (windowSize.width >= 1024) return 'laptop';
    return 'laptop';
  };
  
  const layoutType = getLayoutType();

  // Get the app component with error handling
  const getAppComponent = () => {
    try {
      switch(layoutType) {
        case 'laptop':
          return LaptopApp;
        case 'desktop':
          return DesktopApp;
        default:
          return LaptopApp;
      }
    } catch (error) {
      console.error('App component selection failed:', error);
      return LaptopApp;
    }
  };
  
  const AppComponent = getAppComponent();


  // Main render with comprehensive error handling
  try {
    return (
      <RootLoadingWrapper>
        <SafetyWrapper>
          <AuthProvider>
            <SessionsProvider>
              <SessionBootstrapper />
              <GlobalSessionRevocationMonitor />
              <QueryClientProvider client={queryClient}>
                <VideoSettingsProvider>
                  <ProfileSettingsProvider>
                    <ThemeProvider>
                      <TooltipProvider>
                        <BrowserRouter>
                          <RoutePersistence />
                          <CentralizedAuthGuard>
                            <PostsProvider>
                                 <PublishingProgressProvider>
                                 <div className={`app-container is-${layoutType}-view vw-100 vh-100`} data-auth-ready>
                                   <AppComponent />
                                   <DesktopMobileToggle />
                                 </div>
                                 <GlobalScrollIndicator />
                                 {/* Removed toast system - using notification system */}
                               </PublishingProgressProvider>
                            </PostsProvider>
                          </CentralizedAuthGuard>
                        </BrowserRouter>
                      </TooltipProvider>
                    </ThemeProvider>
                  </ProfileSettingsProvider>
                </VideoSettingsProvider>
              </QueryClientProvider>
            </SessionsProvider>
          </AuthProvider>
        </SafetyWrapper>
      </RootLoadingWrapper>
    );
  } catch (error) {
    console.error('ViewSwitcher render error:', error);
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <GlobeLoader size="lg" showText={true} />
        </div>
      );
  }
};

export default ViewSwitcher;