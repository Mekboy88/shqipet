import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { BarChart3, Eye, MousePointer, TrendingUp } from 'lucide-react';

export const AnalyticsUsageRealtime = React.memo(() => {
  const [isActive, setIsActive] = useState(true);

  const handleToggle = useCallback((checked: boolean) => {
    setIsActive(checked);
  }, []);

  const analyticsBehaviors = useMemo(() => [
    {
      icon: <Eye className="w-4 h-4" />,
      title: "Module View Tracking",
      description: "Real-time tracking of user module interactions",
      status: "active",
      update: "Instant"
    },
    {
      icon: <MousePointer className="w-4 h-4" />,
      title: "Live Action Analytics",
      description: "Button clicks, post views, purchases tracked live",
      status: "active",
      update: "Real-time"
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      title: "Boost Usage Counters",
      description: "Usage metrics increase visibly in real-time",
      status: "active",
      update: "Instant"
    },
    {
      icon: <BarChart3 className="w-4 h-4" />,
      title: "Live Chart Updates",
      description: "Dynamic charts with throttle adjustment",
      status: "active",
      update: "Every 5s"
    }
  ], []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          📊 Analytics / Usage Real-Time System
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Live Analytics</span>
          <Switch checked={isActive} onCheckedChange={handleToggle} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {analyticsBehaviors.map((behavior, index) => (
            <div key={`${behavior.title}-${index}`} className="flex items-center justify-between p-3 bg-white border rounded-lg transition-transform duration-150 hover:scale-[1.01] will-change-transform">
              <div className="flex items-center gap-3">
                <div className="text-purple-600">{behavior.icon}</div>
                <div>
                  <div className="font-medium text-gray-800">{behavior.title}</div>
                  <div className="text-sm text-gray-600">{behavior.description}</div>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">{behavior.update}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

AnalyticsUsageRealtime.displayName = 'AnalyticsUsageRealtime';