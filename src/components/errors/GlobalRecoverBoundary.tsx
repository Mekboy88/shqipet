// DO NOT EDIT — Global auto-recovery for data/render errors.
// Removing this re-introduces full-screen refresh prompts.

import React, { Component, ReactNode, createContext, useContext } from 'react';
import { AutoRecoverBanner } from './AutoRecoverBanner';

interface RecoveryState {
  hasError: boolean;
  errorBoundaryAttempt: number;
  lastErrorAt?: number;
  isRecovering: boolean;
  errorInfo?: any;
}

interface RecoveryContextValue {
  notifyTransientError: () => void;
  retryLazyImports: () => void;
  isRecovering: boolean;
  softRefreshKey: number;
}

const RecoveryContext = createContext<RecoveryContextValue>({
  notifyTransientError: () => {},
  retryLazyImports: () => {},
  isRecovering: false,
  softRefreshKey: 0
});

export const useGlobalRecovery = () => useContext(RecoveryContext);

interface Props {
  children: ReactNode;
  maxAttempts?: number;
}

const RECOVERY_DELAYS = [2000, 4000, 8000, 16000]; // 2s, 4s, 8s, 16s

export class GlobalRecoverBoundary extends Component<Props, RecoveryState> {
  private recoveryTimeout?: ReturnType<typeof setTimeout>;
  private softRefreshKey = 0;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorBoundaryAttempt: 0,
      isRecovering: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<RecoveryState> {
    console.warn('[GlobalRecover] Error boundary caught:', error.message);
    return {
      hasError: true,
      lastErrorAt: Date.now(),
      isRecovering: false
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { maxAttempts = 4 } = this.props;
    const attempt = this.state.errorBoundaryAttempt + 1;
    
    console.warn(`[GlobalRecover] Render error (attempt ${attempt}/${maxAttempts}):`, {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });

    if (attempt <= maxAttempts) {
      const delay = RECOVERY_DELAYS[Math.min(attempt - 1, RECOVERY_DELAYS.length - 1)];
      
      this.setState({
        errorBoundaryAttempt: attempt,
        isRecovering: true,
        errorInfo
      });

      this.recoveryTimeout = setTimeout(() => {
        this.setState({
          hasError: false,
          isRecovering: false,
          errorInfo: undefined
        });
        
        // Trigger soft refresh of queries
        this.softRefreshKey++;
        window.dispatchEvent(new CustomEvent('global-recovery-reset'));
      }, delay);
    } else {
      // Max attempts reached - keep error state but stop retrying
      console.error('[GlobalRecover] Max recovery attempts reached. Manual intervention may be required.');
    }
  }

  componentWillUnmount() {
    if (this.recoveryTimeout) {
      clearTimeout(this.recoveryTimeout);
    }
  }

  notifyTransientError = () => {
    // External notification of transient errors (e.g., promise rejections)
    this.setState({
      lastErrorAt: Date.now(),
      isRecovering: true
    });

    // Clear recovery state after a brief period
    setTimeout(() => {
      this.setState({ isRecovering: false });
    }, 3000);
  };

  retryLazyImports = () => {
    // Handle chunk load errors by triggering a soft refresh
    console.warn('[GlobalRecover] Retrying lazy imports due to chunk load error');
    this.notifyTransientError();
    
    // Force remount of lazy components
    this.softRefreshKey++;
    window.dispatchEvent(new CustomEvent('retry-lazy-imports'));
  };

  handleManualRetry = () => {
    this.setState({
      hasError: false,
      isRecovering: false,
      errorBoundaryAttempt: 0,
      errorInfo: undefined
    });
    
    this.softRefreshKey++;
    window.dispatchEvent(new CustomEvent('manual-recovery-retry'));
  };

  render() {
    const { hasError, isRecovering, lastErrorAt, errorBoundaryAttempt } = this.state;
    const { maxAttempts = 4 } = this.props;

    const contextValue: RecoveryContextValue = {
      notifyTransientError: this.notifyTransientError,
      retryLazyImports: this.retryLazyImports,
      isRecovering,
      softRefreshKey: this.softRefreshKey
    };

    const showBanner = isRecovering || (lastErrorAt && Date.now() - lastErrorAt < 30000);

    if (hasError && errorBoundaryAttempt >= maxAttempts) {
      // Fallback UI for max attempts reached
      return (
        <RecoveryContext.Provider value={contextValue}>
          <div className="min-h-screen flex flex-col">
            <AutoRecoverBanner
              isRecovering={false}
              attemptCount={errorBoundaryAttempt}
              maxAttempts={maxAttempts}
              onManualRetry={this.handleManualRetry}
              showManualRetry={true}
            />
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Ndodhi një gabim i përsëritur
                </h2>
                <p className="text-gray-600 mb-4">
                  Sistemi po përpiqet të rikthehen, por mund të nevojitet ndërhyrje manuale.
                </p>
                <button
                  onClick={this.handleManualRetry}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Provo përsëri tani
                </button>
              </div>
            </div>
          </div>
        </RecoveryContext.Provider>
      );
    }

    return (
      <RecoveryContext.Provider value={contextValue}>
        {showBanner && (
          <AutoRecoverBanner
            isRecovering={isRecovering}
            attemptCount={errorBoundaryAttempt}
            maxAttempts={maxAttempts}
          />
        )}
        <div key={this.softRefreshKey}>
          {this.props.children}
        </div>
      </RecoveryContext.Provider>
    );
  }
}
