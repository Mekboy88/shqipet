// DO NOT EDIT — Enhanced query provider with auto-recovery capabilities.
// Removing this re-introduces full-screen refresh prompts.

import React, { ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { toast } from 'sonner';

// Global query client with recovery-friendly defaults
const createRecoveryQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 8000),
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        staleTime: 0,
        // Remove the onError/onSuccess from defaultOptions as they don't exist in v5
      },
      mutations: {
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 4000),
      }
    }
  });
};

let globalQueryClient: QueryClient | null = null;

export function getGlobalQueryClient() {
  if (!globalQueryClient) {
    globalQueryClient = createRecoveryQueryClient();
  }
  return globalQueryClient;
}

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = getGlobalQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <QueryRecoveryManager />
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

/**
 * Internal component to handle query recovery events
 */
function QueryRecoveryManager() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Global error handler for queries
    const handleQueryError = (error: any, query: any) => {
      console.warn('[QueryRecovery] Query error:', {
        queryKey: query?.queryKey,
        error: error?.message || error
      });

      // Don't show toast for auth errors (user likely not logged in)
      if (error?.status === 401 || error?.status === 403) {
        return;
      }

      // Show non-blocking error toast
      toast.error('Pati një problem me ngarkimin e të dhënave', {
        description: 'Po përpiqemi të rikonektohemi automatikisht...',
        duration: 3000,
        id: `query-error-${query?.queryKey?.join('-') || 'unknown'}`
      });
    };

    // Global success handler for queries
    const handleQuerySuccess = (data: any, query: any) => {
      // Dismiss any error toasts for this query
      const queryKey = query?.queryKey?.join('-') || 'unknown';
      toast.dismiss(`query-error-${queryKey}`);
      
      console.log('[QueryRecovery] Query success:', {
        queryKey: query?.queryKey,
        dataLength: Array.isArray(data) ? data.length : typeof data
      });
    };

    // Listen for global recovery events
    const handleGlobalRecovery = () => {
      console.log('[QueryRecovery] Global recovery triggered - invalidating all queries');
      queryClient.invalidateQueries();
    };

    const handleSoftRefetch = () => {
      console.log('[QueryRecovery] Soft refetch triggered - refetching active queries');
      queryClient.refetchQueries({ 
        type: 'active',
        stale: true 
      });
    };

    const handleSupabaseSoftRefetch = () => {
      console.log('[QueryRecovery] Supabase soft refetch - refetching Supabase queries');
      queryClient.refetchQueries({
        predicate: (query) => {
          return query.queryKey.some(key => 
            typeof key === 'string' && (
              key.includes('supabase') || 
              key.includes('admin') || 
              key.includes('user-overview')
            )
          );
        }
      });
    };

    const handleChunkLoadError = () => {
      console.log('[QueryRecovery] Chunk load error - invalidating queries and showing recovery message');
      toast.error('Po rinovohemi pas një problemi teknik...', {
        duration: 3000,
        id: 'chunk-recovery'
      });
      
      // Invalidate queries to trigger fresh requests
      queryClient.invalidateQueries();
    };

    // Set up event listeners
    window.addEventListener('global-recovery-reset', handleGlobalRecovery);
    window.addEventListener('manual-recovery-retry', handleGlobalRecovery);
    window.addEventListener('supabase-soft-refetch', handleSupabaseSoftRefetch);
    window.addEventListener('admin-error-recovery', handleSoftRefetch);
    window.addEventListener('chunk-load-error', handleChunkLoadError);
    window.addEventListener('retry-lazy-imports', handleChunkLoadError);

    // Cleanup
    return () => {
      window.removeEventListener('global-recovery-reset', handleGlobalRecovery);
      window.removeEventListener('manual-recovery-retry', handleGlobalRecovery);
      window.removeEventListener('supabase-soft-refetch', handleSupabaseSoftRefetch);
      window.removeEventListener('admin-error-recovery', handleSoftRefetch);
      window.removeEventListener('chunk-load-error', handleChunkLoadError);
      window.removeEventListener('retry-lazy-imports', handleChunkLoadError);
    };
  }, [queryClient]);

  return null;
}

/**
 * Hook for components to trigger soft refetch of their queries
 */
export function useSoftRefetch() {
  const queryClient = useQueryClient();

  return React.useCallback((queryKeyPrefix?: string) => {
    if (queryKeyPrefix) {
      queryClient.refetchQueries({
        predicate: (query) => {
          return query.queryKey.some(key => 
            typeof key === 'string' && key.includes(queryKeyPrefix)
          );
        }
      });
    } else {
      queryClient.refetchQueries({ type: 'active' });
    }
  }, [queryClient]);
}

/**
 * Hook to get query client for manual operations
 */
export function useQueryRecovery() {
  const queryClient = useQueryClient();

  const invalidateAll = React.useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  const refetchActive = React.useCallback(() => {
    queryClient.refetchQueries({ type: 'active' });
  }, [queryClient]);

  const clearErrors = React.useCallback((queryKeyPrefix?: string) => {
    if (queryKeyPrefix) {
      queryClient.resetQueries({
        predicate: (query) => {
          return query.state.error && query.queryKey.some(key => 
            typeof key === 'string' && key.includes(queryKeyPrefix)
          );
        }
      });
    } else {
      queryClient.resetQueries({
        predicate: (query) => !!query.state.error
      });
    }
  }, [queryClient]);

  return {
    invalidateAll,
    refetchActive,
    clearErrors,
    queryClient
  };
}