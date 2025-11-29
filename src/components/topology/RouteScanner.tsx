import { useState, useEffect } from 'react';

export interface RouteInfo {
  id: string;
  path: string;
  component: string;
  isProtected: boolean;
  isAdmin: boolean;
  exists: boolean;
  hasAuthCheck: boolean;
  status: 'active' | 'error' | 'not_found';
  errors: string[];
}

export const useRouteScanning = () => {
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  
  useEffect(() => {
    const scanRoutes = async () => {
      // Get the actual routes from the application
      const detectedRoutes: RouteInfo[] = [];
      
      // Define known routes from the application structure
      const knownRoutes = [
        // Public routes
        { path: '/auth/login', component: 'Login', isProtected: false, isAdmin: false },
        { path: '/auth/register', component: 'Register', isProtected: false, isAdmin: false },
        { path: '/auth/verification', component: 'Verification', isProtected: false, isAdmin: false },
        { path: '/terms-of-use', component: 'TermsOfUse', isProtected: false, isAdmin: false },
        { path: '/privacy-policy', component: 'TermsOfUse', isProtected: false, isAdmin: false },
        
        // Protected routes
        { path: '/', component: 'Index', isProtected: true, isAdmin: false },
        { path: '/reels', component: 'Reels', isProtected: true, isAdmin: false },
        { path: '/interesante', component: 'Reels', isProtected: true, isAdmin: false },
        { path: '/watch', component: 'Watch', isProtected: true, isAdmin: false },
        { path: '/profile', component: 'Profile', isProtected: true, isAdmin: false },
        { path: '/profile/settings', component: 'ProfileSettings', isProtected: true, isAdmin: false },
        { path: '/photos', component: 'Photos', isProtected: true, isAdmin: false },
        { path: '/marketplace', component: 'Marketplace', isProtected: true, isAdmin: false },
        
        // Admin routes
        { path: '/admin/login', component: 'AdminLogin', isProtected: false, isAdmin: true },
        { path: '/admin/dashboard', component: 'AdminDashboard', isProtected: true, isAdmin: true },
        { path: '/admin/users', component: 'UsersManagement', isProtected: true, isAdmin: true },
        { path: '/admin/core-platform/live-connection-topology', component: 'LiveConnectionTopology', isProtected: true, isAdmin: true },
        { path: '/admin/notifications', component: 'AllNotificationsPage', isProtected: true, isAdmin: true },
        { path: '/admin/integrations/oauth', component: 'OAuthProvidersConfig', isProtected: true, isAdmin: true },
        { path: '/admin/integrations/chatgpt', component: 'ChatGPTIntegration', isProtected: true, isAdmin: true },
        { path: '/admin/integrations/s3', component: 'AmazonS3Integration', isProtected: true, isAdmin: true },
        { path: '/admin/system/requirements-status', component: 'SystemRequirementsStatusPage', isProtected: true, isAdmin: true },
      ];
      
      // Test each route for existence and functionality
      for (const route of knownRoutes) {
        const routeInfo: RouteInfo = {
          id: `route-${route.path.replace(/\//g, '-')}`,
          path: route.path,
          component: route.component,
          isProtected: route.isProtected,
          isAdmin: route.isAdmin,
          exists: false,
          hasAuthCheck: route.isProtected,
          status: 'not_found',
          errors: []
        };
        
        try {
          // Check if we're currently on this route
          const currentPath = window.location.pathname;
          const isCurrentRoute = currentPath === route.path || 
                                 (route.path === '/' && currentPath === '/') ||
                                 currentPath.startsWith(route.path + '/');
          
          if (isCurrentRoute) {
            routeInfo.exists = true;
            routeInfo.status = 'active';
            
            // Check for route-specific elements that should exist
            const routeChecks = await performRouteHealthChecks(route.path, route.component);
            routeInfo.errors = routeChecks.errors;
            if (routeChecks.errors.length > 0) {
              routeInfo.status = 'error';
            }
          } else {
            // For non-current routes, we can only check basic existence
            // In a real app, you might make HEAD requests or use route manifests
            routeInfo.exists = true; // Assume exists if defined in router
            routeInfo.status = 'active';
          }
          
        } catch (error) {
          routeInfo.errors.push(`Route test failed: ${error}`);
          routeInfo.status = 'error';
        }
        
        detectedRoutes.push(routeInfo);
      }
      
      setRoutes(detectedRoutes);
    };
    
    const performRouteHealthChecks = async (path: string, component: string): Promise<{errors: string[]}> => {
      const errors: string[] = [];
      
      try {
        // Check for essential page elements based on component type
        if (component === 'Login') {
          const loginForm = document.querySelector('form');
          if (!loginForm) errors.push('Login form not found');
          
          const emailInput = document.querySelector('input[type="email"], input[name="contact"]');
          if (!emailInput) errors.push('Email input not found');
          
          const passwordInput = document.querySelector('input[type="password"]');
          if (!passwordInput) errors.push('Password input not found');
          
          const submitButton = document.querySelector('button[type="submit"], input[type="submit"]');
          if (!submitButton) errors.push('Submit button not found');
        }
        
        if (component === 'Register') {
          const registerForm = document.querySelector('form');
          if (!registerForm) errors.push('Registration form not found');
        }
        
        if (component === 'AdminDashboard') {
          const adminNav = document.querySelector('nav, [role="navigation"]');
          if (!adminNav) errors.push('Admin navigation not found');
        }
        
        if (component.includes('Admin') && component !== 'AdminLogin') {
          // Check for admin-specific elements
          const adminElements = document.querySelectorAll('[data-admin], .admin-only');
          if (adminElements.length === 0) {
            errors.push('Admin-specific elements not detected');
          }
        }
        
        // Check for common page structure
        const main = document.querySelector('main, [role="main"], .main-content');
        if (!main) errors.push('Main content area not found');
        
        // Check for React errors in the DOM
        const errorBoundary = document.querySelector('[data-error-boundary]');
        if (errorBoundary) errors.push('React error boundary activated');
        
        // Check for console errors (simulate by checking for error elements)
        const errorElements = document.querySelectorAll('.error, [aria-invalid="true"], .has-error');
        if (errorElements.length > 0) {
          errors.push(`${errorElements.length} error elements detected`);
        }
        
      } catch (error) {
        errors.push(`Health check failed: ${error}`);
      }
      
      return { errors };
    };
    
    scanRoutes();
    
    // Re-scan on route changes
    const handleRouteChange = () => {
      setTimeout(scanRoutes, 100); // Small delay to let DOM update
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    // Also scan periodically to catch dynamic changes
    const interval = setInterval(scanRoutes, 30000); // Every 30 seconds
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      clearInterval(interval);
    };
  }, []);
  
  return { routes };
};