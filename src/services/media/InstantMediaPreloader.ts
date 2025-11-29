/**
 * InstantMediaPreloader - Aggressively preloads all user media on login
 * Ensures zero delays when displaying avatar and cover photos
 * 
 * ⚠️ CRITICAL SYSTEM - DO NOT MODIFY WITHOUT APPROVAL ⚠️
 * This service is essential for instant photo display on login.
 * Any changes may cause visible delays and poor user experience.
 */

class InstantMediaPreloader {
  private preloadedUsers = new Set<string>();
  
  /**
   * Preload all media for a user instantly on login
   */
  async preloadUserMedia(userId: string): Promise<void> {
    console.log('⚡ InstantMediaPreloader: Aggressive parallel preload for', userId);
    
    // Don't skip - always preload to ensure instant display
    this.preloadedUsers.add(userId);
    
    // PARALLEL: Preload both avatar and cover at exact same time
    Promise.all([
      this.preloadFromCache(`avatar_cache_${userId}`),
      this.preloadFromCache(`cover:last:${userId}`)
    ]).catch(() => {});
    
    console.log('✅ InstantMediaPreloader: Parallel preload initiated');
  }
  
  /**
   * Preload image from localStorage cache
   */
  private async preloadFromCache(cacheKey: string): Promise<void> {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return;
      
      const data = JSON.parse(cached);
      const url = data?.url || data?.lastGoodUrl;
      
      if (!url || !url.startsWith('http')) return;
      
      console.log('🎯 Instant preload:', url.substring(0, 80));
      
      // Synchronous preload - force browser to cache immediately
      const img = new Image();
      img.src = url;
      
      // Also use fetch for aggressive caching
      fetch(url, { 
        method: 'GET',
        cache: 'force-cache',
        priority: 'high' 
      } as any).catch(() => {});
      
    } catch (e) {
      // Silent fail - preload is best-effort
    }
  }
  
  /**
   * Clear preload tracking for user (for testing)
   */
  clearPreloadTracking(userId: string): void {
    this.preloadedUsers.delete(userId);
  }
}

export const instantMediaPreloader = new InstantMediaPreloader();

// Expose for debugging
if (typeof window !== 'undefined') {
  (window as any).__instantMediaPreloader = instantMediaPreloader;
}
