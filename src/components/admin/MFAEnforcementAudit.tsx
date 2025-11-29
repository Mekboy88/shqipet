import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  User,
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Smartphone,
  History,
  Settings,
  Filter,
  Download,
  Send,
  Bell,
  Lock,
  Unlock,
  Eye,
  RefreshCw,
  Target,
  Zap,
  Search,
  Calendar,
  MapPin,
  Monitor,
  X,
  AlertCircle,
  Save,
  FileText,
  Activity,
  Trash2
} from 'lucide-react';

interface RoleMFAStats {
  role: string;
  totalUsers: number;
  mfaEnabled: number;
  coverage: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface MFAEvent {
  id: string;
  userId: string;
  userName: string;
  eventType: 'enabled' | 'disabled' | 'skipped' | 'bypassed' | 'failed';
  timestamp: string;
  device: string;
  ipAddress: string;
  location: string;
  result: 'success' | 'failed' | 'warning';
}

interface WeakEntryPoint {
  method: string;
  description: string;
  riskLevel: 'medium' | 'high';
  sessionsAffected: number;
  canFix: boolean;
}

interface MFATrend {
  date: string;
  newMFAUsers: number;
  totalActivations: number;
  dropOffs: number;
}

export function MFAEnforcementAudit() {
  const [overallCoverage, setOverallCoverage] = useState(37);
  const [trendChange, setTrendChange] = useState(4);
  const [isEnforcing, setIsEnforcing] = useState(false);
  const [autoEnforceEnabled, setAutoEnforceEnabled] = useState(false);
  const [minEnforcementThreshold, setMinEnforcementThreshold] = useState(70);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  
  // Modal states
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showGlobalEnforceModal, setShowGlobalEnforceModal] = useState(false);
  const [showFixModal, setShowFixModal] = useState<string | null>(null);
  const [showEnforceModal, setShowEnforceModal] = useState<{role: string; count: number} | null>(null);
  const [showProtectedUsersModal, setShowProtectedUsersModal] = useState(false);
  const [showWeeklyActivationsModal, setShowWeeklyActivationsModal] = useState(false);
  const [showAnomalyAlertModal, setShowAnomalyAlertModal] = useState(false);
  
  // New modal states for anomaly cards
  const [showLocationJumpsModal, setShowLocationJumpsModal] = useState(false);
  const [showTimeClusteringModal, setShowTimeClusteringModal] = useState(false);
  const [showRiskScoreModal, setShowRiskScoreModal] = useState(false);
  const [showAffectedUsersModal, setShowAffectedUsersModal] = useState(false);
  const [showWeakEntryModal, setShowWeakEntryModal] = useState(false);
  const [selectedAffectedUsers, setSelectedAffectedUsers] = useState<string[]>([]);
  
  // Additional modal states for missing functionality
  const [showRiskSettingsModal, setShowRiskSettingsModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showCoverageModal, setShowCoverageModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messageTemplate, setMessageTemplate] = useState('');
  const [showSessionExpiryModal, setShowSessionExpiryModal] = useState(false);
  const [confirmSessionExpiry, setConfirmSessionExpiry] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');
  
  // Form states
  const [notifyMessage, setNotifyMessage] = useState('MFA coverage is critically low. Please review and take action.');
  const [notifyUrgency, setNotifyUrgency] = useState('high');
  const [selectedRecipients, setSelectedRecipients] = useState(['all-admins']);
  
  // Settings states
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [enforcementMethods, setEnforcementMethods] = useState({
    email: true,
    authenticator: true,
    sms: false
  });
  
  // Anomaly data
  const [anomalies] = useState({
    locationJumps: 23,
    timeClustering: 8,
    riskScoreAvg: 7.2,
    affectedUsers: 45
  });

  // Sample detailed data for modals
  const [locationJumpData] = useState([
    {
      id: '1',
      userId: 'user123',
      userName: '@sarah_m',
      locations: ['London, UK', 'New York, US'],
      timestamps: ['2025-07-26T10:30:00Z', '2025-07-26T11:45:00Z'],
      distance: '5,500 km',
      timeGap: '1h 15min',
      riskLevel: 'high',
      flagged: true
    },
    {
      id: '2',
      userId: 'user456',
      userName: '@mike_tech',
      locations: ['Paris, FR', 'Tokyo, JP'],
      timestamps: ['2025-07-25T14:20:00Z', '2025-07-25T15:30:00Z'],
      distance: '9,700 km',
      timeGap: '1h 10min',
      riskLevel: 'critical',
      flagged: true
    }
  ]);

  const [timeClusteringData] = useState([
    {
      id: '1',
      userId: 'user789',
      userName: '@bot_checker',
      loginCount: 15,
      timeWindow: '5 minutes',
      devices: ['Chrome/Windows', 'Firefox/Linux', 'Safari/iOS'],
      ipAddresses: ['192.168.1.1', '10.0.0.5', '172.16.0.3'],
      timestamp: '2025-07-26T09:30:00Z',
      severity: 'high'
    },
    {
      id: '2',
      userId: 'user101',
      userName: '@rapid_login',
      loginCount: 8,
      timeWindow: '2 minutes',
      devices: ['Chrome/Windows', 'Chrome/Android'],
      ipAddresses: ['203.0.113.1', '203.0.113.2'],
      timestamp: '2025-07-25T16:45:00Z',
      severity: 'medium'
    }
  ]);

  const [affectedUsersData, setAffectedUsersData] = useState([
    {
      id: 'user1',
      userName: '@sarah_m',
      email: 'sarah@example.com',
      riskScore: 8.5,
      flaggedReasons: ['Location Jump', 'MFA Skipped'],
      lastLogin: '2025-07-26T11:45:00Z',
      mfaStatus: 'disabled',
      accountStatus: 'active'
    },
    {
      id: 'user2',
      userName: '@mike_tech',
      email: 'mike@example.com',
      riskScore: 9.2,
      flaggedReasons: ['Location Jump', 'Time Clustering'],
      lastLogin: '2025-07-25T15:30:00Z',
      mfaStatus: 'disabled',
      accountStatus: 'active'
    },
    {
      id: 'user3',
      userName: '@bot_checker',
      email: 'bot@example.com',
      riskScore: 7.8,
      flaggedReasons: ['Time Clustering', 'Multiple Devices'],
      lastLogin: '2025-07-26T09:35:00Z',
      mfaStatus: 'enabled',
      accountStatus: 'review'
    }
  ]);

  const [roleStats, setRoleStats] = useState<RoleMFAStats[]>([
    { role: 'Admin', totalUsers: 15, mfaEnabled: 15, coverage: 100, riskLevel: 'low' },
    { role: 'Moderator', totalUsers: 28, mfaEnabled: 25, coverage: 89, riskLevel: 'medium' },
    { role: 'Pro Users', totalUsers: 112, mfaEnabled: 72, coverage: 64, riskLevel: 'high' },
    { role: 'Free Users', totalUsers: 985, mfaEnabled: 318, coverage: 32, riskLevel: 'high' }
  ]);

  const [weakEntryPoints, setWeakEntryPoints] = useState<WeakEntryPoint[]>([
    {
      method: 'Apple Login',
      description: 'Auto-login may skip MFA setup prompt',
      riskLevel: 'high',
      sessionsAffected: 1207,
      canFix: true
    },
    {
      method: 'Session Recovery',
      description: 'Allows bypass on restore',
      riskLevel: 'medium',
      sessionsAffected: 812,
      canFix: true
    },
    {
      method: 'Phone Number Login',
      description: 'MFA step missing in flow',
      riskLevel: 'high',
      sessionsAffected: 456,
      canFix: true
    }
  ]);

  const [mfaEvents, setMfaEvents] = useState<MFAEvent[]>([
    {
      id: '1',
      userId: 'user1',
      userName: '@john',
      eventType: 'enabled',
      timestamp: '2025-07-26T03:45:00Z',
      device: 'iPhone',
      ipAddress: '192.168.1.1',
      location: '🇬🇧 London, UK',
      result: 'success'
    },
    {
      id: '2',
      userId: 'user2',
      userName: '@sara',
      eventType: 'skipped',
      timestamp: '2025-07-22T10:30:00Z',
      device: 'Chrome',
      ipAddress: '94.2.11.45',
      location: '🇺🇸 New York, US',
      result: 'warning'
    },
    {
      id: '3',
      userId: 'admin1',
      userName: '@admin',
      eventType: 'bypassed',
      timestamp: '2025-07-25T14:20:00Z',
      device: 'Web',
      ipAddress: '127.0.0.1',
      location: '🏠 Local',
      result: 'warning'
    }
  ]);

  const [mfaTrends, setMfaTrends] = useState<MFATrend[]>([
    { date: '2025-07-20', newMFAUsers: 12, totalActivations: 18, dropOffs: 3 },
    { date: '2025-07-21', newMFAUsers: 8, totalActivations: 15, dropOffs: 2 },
    { date: '2025-07-22', newMFAUsers: 15, totalActivations: 22, dropOffs: 5 },
    { date: '2025-07-23', newMFAUsers: 18, totalActivations: 25, dropOffs: 4 },
    { date: '2025-07-24', newMFAUsers: 22, totalActivations: 28, dropOffs: 3 },
    { date: '2025-07-25', newMFAUsers: 25, totalActivations: 31, dropOffs: 2 },
    { date: '2025-07-26', newMFAUsers: 20, totalActivations: 26, dropOffs: 1 }
  ]);

  // Risk factor settings
  const [riskFactors, setRiskFactors] = useState([
    { name: 'Location Jumps', weight: 25, enabled: true, description: 'Logins from geographically distant locations within short time' },
    { name: 'MFA Skipped', weight: 30, enabled: true, description: 'Attempts to bypass or skip MFA authentication' },
    { name: 'Time Clustering', weight: 20, enabled: true, description: 'Multiple rapid login attempts' },
    { name: 'Suspicious Devices', weight: 15, enabled: true, description: 'Unrecognized or risky devices' },
    { name: 'Failed Attempts', weight: 10, enabled: true, description: 'Multiple failed login attempts' }
  ]);

  // Message templates
  const messageTemplates = [
    { id: 'security_alert', title: 'Security Alert', content: 'We detected unusual activity on your account. Please enable MFA to secure your account.' },
    { id: 'mfa_reminder', title: 'MFA Setup Reminder', content: 'Please enable Multi-Factor Authentication to keep your account secure.' },
    { id: 'suspicious_login', title: 'Suspicious Login Alert', content: 'We noticed a login from an unusual location. Please verify this was you and consider enabling MFA.' }
  ];

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 90) return 'text-success';
    if (coverage >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getCoverageBadge = (coverage: number) => {
    if (coverage >= 90) return <Badge className="bg-success text-success-foreground">Excellent</Badge>;
    if (coverage >= 70) return <Badge className="bg-warning text-warning-foreground">Good</Badge>;
    if (coverage >= 50) return <Badge variant="destructive">Poor</Badge>;
    return <Badge variant="destructive">Critical</Badge>;
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return <ShieldCheck className="h-4 w-4 text-success" />;
      case 'medium': return <ShieldAlert className="h-4 w-4 text-warning" />;
      case 'high': return <Shield className="h-4 w-4 text-destructive" />;
      default: return <Shield className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'enabled': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'disabled': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'skipped': return <Clock className="h-4 w-4 text-warning" />;
      case 'bypassed': return <Unlock className="h-4 w-4 text-destructive" />;
      case 'failed': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <Shield className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleEnforceMFA = async (role: string, userCount: number) => {
    setIsEnforcing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update role stats
      setRoleStats(prev => prev.map(stat => 
        stat.role === role 
          ? { ...stat, mfaEnabled: stat.totalUsers, coverage: 100, riskLevel: 'low' as const }
          : stat
      ));
      
      toast.success(`✅ MFA enforced for ${userCount} ${role.toLowerCase()} users`);
    } catch (error) {
      toast.error('Failed to enforce MFA');
    } finally {
      setIsEnforcing(false);
    }
  };

  const handleSendReminder = async (role: string, userCount: number) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`📧 MFA reminder sent to ${userCount} ${role.toLowerCase()} users`);
    } catch (error) {
      toast.error('Failed to send reminder');
    }
  };

  const handleFixWeakPoint = async (method: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setWeakEntryPoints(prev => prev.filter(point => point.method !== method));
      toast.success(`✅ Fixed MFA bypass for ${method}`);
    } catch (error) {
      toast.error('Failed to fix weak entry point');
    }
  };

  const handleGlobalEnforcement = async () => {
    setIsEnforcing(true);
    try {
      // Simulate global enforcement
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const totalUsers = roleStats.reduce((sum, stat) => sum + stat.totalUsers, 0);
      setRoleStats(prev => prev.map(stat => ({
        ...stat,
        mfaEnabled: stat.totalUsers,
        coverage: 100,
        riskLevel: 'low' as const
      })));
      
      setOverallCoverage(100);
      toast.success(`✅ MFA enforced globally for ${totalUsers} users`);
    } catch (error) {
      toast.error('Global enforcement failed');
    } finally {
      setIsEnforcing(false);
    }
  };

  // Filtered event data based on search and filters
  const filteredEvents = useMemo(() => {
    return mfaEvents.filter(event => {
      const matchesSearch = searchTerm === '' || 
        event.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesEventFilter = eventFilter === 'all' || event.eventType === eventFilter;
      const matchesDeviceFilter = deviceFilter === 'all' || event.device.toLowerCase().includes(deviceFilter.toLowerCase());
      const matchesResultFilter = resultFilter === 'all' || event.result === resultFilter;
      
      return matchesSearch && matchesEventFilter && matchesDeviceFilter && matchesResultFilter;
    });
  }, [mfaEvents, searchTerm, eventFilter, deviceFilter, resultFilter]);

  // Handler functions for modals and actions
  const handleNotifyAdmins = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log the action (in real app, this would be sent to backend)
      console.log('Admin notification logged:', {
        action: 'mfa_coverage_alert',
        recipients: selectedRecipients,
        urgency: notifyUrgency,
        message: notifyMessage,
        timestamp: new Date().toISOString()
      });
      
      toast.success(`📧 Alert sent to ${selectedRecipients.join(', ')}`);
      setShowNotifyModal(false);
    } catch (error) {
      toast.error('Failed to send notification');
    }
  };


  // Handler for resetting risk settings to default
  const handleResetRiskSettings = () => {
    setRiskFactors([
      { name: 'Location Jumps', weight: 25, enabled: true, description: 'Logins from geographically distant locations within short time' },
      { name: 'MFA Skipped', weight: 30, enabled: true, description: 'Attempts to bypass or skip MFA authentication' },
      { name: 'Time Clustering', weight: 20, enabled: true, description: 'Multiple rapid login attempts' },
      { name: 'Suspicious Devices', weight: 15, enabled: true, description: 'Unrecognized or risky devices' },
      { name: 'Failed Attempts', weight: 10, enabled: true, description: 'Multiple failed login attempts' }
    ]);
    toast.success('Risk factor settings reset to defaults');
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('✅ MFA settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleAlertAnomalies = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('🚨 Anomaly alert sent to Super Admins');
      setShowAnomalyAlertModal(false);
    } catch (error) {
      toast.error('Failed to send anomaly alert');
    }
  };

  const exportData = (format: 'csv' | 'json') => {
    const dataToExport = filteredEvents.length > 0 ? filteredEvents : mfaEvents;
    const data = format === 'csv' 
      ? ['User,Event,Time,Device,Location,Result', ...dataToExport.map(event => 
          `${event.userName},${event.eventType},${event.timestamp},${event.device},"${event.location}",${event.result}`
        )].join('\n')
      : JSON.stringify({ roleStats, events: dataToExport, weakEntryPoints, filteredCount: dataToExport.length }, null, 2);
    
    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mfa-audit-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`📊 MFA audit data exported (${dataToExport.length} events)`);
  };

  // Action functions for missing functionality
  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowUserDetailsModal(true);
  };

  const handleMessageUser = (user: any) => {
    setSelectedUser(user);
    setMessageTemplate(messageTemplates[0].content);
    setShowMessageModal(true);
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actually remove the user from the affected users list
      setAffectedUsersData(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      // Also remove from selected users if selected
      setSelectedAffectedUsers(prev => prev.filter(id => id !== userId));
      
      toast.success('User removed from flagged list');
    } catch (error) {
      toast.error('Failed to remove user from list');
    }
  };

  const handleSendMessage = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Message sent to ${selectedUser?.userName}`);
      setShowMessageModal(false);
      setMessageTemplate('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleSaveRiskSettings = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Risk settings saved successfully');
      setShowRiskSettingsModal(false);
    } catch (error) {
      toast.error('Failed to save risk settings');
    }
  };

  const handleRestoreDefaults = () => {
    setRiskFactors([
      { name: 'Location Jumps', weight: 25, enabled: true, description: 'Logins from geographically distant locations within short time' },
      { name: 'MFA Skipped', weight: 30, enabled: true, description: 'Attempts to bypass or skip MFA authentication' },
      { name: 'Time Clustering', weight: 20, enabled: true, description: 'Multiple rapid login attempts' },
      { name: 'Suspicious Devices', weight: 15, enabled: true, description: 'Unrecognized or risky devices' },
      { name: 'Failed Attempts', weight: 10, enabled: true, description: 'Multiple failed login attempts' }
    ]);
    toast.success('Risk settings restored to defaults');
  };

  const updateRiskFactor = (index: number, field: string, value: any) => {
    const updated = [...riskFactors];
    updated[index] = { ...updated[index], [field]: value };
    setRiskFactors(updated);
  };

  const exportVulnerableSessionsData = () => {
    const csvData = [
      'Method,Description,Risk Level,Sessions Affected',
      ...weakEntryPoints.map(point => 
        `"${point.method}","${point.description}","${point.riskLevel}",${point.sessionsAffected}`
      )
    ].join('\n');
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vulnerable-sessions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('📊 Vulnerable sessions data exported');
  };

  const handleForceSessionExpiry = async () => {
    if (!confirmSessionExpiry) {
      toast.error('Please confirm the action by checking the checkbox');
      return;
    }
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const totalSessions = weakEntryPoints.reduce((sum, point) => sum + point.sessionsAffected, 0);
      toast.success(`✅ ${totalSessions} sessions expired successfully`);
      setShowSessionExpiryModal(false);
      setConfirmSessionExpiry(false);
    } catch (error) {
      toast.error('❌ Session expiry failed. Try again or check logs.');
    }
  };

  const isBelowThreshold = overallCoverage < minEnforcementThreshold;

  return (
    <div className="space-y-6">
      {/* Critical Alert Banner */}
      {isBelowThreshold && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              🚨 MFA Coverage Critical — Only {overallCoverage}% of users are protected. 
              This is below the recommended threshold of {minEnforcementThreshold}%.
            </span>
            <div className="flex gap-2 ml-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowNotifyModal(true)}
                className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notify Admins
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => setShowGlobalEnforceModal(true)}
                className="bg-destructive hover:bg-destructive/90 pulse-animation"
              >
                <Zap className="h-4 w-4 mr-2" />
                Enforce Now
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setShowCoverageModal(true)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Overall Coverage</p>
                      <p className={`text-2xl font-bold ${getCoverageColor(overallCoverage)}`}>
                        {overallCoverage}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {trendChange > 0 ? '+' : ''}{trendChange}% in past 7 days
                      </p>
                    </div>
                    <Shield className={`h-8 w-8 ${getCoverageColor(overallCoverage)}`} />
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to view detailed coverage breakdown by user roles</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setShowProtectedUsersModal(true)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Protected Users</p>
                      <p className="text-2xl font-bold text-success">
                        {roleStats.reduce((sum, stat) => sum + stat.mfaEnabled, 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        of {roleStats.reduce((sum, stat) => sum + stat.totalUsers, 0)} total
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to view filtered list of protected users</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setShowWeakEntryModal(true)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Weak Entry Points</p>
                      <p className="text-2xl font-bold text-destructive">{weakEntryPoints.length}</p>
                      <p className="text-xs text-muted-foreground">
                        {weakEntryPoints.reduce((sum, point) => sum + point.sessionsAffected, 0)} sessions affected
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to view affected sessions and vulnerable entry types</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowWeeklyActivationsModal(true)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weekly Activations</p>
                <p className="text-2xl font-bold text-primary">
                  {mfaTrends.reduce((sum, trend) => sum + trend.totalActivations, 0)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {mfaTrends.reduce((sum, trend) => sum + trend.dropOffs, 0)} drop-offs
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Login Pattern Anomalies Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-warning" />
              Login Pattern Anomalies
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAnomalyAlertModal(true)}
            >
              <Bell className="h-4 w-4 mr-2" />
              Alert Admins
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="text-center p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
                    onClick={() => setShowLocationJumpsModal(true)}
                  >
                    <MapPin className="h-6 w-6 text-warning mx-auto mb-2" />
                    <p className="text-2xl font-bold text-warning">{anomalies.locationJumps}</p>
                    <p className="text-sm text-muted-foreground">Location Jumps</p>
                    <p className="text-xs text-muted-foreground mt-1">Users logging from distant locations</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to view user location jump events and suspicious geographic patterns</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="text-center p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
                    onClick={() => setShowTimeClusteringModal(true)}
                  >
                    <Clock className="h-6 w-6 text-warning mx-auto mb-2" />
                    <p className="text-2xl font-bold text-warning">{anomalies.timeClustering}</p>
                    <p className="text-sm text-muted-foreground">Time Clustering</p>
                    <p className="text-xs text-muted-foreground mt-1">Multiple logins in short periods</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to view clustering incidents with login details and potential automated attacks</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="text-center p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
                    onClick={() => setShowRiskScoreModal(true)}
                  >
                    <AlertTriangle className="h-6 w-6 text-destructive mx-auto mb-2" />
                    <p className="text-2xl font-bold text-destructive">{anomalies.riskScoreAvg}</p>
                    <p className="text-sm text-muted-foreground">Risk Score Avg</p>
                    <p className="text-xs text-muted-foreground mt-1">Average risk among flagged users</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to view risk scoring breakdown and calculation factors</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="text-center p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
                    onClick={() => setShowAffectedUsersModal(true)}
                  >
                    <Users className="h-6 w-6 text-warning mx-auto mb-2" />
                    <p className="text-2xl font-bold text-warning">{anomalies.affectedUsers}</p>
                    <p className="text-sm text-muted-foreground">Affected Users</p>
                    <p className="text-xs text-muted-foreground mt-1">Users with flagged behavior</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to view flagged users list with risk details and bulk actions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="breakdown" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="breakdown">Role Breakdown</TabsTrigger>
          <TabsTrigger value="weak-points">Weak Entry Points</TabsTrigger>
          <TabsTrigger value="events">Event History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Role-Based MFA Coverage</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => exportData('csv')}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleGlobalEnforcement}
                    disabled={isEnforcing}
                  >
                    {isEnforcing ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Lock className="h-4 w-4 mr-2" />
                    )}
                    Enforce MFA Globally
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>MFA Enabled</TableHead>
                    <TableHead>Coverage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roleStats.map((stat) => (
                    <TableRow key={stat.role}>
                      <TableCell className="flex items-center gap-2">
                        {getRiskIcon(stat.riskLevel)}
                        <span className="font-medium">{stat.role}</span>
                      </TableCell>
                      <TableCell>{stat.totalUsers.toLocaleString()}</TableCell>
                      <TableCell>{stat.mfaEnabled.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${getCoverageColor(stat.coverage)}`}>
                            {stat.coverage}%
                          </span>
                          <Progress value={stat.coverage} className="w-20 h-2" />
                        </div>
                      </TableCell>
                      <TableCell>{getCoverageBadge(stat.coverage)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {stat.coverage < 100 && (
                            <>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setShowEnforceModal({role: stat.role, count: stat.totalUsers - stat.mfaEnabled})}
                                disabled={isEnforcing}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                <Lock className="h-4 w-4 mr-1" />
                                Enforce
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSendReminder(stat.role, stat.totalUsers - stat.mfaEnabled)}
                              >
                                <Send className="h-4 w-4 mr-1" />
                                Remind
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weak-points" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detected Weak Entry Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weakEntryPoints.map((point, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        point.riskLevel === 'high' ? 'bg-destructive/10' : 'bg-warning/10'
                      }`}>
                        <AlertTriangle className={`h-4 w-4 ${
                          point.riskLevel === 'high' ? 'text-destructive' : 'text-warning'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-medium">{point.method}</h4>
                        <p className="text-sm text-muted-foreground">{point.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {point.sessionsAffected.toLocaleString()} sessions affected
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={point.riskLevel === 'high' ? 'destructive' : 'secondary'}>
                        {point.riskLevel.toUpperCase()} RISK
                      </Badge>
                      {point.canFix && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFixWeakPoint(point.method)}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Fix
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>MFA Event History</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => exportData('csv')} className="border-green-600 text-green-600 hover:bg-green-50">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportData('json')} className="border-green-600 text-green-600 hover:bg-green-50">
                    <FileText className="h-4 w-4 mr-2" />
                    Export JSON
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by user, device, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">Last Day</SelectItem>
                    <SelectItem value="7d">Last Week</SelectItem>
                    <SelectItem value="30d">Last Month</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={eventFilter} onValueChange={setEventFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="enabled">Enabled</SelectItem>
                    <SelectItem value="skipped">Skipped</SelectItem>
                    <SelectItem value="bypassed">Bypassed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={resultFilter} onValueChange={setResultFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Results</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                {(searchTerm || eventFilter !== 'all' || resultFilter !== 'all') && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setSearchTerm('');
                      setEventFilter('all');
                      setResultFilter('all');
                    }}
                    className="px-3"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              {/* Results Count */}
              <div className="text-sm text-muted-foreground">
                {filteredEvents.length === mfaEvents.length 
                  ? `Showing all ${mfaEvents.length} events`
                  : `Showing ${filteredEvents.length} of ${mfaEvents.length} events`
                }
              </div>

              {/* Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <TableHead className="cursor-help">User</TableHead>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Username or email of the user</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <TableHead className="cursor-help">Event</TableHead>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Type of MFA action performed</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TableHead>Time</TableHead>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <TableHead className="cursor-help">Device</TableHead>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Device type that attempted auth</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <TableHead className="cursor-help">Location</TableHead>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Geographic location during attempt</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <TableHead className="cursor-help">Result</TableHead>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Success or failure from provider</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          <div className="flex flex-col items-center gap-2">
                            <Search className="h-8 w-8 text-muted-foreground/50" />
                            <p>No results found</p>
                            <p className="text-sm">Try adjusting your search or filters</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEvents.map((event) => (
                        <TableRow key={event.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{event.userName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="cursor-help">
                                      {getEventIcon(event.eventType)}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      {event.eventType === 'enabled' && 'User successfully enabled MFA'}
                                      {event.eventType === 'disabled' && 'User disabled MFA protection'}
                                      {event.eventType === 'skipped' && 'User skipped MFA setup prompt'}
                                      {event.eventType === 'bypassed' && 'MFA was bypassed using admin override'}
                                      {event.eventType === 'failed' && 'MFA verification attempt failed'}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <span className="capitalize">{event.eventType} MFA</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{new Date(event.timestamp).toLocaleDateString()}</div>
                              <div className="text-muted-foreground">{new Date(event.timestamp).toLocaleTimeString()}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Monitor className="h-4 w-4 text-muted-foreground" />
                              {event.device}
                            </div>
                          </TableCell>
                          <TableCell>{event.location}</TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                   <Badge 
                                     variant="outline"
                                     className={`cursor-help border-2 ${
                                       event.result === 'success' ? 'bg-green-50 text-green-700 border-green-500' :
                                       event.result === 'warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-500' : 
                                       'bg-red-50 text-red-700 border-red-500'
                                     }`}
                                   >
                                    {event.result.toUpperCase()}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {event.result === 'success' && 'MFA completed successfully'}
                                    {event.result === 'warning' && 'MFA bypassed or ignored'}
                                    {event.result === 'failed' && 'MFA attempt failed'}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>MFA Enforcement Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Auto-Enforcement</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically enforce MFA when coverage falls below threshold
                  </p>
                </div>
                <Switch checked={autoEnforceEnabled} onCheckedChange={setAutoEnforceEnabled} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="threshold">Minimum Enforcement Threshold (%)</Label>
                <Input
                  id="threshold"
                  type="number"
                  value={minEnforcementThreshold}
                  onChange={(e) => setMinEnforcementThreshold(Number(e.target.value))}
                  min="0"
                  max="100"
                />
              </div>

              <div className="space-y-3">
                <Label>Enforcement Methods</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email" defaultChecked />
                    <Label htmlFor="email">Email OTP</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="authenticator" defaultChecked />
                    <Label htmlFor="authenticator">Authenticator App</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sms" />
                    <Label htmlFor="sms">SMS (Not Recommended)</Label>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full"
                onClick={handleSaveSettings}
                disabled={isSavingSettings}
              >
                {isSavingSettings ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      
      {/* Notify Admins Modal */}
      <Dialog open={showNotifyModal} onOpenChange={setShowNotifyModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-warning" />
              Notify Admins
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Recipients</Label>
              <Select value={selectedRecipients[0]} onValueChange={(value) => setSelectedRecipients([value])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-admins">All Admins</SelectItem>
                  <SelectItem value="super-admins">Super Admins Only</SelectItem>
                  <SelectItem value="security-team">Security Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Message</Label>
              <Textarea
                value={notifyMessage}
                onChange={(e) => setNotifyMessage(e.target.value)}
                rows={3}
              />
            </div>
            
            <div>
              <Label>Urgency Level</Label>
              <Select value={notifyUrgency} onValueChange={setNotifyUrgency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotifyModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleNotifyAdmins} className="bg-warning hover:bg-warning/90">
              <Send className="h-4 w-4 mr-2" />
              Send Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Global Enforcement Confirmation Modal */}
      <Dialog open={showGlobalEnforceModal} onOpenChange={setShowGlobalEnforceModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Enforce MFA Globally
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>⚠️ WARNING:</strong> This action will force MFA setup for ALL users who don't have it enabled.
              </AlertDescription>
            </Alert>
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Affected Users:</h4>
              <ul className="space-y-1 text-sm">
                {roleStats.map(stat => (
                  <li key={stat.role} className="flex justify-between">
                    <span>{stat.role}:</span>
                    <span className="font-medium">{stat.totalUsers - stat.mfaEnabled} users</span>
                  </li>
                ))}
              </ul>
              <hr className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{roleStats.reduce((sum, stat) => sum + (stat.totalUsers - stat.mfaEnabled), 0)} users</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Users will be required to set up MFA before their next login. This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGlobalEnforceModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                handleGlobalEnforcement();
                setShowGlobalEnforceModal(false);
              }}
              disabled={isEnforcing}
            >
              {isEnforcing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              Enforce Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Protected Users Modal */}
      <Dialog open={false} onOpenChange={setShowProtectedUsersModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-success" />
              Protected Users ({roleStats.reduce((sum, stat) => sum + stat.mfaEnabled, 0)})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">MFA Coverage by Role</h4>
              <div className="space-y-2">
                {roleStats.map(stat => (
                  <div key={stat.role} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {getRiskIcon(stat.riskLevel)}
                      {stat.role}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{stat.mfaEnabled}/{stat.totalUsers}</span>
                      <Progress value={stat.coverage} className="w-16 h-2" />
                      <span className={`text-sm font-medium ${getCoverageColor(stat.coverage)}`}>
                        {stat.coverage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowProtectedUsersModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Weekly Activations Modal */}
      <Dialog open={false} onOpenChange={setShowWeeklyActivationsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Weekly MFA Activations
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-success">
                    {mfaTrends.reduce((sum, trend) => sum + trend.newMFAUsers, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">New MFA Users</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">
                    {mfaTrends.reduce((sum, trend) => sum + trend.totalActivations, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Activations</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-warning">
                    {mfaTrends.reduce((sum, trend) => sum + trend.dropOffs, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Drop-offs</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Daily Breakdown</h4>
              <div className="space-y-2">
                {mfaTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{new Date(trend.date).toLocaleDateString()}</span>
                    <div className="flex gap-4">
                      <span className="text-success">+{trend.newMFAUsers} new</span>
                      <span className="text-primary">{trend.totalActivations} total</span>
                      <span className="text-warning">{trend.dropOffs} dropped</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowWeeklyActivationsModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Role Enforcement Modal */}
      {showEnforceModal && (
        <Dialog open={!!showEnforceModal} onOpenChange={() => setShowEnforceModal(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <Lock className="h-5 w-5" />
                Enforce MFA for {showEnforceModal.role}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>⚠️ Warning:</strong> This action cannot be undone.
                </AlertDescription>
              </Alert>
              
              <p className="text-sm">
                You are about to enforce MFA for <strong>{showEnforceModal.count}</strong> {showEnforceModal.role.toLowerCase()} users.
                They will be required to set up MFA before their next login.
              </p>
              
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium">What will happen:</p>
                <ul className="text-sm mt-1 space-y-1">
                  <li>• Users will be prompted to set up MFA on next login</li>
                  <li>• Access will be blocked until MFA is configured</li>
                  <li>• Email notifications will be sent to affected users</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEnforceModal(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={() => {
                  handleEnforceMFA(showEnforceModal.role, showEnforceModal.count);
                  setShowEnforceModal(null);
                }}
                disabled={isEnforcing}
              >
                {isEnforcing ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4 mr-2" />
                )}
                Enforce MFA
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Protected Users Modal */}
      {showProtectedUsersModal && (
        <Dialog open={showProtectedUsersModal} onOpenChange={setShowProtectedUsersModal}>
          <DialogContent className="max-w-4xl animate-scale-in">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-success" />
                MFA Coverage by Role
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roleStats.map((stat) => (
                  <Card key={stat.role}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{stat.role}</h4>
                        {getCoverageBadge(stat.coverage)}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Protected: {stat.mfaEnabled}</span>
                          <span>Total: {stat.totalUsers}</span>
                        </div>
                        <Progress value={stat.coverage} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowProtectedUsersModal(false)}>
                Close
              </Button>
              <Button variant="default" onClick={() => exportData('csv')}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Weekly Activations Modal */}
      {showWeeklyActivationsModal && (
        <Dialog open={showWeeklyActivationsModal} onOpenChange={setShowWeeklyActivationsModal}>
          <DialogContent className="max-w-3xl animate-scale-in">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                MFA Weekly Activations Breakdown
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-success">
                    {mfaTrends.reduce((sum, trend) => sum + trend.newMFAUsers, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">New MFA Users</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-primary">
                    {mfaTrends.reduce((sum, trend) => sum + trend.totalActivations, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Activations</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-warning">
                    {mfaTrends.reduce((sum, trend) => sum + trend.dropOffs, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Drop-offs</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Daily Breakdown</h4>
                {mfaTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{new Date(trend.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-success">+{trend.newMFAUsers} new</span>
                      <span className="text-primary">{trend.totalActivations} total</span>
                      <span className="text-warning">{trend.dropOffs} drops</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowWeeklyActivationsModal(false)}>
                Close
              </Button>
              <Button variant="default" onClick={() => exportData('json')}>
                <FileText className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Anomaly Alert Modal */}
      {showAnomalyAlertModal && (
        <Dialog open={showAnomalyAlertModal} onOpenChange={setShowAnomalyAlertModal}>
          <DialogContent className="max-w-2xl animate-scale-in">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Alert Super Admins About Anomalies
                </div>
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning">
                  🚨 Login Pattern Anomaly
                </Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Last Alert Timestamp */}
              <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Last Alert Sent: 26/07/2025 at 15:03</span>
                </div>
              </div>

              {/* Recipients Info */}
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-medium">Recipients:</span>
                <Badge variant="secondary">Super Admins (3)</Badge>
              </div>

              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Detected Anomalies Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>• {anomalies.locationJumps} location jumps detected</div>
                  <div>• {anomalies.timeClustering} time clustering events</div>
                  <div>• {anomalies.affectedUsers} users affected</div>
                  <div>• Average risk score: {anomalies.riskScoreAvg}/10</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="anomaly-urgency">Alert Urgency</Label>
                  <Select value={notifyUrgency} onValueChange={setNotifyUrgency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Informational</SelectItem>
                      <SelectItem value="medium">Medium - Review Required</SelectItem>
                      <SelectItem value="high">High - Immediate Attention</SelectItem>
                      <SelectItem value="critical">Critical - Emergency Response</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="anomaly-message">Custom Message</Label>
                  <Textarea
                    id="anomaly-message"
                    value={notifyMessage}
                    onChange={(e) => setNotifyMessage(e.target.value)}
                    placeholder="e.g., MFA coverage is critically low. Please investigate user login anomalies immediately. Unusual login patterns detected requiring admin review..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAnomalyAlertModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="default"
                onClick={() => {
                  toast.success("🚨 Anomaly alert sent to all super admins");
                  setShowAnomalyAlertModal(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Bell className="h-4 w-4 mr-2" />
                Send Alert
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Location Jumps Modal */}
      {showLocationJumpsModal && (
        <Dialog open={showLocationJumpsModal} onOpenChange={setShowLocationJumpsModal}>
          <DialogContent className="max-w-4xl animate-scale-in">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-warning" />
                Location Jump Events ({anomalies.locationJumps})
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Users who logged in from geographically distant locations within short time frames, potentially indicating account compromise or sharing.
                </p>
              </div>
              
              <div className="space-y-3">
                {locationJumpData.map((jump) => (
                  <div key={jump.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{jump.userName}</span>
                          <Badge variant={jump.riskLevel === 'critical' ? 'destructive' : 'secondary'}>
                            {jump.riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">User ID: {jump.userId}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-medium">Distance: {jump.distance}</p>
                        <p className="text-muted-foreground">Time Gap: {jump.timeGap}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-green-600">First Location:</p>
                        <p>{jump.locations[0]}</p>
                        <p className="text-muted-foreground">{new Date(jump.timestamps[0]).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="font-medium text-red-600">Second Location:</p>
                        <p>{jump.locations[1]}</p>
                        <p className="text-muted-foreground">{new Date(jump.timestamps[1]).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {jump.flagged && (
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <span className="text-sm text-warning">Flagged for review</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLocationJumpsModal(false)}>
                Close
              </Button>
              <Button variant="default" onClick={() => exportData('csv')}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Time Clustering Modal */}
      {showTimeClusteringModal && (
        <Dialog open={showTimeClusteringModal} onOpenChange={setShowTimeClusteringModal}>
          <DialogContent className="max-w-4xl animate-scale-in">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                Time Clustering Events ({anomalies.timeClustering})
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Multiple login attempts within short time windows, potentially indicating automated attacks or credential stuffing attempts.
                </p>
              </div>
              
              <div className="space-y-3">
                {timeClusteringData.map((cluster) => (
                  <div key={cluster.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{cluster.userName}</span>
                          <Badge variant={cluster.severity === 'high' ? 'destructive' : 'secondary'}>
                            {cluster.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">User ID: {cluster.userId}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-600">{cluster.loginCount} logins</p>
                        <p className="text-sm text-muted-foreground">in {cluster.timeWindow}</p>
                        <p className="text-xs text-muted-foreground">{new Date(cluster.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium mb-1">Devices Used:</p>
                        <ul className="space-y-1">
                          {cluster.devices.map((device, idx) => (
                            <li key={idx} className="text-muted-foreground">• {device}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-1">IP Addresses:</p>
                        <ul className="space-y-1">
                          {cluster.ipAddresses.map((ip, idx) => (
                            <li key={idx} className="text-muted-foreground font-mono">• {ip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTimeClusteringModal(false)}>
                Close
              </Button>
              <Button variant="default" onClick={() => exportData('csv')}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Risk Score Modal */}
      {showRiskScoreModal && (
        <Dialog open={showRiskScoreModal} onOpenChange={setShowRiskScoreModal}>
          <DialogContent className="max-w-3xl animate-scale-in">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Risk Score Breakdown (Avg: {anomalies.riskScoreAvg}/10)
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Risk scores are calculated based on multiple behavioral factors. Scores above 7.0 require immediate attention.
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Risk Calculation Factors:</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Location Jumps</p>
                        <p className="text-sm text-muted-foreground">Geographic anomalies</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">+3.0</p>
                        <p className="text-xs text-muted-foreground">Weight: 30%</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">MFA Skipped</p>
                        <p className="text-sm text-muted-foreground">Authentication bypassed</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">+2.5</p>
                        <p className="text-xs text-muted-foreground">Weight: 25%</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Time Clustering</p>
                        <p className="text-sm text-muted-foreground">Rapid login attempts</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">+1.2</p>
                        <p className="text-xs text-muted-foreground">Weight: 15%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Device Changes</p>
                        <p className="text-sm text-muted-foreground">Multiple devices used</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">+0.8</p>
                        <p className="text-xs text-muted-foreground">Weight: 10%</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Failed Attempts</p>
                        <p className="text-sm text-muted-foreground">Login failures</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-yellow-600">+0.5</p>
                        <p className="text-xs text-muted-foreground">Weight: 10%</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Account Age</p>
                        <p className="text-sm text-muted-foreground">New account penalty</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-yellow-600">+0.2</p>
                        <p className="text-xs text-muted-foreground">Weight: 10%</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-red-700">Total Risk Score</p>
                      <p className="text-sm text-red-600">Requires immediate action</p>
                    </div>
                    <p className="text-3xl font-bold text-red-700">{anomalies.riskScoreAvg}/10</p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRiskScoreModal(false)}>
                Close
              </Button>
              <Button 
                variant="default"
                onClick={() => setShowRiskSettingsModal(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure Risk Settings
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Affected Users Modal */}
      {showAffectedUsersModal && (
        <Dialog open={showAffectedUsersModal} onOpenChange={setShowAffectedUsersModal}>
          <DialogContent className="max-w-6xl animate-scale-in">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-warning" />
                Affected Users ({anomalies.affectedUsers})
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Users exhibiting unusual login patterns or behaviors that have been flagged for security review.
                </p>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={selectedAffectedUsers.length === affectedUsersData.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedAffectedUsers(affectedUsersData.map(u => u.id));
                      } else {
                        setSelectedAffectedUsers([]);
                      }
                    }}
                  />
                  <span className="text-sm">Select All ({selectedAffectedUsers.length} selected)</span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={selectedAffectedUsers.length === 0}
                    onClick={() => {
                      toast.success(`📧 MFA reminder sent to ${selectedAffectedUsers.length} users`);
                    }}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notify Selected
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    disabled={selectedAffectedUsers.length === 0}
                    onClick={() => {
                      toast.success(`🔒 MFA enforced for ${selectedAffectedUsers.length} users`);
                    }}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Enforce MFA Now
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg">
                <div className="grid grid-cols-7 gap-4 p-3 border-b bg-muted/30 text-sm font-medium">
                  <div>Select</div>
                  <div>User</div>
                  <div>Risk Score</div>
                  <div>Flagged Reasons</div>
                  <div>Last Login</div>
                  <div>MFA Status</div>
                  <div>Actions</div>
                </div>
                
                <div className="divide-y">
                  {affectedUsersData.map((user) => (
                    <div key={user.id} className="grid grid-cols-7 gap-4 p-3 items-center text-sm">
                      <div>
                        <Checkbox 
                          checked={selectedAffectedUsers.includes(user.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedAffectedUsers([...selectedAffectedUsers, user.id]);
                            } else {
                              setSelectedAffectedUsers(selectedAffectedUsers.filter(id => id !== user.id));
                            }
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{user.userName}</p>
                        <p className="text-muted-foreground text-xs">{user.email}</p>
                      </div>
                      <div>
                        <Badge variant={user.riskScore >= 8 ? 'destructive' : user.riskScore >= 6 ? 'secondary' : 'default'}>
                          {user.riskScore}/10
                        </Badge>
                      </div>
                      <div>
                        <div className="flex flex-wrap gap-1">
                          {user.flaggedReasons.map((reason, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-muted-foreground">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </div>
                      <div>
                        <Badge variant={user.mfaStatus === 'enabled' ? 'default' : 'destructive'}>
                          {user.mfaStatus.toUpperCase()}
                        </Badge>
                      </div>
                       <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewUser(user)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMessageUser(user)}
                        >
                          <Mail className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRemoveUser(user.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAffectedUsersModal(false)}>
                Close
              </Button>
              <Button variant="default" onClick={() => exportData('csv')}>
                <Download className="h-4 w-4 mr-2" />
                Export User List
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Weak Entry Points Modal */}
      {showWeakEntryModal && (
        <Dialog open={showWeakEntryModal} onOpenChange={setShowWeakEntryModal}>
          <DialogContent className="max-w-4xl animate-scale-in">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-destructive" />
                Weak Entry Points Analysis
              </DialogTitle>
              <DialogDescription>
                Sessions with vulnerable authentication methods and entry types
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-destructive/10 rounded-lg">
                  <p className="text-2xl font-bold text-destructive">{weakEntryPoints.length}</p>
                  <p className="text-sm text-muted-foreground">Entry Types</p>
                </div>
                <div className="text-center p-4 bg-orange-500/10 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {weakEntryPoints.reduce((sum, point) => sum + point.sessionsAffected, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Sessions Affected</p>
                </div>
                <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">
                    {weakEntryPoints.filter(point => point.riskLevel === 'high').length}
                  </p>
                  <p className="text-sm text-muted-foreground">High Risk Types</p>
                </div>
              </div>

              {/* Entry Points Breakdown */}
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Vulnerable Entry Methods
                </h4>
                <div className="space-y-3">
                  {weakEntryPoints.map((point, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          point.riskLevel === 'high' ? 'bg-red-100 text-red-600' : 
                          'bg-orange-100 text-orange-600'
                        }`}>
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{point.method}</p>
                          <p className="text-sm text-muted-foreground">{point.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{point.sessionsAffected} sessions</p>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            point.riskLevel === 'high' ? 'bg-red-100 text-red-700' : 
                            'bg-orange-100 text-orange-700'
                          }`}>
                            Risk: {point.riskLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Chart Placeholder */}
              <div className="p-6 border rounded-lg bg-muted/30">
                <h4 className="font-semibold mb-4 text-center">Sessions Distribution by Entry Type</h4>
                <div className="space-y-2">
                  {weakEntryPoints.map((point, index) => {
                    const percentage = (point.sessionsAffected / weakEntryPoints.reduce((sum, p) => sum + p.sessionsAffected, 0)) * 100;
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-sm font-medium w-32 truncate">{point.method}</span>
                        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              point.riskLevel === 'high' ? 'bg-red-500' : 
                              'bg-orange-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-16">{Math.round(percentage)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowWeakEntryModal(false)}>
                Close
              </Button>
              <Button variant="outline" onClick={() => exportVulnerableSessionsData()}>
                <Download className="h-4 w-4 mr-2" />
                Export List
              </Button>
              <Button variant="destructive" onClick={() => setShowSessionExpiryModal(true)}>
                <X className="h-4 w-4 mr-2" />
                Force Session Expiry
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Risk Settings Modal */}
      {showRiskSettingsModal && (
        <Dialog open={showRiskSettingsModal} onOpenChange={setShowRiskSettingsModal}>
          <DialogContent className="max-w-4xl animate-scale-in">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Risk Factor Configuration
              </DialogTitle>
              <DialogDescription>
                Adjust weights and enable/disable factors used in risk score calculation
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="space-y-4">
                {riskFactors.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={factor.enabled}
                        onCheckedChange={(checked) => updateRiskFactor(index, 'enabled', checked)}
                      />
                      <div>
                        <p className="font-medium">{factor.name}</p>
                        <p className="text-sm text-muted-foreground">{factor.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Label htmlFor={`weight-${index}`} className="text-sm">Weight:</Label>
                      <Input
                        id={`weight-${index}`}
                        type="number"
                        min="0"
                        max="100"
                        value={factor.weight}
                        onChange={(e) => updateRiskFactor(index, 'weight', parseInt(e.target.value) || 0)}
                        className="w-20"
                        disabled={!factor.enabled}
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Risk Score Preview</h4>
                <p className="text-sm text-muted-foreground">
                  Total weight: {riskFactors.filter(f => f.enabled).reduce((sum, f) => sum + f.weight, 0)}%
                </p>
                {riskFactors.filter(f => f.enabled).reduce((sum, f) => sum + f.weight, 0) !== 100 && (
                  <p className="text-sm text-orange-600 mt-1">
                    ⚠️ Weights should total 100% for accurate scoring
                  </p>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={handleRestoreDefaults}>
                Restore Defaults
              </Button>
              <Button variant="outline" onClick={() => setShowRiskSettingsModal(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={handleSaveRiskSettings}>
                Save Settings
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* User Details Modal */}
      {showUserDetailsModal && selectedUser && (
        <Dialog open={showUserDetailsModal} onOpenChange={setShowUserDetailsModal}>
          <DialogContent className="max-w-4xl animate-scale-in">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                User Security Timeline: {selectedUser.userName}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-destructive">{selectedUser.riskScore}/10</p>
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">{selectedUser.flaggedReasons.length}</p>
                  <p className="text-sm text-muted-foreground">Risk Factors</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Badge variant={selectedUser.mfaStatus === 'enabled' ? 'default' : 'destructive'} className="text-lg px-3 py-1">
                    {selectedUser.mfaStatus.toUpperCase()}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">MFA Status</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Recent Activity Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <div className="flex-1">
                      <p className="font-medium">Location Jump Detected</p>
                      <p className="text-sm text-muted-foreground">Login from London (UK) → New York (US) in 2 hours</p>
                    </div>
                    <span className="text-sm text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Shield className="h-5 w-5 text-red-500" />
                    <div className="flex-1">
                      <p className="font-medium">MFA Bypass Attempt</p>
                      <p className="text-sm text-muted-foreground">Used legacy session to skip MFA prompt</p>
                    </div>
                    <span className="text-sm text-muted-foreground">3 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <div className="flex-1">
                      <p className="font-medium">Time Clustering Event</p>
                      <p className="text-sm text-muted-foreground">5 rapid login attempts within 2 minutes</p>
                    </div>
                    <span className="text-sm text-muted-foreground">6 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUserDetailsModal(false)}>
                Close
              </Button>
              <Button variant="default" onClick={() => handleMessageUser(selectedUser)}>
                <Mail className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedUser && (
        <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
          <DialogContent className="max-w-2xl animate-scale-in">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Send Security Message to {selectedUser.userName}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Message Template</Label>
                <Select value={messageTemplate} onValueChange={setMessageTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {messageTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.content}>
                        {template.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Message Content</Label>
                <Textarea
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  placeholder="Enter your message..."
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMessageModal(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={handleSendMessage}>
                <Mail className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Coverage Details Modal */}
      {showCoverageModal && (
        <Dialog open={showCoverageModal} onOpenChange={setShowCoverageModal}>
          <DialogContent className="max-w-4xl animate-scale-in">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                MFA Coverage Breakdown
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4">Coverage by Role</h4>
                  <div className="space-y-3">
                    {roleStats.map((role, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{role.role}</p>
                          <p className="text-sm text-muted-foreground">{role.mfaEnabled}/{role.totalUsers} users</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{role.coverage}%</p>
                          <Badge variant={role.riskLevel === 'low' ? 'default' : role.riskLevel === 'medium' ? 'secondary' : 'destructive'}>
                            {role.riskLevel}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Trends & Statistics</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">+{trendChange}%</p>
                      <p className="text-sm text-muted-foreground">7-day improvement</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{roleStats.reduce((sum, r) => sum + r.mfaEnabled, 0)}</p>
                      <p className="text-sm text-muted-foreground">Total protected users</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{roleStats.reduce((sum, r) => sum + r.totalUsers - r.mfaEnabled, 0)}</p>
                      <p className="text-sm text-muted-foreground">Users without MFA</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCoverageModal(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Session Expiry Confirmation Modal */}
      {showSessionExpiryModal && (
        <Dialog open={showSessionExpiryModal} onOpenChange={setShowSessionExpiryModal}>
          <DialogContent className="max-w-md animate-scale-in">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Confirm Session Expiry
              </DialogTitle>
              <DialogDescription>
                This will immediately expire all sessions authenticated through these vulnerable entry types.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <p className="text-sm font-medium text-destructive mb-2">⚠️ Warning: This action cannot be undone</p>
                <p className="text-sm text-muted-foreground">
                  All {weakEntryPoints.reduce((sum, point) => sum + point.sessionsAffected, 0)} affected users will be logged out immediately.
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox
                  id="confirm-expiry"
                  checked={confirmSessionExpiry}
                  onCheckedChange={(checked) => setConfirmSessionExpiry(checked === true)}
                />
                <Label htmlFor="confirm-expiry" className="text-sm">
                  ✔ Confirm forced logout of {weakEntryPoints.reduce((sum, point) => sum + point.sessionsAffected, 0)} sessions
                </Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowSessionExpiryModal(false);
                setConfirmSessionExpiry(false);
              }}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleForceSessionExpiry}
                disabled={!confirmSessionExpiry}
              >
                🔴 Confirm & Expire Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}