import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useSidebar } from '@/components/ui/sidebar';
import { AuthModuleCard } from './AuthModuleCard';
import { ChecklistItem } from './ChecklistItem';
import EnhancedDiagnosticModal from './EnhancedDiagnosticModal';
import { EnhancedSecurityAnalysisModal } from './EnhancedSecurityAnalysisModal';
import { Play, Download, Settings, RefreshCw, Smartphone, Monitor, Info, Eye, Clock, ChevronDown, Pause, Filter, Save, FileText, Copy, Maximize2, Minimize2, MoreVertical, Search, Archive, BarChart3, History, AlertTriangle, CheckCircle, XCircle, TrendingUp, Wifi, Activity, Zap, Shield, X } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Switch } from '@/components/ui/switch';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// InfoTooltip component for consistent tooltips with consequences
const InfoTooltip = ({ children, content, type = 'info' }: { 
  children: React.ReactNode, 
  content: string, 
  type?: 'info' | 'warning' | 'danger' 
}) => {
  const iconColor = type === 'danger' ? 'text-red-500' : type === 'warning' ? 'text-yellow-500' : 'text-blue-500';
  
  const formatContent = (text: string) => {
    const parts = text.split('CONSEQUENCES:');
    if (parts.length === 1) return <p className="text-sm">{text}</p>;
    
    return (
      <div>
        <p className="text-sm">{parts[0]}</p>
        <p className="text-sm"><span className="text-red-500 font-semibold">CONSEQUENCES:</span>{parts[1]}</p>
      </div>
    );
  };
  
  return (
    <div className="flex items-center gap-2">
      {children}
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className={`h-4 w-4 ${iconColor} cursor-help`} />
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <div className="space-y-2">
            {formatContent(content)}
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export const CoreAuthenticationDashboard: React.FC = () => {
  const { toast } = useToast();
  const { open } = useSidebar();
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [lastDiagnostic, setLastDiagnostic] = useState<Date | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [failedModules, setFailedModules] = useState<string[]>([]);
  const [moduleStatuses, setModuleStatuses] = useState<{[key: string]: 'success' | 'warning' | 'error'}>({});
  const [lastLogPath, setLastLogPath] = useState<string>('');
  const [sessionInfo, setSessionInfo] = useState<string>('');
  const [diagnosticProgress, setDiagnosticProgress] = useState<string>('');
  const [showDiagnosticResults, setShowDiagnosticResults] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<{
    passed: string[];
    warnings: string[];
    failed: string[];
    recommendations: string[];
  }>({ passed: [], warnings: [], failed: [], recommendations: [] });
  const [showSecurityDetails, setShowSecurityDetails] = useState(false);
  const [showDiagnosticProgress, setShowDiagnosticProgress] = useState(false);
  const [diagnosticStartTime, setDiagnosticStartTime] = useState<Date | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<Array<{timestamp: string, message: string, timePrefix: string, type: 'info' | 'success' | 'warning' | 'error', traceId?: string}>>([]);
  const [showCompletionBanner, setShowCompletionBanner] = useState(false);
  const [canViewSummary, setCanViewSummary] = useState(false);
  
  // Enhanced debug console state
  const [recentRequests, setRecentRequests] = useState<Array<{
    id: string;
    method: string;
    path: string;
    status: number;
    responseTime: number;
    timestamp: Date;
    requestBody?: any;
    responseBody?: any;
    headers?: any;
  }>>([]);
  
  const [errorCounts, setErrorCounts] = useState<{[key: string]: {count: number, lastOccurrence: Date, stackTrace?: string, frequency?: number}}>({
    'Role not found': {count: 0, lastOccurrence: new Date()},
    'Token mismatch': {count: 0, lastOccurrence: new Date()},
    'Session timeout': {count: 0, lastOccurrence: new Date()},
    'Invalid credentials': {count: 0, lastOccurrence: new Date()}
  });
  
  const [envStatus, setEnvStatus] = useState<{[key: string]: {status: 'loaded' | 'missing' | 'invalid' | 'expired', value?: string}}>({
    SUPABASE_URL: {status: 'loaded'},
    SUPABASE_ANON_KEY: {status: 'loaded'},
    NODE_ENV: {status: 'loaded', value: 'development'},
    AUTH_PROVIDERS: {status: 'loaded', value: 'Google, Email, Phone'},
    JWT_SECRET: {status: 'expired'},
    DATABASE_URL: {status: 'missing'}
  });
  
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [debugAutoRefresh, setDebugAutoRefresh] = useState(true);
  const [debugSessionStartTime] = useState(new Date());
  const [manualRefreshCount, setManualRefreshCount] = useState(0);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [logFilter, setLogFilter] = useState<'all' | 'success' | 'warning' | 'error' | 'info'>('all');
  const [showEnvKeys, setShowEnvKeys] = useState(false);
  const [selectedError, setSelectedError] = useState<string | null>(null);
  const [currentlyChecking, setCurrentlyChecking] = useState<string>('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isActivelyScanning, setIsActivelyScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanPhase, setCurrentScanPhase] = useState('');
  const [showIntelligenceView, setShowIntelligenceView] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showDetailsModal, setShowDetailsModal] = useState<string | null>(null);
  const [showInvestigationModal, setShowInvestigationModal] = useState<string | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showApplyFixModal, setShowApplyFixModal] = useState<string | null>(null);
  const [showLearnMoreModal, setShowLearnMoreModal] = useState<string | null>(null);
  const [aiQuery, setAiQuery] = useState('');
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const terminalRef = React.useRef<HTMLDivElement>(null);
  const [selectedSecurityIssue, setSelectedSecurityIssue] = useState<{
    title: string;
    type: 'warning' | 'critical';
    description: string;
    dangers: string[];
    solutions: string[];
    quickFixes: Array<{name: string; action: string; risk: string}>;
  } | null>(null);

  // Enhanced diagnostic state
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [selectedLogSeverity, setSelectedLogSeverity] = useState<'all' | 'warning' | 'error' | 'success' | 'info'>('all');
  const [pinnedLogs, setPinnedLogs] = useState<Set<string>>(new Set());
  const [isMinimized, setIsMinimized] = useState(false);
  const [scanPaused, setScanPaused] = useState(false);
  const [metricsHistory, setMetricsHistory] = useState<{
    cpu: number[];
    memory: number[];
    network: number[];
  }>({
    cpu: Array(20).fill(0).map(() => Math.random() * 30 + 10),
    memory: Array(20).fill(0).map(() => Math.random() * 40 + 40),
    network: Array(20).fill(0).map(() => Math.random() * 60 + 20)
  });
  const [offlineModules, setOfflineModules] = useState<Array<{name: string; reason: string}>>([
    { name: 'JWT Validator', reason: 'Token expired' },
    { name: 'OAuth2 Provider', reason: 'Network timeout' }
  ]);
  const [securityEvents, setSecurityEvents] = useState<Array<{
    id: string;
    type: string;
    count: number;
    severity: 'low' | 'medium' | 'high';
    timestamp: Date;
    description: string;
  }>>([
    { id: '1', type: 'Login successful', count: 247, severity: 'low', timestamp: new Date(Date.now() - 60000), description: 'Standard user authentication' },
    { id: '2', type: 'Rate limit triggered', count: 12, severity: 'medium', timestamp: new Date(Date.now() - 120000), description: 'Multiple rapid requests detected' },
    { id: '3', type: 'Suspicious activity', count: 3, severity: 'high', timestamp: new Date(Date.now() - 180000), description: 'Anomalous login patterns' },
    { id: '4', type: 'Session extended', count: 89, severity: 'low', timestamp: new Date(Date.now() - 240000), description: 'Automatic session renewal' }
  ]);

  // WCAG Accessibility Checker State
  const [isWCAGChecking, setIsWCAGChecking] = useState(false);
  const [wcagResults, setWcagResults] = useState<{
    issues: Array<{
      type: string;
      count: number;
      severity: 'high' | 'moderate' | 'low';
      examples: string[];
    }>;
    totalIssues: number;
    isCompliant: boolean;
  } | null>(null);
  
  const [showWCAGModal, setShowWCAGModal] = useState(false);
  
  // Export settings state that persists
  const [exportSettings, setExportSettings] = useState(() => {
    const saved = localStorage.getItem('exportSettings');
    return saved ? JSON.parse(saved) : {
      includeTimestamp: true,
      includeSystemWarnings: true,
      includeHiddenModules: false
    };
  });

  // Save export settings to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('exportSettings', JSON.stringify(exportSettings));
  }, [exportSettings]);

  const updateExportSetting = (key: string, value: boolean) => {
    setExportSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Settings Saved",
      description: `Export setting "${key}" ${value ? 'enabled' : 'disabled'}`,
      duration: 2000,
    });
  };
  
  // Check screen size for mobile responsiveness
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Auto-scroll terminal to bottom when new logs are added (only if enabled)
  useEffect(() => {
    if (terminalRef.current && autoScrollEnabled) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLogs, autoScrollEnabled]);

  // Update metrics history - PERFORMANCE OPTIMIZED
  useEffect(() => {
    // PERFORMANCE FIX: Reduced from 2s to 30s to prevent slowdown
    const interval = setInterval(() => {
      setMetricsHistory(prev => ({
        cpu: [...prev.cpu.slice(1), Math.random() * 30 + 10],
        memory: [...prev.memory.slice(1), Math.random() * 40 + 40],
        network: [...prev.network.slice(1), Math.random() * 60 + 20]
      }));
    }, 30000); // FIXED: Changed from 2000ms to 30000ms (30 seconds)

    return () => clearInterval(interval);
  }, []);

  // Auto-start scanning when diagnostic progress panel opens
  useEffect(() => {
    if (showDiagnosticProgress && !isActivelyScanning) {
      startDiagnosticScan();
    }
  }, [showDiagnosticProgress]);

  // Handle global mouse events for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setDragPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  // Auto-refresh debug logs and simulate live authentication events
  useEffect(() => {
    let logInterval: ReturnType<typeof setInterval>;
    let requestInterval: ReturnType<typeof setInterval>;
    
    if (debugAutoRefresh) {
      // Generate live auth logs every 3-8 seconds
      logInterval = setInterval(() => {
        const authEvents = [
          { message: `✅ Login attempt successful – user: @andi.mekrizvani (auth/email)`, type: 'success' as const },
          { message: `⚠️ Slow token refresh – took ${Math.floor(Math.random() * 400 + 400)}ms`, type: 'warning' as const },
          { message: `❌ Role mismatch – token did not contain admin role`, type: 'error' as const },
          { message: `🔄 Session extended for user ${Math.floor(Math.random() * 1000)}`, type: 'info' as const },
          { message: `✅ Password reset requested for user@domain.com`, type: 'success' as const },
          { message: `⚠️ Multiple login attempts from IP 192.168.1.${Math.floor(Math.random() * 255)}`, type: 'warning' as const },
          { message: `🔐 2FA verification completed successfully`, type: 'success' as const },
          { message: `❌ Invalid JWT token detected`, type: 'error' as const },
        ];
        
        const randomEvent = authEvents[Math.floor(Math.random() * authEvents.length)];
        const now = new Date();
        const traceId = `auth-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        setTerminalLogs(prev => [
          ...prev.slice(-50), // Keep only last 50 logs
          {
            timestamp: now.toLocaleTimeString(),
            message: randomEvent.message,
            timePrefix: `[${now.toLocaleTimeString()}]`,
            type: randomEvent.type,
            traceId
          }
        ]);
        
        // Update error counts
        if (randomEvent.type === 'error') {
          const errorType = randomEvent.message.includes('Role mismatch') ? 'Role not found' :
                           randomEvent.message.includes('JWT token') ? 'Token mismatch' : 'Invalid credentials';
          
          setErrorCounts(prev => ({
            ...prev,
            [errorType]: {
              count: prev[errorType].count + 1,
              lastOccurrence: now,
              stackTrace: `Error at line ${Math.floor(Math.random() * 100)}\n  at auth.verify()\n  at middleware.check()`,
              frequency: calculateFrequency(prev[errorType].count + 1, 5 * 60 * 1000) // per minute over 5 minutes
            }
          }));
        }
        
        // Add auto-refresh indicator
        if (Math.random() > 0.7) { // 30% chance to show refresh indicator
          const refreshCount = terminalLogs.length + 1;
          setTerminalLogs(prev => [
            ...prev.slice(-49), // Keep only last 49 logs + refresh indicator
            {
              timestamp: now.toLocaleTimeString(),
              message: `🔄 Auto-refresh: ${refreshCount} log entries updated`,
              timePrefix: `[${now.toLocaleTimeString()}]`,
              type: 'info' as const,
              traceId: `refresh-${Date.now()}`
            }
          ]);
        }
      }, Math.random() * 5000 + 3000);

      // Generate request traces every 2-4 seconds
      requestInterval = setInterval(() => {
        const requestTypes = [
          { method: 'POST', path: '/auth/signin', status: 200 },
          { method: 'GET', path: '/auth/user', status: 200 },
          { method: 'POST', path: '/auth/refresh', status: 200 },
          { method: 'GET', path: '/auth/session', status: Math.random() > 0.8 ? 401 : 200 },
          { method: 'POST', path: '/auth/signout', status: 200 },
          { method: 'GET', path: '/auth/providers', status: 200 },
          { method: 'POST', path: '/auth/forgot-password', status: 200 },
          { method: 'POST', path: '/auth/verify-otp', status: Math.random() > 0.9 ? 400 : 200 },
        ];
        
        const randomRequest = requestTypes[Math.floor(Math.random() * requestTypes.length)];
        const responseTime = Math.floor(Math.random() * 300 + 50);
        
        const newRequest = {
          id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          method: randomRequest.method,
          path: randomRequest.path,
          status: randomRequest.status,
          responseTime,
          timestamp: new Date(),
          requestBody: randomRequest.method === 'POST' ? { email: 'user@example.com' } : undefined,
          responseBody: randomRequest.status === 200 ? { success: true } : { error: 'Unauthorized' },
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ***' }
        };
        
        setRecentRequests(prev => [newRequest, ...prev.slice(0, 19)]); // Keep last 20 requests
      }, Math.random() * 2000 + 2000);
    }
    
    return () => {
      if (logInterval) clearInterval(logInterval);
      if (requestInterval) clearInterval(requestInterval);
    };
  }, [debugAutoRefresh, terminalLogs.length]);

  // Helper function to calculate frequency
  const calculateFrequency = (count: number, timeWindowMs: number) => {
    return Number((count / (timeWindowMs / 60000)).toFixed(1)); // per minute
  };

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  // Utility functions for debug console
  const getLogIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  };

  const copyLogLine = (log: any) => {
    const logText = `${log.timePrefix} ${log.message}`;
    navigator.clipboard.writeText(logText);
    toast({ title: "📋 Log line copied", duration: 1500 });
  };

  const clearAllLogs = () => {
    setTerminalLogs([]);
    setRecentRequests([]);
    setManualRefreshCount(0);
    toast({ title: "🗑️ Debug logs cleared", duration: 2000 });
  };

  // Helper function for filtered logs (removing duplicate)

  // Export logs function  
  const exportDiagnosticLogs = (format: 'txt' | 'log' | 'csv' | 'json' = 'txt') => {
    const filteredLogs = getFilteredLogs();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const content = filteredLogs.map(log => `${log.timePrefix} ${log.message}`).join('\n');
    const filename = `diagnostic-logs-${timestamp}.${format}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "📁 Logs Exported",
      description: `Saved as ${filename}`,
      duration: 3000,
    });
  };

  const exportDebugSession = (format: 'json' | 'txt' | 'csv' = 'txt') => {
    const filteredLogs = getFilteredLogs();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    const debugMeta = {
      session: "Core Authentication Debug",
      startedAt: debugSessionStartTime.toISOString(),
      duration: `${Math.round((Date.now() - debugSessionStartTime.getTime()) / 1000)}s`,
      manualRefreshes: manualRefreshCount,
      autoRefreshEnabled: debugAutoRefresh,
      logFilter: logFilter,
      totalEntries: terminalLogs.length,
      filteredEntries: filteredLogs.length,
      entries: filteredLogs,
      recentRequests: recentRequests.slice(0, 10), // Only last 10 requests for security
      errorSummary: Object.entries(errorCounts)
        .filter(([, data]) => data.count > 0)
        .map(([type, data]) => ({
          type,
          count: data.count,
          frequency: data.frequency,
          lastOccurrence: data.lastOccurrence.toISOString()
        })),
      environmentStatus: Object.entries(envStatus)
        .map(([key, value]) => ({
          key,
          status: value.status,
          secure: true // Don't expose actual values
        }))
    };

    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'txt':
        content = `Core Debug Log – Exported ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n` +
                 `=========================================\n` +
                 `Session Duration: ${debugMeta.duration}\n` +
                 `Manual Refreshes: ${debugMeta.manualRefreshes}\n` +
                 `Filter Applied: ${logFilter}\n` +
                 `Total Logs: ${debugMeta.totalEntries} | Shown: ${debugMeta.filteredEntries}\n\n` +
                 `=== LOGS ===\n` +
                 filteredLogs.map(log => `${log.timePrefix} ${getLogIcon(log.type)} ${log.message}`).join('\n') +
                 `\n\n=== RECENT ERRORS (last 5 mins) ===\n` +
                 debugMeta.errorSummary.map(err => `- ${err.type}: ${err.count} instances${err.frequency ? ` (${err.frequency}/min)` : ''}`).join('\n') +
                 `\n\n=== ENVIRONMENT STATUS ===\n` +
                 debugMeta.environmentStatus.map(env => `${env.key}: ${env.status.toUpperCase()}`).join('\n');
        filename = `debug-session-${timestamp}.txt`;
        mimeType = 'text/plain';
        break;
      case 'csv':
        content = 'Timestamp,Type,Icon,Message,TraceID\n' + 
                 filteredLogs.map(log => `"${log.timestamp}","${log.type}","${getLogIcon(log.type)}","${log.message.replace(/"/g, '""')}","${log.traceId || ''}"`).join('\n');
        filename = `debug-session-${timestamp}.csv`;
        mimeType = 'text/csv';
        break;
      default:
        content = JSON.stringify(debugMeta, null, 2);
        filename = `debug-session-${timestamp}.json`;
        mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.href = url;
    element.download = filename;
    element.click();
    URL.revokeObjectURL(url);
    
    console.log(`Debug session exported as ${format.toUpperCase()}: ${filename}`);
  };

  const getFilteredLogs = () => {
    return terminalLogs.filter(log => {
      if (logFilter === 'all') return true;
      return log.type === logFilter;
    });
  };

  const copyEnvVariables = () => {
    const envText = Object.entries(envStatus)
      .map(([key, value]) => `${key}=${value.status === 'loaded' ? '***LOADED***' : value.status.toUpperCase()}`)
      .join('\n');
    navigator.clipboard.writeText(envText);
    toast({ title: "📋 Environment variables copied", duration: 2000 });
  };

  // Export functions
  const exportToPDF = () => {
    try {
      console.log('Starting PDF export...');
      console.log('Current export settings:', exportSettings);
      
      // Create new jsPDF instance
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text('Core Authentication System Report', 14, 20);
      
      // Subheader with user info and date (anonymized for security)
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Exported By: admin@domain.com', 14, 30); // Anonymized email
      if (exportSettings.includeTimestamp) {
        doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 14, 35);
        doc.text(`Time: ${new Date().toLocaleTimeString()}`, 14, 40);
      }
      
      // Export settings summary
      const yPosition = exportSettings.includeTimestamp ? 45 : 35;
      doc.text('Export Settings:', 14, yPosition);
      doc.text(`• Timestamp: ${exportSettings.includeTimestamp ? 'Enabled' : 'Disabled'}`, 16, yPosition + 5);
      doc.text(`• System Warnings: ${exportSettings.includeSystemWarnings ? 'Enabled' : 'Disabled'}`, 16, yPosition + 10);
      doc.text(`• Hidden Modules: ${exportSettings.includeHiddenModules ? 'Enabled' : 'Disabled'}`, 16, yPosition + 15);
      
      // Add a line separator
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPosition + 20, 196, yPosition + 20);
      
      console.log('Header added successfully');
      
      // Prepare table data based on current modules with strict filtering
      const allModules = [...coreModules, ...criticalGaps, ...optionalAdvanced];
      console.log('All modules before filtering:', allModules.length);
      
      // First filter: Remove hidden modules if toggle is OFF
      let filteredModules = allModules;
      if (!exportSettings.includeHiddenModules) {
        const hiddenModuleIds = ['session-storage-check', 'token-expiry-monitor', 'device-location-intelligence'];
        filteredModules = allModules.filter(module => !hiddenModuleIds.includes(module.id));
        console.log('After hiding hidden modules:', filteredModules.length);
      }
      
      // Second filter: Prepare table data with status filtering
      let tableData = filteredModules.map(module => {
        const status = moduleStatuses[module.id] || 'unknown';
        const statusText = status === 'success' ? 'Active' : 
                          status === 'warning' ? 'Warning' : 
                          status === 'error' ? 'Failed' : 'Unknown';
        
        const lastChecked = exportSettings.includeTimestamp ? 
          (lastDiagnostic ? lastDiagnostic.toLocaleString() : 'Not checked') : 
          'Health Check';
          
        const result = status === 'success' ? 'Pass' : 
                      status === 'warning' ? 'Needs review' : 
                      status === 'error' ? 'Critical' : 'Unknown';
                      
        return {
          module: module.title,
          status: statusText,
          lastChecked,
          result,
          statusType: status
        };
      });
      
      // Third filter: Remove warnings if toggle is OFF
      if (!exportSettings.includeSystemWarnings) {
        const beforeWarningFilter = tableData.length;
        tableData = tableData.filter(row => row.statusType !== 'warning');
        console.log(`Filtered out warnings: ${beforeWarningFilter} -> ${tableData.length} rows`);
      }
      
      console.log('Final table data:', tableData.length, 'rows');
      
      // Create table headers based on timestamp setting
      const headers = [
        'Module Name', 
        'Status', 
        exportSettings.includeTimestamp ? 'Last Checked' : 'Health Check', 
        'Result'
      ];
      
      // Convert to array format for autoTable
      const finalTableData = tableData.map(row => [
        row.module,
        row.status,
        row.lastChecked,
        row.result
      ]);
      
      // Add the table using autoTable
      autoTable(doc, {
        head: [headers],
        body: finalTableData,
        startY: yPosition + 30,
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 35 },
          2: { cellWidth: 45 },
          3: { cellWidth: 35 },
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });
      
      console.log('Table added successfully');
      
      // Add summary section
      const finalY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : 150;
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text('Summary', 14, finalY);
      
      // Calculate counts based on filtered data - only show what's actually in the export
      const passedCount = finalTableData.filter(row => row[3] === 'Pass').length;
      const warningCount = exportSettings.includeSystemWarnings ? finalTableData.filter(row => row[3] === 'Needs review').length : 0;
      const failedCount = finalTableData.filter(row => row[3] === 'Critical').length;
      
      doc.setFontSize(10);
      doc.text(`Modules Checked: ${finalTableData.length}`, 14, finalY + 8);
      doc.text(`Passed: ${passedCount} modules`, 14, finalY + 16);
      
      // Only show warnings summary if warnings are included
      if (exportSettings.includeSystemWarnings) {
        doc.text(`Warnings: ${warningCount} modules`, 14, finalY + 24);
        doc.text(`Failed: ${failedCount} modules`, 14, finalY + 32);
      } else {
        doc.text(`Failed: ${failedCount} modules`, 14, finalY + 24);
      }
      
      // Export settings summary
      const settingsY = exportSettings.includeSystemWarnings ? finalY + 44 : finalY + 36;
      doc.text('Export Settings:', 14, settingsY);
      doc.text(`• Timestamp: ${exportSettings.includeTimestamp ? 'Enabled' : 'Disabled'}`, 14, settingsY + 8);
      doc.text(`• System Warnings: ${exportSettings.includeSystemWarnings ? 'Enabled' : 'Disabled'}`, 14, settingsY + 16);
      doc.text(`• Hidden Modules: ${exportSettings.includeHiddenModules ? 'Enabled' : 'Disabled'}`, 14, settingsY + 24);
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Generated by Core Authentication Dashboard', 14, doc.internal.pageSize.height - 10);
      
      console.log('Summary and footer added');
      
      // Save with dynamic filename based on settings with improved format
      const timestamp = exportSettings.includeTimestamp ? new Date().toISOString().split('T')[0] : '';
      const warnings = exportSettings.includeSystemWarnings ? 'warnings-on' : 'warnings-off';
      const hidden = exportSettings.includeHiddenModules ? 'hidden-on' : 'hidden-off';
      const timestampSuffix = exportSettings.includeTimestamp ? 'timestamp-on' : 'timestamp-off';
      const filename = `Core_Authentication_Report${timestamp ? '_' + timestamp : ''}_${warnings}_${hidden}_${timestampSuffix}.pdf`;
      console.log('Saving PDF as:', filename);
      
      doc.save(filename);
  
  // Export Final Report function
  const exportFinalReport = () => {
    try {
      console.log('Exporting final diagnostic report...');
      
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text('Final Authentication Health Report', 14, 20);
      
      // Date and user info
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
      doc.text('Admin: admin@domain.com', 14, 35);
      
      // Overall Health Summary
      const allModules = [...coreModules, ...criticalGaps, ...optionalAdvanced];
      const passedCount = Object.values(moduleStatuses).filter(s => s === 'success').length;
      const warningCount = Object.values(moduleStatuses).filter(s => s === 'warning').length;
      const failedCount = Object.values(moduleStatuses).filter(s => s === 'error').length;
      
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text('Overall Health Summary', 14, 50);
      
      doc.setFontSize(10);
      doc.text(`✅ ${passedCount} Modules Passed`, 14, 60);
      doc.text(`⚠️ ${warningCount} Modules Warning`, 14, 67);
      doc.text(`❌ ${failedCount} Modules Failed`, 14, 74);
      doc.text(`📊 Total Modules: ${allModules.length}`, 14, 81);
      
      // Module Status Table
      const tableData = allModules.map(module => [
        module.title,
        moduleStatuses[module.id] === 'success' ? 'Passed' :
        moduleStatuses[module.id] === 'warning' ? 'Warning' :
        moduleStatuses[module.id] === 'error' ? 'Failed' : 'Unknown',
        lastDiagnostic ? lastDiagnostic.toLocaleString() : 'Not checked',
        module.category.toUpperCase()
      ]);
      
      autoTable(doc, {
        head: [['Module Name', 'Status', 'Last Checked', 'Category']],
        body: tableData,
        startY: 90,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [139, 69, 19], textColor: 255 },
      });
      
      // Recommendations
      const finalY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : 150;
      doc.setFontSize(12);
      doc.text('Recommendations', 14, finalY);
      
      doc.setFontSize(9);
      const recommendations = [
        '• Monitor failed modules immediately',
        '• Review warning modules within 24 hours',
        '• Enable MFA for all admin accounts',
        '• Regular security audits recommended'
      ];
      
      recommendations.forEach((rec, index) => {
        doc.text(rec, 14, finalY + 10 + (index * 7));
      });
      
      // Footer
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text('Generated by Core Authentication Dashboard', 14, doc.internal.pageSize.height - 10);
      
      const filename = `Final_Auth_Health_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      console.log('Final report exported successfully');
    } catch (error) {
      console.error('Failed to export final report:', error);
      toast({
        title: "❌ Export Failed",
        description: "Could not generate final report",
        duration: 3000,
      });
    }
  };

  // Accessibility checker function
  const checkAccessibility = () => {
    console.log('Running accessibility check...');
    
    // Simple WCAG checks
    const contrastIssues = document.querySelectorAll('[style*="color"]').length;
    const missingAltText = document.querySelectorAll('img:not([alt])').length;
    const missingAriaLabels = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').length;
    
    const issues = contrastIssues + missingAltText + missingAriaLabels;
    
    if (issues === 0) {
      toast({
        title: "♿ Accessibility Check Passed",
        description: "No WCAG violations detected",
        duration: 3000,
      });
    } else {
      toast({
        title: `♿ Accessibility Issues Found`,
        description: `${issues} potential WCAG violations detected`,
        duration: 4000,
      });
    }
  };
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      console.error('Error details:', error.message, error.stack);
      throw error;
    }
  };

  const exportToCSV = () => {
    try {
      console.log('Starting CSV export with settings:', exportSettings);
      
      // Prepare data based on current modules
      const allModules = [...coreModules, ...criticalGaps, ...optionalAdvanced];
      let tableData = allModules.map(module => {
        const status = moduleStatuses[module.id] || 'unknown';
        const statusText = status === 'success' ? 'Active' : 
                          status === 'warning' ? 'Warning' : 
                          status === 'error' ? 'Failed' : 'Unknown';
        
        const lastChecked = exportSettings.includeTimestamp ? 
          (lastDiagnostic ? lastDiagnostic.toLocaleString() : 'Not checked') : 
          'Just now';
          
        const result = status === 'success' ? 'Pass' : 
                      status === 'warning' ? 'Needs review' : 
                      status === 'error' ? 'Critical' : 'Unknown';
                      
        return {
          module: module.title,
          status: statusText,
          lastChecked,
          result,
          moduleId: module.id,
          isWarning: status === 'warning'
        };
      });
      
      // Filter based on settings
      if (!exportSettings.includeSystemWarnings) {
        tableData = tableData.filter(row => !row.isWarning);
        console.log('Filtered out warnings');
      }
      
      if (!exportSettings.includeHiddenModules) {
        const hiddenModuleIds = ['session-storage-check', 'token-expiry-monitor', 'device-location-intelligence'];
        tableData = tableData.filter(row => !hiddenModuleIds.includes(row.moduleId));
        console.log('Filtered out hidden modules');
      }
      
      // Create CSV headers
      const headers = [
        'Module Name', 
        'Status', 
        exportSettings.includeTimestamp ? 'Last Checked' : 'Health Check', 
        'Result'
      ];
      
      // Create CSV content
      const csvRows = [headers];
      tableData.forEach(row => {
        csvRows.push([
          row.module,
          row.status,
          row.lastChecked,
          row.result
        ]);
      });
      
      // Add metadata if timestamp is enabled
      if (exportSettings.includeTimestamp) {
        csvRows.unshift(['Core Authentication System Report']);
        csvRows.unshift([`Exported by: a.mekrizvani@hotmail.com`]);
        csvRows.unshift([`Export Time: ${new Date().toLocaleString()}`]);
        csvRows.unshift(['']); // Empty row for spacing
      }
      
      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const element = document.createElement('a');
      element.href = url;
      
      // Dynamic filename based on settings
      const timestamp = exportSettings.includeTimestamp ? new Date().toISOString().split('T')[0] : '';
      const warnings = exportSettings.includeSystemWarnings ? 'warnings-on' : 'warnings-off';
      const hidden = exportSettings.includeHiddenModules ? 'hidden-on' : 'hidden-off';
      element.download = `Core_Authentication_Report${timestamp ? '_' + timestamp : ''}_${warnings}_${hidden}.csv`;
      
      element.click();
      URL.revokeObjectURL(url);
      
      console.log('CSV export completed successfully');
    } catch (error) {
      console.error('CSV export failed:', error);
      throw error;
    }
  };

  const exportToJSON = () => {
    try {
      console.log('Starting JSON export with settings:', exportSettings);
      
      // Prepare data based on current modules
      const allModules = [...coreModules, ...criticalGaps, ...optionalAdvanced];
      let moduleData = allModules.map(module => {
        const status = moduleStatuses[module.id] || 'unknown';
        const statusText = status === 'success' ? 'Active' : 
                          status === 'warning' ? 'Warning' : 
                          status === 'error' ? 'Failed' : 'Unknown';
        
        const moduleInfo: any = {
          id: module.id,
          title: module.title,
          status: statusText,
          result: status === 'success' ? 'Pass' : 
                 status === 'warning' ? 'Needs review' : 
                 status === 'error' ? 'Critical' : 'Unknown'
        };
        
        if (exportSettings.includeTimestamp) {
          moduleInfo.lastChecked = lastDiagnostic ? lastDiagnostic.toISOString() : null;
        }
        
        return {
          ...moduleInfo,
          moduleId: module.id,
          isWarning: status === 'warning',
          isHidden: ['session-storage-check', 'token-expiry-monitor', 'device-location-intelligence'].includes(module.id)
        };
      });
      
      // Filter based on settings
      if (!exportSettings.includeSystemWarnings) {
        moduleData = moduleData.filter(module => !module.isWarning);
        console.log('Filtered out warnings');
      }
      
      if (!exportSettings.includeHiddenModules) {
        moduleData = moduleData.filter(module => !module.isHidden);
        console.log('Filtered out hidden modules');
      }
      
      // Clean up temporary fields
      moduleData = moduleData.map(({moduleId, isWarning, isHidden, ...rest}) => rest);
      
      // Create JSON structure
      const jsonData: any = {
        report: {
          title: 'Core Authentication System Report',
          modules: moduleData,
          summary: {
            totalModules: moduleData.length,
            activeModules: moduleData.filter(m => m.status === 'Active').length,
            warningModules: moduleData.filter(m => m.status === 'Warning').length,
            failedModules: moduleData.filter(m => m.status === 'Failed').length
          },
          exportSettings: {
            includeTimestamp: exportSettings.includeTimestamp,
            includeSystemWarnings: exportSettings.includeSystemWarnings,
            includeHiddenModules: exportSettings.includeHiddenModules
          }
        }
      };
      
      if (exportSettings.includeTimestamp) {
        jsonData.report.exportedBy = 'a.mekrizvani@hotmail.com';
        jsonData.report.exportTime = new Date().toISOString();
      }
      
      const jsonString = JSON.stringify(jsonData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const element = document.createElement('a');
      element.href = url;
      
      // Dynamic filename based on settings
      const timestamp = exportSettings.includeTimestamp ? new Date().toISOString().split('T')[0] : '';
      const warnings = exportSettings.includeSystemWarnings ? 'warnings-on' : 'warnings-off';
      const hidden = exportSettings.includeHiddenModules ? 'hidden-on' : 'hidden-off';
      element.download = `Core_Authentication_Report${timestamp ? '_' + timestamp : ''}_${warnings}_${hidden}.json`;
      
      element.click();
      URL.revokeObjectURL(url);
      
      console.log('JSON export completed successfully');
    } catch (error) {
      console.error('JSON export failed:', error);
      throw error;
    }
  };

  // Export Final Report function
  const exportFinalReport = () => {
    try {
      console.log('Exporting final diagnostic report...');
      
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text('Final Authentication Health Report', 14, 20);
      
      // Date and user info
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
      doc.text('Admin: admin@domain.com', 14, 35);
      
      // Overall Health Summary
      const allModules = [...coreModules, ...criticalGaps, ...optionalAdvanced];
      const passedCount = Object.values(moduleStatuses).filter(s => s === 'success').length;
      const warningCount = Object.values(moduleStatuses).filter(s => s === 'warning').length;
      const failedCount = Object.values(moduleStatuses).filter(s => s === 'error').length;
      
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text('Overall Health Summary', 14, 50);
      
      doc.setFontSize(10);
      doc.text(`✅ ${passedCount} Modules Passed`, 14, 60);
      doc.text(`⚠️ ${warningCount} Modules Warning`, 14, 67);
      doc.text(`❌ ${failedCount} Modules Failed`, 14, 74);
      doc.text(`📊 Total Modules: ${allModules.length}`, 14, 81);
      
      // Module Status Table
      const tableData = allModules.map(module => [
        module.title,
        moduleStatuses[module.id] === 'success' ? 'Passed' :
        moduleStatuses[module.id] === 'warning' ? 'Warning' :
        moduleStatuses[module.id] === 'error' ? 'Failed' : 'Unknown',
        lastDiagnostic ? lastDiagnostic.toLocaleString() : 'Not checked',
        module.category.toUpperCase()
      ]);
      
      autoTable(doc, {
        head: [['Module Name', 'Status', 'Last Checked', 'Category']],
        body: tableData,
        startY: 90,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [139, 69, 19], textColor: 255 },
      });
      
      // Recommendations
      const finalY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : 150;
      doc.setFontSize(12);
      doc.text('Recommendations', 14, finalY);
      
      doc.setFontSize(9);
      const recommendations = [
        '• Monitor failed modules immediately',
        '• Review warning modules within 24 hours',
        '• Enable MFA for all admin accounts',
        '• Regular security audits recommended'
      ];
      
      recommendations.forEach((rec, index) => {
        doc.text(rec, 14, finalY + 10 + (index * 7));
      });
      
      // Footer
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text('Generated by Core Authentication Dashboard', 14, doc.internal.pageSize.height - 10);
      
      const filename = `Final_Auth_Health_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      console.log('Final report exported successfully');
    } catch (error) {
      console.error('Failed to export final report:', error);
      toast({
        title: "❌ Export Failed",
        description: "Could not generate final report",
        duration: 3000,
      });
    }
  };

  // Comprehensive WCAG Accessibility Audit
  const runWCAGAudit = async () => {
    setIsWCAGChecking(true);
    
    // Simulate loading while checking
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      console.log('Running comprehensive WCAG 2.1 AA audit...');
      
      const issues: Array<{
        type: string;
        count: number;
        severity: 'high' | 'moderate' | 'low';
        examples: string[];
      }> = [];

      // 1. Color Contrast Check
      const elementsWithPoorContrast = document.querySelectorAll('*');
      let contrastIssues = 0;
      const contrastExamples: string[] = [];
      
      elementsWithPoorContrast.forEach(el => {
        const styles = window.getComputedStyle(el);
        const textColor = styles.color;
        const bgColor = styles.backgroundColor;
        if (textColor && bgColor && textColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'rgba(0, 0, 0, 0)') {
          // Simplified contrast check - in real implementation would calculate actual ratios
          if (textColor === bgColor) {
            contrastIssues++;
            if (contrastExamples.length < 3) {
              contrastExamples.push(`${el.tagName.toLowerCase()} with insufficient contrast`);
            }
          }
        }
      });

      if (contrastIssues > 0) {
        issues.push({
          type: 'Poor contrast ratio',
          count: contrastIssues,
          severity: 'high',
          examples: contrastExamples
        });
      }

      // 2. Missing Alt Text
      const imagesWithoutAlt = document.querySelectorAll('img:not([alt]), img[alt=""]');
      if (imagesWithoutAlt.length > 0) {
        issues.push({
          type: 'Missing alt tags',
          count: imagesWithoutAlt.length,
          severity: 'moderate',
          examples: Array.from(imagesWithoutAlt).slice(0, 3).map(img => 
            `Image element missing descriptive alt text`
          )
        });
      }

      // 3. Missing ARIA Labels
      const buttonsWithoutLabels = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
      const interactiveWithoutLabels = buttonsWithoutLabels.length;
      if (interactiveWithoutLabels > 0) {
        issues.push({
          type: 'Missing ARIA labels',
          count: interactiveWithoutLabels,
          severity: 'high',
          examples: ['Action buttons without accessible labels', 'Interactive elements missing descriptions']
        });
      }

      // 4. Heading Structure
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let headingIssues = 0;
      let previousLevel = 0;
      headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1));
        if (level > previousLevel + 1) {
          headingIssues++;
        }
        previousLevel = level;
      });

      if (headingIssues > 0) {
        issues.push({
          type: 'Improper headings',
          count: headingIssues,
          severity: 'low',
          examples: ['Heading levels skip hierarchy', 'Non-sequential heading structure']
        });
      }

      // 5. Tab Order Issues
      const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      let tabOrderIssues = 0;
      focusableElements.forEach(el => {
        const tabIndex = el.getAttribute('tabindex');
        if (tabIndex && parseInt(tabIndex) > 0) {
          tabOrderIssues++;
        }
      });

      if (tabOrderIssues > 0) {
        issues.push({
          type: 'Tab-order skipped',
          count: tabOrderIssues,
          severity: 'high',
          examples: ['Custom tab order disrupts navigation', 'Skip links missing']
        });
      }

      // 6. Form Input Labels
      const inputsWithoutLabels = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
      let unlabeledInputs = 0;
      inputsWithoutLabels.forEach(input => {
        const id = input.getAttribute('id');
        if (!id || !document.querySelector(`label[for="${id}"]`)) {
          unlabeledInputs++;
        }
      });

      if (unlabeledInputs > 0) {
        issues.push({
          type: 'Form inputs without labels',
          count: unlabeledInputs,
          severity: 'high',
          examples: ['Input fields missing associated labels', 'Form controls not properly labeled']
        });
      }

      const totalIssues = issues.reduce((sum, issue) => sum + issue.count, 0);
      const isCompliant = totalIssues === 0;

      setWcagResults({
        issues,
        totalIssues,
        isCompliant
      });

      // Show toast with results
      if (isCompliant) {
        toast({
          title: "WCAG Check Complete ✅",
          description: "No issues detected – your interface is fully compliant.",
          duration: 3000,
        });
      } else {
        toast({
          title: "Accessibility Issues Found ❗",
          description: `${totalIssues} potential WCAG violations detected. Click to view details.`,
          duration: 5000,
          action: (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowWCAGModal(true)}
            >
              View Details
            </Button>
          ),
        });
      }

    } catch (error) {
      console.error('WCAG audit failed:', error);
      toast({
        title: "Audit Error",
        description: "Failed to complete accessibility check",
        duration: 3000,
      });
    } finally {
      setIsWCAGChecking(false);
    }
  };

  // Scanning simulation function
  const startDiagnosticScan = async () => {
    setIsActivelyScanning(true);
    setScanProgress(0);
    setTerminalLogs([]);
    setDiagnosticStartTime(new Date());
    const startTime = Date.now();
    
    const scanSteps = [
      { phase: 'INIT', message: '🔄 Initializing Security Diagnostic Engine v2.1.0', delay: 500 },
      { phase: 'CONNECT', message: '📡 Connecting to authentication modules...', delay: 800 },
      { phase: 'CONNECT', message: '✅ Multi-Provider Auth: Connected', delay: 600 },
      { phase: 'CONNECT', message: '✅ Session Management: Connected', delay: 500 },
      { phase: 'CONNECT', message: '✅ Rate Limiting: Connected', delay: 400 },
      { phase: 'CONNECT', message: '⚠️ MFA Enforcement: Configuration incomplete', delay: 600 },
      { phase: 'CONNECT', message: '✅ RBAC System: Connected', delay: 500 },
      { phase: 'CONNECT', message: '✅ Audit Logging: Connected', delay: 400 },
      { phase: 'SCAN', message: '🔍 Beginning comprehensive security analysis...', delay: 1000 },
      { phase: 'SCAN', message: '📊 Analyzing authentication flow patterns...', delay: 800 },
      { phase: 'SCAN', message: '✅ OAuth token validation: SECURE', delay: 600 },
      { phase: 'SCAN', message: '✅ Session encryption: AES-256 validated', delay: 500 },
      { phase: 'SCAN', message: '⚠️ SMS rate limiting: 23 attempts detected', delay: 700 },
      { phase: 'SCAN', message: '❌ Session timeout: Exceeds recommended duration', delay: 600 },
      { phase: 'TEST', message: '🔒 Testing privilege escalation vectors...', delay: 900 },
      { phase: 'TEST', message: '✅ Admin role isolation: SECURE', delay: 500 },
      { phase: 'TEST', message: '✅ API endpoint protection: SECURE', delay: 400 },
      { phase: 'VULN', message: '🛡️ Checking for known vulnerabilities...', delay: 800 },
      { phase: 'VULN', message: '✅ OWASP Top 10 compliance: VERIFIED', delay: 600 },
      { phase: 'VULN', message: '⚠️ Browser fingerprinting: Not implemented', delay: 500 },
      { phase: 'METRICS', message: '📈 Analyzing real-time metrics...', delay: 700 },
      { phase: 'METRICS', message: 'Active sessions: 1,247', delay: 400 },
      { phase: 'METRICS', message: 'Success rate: 94.8%', delay: 300 },
      { phase: 'METRICS', message: 'Avg response time: 127ms', delay: 300 },
      { phase: 'MONITOR', message: '🔄 Monitoring live authentication events...', delay: 600 },
      { phase: 'MONITOR', message: 'New login: user@example.com (Google OAuth)', delay: 500 },
      { phase: 'MONITOR', message: 'Session extended: admin@company.com', delay: 400 },
      { phase: 'MONITOR', message: '⚠️ Failed login attempt: suspicious@domain.com', delay: 500 },
      { phase: 'COMPLETE', message: '📋 Security diagnostic scan finished', delay: 800 },
      { phase: 'COMPLETE', message: 'Overall Security Score: 82/100', delay: 500 },
    ];

    for (let i = 0; i < scanSteps.length; i++) {
      const step = scanSteps[i];
      const progress = ((i + 1) / scanSteps.length) * 100;
      
      await new Promise(resolve => setTimeout(resolve, step.delay));
      
      setCurrentScanPhase(step.phase);
      setScanProgress(progress);
      
      const logType = step.message.includes('✅') ? 'success' : 
                     step.message.includes('⚠️') || step.message.includes('❌') ? 'warning' : 'info';
      
      const elapsedTime = (Date.now() - startTime) / 1000;
      const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
      const seconds = Math.floor(elapsedTime % 60).toString().padStart(2, '0');
      const tenths = Math.floor((elapsedTime % 1) * 10);
      const timePrefix = `[${minutes}:${seconds}.${tenths}]`;
      
      setTerminalLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        message: step.message,
        timePrefix: timePrefix,
        type: logType
      }]);
    }
    
    // Complete the scan and show results
    setIsActivelyScanning(false);
    setScanProgress(100);
    
    // Show completion banner instead of auto-closing
    setShowCompletionBanner(true);
    setCanViewSummary(true);
    setAutoScrollEnabled(false); // Stop auto-scroll at completion
  };
  
  const coreModules = [
    {
      id: 'multi-provider-auth',
      icon: '✅',
      title: 'Multi-Provider Auth',
      description: 'Confirms all auth providers (Email, Phone, Google, Apple) are enabled and tested.',
      category: 'core' as const,
      actions: ['Test Provider Flow', 'View Logs'],
      autoCheck: true,
      checkInterval: 30000
    },
    {
      id: 'session-management',
      icon: '🔄',
      title: 'Session Management',
      description: 'Verifies Supabase session lifecycle (token refresh, logout sync, etc.).',
      category: 'core' as const,
      actions: ['Session Status Logs', 'Timeline View'],
      autoCheck: true,
      checkInterval: 30000
    },
    {
      id: 'verification-system',
      icon: '✔️',
      title: 'Verification System',
      description: 'Tracks SMS, Email (SendGrid, Twilio) for code validity.',
      category: 'core' as const,
      actions: ['Test Verification', 'View Last Errors', 'Retry Connection'],
      autoCheck: true,
      checkInterval: 45000
    },
    {
      id: 'edge-function-status',
      icon: '⚙️',
      title: 'Edge Function Status',
      description: 'Validates Deno Edge Functions on Supabase (e.g., for token/email/phone).',
      category: 'core' as const,
      actions: ['Latency Chart', 'Error Details', 'Open Logs'],
      autoCheck: true,
      checkInterval: 60000
    },
    {
      id: 'rbac',
      icon: '🔐',
      title: 'RBAC (Role-Based Access Control)',
      description: 'Ensures users are linked to roles like admin/mod/user via Supabase triggers.',
      category: 'core' as const,
      actions: ['Role Map View', 'Assign Role', 'Sync Role Trigger'],
      autoCheck: true,
      checkInterval: 120000
    },
    {
      id: 'admin-access-sync',
      icon: '👁️‍🗨️',
      title: 'Admin Access Sync',
      description: 'Verifies that admin/mod roles have access and regular users do not.',
      category: 'core' as const,
      actions: ['Admin Access List', 'Force Revoke', 'Logs'],
      autoCheck: true,
      checkInterval: 90000
    },
    {
      id: 'rate-limiting',
      icon: '🧱',
      title: 'Rate Limiting & Abuse Prevention',
      description: 'Monitors brute force protection, ghost login blocks, IP rate limits.',
      category: 'core' as const,
      actions: ['Rate Heatmap', 'Top Abusers', 'Adjust Limits'],
      autoCheck: true,
      checkInterval: 30000
    },
    {
      id: 'anomaly-detection',
      icon: '🧠',
      title: 'Anomaly Detection',
      description: 'Alerts admins when behavior violates historical norms.',
      category: 'core' as const,
      actions: ['Flag History', 'AI Insights', 'Review Report'],
      autoCheck: true,
      checkInterval: 300000
    },
    {
      id: 'token-expiry-monitor',
      icon: '⏳',
      title: 'Token Expiry Monitor',
      description: 'Confirms JWTs are valid and expired tokens don\'t keep ghost sessions alive.',
      category: 'core' as const,
      actions: ['Purge Expired Tokens', 'Logs', 'Force Logout'],
      autoCheck: true,
      checkInterval: 60000
    },
    {
      id: 'session-storage-check',
      icon: '🧠',
      title: 'Session Storage Check',
      description: 'Verifies localStorage, secure HTTP-only cookie, fallback across devices.',
      category: 'core' as const,
      actions: ['Run Storage Test', 'Fix Token Sync', 'Device-Based Reports'],
      autoCheck: true,
      checkInterval: 120000
    },
    {
      id: 'mfa-enforcement',
      icon: '🟣',
      title: 'MFA Enforcement Toggle',
      description: 'Shows which users are forced/optional/disabled MFA.',
      category: 'core' as const,
      actions: ['Toggle Enforcement per Role', 'Send MFA Reminder', 'View User MFA Table'],
      autoCheck: true,
      checkInterval: 180000
    }
  ];
  
  const criticalGaps = [
    {
      id: 'device-location-intelligence',
      icon: '🌍',
      title: 'Device & Location Intelligence',
      description: 'Auto-detects fingerprint hash mismatches, geo shifts.',
      category: 'critical' as const,
      actions: ['View Device Table', 'Force Verify'],
      urgent: true,
      autoCheck: true,
      checkInterval: 180000
    },
    {
      id: 'audit-trail-integrity',
      icon: '📜',
      title: 'Audit Trail Integrity Verification',
      description: 'Runs checksum on logs. Detects skipped rows.',
      category: 'critical' as const,
      actions: ['Generate 7-Day Report', 'Fix Audit Mismatch'],
      urgent: true,
      autoCheck: true,
      checkInterval: 300000
    },
    {
      id: 'mobile-web-auth-drift',
      icon: '📱',
      title: 'Mobile vs Web Auth Drift',
      description: 'Warns on desync between auth.user and session.',
      category: 'critical' as const,
      actions: ['Auto-Fix Sync', 'View Mismatch Map'],
      autoCheck: true,
      checkInterval: 120000
    },
    {
      id: 'webhook-provider-resilience',
      icon: '🛠️',
      title: 'Webhook/Provider Resilience',
      description: 'Monitors Twilio, SendGrid for failures.',
      category: 'critical' as const,
      actions: ['Test Now', 'Ping Logs', 'Configure Alerts'],
      autoCheck: true,
      checkInterval: 180000
    },
    {
      id: 'threshold-rule-engine',
      icon: '📊',
      title: 'Threshold Rule Engine (Visual)',
      description: 'Flags login spikes (e.g., 3+ in 5 min).',
      category: 'critical' as const,
      actions: ['Set Thresholds', 'View Rule Map'],
      autoCheck: true,
      checkInterval: 60000
    }
  ];
  
  const optionalAdvanced = [
    {
      id: 'token-rotation-speed',
      icon: '🔄',
      title: 'Token Rotation Speed Test',
      description: 'Tests token refresh performance and latency.',
      category: 'optional' as const,
      actions: ['Run Test', 'Latency Logs'],
      autoCheck: false
    },
    {
      id: 'anonymous-session-tracker',
      icon: '👻',
      title: 'Anonymous Session Tracker',
      description: 'Tracks pre-login session footprints.',
      category: 'optional' as const,
      actions: ['Detect Pre-Login Footprints'],
      autoCheck: false
    },
    {
      id: 'temporary-access-rules',
      icon: '⏰',
      title: 'Temporary Access Rules',
      description: 'Creates time-limited access tokens and roles.',
      category: 'optional' as const,
      actions: ['Create One-Time Role', 'Expire Token'],
      autoCheck: false
    },
    {
      id: 'slack-discord-alerts',
      icon: '💬',
      title: 'Slack/Discord Alert Hook',
      description: 'Integrates with external notification systems.',
      category: 'optional' as const,
      actions: ['Send Test Alert', 'Integrate Slack Webhook'],
      autoCheck: false
    }
  ];
  
  const functionalityChecklist = [
    {
      id: 'status-labels',
      feature: 'Status Labels (Blue, Green, Red)',
      trigger: 'Auto-refresh every 30–60s or via WebSocket',
      expectedBehavior: 'Auto-refresh every 30–60s or via WebSocket',
      autoEnabled: true
    },
    {
      id: 'module-failure-detection',
      feature: 'Module Failure Detection',
      trigger: 'Auto-switch to ❌ or ⚠️ if any check fails',
      expectedBehavior: 'Auto-switch to ❌ or ⚠️ if any check fails',
      autoEnabled: true
    },
    {
      id: 'expandable-rows',
      feature: 'Expandable Rows',
      trigger: 'Click module',
      expectedBehavior: 'Expand to detailed view',
      autoEnabled: true
    },
    {
      id: 'admin-action-buttons',
      feature: 'Admin Action Buttons',
      trigger: 'Always show',
      expectedBehavior: '[View Logs], [Test Now], [Fix Settings] inline',
      autoEnabled: true
    },
    {
      id: 'mobile-tablet-views',
      feature: 'Mobile/Tablet Views',
      trigger: 'Responsive stack',
      expectedBehavior: 'Already active',
      autoEnabled: true
    }
  ];
  
  const finalSuggestions = [
    {
      id: 'full-diagnostic',
      feature: 'Full Diagnostic',
      trigger: 'Click Run Diagnostic',
      expectedBehavior: 'Runs every module check live, shows failures in red',
      autoEnabled: true
    },
    {
      id: 'mobile-support',
      feature: 'Mobile Support',
      trigger: 'Auto',
      expectedBehavior: 'Adapts layout on smaller screens',
      autoEnabled: true
    },
    {
      id: 'export-final-report',
      feature: 'Export Final Report',
      trigger: 'Click Export',
      expectedBehavior: 'Exports complete diagnostic summary as PDF/CSV',
      autoEnabled: true
    },
    {
      id: 'accessibility-checker',
      feature: 'Accessibility Checker',
      trigger: 'Auto',
      expectedBehavior: 'Validates WCAG compliance and contrast ratios',
      autoEnabled: true
    },
    {
      id: 'manual-refresh-toggle',
      feature: 'Manual Refresh Toggle',
      trigger: 'Toggle',
      expectedBehavior: 'Auto-refresh all modules every 30s with indicators',
      autoEnabled: true
    }
  ];
  
  const handleActionClick = async (action: string) => {
    console.log(`Executing action: ${action}`);
    
    toast({
      title: `🔧 ${action}`,
      description: `Executing ${action}...`,
      duration: 2000,
    });
    
    // Simulate action execution
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "✅ Action Completed",
      description: `${action} executed successfully`,
      duration: 3000,
    });
  };
  
  const runFullDiagnostic = async () => {
    console.log('runFullDiagnostic called');
    try {
      setIsDiagnosticRunning(true);
      setDiagnosticProgress('');
      setShowDiagnosticProgress(true);
      setDiagnosticStartTime(new Date());
      setTerminalLogs([]);
      setElapsedTime(0);
      setShowCompletionBanner(false);
      setCanViewSummary(false);
      setAutoScrollEnabled(true); // Re-enable auto-scroll for new scan
    
      // Start elapsed time counter
      const startTime = Date.now();
      const timeInterval = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
      }, 100);
      
      const formatTimestamp = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = (seconds % 60).toFixed(1);
        return `[${mins.toString().padStart(2, '0')}:${secs.padStart(4, '0')}]`;
      };
      
      const addTerminalLog = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
        const timePrefix = formatTimestamp((Date.now() - startTime) / 1000);
        setTerminalLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), message, timePrefix, type }]);
      };
      
      toast({
        title: "🔍 Running Full Diagnostic",
        description: "Advanced security analysis initiated...",
        duration: 3000,
      });
      
      addTerminalLog("→ Initializing advanced security diagnostic...", 'info');
      await new Promise(resolve => setTimeout(resolve, 500));
      addTerminalLog("→ Loading security modules database...", 'info');
      await new Promise(resolve => setTimeout(resolve, 300));
      addTerminalLog("✓ AI Threat Detection: ENABLED", 'success');
      await new Promise(resolve => setTimeout(resolve, 200));
      addTerminalLog("✓ Deep Scan Mode: ACTIVE", 'success');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const allModules = [...coreModules, ...criticalGaps, ...optionalAdvanced];
      const passed: string[] = [];
      const warnings: string[] = [];
      const failed: string[] = [];
      const recommendations: string[] = [];
      
      for (let i = 0; i < allModules.length; i++) {
        const module = allModules[i];
        setCurrentlyChecking(module.title);
        setDiagnosticProgress(`🔍 Analyzing: ${module.title}...`);
        
        addTerminalLog(`→ Scanning: ${module.title}`, 'info');
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Random results for demo - replace with real logic
        const random = Math.random();
        if (random > 0.8) {
          failed.push(module.title);
          setFailedModules(prev => [...prev, module.id]);
          setModuleStatuses(prev => ({ ...prev, [module.id]: 'error' }));
          addTerminalLog(`❌ ${module.title} → CRITICAL FAILURE DETECTED`, 'error');
        } else if (random > 0.6) {
          warnings.push(module.title);
          setModuleStatuses(prev => ({ ...prev, [module.id]: 'warning' }));
          addTerminalLog(`⚠️  ${module.title} → Warning: Security concerns found`, 'warning');
        } else {
          passed.push(module.title);
          setModuleStatuses(prev => ({ ...prev, [module.id]: 'success' }));
          addTerminalLog(`✅ ${module.title} → Security validation passed`, 'success');
        }
        
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      setCurrentlyChecking('');
      addTerminalLog("→ Compiling security analysis report...", 'info');
      await new Promise(resolve => setTimeout(resolve, 800));
      addTerminalLog("→ Generating threat assessment...", 'info');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate recommendations
      if (failed.length > 0) {
        recommendations.push("🔴 CRITICAL: Fix failed modules immediately for security");
        recommendations.push("🔒 Enable MFA enforcement for all admin accounts");
        recommendations.push("📱 Review mobile vs web authentication sync");
        addTerminalLog(`🚨 CRITICAL THREATS DETECTED: ${failed.length} modules require immediate attention`, 'error');
      }
      if (warnings.length > 0) {
        recommendations.push("🟡 WARNING: Monitor rate limiting thresholds");
        recommendations.push("🔄 Consider increasing token refresh frequency");
        addTerminalLog(`⚠️  SECURITY WARNINGS: ${warnings.length} modules need attention`, 'warning');
      }
      if (passed.length === allModules.length) {
        recommendations.push("✅ EXCELLENT: All security modules are functioning optimally");
        recommendations.push("🛡️ Consider enabling advanced anomaly detection");
        recommendations.push("📊 Review audit logs for suspicious patterns");
        addTerminalLog("✅ ALL SYSTEMS SECURE: No threats detected", 'success');
      }
      
      setDiagnosticResults({ passed, warnings, failed, recommendations });
      setLastDiagnostic(new Date());
      setDiagnosticProgress('✅ Diagnostic Complete!');
      addTerminalLog("✅ Security diagnostic completed successfully", 'success');
      addTerminalLog(`📊 Final Report: ${passed.length} passed, ${warnings.length} warnings, ${failed.length} critical`, 'info');
      
      // Show completion banner instead of auto-closing
      clearInterval(timeInterval);
      setShowCompletionBanner(true);
      setCanViewSummary(true);
      setAutoScrollEnabled(false); // Stop auto-scroll at completion
      
      toast({
        title: "✅ Diagnostic Complete",
        description: `Analysis: ${passed.length} passed, ${warnings.length} warnings, ${failed.length} critical`,
        duration: 4000,
      });
    } catch (error) {
      console.error('Diagnostic failed:', error);
      toast({
        title: "❌ Diagnostic Failed",
        description: "An error occurred during the diagnostic. Please try again.",
        duration: 4000,
      });
    } finally {
      setIsDiagnosticRunning(false);
      setCurrentlyChecking('');
    }
  };
  
  const getSecurityIssueDetails = (moduleName: string, type: 'warning' | 'critical') => {
    const securityDetails: Record<string, any> = {
      'Session Management': {
        type: 'warning',
        description: 'Session lifecycle management has minor security concerns that could impact user experience and security.',
        dangers: [
          'Session tokens may persist longer than necessary',
          'Potential for session hijacking in edge cases',
          'Inconsistent logout behavior across devices',
          'Memory leaks from stale session data'
        ],
        solutions: [
          'Implement stricter session timeout policies',
          'Add device fingerprinting for session validation',
          'Ensure proper session cleanup on logout',
          'Monitor session duration and usage patterns'
        ],
        quickFixes: [
          { name: 'Reduce Session Timeout', action: 'Set session timeout to 15 minutes', risk: 'Low - May require more frequent logins' },
          { name: 'Enable Session Monitoring', action: 'Turn on real-time session tracking', risk: 'Low - Minimal performance impact' },
          { name: 'Force Global Logout', action: 'Log out all active sessions', risk: 'Medium - Will disconnect all users' }
        ]
      },
      'Token Expiry Monitor': {
        type: 'warning',
        description: 'JWT token management shows minor issues that could lead to authentication problems.',
        dangers: [
          'Expired tokens might remain active',
          'Token refresh logic may fail silently',
          'Potential for unauthorized access with stale tokens',
          'Memory consumption from uncleared tokens'
        ],
        solutions: [
          'Implement aggressive token cleanup',
          'Add token blacklisting mechanism',
          'Improve token refresh error handling',
          'Monitor token lifecycle events'
        ],
        quickFixes: [
          { name: 'Purge Expired Tokens', action: 'Remove all expired tokens from storage', risk: 'Low - Safe cleanup operation' },
          { name: 'Reset Token Refresh', action: 'Restart token refresh service', risk: 'Low - Temporary auth interruption' },
          { name: 'Enable Token Blacklist', action: 'Activate token revocation system', risk: 'Low - Enhanced security' }
        ]
      },
      'Webhook/Provider Resilience': {
        type: 'warning',
        description: 'External provider connections show instability that could affect authentication services.',
        dangers: [
          'Authentication failures during provider outages',
          'Data loss from failed webhook deliveries',
          'User lockout during provider maintenance',
          'Potential security gaps in fallback mechanisms'
        ],
        solutions: [
          'Implement provider health monitoring',
          'Add automatic failover mechanisms',
          'Create backup authentication methods',
          'Improve error handling and user feedback'
        ],
        quickFixes: [
          { name: 'Test All Providers', action: 'Run connectivity tests on all auth providers', risk: 'Low - Diagnostic only' },
          { name: 'Enable Fallback Mode', action: 'Activate backup authentication system', risk: 'Medium - May change user experience' },
          { name: 'Reset Provider Connections', action: 'Reconnect to all external providers', risk: 'Medium - Temporary service interruption' }
        ]
      },
      'Rate Limiting & Abuse Prevention': {
        type: 'critical',
        description: 'CRITICAL: Rate limiting systems are failing, leaving your application vulnerable to brute force attacks and abuse.',
        dangers: [
          'IMMEDIATE RISK: Brute force attacks can succeed',
          'DDoS attacks can overwhelm your servers',
          'Account takeover attempts may succeed',
          'Resource exhaustion from automated attacks',
          'Potential data breach from coordinated attacks'
        ],
        solutions: [
          'URGENT: Implement emergency rate limiting',
          'Deploy IP-based blocking mechanisms',
          'Add CAPTCHA verification for suspicious activity',
          'Monitor and alert on attack patterns',
          'Implement progressive penalties for violations'
        ],
        quickFixes: [
          { name: 'Emergency Rate Limit', action: 'Apply strict 5 requests/minute limit globally', risk: 'High - May block legitimate users' },
          { name: 'Block Suspicious IPs', action: 'Auto-block IPs with >10 failed attempts', risk: 'Medium - May block legitimate traffic' },
          { name: 'Enable CAPTCHA', action: 'Require CAPTCHA after 3 failed attempts', risk: 'Low - Better user experience than blocking' }
        ]
      },
      'Temporary Access Rules': {
        type: 'critical',
        description: 'CRITICAL: Temporary access control system has failed, potentially granting unauthorized persistent access.',
        dangers: [
          'IMMEDIATE RISK: Temporary tokens may become permanent',
          'Unauthorized users may retain elevated privileges',
          'Guest access may escalate to admin privileges',
          'Time-limited features may become permanently available',
          'Security boundaries are compromised'
        ],
        solutions: [
          'URGENT: Audit all temporary access grants',
          'Implement forced expiration mechanisms',
          'Add real-time access validation',
          'Create emergency revocation procedures',
          'Establish stricter access control policies'
        ],
        quickFixes: [
          { name: 'Revoke All Temporary Access', action: 'Immediately revoke all temporary permissions', risk: 'High - May disrupt legitimate temporary users' },
          { name: 'Force Re-authentication', action: 'Require all users to re-authenticate', risk: 'Medium - Will log out all users' },
          { name: 'Enable Emergency Mode', action: 'Switch to minimal access permissions only', risk: 'High - May break application functionality' }
        ]
      },
      // Add more module details to cover all possible diagnostic results
      'Multi-Provider Auth': {
        type: 'warning',
        description: 'Multi-provider authentication system needs attention for optimal security.',
        dangers: ['Provider conflicts', 'Authentication inconsistencies', 'Security gaps'],
        solutions: ['Standardize provider configurations', 'Implement unified auth flow'],
        quickFixes: [
          { name: 'Sync Providers', action: 'Synchronize all auth providers', risk: 'Low - Safe operation' }
        ]
      },
      'Verification System': {
        type: 'warning',
        description: 'Verification system shows potential issues with SMS and email delivery.',
        dangers: ['Failed verifications', 'User lockouts', 'Security bypasses'],
        solutions: ['Test verification endpoints', 'Improve error handling'],
        quickFixes: [
          { name: 'Test Verification', action: 'Test all verification systems', risk: 'Low - Diagnostic only' }
        ]
      },
      'Edge Function Status': {
        type: 'warning',
        description: 'Edge functions may have performance or connectivity issues.',
        dangers: ['Function timeouts', 'Service interruptions', 'Data processing delays'],
        solutions: ['Monitor function performance', 'Optimize function code'],
        quickFixes: [
          { name: 'Restart Functions', action: 'Restart all edge functions', risk: 'Medium - Temporary interruption' }
        ]
      },
      'RBAC (Role-Based Access Control)': {
        type: 'warning',
        description: 'Role-based access control system needs review for security compliance.',
        dangers: ['Privilege escalation', 'Access violations', 'Role conflicts'],
        solutions: ['Audit user roles', 'Implement stricter controls'],
        quickFixes: [
          { name: 'Audit Roles', action: 'Review all user role assignments', risk: 'Low - Review only' }
        ]
      },
      'Admin Access Sync': {
        type: 'warning',
        description: 'Admin access synchronization may have inconsistencies.',
        dangers: ['Unauthorized admin access', 'Sync failures', 'Access violations'],
        solutions: ['Verify admin permissions', 'Fix sync mechanisms'],
        quickFixes: [
          { name: 'Sync Admin Access', action: 'Synchronize admin access controls', risk: 'Medium - May affect admin users' }
        ]
      },
      'Anomaly Detection': {
        type: 'warning',
        description: 'Anomaly detection system needs calibration for better security monitoring.',
        dangers: ['Missed threats', 'False positives', 'Inadequate monitoring'],
        solutions: ['Tune detection algorithms', 'Improve alert systems'],
        quickFixes: [
          { name: 'Calibrate Detection', action: 'Recalibrate anomaly detection', risk: 'Low - Improves monitoring' }
        ]
      },
      'Session Storage Check': {
        type: 'warning',
        description: 'Session storage mechanisms need optimization for better security.',
        dangers: ['Storage vulnerabilities', 'Session leaks', 'Data exposure'],
        solutions: ['Secure storage methods', 'Implement encryption'],
        quickFixes: [
          { name: 'Secure Storage', action: 'Implement secure session storage', risk: 'Low - Security improvement' }
        ]
      },
      'MFA Enforcement Toggle': {
        type: 'warning',
        description: 'Multi-factor authentication enforcement settings need review.',
        dangers: ['Weak authentication', 'Account vulnerabilities', 'Security gaps'],
        solutions: ['Enable MFA for all users', 'Strengthen auth requirements'],
        quickFixes: [
          { name: 'Enable MFA', action: 'Force MFA for all accounts', risk: 'Medium - May affect user experience' }
        ]
      }
    };
    
    const details = securityDetails[moduleName];
    console.log('Looking for security details for:', moduleName);
    console.log('Found details:', details);
    return details || {
      type: type,
      description: `Security analysis needed for ${moduleName}. This module requires immediate attention.`,
      dangers: ['Potential security vulnerabilities', 'Unknown threat level', 'Requires investigation'],
      solutions: ['Perform detailed security audit', 'Implement monitoring', 'Apply security patches'],
      quickFixes: [
        { name: 'Quick Audit', action: `Perform quick security audit for ${moduleName}`, risk: 'Low - Diagnostic only' },
        { name: 'Apply Patches', action: `Apply available security patches for ${moduleName}`, risk: 'Medium - May require restart' }
      ]
    };
  };

  const handleTakeAction = (moduleName: string, type: 'warning' | 'critical') => {
    console.log('Take Action clicked for:', moduleName, type);
    const details = getSecurityIssueDetails(moduleName, type);
    console.log('Security details:', details);
    if (details) {
      setSelectedSecurityIssue({
        title: moduleName,
        type,
        ...details
      });
      setShowSecurityDetails(true);
      console.log('Modal should open now');
    } else {
      console.log('No details found for:', moduleName);
    }
  };

  const executeQuickFix = async (fixName: string, action: string) => {
    toast({
      title: "🔧 Executing Security Fix",
      description: `Applying: ${fixName}...`,
      duration: 3000,
    });

    // Simulate fix execution
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "✅ Security Fix Applied",
      description: `${fixName} has been successfully implemented`,
      duration: 4000,
    });

    setShowSecurityDetails(false);
  };

  const exportLogs = (filter: 'all' | 'failed' | 'warnings' = 'all') => {
    const allModules = [...coreModules, ...criticalGaps, ...optionalAdvanced];
    let filteredModules = allModules;
    
    if (filter === 'failed') {
      filteredModules = allModules.filter(module => failedModules.includes(module.id));
    } else if (filter === 'warnings') {
      filteredModules = allModules.filter(module => moduleStatuses[module.id] === 'warning');
    }
    
    const data = {
      timestamp: new Date().toISOString(),
      filter: filter,
      modules: filteredModules.map(module => ({
        ...module,
        status: moduleStatuses[module.id] || 'unknown',
        lastChecked: new Date().toISOString(),
        logs: [
          { timestamp: new Date().toISOString(), level: 'INFO', message: `${module.title} check completed` },
          { timestamp: new Date(Date.now() - 300000).toISOString(), level: 'WARN', message: 'Minor delay detected' }
        ]
      })),
      lastDiagnostic: lastDiagnostic?.toISOString(),
      checklist: functionalityChecklist,
      summary: {
        totalModules: allModules.length,
        failedModules: failedModules.length,
        warningModules: Object.values(moduleStatuses).filter(status => status === 'warning').length
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `auth-modules-${filter}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "📄 Logs Exported",
      description: `Authentication module logs (${filter}) downloaded successfully`,
      duration: 3000,
    });
  };
  
  return (
    <TooltipProvider>
      <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-lg border p-4">
        <div className={`flex ${isMobileView ? 'flex-col space-y-4' : 'flex-row justify-between items-center'}`}>
          <InfoTooltip 
            content="Core Authentication Dashboard monitors all authentication modules and security systems. CONSEQUENCES: Failure to monitor can lead to undetected security breaches, compromised user data, and authentication bypasses."
            type="info"
          >
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-800">
                🔐 Core Authentication Dashboard
              </h2>
              <InfoTooltip 
                content="Toggle between mobile and desktop view layouts for optimal user experience. Mobile view stacks components vertically for smaller screens. CONSEQUENCES: Incorrect view settings may result in poor usability and difficulty accessing critical dashboard features."
                type="info"
              >
                <button
                  onClick={() => setIsMobileView(!isMobileView)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors border border-blue-300"
                >
                  {isMobileView ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                  <span className="text-sm font-medium">
                    {isMobileView ? 'Mobile View' : 'Desktop View'}
                  </span>
                </button>
              </InfoTooltip>
            </div>
          </InfoTooltip>
          <div className={`flex ${isMobileView ? 'flex-col space-y-2' : 'space-x-3'}`}>
            <InfoTooltip 
              content="Runs comprehensive security diagnostic across all authentication modules. Tests security vulnerabilities, performance metrics, and compliance. CONSEQUENCES: Skipping diagnostics may leave critical security flaws undetected, leading to data breaches."
              type="warning"
            >
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Run Diagnostic clicked, isDiagnosticRunning:', isDiagnosticRunning);
                  if (!isDiagnosticRunning) {
                    runFullDiagnostic();
                  }
                }}
                disabled={isDiagnosticRunning}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 border border-emerald-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-4 py-2 hover:scale-105 font-medium"
              >
                {isDiagnosticRunning ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : showDiagnosticResults ? (
                  <span className="w-4 h-4">✅</span>
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span>{isDiagnosticRunning ? 'Running...' : showDiagnosticResults ? 'Diagnostic Complete' : 'Run Diagnostic'}</span>
              </Button>
            </InfoTooltip>
            <Dialog>
              <InfoTooltip 
                content="Export authentication logs and diagnostic data for analysis, compliance reporting, or debugging. Includes all module statuses and error details. CONSEQUENCES: Not maintaining logs may violate compliance requirements and make incident response impossible."
                type="info"
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-4 py-2 hover:scale-105 font-medium"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Logs</span>
                  </Button>
                </DialogTrigger>
              </InfoTooltip>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>📤 Export Core Authentication Logs</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800">📁 Export Format Options</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <Button 
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('PDF Export clicked');
                          try {
                            exportToPDF();
                            toast({
                              title: "✅ Logs exported as PDF",
                              description: "Security diagnostic report downloaded successfully",
                              duration: 3000,
                            });
                          } catch (error) {
                            console.error('PDF Export failed:', error);
                            toast({
                              title: "❌ Export failed",
                              description: "Failed to export PDF. Please try again.",
                              duration: 3000,
                            });
                          }
                        }}
                        className="flex items-center justify-start space-x-3 p-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg"
                      >
                        <span className="text-xl">📄</span>
                        <div className="text-left">
                          <div className="font-medium">Download as PDF</div>
                          <div className="text-sm opacity-70">Formatted for printing or archiving</div>
                        </div>
                      </Button>
                      
                      <Button 
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('CSV Export clicked');
                          try {
                            exportToCSV();
                            toast({
                              title: "✅ Logs exported as CSV",
                              description: "Data analysis file downloaded successfully",
                              duration: 3000,
                            });
                          } catch (error) {
                            console.error('CSV Export failed:', error);
                            toast({
                              title: "❌ Export failed",
                              description: "Failed to export CSV. Please try again.",
                              duration: 3000,
                            });
                          }
                        }}
                        className="flex items-center justify-start space-x-3 p-4 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg"
                      >
                        <span className="text-xl">📊</span>
                        <div className="text-left">
                          <div className="font-medium">Download as CSV</div>
                          <div className="text-sm opacity-70">Useful for data analysis (Excel, Google Sheets)</div>
                        </div>
                      </Button>
                      
                      <Button 
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('JSON Export clicked');
                          try {
                            exportToJSON();
                            toast({
                              title: "✅ Logs exported as JSON",
                              description: "API integration file downloaded successfully",
                              duration: 3000,
                            });
                          } catch (error) {
                            console.error('JSON Export failed:', error);
                            toast({
                              title: "❌ Export failed",
                              description: "Failed to export JSON. Please try again.",
                              duration: 3000,
                            });
                          }
                        }}
                        className="flex items-center justify-start space-x-3 p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg"
                      >
                        <span className="text-xl">🔧</span>
                        <div className="text-left">
                          <div className="font-medium">Download as JSON</div>
                          <div className="text-sm opacity-70">For API integrations, automation, or dev debugging</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">✅ Optional Export Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium">Include Timestamp</label>
                            <span className={`px-2 py-1 text-xs rounded-full ${exportSettings.includeTimestamp ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {exportSettings.includeTimestamp ? '✅ ON' : '✗ OFF'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">Add creation timestamps to exported files</p>
                        </div>
                        <Switch 
                          checked={exportSettings.includeTimestamp}
                          onCheckedChange={(checked) => updateExportSetting('includeTimestamp', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium">Include System Warnings</label>
                            <span className={`px-2 py-1 text-xs rounded-full ${exportSettings.includeSystemWarnings ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {exportSettings.includeSystemWarnings ? '✅ ON' : '✗ OFF'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">Include warning-level security alerts</p>
                        </div>
                        <Switch 
                          checked={exportSettings.includeSystemWarnings}
                          onCheckedChange={(checked) => updateExportSetting('includeSystemWarnings', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium">Include Hidden Modules</label>
                            <span className={`px-2 py-1 text-xs rounded-full ${exportSettings.includeHiddenModules ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {exportSettings.includeHiddenModules ? '✅ ON' : '✗ OFF'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">Include internal system checks and diagnostics</p>
                        </div>
                        <Switch 
                          checked={exportSettings.includeHiddenModules}
                          onCheckedChange={(checked) => updateExportSetting('includeHiddenModules', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <InfoTooltip 
                content="Advanced debugging console for system administrators. View detailed logs, re-run specific modules, and monitor system health. CONSEQUENCES: Improper use may disrupt authentication services or expose sensitive system information."
                type="warning"
              >
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-4 py-2 hover:scale-105 font-medium"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Debug Console</span>
                  </Button>
                </DialogTrigger>
              </InfoTooltip>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>🖥 Debug Console – Core Authentication Insights</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 h-[70vh] flex flex-col">
                  {/* Controls Row */}
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={async (e) => {
                          e.preventDefault();
                          setIsManualRefreshing(true);
                          setManualRefreshCount(prev => prev + 1);
                          setTerminalLogs(prev => [...prev, {
                            timestamp: new Date().toLocaleTimeString(),
                            message: `🔄 Manual refresh triggered by admin (#${manualRefreshCount + 1})`,
                            timePrefix: `[${new Date().toLocaleTimeString()}]`,
                            type: 'info'
                          }]);
                          
                          // Simulate refresh delay
                          setTimeout(() => {
                            setIsManualRefreshing(false);
                            toast({ title: "✅ Debug Console Refreshed", duration: 2000 });
                          }, 1500);
                        }}
                        size="sm"
                        disabled={isManualRefreshing}
                        className={`flex items-center space-x-2 ${
                          isManualRefreshing 
                            ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200' 
                            : 'bg-gradient-to-r from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 text-cyan-700 border border-cyan-200'
                        } shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium`}
                      >
                        <RefreshCw className={`w-4 h-4 ${isManualRefreshing ? 'animate-spin text-green-600' : ''}`} />
                        <span>{isManualRefreshing ? 'Refreshing...' : 'Manual Refresh'}</span>
                      </Button>
                      <div className="relative">
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            exportDebugSession('txt');
                            toast({ title: "📋 Debug session exported as TXT", duration: 2000 });
                          }}
                          size="sm"
                          variant="outline"
                          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 border border-emerald-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
                        >
                          <span>📋 Export Debug Session</span>
                        </Button>
                      </div>
                      <Button
                        onClick={() => setDebugAutoRefresh(!debugAutoRefresh)}
                        size="sm"
                        variant={debugAutoRefresh ? "default" : "outline"}
                        className={`flex items-center space-x-2 border shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium ${
                          debugAutoRefresh 
                            ? 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300'
                            : 'bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 border-amber-200'
                        }`}
                      >
                        <span>{debugAutoRefresh ? '⏸️ Pause' : '▶️ Resume'} Auto-refresh</span>
                      </Button>
                      <Button
                        onClick={clearAllLogs}
                        size="sm"
                        variant="outline"
                        className="flex items-center space-x-2 bg-gradient-to-r from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200 text-rose-700 border border-rose-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
                      >
                        <span>🗑️ Clear Logs</span>
                      </Button>
                    </div>
                    <div className="text-sm text-gray-500">
                      Auto-refresh: {debugAutoRefresh ? 'Every 3-8 seconds' : 'Paused'} | Session: {Math.round((Date.now() - debugSessionStartTime.getTime()) / 1000)}s
                    </div>
                  </div>

                  {/* Log Filter Controls */}
                  <div className="flex items-center space-x-2 border-b pb-3 mb-3">
                    <span className="text-sm font-medium">Filter logs:</span>
                    {(['all', 'success', 'warning', 'error', 'info'] as const).map((filter, index) => {
                      const colorSchemes = [
                        'bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 text-slate-700 border-slate-200',
                        'bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 border-green-200',
                        'bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 text-yellow-700 border-yellow-200',
                        'bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-700 border-red-200',
                        'bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border-blue-200'
                      ];
                      
                      const activeColorSchemes = [
                        'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 border-slate-300',
                        'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300',
                        'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300',
                        'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300',
                        'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300'
                      ];

                      const colorScheme = colorSchemes[index];
                      const activeColorScheme = activeColorSchemes[index];

                      return (
                        <Button
                          key={filter}
                          onClick={() => setLogFilter(filter)}
                          size="sm"
                          variant={logFilter === filter ? "default" : "outline"}
                          className={`text-xs border shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium ${
                            logFilter === filter ? `${activeColorScheme} border-2` : colorScheme
                          }`}
                        >
                          {filter === 'all' ? '🔄 All' : 
                           filter === 'success' ? '✅ Success' :
                           filter === 'warning' ? '⚠️ Warning' :
                           filter === 'error' ? '❌ Error' : 'ℹ️ Info'} 
                          {filter !== 'all' && ` (${terminalLogs.filter(log => log.type === filter).length})`}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Live Logs Feed */}
                  <div className="flex-1 bg-gray-900 rounded-lg p-4 overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-3 flex-shrink-0">
                      <h3 className="text-green-400 font-mono text-sm">🔹 Live Authentication Debug Feed</h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <div className={`w-2 h-2 rounded-full ${debugAutoRefresh ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                        <span>{debugAutoRefresh ? 'LIVE' : 'PAUSED'}</span>
                        <span>({getFilteredLogs().length}/{terminalLogs.length} entries)</span>
                      </div>
                    </div>
                    
                    <div ref={terminalRef} className="space-y-1 font-mono text-sm flex-1 overflow-y-auto min-h-0">
                      {getFilteredLogs().length === 0 ? (
                        <div className="text-gray-500 italic">
                          {terminalLogs.length === 0 ? 'Starting debug session... Logs will appear here.' : `No ${logFilter} logs to display. Try changing the filter.`}
                        </div>
                      ) : (
                        getFilteredLogs().map((log, index) => (
                          <div 
                            key={index} 
                            className={`group ${
                              log.type === 'success' ? 'text-green-400' : 
                              log.type === 'warning' ? 'text-yellow-400' : 
                              log.type === 'error' ? 'text-red-400' : 'text-gray-300'
                            } hover:bg-gray-800 p-1 rounded cursor-pointer flex-shrink-0 flex items-center justify-between`}
                          >
                            <span className="flex-1">
                              <span className="text-gray-500">{log.timePrefix}</span> 
                              <span className="mr-2">{getLogIcon(log.type)}</span>
                              {log.message}
                              {log.traceId && <span className="text-xs text-gray-600 ml-2">#{log.traceId}</span>}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyLogLine(log);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400 hover:text-white ml-2"
                            >
                              📋
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Two Column Layout for Environment & Requests */}
                  <div className="grid grid-cols-2 gap-4 flex-shrink-0">
                    {/* Environment Variables */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">🔧 Environment Variables</h4>
                        <div className="flex space-x-1">
                          <Button
                            onClick={() => setShowEnvKeys(!showEnvKeys)}
                            size="sm"
                            variant="ghost"
                            className="h-6 text-xs"
                          >
                            {showEnvKeys ? '🙈 Hide' : '👁️ Show'} Keys
                          </Button>
                          <Button
                            onClick={copyEnvVariables}
                            size="sm"
                            variant="ghost"
                            className="h-6 text-xs"
                          >
                            📋 Copy
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        {Object.entries(envStatus).map(([key, value]) => (
                          <div key={key} className={`flex justify-between items-center p-1 rounded ${
                            value.status === 'missing' ? 'bg-red-50 text-red-700' : 
                            value.status === 'expired' ? 'bg-yellow-50 text-yellow-700' :
                            'text-gray-600'
                          }`}>
                            <span>{key}:</span>
                            <div className="flex items-center space-x-1">
                              <span>
                                {showEnvKeys ? 
                                  (value.value || (value.status === 'loaded' ? '••••••••••••••••loaded' : value.status.toUpperCase())) :
                                  (value.status === 'loaded' ? '••••••••••••••••loaded' : value.status.toUpperCase())
                                }
                              </span>
                              {value.status === 'missing' && <span className="text-red-500">🔴</span>}
                              {value.status === 'expired' && <span className="text-yellow-500">🟡</span>}
                              {value.status === 'loaded' && <span className="text-green-500">✅</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Failed Checks / Errors */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">⚠️ Error Tracking (Last 5 mins)</h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        {Object.entries(errorCounts).map(([errorType, data]) => {
                          const isRecent = (Date.now() - data.lastOccurrence.getTime()) < 5 * 60 * 1000;
                          const isCritical = data.count > 3;
                          
                          return (
                            <div 
                              key={errorType} 
                              className={`flex justify-between items-center p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors ${
                                isCritical && isRecent ? 'bg-red-100 text-red-700' : 
                                data.count > 0 ? 'bg-yellow-100 text-yellow-700' : 'text-gray-600'
                              }`}
                              onClick={() => setSelectedError(selectedError === errorType ? null : errorType)}
                            >
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{errorType}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-mono text-xs">
                                      {data.count} instances
                                      {data.frequency && ` (${data.frequency}/min)`}
                                    </span>
                                    {isCritical && isRecent && <span>🔥</span>}
                                    <span className="text-xs">📋</span>
                                  </div>
                                </div>
                                {selectedError === errorType && data.stackTrace && (
                                  <div className="mt-2 p-2 bg-gray-800 text-green-400 text-xs font-mono rounded">
                                    <div className="flex justify-between items-center mb-1">
                                      <span>Stack Trace:</span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigator.clipboard.writeText(data.stackTrace || '');
                                          toast({ title: "📋 Stack trace copied", duration: 1500 });
                                        }}
                                        className="text-xs hover:text-white"
                                      >
                                        📋 Copy
                                      </button>
                                    </div>
                                    <pre className="whitespace-pre-wrap">{data.stackTrace}</pre>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Request Traces */}
                  <div className="bg-gray-50 p-3 rounded-lg flex-shrink-0">
                    <h4 className="font-medium text-sm mb-2">📡 Recent Request Traces (Clickable)</h4>
                    <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
                      {recentRequests.length === 0 ? (
                        <div className="text-gray-500 italic">No requests captured yet...</div>
                      ) : (
                        recentRequests.map((request) => (
                          <div 
                            key={request.id}
                            className="flex justify-between hover:bg-gray-200 p-1 rounded cursor-pointer transition-colors"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <span className="flex items-center space-x-2">
                              <span className={`px-1 rounded text-xs font-mono ${
                                request.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                                request.method === 'GET' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {request.method}
                              </span>
                              <span>{request.path}</span>
                            </span>
                            <span className={`${
                              request.status >= 200 && request.status < 300 ? 'text-green-600' :
                              request.status >= 400 ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {request.status} ({request.responseTime}ms)
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Request Details Modal */}
                {selectedRequest && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Request Details</h3>
                        <Button onClick={() => setSelectedRequest(null)} variant="ghost" size="sm">✕</Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <strong>Method:</strong> {selectedRequest.method}
                        </div>
                        <div>
                          <strong>Status:</strong> {selectedRequest.status}
                        </div>
                        <div>
                          <strong>Path:</strong> {selectedRequest.path}
                        </div>
                        <div>
                          <strong>Response Time:</strong> {selectedRequest.responseTime}ms
                        </div>
                        <div className="col-span-2">
                          <strong>Timestamp:</strong> {selectedRequest.timestamp.toLocaleString()}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <strong>Headers:</strong>
                          <pre className="bg-gray-100 p-2 rounded text-xs mt-1 overflow-x-auto">
                            {JSON.stringify(selectedRequest.headers, null, 2)}
                          </pre>
                        </div>
                        
                        {selectedRequest.requestBody && (
                          <div>
                            <strong>Request Body:</strong>
                            <pre className="bg-gray-100 p-2 rounded text-xs mt-1 overflow-x-auto">
                              {JSON.stringify(selectedRequest.requestBody, null, 2)}
                            </pre>
                          </div>
                        )}
                        
                        <div>
                          <strong>Response Body:</strong>
                          <pre className="bg-gray-100 p-2 rounded text-xs mt-1 overflow-x-auto">
                            {JSON.stringify(selectedRequest.responseBody, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {lastDiagnostic && (
          <div className="mt-3 text-sm text-gray-600">
            Last diagnostic: {lastDiagnostic.toLocaleString()}
          </div>
        )}
        {diagnosticProgress && (
          <div className="mt-3 text-sm text-green-600 font-medium animate-pulse">
            {diagnosticProgress}
          </div>
        )}
      </div>
      
      {/* Core Authentication Modules */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <InfoTooltip 
            content="Essential authentication modules that must function correctly for secure user access. These modules handle login, session management, verification, and security controls. CONSEQUENCES: Any failure in core modules can compromise entire authentication system security and user access."
            type="danger"
          >
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              🔐 Core Authentication Modules to Verify
            </h3>
          </InfoTooltip>
          <div className="flex items-center gap-4">
            {/* Summary Totals */}
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1">
                <span className="text-green-600">✅</span>
                <span>{Object.values(moduleStatuses).filter(s => s === 'success').length} Passed</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="text-yellow-600">⚠️</span>
                <span>{Object.values(moduleStatuses).filter(s => s === 'warning').length} Warnings</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="text-red-600">❌</span>
                <span>{Object.values(moduleStatuses).filter(s => s === 'error').length} Failed</span>
              </span>
            </div>
            {/* Manual Recheck Button */}
            <Button
              onClick={() => {
                // Trigger recheck for all modules
                setModuleStatuses({});
                toast({
                  title: "🔄 Module Recheck Initiated",
                  description: "All authentication modules are being rechecked...",
                  duration: 3000,
                });
              }}
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Recheck All
            </Button>
          </div>
        </div>
        <div className={`grid gap-4 ${isMobileView ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
          {coreModules.map((module) => (
            <AuthModuleCard
              key={module.id}
              {...module}
              onActionClick={handleActionClick}
            />
          ))}
        </div>
      </div>
      
      {/* Critical Gaps */}
      <div className="bg-white rounded-lg border p-6">
        <InfoTooltip 
          content="Critical security vulnerabilities and gaps in authentication behavior monitoring. These represent high-risk areas that could be exploited by attackers. CONSEQUENCES: Unaddressed critical gaps can lead to unauthorized access, data breaches, privilege escalation, and compromised user accounts."
          type="danger"
        >
          <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
            🔥 CRITICAL GAPS MODULES (Behavior)
          </h3>
        </InfoTooltip>
        <div className={`grid gap-4 ${isMobileView ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
          {criticalGaps.map((module) => (
            <AuthModuleCard
              key={module.id}
              {...module}
              onActionClick={handleActionClick}
            />
          ))}
        </div>
      </div>
      
      {/* Optional Advanced Modules */}
      <div className="bg-white rounded-lg border p-6">
        <InfoTooltip 
          content="Advanced security modules that enhance authentication security but are not required for basic operation. These provide additional layers of protection and monitoring capabilities. CONSEQUENCES: While optional, these modules provide defense-in-depth; omitting them may leave gaps in advanced threat detection."
          type="info"
        >
          <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
            🧬 OPTIONAL ADVANCED MODULES (Manual Enable)
          </h3>
        </InfoTooltip>
        <div className={`grid gap-4 ${isMobileView ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
          {optionalAdvanced.map((module) => (
            <AuthModuleCard
              key={module.id}
              {...module}
              onActionClick={handleActionClick}
            />
          ))}
        </div>
      </div>
      
      {/* Functionality Checklist */}
      <div className="bg-white rounded-lg border p-6">
        <InfoTooltip 
          content="Essential functionality verification checklist for authentication system health. Auto-enabled checks monitor system state continuously. CONSEQUENCES: Unchecked functionality items may indicate system degradation or incomplete configuration leading to authentication failures."
          type="warning"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            ✅ FUNCTIONALITY CHECKLIST (Auto-enabled or on click)
          </h3>
        </InfoTooltip>
        <div className={`grid gap-3 ${isMobileView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
          {functionalityChecklist.map((item) => (
            <ChecklistItem key={item.id} {...item} />
          ))}
        </div>
      </div>
      
      {/* Final Suggestions */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <InfoTooltip 
            content="Recommended security enhancements and best practices for optimal authentication system performance. These suggestions improve user experience and security posture. CONSEQUENCES: Ignoring these suggestions may result in suboptimal security, poor user experience, and increased vulnerability to attacks."
            type="info"
          >
            <h3 className="text-lg font-semibold text-purple-800 flex items-center">
              🟣 FINAL SUGGESTIONS (Expected Behavior)
            </h3>
          </InfoTooltip>
          <div className="flex items-center gap-2">
            {/* Export Final Report Button */}
            <Button
              onClick={() => {
                exportFinalReport();
                toast({
                  title: "📋 Final Report Exported",
                  description: "Complete diagnostic summary has been downloaded",
                  duration: 3000,
                });
              }}
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Export Report
            </Button>
            {/* Manual Refresh Toggle */}
            <Button
              onClick={() => {
                setDebugAutoRefresh(!debugAutoRefresh);
                toast({
                  title: debugAutoRefresh ? "⏸️ Auto-refresh Paused" : "▶️ Auto-refresh Enabled",
                  description: `Module refresh ${debugAutoRefresh ? 'stopped' : 'every 30s'}`,
                  duration: 2000,
                });
              }}
              size="sm"
              variant={debugAutoRefresh ? "default" : "outline"}
              className="flex items-center gap-1"
            >
              {debugAutoRefresh ? '⏸️ Pause' : '▶️ Enable'} Auto-Refresh
            </Button>
          </div>
        </div>
        <div className={`grid gap-3 ${isMobileView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {finalSuggestions.map((item) => (
            <div key={item.id} className="relative">
              <ChecklistItem {...item} />
              {/* Feature-specific demonstrations */}
              {item.id === 'full-diagnostic' && (
                <div className="mt-2">
                  <Button
                    onClick={() => {
                      runFullDiagnostic();
                      toast({
                        title: "🔍 Full Diagnostic Started",
                        description: "Running comprehensive authentication checks...",
                        duration: 3000,
                      });
                    }}
                    size="sm"
                    className="w-full"
                    disabled={isDiagnosticRunning}
                  >
                    {isDiagnosticRunning ? (
                      <>
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        Run Diagnostic
                      </>
                    )}
                  </Button>
                </div>
              )}
              {item.id === 'mobile-support' && (
                <div className="mt-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Smartphone className="w-3 h-3" />
                    Current: {isMobileView ? 'Mobile View' : 'Desktop View'}
                  </div>
                </div>
              )}
              {item.id === 'accessibility-checker' && (
                <div className="mt-2 space-y-2">
                  <Button
                    onClick={runWCAGAudit}
                    size="sm"
                    variant="outline"
                    className="w-full text-xs"
                    disabled={isWCAGChecking}
                  >
                    {isWCAGChecking ? (
                      <LoadingSpinner size="sm" className="mr-1" />
                    ) : (
                      <Eye className="w-3 h-3 mr-1" />
                    )}
                    Check WCAG
                  </Button>
                  
                  {/* Slide-down details button */}
                  {wcagResults && (
                    <div className="animate-slide-down">
                      <Button
                        onClick={() => setShowWCAGModal(true)}
                        size="sm"
                        variant="ghost"
                        className="w-full text-xs text-muted-foreground hover:text-foreground"
                      >
                        <ChevronDown className="w-3 h-3 mr-1" />
                        Click to view details
                        <span className="ml-1 text-xs bg-destructive/10 text-destructive px-1 rounded">
                          {wcagResults.totalIssues} issues
                        </span>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Enhanced Diagnostic Results Modal */}
      <EnhancedDiagnosticModal
        open={showDiagnosticResults}
        onOpenChange={(open) => {
          setShowDiagnosticResults(open);
          if (!open) {
            setIsDiagnosticRunning(false);
          }
        }}
        diagnosticResults={diagnosticResults}
        lastDiagnostic={lastDiagnostic}
        onExportLogs={exportLogs}
        onTakeAction={handleTakeAction}
      />

      {/* Enhanced Security Analysis Modal */}
      <EnhancedSecurityAnalysisModal
        open={showSecurityDetails}
        onOpenChange={setShowSecurityDetails}
        selectedSecurityIssue={selectedSecurityIssue}
        onApplyFix={(fixName, moduleName) => {
          toast({
            title: "Security Fix Applied",
            description: `${fixName} has been applied to ${moduleName}`,
          });
          setShowSecurityDetails(false);
        }}
      />

      {/* WCAG Accessibility Results Modal */}
      <Dialog open={showWCAGModal} onOpenChange={setShowWCAGModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                WCAG Accessibility Audit Results
              </DialogTitle>
              <span className="text-sm bg-primary/20 text-primary-foreground px-3 py-1.5 rounded-md font-medium border border-primary/30">
                Mode: WCAG 2.1 Level AA
              </span>
            </div>
          </DialogHeader>
          
          {wcagResults && (
            <div className="space-y-6">
              {/* Overall Summary */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Overall Compliance</h3>
                  {wcagResults.isCompliant ? (
                    <Badge variant="default" className="bg-green-500">✅ Compliant</Badge>
                  ) : (
                    <Badge variant="destructive">❌ Issues Found</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {wcagResults.isCompliant 
                    ? "Your interface meets WCAG 2.1 Level AA accessibility standards."
                    : `${wcagResults.totalIssues} potential violations detected across ${wcagResults.issues.length} categories.`
                  }
                </p>
              </div>

              {/* Issues Breakdown */}
              {wcagResults.issues.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Issue Breakdown</h3>
                  <div className="overflow-hidden rounded-lg border">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help border-b border-dotted">Type of Issue</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Category of WCAG rule violated</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help border-b border-dotted">Count</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Number of times this issue was detected</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help border-b border-dotted">Severity</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>How critical this issue is for accessibility compliance</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help border-b border-dotted">Examples</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Representative examples from affected UI areas</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {wcagResults.issues.map((issue, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm font-medium">{issue.type}</td>
                            <td className="px-4 py-2 text-sm">{issue.count}</td>
                            <td className="px-4 py-2 text-sm">
                              <Badge 
                                variant={issue.severity === 'high' ? 'destructive' : 
                                       issue.severity === 'moderate' ? 'default' : 'secondary'}
                              >
                                {issue.severity}
                              </Badge>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                              {issue.examples.slice(0, 2).join(', ')}
                              {issue.examples.length > 2 && '...'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Severity Legend */}
              <div className="bg-muted/30 p-3 rounded-lg text-xs space-y-1">
                <div className="font-medium mb-2">Severity Legend:</div>
                <div className="flex flex-wrap gap-4">
                  <span className="flex items-center gap-1">
                    🔴 <strong>High</strong> = Critical accessibility issue
                  </span>
                  <span className="flex items-center gap-1">
                    🟡 <strong>Moderate</strong> = Noticeable but not blocking
                  </span>
                  <span className="flex items-center gap-1">
                    🟢 <strong>Low</strong> = Minor improvement recommended
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-2">
                      <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      try {
                        const reportData = {
                          timestamp: new Date().toISOString(),
                          auditMode: "WCAG 2.1 Level AA",
                          totalIssues: wcagResults.totalIssues,
                          isCompliant: wcagResults.isCompliant,
                          issues: wcagResults.issues,
                          summary: {
                            high: wcagResults.issues.filter(i => i.severity === 'high').length,
                            moderate: wcagResults.issues.filter(i => i.severity === 'moderate').length,
                            low: wcagResults.issues.filter(i => i.severity === 'low').length
                          }
                        };
                        
                        const blob = new Blob([JSON.stringify(reportData, null, 2)], 
                          { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `accessibility_audit_report_${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                        
                        toast({
                          title: "Report Successfully Exported ✅",
                          description: "Accessibility audit report downloaded successfully",
                          duration: 3000,
                        });
                      } catch (error) {
                        toast({
                          title: "Export Failed ❌",
                          description: "Unable to generate report file",
                          variant: "destructive",
                          duration: 3000,
                        });
                      }
                    }}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Export Report
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowWCAGModal(false);
                      runWCAGAudit();
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Re-run Check
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.open('https://www.w3.org/WAI/WCAG21/quickref/', '_blank');
                    }}
                  >
                    <Info className="w-4 h-4 mr-1" />
                    What is WCAG?
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowWCAGModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Real-Time Security Diagnostic Monitor - Right Side Panel */}
      {showDiagnosticProgress && (
        <div className={`fixed right-0 top-16 bottom-0 ${open ? 'left-64' : 'left-16'} bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 border-l border-blue-500/30 shadow-2xl z-40 overflow-y-auto transition-all duration-300`}>
          {/* Completion Banner */}
          {showCompletionBanner && (
            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-b border-green-500/30 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 font-semibold">✅ Scan complete. View Summary Report →</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowDiagnosticResults(true);
                      // Optional: Could also open in new modal/page
                    }}
                    className="bg-green-600/20 border-green-500/40 text-green-300 hover:bg-green-600/30 text-xs"
                  >
                    View Summary
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportDiagnosticLogs('txt')}
                    className="bg-blue-600/20 border-blue-500/40 text-blue-300 hover:bg-blue-600/30 text-xs"
                  >
                    Export Logs
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Floating Icon Buttons (positioned below completion banner) */}
          <div className="absolute top-16 right-4 z-50 flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8 p-0 bg-gray-800/50 border border-blue-500/30 hover:bg-blue-600/20"
                    onClick={() => setAutoScrollEnabled(!autoScrollEnabled)}
                  >
                    {autoScrollEnabled ? <TrendingUp className="w-4 h-4 text-green-400" /> : <Pause className="w-4 h-4 text-gray-400" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{autoScrollEnabled ? 'Disable Auto-Scroll' : 'Enable Auto-Scroll'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8 p-0 bg-gray-800/50 border border-blue-500/30 hover:bg-blue-600/20"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4 text-blue-400" /> : <Minimize2 className="w-4 h-4 text-blue-400" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isMinimized ? 'Expand Panel' : 'Collapse Panel'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8 p-0 bg-gray-800/50 border border-blue-500/30 hover:bg-blue-600/20"
                    onClick={() => setSelectedLogSeverity(
                      selectedLogSeverity === 'all' ? 'error' : 
                      selectedLogSeverity === 'error' ? 'warning' : 
                      selectedLogSeverity === 'warning' ? 'info' : 'all'
                    )}
                  >
                    <Filter className="w-4 h-4 text-purple-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter: {selectedLogSeverity}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8 p-0 bg-gray-800/50 border border-blue-500/30 hover:bg-blue-600/20"
                    onClick={() => {
                      const logText = terminalLogs.map(log => `${log.timePrefix} ${log.message}`).join('\n');
                      navigator.clipboard.writeText(logText);
                      toast({ title: "📋 Terminal logs copied", duration: 2000 });
                    }}
                  >
                    <Copy className="w-4 h-4 text-yellow-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy All Logs</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8 p-0 bg-gray-800/50 border border-blue-500/30 hover:bg-blue-600/20"
                    onClick={() => exportDiagnosticLogs('txt')}
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export Logs</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8 p-0 bg-gray-800/50 border border-blue-500/30 hover:bg-blue-600/20"
                    onClick={() => clearAllLogs()}
                  >
                    <Archive className="w-4 h-4 text-red-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear Logs</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8 p-0 bg-gray-800/50 border border-blue-500/30 hover:bg-red-600/20"
                    onClick={() => setShowDiagnosticProgress(false)}
                    title="Close Diagnostic Monitor"
                  >
                    <X className="w-4 h-4 text-red-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Close Diagnostic Monitor</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Header with title */}
          <div className="bg-gray-800/50 px-6 py-4 border-b border-blue-500/30">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <h2 className="text-lg font-semibold text-white">🔍 Advanced Security Diagnostic & Analysis</h2>
            </div>
            {/* Smart Top Info Panel */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400 font-mono">Node-7A</span>
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  Est. Time Left: {Math.max(0, Math.ceil((100 - scanProgress) * 0.3))}s
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  Live since: {diagnosticStartTime ? 
                    `${Math.floor((Date.now() - diagnosticStartTime.getTime()) / 60000).toString().padStart(2, '0')}:${Math.floor(((Date.now() - diagnosticStartTime.getTime()) % 60000) / 1000).toString().padStart(2, '0')}:${Math.floor(((Date.now() - diagnosticStartTime.getTime()) % 1000) / 10).toString().padStart(2, '0')}`
                    : '00:00:00'}
                </div>
              </div>
              
              {/* Circle Progress Cluster */}
              <div className="flex space-x-2 absolute left-1/2 transform -translate-x-1/2">
                {[
                  { name: 'Session', icon: '🔐', progress: scanProgress > 20 ? 100 : scanProgress * 5 },
                  { name: 'Storage', icon: '💾', progress: scanProgress > 40 ? 100 : Math.max(0, (scanProgress - 20) * 5) },
                  { name: 'RBAC', icon: '⚙️', progress: scanProgress > 60 ? 100 : Math.max(0, (scanProgress - 40) * 5) },
                  { name: 'MFA', icon: '📲', progress: scanProgress > 80 ? 100 : Math.max(0, (scanProgress - 60) * 5) },
                  { name: 'Device', icon: '🌐', progress: scanProgress > 90 ? 100 : Math.max(0, (scanProgress - 80) * 10) },
                  { name: 'API', icon: '🔎', progress: scanProgress > 95 ? 100 : Math.max(0, (scanProgress - 90) * 20) }
                ].map((module, idx) => (
                  <div key={idx} className="relative group">
                    <div className={`w-8 h-8 rounded-full border-2 transition-all duration-500 ${
                      module.progress >= 100 
                        ? 'border-green-400/50 bg-green-400/10' 
                        : module.progress > 0 
                        ? 'border-blue-400 bg-blue-400/20' 
                        : 'border-gray-600'
                    }`}>
                      <div className="absolute inset-0 flex items-center justify-center text-xl">
                        {module.icon}
                      </div>
                      {module.progress > 0 && module.progress < 100 && (
                        <div 
                          className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-400 animate-spin"
                          style={{ animationDuration: '2s' }}
                        />
                      )}
                    </div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {module.name}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Intelligence View Button - positioned below floating buttons */}
              <div className="absolute top-28 right-4 z-40">
                <InfoTooltip 
                  content="Advanced intelligence analysis mode provides AI-powered insights, predictive analytics, and smart recommendations for authentication system optimization. CONSEQUENCES: Disabling intelligence mode reduces system visibility and may miss critical security patterns and optimization opportunities."
                  type="warning"
                >
                  <button 
                    onClick={() => setShowIntelligenceView(true)}
                    className="px-3 py-1 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded text-xs hover:bg-blue-600/30 transition-colors"
                  >
                    🧠 Intelligence View
                  </button>
                </InfoTooltip>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-blue-300 flex items-center">
              🔍 Real-Time Security Diagnostic Monitor
              <Badge variant="secondary" className="ml-3 bg-green-500/20 text-green-400 border-green-500/30">
                ACTIVE
              </Badge>
            </h2>
            
            {/* Micro-Activity Stats */}
            <div className="flex items-center space-x-6 mt-2 text-xs text-gray-500 font-mono">
              <span>Scanned lines: {Math.floor(scanProgress * 12.4)}</span>
              <span>Avg Response: 126ms</span>
              <span>Pending Failures: 3</span>
              <span>Active Check: {currentScanPhase || 'Standby'}</span>
            </div>
          </div>
          
          <div className="flex h-[700px] space-x-4 p-4">
            {/* Left Panel - Terminal */}
            <div className="flex-1 bg-black/80 rounded-xl border border-green-500/30 flex flex-col h-full max-h-full">

              {/* Animated Diagnostic Scanner Text */}
              <div className="bg-gray-900/60 px-4 py-2 border-b border-blue-500/20">
                <div className="text-xs text-blue-300 font-mono animate-fade-in flex items-center justify-between">
                  <span>👁️ Live Diagnostic Engine v2.1.0</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs px-2 py-1 h-auto hover:bg-blue-600/20"
                          onClick={() => window.open('https://docs.lovable.dev', '_blank')}
                        >
                          Release Notes
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>What's new in v2.1.0</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="text-xs text-gray-400 font-mono mt-1 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                  Tracking 6 core systems, 3 optional modules
                </div>
                <div className="text-xs text-gray-500 font-mono mt-1 animate-fade-in" style={{ animationDelay: '1s' }}>
                  Security modules actively monitored...
                </div>
              </div>

              {/* Filter Bar */}
              <div className="bg-gray-800/50 px-4 py-2 border-b border-green-500/30 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-green-400 font-mono text-sm">security@diagnostic-engine:~$</span>
                </div>
                
                <div className="flex items-center space-x-2 text-xs">
                  <select 
                    className="bg-gray-700 text-gray-300 border border-gray-600 rounded px-2 py-1"
                    value={selectedLogSeverity}
                    onChange={(e) => setSelectedLogSeverity(e.target.value as any)}
                  >
                    <option value="all">All Logs</option>
                    <option value="error">Errors Only</option>
                    <option value="warning">Warnings Only</option>
                    <option value="success">Success Only</option>
                    <option value="info">Info Only</option>
                  </select>
                  
                  <input
                    type="text"
                    placeholder="Search logs..."
                    className="bg-gray-700 text-gray-300 border border-gray-600 rounded px-2 py-1 w-32"
                    value={logSearchTerm}
                    onChange={(e) => setLogSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div ref={terminalRef} className="flex-1 p-4 font-mono text-sm text-green-400 overflow-y-auto min-h-0 scroll-smooth">
                <div className="space-y-1">
                  <div>$ sudo ./security-diagnostic --scan-all --verbose</div>
                  {terminalLogs
                    .filter(log => selectedLogSeverity === 'all' || log.type === selectedLogSeverity)
                    .filter(log => !logSearchTerm || log.message.toLowerCase().includes(logSearchTerm.toLowerCase()))
                    .map((log, index) => (
                    <div 
                      key={index} 
                      className={`group relative cursor-pointer hover:bg-gray-800/30 px-2 py-1 rounded
                        ${log.type === 'success' ? 'text-green-300' : 
                          log.type === 'warning' ? 'text-yellow-300' : 
                          log.type === 'error' ? 'text-red-400 drop-shadow-lg' : 'text-blue-400'}
                        ${pinnedLogs.has(log.traceId || '') ? 'border-l-4 border-yellow-400 bg-yellow-400/10' : ''}
                      `}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        // Simple context menu actions
                        if (log.traceId) {
                          setPinnedLogs(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has(log.traceId)) {
                              newSet.delete(log.traceId);
                            } else {
                              newSet.add(log.traceId);
                            }
                            return newSet;
                          });
                        }
                      }}
                    >
                      <span className="text-gray-400">{log.timePrefix}</span> {log.message}
                      <div className="opacity-0 group-hover:opacity-100 absolute right-2 top-1 flex space-x-1">
                        <button 
                          onClick={() => copyLogLine(log)}
                          className="text-xs text-gray-500 hover:text-gray-300"
                        >
                          📋
                        </button>
                        {log.traceId && (
                          <button 
                            onClick={() => setPinnedLogs(prev => {
                              const newSet = new Set(prev);
                              if (newSet.has(log.traceId)) {
                                newSet.delete(log.traceId);
                              } else {
                                newSet.add(log.traceId);
                              }
                              return newSet;
                            })}
                            className="text-xs text-gray-500 hover:text-gray-300"
                          >
                            📌
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {isActivelyScanning && (
                    <div className="text-white animate-pulse">
                      [{currentScanPhase}] Scanning... {Math.round(scanProgress)}% complete
                      <span className="animate-pulse">_</span>
                    </div>
                  )}
                  {!isActivelyScanning && scanProgress === 100 && (
                    <div className="text-green-300 animate-pulse">
                      [COMPLETE] ✅ Diagnostic scan completed! Opening results...
                    </div>
                  )}
                  {!isActivelyScanning && scanProgress === 0 && (
                    <div className="text-blue-400 animate-pulse">
                      [READY] Waiting to begin scan...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel - Metrics - 2x2 Grid */}
            <div className="w-96 space-y-3">
              {/* Cards Grid - 2x2 Layout */}
              <div className="grid grid-cols-2 gap-1">
                {/* System Status */}
                <div className="bg-gray-800/30 rounded-xl border border-blue-500/20 p-4">
                  <h3 className="text-blue-300 font-semibold mb-3 flex items-center text-sm">
                    🛡️ System Status
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Security Engine:</span>
                      <span className={`${isActivelyScanning ? 'text-yellow-400 animate-pulse' : 'text-green-400'}`}>
                        {isActivelyScanning ? 'SCANNING...' : 'ACTIVE'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Scan Progress:</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-blue-400 cursor-help">{Math.round(scanProgress)}%</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Est. {Math.max(0, Math.ceil((100 - scanProgress) * 0.3))}s remaining</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {scanProgress > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-full bg-gray-700 rounded-full h-2 cursor-pointer">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300 progress-glow"
                                style={{ width: `${scanProgress}%` }}
                              ></div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click to jump to {Math.round(scanProgress)}% in logs</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-300">Current Phase:</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-purple-400 cursor-help">{currentScanPhase || 'READY'}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Next: {currentScanPhase === 'SCAN' ? 'ANALYZE' : currentScanPhase === 'ANALYZE' ? 'REPORT' : 'COMPLETE'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Auth Modules:</span>
                      <span className="text-red-400">{6 - offlineModules.length}/6 ONLINE</span>
                    </div>
                    
                    {/* Offline Modules Breakdown */}
                    {offlineModules.length > 0 && (
                      <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded">
                        <div className="text-xs text-red-400 font-medium mb-1">Offline Modules:</div>
                        {offlineModules.map((module, idx) => (
                          <div key={idx} className="text-xs text-red-300 flex justify-between">
                            <span>{module.name}</span>
                            <span className="text-red-400">{module.reason}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Live Metrics */}
                <div className="bg-gray-800/30 rounded-xl border border-green-500/20 p-4">
                  <h3 className="text-green-300 font-semibold mb-3 flex items-center text-sm">
                    📊 Live Metrics
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">CPU Usage</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className={`cursor-help ${metricsHistory.cpu.slice(-1)[0] > 25 ? 'text-yellow-400' : 'text-green-400'}`}>
                                {Math.round(metricsHistory.cpu.slice(-1)[0])}%
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-1">
                                <p>CPU usage is {metricsHistory.cpu.slice(-1)[0] > 25 ? 'elevated' : 'normal'}</p>
                                <div className="flex space-x-1 mt-2">
                                  {metricsHistory.cpu.slice(-10).map((value, idx) => (
                                    <div key={idx} className="w-1 bg-green-400/30 flex items-end">
                                      <div 
                                        className="w-full bg-green-400" 
                                        style={{ height: `${Math.max(2, value/2)}px` }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Progress value={metricsHistory.cpu.slice(-1)[0]} className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Memory</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className={`cursor-help ${metricsHistory.memory.slice(-1)[0] > 70 ? 'text-red-400' : metricsHistory.memory.slice(-1)[0] > 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                                {Math.round(metricsHistory.memory.slice(-1)[0])}%
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-1">
                                <p>Memory usage is {metricsHistory.memory.slice(-1)[0] > 70 ? 'high' : metricsHistory.memory.slice(-1)[0] > 50 ? 'moderate' : 'normal'}</p>
                                <p className="text-xs text-gray-400">Real-time memory monitoring</p>
                                <div className="flex space-x-1 mt-2">
                                  {metricsHistory.memory.slice(-10).map((value, idx) => (
                                    <div key={idx} className="w-1 bg-yellow-400/30 flex items-end">
                                      <div 
                                        className="w-full bg-yellow-400" 
                                        style={{ height: `${Math.max(2, value/2)}px` }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Progress value={metricsHistory.memory.slice(-1)[0]} className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Network I/O</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className={`cursor-help ${metricsHistory.network.slice(-1)[0] > 60 ? 'text-yellow-400' : 'text-blue-400'}`}>
                                {Math.round(metricsHistory.network.slice(-1)[0])}%
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-1">
                                <p>Network activity is {metricsHistory.network.slice(-1)[0] > 60 ? 'high' : 'normal'}</p>
                                <p className="text-xs text-gray-400">Real-time throughput monitoring</p>
                                <div className="flex space-x-1 mt-2">
                                  {metricsHistory.network.slice(-10).map((value, idx) => (
                                    <div key={idx} className="w-1 bg-blue-400/30 flex items-end">
                                      <div 
                                        className="w-full bg-blue-400" 
                                        style={{ height: `${Math.max(2, value/2)}px` }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Progress value={metricsHistory.network.slice(-1)[0]} className="h-1" />
                    </div>
                  </div>
                </div>

                {/* Security Events */}
                <div className="bg-gray-800/30 rounded-xl border border-purple-500/20 p-4">
                  <h3 className="text-purple-300 font-semibold mb-3 flex items-center text-sm">
                    🚨 Security Events
                  </h3>
                  <div className="space-y-2 text-xs">
                    {securityEvents.map((event) => (
                      <div 
                        key={event.id}
                        className="flex items-center justify-between cursor-pointer hover:bg-gray-700/30 p-2 rounded"
                        onClick={() => {
                          toast({
                            title: `Security Event: ${event.type}`,
                            description: `${event.description} (${event.count} occurrences)`,
                            duration: 4000,
                          });
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            event.severity === 'high' ? 'bg-red-500' :
                            event.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                          <div className="flex items-center space-x-2">
                            {event.severity === 'high' && <AlertTriangle className="w-3 h-3 text-red-400" />}
                            {event.severity === 'medium' && <Eye className="w-3 h-3 text-yellow-400" />}
                            {event.severity === 'low' && <CheckCircle className="w-3 h-3 text-green-400" />}
                            <span className="text-gray-300">{event.type}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400">
                          <span>{event.count}</span>
                          <span>{Math.round((Date.now() - event.timestamp.getTime()) / 60000)}m ago</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Network Status */}
                <div className="bg-gray-800/30 rounded-xl border border-cyan-500/20 p-4">
                  <h3 className="text-cyan-300 font-semibold mb-3 text-sm">🌐 Network</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Latency:</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={`cursor-help ${85 > 100 ? 'text-red-400' : 85 > 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                              85ms
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Response time to Node-7A. Threshold: Warning {'>'}100ms</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Throughput:</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-cyan-400 cursor-help">2.4 MB/s</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Current data transfer rate. Optimal range: 1-5 MB/s</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Connections:</span>
                      <span className="text-green-400">247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Status:</span>
                      <div className="flex items-center space-x-2">
                        <Wifi className="w-3 h-3 text-green-400" />
                        <span className="text-green-400">Connected to Region X</span>
                      </div>
                    </div>
                    
                    {/* Network Activity Sparkline */}
                    <div className="mt-3 p-2 bg-cyan-500/10 border border-cyan-500/30 rounded">
                      <div className="text-xs text-cyan-400 mb-1">Activity (Last 60s)</div>
                      <div className="flex items-end space-x-1 h-8">
                        {Array(20).fill(0).map((_, idx) => (
                          <div 
                            key={idx}
                            className="w-1 bg-cyan-400/30 flex items-end"
                          >
                            <div 
                              className="w-full bg-cyan-400 transition-all duration-300" 
                              style={{ height: `${Math.random() * 100}%` }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Latency:</span>
                      <span className="text-green-400">12ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Throughput:</span>
                      <span className="text-green-400">1.2GB/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Connections:</span>
                      <span className="text-green-400">2,847</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Network:</span>
                      <span className="text-green-400">STABLE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-blue-500/30 pt-6 px-4 mt-4">
            <div className="flex justify-between items-center text-sm text-blue-200">
              <span>🛡️ Advanced Security Diagnostic Engine v2.1.0</span>
              <span className="animate-pulse">Analysis in progress...</span>
            </div>
          </div>
          
        </div>
      )}

      {/* Intelligence View Panel */}
      <Dialog open={showIntelligenceView} onOpenChange={setShowIntelligenceView}>
        <DialogContent 
          className="max-w-7xl h-[95vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border border-blue-400/30 shadow-2xl overflow-hidden"
          style={{
            position: 'fixed',
            left: `${dragPosition.x}px`,
            top: `${dragPosition.y}px`,
            transform: 'none'
          }}
        >
          {/* Header */}
          <DialogHeader 
            className="bg-gradient-to-r from-blue-900/50 to-slate-900/50 px-6 py-4 border-b border-blue-400/30 cursor-grab active:cursor-grabbing select-none"
            onMouseDown={(e: React.MouseEvent) => {
              e.preventDefault();
              setIsDragging(true);
              setDragStart({
                x: e.clientX - dragPosition.x,
                y: e.clientY - dragPosition.y
              });
            }}
          >
            <DialogTitle className="text-2xl font-bold text-blue-300 flex items-center">
              🧠 Advanced Intelligence Dashboard
              <Badge variant="secondary" className="ml-3 bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                AI ACTIVE
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-3 h-full gap-4 p-6 overflow-y-auto">
            {/* Left Column - Summary & Analysis */}
            <div className="space-y-4">
              {/* Summary Report */}
              <div className="bg-gradient-to-br from-blue-900/30 to-slate-800/30 rounded-xl border border-blue-500/30 p-4">
                <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center">
                  📄 Summary Report
                </h3>
                 <div className="space-y-3 text-sm">
                   <div className="flex justify-between cursor-pointer hover:bg-slate-700/30 p-2 rounded transition-colors" onClick={() => setShowDetailsModal('modules')}>
                     <span className="text-gray-300">Modules Scanned:</span>
                     <span className="text-blue-400 font-mono">6/6</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-300">Time Taken:</span>
                     <span className="text-blue-400 font-mono">{diagnosticStartTime ? `${Math.floor((Date.now() - diagnosticStartTime.getTime()) / 1000)}s` : '0s'}</span>
                   </div>
                   <div className="flex justify-between cursor-pointer hover:bg-slate-700/30 p-2 rounded transition-colors" onClick={() => setShowDetailsModal('systems')}>
                     <span className="text-gray-300">Systems Affected:</span>
                     <span className="text-yellow-400 font-mono">3 Critical</span>
                   </div>
                   <div className="flex justify-between relative group">
                     <span className="text-gray-300">Security Score:</span>
                     <span className="text-green-400 font-mono text-lg">82/100</span>
                     <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                       Score: Auth (90%) + Session (80%) + Config (75%)
                     </div>
                   </div>
                  <div className="bg-gradient-to-r from-red-500/20 to-yellow-500/20 rounded p-2 mt-3">
                    <div className="text-xs text-red-300">⚠️ Immediate Attention Required</div>
                    <div className="text-xs text-gray-300 mt-1">MFA enforcement gaps detected</div>
                  </div>
                </div>
              </div>

              {/* Root Cause Mapping */}
              <div className="bg-gradient-to-br from-red-900/30 to-slate-800/30 rounded-xl border border-red-500/30 p-4">
                <h3 className="text-lg font-semibold text-red-300 mb-3 flex items-center">
                  🚨 Root Cause Analysis
                </h3>
                <div className="space-y-3 text-sm">
                   <div className="border-l-2 border-red-500 pl-3 hover:bg-red-900/20 p-2 rounded transition-colors cursor-pointer" onClick={() => setShowInvestigationModal('mfa')}>
                     <div className="text-red-400 font-medium">MFA Configuration Failure</div>
                     <div className="text-gray-300 text-xs mt-1">Missing provider configuration on backend service</div>
                     <div className="text-blue-400 text-xs mt-1 cursor-pointer hover:underline">📋 View related logs</div>
                   </div>
                   <div className="border-l-2 border-yellow-500 pl-3 hover:bg-yellow-900/20 p-2 rounded transition-colors cursor-pointer" onClick={() => setShowApplyFixModal('session')}>
                     <div className="text-yellow-400 font-medium">Session Timeout Exceeded</div>
                     <div className="text-gray-300 text-xs mt-1">Current: 24h, Recommended: 8h maximum</div>
                     <div className="text-blue-400 text-xs mt-1 cursor-pointer hover:underline">⚙️ Auto-fix available</div>
                   </div>
                   <div className="border-l-2 border-orange-500 pl-3 hover:bg-orange-900/20 p-2 rounded transition-colors cursor-pointer" onClick={() => setShowInvestigationModal('ratelimit')}>
                     <div className="text-orange-400 font-medium">Rate Limiting Bypass</div>
                     <div className="text-gray-300 text-xs mt-1">23 rapid attempts detected from suspicious IP</div>
                     <div className="text-blue-400 text-xs mt-1 cursor-pointer hover:underline">🛡️ Block & investigate</div>
                   </div>
                </div>
              </div>

              {/* Behavior Patterns */}
              <div className="bg-gradient-to-br from-purple-900/30 to-slate-800/30 rounded-xl border border-purple-500/30 p-4">
                <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
                  🧬 Behavior Patterns
                </h3>
                <div className="space-y-3 text-xs">
                   <div className="bg-black/30 rounded p-2 font-mono hover:bg-black/50 cursor-pointer transition-colors" onClick={() => setShowInvestigationModal('login-anomaly')}>
                     <div className="text-green-400">➤ Login anomaly detected</div>
                     <div className="text-gray-400">  └─ Geographic jump: US → RU (15min)</div>
                     <div className="text-gray-400">  └─ Device fingerprint mismatch</div>
                     <div className="text-yellow-400">  └─ Risk level: HIGH</div>
                   </div>
                   <div className="bg-black/30 rounded p-2 font-mono hover:bg-black/50 cursor-pointer transition-colors" onClick={() => setShowInvestigationModal('session-hijack')}>
                     <div className="text-blue-400">➤ Session hijack attempt</div>
                     <div className="text-gray-400">  └─ Token reuse from 3 IPs</div>
                     <div className="text-gray-400">  └─ Timing: 2.3s intervals</div>
                     <div className="text-red-400">  └─ Status: BLOCKED</div>
                     <div className="text-blue-400 mt-1">  └─ 🔍 Investigate Further</div>
                   </div>
                </div>
              </div>
            </div>

            {/* Middle Column - AI Recommendations & Fix Planner */}
            <div className="space-y-4">
              {/* AI Risk Advisor */}
              <div className="bg-gradient-to-br from-emerald-900/30 to-slate-800/30 rounded-xl border border-emerald-500/30 p-4">
                <h3 className="text-lg font-semibold text-emerald-300 mb-3 flex items-center">
                  🔒 AI Risk Advisor
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-emerald-900/20 rounded p-3 border-l-2 border-emerald-500">
                    <div className="text-emerald-400 font-medium mb-2">🎯 Priority Recommendation</div>
                    <div className="text-gray-300 text-xs">Based on similar system patterns, we recommend rotating JWT tokens every 12 hours for enhanced security.</div>
                     <InfoTooltip 
                       content="Apply JWT token rotation fix immediately to enhance security. Implements 12-hour token refresh cycle. CONSEQUENCES: Not applying this fix leaves tokens vulnerable to hijacking and replay attacks."
                       type="warning"
                     >
                       <button className="mt-2 text-xs bg-emerald-600/20 text-emerald-300 px-2 py-1 rounded hover:bg-emerald-600/30 transition-colors" onClick={() => setShowApplyFixModal('jwt-rotation')}>
                         ✅ Apply Now
                       </button>
                     </InfoTooltip>
                   </div>
                   <div className="bg-blue-900/20 rounded p-3 border-l-2 border-blue-500">
                     <div className="text-blue-400 font-medium mb-2">🛡️ Defense Enhancement</div>
                     <div className="text-gray-300 text-xs">Implement device fingerprinting to detect account takeover attempts. 94% effective against session hijacking.</div>
                     <InfoTooltip 
                       content="Learn more about device fingerprinting technology for enhanced security. Provides detailed implementation guidance and benefits. CONSEQUENCES: Not implementing device fingerprinting leaves the system vulnerable to account takeover attacks."
                       type="info"
                     >
                       <button className="mt-2 text-xs bg-blue-600/20 text-blue-300 px-2 py-1 rounded hover:bg-blue-600/30 transition-colors" onClick={() => setShowLearnMoreModal('device-fingerprinting')}>
                         🔍 Learn More
                       </button>
                     </InfoTooltip>
                   </div>
                   <div className="bg-purple-900/20 rounded p-3 border-l-2 border-purple-500">
                     <div className="text-purple-400 font-medium mb-2">⚡ Performance Alert</div>
                     <div className="text-gray-300 text-xs">Authentication response time increased 23%. Consider implementing Redis cache for session storage.</div>
                     <InfoTooltip 
                       content="Optimize authentication performance by implementing Redis cache for session storage. Reduces response time by up to 70%. CONSEQUENCES: Ignoring performance optimization can lead to user frustration, timeouts, and degraded system experience."
                       type="warning"
                     >
                       <button className="mt-2 text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded hover:bg-purple-600/30 transition-colors" onClick={() => setShowApplyFixModal('redis-cache')}>
                         ⚙️ Optimize
                       </button>
                     </InfoTooltip>
                  </div>
                </div>
              </div>

              {/* What You Should Never Do */}
              <div className="bg-gradient-to-br from-red-900/30 to-slate-800/30 rounded-xl border border-red-500/30 p-4">
                <h3 className="text-lg font-semibold text-red-300 mb-3 flex items-center">
                  🧠 Security Best Practices
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-red-900/20 rounded p-2 border-l-2 border-red-500">
                    <div className="text-red-400 font-medium text-xs">❌ NEVER: Store passwords in plain text</div>
                    <div className="text-gray-300 text-xs mt-1">Always use bcrypt with salt rounds ≥ 12</div>
                  </div>
                  <div className="bg-yellow-900/20 rounded p-2 border-l-2 border-yellow-500">
                    <div className="text-yellow-400 font-medium text-xs">⚠️ AVOID: Long-lasting refresh tokens</div>
                    <div className="text-gray-300 text-xs mt-1">Without session expiry checks, tokens become attack vectors</div>
                  </div>
                  <div className="bg-orange-900/20 rounded p-2 border-l-2 border-orange-500">
                    <div className="text-orange-400 font-medium text-xs">🚫 RISKY: Ignoring failed login patterns</div>
                    <div className="text-gray-300 text-xs mt-1">Implement progressive delays and account lockouts</div>
                  </div>
                </div>
              </div>

              {/* Fix Timeline Planner */}
              <div className="bg-gradient-to-br from-indigo-900/30 to-slate-800/30 rounded-xl border border-indigo-500/30 p-4">
                <h3 className="text-lg font-semibold text-indigo-300 mb-3 flex items-center">
                  🛠️ Fix Timeline Planner
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-red-400">Critical MFA Fix</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="text-xs text-gray-400">2h</span>
                      <button className="text-xs bg-red-600/20 text-red-300 px-2 py-1 rounded">Assign</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-yellow-400">Session Timeout</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="text-xs text-gray-400">30m</span>
                      <button className="text-xs bg-yellow-600/20 text-yellow-300 px-2 py-1 rounded">Schedule</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-400">Rate Limit Config</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="text-xs text-gray-400">1h</span>
                      <button className="text-xs bg-blue-600/20 text-blue-300 px-2 py-1 rounded">Auto-fix</button>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-indigo-500/30">
                    <div className="text-xs text-gray-400">Estimated resolution impact: <span className="text-green-400">+18 security score</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Learn More & AI Assistant */}
            <div className="space-y-4">
              {/* Learn More Section */}
              <div className="bg-gradient-to-br from-cyan-900/30 to-slate-800/30 rounded-xl border border-cyan-500/30 p-4">
                <h3 className="text-lg font-semibold text-cyan-300 mb-3 flex items-center">
                  📚 Learn More
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-cyan-900/20 rounded p-3 cursor-pointer hover:bg-cyan-900/30 transition-colors">
                    <div className="text-cyan-400 font-medium">🔍 What is Device Drift?</div>
                    <div className="text-gray-300 text-xs mt-1">Learn how device fingerprinting detects suspicious login patterns</div>
                  </div>
                  <div className="bg-cyan-900/20 rounded p-3 cursor-pointer hover:bg-cyan-900/30 transition-colors">
                    <div className="text-cyan-400 font-medium">🔐 Why MFA Sync Matters</div>
                    <div className="text-gray-300 text-xs mt-1">Understanding time-based authentication synchronization</div>
                  </div>
                  <div className="bg-cyan-900/20 rounded p-3 cursor-pointer hover:bg-cyan-900/30 transition-colors">
                    <div className="text-cyan-400 font-medium">⚡ JWT Token Best Practices</div>
                    <div className="text-gray-300 text-xs mt-1">Secure token management and rotation strategies</div>
                  </div>
                  <div className="bg-cyan-900/20 rounded p-3 cursor-pointer hover:bg-cyan-900/30 transition-colors">
                    <div className="text-cyan-400 font-medium">🛡️ Session Hijacking Prevention</div>
                    <div className="text-gray-300 text-xs mt-1">Advanced techniques to protect user sessions</div>
                  </div>
                </div>
              </div>

              {/* Mini Charts */}
              <div className="bg-gradient-to-br from-violet-900/30 to-slate-800/30 rounded-xl border border-violet-500/30 p-4">
                <h3 className="text-lg font-semibold text-violet-300 mb-3 flex items-center">
                  📊 Security Metrics
                </h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">Login Success Rate</span>
                      <span className="text-green-400">94.8%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '94.8%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">Session Hijack Blocks</span>
                      <span className="text-blue-400">23</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">Response Time</span>
                      <span className="text-yellow-400">127ms</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-Time AI Assistant */}
              <div className="bg-gradient-to-br from-teal-900/30 to-slate-800/30 rounded-xl border border-teal-500/30 p-4">
                <h3 className="text-lg font-semibold text-teal-300 mb-3 flex items-center">
                  🤖 AI Assistant
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-teal-900/20 rounded p-3">
                    <div className="text-teal-400 font-medium text-xs mb-2">💬 Ask me anything:</div>
                    <input 
                      type="text" 
                      placeholder="What's the risk of this MFA failure?"
                      className="w-full bg-slate-800/50 border border-teal-500/30 rounded px-2 py-1 text-xs text-gray-300 placeholder-gray-500"
                    />
                     <InfoTooltip 
                       content="Launch AI-powered assistant for authentication troubleshooting, system recommendations, and advanced security analysis. CONSEQUENCES: Not utilizing AI assistance may lead to missed optimization opportunities and longer resolution times for complex authentication issues."
                       type="info"
                     >
                       <button className="mt-2 text-xs bg-teal-600/20 text-teal-300 px-2 py-1 rounded hover:bg-teal-600/30 w-full transition-colors" onClick={() => setShowAIAssistant(true)}>
                         💬 Ask AI
                       </button>
                     </InfoTooltip>
                   </div>
                   <div className="bg-slate-900/50 rounded p-3 text-xs">
                     <div className="text-gray-400 mb-1">Recent questions:</div>
                     <div className="space-y-1">
                       <div className="text-blue-400 cursor-pointer hover:underline" onClick={() => { setAiQuery("How can I fix Webhook resilience?"); setShowAIAssistant(true); }}>• How can I fix Webhook resilience?</div>
                       <div className="text-blue-400 cursor-pointer hover:underline" onClick={() => { setAiQuery("Why are tokens expiring early?"); setShowAIAssistant(true); }}>• Why are tokens expiring early?</div>
                       <div className="text-blue-400 cursor-pointer hover:underline" onClick={() => { setAiQuery("Best MFA providers for enterprise?"); setShowAIAssistant(true); }}>• Best MFA providers for enterprise?</div>
                     </div>
                   </div>
                </div>
              </div>

              {/* Export Options */}
              <div className="bg-gradient-to-br from-amber-900/30 to-slate-800/30 rounded-xl border border-amber-500/30 p-4">
                <h3 className="text-lg font-semibold text-amber-300 mb-3 flex items-center">
                  📄 Export Report
                </h3>
                <div className="grid grid-cols-3 gap-2">
                   <button className="text-xs bg-amber-600/20 text-amber-300 px-2 py-2 rounded hover:bg-amber-600/30" onClick={exportToPDF}>
                     📄 PDF
                   </button>
                   <button className="text-xs bg-amber-600/20 text-amber-300 px-2 py-2 rounded hover:bg-amber-600/30" onClick={exportToCSV}>
                     🧾 CSV
                   </button>
                   <button className="text-xs bg-amber-600/20 text-amber-300 px-2 py-2 rounded hover:bg-amber-600/30" onClick={exportToJSON}>
                     🧬 JSON
                   </button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={!!showDetailsModal} onOpenChange={() => setShowDetailsModal(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {showDetailsModal === 'modules' && '📊 Modules Scanned Details'}
              {showDetailsModal === 'systems' && '⚠️ Systems Affected Details'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {showDetailsModal === 'modules' && (
              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-green-900/20 rounded">
                  <span>Multi-Provider Authentication</span>
                  <Badge className="bg-green-500">PASSED</Badge>
                </div>
                <div className="flex justify-between p-3 bg-yellow-900/20 rounded">
                  <span>Session Management</span>
                  <Badge className="bg-yellow-500">WARNING</Badge>
                </div>
                <div className="flex justify-between p-3 bg-red-900/20 rounded">
                  <span>Rate Limiting</span>
                  <Badge className="bg-red-500">CRITICAL</Badge>
                </div>
              </div>
            )}
            {showDetailsModal === 'systems' && (
              <div className="space-y-2">
                <div className="p-3 bg-red-900/20 rounded">
                  <h4 className="font-semibold text-red-400">Authentication Service</h4>
                  <p className="text-sm text-gray-300">MFA provider configuration missing</p>
                </div>
                <div className="p-3 bg-yellow-900/20 rounded">
                  <h4 className="font-semibold text-yellow-400">Session Manager</h4>
                  <p className="text-sm text-gray-300">Token timeout exceeds recommendations</p>
                </div>
                <div className="p-3 bg-orange-900/20 rounded">
                  <h4 className="font-semibold text-orange-400">Rate Limiter</h4>
                  <p className="text-sm text-gray-300">Bypass attempts detected</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Investigation Modal */}
      <Dialog open={!!showInvestigationModal} onOpenChange={() => setShowInvestigationModal(null)}>
        <DialogContent className="max-w-6xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-red-400">🔍 Security Investigation</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Evidence</h3>
              {showInvestigationModal === 'mfa' && (
                <div className="bg-black/30 p-4 rounded font-mono text-sm">
                  <div className="text-red-400">[ERROR] auth_provider_config.validate()</div>
                  <div className="text-gray-400">└─ google_oauth.client_secret: MISSING</div>
                  <div className="text-gray-400">└─ fallback_strategy: DISABLED</div>
                  <div className="text-yellow-400">Recommendation: Enable backup provider</div>
                </div>
              )}
              {showInvestigationModal === 'session-hijack' && (
                <div className="bg-black/30 p-4 rounded font-mono text-sm">
                  <div className="text-blue-400">[SECURITY] Session token reuse detected</div>
                  <div className="text-gray-400">└─ IPs: 192.168.1.1, 10.0.0.5, 203.45.67.89</div>
                  <div className="text-gray-400">└─ Intervals: 2.3s, 2.1s, 2.4s</div>
                  <div className="text-red-400">Action: All sessions terminated</div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Actions</h3>
              <div className="space-y-2">
                <button className="w-full p-3 bg-red-600/20 text-red-300 rounded hover:bg-red-600/30">
                  🚫 Block Suspicious IP
                </button>
                <button className="w-full p-3 bg-yellow-600/20 text-yellow-300 rounded hover:bg-yellow-600/30">
                  📧 Alert Security Team
                </button>
                <button className="w-full p-3 bg-blue-600/20 text-blue-300 rounded hover:bg-blue-600/30">
                  📋 Export Incident Report
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Apply Fix Modal */}
      <Dialog open={!!showApplyFixModal} onOpenChange={() => setShowApplyFixModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-green-400">⚙️ Apply Security Fix</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {showApplyFixModal === 'jwt-rotation' && (
              <div>
                <h3 className="font-semibold mb-2">JWT Token Rotation Configuration</h3>
                <p className="text-sm text-gray-300 mb-4">
                  This will automatically configure JWT tokens to rotate every 12 hours instead of the current 24-hour period.
                </p>
                <div className="bg-yellow-900/20 p-3 rounded mb-4">
                  <p className="text-yellow-400 text-sm">⚠️ This change will briefly interrupt active sessions (less than 30 seconds)</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-green-600/20 text-green-300 rounded hover:bg-green-600/30">
                    Apply Fix Now
                  </button>
                  <button className="px-4 py-2 bg-blue-600/20 text-blue-300 rounded hover:bg-blue-600/30">
                    Schedule for Later
                  </button>
                </div>
              </div>
            )}
            {showApplyFixModal === 'session' && (
              <div>
                <h3 className="font-semibold mb-2">Session Timeout Configuration</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Reduce session timeout from 24 hours to 8 hours for enhanced security.
                </p>
                <button className="px-4 py-2 bg-green-600/20 text-green-300 rounded hover:bg-green-600/30">
                  Auto-Fix Session Timeout
                </button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Learn More Modal */}
      <Dialog open={!!showLearnMoreModal} onOpenChange={() => setShowLearnMoreModal(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-blue-400">📚 Security Documentation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {showLearnMoreModal === 'device-fingerprinting' && (
              <div>
                <h3 className="font-semibold mb-2">Device Fingerprinting</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Device fingerprinting helps detect account takeover attempts by analyzing unique device characteristics.
                </p>
                <div className="bg-blue-900/20 p-4 rounded">
                  <h4 className="font-semibold text-blue-400 mb-2">Key Benefits:</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• 94% effective against session hijacking</li>
                    <li>• Detects device changes immediately</li>
                    <li>• Reduces false positives by 67%</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Assistant Modal */}
      <Dialog open={showAIAssistant} onOpenChange={setShowAIAssistant}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-purple-400">🤖 AI Security Assistant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded min-h-[200px]">
              <div className="text-green-400 text-sm">AI Assistant:</div>
              <div className="text-gray-300 text-sm mt-2">
                I'm analyzing your security configuration. Ask me anything about the current issues or best practices.
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Suggested Questions:</h4>
              <button className="w-full text-left p-2 bg-slate-700/30 rounded text-sm hover:bg-slate-700/50" onClick={() => setAiQuery("Why is MFA config failing?")}>
                • Why is MFA config failing?
              </button>
              <button className="w-full text-left p-2 bg-slate-700/30 rounded text-sm hover:bg-slate-700/50" onClick={() => setAiQuery("What are safe session timeout values?")}>
                • What are safe session timeout values?
              </button>
              <button className="w-full text-left p-2 bg-slate-700/30 rounded text-sm hover:bg-slate-700/50" onClick={() => setAiQuery("How to prevent session hijacking?")}>
                • How to prevent session hijacking?
              </button>
            </div>
            <div className="flex gap-2">
              <input 
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 p-2 bg-slate-700/50 rounded text-sm"
              />
              <button className="px-4 py-2 bg-purple-600/20 text-purple-300 rounded hover:bg-purple-600/30">
                Ask
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      </div>
    </TooltipProvider>
  );
};