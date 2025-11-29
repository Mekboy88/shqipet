import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEffect } from 'react';

export interface SecurityScan {
  id: string;
  scan_type: string;
  status: string;
  risk_score: number;
  security_grade: string;
  critical_issues: number;
  warnings: number;
  passed: number;
  total_checks: number;
  scan_duration: number;
  triggered_by: string;
  generated_by: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface ScanLog {
  id: string;
  scan_id: string;
  module_name: string;
  event_type: string;
  message: string;
  level: string;
  metadata: any;
  created_at: string;
}

export const useSecurityScans = () => {
  const queryClient = useQueryClient();

  // Listen for real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('security-scans-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'security_scans'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['security-scans'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scan_logs'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['scan-logs'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: scans, isLoading: scansLoading } = useQuery({
    queryKey: ['security-scans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_scans')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SecurityScan[];
    },
    refetchInterval: 5000 // Fallback polling every 5 seconds
  });

  const { data: logs, isLoading: logsLoading } = useQuery({
    queryKey: ['scan-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scan_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as ScanLog[];
    },
    refetchInterval: 2000 // More frequent for logs
  });

  const createScan = useMutation({
    mutationFn: async (scanData: { scan_type: string; status: string; triggered_by?: string; generated_by?: string }) => {
      const { data, error } = await supabase
        .from('security_scans')
        .insert([scanData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-scans'] });
      toast.success('Security scan started');
    },
    onError: (error: any) => {
      toast.error(`Failed to start scan: ${error.message}`);
    }
  });

  const updateScan = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SecurityScan> }) => {
      const { data, error } = await supabase
        .from('security_scans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-scans'] });
    }
  });

  const addScanLog = useMutation({
    mutationFn: async (logData: Partial<ScanLog>) => {
      const { data, error } = await supabase
        .from('scan_logs')
        .insert([logData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scan-logs'] });
    }
  });

  const runSecurityScan = async () => {
    try {
      // Create new scan
      const scan = await createScan.mutateAsync({
        scan_type: 'comprehensive',
        status: 'running',
        triggered_by: 'manual',
        generated_by: 'admin'
      });

      // Simulate scanning modules
      const modules = [
        'Authentication System',
        'User Management', 
        'Security Monitoring',
        'Notification System',
        'Device Fingerprinting',
        'Brute Force Protection',
        'JWT Security',
        'Admin Dashboard',
        'File Upload Security',
        'API Security'
      ];

      let totalChecks = 0;
      let passed = 0;
      let warnings = 0;
      let criticalIssues = 0;

      for (const module of modules) {
        await addScanLog.mutateAsync({
          scan_id: scan.id,
          module_name: module,
          event_type: 'start',
          message: `Starting scan for ${module}`,
          level: 'info'
        });

        // Get module status from database
        const { data: moduleStatus } = await supabase
          .from('module_status')
          .select('*')
          .eq('module_name', module)
          .single();

        if (moduleStatus) {
          totalChecks += 10; // Each module has 10 checks
          const moduleChecks = Math.floor((moduleStatus.completion_percentage / 100) * 10);
          passed += moduleChecks;
          
          if (moduleStatus.completion_percentage < 50) {
            criticalIssues += 1;
            await addScanLog.mutateAsync({
              scan_id: scan.id,
              module_name: module,
              event_type: 'critical',
              message: `Critical: ${module} is only ${moduleStatus.completion_percentage}% complete`,
              level: 'error'
            });
          } else if (moduleStatus.completion_percentage < 100) {
            warnings += 1;
            await addScanLog.mutateAsync({
              scan_id: scan.id,
              module_name: module,
              event_type: 'warning',
              message: `Warning: ${module} needs completion (${moduleStatus.completion_percentage}%)`,
              level: 'warning'
            });
          }
        }

        await addScanLog.mutateAsync({
          scan_id: scan.id,
          module_name: module,
          event_type: 'complete',
          message: `Completed scan for ${module}`,
          level: 'info'
        });
      }

      // Calculate final score
      const riskScore = Math.max(0, Math.min(100, (passed / totalChecks) * 100));
      const securityGrade = riskScore >= 90 ? 'A' : riskScore >= 80 ? 'B' : riskScore >= 70 ? 'C' : riskScore >= 60 ? 'D' : 'F';

      // Update scan with results
      await updateScan.mutateAsync({
        id: scan.id,
        updates: {
          status: 'completed',
          risk_score: Math.round(riskScore),
          security_grade: securityGrade,
          critical_issues: criticalIssues,
          warnings: warnings,
          passed: passed,
          total_checks: totalChecks,
          scan_duration: 8.5
        }
      });

      // Create notification for scan completion
      await supabase.from('notifications').insert({
        title: `Security Scan Completed - Grade ${securityGrade}`,
        description: `Scan found ${criticalIssues} critical issues and ${warnings} warnings. Risk score: ${Math.round(riskScore)}`,
        type: 'security',
        priority: criticalIssues > 0 ? 'critical' : warnings > 0 ? 'high' : 'medium',
        linked_module: 'Security Monitoring',
        linked_scan_id: scan.id,
        source: 'Real-Time Security Monitor'
      });

      // Trigger custom event for notification system
      window.dispatchEvent(new CustomEvent('securityScanCompleted', {
        detail: {
          scanId: scan.id,
          completedAt: new Date(),
          riskScore: Math.round(riskScore),
          securityGrade: securityGrade,
          passedChecks: passed,
          warnings: warnings,
          criticalIssues: criticalIssues,
          totalChecks: totalChecks,
          triggeredBy: 'Real-Time Monitor',
          scanDuration: 8.5
        }
      }));

      return scan;
    } catch (error: any) {
      toast.error(`Scan failed: ${error.message}`);
      throw error;
    }
  };

  return {
    scans,
    logs,
    isLoading: scansLoading || logsLoading,
    createScan,
    updateScan,
    addScanLog,
    runSecurityScan
  };
};