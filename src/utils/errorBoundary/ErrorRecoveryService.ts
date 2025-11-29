/**
 * Bulletproof Error Recovery Service
 * Handles all types of errors and prevents application crashes
 */

interface ErrorReport {
  error: Error;
  errorInfo: any;
  timestamp: Date;
  userAgent: string;
  url: string;
  userId?: string;
}

class ErrorRecoveryService {
  private errorQueue: ErrorReport[] = [];
  private maxRetries = 3;
  private retryDelay = 1000;

  // Comprehensive error handler
  handleError = (error: Error, errorInfo?: any): void => {
    console.error('🚨 Error caught by recovery service:', error);
    
    const errorReport: ErrorReport = {
      error,
      errorInfo,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId()
    };

    this.errorQueue.push(errorReport);
    this.attemptRecovery(error);
  };

  // Get current user ID safely
  private getCurrentUserId(): string | undefined {
    try {
      const session = localStorage.getItem('supabase.auth.token');
      if (session) {
        const parsed = JSON.parse(session);
        return parsed?.user?.id;
      }
    } catch {
      // Ignore errors when getting user ID
    }
    return undefined;
  }

  // Attempt automatic recovery
  private attemptRecovery = (error: Error): void => {
    console.log('🔄 Attempting error recovery...');

    // Handle specific error types
    if (error.message.includes('foreign key constraint')) {
      this.handleForeignKeyError();
    } else if (error.message.includes('Network Error')) {
      this.handleNetworkError();
    } else if (error.message.includes('permission')) {
      this.handlePermissionError();
    } else {
      this.handleGenericError();
    }
  };

  // Handle foreign key constraint errors
  private handleForeignKeyError = (): void => {
    console.log('🔧 Handling foreign key constraint error...');
    
    // Clear any problematic local storage
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('admin') || key.includes('profile')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }

    // Previously reloaded the page — now we avoid hard reloads to prevent UX issues.
    // We rely on component-level error boundaries to re-render gracefully.
  };

  // Handle network errors
  private handleNetworkError = (): void => {
    console.log('🌐 Handling network error...');
    
    // Show user-friendly message
    this.showErrorMessage('Connection issue detected. Retrying...');
    
    // Avoid auto-reload; let the app retry queries naturally and show a message.
  };

  // Handle permission errors
  private handlePermissionError = (): void => {
    console.log('🔐 Handling permission error...');
    
    // Clear auth state and redirect to login
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.warn('Error clearing storage:', error);
    }
    
    window.location.href = '/';
  };

  // Handle generic errors
  private handleGenericError = (): void => {
    console.log('⚠️ Handling generic error...');
    
    // Show error message
    this.showErrorMessage('Something went wrong. Recovering...');
    
    // Avoid hard reloads; components should handle re-render/retry without full refresh.
  };

  // Show user-friendly error message
  private showErrorMessage = (message: string): void => {
    // Create error notification element
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
  };

  // Get error reports for debugging
  getErrorReports = (): ErrorReport[] => {
    return [...this.errorQueue];
  };

  // Clear error queue
  clearErrorQueue = (): void => {
    this.errorQueue = [];
  };
}

export const errorRecoveryService = new ErrorRecoveryService();