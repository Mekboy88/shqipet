import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Activity, Clock, Zap, RefreshCw, Download, Upload } from 'lucide-react';

interface MetricsData {
  timestamp: string;
  latency: number;
  throughput: number;
  errorRate: number;
  activeConnections: number;
}

interface StorageMetrics {
  name: string;
  value: number;
  color: string;
}

const WasabiMetricsChart: React.FC = () => {
  const [metricsData, setMetricsData] = useState<MetricsData[]>([]);
  const [storageData, setStorageData] = useState<StorageMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);

  // Generate mock data for demonstration
  const generateMockData = (hours: number) => {
    const data: MetricsData[] = [];
    const now = new Date();
    
    for (let i = hours; i >= 0; i -= 1) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        timestamp: timestamp.toISOString(),
        latency: Math.floor(Math.random() * 200) + 50,
        throughput: Math.floor(Math.random() * 1000) + 500,
        errorRate: Math.random() * 2,
        activeConnections: Math.floor(Math.random() * 10) + 15,
      });
    }
    
    return data;
  };

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      // Performance mock (kept for now)
      const hours = {
        '1h': 1,
        '24h': 24,
        '7d': 168,
        '30d': 720
      }[timeRange];
      const mockData = generateMockData(hours);
      setMetricsData(mockData);

      // REAL storage stats from Wasabi via Edge Function
      const { data: stats, error } = await supabase.functions.invoke('wasabi-list', {
        body: { prefix: 'uploads/', source: 'database', maxKeys: 1000 }
      });
      if (error) {
        console.error('Storage stats error:', error);
      }
      if (stats?.success && stats?.files) {
        // Count files by content type
        let images = 0, videos = 0, documents = 0, audio = 0;
        
        stats.files.forEach((file: any) => {
          const contentType = file.contentType || '';
          if (contentType.startsWith('image/')) {
            images++;
          } else if (contentType.startsWith('video/')) {
            videos++;
          } else if (contentType.startsWith('audio/')) {
            audio++;
          } else {
            documents++;
          }
        });
        
        setStorageData([
          { name: 'Images', value: images, color: '#8b5cf6' },
          { name: 'Videos', value: videos, color: '#06b6d4' },
          { name: 'Documents', value: documents, color: '#10b981' },
          { name: 'Audio', value: audio, color: '#f59e0b' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [timeRange]);

  useEffect(() => {
    if (!realTimeEnabled) return;
    
    const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [realTimeEnabled, timeRange]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    if (timeRange === '1h') {
      return date.toLocaleTimeString();
    } else if (timeRange === '24h') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getCurrentMetrics = () => {
    if (metricsData.length === 0) return null;
    
    const latest = metricsData[metricsData.length - 1];
    const previous = metricsData[metricsData.length - 2];
    
    return {
      latency: {
        current: latest.latency,
        change: previous ? ((latest.latency - previous.latency) / previous.latency * 100) : 0
      },
      throughput: {
        current: latest.throughput,
        change: previous ? ((latest.throughput - previous.throughput) / previous.throughput * 100) : 0
      },
      errorRate: {
        current: latest.errorRate,
        change: previous ? ((latest.errorRate - previous.errorRate) / previous.errorRate * 100) : 0
      },
      connections: {
        current: latest.activeConnections,
        change: previous ? ((latest.activeConnections - previous.activeConnections) / previous.activeConnections * 100) : 0
      }
    };
  };

  const currentMetrics = getCurrentMetrics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
          <div className="flex items-center space-x-2">
            {['1h', '24h', '7d', '30d'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range as any)}
                className="h-8 px-3"
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant={realTimeEnabled ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRealTimeEnabled(!realTimeEnabled)}
            className="h-8 px-3"
          >
            <Activity className="h-3 w-3 mr-1" />
            {realTimeEnabled ? 'Live' : 'Static'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMetrics}
            className="h-8 px-3"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Current Metrics Cards */}
      {currentMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Latency</p>
                  <p className="text-2xl font-bold text-gray-900">{currentMetrics.latency.current}ms</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className={`h-3 w-3 mr-1 ${currentMetrics.latency.change > 0 ? 'text-red-500' : 'text-green-500'}`} />
                <span className={`text-xs ${currentMetrics.latency.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {Math.abs(currentMetrics.latency.change).toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Throughput</p>
                  <p className="text-2xl font-bold text-gray-900">{currentMetrics.throughput.current}</p>
                </div>
                <Zap className="h-8 w-8 text-green-500" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className={`h-3 w-3 mr-1 ${currentMetrics.throughput.change < 0 ? 'text-red-500' : 'text-green-500'}`} />
                <span className={`text-xs ${currentMetrics.throughput.change < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {Math.abs(currentMetrics.throughput.change).toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Error Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{currentMetrics.errorRate.current.toFixed(1)}%</p>
                </div>
                <Activity className="h-8 w-8 text-red-500" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className={`h-3 w-3 mr-1 ${currentMetrics.errorRate.change > 0 ? 'text-red-500' : 'text-green-500'}`} />
                <span className={`text-xs ${currentMetrics.errorRate.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {Math.abs(currentMetrics.errorRate.change).toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Connections</p>
                  <p className="text-2xl font-bold text-gray-900">{currentMetrics.connections.current}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-500" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className={`h-3 w-3 mr-1 ${currentMetrics.connections.change < 0 ? 'text-red-500' : 'text-green-500'}`} />
                <span className={`text-xs ${currentMetrics.connections.change < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {Math.abs(currentMetrics.connections.change).toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-50">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base text-gray-900">Latency Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={metricsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={formatTimestamp}
                      stroke="#64748b"
                      fontSize={12}
                    />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      labelFormatter={(value) => formatTimestamp(value as string)}
                      formatter={(value) => [`${value}ms`, 'Latency']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="latency" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base text-gray-900">Throughput</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={metricsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={formatTimestamp}
                      stroke="#64748b"
                      fontSize={12}
                    />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      labelFormatter={(value) => formatTimestamp(value as string)}
                      formatter={(value) => [`${value} req/s`, 'Throughput']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="throughput" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-gray-900">Connection Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metricsData.slice(-24)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatTimestamp}
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    labelFormatter={(value) => formatTimestamp(value as string)}
                    formatter={(value) => [`${value}`, 'Active Connections']}
                  />
                  <Bar dataKey="activeConnections" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base text-gray-900">Storage Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={storageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {storageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base text-gray-900">Transfer Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Upload className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-green-900">Uploads Today</div>
                      <div className="text-sm text-green-700">1,247 files</div>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    2.4 GB
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Download className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-900">Downloads Today</div>
                      <div className="text-sm text-blue-700">3,891 requests</div>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-blue-100 text-blue-800">
                    7.8 GB
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-purple-900">Total Storage Used</div>
                      <div className="text-sm text-purple-700">245.6 GB of 1 TB</div>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-purple-100 text-purple-800">
                    24.6%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WasabiMetricsChart;