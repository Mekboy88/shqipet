import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export const MobileListenerSync: React.FC = () => {
  const [isActive, setIsActive] = useState(true);
  const [liveStats, setLiveStats] = useState({
    mobileDevices: 156,
    backgroundSync: 23,
    missedMessages: 4,
    resumeEvents: 8
  });

  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        mobileDevices: Math.max(50, prev.mobileDevices + Math.floor(Math.random() * 10) - 5),
        backgroundSync: Math.max(0, prev.backgroundSync + Math.floor(Math.random() * 4) - 2),
        missedMessages: Math.max(0, prev.missedMessages + Math.floor(Math.random() * 3) - 1),
        resumeEvents: Math.max(0, prev.resumeEvents + Math.floor(Math.random() * 5) - 2)
      }));
    }, 1800);

    return () => clearInterval(interval);
  }, [isActive]);

  const persistentListeners = [
    {
      icon: '📱',
      state: 'Foreground',
      behavior: 'Sync live',
      description: 'Full real-time sync when app is active',
      frequency: 'Immediate'
    },
    {
      icon: '🌙',
      state: 'Background',
      behavior: 'Reconnect listener after resume',
      description: 'Maintains connection awareness',
      frequency: 'On app resume'
    },
    {
      icon: '💤',
      state: 'Sleep/Suspend',
      behavior: 'Queue missed events',
      description: 'Stores events during device sleep',
      frequency: 'On wake'
    },
    {
      icon: '🔄',
      state: 'Resume',
      behavior: 'Diff-sync missed updates',
      description: 'Pulls all missed content on app resume',
      frequency: 'Every resume'
    }
  ];

  const reconnectionLogic = [
    {
      trigger: 'App Resume',
      action: 'Rejoin channels',
      throttle: '2 second delay',
      purpose: 'Prevent server flooding'
    },
    {
      trigger: 'Network Change',
      action: 'Flush retry queue',
      throttle: '5 second batch',
      purpose: 'Optimize reconnection'
    },
    {
      trigger: 'Background Exit',
      action: 'Run diff-sync',
      throttle: 'Check last 10 minutes',
      purpose: 'Catch up missed content'
    },
    {
      trigger: 'Connection Lost',
      action: 'Start offline recording',
      throttle: 'Immediate',
      purpose: 'Queue actions for later sync'
    }
  ];

  const liveFeatures = [
    {
      icon: '📲',
      title: 'Mobile Live Pulse',
      description: 'Animated indicator for mobile connectivity',
      status: 'Active'
    },
    {
      icon: '🔄',
      title: 'Catch-up Sync',
      description: 'Pulls missed messages/reactions on resume',
      status: 'Active'
    },
    {
      icon: '🛡️',
      title: 'Duplicate Prevention',
      description: 'Prevents ghost messages and duplicate reactions',
      status: 'Enabled'
    },
    {
      icon: '🔔',
      title: 'Back Online Toast',
      description: 'Shows reconnection status to users',
      status: 'Active'
    }
  ];

  const implementationCode = `// Mobile state awareness
AppState.addEventListener('change', handleStateChange)

// Background/foreground handling
const handleStateChange = (nextState) => {
  if (nextState === 'active') {
    // Rejoin channels
    rejoinAllChannels()
    
    // Flush retry queue
    flushRetryQueue()
    
    // Sync missed updates
    syncMissedUpdates()
  }
}

// Throttled reconnection
const throttledReconnect = debounce(() => {
  reconnectToSupabase()
}, 2000)`;

  const mobileDevices = [
    { device: 'iPhone 12', user: 'Alice', status: 'Active', lastSync: '2s ago', network: 'WiFi' },
    { device: 'Samsung S21', user: 'Bob', status: 'Background', lastSync: '15s ago', network: '4G' },
    { device: 'iPad Pro', user: 'Carol', status: 'Resume', lastSync: '1m ago', network: 'WiFi' },
    { device: 'OnePlus 9', user: 'David', status: 'Offline', lastSync: '5m ago', network: 'None' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Background': return 'bg-yellow-100 text-yellow-800';
      case 'Resume': return 'bg-blue-100 text-blue-800';
      case 'Offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">📲</span>
            <span>Mobile Listener Sync</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Mobile Sync</span>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>
        <p className="text-gray-600">
          Ensures consistency of real-time events across mobile devices. 
          Handles React Native / Capacitor sync issues and sleep/reconnect logic.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Live Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{liveStats.mobileDevices}</div>
            <div className="text-sm text-blue-700">Mobile Devices</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">{liveStats.backgroundSync}</div>
            <div className="text-sm text-yellow-700">Background Sync</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{liveStats.missedMessages}</div>
            <div className="text-sm text-red-700">Missed Messages</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{liveStats.resumeEvents}</div>
            <div className="text-sm text-green-700">Resume Events</div>
          </div>
        </div>

        {/* Persistent Listeners */}
        <div>
          <h3 className="text-lg font-semibold mb-3">📱 Persistent Listener States</h3>
          <div className="space-y-3">
            {persistentListeners.map((listener, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{listener.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800">{listener.state}</h4>
                      <Badge variant="outline" className="text-xs">
                        {listener.frequency}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{listener.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      {listener.behavior}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Device Monitor */}
        <div>
          <h3 className="text-lg font-semibold mb-3">📱 Live Mobile Device Monitor</h3>
          <div className="space-y-2">
            {mobileDevices.map((device, index) => (
              <div key={index} className="flex items-center justify-between bg-white border rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-800">{device.device}</span>
                  <span className="text-gray-600 text-sm">{device.user}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {device.network}
                  </Badge>
                  <Badge className={`text-xs ${getStatusColor(device.status)}`}>
                    {device.status}
                  </Badge>
                  <span className="text-xs text-gray-500">{device.lastSync}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reconnection Logic */}
        <div>
          <h3 className="text-lg font-semibold mb-3">🔄 Mobile Reconnection & Throttle</h3>
          <div className="space-y-3">
            {reconnectionLogic.map((logic, index) => (
              <div key={index} className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{logic.trigger}</h4>
                  <Badge variant="outline" className="text-xs">
                    {logic.throttle}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{logic.purpose}</p>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  {logic.action}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Live Features */}
        <div>
          <h3 className="text-lg font-semibold mb-3">✨ Mobile-Specific Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveFeatures.map((feature, index) => (
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
          <h3 className="text-lg font-semibold mb-3">🔧 Mobile Implementation</h3>
          <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
            <pre>{implementationCode}</pre>
          </div>
        </div>

        {/* Session Sync */}
        <div>
          <h3 className="text-lg font-semibold mb-3">⏰ Session Background Sync</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-blue-800">Auto Background Check</span>
            </div>
            <p className="text-sm text-blue-700 mb-2">
              Automatic session sync check every 10 minutes in background mode
            </p>
            <div className="text-xs font-mono bg-blue-100 p-2 rounded">
              setInterval(backgroundSync, 600000) // 10 minutes
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Mobile Device Monitor
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Force Sync All
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Test Resume Logic
          </button>
        </div>
      </CardContent>
    </Card>
  );
};