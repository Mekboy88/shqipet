/**
 * MediaService - Unified media resolution with racing and caching
 * Handles all Wasabi key-to-URL resolution across the app
 */

import { supabase } from '@/integrations/supabase/client';

interface MediaCache {
  url: string;
  type: 'presigned' | 'blob';
  expiresAt: number;
}

interface LastGoodUrl {
  url: string;
  timestamp: number;
}

// Global caches
const mediaCache = new Map<string, MediaCache>();
const lastGoodUrls = new Map<string, LastGoodUrl>();
const inflightRequests = new Map<string, Promise<string>>();

// Cache for 14 minutes (refresh at T-30s before expiry)
const CACHE_DURATION_MS = 14 * 60 * 1000;
const REFRESH_THRESHOLD_MS = 30 * 1000;

class MediaService {
  /**
   * Get display URL from Wasabi key - races presigned and proxy
   */
  async getUrl(key: string): Promise<string> {
    if (!key || typeof key !== 'string') {
      throw new Error('Invalid key provided');
    }

    // If a full URL is provided (legacy records), use it directly and cache it
    if (/^https?:\/\//i.test(key)) {
      const cacheKey = this.getCacheKey(key);
      const cached = mediaCache.get(cacheKey);
      if (cached && this.isCacheValid(cached)) {
        return cached.url;
      }
      this.cacheUrl(cacheKey, key, 'presigned');
      lastGoodUrls.set(cacheKey, { url: key, timestamp: Date.now() });
      return key;
    }

    const cacheKey = this.getCacheKey(key);
    
    // Check cache first
    const cached = mediaCache.get(cacheKey);
    if (cached && this.isCacheValid(cached)) {
      return cached.url;
    }

    // Check if request is already in flight
    const existingRequest = inflightRequests.get(cacheKey);
    if (existingRequest) {
      return existingRequest;
    }

    // Start new resolution
    const resolutionPromise = this.resolveUrl(key, cacheKey);
    inflightRequests.set(cacheKey, resolutionPromise);

    try {
      const url = await resolutionPromise;
      return url;
    } finally {
      inflightRequests.delete(cacheKey);
    }
  }

  /**
   * Race presigned URL vs proxy blob for fastest display
   */
  private async resolveUrl(key: string, cacheKey: string): Promise<string> {
    // Prefer authenticated proxy blob (works with JWT-protected function); fallback to presigned
    try {
      const blobUrl = await this.getProxyBlob(key);
      this.cacheUrl(cacheKey, blobUrl, 'blob');
      lastGoodUrls.set(cacheKey, { url: blobUrl, timestamp: Date.now() });
      return blobUrl;
    } catch (e1) {
      console.warn('⚠️ Proxy blob failed, trying presigned URL for key:', key);
      try {
        const presigned = await this.getPresignedUrl(key);
        this.cacheUrl(cacheKey, presigned, 'presigned');
        lastGoodUrls.set(cacheKey, { url: presigned, timestamp: Date.now() });
        return presigned;
      } catch (e2) {
        console.error('❌ Both media URL sources failed for key:', key, { e1, e2 });
        // Notify UI that resolution failed (debug banners can listen)
        try { window.dispatchEvent(new CustomEvent('media-resolve-failed', { detail: { key, cacheKey } })); } catch {}
        // Try last in-memory good URL (within 24h)
        const lastGood = lastGoodUrls.get(cacheKey);
        if (lastGood && (Date.now() - lastGood.timestamp) < 24 * 60 * 60 * 1000) {
          console.log('🔄 Using last good URL for key:', key);
          return lastGood.url;
        }
        // Try persisted localStorage per-key cache as ultimate fallback
        try {
          const raw = localStorage.getItem(`media:last:${cacheKey}`);
          if (raw) {
            const j = JSON.parse(raw);
            if (typeof j?.url === 'string') {
              console.log('🟡 Using persisted media cache for key:', cacheKey);
              return j.url as string;
            }
          }
        } catch {}
        throw e2;
      }
    }
  }

  /**
   * Get presigned URL from wasabi-get-url function
   */
  private async getPresignedUrl(key: string): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session for presigned URL');
    }

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/wasabi-get-url`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ key })
    });

    if (!response.ok) {
      throw new Error(`Failed to get presigned URL: ${response.status}`);
    }

    const result = await response.json();
    const returnedUrl = result.url;

    // If the function returned a proxy URL, fetch it with auth and return blob
    if (returnedUrl?.includes('/wasabi-proxy')) {
      const response = await fetch(returnedUrl, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch from proxy URL: ${response.status}`);
      }
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }

    return returnedUrl;
  }

  /**
   * Get proxy blob URL directly from wasabi-proxy function
   */
  async getProxyBlob(key: string): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session for proxy blob');
    }
    
    // Use direct fetch with query params instead of invoke for better reliability
    const proxyUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/wasabi-proxy?key=${encodeURIComponent(key)}`;
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      }
    });

    if (!response.ok) {
      throw new Error(`Proxy failed with status ${response.status}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    return blobUrl;
  }

  /**
   * Preload image to prevent flicker
   */
  async preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
  }

  /**
   * Check if cached URL is still valid
   */
  private isCacheValid(cached: MediaCache): boolean {
    const now = Date.now();
    const timeUntilExpiry = cached.expiresAt - now;
    
    // Refresh if within threshold of expiry
    if (timeUntilExpiry < REFRESH_THRESHOLD_MS) {
      return false;
    }
    
    return cached.expiresAt > now;
  }

  /**
   * Cache resolved URL
   */
  private cacheUrl(cacheKey: string, url: string, type: 'presigned' | 'blob'): void {
    const expiresAt = Date.now() + CACHE_DURATION_MS;
    mediaCache.set(cacheKey, { url, type, expiresAt });

    // Don't persist blob URLs (they're object URLs) or wasabi-proxy URLs
    if (type !== 'blob' && !url.includes('/wasabi-proxy')) {
      try {
        localStorage.setItem(`media:last:${cacheKey}`, JSON.stringify({
          url,
          timestamp: Date.now()
        }));
      } catch (e) {
        console.warn('Failed to persist media cache:', e);
      }
    }
  }

  /**
   * Get normalized cache key
   */
  private getCacheKey(key: string): string {
    // Normalize Wasabi keys (remove leading slash, etc.)
    return key.replace(/^\/+/, '').toLowerCase();
  }

  /**
   * Clear cache for specific key
   */
  clearCache(key: string): void {
    const cacheKey = this.getCacheKey(key);
    mediaCache.delete(cacheKey);
    lastGoodUrls.delete(cacheKey);
    try {
      localStorage.removeItem(`media:last:${cacheKey}`);
    } catch {}
  }

  /**
   * Clear all caches
   */
  clearAllCaches(): void {
    mediaCache.clear();
    lastGoodUrls.clear();
    inflightRequests.clear();
  }
}

export const mediaService = new MediaService();
