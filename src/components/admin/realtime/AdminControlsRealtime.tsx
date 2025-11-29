import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield, UserX, Crown, AlertTriangle } from 'lucide-react';

export const AdminControlsRealtime = () => {
  const [isActive, setIsActive] = useState(true);

  const controlBehaviors = [
    {
      icon: <Crown className="w-4 h-4" />,
      title: "Pro Role Assignment",
      description: "Role changes reflected instantly in user panel",
      status: "active",
      latency: "< 100ms"
    },
    {
      icon: <UserX className="w-4 h-4" />,
      title: "User Ban/Block",
      description: "Immediate logout and session termination",
      status: "active",
      latency: "< 50ms"
    },
    {
      icon: <Shield className="w-4 h-4" />,
      title: "Access Revocation",
      description: "Cross-device session destruction",
      status: "active",
      latency: "< 75ms"
    },
    {
      icon: <AlertTriangle className="w-4 h-4" />,
      title: "Permission Updates",
      description: "New permissions trigger instant refresh",
      status: "active",
      latency: "< 60ms"
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          🛠️ Admin Controls Real-Time System
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Live Controls</span>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {controlBehaviors.map((behavior, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-red-600">{behavior.icon}</div>
                <div>
                  <div className="font-medium text-gray-800">{behavior.title}</div>
                  <div className="text-sm text-gray-600">{behavior.description}</div>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">{behavior.latency}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};