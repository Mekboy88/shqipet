
import { supabase } from '@/integrations/supabase/client';

export class EdgeFunctionDebugService {
  /**
   * Test edge function connectivity with comprehensive error handling
   */
  static async testEdgeFunctionConnectivity(functionName: string): Promise<{
    success: boolean;
    debugInfo: any;
  }> {
    const requestId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      console.log(`🔍 [${requestId}] Testing edge function connectivity: ${functionName}`);
      
      // Test with a simple health check payload
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { 
          test: true,
          requestId: requestId
        },
        headers: {
          'Content-Type': 'application/json',
          'X-Test-Request': 'true'
        }
      });

      if (error) {
        console.error(`❌ [${requestId}] Edge function connectivity test failed:`, error);
        return {
          success: false,
          debugInfo: {
            error: error,
            errorMessage: error.message,
            functionName: functionName,
            timestamp: new Date().toISOString()
          }
        };
      }

      console.log(`✅ [${requestId}] Edge function connectivity test passed:`, data);
      return {
        success: true,
        debugInfo: {
          data: data,
          functionName: functionName,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error: any) {
      console.error(`❌ [${requestId}] Edge function connectivity test exception:`, error);
      return {
        success: false,
        debugInfo: {
          error: error.message,
          stack: error.stack,
          functionName: functionName,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Perform comprehensive health check on edge function
   */
  static async performHealthCheck(functionName: string, timeoutSeconds: number = 5): Promise<{
    success: boolean;
    debugInfo: any;
  }> {
    const requestId = `health_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      console.log(`🏥 [${requestId}] Performing health check on: ${functionName}`);
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Health check timeout after ${timeoutSeconds} seconds`)), timeoutSeconds * 1000);
      });

      // Create the actual health check request
      const healthCheckPromise = supabase.functions.invoke(functionName, {
        body: { 
          healthCheck: true,
          requestId: requestId,
          timestamp: new Date().toISOString()
        },
        headers: {
          'Content-Type': 'application/json',
          'X-Health-Check': 'true'
        }
      });

      // Race between timeout and actual request
      const { data, error } = await Promise.race([healthCheckPromise, timeoutPromise]) as any;

      if (error) {
        console.error(`❌ [${requestId}] Health check failed:`, error);
        
        // Analyze the error to provide better feedback
        let analysis = 'Unknown error';
        if (error.message?.includes('fetch')) {
          analysis = 'Network connectivity issue - edge function may not be deployed or accessible';
        } else if (error.message?.includes('timeout')) {
          analysis = 'Edge function is taking too long to respond';
        } else if (error.message?.includes('not found')) {
          analysis = 'Edge function may not be deployed or the name is incorrect';
        }
        
        return {
          success: false,
          debugInfo: {
            error: error,
            errorMessage: error.message,
            analysis: analysis,
            functionName: functionName,
            timeoutSeconds: timeoutSeconds,
            timestamp: new Date().toISOString(),
            errorDetails: {
              analysis: analysis,
              suggestion: analysis.includes('not be deployed') 
                ? 'Check if the edge function is properly deployed in Supabase'
                : analysis.includes('Network')
                ? 'Check your internet connection and Supabase project status'
                : 'Try again or check edge function logs'
            }
          }
        };
      }

      console.log(`✅ [${requestId}] Health check passed:`, data);
      return {
        success: true,
        debugInfo: {
          data: data,
          functionName: functionName,
          responseTime: timeoutSeconds,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error: any) {
      console.error(`❌ [${requestId}] Health check exception:`, error);
      
      let analysis = 'Unexpected error during health check';
      if (error.message?.includes('timeout')) {
        analysis = `Edge function did not respond within ${timeoutSeconds} seconds`;
      } else if (error.message?.includes('NetworkError')) {
        analysis = 'Network error - check internet connection and Supabase status';
      }
      
      return {
        success: false,
        debugInfo: {
          error: error.message,
          stack: error.stack,
          analysis: analysis,
          functionName: functionName,
          timeoutSeconds: timeoutSeconds,
          timestamp: new Date().toISOString(),
          errorDetails: {
            analysis: analysis,
            originalError: error.message
          }
        }
      };
    }
  }
}
