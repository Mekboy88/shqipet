import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export const SyncBufferLayer: React.FC = () => {
  const [isActive, setIsActive] = useState(true);
  const [liveStats, setLiveStats] = useState({
    queuedEvents: 7,
    bufferedMessages: 3,
    retryAttempts: 2,
    connectionStatus: 'Stable'
  });

  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        queuedEvents: Math.max(0, prev.queuedEvents + Math.floor(Math.random() * 4) - 2),
        bufferedMessages: Math.max(0, prev.bufferedMessages + Math.floor(Math.random() * 3) - 1),
        retryAttempts: Math.max(0, prev.retryAttempts + Math.floor(Math.random() * 2) - 1),
        connectionStatus: Math.random() > 0.1 ? 'Stable' : 'Reconnecting'
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  const bufferTypes = [
    {
      icon: '💬',
      type: 'Chat Messages',
      description: 'Messages queued during poor connection',
      retryLogic: 'Auto-retry every 2 seconds',
      storage: 'Local Storage'
    },
    {
      icon: '❤️',
      type: 'Reactions',
      description: 'Like/emoji reactions pending sync',
      retryLogic: 'Batch retry every 5 seconds',
      storage: 'Memory Queue'
    },
    {
      icon: '👥',
      type: 'Presence Sync',
      description: 'User presence status updates',
      retryLogic: 'Immediate retry on reconnect',
      storage: 'Session Storage'
    },
    {
      icon: '📝',
      type: 'Post Updates',
      description: 'Post edits and new content',
      retryLogic: 'Priority queue with exponential backoff',
      storage: 'IndexedDB'
    }
  ];

  const bufferFeatures = [
    {
      icon: '📡',
      title: 'Connection Monitor',
      description: 'Detects network drops and queues events',
      status: 'Active'
    },
    {
      icon: '🔄',
      title: 'Auto-Flush Buffer',
      description: 'Sends queued events on reconnection',
      status: 'Enabled'
    },
    {
      icon: '⚡',
      title: 'Priority Queuing',
      description: 'Critical events processed first',
      status: 'Active'
    },
    {
      icon: '💾',
      title: 'Persistent Storage',
      description: 'Survives browser refresh/restart',
      status: 'Enabled'
    }
  ];

  const middlewareCode = `trySendOrQueue(event) {
  if (!connected) {
    queue.push({
      ...event,
      timestamp: Date.now(),
      retryCount: 0
    })
  } else {
    socket.send(event)
  }
}

// On reconnect
onReconnect(() => {
  queue.forEach(event => {
    if (event.retryCount < maxRetries) {
      socket.send(event)
      event.retryCount++
    }
  })
})`;

  const queuedEvents = [
    { id: '1', type: 'message', user: 'Alice', content: 'Hello everyone!', status: 'Queued', retries: 0 },
    { id: '2', type: 'reaction', user: 'Bob', content: '❤️ Post #123', status: 'Sending...', retries: 1 },
    { id: '3', type: 'presence', user: 'Carol', content: 'Online status', status: 'Queued', retries: 0 },
    { id: '4', type: 'comment', user: 'David', content: 'Great post!', status: 'Sent', retries: 2 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sent': return 'bg-green-100 text-green-800';
      case 'Sending...': return 'bg-yellow-100 text-yellow-800';
      case 'Queued': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">🔄</span>
            <span>Sync Buffer Layer</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Buffer System</span>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>
        <p className="text-gray-600">
          Prevents event loss during poor connections or temporary server delays. 
          Buffers events (e.g., typing, sending message) until connection is restored.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Live Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{liveStats.queuedEvents}</div>
            <div className="text-sm text-blue-700">Queued Events</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-orange-600">{liveStats.bufferedMessages}</div>
            <div className="text-sm text-orange-700">Buffered Messages</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{liveStats.retryAttempts}</div>
            <div className="text-sm text-red-700">Retry Attempts</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-green-600">{liveStats.connectionStatus}</div>
            <div className="text-sm text-green-700">Connection</div>
          </div>
        </div>

        {/* Buffer Types */}
        <div>
          <h3 className="text-lg font-semibold mb-3">📦 Queued Event Store</h3>
          <div className="space-y-3">
            {bufferTypes.map((type, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{type.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-2">{type.type}</h4>
                    <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {type.retryLogic}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {type.storage}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Queue Monitor */}
        <div>
          <h3 className="text-lg font-semibold mb-3">🔍 Live Queue Monitor</h3>
          <div className="space-y-2">
            {queuedEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between bg-white border rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-800">{event.user}</span>
                  <span className="text-gray-600 text-sm">{event.content}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    Retries: {event.retries}
                  </Badge>
                  <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                    {event.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buffer Features */}
        <div>
          <h3 className="text-lg font-semibold mb-3">✨ Buffer Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bufferFeatures.map((feature, index) => (
              <div key={index} className="bg-white border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-800">{feature.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                    <Badge className="mt-2 bg-blue-100 text-blue-800">{feature.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Implementation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">🔧 Middleware Implementation</h3>
          <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
            <pre>{middlewareCode}</pre>
          </div>
        </div>

        {/* Visual Indicators */}
        <div>
          <h3 className="text-lg font-semibold mb-3">📊 Visual Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-orange-800">Reconnecting...</span>
              </div>
              <p className="text-sm text-orange-700">Visible during connection issues</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-blue-800">Offline Mode</span>
              </div>
              <p className="text-sm text-blue-700">UI shows buffered actions</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800">Queue Monitor</span>
              </div>
              <p className="text-sm text-green-700">Admin panel shows unsent actions</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            View Queue Status
          </button>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
            Force Retry All
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Clear Buffer
          </button>
        </div>
      </CardContent>
    </Card>
  );
};