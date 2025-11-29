import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Server, 
  Database, 
  Wifi, 
  HardDrive, 
  Activity,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Gauge
} from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useIntegrationHealth } from '@/hooks/useIntegrationHealth';
import { useFetchGuardian } from '@/hooks/useFetchGuardian';

const SystemHealthDashboard: React.FC = () => {
  const { health, getHealthyServicesCount, getTotalServicesCount } = useIntegrationHealth();
  const { status: fetchStatus } = useFetchGuardian({ notify: false, checkIntervalMs: 10000 });

  const metrics = useMemo(() => {
    const total = typeof getTotalServicesCount === 'function' ? getTotalServicesCount() : 0;
    const healthy = typeof getHealthyServicesCount === 'function' ? getHealthyServicesCount() : 0;
    const overallPct = total > 0 ? Math.round((healthy / total) * 100) : 0;

    const supa = health?.supabase;
    const website = health?.website;
    const s3 = health?.s3;

    const mapDbHealth = (s: string | null | undefined): 'healthy' | 'warning' | 'critical' => {
      if (s === 'healthy') return 'healthy';
      if (!s || s === 'unknown') return 'warning';
      return 'critical';
    };

    const mapApi = (s: string | null | undefined): 'online' | 'degraded' | 'offline' => {
      if (s === 'healthy') return 'online';
      if (!s || s === 'unknown') return 'degraded';
      return 'offline';
    };

    const mapWs = (fs: string): 'connected' | 'connecting' | 'disconnected' => {
      if (fs === 'healthy') return 'connected';
      if (fs === 'offline') return 'disconnected';
      return 'connecting';
    };

    const uptimeValues = [website?.uptime_percentage, supa?.uptime_percentage, s3?.uptime_percentage]
      .filter((v): v is number => typeof v === 'number');
    const avgUptime = uptimeValues.length ? (uptimeValues.reduce((a, b) => a + b, 0) / uptimeValues.length) : undefined;

    return {
      serverLoad: overallPct,
      databaseHealth: mapDbHealth(supa?.status),
      supabaseStatus: mapApi(supa?.status),
      websocketStatus: mapWs(fetchStatus),
      cacheUsage: 45,
      cdnUsage: 78,
      uptime: avgUptime !== undefined ? `${avgUptime.toFixed(2)}%` : '—',
      responseTime: supa?.response_time_ms ?? 0,
      lastUpdated: health?.lastUpdated,
    } as const;
  }, [health, getHealthyServicesCount, getTotalServicesCount, fetchStatus]);

  const components = useMemo(() => {
    const supaStatus = health?.supabase?.status ?? 'unknown';
    const s3Status = health?.s3?.status ?? 'unknown';
    const websiteStatus = health?.website?.status ?? 'unknown';
    const mapComp = (s: string) => (s === 'healthy' ? 'healthy' : s === 'unknown' ? 'warning' : 'critical');
    const formatUptime = (v?: number) => (typeof v === 'number' ? `${v.toFixed(2)}%` : '—');
    return [
      { name: 'Authentication Service', status: mapComp(supaStatus), uptime: formatUptime(health?.supabase?.uptime_percentage) },
      { name: 'File Storage (S3)', status: mapComp(s3Status), uptime: formatUptime(health?.s3?.uptime_percentage) },
      { name: 'Website', status: mapComp(websiteStatus), uptime: formatUptime(health?.website?.uptime_percentage) },
      { name: 'Email Service', status: 'warning', uptime: '—' },
      { name: 'Search Engine', status: 'healthy', uptime: '—' },
      { name: 'Analytics Service', status: 'healthy', uptime: '—' },
    ];
  }, [health]);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'online': 'bg-green-100 text-green-800',
      'connected': 'bg-green-100 text-green-800',
      'degraded': 'bg-yellow-100 text-yellow-800',
      'connecting': 'bg-yellow-100 text-yellow-800',
      'offline': 'bg-red-100 text-red-800',
      'disconnected': 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const handleOpenSystemRequirements = () => {
    console.log('Opening system requirements dashboard...');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">🖥️ System Status</h1>
          <p className="text-muted-foreground">Real-time system health and performance monitoring</p>
          <p className="text-xs text-muted-foreground">Last updated: {metrics.lastUpdated ? new Date(metrics.lastUpdated).toLocaleString() : '—'}</p>
        </div>
        <Button 
          onClick={handleOpenSystemRequirements}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        >
          ⚙️ Go to System Requirements & Status
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Server Load Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="text-sm font-medium text-blue-700">Overall Health</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-24 h-24">
              <CircularProgressbar
                value={metrics.serverLoad}
                text={`${metrics.serverLoad}%`}
                styles={buildStyles({
                  textColor: metrics.serverLoad > 80 ? '#DC2626' : metrics.serverLoad > 60 ? '#D97706' : '#059669',
                  pathColor: metrics.serverLoad > 80 ? '#DC2626' : metrics.serverLoad > 60 ? '#D97706' : '#059669',
                  trailColor: '#E5E7EB'
                })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Database Health</CardTitle>
            <Database className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getHealthIcon(metrics.databaseHealth)}
              <span className={`text-lg font-semibold ${getHealthColor(metrics.databaseHealth)}`}>
                {metrics.databaseHealth.charAt(0).toUpperCase() + metrics.databaseHealth.slice(1)}
              </span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Response time: {metrics.responseTime}ms
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">API Status</CardTitle>
            <Server className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-600">Supabase API</span>
                <Badge className={getStatusBadge(metrics.supabaseStatus)}>
                  {metrics.supabaseStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-600">WebSocket</span>
                <Badge className={getStatusBadge(metrics.websocketStatus)}>
                  {metrics.websocketStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">
              {metrics.uptime}
            </div>
            <p className="text-xs text-orange-600 mt-1">
              Last 30 days availability
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cache and CDN Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5 text-blue-600" />
              <span>Cache Usage</span>
            </CardTitle>
            <CardDescription>Memory cache utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Memory Cache</span>
                <span className="text-sm text-muted-foreground">{metrics.cacheUsage}%</span>
              </div>
              <Progress value={metrics.cacheUsage} className="w-full" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Hit Rate</span>
                  <p className="text-lg font-semibold text-green-600">94.2%</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Miss Rate</span>
                  <p className="text-lg font-semibold text-red-600">5.8%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wifi className="h-5 w-5 text-purple-600" />
              <span>CDN Performance</span>
            </CardTitle>
            <CardDescription>Content delivery network metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">CDN Usage</span>
                <span className="text-sm text-muted-foreground">{metrics.cdnUsage}%</span>
              </div>
              <Progress value={metrics.cdnUsage} className="w-full" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Edge Locations</span>
                  <p className="text-lg font-semibold text-blue-600">12 Active</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Avg Response</span>
                  <p className="text-lg font-semibold text-green-600">42ms</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Components Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Components</CardTitle>
          <CardDescription>Individual component health status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {components.map((component, index) => (
              <div key={index} className="p-4 border rounded-lg bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{component.name}</span>
                  {getHealthIcon(component.status)}
                </div>
                <div className="flex items-center justify-between">
                  <Badge className={getStatusBadge(component.status === 'healthy' ? 'online' : component.status === 'warning' ? 'degraded' : 'offline')}>
                    {component.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{component.uptime}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealthDashboard;