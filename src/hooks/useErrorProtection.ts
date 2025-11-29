/**
 * Error Protection Hook
 * Provides bulletproof error handling for components
 */

import { useCallback, useEffect, useState } from 'react';
import { errorRecoveryService } from '@/utils/errorBoundary/ErrorRecoveryService';

interface UseErrorProtectionOptions {
  onError?: (error: Error) => void;
  autoRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

export const useErrorProtection = (options: UseErrorProtectionOptions = {}) => {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const {
    onError,
    autoRetry = false,
    maxRetries = 3,
    retryDelay = 1000
  } = options;

  // Safe async operation wrapper
  const safeAsync = useCallback(
    async <T>(
      operation: () => Promise<T>,
      errorMessage = 'Operation failed'
    ): Promise<T | null> => {
      try {
        setIsError(false);
        setError(null);
        const result = await operation();
        setRetryCount(0); // Reset on success
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(errorMessage);
        
        console.error('🚨 Safe async operation failed:', error);
        
        setError(error);
        setIsError(true);
        
        // Send to recovery service
        errorRecoveryService.handleError(error);
        
        // Call custom error handler
        onError?.(error);
        
        // Auto retry if enabled
        if (autoRetry && retryCount < maxRetries) {
          setIsRetrying(true);
          setRetryCount(prev => prev + 1);
          
          setTimeout(async () => {
            setIsRetrying(false);
            return safeAsync(operation, errorMessage);
          }, retryDelay * (retryCount + 1));
        }
        
        return null;
      }
    },
    [onError, autoRetry, maxRetries, retryDelay, retryCount]
  );

  // Safe sync operation wrapper
  const safeSync = useCallback(
    <T>(operation: () => T, fallback: T, errorMessage = 'Operation failed'): T => {
      try {
        setIsError(false);
        setError(null);
        return operation();
      } catch (err) {
        const error = err instanceof Error ? err : new Error(errorMessage);
        
        console.error('🚨 Safe sync operation failed:', error);
        
        setError(error);
        setIsError(true);
        
        // Send to recovery service
        errorRecoveryService.handleError(error);
        
        // Call custom error handler
        onError?.(error);
        
        return fallback;
      }
    },
    [onError]
  );

  // Manual retry function
  const retry = useCallback(() => {
    setIsError(false);
    setError(null);
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setIsError(false);
    setError(null);
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  // Global error handler for window errors
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      const error = new Error(event.message);
      errorRecoveryService.handleError(error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = new Error(`Unhandled promise rejection: ${event.reason}`);
      errorRecoveryService.handleError(error);
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return {
    isError,
    error,
    retryCount,
    isRetrying,
    safeAsync,
    safeSync,
    retry,
    clearError
  };
};

// Database operation protection hook
export const useDatabaseProtection = () => {
  const { safeAsync, isError, error, retry } = useErrorProtection({
    autoRetry: true,
    maxRetries: 3,
    retryDelay: 1000
  });

  const safeDbOperation = useCallback(
    async <T>(
      operation: () => Promise<{ data: T | null; error: any }>,
      errorMessage = 'Database operation failed'
    ) => {
      return safeAsync(async () => {
        const result = await operation();
        
        if (result.error) {
          throw new Error(result.error.message || errorMessage);
        }
        
        return result.data;
      }, errorMessage);
    },
    [safeAsync]
  );

  return {
    safeDbOperation,
    isError,
    error,
    retry
  };
};