import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  Settings,
  Download,
  RefreshCw,
  Bell,
  Zap,
  Clock,
  ChevronDown,
  ChevronRight,
  Activity,
  FileText,
  Users,
  Lock,
  Unlock,
  Globe,
  Smartphone,
  Bot,
  Target,
  AlertCircle,
  Calendar,
  BarChart3,
  Lightbulb,
  Wrench,
  Mail,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import supabase from '@/lib/relaxedSupabase';

interface SecurityLayer {
  id: string;
  name: string;
  status: 'excellent' | 'good' | 'warning' | 'critical' | 'failing';
  description: string;
  lastChecked: string;
  compliance: boolean;
  metrics: {
    coverage?: number;
    incidents?: number;
    responseTime?: string;
    effectiveness?: number;
  };
  actions: Array<{
    label: string;
    type: 'view' | 'fix' | 'configure' | 'export';
    urgent?: boolean;
  }>;
  details?: {
    recentActivity?: string;
    nextCheck?: string;
    configuration?: any;
  };
}

interface ComplianceStatus {
  framework: string;
  status: 'passed' | 'partial' | 'failing' | 'not_applicable';
  score: number;
  lastAudit: string;
  nextAudit?: string;
  requirements: Array<{
    name: string;
    status: 'compliant' | 'warning' | 'non_compliant';
    details: string;
  }>;
}

interface SecurityAlert {
  id: string;
  type: 'mfa_tampering' | 'brute_force' | 'token_abuse' | 'anomaly' | 'device_spoof';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  userId?: string;
  actionTaken?: string;
  riskScore?: number;
  resolved: boolean;
}

interface SecurityTrend {
  metric: string;
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
}

export const SecurityImplementationSummary: React.FC = () => {
  const [securityLayers, setSecurityLayers] = useState<SecurityLayer[]>([]);
  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus[]>([]);
  const [globalScore, setGlobalScore] = useState<number>(92);
  const [scoreChange, setScoreChange] = useState<number>(4);
  const [recentAlerts, setRecentAlerts] = useState<SecurityAlert[]>([]);
  const [securityTrends, setSecurityTrends] = useState<SecurityTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set());
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [alertSeverityFilter, setAlertSeverityFilter] = useState<string>('all');
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);

  // Mock data - in real implementation, this would come from API
  useEffect(() => {
    const mockSecurityLayers: SecurityLayer[] = [
      {
        id: 'jwt_lifecycle',
        name: 'JWT Lifecycle Management',
        status: 'excellent',
        description: 'Token expiration, refresh, and revocation policies',
        lastChecked: '2024-01-26T14:30:00Z',
        compliance: true,
        metrics: {
          coverage: 100,
          effectiveness: 98,
          responseTime: '< 100ms'
        },
        actions: [
          { label: 'View Policy', type: 'view' },
          { label: 'Update Expiration', type: 'configure' },
          { label: 'Export Logs', type: 'export' }
        ],
        details: {
          recentActivity: 'Auto-refreshed 1,247 tokens today',
          nextCheck: '2024-01-27T14:30:00Z',
          configuration: { expiryTime: '24h', refreshWindow: '7d' }
        }
      },
      {
        id: 'audit_logs',
        name: 'Comprehensive Audit Logs',
        status: 'good',
        description: 'Complete activity tracking and security event logging',
        lastChecked: '2024-01-26T14:25:00Z',
        compliance: true,
        metrics: {
          coverage: 95,
          incidents: 0,
          effectiveness: 94
        },
        actions: [
          { label: 'View Logs', type: 'view' },
          { label: 'Export Report', type: 'export' },
          { label: 'Configure Retention', type: 'configure' }
        ],
        details: {
          recentActivity: '2,543 events logged today',
          nextCheck: '2024-01-27T14:25:00Z'
        }
      },
      {
        id: 'age_verification',
        name: 'Age Verification & Legal Compliance',
        status: 'excellent',
        description: 'COPPA and regional age verification systems',
        lastChecked: '2024-01-26T12:00:00Z',
        compliance: true,
        metrics: {
          coverage: 100,
          effectiveness: 99
        },
        actions: [
          { label: 'View Compliance', type: 'view' },
          { label: 'Update Verification', type: 'configure' },
          { label: 'Export Report', type: 'export' }
        ],
        details: {
          recentActivity: '67 age verifications completed today',
          nextCheck: '2024-01-27T12:00:00Z'
        }
      },
      {
        id: 'suspicious_login',
        name: 'Suspicious Login Detection',
        status: 'warning',
        description: 'Basic anomaly detection with behavioral scoring',
        lastChecked: '2024-01-26T14:20:00Z',
        compliance: true,
        metrics: {
          coverage: 78,
          incidents: 12,
          effectiveness: 85
        },
        actions: [
          { label: 'View Alerts', type: 'view' },
          { label: 'Fix Configuration', type: 'fix', urgent: true },
          { label: 'Update Rules', type: 'configure' }
        ],
        details: {
          recentActivity: '12 suspicious logins flagged today',
          nextCheck: '2024-01-26T15:20:00Z'
        }
      },
      {
        id: 'behavioral_anomaly',
        name: 'Behavioral Anomaly Scanner',
        status: 'excellent',
        description: 'Elite-level user behavior pattern analysis',
        lastChecked: '2024-01-26T14:35:00Z',
        compliance: true,
        metrics: {
          coverage: 100,
          incidents: 3,
          effectiveness: 96
        },
        actions: [
          { label: 'View Trace', type: 'view' },
          { label: 'Edit Rules', type: 'configure' },
          { label: 'Export Stats', type: 'export' }
        ],
        details: {
          recentActivity: '3 anomalies detected this week',
          nextCheck: '2024-01-26T15:35:00Z'
        }
      },
      {
        id: 'device_fingerprinting',
        name: 'Device Fingerprinting',
        status: 'excellent',
        description: 'Advanced device identification and spoofing detection',
        lastChecked: '2024-01-26T14:40:00Z',
        compliance: true,
        metrics: {
          coverage: 100,
          incidents: 1,
          effectiveness: 98
        },
        actions: [
          { label: 'View Devices', type: 'view' },
          { label: 'Configure Trust', type: 'configure' },
          { label: 'Export Data', type: 'export' }
        ],
        details: {
          recentActivity: '1 device spoof attempt blocked',
          nextCheck: '2024-01-26T15:40:00Z'
        }
      },
      // NEW CRITICAL SECURITY MODULES
      {
        id: 'device_location_intelligence',
        name: 'Device & Location Intelligence Module',
        status: 'warning',
        description: 'Detects logins from new devices and geo-location anomalies',
        lastChecked: '2024-01-26T14:45:00Z',
        compliance: true,
        metrics: {
          coverage: 85,
          incidents: 5,
          effectiveness: 91
        },
        actions: [
          { label: 'View Device Table', type: 'view' },
          { label: 'Force Verify', type: 'fix', urgent: true },
          { label: 'Configure Geo Rules', type: 'configure' }
        ],
        details: {
          recentActivity: 'Login from new browser (Edge, UK) not seen in last 90 days. Geo Drift: US → China within 2 mins.',
          nextCheck: '2024-01-26T15:45:00Z',
          configuration: { geoAlertThreshold: '2min', deviceTrustWindow: '90d' }
        }
      },
      {
        id: 'audit_trail_integrity',
        name: 'Audit Trail Integrity Verification',
        status: 'good',
        description: 'Ensures all auth events are logged without gaps or inconsistencies',
        lastChecked: '2024-01-26T14:50:00Z',
        compliance: true,
        metrics: {
          coverage: 98,
          incidents: 1,
          effectiveness: 95
        },
        actions: [
          { label: 'View Audit Map', type: 'view' },
          { label: 'Check Gaps', type: 'fix' },
          { label: 'Export Integrity Report', type: 'export' }
        ],
        details: {
          recentActivity: 'Last MFA Change: Detected, Logged ✅ | Token Kill Event: ✅ Trace Exists | Inconsistency: Missing login record for UID 2043 → ALERT',
          nextCheck: '2024-01-26T15:50:00Z'
        }
      },
      {
        id: 'mobile_web_auth_drift',
        name: 'Mobile vs Web Auth Flow Drift',
        status: 'warning',
        description: 'Detects session state mismatches between mobile and web platforms',
        lastChecked: '2024-01-26T14:55:00Z',
        compliance: true,
        metrics: {
          coverage: 82,
          incidents: 7,
          effectiveness: 88
        },
        actions: [
          { label: 'View Mismatch Status', type: 'view' },
          { label: 'Auto-Fix Sync', type: 'fix', urgent: true },
          { label: 'Silent Refresh', type: 'configure' }
        ],
        details: {
          recentActivity: '7 mobile/web auth desync events detected today',
          nextCheck: '2024-01-26T15:55:00Z'
        }
      },
      {
        id: 'webhook_provider_resilience',
        name: 'Webhook/Provider Resilience Test',
        status: 'good',
        description: 'Tests connectivity and performance of external auth providers',
        lastChecked: '2024-01-26T15:00:00Z',
        compliance: true,
        metrics: {
          coverage: 100,
          responseTime: '255ms avg',
          effectiveness: 94
        },
        actions: [
          { label: 'Test Now', type: 'fix' },
          { label: 'View Provider Status', type: 'view' },
          { label: 'Configure Alerts', type: 'configure' }
        ],
        details: {
          recentActivity: 'Twilio Ping: ✅ 255ms | SendGrid: ❌ 503 error (retrying) | Phone Hook: ✅ Passed',
          nextCheck: '2024-01-26T16:00:00Z'
        }
      },
      {
        id: 'threshold_rule_engine',
        name: 'Threshold Rule Engine (Visual)',
        status: 'excellent',
        description: 'Configurable security thresholds with visual rule management',
        lastChecked: '2024-01-26T15:05:00Z',
        compliance: true,
        metrics: {
          coverage: 100,
          incidents: 0,
          effectiveness: 97
        },
        actions: [
          { label: 'Edit Thresholds', type: 'configure' },
          { label: 'View Rule Status', type: 'view' },
          { label: 'Test Rules', type: 'fix' }
        ],
        details: {
          recentActivity: 'All thresholds within normal ranges. MFA % > 30% ✅, Login attempts < 3/5min ✅',
          nextCheck: '2024-01-26T16:05:00Z',
          configuration: { mfaThreshold: 30, loginAttemptWindow: '5min', maxAttempts: 3 }
        }
      }
    ];

    const mockComplianceStatus: ComplianceStatus[] = [
      {
        framework: 'GDPR',
        status: 'passed',
        score: 98,
        lastAudit: '2024-01-15T10:00:00Z',
        nextAudit: '2024-04-15T10:00:00Z',
        requirements: [
          { name: 'Data Processing Consent', status: 'compliant', details: 'Explicit consent mechanisms implemented' },
          { name: 'Right to be Forgotten', status: 'compliant', details: 'Automated deletion processes active' },
          { name: 'Data Portability', status: 'compliant', details: 'Export functionality available' }
        ]
      },
      {
        framework: 'COPPA',
        status: 'partial',
        score: 85,
        lastAudit: '2024-01-20T10:00:00Z',
        nextAudit: '2024-02-20T10:00:00Z',
        requirements: [
          { name: 'Age Verification', status: 'compliant', details: 'Robust age gate implemented' },
          { name: 'Parental Consent', status: 'warning', details: 'Process needs streamlining' },
          { name: 'Data Collection Limits', status: 'compliant', details: 'Minimal data collection for minors' }
        ]
      },
      {
        framework: 'CCPA',
        status: 'passed',
        score: 95,
        lastAudit: '2024-01-10T10:00:00Z',
        nextAudit: '2024-07-10T10:00:00Z',
        requirements: [
          { name: 'Consumer Rights', status: 'compliant', details: 'All rights accessible via dashboard' },
          { name: 'Opt-out Mechanisms', status: 'compliant', details: 'Clear opt-out processes' },
          { name: 'Data Disclosure', status: 'compliant', details: 'Transparent privacy policy' }
        ]
      }
    ];

    const mockRecentAlerts: SecurityAlert[] = [
      {
        id: 'alert-1',
        type: 'mfa_tampering',
        severity: 'critical',
        message: 'MFA Tampering Detected from UserID 18732 (IP: UK)',
        timestamp: '2024-01-26T07:32:00Z',
        userId: '18732',
        actionTaken: 'Notified Admin',
        riskScore: 84,
        resolved: false
      },
      {
        id: 'alert-2',
        type: 'brute_force',
        severity: 'high',
        message: 'Brute force attack blocked from IP 185.23.45.67',
        timestamp: '2024-01-26T06:15:00Z',
        actionTaken: 'IP auto-blocked for 24h',
        resolved: true
      },
      {
        id: 'alert-3',
        type: 'token_abuse',
        severity: 'medium',
        message: 'Token used from multiple countries within 5 minutes',
        timestamp: '2024-01-26T05:45:00Z',
        userId: 'user-456',
        actionTaken: 'Token flagged for review',
        riskScore: 67,
        resolved: false
      }
    ];

    const mockSecurityTrends: SecurityTrend[] = [
      { metric: 'MFA Coverage', current: 94, previous: 90, change: 4, trend: 'up', unit: '%' },
      { metric: 'Token Abuse Events', current: 3, previous: 5, change: -2, trend: 'down', unit: 'events' },
      { metric: 'Login Anomalies', current: 8, previous: 13, change: -5, trend: 'down', unit: 'incidents' },
      { metric: 'Device Trust Score', current: 96, previous: 94, change: 2, trend: 'up', unit: '%' },
      { metric: 'Brute Force Blocks', current: 15, previous: 12, change: 3, trend: 'up', unit: 'blocks' }
    ];

    setSecurityLayers(mockSecurityLayers);
    setComplianceStatus(mockComplianceStatus);
    setRecentAlerts(mockRecentAlerts);
    setSecurityTrends(mockSecurityTrends);
    setLoading(false);

    // Simulate real-time updates
    if (realTimeEnabled) {
      const interval = setInterval(() => {
        setGlobalScore(prev => Math.min(100, Math.max(70, prev + (Math.random() - 0.5) * 2)));
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [realTimeEnabled]);

  // Set up real-time alerts using Supabase
  useEffect(() => {
    if (!realTimeEnabled) return;

    const channel = supabase
      .channel('security-alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_events'
        },
        (payload) => {
          console.log('New security event:', payload);
          // Add new alert to the list
          // setRecentAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [realTimeEnabled]);

  const getStatusColor = (status: SecurityLayer['status']) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'failing': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: SecurityLayer['status']) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'good': return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'failing': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getComplianceStatusColor = (status: ComplianceStatus['status']) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800 border-green-200';
      case 'partial': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failing': return 'bg-red-100 text-red-800 border-red-200';
      case 'not_applicable': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertIcon = (type: SecurityAlert['type']) => {
    switch (type) {
      case 'mfa_tampering': return <Shield className="w-4 h-4" />;
      case 'brute_force': return <Target className="w-4 h-4" />;
      case 'token_abuse': return <Lock className="w-4 h-4" />;
      case 'anomaly': return <Activity className="w-4 h-4" />;
      case 'device_spoof': return <Smartphone className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: SecurityTrend['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable': return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const toggleLayerExpansion = (layerId: string) => {
    setExpandedLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  };

  const handleAction = (layerId: string, actionType: string) => {
    console.log(`Action: ${actionType} for layer: ${layerId}`);
    // In real implementation, this would trigger the appropriate action
  };

  const filteredAlerts = recentAlerts.filter(alert => 
    alertSeverityFilter === 'all' || alert.severity === alertSeverityFilter
  );

  const averageCompliance = Math.round(
    complianceStatus.filter(c => c.status !== 'not_applicable').reduce((sum, c) => sum + c.score, 0) / 
    complianceStatus.filter(c => c.status !== 'not_applicable').length
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Implementation Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Implementation Summary
            {realTimeEnabled && (
              <Badge className="bg-green-100 text-green-800 border-green-200 animate-pulse">
                Live
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setLoading(true)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="alerts">Live Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Global Security Score */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">🔐 Global Security Score</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-3xl font-bold text-green-600">{globalScore}/100</span>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Excellent
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        +{scoreChange} in past 7 days
                      </div>
                    </div>
                  </div>
                  <div className="w-24 h-24 relative">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-green-500"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${globalScore}, 100`}
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold translate-x-[-4px]">{globalScore}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium">MFA Coverage</div>
                    <div className="text-green-600">100%</div>
                  </div>
                  <div>
                    <div className="font-medium">Anomaly Alerts</div>
                    <div className="text-blue-600">Low</div>
                  </div>
                  <div>
                    <div className="font-medium">Token Abuse</div>
                    <div className="text-yellow-600">1 violation</div>
                  </div>
                  <div>
                    <div className="font-medium">Brute Force</div>
                    <div className="text-green-600">Auto Block Active</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Insight Box */}
            <Alert className="border-blue-200 bg-blue-50">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                <div className="font-medium text-blue-800 mb-1">💡 AI Security Insight</div>
                <div className="text-blue-700">
                  Your MFA coverage is excellent, but brute-force attacks are rising from unknown IPs. 
                  Consider raising the cooldown threshold from 5 to 10 failed attempts to reduce false positives.
                </div>
              </AlertDescription>
            </Alert>

            {/* Security Layers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">🛡️ Security Layers</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Wrench className="w-4 h-4 mr-2" />
                    Fix All Warnings
                  </Button>
                </div>
              </div>

              {securityLayers.map((layer) => (
                <Card key={layer.id}>
                  <Collapsible>
                    <CollapsibleTrigger 
                      className="w-full"
                      onClick={() => toggleLayerExpansion(layer.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(layer.status)}
                            <div className="text-left">
                              <div className="font-medium">{layer.name}</div>
                              <div className="text-sm text-gray-600">{layer.description}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={getStatusColor(layer.status)}>
                              {layer.status}
                            </Badge>
                            <div className="text-sm text-gray-500">
                              {formatTimeAgo(layer.lastChecked)}
                            </div>
                            {expandedLayers.has(layer.id) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent className="pt-0 px-4 pb-4">
                        <div className="space-y-4 border-t pt-4">
                          {/* Metrics */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {layer.metrics.coverage && (
                              <div>
                                <div className="text-sm font-medium">Coverage</div>
                                <div className="text-lg font-bold text-green-600">{layer.metrics.coverage}%</div>
                              </div>
                            )}
                            {layer.metrics.incidents !== undefined && (
                              <div>
                                <div className="text-sm font-medium">Incidents</div>
                                <div className="text-lg font-bold text-blue-600">{layer.metrics.incidents}</div>
                              </div>
                            )}
                            {layer.metrics.responseTime && (
                              <div>
                                <div className="text-sm font-medium">Response Time</div>
                                <div className="text-lg font-bold text-purple-600">{layer.metrics.responseTime}</div>
                              </div>
                            )}
                            {layer.metrics.effectiveness && (
                              <div>
                                <div className="text-sm font-medium">Effectiveness</div>
                                <div className="text-lg font-bold text-orange-600">{layer.metrics.effectiveness}%</div>
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          {layer.details && (
                            <div className="text-sm text-gray-600 space-y-1">
                              {layer.details.recentActivity && (
                                <div>📊 Recent Activity: {layer.details.recentActivity}</div>
                              )}
                              {layer.details.nextCheck && (
                                <div>🕒 Next Check: {formatTimeAgo(layer.details.nextCheck)}</div>
                              )}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2">
                            {layer.actions.map((action, index) => (
                              <Button
                                key={index}
                                variant={action.urgent ? "destructive" : "outline"}
                                size="sm"
                                onClick={() => handleAction(layer.id, action.type)}
                              >
                                {action.type === 'view' && <Eye className="w-4 h-4 mr-2" />}
                                {action.type === 'fix' && <Wrench className="w-4 h-4 mr-2" />}
                                {action.type === 'configure' && <Settings className="w-4 h-4 mr-2" />}
                                {action.type === 'export' && <Download className="w-4 h-4 mr-2" />}
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">🛡️ Platform Compliance Summary</h3>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                Average: {averageCompliance}%
              </Badge>
            </div>

            <div className="grid gap-4">
              {complianceStatus.map((compliance) => (
                <Card key={compliance.framework}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium text-lg">{compliance.framework}</div>
                          <div className="text-sm text-gray-600">
                            Last audit: {formatTimeAgo(compliance.lastAudit)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-2xl font-bold">{compliance.score}%</div>
                          <Badge className={getComplianceStatusColor(compliance.status)}>
                            {compliance.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {compliance.requirements.map((req, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            {req.status === 'compliant' && <CheckCircle className="w-4 h-4 text-green-600" />}
                            {req.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                            {req.status === 'non_compliant' && <XCircle className="w-4 h-4 text-red-600" />}
                            <span className="font-medium">{req.name}</span>
                          </div>
                          <span className="text-gray-600">{req.details}</span>
                        </div>
                      ))}
                    </div>

                    {compliance.nextAudit && (
                      <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                        📅 Next audit scheduled: {new Date(compliance.nextAudit).toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">📈 Security Trends - Last 7 Days</h3>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                View Full Report
              </Button>
            </div>

            <div className="grid gap-4">
              {securityTrends.map((trend, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getTrendIcon(trend.trend)}
                        <div>
                          <div className="font-medium">{trend.metric}</div>
                          <div className="text-sm text-gray-600">
                            {trend.change > 0 ? '+' : ''}{trend.change} {trend.unit}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{trend.current}</div>
                        <div className="text-sm text-gray-600">{trend.unit}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">🚨 Live Security Alerts</h3>
              <div className="flex items-center gap-2">
                <select 
                  className="px-3 py-1 border rounded text-sm"
                  value={alertSeverityFilter}
                  onChange={(e) => setAlertSeverityFilter(e.target.value)}
                >
                  <option value="all">All Severity</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <div className="flex items-center gap-2">
                  <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                  <Label htmlFor="notifications" className="text-sm">
                    Notifications
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <Alert 
                  key={alert.id} 
                  className={`border-l-4 ${
                    alert.severity === 'critical' ? 'border-l-red-500 bg-red-50' :
                    alert.severity === 'high' ? 'border-l-orange-500 bg-orange-50' :
                    alert.severity === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                    'border-l-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{alert.message}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            🕒 {formatTimeAgo(alert.timestamp)}
                            {alert.actionTaken && (
                              <span className="ml-2 text-blue-600">• Action: {alert.actionTaken}</span>
                            )}
                            {alert.riskScore && (
                              <span className="ml-2 text-orange-600">• Risk Score: {alert.riskScore}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            alert.severity === 'critical' ? 'bg-red-100 text-red-800 border-red-200' :
                            alert.severity === 'high' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                            alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-blue-100 text-blue-800 border-blue-200'
                          }>
                            {alert.severity}
                          </Badge>
                          {alert.resolved ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-orange-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>

            {filteredAlerts.length === 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  No security alerts matching your filter criteria. All systems operating normally.
                </AlertDescription>
              </Alert>
            )}

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">🔔 Alert Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slack-notifications">Slack Notifications</Label>
                  <Switch id="slack-notifications" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="realtime-updates">Real-time Updates</Label>
                  <Switch 
                    id="realtime-updates" 
                    checked={realTimeEnabled} 
                    onCheckedChange={setRealTimeEnabled}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};