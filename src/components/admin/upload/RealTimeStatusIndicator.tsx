import React, { useState } from 'react';
import { Wifi, WifiOff, Activity, BookOpen, Clock, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface ChangeHistoryItem {
  id: string;
  timestamp: Date;
  user: { name: string | null; role: string | null };
  action: string;
  setting: string;
  value: any;
  enabled: boolean;
}

interface RealTimeStatusIndicatorProps {
  connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'reconnecting';
  lastUpdated?: Date | null;
  lastSavedBy?: { name: string | null; role: string | null } | null;
  changeHistory?: ChangeHistoryItem[];
}

const RealTimeStatusIndicator: React.FC<RealTimeStatusIndicatorProps> = ({ 
  connectionStatus, 
  lastUpdated,
  lastSavedBy,
  changeHistory = []
}) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second for real-time display
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatSettingName = (setting: string) => {
    return setting.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getChangeColor = (enabled: boolean) => {
    return enabled ? 'text-green-600' : 'text-red-600';
  };

  const getChangeBadgeColor = (enabled: boolean) => {
    return enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  };
  const getStatusInfo = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: <Wifi className="w-4 h-4 text-green-500" />,
          text: 'Real-time Connected',
          textColor: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          description: 'All changes sync instantly to Supabase'
        };
      case 'connecting':
      case 'reconnecting':
        return {
          icon: <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />,
          text: connectionStatus === 'reconnecting' ? 'Reconnecting...' : 'Connecting...',
          textColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          description: connectionStatus === 'reconnecting' ? 'Auto-reconnecting to database' : 'Connecting to real-time database'
        };
      case 'disconnected':
        return {
          icon: <WifiOff className="w-4 h-4 text-red-500" />,
          text: 'Disconnected',
          textColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          description: 'Real-time sync unavailable'
        };
    }
  };

  const status = getStatusInfo();

  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg border ${status.bgColor} ${status.borderColor}`}>
      <div className="flex items-center gap-2">
        {status.icon}
        <span className={`text-sm font-medium ${status.textColor}`}>
          {status.text}
        </span>
      </div>
      
      {connectionStatus === 'connected' && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-green-600">
            <div className="relative flex items-center">
              <Activity className="w-4 h-4" strokeWidth={3} />
              <Activity className="w-4 h-4 -ml-1" strokeWidth={3} />
              <Activity className="w-4 h-4 -ml-1" strokeWidth={3} />
              <Activity className="w-4 h-4 -ml-1" strokeWidth={3} />
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent w-2 animate-[icon-scan_3s_ease-in-out_infinite] opacity-80"></div>
              </div>
            </div>
            <span className="font-medium">LIVE</span>
          </div>
          
          <div className="text-xs text-gray-500">
            Active sync • Real-time enabled
          </div>
        </div>
      )}
      
      {/* Last Updated and Admin Info */}
      <div className="flex flex-col gap-1">
        {(lastUpdated || (changeHistory.length > 0)) && (
          <div className="text-xs text-gray-600 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last saved: {(() => {
              // Use the most recent change timestamp if available, otherwise use lastUpdated
              const mostRecentTime = changeHistory.length > 0 
                ? changeHistory[0].timestamp 
                : lastUpdated;
              return mostRecentTime ? mostRecentTime.toLocaleTimeString() : 'Never';
            })()}
          </div>
        )}
        {(lastSavedBy || (changeHistory.length > 0 && changeHistory[0].user)) && (
          <div className="text-xs text-blue-600 font-medium flex items-center gap-1">
            <User className="w-3 h-3" />
            Changed by: {(() => {
              // Use the most recent change user if available, otherwise use lastSavedBy
              const mostRecentUser = changeHistory.length > 0 
                ? changeHistory[0].user 
                : lastSavedBy;
              return mostRecentUser?.name || 'Unknown';
            })()} 
            {(() => {
              const mostRecentUser = changeHistory.length > 0 
                ? changeHistory[0].user 
                : lastSavedBy;
              return mostRecentUser?.role && (
                <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] uppercase font-semibold">
                  {mostRecentUser.role}
                </span>
              );
            })()}
          </div>
        )}
      </div>

      {/* Change History Button */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors">
            <BookOpen className="w-3 h-3" />
            History ({changeHistory.length})
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Change History - Last 30 Changes
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96 pr-4">
            <div className="space-y-3">
              {changeHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No changes recorded yet
                </div>
              ) : (
                changeHistory.slice(0, 30).map((change) => (
                  <div key={change.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getChangeBadgeColor(change.enabled)}>
                          {change.enabled ? 'ENABLED' : 'DISABLED'}
                        </Badge>
                        <span className={`font-medium ${getChangeColor(change.enabled)}`}>
                          {formatSettingName(change.setting)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {change.timestamp.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {change.user.name || 'Unknown'}
                      </span>
                      {change.user.role && (
                        <Badge variant="outline" className="text-xs">
                          {change.user.role.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                    
                    <div className={`text-sm font-medium ${getChangeColor(change.enabled)}`}>
                      {change.action}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      <div className="text-xs text-gray-500">
        {status.description}
      </div>
    </div>
  );
};

export default RealTimeStatusIndicator;