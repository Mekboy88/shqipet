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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  MapPin,
  Clock,
  RefreshCw,
  Settings,
  FileText,
  Zap,
  Ban,
  Flag,
  Activity,
  Target,
  Waves
} from 'lucide-react';

interface BruteForceAttempt {
  id: string;
  ip_address: string;
  attempted_username: string | null;
  attempted_email: string | null;
  user_agent: string | null;
  success: boolean;
  attempt_timestamp: string;
  country_code: string | null;
  city: string | null;
  asn: string | null;
  device_fingerprint: string | null;
  session_id: string | null;
  blocked: boolean;
  block_reason: string | null;
  created_at: string;
}

interface IPSecurityStatus {
  id: string;
  ip_address: string;
  status: 'normal' | 'warning' | 'blocked' | 'trusted';
  threat_level: number;
  reputation_score: number;
  total_attempts: number;
  successful_logins: number;
  failed_attempts: number;
  unique_usernames_tried: number;
  first_seen: string;
  last_attempt: string;
  blocked_until: string | null;
  blocked_by: string | null;
  blocked_reason: string | null;
  country_code: string | null;
  asn: string | null;
  is_trusted: boolean;
  auto_blocked: boolean;
  created_at: string;
  updated_at: string;
}

interface HeatmapDataPoint {
  hour: number;
  ip_address: string;
  attempt_count: number;
  severity: 'normal' | 'warning' | 'critical';
  country_code: string[];
  usernames_tried: string[];
}

interface Analytics {
  total_attempts_24h: number;
  failed_attempts_24h: number;
  blocked_ips: number;
  flagged_ips: number;
  active_alerts: number;
  peak_hour: number;
  top_countries: Array<{ country: string; attempts: number }>;
}

interface RateLimitConfig {
  max_attempts_per_ip: string;
  time_window_minutes: string;
  auto_ban_duration_hours: string;
  alert_threshold: string;
  geo_lock_enabled: string;
  honeypot_enabled: string;
  reputation_check_enabled: string;
}

export const BruteForceRateMap = () => {
  const [analytics, setAnalytics] = useState<Analytics>({
    total_attempts_24h: 0,
    failed_attempts_24h: 0,
    blocked_ips: 0,
    flagged_ips: 0,
    active_alerts: 0,
    peak_hour: 0,
    top_countries: []
  });

  const [attempts, setAttempts] = useState<BruteForceAttempt[]>([]);
  const [ipStatuses, setIpStatuses] = useState<IPSecurityStatus[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapDataPoint[]>([]);
  const [config, setConfig] = useState<RateLimitConfig>({
    max_attempts_per_ip: '10',
    time_window_minutes: '5',
    auto_ban_duration_hours: '1',
    alert_threshold: '3',
    geo_lock_enabled: 'true',
    honeypot_enabled: 'false',
    reputation_check_enabled: 'true'
  });

  const [loading, setLoading] = useState(true);
  const [autoBlockEnabled, setAutoBlockEnabled] = useState(true);
  const [selectedIP, setSelectedIP] = useState<string | null>(null);

  // Modal states
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showSessionTrace, setShowSessionTrace] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);

  useEffect(() => {
    fetchAnalytics();
    fetchAttempts();
    fetchIPStatuses();
    fetchHeatmapData();
    fetchConfig();
    
    // Set up real-time polling
    const interval = setInterval(() => {
      fetchAnalytics();
      fetchAttempts();
      fetchIPStatuses();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase.rpc('get_brute_force_analytics');
      if (error) throw error;
      setAnalytics((data as unknown as Analytics) || analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchAttempts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('brute_force_attempts')
        .select('*')
        .order('attempt_timestamp', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      setAttempts((data as unknown as BruteForceAttempt[]) || []);
    } catch (error) {
      console.error('Error fetching attempts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIPStatuses = async () => {
    try {
      const { data, error } = await supabase
        .from('ip_security_status')
        .select('*')
        .order('last_attempt', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setIpStatuses((data as unknown as IPSecurityStatus[]) || []);
    } catch (error) {
      console.error('Error fetching IP statuses:', error);
    }
  };

  const fetchHeatmapData = async () => {
    try {
      const { data, error } = await supabase.rpc('get_brute_force_heatmap');
      if (error) throw error;
      setHeatmapData((data as unknown as HeatmapDataPoint[]) || []);
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
    }
  };

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('rate_limit_config')
        .select('setting_name, setting_value');
      
      if (error) throw error;
      
      const configMap: Partial<RateLimitConfig> = {};
      data?.forEach((item: any) => {
        configMap[item.setting_name as keyof RateLimitConfig] = item.setting_value;
      });
      
      setConfig(prev => ({ ...prev, ...configMap }));
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  };

  const blockIPAddress = async (ipAddress: string, duration: number = 1, reason: string = 'Manual block by admin') => {
    try {
      const { data, error } = await supabase.rpc('block_ip_address', {
        target_ip: ipAddress,
        block_duration_hours: duration,
        block_reason: reason
      });
      
      if (error) throw error;
      
      toast({
        title: "IP Address Blocked",
        description: `${ipAddress} has been blocked for ${duration} hour(s).`
      });
      
      await Promise.all([fetchIPStatuses(), fetchAnalytics()]);
    } catch (error) {
      toast({
        title: "Block Failed",
        description: "Failed to block IP address",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'blocked': return 'bg-red-500 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      case 'trusted': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'warning': return 'bg-yellow-500';
      case 'normal': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getCountryFlag = (countryCode: string) => {
    if (!countryCode) return '🌍';
    const flags: { [key: string]: string } = {
      'US': '🇺🇸', 'GB': '🇬🇧', 'CN': '🇨🇳', 'RU': '🇷🇺', 'DE': '🇩🇪',
      'FR': '🇫🇷', 'AL': '🇦🇱', 'IT': '🇮🇹', 'ES': '🇪🇸', 'JP': '🇯🇵'
    };
    return flags[countryCode] || '🌍';
  };

  const renderHeatmapGrid = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const maxAttempts = Math.max(...heatmapData.map(d => d.attempt_count), 1);
    
    return (
      <div className="grid grid-cols-24 gap-1 mb-4">
        {hours.map(hour => {
          const hourData = heatmapData.filter(d => d.hour === hour);
          const totalAttempts = hourData.reduce((sum, d) => sum + d.attempt_count, 0);
          const intensity = Math.min(totalAttempts / maxAttempts, 1);
          const severity = totalAttempts >= 10 ? 'critical' : totalAttempts >= 4 ? 'warning' : 'normal';
          
          return (
            <div
              key={hour}
              className={`h-12 w-full rounded flex items-center justify-center text-xs font-medium cursor-pointer transition-all hover:scale-105 ${getSeverityColor(severity)}`}
              style={{ opacity: 0.3 + (intensity * 0.7) }}
              title={`${hour}:00 - ${totalAttempts} attempts`}
            >
              {hour}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Real-time Alert Banner */}
      {analytics.active_alerts > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-pulse">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">
                🔴 Active Brute Force Attack Detected!
              </p>
              <p className="text-red-600 text-sm">
                {analytics.active_alerts} active alerts. {analytics.flagged_ips} IPs flagged in the last hour.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              View Details
            </Button>
          </div>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">Total Attempts (24h)</p>
              <p className="text-2xl font-bold text-orange-800">{analytics.total_attempts_24h}</p>
              <p className="text-xs text-orange-500">login attempts</p>
            </div>
            <Activity className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Failed Attempts</p>
              <p className="text-2xl font-bold text-red-800">{analytics.failed_attempts_24h}</p>
              <p className="text-xs text-red-500">suspicious</p>
            </div>
            <Target className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Blocked IPs</p>
              <p className="text-2xl font-bold text-purple-800">{analytics.blocked_ips}</p>
              <p className="text-xs text-purple-500">currently blocked</p>
            </div>
            <Ban className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Peak Hour</p>
              <p className="text-2xl font-bold text-blue-800">{analytics.peak_hour}:00</p>
              <p className="text-xs text-blue-500">most attacks</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Heatmap Preview */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-800">24-Hour Attack Heatmap</h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">🟢 Safe</span>
            <span className="text-xs text-gray-500">🟡 Warning</span>
            <span className="text-xs text-gray-500">🔴 Critical</span>
          </div>
        </div>
        {renderHeatmapGrid()}
      </div>

      {/* Top Flagged IPs */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-800 mb-4">Top Flagged IP Addresses</h4>
        <div className="space-y-3">
          {ipStatuses.slice(0, 5).map((ip) => (
            <div key={ip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm">{ip.ip_address}</span>
                  <span className="text-lg">{getCountryFlag(ip.country_code || '')}</span>
                </div>
                <Badge className={getStatusColor(ip.status)}>
                  {ip.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{ip.failed_attempts} attempts</p>
                  <p className="text-xs text-gray-500">{ip.unique_usernames_tried} users tried</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedIP(ip.ip_address);
                    setShowBlockDialog(true);
                  }}
                  disabled={ip.status === 'blocked'}
                >
                  {ip.status === 'blocked' ? 'Blocked' : 'Block'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Dialog open={showHeatmap} onOpenChange={setShowHeatmap}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <Waves className="h-4 w-4" />
              <span>View Heatmap</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>🔥 Brute Force Attack Heatmap</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-12 gap-1">
                {Array.from({ length: 24 }, (_, hour) => (
                  <div key={hour} className="text-center text-xs font-medium mb-2">
                    {hour}:00
                  </div>
                ))}
              </div>
              {renderHeatmapGrid()}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Top Attack Sources</h5>
                  <div className="space-y-2">
                    {analytics.top_countries?.slice(0, 5).map((country, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{getCountryFlag(country.country)} {country.country}</span>
                        <span className="font-medium">{country.attempts}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Attack Timeline</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Peak: {analytics.peak_hour}:00</span>
                      <span className="text-red-600">🔥 High Activity</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Current: Active monitoring</span>
                      <span className="text-green-600">🛡️ Protected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showSessionTrace} onOpenChange={setShowSessionTrace}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Session Trace</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>🕵️ Brute Force Session Trace</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Users Tried</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Browser</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attempts.slice(0, 20).map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell className="font-mono text-sm">
                        {formatTimestamp(attempt.attempt_timestamp)}
                      </TableCell>
                      <TableCell className="font-mono">{attempt.ip_address}</TableCell>
                      <TableCell>{attempt.attempted_username || attempt.attempted_email || 'Unknown'}</TableCell>
                      <TableCell>
                        {attempt.success ? (
                          <Badge className="bg-green-500 text-white">✅ Success</Badge>
                        ) : (
                          <Badge className="bg-red-500 text-white">❌ Failed</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-lg">{getCountryFlag(attempt.country_code || '')}</span>
                        {attempt.country_code}
                      </TableCell>
                      <TableCell className="text-sm">
                        {attempt.user_agent?.split(' ')[0] || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedIP(attempt.ip_address);
                              setShowBlockDialog(true);
                            }}
                          >
                            Block
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
              <DialogTitle>⚙️ Rate Limiting Configuration</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Attempts per IP</Label>
                  <Input
                    type="number"
                    value={config.max_attempts_per_ip}
                    onChange={(e) => setConfig(prev => ({ ...prev, max_attempts_per_ip: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time Window (minutes)</Label>
                  <Input
                    type="number"
                    value={config.time_window_minutes}
                    onChange={(e) => setConfig(prev => ({ ...prev, time_window_minutes: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Auto Ban Duration (hours)</Label>
                  <Input
                    type="number"
                    value={config.auto_ban_duration_hours}
                    onChange={(e) => setConfig(prev => ({ ...prev, auto_ban_duration_hours: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Alert Threshold</Label>
                  <Input
                    type="number"
                    value={config.alert_threshold}
                    onChange={(e) => setConfig(prev => ({ ...prev, alert_threshold: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Geographic IP Blocking</Label>
                  <Switch
                    checked={config.geo_lock_enabled === 'true'}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, geo_lock_enabled: checked.toString() }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Honeypot Traps</Label>
                  <Switch
                    checked={config.honeypot_enabled === 'true'}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, honeypot_enabled: checked.toString() }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>IP Reputation Checking</Label>
                  <Switch
                    checked={config.reputation_check_enabled === 'true'}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, reputation_check_enabled: checked.toString() }))}
                  />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button 
          onClick={() => Promise.all([fetchAnalytics(), fetchAttempts(), fetchIPStatuses(), fetchHeatmapData()])}
          disabled={loading}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>

        <Button variant="outline" className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export Data</span>
        </Button>
      </div>

      {/* Block IP Dialog */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🚫 Block IP Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm">
                You are about to block IP address: <span className="font-mono font-bold">{selectedIP}</span>
              </p>
            </div>
            <div className="space-y-2">
              <Label>Block Duration</Label>
              <Select defaultValue="1">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="168">1 week</SelectItem>
                  <SelectItem value="0">Permanent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Input placeholder="Brute force attack detected" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowBlockDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={() => {
                  if (selectedIP) {
                    blockIPAddress(selectedIP, 1, 'Manual block by admin');
                    setShowBlockDialog(false);
                  }
                }}
              >
                Block IP
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Status */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch checked={autoBlockEnabled} onCheckedChange={setAutoBlockEnabled} />
            <Label className="text-sm">Auto Block Enabled</Label>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Rate Limit: {config.max_attempts_per_ip}/{config.time_window_minutes}min
          </Badge>
        </div>
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};