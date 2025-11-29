import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseHealth {
  id: string;
  name: string;
  type: 'auth' | 'table' | 'storage' | 'function' | 'edge_function';
  status: 'connected' | 'error' | 'slow' | 'disconnected';
  responseTime?: number;
  lastChecked: Date;
  errors: string[];
  metadata: Record<string, any>;
}

export const useDatabaseHealthScanning = () => {
  const [dbHealth, setDbHealth] = useState<DatabaseHealth[]>([]);
  const [overallStatus, setOverallStatus] = useState<'healthy' | 'degraded' | 'critical'>('healthy');
  
  useEffect(() => {
    const scanDatabaseHealth = async () => {
      const healthResults: DatabaseHealth[] = [];
      let criticalIssues = 0;
      let minorIssues = 0;
      
      // Test Authentication System
      try {
        const authStartTime = Date.now();
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        const authResponseTime = Date.now() - authStartTime;
        
        healthResults.push({
          id: 'auth-system',
          name: 'Authentication System',
          type: 'auth',
          status: authError ? 'error' : 'connected',
          responseTime: authResponseTime,
          lastChecked: new Date(),
          errors: authError ? [authError.message] : [],
          metadata: {
            hasSession: !!session,
            sessionExpiry: session?.expires_at,
            userCount: session ? 1 : 0
          }
        });
        
        if (authError) criticalIssues++;
        else if (authResponseTime > 2000) minorIssues++;
        
      } catch (error) {
        healthResults.push({
          id: 'auth-system',
          name: 'Authentication System',
          type: 'auth',
          status: 'error',
          lastChecked: new Date(),
          errors: [`Auth system failure: ${error}`],
          metadata: {}
        });
        criticalIssues++;
      }
      
      // Test Core Tables
      const coreTables = [
        'profiles', 'user_roles', 'admin_actions', 'posts', 'comments',
        'analytics_events', 'app_settings', 'admin_notifications'
      ];
      
      for (const tableName of coreTables) {
        try {
          const startTime = Date.now();
          const { data, error, count } = await supabase
            .from(tableName as any)
            .select('*', { count: 'exact', head: true })
            .limit(1);
          
          const responseTime = Date.now() - startTime;
          
          healthResults.push({
            id: `table-${tableName}`,
            name: `Table: ${tableName}`,
            type: 'table',
            status: error ? 'error' : responseTime > 3000 ? 'slow' : 'connected',
            responseTime,
            lastChecked: new Date(),
            errors: error ? [error.message] : [],
            metadata: {
              recordCount: count || 0,
              accessible: !error,
              tableName
            }
          });
          
          if (error) {
            if (error.code === 'PGRST116') {
              criticalIssues++; // Table doesn't exist or no access
            } else {
              minorIssues++; // Other issues
            }
          }
          
        } catch (error) {
          healthResults.push({
            id: `table-${tableName}`,
            name: `Table: ${tableName}`,
            type: 'table',
            status: 'error',
            lastChecked: new Date(),
            errors: [`Table access failed: ${error}`],
            metadata: { tableName, accessible: false }
          });
          criticalIssues++;
        }
      }
      
      // Test Storage Access
      try {
        const startTime = Date.now();
        const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
        const responseTime = Date.now() - startTime;
        
        healthResults.push({
          id: 'storage-system',
          name: 'Storage System',
          type: 'storage',
          status: storageError ? 'error' : 'connected',
          responseTime,
          lastChecked: new Date(),
          errors: storageError ? [storageError.message] : [],
          metadata: {
            bucketsCount: buckets?.length || 0,
            buckets: buckets?.map(b => b.name) || []
          }
        });
        
        if (storageError) minorIssues++;
        
      } catch (error) {
        healthResults.push({
          id: 'storage-system',
          name: 'Storage System',
          type: 'storage',
          status: 'error',
          lastChecked: new Date(),
          errors: [`Storage system failure: ${error}`],
          metadata: {}
        });
        minorIssues++;
      }
      
      // Test Database Functions
      const functions = [
        'has_role', 'get_current_user_role', 'validate_admin_access',
        'track_analytics_event', 'get_analytics_summary'
      ];
      
      for (const funcName of functions) {
        try {
          const startTime = Date.now();
          // Test function by calling with safe parameters
          let result;
          
          if (funcName === 'has_role') {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              result = await supabase.rpc(funcName as any, { 
                user_uuid: user.id, 
                role_name: 'user' 
              });
            }
          } else if (funcName === 'get_current_user_role') {
            result = await supabase.rpc(funcName as any);
          } else if (funcName === 'validate_admin_access') {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              result = await supabase.rpc(funcName as any, { 
                user_uuid: user.id 
              });
            }
          } else if (funcName === 'track_analytics_event') {
            // Skip this one as it modifies db
            continue;
          } else if (funcName === 'get_analytics_summary') {
            result = await supabase.rpc(funcName as any);
          }
          
          const responseTime = Date.now() - startTime;
          
          healthResults.push({
            id: `function-${funcName}`,
            name: `Function: ${funcName}`,
            type: 'function',
            status: result?.error ? 'error' : 'connected',
            responseTime,
            lastChecked: new Date(),
            errors: result?.error ? [result.error.message] : [],
            metadata: {
              functionName: funcName,
              callable: !result?.error
            }
          });
          
          if (result?.error) minorIssues++;
          
        } catch (error) {
          healthResults.push({
            id: `function-${funcName}`,
            name: `Function: ${funcName}`,
            type: 'function',
            status: 'error',
            lastChecked: new Date(),
            errors: [`Function test failed: ${error}`],
            metadata: { functionName: funcName, callable: false }
          });
          minorIssues++;
        }
      }
      
      // Determine overall status
      let status: 'healthy' | 'degraded' | 'critical' = 'healthy';
      if (criticalIssues > 0) {
        status = 'critical';
      } else if (minorIssues > 2) {
        status = 'degraded';
      }
      
      setDbHealth(healthResults);
      setOverallStatus(status);
    };
    
    // Initial scan
    scanDatabaseHealth();
    
    // Periodic health checks - PERFORMANCE OPTIMIZED
    // PERFORMANCE FIX: Reduced from 20s to 5 minutes to prevent slowdown
    const interval = setInterval(scanDatabaseHealth, 300000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  return { dbHealth, overallStatus };
};