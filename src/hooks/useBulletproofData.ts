/**
 * Bulletproof Data Hook - React Hook for Ultra-Stable Data Fetching
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { bulletproofFetching } from '@/services/bulletproofFetching';

interface UseBulletproofDataOptions {
  enabled?: boolean;
  refetchInterval?: number;
  cacheTime?: number;
  staleTime?: number;
  retry?: boolean;
  retryDelay?: number;
}

interface UseBulletproofDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isStale: boolean;
  lastUpdated: Date | null;
}

export function useBulletproofData<T = any>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseBulletproofDataOptions = {}
): UseBulletproofDataReturn<T> {
  const {
    enabled = true,
    refetchInterval = 0,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    staleTime = 30 * 1000, // 30 seconds
    retry = true,
    retryDelay = 1000
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const mountedRef = useRef(true);

  const isStale = lastUpdated 
    ? Date.now() - lastUpdated.getTime() > staleTime 
    : true;

  const fetchData = useCallback(async (showLoading = true) => {
    if (!enabled || !mountedRef.current) return;

    if (showLoading) setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      
      if (mountedRef.current) {
        setData(result);
        setLastUpdated(new Date());
        setError(null);
      }
    } catch (err: any) {
      console.error(`Data fetch failed for ${key}:`, err);
      
      if (mountedRef.current) {
        setError(err.message || 'Fetch failed');
        
        // Retry logic
        if (retry && retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }
        
        if (retry) {
          retryTimeoutRef.current = setTimeout(() => {
            fetchData(false);
          }, retryDelay);
        }
      }
    } finally {
      if (mountedRef.current && showLoading) {
        setLoading(false);
      }
    }
  }, [key, fetcher, enabled, retry, retryDelay]);

  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchData(true);
    }
  }, [enabled, fetchData]);

  // Refetch interval
  useEffect(() => {
    if (refetchInterval > 0 && enabled) {
      intervalRef.current = setInterval(() => {
        fetchData(false);
      }, refetchInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [refetchInterval, enabled, fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    isStale,
    lastUpdated
  };
}

// Specialized hooks for common data types
export function useBulletproofUser(userId: string | undefined) {
  return useBulletproofData(
    `user-${userId}`,
    () => userId ? bulletproofFetching.fetchUserData(userId) : Promise.resolve(null),
    {
      enabled: !!userId,
      refetchInterval: 60000, // 1 minute
      staleTime: 30000 // 30 seconds
    }
  );
}

export function useBulletproofPosts(filters: any = {}) {
  return useBulletproofData(
    `posts-${JSON.stringify(filters)}`,
    () => bulletproofFetching.fetchPosts(filters),
    {
      refetchInterval: 30000, // 30 seconds
      staleTime: 15000 // 15 seconds
    }
  );
}

export function useBulletproofQuery(table: string, operation: string, params: any = {}) {
  return useBulletproofData(
    `${table}-${operation}-${JSON.stringify(params)}`,
    () => bulletproofFetching.executeQuery(table, operation, params),
    {
      enabled: !!table && !!operation,
      refetchInterval: operation === 'select' ? 60000 : 0, // Only auto-refetch selects
      staleTime: 30000
    }
  );
}