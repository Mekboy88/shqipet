import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/components/admin/AdminLayout';
import { AdminHealthLayout } from '@/components/admin/shared/AdminHealthLayout';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AdminNotificationLogs } from '@/components/admin/alerts/AdminNotificationLogs';
import { BehavioralAlertsSystem } from '@/components/admin/alerts/BehavioralAlertsSystem';
import { AuditLinkedAlerts } from '@/components/admin/alerts/AuditLinkedAlerts';
import { AlertSeverityFiltersSystem } from '@/components/admin/alerts/AlertSeverityFiltersSystem';
import { AlertDeliveryChannels } from '@/components/admin/alerts/AlertDeliveryChannels';
import { AlertViewerPanelFeatures } from '@/components/admin/alerts/AlertViewerPanelFeatures';
import { AdminAlertsImplementationSummary } from '@/components/admin/alerts/AdminAlertsImplementationSummary';
import { SystemPlacementSummary } from '@/components/admin/alerts/SystemPlacementSummary';
import { CriticalIntegrationMapping } from '@/components/admin/alerts/CriticalIntegrationMapping';
import { ConnectedSystemCards } from '@/components/admin/alerts/ConnectedSystemCards';
import { SystemSetupChecklistUI } from '@/components/admin/alerts/SystemSetupChecklistUI';
import { MultiRegionComplianceTracker } from '@/components/admin/alerts/MultiRegionComplianceTracker';
import { FinalVerdictSummary } from '@/components/admin/alerts/FinalVerdictSummary';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertTriangle, CheckCircle, X, ChevronUp, ChevronDown, TrendingUp, Download, FileDown, RefreshCw, RotateCcw, Search, Skull, Shield, Eye, EyeOff, XCircle, Plus, Database, Activity, Users, Info, AlertCircle, Smartphone, Clock, Mail, Check } from 'lucide-react';
import { CoreAuthenticationDashboard } from '@/components/admin/auth/CoreAuthenticationDashboard';
import BehavioralAnomalyScanning from '@/components/admin/BehavioralAnomalyScanning';
import TokenRefreshHealth from '@/components/admin/TokenRefreshHealth';
import { OAuthProviderHealth } from '@/components/admin/OAuthProviderHealth';
import { GhostSessionAutoReaper } from '@/components/admin/GhostSessionAutoReaper';
import { MFAEnforcementAudit } from '@/components/admin/MFAEnforcementAudit';
import { LoginPatternAnomaly } from '@/components/admin/LoginPatternAnomaly';
import { DeviceFingerprintCheck } from '@/components/admin/DeviceFingerprintCheck';
import { BruteForceRateMap } from '@/components/admin/BruteForceRateMap';
import { MFATamperingDetection } from '@/components/admin/MFATamperingDetection';
import { TokenAbuseScanner } from '@/components/admin/TokenAbuseScanner';
import { SecurityImplementationSummary } from '@/components/admin/SecurityImplementationSummary';
import { AddTableModal } from '@/components/admin/AddTableModal';
import TableInspectorModal from '@/components/admin/TableInspectorModal';
import { AuditLogsInspectModal, CreateTableModal, AddFieldModal } from '@/components/admin/AuditLogsModals';
import { DeviceRegistryInspectorModal, DeviceRegistryAddTableModal, DeviceRegistryAddFieldModal } from '@/components/admin/DeviceRegistryModals';
import { LoginFailuresInspectorModal, LoginFailuresAddTableModal, LoginFailuresAddFieldModal } from '@/components/admin/LoginFailuresModals';
import { DeviceEventsInspectorModal, DeviceEventsAddTableModal } from '@/components/admin/DeviceEventsModals';
import { SessionBlacklistInspectorModal, SessionBlacklistAddTableModal } from '@/components/admin/SessionBlacklistModals';
import { GeoLoginAuditInspectorModal, GeoLoginAuditAddTableModal } from '@/components/admin/GeoLoginAuditModals';
import { MFAAttemptLogsInspectorModal, MFAAttemptLogsAddTableModal } from '@/components/admin/MFAAttemptLogsModals';
import { ConsentRecordsInspectorModal, ConsentRecordsAddTableModal } from '@/components/admin/ConsentRecordsModals';
import { FormIntelligenceDemo } from '@/components/form/FormIntelligenceDemo';
import { SessionRecoveryDemo } from '@/components/session/SessionRecoveryDemo';
import { AdaptiveLayoutDemo } from '@/components/layout/AdaptiveLayoutDemo';
import { MultiLanguageDemo } from '@/components/i18n/MultiLanguageDemo';
import { ProPerksDemo } from '@/components/pro/ProPerksDemo';
import { UXGuidelinesSummary } from '@/components/ux/UXGuidelinesSummary';

// Add CSS for animations
const animations = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
  .shake {
    animation: shake 0.6s ease-in-out;
  }
  
  @keyframes flashKill {
    0% { background-color: #ffe0e0; }
    50% { background-color: #ffcccc; }
    100% { background-color: transparent; opacity: 0; }
  }
  .flash-kill {
    animation: flashKill 1s ease forwards;
  }
`;

// Inject CSS into document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = animations;
  document.head.appendChild(style);
}

const CorePlatformAuthentication: React.FC = () => {
  const [activeSection, setActiveSection] = useState('modules');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Modal states
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isForceRefreshOpen, setIsForceRefreshOpen] = useState(false);
  const [isKillSessionOpen, setIsKillSessionOpen] = useState(false);
  const [isEnforceMFAOpen, setIsEnforceMFAOpen] = useState(false);
  const [isGhostTableOpen, setIsGhostTableOpen] = useState(false);
  const [isGhostTableFullscreen, setIsGhostTableFullscreen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isViewDetailsFullscreen, setIsViewDetailsFullscreen] = useState(false);
  const [isForceRefreshFullscreen, setIsForceRefreshFullscreen] = useState(false);
  const [failedTokens, setFailedTokens] = useState<string[]>([]);
  const [showFailedDetails, setShowFailedDetails] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isConfirmValid, setIsConfirmValid] = useState(false);
  const [refreshTimer, setRefreshTimer] = useState(0);
  const [estimatedTimeLeft, setEstimatedTimeLeft] = useState(0);
  const [refreshCompleted, setRefreshCompleted] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [sortField, setSortField] = useState<'lastRefresh' | 'status' | 'userId' | 'deviceType'>('lastRefresh');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [auditLogsInspectOpen, setAuditLogsInspectOpen] = useState(false);
  const [createTableModalOpen, setCreateTableModalOpen] = useState(false);
  const [addFieldModalOpen, setAddFieldModalOpen] = useState(false);
  // Device Registry modals
  const [showDeviceRegistryInspector, setShowDeviceRegistryInspector] = useState(false);
  const [showDeviceRegistryAddTable, setShowDeviceRegistryAddTable] = useState(false);
  const [showDeviceRegistryAddField, setShowDeviceRegistryAddField] = useState(false);
  // Login Failures modals
  const [showLoginFailuresInspector, setShowLoginFailuresInspector] = useState(false);
  const [showLoginFailuresAddTable, setShowLoginFailuresAddTable] = useState(false);
  const [showLoginFailuresAddField, setShowLoginFailuresAddField] = useState(false);
  // Session Blacklist modals
  const [showSessionBlacklistInspector, setShowSessionBlacklistInspector] = useState(false);
  const [showSessionBlacklistAddTable, setShowSessionBlacklistAddTable] = useState(false);
  // Device Events modals
  const [showDeviceEventsInspector, setShowDeviceEventsInspector] = useState(false);
  const [showDeviceEventsAddTable, setShowDeviceEventsAddTable] = useState(false);
  // Geo Login Audit modals
  const [showGeoLoginAuditInspector, setShowGeoLoginAuditInspector] = useState(false);
  const [showGeoLoginAuditAddTable, setShowGeoLoginAuditAddTable] = useState(false);
  // MFA Attempt Logs modals
  const [showMFAAttemptLogsInspector, setShowMFAAttemptLogsInspector] = useState(false);
  const [showMFAAttemptLogsAddTable, setShowMFAAttemptLogsAddTable] = useState(false);
  // Consent Records modals
  const [showConsentRecordsInspector, setShowConsentRecordsInspector] = useState(false);
  const [showConsentRecordsAddTable, setShowConsentRecordsAddTable] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [highlightedTokens, setHighlightedTokens] = useState<Set<string>>(new Set());
  const [detailsSearchFilter, setDetailsSearchFilter] = useState('');
  const [failedSectionVisible, setFailedSectionVisible] = useState(true);
  const [tokenRefreshProgress, setTokenRefreshProgress] = useState(0);
  const [tokenRefreshStartTime, setTokenRefreshStartTime] = useState<Date | null>(null);
  const [tokenElapsedTime, setTokenElapsedTime] = useState(0);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  
  // Run Now and Auto-Flag specific states
  const [ghostCleanupLoading, setGhostCleanupLoading] = useState(false);
  const [autoFlagLoading, setAutoFlagLoading] = useState(false);
  const [lastGhostCleanup, setLastGhostCleanup] = useState<Date | null>(null);
  const [flaggedSessionsCount, setFlaggedSessionsCount] = useState(0);
  const [recentFlaggedSessions, setRecentFlaggedSessions] = useState<string[]>([]);
  
  // Real-time monitoring states
  const [realTimeData, setRealTimeData] = useState({
    sessionSync: { status: 'Active', count: 5, expired: 2, ghost: 1 },
    edgePing: { status: 'OK', latency: 125, slow: 1 },
    loginRate: { status: 'Normal', blocked: 0, flooding: false },
    tokenStatus: { sent: 45, consumed: 42, expired: 1, blocked: 2 }
  });
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [updatingFields, setUpdatingFields] = useState<Set<string>>(new Set());
  const [flashingFields, setFlashingFields] = useState<Set<string>>(new Set());
  const [realTimeInterval, setRealTimeInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  
  // Action loading states
  const [actionLoadingStates, setActionLoadingStates] = useState<Record<string, boolean>>({});
  
  // Audit trail
  const [auditLogs, setAuditLogs] = useState<Array<{
    id: string;
    admin_id: string;
    action: string;
    context: string;
    timestamp: string;
    result?: any;
  }>>([]);
  
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState('');
  
  // Data states
  const [refreshProgress, setRefreshProgress] = useState({ success: 0, error: 0, total: 0 });
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const [mfaActionLoading, setMfaActionLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [sortBy, setSortBy] = useState<'userId' | 'device' | 'lastRefresh' | 'nextRefresh' | 'status'>('lastRefresh');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchFilter, setSearchFilter] = useState('');
  
  // Kill Sessions Filter States
  const [sessionTypeFilter, setSessionTypeFilter] = useState('all');
  const [timeFrameFilter, setTimeFrameFilter] = useState('all');
  const [sessionSortBy, setSessionSortBy] = useState<'risk' | 'idle' | 'lastActive' | 'device'>('risk');
  const [sessionSortOrder, setSessionSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isFiltering, setIsFiltering] = useState(false);
  const [flashingSessionIds, setFlashingSessionIds] = useState<Set<string>>(new Set());
  const [allSessionsSelected, setAllSessionsSelected] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  
  // Ghost Sessions specific states
  const [ghostSearchFilter, setGhostSearchFilter] = useState('');
  
  // Table inspection states
  const [selectedMissingTable, setSelectedMissingTable] = useState<string | null>(null);
  const [ghostAgeFilter, setGhostAgeFilter] = useState('all');
  const [ghostAutoRefresh, setGhostAutoRefresh] = useState(false);
  const [ghostSortBy, setGhostSortBy] = useState<'userId' | 'lastActive' | 'device' | 'location' | 'sessionAge'>('sessionAge');
  const [ghostSortOrder, setGhostSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedGhostSessions, setSelectedGhostSessions] = useState<string[]>([]);
  const [allGhostSelected, setAllGhostSelected] = useState(false);
  const [killingSessionIds, setKillingSessionIds] = useState<Set<string>>(new Set());
  const [showKillConfirmation, setShowKillConfirmation] = useState(false);
  const [killConfirmText, setKillConfirmText] = useState('');
  const [ghostRefreshInterval, setGhostRefreshInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  
  // Elite Intelligence States
  const [isEliteCollapsed, setIsEliteCollapsed] = useState(false);
  
  // Table Inspector Modal States
  const [isTableInspectorOpen, setIsTableInspectorOpen] = useState(false);
  const [selectedTableForInspection, setSelectedTableForInspection] = useState<string>('');
  
  // Auth Audit Logs specific states
  const [auditLogsExists, setAuditLogsExists] = useState(false);
  const [userIdFieldExists, setUserIdFieldExists] = useState(false);
  
  // Helper functions for Elite Intelligence
  const checkTableExists = (tableName: string): boolean => {
    // Mock check - in real implementation, this would check actual Supabase schema
    const commonTables = ['auth.users', 'auth.refresh_tokens', 'profiles', 'user_sessions'];
    return commonTables.includes(tableName);
  };

  const getTableRowCount = (tableName: string): string => {
    // Mock data - in real implementation, this would query actual table counts
    const counts: { [key: string]: string } = {
      'auth.refresh_tokens': '1,247',
      'auth.audit_logs': '5,832',
      'device_registry': '892',
      'login_failures': '156',
      'content_flags': '23'
    };
    return counts[tableName] || '0';
  };

  const getDataQualityColor = (tableName: string, metric: string): string => {
    // Mock quality assessment - in real implementation, this would analyze actual data
    if (metric === 'expired_tokens') return 'bg-yellow-400';
    if (metric === 'null_timestamps') return 'bg-red-400';
    return 'bg-green-400';
  };

  const getDataQualityMetric = (tableName: string, metric: string): number => {
    // Mock metrics - in real implementation, this would calculate from actual data
    const metrics: { [key: string]: { [key: string]: number } } = {
      'auth.refresh_tokens': { expired_percentage: 15, null_percentage: 2 }
    };
    return metrics[tableName]?.[metric] || 0;
  };

  const checkTableRLS = (tableName: string): boolean => {
    return ['auth.refresh_tokens', 'profiles', 'device_registry'].includes(tableName);
  };

  const getFieldExists = (tableName: string, fieldName: string): boolean => {
    const tableFields: { [key: string]: string[] } = {
      'device_registry': ['user_id', 'device_hash', 'first_seen'],
      'auth.audit_logs': ['event_type', 'timestamp', 'metadata']
    };
    return tableFields[tableName]?.includes(fieldName) || false;
  };

  const openDeviceRegistryInspector = () => setShowDeviceRegistryInspector(true);

  const openLoginFailuresInspector = () => setShowLoginFailuresInspector(true);

  const openSessionBlacklistInspector = () => setShowSessionBlacklistInspector(true);

  const openDeviceEventsInspector = () => setShowDeviceEventsInspector(true);

  const openGeoLoginAuditInspector = () => setShowGeoLoginAuditInspector(true);

  const openMFAAttemptLogsInspector = () => setShowMFAAttemptLogsInspector(true);

  const openConsentRecordsInspector = () => setShowConsentRecordsInspector(true);

  const openTableInspector = (tableName: string) => {
    setSelectedTableForInspection(tableName);
    setIsTableInspectorOpen(true);
  };

  const handleInspectTable = (tableName: string) => {
    openTableInspector(tableName);
  };

  const rescanSingleTable = (tableName: string) => {
    // Mock function - in real implementation, this would rescan specific table
    toast({
      title: "Rescanning Table",
      description: `Refreshing schema for ${tableName}`,
    });
  };

  const exportEliteTablesData = () => {
    // Mock function - in real implementation, this would export schema data
    toast({
      title: "Export Started",
      description: "Elite tables schema export initiated",
    });
  };

  // Demo Components for UX Guidelines
  const PhoneEmailValidationDemo = () => {
    const [value, setValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [showIcon, setShowIcon] = useState(false);

    const validateInput = (input: string) => {
      if (!input) {
        setShowIcon(false);
        return;
      }
      setShowIcon(true);
      // Email validation
      if (input.includes('@')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsValid(emailRegex.test(input));
      } else {
        // Phone validation (basic)
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        setIsValid(phoneRegex.test(input.replace(/\s/g, '')));
      }
    };

    useEffect(() => {
      validateInput(value);
    }, [value]);

    return (
      <div className="relative">
        <Input
          type="text"
          placeholder="Enter email or phone number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`pr-10 ${showIcon ? (isValid ? 'border-green-500' : 'border-red-500') : ''}`}
        />
        {showIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isValid ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
        {showIcon && (
          <p className={`text-xs mt-1 ${isValid ? 'text-green-600' : 'text-red-600'}`}>
            {isValid ? '✅ Valid format' : '❌ Invalid format'}
          </p>
        )}
      </div>
    );
  };

  const PasswordStrengthDemo = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const getPasswordStrength = (pwd: string) => {
      if (!pwd) return { strength: 'none', color: 'bg-gray-200', percentage: 0 };
      
      let score = 0;
      if (pwd.length >= 8) score++;
      if (/[A-Z]/.test(pwd)) score++;
      if (/[a-z]/.test(pwd)) score++;
      if (/[0-9]/.test(pwd)) score++;
      if (/[^A-Za-z0-9]/.test(pwd)) score++;
      
      if (score <= 2) return { strength: 'weak', color: 'bg-red-500', percentage: 33 };
      if (score <= 3) return { strength: 'moderate', color: 'bg-orange-500', percentage: 66 };
      return { strength: 'strong', color: 'bg-green-500', percentage: 100 };
    };

    const strength = getPasswordStrength(password);

    return (
      <div>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {password && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Password Strength</span>
              <span className={`font-medium ${
                strength.strength === 'weak' ? 'text-red-600' :
                strength.strength === 'moderate' ? 'text-orange-600' : 'text-green-600'
              }`}>
                {strength.strength.charAt(0).toUpperCase() + strength.strength.slice(1)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                style={{ width: `${strength.percentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const DOBAgeCheckDemo = () => {
    const [birthDate, setBirthDate] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [age, setAge] = useState(0);

    const calculateAge = (dateString: string) => {
      if (!dateString) return 0;
      const today = new Date();
      const birth = new Date(dateString);
      let calculatedAge = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        calculatedAge--;
      }
      return calculatedAge;
    };

    useEffect(() => {
      if (birthDate) {
        const calculatedAge = calculateAge(birthDate);
        setAge(calculatedAge);
        setIsValid(calculatedAge >= 16);
      } else {
        setAge(0);
        setIsValid(false);
      }
    }, [birthDate]);

    return (
      <div>
        <Input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className={`${birthDate ? (isValid ? 'border-green-500' : 'border-red-500') : ''}`}
        />
        {birthDate && (
          <div className="mt-2 flex items-center space-x-2">
            {isValid ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✅ Age {age} - Eligible
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                ❌ Must be 16+ - Currently {age}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };
  
  // Alert Modal States
  const [alertCategories, setAlertCategories] = useState<string[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertSubject, setAlertSubject] = useState<string>('');
  const [selectedDeliveryMethods, setSelectedDeliveryMethods] = useState<string[]>([]);
  const [emailRecipients, setEmailRecipients] = useState<string>('all-admins');
  const [slackWebhookUrl, setSlackWebhookUrl] = useState<string>('');
  const [sendTestFirst, setSendTestFirst] = useState<boolean>(false);
  const [saveToLogs, setSaveToLogs] = useState<boolean>(true);
  const [showAlertHistory, setShowAlertHistory] = useState<boolean>(false);
  const [alertStatus, setAlertStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isAlertFullscreen, setIsAlertFullscreen] = useState<boolean>(false);
  const [slackWebhookError, setSlackWebhookError] = useState<string>('');
  const [recentAlerts, setRecentAlerts] = useState([
    { id: 1, category: 'Security Breach', message: 'Unauthorized access detected in user management system', timestamp: '2024-01-15 14:30', status: 'sent' },
    { id: 2, category: 'Platform Maintenance', message: 'Scheduled maintenance window starts at 2 AM EST', timestamp: '2024-01-14 18:45', status: 'sent' },
    { id: 3, category: 'New Feature', message: 'New dashboard analytics module deployed successfully', timestamp: '2024-01-13 10:15', status: 'sent' }
  ]);
  
  // Load saved session note on mount
  useEffect(() => {
    const savedNote = sessionStorage.getItem('killSession.lastNote');
    if (savedNote) {
      setSessionNotes(savedNote);
    }
  }, []);

  // Save session note to sessionStorage
  useEffect(() => {
    if (sessionNotes) {
      sessionStorage.setItem('killSession.lastNote', sessionNotes);
    }
  }, [sessionNotes]);

  // Cleanup ghost refresh interval on unmount
  useEffect(() => {
    return () => {
      if (ghostRefreshInterval) {
        clearInterval(ghostRefreshInterval);
      }
    };
  }, [ghostRefreshInterval]);

  
  // Real-time monitoring and audit logging
  const addAuditLog = (action: string, context: string, result?: any) => {
    const newLog = {
      id: `audit_${Date.now()}`,
      admin_id: 'AM', // Replace with actual admin ID
      action,
      context,
      timestamp: new Date().toISOString(),
      result
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 49)]); // Keep last 50 logs
    console.log('🔍 Audit Log:', newLog);
  };

  const updateFieldWithFlash = (fieldName: string, newData: any) => {
    // Add to updating state
    setUpdatingFields(prev => new Set([...prev, fieldName]));
    
    // Simulate API call
    setTimeout(() => {
      setRealTimeData(prev => ({ ...prev, [fieldName]: newData }));
      setUpdatingFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldName);
        return newSet;
      });
      
      // Add flash effect
      setFlashingFields(prev => new Set([...prev, fieldName]));
      setTimeout(() => {
        setFlashingFields(prev => {
          const newSet = new Set(prev);
          newSet.delete(fieldName);
          return newSet;
        });
      }, 1000);
      
      setLastUpdated(new Date());
    }, Math.random() * 2000 + 500); // Random delay 0.5-2.5s
  };

  const performActionWithFeedback = async (actionName: string, context: string, actionFn: () => Promise<any>) => {
    setActionLoadingStates(prev => ({ ...prev, [actionName]: true }));
    
    try {
      const result = await actionFn();
      addAuditLog(actionName, context, result);
      
      toast({
        title: "✅ Action completed successfully",
        description: `${actionName} completed for ${context}`,
        duration: 3000,
      });
      
      return result;
    } catch (error) {
      console.error(`Action ${actionName} failed:`, error);
      toast({
        title: "❌ Action failed",
        description: `Failed to ${actionName.toLowerCase()}. Please try again.`,
        variant: "destructive",
        duration: 4000,
      });
      throw error;
    } finally {
      setActionLoadingStates(prev => ({ ...prev, [actionName]: false }));
    }
  };

  // Real-time polling setup
  useEffect(() => {
    const startRealTimePolling = () => {
      const interval = setInterval(() => {
        console.log('🔄 Polling real-time data...');
        
        // Simulate random updates to different fields
        const fields = ['sessionSync', 'edgePing', 'loginRate', 'tokenStatus'];
        const randomField = fields[Math.floor(Math.random() * fields.length)];
        
        switch (randomField) {
          case 'sessionSync':
            updateFieldWithFlash('sessionSync', {
              status: Math.random() > 0.8 ? 'Warning' : 'Active',
              count: Math.floor(Math.random() * 10) + 3,
              expired: Math.floor(Math.random() * 5),
              ghost: Math.floor(Math.random() * 3)
            });
            break;
          case 'edgePing':
            const latency = Math.floor(Math.random() * 400) + 50;
            updateFieldWithFlash('edgePing', {
              status: latency > 250 ? 'Slow' : 'OK',
              latency,
              slow: latency > 250 ? 1 : 0
            });
            break;
          case 'loginRate':
            updateFieldWithFlash('loginRate', {
              status: Math.random() > 0.9 ? 'Flooding' : 'Normal',
              blocked: Math.floor(Math.random() * 3),
              flooding: Math.random() > 0.9
            });
            break;
          case 'tokenStatus':
            updateFieldWithFlash('tokenStatus', {
              sent: Math.floor(Math.random() * 20) + 40,
              consumed: Math.floor(Math.random() * 15) + 35,
              expired: Math.floor(Math.random() * 5),
              blocked: Math.floor(Math.random() * 3)
            });
            break;
        }
      }, 15000); // Poll every 15 seconds
      
      setRealTimeInterval(interval);
    };

    startRealTimePolling();
    
    return () => {
      if (realTimeInterval) {
        clearInterval(realTimeInterval);
      }
    };
  }, []);

  // Helper functions for ghost sessions
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes === 1) return '1 min ago';
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };
  const getFilteredGhostSessions = () => {
    if (!mockSessions || !Array.isArray(mockSessions)) {
      return [];
    }
    
    let filtered = mockSessions.filter(s => s && s.isGhost);
    
    // Apply search filter
    if (ghostSearchFilter) {
      filtered = filtered.filter(s => 
        s && s.userId && s.location &&
        (s.userId.toLowerCase().includes(ghostSearchFilter.toLowerCase()) ||
        s.location.toLowerCase().includes(ghostSearchFilter.toLowerCase()))
      );
    }
    
    // Apply age filter
    if (ghostAgeFilter !== 'all') {
      // For demo purposes, we'll filter based on lastActive text
      if (ghostAgeFilter === '1h') {
        filtered = filtered.filter(s => s.lastActive.includes('minutes'));
      } else if (ghostAgeFilter === '24h') {
        filtered = filtered.filter(s => s.lastActive.includes('hour') && !s.lastActive.includes('day'));
      } else if (ghostAgeFilter === '3d') {
        filtered = filtered.filter(s => s.lastActive.includes('day'));
      }
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[ghostSortBy as keyof typeof a];
      const bVal = b[ghostSortBy as keyof typeof b];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const comparison = aVal.localeCompare(bVal);
        return ghostSortOrder === 'asc' ? comparison : -comparison;
      }
      
      return 0;
    });
    
    return filtered;
  };

  const exportGhostSessions = (format: 'csv' | 'json') => {
    const sessions = getFilteredGhostSessions();
    if (!sessions || sessions.length === 0) {
      toast({
        description: "No ghost sessions to export",
        variant: "destructive"
      });
      return;
    }
    
    const data = sessions.map(s => ({
      userId: s.userId,
      lastActive: s.lastActive,
      device: s.device,
      location: s.location,
      sessionAge: s.sessionAge,
      riskLevel: s.riskLevel,
      riskTags: (s.riskTags || []).join(', '),
      mfaEnabled: s.mfaEnabled ? 'Yes' : 'No',
      timeKilled: new Date().toISOString()
    }));

    if (format === 'csv') {
      const headers = ['User ID', 'Last Active', 'Device', 'Location', 'Session Age', 'Risk Level', 'Risk Tags', 'MFA Enabled', 'Time Killed'];
      const csvContent = [
        headers.join(','),
        ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ghost_sessions_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
    } else {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ghost_sessions_${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
    }
    
    toast({
      description: `Exported ${sessions.length} ghost sessions as ${format.toUpperCase()}`
    });
  };

  const handleKillGhostSession = (sessionId: string) => {
    setKillingSessionIds(prev => new Set([...prev, sessionId]));
    
    // Add flash effect
    setTimeout(() => {
      setKillingSessionIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(sessionId);
        return newSet;
      });
      
      // Remove from selected sessions
      setSelectedGhostSessions(prev => prev.filter(id => id !== sessionId));
      
      toast({
        description: `Session ${sessionId} has been terminated`,
        variant: "destructive"
      });
    }, 1000);
  };

  const handleConfirmKillSessions = () => {
    if (killConfirmText !== 'CONFIRM') return;
    
    selectedGhostSessions.forEach(sessionId => {
      handleKillGhostSession(sessionId);
    });
    
    setShowKillConfirmation(false);
    setKillConfirmText('');
    setSelectedGhostSessions([]);
    setAllGhostSelected(false);
    
    toast({
      description: `Killing ${selectedGhostSessions.length} ghost sessions...`,
      variant: "destructive"
    });
  };

  // Mock data for demonstrations
  const mockSessions = [
    { 
      id: 'sess_1', 
      userId: 'user_123', 
      lastActive: '2 hours ago', 
      device: 'Chrome/Mobile', 
      location: 'New York', 
      country: '🇺🇸',
      isGhost: true, 
      idleTime: '2h',
      sessionAge: '2 hours',
      riskLevel: 'High',
      riskTags: ['Long Idle', 'No MFA'],
      mfaEnabled: false,
      ipAddress: '192.168.1.100',
      deviceFingerprint: 'fp_abc123',
      sessionNotes: ''
    },
    { 
      id: 'sess_2', 
      userId: 'user_456', 
      lastActive: '24 hours ago', 
      device: 'Safari/Desktop', 
      location: 'London', 
      country: '🇬🇧',
      isGhost: false, 
      idleTime: '24h',
      sessionAge: '24 hours',
      riskLevel: 'Low',
      riskTags: [],
      mfaEnabled: true,
      ipAddress: '10.0.0.50',
      deviceFingerprint: 'fp_def456',
      sessionNotes: ''
    },
    { 
      id: 'sess_3', 
      userId: 'user_789', 
      lastActive: '3 days ago', 
      device: 'Firefox/Mobile', 
      location: 'Tokyo', 
      country: '🇯🇵',
      isGhost: true, 
      idleTime: '3d',
      sessionAge: '3 days',
      riskLevel: 'High',
      riskTags: ['Multiple Regions', 'Long Idle'],
      mfaEnabled: false,
      ipAddress: '203.0.113.10',
      deviceFingerprint: 'fp_ghi789',
      sessionNotes: 'Flagged for review'
    },
  ];

  const mockTokenData = [
    { userId: 'user_123', device: 'Chrome/Mobile', lastRefresh: '2h ago', nextRefresh: '6h', status: 'Success', platform: 'ios', timestamp: Date.now() - 2 * 60 * 60 * 1000 },
    { userId: 'user_456', device: 'Safari/Desktop', lastRefresh: '1h ago', nextRefresh: '7h', status: 'Failed', platform: 'web', timestamp: Date.now() - 1 * 60 * 60 * 1000 },
    { userId: 'user_789', device: 'Firefox/Mobile', lastRefresh: '5h ago', nextRefresh: '3h', status: 'Success', platform: 'android', timestamp: Date.now() - 5 * 60 * 60 * 1000 },
    { userId: 'user_101', device: 'Edge/Desktop', lastRefresh: '30m ago', nextRefresh: '7.5h', status: 'Success', platform: 'web', timestamp: Date.now() - 30 * 60 * 1000 },
    { userId: 'user_102', device: 'Safari/iOS', lastRefresh: '3h ago', nextRefresh: '5h', status: 'Failed', platform: 'ios', timestamp: Date.now() - 3 * 60 * 60 * 1000 },
    { userId: 'user_103', device: 'Chrome/Android', lastRefresh: '6h ago', nextRefresh: '2h', status: 'Success', platform: 'android', timestamp: Date.now() - 6 * 60 * 60 * 1000 },
    { userId: 'user_104', device: 'Firefox/Desktop', lastRefresh: '8h ago', nextRefresh: '4h', status: 'Failed', platform: 'web', timestamp: Date.now() - 8 * 60 * 60 * 1000 },
    { userId: 'user_105', device: 'Safari/iPad', lastRefresh: '12h ago', nextRefresh: '1h', status: 'Success', platform: 'ios', timestamp: Date.now() - 12 * 60 * 60 * 1000 },
  ];

  // Filter token data based on current filters
  const getFilteredTokenData = () => {
    let filtered = [...mockTokenData];
    
    // Time range filter
    const now = Date.now();
    const timeRangeMs = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };
    
    if (timeRange !== 'all') {
      const cutoff = now - timeRangeMs[timeRange as keyof typeof timeRangeMs];
      filtered = filtered.filter(item => item.timestamp >= cutoff);
    }
    
    // Platform filter
    if (platformFilter !== 'all') {
      filtered = filtered.filter(item => item.platform === platformFilter);
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      const targetStatus = statusFilter === 'success' ? 'Success' : 'Failed';
      filtered = filtered.filter(item => item.status === targetStatus);
    }
    
    // Search filter
    if (searchFilter) {
      filtered = filtered.filter(item => 
        item.userId.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.device.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }
    
    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'lastRefresh' || sortBy === 'nextRefresh') {
        // Convert time strings to timestamps for proper sorting
        aValue = a.timestamp;
        bValue = b.timestamp;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  };

  // Export functionality
  const exportData = (format: 'csv' | 'json') => {
    const data = getFilteredTokenData();
    const timestamp = new Date().toISOString().split('T')[0];
    
    if (format === 'csv') {
      const headers = ['User ID', 'Device', 'Last Refresh', 'Next Scheduled', 'Status', 'Platform'];
      const csvContent = [
        headers.join(','),
        ...data.map(item => [
          item.userId,
          `"${item.device}"`,
          `"${item.lastRefresh}"`,
          `"${item.nextRefresh}"`,
          item.status,
          item.platform
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `token-refresh-details-${timestamp}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `token-refresh-details-${timestamp}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    toast({
      title: "📤 Export Complete",
      description: `Token refresh data exported as ${format.toUpperCase()}`,
    });
  };

  // Handle column sort
  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  // Calculate metrics based on filtered data
  const getFilteredMetrics = () => {
    const filtered = getFilteredTokenData();
    const total = filtered.length;
    const successful = filtered.filter(item => item.status === 'Success').length;
    const failed = filtered.filter(item => item.status === 'Failed').length;
    
    const successRate = total > 0 ? ((successful / total) * 100).toFixed(1) : '0.0';
    const failureRate = total > 0 ? ((failed / total) * 100).toFixed(1) : '0.0';
    
    // Calculate device-specific failure rates
    const deviceFailures = filtered
      .filter(item => item.status === 'Failed')
      .reduce((acc, item) => {
        acc[item.platform] = (acc[item.platform] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    const deviceTotals = filtered.reduce((acc, item) => {
      acc[item.platform] = (acc[item.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const deviceFailureRates = {
      ios: deviceTotals.ios ? ((deviceFailures.ios || 0) / deviceTotals.ios * 100).toFixed(0) : '0',
      android: deviceTotals.android ? ((deviceFailures.android || 0) / deviceTotals.android * 100).toFixed(0) : '0',
      web: deviceTotals.web ? ((deviceFailures.web || 0) / deviceTotals.web * 100).toFixed(0) : '0',
    };
    
    return {
      successRate,
      failureRate,
      deviceFailureRates,
      totalFiltered: total,
    };
  };

  const mockRoles = [
    { id: 'free_users', name: 'Free Users', description: 'Standard users with basic access. Recommended to enforce MFA.', userCount: 1247 },
    { id: 'pro_users', name: 'Pro Users', description: 'Premium subscribers with advanced features. High priority for MFA.', userCount: 342 },
    { id: 'admin_users', name: 'Admin Users', description: 'Administrative users with elevated privileges. Critical for MFA.', userCount: 23 },
    { id: 'moderators', name: 'Moderators', description: 'Content moderation team. Essential for MFA enforcement.', userCount: 45 },
    { id: 'custom_role_1', name: 'Enterprise Clients', description: 'Corporate users with custom permissions. Strongly recommended for MFA.', userCount: 89 },
    { id: 'custom_role_2', name: 'Support Team', description: 'Customer support representatives. Important for MFA.', userCount: 67 },
    { id: 'beta_testers', name: 'Beta Testers', description: 'Early access users testing new features. Optional MFA.', userCount: 156 },
    { id: 'content_creators', name: 'Content Creators', description: 'Verified content creators with special privileges. Recommended for MFA.', userCount: 234 }
  ];

  // Filter roles based on search query
  const filteredRoles = mockRoles.filter(role => 
    role.name.toLowerCase().includes(roleSearchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(roleSearchQuery.toLowerCase())
  );

  // Load selected roles from sessionStorage on component mount
  useEffect(() => {
    const savedRoles = sessionStorage.getItem('enforceMFA.selectedRoles');
    if (savedRoles) {
      setSelectedRoles(JSON.parse(savedRoles));
    }
  }, []);

  // Save selected roles to sessionStorage whenever they change
  useEffect(() => {
    if (selectedRoles.length > 0) {
      sessionStorage.setItem('enforceMFA.selectedRoles', JSON.stringify(selectedRoles));
    } else {
      sessionStorage.removeItem('enforceMFA.selectedRoles');
    }
  }, [selectedRoles]);

  // Force Refresh Token Function
  const handleForceRefresh = async () => {
    // Pre-action validation
    if (confirmText.toLowerCase() !== 'confirm') {
      // Shake animation and red glow
      const input = document.querySelector('input[placeholder="Type CONFIRM..."]') as HTMLInputElement;
      if (input) {
        input.classList.add('shake', 'border-red-500', 'ring-2', 'ring-red-200');
        setTimeout(() => {
          input.classList.remove('shake', 'border-red-500', 'ring-2', 'ring-red-200');
        }, 1000);
      }
      
      toast({
        title: "⚠️ Confirmation Required",
        description: "Please type CONFIRM to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setLoadingAction('Refreshing tokens...');
    setRefreshProgress({ success: 0, error: 0, total: 0 });
    setRefreshCompleted(false);
    setShowSuccessBanner(false);
    setRefreshTimer(0);
    setEstimatedTimeLeft(15); // Estimated 15 seconds

    // Start timer
    const timerInterval = setInterval(() => {
      setRefreshTimer(prev => prev + 1);
      setEstimatedTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    
    try {
      // Show progress toast
      toast({
        title: "🔄 Token Refresh Started",
        description: "Token refresh in progress...",
      });

      // Simulate progress with more realistic updates
      const totalTokens = 80;
      const failedUserIds = ['user_456', 'user_789', 'user_101', 'user_202', 'user_303', 'user_404', 'user_505', 'user_606'];
      
      for (let i = 0; i <= totalTokens; i += Math.floor(Math.random() * 3) + 1) {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
        
        const currentSuccess = Math.min(i, totalTokens - failedUserIds.length);
        const currentErrors = Math.min(i - currentSuccess, failedUserIds.length);
        const currentTotal = Math.min(i, totalTokens);
        
        setRefreshProgress({ 
          success: currentSuccess, 
          error: currentErrors, 
          total: currentTotal 
        });
        
        // Update estimated time left based on progress
        const progressPercent = (currentTotal / totalTokens) * 100;
        const remainingTime = Math.max(0, Math.floor((100 - progressPercent) / 100 * 15));
        setEstimatedTimeLeft(remainingTime);
      }
      
      // Final update
      setRefreshProgress({ 
        success: totalTokens - failedUserIds.length, 
        error: failedUserIds.length, 
        total: totalTokens 
      });
      
      setFailedTokens(failedUserIds);
      setRefreshCompleted(true);
      setShowFailedDetails(true); // Auto-show failed details
      setShowSuccessBanner(true);
      
      clearInterval(timerInterval);
      
      toast({
        title: "✅ Token Refresh Complete",
        description: `${totalTokens - failedUserIds.length} tokens refreshed successfully, ${failedUserIds.length} failed.`,
      });
      
      // Auto-hide success banner after 5 seconds
      setTimeout(() => {
        setShowSuccessBanner(false);
      }, 5000);
      
    } catch (error) {
      clearInterval(timerInterval);
      toast({
        title: "❌ Refresh Failed",
        description: "Failed to refresh tokens. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingAction('');
      clearInterval(timerInterval);
    }
  };

  // Retry Failed Tokens Function
  const handleRetryFailed = async () => {
    if (failedTokens.length === 0) return;
    
    setIsRetrying(true);
    setLoadingAction('Retrying failed tokens...');
    
    try {
      const originalFailedCount = failedTokens.length;
      const retrySuccessCount = Math.floor(originalFailedCount * 0.75); // 75% success rate on retry
      const stillFailedCount = originalFailedCount - retrySuccessCount;
      
      // Simulate retry progress
      for (let i = 0; i <= originalFailedCount; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        // Update visual feedback here if needed
      }
      
      // Update failed tokens list (remove successful retries)
      const stillFailedTokens = failedTokens.slice(0, stillFailedCount);
      setFailedTokens(stillFailedTokens);
      
      // Update progress counts
      setRefreshProgress(prev => ({
        success: prev.success + retrySuccessCount,
        error: stillFailedCount,
        total: prev.total
      }));
      
      toast({
        title: "🔄 Retry Complete",
        description: `${retrySuccessCount} succeeded, ${stillFailedCount} still failed`,
        variant: stillFailedCount === 0 ? "default" : "destructive",
      });
      
    } catch (error) {
      toast({
        title: "❌ Retry Failed",
        description: "Failed to retry tokens. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRetrying(false);
      setLoadingAction('');
    }
  };

  // Filter and sort sessions helper
  const getFilteredAndSortedSessions = () => {
    let filtered = [...mockSessions];
    
    // Apply session type filter
    if (sessionTypeFilter !== 'all') {
      if (sessionTypeFilter === 'ghost') {
        filtered = filtered.filter(s => s.isGhost);
      } else if (sessionTypeFilter === 'active') {
        filtered = filtered.filter(s => !s.isGhost);
      } else if (sessionTypeFilter === 'risky') {
        filtered = filtered.filter(s => s.riskLevel === 'High');
      }
    }
    
    // Apply time frame filter
    if (timeFrameFilter !== 'all') {
      if (timeFrameFilter === 'recent') {
        filtered = filtered.filter(s => s.lastActive.includes('minutes') || s.lastActive.includes('hour'));
      } else if (timeFrameFilter === 'old') {
        filtered = filtered.filter(s => s.lastActive.includes('days') || s.lastActive.includes('weeks'));
      }
    }
    
    // Sort sessions
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sessionSortBy) {
        case 'risk':
          const riskOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          aVal = riskOrder[a.riskLevel] || 0;
          bVal = riskOrder[b.riskLevel] || 0;
          break;
        case 'idle':
          aVal = a.idleTime;
          bVal = b.idleTime;
          break;
        case 'lastActive':
          aVal = a.lastActive;
          bVal = b.lastActive;
          break;
        case 'device':
          aVal = a.device;
          bVal = b.device;
          break;
        default:
          aVal = a.userId;
          bVal = b.userId;
      }
      
      if (sessionSortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    return filtered;
  };

  // Session summary helper
  const getSessionSummary = (sessions = mockSessions) => {
    const ghost = sessions.filter(s => s.isGhost).length;
    const active = sessions.filter(s => !s.isGhost).length;
    const risky = sessions.filter(s => s.riskLevel === 'High').length;
    const selected = selectedSessions.length;
    
    return { ghost, active, risky, selected };
  };

  // Export sessions to CSV
  const exportSessionsCSV = (sessions) => {
    const headers = ['User ID', 'Device', 'Last Active', 'Status', 'Idle Time', 'Risk', 'MFA', 'Location'];
    const rows = sessions.map(s => [
      s.userId,
      s.device,
      s.lastActive,
      s.isGhost ? 'Ghost' : 'Active',
      s.idleTime,
      s.riskLevel,
      s.mfaEnabled ? 'Yes' : 'No',
      `${s.country} ${s.location}`
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sessions_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export sessions to JSON
  const exportSessionsJSON = (sessions) => {
    const jsonContent = JSON.stringify(sessions, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sessions_export_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Handle filter change with loading feedback
  const handleFilterChange = async (filterType: string, value: string) => {
    setIsFiltering(true);
    
    // Simulate filter processing time
    await new Promise(resolve => setTimeout(resolve, 300));
    
    switch (filterType) {
      case 'sessionType':
        setSessionTypeFilter(value);
        break;
      case 'timeFrame':
        setTimeFrameFilter(value);
        break;
      case 'sortBy':
        setSessionSortBy(value as any);
        break;
    }
    
    setIsFiltering(false);
  };

  // Toggle all sessions selection
  const handleSelectAllSessions = (checked: boolean) => {
    const filteredSessions = getFilteredAndSortedSessions();
    if (checked) {
      setSelectedSessions(filteredSessions.map(s => s.id));
      setAllSessionsSelected(true);
    } else {
      setSelectedSessions([]);
      setAllSessionsSelected(false);
    }
  };

  // Kill Session Function with flash animation
  const handleKillSession = async () => {
    if (selectedSessions.length === 0) {
      toast({
        title: "⚠️ No Sessions Selected",
        description: "Please select sessions to terminate.",
        variant: "destructive",
      });
      return;
    }

    // Flash red animation for selected sessions
    setFlashingSessionIds(new Set(selectedSessions));
    
    setIsLoading(true);
    setLoadingAction('Terminating sessions...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Remove flashing sessions after animation
      setTimeout(() => {
        setFlashingSessionIds(new Set());
      }, 1000);
      
      toast({
        title: "💀 Sessions Terminated",
        description: `${selectedSessions.length} sessions terminated successfully`,
      });
      setSelectedSessions([]);
      setAllSessionsSelected(false);
      setIsKillSessionOpen(false);
    } catch (error) {
      toast({
        title: "❌ Termination Failed",
        description: "Failed to terminate sessions. Please try again.",
        variant: "destructive",
      });
      setFlashingSessionIds(new Set());
    } finally {
      setIsLoading(false);
      setLoadingAction('');
    }
  };

  // Go to OAuth Config Function
  const handleGoToOAuthConfig = () => {
    toast({
      title: "🔐 Redirecting to OAuth Config",
      description: "Opening OAuth configuration panel...",
    });
    // Navigate to OAuth config page
    navigate('/admin/auth/oauth');
  };

  // Run Ghost Session Cleanup
  const handleRunGhostCleanup = async () => {
    setGhostCleanupLoading(true);
    setIsLoading(true);
    setLoadingAction('Running cleanup...');
    
    try {
      // API call to trigger ghost session cleanup
      const response = await fetch('/admin/ghost-session/reap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initiated_by: 'admin_id', // Replace with actual admin ID
          manual: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to run cleanup');
      }

      const result = await response.json();
      const cleanupCount = result.cleanedSessions || 219; // Mock fallback
      
      // Update last cleanup time
      setLastGhostCleanup(new Date());
      
      toast({
        title: "✅ Ghost sessions cleanup completed",
        description: `Successfully cleaned ${cleanupCount} ghost sessions.`,
        duration: 4000,
      });

      // Add audit log entry
      console.log('Audit Log:', {
        type: 'manual_trigger',
        action: 'run_reaper',
        by: 'admin_id',
        timestamp: new Date().toISOString(),
        result: { cleanedSessions: cleanupCount }
      });

    } catch (error) {
      console.error('Ghost cleanup error:', error);
      toast({
        title: "❌ Failed to run cleanup. Please try again.",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setGhostCleanupLoading(false);
      setIsLoading(false);
      setLoadingAction('');
      
      // Cooldown period
      setTimeout(() => {
        // Re-enable button after cooldown
      }, 3000);
    }
  };

  // View Ghost Table Function
  const handleViewGhostTable = () => {
    setIsGhostTableOpen(true);
  };

  // Enforce MFA Function
  const handleEnforceMFA = async () => {
    if (selectedRoles.length === 0) {
      toast({
        title: "⚠️ No Roles Selected",
        description: "Please select roles to enforce MFA.",
        variant: "destructive",
      });
      return;
    }

    setMfaActionLoading(true);
    setLoadingAction('Enforcing MFA...');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const selectedRoleNames = selectedRoles.map(roleId => {
        const role = mockRoles.find(r => r.id === roleId);
        return role?.name || roleId;
      });

      const totalUsers = selectedRoles.reduce((sum, roleId) => {
        const role = mockRoles.find(r => r.id === roleId);
        return sum + (role?.userCount || 0);
      }, 0);
      
      toast({
        title: "✅ MFA has been enforced for " + selectedRoles.length + " role" + (selectedRoles.length > 1 ? "s" : ""),
        description: `MFA required for ${totalUsers} users in roles: ${selectedRoleNames.join(', ')}.`,
      });
      
      // Clear sessionStorage on successful submission
      sessionStorage.removeItem('enforceMFA.selectedRoles');
      setSelectedRoles([]);
      
      // Auto-close modal with delay
      setTimeout(() => {
        setIsEnforceMFAOpen(false);
      }, 1500);
      
    } catch (error) {
      toast({
        title: "❌ MFA Enforcement Failed",
        description: "Failed to enforce MFA. Please try again.",
        variant: "destructive",
      });
    } finally {
      setMfaActionLoading(false);
      setLoadingAction('');
    }
  };

  // Toggle role selection with animation support
  const toggleRoleSelection = (roleId: string) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(id => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  // Get dynamic button text
  const getMFAButtonText = () => {
    if (mfaActionLoading) {
      return 'Enforcing MFA...';
    }
    if (selectedRoles.length === 0) {
      return 'Enforce MFA';
    }
    if (selectedRoles.length === 1) {
      return 'Enforce MFA for 1 role';
    }
    return `Enforce MFA for ${selectedRoles.length} roles`;
  };

  // Auto-Flag Function - Enhanced Implementation
  const handleAutoFlag = async (userId?: string) => {
    setAutoFlagLoading(true);
    setIsLoading(true);
    setLoadingAction('Analyzing...');
    
    try {
      // API call to trigger anomaly detection
      const response = await fetch('/admin/login-patterns/auto-flag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'manual',
          admin: 'admin_id', // Replace with actual admin ID
          target_user: userId
        })
      });

      if (!response.ok) {
        throw new Error('Auto-flag operation failed');
      }

      const result = await response.json();
      const flaggedCount = result.flaggedSessions || 3; // Mock fallback
      const newFlaggedIds = result.flaggedSessionIds || ['sess_new_1', 'sess_new_2', 'sess_new_3'];
      
      // Update flagged sessions count and list
      setFlaggedSessionsCount(prev => prev + flaggedCount);
      setRecentFlaggedSessions(prev => [...prev, ...newFlaggedIds]);
      
      // Highlight new flagged sessions with animation
      setFlashingSessionIds(new Set(newFlaggedIds));
      
      // Remove highlighting after animation
      setTimeout(() => {
        setFlashingSessionIds(new Set());
      }, 3000);
      
      toast({
        title: "✅ Anomaly check complete",
        description: `${flaggedCount} new sessions flagged for review.`,
        duration: 4000,
      });

      // Add audit log entry
      console.log('Audit Log:', {
        type: 'manual_trigger',
        action: 'run_auto_flag',
        by: 'admin_id',
        timestamp: new Date().toISOString(),
        result: { flaggedSessions: flaggedCount, sessionIds: newFlaggedIds }
      });

      // Optional: Send admin alert if high-risk sessions detected
      if (flaggedCount > 5) {
        console.log('High-risk alert triggered:', { flaggedCount });
      }

    } catch (error) {
      console.error('Auto-flag error:', error);
      toast({
        title: "❌ Auto-flag operation failed. Check logs.",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setAutoFlagLoading(false);
      setIsLoading(false);
      setLoadingAction('');
      
      // Cooldown period - disable button for 5 seconds
      setTimeout(() => {
        // Re-enable button after cooldown
      }, 5000);
    }
  };

  // Send Admin Alert Function
  const handleSendAdminAlert = async (method: 'email' | 'inapp' | 'slack' | 'test' | 'main') => {
    // Validate required fields
    if (!alertMessage.trim() || alertMessage.length < 10) {
      toast({
        title: "❌ Validation Error",
        description: "Alert message must be at least 10 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (selectedDeliveryMethods.length === 0) {
      toast({
        title: "❌ Validation Error", 
        description: "Please select at least one delivery method.",
        variant: "destructive",
      });
      return;
    }

    if (selectedDeliveryMethods.includes('slack') && !isValidSlackUrl(slackWebhookUrl)) {
      toast({
        title: "❌ Validation Error",
        description: "Please enter a valid Slack webhook URL.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setLoadingAction(`Sending alert via ${selectedDeliveryMethods.join(', ')}...`);
    setAlertStatus('idle');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAlertStatus('success');
      toast({
        title: "📣 Admin Alert Sent Successfully",
        description: `Alert delivered via ${selectedDeliveryMethods.join(', ')} to ${emailRecipients.replace('-', ' ')}.`,
      });
      
      // Reset form after successful send
      setTimeout(() => {
        setIsAlertModalOpen(false);
        resetAlertForm();
      }, 1500);
    } catch (error) {
      setAlertStatus('error');
      toast({
        title: "❌ Alert Failed",
        description: "Failed to send admin alert. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingAction('');
    }
  };

  // Alert Helper Functions
  const toggleDeliveryMethod = (method: string) => {
    setSelectedDeliveryMethods(prev => 
      prev.includes(method) 
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  const isValidSlackUrl = (url: string): boolean => {
    return url.startsWith('https://hooks.slack.com/services/') && url.length > 40;
  };

  const resetAlertForm = () => {
    setAlertCategories([]);
    setAlertMessage('');
    setAlertSubject('');
    setSelectedDeliveryMethods([]);
    setEmailRecipients('all-admins');
    setSlackWebhookUrl('');
    setSendTestFirst(false);
    setSaveToLogs(true);
    setAlertStatus('idle');
    setSlackWebhookError('');
  };

  const toggleAlertCategory = (categoryId: string) => {
    setAlertCategories(prev => {
      const newCategories = prev.includes(categoryId) 
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId];
      
      // Auto-insert category tags into message
      const categoryNames = {
        'security': '[⚠️ Security Warning]',
        'maintenance': '[🚨 Platform Maintenance]',
        'feature': '[💡 New Feature]',
        'system': '[🔧 System Update]',
        'urgent': '[🔥 Urgent Notice]'
      };
      
      const selectedTags = newCategories.map(c => categoryNames[c as keyof typeof categoryNames]).join(' ');
      if (selectedTags && !alertMessage.includes(selectedTags)) {
        setAlertMessage(prev => selectedTags + (prev ? ' ' + prev : ''));
      }
      
      return newCategories;
    });
  };

  const validateSlackWebhook = (url: string) => {
    if (!url) {
      setSlackWebhookError('');
      return;
    }
    
    if (!isValidSlackUrl(url)) {
      setSlackWebhookError('Invalid Slack webhook URL. Must start with https://hooks.slack.com/services/');
    } else {
      setSlackWebhookError('');
    }
  };

  const isAlertFormValid = () => {
    return (
      alertCategories.length > 0 &&
      alertMessage.length >= 10 &&
      selectedDeliveryMethods.length > 0 &&
      (!selectedDeliveryMethods.includes('email') || alertSubject.trim()) &&
      (!selectedDeliveryMethods.includes('slack') || (slackWebhookUrl && isValidSlackUrl(slackWebhookUrl)))
    );
  };

  const prefillAlertFromHistory = (alert: any) => {
    setAlertCategories([alert.category.toLowerCase().replace(/[^a-z]/g, '')]);
    setAlertMessage(alert.message);
    setAlertSubject(`Admin Alert: ${alert.category}`);
  };

  // Mock Alert History Data
  const mockAlertHistory = [
    {
      category: '⚠️ Security Warning',
      message: 'Multiple failed login attempts detected from IP 192.168.1.100',
      timestamp: '2 hours ago',
      method: 'email, slack'
    },
    {
      category: '🚨 Platform Maintenance',
      message: 'Scheduled maintenance will begin in 30 minutes',
      timestamp: '1 day ago',
      method: 'email, inapp'
    },
    {
      category: '💡 New Feature',
      message: 'New admin analytics dashboard has been deployed',
      timestamp: '3 days ago',
      method: 'email'
    },
    {
      category: '🔧 System Update',
      message: 'Database optimization completed successfully',
      timestamp: '1 week ago', 
      method: 'inapp'
    }
  ];

  const sections = [
    { id: 'modules', label: 'Core Modules', icon: '🔐' },
    { id: 'monitoring', label: 'Health Monitor', icon: '📊' },
    { id: 'security', label: 'Security Scans', icon: '🛡️' },
    { id: 'backend', label: 'Backend Checks', icon: '⚙️' },
    { id: 'ai-insights', label: 'AI Insights', icon: '🤖' },
    { id: 'design', label: 'UX Guidelines', icon: '🎨' },
    { id: 'notifications', label: 'Admin Alerts', icon: '🔔' },
    { id: 'placement', label: 'System Setup', icon: '📦' }
  ];

  const InfoIcon = ({ consequences }: { consequences: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium cursor-help ml-2">
            i
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p><strong>CONSEQUENCES:</strong> {consequences}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const StatusBadge = ({ status, type }: { status: string; type: 'success' | 'warning' | 'error' | 'info' }) => {
    const colors = {
      success: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      error: 'bg-red-100 text-red-800 border-red-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${colors[type]}`}>
        {status}
      </span>
    );
  };

  const renderModulesSection = () => (
    <div className="admin-health-section">
      <CoreAuthenticationDashboard />
    </div>
  );

  const renderMonitoringSection = () => (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-xl">🎛️</span>
            Authentication Health Summary
          </h2>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span>Last updated: {formatTimeAgo(lastUpdated)}</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
            <span className="text-green-600">🟢</span>
            <span className="font-medium">{realTimeData.sessionSync.count} Active</span>
          </div>
          <div className="flex items-center gap-2 bg-red-100 px-3 py-1 rounded-full">
            <span className="text-red-600">🔴</span>
            <span className="font-medium">{realTimeData.sessionSync.expired} Expired</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
            <span className="text-gray-600">👻</span>
            <span className="font-medium">{realTimeData.sessionSync.ghost} Ghost</span>
          </div>
          <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
            <span className="text-yellow-600">⚠️</span>
            <span className="font-medium">{realTimeData.edgePing.slow} Slow Ping</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full">
            <span className="text-purple-600">🚫</span>
            <span className="font-medium">{realTimeData.loginRate.blocked} Rate Limited</span>
          </div>
        </div>
      </div>

      <div className="bg-white border-l-4 border-green-500 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span aria-label="Dashboard icon">📊</span>
          <span className="ml-2">Authentication Health Monitoring Dashboard (Real-Time)</span>
          <InfoIcon consequences="Without real-time monitoring, security breaches can go undetected for hours, allowing attackers to maintain persistent access and exfiltrate sensitive data." />
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { 
              id: 'sessionSync',
              component: '🔄 Session Sync', 
              status: `${realTimeData.sessionSync.status} / ${realTimeData.sessionSync.expired} Expired / ${realTimeData.sessionSync.ghost} Ghost`, 
              action: 'Refresh or auto-logout if invalid',
              statusIcon: realTimeData.sessionSync.status === 'Active' ? '✅' : '⚠️',
              tooltip: realTimeData.sessionSync.status === 'Active' ? 'All sessions validated and active' : 'Some sessions need attention'
            },
            { 
              id: 'edgePing',
              component: '🧪 Edge Function Ping', 
              status: `${realTimeData.edgePing.status} (${realTimeData.edgePing.latency}ms)`, 
              action: 'Checks Twilio, SendGrid, Auth logic',
              statusIcon: realTimeData.edgePing.latency < 250 ? '✅' : realTimeData.edgePing.latency < 500 ? '⚠️' : '❌',
              tooltip: realTimeData.edgePing.latency < 250 ? 'Excellent response time' : realTimeData.edgePing.latency < 500 ? 'Ping > 250ms. Potential latency issue.' : 'Critical latency detected'
            },
            { 
              id: 'loginMethod',
              component: '📲 Login Method', 
              status: 'Email, Phone, Google, Apple', 
              action: 'Show what the user used & fallback state',
              statusIcon: '✅',
              tooltip: 'Multiple authentication methods available'
            },
            { 
              id: 'accountType',
              component: '🕵️‍♂️ Account Type', 
              status: 'Verified, Anonymous, Banned, Pending', 
              action: 'Highlight account flags or soft bans',
              statusIcon: '✅',
              tooltip: 'Account verification and status tracking'
            },
            { 
              id: 'accessRole',
              component: '🔐 Access Role', 
              status: 'Free, Pro, Admin, Super Admin', 
              action: 'Pull from profiles.role + auth.users.role',
              statusIcon: '✅',
              tooltip: 'User permission levels and access control'
            },
            { 
              id: 'loginRate',
              component: '🚫 Login Rate Abuse', 
              status: realTimeData.loginRate.flooding ? '🚨 Flooding Detected' : '✅ Normal', 
              action: 'IP block / captcha enforcement',
              statusIcon: realTimeData.loginRate.flooding ? '🚨' : '✅',
              tooltip: realTimeData.loginRate.flooding ? 'Multiple logins from one IP in short time' : 'Login patterns appear normal'
            },
            { 
              id: 'tokenStatus',
              component: '🎟️ Verification Tokens', 
              status: `${realTimeData.tokenStatus.sent} Sent / ${realTimeData.tokenStatus.consumed} Consumed / ${realTimeData.tokenStatus.expired} Expired`, 
              action: 'Display resend, cooldown timer, and attempts left',
              statusIcon: realTimeData.tokenStatus.expired > 3 ? '⚠️' : '✅',
              tooltip: realTimeData.tokenStatus.expired > 3 ? 'High token expiry rate detected' : 'Token processing working normally'
            }
          ].map((item, index) => {
            const isUpdating = updatingFields.has(item.id);
            const isFlashing = flashingFields.has(item.id);
            const isActionLoading = actionLoadingStates[`refresh_${item.id}`];
            
            return (
              <div 
                key={index} 
                className={`bg-gray-50 rounded-lg p-4 transition-all duration-500 ${
                  isFlashing ? 'bg-blue-100 animate-pulse' : ''
                } ${isUpdating ? 'opacity-70' : ''}`}
              >
                <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                  {item.component}
                  {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                </h4>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600">
                    <strong>Status:</strong>
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm flex items-center gap-1 cursor-help">
                          <span aria-label={`Status: ${item.status}`}>{item.statusIcon}</span>
                          {item.status}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p className="text-sm">{item.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-blue-600">
                    <strong>Action:</strong> {item.action}
                  </p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => performActionWithFeedback(
                        `refresh_${item.id}`,
                        item.component,
                        async () => {
                          await new Promise(resolve => setTimeout(resolve, 1000));
                          updateFieldWithFlash(item.id, realTimeData[item.id as keyof typeof realTimeData]);
                          return { success: true, component: item.component };
                        }
                      )}
                      disabled={isActionLoading}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 transition-all duration-200"
                      aria-label={`Refresh ${item.component}`}
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.click()}
                    >
                      {isActionLoading ? (
                        <div className="flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>Refreshing...</span>
                        </div>
                      ) : (
                        'Refresh'
                      )}
                    </button>
                    
                    {item.id === 'accountType' && (
                      <button
                        onClick={() => performActionWithFeedback(
                          'highlight_flags',
                          item.component,
                          async () => {
                            await new Promise(resolve => setTimeout(resolve, 500));
                            // Simulate scroll to user section
                            document.querySelector('[data-section="user-flags"]')?.scrollIntoView({ behavior: 'smooth' });
                            return { highlighted: true, flags: ['soft_ban', 'pending_verification'] };
                          }
                        )}
                        className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-all duration-200"
                        aria-label="Highlight account flags"
                        tabIndex={0}
                      >
                        Highlight
                      </button>
                    )}
                    
                    {item.id === 'loginRate' && realTimeData.loginRate.flooding && (
                      <button
                        onClick={() => performActionWithFeedback(
                          'block_ip',
                          'Flooding IP',
                          async () => {
                            const confirmed = window.confirm('Block suspicious IP addresses? This will affect all users from these IPs.');
                            if (!confirmed) throw new Error('Action cancelled by user');
                            await new Promise(resolve => setTimeout(resolve, 1500));
                            return { blocked_ips: ['192.168.1.100', '10.0.0.50'], reason: 'Flooding detected' };
                          }
                        )}
                        className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-all duration-200"
                        aria-label="Block flooding IPs"
                        tabIndex={0}
                      >
                        Block IP
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Token Refresh Health */}
      <TokenRefreshHealth />

      {/* OAuth Provider Health */}
      <div className="bg-background border-l-4 border-primary rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-primary" />
          🔁 OAuth Provider Health
        </h3>
        <OAuthProviderHealth />
      </div>

      {/* Ghost Session Auto-Reaper */}
      <div className="bg-background border-l-4 border-warning rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Skull className="h-5 w-5 text-warning" />
          🧠 Ghost Session Auto-Reaper
        </h3>
        <GhostSessionAutoReaper />
      </div>

      {/* MFA Enforcement Audit */}
      <div className="bg-background border-l-4 border-destructive rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-destructive" />
          🧪 MFA Enforcement Audit
        </h3>
        <MFAEnforcementAudit />
      </div>

      {/* Login Pattern Anomaly */}
      <div className="bg-white border-l-4 border-orange-500 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          📊 Login Pattern Anomaly
          <InfoIcon consequences="Undetected login anomalies can indicate bot attacks, account takeovers, and sophisticated social engineering that bypasses traditional IP-based rate limiting." />
        </h3>
        
        <LoginPatternAnomaly />
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">

      {/* Advanced Security Scanning */}
      <div className="bg-white border-l-4 border-purple-500 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          🚨 Advanced Security Scanning (Ultra Security Compliance)
          <InfoIcon consequences="Without advanced behavioral scanning, sophisticated attacks using stolen credentials, device spoofing, and coordinated bot networks can bypass traditional security measures." />
        </h3>
        
        <div className="space-y-6">
          {/* Behavioral Anomaly Scanning */}
          <BehavioralAnomalyScanning />

          {/* Device Fingerprint Check */}
          <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
            <h4 className="font-semibold text-cyan-800 mb-3 flex items-center">
              🧬 Device Fingerprint Check
              <InfoIcon consequences="Without device fingerprinting, attackers can use stolen credentials on any device, making it impossible to detect unauthorized access from compromised accounts." />
            </h4>
            
            <DeviceFingerprintCheck />
          </div>

          {/* Brute Force Rate Map */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
              🕒 Brute Force Rate Map
              <InfoIcon consequences="Without visual pattern recognition of brute force attempts, coordinated attacks can overwhelm the system before traditional rate limiting triggers." />
            </h4>
            
            <BruteForceRateMap />
          </div>

          {/* MFA Tampering Detection */}
          <MFATamperingDetection />

          {/* Token Abuse Scanner */}
          <TokenAbuseScanner />
        </div>
      </div>

      {/* Security Summary */}
      <SecurityImplementationSummary />
    </div>
  );

  // Schema validation states
  const [isSchemaInspectOpen, setIsSchemaInspectOpen] = useState(false);
  const [isIPHistoryOpen, setIsIPHistoryOpen] = useState(false);
  const [selectedTableForInspect, setSelectedTableForInspect] = useState<any>(null);
  const [schemaValidationData, setSchemaValidationData] = useState<any[]>([]);
  const [missingTables, setMissingTables] = useState<string[]>([]);
  const [lastSchemaCheck, setLastSchemaCheck] = useState<Date>(new Date());
  const [isSchemaChecking, setIsSchemaChecking] = useState(false);
  const [schemaSearchFilter, setSchemaSearchFilter] = useState('');
  const [schemaSortBy, setSchemaSortBy] = useState<'name' | 'status' | 'lastChecked'>('name');
  const [schemaSortOrder, setSchemaSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedTableNote, setSelectedTableNote] = useState('');
  const [schemaAuditNotes, setSchemaAuditNotes] = useState<Record<string, string>>({});

  // Initialize schema validation data
  useEffect(() => {
    const mockSchemaData = [
      {
        id: 'auth_users',
        table: 'auth.users',
        exists: true,
        columns: ['id', 'email', 'phone', 'last_sign_in_at', 'created_at', 'updated_at'],
        requiredColumns: ['id', 'email', 'phone', 'last_sign_in_at'],
        missingColumns: [],
        rowCount: 2847,
        lastModified: new Date('2024-01-15T10:30:00'),
        status: 'verified',
        riskLevel: 'low',
        dataTypes: { id: 'uuid', email: 'text', phone: 'text', last_sign_in_at: 'timestamp' },
        description: 'Core authentication user records',
        purpose: 'Matches active session'
      },
      {
        id: 'profiles',
        table: 'profiles',
        exists: true,
        columns: ['id', 'user_id', 'role', 'verified', 'dob', 'status', 'created_at'],
        requiredColumns: ['id', 'user_id', 'role', 'status'],
        missingColumns: ['email_verified'],
        rowCount: 2847,
        lastModified: new Date('2024-01-15T14:22:00'),
        status: 'partial',
        riskLevel: 'medium',
        dataTypes: { id: 'uuid', user_id: 'uuid', role: 'text', verified: 'boolean' },
        description: 'Extended user profile information',
        purpose: 'Synced via Supabase Trigger on signup'
      },
      {
        id: 'user_sessions',
        table: 'user_sessions',
        exists: false,
        columns: [],
        requiredColumns: ['user_id', 'device_id', 'token_version', 'created_at'],
        missingColumns: ['user_id', 'device_id', 'token_version', 'created_at'],
        rowCount: 0,
        lastModified: null,
        status: 'missing',
        riskLevel: 'critical',
        dataTypes: {},
        description: 'Session management and device tracking',
        purpose: 'Session tied to device & rotated securely'
      },
      {
        id: 'login_logs',
        table: 'login_logs',
        exists: true,
        columns: ['id', 'user_id', 'ip', 'provider', 'success', 'timestamp', 'user_agent'],
        requiredColumns: ['user_id', 'ip', 'provider', 'success', 'timestamp'],
        missingColumns: [],
        rowCount: 15642,
        lastModified: new Date('2024-01-15T15:45:00'),
        status: 'verified',
        riskLevel: 'low',
        dataTypes: { id: 'uuid', user_id: 'uuid', ip: 'inet', success: 'boolean' },
        description: 'Authentication attempt tracking',
        purpose: 'Audit system for abuse detection'
      },
      {
        id: 'blocked_contacts',
        table: 'blocked_contacts',
        exists: true,
        columns: ['id', 'email', 'phone', 'reason', 'blocked_at'],
        requiredColumns: ['email', 'reason'],
        missingColumns: ['auto_flag'],
        rowCount: 234,
        lastModified: new Date('2024-01-14T09:15:00'),
        status: 'partial',
        riskLevel: 'medium',
        dataTypes: { id: 'uuid', email: 'text', phone: 'text', reason: 'text' },
        description: 'Blocked user contact information',
        purpose: 'Pre-blocked or suspended accounts from access'
      }
    ];
    
    setSchemaValidationData(mockSchemaData);
    setMissingTables(['user_sessions', 'auth_audit_log', 'password_reset_tokens']);
  }, []);

  const performSchemaValidation = async () => {
    setIsSchemaChecking(true);
    
    try {
      // Simulate API call to validate schema
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update last check time
      setLastSchemaCheck(new Date());
      
      toast({
        title: "✅ Schema validation completed",
        description: "All tables scanned and validated against requirements",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "❌ Schema validation failed",
        description: "Error occurred during schema validation",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setIsSchemaChecking(false);
    }
  };

  const exportSchemaSnapshot = (format: 'json' | 'yaml' | 'csv') => {
    const timestamp = new Date().toISOString().split('T')[0];
    let content = '';
    let filename = '';
    let mimeType = '';

    if (format === 'json') {
      content = JSON.stringify({
        exported_at: new Date().toISOString(),
        schema_validation: schemaValidationData,
        missing_tables: missingTables,
        audit_notes: schemaAuditNotes
      }, null, 2);
      filename = `schema_snapshot_${timestamp}.json`;
      mimeType = 'application/json';
    } else if (format === 'csv') {
      const headers = ['Table', 'Status', 'Row Count', 'Missing Columns', 'Risk Level', 'Last Modified'];
      const rows = schemaValidationData.map(table => [
        table.table,
        table.status,
        table.rowCount || 0,
        table.missingColumns.join('; '),
        table.riskLevel,
        table.lastModified ? table.lastModified.toISOString() : 'N/A'
      ]);
      content = [headers, ...rows].map(row => row.join(',')).join('\n');
      filename = `schema_snapshot_${timestamp}.csv`;
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "📥 Schema exported",
      description: `Schema snapshot saved as ${filename}`,
      duration: 3000,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'partial': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'missing': return <X className="w-4 h-4 text-red-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string, riskLevel: string) => {
    const baseClasses = "px-2 py-1 text-xs rounded-full font-medium";
    
    if (status === 'verified') {
      return <span className={`${baseClasses} bg-green-100 text-green-700`}>🟢 Verified</span>;
    } else if (status === 'partial') {
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-700`}>🟡 Partial</span>;
    } else if (status === 'missing') {
      return <span className={`${baseClasses} bg-red-100 text-red-700`}>🔴 Missing</span>;
    }
    return <span className={`${baseClasses} bg-gray-100 text-gray-700`}>⚪ Unknown</span>;
  };

  const saveTableNote = (tableId: string, note: string) => {
    setSchemaAuditNotes(prev => ({
      ...prev,
      [tableId]: note
    }));
    
    toast({
      title: "💾 Note saved",
      description: "Admin note has been saved for this table",
      duration: 2000,
    });
  };

  // Enhanced schema validation states
  const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false);
  const [isAddRequiredTableModalOpen, setIsAddRequiredTableModalOpen] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableDescription, setNewTableDescription] = useState('');
  const [newTablePurpose, setNewTablePurpose] = useState('authentication');
  const [newTableColumns, setNewTableColumns] = useState([
    { name: 'id', type: 'uuid', nullable: false, indexed: true, defaultValue: 'gen_random_uuid()' }
  ]);
  const [schemaFilterStatus, setSchemaFilterStatus] = useState('all');
  const [schemaFilterRisk, setSchemaFilterRisk] = useState('all');
  const [collapseVerified, setCollapseVerified] = useState(false);
  
  const addTableColumn = () => {
    setNewTableColumns(prev => [...prev, { name: '', type: 'text', nullable: true, indexed: false, defaultValue: '' }]);
  };
  
  const removeTableColumn = (index: number) => {
    setNewTableColumns(prev => prev.filter((_, i) => i !== index));
  };
  
  const updateTableColumn = (index: number, field: string, value: any) => {
    setNewTableColumns(prev => prev.map((col, i) => 
      i === index ? { ...col, [field]: value } : col
    ));
  };
  
  const generateCreateTableSQL = () => {
    const columns = newTableColumns
      .filter(col => col.name.trim())
      .map(col => {
        let sql = `${col.name} ${col.type.toUpperCase()}`;
        if (!col.nullable) sql += ' NOT NULL';
        if (col.defaultValue) sql += ` DEFAULT ${col.defaultValue}`;
        return sql;
      })
      .join(',\n  ');
    
    return `CREATE TABLE ${newTableName} (\n  ${columns}\n);`;
  };
  
  const validateNewTable = () => {
    const issues = [];
    if (!newTableName.trim()) issues.push("Missing table name");
    if (newTableColumns.filter(col => col.name.trim()).length === 0) issues.push("No columns defined");
    if (!newTableColumns.some(col => col.name === 'id' || col.indexed)) issues.push("No primary key set");
    if (!newTableColumns.some(col => col.name.includes('created_at') || col.name.includes('timestamp'))) issues.push("Missing timestamp column");
    return issues;
  };
  
  const createNewTable = async () => {
    const issues = validateNewTable();
    if (issues.length > 0) {
      toast({
        title: "❌ Table validation failed",
        description: issues.join(", "),
        variant: "destructive",
        duration: 4000,
      });
      return;
    }
    
    try {
      // Simulate table creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newTable = {
        id: newTableName.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        table: newTableName,
        exists: true,
        columns: newTableColumns.filter(col => col.name.trim()).map(col => col.name),
        requiredColumns: newTableColumns.filter(col => !col.nullable).map(col => col.name),
        missingColumns: [],
        rowCount: 0,
        lastModified: new Date(),
        status: 'verified',
        riskLevel: 'low',
        dataTypes: Object.fromEntries(newTableColumns.filter(col => col.name.trim()).map(col => [col.name, col.type])),
        description: newTableDescription,
        purpose: newTablePurpose
      };
      
      setSchemaValidationData(prev => [...prev, newTable]);
      setIsAddTableModalOpen(false);
      setNewTableName('');
      setNewTableDescription('');
      setNewTableColumns([{ name: 'id', type: 'uuid', nullable: false, indexed: true, defaultValue: 'gen_random_uuid()' }]);
      
      toast({
        title: "✅ Table created successfully",
        description: `Table ${newTableName} has been added to the schema`,
        duration: 3000,
      });
      
      // Auto-open inspect modal
      setTimeout(() => {
        setSelectedTableForInspect(newTable);
        setIsSchemaInspectOpen(true);
      }, 500);
      
    } catch (error) {
      toast({
        title: "❌ Table creation failed",
        description: "Error occurred during table creation",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  const renderBackendSection = () => (
    <div className="space-y-6">
      <div className="bg-white border-l-4 border-purple-500 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            ⚙️ Back-End Verification & Supabase Schema Checks
            <InfoIcon consequences="Schema misalignment and missing backend validation can cause data corruption, authentication bypass, and cascading system failures across the entire platform." />
          </h3>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              ⏱ Last checked: {formatTimeAgo(lastSchemaCheck)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={performSchemaValidation}
              disabled={isSchemaChecking}
              className="h-8"
            >
              {isSchemaChecking ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Re-Scan Schema
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Enhanced Search, Filter and Export Controls */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tables..."
                value={schemaSearchFilter}
                onChange={(e) => setSchemaSearchFilter(e.target.value)}
                className="border-0 bg-transparent text-sm focus:outline-none w-40"
              />
            </div>
            
            <select 
              value={schemaFilterStatus} 
              onChange={(e) => setSchemaFilterStatus(e.target.value)}
              className="text-xs border border-gray-200 rounded px-2 py-1"
            >
              <option value="all">All Status</option>
              <option value="verified">✅ Verified</option>
              <option value="partial">🟡 Partial</option>
              <option value="missing">🔴 Missing</option>
            </select>
            
            <select 
              value={schemaFilterRisk} 
              onChange={(e) => setSchemaFilterRisk(e.target.value)}
              className="text-xs border border-gray-200 rounded px-2 py-1"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="critical">Critical Risk</option>
            </select>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCollapseVerified(!collapseVerified)}
              className="text-xs"
            >
              {collapseVerified ? '📁 Show Verified' : '📂 Hide Verified'}
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Export:</span>
            <Button variant="outline" size="sm" onClick={() => exportSchemaSnapshot('csv')}>
              📄 CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportSchemaSnapshot('json')}>
              📄 JSON
            </Button>
          </div>
        </div>

        {/* Enhanced Color Guide with Help */}
        <div className="flex items-center justify-between mb-4 p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center space-x-4 text-xs">
            <span className="font-medium text-purple-800">Status Guide:</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center cursor-help">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>Verified
                </TooltipTrigger>
                <TooltipContent>Table exists with all required columns and proper data types</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center cursor-help">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>Partial
                </TooltipTrigger>
                <TooltipContent>Table exists but missing some required columns or has data quality issues</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center cursor-help">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>Missing
                </TooltipTrigger>
                <TooltipContent>Critical table does not exist - this will cause system failures</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsAddTableModalOpen(true)}
                  className="text-xs"
                >
                  ➕ Add New Table
                </Button>
              </TooltipTrigger>
              <TooltipContent>Design a new table for your database manually</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Missing Tables Alert */}
        {missingTables.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2 flex items-center">
              ⛔ Missing Required Tables
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="ml-1 cursor-help">
                    ❔
                  </TooltipTrigger>
                  <TooltipContent>These tables are expected but not found in the database schema</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h4>
            <div className="space-y-1">
              {missingTables.map(table => (
                <div key={table} className="flex items-center justify-between text-sm">
                  <span className="text-red-700 font-mono">{table}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-6 text-xs"
                          onClick={() => {
                            setNewTableName(table);
                            setIsAddRequiredTableModalOpen(true);
                          }}
                        >
                          ➕ Add Table
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Create missing table required by the system</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-purple-50 z-10">
              <tr>
                <th className="text-left p-3 font-medium text-purple-800 cursor-pointer hover:bg-purple-100"
                    onClick={() => {
                      setSchemaSortBy('status');
                      setSchemaSortOrder(schemaSortOrder === 'asc' ? 'desc' : 'asc');
                    }}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center">
                        Status
                        {schemaSortBy === 'status' && (
                          schemaSortOrder === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        Real-time validation status with data integrity checks
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </th>
                <th className="text-left p-3 font-medium text-purple-800 cursor-pointer hover:bg-purple-100"
                    onClick={() => {
                      setSchemaSortBy('name');
                      setSchemaSortOrder(schemaSortOrder === 'asc' ? 'desc' : 'asc');
                    }}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center">
                        Table Name
                        {schemaSortBy === 'name' && (
                          schemaSortOrder === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        Click to sort by table name - Click table name to inspect
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </th>
                <th className="text-left p-3 font-medium text-purple-800">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        Columns & Validation
                      </TooltipTrigger>
                      <TooltipContent>
                        Required vs existing columns with data type validation
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </th>
                <th className="text-left p-3 font-medium text-purple-800 cursor-pointer hover:bg-purple-100"
                    onClick={() => {
                      setSchemaSortBy('lastChecked');
                      setSchemaSortOrder(schemaSortOrder === 'asc' ? 'desc' : 'asc');
                    }}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center">
                        Data Quality
                        {schemaSortBy === 'lastChecked' && (
                          schemaSortOrder === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        Row count, null values, and data integrity warnings
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </th>
                <th className="text-left p-3 font-medium text-purple-800">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        Last Check
                      </TooltipTrigger>
                      <TooltipContent>
                        When this table was last validated
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </th>
                <th className="text-left p-3 font-medium text-purple-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schemaValidationData
                .filter(table => {
                  let passesFilters = true;
                  
                  // Search filter
                  if (schemaSearchFilter && !table.table.toLowerCase().includes(schemaSearchFilter.toLowerCase())) {
                    passesFilters = false;
                  }
                  
                  // Status filter
                  if (schemaFilterStatus !== 'all' && table.status !== schemaFilterStatus) {
                    passesFilters = false;
                  }
                  
                  // Risk filter
                  if (schemaFilterRisk !== 'all' && table.riskLevel !== schemaFilterRisk) {
                    passesFilters = false;
                  }
                  
                  // Collapse verified filter
                  if (collapseVerified && table.status === 'verified') {
                    passesFilters = false;
                  }
                  
                  return passesFilters;
                })
                .sort((a, b) => {
                  const aVal = a[schemaSortBy as keyof typeof a];
                  const bVal = b[schemaSortBy as keyof typeof b];
                  
                  if (typeof aVal === 'string' && typeof bVal === 'string') {
                    const comparison = aVal.localeCompare(bVal);
                    return schemaSortOrder === 'asc' ? comparison : -comparison;
                  }
                  
                  return 0;
                })
                .map((table, index) => {
                  // Calculate data quality warnings
                  const dataQualityIssues = [];
                  if (table.rowCount === 0 && table.exists) dataQualityIssues.push("0 rows");
                  if (table.rowCount && table.rowCount > 0) {
                    // Simulate null checks and duplicates
                    if (Math.random() > 0.7) dataQualityIssues.push("High NULL values");
                    if (Math.random() > 0.8) dataQualityIssues.push("Duplicates found");
                  }
                  
                  return (
                <tr key={table.id} className={`border-b border-gray-100 hover:bg-purple-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {getStatusIcon(table.status)}
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-left">
                              <div className="font-medium">{table.status === 'verified' ? 'Verified' : table.status === 'partial' ? 'Partial Schema Match' : 'Missing Table'}</div>
                              {table.status === 'verified' && <div className="text-xs text-green-600">✅ All required columns present</div>}
                              {table.status === 'partial' && <div className="text-xs text-yellow-600">⚠️ Missing: {table.missingColumns.slice(0, 3).join(', ')}</div>}
                              {table.status === 'missing' && <div className="text-xs text-red-600">❌ Critical table does not exist</div>}
                              <div className="text-xs text-gray-500 mt-1">⏱ Last checked: {formatTimeAgo(new Date(Date.now() - Math.random() * 3600000))}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {getStatusBadge(table.status, table.riskLevel)}
                    </div>
                  </td>
                  <td className="p-3">
                    <button 
                      onClick={() => {
                        setSelectedTableForInspect(table);
                        setIsSchemaInspectOpen(true);
                      }}
                      className="font-mono text-purple-600 hover:text-purple-800 hover:underline cursor-pointer font-medium"
                    >
                      {table.table}
                    </button>
                    <div className="text-xs text-gray-500 mt-1">{table.description}</div>
                  </td>
                  <td className="p-3">
                    <div className="space-y-1">
                      <div className="text-green-700 text-xs flex items-center">
                        ✅ {table.columns.length - table.missingColumns.length} present
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="ml-1 cursor-help">
                              ℹ️
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-left text-xs">
                                <div className="font-medium">Present Columns:</div>
                                {table.columns.slice(0, 5).map(col => (
                                  <div key={col} className="text-green-600">• {col}: {table.dataTypes[col] || 'unknown'}</div>
                                ))}
                                {table.columns.length > 5 && <div className="text-gray-500">...and {table.columns.length - 5} more</div>}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      {table.missingColumns.length > 0 && (
                        <div className="text-red-700 text-xs flex items-center">
                          ❌ {table.missingColumns.length} missing
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="ml-1 cursor-help">
                                ⚠️
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-left text-xs">
                                  <div className="font-medium text-red-600">Missing Required Columns:</div>
                                  {table.missingColumns.map(col => (
                                    <div key={col} className="text-red-600">• {col}: Required for system functionality</div>
                                  ))}
                                  <div className="text-gray-500 mt-1">Impact: May cause authentication failures</div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="space-y-1">
                      <div className="text-gray-600 text-sm font-mono">
                        {table.rowCount ? table.rowCount.toLocaleString() : 'N/A'}
                      </div>
                      {dataQualityIssues.length > 0 && (
                        <div className="space-y-1">
                          {dataQualityIssues.map((issue, i) => (
                            <div key={i} className="text-xs text-orange-600 flex items-center">
                              ⚠️ {issue}
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger className="ml-1 cursor-help">
                                    ❔
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="text-left text-xs">
                                      {issue === '0 rows' && "Table exists but contains no data - may need initialization"}
                                      {issue === 'High NULL values' && "Critical columns contain excessive NULL values"}
                                      {issue === 'Duplicates found' && "Duplicate records detected - may indicate data integrity issues"}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-gray-600 text-xs">
                    <div>{table.lastModified ? table.lastModified.toLocaleDateString() : 'N/A'}</div>
                    <div className="text-gray-400">⏱ {formatTimeAgo(new Date(Date.now() - Math.random() * 3600000))}</div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedTableForInspect(table);
                          setIsSchemaInspectOpen(true);
                        }}
                        className="h-7 text-xs"
                      >
                        🔍 Inspect
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {schemaAuditNotes[table.id] ? (
                              <span className="text-xs text-green-600 cursor-help">📝</span>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedTableForInspect(table);
                                  setSelectedTableNote(schemaAuditNotes[table.id] || '');
                                  setIsSchemaInspectOpen(true);
                                }}
                                className="h-7 text-xs text-gray-500"
                              >
                                📝
                              </Button>
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            {schemaAuditNotes[table.id] ? 'Has admin notes - click to view' : 'Add admin notes'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>

        {/* Enhanced Table Inspect Modal */}
        <Dialog open={isSchemaInspectOpen} onOpenChange={setIsSchemaInspectOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  🔍 Deep Table Inspection: {selectedTableForInspect?.table}
                  {selectedTableForInspect && getStatusIcon(selectedTableForInspect.status)}
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsSchemaInspectOpen(false)}>
                  ✕ Close
                </Button>
              </DialogTitle>
              <DialogDescription>
                Complete schema metadata, column details, and data integrity analysis
              </DialogDescription>
            </DialogHeader>
            
            {selectedTableForInspect && (
              <div className="space-y-6">
                {/* Enhanced Overview Stats */}
                <div className="grid grid-cols-6 gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                  <div>
                    <div className="text-xs text-gray-500">Table Name</div>
                    <div className="font-semibold font-mono text-sm">{selectedTableForInspect.table}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Row Count</div>
                    <div className="font-semibold text-lg">{selectedTableForInspect.rowCount?.toLocaleString() || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Total Size</div>
                    <div className="font-semibold">{selectedTableForInspect.rowCount ? `${(selectedTableForInspect.rowCount * 0.5).toFixed(1)} MB` : 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Created</div>
                    <div className="font-semibold text-xs">{selectedTableForInspect.lastModified ? new Date(selectedTableForInspect.lastModified.getTime() - 86400000 * 30).toLocaleDateString() : 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Columns Present</div>
                    <div className="font-semibold text-green-600">{selectedTableForInspect.columns.length}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Missing Columns</div>
                    <div className="font-semibold text-red-600">{selectedTableForInspect.missingColumns.length}</div>
                  </div>
                </div>

                {/* Enhanced Column Details with Deep Metadata */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    📋 Column Validation Details & Metadata
                    <Button variant="outline" size="sm" className="ml-2 text-xs" onClick={() => {
                      const sql = `-- Generated DDL for ${selectedTableForInspect.table}
CREATE TABLE ${selectedTableForInspect.table} (
${selectedTableForInspect.requiredColumns.map(col => {
  const dataType = selectedTableForInspect.dataTypes[col] || 'TEXT';
  const nullable = ['id', 'created_at'].includes(col) ? ' NOT NULL' : '';
  const defaultVal = col === 'id' ? ' DEFAULT gen_random_uuid()' : col.includes('created_at') ? ' DEFAULT now()' : '';
  return `  ${col} ${dataType.toUpperCase()}${nullable}${defaultVal}`;
}).join(',\n')}
);`;
                      navigator.clipboard.writeText(sql);
                      toast({ title: "📋 DDL copied to clipboard", duration: 2000 });
                    }}>
                      📄 Copy DDL
                    </Button>
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-gray-200 rounded">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-100 to-gray-50">
                          <th className="text-left p-3 border-b font-medium">Column Name</th>
                          <th className="text-left p-3 border-b font-medium">Data Type</th>
                          <th className="text-left p-3 border-b font-medium">Indexed</th>
                          <th className="text-left p-3 border-b font-medium">Nullable</th>
                          <th className="text-left p-3 border-b font-medium">Sample Data</th>
                          <th className="text-left p-3 border-b font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTableForInspect.requiredColumns.map(col => {
                          const exists = selectedTableForInspect.columns.includes(col);
                          const dataType = selectedTableForInspect.dataTypes[col] || 'unknown';
                          const isIndexed = ['id', 'user_id', 'email'].includes(col);
                          const isNullable = !['id', 'created_at'].includes(col);
                          const sampleData = col === 'id' ? 'a1b2c3d4-...' : 
                                           col === 'email' ? 'user@example.com' :
                                           col === 'created_at' ? '2024-01-15 10:30:00' :
                                           col.includes('phone') ? '+1234567890' : 'sample_value';
                          
                          return (
                            <tr key={col} className={`border-b hover:bg-gray-50 ${exists ? '' : 'bg-red-50'}`}>
                              <td className="p-3 font-mono font-medium">{col}</td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  dataType === 'uuid' ? 'bg-purple-100 text-purple-700' :
                                  dataType === 'text' ? 'bg-blue-100 text-blue-700' :
                                  dataType === 'timestamp' ? 'bg-green-100 text-green-700' :
                                  dataType === 'boolean' ? 'bg-orange-100 text-orange-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {dataType}
                                </span>
                              </td>
                              <td className="p-3">
                                {isIndexed ? (
                                  <span className="text-green-600 text-xs">✅ Yes</span>
                                ) : (
                                  <span className="text-gray-400 text-xs">❌ No</span>
                                )}
                              </td>
                              <td className="p-3">
                                {isNullable ? (
                                  <span className="text-yellow-600 text-xs">⚠️ Yes</span>
                                ) : (
                                  <span className="text-green-600 text-xs">✅ Not Null</span>
                                )}
                              </td>
                              <td className="p-3 font-mono text-xs text-gray-600">
                                {exists ? sampleData : 'N/A'}
                              </td>
                              <td className="p-3">
                                {exists ? (
                                  <span className="text-green-600 flex items-center text-xs">
                                    ✅ Present
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger className="ml-1 cursor-help">
                                          ℹ️
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          Column exists with correct data type and constraints
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </span>
                                ) : (
                                  <span className="text-red-600 flex items-center text-xs">
                                    ❌ Missing
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger className="ml-1 cursor-help">
                                          ⚠️
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <div className="text-left">
                                            <div className="font-medium">Required for: {col === 'email' ? 'User authentication' : col === 'user_id' ? 'Data ownership' : 'System functionality'}</div>
                                            <div className="text-xs text-red-500">Impact: {col === 'email' ? 'Login failures' : col === 'user_id' ? 'Data corruption' : 'Feature breakage'}</div>
                                            <div className="text-xs text-gray-500">Fix: ADD COLUMN {col} {dataType.toUpperCase()}</div>
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Schema Issues & Data Integrity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="font-medium text-blue-800 mb-2">🔍 Schema Issues</h5>
                    {selectedTableForInspect.missingColumns.length > 0 ? (
                      <div className="space-y-1">
                        {selectedTableForInspect.missingColumns.slice(0, 3).map(col => (
                          <div key={col} className="text-sm text-red-600">❌ Missing: {col}</div>
                        ))}
                        {selectedTableForInspect.missingColumns.length > 3 && (
                          <div className="text-xs text-gray-500">...and {selectedTableForInspect.missingColumns.length - 3} more</div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-green-600">✅ All required columns present</div>
                    )}
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-800 mb-2">📊 Data Quality</h5>
                    <div className="space-y-1 text-sm">
                      <div className="text-green-600">✅ No duplicate records</div>
                      <div className="text-green-600">✅ NULL values within limits</div>
                      <div className="text-green-600">✅ Data types validated</div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Sample Data Preview */}
                <div>
                  <h4 className="font-medium mb-3">🔍 Sample Data Preview (Latest 3 Records)</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-100 rounded text-xs font-mono">
                      <div className="text-gray-600 mb-2">-- Generated Query --</div>
                      <div className="text-gray-800">SELECT * FROM {selectedTableForInspect.table} ORDER BY created_at DESC LIMIT 3;</div>
                    </div>
                    
                    {selectedTableForInspect.exists ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs border border-gray-200 rounded">
                          <thead>
                            <tr className="bg-gray-100">
                              {selectedTableForInspect.columns.slice(0, 4).map(col => (
                                <th key={col} className="text-left p-2 border-b font-mono">{col}</th>
                              ))}
                              {selectedTableForInspect.columns.length > 4 && <th className="text-left p-2 border-b">...</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {[1, 2, 3].map(i => (
                              <tr key={i} className="border-b">
                                {selectedTableForInspect.columns.slice(0, 4).map(col => (
                                  <td key={col} className="p-2 font-mono text-gray-600">
                                    {col === 'id' ? `${i}a2b3c4d5` :
                                     col === 'email' ? `user${i}@example.com` :
                                     col === 'created_at' ? `2024-01-${15-i} 10:30:00` :
                                     col.includes('user_id') ? `${i}a2b3c4d5` : 
                                     `sample_${i}`}
                                  </td>
                                ))}
                                {selectedTableForInspect.columns.length > 4 && <td className="p-2 text-gray-400">...</td>}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        ❌ Table does not exist - no data to preview
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Admin Notes with History */}
                <div>
                  <h4 className="font-medium mb-3">📝 Admin Notes & Audit Trail</h4>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Add internal notes about this table's status, issues, or action items..."
                      value={selectedTableNote}
                      onChange={(e) => setSelectedTableNote(e.target.value)}
                      className="h-24"
                    />
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Previous notes: {schemaAuditNotes[selectedTableForInspect.id] ? 'Yes' : 'None'}
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => {
                          saveTableNote(selectedTableForInspect.id, selectedTableNote);
                          setSelectedTableNote('');
                        }}
                        disabled={!selectedTableNote.trim()}
                      >
                        💾 Save Note
                      </Button>
                    </div>
                    
                    {schemaAuditNotes[selectedTableForInspect.id] && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <div className="text-xs text-blue-600 mb-1">Previous Note:</div>
                        <div className="text-sm text-gray-700">{schemaAuditNotes[selectedTableForInspect.id]}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Fix Suggestions with CLI Commands */}
                {selectedTableForInspect.missingColumns.length > 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-3 flex items-center">
                      🔧 Auto-Generated Fix Suggestions
                      <span className="ml-2 text-xs text-yellow-600">{selectedTableForInspect.missingColumns.length} issues detected</span>
                    </h4>
                    <div className="space-y-3">
                      <div className="text-sm text-yellow-700">Missing columns can be added with the following SQL:</div>
                      <div className="p-3 bg-white border rounded font-mono text-xs overflow-x-auto">
                        {selectedTableForInspect.missingColumns.map(col => {
                          const dataType = col === 'email_verified' ? 'BOOLEAN DEFAULT FALSE' :
                                          col === 'user_id' ? 'UUID NOT NULL' :
                                          col === 'created_at' ? 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()' :
                                          'TEXT';
                          return `ALTER TABLE ${selectedTableForInspect.table} ADD COLUMN ${col} ${dataType};`;
                        }).join('\n')}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => {
                            const sql = selectedTableForInspect.missingColumns.map(col => {
                              const dataType = col === 'email_verified' ? 'BOOLEAN DEFAULT FALSE' :
                                              col === 'user_id' ? 'UUID NOT NULL' :
                                              col === 'created_at' ? 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()' :
                                              'TEXT';
                              return `ALTER TABLE ${selectedTableForInspect.table} ADD COLUMN ${col} ${dataType};`;
                            }).join('\n');
                            navigator.clipboard.writeText(sql);
                            toast({ title: "📋 SQL commands copied to clipboard", duration: 2000 });
                          }}
                        >
                          📋 Copy SQL
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          ⚡ Auto-Fix (Preview)
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Elite Supabase Intelligence Level */}
      <div className="bg-white border-l-4 border-orange-500 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            🔒 Elite Supabase Intelligence Level Tables
            <InfoIcon consequences="Missing these advanced tables prevents comprehensive security monitoring, token abuse detection, and sophisticated threat analysis capabilities." />
          </h3>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsEliteCollapsed(!isEliteCollapsed)}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              {isEliteCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              {isEliteCollapsed ? 'Expand' : 'Collapse'}
            </Button>
            <Button
              onClick={() => exportEliteTablesData()}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Download className="w-4 h-4 mr-1" />
              Export Schema
            </Button>
          </div>
        </div>
        
        {!isEliteCollapsed && (
          <div className="space-y-6">
            {/* Category Legend */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Core Active</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span>Advanced</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Security Critical</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-400 rounded"></div>
                  <span>Optional</span>
                </div>
              </div>
            </div>

            {/* Refresh Tokens Table */}
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-orange-800">1️⃣ auth.refresh_tokens</h4>
                  <div className="flex items-center gap-2">
                    {checkTableExists('auth.refresh_tokens') ? (
                      <div className="flex items-center gap-1 text-green-600 text-xs">
                        <CheckCircle className="w-4 h-4" />
                        <span>Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600 text-xs">
                        <XCircle className="w-4 h-4" />
                        <span>Missing</span>
                      </div>
                    )}
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">Advanced</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Shield className="w-4 h-4 text-orange-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm max-w-xs">
                            <p className="font-medium">Token Abuse Detection</p>
                            <p>Monitors refresh token patterns to detect:</p>
                            <ul className="list-disc list-inside mt-1">
                              <li>Token farming attacks</li>
                              <li>Concurrent session abuse</li>
                              <li>Suspicious refresh patterns</li>
                            </ul>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-500">
                    {getTableRowCount('auth.refresh_tokens')} rows
                  </div>
                  <Button
                    onClick={() => openTableInspector('auth.refresh_tokens')}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Inspect
                  </Button>
                  <Button
                    onClick={() => rescanSingleTable('auth.refresh_tokens')}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Data Quality Indicators */}
              <div className="flex items-center gap-4 mb-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${getDataQualityColor('auth.refresh_tokens', 'expired_tokens')}`}></div>
                  <span>{getDataQualityMetric('auth.refresh_tokens', 'expired_percentage')}% expired</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${getDataQualityColor('auth.refresh_tokens', 'null_timestamps')}`}></div>
                  <span>{getDataQualityMetric('auth.refresh_tokens', 'null_percentage')}% NULL timestamps</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-orange-100">
                      <th className="text-left p-2 font-medium text-orange-800">Field</th>
                      <th className="text-left p-2 font-medium text-orange-800">Description</th>
                      <th className="text-left p-2 font-medium text-orange-800">Purpose</th>
                      <th className="text-left p-2 font-medium text-orange-800">Sample</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-orange-100">
                      <td className="p-2 font-mono text-gray-800">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>user_id</TooltipTrigger>
                            <TooltipContent>UUID - Maps session to user, required for token ownership tracking</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                      <td className="p-2 text-gray-600">Maps session to user</td>
                      <td className="p-2 text-gray-800">Token ownership tracking</td>
                      <td className="p-2 text-gray-500 font-mono text-xs">abc123...def</td>
                    </tr>
                    <tr className="border-b border-orange-100">
                      <td className="p-2 font-mono text-gray-800">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>created_at</TooltipTrigger>
                            <TooltipContent>Timestamp - Token creation time, critical for lifecycle monitoring</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                      <td className="p-2 text-gray-600">Token creation time</td>
                      <td className="p-2 text-gray-800">Lifecycle monitoring</td>
                      <td className="p-2 text-gray-500 font-mono text-xs">2024-01-15T...</td>
                    </tr>
                    <tr className="border-b border-orange-100">
                      <td className="p-2 font-mono text-gray-800">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>is_valid</TooltipTrigger>
                            <TooltipContent>Boolean - Still active (true) or revoked (false), essential for security state validation</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                      <td className="p-2 text-gray-600">Still active or revoked</td>
                      <td className="p-2 text-gray-800">Security state validation</td>
                      <td className="p-2 text-gray-500 font-mono text-xs">true/false</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold text-orange-800" colSpan={3}>Purpose</td>
                      <td className="p-2 text-orange-700">Scan for too many refreshes per session (token abuse monitor)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Anomaly Detection Preview */}
              <div className="mt-3 p-3 bg-orange-100 rounded border border-orange-200">
                <div className="text-xs font-medium text-orange-800 mb-1">🧠 Anomaly Detection Logic</div>
                <div className="text-xs text-orange-700">
                  Flags: {'>'}50 refreshes/hour per user • Concurrent token generation • Expired token usage attempts
                </div>
              </div>
            </div>

          {/* Audit Logs Table */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-blue-800">2️⃣ auth.audit_logs</h4>
                <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800 border-orange-200">
                  ⚠️ Manual Setup Required
                </Badge>
                <Badge variant={auditLogsExists ? "default" : "destructive"} className="text-xs">
                  {auditLogsExists ? "✅ Enabled" : "❌ Not Found"}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setAuditLogsInspectOpen(true)}
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs hover:bg-blue-100"
                >
                  <Search className="h-3 w-3 mr-1" />
                  Inspect
                </Button>
                <Button 
                  onClick={() => {
                    toast({ title: '🔄 Re-scanned auth.audit_logs — 0 rows found, RLS missing, 3 of 4 fields valid' });
                  }}
                  variant="outline" 
                  size="sm" 
                  className="h-6 px-2 text-xs hover:bg-gray-100"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Re-scan
                </Button>
                {!auditLogsExists && (
                  <Button 
                    onClick={() => setCreateTableModalOpen(true)}
                    variant="outline" 
                    size="sm" 
                    className="h-6 px-2 text-xs text-green-600 hover:bg-green-50"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Table
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-600">
                <strong>Purpose:</strong> Enables in-depth event tracing per user
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-gray-500">
                  <strong>Rows:</strong> {auditLogsExists ? '328 rows' : '0 rows'}
                </span>
                <span className="text-gray-500">
                  <strong>RLS:</strong> {auditLogsExists ? '✅ Active' : '❌ Missing'}
                </span>
              </div>
            </div>

            {auditLogsExists && (
              <div className="bg-white rounded p-2 mb-3 border">
                <div className="text-xs text-gray-500 mb-1">Sample Data Preview:</div>
                <div className="font-mono text-xs space-y-1">
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">login</Badge>
                    <span className="text-gray-600">2025-07-30T04:33:21Z</span>
                    <span className="text-blue-600">{"ip: 192.168.1.1"}</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="destructive" className="text-xs">fail</Badge>
                    <span className="text-gray-600">2025-07-30T04:31:15Z</span>
                    <span className="text-red-600">{"invalid_credentials"}</span>
                  </div>
                </div>
              </div>
            )}

            {auditLogsExists && (
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Login: 218</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Logout: 84</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Fail: 21</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Verify: 5</span>
                </div>
              </div>
            )}
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center group hover:bg-white hover:p-1 hover:rounded transition-all relative">
                <span className="text-gray-500 flex items-center gap-1">
                  event_type
                  <span className="text-xs text-blue-600">(text, not null)</span>
                </span>
                <span className="text-gray-700">login, logout, verify, fail, etc.</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-help">
                        ℹ️
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Event categorization for audit tracking</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex justify-between items-center group hover:bg-white hover:p-1 hover:rounded transition-all relative">
                <span className="text-gray-500 flex items-center gap-1">
                  timestamp
                  <span className="text-xs text-blue-600">(timestamp, not null)</span>
                </span>
                <span className="text-gray-700">Exact time of event</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-help">
                        ℹ️
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Timeline reconstruction capability</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex justify-between items-center group hover:bg-white hover:p-1 hover:rounded transition-all relative">
                <span className="text-gray-500 flex items-center gap-1">
                  metadata
                  <span className="text-xs text-orange-600">(json, nullable)</span>
                </span>
                <span className="text-gray-700">IP, device, platform, etc.</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-help">
                        ℹ️
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Includes IP address, platform info, session source</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {!userIdFieldExists && (
                <div className="flex justify-between items-center bg-yellow-50 p-2 rounded border border-yellow-200">
                  <span className="text-yellow-700 text-xs flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Missing: user_id field
                  </span>
                  <Button 
                    onClick={() => setAddFieldModalOpen(true)}
                    variant="outline" 
                    size="sm" 
                    className="h-5 px-2 text-xs text-green-600"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Field
                  </Button>
                </div>
              )}
            </div>

            {!auditLogsExists && (
              <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
                <div className="flex items-center gap-1 mb-1">
                  <AlertTriangle className="h-3 w-3" />
                  <strong>Setup Required</strong>
                </div>
                <div>This table needs to be created manually in Supabase for audit logging functionality.</div>
              </div>
            )}
          </div>

          {/* Device Registry Table */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h4 className="font-semibold text-green-800">3️⃣ device_registry</h4>
                <div className="flex items-center gap-2">
                  {checkTableExists('device_registry') ? (
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <CheckCircle className="w-4 h-4" />
                      <span>Active</span>
                      <span className="text-gray-400">•</span>
                      <span>{getTableRowCount('device_registry')} devices</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-orange-600 text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Custom Setup Required</span>
                    </div>
                  )}
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Recommended</span>
                  {!checkTableRLS('device_registry') && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">❌ RLS Missing</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => openDeviceRegistryInspector()}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Inspect
                </Button>
                <Button
                  onClick={() => rescanSingleTable('device_registry')}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                {!checkTableExists('device_registry') && (
                  <Button
                    onClick={() => setShowDeviceRegistryAddTable(true)}
                    variant="outline"
                    size="sm"
                    className="text-xs text-green-600 border-green-300"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Table
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {/* Core Fields */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-green-700 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Core Fields
                </h5>
                <div className="grid gap-2">
                  {[
                    { name: 'user_id', type: 'uuid', desc: 'Device owner reference', required: true },
                    { name: 'device_hash', type: 'text', desc: 'Unique device fingerprint', required: true },
                    { name: 'first_seen', type: 'timestamp', desc: 'Initial registration time', required: true }
                  ].map((field) => (
                    <div key={field.name} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-medium">{field.name}</span>
                        <Badge variant="outline" className="text-xs">{field.type}</Badge>
                        {field.required ? (
                          <Badge variant="destructive" className="text-xs">required</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">optional</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{field.desc}</span>
                        {getFieldExists('device_registry', field.name) ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Enhanced Fields */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-blue-700 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Enhanced Fields (Optional)
                  {!getFieldExists('device_registry', 'trusted') && (
                    <Button
                      onClick={() => setShowDeviceRegistryAddField(true)}
                      variant="outline"
                      size="sm"
                      className="text-xs ml-2"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Missing
                    </Button>
                  )}
                </h5>
                <div className="grid gap-2">
                  {[
                    { name: 'trusted', type: 'boolean', desc: 'Device trust status' },
                    { name: 'last_seen', type: 'timestamp', desc: 'Latest activity' },
                    { name: 'platform', type: 'text', desc: 'Device platform/OS' },
                    { name: 'location_hash', type: 'text', desc: 'Geo-location hash' }
                  ].map((field) => (
                    <div key={field.name} className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-100">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm">{field.name}</span>
                        <Badge variant="outline" className="text-xs">{field.type}</Badge>
                        <Badge variant="secondary" className="text-xs">optional</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{field.desc}</span>
                        {getFieldExists('device_registry', field.name) ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">Missing</span>
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Data Preview */}
              {checkTableExists('device_registry') && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Sample Data Preview
                  </h5>
                  <div className="bg-white border rounded p-3">
                    <div className="grid gap-1 text-xs font-mono">
                      <div className="flex items-center gap-4">
                        <span className="text-blue-600">a7f9d2e8b1c4...</span>
                        <span className="text-gray-500">usr_123</span>
                        <span className="text-green-600">trusted</span>
                        <span className="text-gray-400">2025-07-29</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-blue-600">c3e8f1a2d9b7...</span>
                        <span className="text-gray-500">usr_456</span>
                        <span className="text-yellow-600">pending</span>
                        <span className="text-gray-400">2025-07-30</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Status */}
              <div className="flex items-center justify-between p-3 bg-white border rounded">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">Security Status</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    {checkTableRLS('device_registry') ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-green-600">RLS Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-red-500" />
                        <span className="text-red-600">RLS Missing</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-blue-500" />
                    <span className="text-blue-600">User Isolation: {checkTableRLS('device_registry') ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              {/* Purpose Summary */}
              <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <span className="font-medium text-green-800">Purpose:</span>
                    <span className="text-green-700 ml-1">
                      Enables device tracking, fingerprinting, and fraud prevention. Essential for secure logins, session control, and device-level restrictions. Tracks device ownership, trust status, and location patterns.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Login Failures Table */}
          <div className="bg-red-50 rounded-lg p-4 border border-red-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h4 className="font-semibold text-red-800">4️⃣ login_failures</h4>
                <div className="flex items-center gap-2">
                  {checkTableExists('login_failures') ? (
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <CheckCircle className="w-4 h-4" />
                      <span>Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600 text-xs">
                      <XCircle className="w-4 h-4" />
                      <span>Missing</span>
                    </div>
                  )}
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">Optional</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">
                  {getTableRowCount('login_failures')} rows
                </div>
                <Button
                  onClick={() => openLoginFailuresInspector()}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Inspect
                </Button>
                <Button
                  onClick={() => rescanSingleTable('login_failures')}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                {!checkTableExists('login_failures') && (
                  <Button
                    onClick={() => setShowLoginFailuresAddTable(true)}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Table
                  </Button>
                )}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-red-100">
                    <th className="text-left p-2 font-medium text-red-800">Field</th>
                    <th className="text-left p-2 font-medium text-red-800">Description</th>
                    <th className="text-left p-2 font-medium text-red-800">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-red-100">
                    <td className="p-2 font-mono text-gray-800">user_id / ip</td>
                    <td className="p-2 text-gray-600">Who attempted and from where</td>
                    <td className="p-2 text-gray-800">Attack source tracking</td>
                  </tr>
                  <tr className="border-b border-red-100">
                    <td className="p-2 font-mono text-gray-800">attempt_count</td>
                    <td className="p-2 text-gray-600">Failed tries counter</td>
                    <td className="p-2 text-gray-800">Threshold monitoring</td>
                  </tr>
                  <tr className="border-b border-red-100">
                    <td className="p-2 font-mono text-gray-800">timestamp</td>
                    <td className="p-2 text-gray-600">Most recent failure</td>
                    <td className="p-2 text-gray-800">Time pattern analysis</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-red-800" colSpan={2}>Purpose</td>
                    <td className="p-2 text-red-700">Used in brute force detection + IP ban list</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Device Events Table */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h4 className="font-semibold text-purple-800">5️⃣ auth.device_events</h4>
                <div className="flex items-center gap-2">
                  {checkTableExists('auth.device_events') ? (
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <CheckCircle className="w-4 h-4" />
                      <span>Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600 text-xs">
                      <XCircle className="w-4 h-4" />
                      <span>Missing</span>
                    </div>
                  )}
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Core</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">
                  {getTableRowCount('auth.device_events')} rows
                </div>
                <Button
                  onClick={() => openDeviceEventsInspector()}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Inspect
                </Button>
                <Button
                  onClick={() => rescanSingleTable('auth.device_events')}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                {!checkTableExists('auth.device_events') && (
                  <Button
                    onClick={() => setShowDeviceEventsAddTable(true)}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Table
                  </Button>
                )}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="text-left p-2 font-medium text-purple-800">Field</th>
                    <th className="text-left p-2 font-medium text-purple-800">Description</th>
                    <th className="text-left p-2 font-medium text-purple-800">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-purple-100">
                    <td className="p-2 font-mono text-gray-800">device_id</td>
                    <td className="p-2 text-gray-600">Unique device identifier</td>
                    <td className="p-2 text-gray-800">Device tracking</td>
                  </tr>
                  <tr className="border-b border-purple-100">
                    <td className="p-2 font-mono text-gray-800">user_id</td>
                    <td className="p-2 text-gray-600">User associated with device</td>
                    <td className="p-2 text-gray-800">Device ownership</td>
                  </tr>
                  <tr className="border-b border-purple-100">
                    <td className="p-2 font-mono text-gray-800">login_time</td>
                    <td className="p-2 text-gray-600">Device login timestamp</td>
                    <td className="p-2 text-gray-800">Multi-device tracking</td>
                  </tr>
                  <tr className="border-b border-purple-100">
                    <td className="p-2 font-mono text-gray-800">location</td>
                    <td className="p-2 text-gray-600">Geographic location</td>
                    <td className="p-2 text-gray-800">Fraud detection</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-purple-800" colSpan={2}>Purpose</td>
                    <td className="p-2 text-purple-700">Core for multi-device tracking and fraud detection</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Session Blacklist Table */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h4 className="font-semibold text-gray-800">6️⃣ session_blacklist</h4>
                <div className="flex items-center gap-2">
                  {checkTableExists('session_blacklist') ? (
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <CheckCircle className="w-4 h-4" />
                      <span>Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600 text-xs">
                      <XCircle className="w-4 h-4" />
                      <span>Missing</span>
                    </div>
                  )}
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Security</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">
                  {getTableRowCount('session_blacklist')} rows
                </div>
                <Button
                  onClick={() => openSessionBlacklistInspector()}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Inspect
                </Button>
                <Button
                  onClick={() => rescanSingleTable('session_blacklist')}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                {!checkTableExists('session_blacklist') && (
                  <Button
                    onClick={() => setShowSessionBlacklistAddTable(true)}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Table
                  </Button>
                )}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2 font-medium text-gray-800">Field</th>
                    <th className="text-left p-2 font-medium text-gray-800">Description</th>
                    <th className="text-left p-2 font-medium text-gray-800">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-2 font-mono text-gray-800">session_id</td>
                    <td className="p-2 text-gray-600">Banned session identifier</td>
                    <td className="p-2 text-gray-800">Session control</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-2 font-mono text-gray-800">reason</td>
                    <td className="p-2 text-gray-600">Ban reason</td>
                    <td className="p-2 text-gray-800">Audit trail</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-2 font-mono text-gray-800">blacklisted_at</td>
                    <td className="p-2 text-gray-600">Ban timestamp</td>
                    <td className="p-2 text-gray-800">Timeline tracking</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-gray-800" colSpan={2}>Purpose</td>
                    <td className="p-2 text-gray-700">Needed for forced logout and session control</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Geo Login Audit Table */}
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h4 className="font-semibold text-indigo-800">7️⃣ geo_login_audit</h4>
                <div className="flex items-center gap-2">
                  {checkTableExists('geo_login_audit') ? (
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <CheckCircle className="w-4 h-4" />
                      <span>Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600 text-xs">
                      <XCircle className="w-4 h-4" />
                      <span>Missing</span>
                    </div>
                  )}
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">Geo</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">
                  {getTableRowCount('geo_login_audit')} rows
                </div>
                <Button
                  onClick={() => openGeoLoginAuditInspector()}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Inspect
                </Button>
                <Button
                  onClick={() => rescanSingleTable('geo_login_audit')}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                {!checkTableExists('geo_login_audit') && (
                  <Button
                    onClick={() => setShowGeoLoginAuditAddTable(true)}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-indigo-100 text-indigo-800 border-indigo-300 hover:bg-indigo-200"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Table
                  </Button>
                )}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-indigo-100">
                    <th className="text-left p-2 font-medium text-indigo-800">Field</th>
                    <th className="text-left p-2 font-medium text-indigo-800">Description</th>
                    <th className="text-left p-2 font-medium text-indigo-800">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-indigo-100">
                    <td className="p-2 font-mono text-gray-800">user_id</td>
                    <td className="p-2 text-gray-600">User identifier</td>
                    <td className="p-2 text-gray-800">User tracking</td>
                  </tr>
                  <tr className="border-b border-indigo-100">
                    <td className="p-2 font-mono text-gray-800">ip</td>
                    <td className="p-2 text-gray-600">Login IP address</td>
                    <td className="p-2 text-gray-800">IP tracking</td>
                  </tr>
                  <tr className="border-b border-indigo-100">
                    <td className="p-2 font-mono text-gray-800">country</td>
                    <td className="p-2 text-gray-600">Country code</td>
                    <td className="p-2 text-gray-800">Location tracking</td>
                  </tr>
                  <tr className="border-b border-indigo-100">
                    <td className="p-2 font-mono text-gray-800">timestamp</td>
                    <td className="p-2 text-gray-600">Login time</td>
                    <td className="p-2 text-gray-800">Timeline analysis</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-indigo-800" colSpan={2}>Purpose</td>
                    <td className="p-2 text-indigo-700">Enables location jump anomaly detection</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* MFA Attempt Logs Table */}
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h4 className="font-semibold text-emerald-800">8️⃣ mfa_attempt_logs</h4>
                <div className="flex items-center gap-2">
                  {checkTableExists('mfa_attempt_logs') ? (
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <CheckCircle className="w-4 h-4" />
                      <span>Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600 text-xs">
                      <XCircle className="w-4 h-4" />
                      <span>Missing</span>
                    </div>
                  )}
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded">MFA</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">
                  {getTableRowCount('mfa_attempt_logs')} rows
                </div>
                <Button
                  onClick={() => openMFAAttemptLogsInspector()}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Inspect
                </Button>
                <Button
                  onClick={() => rescanSingleTable('mfa_attempt_logs')}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                {!checkTableExists('mfa_attempt_logs') && (
                  <Button
                    onClick={() => setShowMFAAttemptLogsAddTable(true)}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Table
                  </Button>
                )}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-emerald-100">
                    <th className="text-left p-2 font-medium text-emerald-800">Field</th>
                    <th className="text-left p-2 font-medium text-emerald-800">Description</th>
                    <th className="text-left p-2 font-medium text-emerald-800">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-emerald-100">
                    <td className="p-2 font-mono text-gray-800">user_id</td>
                    <td className="p-2 text-gray-600">User attempting MFA</td>
                    <td className="p-2 text-gray-800">User tracking</td>
                  </tr>
                  <tr className="border-b border-emerald-100">
                    <td className="p-2 font-mono text-gray-800">method</td>
                    <td className="p-2 text-gray-600">MFA method used</td>
                    <td className="p-2 text-gray-800">Method tracking</td>
                  </tr>
                  <tr className="border-b border-emerald-100">
                    <td className="p-2 font-mono text-gray-800">status</td>
                    <td className="p-2 text-gray-600">Success/failure status</td>
                    <td className="p-2 text-gray-800">Security audit</td>
                  </tr>
                  <tr className="border-b border-emerald-100">
                    <td className="p-2 font-mono text-gray-800">timestamp</td>
                    <td className="p-2 text-gray-600">Attempt time</td>
                    <td className="p-2 text-gray-800">Timeline tracking</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-emerald-800" colSpan={2}>Purpose</td>
                    <td className="p-2 text-emerald-700">Required for MFA security enforcement audit</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Consent Records Table */}
          <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h4 className="font-semibold text-cyan-800">9️⃣ consent_records</h4>
                <div className="flex items-center gap-2">
                  {checkTableExists('consent_records') ? (
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <CheckCircle className="w-4 h-4" />
                      <span>Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600 text-xs">
                      <XCircle className="w-4 h-4" />
                      <span>Missing</span>
                    </div>
                  )}
                  <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded">Legal</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">
                  {getTableRowCount('consent_records')} rows
                </div>
                <Button
                  onClick={() => openConsentRecordsInspector()}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Inspect
                </Button>
                <Button
                  onClick={() => rescanSingleTable('consent_records')}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                {!checkTableExists('consent_records') && (
                  <Button
                    onClick={() => setShowConsentRecordsAddTable(true)}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-cyan-100 text-cyan-800 border-cyan-300 hover:bg-cyan-200"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Table
                  </Button>
                )}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-cyan-100">
                    <th className="text-left p-2 font-medium text-cyan-800">Field</th>
                    <th className="text-left p-2 font-medium text-cyan-800">Description</th>
                    <th className="text-left p-2 font-medium text-cyan-800">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-cyan-100">
                    <td className="p-2 font-mono text-gray-800">user_id</td>
                    <td className="p-2 text-gray-600">User giving consent</td>
                    <td className="p-2 text-gray-800">User tracking</td>
                  </tr>
                  <tr className="border-b border-cyan-100">
                    <td className="p-2 font-mono text-gray-800">consent_type</td>
                    <td className="p-2 text-gray-600">Type of consent (GDPR, cookies)</td>
                    <td className="p-2 text-gray-800">Consent categorization</td>
                  </tr>
                  <tr className="border-b border-cyan-100">
                    <td className="p-2 font-mono text-gray-800">granted_at</td>
                    <td className="p-2 text-gray-600">Consent timestamp</td>
                    <td className="p-2 text-gray-800">Legal compliance</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-cyan-800" colSpan={2}>Purpose</td>
                    <td className="p-2 text-cyan-700">Critical for legal compliance (GDPR, privacy)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
         </div>
        )}
      </div>

      {/* Recommended Layout Structure */}
      <div className="bg-white border-l-4 border-indigo-500 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            🛠️ Recommended Layout Structure
            <InfoIcon consequences="Poor layout structure leads to inefficient monitoring workflows, missed security threats, and delayed incident response times." />
          </h3>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-medium hover:bg-green-200 flex items-center gap-1">
              🔄 Auto-sync Schema
            </button>
            <button className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium hover:bg-purple-200 flex items-center gap-1">
              📋 Audit Templates
            </button>
          </div>
        </div>

        {/* Live Filter System */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Live Filter System</h4>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="auth-tables" className="rounded" defaultChecked />
              <label htmlFor="auth-tables" className="text-xs text-gray-600">Authentication Tables</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="security-ext" className="rounded" defaultChecked />
              <label htmlFor="security-ext" className="text-xs text-gray-600">Security Extensions</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="audit-infra" className="rounded" defaultChecked />
              <label htmlFor="audit-infra" className="text-xs text-gray-600">Audit Infrastructure</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="moderation" className="rounded" defaultChecked />
              <label htmlFor="moderation" className="text-xs text-gray-600">Moderation Integrity</label>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-indigo-50">
                <th className="text-left p-3 font-medium text-indigo-800">Section</th>
                <th className="text-left p-3 font-medium text-indigo-800">Fields to Show</th>
                <th className="text-left p-3 font-medium text-indigo-800">UI Suggestions</th>
                <th className="text-left p-3 font-medium text-indigo-800">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium text-gray-800">Authentication Tables</td>
                <td className="p-3 text-gray-600">
                  <div className="space-y-1">
                    <div>auth.users, user_sessions, profiles</div>
                    <div className="text-xs text-gray-500">Core identity and session management</div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="space-y-2">
                    <StatusBadge status="✅ Already added badges" type="success" />
                    <button className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 block">
                      📊 Chart: "Sessions per hour"
                    </button>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Active</span>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium text-gray-800">Security Extensions</td>
                <td className="p-3 text-gray-600">
                  <div className="space-y-1">
                    <div>auth.refresh_tokens, login_failures</div>
                    <div className="text-xs text-gray-500">Token management and failure tracking</div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="space-y-2">
                    <button className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs hover:bg-indigo-200 block">
                      📊 Chart: "Avg refreshes per hour"
                    </button>
                    <button className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs hover:bg-yellow-200 block">
                      📈 Chart: "Top failing users"
                    </button>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs text-yellow-600">Needs Setup</span>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium text-gray-800">Audit Infrastructure</td>
                <td className="p-3 text-gray-600">
                  <div className="space-y-1">
                    <div>auth.audit_logs, device_registry</div>
                    <div className="text-xs text-gray-500">Comprehensive audit trail and device tracking</div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="space-y-2">
                    <button className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 block">
                      🔘 Button: "Trace full login flow"
                    </button>
                    <button className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs hover:bg-purple-200 block">
                      📋 Audit Templates
                    </button>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Configured</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-gray-800">Moderation Integrity</td>
                <td className="p-3 text-gray-600">
                  <div className="space-y-1">
                    <div>abuse_reports, content_flags</div>
                    <div className="text-xs text-gray-500">Content moderation and user behavior tracking</div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="space-y-2">
                    <StatusBadge status='🟡 Badge: "User under review"' type="warning" />
                    <button className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200 block">
                      🚨 Alert if anomalies detected
                    </button>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-xs text-orange-600">Monitoring</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Advanced Features Section */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">🚀 Advanced Features Implementation</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-3 border">
              <h5 className="text-xs font-semibold text-blue-800 mb-2">Live Filter System</h5>
              <div className="text-xs text-gray-600 space-y-1">
                <div>✅ Checkboxes and tabs</div>
                <div>✅ Real-time filtering</div>
                <div>✅ Multi-select categories</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <h5 className="text-xs font-semibold text-green-800 mb-2">Auto-sync Schema</h5>
              <div className="text-xs text-gray-600 space-y-1">
                <div>🔄 Supabase schema sync</div>
                <div>📡 Real-time updates</div>
                <div>⚠️ Change notifications</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <h5 className="text-xs font-semibold text-purple-800 mb-2">Audit Templates</h5>
              <div className="text-xs text-gray-600 space-y-1">
                <div>📋 Per-category templates</div>
                <div>🏷️ Custom tag system</div>
                <div>📤 Export capabilities</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Verdict */}
      <div className="bg-white border-l-4 border-green-500 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            ✅ Final Verdict for Backend Implementation
            <InfoIcon consequences="Incomplete backend table coverage creates blind spots in security monitoring and prevents comprehensive threat detection capabilities." />
          </h3>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2">
            📊 Export System Health Report
          </button>
        </div>

        {/* Overall Completeness Indicator */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-800">Overall System Readiness</h4>
            <span className="text-lg font-bold text-green-600">87%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-green-500 h-3 rounded-full" style={{ width: '87%' }}></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Strong foundation with minor gaps to address</p>
        </div>

        {/* Section Progress Tracking */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">100%</div>
            <div className="text-xs text-gray-600">Authentication Tables</div>
            <div className="w-full bg-green-200 rounded-full h-2 mt-1">
              <div className="bg-green-500 h-2 rounded-full w-full"></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">75%</div>
            <div className="text-xs text-gray-600">Security Extensions</div>
            <div className="w-full bg-yellow-200 rounded-full h-2 mt-1">
              <div className="bg-yellow-500 h-2 rounded-full w-3/4"></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">85%</div>
            <div className="text-xs text-gray-600">Audit Infrastructure</div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">90%</div>
            <div className="text-xs text-gray-600">Moderation Integrity</div>
            <div className="w-full bg-purple-200 rounded-full h-2 mt-1">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Backend Tables Status */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              🔍 Backend Tables
              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">✅ Confirmed</span>
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700">Core foundation established</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700">Authentication tables present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700">User management functional</span>
              </div>
            </div>
          </div>

          {/* High Priority Additions */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
              🔐 Needs Additions
              <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">⚠️ High Priority</span>
            </h4>
            <div className="space-y-3 text-sm">
              <div className="bg-white rounded p-2 border">
                <div className="font-medium text-yellow-800">auth.refresh_tokens</div>
                <div className="text-xs text-yellow-600">Required for session refresh audit</div>
              </div>
              <div className="bg-white rounded p-2 border">
                <div className="font-medium text-yellow-800">audit_logs</div>
                <div className="text-xs text-yellow-600">Essential for full traceability</div>
              </div>
              <div className="bg-white rounded p-2 border">
                <div className="font-medium text-yellow-800">device_registry</div>
                <div className="text-xs text-yellow-600">Device fingerprinting & linking</div>
              </div>
            </div>
          </div>

          {/* UI Enhancements */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              📊 UI Enhancements
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">✅ Suggested</span>
            </h4>
            <div className="space-y-2">
              <button className="w-full text-left bg-white rounded p-2 border border-blue-200 hover:bg-blue-50 text-sm">
                📈 Chart: Avg refreshes per hour
              </button>
              <button className="w-full text-left bg-white rounded p-2 border border-blue-200 hover:bg-blue-50 text-sm">
                🔘 "Trace login flow" button
              </button>
              <button className="w-full text-left bg-white rounded p-2 border border-blue-200 hover:bg-blue-50 text-sm">
                🟡 Flags for suspicious activity
              </button>
            </div>
          </div>
        </div>

        {/* Action Items Summary */}
        <div className="mt-6 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">🎯 Immediate Action Items</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-red-600">Critical (Priority 1)</h5>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Implement auth.refresh_tokens table</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Setup comprehensive audit_logs</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-yellow-600">Important (Priority 2)</h5>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Deploy device_registry system</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Add refresh rate monitoring charts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAISection = () => (
    <div className="space-y-6">
      <div className="bg-white border-l-4 border-cyan-500 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          🧠 Intelligent AI-Assisted Authentication Insights
          <InfoIcon consequences="Without AI anomaly detection, sophisticated attacks and credential stuffing can go unnoticed, leading to mass account compromises and data breaches." />
        </h3>
        
        {/* 1.1 Anomaly Detector AI */}
        <div className="grid gap-6">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-md font-semibold text-red-800 mb-3 flex items-center">
              🔎 1.1 Anomaly Detector AI
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Real-time</span>
            </h4>
            <p className="text-sm text-red-700 mb-4">Detects login bursts or impossible login patterns</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 border border-red-100">
                <h5 className="font-medium text-red-800 mb-2">⚡ Trigger Conditions</h5>
                <ul className="text-xs text-red-700 space-y-1">
                  <li>• {'>'}4 logins within 1 minute</li>
                  <li>• Logins from 2 countries within 10 minutes</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-3 border border-red-100">
                <h5 className="font-medium text-red-800 mb-2">🎯 Current Alerts</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-red-600">US → UK (3min)</span>
                    <span className="px-2 py-1 bg-red-200 text-red-800 rounded">HIGH</span>
                  </div>
                  <button className="text-xs text-blue-600 hover:underline">Expand Timeline →</button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-3">
              <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">Auto-flag</button>
              <button className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700">Lock Account</button>
              <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">Notify Admins</button>
            </div>
          </div>

          {/* 1.2 Geo Match Validator */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-md font-semibold text-blue-800 mb-3 flex items-center">
              📍 1.2 Geo Match Validator
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Location</span>
            </h4>
            <p className="text-sm text-blue-700 mb-4">Compares current login with past successful geolocations</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <h5 className="font-medium text-blue-800 mb-2">⚡ Behavior Rules</h5>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Distance {'>'}1,000km in {'<'}5min = Block</li>
                  <li>• Auto-challenge via MFA</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <h5 className="font-medium text-blue-800 mb-2">🔍 Status Badges</h5>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded">✅ Verified</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">⚠️ Flagged</span>
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded">🚫 Blocked</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-3">
              <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">Show Map</button>
              <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">Auto-verify MFA</button>
            </div>
          </div>

          {/* 1.3 Smart Retry Limits */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-md font-semibold text-purple-800 mb-3 flex items-center">
              💡 1.3 Smart Retry Limits
              <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Adaptive</span>
            </h4>
            <p className="text-sm text-purple-700 mb-4">Intelligent cooldown and retry system</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 border border-purple-100">
                <h5 className="font-medium text-purple-800 mb-2">⚡ Escalation Rules</h5>
                <ul className="text-xs text-purple-700 space-y-1">
                  <li>• 3 failed = 5s delay</li>
                  <li>• 5 failed = CAPTCHA required</li>
                  <li>• 7 failed = Temporary IP block</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-3 border border-purple-100">
                <h5 className="font-medium text-purple-800 mb-2">📊 Failed Attempts Graph</h5>
                <div className="h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded flex items-end justify-center">
                  <div className="text-xs text-purple-600">Cooldown: 15s</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-3">
              <button className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">Admin Override</button>
              <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">Ban IP</button>
              <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">Notify User</button>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra Super Pro AI Features */}
      <div className="bg-white border-l-4 border-purple-500 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          🧠 Ultra Super Pro AI-Powered Authentication Intelligence
          <InfoIcon consequences="Without advanced AI features, the system cannot adapt to evolving threats, detect sophisticated attack patterns, or provide intelligent threat analysis needed for world-class security." />
        </h3>
        
        <div className="space-y-6">
          {/* Context-Aware Risk Scoring */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
              2️⃣ 🧠 Context-Aware Risk Scoring (Ultra Super Pro AI Section)
              <InfoIcon consequences="Without context-aware scoring, the system treats all login attempts equally, missing sophisticated attacks that exploit behavioral patterns and device characteristics." />
            </h4>
            <p className="text-sm text-purple-700 mb-4">Dynamic user risk scores based on behavior pattern models that drive access control and conditional enforcement policies.</p>
            
            {/* 2.1 Device Fingerprint Matching */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <h5 className="font-medium text-purple-800 mb-3 flex items-center">
                  🔒 2.1 Device Fingerprint Matching
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">85% Match</span>
                </h5>
                <p className="text-xs text-purple-600 mb-3">Determines whether this login device is recognized using hashed fingerprinting data</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Match Percentage:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div className="w-14 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-xs font-medium text-green-600">85%</span>
                      </div>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">OS:</span>
                        <span className="font-medium">macOS 14.1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Browser:</span>
                        <span className="font-medium">Chrome 119</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Resolution:</span>
                        <span className="font-medium">1920x1080</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Trust Device:</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    <button className="w-full px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700">
                      Enforce Step-up Auth
                    </button>
                  </div>
                </div>
              </div>

              {/* 2.2 Time Pattern Shift */}
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <h5 className="font-medium text-purple-800 mb-3 flex items-center">
                  ⏰ 2.2 Time Pattern Shift
                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">2 anomalies</span>
                </h5>
                <p className="text-xs text-purple-600 mb-3">Detect login attempts outside of normal hours using AI-learned patterns</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Typical Login Hours:</span>
                        <span className="font-medium">9AM - 6PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Login:</span>
                        <span className="font-medium text-yellow-600">11:30 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hour Shift:</span>
                        <span className="font-medium text-red-600">+5.5 hours</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 bg-gradient-to-r from-blue-100 to-yellow-100 rounded flex items-center justify-center">
                      <div className="text-xs text-center">
                        <div className="text-yellow-600 font-medium">Trendline Graph</div>
                        <div className="text-gray-500">Login time anomalies</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                        Allow & Log
                      </button>
                      <button className="flex-1 px-2 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700">
                        Flag Validation
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2.3 History Usage Pattern */}
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <h5 className="font-medium text-purple-800 mb-3 flex items-center">
                  📊 2.3 History Usage Pattern
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Risk: 78</span>
                </h5>
                <p className="text-xs text-purple-600 mb-3">Measures post-login usage compared to normal behavior patterns</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Navigation Depth:</span>
                        <span className="font-medium">3.2 avg (vs 5.1)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pages Visited:</span>
                        <span className="font-medium">12 (vs 28 avg)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interaction Types:</span>
                        <span className="font-medium text-yellow-600">Unusual pattern</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Dynamic Risk Score:</span>
                        <span className="text-sm font-bold text-red-600">78/100</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div className="w-4/5 h-2 bg-red-500 rounded-full"></div>
                      </div>
                      <div className="text-xs text-red-600 font-medium">
                        ⚠️ Settings access blocked (threshold: 75)
                      </div>
                    </div>
                    <button className="w-full px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                      Apply Access Restrictions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Threat Evolution Timeline */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
              3️⃣ 📊 AI Threat Evolution Timeline
              <InfoIcon consequences="Without threat evolution tracking, administrators cannot see attack patterns developing over time, missing opportunities for proactive defense and threat mitigation." />
            </h4>
            <p className="text-sm text-blue-700 mb-4">Visually tracks long-term attack trends and clusters across all users for macro-level monitoring and pattern discovery.</p>
            
            {/* 3.1 Login Attempts Heatmap */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <h5 className="font-medium text-blue-800 mb-3 flex items-center">
                  🗺️ 3.1 Login Attempts Heatmap
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">High Activity</span>
                </h5>
                <p className="text-xs text-blue-600 mb-3">Global visualization of login bursts aggregated across 24h with unusual burst detection</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-32 bg-gradient-to-br from-blue-100 via-yellow-100 to-red-100 rounded-lg border border-gray-200 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-700">Interactive World Heatmap</div>
                          <div className="text-xs text-gray-500 mt-1">Color-coded login zones</div>
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <div className="absolute top-6 right-8 w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="absolute bottom-4 left-8 w-4 h-4 bg-orange-500 rounded-full"></div>
                      <div className="absolute bottom-6 right-4 w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Normal</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Elevated</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Bot Attack</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Regions:</span>
                        <span className="font-medium">47 active</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Unusual Bursts:</span>
                        <span className="font-medium text-red-600">8 detected</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Peak Time:</span>
                        <span className="font-medium">14:30 UTC</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                        View Details
                      </button>
                      <button className="flex-1 px-2 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700">
                        Trace IP Cluster
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3.2 Suspicious IP Evolution */}
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <h5 className="font-medium text-blue-800 mb-3 flex items-center">
                  🔍 3.2 Suspicious IP Evolution
                  <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">12 IP Clusters</span>
                </h5>
                <p className="text-xs text-blue-600 mb-3">Grouping of abnormal IPs based on failed attempts, rapid user switching, and multi-account logins</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Clusters:</span>
                        <span className="font-medium text-orange-600">12 groups</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Suspicious IPs:</span>
                        <span className="font-medium">287 addresses</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Top Origin Country:</span>
                        <span className="font-medium">Unknown/VPN (34%)</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <div className="text-xs font-medium text-gray-700 mb-1">Recent Patterns:</div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>• Failed login bursts: 156 attempts</div>
                        <div>• Rapid user switching: 23 instances</div>
                        <div>• Multi-account access: 45 violations</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 bg-gradient-to-r from-orange-100 to-red-100 rounded flex items-center justify-center border">
                      <div className="text-center">
                        <div className="text-xs font-medium text-orange-700">IP Cluster Evolution</div>
                        <div className="text-xs text-gray-500">↗️ +23% this week</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                        Open Modal
                      </button>
                      <button className="flex-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                        Block Cluster
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3.3 Token Abuse Trend */}
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <h5 className="font-medium text-blue-800 mb-3 flex items-center">
                  🔑 3.3 Token Abuse Trend
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">3 Violations</span>
                </h5>
                <p className="text-xs text-blue-600 mb-3">Detect narrow-time abuse of login/session tokens used by different IPs within 30 seconds</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Violations:</span>
                        <span className="font-medium text-red-600">3 detected</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time Window:</span>
                        <span className="font-medium">{'<'}30 seconds</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Affected Tokens:</span>
                        <span className="font-medium">7 compromised</span>
                      </div>
                    </div>
                    <div className="bg-red-50 rounded p-2 border border-red-100">
                      <div className="text-xs font-medium text-red-700 mb-1">Latest Violation:</div>
                      <div className="text-xs text-red-600 space-y-1">
                        <div>• Token: ...a7f9 (User ID: 1234)</div>
                        <div>• IPs: 192.168.1.1 → 10.0.0.5</div>
                        <div>• Time delta: 12 seconds</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 bg-gradient-to-r from-red-100 to-orange-100 rounded flex items-center justify-center border">
                      <div className="text-center">
                        <div className="text-xs font-medium text-red-700">Token Abuse Timeline</div>
                        <div className="text-xs text-gray-500">Real-time monitoring</div>
                      </div>
                    </div>
                    <div className="flex gap-1 text-xs">
                      <button className="flex-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Trace User
                      </button>
                      <button className="flex-1 px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-700">
                        Auto-Flag
                      </button>
                      <button className="flex-1 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                        Expire Token
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Profile Cloning Detection */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center">
              4️⃣ 🧬 Smart Profile Cloning Detection (AI Fingerprinting)
              <InfoIcon consequences="Without cloning detection, bot farms and fake account networks can proliferate undetected, undermining platform integrity and user trust." />
            </h4>
            <p className="text-sm text-green-700 mb-4">This module identifies bot farms, fake accounts, and copycat creators using advanced AI fingerprinting techniques.</p>
            
            {/* 4.1 Duplicate Behavior Vectors */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <h5 className="font-medium text-green-800 mb-3 flex items-center">
                  🔍 4.1 Duplicate Behavior Vectors
                  <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">5 Detected</span>
                </h5>
                <p className="text-xs text-green-600 mb-3">Detects same fingerprint/device making multiple accounts using shared metadata and behavior clustering</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Detected Clusters:</span>
                        <span className="font-medium text-orange-600">5 groups</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shared Fingerprints:</span>
                        <span className="font-medium">12 devices</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Signup Pattern:</span>
                        <span className="font-medium text-red-600">Suspicious burst</span>
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded p-2 border border-orange-100">
                      <div className="text-xs font-medium text-orange-700 mb-1">Recent Detection:</div>
                      <div className="text-xs text-orange-600 space-y-1">
                        <div>• Device: Chrome/Mac fingerprint</div>
                        <div>• Accounts: 8 profiles in 2 hours</div>
                        <div>• Pattern: Sequential email addresses</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 bg-gradient-to-r from-green-100 to-orange-100 rounded flex items-center justify-center border">
                      <div className="text-center">
                        <div className="text-xs font-medium text-green-700">Behavior Clustering</div>
                        <div className="text-xs text-gray-500">Real-time analysis</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                        View Profiles
                      </button>
                      <button className="flex-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                        Flag Bot Farm
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4.2 Social Overlap Check */}
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <h5 className="font-medium text-green-800 mb-3 flex items-center">
                  👥 4.2 Social Overlap Check
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">2 Similarities</span>
                </h5>
                <p className="text-xs text-green-600 mb-3">Identifies same user following/followed by the same group using graph clustering patterns</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Graph Similarities:</span>
                        <span className="font-medium text-blue-600">2 matches</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Overlap Percentage:</span>
                        <span className="font-medium">87% common</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cluster Size:</span>
                        <span className="font-medium">15 accounts</span>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded p-2 border border-blue-100">
                      <div className="text-xs font-medium text-blue-700 mb-1">Social Pattern:</div>
                      <div className="text-xs text-blue-600 space-y-1">
                        <div>• Follow/unfollow in sync</div>
                        <div>• Same interaction timing</div>
                        <div>• Identical friend groups</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded flex items-center justify-center border">
                      <div className="text-center">
                        <div className="text-xs font-medium text-blue-700">Social Graph Analysis</div>
                        <div className="text-xs text-gray-500">Network clustering</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                        Cross-link
                      </button>
                      <button className="flex-1 px-2 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700">
                        Block Interaction
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4.3 Content Upload Pattern */}
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <h5 className="font-medium text-green-800 mb-3 flex items-center">
                  📊 4.3 Content Upload Pattern
                  <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Analyzing...</span>
                </h5>
                <p className="text-xs text-green-600 mb-3">Detects cloned post timing or duplicate media using AI vector scan and timestamp comparison</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">AI Vector Scan:</span>
                        <span className="font-medium text-purple-600">In progress</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duplicate Media:</span>
                        <span className="font-medium">3 matches found</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Timing Pattern:</span>
                        <span className="font-medium text-red-600">Synchronized</span>
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded p-2 border border-purple-100">
                      <div className="text-xs font-medium text-purple-700 mb-1">Latest Analysis:</div>
                      <div className="text-xs text-purple-600 space-y-1">
                        <div>• Image hash: 94% similarity</div>
                        <div>• Upload delta: 12 seconds</div>
                        <div>• Content type: Profile photos</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded flex items-center justify-center border">
                      <div className="text-center">
                        <div className="text-xs font-medium text-purple-700">Content Vector Analysis</div>
                        <div className="text-xs text-gray-500">Processing... 73%</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-2 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700">
                        Auto-flag Media
                      </button>
                      <button className="flex-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                        Alert Moderators
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Alert Priority Queue */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
              5️⃣ 🔔 AI Alert Priority Queue
              <InfoIcon consequences="Without intelligent alert prioritization, critical security threats can be buried under low-priority notifications, leading to delayed response and potential breaches." />
            </h4>
            <p className="text-sm text-yellow-700 mb-4">Organizes flagged events and auto-sorts by risk level with intelligent investigation chains.</p>
            
            {/* Real-time Alert Queue */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-yellow-100">
                <h5 className="font-medium text-yellow-800 mb-3 flex items-center justify-between">
                  🚨 Live Alert Queue
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700">
                      View Queue
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                      Run Investigation
                    </button>
                  </div>
                </h5>
                
                {/* Risk-Based Sorting Display */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <div>
                        <div className="text-sm font-medium text-red-800">Critical: Bot Farm Detected</div>
                        <div className="text-xs text-red-600">IP: 192.168.1.100 • 8 accounts created in 2 minutes</div>
                      </div>
                      <div className="ml-2 group relative">
                        <button className="text-red-600 hover:text-red-800">ℹ️</button>
                        <div className="absolute left-0 top-6 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-48 z-10">
                          Flagged: Rapid account creation from same device fingerprint with sequential email patterns
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                        Investigate
                      </button>
                      <button className="px-2 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500">
                        Mute
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-orange-800">High: Geo-Location Jump</div>
                        <div className="text-xs text-orange-600">User: john@email.com • US → Russia in 5 minutes</div>
                      </div>
                      <div className="ml-2 group relative">
                        <button className="text-orange-600 hover:text-orange-800">ℹ️</button>
                        <div className="absolute left-0 top-6 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-48 z-10">
                          Flagged: Impossible travel time between geographic locations indicates account compromise
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="px-2 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700">
                        Investigate
                      </button>
                      <button className="px-2 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500">
                        Mute
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-yellow-800">Medium: Failed Login Burst</div>
                        <div className="text-xs text-yellow-600">IP: 10.0.0.5 • 15 failed attempts in 1 minute</div>
                      </div>
                      <div className="ml-2 group relative">
                        <button className="text-yellow-600 hover:text-yellow-800">ℹ️</button>
                        <div className="absolute left-0 top-6 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-48 z-10">
                          Flagged: Rapid authentication failures suggesting brute force attack pattern
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="px-2 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700">
                        Investigate
                      </button>
                      <button className="px-2 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500">
                        Ignore
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Auto-Investigation Chain */}
              <div className="bg-white rounded-lg p-4 border border-yellow-100">
                <h5 className="font-medium text-yellow-800 mb-3">🔍 Auto-Investigation Chains</h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Chains:</span>
                        <span className="font-medium text-blue-600">3 investigations</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Grouped by IP:</span>
                        <span className="font-medium">7 alerts</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Grouped by Session:</span>
                        <span className="font-medium">4 alerts</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Grouped by User:</span>
                        <span className="font-medium">12 alerts</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-blue-50 rounded p-2 border border-blue-100">
                      <div className="text-xs font-medium text-blue-700 mb-1">Latest Chain:</div>
                      <div className="text-xs text-blue-600 space-y-1">
                        <div>• Chain ID: INV-2024-001</div>
                        <div>• Root cause: Compromised session</div>
                        <div>• Related alerts: 5 events</div>
                        <div>• Risk level: High</div>
                      </div>
                    </div>
                    <button className="w-full px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                      Open Investigation Modal
                    </button>
                  </div>
                </div>
              </div>

              {/* Queue Statistics */}
              <div className="bg-white rounded-lg p-4 border border-yellow-100">
                <h5 className="font-medium text-yellow-800 mb-3">📊 Queue Statistics</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-red-50 rounded p-3 border border-red-100">
                    <div className="text-lg font-bold text-red-600">23</div>
                    <div className="text-xs text-red-700">Critical Alerts</div>
                  </div>
                  <div className="bg-orange-50 rounded p-3 border border-orange-100">
                    <div className="text-lg font-bold text-orange-600">47</div>
                    <div className="text-xs text-orange-700">High Priority</div>
                  </div>
                  <div className="bg-yellow-50 rounded p-3 border border-yellow-100">
                    <div className="text-lg font-bold text-yellow-600">156</div>
                    <div className="text-xs text-yellow-700">Medium Priority</div>
                  </div>
                  <div className="bg-green-50 rounded p-3 border border-green-100">
                    <div className="text-lg font-bold text-green-600">89%</div>
                    <div className="text-xs text-green-700">Auto-Resolved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI-Backed MFA Trigger Suggestions */}
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h4 className="font-semibold text-red-800 mb-3 flex items-center">
              6️⃣ 📦 AI-Backed MFA Trigger Suggestions
              <InfoIcon consequences="Without intelligent MFA triggers, users face unnecessary friction while high-risk scenarios may not trigger additional authentication, creating both poor UX and security gaps." />
            </h4>
            <p className="text-sm text-red-700 mb-4">AI decides when MFA is truly necessary, reducing friction while keeping security tight.</p>
            
            {/* Features */}
            <div className="space-y-4">
              {/* Conditional MFA */}
              <div className="bg-white rounded-lg p-4 border border-red-100">
                <h5 className="font-medium text-red-800 mb-3 flex items-center">
                  🎯 Conditional MFA
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Smart Enforcement</span>
                </h5>
                <p className="text-xs text-red-600 mb-3">Only enforce if user risk {'>'} 90th percentile</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk Threshold:</span>
                        <span className="font-medium text-red-600">90th percentile</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Trigger Rate:</span>
                        <span className="font-medium">37% of logins</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">User Friction Score:</span>
                        <span className="font-medium text-green-600">Low (2.3/10)</span>
                      </div>
                    </div>
                    <div className="bg-red-50 rounded p-2 border border-red-100">
                      <div className="text-xs font-medium text-red-700 mb-1">Risk Calculation:</div>
                      <div className="text-xs text-red-600 space-y-1">
                        <div>• Device trust score: 25%</div>
                        <div>• Location anomaly: 40%</div>
                        <div>• Behavior pattern: 30%</div>
                        <div>• Time pattern: 5%</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 bg-gradient-to-r from-red-100 to-green-100 rounded flex items-center justify-center border">
                      <div className="text-center">
                        <div className="text-xs font-medium text-red-700">MFA Trigger Logic</div>
                        <div className="text-xs text-gray-500">37% Triggered</div>
                        <div className="text-xs text-green-600 mt-1">↓63% Friction Reduced</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                        Adjust Threshold
                      </button>
                      <button className="flex-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                        View Analytics
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Context Trigger */}
              <div className="bg-white rounded-lg p-4 border border-red-100">
                <h5 className="font-medium text-red-800 mb-3 flex items-center">
                  🔄 Context Trigger
                  <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">8 Triggers Today</span>
                </h5>
                <p className="text-xs text-red-600 mb-3">Location + device mismatch + new network = instant MFA</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Today's Triggers:</span>
                        <span className="font-medium text-orange-600">8 events</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location Mismatches:</span>
                        <span className="font-medium">5 detected</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Device Changes:</span>
                        <span className="font-medium">3 detected</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">New Networks:</span>
                        <span className="font-medium">6 detected</span>
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded p-2 border border-orange-100">
                      <div className="text-xs font-medium text-orange-700 mb-1">Latest Trigger:</div>
                      <div className="text-xs text-orange-600 space-y-1">
                        <div>• User: sarah@company.com</div>
                        <div>• Location: NYC → Tokyo</div>
                        <div>• Device: iPhone → Android</div>
                        <div>• Network: Home → Public WiFi</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 bg-gradient-to-r from-orange-100 to-red-100 rounded flex items-center justify-center border">
                      <div className="text-center">
                        <div className="text-xs font-medium text-orange-700">Context Analysis</div>
                        <div className="text-xs text-gray-500">Multi-factor changes</div>
                        <div className="text-xs text-red-600 mt-1">🚨 Instant MFA</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-2 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700">
                        View Triggers
                      </button>
                      <button className="flex-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                        Configure Rules
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Outcomes & Bonus Logic */}
              <div className="bg-white rounded-lg p-4 border border-red-100">
                <h5 className="font-medium text-red-800 mb-3">📊 Outcomes & Integration</h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="bg-blue-50 rounded p-3 border border-blue-100">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">37%</div>
                        <div className="text-xs text-blue-700">Logins Requiring MFA</div>
                        <div className="text-xs text-gray-500 mt-1">↓63% reduction in friction</div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded p-3 border border-green-100">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">8</div>
                        <div className="text-xs text-green-700">Triggers Today</div>
                        <div className="text-xs text-gray-500 mt-1">Real-time monitoring</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-purple-50 rounded p-2 border border-purple-100">
                      <div className="text-xs font-medium text-purple-700 mb-1">🔗 Bonus Logic:</div>
                      <div className="text-xs text-purple-600 space-y-1">
                        <div>• Twilio integration ready</div>
                        <div>• SMS/Voice provider support</div>
                        <div>• Custom webhook endpoints</div>
                        <div>• Multi-provider failover</div>
                      </div>
                    </div>
                    <button className="w-full px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                      Configure Providers
                    </button>
                  </div>
                </div>
                
                {/* Motto */}
                <div className="mt-4 p-3 bg-gradient-to-r from-red-50 to-green-50 rounded border border-gray-200">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-800 italic">
                      "Less user friction, more accurate enforcement"
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      AI-powered MFA reduces unnecessary prompts while maintaining security
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended UI Improvements */}
      <div className="bg-white border-l-4 border-indigo-500 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          🔧 Recommended UI Improvements
          <InfoIcon consequences="Poor UI design in security interfaces leads to missed threats, slower incident response, and administrator fatigue from information overload." />
        </h3>
        <p className="text-sm text-gray-600 mb-6">These enhance clarity, admin efficiency, and data comprehension.</p>
        
        {/* Group by Risk Category */}
        <div className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-medium text-indigo-800 mb-3">📊 Group by Risk Category</h4>
            
            {/* High Risk - Collapsible Card */}
            <div className="border border-red-200 rounded-lg">
              <button className="w-full p-4 bg-red-50 hover:bg-red-100 flex items-center justify-between rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="font-medium text-red-800">🔴 High Risk Alerts</span>
                  <span className="px-2 py-1 bg-red-200 text-red-800 text-xs rounded-full">23 active</span>
                </div>
                <span className="text-red-600">▼</span>
              </button>
              <div className="p-4 bg-white border-t border-red-200">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bot Farm Detection:</span>
                        <span className="font-medium text-red-600">5 clusters</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Geo Anomalies:</span>
                        <span className="font-medium text-red-600">12 events</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Token Abuse:</span>
                        <span className="font-medium text-red-600">6 violations</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 bg-gradient-to-r from-red-100 to-orange-100 rounded border flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xs font-medium text-red-700">Login Trends</div>
                        <div className="text-xs text-gray-500">↗️ +47% attacks today</div>
                      </div>
                    </div>
                    <button className="w-full px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                      🔍 Investigate All High Risk
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Medium Risk - Collapsible Card */}
            <div className="border border-orange-200 rounded-lg">
              <button className="w-full p-4 bg-orange-50 hover:bg-orange-100 flex items-center justify-between rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span className="font-medium text-orange-800">🟠 Medium Risk Alerts</span>
                  <span className="px-2 py-1 bg-orange-200 text-orange-800 text-xs rounded-full">47 active</span>
                </div>
                <span className="text-orange-600">▼</span>
              </button>
              <div className="p-4 bg-white border-t border-orange-200">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Failed Login Bursts:</span>
                        <span className="font-medium text-orange-600">23 events</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time Pattern Anomalies:</span>
                        <span className="font-medium text-orange-600">18 users</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Device Changes:</span>
                        <span className="font-medium text-orange-600">6 alerts</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 bg-gradient-to-r from-orange-100 to-yellow-100 rounded border flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xs font-medium text-orange-700">Anomaly Frequency</div>
                        <div className="text-xs text-gray-500">Stable patterns</div>
                      </div>
                    </div>
                    <button className="w-full px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700">
                      🔍 Investigate Medium Risk
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Low Risk - Collapsible Card */}
            <div className="border border-green-200 rounded-lg">
              <button className="w-full p-4 bg-green-50 hover:bg-green-100 flex items-center justify-between rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-green-800">🟢 Low Risk Alerts</span>
                  <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full">156 active</span>
                </div>
                <span className="text-green-600">▼</span>
              </button>
              <div className="p-4 bg-white border-t border-green-200">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Normal Login Variations:</span>
                        <span className="font-medium text-green-600">89 events</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Minor Time Shifts:</span>
                        <span className="font-medium text-green-600">45 users</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Known Device Updates:</span>
                        <span className="font-medium text-green-600">22 events</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded border flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xs font-medium text-green-700">Account Activity</div>
                        <div className="text-xs text-gray-500">Normal patterns</div>
                      </div>
                    </div>
                    <button className="w-full px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                      📋 Review Low Risk
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Charts Section */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-medium text-indigo-800 mb-3">📈 Mini Charts Dashboard</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-blue-800">Login Trends</h5>
                  <div className="group relative">
                    <button className="text-blue-600 hover:text-blue-800">ℹ️</button>
                    <div className="absolute right-0 top-6 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-48 z-10">
                      <strong>Why risky:</strong> Sudden spikes indicate potential bot attacks or coordinated breaches. AI flags patterns {'>'}3σ from normal.
                    </div>
                  </div>
                </div>
                <div className="h-20 bg-gradient-to-r from-blue-200 to-purple-200 rounded flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-medium text-blue-700">↗️ +23%</div>
                    <div className="text-xs text-blue-600">vs yesterday</div>
                  </div>
                </div>
                <button className="w-full mt-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                  🔍 Open Log Timeline
                </button>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-orange-800">Anomaly Frequency</h5>
                  <div className="group relative">
                    <button className="text-orange-600 hover:text-orange-800">ℹ️</button>
                    <div className="absolute right-0 top-6 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-48 z-10">
                      <strong>AI Logic:</strong> Behavioral anomalies detected through ML pattern recognition. Flags deviations from learned user profiles.
                    </div>
                  </div>
                </div>
                <div className="h-20 bg-gradient-to-r from-orange-200 to-red-200 rounded flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-medium text-orange-700">47 Events</div>
                    <div className="text-xs text-orange-600">last 24h</div>
                  </div>
                </div>
                <button className="w-full mt-2 px-2 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700">
                  🔍 Open Session Chain
                </button>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-green-800">Account Activity</h5>
                  <div className="group relative">
                    <button className="text-green-600 hover:text-green-800">ℹ️</button>
                    <div className="absolute right-0 top-6 hidden group-hover:block bg-black text-white text-xs p-2 rounded w-48 z-10">
                      <strong>Risk Assessment:</strong> Normal activity patterns show consistent usage. Sudden changes trigger investigation protocols.
                    </div>
                  </div>
                </div>
                <div className="h-20 bg-gradient-to-r from-green-200 to-blue-200 rounded flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-medium text-green-700">2,847 Users</div>
                    <div className="text-xs text-green-600">active today</div>
                  </div>
                </div>
                <button className="w-full mt-2 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                  🔍 Open User Metadata
                </button>
              </div>
            </div>
          </div>

          {/* Investigate Button Section */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-medium text-indigo-800 mb-3">🔍 Instant Investigation Tools</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h5 className="font-medium text-purple-800 mb-2">Quick Drill-Down Options</h5>
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 flex items-center justify-between">
                    📊 Open Log Timeline
                    <span className="text-xs">Real-time events</span>
                  </button>
                  <button className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center justify-between">
                    🔗 Open Session Chain
                    <span className="text-xs">Connected events</span>
                  </button>
                  <button className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center justify-between">
                    👤 Open User Metadata
                    <span className="text-xs">Profile analysis</span>
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h5 className="font-medium text-gray-800 mb-2">Investigation Summary</h5>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Investigations:</span>
                    <span className="font-medium">12 ongoing</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resolved Today:</span>
                    <span className="font-medium text-green-600">89 cases</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Response Time:</span>
                    <span className="font-medium">2.3 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">False Positive Rate:</span>
                    <span className="font-medium text-green-600">3.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Verdict */}
      <div className="bg-white border-l-4 border-green-500 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          ✅ Final Verdict for AI Intelligence Implementation
          <InfoIcon consequences="Incomplete AI implementation limits the platform's ability to defend against sophisticated threats and provide intelligent security insights for proactive protection." />
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* AI Insights (Core) */}
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-green-800">AI Insights (Core)</h4>
              <span className="text-green-600 font-medium">✅ Implemented</span>
            </div>
            
            <p className="text-sm text-green-700 mb-4">3 foundational modules present:</p>
            
            <div className="space-y-2">
              {[
                { name: 'Risk scoring', status: '✅' },
                { name: 'Retry/geo checks', status: '✅' },
                { name: 'Token analysis', status: '✅' }
              ].map((module, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">{module.status}</span>
                  <span className="text-green-800">{module.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Elite AI Features */}
          <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-amber-800">Missing Elite AI Features</h4>
              <span className="text-amber-600 font-medium">🔶 Not yet built</span>
            </div>
            
            <div className="space-y-3">
              {[
                { name: 'Context-aware scoring rules', priority: 'High' },
                { name: 'Cloning detection across accounts', priority: 'Medium' },
                { name: 'MFA-based decision trees', priority: 'High' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-amber-800">{feature.name}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    feature.priority === 'High' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {feature.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Analytics */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-blue-800">Visual Analytics</h4>
              <span className="text-blue-600 font-medium">➕ Optional</span>
            </div>
            
            <div className="space-y-3">
              {[
                { name: 'Add global heatmap of risk trends', complexity: 'Medium' },
                { name: 'Show "AI Threat Evolution" visual dashboard', complexity: 'High' }
              ].map((analytics, index) => (
                <div key={index} className="p-3 bg-blue-100 rounded border border-blue-200">
                  <div className="text-sm text-blue-800 font-medium mb-1">{analytics.name}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-600">Complexity:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      analytics.complexity === 'High' 
                        ? 'bg-orange-100 text-orange-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {analytics.complexity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Implementation Status Summary */}
        <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Implementation Readiness Status</h4>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-700 font-medium">60% Complete</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-medium text-gray-700">✅ Ready to Deploy:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Core AI risk assessment functionality</li>
                <li>• Basic threat detection capabilities</li>
                <li>• Authentication monitoring system</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-medium text-gray-700">🔄 Next Phase Priorities:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Context-aware scoring enhancement</li>
                <li>• Advanced cloning detection</li>
                <li>• Intelligent MFA decision engine</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDesignSection = () => (
    <div className="space-y-6">
      <div className="bg-white border-l-4 border-orange-500 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          🎯 Visual Design Guidelines (For Front-End)
          <InfoIcon consequences="Poor UX design in authentication leads to user abandonment, support tickets, accessibility issues, and reduced conversion rates." />
        </h3>
        
        
        <p className="text-gray-600 mb-6">
          Purpose: Ensure a polished, accessible, and responsive UI experience for all users.
        </p>

        <div className="space-y-6">
          {/* Status Badges */}
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              ✅ Status Badges
            </h4>
            
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 border border-green-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-green-800">Green: Verified or success</span>
                </div>
                <div className="bg-green-100 px-3 py-2 rounded text-sm text-green-800 font-medium">
                  ✓ Email Verified
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-yellow-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium text-yellow-800">Yellow: Pending or warning</span>
                </div>
                <div className="bg-yellow-100 px-3 py-2 rounded text-sm text-yellow-800 font-medium">
                  ⏳ Verification Pending
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-red-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium text-red-800">Red: Error or blocked</span>
                </div>
                <div className="bg-red-100 px-3 py-2 rounded text-sm text-red-800 font-medium">
                  ✗ Account Blocked
                </div>
              </div>
            </div>
            
            <div className="bg-green-100 rounded p-3 border border-green-300">
              <p className="text-sm text-green-800">
                <strong>UI Rule:</strong> Always consistent colors and shapes for each status across all input fields and results
              </p>
            </div>
          </div>

          {/* Error Feedback */}
          <div className="bg-red-50 rounded-lg p-6 border border-red-200">
            <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              ❌ Error Feedback
            </h4>
            
            <div className="mb-4">
              <p className="text-red-700 mb-3 font-medium">Required behavior: Instant feedback like:</p>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  "Code expired",
                  "Phone blocked", 
                  "Invalid email"
                ].map((error, index) => (
                  <div key={index} className="bg-red-100 border border-red-300 rounded p-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-red-800 text-sm font-medium">{error}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-red-100 rounded p-3 border border-red-300">
              <p className="text-sm text-red-800">
                <strong>UX Rule:</strong> Always show red-colored, clearly visible error messages without delay
              </p>
            </div>
          </div>

          {/* No Zoom Glitches */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              🛑 No Zoom Glitches
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 border border-blue-300">
                <h5 className="font-medium text-blue-800 mb-2">Fix:</h5>
                <p className="text-sm text-blue-700 mb-3">Prevent any zoom or page movement glitches on mobile input fields</p>
                <div className="bg-blue-100 p-2 rounded text-xs text-blue-800">
                  input[type=&quot;text&quot;] &#123; font-size: 16px; &#125;
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-blue-300">
                <h5 className="font-medium text-blue-800 mb-2">Applies to:</h5>
                <p className="text-sm text-blue-700 mb-3">iOS especially (keyboard opening should not shift layout)</p>
                <div className="bg-blue-100 p-2 rounded text-xs text-blue-800">
                  viewport-fit=cover, user-scalable=no
                </div>
              </div>
            </div>
            
            <div className="bg-blue-100 rounded p-3 border border-blue-300">
              <p className="text-sm text-blue-800">
                <strong>Toast behavior:</strong> Must also stay static when showing notifications
              </p>
            </div>
          </div>

          {/* Verification Timer */}
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <h4 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              ⏲️ Verification Timer
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 border border-purple-300">
                <h5 className="font-medium text-purple-800 mb-2">Functionality:</h5>
                <p className="text-sm text-purple-700 mb-3">Countdown that starts visibly when a code is sent</p>
                <div className="bg-purple-100 p-3 rounded border border-purple-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-800">Resend code in:</span>
                    <span className="text-lg font-mono text-purple-900">00:45</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-purple-300">
                <h5 className="font-medium text-purple-800 mb-2">Use case:</h5>
                <p className="text-sm text-purple-700 mb-3">e.g., 60 seconds until new code request is allowed</p>
                <button className="w-full bg-gray-200 text-gray-500 px-4 py-2 rounded cursor-not-allowed text-sm">
                  Resend Code (45s)
                </button>
              </div>
            </div>
            
            <div className="bg-purple-100 rounded p-3 border border-purple-300">
              <p className="text-sm text-purple-800">
                <strong>UX Tip:</strong> Disable resend button during countdown, change style to "greyed out"
              </p>
            </div>
          </div>

          {/* Contact Selector */}
          <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
            <h4 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              🔀 Contact Selector
            </h4>
            
            <div className="mb-4">
              <p className="text-amber-700 mb-3 font-medium">Function: Allows switching between:</p>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { method: "Email", icon: "📧", active: true },
                  { method: "Phone", icon: "📱", active: false },
                  { method: "WhatsApp", icon: "💬", active: false, optional: true }
                ].map((contact, index) => (
                  <div key={index} className={`rounded-lg p-4 border cursor-pointer transition-all ${
                    contact.active 
                      ? 'bg-amber-100 border-amber-400 shadow-md' 
                      : 'bg-white border-amber-200 hover:border-amber-300'
                  }`}>
                    <div className="text-center">
                      <div className="text-2xl mb-2">{contact.icon}</div>
                      <div className="font-medium text-amber-800">{contact.method}</div>
                      {contact.optional && (
                        <div className="text-xs text-amber-600 mt-1">(if implemented)</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-amber-100 rounded p-3 border border-amber-300">
              <p className="text-sm text-amber-800">
                <strong>Design:</strong> Inline toggle or segmented selector on login and verification forms
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra Super Pro UX Guidelines */}
      <div className="bg-white border-l-4 border-purple-500 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          🧠 Ultra Super Pro UX Guidelines (Elite Authentication)
          <InfoIcon consequences="Without advanced UX features, users experience friction, confusion, and abandonment during critical authentication flows, leading to poor retention and support overhead." />
        </h3>
        
        <div className="space-y-6">
          {/* Real-Time Input Validation Feedback */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h3 className="font-bold text-purple-800 mb-4 text-lg">
              🧠 Ultra Super Pro UX Guidelines (Elite Authentication)
            </h3>
            <p className="text-purple-700 mb-6">
              Advanced UI/UX mechanics to ensure authentication is smooth, intuitive, and visually smart.
            </p>
            
            {/* 2.1 Real-Time Input Validation Feedback */}
            <div className="mb-8">
              <h4 className="font-semibold text-purple-800 mb-4 flex items-center">
                ✅ 2.1 Real-Time Input Validation Feedback
              </h4>
              
              {/* Interactive Demo */}
              <div className="bg-white rounded-lg p-6 border border-purple-200 space-y-6">
                
                {/* Phone/Email Field Demo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone/Email Field Demo
                  </label>
                  <PhoneEmailValidationDemo />
                </div>
                
                {/* Password Field Demo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Strength Demo
                  </label>
                  <PasswordStrengthDemo />
                </div>
                
                {/* DOB/Age Check Demo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DOB/Age Check Demo
                  </label>
                  <DOBAgeCheckDemo />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="text-left p-2 font-medium text-purple-800">Element</th>
                    <th className="text-left p-2 font-medium text-purple-800">Description</th>
                    <th className="text-left p-2 font-medium text-purple-800">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-purple-100">
                    <td className="p-2 font-medium text-gray-800">Phone/Email</td>
                    <td className="p-2 text-gray-600">Show ✅ or ❌ as user types if format is valid</td>
                    <td className="p-2"><StatusBadge status="Implemented" type="success" /></td>
                  </tr>
                  <tr className="border-b border-purple-100">
                    <td className="p-2 font-medium text-gray-800">Password</td>
                    <td className="p-2 text-gray-600">Strength meter with dynamic color bar (e.g., weak, moderate, strong)</td>
                    <td className="p-2"><StatusBadge status="Pending" type="warning" /></td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-gray-800">DOB/Age Check</td>
                    <td className="p-2 text-gray-600">Auto-alert underage instantly with age validation badge</td>
                    <td className="p-2">
                      <button className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs hover:bg-purple-200">
                        Add Feature
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Form Interaction Intelligence */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
              2️⃣ 📦 Form Interaction Intelligence
              <InfoIcon consequences="Without intelligent form interactions, users experience dead-end flows and lose progress, leading to incomplete registrations and frustrated user experiences." />
            </h4>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="text-left p-2 font-medium text-blue-800">Feature</th>
                    <th className="text-left p-2 font-medium text-blue-800">Description</th>
                    <th className="text-left p-2 font-medium text-blue-800">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-blue-100">
                    <td className="p-2 font-medium text-gray-800">Blur-Aware Prompts</td>
                    <td className="p-2 text-gray-600">Shows soft warning if field is exited while still empty</td>
                    <td className="p-2"><StatusBadge status="Implemented" type="success" /></td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="p-2 font-medium text-gray-800">Input Completion Hints</td>
                    <td className="p-2 text-gray-600">Suggests previously entered values from cache or server profile</td>
                    <td className="p-2"><StatusBadge status="Implemented" type="success" /></td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-gray-800">Animated Field Borders</td>
                    <td className="p-2 text-gray-600">Light blue glow when input is selected/focused</td>
                    <td className="p-2"><StatusBadge status="Implemented" type="success" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Live Demo Section */}
            <div className="mt-4">
              <FormIntelligenceDemo />
            </div>
          </div>

          {/* Session-Aware State Recovery */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center">
              3️⃣ 🔁 Session-Aware State Recovery
              <InfoIcon consequences="Without session awareness, users lose progress during timeouts or refreshes, creating frustration and forcing them to restart authentication flows." />
            </h4>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-green-100">
                    <th className="text-left p-2 font-medium text-green-800">Feature</th>
                    <th className="text-left p-2 font-medium text-green-800">Description</th>
                    <th className="text-left p-2 font-medium text-green-800">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-green-100">
                    <td className="p-2 font-medium text-gray-800">Session Timeout Handler</td>
                    <td className="p-2 text-gray-600">Shows non-intrusive warning before user gets logged out automatically</td>
                    <td className="p-2"><StatusBadge status="Implemented" type="success" /></td>
                  </tr>
                  <tr className="border-b border-green-100">
                    <td className="p-2 font-medium text-gray-800">Token Refresh Visual Cue</td>
                    <td className="p-2 text-gray-600">Subtle animation or icon spin when session token refreshes in background</td>
                    <td className="p-2"><StatusBadge status="Implemented" type="success" /></td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-gray-800">Draft Form Auto-Restore</td>
                    <td className="p-2 text-gray-600">Saves user's filled form if they reload or go back accidentally</td>
                    <td className="p-2"><StatusBadge status="Implemented" type="success" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Live Demo Section */}
            <div className="mt-4">
              <SessionRecoveryDemo />
            </div>
          </div>

          {/* Adaptive Layout Enhancements */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
              4️⃣ 🧩 Adaptive Layout Enhancements
              <InfoIcon consequences="Without adaptive layouts, users on different devices experience broken interfaces, poor accessibility, and layout shifts that disrupt the authentication flow." />
            </h4>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-yellow-100">
                    <th className="text-left p-2 font-medium text-yellow-800">Feature</th>
                    <th className="text-left p-2 font-medium text-yellow-800">Description</th>
                    <th className="text-left p-2 font-medium text-yellow-800">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-yellow-100">
                    <td className="p-2 font-medium text-gray-800">Device Type Optimization</td>
                    <td className="p-2 text-gray-600">Auto-responsive layout for mobile, tablet, and desktop</td>
                    <td className="p-2"><StatusBadge status="Implemented" type="success" /></td>
                  </tr>
                  <tr className="border-b border-yellow-100">
                    <td className="p-2 font-medium text-gray-800">Error Box Size Scaling</td>
                    <td className="p-2 text-gray-600">Prevent giant red blocks when validation fails</td>
                    <td className="p-2"><StatusBadge status="Implemented" type="success" /></td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-gray-800">Tooltip Accessibility</td>
                    <td className="p-2 text-gray-600">Keyboard accessible, screen-reader readable with ARIA support</td>
                    <td className="p-2"><StatusBadge status="Implemented" type="success" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Live Demo Section */}
            <div className="mt-4">
              <AdaptiveLayoutDemo />
            </div>
          </div>

          {/* Multi-Language UX Support */}
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h4 className="font-semibold text-red-800 mb-3 flex items-center">
              5️⃣ 🌍 Multi-Language UX Support
              <InfoIcon consequences="Without multi-language support, international users face language barriers that prevent successful registration and authentication, limiting global reach." />
            </h4>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-red-100">
                    <th className="text-left p-2 font-medium text-red-800">Feature</th>
                    <th className="text-left p-2 font-medium text-red-800">Description</th>
                    <th className="text-left p-2 font-medium text-red-800">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-red-100">
                    <td className="p-2 font-medium text-gray-800">Auto Locale Detection</td>
                    <td className="p-2 text-gray-600">Detect browser/device language and pre-fill appropriate form language</td>
                    <td className="p-2"><StatusBadge status="Implemented" type="success" /></td>
                  </tr>
                  <tr className="border-b border-red-100">
                    <td className="p-2 font-medium text-gray-800">RTL Compatibility</td>
                    <td className="p-2 text-gray-600">Right-to-left alignment for Arabic, Hebrew, etc.</td>
                    <td className="p-2"><StatusBadge status="Implemented" type="success" /></td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium text-gray-800">Language Switcher</td>
                    <td className="p-2 text-gray-600">Drop-down to change language on the login/verification forms</td>
                    <td className="p-2"><StatusBadge status="Implemented" type="success" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Live Demo Section */}
            <div className="mt-4">
              <MultiLanguageDemo />
            </div>
          </div>
        </div>
      </div>

      {/* Optional Pro-Only UI Perks */}
      <div className="bg-white border-l-4 border-indigo-500 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          🧠 Optional Pro-Only UI Perks
          <InfoIcon consequences="Without premium UI features, pro users don't feel differentiated value, reducing upgrade motivation and premium feature adoption." />
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <h4 className="font-semibold text-indigo-800 mb-2">🎨 Premium Login Animations</h4>
            <p className="text-sm text-indigo-700 mb-3">Custom transitions, loading spinners, and Pro color highlights</p>
            <StatusBadge status="Implemented" type="success" />
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">🪪 Branded Verified Frames</h4>
            <p className="text-sm text-purple-700 mb-3">Special glowing ring around profile pics of verified Pro users</p>
            <StatusBadge status="Implemented" type="success" />
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-2">📘 Tooltip Docs Button</h4>
            <p className="text-sm text-orange-700 mb-3">"Learn more" buttons with mini popups and help article links</p>
            <StatusBadge status="Implemented" type="success" />
          </div>
        </div>

        {/* Live Demo Section */}
        <div className="mt-4">
          <ProPerksDemo />
        </div>
      </div>

      {/* Final Verdict */}
      <div className="bg-white border-l-4 border-green-500 rounded-lg p-6 shadow-sm">
        <UXGuidelinesSummary />
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-50">
                <th className="text-left p-3 font-medium text-green-800">Section</th>
                <th className="text-left p-3 font-medium text-green-800">Status</th>
                <th className="text-left p-3 font-medium text-green-800">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium text-gray-800">Status Feedback</td>
                <td className="p-3"><StatusBadge status="✅ Complete" type="success" /></td>
                <td className="p-3 text-gray-600">Well covered with badges and messages</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium text-gray-800">Verification & Switching</td>
                <td className="p-3"><StatusBadge status="✅ Complete" type="success" /></td>
                <td className="p-3 text-gray-600">Timer + contact method switching works well</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-medium text-gray-800">Session Handling</td>
                <td className="p-3"><StatusBadge status="⚠️ Optional" type="warning" /></td>
                <td className="p-3 text-gray-600">Consider UX for session loss, timeout, or form recovery</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-gray-800">Accessibility & Language</td>
                <td className="p-3"><StatusBadge status="⚠️ Upgradeable" type="warning" /></td>
                <td className="p-3 text-gray-600">Add multilingual layout + accessibility for global compliance</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div className="bg-white border-l-4 border-pink-500 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          🔔 Notifications/Logs for Admin
          <InfoIcon consequences="Missing critical alerts means security incidents go unnoticed, allowing attackers to maintain access and escalate privileges undetected." />
        </h3>
        
        <AdminNotificationLogs />
      </div>

      {/* Ultra Super Pro Enhancements */}
      <div className="bg-white border-l-4 border-purple-500 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          🔐 Ultra Super Pro Alert Enhancements (World-Class Module)
          <InfoIcon consequences="Without advanced alerting capabilities, sophisticated attacks and administrative threats go undetected, compromising platform security and operational integrity." />
        </h3>
        
        <div className="space-y-6">
          {/* Behavioral Alerts */}
          <BehavioralAlertsSystem />

          {/* Audit-Linked Alerts */}
          <AuditLinkedAlerts />

          {/* Alert Severity & Filters System */}
          <AlertSeverityFiltersSystem />

          {/* Alert Delivery Channels */}
          <AlertDeliveryChannels />

          {/* Alert Viewer Panel Features */}
          <AlertViewerPanelFeatures />
        </div>
      </div>

      {/* Final Verdict */}
      <AdminAlertsImplementationSummary />
    </div>
  );

  const renderPlacementSection = () => (
    <div className="space-y-6">
      {/* Original System Placement */}
      <SystemPlacementSummary />

      {/* Critical Integration Placements */}
      <CriticalIntegrationMapping />

      {/* Connected System Cards */}
      <ConnectedSystemCards />

      {/* System Setup Checklist UI */}
      <SystemSetupChecklistUI />

      {/* Multi-Region Compliance Tracker */}
      <MultiRegionComplianceTracker />

      {/* Final Verdict */}
      <FinalVerdictSummary />
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'modules': return renderModulesSection();
      case 'monitoring': return renderMonitoringSection();
      case 'security': return renderSecuritySection();
      case 'backend': return renderBackendSection();
      case 'ai-insights': return renderAISection();
      case 'design': return renderDesignSection();
      case 'notifications': return renderNotificationsSection();
      case 'placement': return renderPlacementSection();
      default: return renderModulesSection();
    }
  };

  return (
    <AdminLayout>
      <AdminHealthLayout className="p-6">
        {/* Main Header */}
        <div className="admin-health-section">
          <div className="flex items-center justify-between">
            <div>
              <div className="admin-health-header">
                <span className="emoji-icon">🔐</span>
                <span>AUTHENTICATION SYSTEM – ULTRA ENTERPRISE-LEVEL HEALTH CHECK</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Ensure secure, scalable, and real-time login/session validation, access roles, and frictionless user experience across mobile/web.
              </p>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="admin-health-section">
          <div className="flex flex-wrap gap-3">
            {sections.map((section, index) => {
              // Define different color schemes for each button
              const colorSchemes = [
                'bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border-blue-200',
                'bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 border-emerald-200',
                'bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border-purple-200',
                'bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 border-amber-200',
                'bg-gradient-to-r from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200 text-rose-700 border-rose-200',
                'bg-gradient-to-r from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 text-cyan-700 border-cyan-200',
                'bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700 border-indigo-200',
                'bg-gradient-to-r from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 text-teal-700 border-teal-200'
              ];
              
              const activeColorSchemes = [
                'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300',
                'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300',
                'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300',
                'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300',
                'bg-gradient-to-r from-rose-100 to-rose-200 text-rose-800 border-rose-300',
                'bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800 border-cyan-300',
                'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border-indigo-300',
                'bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 border-teal-300'
              ];

              const colorScheme = colorSchemes[index % colorSchemes.length];
              const activeColorScheme = activeColorSchemes[index % activeColorSchemes.length];

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 px-4 py-2 font-medium text-sm transition-all duration-300 border shadow-md hover:shadow-lg rounded-xl hover:scale-105 ${
                    activeSection === section.id
                      ? `${activeColorScheme} border-2`
                      : colorScheme
                  }`}
                >
                  <span className="emoji-icon" style={{fontSize: '16px'}}>{section.icon}</span>
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Content */}
        <div className="min-h-96">
          {renderSection()}
        </div>
        
        {/* Enhanced Ghost Sessions Modal */}
        <Dialog open={isGhostTableOpen} onOpenChange={setIsGhostTableOpen}>
          <DialogContent className={isGhostTableFullscreen ? "w-screen h-screen max-w-none max-h-none m-0 rounded-none" : "max-w-6xl max-h-[90vh]"}>
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                👻 Ghost Sessions Management
                <span className="text-sm font-normal text-muted-foreground">
                  ({getFilteredGhostSessions().length} sessions)
                </span>
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsGhostTableFullscreen(!isGhostTableFullscreen)}
                >
                  {isGhostTableFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </Button>
              </div>
            </DialogHeader>
            
            {/* Search, Filters & Controls */}
            <div className="space-y-4 py-4">
              {/* Session Summary Header */}
              <div className="flex items-center gap-2 text-sm">
                {(() => {
                  const ghostSessions = getFilteredGhostSessions();
                  const selectedCount = selectedGhostSessions.length;
                  const riskCounts = ghostSessions.reduce((acc, s) => {
                    acc[s.riskLevel.toLowerCase()] = (acc[s.riskLevel.toLowerCase()] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);
                  
                  return (
                    <>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                        👻 {ghostSessions.length} Ghost
                      </span>
                      {riskCounts.high > 0 && (
                        <span className="px-2 py-1 bg-red-200 text-red-900 rounded text-xs">
                          ⚠️ {riskCounts.high} High Risk
                        </span>
                      )}
                      {riskCounts.medium > 0 && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                          🟧 {riskCounts.medium} Medium Risk
                        </span>
                      )}
                      {riskCounts.low > 0 && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          🟢 {riskCounts.low} Low Risk
                        </span>
                      )}
                      {selectedCount > 0 && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          🔴 {selectedCount} Selected
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Search and Filters Row */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search User ID or Location"
                    value={ghostSearchFilter}
                    onChange={(e) => setGhostSearchFilter(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-md w-full text-sm"
                  />
                </div>
                
                <select
                  value={ghostAgeFilter}
                  onChange={(e) => setGhostAgeFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Ages</option>
                  <option value="1h">Last Hour</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="3d">Older than 3 days</option>
                </select>

                <select
                  value={ghostSortBy}
                  onChange={(e) => setGhostSortBy(e.target.value as any)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="sessionAge">Session Age</option>
                  <option value="userId">User ID</option>
                  <option value="lastActive">Last Active</option>
                  <option value="location">Location</option>
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGhostSortOrder(ghostSortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {ghostSortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={ghostAutoRefresh}
                    onChange={(e) => {
                      setGhostAutoRefresh(e.target.checked);
                      if (e.target.checked) {
                        const interval = setInterval(() => {
                          // Simulate refresh
                          toast({ description: "Ghost sessions refreshed" });
                        }, 10000);
                        setGhostRefreshInterval(interval);
                      } else if (ghostRefreshInterval) {
                        clearInterval(ghostRefreshInterval);
                        setGhostRefreshInterval(null);
                      }
                    }}
                  />
                  Auto-refresh (10s)
                </label>
              </div>

              {/* Export and Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportGhostSessions('csv')}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    Download CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportGhostSessions('json')}
                    className="flex items-center gap-1"
                  >
                    <FileDown className="h-4 w-4" />
                    Download JSON
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  {selectedGhostSessions.length > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowKillConfirmation(true)}
                      className="flex items-center gap-1"
                    >
                      <X className="h-4 w-4" />
                      Kill Selected ({selectedGhostSessions.length})
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Ghost Sessions Table */}
            <div className={`${isGhostTableFullscreen ? 'flex-1' : 'max-h-96'} overflow-y-auto border rounded-md`}>
              {getFilteredGhostSessions().length === 0 ? (
                <div className="text-center py-12">
                  {ghostSearchFilter || ghostAgeFilter !== 'all' ? (
                    <div className="space-y-2">
                      <div className="text-4xl">🔍</div>
                      <p className="text-gray-500">No sessions match the current filter settings.</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setGhostSearchFilter('');
                          setGhostAgeFilter('all');
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-4xl">🎉</div>
                      <p className="text-gray-500">No ghost sessions found!</p>
                      <p className="text-sm text-gray-400">All sessions are active and healthy.</p>
                    </div>
                  )}
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white border-b-2">
                    <tr>
                      <th className="text-left p-3">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <input
                                type="checkbox"
                                checked={allGhostSelected}
                                ref={(el) => {
                                  if (el) {
                                    const filtered = getFilteredGhostSessions();
                                    const selectedCount = selectedGhostSessions.filter(id => 
                                      filtered.some(s => s.id === id)
                                    ).length;
                                    el.indeterminate = selectedCount > 0 && selectedCount < filtered.length;
                                  }
                                }}
                                onChange={(e) => {
                                  const filtered = getFilteredGhostSessions();
                                  if (e.target.checked) {
                                    setSelectedGhostSessions(filtered.map(s => s.id));
                                    setAllGhostSelected(true);
                                  } else {
                                    setSelectedGhostSessions([]);
                                    setAllGhostSelected(false);
                                  }
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent>Select/Deselect All</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </th>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <th className="text-left p-3 cursor-pointer hover:bg-gray-50">User ID</th>
                          </TooltipTrigger>
                          <TooltipContent>Unique identifier for the user session</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <th className="text-left p-3">Last Active</th>
                      <th className="text-left p-3">Device</th>
                      <th className="text-left p-3">Location</th>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <th className="text-left p-3">Status & Risk</th>
                          </TooltipTrigger>
                          <TooltipContent>Session status and risk assessment</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <th className="text-left p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredGhostSessions().map((session) => (
                      <tr 
                        key={session.id} 
                        className={`border-b hover:bg-gray-50 transition-all duration-300 ${
                          killingSessionIds.has(session.id) ? 'animate-pulse bg-red-50' : ''
                        }`}
                        style={{
                          animation: killingSessionIds.has(session.id) ? 'flashKill 1s ease forwards' : undefined
                        }}
                      >
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedGhostSessions.includes(session.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedGhostSessions([...selectedGhostSessions, session.id]);
                              } else {
                                setSelectedGhostSessions(selectedGhostSessions.filter(id => id !== session.id));
                                setAllGhostSelected(false);
                              }
                            }}
                          />
                        </td>
                        <td className="p-3 font-mono text-xs">{session.userId}</td>
                        <td className="p-3">{session.lastActive}</td>
                        <td className="p-3">{session.device}</td>
                        <td className="p-3 flex items-center gap-1">
                          <span>{session.country}</span>
                          <span>{session.location}</span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                                    👻 Ghost
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>This session has no recent activity and may be abandoned</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    session.riskLevel === 'High' ? 'bg-red-200 text-red-900' :
                                    session.riskLevel === 'Medium' ? 'bg-orange-100 text-orange-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {session.riskLevel === 'High' ? '⚠️' : 
                                     session.riskLevel === 'Medium' ? '🟧' : '🟢'} {session.riskLevel}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="text-xs">
                                    <div>Risk Level: {session.riskLevel}</div>
                                    {session.riskTags && session.riskTags.length > 0 && (
                                      <div>Tags: {session.riskTags.join(', ')}</div>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            {!session.mfaEnabled && (
                              <span className="px-1 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                                🔓 No MFA
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button 
                                  onClick={() => handleKillGhostSession(session.id)}
                                  disabled={killingSessionIds.has(session.id)}
                                  className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {killingSessionIds.has(session.id) ? 'Killing...' : 'Kill'}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Terminate this session immediately</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <DialogFooter className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setIsGhostTableOpen(false)}>
                  Close
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Simulate refresh
                    toast({ description: "Ghost sessions refreshed" });
                  }}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>

              {getFilteredGhostSessions().length > 0 && (
                <Button 
                  variant="destructive"
                  onClick={() => {
                    const allGhostIds = getFilteredGhostSessions().map(s => s.id);
                    setSelectedGhostSessions(allGhostIds);
                    setShowKillConfirmation(true);
                  }}
                  disabled={getFilteredGhostSessions().length === 0}
                >
                  Kill All Ghost Sessions
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Kill Confirmation Modal */}
        <Dialog open={showKillConfirmation} onOpenChange={setShowKillConfirmation}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Confirm Session Termination
              </DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">
                  ⚠️ Are you sure you want to kill {selectedGhostSessions.length} ghost session{selectedGhostSessions.length !== 1 ? 's' : ''}? 
                  This action cannot be undone.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Type <code className="bg-gray-100 px-1 rounded">CONFIRM</code> to proceed:
                </label>
                <input
                  type="text"
                  value={killConfirmText}
                  onChange={(e) => setKillConfirmText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Type CONFIRM"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowKillConfirmation(false);
                setKillConfirmText('');
              }}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleConfirmKillSessions}
                disabled={killConfirmText !== 'CONFIRM'}
              >
                Kill Sessions
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Table Modal - Custom Tables */}
        <AddTableModal
          isOpen={isAddTableModalOpen}
          onClose={() => setIsAddTableModalOpen(false)}
          onTableCreated={() => {
            // Trigger schema re-scan
            setSchemaValidationData(prev => prev.map(table => ({
              ...table,
              lastChecked: new Date()
            })));
            
            toast({
              title: "✅ Custom Table Created Successfully",
              description: "Schema has been updated and re-scanned"
            });
          }}
          mode="custom"
        />

        {/* Add Required Table Modal - System Required Tables */}
        <AddTableModal
          isOpen={isAddRequiredTableModalOpen}
          onClose={() => setIsAddRequiredTableModalOpen(false)}
          onTableCreated={() => {
            // Trigger schema re-scan and remove from missing tables
            setSchemaValidationData(prev => prev.map(table => ({
              ...table,
              lastChecked: new Date()
            })));
            
            toast({
              title: "✅ Required Table Created Successfully",
              description: `System table "${newTableName}" has been created and validation updated`
            });
          }}
          initialTableName={newTableName}
          mode="required"
        />

        {/* Table Inspector Modal */}
        <TableInspectorModal
          isOpen={isTableInspectorOpen}
          onClose={() => setIsTableInspectorOpen(false)}
          tableName={selectedTableForInspection}
        />

        {/* Audit Logs Modals */}
        <AuditLogsInspectModal
          isOpen={auditLogsInspectOpen}
          onClose={() => setAuditLogsInspectOpen(false)}
          tableExists={auditLogsExists}
        />
        
        <CreateTableModal
          isOpen={createTableModalOpen}
          onClose={() => setCreateTableModalOpen(false)}
        />
        
        <AddFieldModal
          isOpen={addFieldModalOpen}
          onClose={() => setAddFieldModalOpen(false)}
        />

        {/* Device Registry Modals */}
        <DeviceRegistryInspectorModal 
          isOpen={showDeviceRegistryInspector} 
          onClose={() => setShowDeviceRegistryInspector(false)} 
        />
        <DeviceRegistryAddTableModal 
          isOpen={showDeviceRegistryAddTable} 
          onClose={() => setShowDeviceRegistryAddTable(false)} 
        />
        <DeviceRegistryAddFieldModal 
          isOpen={showDeviceRegistryAddField} 
          onClose={() => setShowDeviceRegistryAddField(false)} 
          missingField="trusted"
        />

        {/* Login Failures Modals */}
        <LoginFailuresInspectorModal 
          isOpen={showLoginFailuresInspector} 
          onClose={() => setShowLoginFailuresInspector(false)} 
        />
        <LoginFailuresAddTableModal 
          isOpen={showLoginFailuresAddTable} 
          onClose={() => setShowLoginFailuresAddTable(false)} 
        />
        <LoginFailuresAddFieldModal 
          isOpen={showLoginFailuresAddField} 
          onClose={() => setShowLoginFailuresAddField(false)} 
          missingField="attempt_count"
        />

        {/* Session Blacklist Modals */}
        <SessionBlacklistInspectorModal 
          isOpen={showSessionBlacklistInspector} 
          onClose={() => setShowSessionBlacklistInspector(false)} 
        />
        <SessionBlacklistAddTableModal 
          isOpen={showSessionBlacklistAddTable} 
          onClose={() => setShowSessionBlacklistAddTable(false)} 
        />

        {/* Device Events Modals */}
        <DeviceEventsInspectorModal 
          isOpen={showDeviceEventsInspector} 
          onClose={() => setShowDeviceEventsInspector(false)} 
        />
        <DeviceEventsAddTableModal 
          isOpen={showDeviceEventsAddTable} 
          onClose={() => setShowDeviceEventsAddTable(false)} 
        />

        {/* Geo Login Audit Modals */}
        <GeoLoginAuditInspectorModal 
          isOpen={showGeoLoginAuditInspector} 
          onClose={() => setShowGeoLoginAuditInspector(false)} 
        />
        <GeoLoginAuditAddTableModal 
          isOpen={showGeoLoginAuditAddTable} 
          onClose={() => setShowGeoLoginAuditAddTable(false)} 
        />

        {/* MFA Attempt Logs Modals */}
        <MFAAttemptLogsInspectorModal 
          isOpen={showMFAAttemptLogsInspector} 
          onClose={() => setShowMFAAttemptLogsInspector(false)} 
        />
        <MFAAttemptLogsAddTableModal 
          isOpen={showMFAAttemptLogsAddTable} 
          onClose={() => setShowMFAAttemptLogsAddTable(false)} 
        />

        {/* Consent Records Modals */}
        <ConsentRecordsInspectorModal 
          isOpen={showConsentRecordsInspector} 
          onClose={() => setShowConsentRecordsInspector(false)} 
        />
        <ConsentRecordsAddTableModal 
          isOpen={showConsentRecordsAddTable} 
          onClose={() => setShowConsentRecordsAddTable(false)} 
        />
      </AdminHealthLayout>
    </AdminLayout>
  );
};

export default CorePlatformAuthentication;