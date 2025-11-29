import React, { useEffect, useState } from 'react';
import { Clock, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SessionTimeoutWarningProps {
  isVisible: boolean;
  minutesLeft: number;
  isRefreshing: boolean;
  onExtend: () => void;
  onDismiss: () => void;
}

export const SessionTimeoutWarning: React.FC<SessionTimeoutWarningProps> = ({
  isVisible,
  minutesLeft,
  isRefreshing,
  onExtend,
  onDismiss
}) => {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (isVisible && minutesLeft > 0) {
      setSecondsLeft(minutesLeft * 60);
      
      const interval = setInterval(() => {
        setSecondsLeft(prev => Math.max(0, prev - 1));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isVisible, minutesLeft]);

  if (!isVisible) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-orange-50 border border-orange-200 rounded-lg shadow-lg px-4 py-3 max-w-md">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Clock className="h-5 w-5 text-orange-500" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-orange-800 text-sm">
              Session Expiring Soon
            </h4>
            <p className="text-orange-700 text-xs mt-1">
              You will be logged out in{' '}
              <span className="font-mono font-bold">{formatTime(secondsLeft)}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onExtend}
              disabled={isRefreshing}
              className="text-orange-700 border-orange-300 hover:bg-orange-100"
            >
              {isRefreshing ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                'Extend'
              )}
            </Button>
            <button
              onClick={onDismiss}
              className="text-orange-400 hover:text-orange-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};