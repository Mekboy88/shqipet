import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Users, MapPin, Eye, Clock, UserCheck, Activity } from 'lucide-react';

export const UserPresenceRealtime = () => {
  const [isActive, setIsActive] = useState(true);
  const [presenceStats, setPresenceStats] = useState({
    onlineUsers: 1247,
    activePages: 156,
    geoViewers: 89,
    invisibleUsers: 23
  });

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setPresenceStats(prev => ({
        onlineUsers: prev.onlineUsers + Math.floor(Math.random() * 20) - 10,
        activePages: prev.activePages + Math.floor(Math.random() * 10) - 5,
        geoViewers: prev.geoViewers + Math.floor(Math.random() * 8) - 4,
        invisibleUsers: prev.invisibleUsers + Math.floor(Math.random() * 3) - 1
      }));
    }, 2500);

    return () => clearInterval(interval);
  }, [isActive]);

  const presenceBehaviors = [
    {
      icon: <Users className="w-4 h-4" />,
      title: "Online Status Tracking",
      description: "Real-time 'Online now', 'Active recently' indicators",
      status: "active",
      heartbeat: "Every 30s"
    },
    {
      icon: <Eye className="w-4 h-4" />,
      title: "Page/Section Viewing",
      description: "Show what section user is currently viewing",
      status: "active",
      heartbeat: "Real-time"
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      title: "Geographic Presence",
      description: "Location-based user activity display",
      status: "active",
      heartbeat: "Every 60s"
    },
    {
      icon: <UserCheck className="w-4 h-4" />,
      title: "Invisible Mode Toggle",
      description: "Privacy setting to appear offline",
      status: "active",
      heartbeat: "Instant"
    }
  ];

  const currentActivity = [
    { section: "📱 Feed", users: 423, trend: "up" },
    { section: "💬 Messages", users: 198, trend: "stable" },
    { section: "📦 Marketplace", users: 145, trend: "up" },
    { section: "👥 Profiles", users: 89, trend: "down" },
    { section: "⚙️ Settings", users: 67, trend: "stable" },
    { section: "🎥 Reels", users: 234, trend: "up" }
  ];

  const integrationPoints = [
    "Heartbeat ping every 15-30 seconds",
    "WebSocket presence channel subscription",
    "Auto-logout on inactivity detection",
    "Stored: user_id, timestamp, active_section, device_type",
    "Cross-device presence synchronization",
    "Admin live audience overlay",
    "Friend sorting by current activity"
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <span className="text-green-500">↗</span>;
      case 'down': return <span className="text-red-500">↘</span>;
      default: return <span className="text-gray-500">→</span>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            👤 User Presence Real-Time System
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Presence Tracking</span>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </CardHeader>
        <CardContent>
          {/* Live Presence Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Online Users</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{presenceStats.onlineUsers}</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Active Pages</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{presenceStats.activePages}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Geo Viewers</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">{presenceStats.geoViewers}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">Invisible</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{presenceStats.invisibleUsers}</div>
            </div>
          </div>

          {/* Current Activity by Section */}
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-gray-800">Live Activity by Section</h4>
            <div className="grid gap-2">
              {currentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{activity.section}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{activity.users} users</span>
                    {getTrendIcon(activity.trend)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Presence Behaviors */}
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-gray-800">Real-Time Presence Behaviors</h4>
            <div className="grid gap-3">
              {presenceBehaviors.map((behavior, index) => (
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
                      {behavior.heartbeat}
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
              View Live Audience
            </Button>
            <Button size="sm" variant="outline">
              Configure Heartbeat
            </Button>
            <Button size="sm" variant="outline">
              Presence Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};