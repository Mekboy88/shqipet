import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield, AlertTriangle, Activity, Database, Lock, TrendingUp } from 'lucide-react';

export const AdminDashboardRealtime = () => {
  const [isActive, setIsActive] = useState(true);
  const [systemStats, setSystemStats] = useState({
    activeAlerts: 3,
    failedAuths: 7,
    blockedSessions: 2,
    systemHealth: 98.7
  });

  const [recentEvents, setRecentEvents] = useState([
    { time: '2 mins ago', type: 'warning', event: 'High login attempts from IP 192.168.1.100' },
    { time: '5 mins ago', type: 'info', event: 'User @alex_m enforced MFA successfully' },
    { time: '8 mins ago', type: 'error', event: 'Failed auth attempt blocked for user @suspicious_user' },
    { time: '12 mins ago', type: 'success', event: 'System backup completed successfully' }
  ]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSystemStats(prev => ({
        activeAlerts: Math.max(0, prev.activeAlerts + Math.floor(Math.random() * 3) - 1),
        failedAuths: prev.failedAuths + Math.floor(Math.random() * 2),
        blockedSessions: Math.max(0, prev.blockedSessions + Math.floor(Math.random() * 2) - 1),
        systemHealth: Math.max(95, Math.min(100, prev.systemHealth + (Math.random() - 0.5) * 2))
      }));

      // Add new event occasionally
      if (Math.random() < 0.3) {
        const newEvent = {
          time: 'just now',
          type: ['info', 'warning', 'error', 'success'][Math.floor(Math.random() * 4)] as any,
          event: [
            'New user registration detected',
            'API rate limit threshold reached',
            'Suspicious login pattern detected',
            'Cache cleared successfully'
          ][Math.floor(Math.random() * 4)]
        };
        setRecentEvents(prev => [newEvent, ...prev.slice(0, 9)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive]);

  const dashboardBehaviors = [
    {
      icon: <Activity className="w-4 h-4" />,
      title: "Live System Health",
      description: "Real-time health checks and performance metrics",
      status: "active",
      update: "Every 5s"
    },
    {
      icon: <Shield className="w-4 h-4" />,
      title: "Security Log Stream",
      description: "Live security events, warnings, and violations",
      status: "active",
      update: "Instant"
    },
    {
      icon: <Lock className="w-4 h-4" />,
      title: "Session Monitoring",
      description: "Track device logins, session refreshes, blocks",
      status: "active",
      update: "Real-time"
    },
    {
      icon: <Database className="w-4 h-4" />,
      title: "Admin Activity Feed",
      description: "Live feed of admin actions: bans, role changes, MFA",
      status: "active",
      update: "Instant"
    }
  ];

  const integrationPoints = [
    "WebSocket admin events channel",
    "Dynamic session validation matrix",
    "Streamed log updates with scroll-to-latest",
    "Snap-to-live toggle functionality",
    "Pause logs view for detailed inspection",
    "Error trend heatmaps per hour",
    "Real-time alerting and notifications"
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-orange-600 bg-orange-50';
      case 'success': return 'text-green-600 bg-green-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            📍 Admin Dashboard Real-Time System
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Live Monitoring</span>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </CardHeader>
        <CardContent>
          {/* System Health Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Active Alerts</span>
              </div>
              <div className="text-2xl font-bold text-red-900">{systemStats.activeAlerts}</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Failed Auths</span>
              </div>
              <div className="text-2xl font-bold text-orange-900">{systemStats.failedAuths}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Blocked Sessions</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">{systemStats.blockedSessions}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">System Health</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{systemStats.systemHealth.toFixed(1)}%</div>
            </div>
          </div>

          {/* Live Event Stream */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">Live Event Stream</h4>
              <Button size="sm" variant="outline">Pause Stream</Button>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-3 bg-gray-50">
              {recentEvents.map((event, index) => (
                <div key={index} className={`flex items-start gap-3 p-2 rounded-lg ${getEventColor(event.type)}`}>
                  <span className="text-sm">{getEventIcon(event.type)}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{event.event}</div>
                    <div className="text-xs opacity-75">{event.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Behaviors */}
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-gray-800">Real-Time Dashboard Behaviors</h4>
            <div className="grid gap-3">
              {dashboardBehaviors.map((behavior, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-blue-600">{behavior.icon}</div>
                    <div>
                      <div className="font-medium text-gray-800">{behavior.title}</div>
                      <div className="text-sm text-gray-600">{behavior.description}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <Badge variant="secondary" className="text-xs">
                      {behavior.update}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integration Points */}
          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-gray-800">Integration Points</h4>
            <div className="grid gap-2">
              {integrationPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  {point}
                </div>
              ))}
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              View Full Logs
            </Button>
            <Button size="sm" variant="outline">
              Configure Alerts
            </Button>
            <Button size="sm" variant="outline">
              Export Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};