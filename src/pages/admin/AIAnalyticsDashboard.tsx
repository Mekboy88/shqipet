import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Activity, 
  AlertCircle, 
  BarChart3, 
  Brain, 
  Clock, 
  DollarSign, 
  Download, 
  Eye, 
  Heart, 
  MessageSquare, 
  RefreshCw, 
  Settings, 
  TrendingUp, 
  Users, 
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { aiAnalytics, UsageMetrics, ErrorLog, SystemHealthComponent, ModelPerformance } from '@/services/aiAnalyticsManager';

const AIAnalyticsDashboard = memo(function AIAnalyticsDashboard() {
  const { toast } = useToast();
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [loading, setLoading] = useState(true);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics | null>(null);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealthComponent[]>([]);
  const [modelPerformance, setModelPerformance] = useState<ModelPerformance[]>([]);

  useEffect(() => {
    loadDashboardData();
    setupRealTimeListeners();

    // Auto-refresh reduced from 30s to 60s for better performance
    const interval = setInterval(() => {
      loadDashboardData();
    }, 60000);

    return () => {
      clearInterval(interval);
      aiAnalytics.cleanup();
    };
  }, [selectedTimeRange]);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [metrics, errors, health, performance] = await Promise.all([
        aiAnalytics.fetchUsageMetrics(selectedTimeRange),
        aiAnalytics.fetchErrorLogs(20),
        aiAnalytics.fetchSystemHealth(),
        aiAnalytics.fetchPerformanceMetrics()
      ]);

      setUsageMetrics(metrics);
      setErrorLogs(errors);
      setSystemHealth(health);
      setModelPerformance(performance);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedTimeRange, toast]);

  const setupRealTimeListeners = () => {
    window.addEventListener('usage-metrics-updated', handleUsageUpdate);
    window.addEventListener('error-log-added', handleErrorLogAdded);
    window.addEventListener('system-health-updated', handleHealthUpdate);
    
    return () => {
      window.removeEventListener('usage-metrics-updated', handleUsageUpdate);
      window.removeEventListener('error-log-added', handleErrorLogAdded);
      window.removeEventListener('system-health-updated', handleHealthUpdate);
    };
  };

  const handleUsageUpdate = useCallback((event: CustomEvent) => {
    console.log('Real-time usage update:', event.detail);
    loadDashboardData();
  }, [loadDashboardData]);

  const handleErrorLogAdded = useCallback((event: CustomEvent) => {
    console.log('New error log:', event.detail);
    setErrorLogs(prev => [event.detail.new, ...prev.slice(0, 19)]);
    
    if (event.detail.new.severity === 'critical') {
      toast({
        title: "Critical Error Detected",
        description: event.detail.new.error_message,
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleHealthUpdate = useCallback((event: CustomEvent) => {
    console.log('System health update:', event.detail);
    setSystemHealth(prev => prev.map(component => 
      component.component_name === event.detail.new.component_name 
        ? event.detail.new 
        : component
    ));
  }, []);

  const handleExport = useCallback(async (format: 'json' | 'csv') => {
    try {
      const data = await aiAnalytics.exportAnalyticsData('30d', format);
      if (data) {
        const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
        const blob = new Blob([content], { 
          type: format === 'json' ? 'application/json' : 'text/csv' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-analytics-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Export Complete",
          description: `Analytics data exported as ${format.toUpperCase()}`,
        });
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export analytics data",
        variant: "destructive",
      });
    }
  }, [toast]);

  const getStatusIcon = (status: SystemHealthComponent['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
      case 'down':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      low: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      critical: 'bg-red-500/10 text-red-500 border-red-500/20'
    };
    
    return (
      <Badge className={colors[severity as keyof typeof colors] || colors.medium}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  // Memoized chart data for better performance
  const chartData = useMemo(() => modelPerformance.map(model => ({
    name: model.model_name,
    'Response Time': model.avg_response_time_ms,
    'Success Rate': model.success_rate_percent,
    'Quality Score': model.avg_quality_score * 20, // Scale to 100
    'Requests': model.total_requests / 100 // Scale down for visibility
  })), [modelPerformance]);

  // Memoized usage data to prevent recreation on render
  const usageData = useMemo(() => [
    { name: '6h ago', requests: 245, errors: 5, cost: 12.3 },
    { name: '5h ago', requests: 289, errors: 3, cost: 15.7 },
    { name: '4h ago', requests: 356, errors: 8, cost: 19.2 },
    { name: '3h ago', requests: 298, errors: 2, cost: 16.8 },
    { name: '2h ago', requests: 412, errors: 6, cost: 22.4 },
    { name: '1h ago', requests: 387, errors: 4, cost: 20.9 },
    { name: 'Now', requests: 435, errors: 1, cost: 23.8 }
  ], []);

  // Memoized pie chart data with dependency tracking
  const pieData = useMemo(() => [
    { name: 'Successful', value: usageMetrics?.successful_requests || 0, color: '#22c55e' },
    { name: 'Failed', value: (usageMetrics?.total_requests || 0) - (usageMetrics?.successful_requests || 0), color: '#ef4444' }
  ], [usageMetrics?.successful_requests, usageMetrics?.total_requests]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Analytics Dashboard</h1>
            <p className="text-slate-300">Real-time monitoring and performance analytics</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Time Range Selector */}
            <div className="flex items-center gap-2">
              {['1h', '24h', '7d', '30d'].map((range) => (
                <Button
                  key={range}
                  variant={selectedTimeRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTimeRange(range)}
                  className="text-xs"
                >
                  {range.toUpperCase()}
                </Button>
              ))}
            </div>
            
            {/* Actions */}
            <Button
              variant="outline"
              size="sm"
              onClick={loadDashboardData}
              className="text-white border-white/20 hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('json')}
                className="text-white border-white/20 hover:bg-white/10"
              >
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('csv')}
                className="text-white border-white/20 hover:bg-white/10"
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Requests</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{usageMetrics?.total_requests?.toLocaleString() || '0'}</div>
              <p className="text-xs text-slate-300">
                {usageMetrics?.successful_requests || 0} successful
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{usageMetrics?.avg_response_time || 0}ms</div>
              <p className="text-xs text-slate-300">
                Performance target: &lt;2000ms
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${usageMetrics?.total_cost || 0}</div>
              <p className="text-xs text-slate-300">
                This period
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Top Model</CardTitle>
              <Brain className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-white">{usageMetrics?.top_model || 'N/A'}</div>
              <p className="text-xs text-slate-300">
                Most used model
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-black/20 border-white/10">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/10">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-white data-[state=active]:bg-white/10">
              <TrendingUp className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="errors" className="text-white data-[state=active]:bg-white/10">
              <AlertCircle className="h-4 w-4 mr-2" />
              Error Logs
            </TabsTrigger>
            <TabsTrigger value="health" className="text-white data-[state=active]:bg-white/10">
              <Heart className="h-4 w-4 mr-2" />
              System Health
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Usage Trends Chart */}
              <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Usage Trends</CardTitle>
                  <CardDescription className="text-slate-300">
                    Requests, errors, and costs over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#cbd5e1" />
                      <YAxis stroke="#cbd5e1" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px'
                        }}
                        animationDuration={150}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="requests" 
                        stackId="1" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.6} 
                        isAnimationActive={false}
                        connectNulls={false}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="errors" 
                        stackId="1" 
                        stroke="#ef4444" 
                        fill="#ef4444" 
                        fillOpacity={0.6}
                        isAnimationActive={false}
                        connectNulls={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Success/Failure Ratio */}
              <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Request Success Rate</CardTitle>
                  <CardDescription className="text-slate-300">
                    Success vs failure ratio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        isAnimationActive={false}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip animationDuration={150} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Model Performance Comparison</CardTitle>
                <CardDescription className="text-slate-300">
                  Compare performance metrics across different AI models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart 
                    data={chartData} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px'
                      }}
                      animationDuration={150}
                    />
                    <Legend />
                    <Bar 
                      dataKey="Response Time" 
                      fill="#3b82f6" 
                      isAnimationActive={false}
                    />
                    <Bar 
                      dataKey="Success Rate" 
                      fill="#10b981" 
                      isAnimationActive={false}
                    />
                    <Bar 
                      dataKey="Quality Score" 
                      fill="#8b5cf6" 
                      isAnimationActive={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Model Performance Table */}
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Detailed Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-white">Model</th>
                        <th className="text-left py-3 px-4 text-white">Requests</th>
                        <th className="text-left py-3 px-4 text-white">Avg Response</th>
                        <th className="text-left py-3 px-4 text-white">Success Rate</th>
                        <th className="text-left py-3 px-4 text-white">Quality Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modelPerformance.map((model) => (
                        <tr key={model.id} className="border-b border-white/5">
                          <td className="py-3 px-4 text-white font-medium">{model.model_name}</td>
                          <td className="py-3 px-4 text-slate-300">{model.total_requests.toLocaleString()}</td>
                          <td className="py-3 px-4 text-slate-300">{model.avg_response_time_ms}ms</td>
                          <td className="py-3 px-4 text-slate-300">{model.success_rate_percent}%</td>
                          <td className="py-3 px-4 text-slate-300">{model.avg_quality_score}/5</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Error Logs Tab */}
          <TabsContent value="errors" className="space-y-6">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Recent Error Logs</CardTitle>
                <CardDescription className="text-slate-300">
                  Real-time error monitoring and tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {errorLogs.map((error) => (
                      <div key={error.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-white font-medium">{error.error_type}</span>
                              {getSeverityBadge(error.severity)}
                              <span className="text-xs text-slate-400">
                                {new Date(error.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-slate-300 text-sm mb-2">{error.error_message}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-400">
                              <span>Model: {error.model_name}</span>
                              <span>Status: {error.resolved ? 'Resolved' : 'Open'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Health Tab */}
          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemHealth.map((component) => (
                <Card key={component.id} className="bg-black/20 border-white/10 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-white">{component.component_name}</CardTitle>
                      {getStatusIcon(component.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-xs text-slate-300">{component.status_message}</div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Response:</span>
                        <span className="text-white">{component.response_time_ms}ms</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Uptime:</span>
                        <span className="text-white">{component.uptime_percent}%</span>
                      </div>
                      <div className="text-xs text-slate-400">
                        Last check: {new Date(component.last_check).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
});

export default AIAnalyticsDashboard;