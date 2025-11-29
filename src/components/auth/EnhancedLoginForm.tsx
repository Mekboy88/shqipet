import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export const EnhancedLoginForm: React.FC = () => {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const getErrorMessage = (error: any): string => {
    if (!error) return 'An unexpected error occurred';
    
    const message = error.message || error.toString();
    
    // Map technical errors to user-friendly messages
    if (message.includes('Database error granting user')) {
      return 'Authentication system is being repaired. Please try again in a moment.';
    }
    if (message.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please check your credentials.';
    }
    if (message.includes('Too many requests')) {
      return 'Too many login attempts. Please wait a moment before trying again.';
    }
    if (message.includes('Network')) {
      return 'Network connection error. Please check your internet connection.';
    }
    if (message.includes('timeout')) {
      return 'Login request timed out. Please try again.';
    }
    
    return 'Login failed. Please try again or contact support if the problem persists.';
  };

  const handleRetry = async () => {
    if (retryCount >= maxRetries) {
      setError('Maximum retry attempts reached. Please try again later or contact support.');
      return;
    }
    
    setRetryCount(prev => prev + 1);
    setError(null);
    
    // Add progressive delay between retries
    const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
    
    toast.info(`Retrying in ${delay / 1000} seconds...`);
    
    setTimeout(() => {
      handleSubmit();
    }, delay);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signIn(formData.email, formData.password);
      
      // Success - signIn doesn't return anything on success, just completes
      toast.success('Login successful!');
      setRetryCount(0); // Reset retry count on success
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      const friendlyMessage = getErrorMessage(error);
      setError(friendlyMessage);
      
      // Show different toasts based on error type
      if (error.message?.includes('Database error granting user')) {
        toast.error('Authentication system issue detected. Automatic repair in progress...');
      } else if (retryCount < maxRetries) {
        toast.error(`${friendlyMessage} (Attempt ${retryCount + 1}/${maxRetries + 1})`);
      } else {
        toast.error(friendlyMessage);
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Your password"
              disabled={loading}
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                {retryCount < maxRetries && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    disabled={loading}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Retry
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-2">
            <Button 
              type="submit" 
              disabled={loading || !formData.email || !formData.password}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            {retryCount > 0 && retryCount < maxRetries && (
              <div className="text-sm text-center text-muted-foreground">
                Attempt {retryCount + 1} of {maxRetries + 1}
              </div>
            )}
          </div>
        </form>

        {retryCount >= maxRetries && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
            <p className="text-sm text-orange-800">
              Having trouble signing in? Our authentication system has been enhanced with automatic error recovery. 
              If you continue to experience issues, please contact support.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};