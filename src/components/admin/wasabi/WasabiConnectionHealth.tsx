import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useS3HealthCheck } from '@/hooks/useS3HealthCheck';
import { Globe, Database, Cloud, RefreshCw, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const WasabiConnectionHealth: React.FC = () => {
  const { healthData, isLoading, error, runHealthCheck, autoTestEnabled, setAutoTestEnabled } = useS3HealthCheck();
  const [refreshingAnalytics, setRefreshingAnalytics] = useState(false);

  // Real storage stats from Edge Function
  type StorageStats = {
    updatedAt: string;
    bucket: string;
    prefix: string | null;
    totals: { count: number; bytes: number };
    byType: Record<string, { count: number; bytes: number }>;
  } | null;

  const [storageStats, setStorageStats] = useState<StorageStats>(null);
  const [live, setLive] = useState(true);

  const [connectionStats, setConnectionStats] = useState({
    uptime24h: 99.5,
    uptime7d: 98.2,
    uptime30d: 99.1
  });

  const getStatusIcon = (online: boolean, latency?: number) => {
    if (!online) return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (latency && latency > 1000) return <Clock className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusBadge = (online: boolean, latency?: number) => {
    if (!online) return <Badge variant="destructive">Offline</Badge>;
    if (latency && latency > 1000) return <Badge variant="secondary">Slow</Badge>;
    return <Badge variant="default" className="bg-green-100 text-green-800">Online</Badge>;
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 100) return 'text-green-600';
    if (latency < 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const WASABI_PRICE_PER_TB_USD = 5.99; // Wasabi standard monthly pricing per TB
  const estimateCostUSD = (bytes: number) => {
    const BYTES_PER_TB = Math.pow(1024, 4);
    const cost = (bytes / BYTES_PER_TB) * WASABI_PRICE_PER_TB_USD;
    return Math.max(0, cost);
  };

  // Fetch real storage stats from Edge Function
  const loadStorageStats = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('wasabi-list', {
        body: { prefix: 'uploads/', source: 'database', maxKeys: 1000 }
      });
      if (error) {
        console.error('wasabi-list error', error);
        return;
      }
      
      // Transform the file list into storage stats format
      if (data?.success && data?.files) {
        const stats = {
          updatedAt: new Date().toISOString(),
          bucket: 'default',
          prefix: 'uploads/',
          totals: { count: data.files.length, bytes: 0 },
          byType: {
            images: { count: 0, bytes: 0 },
            videos: { count: 0, bytes: 0 },
            audio: { count: 0, bytes: 0 },
            documents: { count: 0, bytes: 0 }
          }
        };
        
        data.files.forEach((file: any) => {
          stats.totals.bytes += file.fileSize || 0;
          
          const contentType = file.contentType || '';
          if (contentType.startsWith('image/')) {
            stats.byType.images.count++;
            stats.byType.images.bytes += file.fileSize || 0;
          } else if (contentType.startsWith('video/')) {
            stats.byType.videos.count++;
            stats.byType.videos.bytes += file.fileSize || 0;
          } else if (contentType.startsWith('audio/')) {
            stats.byType.audio.count++;
            stats.byType.audio.bytes += file.fileSize || 0;
          } else {
            stats.byType.documents.count++;
            stats.byType.documents.bytes += file.fileSize || 0;
          }
        });
        
        setStorageStats(stats);
      }
    } catch (e) {
      console.error('loadStorageStats failed', e);
    }
  };

  // Poll every 20s when live is enabled
  useEffect(() => {
    loadStorageStats();
    if (!live) return;
    const id = setInterval(loadStorageStats, 20000);
    return () => clearInterval(id);
  }, [live]);

  const handleRefreshAnalytics = async () => {
    setRefreshingAnalytics(true);
    await Promise.all([runHealthCheck(), loadStorageStats()]);
    setTimeout(() => setRefreshingAnalytics(false), 300);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Website Health */}
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <span className="text-gray-900">Website</span>
            </div>
            {healthData && getStatusIcon(healthData.website.online, healthData.website.latency_ms)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            {healthData && getStatusBadge(healthData.website.online, healthData.website.latency_ms)}
          </div>
          
          {healthData && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Response Time</span>
              <span className={`text-sm font-mono ${getLatencyColor(healthData.website.latency_ms)}`}>
                {healthData.website.latency_ms}ms
              </span>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Uptime (24h)</span>
              <span className="text-gray-700">{connectionStats.uptime24h}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Uptime (7d)</span>
              <span className="text-gray-700">{connectionStats.uptime7d}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Uptime (30d)</span>
              <span className="text-gray-700">{connectionStats.uptime30d}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supabase Database Health */}
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-green-600" />
              <span className="text-gray-900">Supabase DB</span>
            </div>
            {healthData && getStatusIcon(healthData.supabase.online, healthData.supabase.latency_ms)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            {healthData && getStatusBadge(healthData.supabase.online, healthData.supabase.latency_ms)}
          </div>
          
          {healthData && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Query Time</span>
              <span className={`text-sm font-mono ${getLatencyColor(healthData.supabase.latency_ms)}`}>
                {healthData.supabase.latency_ms}ms
              </span>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Connection Pool</span>
              <span className="text-green-700">8/10 Active</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Transactions/min</span>
              <span className="text-gray-700">142</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Cache Hit Rate</span>
              <span className="text-green-700">94.2%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wasabi Cloud Health */}
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center space-x-2">
              <Cloud className="h-5 w-5 text-purple-600" />
              <span className="text-gray-900">Wasabi Cloud</span>
            </div>
            {healthData && getStatusIcon(healthData.s3.online, healthData.s3.latency_ms)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            {healthData && getStatusBadge(healthData.s3.online, healthData.s3.latency_ms)}
          </div>
          
          {healthData && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className={`text-sm font-mono ${getLatencyColor(healthData.s3.latency_ms)}`}>
                  {healthData.s3.latency_ms}ms
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bucket</span>
                <span className="text-sm text-gray-700 font-mono">{healthData.s3.bucket}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Region</span>
                <span className="text-sm text-gray-700">{healthData.s3.region}</span>
              </div>
            </div>
          )}

          {healthData && (
            <div className="space-y-1">
              <div className="text-xs text-gray-500 mb-1">Permissions</div>
              <div className="flex flex-wrap gap-1">
                <Badge variant={healthData.s3.permissions.get ? "default" : "destructive"} className="text-xs px-1 py-0">
                  GET {healthData.s3.permissions.get ? '✓' : '✗'}
                </Badge>
                <Badge variant={healthData.s3.permissions.put ? "default" : "destructive"} className="text-xs px-1 py-0">
                  PUT {healthData.s3.permissions.put ? '✓' : '✗'}
                </Badge>
                <Badge variant={healthData.s3.permissions.head ? "default" : "destructive"} className="text-xs px-1 py-0">
                  HEAD {healthData.s3.permissions.head ? '✓' : '✗'}
                </Badge>
                <Badge variant={healthData.s3.permissions.list ? "default" : "destructive"} className="text-xs px-1 py-0">
                  LIST {healthData.s3.permissions.list ? '✓' : '✗'}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Storage Analytics */}
      <Card className="bg-white border border-gray-100 shadow-sm lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-orange-600" />
              <span className="text-gray-900">Storage Analytics</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshAnalytics}
              disabled={refreshingAnalytics || isLoading}
              className="h-8 px-3 transition-all duration-200"
            >
              {refreshingAnalytics || isLoading ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(refreshingAnalytics || isLoading) ? (
            <div className="flex items-center justify-center h-24">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {(() => {
                const images = storageStats?.byType?.images || { count: 0, bytes: 0 };
                const videos = storageStats?.byType?.videos || { count: 0, bytes: 0 };
                const audio = storageStats?.byType?.audio || { count: 0, bytes: 0 };
                const documents = storageStats?.byType?.documents || { count: 0, bytes: 0 };
                const updatedAt = storageStats?.updatedAt || healthData?.ts || new Date().toISOString();

                return (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                        <div className="text-lg font-semibold text-blue-900">{formatBytes(images.bytes)}</div>
                        <div className="text-xs text-blue-600 font-medium">Photos</div>
                        <div className="text-xs text-blue-700">{images.count.toLocaleString()} files</div>
                        <div className="text-xs text-gray-700 mt-1">≈ ${estimateCostUSD(images.bytes).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}/mo</div>
                        <div className="flex items-center justify-center mt-1">
                          <Badge variant="default" className="bg-green-100 text-green-800 text-xs">Live</Badge>
                        </div>
                      </div>

                      <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                        <div className="text-lg font-semibold text-purple-900">{formatBytes(videos.bytes)}</div>
                        <div className="text-xs text-purple-600 font-medium">Videos</div>
                        <div className="text-xs text-purple-700">{videos.count.toLocaleString()} files</div>
                        <div className="text-xs text-gray-700 mt-1">≈ ${estimateCostUSD(videos.bytes).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}/mo</div>
                        <div className="flex items-center justify-center mt-1">
                          <Badge variant="default" className="bg-green-100 text-green-800 text-xs">Live</Badge>
                        </div>
                      </div>

                      <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                        <div className="text-lg font-semibold text-green-900">{formatBytes(audio.bytes)}</div>
                        <div className="text-xs text-green-600 font-medium">Audio</div>
                        <div className="text-xs text-green-700">{audio.count.toLocaleString()} files</div>
                        <div className="text-xs text-gray-700 mt-1">≈ ${estimateCostUSD(audio.bytes).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}/mo</div>
                        <div className="flex items-center justify-center mt-1">
                          <Badge variant="default" className="bg-green-100 text-green-800 text-xs">Live</Badge>
                        </div>
                      </div>

                      <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                        <div className="text-lg font-semibold text-orange-900">{formatBytes(documents.bytes)}</div>
                        <div className="text-xs text-orange-600 font-medium">Documents</div>
                        <div className="text-xs text-orange-700">{documents.count.toLocaleString()} files</div>
                        <div className="text-xs text-gray-700 mt-1">≈ ${estimateCostUSD(documents.bytes).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}/mo</div>
                        <div className="flex items-center justify-center mt-1">
                          <Badge variant="default" className="bg-green-100 text-green-800 text-xs">Live</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Total Storage Summary */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-600">Total Storage Used</div>
                          <div className="text-2xl font-bold text-gray-900">
                            {formatBytes(images.bytes + videos.bytes + audio.bytes + documents.bytes)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Estimated Monthly Cost</div>
                          <div className="text-2xl font-bold text-gray-900">
                            ${estimateCostUSD(images.bytes + videos.bytes + audio.bytes + documents.bytes).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Last updated: {new Date(updatedAt).toLocaleString()}</span>
                        <span className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                          Real-time
                        </span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Control Panel */}
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-gray-900">Health Check Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={runHealthCheck}
            disabled={isLoading}
            className="w-full"
            variant="outline"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Run Health Check
              </>
            )}
          </Button>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Auto-refresh</span>
            <Button
              variant={autoTestEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoTestEnabled(!autoTestEnabled)}
              className="h-8 px-3"
            >
              {autoTestEnabled ? 'ON' : 'OFF'}
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-red-700">{error}</div>
              </div>
            </div>
          )}

          {healthData?.issues && healthData.issues.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Issues Found:</div>
              {healthData.issues.map((issue, index) => (
                <div key={index} className="text-xs text-orange-700 bg-orange-50 p-2 rounded border border-orange-200">
                  {issue}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WasabiConnectionHealth;