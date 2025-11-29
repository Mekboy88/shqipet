import { supabase } from '@/integrations/supabase/client';

export class EdgeFunctionService {
  /**
   * Test if an edge function is available and responding
   */
  static async testFunctionAvailability(functionName: string): Promise<{ available: boolean; responseTime?: number; error?: string }> {
    const startTime = Date.now();
    
    try {
      console.log(`🔍 Testing availability of edge function: ${functionName}`);
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const responseTime = Date.now() - startTime;
      
      if (error) {
        console.error(`❌ Function ${functionName} test failed:`, error);
        return {
          available: false,
          responseTime,
          error: error.message
        };
      }
      
      console.log(`✅ Function ${functionName} is available (${responseTime}ms):`, data);
      return {
        available: true,
        responseTime
      };
      
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      console.error(`❌ Function ${functionName} test error:`, error);
      
      return {
        available: false,
        responseTime,
        error: error.message
      };
    }
  }

  /**
   * Perform comprehensive health check on multiple functions
   */
  static async performSystemHealthCheck(): Promise<{
    overall: 'healthy' | 'degraded' | 'unhealthy';
    functions: Record<string, { available: boolean; responseTime?: number; error?: string }>;
  }> {
    const functionsToTest = ['s3-upload', 'wasabi-proxy', 'wasabi-get-url'];
    const results: Record<string, { available: boolean; responseTime?: number; error?: string }> = {};
    
    console.log('🏥 Performing system health check...');
    
    // Test all functions in parallel
    const promises = functionsToTest.map(async (functionName) => {
      const result = await this.testFunctionAvailability(functionName);
      results[functionName] = result;
      return result;
    });
    
    await Promise.all(promises);
    
    // Determine overall health
    const availableFunctions = Object.values(results).filter(r => r.available).length;
    const totalFunctions = functionsToTest.length;
    
    let overall: 'healthy' | 'degraded' | 'unhealthy';
    if (availableFunctions === totalFunctions) {
      overall = 'healthy';
    } else if (availableFunctions > 0) {
      overall = 'degraded';
    } else {
      overall = 'unhealthy';
    }
    
    console.log(`🏥 System health check complete: ${overall} (${availableFunctions}/${totalFunctions} functions available)`);
    
    return {
      overall,
      functions: results
    };
  }

  /**
   * Call GET /identity on s3-upload to verify AWS credentials
   */
  static async getS3AwsIdentity(): Promise<{ ok: boolean; account?: string; arn?: string; region?: string; bucket?: string; error?: string }>{
    return { ok: false, error: 'Backend disabled' };
  }
}