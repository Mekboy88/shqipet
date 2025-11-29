// DO NOT EDIT: Critical Admin pagination & auto-recovery. Changing this can reintroduce 'pageSize is not defined' crashes.

/**
 * Pagination utility with guardrails and defaults
 * Prevents undefined pageSize errors in Admin panels
 */

export type Pagination = {
  page: number;
  pageSize: number;
};

// Safe defaults hierarchy
const DEFAULT_PAGE_SIZE = 25;
const MIN_PAGE_SIZE = 1;
const MAX_PAGE_SIZE = 100;

/**
 * Get page size with safe fallback chain:
 * 1. Local state
 * 2. URL query parameter
 * 3. Persisted storage
 * 4. Environment default
 * 5. Hard default (25)
 */
export function getPageSize(localPageSize?: number): number {
  // Try local state first
  if (Number.isFinite(localPageSize) && localPageSize! >= MIN_PAGE_SIZE) {
    return Math.min(localPageSize!, MAX_PAGE_SIZE);
  }

  // Try URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const urlPageSize = urlParams.get('pageSize');
  if (urlPageSize) {
    const parsed = Number(urlPageSize);
    if (Number.isFinite(parsed) && parsed >= MIN_PAGE_SIZE) {
      return Math.min(parsed, MAX_PAGE_SIZE);
    }
  }

  // Try persisted storage
  try {
    const stored = localStorage.getItem('admin.pageSize');
    if (stored) {
      const parsed = Number(stored);
      if (Number.isFinite(parsed) && parsed >= MIN_PAGE_SIZE) {
        return Math.min(parsed, MAX_PAGE_SIZE);
      }
    }
  } catch (error) {
    console.warn('[Admin] Failed to read pageSize from storage:', error);
  }

  // Try environment default
  try {
    const envDefault = import.meta.env?.VITE_ADMIN_DEFAULT_PAGE_SIZE;
    if (envDefault) {
      const parsed = Number(envDefault);
      if (Number.isFinite(parsed) && parsed >= MIN_PAGE_SIZE) {
        return Math.min(parsed, MAX_PAGE_SIZE);
      }
    }
  } catch (error) {
    console.warn('[Admin] Failed to read env default pageSize:', error);
  }

  // Hard default
  console.warn('[Admin] pageSize undefined → default(25)');
  return DEFAULT_PAGE_SIZE;
}

/**
 * Runtime type guard for pagination parameters
 */
export function assertPagination(p: Partial<Pagination>): asserts p is Pagination {
  if (!Number.isFinite(p?.page) || p!.page! < 1) {
    throw new Error(`Invalid page: ${p?.page}`);
  }
  if (!Number.isFinite(p?.pageSize) || p!.pageSize! < 1) {
    throw new Error(`Invalid pageSize: ${p?.pageSize}`);
  }
}

/**
 * Safe pagination params with coercion
 */
export function sanitizePagination(params: Partial<Pagination>): Pagination {
  const page = Number.isFinite(params?.page) && params!.page! >= 1 ? params!.page! : 1;
  const pageSize = getPageSize(params?.pageSize);
  
  return { page, pageSize };
}

/**
 * Update URL with pagination params (no history entry)
 */
export function syncPaginationToUrl(pagination: Pagination): void {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('page', String(pagination.page));
    url.searchParams.set('pageSize', String(pagination.pageSize));
    window.history.replaceState({}, '', url.toString());
  } catch (error) {
    console.warn('[Admin] Failed to sync pagination to URL:', error);
  }
}

/**
 * Persist pagination settings to storage
 */
export function persistPagination(pagination: Pagination): void {
  try {
    localStorage.setItem('admin.pageSize', String(pagination.pageSize));
    localStorage.setItem('admin.page', String(pagination.page));
  } catch (error) {
    console.warn('[Admin] Failed to persist pagination:', error);
  }
}

/**
 * Safe initialization hook for admin pagination
 */
export function useAdminPagination() {
  const getInitialPageSize = (): number => {
    try {
      const stored = localStorage.getItem('admin.pageSize');
      const urlParams = new URLSearchParams(window.location.search);
      const urlPageSize = urlParams.get('pageSize');
      
      return Number(stored) || Number(urlPageSize) || Number(import.meta.env?.VITE_ADMIN_DEFAULT_PAGE_SIZE) || DEFAULT_PAGE_SIZE;
    } catch {
      return DEFAULT_PAGE_SIZE;
    }
  };

  const getInitialPage = (): number => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlPage = urlParams.get('page');
      return Number(urlPage) || 1;
    } catch {
      return 1;
    }
  };

  return {
    initialPageSize: getInitialPageSize(),
    initialPage: getInitialPage()
  };
}

/**
 * Calculate safe pagination offset
 */
export function getPaginationOffset(page: number, pageSize: number): number {
  const safePage = Math.max(1, Number.isFinite(page) ? page : 1);
  const safePageSize = getPageSize(pageSize);
  return (safePage - 1) * safePageSize;
}

/**
 * Error tracking for pagination failures
 */
let errorCount = 0;
const MAX_ERROR_LOGS = 3;

export function logPaginationError(error: any, context: string): void {
  errorCount++;
  
  if (errorCount <= MAX_ERROR_LOGS) {
    console.error(`[Admin] ${context} error (${errorCount}/${MAX_ERROR_LOGS}):`, error);
    
    if (errorCount === MAX_ERROR_LOGS) {
      console.error('[Admin] data fetch failing; retaining cached data');
    }
  }
}

/**
 * Reset error count (call on successful operations)
 */
export function resetPaginationErrors(): void {
  errorCount = 0;
}