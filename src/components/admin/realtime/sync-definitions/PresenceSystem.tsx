import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const PresenceSystem: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">👥</span>
            <span>Realtime Presence (backend disabled)</span>
          </CardTitle>
        </div>
        <p className="text-gray-600">
          Backend disabled in this preview. This panel is a static demo without live presence tracking.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-lg border p-4 bg-gray-50">
          <p className="text-sm text-gray-700">
            Presence subscriptions and tracking are fully disabled. No realtime connections are opened.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
