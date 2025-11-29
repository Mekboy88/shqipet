import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Activity, Database, AlertCircle, TrendingUp, RefreshCw, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RecentEvent {
  type: string;
  description: string;
  risk_level: string;
  timestamp: string;
}

interface MetricsData {
  total_profiles: number;
  recent_posts: number;
  recent_notifications: number;
  recent_analytics: number;
  recent_uploads: number;
  recent_errors: number;
  active_tables: number;
}

interface LiveData {
  window_minutes: number;
  timestamp: string;
  metrics: MetricsData;
  recent_events: RecentEvent[];
}

const LiveOperationCounter: React.FC = () => {
  const [data, setData] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMetrics = async () => {
    try {
      setError(null);
      const { data: result, error: rpcError } = await supabase.rpc('admin_get_live_operation_metrics', {
        p_window_minutes: 5
      });

      if (rpcError) throw rpcError;

      setData(result);
      setLastUpdated(new Date());
      setLoading(false);
      setIsRefreshing(false);
    } catch (err: any) {
      console.error('❌ Failed to fetch metrics:', err);
      setError(err.message || 'Failed to load metrics');
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchMetrics();
  };

  useEffect(() => {
    fetchMetrics();
    
    // Set up polling every 5 seconds
    const pollInterval = setInterval(fetchMetrics, 5000);

    // Set up real-time subscriptions
    const channel = supabase
      .channel('live-operations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, fetchMetrics)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, fetchMetrics)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'analytics_events' }, fetchMetrics)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'upload_logs' }, fetchMetrics)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'security_events' }, fetchMetrics)
      .subscribe();

    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  const getStatusColor = (errorCount: number) => {
    if (errorCount === 0) return 'bg-green-500';
    if (errorCount < 5) return 'bg-amber-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
            <div>
              <p className="text-lg font-semibold text-foreground">Loading real-time data...</p>
              <p className="text-sm text-muted-foreground">Connecting to Cloud database</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <Card className="p-6 border-destructive">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">Failed to load metrics</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const metrics = data.metrics;
  const errorCount = metrics.recent_errors;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">Live Operation Counter</h1>
            <Badge variant="outline" className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${getStatusColor(errorCount)} animate-pulse`} />
              Live
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="h-7"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Profiles</p>
              <p className="text-3xl font-bold text-foreground">{metrics.total_profiles.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                <span>Live</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900">
              <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Recent Posts (5m)</p>
              <p className="text-3xl font-bold text-foreground">{metrics.recent_posts.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <Activity className="w-3 h-3" />
                <span>Active</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg dark:bg-green-900">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Recent Uploads (5m)</p>
              <p className="text-3xl font-bold text-foreground">{metrics.recent_uploads.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-xs text-purple-600">
                <Database className="w-3 h-3" />
                <span>Connected</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg dark:bg-purple-900">
              <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className={`p-6 border-l-4 hover:shadow-lg transition-shadow ${
          errorCount === 0 ? 'border-l-green-500' : errorCount < 5 ? 'border-l-amber-500' : 'border-l-red-500'
        }`}>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Recent Errors (5m)</p>
              <p className="text-3xl font-bold text-foreground">{errorCount.toLocaleString()}</p>
              <div className={`flex items-center gap-1 text-xs ${
                errorCount === 0 ? 'text-green-600' : errorCount < 5 ? 'text-amber-600' : 'text-red-600'
              }`}>
                <AlertCircle className="w-3 h-3" />
                <span>{errorCount === 0 ? 'Healthy' : errorCount < 5 ? 'Warning' : 'Critical'}</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${
              errorCount === 0 ? 'bg-green-100 dark:bg-green-900' : 
              errorCount < 5 ? 'bg-amber-100 dark:bg-amber-900' : 
              'bg-red-100 dark:bg-red-900'
            }`}>
              <AlertCircle className={`w-6 h-6 ${
                errorCount === 0 ? 'text-green-600 dark:text-green-400' : 
                errorCount < 5 ? 'text-amber-600 dark:text-amber-400' : 
                'text-red-600 dark:text-red-400'
              }`} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Activity Overview (Last 5 minutes)</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Notifications</span>
              <span className="text-lg font-semibold text-foreground">{metrics.recent_notifications}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Analytics Events</span>
              <span className="text-lg font-semibold text-foreground">{metrics.recent_analytics}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Active Tables</span>
              <span className="text-lg font-semibold text-foreground">{metrics.active_tables}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Activity</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {data.recent_events.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No recent security events</p>
            ) : (
              data.recent_events.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                  <AlertCircle className={`w-4 h-4 mt-1 ${
                    event.risk_level === 'critical' ? 'text-red-500' :
                    event.risk_level === 'high' ? 'text-orange-500' :
                    event.risk_level === 'medium' ? 'text-amber-500' : 'text-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{event.type}</p>
                    <p className="text-xs text-muted-foreground truncate">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LiveOperationCounter;
