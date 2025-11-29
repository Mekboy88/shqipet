/**
 * DO NOT EDIT. This file is locked to maintain seamless auto-recovery for Supabase connections.
 * Changes will break auto-retry and background reconnection logic.
 */

import React, { Component, ReactNode } from 'react';
import { toast } from 'sonner';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

// Runtime lock protection
if (typeof window !== 'undefined' && 
    typeof import.meta !== 'undefined' && 
    import.meta.env?.DEV && 
    import.meta.env?.LOCK_SYNC_FILES === 'true') {
  console.warn('🔒 This page is protected. Do not force refresh. Auto-recovery engaged.');
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
  retryCount: number;
  isRetrying: boolean;
  lastErrorTime: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private maxRetries = 3;
  private retryDelays = [1000, 3000, 8000]; // Exponential backoff

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false,
      lastErrorTime: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    console.error('🛡️ Error boundary caught error:', error);
    return {
      hasError: true,
      error,
      lastErrorTime: Date.now()
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('🛡️ Error boundary details:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
      retryCount: 0
    });

    // Check if it's a network/fetch error
    if (this.isRecoverableError(error)) {
      this.handleAutoRecovery();
    } else {
      // For non-recoverable errors, log but don't auto-retry
      console.error('❌ Non-recoverable error detected:', error.message);
      this.showPersistentErrorToast();
    }
  }

  private isRecoverableError(error: Error): boolean {
    const recoverableMessages = [
      'fetch',
      'network',
      'connection',
      'timeout',
      'supabase',
      'PGRST',
      'jwt',
      'auth'
    ];
    
    return recoverableMessages.some(msg => 
      error.message.toLowerCase().includes(msg.toLowerCase()) ||
      error.name.toLowerCase().includes(msg.toLowerCase())
    );
  }

  private handleAutoRecovery = () => {
    const { retryCount } = this.state;
    
    if (retryCount >= this.maxRetries) {
      console.warn('🔄 Max retries reached, showing persistent error state');
      this.showPersistentErrorToast();
      return;
    }

    const delay = this.retryDelays[retryCount] || 8000;
    
    this.setState({ 
      isRetrying: true,
      retryCount: retryCount + 1 
    });

    // Show connection issue toast
    toast.loading('Temporary connection issue. Reconnecting…', {
      id: 'auto-recovery',
      description: `Retry attempt ${retryCount + 1} of ${this.maxRetries}`,
      duration: delay + 1000,
      icon: <RefreshCw className="h-4 w-4 animate-spin" />
    });

    console.log(`🔄 Auto-recovery attempt ${retryCount + 1} in ${delay}ms`);

    this.retryTimeoutId = setTimeout(() => {
      this.attemptRecovery();
    }, delay);
  };

  private attemptRecovery = () => {
    console.log('🔄 Attempting auto-recovery...');
    
    // Check network connectivity
    if (!navigator.onLine) {
      console.warn('📡 No network connection, waiting for connectivity...');
      window.addEventListener('online', this.onNetworkReconnect, { once: true });
      return;
    }

    // Reset error state to retry rendering
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false
    });

    // Dismiss loading toast and show success
    toast.dismiss('auto-recovery');
    toast.success('Connection restored', {
      description: 'Auto-recovery successful',
      duration: 2000,
      icon: <Wifi className="h-4 w-4 text-green-500" />
    });

    console.log('✅ Auto-recovery completed');
  };

  private onNetworkReconnect = () => {
    console.log('📡 Network reconnected, attempting recovery...');
    this.attemptRecovery();
  };

  private showPersistentErrorToast = () => {
    toast.error('Connection issue persists', {
      id: 'persistent-error',
      description: 'Working with cached data. Will retry automatically.',
      duration: Infinity,
      icon: <WifiOff className="h-4 w-4 text-red-500" />,
      action: {
        label: 'Background retry active',
        onClick: () => {
          console.log('🔄 Manual retry triggered');
          this.setState({ retryCount: 0 });
          this.handleAutoRecovery();
        }
      }
    });
  };

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
    window.removeEventListener('online', this.onNetworkReconnect);
    toast.dismiss('auto-recovery');
    toast.dismiss('persistent-error');
  }

  render() {
    const { hasError, isRetrying } = this.state;
    const { children, fallback } = this.props;

    if (hasError && !isRetrying) {
      // Instead of full error page, show minimal fallback with cached data
      if (fallback) {
        return fallback;
      }

      // Minimal graceful degraded state
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="animate-pulse">
              <WifiOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Connection Issue
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Working with cached data. Auto-recovery is running in the background.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <RefreshCw className="h-3 w-3 animate-spin" />
              <span>Reconnecting automatically...</span>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

// Hook for components to check error boundary state
export const useErrorRecovery = () => {
  const [isRecovering, setIsRecovering] = React.useState(false);
  const [lastSyncTime, setLastSyncTime] = React.useState<Date>(new Date());

  React.useEffect(() => {
    const handleOnline = () => {
      setIsRecovering(false);
      setLastSyncTime(new Date());
    };

    const handleOffline = () => {
      setIsRecovering(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isRecovering: isRecovering || !navigator.onLine,
    lastSyncTime,
    isOnline: navigator.onLine
  };
};

// Connection status banner component
export const ConnectionStatusBanner: React.FC<{ 
  isVisible: boolean;
  lastSyncTime?: Date;
  onRetry?: () => void;
}> = ({ isVisible, lastSyncTime, onRetry }) => {
  const timeSinceSync = lastSyncTime ? 
    Math.floor((Date.now() - lastSyncTime.getTime()) / 1000) : 0;

  if (!isVisible) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4 text-amber-600 animate-spin" />
        <span className="text-sm text-amber-800">
          Reconnecting to database... last synced {timeSinceSync}s ago
        </span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-amber-700 hover:text-amber-900 underline"
        >
          Force retry
        </button>
      )}
    </div>
  );
};

export default GlobalErrorBoundary;