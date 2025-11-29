// Utility functions to ensure instant updates and cache busting

declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: any;
  }
}

export const forceComponentRefresh = () => {
  if (import.meta.env.DEV) {
    // Force React to re-render all components
    window.dispatchEvent(new Event('resize'));
    
    // Trigger a state change in React DevTools if available
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      console.log('🔄 Triggering React DevTools refresh for instant updates');
    }
  }
};

export const clearAllCaches = async () => {
  if (import.meta.env.DEV) {
    console.log('🗑️ Clearing runtime caches for instant updates (non-destructive)...');
    
    // Only clear service worker caches; DO NOT wipe local/session storage or IndexedDB
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('✅ Cleared service worker caches');
    }

    // Gently refresh styles to reflect changes without nuking app state
    try { reloadCSSFiles(); } catch {}
  }
};

// Add cache-busting parameters to any URL
export const addCacheBuster = (url: string): string => {
  if (import.meta.env.DEV) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}_cb=${Date.now()}&_r=${Math.random().toString(36).substr(2, 9)}`;
  }
  return url;
};

// Force browser to reload specific resource types
export const reloadCSSFiles = () => {
  if (import.meta.env.DEV) {
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href) {
        const newHref = addCacheBuster(href.split('?')[0]);
        link.setAttribute('href', newHref);
      }
    });
    console.log('🎨 Reloaded CSS files for instant updates');
  }
};

// Enhanced instant updates for development
export const enableInstantUpdates = () => {
  if (import.meta.env.DEV) {
    console.log('⚡ Instant updates system activated');
    
    // Override fetch to add cache busting
    const originalFetch = window.fetch;
    window.fetch = function(input, init = {}) {
      let url: string;
      let finalInput: string | Request;
      
      // Extract URL from different input types
      if (typeof input === 'string') {
        url = input;
        finalInput = input;
      } else if (input instanceof Request) {
        url = input.url;
        finalInput = input;
      } else if (input instanceof URL) {
        url = input.href;
        finalInput = url;
      } else {
        // Fallback
        return originalFetch.call(this, input, init);
      }
      
      // Add cache busting to all requests in development
      if (url.startsWith('/') || url.includes(window.location.origin)) {
        const cachedBustedUrl = addCacheBuster(url);
        
        // Update init headers to disable caching
        const headers = new Headers(init.headers);
        headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        headers.set('Pragma', 'no-cache');
        headers.set('Expires', '0');
        
        const finalInit = {
          ...init,
          headers,
          cache: 'no-store' as RequestCache
        };
        
        if (typeof input === 'string') {
          return originalFetch.call(this, cachedBustedUrl, finalInit);
        } else {
          // Create a new Request with cache-busted URL
          return originalFetch.call(this, new Request(cachedBustedUrl, finalInit), finalInit);
        }
      }
      
      return originalFetch.call(this, finalInput, init);
    };
    
    console.log('✅ Fetch override activated for cache busting');
  }
};