import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Globe, Database, Cloud, AlertTriangle, CheckCircle2, XCircle, RefreshCcw, Zap, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFetchGuardian, FetchHealthStatus } from '@/hooks/useFetchGuardian';
import { useS3FileUpload } from '@/hooks/useS3FileUpload';
import { useIntegrationHealth } from '@/hooks/useIntegrationHealth';
import { Badge } from '@/components/ui/badge';
import supabase from '@/lib/relaxedSupabase';

interface HealthSnapshot {
  website: {
    online: boolean;
    lastChange: number;
  };
  supabase: {
    status: FetchHealthStatus;
  };
  s3: {
    healthy: boolean | null;
    lastTestAt: number | null;
  };
}

interface ErrorItem {
  source: 'website' | 'supabase' | 's3';
  message: string;
  at: number;
}

const statusToBool = (s: FetchHealthStatus) => s === 'healthy';

export const LiveIntegrationTopology: React.FC<{ className?: string }> = ({ className }) => {
  // Health states
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isChecking, setIsChecking] = useState(false);
  const [errors, setErrors] = useState<ErrorItem[]>([]);
  const [showIssues, setShowIssues] = useState(false);

  // Real-time integration health
  const { health, updateHealthStatus, refetch, getOverallHealth, getHealthyServicesCount, getTotalServicesCount } = useIntegrationHealth();

  // Supabase health
  const { status: supabaseStatus } = useFetchGuardian({ notify: false, checkIntervalMs: 15000 });

  // S3 health
  const { testConnection } = useS3FileUpload();
  const [isS3Healthy, setIsS3Healthy] = useState<boolean | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Website ping (HEAD request) to compute real response time and status
  const pingWebsite = useCallback(async (checkType: 'manual' | 'automatic') => {
    const t0 = performance.now();
    try {
      const resp = await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-store' });
      const ms = Math.round(performance.now() - t0);
      await updateHealthStatus('website', resp.ok ? 'healthy' : 'unhealthy',
        resp.ok ? ms : null,
        resp.ok ? null : `HTTP ${resp.status}`,
        { check_type: checkType, status: resp.status, path: '/favicon.ico' }
      );
      return resp.ok;
    } catch (e: any) {
      const ms = Math.round(performance.now() - t0);
      await updateHealthStatus('website', 'unhealthy', null, e?.message || 'Ping failed', { check_type: checkType, path: '/favicon.ico', ms });
      return false;
    }
  }, [updateHealthStatus]);

  // Manual re-check function
  const runHealthChecks = async () => {
    setIsChecking(true);
    try {
      const startTime = Date.now();
      
      // Ping website via HEAD request
      await pingWebsite('manual');

      // Test Supabase health
      const supabaseHealthy = statusToBool(supabaseStatus);
      await updateHealthStatus('supabase', supabaseHealthy ? 'healthy' : 'unhealthy',
        supabaseHealthy ? Date.now() - startTime : undefined,
        supabaseHealthy ? undefined : 'Supabase connection issues',
        { supabase_status: supabaseStatus, check_type: 'manual' }
      );

      // Test S3 health using edge function for real-time data
      try {
        console.log('🔄 Testing S3 with edge function for real-time data...')
        const { data: sessionData } = await supabase.auth.getSession()
        const token = sessionData?.session?.access_token

        const response = await fetch('https://rvwopaofedyieydwbghs.supabase.co/functions/v1/test-s3-connection', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d29wYW9mZWR5aWV5ZHdiZ2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDYzNDMsImV4cCI6MjA2NDYyMjM0M30.WpJtBt49SJanUECQbIbnMmZWzTmZm5e9UhjiCylAlLc',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            timestamp: Date.now(),
            requestId: crypto.randomUUID(),
            source: 'LiveIntegrationTopology'
          })
        })

        if (response.ok) {
          const s3Result = await response.json()
          const s3Success = s3Result.success
          setIsS3Healthy(s3Success)
          
          await updateHealthStatus('s3', s3Success ? 'healthy' : 'unhealthy',
            s3Result.responseTime || (Date.now() - startTime),
            s3Success ? undefined : (s3Result.error || 'S3 connection test failed'),
            { 
              s3_connection_result: s3Result, 
              check_type: 'manual',
              bucket_name: s3Result.bucketName,
              region: s3Result.region
            }
          )
        } else {
          throw new Error(`Edge function returned ${response.status}`)
        }
      } catch (s3Error: any) {
        setIsS3Healthy(false)
        const errorMessage = s3Error.message || 'S3 test failed'
        setErrors((prev) => [{ source: 's3' as const, message: errorMessage, at: Date.now() }, ...prev].slice(0, 25))
        await updateHealthStatus('s3', 'unhealthy', undefined, errorMessage, { error: errorMessage, check_type: 'manual' })
      }
    } catch (error) {
      setIsS3Healthy(false);
      const errorMessage = error instanceof Error ? error.message : 'S3 test errored';
      setErrors((prev) => [{ source: 's3' as const, message: errorMessage, at: Date.now() }, ...prev].slice(0, 25));
      await updateHealthStatus('s3', 'unhealthy', undefined, errorMessage, { error: errorMessage, check_type: 'manual' });
    } finally {
      setIsChecking(false);
    }
  };

  // Periodic health checks
  useEffect(() => {
    let mounted = true;
    
    const runChecks = async () => {
      if (!mounted) return;
      try {
        const startTime = Date.now();
        
        // Check S3 health using edge function for real-time updates
        try {
          const { data: sessionData } = await supabase.auth.getSession()
          const token = sessionData?.session?.access_token

          const response = await fetch('https://rvwopaofedyieydwbghs.supabase.co/functions/v1/test-s3-connection', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d29wYW9mZWR5aWV5ZHdiZ2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDYzNDMsImV4cCI6MjA2NDYyMjM0M30.WpJtBt49SJanUECQbIbnMmZWzTmZm5e9UhjiCylAlLc',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              timestamp: Date.now(),
              requestId: crypto.randomUUID(),
              source: 'AutomaticHealthCheck'
            })
          })

          if (response.ok) {
            const s3Result = await response.json()
            const s3Success = s3Result.success
            if (mounted) {
              setIsS3Healthy(s3Success)
              await updateHealthStatus('s3', s3Success ? 'healthy' : 'unhealthy',
                s3Result.responseTime || (Date.now() - startTime),
                s3Success ? undefined : (s3Result.error || 'Automatic S3 health check failed'),
                { 
                  check_type: 'automatic', 
                  timestamp: new Date().toISOString(),
                  bucket_name: s3Result.bucketName,
                  region: s3Result.region,
                  connection_details: s3Result
                }
              )
            }
          } else {
            throw new Error(`Edge function returned ${response.status}`)
          }
        } catch (s3Error: any) {
          if (mounted) {
            setIsS3Healthy(false)
            await updateHealthStatus('s3', 'unhealthy', undefined, s3Error.message || 'Automatic S3 check failed', 
              { error: s3Error.message, check_type: 'automatic' }
            )
          }
        }
        
          // Website health via HEAD ping (automatic)
          await pingWebsite('automatic');
          
          const supabaseHealthy = statusToBool(supabaseStatus);
          await updateHealthStatus('supabase', supabaseHealthy ? 'healthy' : 'unhealthy',
            supabaseHealthy ? Date.now() - startTime : undefined,
            supabaseHealthy ? undefined : 'Supabase connection issues',
            { supabase_status: supabaseStatus, check_type: 'automatic' }
          );
      } catch (error) {
        if (mounted) {
          setIsS3Healthy(false);
          const errorMessage = error instanceof Error ? error.message : 'Automatic check failed';
          await updateHealthStatus('s3', 'unhealthy', undefined, errorMessage, 
            { error: errorMessage, check_type: 'automatic' }
          );
        }
      }
    };

    runChecks();
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    // PERFORMANCE FIX: Reduced from 15s to 5 minutes to prevent slowdown
    intervalRef.current = window.setInterval(runChecks, 300000);

    return () => {
      mounted = false;
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [testConnection, isOnline, supabaseStatus, updateHealthStatus]);

  // Browser online/offline
  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => {
      setIsOnline(false);
      setErrors((prev) => [{ source: 'website' as const, message: 'Browser went offline', at: Date.now() }, ...prev].slice(0, 25));
    };
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  // Health status - strictly from backend health (no fallbacks)
  const websiteOK = health.website?.status === 'healthy';
  const supabaseOK = health.supabase?.status === 'healthy';
  const s3OK = health.s3?.status === 'healthy';

  // Link health (both endpoints must be healthy)
  const supabaseWebsiteOK = supabaseOK && websiteOK;
  const websiteS3OK = websiteOK && s3OK;
  const s3SupabaseOK = s3OK && supabaseOK;

  const allHealthy = websiteOK && supabaseOK && s3OK;
  const overallHealth = getOverallHealth();
  const healthyCount = getHealthyServicesCount();
  const totalCount = getTotalServicesCount();

  // Color function for strokes - enhanced with green theme
  const getStrokeColor = (healthy: boolean) => healthy ? '#10b981' : '#f87171';

  // Geometry - Triangle layout with more spread out coordinates
  const width = 700;
  const height = 400;
  const nodes = {
    website: { x: width * 0.5, y: height * 0.1 },      // top-center, higher up
    supabase: { x: width * 0.1, y: height * 0.9 },     // bottom-left, further left and down  
    s3: { x: width * 0.9, y: height * 0.9 }            // bottom-right, further right and down
  };

  return (
    <section className={cn('relative w-full rounded-lg border border-emerald-200/50 p-4 bg-emerald-50/30 dark:bg-emerald-950/20', className)} aria-label="Live integration topology">
      {/* Component styles */}
      <style>{`
        .dash { stroke-dasharray: 8 4; stroke-linecap: butt; }
        .toward-a { animation: dash-forward 2.4s linear infinite; }
        .toward-b { animation: dash-back 2.4s linear infinite; }
        @keyframes dash-forward { to { stroke-dashoffset: -96; } }
        @keyframes dash-back    { to { stroke-dashoffset:  96; } }
        @media (prefers-reduced-motion: reduce) { .toward-a,.toward-b { animation: none; } }
        .pulse-green { animation: pulse-green 2s ease-in-out infinite; }
        @keyframes pulse-green { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
      `}</style>

      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {allHealthy ? (
              <CheckCircle2 className="text-emerald-500 h-5 w-5 pulse-green" />
            ) : (
              <AlertTriangle className="text-amber-500 h-5 w-5" />
            )}
            <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Live Connection Topology</h2>
          </div>
          
          {/* Real-time status badges */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
              <Activity className="h-3 w-3 mr-1" />
              Real-time
            </Badge>
            <Badge variant={overallHealth === 'healthy' ? 'default' : 'destructive'} 
              className={overallHealth === 'healthy' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
              {healthyCount}/{totalCount} Services
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Live WebSocket/Supabase realtime status */}
          <Badge
            variant={supabaseStatus === 'healthy' ? 'default' : supabaseStatus === 'recovering' ? 'secondary' : 'destructive'}
            className={cn(
              'text-xs',
              supabaseStatus === 'healthy' && 'bg-emerald-500 hover:bg-emerald-600'
            )}
            aria-live="polite"
          >
            <Activity className="h-3 w-3 mr-1" />
            {supabaseStatus === 'healthy' ? 'Realtime: connected' : supabaseStatus === 'recovering' ? 'Realtime: reconnecting' : supabaseStatus === 'degraded' ? 'Realtime: unstable' : 'Realtime: offline'}
          </Badge>

          <div
            className={cn(
              'text-xs px-3 py-2 rounded-lg border font-medium',
              allHealthy
                ? 'text-emerald-700 border-emerald-300 bg-emerald-100 dark:text-emerald-200 dark:border-emerald-700 dark:bg-emerald-900/30'
                : 'text-amber-700 border-amber-300 bg-amber-100 dark:text-amber-200 dark:border-amber-700 dark:bg-amber-900/30'
            )}
          >
            <Zap className="h-3 w-3 inline mr-1" />
            {allHealthy ? 'All systems nominal' : 'Issues detected'}
          </div>

          <button
            onClick={async () => { await runHealthChecks(); setShowIssues(true); }}
            disabled={isChecking || supabaseStatus === 'offline'}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-950/20"
            aria-live="polite"
          >
            <RefreshCcw className={cn('h-4 w-4', (isChecking || supabaseStatus === 'recovering') && 'animate-spin text-emerald-600')} />
            {isChecking ? 'Checking…' : 'Re-check now'}
          </button>
        </div>
      </header>

      {showIssues && (
        <div className="mb-4 rounded-lg border border-amber-200/60 bg-white/70 p-4 dark:bg-gray-900/40">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Precise issue details</h3>
            <button
              onClick={() => setShowIssues(false)}
              className="text-xs rounded-md border border-emerald-300 px-2 py-1 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-950/20"
            >
              Hide
            </button>
          </div>
          {allHealthy ? (
            <p className="text-xs text-muted-foreground">No active issues detected.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {!websiteOK && (
                <div className="rounded-lg border p-3 bg-sky-50/60 dark:bg-sky-900/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-sky-800 dark:text-sky-200">Website</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-800">unhealthy</span>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-sky-700 dark:text-sky-300">
                    <li>Browser online: {isOnline ? 'Yes' : 'No'}</li>
                    <li>Last check: {health.website?.last_check_at ? new Date(health.website.last_check_at).toLocaleString() : 'Never'}</li>
                    <li>Response time: {typeof health.website?.response_time_ms === 'number' ? `${health.website.response_time_ms}ms` : 'Testing...'}</li>
                    <li>Uptime (30d): {typeof health.website?.uptime_percentage === 'number' ? `${health.website.uptime_percentage.toFixed(2)}%` : 'Calculating...'}</li>
                    <li>Last error: {health.website?.last_error_message || 'No errors'}</li>
                  </ul>
                </div>
              )}

              {!supabaseOK && (
                <div className="rounded-lg border p-3 bg-emerald-50/60 dark:bg-emerald-900/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Supabase</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-800">unhealthy</span>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-emerald-700 dark:text-emerald-300">
                    <li>Status: {supabaseStatus}</li>
                    <li>Last check: {health.supabase?.last_check_at ? new Date(health.supabase.last_check_at).toLocaleString() : 'Never'}</li>
                    <li>Response time: {typeof health.supabase?.response_time_ms === 'number' ? `${health.supabase.response_time_ms}ms` : 'Testing...'}</li>
                    <li>Uptime (30d): {typeof health.supabase?.uptime_percentage === 'number' ? `${health.supabase.uptime_percentage.toFixed(2)}%` : 'Calculating...'}</li>
                    <li>Last error: {health.supabase?.last_error_message || 'No errors'}</li>
                  </ul>
                </div>
              )}

              {!s3OK && (
                <div className="rounded-lg border p-3 bg-amber-50/60 dark:bg-amber-900/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-amber-800 dark:text-amber-200">S3 Storage</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-800">unhealthy</span>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-amber-700 dark:text-amber-300">
                    <li>Last check: {health.s3?.last_check_at ? new Date(health.s3.last_check_at).toLocaleString() : 'Never'}</li>
                    <li>Response time: {typeof health.s3?.response_time_ms === 'number' ? `${health.s3.response_time_ms}ms` : 'Testing...'}</li>
                    <li>Uptime (30d): {typeof health.s3?.uptime_percentage === 'number' ? `${health.s3.uptime_percentage.toFixed(2)}%` : 'Calculating...'}</li>
                    <li>Last error: {health.s3?.last_error_message || 'Testing connection...'}</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Real-time health metrics */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg border border-emerald-200/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Website</span>
            <div className={cn('w-2 h-2 rounded-full', websiteOK ? 'bg-emerald-500 pulse-green' : 'bg-red-500')}>
            </div>
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            {health.website?.response_time_ms ? `${health.website.response_time_ms}ms` : 'Live monitoring'}
          </div>
        </div>
        
        <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg border border-emerald-200/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Supabase</span>
            <div className={cn('w-2 h-2 rounded-full', supabaseOK ? 'bg-emerald-500 pulse-green' : 'bg-red-500')}>
            </div>
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            {health.supabase?.response_time_ms ? `${health.supabase.response_time_ms}ms` : 'Live monitoring'}
          </div>
        </div>
        
        <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg border border-emerald-200/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">S3 Storage</span>
            <div className={cn('w-2 h-2 rounded-full', s3OK ? 'bg-emerald-500 pulse-green' : 'bg-red-500')}>
            </div>
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            {health.s3?.response_time_ms ? `${health.s3.response_time_ms}ms` : 'Live monitoring'}
          </div>
        </div>
      </div>

      {/* Triangle SVG diagram */}
      <div className="relative" style={{ height: '400px' }}>
        <svg width={width} height={height} className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
          
          {/* Supabase ↔ Website */}
          {(() => {
            const a = nodes.supabase, b = nodes.website;
            const midX = (a.x + b.x) / 2, midY = (a.y + b.y) / 2;
            const stroke = getStrokeColor(supabaseWebsiteOK);
            return (
              <g>
                <line x1={a.x} y1={a.y} x2={midX} y2={midY} stroke={stroke} strokeWidth={3} className="dash toward-a" />
                <line x1={b.x} y1={b.y} x2={midX} y2={midY} stroke={stroke} strokeWidth={3} className="dash toward-b" />
              </g>
            );
          })()}

          {/* Website ↔ S3 */}
          {(() => {
            const a = nodes.website, b = nodes.s3;
            const midX = (a.x + b.x) / 2, midY = (a.y + b.y) / 2;
            const stroke = getStrokeColor(websiteS3OK);
            return (
              <g>
                <line x1={a.x} y1={a.y} x2={midX} y2={midY} stroke={stroke} strokeWidth={3} className="dash toward-a" />
                <line x1={b.x} y1={b.y} x2={midX} y2={midY} stroke={stroke} strokeWidth={3} className="dash toward-b" />
              </g>
            );
          })()}

          {/* S3 ↔ Supabase */}
          {(() => {
            const a = nodes.s3, b = nodes.supabase;
            const midX = (a.x + b.x) / 2, midY = (a.y + b.y) / 2;
            const stroke = getStrokeColor(s3SupabaseOK);
            return (
              <g>
                <line x1={a.x} y1={a.y} x2={midX} y2={midY} stroke={stroke} strokeWidth={3} className="dash toward-a" />
                <line x1={b.x} y1={b.y} x2={midX} y2={midY} stroke={stroke} strokeWidth={3} className="dash toward-b" />
              </g>
            );
          })()}

          {/* Nodes */}
          <Node x={nodes.website.x} y={nodes.website.y} label="" healthy={websiteOK} Icon={Globe} customColor="#00bcf2" customSvg={
            <svg viewBox="0 -4.48 70.001 70.001" xmlns="http://www.w3.org/2000/svg" fill="#000000" width="40" height="40">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path d="m 24.565809,772.93967 c -4.2532,-0.6287 -7.7642,-2.4255 -10.7178,-5.4849 -2.512,-2.6019 -4.0583004,-5.5193 -4.8051004,-9.0656 -0.4346,-2.064 -0.4346,-5.2086 0,-7.2726 0.7468,-3.5463 2.2931004,-6.4637 4.8051004,-9.0657 7.2819,-7.5426 19.0575,-7.5426 26.3393,0 2.6446,2.7393 4.3468,6.1039 4.9612,9.8064 0.2178,1.3128 0.2178,4.4783 0,5.7912 -1.102,6.6407 -5.9551,12.3867 -12.2175,14.465 -2.733,0.9071 -5.7814,1.2081 -8.3652,0.8262 z m 3.5164,-1.9525 c 1.3571,-0.6923 2.6871,-2.6432 3.6165,-5.3048 0.2986,-0.8551 0.5829,-1.7223 0.6318,-1.9271 l 0.089,-0.3724 -1.9077,-0.1687 c -1.0492,-0.093 -2.6438,-0.1686 -3.5436,-0.1684 -1.7491,0 -5.0798,0.2634 -5.2387,0.414 -0.1478,0.14 0.7853,2.8399 1.4631,4.2334 0.3642,0.7487 0.9294,1.6031 1.4172,2.1421 1.2412,1.3716 2.3323,1.7336 3.4724,1.1519 z m -5.3192,-0.3629 c 0,-0.036 -0.1685,-0.312 -0.3745,-0.613 -0.8991,-1.314 -2.5101,-5.1713 -2.5101,-6.0101 0,-0.1287 -0.081,-0.2339 -0.1803,-0.2337 -0.3413,0 -2.7787,0.6988 -4.0519,1.1605 l -1.2755,0.4627 0.915,0.9295 c 1.7319,1.7596 4.0137,3.2124 6.3024,4.013 1.0198,0.3568 1.1749,0.3952 1.1749,0.2911 z m 10.5286,-0.6241 c 2.1587,-0.9039 3.8228,-2.027 5.4601,-3.6851 l 0.917,-0.9285 -1.1635,-0.4487 c -1.0779,-0.4157 -3.7536,-1.1665 -4.168,-1.1695 -0.099,0 -0.1803,0.1041 -0.1803,0.2328 0,0.8479 -1.738,4.9994 -2.5396,6.0662 -0.1897,0.2525 -0.3449,0.4972 -0.3449,0.5436 0,0.1471 0.753,-0.081 2.0192,-0.6108 z m -19.3568,-6.3589 c 0.7409,-0.3737 2.5931,-0.9982 4.1408,-1.396 0.7139,-0.1835 1.2861,-0.3901 1.2715,-0.4591 -0.1389,-0.6561 -0.478,-4.2298 -0.4781,-5.0384 -10e-5,-0.5686 -0.04,-1.1365 -0.088,-1.262 -0.077,-0.2006 -0.5813,-0.2281 -4.1798,-0.2281 l -4.0923,0 0.081,0.6851 c 0.3501,2.9699 1.2656,5.7988 2.4732,7.6418 0.2575,0.3931 0.211,0.3901 0.8717,0.057 z m 27.792,-1.4659 c 0.7719,-1.5255 1.3031,-3.2391 1.5862,-5.1174 0.1193,-0.7918 0.2174,-1.5209 0.2179,-1.62 0,-0.14 -0.9147,-0.1803 -4.0982,-0.1803 l -4.099,0 -0.076,0.9014 c -0.042,0.4958 -0.1564,1.7452 -0.2542,2.7764 -0.098,1.0312 -0.1821,2.1257 -0.1874,2.4321 l -0.01,0.5571 1.7593,0.4821 c 0.9676,0.2652 2.2981,0.7075 2.9567,0.9829 1.403,0.5868 1.2511,0.6705 2.2048,-1.2143 z m -17.975,-0.8589 c 2.0834,-0.203 4.7952,-0.1786 7.0849,0.064 1.0693,0.1131 1.9637,0.186 1.9877,0.1621 0.087,-0.087 0.444,-3.2182 0.5405,-4.734 l 0.099,-1.5504 -6.438,0 -6.438,0 0.082,1.1177 c 0.1891,2.5899 0.2316,3.0467 0.3836,4.1202 l 0.1597,1.1274 0.5228,-0.081 c 0.2876,-0.044 1.195,-0.1459 2.0165,-0.226 z m -4.8428,-9.6284 c 0.046,-0.8528 0.1907,-2.2212 0.3219,-3.041 0.1313,-0.8197 0.2092,-1.5199 0.1732,-1.5558 -0.036,-0.036 -0.6632,-0.2254 -1.3939,-0.4209 -0.7307,-0.1956 -1.9921,-0.615 -2.8031,-0.9321 -0.811,-0.3171 -1.5104,-0.5765 -1.5542,-0.5765 -0.1428,0 -1.0943,1.5218 -1.6809,2.6883 -0.6723,1.3372 -1.2779,3.2168 -1.4458,4.487 l -0.119,0.9014 4.2092,0 4.2092,0 0.083,-1.5504 z m 14.4507,0.4326 c -0.1054,-1.3361 -0.4891,-4.1645 -0.6064,-4.4703 -0.068,-0.1759 -0.2511,-0.1993 -0.9625,-0.1223 -3.5957,0.389 -5.945,0.3888 -9.553,0 -0.7886,-0.085 -0.8946,-0.066 -0.9674,0.1756 -0.1342,0.446 -0.506,3.3669 -0.5714,4.49 l -0.061,1.0456 6.4048,0 6.4049,0 -0.088,-1.1177 z m 10.0051,0.1598 c -0.1536,-1.2762 -0.6021,-2.8742 -1.1389,-4.058 -0.4518,-0.9965 -1.6816,-3.0607 -1.8235,-3.0607 -0.044,0 -0.6722,0.2379 -1.396,0.5288 -0.7237,0.2908 -1.9898,0.7105 -2.8135,0.9327 -0.8237,0.2221 -1.527,0.4332 -1.5628,0.4691 -0.036,0.036 0.036,0.6708 0.1605,1.411 0.1242,0.7402 0.2629,1.8974 0.3083,2.5717 0.045,0.6743 0.1146,1.4369 0.1537,1.6947 l 0.071,0.4687 4.0782,0 4.0781,0 -0.1153,-0.958 z m -12.4583,-6.5575 c 0.711,-0.078 1.3104,-0.1597 1.3321,-0.1813 0.072,-0.072 -0.7017,-2.314 -1.1019,-3.1924 -1.1222,-2.4632 -2.7435,-4.1104 -4.0458,-4.1104 -1.4587,0 -3.046,1.5905 -4.1912,4.1997 -0.3709,0.8449 -1.1463,2.939 -1.1463,3.0955 0,0.077 1.6308,0.2551 3.173,0.3463 1.8695,0.1105 4.0658,0.053 5.9801,-0.1574 z m -10.5383,-1.8616 c 0.4554,-1.461 1.3036,-3.2953 1.9749,-4.271 0.2462,-0.3579 0.4199,-0.6784 0.386,-0.7123 -0.1078,-0.1078 -2.0173,0.5978 -3.1391,1.16 -0.595,0.2981 -1.5036,0.8397 -2.0192,1.2034 -0.9775,0.6895 -2.5961,2.1517 -2.5961,2.3452 0,0.247 3.8812,1.5422 4.6935,1.5663 0.2469,0.01 0.3603,-0.2018 0.7,-1.2916 z m 15.5878,0.9288 c 1.5168,-0.4398 3.1047,-1.0577 3.1047,-1.2083 0,-0.1894 -1.6302,-1.659 -2.5961,-2.3404 -0.5156,-0.3637 -1.4243,-0.9053 -2.0192,-1.2034 -1.125,-0.5637 -3.0315,-1.2677 -3.1398,-1.1594 -0.034,0.034 0.1042,0.2807 0.3078,0.5476 0.5523,0.7242 1.7573,3.3455 2.1227,4.6177 0.3775,1.3142 0.3233,1.296 2.2199,0.7462 z m -60.6082,-8.0297 0.036,-24.6989 29.1338996,0 29.1339004,0 0.037,11.7906 c 0.02,6.4848 0,11.7906 -0.038,11.7906 -0.041,0 -0.4636,-0.108 -0.9383,-0.24 l -0.8632,-0.24 0,-5.6733 0,-5.6734 -27.3311004,0 -27.3310996,0 0,17.8842 0,17.8842 15.1202996,0 15.1202,0 0.24,0.8632 c 0.132,0.4747 0.24,0.8966 0.24,0.9375 0,0.041 -7.33420005,0.074 -16.2981,0.074 l -16.2980996,0 0.036,-24.699 z m 8.0411,15.2521 0,-4.1105 2.2355,0 2.2356,0 0,-3.1009 0,-3.1009 8.0766996,0 8.0767,0 0,-2.2355 0,-2.2355 -3.10090005,0 -3.10089995,0 0,-4.9759 0,-4.9758 7.2114,0 7.2114004,0 0,4.9758 0,4.9759 -3.1730004,0 -3.173,0 0,2.2355 0,2.2355 2.8214,0 2.8214004,0 -0.4631,0.6449 c -0.9326,1.2985 -0.7604,1.2301 -3.0941004,1.2301 l -2.0856,0 0,2.1634 0,2.1634 1.0096,0 c 0.5552,0 1.0095,0.049 1.0095,0.1082 -10e-5,0.059 -0.1575,0.6923 -0.3498,1.4062 -0.4881,1.812 -0.6647,3.1437 -0.6708,5.0582 l -0.01,1.6484 -3.6696,0 -3.66970005,0 0,-4.1105 0,-4.1105 2.23560005,0 2.2355,0 0,-2.1634 0,-2.1634 -7.1393,0 -7.1391996,0 0,2.1634 0,2.1634 2.2354996,0 2.2355,0 0,4.1105 0,4.1105 -5.4084996,0 -5.4085,0 0,-4.1105 z" fill="#00bcf2" transform="translate(24.689 -712.062)"></path>
              </g>
            </svg>
          } />
          <Node x={nodes.supabase.x} y={nodes.supabase.y} label="" healthy={supabaseOK} Icon={Database} customSvg={
            <svg height="40px" width="40px" version="1.1" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" fill="#000000">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <path style={{fill:"#424A60"}} d="M24,35v-0.375V34.25v-8.625V25.25h0.034C24.013,25.374,24,25.499,24,25.625 c0-2.437,3.862-4.552,9.534-5.625H3.608C1.616,20,0,21.615,0,23.608v11.783C0,37.385,1.616,39,3.608,39H24V35z"></path>
                </g>
                <g>
                  <path style={{fill:"#556080"}} d="M24.034,53H24v-9v-0.375V43.25V39H3.608C1.616,39,0,40.615,0,42.608v11.783 C0,56.385,1.616,58,3.608,58h28.718C27.601,56.931,24.378,55.103,24.034,53z"></path>
                </g>
                <path style={{fill:"#556080"}} d="M54.392,20H3.608C1.616,20,0,18.384,0,16.392V4.608C0,2.616,1.616,1,3.608,1h50.783 C56.384,1,58,2.616,58,4.608v11.783C58,18.384,56.384,20,54.392,20z"></path>
                <circle style={{fill:"#7383BF"}} cx="9.5" cy="10.5" r="3.5"></circle>
                <circle style={{fill:"#7383BF"}} cx="49" cy="9" r="1"></circle>
                <circle style={{fill:"#7383BF"}} cx="45" cy="9" r="1"></circle>
                <circle style={{fill:"#7383BF"}} cx="51" cy="12" r="1"></circle>
                <circle style={{fill:"#7383BF"}} cx="47" cy="12" r="1"></circle>
                <circle style={{fill:"#7383BF"}} cx="41" cy="9" r="1"></circle>
                <circle style={{fill:"#7383BF"}} cx="43" cy="12" r="1"></circle>
                <circle style={{fill:"#7383BF"}} cx="37" cy="9" r="1"></circle>
                <circle style={{fill:"#7383BF"}} cx="39" cy="12" r="1"></circle>
                <circle style={{fill:"#7383BF"}} cx="33" cy="9" r="1"></circle>
                <circle style={{fill:"#7383BF"}} cx="35" cy="12" r="1"></circle>
                <circle style={{fill:"#7383BF"}} cx="9.5" cy="29.5" r="3.5"></circle>
                <circle style={{fill:"#7383BF"}} cx="9.5" cy="48.5" r="3.5"></circle>
                <g>
                  <path style={{fill:"#1A9172"}} d="M42,48.75c-9.941,0-18-2.854-18-6.375V53h0.034c0.548,3.346,8.381,6,17.966,6s17.418-2.654,17.966-6 H60V42.375C60,45.896,51.941,48.75,42,48.75z"></path>
                  <path style={{fill:"#1A9172"}} d="M24,42v0.375c0-0.126,0.013-0.251,0.034-0.375H24z"></path>
                  <path style={{fill:"#1A9172"}} d="M59.966,42C59.987,42.124,60,42.249,60,42.375V42H59.966z"></path>
                </g>
                <g>
                  <path style={{fill:"#25AE88"}} d="M42,38c-9.941,0-18-2.854-18-6.375V42.75h0.034c0.548,3.346,8.381,6,17.966,6s17.418-2.654,17.966-6 H60V31.625C60,35.146,51.941,38,42,38z"></path>
                  <path style={{fill:"#25AE88"}} d="M24,31.25v0.375c0-0.126,0.013-0.251,0.034-0.375H24z"></path>
                  <path style={{fill:"#25AE88"}} d="M59.966,31.25C59.987,31.374,60,31.499,60,31.625V31.25H59.966z"></path>
                </g>
                <ellipse style={{fill:"#88C057"}} cx="42" cy="21.375" rx="18" ry="6.375"></ellipse>
                <g>
                  <path style={{fill:"#61B872"}} d="M42,27.75c-9.941,0-18-2.854-18-6.375V32h0.034c0.548,3.346,8.381,6,17.966,6s17.418-2.654,17.966-6 H60V21.375C60,24.896,51.941,27.75,42,27.75z"></path>
                  <path style={{fill:"#61B872"}} d="M24,21v0.375c0-0.126,0.013-0.251,0.034-0.375H24z"></path>
                  <path style={{fill:"#61B872"}} d="M59.966,21C59.987,21.124,60,21.249,60,21.375V21H59.966z"></path>
                </g>
              </g>
            </svg>
          } />
          <Node x={nodes.s3.x} y={nodes.s3.y} label="" healthy={s3OK} Icon={Cloud} customColor="#f58535" customSvg={
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="#000000" width="40" height="40">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <title>file_type_aws</title>
                <path d="M30,19.152v1.273c0,2.307-2.545,4.693-5.648,4.693H7.648C4.506,25.118,2,22.771,2,20.424V19.152Z" style={{fill:"#9d5125"}}></path>
                <path d="M12.778,6.782A7.112,7.112,0,0,1,19.3,11a3.638,3.638,0,0,1,2.068-.636,3.583,3.583,0,0,1,3.619,3.5A5.69,5.69,0,0,1,30,18.993v.477c0,2.347-2.545,4.693-5.688,4.693H7.648C4.506,24.163,2,21.816,2,19.47v-.477A5.527,5.527,0,0,1,5.619,14.14v-.2A7.129,7.129,0,0,1,12.778,6.782Z" style={{fill:"#f58535"}}></path>
                <path d="M9,15.095,7.131,21.618H8.244l.438-1.591h1.909l.4,1.591H12.1l-1.75-6.523Zm-.159,4.1.8-3.222h0l.756,3.222Z" style={{fill:"#fff"}}></path>
                <polygon points="16.795 20.226 16.756 20.226 15.881 15.095 14.767 15.095 13.932 20.186 13.892 20.186 13.017 15.095 11.983 15.095 13.256 21.657 14.449 21.657 15.284 16.726 15.324 16.726 16.159 21.657 17.392 21.657 18.705 15.095 17.631 15.095 16.795 20.226" style={{fill:"#fff"}}></polygon>
                <path d="M22.085,18.078l-.716-.239c-.716-.278-.994-.6-.994-1.153a.9.9,0,1,1,1.79,0v.119H23.2v-.159c0-.676-.159-1.71-1.869-1.71A1.8,1.8,0,0,0,19.3,16.805a1.729,1.729,0,0,0,1.392,1.79l.716.239a1.1,1.1,0,0,1,.955,1.153.928.928,0,0,1-.994.955q-1.074,0-1.074-1.193v-.159H19.261v.159a1.786,1.786,0,0,0,1.989,1.989c1.312,0,2.187-.557,2.187-1.949A1.728,1.728,0,0,0,22.085,18.078Z" style={{fill:"#fff"}}></path>
              </g>
            </svg>
          } />
        </svg>
      </div>

      {/* Status indicators */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <StatusDot ok={supabaseWebsiteOK} label="Supabase ↔ Website" />
        <StatusDot ok={websiteS3OK} label="Website ↔ S3" />
        <StatusDot ok={s3SupabaseOK} label="S3 ↔ Supabase" />
        
      </div>

      {/* Error stream */}
      <div className="mt-4">
        <h3 className="text-xs font-medium mb-2 flex items-center gap-1">
          {errors.length === 0 ? <CheckCircle2 className="text-emerald-500 h-4 w-4" /> : <XCircle className="text-red-500 h-4 w-4" />}
          Live error feed
        </h3>
        {errors.length === 0 ? (
          <p className="text-xs text-muted-foreground">No recent issues detected.</p>
        ) : (
          <ul className="max-h-32 overflow-auto space-y-1 text-xs">
            {errors.slice(0, 20).map((e, i) => (
              <li key={i} className="flex items-start gap-2 rounded border p-2 bg-background/60">
                <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium',
                  e.source === 'website' && 'bg-sky-50 text-sky-700 border-sky-200',
                  e.source === 'supabase' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  e.source === 's3' && 'bg-amber-50 text-amber-700 border-amber-200'
                )}>
                  {e.source.toUpperCase()}
                </span>
                <span className="text-foreground/90 flex-1">{e.message}</span>
                <span className="text-muted-foreground">{new Date(e.at).toLocaleTimeString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

function Node({ x, y, label, healthy, Icon, customColor, customSvg }: { x: number; y: number; label: string; healthy: boolean; Icon: any; customColor?: string; customSvg?: React.ReactNode }) {
  const strokeColor = customColor || (healthy ? '#22c55e' : '#ef4444');
  return (
    <g>
      <circle cx={x} cy={y} r={32} fill="#ffffff" stroke={strokeColor} strokeWidth={3} />
      <foreignObject x={x - 30} y={y - 30} width={60} height={60}>
        <div className="flex h-[60px] w-[60px] flex-col items-center justify-center">
          {customSvg || <Icon className="h-5 w-5" />}
          {label && <span className="mt-1 text-xs font-medium text-gray-700">{label}</span>}
        </div>
      </foreignObject>
    </g>
  );
}

function StatusDot({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn('inline-block h-2.5 w-2.5 rounded-full', ok ? 'bg-green-400' : 'bg-red-400')} />
      <span className="text-gray-700">{label}</span>
    </div>
  );
}

export default LiveIntegrationTopology;
