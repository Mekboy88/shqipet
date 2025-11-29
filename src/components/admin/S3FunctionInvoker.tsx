import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, ExternalLink, RefreshCw } from 'lucide-react';
import supabase from '@/lib/relaxedSupabase';
import { useToast } from '@/hooks/use-toast';

interface InvocationResult {
  success: boolean;
  responseTime: number;
  timestamp: string;
  statusCode?: number;
  data?: any;
  error?: string;
  functionId: string;
}

const S3FunctionInvoker: React.FC = () => {
  const [invoking, setInvoking] = useState(false);
  const [results, setResults] = useState<InvocationResult[]>([]);
  const { toast } = useToast();

  const invokeS3Function = async () => {
    setInvoking(true);
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    
    try {
      console.log('🚀 Invoking s3-upload-fixed function...');
      
      const testPayload = {
        key: `test-invocation-${Date.now()}.jpg`,
        contentType: 'image/jpeg',
        folder: 'function-tests',
        fileSize: 2048000 // 2MB test
      };

      // Invoke the function
      const { data, error } = await supabase.functions.invoke('s3-upload-fixed', {
        body: testPayload
      });

      const responseTime = Date.now() - startTime;
      
      const result: InvocationResult = {
        success: !error,
        responseTime,
        timestamp,
        data: data,
        error: error?.message,
        functionId: 's3-upload-fixed'
      };

      setResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10
      
      if (error) {
        console.error('❌ Function invocation error:', error);
        toast({
          title: "Function Invocation Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('✅ Function invocation successful:', data);
        toast({
          title: "Function Invoked Successfully",
          description: `Response time: ${responseTime}ms. Check Supabase dashboard for logs.`,
          variant: "default"
        });
      }

    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      console.error('💥 Invocation failed:', error);
      
      const result: InvocationResult = {
        success: false,
        responseTime,
        timestamp,
        error: error.message,
        functionId: 's3-upload-fixed'
      };
      
      setResults(prev => [result, ...prev.slice(0, 9)]);
      
      toast({
        title: "Invocation Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setInvoking(false);
    }
  };

  const openSupabaseDashboard = () => {
    window.open('https://supabase.com/dashboard/project/rvwopaofedyieydwbghs/functions/s3-upload-fixed/invocations', '_blank');
  };

  const clearResults = () => {
    setResults([]);
    toast({
      title: "Results Cleared",
      description: "All invocation results have been cleared",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            S3 Upload Fixed - Function Invoker
          </span>
          {results.length > 0 && (
            <Badge variant="outline" className="ml-2">
              {results.length} invocation{results.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            onClick={invokeS3Function} 
            disabled={invoking}
            className="flex items-center gap-2"
          >
            {invoking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {invoking ? 'Invoking Function...' : 'Invoke s3-upload-fixed'}
          </Button>
          
          <Button 
            onClick={openSupabaseDashboard}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View Logs in Dashboard
          </Button>

          {results.length > 0 && (
            <Button 
              onClick={clearResults}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Clear Results
            </Button>
          )}
        </div>

        {results.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Invocations:</h4>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className="p-3 border rounded-lg bg-card"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={result.success ? "bg-success text-white" : "bg-destructive text-white"}
                      >
                        {result.success ? '✅ Success' : '❌ Failed'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {result.responseTime}ms
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {result.functionId}
                    </Badge>
                  </div>
                  
                  {result.error && (
                    <div className="mb-2 p-2 bg-destructive/10 rounded text-sm text-destructive">
                      <strong>Error:</strong> {result.error}
                    </div>
                  )}
                  
                  {result.data && (
                    <div className="p-2 bg-muted rounded">
                      <div className="text-xs text-muted-foreground mb-1">Response Data:</div>
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>Note:</strong> Each invocation will generate logs that appear in the Supabase dashboard.
            Use the "View Logs in Dashboard" button to see detailed function execution logs.
          </p>
          <p>
            <strong>Expected:</strong> This function should generate a presigned URL for S3 file uploads.
            Check the dashboard for detailed execution logs and any error messages.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default S3FunctionInvoker;