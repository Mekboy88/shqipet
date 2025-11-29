// AVATAR PRELOAD CACHE SERVICE WORKER
// Caches avatar images to eliminate flicker and flash

const CACHE_VERSION = 'avatar-cache-v1';
const AVATAR_CACHE = 'avatars';
const MAX_CACHE_AGE = 15 * 60 * 1000; // 15 minutes

console.log('🖼️ Avatar Cache Service Worker: Active');

// Install - skip waiting to activate immediately
self.addEventListener('install', (event) => {
  console.log('📦 Avatar Cache SW installing...');
  self.skipWaiting();
});

// Activate - clean up old caches and take control
self.addEventListener('activate', (event) => {
  console.log('✅ Avatar Cache SW activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name !== AVATAR_CACHE && name !== CACHE_VERSION)
          .map(name => {
            console.log('🧹 Removing old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - cache avatar images with stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // CRITICAL: DO NOT CACHE AVATARS, UPLOADS, OR COVERS
  // Service Worker caching causes persistent blur by serving low-res cached variants
  // All avatar requests must bypass SW cache for dynamic srcSet variant selection
  const isAvatarRequest = 
    url.pathname.includes('/avatars/') ||
    url.pathname.includes('/uploads/') ||
    url.pathname.includes('/covers/');
  
  if (isAvatarRequest) {
    return; // Let browser handle avatar requests directly (no SW cache)
  }
  
  // Only cache non-avatar Wasabi requests
  const isWasabiNonAvatar = 
    url.hostname.includes('wasabisys.com') || 
    event.request.url.includes('wasabi-proxy') ||
    event.request.url.includes('wasabi-get-url');
  
  if (!isWasabiNonAvatar) {
    return; // Let browser handle non-Wasabi requests
  }

  event.respondWith(
    caches.open(AVATAR_CACHE).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        // Return cached response immediately if available
        if (cachedResponse) {
          const cacheDate = cachedResponse.headers.get('sw-cache-date');
          const age = cacheDate ? Date.now() - parseInt(cacheDate, 10) : Infinity;
          
          // If cache is fresh, use it and revalidate in background
          if (age < MAX_CACHE_AGE) {
            console.log('📦 Cache hit (fresh):', event.request.url.substring(0, 80));
            
            // Revalidate in background
            fetch(event.request).then(response => {
              if (response && response.status === 200) {
                const responseToCache = response.clone();
                const headers = new Headers(responseToCache.headers);
                headers.set('sw-cache-date', Date.now().toString());
                
                responseToCache.blob().then(blob => {
                  const cachedRes = new Response(blob, {
                    status: responseToCache.status,
                    statusText: responseToCache.statusText,
                    headers: headers
                  });
                  cache.put(event.request, cachedRes);
                });
              }
            }).catch(() => {});
            
            return cachedResponse;
          }
          
          // Cache is stale, fetch fresh but return cached as fallback
          console.log('⚠️ Cache hit (stale):', event.request.url.substring(0, 80));
        }
        
        // Fetch from network
        return fetch(event.request).then(response => {
          // Cache successful responses
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            const headers = new Headers(responseToCache.headers);
            headers.set('sw-cache-date', Date.now().toString());
            
            responseToCache.blob().then(blob => {
              const cachedRes = new Response(blob, {
                status: responseToCache.status,
                statusText: responseToCache.statusText,
                headers: headers
              });
              cache.put(event.request, cachedRes);
              console.log('💾 Cached avatar:', event.request.url.substring(0, 80));
            }).catch(err => {
              console.warn('Cache storage failed:', err);
            });
          }
          
          return response;
        }).catch(error => {
          console.warn('Network fetch failed:', error);
          // Return stale cache as ultimate fallback
          if (cachedResponse) {
            console.log('🔄 Using stale cache as fallback');
            return cachedResponse;
          }
          throw error;
        });
      });
    })
  );
});

// Message handler for manual cache operations
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'PRELOAD_AVATAR') {
    const { url } = event.data;
    if (url) {
      caches.open(AVATAR_CACHE).then(cache => {
        fetch(url).then(response => {
          if (response && response.status === 200) {
            const headers = new Headers(response.headers);
            headers.set('sw-cache-date', Date.now().toString());
            response.blob().then(blob => {
              const cachedRes = new Response(blob, {
                status: response.status,
                statusText: response.statusText,
                headers: headers
              });
              cache.put(url, cachedRes);
              console.log('🎯 Preloaded avatar:', url.substring(0, 80));
            });
          }
        }).catch(err => {
          console.warn('Preload failed:', err);
        });
      });
    }
  }
  
  if (event.data && event.data.type === 'CLEAR_AVATAR_CACHE') {
    caches.delete(AVATAR_CACHE).then(() => {
      console.log('🗑️ Avatar cache cleared');
      event.ports[0].postMessage({ success: true });
    });
  }
});