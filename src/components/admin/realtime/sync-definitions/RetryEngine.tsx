import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export const RetryEngine: React.FC = () => {
  const [isActive, setIsActive] = useState(true);
  const [liveStats, setLiveStats] = useState({
    retryQueue: 12,
    successfulRetries: 89,
    failedRetries: 3,
    avgRetryTime: 1.2
  });

  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        retryQueue: Math.max(0, prev.retryQueue + Math.floor(Math.random() * 4) - 2),
        successfulRetries: prev.successfulRetries + Math.floor(Math.random() * 3),
        failedRetries: Math.max(0, prev.failedRetries + Math.floor(Math.random() * 2) - 1),
        avgRetryTime: Math.max(0.5, prev.avgRetryTime + (Math.random() - 0.5) * 0.3)
      }));
    }, 2200);

    return () => clearInterval(interval);
  }, [isActive]);

  const retryQueue = [
    { id: '1', event: 'like_post', user: 'Alice', attempt: 2, status: 'Retrying', nextRetry: '5s' },
    { id: '2', event: 'send_message', user: 'Bob', attempt: 1, status: 'Queued', nextRetry: '2s' },
    { id: '3', event: 'update_presence', user: 'Carol', attempt: 3, status: 'Failed', nextRetry: 'Manual' },
    { id: '4', event: 'post_comment', user: 'David', attempt: 1, status: 'Success', nextRetry: 'N/A' },
  ];

  const implementationCode = `const retryQueue = new RetryQueue(maxRetries=5)

retryQueue.push({ 
  event: 'like_post', 
  data: {...},
  eventId: uuid(),
  userId: currentUser.id
})

// Exponential backoff
const getBackoffDelay = (attempt) => {
  return Math.min(1000 * Math.pow(2, attempt), 30000)
}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success': return 'bg-green-100 text-green-800';
      case 'Retrying': return 'bg-yellow-100 text-yellow-800';
      case 'Queued': return 'bg-blue-100 text-blue-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">🔁</span>
            <span>Retry Engine</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Auto Retry</span>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>
        <p className="text-gray-600">
          Automatically retries events that failed due to socket drop, disconnection, mobile sleep, or stale session. Critical for preventing lost user actions.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Live Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{liveStats.retryQueue}</div>
            <div className="text-sm text-blue-700">Retry Queue</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{liveStats.successfulRetries}</div>
            <div className="text-sm text-green-700">Successful</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{liveStats.failedRetries}</div>
            <div className="text-sm text-red-700">Failed</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">{liveStats.avgRetryTime.toFixed(1)}s</div>
            <div className="text-sm text-purple-700">Avg Retry Time</div>
          </div>
        </div>

        {/* Live Retry Queue */}
        <div>
          <h3 className="text-lg font-semibold mb-3">🔄 Live Retry Queue</h3>
          <div className="space-y-2">
            {retryQueue.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-white border rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-gray-800">{item.user}</span>
                  <span className="text-gray-600 text-sm">{item.event}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    Attempt: {item.attempt}
                  </Badge>
                  <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                    {item.status}
                  </Badge>
                  <span className="text-xs text-gray-500">{item.nextRetry}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Implementation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">🔧 Retry Implementation</h3>
          <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
            <pre>{implementationCode}</pre>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Retry Audit Panel
          </button>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
            Manual Retry
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            Clear Failed Queue
          </button>
        </div>
      </CardContent>
    </Card>
  );
};