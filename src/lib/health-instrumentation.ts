import { supabase } from "@/integrations/supabase/client";

interface ActionMetadata {
  page?: string;
  app?: string;
  section?: string;
  [key: string]: any;
}

interface ActionResult {
  id: string;
  ok: boolean;
  latency_ms: number;
  err?: string;
}

// Register an action/button for health monitoring
export async function registerAction(id: string, meta: ActionMetadata = {}) {
  try {
    // Call the health registration endpoint
    const { error } = await supabase.functions.invoke('register-health-action', {
      body: { 
        id, 
        meta: {
          ...meta,
          page: meta.page || window.location.pathname,
          app: 'admin', // Default to admin for now
          registered_at: new Date().toISOString()
        }
      }
    });
    
    if (error) {
      console.warn('Failed to register health action:', error);
    }
  } catch (error) {
    console.warn('Health action registration failed:', error);
  }
}

// Track an action execution with latency and success metrics
export async function trackAction<T>(id: string, fn: () => Promise<T>): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await fn();
    const latency = Math.round(performance.now() - startTime);
    
    // Fire and forget - don't block the UI
    recordActionResult({
      id,
      ok: true,
      latency_ms: latency
    });
    
    return result;
  } catch (error: any) {
    const latency = Math.round(performance.now() - startTime);
    
    // Record the failure
    recordActionResult({
      id,
      ok: false,
      latency_ms: latency,
      err: error?.code || error?.message || 'unknown error'
    });
    
    throw error;
  }
}

// Internal function to record action results
async function recordActionResult(result: ActionResult) {
  try {
    await supabase.functions.invoke('track-health-action', {
      body: result
    });
  } catch (error) {
    // Silent fail - don't break the app for health tracking
    console.debug('Health tracking failed:', error);
  }
}

// Get the health status for a specific node or page
export async function getHealthStatus(nodeId?: string) {
  try {
    const { data, error } = await supabase.functions.invoke('get-health-status', {
      body: { node_id: nodeId }
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get health status:', error);
    return null;
  }
}

// Trigger a manual health check
export async function triggerHealthCheck(nodeId: string, checkType?: string) {
  try {
    const { data, error } = await supabase.functions.invoke('trigger-health-check', {
      body: { 
        node_id: nodeId,
        check_type: checkType,
        manual: true
      }
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to trigger health check:', error);
    throw error;
  }
}

// Subscribe to real-time health updates for a node
export function subscribeToHealthUpdates(nodeId: string, callback: (update: any) => void) {
  const channel = supabase
    .channel(`health:${nodeId}`)
    .on('broadcast', { event: 'health_update' }, callback)
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
}

// Auto-discovery utility to register page-level health nodes
export async function registerPageHealth(pagePath: string, metadata: Record<string, any> = {}) {
  try {
    const { error } = await supabase.functions.invoke('register-page-health', {
      body: {
        page_path: pagePath,
        meta: {
          ...metadata,
          auto_discovered: true,
          last_visited: new Date().toISOString()
        }
      }
    });
    
    if (error) {
      console.warn('Failed to register page health:', error);
    }
  } catch (error) {
    console.warn('Page health registration failed:', error);
  }
}