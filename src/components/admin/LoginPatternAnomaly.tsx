import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { 
  Map, 
  Clock, 
  FileText, 
  Settings, 
  Shield, 
  AlertTriangle, 
  Eye,
  Lock,
  Download,
  Filter,
  TrendingUp,
  Globe,
  Calendar,
  Ban,
  CheckCircle,
  XCircle,
  Loader2,
  ClipboardList,
  Trash,
  Unlock,
  UserX
} from 'lucide-react';

interface LoginAnomaly {
  id: string;
  user: string;
  event: string;
  time: string;
  ip: string;
  device: string;
  location: string;
  riskScore: number;
  flagged: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionTaken?: 'locked' | 'banned' | 'session_expired' | null;
  actionBy?: string | null;
  actionTime?: string | null;
  actionReason?: string | null;
  sessionExpired?: boolean;
  mfaEnabled?: boolean;
  auditLog?: Array<{
    action: string;
    by: string;
    time: string;
    reason?: string;
  }>;
}

interface DetectionRule {
  id: string;
  name: string;
  threshold: number;
  unit: string;
  enabled: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

interface AnomalyStats {
  locationJumps: number;
  timeAnomalies: number;
  riskScoreAvg: number;
  affectedUsers: number;
  totalFlags: number;
  autoFlagsEnabled: boolean;
}

export const LoginPatternAnomaly = () => {
  const [stats, setStats] = useState<AnomalyStats>({
    locationJumps: 3,
    timeAnomalies: 6,
    riskScoreAvg: 71,
    affectedUsers: 12,
    totalFlags: 18,
    autoFlagsEnabled: true
  });

  const [anomalies, setAnomalies] = useState<LoginAnomaly[]>([
    {
      id: '1',
      user: '@mira',
      event: 'Location Jump EU→Asia',
      time: '2h ago',
      ip: '81.15.20.1',
      device: 'iOS',
      location: 'Tokyo, JP',
      riskScore: 87,
      flagged: true,
      severity: 'high',
      actionTaken: null,
      actionBy: null,
      actionTime: null,
      actionReason: null,
      sessionExpired: false,
      mfaEnabled: false,
      auditLog: [
        { action: 'Flagged for location jump', by: 'System', time: '2h ago' },
        { action: 'Manual review initiated', by: 'admin@system.com', time: '1h ago' }
      ]
    },
    {
      id: '2',
      user: '@david',
      event: 'Time Clustering (6x in 2h)',
      time: 'Yesterday',
      ip: '109.4.18.0',
      device: 'Web',
      location: 'London, UK',
      riskScore: 93,
      flagged: true,
      severity: 'critical',
      actionTaken: null,
      actionBy: null,
      actionTime: null,
      actionReason: null,
      sessionExpired: false,
      mfaEnabled: true,
      auditLog: [
        { action: 'Time clustering detected', by: 'System', time: 'Yesterday' }
      ]
    },
    {
      id: '3',
      user: '@sarah',
      event: 'Night Login (02:34 AM)',
      time: '1d ago',
      ip: '192.168.1.1',
      device: 'Mobile',
      location: 'New York, US',
      riskScore: 45,
      flagged: false,
      severity: 'medium',
      actionTaken: null,
      actionBy: null,
      actionTime: null,
      actionReason: null,
      sessionExpired: false,
      mfaEnabled: false,
      auditLog: []
    }
  ]);

  const [detectionRules, setDetectionRules] = useState<DetectionRule[]>([
    {
      id: '1',
      name: 'Location Jump Distance',
      threshold: 500,
      unit: 'km within 10 mins',
      enabled: true,
      severity: 'high',
      description: 'Triggers flag when login locations are far apart'
    },
    {
      id: '2',
      name: 'Night Login Time Window',
      threshold: 6,
      unit: 'hours (00:00-06:00)',
      enabled: true,
      severity: 'medium',
      description: 'Flags logins outside working hours'
    },
    {
      id: '3',
      name: 'Max Logins Per Hour',
      threshold: 5,
      unit: 'logins/hour',
      enabled: true,
      severity: 'high',
      description: 'Triggers clustering anomaly detection'
    },
    {
      id: '4',
      name: 'Auto Ban Threshold',
      threshold: 5,
      unit: 'violations',
      enabled: false,
      severity: 'critical',
      description: 'Auto-suspend account after violations'
    }
  ]);

  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showEventHistory, setShowEventHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLockConfirmation, setShowLockConfirmation] = useState(false);
  const [showUserHistory, setShowUserHistory] = useState(false);
  const [showLockSession, setShowLockSession] = useState(false);
  const [showBanUser, setShowBanUser] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [showForceExpiry, setShowForceExpiry] = useState(false);
  const [showUnlockUser, setShowUnlockUser] = useState(false);
  const [showUnbanUser, setShowUnbanUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<LoginAnomaly | null>(null);
  const [banReason, setBanReason] = useState('');
  const [unlockReason, setUnlockReason] = useState('');
  const [unbanReason, setUnbanReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);
  const [notes, setNotes] = useState<Record<string, Array<{
    id: string;
    content: string;
    adminEmail: string;
    timestamp: string;
  }>>>({
    // Initialize with some sample notes for testing
    '1': [
      {
        id: 'note1',
        content: 'Initial security review completed. User flagged for unusual login pattern.',
        adminEmail: 'andi.mekrizvani@hotmail.com',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ]
  });

  // Filter states
  const [filters, setFilters] = useState({
    riskLevel: '',
    deviceType: '', 
    anomalyType: '',
    timeRange: ''
  });
  const [filteredAnomalies, setFilteredAnomalies] = useState<LoginAnomaly[]>(anomalies);

  // Apply filters when filters change
  useEffect(() => {
    let filtered = anomalies;
    
    if (filters.riskLevel) {
      filtered = filtered.filter(anomaly => {
        if (filters.riskLevel === 'high') return anomaly.riskScore >= 70;
        if (filters.riskLevel === 'medium') return anomaly.riskScore >= 40 && anomaly.riskScore < 70;
        if (filters.riskLevel === 'low') return anomaly.riskScore < 40;
        return true;
      });
    }
    
    if (filters.deviceType) {
      filtered = filtered.filter(anomaly => 
        anomaly.device.toLowerCase().includes(filters.deviceType.toLowerCase())
      );
    }
    
    if (filters.anomalyType) {
      filtered = filtered.filter(anomaly => 
        anomaly.event.toLowerCase().includes(filters.anomalyType.toLowerCase())
      );
    }
    
    if (filters.timeRange) {
      // Simple time range filter (would be more complex in real app)
      const now = new Date();
      filtered = filtered.filter(anomaly => {
        if (filters.timeRange === 'today') return anomaly.time.includes('ago');
        if (filters.timeRange === '24h') return true; // All current data is within 24h
        if (filters.timeRange === '7d') return true; // All current data is within 7d
        return true;
      });
    }
    
    setFilteredAnomalies(filtered);
  }, [filters, anomalies]);

  const handleApplyFilters = () => {
    setShowFilterModal(false);
    toast({
      title: "Filters Applied",
      description: `${filteredAnomalies.length} anomalies match your criteria.`,
    });
  };

  const handleClearFilters = () => {
    setFilters({
      riskLevel: '',
      deviceType: '',
      anomalyType: '',
      timeRange: ''
    });
    setFilteredAnomalies(anomalies); // Reset to show all
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset.",
    });
  };

  // Export functionality
  const handleExport = () => {
    const csvData = filteredAnomalies.map(anomaly => ({
      User: anomaly.user,
      Event: anomaly.event,
      Time: anomaly.time,
      IP: anomaly.ip,
      Device: anomaly.device,
      Location: anomaly.location,
      'Risk Score': anomaly.riskScore,
      Severity: anomaly.severity,
      Flagged: anomaly.flagged ? 'Yes' : 'No',
      'Action Taken': anomaly.actionTaken || 'None',
      'Action By': anomaly.actionBy || '',
      'Action Time': anomaly.actionTime || '',
      'Action Reason': anomaly.actionReason || ''
    }));

    const csvContent = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `login-anomalies-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Exported ${filteredAnomalies.length} anomaly records to CSV.`,
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-red-400 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleSendAlert = () => {
    toast({
      title: "Admin Alert Sent",
      description: `Security alert sent to all administrators about ${stats.totalFlags} anomaly flags.`,
    });
  };

  const handleAutoFlag = (anomalyId: string) => {
    toast({
      title: "Auto-Flag Applied",
      description: "User session has been flagged for review.",
    });
  };

  const handleUpdateRule = (ruleId: string, updates: Partial<DetectionRule>) => {
    setDetectionRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, ...updates } : rule
      )
    );
    toast({
      title: "Detection Rule Updated",
      description: "Rule settings have been saved successfully.",
    });
  };

  const handleLockAllFlagged = async () => {
    try {
      // Get affected sessions (flagged anomalies)
      const flaggedSessions = anomalies.filter(anomaly => anomaly.flagged);
      const sessionCount = flaggedSessions.length;
      
      // Simulate backend API call to invalidate sessions
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call backend endpoint to expire sessions (simulated)
      console.log('Backend call: expireSessionsForUsers', {
        userIds: flaggedSessions.map(session => session.id),
        reason: 'Security anomaly detected',
        timestamp: new Date().toISOString()
      });
      
      // Update local state to reflect locked sessions
      setStats(prev => ({ ...prev, totalFlags: 0 }));
      setShowLockConfirmation(false);
      
      // Log the security action
      console.log('Security action logged:', {
        action: 'mass_session_lock',
        affected_users: sessionCount,
        admin_id: 'current_admin_id',
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Sessions Locked Successfully",
        description: `All ${sessionCount} flagged sessions have been force-expired and users logged out.`,
      });
    } catch (error) {
      toast({
        title: "Lock Failed", 
        description: "Failed to lock sessions. Please try again or check logs.",
      });
    }
  };

  const handleViewUserHistory = (user: LoginAnomaly) => {
    setSelectedUser(user);
    setShowUserHistory(true);
  };

  const handleLockSession = (user: LoginAnomaly) => {
    setSelectedUser(user);
    setShowLockSession(true);
  };

  const handleBanUser = (user: LoginAnomaly) => {
    setSelectedUser(user);
    setShowBanUser(true);
  };

  const confirmLockSession = async () => {
    try {
      // Simulate backend API call to invalidate session token
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const currentTime = new Date().toISOString();
      const adminEmail = 'andi.mekrizvani@hotmail.com'; // Current admin
      
      // Update anomaly state with lock action
      setAnomalies(prev => prev.map(anomaly => 
        anomaly.id === selectedUser?.id 
          ? { 
              ...anomaly, 
              actionTaken: 'locked' as const,
              actionBy: adminEmail,
              actionTime: currentTime,
              actionReason: 'Manual admin lock due to anomaly'
            }
          : anomaly
      ));
      
      // Log the security action to backend
      console.log('Backend call: lockUserSession', {
        userId: selectedUser?.id,
        userHandle: selectedUser?.user,
        ip: selectedUser?.ip,
        device: selectedUser?.device,
        reason: 'Manual admin lock due to anomaly',
        adminId: 'current_admin_id',
        actionBy: adminEmail,
        timestamp: currentTime
      });
      
      // Update session state in database (simulated)
      console.log('Session status updated to LOCKED in database');
      
      // Save to audit log
      console.log('Audit log entry created:', {
        action: 'session_locked',
        target_user: selectedUser?.user,
        admin_user: adminEmail,
        timestamp: currentTime
      });
      
      setShowLockSession(false);
      toast({
        title: "Session Locked Successfully",
        description: `${selectedUser?.user}'s session has been invalidated and they've been logged out.`,
      });
    } catch (error) {
      toast({
        title: "Lock Failed",
        description: "Failed to lock session. Please check logs and try again.",
      });
    }
  };

  const confirmBanUser = async () => {
    if (!banReason.trim()) {
      toast({
        title: "Ban Reason Required",
        description: "Please provide a reason for banning this user.",
      });
      return;
    }

    try {
      // Simulate backend API call to suspend account
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const currentTime = new Date().toISOString();
      const adminEmail = 'andi.mekrizvani@hotmail.com'; // Current admin
      
      // Update anomaly state with ban action
      setAnomalies(prev => prev.map(anomaly => 
        anomaly.id === selectedUser?.id 
          ? { 
              ...anomaly, 
              actionTaken: 'banned' as const,
              actionBy: adminEmail,
              actionTime: currentTime,
              actionReason: banReason
            }
          : anomaly
      ));
      
      // Log the ban action to backend
      console.log('Backend call: banUserAccount', {
        userId: selectedUser?.id,
        userHandle: selectedUser?.user,
        ip: selectedUser?.ip,
        device: selectedUser?.device,
        banReason: banReason,
        adminId: 'current_admin_id',
        actionBy: adminEmail,
        timestamp: currentTime
      });
      
      // Update user account status in database (simulated)
      console.log('User account status updated:', {
        accountStatus: 'suspended',
        banReason: banReason,
        bannedAt: currentTime,
        bannedBy: adminEmail
      });
      
      // Save to ban audit log
      console.log('Ban audit log entry created:', {
        action: 'user_banned',
        target_user: selectedUser?.user,
        admin_user: adminEmail,
        reason: banReason,
        timestamp: currentTime
      });
      
      // Invalidate all user sessions
      console.log('All user sessions invalidated for banned user');
      
      setShowBanUser(false);
      setBanReason('');
      toast({
        title: "User Account Suspended",
        description: `${selectedUser?.user} has been permanently banned. All sessions terminated.`,
      });
    } catch (error) {
      toast({
        title: "Ban Failed",
        description: "Failed to ban user. Please check logs and try again.",
      });
    }
  };

  // Force Session Expiry functionality
  const handleForceExpiry = async () => {
    try {
      setIsProcessing(true);
      
      // Get vulnerable sessions (example: high risk or flagged sessions)
      const vulnerableSessions = anomalies.filter(anomaly => 
        anomaly.riskScore >= 70 || anomaly.flagged
      );
      const affectedUserIds = vulnerableSessions.map(session => session.id);
      
      if (affectedUserIds.length === 0) {
        toast({
          title: "No Vulnerable Sessions",
          description: "No high-risk sessions found to expire.",
        });
        setIsProcessing(false);
        return;
      }

      // Simulate backend API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update sessions as expired
      setAnomalies(prev => prev.map(anomaly => 
        affectedUserIds.includes(anomaly.id)
          ? { 
              ...anomaly, 
              actionTaken: 'session_expired' as const,
              actionBy: 'andi.mekrizvani@hotmail.com',
              actionTime: new Date().toISOString(),
              actionReason: 'Force expired due to security vulnerability',
              sessionExpired: true
            }
          : anomaly
      ));

      // Log the mass expiry action
      console.log('Backend call: forceExpireSessions', {
        affectedUserIds,
        reason: 'Mass security expiry due to vulnerability',
        adminId: 'current_admin_id',
        timestamp: new Date().toISOString()
      });

      setShowForceExpiry(false);
      setIsProcessing(false);
      
      toast({
        title: "Sessions Force-Expired",
        description: `Successfully expired ${affectedUserIds.length} vulnerable sessions.`,
      });
      
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Force Expiry Failed",
        description: "Failed to expire sessions. Please try again or check logs.",
      });
    }
  };

  // Enhanced user audit functionality
  const handleViewAuditLog = (user: LoginAnomaly) => {
    setSelectedUser(user);
    setShowAuditLog(true);
  };

  // Unlock functionality - only for super admins
  const handleUnlockUser = (user: LoginAnomaly) => {
    setSelectedUser(user);
    setShowUnlockUser(true);
  };

  const confirmUnlockUser = async () => {
    try {
      const currentTime = new Date().toISOString();
      const adminEmail = 'andi.mekrizvani@hotmail.com'; // Current admin
      
      // Update anomaly state - remove lock
      setAnomalies(prev => prev.map(anomaly => 
        anomaly.id === selectedUser?.id 
          ? { 
              ...anomaly, 
              actionTaken: null,
              actionBy: null,
              actionTime: null,
              actionReason: null
            }
          : anomaly
      ));
      
      // Log the unlock action to backend
      console.log('Backend call: unlockUserSession', {
        userId: selectedUser?.id,
        userHandle: selectedUser?.user,
        reason: unlockReason || 'Manual unlock by admin',
        adminId: 'current_admin_id',
        actionBy: adminEmail,
        timestamp: currentTime
      });
      
      setShowUnlockUser(false);
      setUnlockReason('');
      toast({
        title: "User Unlocked Successfully",
        description: `${selectedUser?.user} has been unlocked and can now log in normally.`,
      });
    } catch (error) {
      toast({
        title: "Unlock Failed",
        description: "Failed to unlock user. Please check logs and try again.",
      });
    }
  };

  // Unban functionality - only for super admins  
  const handleUnbanUser = (user: LoginAnomaly) => {
    setSelectedUser(user);
    setShowUnbanUser(true);
  };

  const confirmUnbanUser = async () => {
    try {
      const currentTime = new Date().toISOString();
      const adminEmail = 'andi.mekrizvani@hotmail.com'; // Current admin
      
      // Update anomaly state - remove ban
      setAnomalies(prev => prev.map(anomaly => 
        anomaly.id === selectedUser?.id 
          ? { 
              ...anomaly, 
              actionTaken: null,
              actionBy: null,
              actionTime: null,
              actionReason: null
            }
          : anomaly
      ));
      
      // Log the unban action to backend
      console.log('Backend call: unbanUserAccount', {
        userId: selectedUser?.id,
        userHandle: selectedUser?.user,
        reason: unbanReason || 'Manual unban by admin',
        adminId: 'current_admin_id',
        actionBy: adminEmail,
        timestamp: currentTime
      });
      
      setShowUnbanUser(false);
      setUnbanReason('');
      toast({
        title: "User Unbanned Successfully",
        description: `${selectedUser?.user} has been unbanned and account access restored.`,
      });
    } catch (error) {
      toast({
        title: "Unban Failed",
        description: "Failed to unban user. Please check logs and try again.",
      });
    }
  };

  // Notes functionality
  const handleAddNote = () => {
    if (!newNote.trim() || !selectedUser) {
      toast({
        title: "❌ Cannot Add Note",
        description: "Please enter a note before saving.",
      });
      return;
    }

    const noteId = `note_${Date.now()}`;
    const note = {
      id: noteId,
      content: newNote.trim(),
      adminEmail: 'andi.mekrizvani@hotmail.com',
      timestamp: new Date().toISOString()
    };

    console.log('Adding note for user:', selectedUser.id, 'Note:', note);

    // Update notes state
    setNotes(prev => {
      const updated = {
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] || []), note]
      };
      console.log('Updated notes state:', updated);
      return updated;
    });

    setNewNote('');
    setShowAddNote(false);
    
    toast({
      title: "✅ Note Added Successfully",
      description: `Admin note saved for ${selectedUser.user}. Note indicator (📝) now visible in table.`,
    });
  };

  const handleDeleteNote = (noteId: string) => {
    if (!selectedUser) return;

    setNotes(prev => ({
      ...prev,
      [selectedUser.id]: (prev[selectedUser.id] || []).filter(note => note.id !== noteId)
    }));

    // Force re-render to update note indicator
    setAnomalies(prev => [...prev]);

    toast({
      title: "🗑️ Note Deleted",
      description: `Admin note removed. ${notes[selectedUser.id]?.length === 1 ? 'Note indicator (📝) will be hidden.' : 'Remaining notes still visible.'}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">Location Jumps</p>
              <p className="text-2xl font-bold text-orange-800">{stats.locationJumps}</p>
              <p className="text-xs text-orange-500">detected</p>
            </div>
            <Map className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Time Clustering</p>
              <p className="text-2xl font-bold text-yellow-800">{stats.timeAnomalies}</p>
              <p className="text-xs text-yellow-500">flagged in 24h</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Risk Score Avg</p>
              <p className="text-2xl font-bold text-red-800">{stats.riskScoreAvg}</p>
              <p className="text-xs text-red-500">High Risk</p>
            </div>
            <TrendingUp className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Affected Users</p>
              <p className="text-2xl font-bold text-blue-800">{stats.affectedUsers}</p>
              <p className="text-xs text-blue-500">total flagged</p>
            </div>
            <Shield className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {stats.riskScoreAvg > 70 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">
                ⚠️ High Risk Alert — Average risk score is {stats.riskScoreAvg}% (above 70% threshold)
              </p>
              <p className="text-red-600 text-sm">
                {stats.affectedUsers} users showing anomalous login patterns. Immediate review recommended.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSendAlert}
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              Alert Admins
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Dialog open={showHeatmap} onOpenChange={setShowHeatmap}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>View Heatmap</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>🗺️ Global Login Heatmap</DialogTitle>
            </DialogHeader>
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center relative">
              <div className="text-center">
                <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive world map with {stats.locationJumps} anomalous login zones</p>
                <p className="text-sm text-gray-500">Tokyo (JP), London (UK), New York (US)</p>
                <div className="mt-4 flex justify-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-xs">High Risk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs">Medium Risk</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs">Low Risk</span>
                  </div>
                </div>
              </div>
              {/* Simulated map pins */}
              <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showTimeline} onOpenChange={setShowTimeline}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>View Timeline</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>⏱️ 24-Hour Login Pattern</DialogTitle>
            </DialogHeader>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center relative">
              <div className="absolute inset-4 border-2 border-dashed border-gray-300 rounded-full"></div>
              <div className="absolute inset-8 border border-gray-200 rounded-full"></div>
              <div className="text-center z-10">
                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">24-Hour Login Pattern</p>
                <p className="text-xs text-gray-500">Peak: 14:00-16:00 (87 logins)</p>
                <p className="text-xs text-gray-500">Low: 02:00-04:00 (3 logins)</p>
              </div>
              
              {/* Simulated clock markers */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">00</div>
              <div className="absolute top-1/2 right-2 transform -translate-y-1/2 text-xs text-gray-600">06</div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">12</div>
              <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-xs text-gray-600">18</div>
              
              {/* Simulated activity bars */}
              <div className="absolute top-8 left-1/2 w-1 h-6 bg-green-400 transform -translate-x-1/2"></div>
              <div className="absolute top-1/2 right-8 w-6 h-1 bg-red-500 transform -translate-y-1/2"></div>
              <div className="absolute bottom-8 left-1/2 w-1 h-8 bg-yellow-500 transform -translate-x-1/2"></div>
              <div className="absolute top-1/2 left-8 w-4 h-1 bg-blue-400 transform -translate-y-1/2"></div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showEventHistory} onOpenChange={setShowEventHistory}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Event History</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>📁 Login Anomaly Event History</DialogTitle>
            </DialogHeader>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {/* Quick Filter Presets */}
                    <div className="flex space-x-2 mr-4">
                      <Button 
                        variant={filters.riskLevel === 'high' ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setFilters(prev => ({ ...prev, riskLevel: filters.riskLevel === 'high' ? '' : 'high' }))}
                      >
                        🔴 Critical
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const lockedUsers = anomalies.filter(a => a.actionTaken === 'locked');
                          setFilteredAnomalies(lockedUsers);
                          toast({ title: "Filter Applied", description: `Showing ${lockedUsers.length} locked users.` });
                        }}
                      >
                        🔒 Locked Only
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const bannedUsers = anomalies.filter(a => a.actionTaken === 'banned');
                          setFilteredAnomalies(bannedUsers);
                          toast({ title: "Filter Applied", description: `Showing ${bannedUsers.length} banned users.` });
                        }}
                      >
                        🚫 Banned Only
                      </Button>
                    </div>
                    
                    <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Advanced Filter {filters.riskLevel || filters.deviceType || filters.anomalyType || filters.timeRange ? `(${Object.values(filters).filter(Boolean).length})` : ''}
                        </Button>
                      </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>🔍 Filter Login Anomalies</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Risk Level</Label>
                          <select 
                            className="w-full p-2 border rounded-md bg-background"
                            value={filters.riskLevel}
                            onChange={(e) => setFilters(prev => ({ ...prev, riskLevel: e.target.value }))}
                          >
                            <option value="">All Risk Levels</option>
                            <option value="high">High (70+)</option>
                            <option value="medium">Medium (40-69)</option>
                            <option value="low">Low (&lt;40)</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label>Device Type</Label>
                          <select 
                            className="w-full p-2 border rounded-md bg-background"
                            value={filters.deviceType}
                            onChange={(e) => setFilters(prev => ({ ...prev, deviceType: e.target.value }))}
                          >
                            <option value="">All Devices</option>
                            <option value="ios">iOS</option>
                            <option value="web">Web</option>
                            <option value="android">Android</option>
                            <option value="mobile">Mobile</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label>Anomaly Type</Label>
                          <select 
                            className="w-full p-2 border rounded-md bg-background"
                            value={filters.anomalyType}
                            onChange={(e) => setFilters(prev => ({ ...prev, anomalyType: e.target.value }))}
                          >
                            <option value="">All Anomaly Types</option>
                            <option value="location">Location Jump</option>
                            <option value="time">Time Clustering</option>
                            <option value="night">Night Login</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label>Time Range</Label>
                          <select 
                            className="w-full p-2 border rounded-md bg-background"
                            value={filters.timeRange}
                            onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value }))}
                          >
                            <option value="">All Time</option>
                            <option value="today">Today</option>
                            <option value="24h">Last 24 Hours</option>
                            <option value="7d">Last 7 Days</option>
                          </select>
                        </div>

                        <div className="flex space-x-2 pt-4">
                          <Button variant="outline" onClick={handleClearFilters} className="flex-1">
                            Clear All
                          </Button>
                          <Button onClick={handleApplyFilters} className="flex-1">
                            Apply Filters
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export ({filteredAnomalies.length})
                  </Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnomalies.map((anomaly) => (
                    <TableRow 
                      key={anomaly.id} 
                      className={`relative ${
                        anomaly.severity === 'critical' ? 'border-l-4 border-l-red-500 bg-red-50/50' :
                        anomaly.severity === 'high' ? 'border-l-4 border-l-orange-500 bg-orange-50/50' :
                        anomaly.severity === 'medium' ? 'border-l-4 border-l-yellow-500 bg-yellow-50/50' :
                        'border-l-4 border-l-green-500 bg-green-50/50'
                      }`}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span>{anomaly.user}</span>
                          {(() => {
                            const userNotes = notes[anomaly.id];
                            console.log(`Notes for user ${anomaly.user} (ID: ${anomaly.id}):`, userNotes);
                            return userNotes && userNotes.length > 0 ? (
                              <div 
                                className="text-blue-600 hover:text-blue-800 cursor-pointer text-sm bg-blue-50 px-2 py-1 rounded"
                                title={`${userNotes.length} admin note(s) available - Click audit log to view`}
                                onClick={() => handleViewAuditLog(anomaly)}
                              >
                                📝 {userNotes.length}
                              </div>
                            ) : null;
                          })()}
                        </div>
                      </TableCell>
                      <TableCell>{anomaly.event}</TableCell>
                      <TableCell>{anomaly.time}</TableCell>
                      <TableCell className="font-mono text-sm">{anomaly.ip}</TableCell>
                      <TableCell>{anomaly.device}</TableCell>
                      <TableCell>
                        <span className={`font-bold ${getRiskScoreColor(anomaly.riskScore)}`}>
                          {anomaly.riskScore}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2">
                            <Badge className={getSeverityColor(anomaly.severity)}>
                              {anomaly.severity}
                            </Badge>
                            {/* Severity Indicator Dot */}
                            <div className={`w-2 h-2 rounded-full ${
                              anomaly.severity === 'critical' ? 'bg-red-500' :
                              anomaly.severity === 'high' ? 'bg-orange-500' :
                              anomaly.severity === 'medium' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}></div>
                          </div>
                          
                          {anomaly.actionTaken === 'locked' && (
                            <div className="flex flex-col space-y-1">
                              <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-300">
                                🔒 Locked
                              </Badge>
                              {anomaly.actionBy && (
                                <div className="text-xs text-gray-600">
                                  by {anomaly.actionBy}
                                  {anomaly.actionTime && (
                                    <div className="text-xs text-gray-500">
                                      {new Date(anomaly.actionTime).toLocaleString()}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {anomaly.actionTaken === 'banned' && (
                            <div className="flex flex-col space-y-1">
                              <Badge variant="destructive" className="bg-red-600 text-white">
                                🚫 Banned
                              </Badge>
                              {anomaly.actionBy && (
                                <div className="text-xs text-gray-600">
                                  by {anomaly.actionBy}
                                  {anomaly.actionTime && (
                                    <div className="text-xs text-gray-500">
                                      {new Date(anomaly.actionTime).toLocaleString()}
                                    </div>
                                  )}
                                  {anomaly.actionReason && (
                                    <div className="text-xs text-gray-500 italic">
                                      "{anomaly.actionReason}"
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {anomaly.actionTaken === 'session_expired' && (
                            <div className="flex flex-col space-y-1">
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
                                ⚠️ Session Expired
                              </Badge>
                              {anomaly.actionBy && (
                                <div className="text-xs text-gray-600">
                                  by {anomaly.actionBy}
                                  {anomaly.actionTime && (
                                    <div className="text-xs text-gray-500">
                                      {new Date(anomaly.actionTime).toLocaleString()}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {anomaly.actionTaken === 'banned' ? (
                          <div className="flex items-center space-x-2">
                            <div className="text-sm text-red-600 font-medium">User Banned</div>
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnbanUser(anomaly)}
                              title="Unban User - Super Admin Only"
                              className="text-green-600 hover:text-green-800 border-green-300 hover:bg-green-50"
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Unban
                            </Button>
                            {/* Always show audit log button for banned users */}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewAuditLog(anomaly)}
                              title="📋 View complete audit log and notes"
                              className="hover:bg-gray-50 relative"
                            >
                              <ClipboardList className="h-4 w-4" />
                              {notes[anomaly.id]?.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                  📝
                                </span>
                              )}
                            </Button>
                          </div>
                        ) : anomaly.actionTaken === 'locked' ? (
                          <div className="flex items-center space-x-2">
                            <div className="text-sm text-orange-600 font-medium">Session Locked</div>
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnlockUser(anomaly)}
                              title="Unlock User - Super Admin Only"
                              className="text-blue-600 hover:text-blue-800 border-blue-300 hover:bg-blue-50"
                            >
                              <Unlock className="h-4 w-4 mr-1" />
                              Unlock
                            </Button>
                            {/* Always show audit log button for locked users */}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewAuditLog(anomaly)}
                              title="📋 View complete audit log and notes"
                              className="hover:bg-gray-50 relative"
                            >
                              <ClipboardList className="h-4 w-4" />
                              {notes[anomaly.id]?.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                  📝
                                </span>
                              )}
                            </Button>
                          </div>
                        ) : (
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewUserHistory(anomaly)}
                              title="👁️ View user session details and history"
                              className="hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleLockSession(anomaly)}
                              title="🔒 Lock user session (force logout)"
                              className="hover:bg-yellow-50"
                            >
                              <Lock className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleBanUser(anomaly)}
                              title="🚫 Ban user account (permanent suspension)"
                              className="hover:bg-red-50"
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewAuditLog(anomaly)}
                              title="📋 View complete audit log and action history"
                              className="hover:bg-gray-50 relative"
                            >
                              <ClipboardList className="h-4 w-4" />
                              {notes[anomaly.id]?.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                  📝
                                </span>
                              )}
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>⚙️ Detection Rule Configuration</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {detectionRules.map((rule) => (
                <div key={rule.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{rule.name}</h4>
                      <p className="text-sm text-gray-600">{rule.description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getSeverityColor(rule.severity)}>
                        {rule.severity}
                      </Badge>
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={(enabled) => handleUpdateRule(rule.id, { enabled })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`threshold-${rule.id}`}>Threshold</Label>
                      <Input
                        id={`threshold-${rule.id}`}
                        type="number"
                        value={rule.threshold}
                        onChange={(e) => handleUpdateRule(rule.id, { threshold: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Input value={rule.unit} disabled />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Rules Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-3">Active Detection Rules</h4>
        <div className="space-y-2">
          {detectionRules.filter(rule => rule.enabled).map((rule) => (
            <div key={rule.id} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {rule.name}: &gt;{rule.threshold} {rule.unit}
              </span>
              <Badge variant="outline" className={getSeverityColor(rule.severity)}>
                {rule.severity}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button 
          variant={stats.autoFlagsEnabled ? "default" : "outline"}
          onClick={() => setStats(prev => ({ ...prev, autoFlagsEnabled: !prev.autoFlagsEnabled }))}
        >
          {stats.autoFlagsEnabled ? "Auto-Flag Enabled" : "Enable Auto-Flag"}
        </Button>
        <Button variant="outline" onClick={handleSendAlert}>
          Send Alert to Admin
        </Button>
        <Dialog open={showLockConfirmation} onOpenChange={setShowLockConfirmation}>
          <DialogTrigger asChild>
            <Button variant="destructive">
              Lock All Flagged Sessions
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>🔒 Confirm Session Lock</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-red-800">Force-expire all {stats.totalFlags} flagged sessions?</p>
                  <p className="text-sm text-red-600">This will immediately log out all affected users and invalidate their tokens.</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="confirm-lock" className="rounded" />
                <label htmlFor="confirm-lock" className="text-sm">
                  Yes, I understand this will log out all affected users
                </label>
              </div>
              <div className="flex space-x-3 pt-4">
                <Button 
                  variant="destructive" 
                  onClick={handleLockAllFlagged}
                  className="flex-1"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Force Expire Now
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowLockConfirmation(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Force Session Expiry Modal */}
        <Dialog open={showForceExpiry} onOpenChange={setShowForceExpiry}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="ml-3">
              <Trash className="h-4 w-4 mr-2" />
              Force Session Expiry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>⚠️ Force Session Expiry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-red-800">Force-expire all vulnerable sessions?</p>
                  <p className="text-sm text-red-600">This will invalidate all high-risk and flagged sessions immediately.</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                <p><strong>Affected Sessions:</strong> High risk (70+ score) and flagged anomalies</p>
                <p><strong>Action:</strong> All tokens will be invalidated and users logged out</p>
                <p><strong>Notification:</strong> Users will receive security alert emails</p>
              </div>
              <div className="flex space-x-3 pt-4">
                <Button 
                  variant="destructive" 
                  onClick={handleForceExpiry}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Trash className="h-4 w-4 mr-2" />
                      Force Expire Now
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowForceExpiry(false)}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* User History Modal */}
      <Dialog open={showUserHistory} onOpenChange={setShowUserHistory}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>👤 User Session History - {selectedUser?.user}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Action Status Alert */}
            {selectedUser?.actionTaken && (
              <div className={`p-4 rounded-lg border ${
                selectedUser.actionTaken === 'banned' 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center space-x-3">
                  {selectedUser.actionTaken === 'banned' ? (
                    <Ban className="h-5 w-5 text-red-500" />
                  ) : (
                    <Lock className="h-5 w-5 text-yellow-600" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${
                      selectedUser.actionTaken === 'banned' ? 'text-red-800' : 'text-yellow-800'
                    }`}>
                      {selectedUser.actionTaken === 'banned' ? 'This account is banned' : 'This user is currently locked'}
                    </p>
                    <div className="text-sm space-y-1 mt-2">
                      <p><strong>Action Taken:</strong> {selectedUser.actionTaken === 'banned' ? 'Account Suspended' : 'Session Locked'}</p>
                      <p><strong>By Admin:</strong> {selectedUser.actionBy}</p>
                      <p><strong>Time:</strong> {selectedUser.actionTime ? new Date(selectedUser.actionTime).toLocaleString() : 'N/A'}</p>
                      {selectedUser.actionReason && (
                        <p><strong>Reason:</strong> {selectedUser.actionReason}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Recent Activity</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Current IP:</span>
                  <span className="font-mono">{selectedUser?.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span>{selectedUser?.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Device:</span>
                  <span>{selectedUser?.device}</span>
                </div>
                <div className="flex justify-between">
                  <span>Risk Score:</span>
                  <span className={`font-bold ${getRiskScoreColor(selectedUser?.riskScore || 0)}`}>
                    {selectedUser?.riskScore}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium mb-2">Session Timeline</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Login from London, UK - 2 hours ago</p>
                <p>• Location jump detected - 1.5 hours ago</p>
                <p>• Current session from {selectedUser?.location} - {selectedUser?.actionTaken === 'banned' ? 'Terminated (Banned)' : selectedUser?.actionTaken === 'locked' ? 'Locked' : 'Active'}</p>
                {selectedUser?.actionTaken && (
                  <p className="text-red-600">• Admin action taken - {selectedUser.actionTime ? new Date(selectedUser.actionTime).toLocaleString() : 'Recently'}</p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lock Session Modal */}
      <Dialog open={showLockSession} onOpenChange={setShowLockSession}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🔒 Lock User Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Lock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Lock session for {selectedUser?.user}?</p>
                <p className="text-sm text-yellow-600">This will immediately terminate their current session.</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="destructive" 
                onClick={confirmLockSession}
                className="flex-1"
              >
                <Lock className="h-4 w-4 mr-2" />
                Lock Session
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowLockSession(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ban User Modal */}
      <Dialog open={showBanUser} onOpenChange={setShowBanUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🚫 Ban User Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <Ban className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-medium text-red-800">Suspend account for {selectedUser?.user}?</p>
                <p className="text-sm text-red-600">This action will permanently disable their account access.</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ban-reason">Reason for ban (required)</Label>
              <Input
                id="ban-reason"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="e.g., Suspicious login activity, Security violation..."
              />
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="destructive" 
                onClick={confirmBanUser}
                className="flex-1"
                disabled={!banReason.trim()}
              >
                <Ban className="h-4 w-4 mr-2" />
                Confirm Ban
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowBanUser(false);
                  setBanReason('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unlock User Modal */}
      <Dialog open={showUnlockUser} onOpenChange={setShowUnlockUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🔓 Unlock User Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Unlock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Unlock session for {selectedUser?.user}?</p>
                <p className="text-sm text-blue-600">This will restore normal login access for this user.</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unlock-reason">Reason for unlock (optional)</Label>
              <Input
                id="unlock-reason"
                value={unlockReason}
                onChange={(e) => setUnlockReason(e.target.value)}
                placeholder="e.g., False positive, Manual override..."
              />
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Super Admin Only:</strong> Only Super Administrators can unlock users.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="default" 
                onClick={confirmUnlockUser}
                className="flex-1"
              >
                <Unlock className="h-4 w-4 mr-2" />
                Unlock User
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowUnlockUser(false);
                  setUnlockReason('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unban User Modal */}
      <Dialog open={showUnbanUser} onOpenChange={setShowUnbanUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🔓 Unban User Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <UserX className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Restore account access for {selectedUser?.user}?</p>
                <p className="text-sm text-green-600">This will completely reinstate their account and login privileges.</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unban-reason">Reason for unban (optional)</Label>
              <Input
                id="unban-reason"
                value={unbanReason}
                onChange={(e) => setUnbanReason(e.target.value)}
                placeholder="e.g., False positive, Appeal approved..."
              />
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Super Admin Only:</strong> Only Super Administrators can unban users.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="default" 
                onClick={confirmUnbanUser}
                className="flex-1"
              >
                <UserX className="h-4 w-4 mr-2" />
                Unban User
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowUnbanUser(false);
                  setUnbanReason('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Audit Log Modal */}
      <Dialog open={showAuditLog} onOpenChange={setShowAuditLog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              User Action History — @{selectedUser?.user}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Event Summary */}
            <div className="bg-muted/50 p-4 rounded-lg border">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Event Summary
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Event Type</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser?.event}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Risk Score</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      selectedUser?.severity === 'critical' ? 'destructive' :
                      selectedUser?.severity === 'high' ? 'secondary' :
                      selectedUser?.severity === 'medium' ? 'outline' : 'default'
                    }>
                      {selectedUser?.riskScore}% {selectedUser?.severity?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Time & Device</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser?.time}</p>
                  <p className="text-xs text-muted-foreground">{selectedUser?.device}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">IP Address & Location</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser?.ip}</p>
                  <p className="text-xs text-muted-foreground">{selectedUser?.location}</p>
                </div>
              </div>
            </div>

            {/* Admin Actions History */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin Actions History
              </h3>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Admin</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedUser?.actionTaken ? (
                      <TableRow>
                        <TableCell className="font-medium">
                          {selectedUser.actionBy || 'System'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            selectedUser.actionTaken === 'banned' ? 'destructive' :
                            selectedUser.actionTaken === 'locked' ? 'secondary' :
                            selectedUser.actionTaken === 'session_expired' ? 'outline' : 'default'
                          }>
                            {selectedUser.actionTaken === 'banned' ? '🚫 Banned' :
                             selectedUser.actionTaken === 'locked' ? '🔒 Locked' :
                             selectedUser.actionTaken === 'session_expired' ? '⚠️ Session Expired' :
                             selectedUser.actionTaken}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {selectedUser.actionTime || 'N/A'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {selectedUser.actionReason || 'No reason provided'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No admin actions recorded for this user
                        </TableCell>
                      </TableRow>
                    )}
                    
                    {/* Example of additional historical actions */}
                    <TableRow className="bg-muted/20">
                      <TableCell className="font-medium">@system</TableCell>
                      <TableCell>
                        <Badge variant="outline">🚨 Event Detected</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {selectedUser?.time}
                      </TableCell>
                      <TableCell className="text-sm">
                        Anomaly flagged by automated system
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Session Timeline */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Session Activity
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded border-l-4 border-yellow-500">
                  <div>
                    <p className="text-sm font-medium">🚨 Anomaly Detected</p>
                    <p className="text-xs text-muted-foreground">{selectedUser?.event} from {selectedUser?.location}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{selectedUser?.time}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded border-l-4 border-blue-500">
                  <div>
                    <p className="text-sm font-medium">🔐 Login Attempt</p>
                    <p className="text-xs text-muted-foreground">From {selectedUser?.ip} • {selectedUser?.device}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{selectedUser?.time}</span>
                </div>
              </div>
            </div>

            {/* Notes Section - ALWAYS VISIBLE regardless of user lock/ban status */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Admin Notes
                <span className="text-xs text-muted-foreground">
                  (Always visible - persistent audit trail)
                </span>
              </h3>
              
              {/* Existing Notes Display */}
              <div className="space-y-3 mb-4">
                {selectedUser && notes[selectedUser.id]?.length > 0 ? (
                  notes[selectedUser.id].map((note) => (
                    <div key={note.id} className="bg-muted/30 p-3 rounded border">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-xs text-muted-foreground">
                          By {note.adminEmail} • {new Date(note.timestamp).toLocaleString()}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(note.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm">{note.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="bg-muted/20 p-3 rounded border border-dashed">
                    <p className="text-sm text-muted-foreground italic text-center">
                      No admin notes yet. Click "Add Note" to create the first note.
                    </p>
                  </div>
                )}
              </div>

              {/* Add Note Section */}
              {showAddNote ? (
                <div className="bg-blue-50 p-4 rounded border space-y-3">
                  <Label htmlFor="new-note">Add Admin Note</Label>
                  <textarea
                    id="new-note"
                    className="w-full p-2 border rounded-md bg-background resize-none"
                    rows={3}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter admin note about this user event..."
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={handleAddNote}
                      disabled={!newNote.trim()}
                    >
                      Save Note
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setShowAddNote(false);
                        setNewNote('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAddNote(true)}
                    className={`w-full ${selectedUser?.actionTaken === 'banned' ? 'opacity-50' : ''}`}
                    disabled={selectedUser?.actionTaken === 'banned'}
                    title={selectedUser?.actionTaken === 'banned' ? 'Cannot add notes to banned users - but existing notes remain visible' : 'Add admin note about this event'}
                  >
                    <FileText className="h-3 w-3 mr-2" />
                    {selectedUser?.actionTaken === 'banned' ? 'Add Note (User Banned)' : 'Add Note'}
                  </Button>
                  {selectedUser?.actionTaken === 'banned' && (
                    <p className="text-xs text-muted-foreground text-center">
                      Note: All existing notes remain visible above for audit purposes
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setShowAuditLog(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};