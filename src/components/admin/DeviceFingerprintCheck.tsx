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
import supabase from '@/lib/relaxedSupabase';
import { 
  Shield, 
  AlertTriangle, 
  Eye,
  Lock,
  Download,
  Filter,
  TrendingUp,
  Globe,
  Calendar,
  Smartphone,
  Monitor,
  Chrome,
  RefreshCw,
  Settings,
  FileText,
  Clock,
  MapPin,
  Fingerprint
} from 'lucide-react';

interface DeviceFingerprint {
  id: string;
  user_id: string;
  fingerprint_hash: string;
  device_info: any;
  browser_info: any;
  screen_resolution: string | null;
  platform: string | null;
  user_agent: string | null;
  webgl_hash: string | null;
  canvas_hash: string | null;
  audio_hash: string | null;
  timezone: string | null;
  language: string | null;
  ip_address: string | null;
  trust_score: number;
  is_trusted: boolean;
  first_seen: string;
  last_seen: string;
  session_count: number;
  created_at: string;
  updated_at: string;
}

interface SpoofAttempt {
  id: string;
  user_id: string;
  original_fingerprint_id: string | null;
  new_fingerprint_hash: string;
  spoof_score: number;
  changed_properties: any;
  severity: string;
  ip_address: string | null;
  user_agent: string | null;
  flagged: boolean;
  reviewed: boolean;
  reviewed_by: string | null;
  reviewed_at: string | null;
  action_taken: string | null;
  created_at: string;
}

interface FingerprintSession {
  id: string;
  user_id: string;
  device_fingerprint_id: string;
  session_id: string;
  login_timestamp: string;
  logout_timestamp: string;
  ip_address: string;
  location_data: any;
  session_duration: number;
  is_suspicious: boolean;
  risk_factors: string[];
  created_at: string;
}

interface Analytics {
  total_devices: number;
  trusted_devices: number;
  flagged_devices: number;
  recent_spoofs: number;
  avg_trust_score: number;
  unique_users: number;
  high_risk_users: number;
}

export const DeviceFingerprintCheck = () => {
  const [analytics, setAnalytics] = useState<Analytics>({
    total_devices: 0,
    trusted_devices: 0,
    flagged_devices: 0,
    recent_spoofs: 0,
    avg_trust_score: 0,
    unique_users: 0,
    high_risk_users: 0
  });

  const [fingerprints, setFingerprints] = useState<DeviceFingerprint[]>([]);
  const [spoofAttempts, setSpoofAttempts] = useState<SpoofAttempt[]>([]);
  const [sessions, setSessions] = useState<FingerprintSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoFlagEnabled, setAutoFlagEnabled] = useState(true);
  const [selectedFingerprint, setSelectedFingerprint] = useState<DeviceFingerprint | null>(null);

  // Modal states
  const [showFingerprintLog, setShowFingerprintLog] = useState(false);
  const [showSpoofDetails, setShowSpoofDetails] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Configuration
  const [config, setConfig] = useState({
    hashMismatchThreshold: 1,
    spoofScoreThreshold: 70,
    trustRequiredSessions: 3,
    autoRequireReauth: true,
    autoDisableSensitive: true,
    watchModeEnabled: true
  });

  useEffect(() => {
    fetchAnalytics();
    fetchFingerprints();
    fetchSpoofAttempts();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase.rpc('get_device_fingerprint_analytics');
      if (error) throw error;
      setAnalytics((data as unknown as Analytics) || {
        total_devices: 0,
        trusted_devices: 0,
        flagged_devices: 0,
        recent_spoofs: 0,
        avg_trust_score: 0,
        unique_users: 0,
        high_risk_users: 0
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch device fingerprint analytics",
        variant: "destructive"
      });
    }
  };

  const fetchFingerprints = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('device_fingerprints')
        .select('*')
        .order('last_seen', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setFingerprints((data as unknown as DeviceFingerprint[]) || []);
    } catch (error) {
      console.error('Error fetching fingerprints:', error);
      toast({
        title: "Error",
        description: "Failed to fetch device fingerprints",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSpoofAttempts = async () => {
    try {
      const { data, error } = await supabase
        .from('device_spoof_attempts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      setSpoofAttempts((data as unknown as SpoofAttempt[]) || []);
    } catch (error) {
      console.error('Error fetching spoof attempts:', error);
    }
  };

  const generateCurrentFingerprint = (): any => {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      deviceMemory: (navigator as any).deviceMemory || 'unknown',
      hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack || 'unknown'
    };
  };

  const runFingerprintCheck = async () => {
    setLoading(true);
    try {
      const currentFingerprint = generateCurrentFingerprint();
      
      // Simulate fingerprint analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh data after check
      await Promise.all([
        fetchAnalytics(),
        fetchFingerprints(),
        fetchSpoofAttempts()
      ]);

      toast({
        title: "Fingerprint Check Complete",
        description: `Analyzed ${analytics.total_devices} devices. Found ${analytics.flagged_devices} potential security risks.`
      });
    } catch (error) {
      toast({
        title: "Check Failed",
        description: "Failed to complete fingerprint analysis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFlag = async () => {
    try {
      const flaggedCount = spoofAttempts.filter(attempt => !attempt.reviewed).length;
      
      toast({
        title: "Auto-Flag Triggered",
        description: `${flaggedCount} suspicious devices have been flagged for review.`
      });
      
      await fetchSpoofAttempts();
    } catch (error) {
      toast({
        title: "Auto-Flag Failed", 
        description: "Failed to flag suspicious devices",
        variant: "destructive"
      });
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
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

  const getDeviceIcon = (platform: string) => {
    if (platform?.toLowerCase().includes('mobile') || platform?.toLowerCase().includes('android') || platform?.toLowerCase().includes('ios')) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Current Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cyan-600">Total Devices</p>
              <p className="text-2xl font-bold text-cyan-800">{analytics.total_devices}</p>
              <p className="text-xs text-cyan-500">registered</p>
            </div>
            <Fingerprint className="h-8 w-8 text-cyan-500" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Trusted Devices</p>
              <p className="text-2xl font-bold text-green-800">{analytics.trusted_devices}</p>
              <p className="text-xs text-green-500">verified</p>
            </div>
            <Shield className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Flagged Devices</p>
              <p className="text-2xl font-bold text-red-800">{analytics.flagged_devices}</p>
              <p className="text-xs text-red-500">suspicious</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">Avg Trust Score</p>
              <p className="text-2xl font-bold text-orange-800">{analytics.avg_trust_score}</p>
              <p className="text-xs text-orange-500">out of 100</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Current Device Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-800 mb-4">Current Session Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Match:</span>
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">iPhone Safari 07:00</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  ✅ Verified
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current:</span>
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Windows 10 Chrome 09:45</span>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  ❌ Hash mismatch
                </Badge>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Spoof Score:</span>
              <div className="flex items-center space-x-2">
                <Progress value={82} className="w-20 h-2" />
                <span className="text-sm font-bold text-red-600">82/100</span>
                <Badge className="bg-red-500 text-white">HIGH</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Action:</span>
              <div className="flex items-center space-x-1">
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  Auto Flag
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Require MFA
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Dialog open={showFingerprintLog} onOpenChange={setShowFingerprintLog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>View Fingerprint Log</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>🕵️ Device Fingerprint History</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>OS</TableHead>
                    <TableHead>Browser</TableHead>
                    <TableHead>Match</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Trust Score</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fingerprints.slice(0, 10).map((fingerprint) => (
                    <TableRow key={fingerprint.id}>
                      <TableCell className="font-mono text-sm">
                        {formatTimestamp(fingerprint.last_seen)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getDeviceIcon(fingerprint.platform)}
                          <span className="text-sm">{fingerprint.platform}</span>
                        </div>
                      </TableCell>
                      <TableCell>{fingerprint.device_info?.os || 'Unknown'}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Chrome className="h-4 w-4" />
                          <span>{fingerprint.browser_info?.name || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {fingerprint.is_trusted ? (
                          <Badge className="bg-green-500 text-white">✅ Yes</Badge>
                        ) : (
                          <Badge className="bg-red-500 text-white">❌ No</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span className="text-sm">{fingerprint.ip_address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-bold ${getTrustScoreColor(fingerprint.trust_score)}`}>
                          {fingerprint.trust_score}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={fingerprint.trust_score > 70 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                        >
                          {fingerprint.trust_score > 70 ? 'Trusted' : 'Flagged'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showSpoofDetails} onOpenChange={setShowSpoofDetails}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Spoof Details</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>⚠️ Device Spoofing Attempts</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Spoof Score</TableHead>
                    <TableHead>Changes</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spoofAttempts.slice(0, 10).map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell className="font-mono text-sm">
                        {formatTimestamp(attempt.created_at)}
                      </TableCell>
                      <TableCell className="font-medium">{attempt.user_id.slice(0, 8)}...</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={attempt.spoof_score} className="w-16 h-2" />
                          <span className="text-sm font-bold text-red-600">
                            {attempt.spoof_score}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {Object.keys(attempt.changed_properties || {}).join(', ')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(attempt.severity)}>
                          {attempt.severity.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {attempt.reviewed ? (
                          <Badge className="bg-blue-500 text-white">Reviewed</Badge>
                        ) : (
                          <Badge className="bg-yellow-500 text-white">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Shield className="h-4 w-4" />
                          </Button>
                        </div>
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>⚙️ Fingerprint Detection Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hash Mismatch Threshold</Label>
                  <Input
                    type="number"
                    value={config.hashMismatchThreshold}
                    onChange={(e) => setConfig(prev => ({ ...prev, hashMismatchThreshold: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Spoof Score Threshold</Label>
                  <Input
                    type="number"
                    value={config.spoofScoreThreshold}
                    onChange={(e) => setConfig(prev => ({ ...prev, spoofScoreThreshold: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Auto Require Re-authentication</Label>
                  <Switch
                    checked={config.autoRequireReauth}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, autoRequireReauth: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Auto Disable Sensitive Actions</Label>
                  <Switch
                    checked={config.autoDisableSensitive}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, autoDisableSensitive: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Watch Mode Enabled</Label>
                  <Switch
                    checked={config.watchModeEnabled}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, watchModeEnabled: checked }))}
                  />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button 
          onClick={runFingerprintCheck}
          disabled={loading}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Run Check</span>
        </Button>

        <Button 
          onClick={handleAutoFlag}
          variant="outline"
          className="flex items-center space-x-2 border-orange-300 text-orange-700 hover:bg-orange-50"
        >
          <Shield className="h-4 w-4" />
          <span>Auto Flag</span>
        </Button>
      </div>

      {/* Recent History Preview */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-3">Recent Activity</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              - iPhone (iOS) Chrome → <span className="text-green-600">OK</span>
            </span>
            <span className="text-xs text-gray-400">2h ago</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              - Android Chrome → <span className="text-red-600">❌ Device Switch (Flagged)</span>
            </span>
            <span className="text-xs text-gray-400">4h ago</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              - Edge Browser (new) → <span className="text-yellow-600">⚠️ Warning</span>
            </span>
            <span className="text-xs text-gray-400">1d ago</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="sm">
          Ignore Once
        </Button>
        <Button variant="destructive" size="sm" disabled>
          Disable Account Temporarily
        </Button>
        <div className="flex items-center space-x-2">
          <Switch
            checked={autoFlagEnabled}
            onCheckedChange={setAutoFlagEnabled}
          />
          <Label className="text-sm">Auto-Flag Enabled</Label>
        </div>
      </div>
    </div>
  );
};