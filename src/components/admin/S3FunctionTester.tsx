import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TestTube, CheckCircle, XCircle, Clock } from 'lucide-react';
import supabase from '@/lib/relaxedSupabase';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  success: boolean;
  responseTime: number;
  timestamp: string;
  data?: any;
  error?: string;
}

const S3FunctionTester: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const { toast } = useToast();

  const testS3Function = async () => {
    setTesting(true);
    const startTime = Date.now();
    
    try {
      console.log('🧪 Testing s3-upload-fixed function...');
      
      const testPayload = {
        key: `test-file-${Date.now()}.jpg`,
        contentType: 'image/jpeg',
        folder: 'test-uploads',
        fileSize: 1024000 // 1MB test file
      };

      console.log('📤 Sending test payload:', testPayload);
      
      // Call the s3-upload-fixed function directly
      const { data, error } = await supabase.functions.invoke('s3-upload-fixed', {
        body: testPayload,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const responseTime = Date.now() - startTime;
      console.log('📥 Function response:', { data, error, responseTime });
      
      const result: TestResult = {
        success: !error,
        responseTime,
        timestamp: new Date().toISOString(),
        data: data,
        error: error?.message
      };

      setResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
      
      if (error) {
        toast({
          title: "Function Test Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Function Test Successful",
          description: `Response time: ${responseTime}ms`,
          variant: "default"
        });
      }

    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      const result: TestResult = {
        success: false,
        responseTime,
        timestamp: new Date().toISOString(),
        error: error.message
      };
      
      setResults(prev => [result, ...prev.slice(0, 9)]);
      
      toast({
        title: "Function Test Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  const getStatusColor = (success: boolean) => {
    return success ? "bg-success" : "bg-destructive";
  };

  const getStatusIcon = (success: boolean) => {
    return success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          S3 Upload Fixed Function Tester
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={testS3Function} 
            disabled={testing}
            className="flex items-center gap-2"
          >
            {testing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <TestTube className="h-4 w-4" />
            )}
            {testing ? 'Testing Function...' : 'Test s3-upload-fixed'}
          </Button>
          
          <Button 
            onClick={() => window.open('https://supabase.com/dashboard/project/rvwopaofedyieydwbghs/functions/s3-upload-fixed/invocations', '_blank')}
            variant="outline"
            className="flex items-center gap-2"
          >
            View in Supabase Dashboard
          </Button>
          
          {results.length > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {results.length} test{results.length !== 1 ? 's' : ''} run
            </Badge>
          )}
        </div>

        {results.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Test Results:</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className="p-3 border rounded-lg bg-card"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(result.success)} text-white`}>
                        {getStatusIcon(result.success)}
                        {result.success ? 'Success' : 'Failed'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {result.responseTime}ms
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {result.error && (
                    <div className="mt-2 p-2 bg-destructive/10 rounded text-sm text-destructive">
                      {result.error}
                    </div>
                  )}
                  
                  {result.data && (
                    <div className="mt-2 p-2 bg-muted rounded">
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default S3FunctionTester;