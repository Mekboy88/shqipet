import { useEffect, useRef, useState, useCallback } from "react";

interface UseRobustVideoLoaderResult {
  loading: boolean;
  error: boolean;
  ready: boolean;
  markReady: () => void;
  markError: () => void;
  retry: () => void;
}

interface UseRobustVideoLoaderOptions {
  videoUrl?: string;
  posterUrl?: string;
  timeout?: number;
  maxRetries?: number;
}

export function useRobustVideoLoader({
  videoUrl,
  posterUrl,
  timeout = 15000,
  maxRetries = 2
}: UseRobustVideoLoaderOptions): UseRobustVideoLoaderResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const timeoutRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Pre-load poster image with retries
  const loadPoster = useCallback(async (url: string, attempt: number = 0) => {
    if (!url || ready) return;

    try {
      // Abort any ongoing poster load
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      const img = new Image();
      img.referrerPolicy = "no-referrer";
      img.decoding = "async";
      img.loading = "eager";
      
      const imagePromise = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Image load failed'));
        
        // Add abort signal support
        abortControllerRef.current?.signal.addEventListener('abort', () => {
          reject(new Error('Aborted'));
        });
      });

      // Add cache-buster on retry
      const posterSrc = attempt === 0 ? url : `${url}${url.includes('?') ? '&' : '?'}r=${Date.now()}&retry=${attempt}`;
      img.src = posterSrc;
      
      await imagePromise;
      
      // Mark as ready if we successfully loaded the poster
      if (!ready && !abortControllerRef.current?.signal.aborted) {
        setLoading(false);
        setReady(true);
      }
    } catch (err) {
      if (attempt < maxRetries && !abortControllerRef.current?.signal.aborted) {
        // Silent retry with exponential backoff
        setTimeout(() => {
          loadPoster(url, attempt + 1);
        }, Math.pow(2, attempt) * 1000);
      }
      // Don't set error for poster failures - video might still work
    }
  }, [ready, maxRetries]);

  // Setup poster loading
  useEffect(() => {
    if (posterUrl && !ready && !error) {
      loadPoster(posterUrl);
    }
  }, [posterUrl, ready, error, loadPoster]);

  // Setup timeout
  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      if (loading && !ready) {
        setLoading(false);
        setError(true);
      }
    }, timeout);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [loading, ready, timeout]);

  const markReady = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setLoading(false);
    setReady(true);
    setError(false);
  }, []);

  const markError = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      // Don't mark as error yet, let retry logic handle it
    } else {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setLoading(false);
      setError(true);
    }
  }, [retryCount, maxRetries]);

  const retry = useCallback(() => {
    setLoading(true);
    setError(false);
    setReady(false);
    setRetryCount(0);
    
    if (posterUrl) {
      loadPoster(posterUrl, 0);
    }
  }, [posterUrl, loadPoster]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    loading,
    error,
    ready,
    markReady,
    markError,
    retry,
  };
}