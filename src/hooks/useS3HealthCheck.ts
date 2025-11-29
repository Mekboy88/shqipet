import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HealthResult {
  ts: string;
  website: { online: boolean; latency_ms: number; };
  supabase: { online: boolean; latency_ms: number; };
  s3: {
    online: boolean;
    latency_ms: number;
    region_match: boolean;
    permissions: { put: boolean; get: boolean; head: boolean; list: boolean; };
    bucket: string;
    region: string;
  };
  storage: {
    photos: { objects: number; bytes: number; live: boolean; };
    videos: { objects: number; bytes: number; live: boolean; };
    audio: { objects: number; bytes: number; live: boolean; };
    documents: { objects: number; bytes: number; live: boolean; };
  };
  signed_url_test: { ok: boolean; latency_ms: number; };
  issues: string[];
}

interface UseS3HealthCheckReturn {
  healthData: HealthResult | null;
  isLoading: boolean;
  error: string | null;
  runHealthCheck: () => Promise<void>;
  autoTestEnabled: boolean;
  setAutoTestEnabled: (enabled: boolean) => void;
}

export const useS3HealthCheck = (): UseS3HealthCheckReturn => {
  const [healthData, setHealthData] = useState<HealthResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoTestEnabled, setAutoTestEnabled] = useState(true);

  const runHealthCheck = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🏥 Starting Wasabi health check...');
      
      // Use the new wasabi-health function
      const { data, error: functionError } = await supabase.functions.invoke('wasabi-health');
      
      if (functionError) {
        throw new Error(`Health check failed: ${functionError.message}`);
      }
      
      if (!data) {
        throw new Error('Health check failed - no data returned');
      }
      
      console.log('✅ Health check completed:', data);
      setHealthData(data as any);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Health check failed:', errorMessage);

      // No fallback - only show real data to prevent misleading information
      setError(errorMessage);
      setHealthData(null); // Clear any previous data to show real state
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-test functionality
  useEffect(() => {
    if (!autoTestEnabled) return;
    
    // Run initial check
    runHealthCheck();
    
    // Set up interval for auto-testing every 2 minutes
    const interval = setInterval(runHealthCheck, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [autoTestEnabled, runHealthCheck]);

  // Initial health check on mount
  useEffect(() => {
    runHealthCheck();
  }, [runHealthCheck]);

  return {
    healthData,
    isLoading,
    error,
    runHealthCheck,
    autoTestEnabled,
    setAutoTestEnabled,
  };
};