import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { MessageSquare, Eye, Send, Wifi, Clock, Users } from 'lucide-react';

export const MessagingChatRealtime = () => {
  const [isActive, setIsActive] = useState(true);
  const [chatStats, setChatStats] = useState({
    activeChats: 89,
    typingUsers: 15,
    messagesPerMinute: 234,
    avgDeliveryTime: 42
  });

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setChatStats(prev => ({
        activeChats: prev.activeChats + Math.floor(Math.random() * 5) - 2,
        typingUsers: Math.floor(Math.random() * 25),
        messagesPerMinute: prev.messagesPerMinute + Math.floor(Math.random() * 30) - 15,
        avgDeliveryTime: 35 + Math.floor(Math.random() * 20)
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, [isActive]);

  const chatBehaviors = [
    {
      icon: <MessageSquare className="w-4 h-4" />,
      title: "Typing Indicators",
      description: "Show 'User is typing...' with debounce",
      status: "active",
      performance: "99.8% uptime"
    },
    {
      icon: <Eye className="w-4 h-4" />,
      title: "Read/Seen Status",
      description: "Message read receipts per participant",
      status: "active",
      performance: "< 100ms sync"
    },
    {
      icon: <Send className="w-4 h-4" />,
      title: "Delivery Status",
      description: "Sent, delivered, failed indicators",
      status: "active",
      performance: "Real-time tracking"
    },
    {
      icon: <Wifi className="w-4 h-4" />,
      title: "Auto Message Insert",
      description: "New messages appear without refresh",
      status: "active",
      performance: "Instant delivery"
    }
  ];

  const integrationFeatures = [
    "Unique channel: chat_room_id + user_id",
    "Presence-based activity status",
    "Message retry queue for network drops",
    "Typing indicator debounce (300ms)",
    "Chat scroll lock toggle",
    "Group chat emote sync",
    "Offline message queuing"
  ];

  const performanceMetrics = [
    { label: "Average Latency", value: `${chatStats.avgDeliveryTime}ms`, status: "good" },
    { label: "Message Success Rate", value: "99.94%", status: "excellent" },
    { label: "Typing Accuracy", value: "98.7%", status: "good" },
    { label: "Connection Stability", value: "99.2%", status: "excellent" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            💬 Messaging / Chat Real-Time System
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Live Chat</span>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </CardHeader>
        <CardContent>
          {/* Live Chat Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Active Chats</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{chatStats.activeChats}</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Typing Now</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{chatStats.typingUsers}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Msgs/Min</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">{chatStats.messagesPerMinute}</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Avg Delivery</span>
              </div>
              <div className="text-2xl font-bold text-orange-900">{chatStats.avgDeliveryTime}ms</div>
            </div>
          </div>

          {/* Chat Behaviors */}
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-gray-800">Real-Time Chat Behaviors</h4>
            <div className="grid gap-3">
              {chatBehaviors.map((behavior, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-green-600">{behavior.icon}</div>
                    <div>
                      <div className="font-medium text-gray-800">{behavior.title}</div>
                      <div className="text-sm text-gray-600">{behavior.description}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <Badge variant="secondary" className="text-xs">
                      {behavior.performance}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-gray-800">Performance Metrics</h4>
            <div className="grid grid-cols-2 gap-3">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{metric.value}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      metric.status === 'excellent' ? 'bg-green-500' : 'bg-blue-500'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integration Features */}
          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-gray-800">Integration Points</h4>
            <div className="grid gap-2">
              {integrationFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Monitor Channels
            </Button>
            <Button size="sm" variant="outline">
              Test Typing Sync
            </Button>
            <Button size="sm" variant="outline">
              View Message Queue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};