/**
 * Error Recovery Provider
 * Provides global error recovery context
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { errorRecoveryService } from '@/utils/errorBoundary/ErrorRecoveryService';

interface ErrorRecoveryContextType {
  hasError: boolean;
  errorCount: number;
  lastError: Error | null;
  clearErrors: () => void;
  reportError: (error: Error) => void;
}

const ErrorRecoveryContext = createContext<ErrorRecoveryContextType | undefined>(undefined);

export const useErrorRecovery = () => {
  const context = useContext(ErrorRecoveryContext);
  if (!context) {
    throw new Error('useErrorRecovery must be used within ErrorRecoveryProvider');
  }
  return context;
};

interface Props {
  children: React.ReactNode;
}

export const ErrorRecoveryProvider: React.FC<Props> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [lastError, setLastError] = useState<Error | null>(null);

  const clearErrors = () => {
    setHasError(false);
    setErrorCount(0);
    setLastError(null);
    errorRecoveryService.clearErrorQueue();
  };

  const reportError = (error: Error) => {
    console.error('🚨 Error reported to recovery provider:', error);
    
    setHasError(true);
    setErrorCount(prev => prev + 1);
    setLastError(error);
    
    errorRecoveryService.handleError(error);
  };

  // Global error listeners
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      reportError(new Error(event.message));
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      reportError(new Error(`Unhandled promise rejection: ${event.reason}`));
    };

    // Note: We intentionally do NOT override console.error to avoid false positives
    // from non-critical logs (e.g., network 404s). Global window error listeners below
    // will still capture real runtime exceptions.

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const contextValue: ErrorRecoveryContextType = {
    hasError,
    errorCount,
    lastError,
    clearErrors,
    reportError
  };

  return (
    <ErrorRecoveryContext.Provider value={contextValue}>
      {children}
    </ErrorRecoveryContext.Provider>
  );
};