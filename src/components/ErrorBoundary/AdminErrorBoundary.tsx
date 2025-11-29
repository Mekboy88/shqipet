// DO NOT EDIT: Critical Admin error recovery. Prevents white screen crashes.

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  isRecovering: boolean;
}

/**
 * Admin-specific error boundary that prevents white screens
 * Shows compact banner and auto-recovers with safe defaults
 */
export class AdminErrorBoundary extends Component<Props, State> {
  private recoveryTimeout?: ReturnType<typeof setTimeout>;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, isRecovering: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('[Admin] Error boundary caught:', error);
    return { hasError: true, error, isRecovering: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[Admin] Component error details:', { error, errorInfo });
    
    // Auto-recovery after 2 seconds
    this.recoveryTimeout = setTimeout(() => {
      this.setState({ isRecovering: true });
      
      // Reset with safe defaults after brief loading state
      setTimeout(() => {
        this.setState({ hasError: false, error: undefined, isRecovering: false });
        
        // Trigger data refetch if possible
        window.dispatchEvent(new CustomEvent('admin-error-recovery'));
      }, 1000);
    }, 2000);
  }

  componentWillUnmount() {
    if (this.recoveryTimeout) {
      clearTimeout(this.recoveryTimeout);
    }
  }

  handleManualRetry = () => {
    this.setState({ hasError: false, error: undefined, isRecovering: false });
    window.dispatchEvent(new CustomEvent('admin-error-recovery'));
  };

  render() {
    if (this.state.hasError) {
      if (this.state.isRecovering) {
        return (
          <Alert className="border-blue-200 bg-blue-50">
            <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
            <AlertDescription className="text-blue-800">
              Admin panel recovered from an error. Data is reloading...
            </AlertDescription>
          </Alert>
        );
      }

      return (
        <div className="space-y-4">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Something went wrong in the admin panel. Auto-recovery in progress...
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={this.handleManualRetry}
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry Now
            </Button>
          </div>

          {this.props.fallback && (
            <div className="opacity-50 pointer-events-none">
              {this.props.fallback}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component for wrapping admin components
 */
export function withAdminErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: T) => (
    <AdminErrorBoundary fallback={fallback}>
      <Component {...props} />
    </AdminErrorBoundary>
  );

  WrappedComponent.displayName = `withAdminErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

// Also provide a default export for compatibility with default imports
export default AdminErrorBoundary;