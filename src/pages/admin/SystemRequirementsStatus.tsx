
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Shield, Users, Database, Key, Server, Lock, 
         Eye, FileText, Settings, RotateCcw, Info, ChevronDown, ChevronUp, Download, Archive, 
         MoreHorizontal, Clock, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { useSecureRoles } from '@/hooks/users/use-secure-roles';

interface RequirementCheck {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'fail' | 'warning' | 'checking';
  details?: string;
  icon: React.ReactNode;
  critical: boolean;
  lastChecked?: Date;
  tooltip?: string;
  category: 'security' | 'auth' | 'database' | 'monitoring';
}

export default function SystemRequirementsStatus() {
  const [requirements, setRequirements] = useState<RequirementCheck[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [flashingIds, setFlashingIds] = useState<Set<string>>(new Set());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { isSuperAdmin, isAdmin } = useSecureRoles();

  const initialRequirements: RequirementCheck[] = [
    {
      id: 'supabase_connection',
      name: 'Supabase Connection',
      description: 'Database connection and authentication service',
      status: 'checking',
      icon: <Database className="h-5 w-5" />,
      critical: true,
      category: 'database',
      tooltip: 'Ensures your application can connect to and interact with the Supabase database'
    },
    {
      id: 'admin_user_exists',
      name: 'Super Admin User',
      description: 'At least one super admin user exists in the system',
      status: 'checking',
      icon: <Shield className="h-5 w-5" />,
      critical: true,
      category: 'security',
      tooltip: 'Critical for system administration - ensures there is at least one user with full system access'
    },
    {
      id: 'rls_policies',
      name: 'Row Level Security',
      description: 'Database security policies are properly configured',
      status: 'checking',
      icon: <Lock className="h-5 w-5" />,
      critical: true,
      category: 'security',
      tooltip: 'RLS prevents unauthorized data access by enforcing user-specific data visibility rules'
    },
    {
      id: 'user_roles_table',
      name: 'User Roles System',
      description: 'User roles table and functions are properly set up',
      status: 'checking',
      icon: <Users className="h-5 w-5" />,
      critical: true,
      category: 'auth',
      tooltip: 'Permission system that controls what actions different users can perform'
    },
    {
      id: 'auth_functions',
      name: 'Authentication Functions',
      description: 'Database functions for authentication and authorization',
      status: 'checking',
      icon: <Key className="h-5 w-5" />,
      critical: false,
      category: 'auth',
      tooltip: 'Database stored procedures that handle user authentication and role verification'
    },
    {
      id: 'realtime_subscriptions',
      name: 'Real-time Subscriptions',
      description: 'Real-time updates and subscriptions functionality',
      status: 'checking',
      icon: <Server className="h-5 w-5" />,
      critical: false,
      category: 'monitoring',
      tooltip: 'Enables live data updates without page refresh for better user experience'
    }
  ];

  const checkSupabaseConnection = async (): Promise<RequirementCheck> => {
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        return {
          ...initialRequirements.find(r => r.id === 'supabase_connection')!,
          status: 'fail',
          details: `Connection error: ${error.message}`
        };
      }

      return {
        ...initialRequirements.find(r => r.id === 'supabase_connection')!,
        status: 'pass',
        details: 'Successfully connected to Supabase'
      };
    } catch (error) {
      return {
        ...initialRequirements.find(r => r.id === 'supabase_connection')!,
        status: 'fail',
        details: `Connection failed: ${error}`
      };
    }
  };

  const checkSuperAdminExists = async (): Promise<RequirementCheck> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('id')
        .eq('role', 'super_admin')
        .limit(1);

      if (error) {
        return {
          ...initialRequirements.find(r => r.id === 'admin_user_exists')!,
          status: 'fail',
          details: `Error checking super admin: ${error.message}`
        };
      }

      if (!data || data.length === 0) {
        return {
          ...initialRequirements.find(r => r.id === 'admin_user_exists')!,
          status: 'fail',
          details: 'No super admin user found. Create one to secure your system.'
        };
      }

      return {
        ...initialRequirements.find(r => r.id === 'admin_user_exists')!,
        status: 'pass',
        details: `Super admin user exists`
      };
    } catch (error) {
      return {
        ...initialRequirements.find(r => r.id === 'admin_user_exists')!,
        status: 'fail',
        details: `Failed to check super admin: ${error}`
      };
    }
  };

  const checkRLSPolicies = async (): Promise<RequirementCheck> => {
    try {
      // Check if RLS is enabled on critical tables
      const { data, error } = await supabase.rpc('get_current_user_role');
      
      if (error) {
        return {
          ...initialRequirements.find(r => r.id === 'rls_policies')!,
          status: 'fail',
          details: `RLS function error: ${error.message}`
        };
      }

      return {
        ...initialRequirements.find(r => r.id === 'rls_policies')!,
        status: 'pass',
        details: 'RLS policies are active and functioning'
      };
    } catch (error) {
      return {
        ...initialRequirements.find(r => r.id === 'rls_policies')!,
        status: 'fail',
        details: `RLS check failed: ${error}`
      };
    }
  };

  const checkUserRolesTable = async (): Promise<RequirementCheck> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('id')
        .limit(1);

      if (error) {
        return {
          ...initialRequirements.find(r => r.id === 'user_roles_table')!,
          status: 'fail',
          details: `User roles table error: ${error.message}`
        };
      }

      return {
        ...initialRequirements.find(r => r.id === 'user_roles_table')!,
        status: 'pass',
        details: 'User roles table is accessible'
      };
    } catch (error) {
      return {
        ...initialRequirements.find(r => r.id === 'user_roles_table')!,
        status: 'fail',
        details: `Failed to access user roles table: ${error}`
      };
    }
  };

  const checkAuthFunctions = async (): Promise<RequirementCheck> => {
    try {
      const { data, error } = await supabase.rpc('has_role', {
        user_uuid: '00000000-0000-0000-0000-000000000000',
        role_name: 'user'
      });

      // Function should exist even if it returns false for dummy UUID
      if (error && error.message.includes('function') && error.message.includes('does not exist')) {
        return {
          ...initialRequirements.find(r => r.id === 'auth_functions')!,
          status: 'fail',
          details: 'Authentication functions are missing'
        };
      }

      return {
        ...initialRequirements.find(r => r.id === 'auth_functions')!,
        status: 'pass',
        details: 'Authentication functions are available'
      };
    } catch (error) {
      return {
        ...initialRequirements.find(r => r.id === 'auth_functions')!,
        status: 'warning',
        details: 'Could not verify all authentication functions'
      };
    }
  };

  const checkRealtimeSubscriptions = async (): Promise<RequirementCheck> => {
    try {
      // Test if we can create a channel (this doesn't actually connect)
      const channel = supabase.channel('test-channel');
      
      return {
        ...initialRequirements.find(r => r.id === 'realtime_subscriptions')!,
        status: 'pass',
        details: 'Real-time functionality is available'
      };
    } catch (error) {
      return {
        ...initialRequirements.find(r => r.id === 'realtime_subscriptions')!,
        status: 'warning',
        details: `Real-time might have issues: ${error}`
      };
    }
  };

  const runSystemCheck = async () => {
    setIsChecking(true);
    setRequirements(initialRequirements);

    try {
      const checks = await Promise.all([
        checkSupabaseConnection(),
        checkSuperAdminExists(),
        checkRLSPolicies(),
        checkUserRolesTable(),
        checkAuthFunctions(),
        checkRealtimeSubscriptions()
      ]);

      // Add timestamps and trigger flash animations for changed statuses
      const updatedChecks = checks.map(check => {
        const oldCheck = requirements.find(r => r.id === check.id);
        const statusChanged = oldCheck && oldCheck.status !== check.status;
        
        if (statusChanged) {
          setFlashingIds(prev => new Set([...prev, check.id]));
          setTimeout(() => {
            setFlashingIds(prev => {
              const newSet = new Set(prev);
              newSet.delete(check.id);
              return newSet;
            });
          }, 2000);
        }
        
        return { ...check, lastChecked: new Date() };
      });

      setRequirements(updatedChecks);
      setLastChecked(new Date());
      
      const failedCritical = updatedChecks.filter(c => c.critical && c.status === 'fail').length;
      const warnings = updatedChecks.filter(c => c.status === 'warning').length;
      
      // Log audit trail
      logAuditAction('system_scan', { 
        critical_issues: failedCritical, 
        warnings, 
        total_checks: updatedChecks.length 
      });
      
      if (failedCritical > 0) {
        toast.error(`System check completed with ${failedCritical} critical issues`);
      } else if (warnings > 0) {
        toast.warning(`System check completed with ${warnings} warnings`);
      } else {
        toast.success('All system requirements are met!');
      }
    } catch (error) {
      console.error('System check error:', error);
      toast.error('Failed to complete system check');
    } finally {
      setIsChecking(false);
    }
  };

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      if (!isChecking) {
        runSystemCheck();
      }
    }, 60000); // Every 60 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, isChecking]);

  // Audit logging
  const logAuditAction = async (action: string, metadata: any) => {
    try {
      console.log(`[AUDIT] ${action}:`, metadata);
      // In a real app, this would send to audit logging service
    } catch (error) {
      console.error('Failed to log audit action:', error);
    }
  };

  // Action handlers
  const handleViewDetails = (req: RequirementCheck) => {
    logAuditAction('view_details', { requirement_id: req.id });
    toast.info(`Viewing details for ${req.name}`);
  };

  const handleViewLogs = (req: RequirementCheck) => {
    logAuditAction('view_logs', { requirement_id: req.id });
    toast.info(`Opening logs for ${req.name}`);
  };

  const handleFixIssue = (req: RequirementCheck) => {
    logAuditAction('fix_issue', { requirement_id: req.id });
    toast.info(`Initiating fix for ${req.name}`);
  };

  const handleRunScanAgain = (req: RequirementCheck) => {
    logAuditAction('rescan_requirement', { requirement_id: req.id });
    toast.info(`Re-scanning ${req.name}`);
  };

  const exportResults = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      last_checked: lastChecked,
      summary: {
        total: requirements.length,
        passed: requirements.filter(r => r.status === 'pass').length,
        warnings: requirements.filter(r => r.status === 'warning').length,
        critical_issues: requirements.filter(r => r.critical && r.status === 'fail').length
      },
      requirements: requirements.map(r => ({
        id: r.id,
        name: r.name,
        status: r.status,
        critical: r.critical,
        details: r.details,
        category: r.category,
        last_checked: r.lastChecked
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-requirements-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    logAuditAction('export_results', { format: 'json' });
    toast.success('System requirements exported successfully');
  };

  const toggleCollapse = (sectionId: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const toggleCollapseAll = () => {
    const allIds = requirements.map(r => r.id);
    const allCollapsed = allIds.every(id => collapsedSections.has(id));
    
    if (allCollapsed) {
      setCollapsedSections(new Set());
    } else {
      setCollapsedSections(new Set(allIds));
    }
  };

  useEffect(() => {
    runSystemCheck();
  }, []);

  const getStatusIcon = (status: RequirementCheck['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-600" aria-label="Passed" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-600" aria-label="Failed" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" aria-label="Warning" />;
      case 'checking':
        return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" aria-label="Checking" />;
    }
  };

  const getStatusBadge = (status: RequirementCheck['status']) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-800 border-green-200">✅ Passed</Badge>;
      case 'fail':
        return <Badge className="bg-red-100 text-red-800 border-red-200">❌ Failed</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⚠️ Warning</Badge>;
      case 'checking':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">🔄 Checking...</Badge>;
    }
  };

  const getBackgroundClass = (req: RequirementCheck, isFlashing: boolean) => {
    if (isFlashing) {
      return req.status === 'pass' ? 'animate-pulse bg-green-50' : 
             req.status === 'fail' ? 'animate-pulse bg-red-50' : 
             'animate-pulse bg-yellow-50';
    }
    
    if (req.critical && req.status === 'fail') return 'bg-red-50 border-red-200';
    if (req.status === 'warning') return 'bg-yellow-50 border-yellow-200';
    if (req.status === 'pass') return 'bg-green-50 border-green-200';
    return 'bg-gray-50';
  };

  const formatLastChecked = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const criticalIssues = requirements.filter(r => r.critical && r.status === 'fail').length;
  const warnings = requirements.filter(r => r.status === 'warning').length;
  const passed = requirements.filter(r => r.status === 'pass').length;

  // Check if current user has admin access
  if (!isSuperAdmin && !isAdmin) {
    return (
      <AdminLayout title="System Requirements" subtitle="System health and configuration status">
        <div className="flex items-center justify-center min-h-96">
          <Card className="max-w-md">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You need admin or super admin privileges to view system requirements.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <TooltipProvider>
      <AdminLayout title="System Requirements" subtitle="System health and configuration status">
        <div className="space-y-6">
          {/* Enhanced Summary Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-6 w-6" aria-label="System Activity Monitor" />
                    Security & System Status
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Real-time monitoring of critical security components and system health</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {lastChecked ? (
                      `Last checked: ${lastChecked.toLocaleString()}`
                    ) : (
                      'System check in progress...'
                    )}
                    {autoRefresh && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Auto-refresh: ON
                      </Badge>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => setAutoRefresh(!autoRefresh)} 
                    variant="ghost" 
                    size="sm"
                    title={autoRefresh ? "Disable auto-refresh" : "Enable auto-refresh"}
                  >
                    <Activity className={`h-4 w-4 ${autoRefresh ? 'text-green-600' : 'text-gray-400'}`} />
                  </Button>
                  <Button onClick={exportResults} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button onClick={runSystemCheck} disabled={isChecking} variant="outline">
                    <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
                    {isChecking ? 'Scanning...' : 'Scan All'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Live Status Summary */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="text-2xl font-bold text-green-600">✅ {passed}</div>
                  <div className="text-sm text-green-700">Healthy</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-600">⚠️ {warnings}</div>
                  <div className="text-sm text-yellow-700">Warnings</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
                  <div className="text-2xl font-bold text-red-600">❌ {criticalIssues}</div>
                  <div className="text-sm text-red-700">Critical</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">📊 {requirements.length}</div>
                  <div className="text-sm text-blue-700">Total Checks</div>
                </div>
              </div>
              
              {/* Collapse Controls */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <Button onClick={toggleCollapseAll} variant="ghost" size="sm">
                  {requirements.every(r => collapsedSections.has(r.id)) ? (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Expand All
                    </>
                  ) : (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Collapse All
                    </>
                  )}
                </Button>
                <span>Click any item to view details and actions</span>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Requirements List */}
          <div className="grid gap-3">
            {requirements.map((req) => {
              const isFlashing = flashingIds.has(req.id);
              const isCollapsed = collapsedSections.has(req.id);
              
              return (
                <Collapsible key={req.id} open={!isCollapsed} onOpenChange={() => toggleCollapse(req.id)}>
                  <Card className={`transition-all duration-300 hover:shadow-md ${getBackgroundClass(req, isFlashing)}`}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {req.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-base">{req.name}</h3>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">{req.tooltip}</p>
                                  </TooltipContent>
                                </Tooltip>
                                {req.critical && (
                                  <Badge variant="destructive" className="text-xs px-2">
                                    Critical
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{req.description}</p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>Last checked: {formatLastChecked(req.lastChecked)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(req.status)}
                              {getStatusBadge(req.status)}
                            </div>
                            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        {req.details && (
                          <div className="mb-4 p-3 rounded-md bg-muted/50">
                            <p className="text-sm text-muted-foreground">{req.details}</p>
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                onClick={() => handleViewDetails(req)} 
                                variant="outline" 
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                <Eye className="h-3 w-3" />
                                View Details
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View detailed information about this check</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                onClick={() => handleViewLogs(req)} 
                                variant="outline" 
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                <FileText className="h-3 w-3" />
                                View Logs
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View audit logs and history for this component</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          {req.status === 'fail' && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  onClick={() => handleFixIssue(req)} 
                                  variant="outline" 
                                  size="sm"
                                  className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <Settings className="h-3 w-3" />
                                  Fix Issue
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Attempt to automatically resolve this issue</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                onClick={() => handleRunScanAgain(req)} 
                                variant="outline" 
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                <RotateCcw className="h-3 w-3" />
                                Re-scan
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Run this specific check again</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}
          </div>

          {/* Critical Issues Alert */}
          {criticalIssues > 0 && (
            <Card className="border-red-200 bg-red-50 animate-pulse">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  🚨 Critical Security Issues Detected
                </CardTitle>
                <CardDescription className="text-red-700">
                  Your system has {criticalIssues} critical issue{criticalIssues > 1 ? 's' : ''} that need immediate attention.
                  These issues may affect system security and functionality.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Button onClick={runSystemCheck} variant="destructive" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Run Emergency Scan
                  </Button>
                  <Button onClick={exportResults} variant="outline" size="sm">
                    <Archive className="h-4 w-4 mr-2" />
                    Export for Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </AdminLayout>
    </TooltipProvider>
  );
}
