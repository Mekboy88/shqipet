import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Heart, MessageCircle, Edit3, Eye, Users, Clock } from 'lucide-react';

export const PostsCommentsRealtime = () => {
  const [isActive, setIsActive] = useState(true);
  const [liveStats, setLiveStats] = useState({
    activePosts: 245,
    liveComments: 12,
    typingUsers: 3,
    likesPerMinute: 142
  });

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setLiveStats(prev => ({
        activePosts: prev.activePosts + Math.floor(Math.random() * 3) - 1,
        liveComments: Math.floor(Math.random() * 20),
        typingUsers: Math.floor(Math.random() * 8),
        likesPerMinute: prev.likesPerMinute + Math.floor(Math.random() * 20) - 10
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  const realtimeBehaviors = [
    {
      icon: <Heart className="w-4 h-4" />,
      title: "Instant Like/Dislike Updates",
      description: "Auto-sync reactions without page refresh",
      status: "active",
      latency: "< 50ms"
    },
    {
      icon: <MessageCircle className="w-4 h-4" />,
      title: "Live Comment Threading",
      description: "New comments auto-append in real-time",
      status: "active",
      latency: "< 75ms"
    },
    {
      icon: <Edit3 className="w-4 h-4" />,
      title: "Typing Indicators",
      description: "Show 'User is typing a reply...' status",
      status: "active",
      latency: "< 100ms"
    },
    {
      icon: <Eye className="w-4 h-4" />,
      title: "Live Edit Sync",
      description: "Comment edits appear instantly for all users",
      status: "active",
      latency: "< 60ms"
    }
  ];

  const integrationPoints = [
    "WebSockets via Supabase Realtime",
    "Indexed by post_id and user_id",
    "Auto-scroll to new comments",
    "Activity counter badges",
    "Visual typing pulse animations",
    "Delay throttling (spam prevention)",
    "Mobile/desktop parity sync"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            📝 Posts / Comments Real-Time System
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Live Sync</span>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </CardHeader>
        <CardContent>
          {/* Live Stats Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Active Posts</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{liveStats.activePosts}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Live Comments</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{liveStats.liveComments}</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Typing Now</span>
              </div>
              <div className="text-2xl font-bold text-orange-900">{liveStats.typingUsers}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Likes/Min</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">{liveStats.likesPerMinute}</div>
            </div>
          </div>

          {/* Real-Time Behaviors */}
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-gray-800">Real-Time Behaviors</h4>
            <div className="grid gap-3">
              {realtimeBehaviors.map((behavior, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-blue-600">{behavior.icon}</div>
                    <div>
                      <div className="font-medium text-gray-800">{behavior.title}</div>
                      <div className="text-sm text-gray-600">{behavior.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {behavior.latency}
                    </Badge>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integration Points */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">Required Integration Points</h4>
            <div className="grid gap-2">
              {integrationPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  {point}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-6">
            <Button size="sm" variant="outline">
              View Live Activity
            </Button>
            <Button size="sm" variant="outline">
              Configure Throttling
            </Button>
            <Button size="sm" variant="outline">
              Test Sync Performance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};