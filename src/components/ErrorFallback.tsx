import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  componentStack?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetError,
  componentStack 
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRetry = () => {
    if (resetError) {
      resetError();
    } else {
      // Fallback: just reload the current component
      window.location.reload();
    }
  };

  return (
    <div className="p-6 min-h-[400px] flex items-center justify-center">
      <Card className="border-amber-200 bg-amber-50 max-w-lg w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="h-6 w-6" />
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="default" className="border-amber-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              We encountered an unexpected error. Don't worry - your data is safe. 
              You can try refreshing or go back to the home page.
            </AlertDescription>
          </Alert>
          
          {error && (
            <details className="bg-white p-3 rounded text-sm border">
              <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                Error Details
              </summary>
              <div className="font-mono text-xs text-gray-600">
                <strong>Error:</strong> {error.message}
                {componentStack && (
                  <div className="mt-2">
                    <strong>Component Stack:</strong>
                    <pre className="mt-1 text-xs overflow-auto">{componentStack}</pre>
                  </div>
                )}
              </div>
            </details>
          )}
          
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleRetry} className="gap-2" variant="default">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button onClick={handleGoHome} variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorFallback;