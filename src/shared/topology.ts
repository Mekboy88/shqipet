// Client helpers for Live Connection Topology system

export type AppKind = 'website' | 'admin' | 'ios' | 'android' | 'messenger';

const BASE = '/functions/v1';
const PROJECT_ID = 'rvwopaofedyieydwbghs';
const SUPABASE_URL = `https://${PROJECT_ID}.supabase.co`;

/**
 * Register an action for health monitoring
 * Call once per button/component mount
 */
export async function registerAction(id: string, meta: {
  app: AppKind;
  pageId: string;
  section?: string;
  title?: string;
}) {
  try {
    await fetch(`${SUPABASE_URL}${BASE}/topology-register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d29wYW9mZWR5aWV5ZHdiZ2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDYzNDMsImV4cCI6MjA2NDYyMjM0M30.WpJtBt49SJanUECQbIbnMmZWzTmZm5e9UhjiCylAlLc'
      },
      body: JSON.stringify({ id, ...meta })
    });
  } catch (error) {
    console.debug('Failed to register action:', error);
  }
}

/**
 * Track action execution for health monitoring
 * Wraps existing handlers to report success/failure + latency
 */
export function trackAction<T extends any[]>(
  id: string, 
  handler: (...args: T) => Promise<any> | any
) {
  return async (...args: T) => {
    const t0 = performance.now();
    try {
      const result = await handler(...args);
      const latency = Math.round(performance.now() - t0);
      
      // Report success
      fetch(`${SUPABASE_URL}${BASE}/topology-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d29wYW9mZWR5aWV5ZHdiZ2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDYzNDMsImV4cCI6MjA2NDYyMjM0M30.WpJtBt49SJanUECQbIbnMmZWzTmZm5e9UhjiCylAlLc'
        },
        body: JSON.stringify({ id, ok: true, latency })
      }).catch(() => {});
      
      return result;
    } catch (e: any) {
      const latency = Math.round(performance.now() - t0);
      
      // Report failure
      fetch(`${SUPABASE_URL}${BASE}/topology-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d29wYW9mZWR5aWV5ZHdiZ2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDYzNDMsImV4cCI6MjA2NDYyMjM0M30.WpJtBt49SJanUECQbIbnMmZWzTmZm5e9UhjiCylAlLc'
        },
        body: JSON.stringify({ 
          id, 
          ok: false, 
          latency, 
          error: String(e?.message || e) 
        })
      }).catch(() => {});
      
      throw e;
    }
  };
}