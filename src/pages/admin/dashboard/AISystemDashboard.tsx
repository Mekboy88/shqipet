import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, Activity, TrendingUp, Settings, AlertCircle, CheckCircle } from 'lucide-react';

const AISystemDashboard: React.FC = React.memo(() => {
  const [aiMetrics, setAiMetrics] = useState({
    modulesOnline: 8,
    totalModules: 10,
    queriesTotal: 15847,
    queriesLastHour: 234,
    avgResponseTime: 1.2,
    uptime: 99.9
  });

  const aiFeatures = useMemo(() => [
    { name: 'Smart Moderation', usage: 4200, status: 'online' },
    { name: 'Content Analysis', usage: 3850, status: 'online' },
    { name: 'Auto Translation', usage: 2100, status: 'online' },
    { name: 'Spam Detection', usage: 1950, status: 'online' },
    { name: 'Image Recognition', usage: 1200, status: 'maintenance' },
    { name: 'Chatbot Assistant', usage: 980, status: 'online' }
  ], []);

  const hourlyData = useMemo(() => [
    { hour: '00:00', queries: 120 },
    { hour: '03:00', queries: 80 },
    { hour: '06:00', queries: 150 },
    { hour: '09:00', queries: 320 },
    { hour: '12:00', queries: 420 },
    { hour: '15:00', queries: 380 },
    { hour: '18:00', queries: 290 },
    { hour: '21:00', queries: 180 }
  ], []);

  const mostUsedFeature = useMemo(() => 
    aiFeatures.reduce((max, feature) => 
      feature.usage > max.usage ? feature : max
    ), [aiFeatures]
  );

  const updateMetrics = useCallback(() => {
    setAiMetrics(prev => ({
      ...prev,
      queriesTotal: prev.queriesTotal + Math.floor(Math.random() * 5),
      queriesLastHour: prev.queriesLastHour + Math.floor(Math.random() * 3),
      avgResponseTime: parseFloat((1.0 + Math.random() * 0.5).toFixed(1))
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(updateMetrics, 60000); // Reduced from 15s to 60s
    return () => clearInterval(interval);
  }, [updateMetrics]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI System Status</h1>
          <p className="text-muted-foreground">Monitor AI modules and performance metrics</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Settings className="mr-2 h-4 w-4" />
          🤖 Go to AI System Logs
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 transition-transform duration-150 hover:scale-[1.02] will-change-transform contain-layout">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Modules Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {aiMetrics.modulesOnline}/{aiMetrics.totalModules}
            </div>
            <p className="text-xs text-green-700">Modules Online</p>
            <Progress 
              value={(aiMetrics.modulesOnline / aiMetrics.totalModules) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 transition-transform duration-150 hover:scale-[1.02] will-change-transform contain-layout">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Queries Today</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{aiMetrics.queriesTotal.toLocaleString()}</div>
            <p className="text-xs text-blue-700">+{aiMetrics.queriesLastHour} last hour</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 transition-transform duration-150 hover:scale-[1.02] will-change-transform contain-layout">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Response Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{aiMetrics.avgResponseTime}s</div>
            <p className="text-xs text-purple-700">Average response time</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 transition-transform duration-150 hover:scale-[1.02] will-change-transform contain-layout">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">System Uptime</CardTitle>
            <Brain className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{aiMetrics.uptime}%</div>
            <p className="text-xs text-orange-700">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Features & Usage */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Features Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiFeatures.map((feature, index) => (
                <div key={`${feature.name}-${index}`} className="flex items-center justify-between transition-transform duration-150 hover:scale-[1.01] will-change-transform">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      feature.status === 'online' ? 'bg-green-500' : 
                      feature.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="font-medium">{feature.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{feature.usage} queries</span>
                    <Badge variant={feature.status === 'online' ? 'default' : 'secondary'}>
                      {feature.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Query Volume (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="contain-layout contain-style">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip 
                    animationDuration={150}
                    contentStyle={{
                      transition: 'all 0.15s ease'
                    }}
                  />
                  <Bar dataKey="queries" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Used Feature Highlight */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <TrendingUp className="h-5 w-5" />
            Most Used AI Feature Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-indigo-900">{mostUsedFeature.name}</h3>
              <p className="text-indigo-700">{mostUsedFeature.usage.toLocaleString()} queries processed</p>
            </div>
            <Badge className="bg-indigo-600 text-white">Top Performer</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

AISystemDashboard.displayName = 'AISystemDashboard';

export default AISystemDashboard;