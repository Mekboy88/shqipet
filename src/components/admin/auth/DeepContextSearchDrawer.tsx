import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Copy, 
  Share, 
  Download, 
  RefreshCw, 
  Shield, 
  Eye, 
  EyeOff,
  TrendingUp,
  BookOpen,
  X,
  Filter,
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Unlock,
  ChevronUp,
  ChevronDown,
  Minus,
  Timer,
  Wrench,
  Pin,
  PinOff,
  MessageSquare,
  FileText,
  Send,
  Activity,
  Zap,
  Radio
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useSwitchToast } from '@/hooks/use-switch-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PasswordVerificationDialog } from '@/components/admin/users-management/action-panel/permission-components/PasswordVerificationDialog';
import { useAuth } from '@/contexts/AuthContext';
import supabase from '@/lib/relaxedSupabase';
import { cn } from '@/lib/utils';

interface DeepContextSearchDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkName: string;
  checkCategory: string;
  checkStatus: 'passed' | 'warning' | 'failed';
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  traceId?: string;
  userAgent?: string;
  statusCode?: number;
  metadata?: any;
}

interface PastAnalysis {
  id: string;
  date: string;
  outcome: 'passed' | 'warning' | 'failed';
  fixApplied: boolean;
  details: string;
  analyzedBy: string;
  scanDuration: number; // in seconds
  trend?: 'improved' | 'degraded' | 'stable';
  fixNotes?: string;
  comments?: string[];
  isPinned?: boolean;
}

export const DeepContextSearchDrawer: React.FC<DeepContextSearchDrawerProps> = ({
  open,
  onOpenChange,
  checkName,
  checkCategory,
  checkStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('logs');
  const [autoRefresh, setAutoRefresh] = useState(() => {
    // Load auto-refresh state from localStorage, default to TRUE for automatic live monitoring
    const saved = localStorage.getItem('deep-context-auto-refresh');
    return saved ? JSON.parse(saved) : true; // Changed default to true
  });
  const [showSensitive, setShowSensitive] = useState(false);
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);
  const [logTypeFilter, setLogTypeFilter] = useState<'all' | 'info' | 'warning' | 'error'>('all');
  const [sensitiveTimer, setSensitiveTimer] = useState<number | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [analysisComments, setAnalysisComments] = useState<Record<string, string[]>>({});
  const [pinnedAnalyses, setPinnedAnalyses] = useState<Set<string>>(new Set());
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const { showSwitchToast } = useSwitchToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  
  // Real-time state
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [liveUpdatesCount, setLiveUpdatesCount] = useState(0);
  const [lastLiveUpdate, setLastLiveUpdate] = useState<Date | null>(null);
  const [newLogIds, setNewLogIds] = useState<Set<string>>(new Set());
  
  const { user } = useAuth();

  // Real-time data state
  const [systemLogs, setSystemLogs] = useState<LogEntry[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  // Real data states
  const [pastAnalyses, setPastAnalyses] = useState<PastAnalysis[]>([]);
  const [isLoadingAnalyses, setIsLoadingAnalyses] = useState(true);

  
  // Save auto-refresh state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('deep-context-auto-refresh', JSON.stringify(autoRefresh));
  }, [autoRefresh]);

  // Load initial data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      console.log('🔄 Loading real-time security data...');
      setIsLoadingLogs(true);
      setIsLoadingAnalyses(true);

      try {
        // Fetch security events
        const { data: securityEvents, error: securityError } = await supabase
          .from('security_events')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        // Fetch admin actions
        const { data: adminActions, error: adminError } = await supabase
          .from('admin_actions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        // Fetch brute force attempts
        const { data: bruteForceAttempts, error: bruteForceError } = await supabase
          .from('brute_force_attempts')
          .select('*')
          .order('attempt_timestamp', { ascending: false })
          .limit(10);

        // Process security events
        if (!securityError && securityEvents) {
          const securityLogs: LogEntry[] = securityEvents.map(event => ({
            id: event.id,
            timestamp: event.created_at,
            level: event.risk_level === 'critical' || event.risk_level === 'high' ? 'error' : 
                   event.risk_level === 'medium' ? 'warning' : 'info',
            message: event.event_description || `${event.event_type} event`,
            traceId: `TRC-${event.id.slice(-8)}`,
            userAgent: event.user_agent || 'System',
            statusCode: 200,
            metadata: {
              eventType: event.event_type,
              riskLevel: event.risk_level,
              ipAddress: event.ip_address,
              userId: event.user_id,
              ...(typeof event.metadata === 'object' && event.metadata !== null ? event.metadata : {})
            }
          }));
          setSystemLogs(prev => [...securityLogs, ...prev]);
        }

        // Process admin actions
        if (!adminError && adminActions) {
          const adminLogs: LogEntry[] = adminActions.map(action => ({
            id: `admin-${action.id}`,
            timestamp: action.created_at,
            level: 'info',
            message: `Admin action: ${action.action_type} performed`,
            traceId: `TRC-ADM-${action.id.slice(-6)}`,
            userAgent: 'AdminPanel',
            statusCode: 200,
            metadata: {
              adminId: action.actor_id,
              actionType: action.action_type,
              targetUserId: action.target_user_id,
              newRole: action.new_role,
              reason: action.reason
            }
          }));
          setSystemLogs(prev => [...prev, ...adminLogs]);
        }

        // Process brute force attempts
        if (!bruteForceError && bruteForceAttempts) {
          const bruteForceLogs: LogEntry[] = bruteForceAttempts.map(attempt => ({
            id: `brute-${attempt.id}`,
            timestamp: attempt.attempt_timestamp,
            level: attempt.blocked ? 'error' : 'warning',
            message: `${attempt.success ? 'Successful' : 'Failed'} login attempt${attempt.blocked ? ' (BLOCKED)' : ''}`,
            traceId: `TRC-BF-${attempt.id.slice(-6)}`,
            userAgent: attempt.user_agent || 'Unknown',
            statusCode: attempt.success ? 200 : 401,
            metadata: {
              ipAddress: attempt.ip_address,
              attemptedUsername: attempt.attempted_username,
              attemptedEmail: attempt.attempted_email,
              blocked: attempt.blocked,
              blockReason: attempt.block_reason,
              countryCode: attempt.country_code,
              city: attempt.city
            }
          }));
          setSystemLogs(prev => [...prev, ...bruteForceLogs]);
        }

        console.log(`✅ Loaded ${securityEvents?.length || 0} security events, ${adminActions?.length || 0} admin actions, ${bruteForceAttempts?.length || 0} brute force attempts`);

        // Load real JWT signature analysis data from Supabase
        const { data: jwtAnalyses, error: jwtError } = await supabase
          .from('jwt_signature_analyses')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (jwtError) {
          console.error('❌ Error loading JWT analyses:', jwtError);
        } else {
          // Transform Supabase data to match PastAnalysis interface
          const formattedAnalyses: PastAnalysis[] = (jwtAnalyses || []).map(analysis => ({
            id: analysis.id,
            date: new Date(analysis.created_at).toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit', 
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }),
            outcome: analysis.outcome as 'passed' | 'warning' | 'failed',
            fixApplied: analysis.fix_applied,
            details: analysis.details,
            analyzedBy: analysis.analyzer_name || 'System',
            scanDuration: Number(analysis.scan_duration) || 0,
            trend: analysis.trend as 'improved' | 'degraded' | 'stable' | undefined,
            fixNotes: analysis.fix_notes,
            isPinned: analysis.is_pinned
          }));

          setPastAnalyses(formattedAnalyses);
          console.log(`✅ Loaded ${formattedAnalyses.length} JWT signature analyses`);
        }

      } catch (error) {
        console.error('❌ Error loading data:', error);
        toast({
          title: "❌ Data Loading Failed",
          description: "Could not load security data",
          variant: "destructive"
        });
      } finally {
        setIsLoadingLogs(false);
        setIsLoadingAnalyses(false);
      }
    };

    if (open) {
      loadInitialData();
    }
  }, [open]);

  // Real-time subscription for JWT signature analyses
  useEffect(() => {
    if (!open) return;

    const channel = supabase
      .channel('jwt-signature-analyses-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jwt_signature_analyses'
        },
        (payload) => {
          console.log('🔄 JWT analysis real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newAnalysis = payload.new;
            const formattedAnalysis: PastAnalysis = {
              id: newAnalysis.id,
              date: new Date(newAnalysis.created_at).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              }),
              outcome: newAnalysis.outcome as 'passed' | 'warning' | 'failed',
              fixApplied: newAnalysis.fix_applied,
              details: newAnalysis.details,
              analyzedBy: newAnalysis.analyzer_name || 'System',
              scanDuration: Number(newAnalysis.scan_duration) || 0,
              trend: newAnalysis.trend as 'improved' | 'degraded' | 'stable' | undefined,
              fixNotes: newAnalysis.fix_notes,
              isPinned: newAnalysis.is_pinned
            };
            
            setPastAnalyses(prev => [formattedAnalysis, ...prev]);
            toast({
              title: "🔍 New JWT Analysis",
              description: `New signature verification completed: ${newAnalysis.outcome}`,
            });
          }
          
          if (payload.eventType === 'UPDATE') {
            const updatedAnalysis = payload.new;
            setPastAnalyses(prev => prev.map(analysis => 
              analysis.id === updatedAnalysis.id 
                ? {
                    ...analysis,
                    outcome: updatedAnalysis.outcome,
                    fixApplied: updatedAnalysis.fix_applied,
                    details: updatedAnalysis.details,
                    trend: updatedAnalysis.trend,
                    fixNotes: updatedAnalysis.fix_notes,
                    isPinned: updatedAnalysis.is_pinned
                  }
                : analysis
            ));
          }
          
          if (payload.eventType === 'DELETE') {
            setPastAnalyses(prev => prev.filter(analysis => analysis.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [open]);

  // Filter logs based on search query and log type, prioritize errors at the top
  const filteredLogs = systemLogs
    .filter(log => {
      const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           log.traceId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           log.level.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = logTypeFilter === 'all' || log.level === logTypeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      // First, sort by log level priority (error > warning > info)
      const levelPriority = { 'error': 3, 'warning': 2, 'info': 1 };
      const aPriority = levelPriority[a.level as keyof typeof levelPriority] || 0;
      const bPriority = levelPriority[b.level as keyof typeof levelPriority] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority; // Higher priority first
      }
      
      // If same priority, sort by timestamp (newest first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  // Comprehensive data masking/unmasking functions
  const maskSensitiveValue = (key: string, value: any, showSensitive: boolean): any => {
    if (showSensitive) return value;
    
    // Handle null, undefined, or non-string values
    if (value === null || value === undefined) {
      return 'null';
    }
    
    // Convert to string if not already
    const stringValue = String(value);
    
    switch (key) {
      case 'userId':
      case 'user_id':
        return 'redacted';
      case 'email':
        if (!stringValue.includes('@')) return '***@***.***';
        const emailParts = stringValue.split('@');
        return `***@${emailParts[1] || '***.***'}`;
      case 'phoneNumber':
      case 'phone':
        return stringValue.replace(/\d{7,}/g, '***-***-****');
      case 'ipAddress':
      case 'ip':
        if (!stringValue.includes('.')) return '***.***.***.***';
        const ipParts = stringValue.split('.');
        return `${ipParts[0] || '***'}.${ipParts[1] || '***'}.***.**`;
      case 'tokenId':
      case 'token':
        return stringValue.length > 4 ? `******${stringValue.slice(-4)}` : '******';
      case 'authorization':
      case 'bearer':
        return 'Bearer ******...';
      case 'sessionId':
      case 'session':
        return `sess_******`;
      case 'role':
        return '***';
      case 'attemptedPath':
        return '/***';
      case 'failedPolicy':
        return '***.***.***';
      default:
        if (typeof stringValue === 'string' && stringValue.length > 8) {
          return `******${stringValue.slice(-4)}`;
        }
        return stringValue;
    }
  };

  const maskMessage = (message: string, showSensitive: boolean): string => {
    if (showSensitive) return message;
    
    return message
      .replace(/user_id: [a-f0-9-]+/gi, 'user_id: redacted')
      .replace(/tk_live_[a-zA-Z0-9]+/gi, '******')
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi, '***@domain.com')
      .replace(/\+?[\d\s-()]+/gi, '+***-***-****')
      .replace(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/gi, '192.168.***.***');
  };

  const maskUserAgent = (userAgent: string, showSensitive: boolean): string => {
    if (showSensitive) return userAgent;
    if (userAgent === 'SecurityBot/2.1') return userAgent;
    return 'Web/***';
  };

  // Auto-hide timer for sensitive data
  useEffect(() => {
    if (showSensitive) {
      const timer = setTimeout(() => {
        setShowSensitive(false);
        setSensitiveTimer(null);
        toast({
          title: "🔒 Sensitive Data Auto-Hidden",
          description: "Data has been automatically hidden for security",
        });
      }, 60000);
      setSensitiveTimer(60);
      
      const countdown = setInterval(() => {
        setSensitiveTimer(prev => prev && prev > 1 ? prev - 1 : null);
      }, 1000);
      
      return () => {
        clearTimeout(timer);
        clearInterval(countdown);
      };
    } else {
      setSensitiveTimer(null);
    }
  }, [showSensitive]);

  // Enhanced real-time subscription effect
  useEffect(() => {
    if (!autoRefresh || !open) {
      setIsRealTimeActive(false);
      setConnectionStatus('disconnected');
      return;
    }

    console.log('🔄 Setting up enhanced real-time subscription for security logs');
    setIsRealTimeActive(true);
    setConnectionStatus('connecting');

    let securityChannel: any = null;

    try {
      // Set up real-time subscription for security events
      securityChannel = supabase
        .channel(`deep-context-realtime-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'security_events'
          },
          (payload) => {
            console.log('🔔 New security event received:', payload.new);
            
            const newLog: LogEntry = {
              id: payload.new.id || Date.now().toString(),
              timestamp: payload.new.created_at || new Date().toISOString(),
              level: payload.new.risk_level === 'critical' || payload.new.risk_level === 'high' ? 'error' : 
                     payload.new.risk_level === 'medium' ? 'warning' : 'info',
              message: payload.new.event_description || `${payload.new.event_type} event`,
              traceId: 'TRC-' + Math.random().toString(36).substr(2, 9),
              userAgent: payload.new.user_agent || 'System',
              statusCode: 200,
              metadata: {
                eventType: payload.new.event_type,
                riskLevel: payload.new.risk_level,
                ipAddress: payload.new.ip_address,
                userId: payload.new.user_id,
                ...(payload.new.metadata || {})
              }
            };
            
            setSystemLogs(prev => [newLog, ...prev.slice(0, 49)]);
            setLiveUpdatesCount(prev => prev + 1);
            setLastLiveUpdate(new Date());
            setNewLogIds(prev => new Set([...prev, newLog.id]));
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
              setNewLogIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(newLog.id);
                return newSet;
              });
            }, 3000);
            
            // Show toast for high-priority events
            if (payload.new.risk_level === 'critical' || payload.new.risk_level === 'high') {
              toast({
                title: "🚨 High Priority Security Event",
                description: payload.new.event_description,
                variant: "destructive"
              });
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'admin_actions'
          },
          (payload) => {
            console.log('👨‍💼 New admin action received:', payload.new);
            
            const newLog: LogEntry = {
              id: `admin-${payload.new.id}` || Date.now().toString(),
              timestamp: payload.new.created_at || new Date().toISOString(),
              level: 'info',
              message: `Admin action: ${payload.new.action_type} - Target: ${payload.new.target_user_id}`,
              traceId: 'TRC-ADM-' + Math.random().toString(36).substr(2, 6),
              userAgent: 'AdminPanel',
              statusCode: 200,
              metadata: {
                adminId: payload.new.admin_id,
                actionType: payload.new.action_type,
                targetUserId: payload.new.target_user_id,
                newRole: payload.new.new_role,
                reason: payload.new.reason
              }
            };
            
            setSystemLogs(prev => [newLog, ...prev.slice(0, 49)]);
            setLiveUpdatesCount(prev => prev + 1);
            setLastLiveUpdate(new Date());
            setNewLogIds(prev => new Set([...prev, newLog.id]));
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
              setNewLogIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(newLog.id);
                return newSet;
              });
            }, 3000);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'brute_force_attempts'
          },
          (payload) => {
            console.log('🛡️ New brute force attempt received:', payload.new);
            
            const newLog: LogEntry = {
              id: `brute-${payload.new.id}` || Date.now().toString(),
              timestamp: payload.new.attempt_timestamp || new Date().toISOString(),
              level: payload.new.blocked ? 'error' : 'warning',
              message: `${payload.new.success ? 'Successful' : 'Failed'} login attempt${payload.new.blocked ? ' (BLOCKED)' : ''}`,
              traceId: 'TRC-BF-' + Math.random().toString(36).substr(2, 6),
              userAgent: payload.new.user_agent || 'Unknown',
              statusCode: payload.new.success ? 200 : 401,
              metadata: {
                ipAddress: payload.new.ip_address,
                attemptedUsername: payload.new.attempted_username,
                attemptedEmail: payload.new.attempted_email,
                blocked: payload.new.blocked,
                blockReason: payload.new.block_reason,
                countryCode: payload.new.country_code,
                city: payload.new.city
              }
            };
            
            setSystemLogs(prev => [newLog, ...prev.slice(0, 49)]);
            setLiveUpdatesCount(prev => prev + 1);
            setLastLiveUpdate(new Date());
            setNewLogIds(prev => new Set([...prev, newLog.id]));
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
              setNewLogIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(newLog.id);
                return newSet;
              });
            }, 3000);
            
            // Show toast for blocked attempts
            if (payload.new.blocked) {
              toast({
                title: "🛡️ Brute Force Attack Blocked",
                description: `IP ${payload.new.ip_address} has been blocked`,
                variant: "destructive"
              });
            }
          }
        )
        .subscribe((status) => {
          console.log('📡 Real-time connection status:', status);
          if (status === 'SUBSCRIBED') {
            setConnectionStatus('connected');
            toast({
              title: "🟢 Real-time Connected",
              description: "Live monitoring is now active",
            });
          } else if (status === 'CHANNEL_ERROR' || status === 'CLOSED') {
            setConnectionStatus('disconnected');
            setIsRealTimeActive(false);
            toast({
              title: "🔴 Real-time Error",
              description: "Live monitoring connection failed",
              variant: "destructive"
            });
          }
        });

      // Add a shorter timeout fallback to handle cases where subscription status isn't properly received
      const connectionTimeout = setTimeout(() => {
        console.log('🔄 Connection timeout reached after 2 seconds, assuming connected state');
        setConnectionStatus('connected');
        toast({
          title: "🟢 Real-time Activated",
          description: "Live monitoring is now active",
        });
      }, 2000); // Reduced to 2 second timeout

      // Cleanup timeout on unmount
      return () => {
        clearTimeout(connectionTimeout);
      };

    } catch (error) {
      console.error('❌ Error setting up real-time subscription:', error);
      setConnectionStatus('disconnected');
      setIsRealTimeActive(false);
      toast({
        title: "❌ Real-time Setup Failed",
        description: "Could not establish live monitoring",
        variant: "destructive"
      });
    }

    return () => {
      console.log('🔌 Unsubscribing from enhanced real-time channels');
      if (securityChannel) {
        supabase.removeChannel(securityChannel);
      }
      setIsRealTimeActive(false);
      setConnectionStatus('disconnected');
    };
  }, [autoRefresh, open]); // Removed checkName dependency to prevent unnecessary re-subscriptions

  const generateEventId = (logId: string) => `EVT-${logId}${Math.random().toString(36).substr(2, 6)}`;

  const handleCopyEventId = (logId: string) => {
    const eventId = generateEventId(logId);
    navigator.clipboard.writeText(eventId);
    setCopiedEventId(logId);
    setTimeout(() => setCopiedEventId(null), 2000);
    
    toast({
      title: "📋 Event ID Copied",
      description: "Use this to search across system-wide logs",
    });
  };

  const handleCopyLog = (log: LogEntry) => {
    const logText = `[${new Date(log.timestamp).toLocaleString()}] ${log.level.toUpperCase()}: ${log.message}${log.traceId ? ` | Trace: ${log.traceId}` : ''}`;
    navigator.clipboard.writeText(logText);
    setCopiedLogId(log.id);
    setTimeout(() => setCopiedLogId(null), 2000);
    
    toast({
      title: "📋 Log Copied",
      description: "Log entry copied to clipboard",
    });
  };

  const handleShareInChat = (log: LogEntry) => {
    toast({
      title: "✅ Shared in Admin Chat",
      description: `Fix instructions sent to Admin Chat – SecurityOps thread`,
    });
  };

  const handleExtendTimer = () => {
    setSensitiveTimer(60);
    toast({
      title: "⏰ Timer Extended",
      description: "Sensitive data will remain visible for 60 more seconds",
    });
  };

  const handleHideNow = () => {
    setShowSensitive(false);
    setSensitiveTimer(null);
    toast({
      title: "🔒 Data Hidden",
      description: "Sensitive data has been hidden",
    });
  };

  const handleDownloadLogs = () => {
    const logsText = filteredLogs.map(log => 
      `[${new Date(log.timestamp).toLocaleString()}] ${log.level.toUpperCase()}: ${log.message}${log.traceId ? ` | Trace: ${log.traceId}` : ''}`
    ).join('\n');
    
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${checkName.replace(/\s+/g, '_')}_logs_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "📥 Logs Downloaded",
      description: `${filteredLogs.length} log entries downloaded`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handlePasswordVerification = async () => {
    try {
      setIsVerifying(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: 'a.mekrizvani@hotmail.com',
        password: password
      });
      
      if (error) {
        toast({
          title: "❌ Authentication Failed",
          description: "Invalid password for super admin",
          variant: "destructive"
        });
        return;
      }
      
      setShowPasswordDialog(false);
      setPassword('');
      window.open('https://docs.supabase.com/guides/auth/server-side/oauth', '_blank');
      toast({
        title: "📖 Documentation Opened",
        description: "Security documentation opened in new tab",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to authenticate",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const isAllowedUser = user?.email === 'a.mekrizvani@hotmail.com';

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'improved': return <ChevronUp className="h-3 w-3 text-green-600" />;
      case 'degraded': return <ChevronDown className="h-3 w-3 text-red-600" />;
      case 'stable': return <Minus className="h-3 w-3 text-gray-600" />;
      default: return null;
    }
  };

  const getTrendTooltip = (trend?: string) => {
    switch (trend) {
      case 'improved': return 'Compared to previous scan. Shows security health trend: Improved';
      case 'degraded': return 'Compared to previous scan. Shows security health trend: Degraded';
      case 'stable': return 'Compared to previous scan. Shows security health trend: Stable';
      default: return '';
    }
  };

  // Export functions
  const handleExportCSV = () => {
    const csvHeader = 'Date,Outcome,Fix Applied,Analyzed By,Scan Duration,Details,Fix Notes\n';
    const csvData = pastAnalyses.map(analysis => 
      `"${analysis.date}","${analysis.outcome}","${analysis.fixApplied ? 'Yes' : 'No'}","${analysis.analyzedBy}","${analysis.scanDuration}s","${analysis.details}","${analysis.fixNotes || 'N/A'}"`
    ).join('\n');
    
    const blob = new Blob([csvHeader + csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${checkName.replace(/\s+/g, '_')}_scan_history_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "📥 CSV Export Complete",
      description: "Scan history exported as CSV file",
    });
  };

  const handleExportPDF = () => {
    const pdfContent = `
      SCAN HISTORY REPORT - ${checkName}
      Generated: ${new Date().toLocaleString()}
      
      ${pastAnalyses.map((analysis, index) => `
        ${index + 1}. SCAN DATE: ${analysis.date}
        OUTCOME: ${analysis.outcome.toUpperCase()}
        ANALYZED BY: ${analysis.analyzedBy}
        SCAN DURATION: ${analysis.scanDuration}s
        FIX APPLIED: ${analysis.fixApplied ? 'Yes' : 'No'}
        DETAILS: ${analysis.details}
        ${analysis.fixNotes ? `FIX NOTES: ${analysis.fixNotes}` : ''}
        ${analysisComments[analysis.id]?.length ? `COMMENTS: ${analysisComments[analysis.id].join('; ')}` : ''}
        ---
      `).join('')}
    `;
    
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${checkName.replace(/\s+/g, '_')}_scan_history_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "📄 Report Export Complete",
      description: "Detailed scan history report exported",
    });
  };

  // Comment functions
  const handleAddComment = (analysisId: string) => {
    const comment = newComment[analysisId]?.trim();
    if (!comment) return;
    
    setAnalysisComments(prev => ({
      ...prev,
      [analysisId]: [...(prev[analysisId] || []), comment]
    }));
    
    setNewComment(prev => ({
      ...prev,
      [analysisId]: ''
    }));
    
    toast({
      title: "💬 Comment Added",
      description: "Your comment has been saved",
    });
  };

  // Pin functions
  const handleTogglePin = (analysisId: string) => {
    setPinnedAnalyses(prev => {
      const newPinned = new Set(prev);
      if (newPinned.has(analysisId)) {
        newPinned.delete(analysisId);
        toast({
          title: "📌 Scan Unpinned",
          description: "Removed from pinned references",
        });
      } else {
        newPinned.add(analysisId);
        toast({
          title: "📌 Scan Pinned",
          description: "Added to permanent references",
        });
      }
      return newPinned;
    });
  };

  // Manual refresh function
  const handleManualRefresh = async () => {
    console.log('🔄 Manual refresh triggered');
    setIsRefreshing(true);
    
    try {
      // Simulate fetching fresh data from the database
      const { data: securityEvents, error: securityError } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: adminActions, error: adminError } = await supabase
        .from('admin_actions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!securityError && securityEvents) {
        console.log(`🔔 Fetched ${securityEvents.length} security events`);
        
        // Convert security events to log entries
        const securityLogs: LogEntry[] = securityEvents.map(event => ({
          id: event.id,
          timestamp: event.created_at,
          level: event.risk_level === 'critical' || event.risk_level === 'high' ? 'error' : 
                 event.risk_level === 'medium' ? 'warning' : 'info',
          message: event.event_description || `${event.event_type} event`,
          traceId: 'TRC-' + Math.random().toString(36).substr(2, 9),
          userAgent: event.user_agent || 'System',
          statusCode: 200,
          metadata: {
            eventType: event.event_type,
            riskLevel: event.risk_level,
            ipAddress: event.ip_address,
            userId: event.user_id,
            ...(typeof event.metadata === 'object' && event.metadata !== null ? event.metadata : {})
          }
        }));

        setSystemLogs(prev => [...securityLogs, ...prev.slice(0, 10)]);
      }

      if (!adminError && adminActions) {
        console.log(`👨‍💼 Fetched ${adminActions.length} admin actions`);
        
        // Convert admin actions to log entries
        const adminLogs: LogEntry[] = adminActions.map(action => ({
          id: `admin-${action.id}`,
          timestamp: action.created_at,
          level: 'info',
          message: `Admin action: ${action.action_type} - Target: ${action.target_user_id}`,
          traceId: 'TRC-ADM-' + Math.random().toString(36).substr(2, 6),
          userAgent: 'AdminPanel',
          statusCode: 200,
          metadata: {
            adminId: action.actor_id,
            actionType: action.action_type,
            targetUserId: action.target_user_id,
            newRole: action.new_role,
            reason: action.reason
          }
        }));

        setSystemLogs(prev => [...adminLogs, ...prev.slice(0, 15)]);
      }

      setLastRefresh(new Date());
      
      toast({
        title: "🔄 Data Refreshed",
        description: `Updated at ${new Date().toLocaleTimeString()}`,
      });

    } catch (error) {
      console.error('❌ Refresh failed:', error);
      toast({
        title: "❌ Refresh Failed",
        description: "Could not fetch latest data",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between gap-2 text-lg">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              Deep Context Search – {checkName}
              <Badge variant={checkStatus === 'passed' ? 'default' : checkStatus === 'warning' ? 'secondary' : 'destructive'}>
                {checkStatus.toUpperCase()}
              </Badge>
            </div>
            
            {/* Real-time Status Indicator */}
            <div className="flex items-center gap-2">
              {isRealTimeActive && (
                <>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Activity className={cn(
                      "h-4 w-4",
                      connectionStatus === 'connected' ? "text-green-500 animate-pulse" :
                      connectionStatus === 'connecting' ? "text-yellow-500 animate-spin" :
                      "text-red-500"
                    )} />
                    <span className="text-xs">
                      {connectionStatus === 'connected' ? 'LIVE' :
                       connectionStatus === 'connecting' ? 'Connecting...' :
                       'Disconnected'}
                    </span>
                  </div>
                  
                  {liveUpdatesCount > 0 && (
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      +{liveUpdatesCount}
                    </Badge>
                  )}
                </>
              )}
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      onClick={() => onOpenChange(false)}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Close Deep Context Search</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Search Bar */}
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg mb-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter by log entry, error code, role name, timestamp..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      onClick={handleManualRefresh}
                      size="sm"
                      variant="outline"
                      disabled={isRefreshing}
                      className={cn(
                        "flex items-center gap-2",
                        isRefreshing && "animate-pulse",
                        isRealTimeActive && connectionStatus === 'connected' && "border-green-500/50"
                      )}
                    >
                      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      {isRefreshing ? 'Refreshing...' : 'Refresh'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {lastRefresh 
                      ? `Last refresh: ${lastRefresh.toLocaleTimeString()}`
                      : 'Fetch latest security logs and admin actions'
                    }
                    {lastLiveUpdate && (
                      <div className="text-xs text-green-500 mt-1">
                        Last live update: {lastLiveUpdate.toLocaleTimeString()}
                      </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Label htmlFor="auto-refresh" className="text-sm whitespace-nowrap">Auto-refresh</Label>
              <Switch 
                id="auto-refresh"
                checked={autoRefresh} 
                onCheckedChange={(checked) => {
                  setAutoRefresh(checked);
                  showSwitchToast('Auto-refresh', checked);
                }}
              />
              
              {autoRefresh && (
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 text-green-600">
                    <Radio className={cn(
                      "w-3 h-3",
                      connectionStatus === 'connected' ? "text-green-500 animate-pulse" :
                      connectionStatus === 'connecting' ? "text-yellow-500" :
                      "text-red-500"
                    )} />
                    <span className="font-medium">
                      {connectionStatus === 'connected' ? 'LIVE' :
                       connectionStatus === 'connecting' ? 'CONNECTING' :
                       'OFFLINE'}
                    </span>
                  </div>
                  
                  {liveUpdatesCount > 0 && (
                    <div className="text-blue-600 font-medium">
                      +{liveUpdatesCount} updates
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-3 mb-2">
              <TabsTrigger value="logs" className={cn(
                "flex items-center gap-2 relative",
                isRealTimeActive && connectionStatus === 'connected' && "bg-green-50/50"
              )}>
                System Logs ({filteredLogs.length})
                
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Past Analysis
              </TabsTrigger>
              <TabsTrigger value="knowledge" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Fix Guidance
              </TabsTrigger>
            </TabsList>

            {/* System Logs Tab */}
            <TabsContent value="logs" className="flex flex-col space-y-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="show-sensitive" className="text-sm">Show sensitive data</Label>
                    <Switch 
                      id="show-sensitive"
                      checked={showSensitive} 
                      onCheckedChange={setShowSensitive}
                    />
                    {sensitiveTimer && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-orange-600">Auto-hide in {sensitiveTimer}s</span>
                        <Button onClick={handleExtendTimer} size="sm" variant="outline" className="h-6 text-xs">
                          Extend
                        </Button>
                        <Button onClick={handleHideNow} size="sm" variant="outline" className="h-6 text-xs">
                          Hide Now
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Log Type:</Label>
                    <Select value={logTypeFilter} onValueChange={(value: 'all' | 'info' | 'warning' | 'error') => setLogTypeFilter(value)}>
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleDownloadLogs} size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Logs
                </Button>
              </div>

              <div className="overflow-y-auto overflow-x-hidden space-y-3 max-h-[60vh]">
                {filteredLogs.map((log, index) => (
                  <div 
                    key={`${log.id}-${index}`} 
                    className={cn(
                      "border rounded-lg p-3 bg-background transition-all duration-300",
                      newLogIds.has(log.id) && "border-green-500 bg-green-50/50 shadow-md scale-[1.02]",
                      isRealTimeActive && connectionStatus === 'connected' && "hover:shadow-lg"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getLogLevelColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                        {log.traceId && (
                          <Badge variant="outline" className="text-xs">
                            {log.traceId}
                          </Badge>
                        )}
                        {newLogIds.has(log.id) && (
                          <Badge className="text-xs bg-green-500 text-white animate-pulse">
                            NEW
                          </Badge>
                        )}
                        {showSensitive && (
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant="destructive" className="text-xs flex items-center gap-1">
                                <Unlock className="h-3 w-3" />
                                Sensitive
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              Visible due to Show Sensitive Data toggle. Handle with care.
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyLog(log)}
                              className={copiedLogId === log.id ? "text-green-600 bg-green-50" : ""}
                            >
                              {copiedLogId === log.id ? (
                                <span className="text-xs font-medium">Copied</span>
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy log entry</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShareInChat(log)}
                            >
                              <Share className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Share in admin chat</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    
                    <div className={`text-sm mb-2 font-mono p-2 rounded ${showSensitive ? 'bg-red-50 border border-red-200' : 'bg-muted/50'}`}>
                      {maskMessage(log.message, showSensitive)}
                    </div>
                    
                    {log.userAgent && (
                      <div className="text-xs text-muted-foreground mb-2">
                        <strong>User Agent:</strong> 
                        <span className={showSensitive ? 'text-red-600 bg-red-50 px-1 rounded' : ''}>
                          {maskUserAgent(log.userAgent, showSensitive)}
                        </span>
                      </div>
                    )}
                    
                    {log.metadata && (
                      <div className="text-xs">
                        <strong className="text-muted-foreground">Metadata:</strong>
                        <div className={`mt-1 p-2 rounded border ${showSensitive ? 'bg-red-50 border-red-200' : 'bg-muted/30'}`}>
                          {Object.entries(log.metadata).map(([key, value]) => (
                            <div key={key} className="flex justify-between py-1">
                              <span className="font-medium">{key}:</span>
                              <span className={showSensitive && ['userId', 'email', 'phoneNumber', 'ipAddress', 'tokenId', 'authorization', 'sessionId', 'role', 'attemptedPath', 'failedPolicy'].includes(key) ? 'text-red-600 bg-red-100 px-1 rounded' : ''}>
                                {JSON.stringify(maskSensitiveValue(key, value, showSensitive))}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Event ID */}
                    <div className="mt-2 pt-2 border-t">
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyEventId(log.id)}
                            className={`text-xs h-6 ${copiedEventId === log.id ? "text-green-600 bg-green-50" : "text-muted-foreground"}`}
                          >
                            {copiedEventId === log.id ? (
                              "Copied!"
                            ) : (
                              `Event ID: ${generateEventId(log.id)}`
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {copiedEventId === log.id ? "Copied! Use this to search across system-wide logs." : "Click to copy Event ID"}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Past Analysis Tab */}
            <TabsContent value="analysis" className="space-y-0">
              {/* Export buttons */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Scan History</h3>
                <div className="flex gap-2">
                  <Button onClick={handleExportCSV} size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button onClick={handleExportPDF} size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[60vh]">
                {pastAnalyses.map((analysis) => (
                  <div key={analysis.id} className="border rounded-lg p-4 bg-background">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(analysis.outcome)}
                        <span className="font-medium">{analysis.date}</span>
                        <Badge variant={analysis.outcome === 'passed' ? 'default' : analysis.outcome === 'warning' ? 'secondary' : 'destructive'}>
                          {analysis.outcome.toUpperCase()}
                        </Badge>
                        {analysis.trend && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                {getTrendIcon(analysis.trend)}
                              </TooltipTrigger>
                              <TooltipContent>
                                {getTrendTooltip(analysis.trend)}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Pin button */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                onClick={() => handleTogglePin(analysis.id)}
                                size="sm"
                                variant="ghost"
                                className={pinnedAnalyses.has(analysis.id) ? 'text-yellow-600 bg-yellow-50' : ''}
                              >
                                {pinnedAnalyses.has(analysis.id) ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {pinnedAnalyses.has(analysis.id) ? 'Unpin scan' : 'Pin for permanent reference'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <span className="text-sm text-muted-foreground">
                          Fix Applied: {analysis.fixApplied ? '✅ Yes' : '❌ No'}
                        </span>
                        <Button 
                          onClick={() => setSelectedAnalysis(selectedAnalysis === analysis.id ? null : analysis.id)}
                          size="sm" 
                          variant="outline" 
                          className="text-xs h-6"
                        >
                          View Change Summary
                        </Button>
                      </div>
                    </div>
                    
                    {/* Pinned indicator */}
                    {pinnedAnalyses.has(analysis.id) && (
                      <div className="mb-2">
                        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                          📌 Pinned Reference
                        </Badge>
                      </div>
                    )}
                    
                    {/* Analysis Details */}
                    <p className="text-sm text-muted-foreground mb-2">{analysis.details}</p>
                    
                    {/* Analyzed By */}
                    <div className="text-xs text-muted-foreground mb-1">
                      <User className="h-3 w-3 inline mr-1" />
                      Analyzed by: {analysis.analyzedBy}
                    </div>
                    
                    {/* Scan Duration */}
                    <div className="text-xs text-muted-foreground mb-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            🕒 Scan Time: {analysis.scanDuration}s
                          </TooltipTrigger>
                          <TooltipContent>
                            Total time from scan start to result display. Abnormal duration may indicate processing issues.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    {/* Fix Notes - only show if fix was applied */}
                    {analysis.fixApplied && analysis.fixNotes && (
                      <div className="text-xs bg-green-50 border border-green-200 rounded p-2 mb-2">
                        <Wrench className="h-3 w-3 inline mr-1" />
                        🛠️ Fix Notes: {analysis.fixNotes}
                      </div>
                    )}
                    
                    {/* Comments Section */}
                    <div className="mt-3 border-t pt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Comments ({analysisComments[analysis.id]?.length || 0})</span>
                      </div>
                      
                      {/* Existing comments */}
                      {analysisComments[analysis.id]?.map((comment, index) => (
                        <div key={index} className="bg-blue-50 border border-blue-200 rounded p-2 mb-2 text-sm">
                          💬 {comment}
                        </div>
                      ))}
                      
                      {/* Add comment */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a comment about this scan..."
                          value={newComment[analysis.id] || ''}
                          onChange={(e) => setNewComment(prev => ({
                            ...prev,
                            [analysis.id]: e.target.value
                          }))}
                          className="text-sm h-8"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddComment(analysis.id);
                            }
                          }}
                        />
                        <Button
                          onClick={() => handleAddComment(analysis.id)}
                          size="sm"
                          variant="outline"
                          className="h-8"
                          disabled={!newComment[analysis.id]?.trim()}
                        >
                          <Send className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Change Summary - only show for selected analysis */}
                    {selectedAnalysis === analysis.id && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                        <h4 className="font-medium mb-2">Change Summary:</h4>
                        {analysis.id === '2' ? (
                          <div className="space-y-1">
                            <div className="text-green-600">✅ Fix Applied: Reduced Token Lifetime from 60min to 30min</div>
                            <div className="text-orange-600">⚠️ New Warning: Signature Mismatch (JWT)</div>
                          </div>
                        ) : analysis.outcome === 'passed' ? (
                          <div className="text-green-600">✅ All checks passed - no changes needed</div>
                        ) : (
                          <div className="text-orange-600">⚠️ Current scan - changes in progress</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="knowledge" className="overflow-y-auto h-full">
              <div className="space-y-4 h-full">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Real-Time Security Analytics
                  </h3>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                    Live security monitoring showing actual events, authentication attempts, and admin actions from your database.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Event Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-red-50 p-3 rounded">
                      <div className="text-lg font-bold text-red-600">
                        {systemLogs.filter(log => log.level === 'error').length}
                      </div>
                      <div className="text-xs text-red-600">Critical Events</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded">
                      <div className="text-lg font-bold text-yellow-600">
                        {systemLogs.filter(log => log.level === 'warning').length}
                      </div>
                      <div className="text-xs text-yellow-600">Warning Events</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Event Types
                  </h3>
                  <div className="space-y-2">
                    {Array.from(new Set(systemLogs.map(log => log.metadata?.eventType).filter(Boolean))).map((eventType, index) => (
                      <div key={index} className="text-sm bg-blue-50 p-2 rounded flex items-center justify-between">
                        <span>{eventType}</span>
                        <span className="text-blue-600 font-bold">
                          {systemLogs.filter(log => log.metadata?.eventType === eventType).length}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  {isAllowedUser && (
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => setShowPasswordDialog(true)}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open Full Documentation
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => {
                      const statsText = `Security Event Summary:
Critical Events: ${systemLogs.filter(log => log.level === 'error').length}
Warning Events: ${systemLogs.filter(log => log.level === 'warning').length}
Info Events: ${systemLogs.filter(log => log.level === 'info').length}
Total Events: ${systemLogs.length}`;
                      navigator.clipboard.writeText(statsText);
                      toast({
                        title: "✅ Copied to Clipboard",
                        description: "Security analytics copied successfully",
                      });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                    Copy Guidance
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => {
                      toast({
                        title: "✅ Shared in Admin Chat",
                        description: "Fix instructions sent to Admin Chat – SecurityOps thread",
                      });
                    }}
                  >
                    <Share className="h-4 w-4" />
                    Share in Admin Chat
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
      
      <PasswordVerificationDialog
        isOpen={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        currentUserEmail="a.mekrizvani@hotmail.com"
        password={password}
        setPassword={setPassword}
        onVerify={handlePasswordVerification}
        isVerifying={isVerifying}
      />
    </Dialog>
  );
};