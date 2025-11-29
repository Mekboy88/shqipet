// DO NOT EDIT: Admin query wrapper with v5-safe callbacks + auto-refresh.

import * as React from "react";
import {
  useQuery,
  UseQueryOptions,
  QueryKey,
  QueryClient,
  UseQueryResult,
} from "@tanstack/react-query";

type AdminQueryOptions<TData, TError = Error> =
  Omit<UseQueryOptions<TData, TError, TData, QueryKey>, "queryKey" | "queryFn"> & {
    /** Optional client-side callbacks (v5: not passed to useQuery options) */
    onSuccess?: (data: TData) => void;
    onError?: (err: TError) => void;
    /** Enable background auto refresh (ms) when tab is visible; false to disable */
    autoRefreshMs?: number | false;
  };

type Params<TData, TError> = {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
  options?: AdminQueryOptions<TData, TError>;
};

export function useAdminQuery<TData, TError = Error>(
  params: Params<TData, TError>
): UseQueryResult<TData, TError> {
  const { queryKey, queryFn, options } = params;
  const {
    onSuccess,
    onError,
    autoRefreshMs = 30000, // default ON (30s) for Admin; set to false to disable
    ...rqOptions
  } = options ?? {};

  // v5-compliant useQuery call (no onSuccess/onError in options)
  const result = useQuery<TData, TError>({
    queryKey,
    queryFn,
    // sensible admin defaults; can be overridden by rqOptions
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0,
    ...rqOptions,
  });

  // Callbacks are handled via effects to keep types happy in v5
  const lastSuccessRef = React.useRef<unknown>(undefined);
  React.useEffect(() => {
    if (result.isSuccess && onSuccess && result.data !== lastSuccessRef.current) {
      lastSuccessRef.current = result.data as unknown;
      onSuccess(result.data as TData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.isSuccess, result.data, onSuccess]);

  React.useEffect(() => {
    if (result.isError && onError) onError(result.error as TError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.isError, result.error, onError]);

  // Optional auto-refresh (only when page is visible)
  React.useEffect(() => {
    if (!autoRefreshMs || autoRefreshMs <= 0) return;
    let id: number | undefined;
    const tick = () => {
      if (document.visibilityState === "visible") {
        result.refetch().catch(() => void 0);
      }
      id = window.setTimeout(tick, autoRefreshMs);
    };
    id = window.setTimeout(tick, autoRefreshMs);
    return () => { if (id) clearTimeout(id); };
  }, [autoRefreshMs, result.refetch]);

  return result;
}

// Additional utility exports
export function useAutoRefresh(enabled: boolean = true) {
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = React.useState(() => {
    try {
      const stored = localStorage.getItem('admin.autoRefresh');
      return stored ? JSON.parse(stored) : enabled;
    } catch {
      return enabled;
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('admin.autoRefresh', JSON.stringify(isAutoRefreshEnabled));
    } catch (error) {
      console.warn('[Admin] Failed to persist auto-refresh setting:', error);
    }
  }, [isAutoRefreshEnabled]);

  return {
    isAutoRefreshEnabled,
    setIsAutoRefreshEnabled
  };
}

interface DataLoadingBannerProps {
  isLoading: boolean;
  error: any;
  hasData: boolean;
}

export function DataLoadingBanner({ isLoading, error, hasData }: DataLoadingBannerProps) {
  if (error && hasData) {
    return React.createElement('div', { className: "bg-amber-50 border border-amber-200 rounded-md p-3 mb-4" },
      React.createElement('div', { className: "flex items-center gap-2 text-amber-800" },
        React.createElement('div', { className: "animate-spin rounded-full h-3 w-3 border-b-2 border-amber-600" }),
        React.createElement('span', { className: "text-sm" }, "Temporary issue loading data. Retrying...")
      )
    );
  }

  if (isLoading && !hasData) {
    return React.createElement('div', { className: "bg-blue-50 border border-blue-200 rounded-md p-3 mb-4" },
      React.createElement('div', { className: "flex items-center gap-2 text-blue-800" },
        React.createElement('div', { className: "animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600" }),
        React.createElement('span', { className: "text-sm" }, "Loading data...")
      )
    );
  }

  return null;
}
