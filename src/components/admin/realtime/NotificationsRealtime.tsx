import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, User, Heart, MessageCircle, Tag, TrendingUp, Volume2 } from 'lucide-react';

export const NotificationsRealtime = () => {
  const [isActive, setIsActive] = useState(true);
  const [notificationStats, setNotificationStats] = useState({
    queuedNotifications: 24,
    deliveredToday: 1847,
    avgDeliveryTime: 45,
    unreadBadges: 156
  });

  const [recentNotifications, setRecentNotifications] = useState([
    { type: 'follower', user: '@maria_k', action: 'started following you', time: '2 mins ago', priority: 'high' },
    { type: 'like', user: '@alex_design', action: 'liked your post', time: '3 mins ago', priority: 'low' },
    { type: 'comment', user: '@john_dev', action: 'commented on your story', time: '5 mins ago', priority: 'medium' },
    { type: 'boost', user: '@sarah_ui', action: 'boosted your content', time: '8 mins ago', priority: 'high' }
  ]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setNotificationStats(prev => ({
        queuedNotifications: Math.max(0, prev.queuedNotifications + Math.floor(Math.random() * 4) - 2),
        deliveredToday: prev.deliveredToday + Math.floor(Math.random() * 5),
        avgDeliveryTime: 30 + Math.floor(Math.random() * 30),
        unreadBadges: prev.unreadBadges + Math.floor(Math.random() * 6) - 3
      }));

      // Add new notification occasionally
      if (Math.random() < 0.4) {
        const newNotification = {
          type: ['follower', 'like', 'comment', 'boost', 'tag'][Math.floor(Math.random() * 5)],
          user: ['@user_' + Math.floor(Math.random() * 100), '@new_member', '@active_user'][Math.floor(Math.random() * 3)],
          action: ['liked your post', 'started following you', 'commented on your story', 'tagged you in a post'][Math.floor(Math.random() * 4)],
          time: 'just now',
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any
        };
        setRecentNotifications(prev => [newNotification, ...prev.slice(0, 7)]);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isActive]);

  const notificationBehaviors = [
    {
      icon: <User className="w-4 h-4" />,
      title: "New Follower Alerts",
      description: "Instant notifications for new followers",
      status: "active",
      delivery: "< 50ms"
    },
    {
      icon: <Heart className="w-4 h-4" />,
      title: "Like & Reaction Sync",
      description: "Real-time like, tag, and reaction notifications",
      status: "active",
      delivery: "< 75ms"
    },
    {
      icon: <MessageCircle className="w-4 h-4" />,
      title: "Comment Notifications",
      description: "Instant alerts for new comments and replies",
      status: "active",
      delivery: "< 100ms"
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      title: "Boost Notifications",
      description: "Boost received and success notifications",
      status: "active",
      delivery: "< 60ms"
    }
  ];

  const integrationPoints = [
    "Pub/Sub notification queue system",
    "Priority-based delivery (high → instant, low → grouped)",
    "Storage: notification_id, user_id, type, timestamp, seen",
    "Badge count updates in sidebar/navigation",
    "Banner toast notifications with optional sound",
    "Category-based mute/snooze functionality",
    "Burst grouping (5 likes in 10s = single notification)"
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'follower': return <User className="w-4 h-4 text-blue-600" />;
      case 'like': return <Heart className="w-4 h-4 text-red-600" />;
      case 'comment': return <MessageCircle className="w-4 h-4 text-green-600" />;
      case 'boost': return <TrendingUp className="w-4 h-4 text-purple-600" />;
      case 'tag': return <Tag className="w-4 h-4 text-orange-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const notificationTypes = [
    { type: 'New Followers', count: 847, trend: 'up' },
    { type: 'Likes & Hearts', count: 2156, trend: 'up' },
    { type: 'Comments', count: 432, trend: 'stable' },
    { type: 'Boosts', count: 123, trend: 'up' },
    { type: 'Tags & Mentions', count: 89, trend: 'down' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            🔔 Notifications Real-Time System
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Live Alerts</span>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </CardHeader>
        <CardContent>
          {/* Live Notification Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Queued</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{notificationStats.queuedNotifications}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Delivered Today</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{notificationStats.deliveredToday}</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Avg Delivery</span>
              </div>
              <div className="text-2xl font-bold text-orange-900">{notificationStats.avgDeliveryTime}ms</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Badge className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Unread Badges</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">{notificationStats.unreadBadges}</div>
            </div>
          </div>

          {/* Notification Types Breakdown */}
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-gray-800">Today's Notifications by Type</h4>
            <div className="grid gap-3">
              {notificationTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <span className="font-medium text-gray-800">{type.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">{type.count}</span>
                    <span className={`text-sm ${
                      type.trend === 'up' ? 'text-green-600' : 
                      type.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {type.trend === 'up' ? '↗' : type.trend === 'down' ? '↘' : '→'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Notification Stream */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">Live Notification Stream</h4>
              <Button size="sm" variant="outline">Clear All</Button>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-3 bg-gray-50">
              {recentNotifications.map((notification, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-white rounded-lg">
                  <div>{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-medium">{notification.user}</span> {notification.action}
                    </div>
                    <div className="text-xs text-gray-500">{notification.time}</div>
                  </div>
                  <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                    {notification.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Behaviors */}
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-gray-800">Real-Time Notification Behaviors</h4>
            <div className="grid gap-3">
              {notificationBehaviors.map((behavior, index) => (
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
                      {behavior.delivery}
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
              Configure Priorities
            </Button>
            <Button size="sm" variant="outline">
              Test Delivery
            </Button>
            <Button size="sm" variant="outline">
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};