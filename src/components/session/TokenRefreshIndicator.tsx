import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface TokenRefreshIndicatorProps {
  isRefreshing: boolean;
  lastRefresh: Date | null;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const TokenRefreshIndicator: React.FC<TokenRefreshIndicatorProps> = ({
  isRefreshing,
  lastRefresh,
  position = 'top-right'
}) => {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isRefreshing && lastRefresh) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isRefreshing, lastRefresh]);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  if (!isRefreshing && !showSuccess) return null;

  return (
    <div className={`fixed ${positionClasses[position]} z-40 transition-all duration-300`}>
      <div className={`rounded-lg px-3 py-2 shadow-lg ${
        isRefreshing 
          ? 'bg-blue-50 border border-blue-200' 
          : 'bg-green-50 border border-green-200'
      }`}>
        <div className="flex items-center gap-2">
          <RefreshCw 
            className={`h-4 w-4 ${
              isRefreshing 
                ? 'text-blue-500 animate-spin' 
                : 'text-green-500'
            }`} 
          />
          <span className={`text-xs font-medium ${
            isRefreshing 
              ? 'text-blue-700' 
              : 'text-green-700'
          }`}>
            {isRefreshing ? 'Refreshing session...' : 'Session refreshed'}
          </span>
        </div>
      </div>
    </div>
  );
};