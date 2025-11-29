/**
 * AvatarCacheService - Coordinates SW cache + in-memory preloading
 * Eliminates flash/flicker by ensuring avatars are ready before render
 */

class AvatarCacheService {
  private preloadedUrls = new Set<string>();
  private preloadPromises = new Map<string, Promise<void>>();

  /**
   * Preload avatar URL to eliminate flicker
   */
  async preload(url: string): Promise<void> {
    if (!url || this.preloadedUrls.has(url)) {
      return; // Already preloaded
    }

    // Return existing promise if preload is in flight
    const existing = this.preloadPromises.get(url);
    if (existing) {
      return existing;
    }

    // Create new preload promise
    const promise = this.performPreload(url);
    this.preloadPromises.set(url, promise);

    try {
      await promise;
      this.preloadedUrls.add(url);
    } finally {
      this.preloadPromises.delete(url);
    }
  }

  /**
   * Perform actual preload with SW cache + browser preload
   */
  private async performPreload(url: string): Promise<void> {
    try {
      // Strategy 1: Tell service worker to cache it
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'PRELOAD_AVATAR',
          url
        });
      }

      // Strategy 2: Browser image preload for instant display
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        const timeout = setTimeout(() => {
          console.warn('⚠️ Avatar preload timeout:', url.substring(0, 80));
          resolve(); // Don't block on timeout
        }, 3000);

        img.onload = () => {
          clearTimeout(timeout);
          console.log('✅ Avatar preloaded:', url.substring(0, 80));
          resolve();
        };

        img.onerror = () => {
          clearTimeout(timeout);
          console.warn('⚠️ Avatar preload failed:', url.substring(0, 80));
          reject(new Error('Image preload failed'));
        };

        img.src = url;
      });

    } catch (error) {
      console.warn('Avatar preload error (non-blocking):', error);
      // Don't throw - preload failures shouldn't block
    }
  }

  /**
   * Preload multiple avatars in parallel
   */
  async preloadBatch(urls: string[]): Promise<void> {
    const uniqueUrls = [...new Set(urls)].filter(url => 
      url && !this.preloadedUrls.has(url)
    );

    if (uniqueUrls.length === 0) return;

    console.log(`🎯 Preloading ${uniqueUrls.length} avatars...`);
    
    // Preload in parallel with limit
    const BATCH_SIZE = 5;
    for (let i = 0; i < uniqueUrls.length; i += BATCH_SIZE) {
      const batch = uniqueUrls.slice(i, i + BATCH_SIZE);
      await Promise.allSettled(batch.map(url => this.preload(url)));
    }
  }

  /**
   * Check if URL is preloaded
   */
  isPreloaded(url: string): boolean {
    return this.preloadedUrls.has(url);
  }

  /**
   * Clear preload cache
   */
  clear(): void {
    this.preloadedUrls.clear();
    this.preloadPromises.clear();
    console.log('🗑️ Avatar preload cache cleared');
  }

  /**
   * Clear service worker cache
   */
  async clearServiceWorkerCache(): Promise<void> {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      return new Promise((resolve) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (event) => {
          console.log('Service worker cache cleared:', event.data);
          resolve();
        };
        
        navigator.serviceWorker.controller.postMessage(
          { type: 'CLEAR_AVATAR_CACHE' },
          [channel.port2]
        );
        
        // Timeout fallback
        setTimeout(resolve, 1000);
      });
    }
  }
}

// Export singleton
export const avatarCacheService = new AvatarCacheService();

// Expose for debugging
if (typeof window !== 'undefined') {
  (window as any).__avatarCache = avatarCacheService;
}
