import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DatabaseChanges: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">⚡</span>
            <span>Realtime DB changes (backend disabled)</span>
          </CardTitle>
        </div>
        <p className="text-gray-600">
          Backend disabled in this preview. This panel shows a static demo without realtime subscriptions.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-lg border p-4 bg-gray-50">
          <p className="text-sm text-gray-700">
            No database triggers or realtime channels are active. Safe static content only.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
