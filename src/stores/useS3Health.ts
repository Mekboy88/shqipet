import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type NodeHealth = { online: boolean; latency_ms: number };
export type S3Permissions = { put: boolean; get: boolean; head: boolean; list: boolean };

export type S3Health = {
  ts: string;
  website: NodeHealth;
  supabase: NodeHealth;
  s3: NodeHealth & { 
    permissions: S3Permissions; 
    bucket: string; 
    region: string;
    region_match: boolean;
  };
  storage: Record<"photos"|"videos"|"audio"|"documents", {
    objects: number; 
    bytes: number; 
    live: boolean;
  }>;
  signed_url_test: { ok: boolean; latency_ms: number };
  issues: string[];
};

// React hook with proper safeguards
export const useS3Health = () => {
  const [data, setData] = useState<S3Health | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoEnabled, setAutoEnabled] = useState(true);
  
  // Use ref to prevent multiple simultaneous calls
  const fetchingRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNow = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (fetchingRef.current) {
      console.log('⚠️ Fetch already in progress, skipping...');
      return;
    }

    console.log('🏥 Starting S3 health check...');
    fetchingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const { data: result, error: functionError } = await supabase.functions.invoke('wasabi-health');
      
      if (functionError) {
        throw new Error(`Function error: ${functionError.message}`);
      }
      
      if (!result) {
        throw new Error('No data returned from health check');
      }
      
      console.log('✅ Health check completed successfully');
      setData(result);
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Health check failed:', message);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []); // Empty dependency array since this function doesn't depend on any state

  const enableAuto = useCallback((enabled: boolean) => {
    console.log('🔄 Auto-test toggled:', enabled);
    
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setAutoEnabled(enabled);

    if (enabled) {
      console.log('🎬 Starting auto-polling (2min intervals) for 24h');
      // Start 2-minute auto-polling
      intervalRef.current = setInterval(() => {
        console.log('⏰ Auto-polling trigger');
        fetchNow().catch(console.error);
      }, 2 * 60 * 1000); // 2 minutes
      
      // Auto-disable after 24 hours
      setTimeout(() => {
        console.log('🕐 24h Auto-polling period ended');
        enableAuto(false);
      }, 24 * 60 * 60 * 1000); // 24 hours
    } else {
      console.log('🛑 Auto-polling disabled');
    }
  }, [fetchNow]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Auto-fetch on mount and start 24h monitoring
  useEffect(() => {
    console.log('🚀 Starting initial fetch and 24h auto-monitoring');
    fetchNow().catch(console.error);
    enableAuto(true);
  }, [fetchNow, enableAuto]);

  return {
    data,
    loading,
    error,
    autoEnabled,
    fetchNow,
    enableAuto,
  };
};

// Simple auto-polling hook - no longer needed but keeping for compatibility
export const useS3HealthAutoPolling = () => {
  // Empty - auto-polling is now handled in useS3Health hook
};