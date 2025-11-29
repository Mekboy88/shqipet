import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const RealtimeBroadcastChannels: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">📡</span>
            <span>Realtime Broadcast Channels (backend disabled)</span>
          </CardTitle>
        </div>
        <p className="text-gray-600">
          Backend disabled in this preview. This panel shows a static demo; no realtime or external services are active.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-lg border p-4 bg-gray-50">
          <p className="text-sm text-gray-700">
            All broadcast/presence examples have been removed. Nothing here connects to a backend.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
