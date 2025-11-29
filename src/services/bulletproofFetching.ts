/**
 * Bulletproof Fetching Service - Ultimate Network Resilience
 * Handles all network operations with maximum stability and recovery
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FetchConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  timeout: number;
  enableCache: boolean;
  cacheDuration: number;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class BulletproofFetchingService {
  private cache = new Map<string, CacheItem<any>>();
  private ongoingRequests = new Map<string, Promise<any>>();
  private retryQueues = new Map<string, Array<() => Promise<any>>>();
  private networkStatus: 'online' | 'offline' | 'unstable' = 'online';
  private connectionQuality: 'excellent' | 'good' | 'poor' | 'critical' = 'excellent';

  private readonly config: FetchConfig = {
    maxRetries: 5,
    baseDelay: 1000,
    maxDelay: 16000,
    timeout: 30000,
    enableCache: true,
    cacheDuration: 5 * 60 * 1000 // 5 minutes
  };

  constructor() {
    this.initializeNetworkMonitoring();
    this.startHealthChecks();
    this.setupRetryProcessor();
  }

  private initializeNetworkMonitoring() {
    // Monitor online/offline status
    window.addEventListener('online', () => {
      this.networkStatus = 'online';
      this.processRetryQueues();
      toast.success('Connection restored', { duration: 2000 });
    });

    window.addEventListener('offline', () => {
      this.networkStatus = 'offline';
      toast.error('Connection lost - Working offline with cached data');
    });

    // Monitor connection quality
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const updateConnectionQuality = () => {
        const effectiveType = connection.effectiveType;
        switch (effectiveType) {
          case '4g':
            this.connectionQuality = 'excellent';
            break;
          case '3g':
            this.connectionQuality = 'good';
            break;
          case '2g':
            this.connectionQuality = 'poor';
            break;
          default:
            this.connectionQuality = 'critical';
        }
      };

      connection.addEventListener('change', updateConnectionQuality);
      updateConnectionQuality();
    }
  }

  private startHealthChecks() {
    // Regular health checks every 10 seconds
    setInterval(async () => {
      try {
        const start = Date.now();
        await supabase.from('app_settings').select('id').limit(1);
        const latency = Date.now() - start;

        if (latency < 500) {
          this.connectionQuality = 'excellent';
        } else if (latency < 2000) {
          this.connectionQuality = 'good';
        } else if (latency < 5000) {
          this.connectionQuality = 'poor';
        } else {
          this.connectionQuality = 'critical';
        }

        if (this.networkStatus === 'offline') {
          this.networkStatus = 'online';
          this.processRetryQueues();
        }
      } catch (error) {
        if (this.networkStatus === 'online') {
          this.networkStatus = 'unstable';
        }
      }
    }, 10000);
  }

  private setupRetryProcessor() {
    // Process retry queues every 5 seconds
    setInterval(() => {
      if (this.networkStatus === 'online') {
        this.processRetryQueues();
      }
    }, 5000);
  }

  private processRetryQueues() {
    for (const [key, queue] of this.retryQueues.entries()) {
      if (queue.length > 0) {
        const request = queue.shift();
        if (request) {
          request().catch(() => {
            // Re-queue if still failing
            if (queue.length < 10) {
              queue.push(request);
            }
          });
        }
      }
    }
  }

  private getCacheKey(operation: string, params: any): string {
    return `${operation}:${JSON.stringify(params)}`;
  }

  private getFromCache<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  private setCache<T>(key: string, data: T, customDuration?: number): void {
    const duration = customDuration || this.config.cacheDuration;
    const timestamp = Date.now();
    this.cache.set(key, {
      data,
      timestamp,
      expiresAt: timestamp + duration
    });
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string,
    cacheKey?: string
  ): Promise<T> {
    let lastError: any;
    let attempt = 0;

    while (attempt < this.config.maxRetries) {
      try {
        // Check if request is already ongoing
        if (cacheKey && this.ongoingRequests.has(cacheKey)) {
          return await this.ongoingRequests.get(cacheKey);
        }

        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Operation timeout')), this.config.timeout);
        });

        const operationPromise = operation();
        
        if (cacheKey) {
          this.ongoingRequests.set(cacheKey, operationPromise);
        }

        const result = await Promise.race([operationPromise, timeoutPromise]);
        
        // Cache successful result
        if (cacheKey) {
          this.setCache(cacheKey, result);
          this.ongoingRequests.delete(cacheKey);
        }

        if (attempt > 0) {
          toast.success(`${operationName} recovered`, { duration: 2000 });
        }

        return result;
      } catch (error: any) {
        lastError = error;
        attempt++;

        if (cacheKey) {
          this.ongoingRequests.delete(cacheKey);
        }

        if (attempt >= this.config.maxRetries) {
          // Add to retry queue for later
          if (cacheKey && this.networkStatus !== 'online') {
            if (!this.retryQueues.has(cacheKey)) {
              this.retryQueues.set(cacheKey, []);
            }
            this.retryQueues.get(cacheKey)!.push(() => this.executeWithRetry(operation, operationName, cacheKey));
          }
          break;
        }

        // Calculate delay with jitter
        const baseDelay = Math.min(
          this.config.baseDelay * Math.pow(2, attempt - 1),
          this.config.maxDelay
        );
        const jitter = Math.random() * 1000;
        const delay = baseDelay + jitter;

        console.warn(`${operationName} failed (attempt ${attempt}), retrying in ${delay}ms...`, error);
        
        if (attempt === 1) {
          toast.loading(`${operationName} retrying...`, { 
            id: `retry-${cacheKey || operationName}`,
            duration: delay + 2000 
          });
        }

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // Try to return cached data as fallback
    if (cacheKey) {
      const cachedData = this.getFromCache<T>(cacheKey);
      if (cachedData) {
        toast.warning(`Using cached data for ${operationName}`, { duration: 3000 });
        return cachedData;
      }
    }

    toast.error(`${operationName} failed after ${this.config.maxRetries} attempts`);
    throw lastError;
  }

  // Public API methods
  async fetchUserData(userId: string): Promise<any> {
    const cacheKey = this.getCacheKey('user', { userId });
    
    // Return cached data immediately if available and network is poor
    if (this.connectionQuality === 'poor' || this.networkStatus !== 'online') {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth_user_id', userId)
          .single();

        if (error) throw error;
        return data;
      },
      'User data fetch',
      cacheKey
    );
  }

  async fetchPosts(filters: any = {}): Promise<any[]> {
    const cacheKey = this.getCacheKey('posts', filters);
    
    return this.executeWithRetry(
      async () => {
        let query = supabase.from('posts').select('*');
        
        if (filters.userId) {
          query = query.eq('user_id', filters.userId);
        }
        
        if (filters.limit) {
          query = query.limit(filters.limit);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
      },
      'Posts fetch',
      cacheKey
    );
  }

  async uploadToS3(file: File): Promise<string> {
    return this.executeWithRetry(
      async () => {
        const formData = new FormData();
        formData.append('file', file);

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('No authentication session');

        const response = await fetch('/api/s3-upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        return result.url;
      },
      'S3 file upload'
    );
  }

  async executeQuery(table: string, operation: string, params: any = {}): Promise<any> {
    const cacheKey = this.getCacheKey(`${table}-${operation}`, params);
    
    return this.executeWithRetry(
      async () => {
        // Use any type to bypass strict table name checking
        const baseQuery = (supabase as any).from(table);
        let query = baseQuery;
        
        switch (operation) {
          case 'select':
            query = baseQuery.select(params.select || '*');
            if (params.eq) {
              Object.entries(params.eq).forEach(([key, value]) => {
                query = query.eq(key, value);
              });
            }
            if (params.limit) query = query.limit(params.limit);
            if (params.order) {
              query = query.order(params.order.column, { ascending: params.order.ascending });
            }
            break;
            
          case 'insert':
            query = baseQuery.insert(params.data);
            break;
            
          case 'update':
            query = baseQuery.update(params.data);
            if (params.eq) {
              Object.entries(params.eq).forEach(([key, value]) => {
                query = query.eq(key, value);
              });
            }
            break;
            
          case 'delete':
            query = baseQuery.delete();
            if (params.eq) {
              Object.entries(params.eq).forEach(([key, value]) => {
                query = query.eq(key, value);
              });
            }
            break;
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
      },
      `${table} ${operation}`,
      operation === 'select' ? cacheKey : undefined
    );
  }

  // Cache management
  clearCache(): void {
    this.cache.clear();
    this.ongoingRequests.clear();
    toast.success('Cache cleared');
  }

  getCacheStats(): any {
    return {
      cacheSize: this.cache.size,
      ongoingRequests: this.ongoingRequests.size,
      networkStatus: this.networkStatus,
      connectionQuality: this.connectionQuality,
      retryQueues: Array.from(this.retryQueues.entries()).map(([key, queue]) => ({
        key,
        queueSize: queue.length
      }))
    };
  }

  // Preload critical data
  async preloadCriticalData(userId?: string): Promise<void> {
    const operations: Promise<any>[] = [
      this.executeQuery('app_settings', 'select', { limit: 1 }),
    ];

    if (userId) {
      operations.push(this.fetchUserData(userId));
    }

    try {
      await Promise.allSettled(operations);
      toast.success('Critical data preloaded', { duration: 1000 });
    } catch (error) {
      console.warn('Preload completed with some failures:', error);
    }
  }
}

export const bulletproofFetching = new BulletproofFetchingService();

// Auto-preload on initialization
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => bulletproofFetching.preloadCriticalData(), 1000);
  });
}

console.log('🛡️ Bulletproof Fetching Service initialized - Maximum network resilience active!');