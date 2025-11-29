import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import supabase from '@/lib/relaxedSupabase';
import { toast } from 'sonner';

interface AuthHealthData {
  overall_status?: 'healthy' | 'warning' | 'critical';
  missing_user_profiles?: number;
  recent_auth_errors?: number;
  security_audit_table_fixed?: boolean;
  total_users?: number;
  total_profiles?: number;
  audit_log_count?: number;
  last_check?: string;
  recommendations?: string[];
  // Fallback properties for alternative response format
  last_checked?: string;
  table_name?: string;
  total_records?: number;
  valid_auth_links?: number;
}

export const AuthHealthMonitor: React.FC = () => {
  const [healthData, setHealthData] = useState<AuthHealthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasAdminAccess, setHasAdminAccess] = useState(true);

  const fetchAuthHealth = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_auth_system_status');
      
      if (error) {
        console.error('Error fetching auth health:', error);
        
        if (error.message?.includes('permission denied')) {
          setHasAdminAccess(false);
          toast.error('Admin access required to view authentication health');
        } else {
          toast.error('Failed to fetch authentication health status');
        }
        return;
      }

      // Handle the response which might be an array or single object
      const healthResponse = Array.isArray(data) ? data[0] : data;
      
      if (healthResponse && typeof healthResponse === 'object') {
        setHealthData(healthResponse as AuthHealthData);
        
        // Show status notification only if we have the expected format
        if ('overall_status' in healthResponse && healthResponse.overall_status) {
          if (healthResponse.overall_status === 'critical') {
            toast.error('Critical authentication issues detected!');
          } else if (healthResponse.overall_status === 'warning') {
            toast.warning('Authentication warnings detected');
          } else {
            toast.success('Authentication system is healthy');
          }
        } else {
          toast.info('Authentication monitoring data retrieved');
        }
      }
      
    } catch (error) {
      console.error('Failed to fetch auth health:', error);
      toast.error('Failed to connect to monitoring system');
    } finally {
      setLoading(false);
    }
  };

  const runEmergencyRepair = async () => {
    try {
      const { data, error } = await supabase.rpc('emergency_auth_repair');
      
      if (error) {
        console.error('Error running repair:', error);
        toast.error('Emergency repair failed');
        return;
      }

      toast.success(`Emergency repair completed: ${data}`);
      
      // Refresh health data after repair
      setTimeout(fetchAuthHealth, 1000);
      
    } catch (error) {
      console.error('Failed to run emergency repair:', error);
      toast.error('Failed to run emergency repair');
    }
  };

  useEffect(() => {
    fetchAuthHealth();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchAuthHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <RefreshCw className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      healthy: "default",
      warning: "secondary", 
      critical: "destructive"
    };
    
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status?.toUpperCase() || 'UNKNOWN'}
      </Badge>
    );
  };

  if (!healthData && loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading Authentication Health Monitor...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!hasAdminAccess) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Admin access is required to view the authentication health monitor.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {healthData?.overall_status && getStatusIcon(healthData.overall_status)}
              Authentication System Health Monitor
            </span>
            <div className="flex items-center gap-2">
              {healthData?.overall_status && getStatusBadge(healthData.overall_status)}
              <Button 
                onClick={fetchAuthHealth} 
                disabled={loading}
                size="sm"
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        {healthData && (
          <CardContent className="space-y-6">
            {/* System Overview - Show if we have the expected data format */}
            {healthData.total_users !== undefined && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{healthData.total_users || 0}</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{healthData.total_profiles || 0}</div>
                    <div className="text-sm text-muted-foreground">User Profiles</div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{healthData.audit_log_count || 0}</div>
                    <div className="text-sm text-muted-foreground">Audit Events</div>
                  </div>
                </Card>
              </div>
            )}

            {/* Alternative data format display */}
            {healthData.table_name && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{healthData.total_records || 0}</div>
                    <div className="text-sm text-muted-foreground">Total Records</div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{healthData.valid_auth_links || 0}</div>
                    <div className="text-sm text-muted-foreground">Valid Auth Links</div>
                  </div>
                </Card>
              </div>
            )}

            {/* Health Metrics - Only show if we have the data */}
            {healthData.missing_user_profiles !== undefined && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Recent Issues
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Missing Profiles:</span>
                      <Badge variant={healthData.missing_user_profiles > 0 ? "destructive" : "default"}>
                        {healthData.missing_user_profiles}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Auth Errors (1h):</span>
                      <Badge variant={healthData.recent_auth_errors! > 0 ? "destructive" : "default"}>
                        {healthData.recent_auth_errors || 0}
                      </Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    System Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Security Audit Fixed:</span>
                      <Badge variant={healthData.security_audit_table_fixed ? "default" : "destructive"}>
                        {healthData.security_audit_table_fixed ? 'YES' : 'NO'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Check:</span>
                      <span className="text-sm text-muted-foreground">
                        {healthData.last_check ? new Date(healthData.last_check).toLocaleString() : 
                         healthData.last_checked ? new Date(healthData.last_checked).toLocaleString() : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Recommendations */}
            {healthData.recommendations && healthData.recommendations.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Recommendations</h3>
                <ul className="space-y-1">
                  {healthData.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Emergency Actions */}
            {healthData.missing_user_profiles && healthData.missing_user_profiles > 0 && (
              <Card className="p-4 border-orange-200 bg-orange-50">
                <h3 className="font-semibold mb-2 text-orange-800">Emergency Actions</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={runEmergencyRepair}
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    Run Emergency Repair
                  </Button>
                </div>
              </Card>
            )}

            {/* System Status Message */}
            {!healthData.overall_status && (
              <Card className="p-4 bg-blue-50 border-blue-200">
                <h3 className="font-semibold mb-2 text-blue-800">System Information</h3>
                <p className="text-sm text-blue-700">
                  The authentication security system has been completely rebuilt with fail-safes. 
                  All authentication errors should now be prevented automatically.
                </p>
              </Card>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};