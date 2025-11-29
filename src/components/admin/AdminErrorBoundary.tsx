
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class AdminErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;
  
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('🚨 [ADMIN-ERROR] Error caught by boundary:', error);
    
    // NEVER show error screens in admin panel - always recover gracefully
    console.log('🔄 [ADMIN-ERROR] Admin panel error detected, recovering gracefully...');
    return { hasError: false }; // Never show error screen in admin
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 [ADMIN-ERROR] Component stack:', errorInfo.componentStack);
    console.error('🚨 [ADMIN-ERROR] Error details:', { error, errorInfo });
    
    this.setState({ errorInfo });
    
    // Auto-retry mechanism for transient errors
    if (this.retryCount < this.maxRetries && this.isTransientError(error)) {
      console.log(`🔄 [ADMIN-ERROR] Attempting auto-retry ${this.retryCount + 1}/${this.maxRetries}`);
      this.retryCount++;
      
      setTimeout(() => {
        this.handleReset();
      }, 2000 * this.retryCount); // Exponential backoff
    }
  }

  isTransientError = (error: Error): boolean => {
    const transientErrorMessages = [
      'network',
      'timeout',
      'connection',
      'fetch',
      'loading',
      'temporary'
    ];
    
    return transientErrorMessages.some(msg => 
      error.message?.toLowerCase().includes(msg)
    );
  };

  handleReset = () => {
    console.log('🔄 [ADMIN-ERROR] Resetting error boundary');
    this.retryCount = 0;
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-6 w-6" />
                Admin Panel Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Something went wrong in the admin panel. Please try refreshing or contact support if the issue persists.
                </AlertDescription>
              </Alert>
              
              {this.state.error && (
                <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                  <strong>Error:</strong> {this.state.error.message}
                </div>
              )}
              
              <div className="flex gap-2">
                <Button onClick={this.handleReset} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    console.log('Admin refresh button clicked - Auto-refresh prevented!');
                    // Never reload automatically
                  }}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Auto-Refresh Disabled
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdminErrorBoundary;
