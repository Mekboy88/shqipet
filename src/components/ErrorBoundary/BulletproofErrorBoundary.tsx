import React, { Component, ErrorInfo, ReactNode } from 'react';
import { errorRecoveryService } from '@/utils/errorBoundary/ErrorRecoveryService';

interface Props {
  children: ReactNode;
  fallbackComponent?: React.ComponentType<{ error: Error; retry: () => void }>;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

class BulletproofErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;
  private retryTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Error caught by BulletproofErrorBoundary:', error, errorInfo);
    
    this.setState({
      errorInfo
    });

    // Send to recovery service
    errorRecoveryService.handleError(error, errorInfo);

    // Auto-retry for certain error types
    this.attemptAutoRecover(error);
  }

  private attemptAutoRecover = (error: Error) => {
    const { retryCount } = this.state;
    
    if (retryCount < this.maxRetries) {
      const shouldAutoRetry = this.shouldAutoRetry(error);
      
      if (shouldAutoRetry) {
        console.log(`🔄 Auto-retry attempt ${retryCount + 1}/${this.maxRetries}`);
        
        this.retryTimeout = setTimeout(() => {
          this.setState(prevState => ({
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: prevState.retryCount + 1
          }));
        }, 2000 * (retryCount + 1)); // Exponential backoff
      }
    }
  };

  private shouldAutoRetry = (error: Error): boolean => {
    const retryableErrors = [
      'Network Error',
      'fetch',
      'ChunkLoadError',
      'Loading chunk',
      'Loading CSS chunk'
    ];
    
    return retryableErrors.some(errorType => 
      error.message.includes(errorType) || error.name.includes(errorType)
    );
  };

  private handleRetry = () => {
    console.log('🔄 Manual retry triggered');
    
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    });
  };

  private handleReload = () => {
    console.log('🔄 Page reload triggered');
    window.location.reload();
  };

  private handleGoHome = () => {
    console.log('🏠 Navigating to home via React Router');
    // Use React Router navigation instead of window.location.href
    window.history.pushState({}, '', '/');
    window.location.reload(); // Still need reload for error recovery
  };

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  render() {
    if (this.state.hasError) {
      const { error } = this.state;
      
      // Use custom fallback if provided
      if (this.props.fallbackComponent) {
        const FallbackComponent = this.props.fallbackComponent;
        return <FallbackComponent error={error!} retry={this.handleRetry} />;
      }

      // Default bulletproof fallback UI
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-card border rounded-lg shadow-lg p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.734 0L3.08 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-card-foreground mb-2">
                Something went wrong
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Don't worry, we're working on fixing this automatically.
              </p>
            </div>

            {/* Error details (development only) */}
            {import.meta.env.DEV && error && (
              <div className="mb-4 p-3 bg-muted rounded text-left">
                <p className="text-xs text-muted-foreground font-mono break-words">
                  {error.message}
                </p>
              </div>
            )}

            {/* Recovery options */}
            <div className="space-y-2">
              <button
                onClick={this.handleRetry}
                className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
              
              <button
                onClick={this.handleReload}
                className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors"
              >
                Reload Page
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full bg-muted text-muted-foreground px-4 py-2 rounded-md hover:bg-muted/90 transition-colors"
              >
                Go Home
              </button>
            </div>

            {/* Retry count indicator */}
            {this.state.retryCount > 0 && (
              <p className="text-xs text-muted-foreground mt-4">
                Retry attempts: {this.state.retryCount}/{this.maxRetries}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default BulletproofErrorBoundary;