import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Ban, 
  Clock, 
  Download, 
  Eye, 
  Filter, 
  Flag, 
  Globe, 
  Lock, 
  LogOut, 
  MapPin, 
  Monitor, 
  Search, 
  Shield, 
  Smartphone, 
  Target, 
  User, 
  Zap,
  Activity,
  AlertCircle,
  TrendingUp,
  BarChart3,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface TokenAbuse {
  id: string;
  userId: string;
  username: string;
  tokenId: string;
  riskScore: number;
  status: 'active' | 'flagged' | 'killed' | 'suspended';
  lastActivity: string;
  createdAt: string;
  violations: string[];
  geoLocations: Array<{
    country: string;
    city: string;
    ip: string;
    timestamp: string;
  }>;
  sessions: Array<{
    id: string;
    ip: string;
    location: string;
    device: string;
    browser: string;
    requestCount: number;
    lastSeen: string;
    fingerprint: string;
  }>;
  metrics: {
    burstVolume: number;
    concurrentSessions: number;
    geoSwitches: number;
    fingerprintChanges: number;
    apiRequestsPerMinute: number;
  };
  timeline: Array<{
    timestamp: string;
    event: string;
    location: string;
    device: string;
    details: any;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
}

interface AbuseAlert {
  id: string;
  type: 'geo_drift' | 'burst_volume' | 'concurrent_sessions' | 'bot_detection' | 'suspicious_pattern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  tokenId: string;
  username: string;
  timestamp: string;
  autoAction?: string;
}

export const TokenAbuseScanner: React.FC = () => {
  const [abuseData, setAbuseData] = useState<TokenAbuse[]>([]);
  const [alerts, setAlerts] = useState<AbuseAlert[]>([]);
  const [filteredData, setFilteredData] = useState<TokenAbuse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedToken, setSelectedToken] = useState<TokenAbuse | null>(null);
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoKillEnabled, setAutoKillEnabled] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);

  // Mock data - in real implementation, this would come from API
  useEffect(() => {
    const mockAbuseData: TokenAbuse[] = [
      {
        id: 'abuse-1',
        userId: 'user-123',
        username: 'JohnD',
        tokenId: 'tok_abc123def456',
        riskScore: 82,
        status: 'flagged',
        lastActivity: '2024-01-26T15:15:00Z',
        createdAt: '2024-01-26T03:12:00Z',
        violations: ['geo_drift', 'high_frequency', 'concurrent_devices', 'fingerprint_change'],
        geoLocations: [
          { country: 'Albania', city: 'Tirana', ip: '185.23.45.67', timestamp: '2024-01-26T03:12:00Z' },
          { country: 'USA', city: 'New York', ip: '192.168.1.1', timestamp: '2024-01-26T03:14:00Z' },
          { country: 'Germany', city: 'Berlin', ip: '92.124.33.89', timestamp: '2024-01-26T03:16:00Z' }
        ],
        sessions: [
          {
            id: 'sess-1',
            ip: '185.23.45.67',
            location: 'Tirana, Albania',
            device: 'MacBook Pro',
            browser: 'Safari 17.2',
            requestCount: 45,
            lastSeen: '2024-01-26T03:13:00Z',
            fingerprint: 'fp_safari_mac_123'
          },
          {
            id: 'sess-2',
            ip: '192.168.1.1',
            location: 'New York, USA',
            device: 'Windows PC',
            browser: 'Chrome 120.0',
            requestCount: 78,
            lastSeen: '2024-01-26T15:15:00Z',
            fingerprint: 'fp_chrome_win_456'
          }
        ],
        metrics: {
          burstVolume: 34,
          concurrentSessions: 2,
          geoSwitches: 3,
          fingerprintChanges: 2,
          apiRequestsPerMinute: 28
        },
        timeline: [
          {
            timestamp: '2024-01-26T03:12:00Z',
            event: 'Token Created',
            location: 'Tirana, Albania',
            device: 'Safari on MacBook',
            details: { method: 'login' },
            severity: 'low'
          },
          {
            timestamp: '2024-01-26T03:13:00Z',
            event: '12 API Calls',
            location: 'Tirana, Albania',
            device: 'Safari on MacBook',
            details: { requestCount: 12 },
            severity: 'medium'
          },
          {
            timestamp: '2024-01-26T03:14:00Z',
            event: 'Geo Drift Detected',
            location: 'New York, USA',
            device: 'Chrome on Windows',
            details: { previousLocation: 'Albania', timeGap: '2 minutes' },
            severity: 'high'
          },
          {
            timestamp: '2024-01-26T03:15:00Z',
            event: '3 Accounts Accessed',
            location: 'New York, USA',
            device: 'Chrome on Windows',
            details: { accountIds: ['user-123', 'user-456', 'user-789'] },
            severity: 'critical'
          }
        ]
      },
      {
        id: 'abuse-2',
        userId: 'user-456',
        username: 'SarahM',
        tokenId: 'tok_def456ghi789',
        riskScore: 34,
        status: 'active',
        lastActivity: '2024-01-26T14:30:00Z',
        createdAt: '2024-01-26T12:00:00Z',
        violations: ['burst_volume'],
        geoLocations: [
          { country: 'UK', city: 'London', ip: '203.45.67.89', timestamp: '2024-01-26T12:00:00Z' }
        ],
        sessions: [
          {
            id: 'sess-3',
            ip: '203.45.67.89',
            location: 'London, UK',
            device: 'iPhone 15',
            browser: 'Safari Mobile',
            requestCount: 23,
            lastSeen: '2024-01-26T14:30:00Z',
            fingerprint: 'fp_safari_ios_789'
          }
        ],
        metrics: {
          burstVolume: 22,
          concurrentSessions: 1,
          geoSwitches: 0,
          fingerprintChanges: 0,
          apiRequestsPerMinute: 15
        },
        timeline: [
          {
            timestamp: '2024-01-26T12:00:00Z',
            event: 'Token Created',
            location: 'London, UK',
            device: 'Safari on iPhone',
            details: { method: 'oauth' },
            severity: 'low'
          },
          {
            timestamp: '2024-01-26T14:15:00Z',
            event: 'Burst Activity',
            location: 'London, UK',
            device: 'Safari on iPhone',
            details: { requestCount: 22, duration: '30 seconds' },
            severity: 'medium'
          }
        ]
      }
    ];

    const mockAlerts: AbuseAlert[] = [
      {
        id: 'alert-1',
        type: 'geo_drift',
        severity: 'critical',
        message: 'Token used in Albania and USA within 2 minutes',
        tokenId: 'tok_abc123def456',
        username: 'JohnD',
        timestamp: '2024-01-26T03:14:00Z',
        autoAction: 'Token flagged for review'
      },
      {
        id: 'alert-2',
        type: 'burst_volume',
        severity: 'medium',
        message: 'Unusual burst activity detected: 22 requests in 30 seconds',
        tokenId: 'tok_def456ghi789',
        username: 'SarahM',
        timestamp: '2024-01-26T14:15:00Z'
      }
    ];

    setAbuseData(mockAbuseData);
    setAlerts(mockAlerts);
    setFilteredData(mockAbuseData);
    setLoading(false);
  }, []);

  // Filter data based on search and filters
  useEffect(() => {
    let filtered = abuseData;

    if (searchQuery) {
      filtered = filtered.filter(token => 
        token.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.tokenId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterRisk !== 'all') {
      filtered = filtered.filter(token => {
        const score = token.riskScore;
        switch (filterRisk) {
          case 'low': return score < 40;
          case 'medium': return score >= 40 && score < 75;
          case 'high': return score >= 75;
          default: return true;
        }
      });
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(token => token.status === filterStatus);
    }

    setFilteredData(filtered);
  }, [abuseData, searchQuery, filterRisk, filterStatus]);

  const getRiskBadgeColor = (score: number) => {
    if (score < 40) return 'bg-green-100 text-green-800 border-green-200';
    if (score < 75) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'flagged': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'killed': return 'bg-red-100 text-red-800 border-red-200';
      case 'suspended': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getViolationIcon = (violation: string) => {
    switch (violation) {
      case 'geo_drift': return <Globe className="w-4 h-4 text-red-500" />;
      case 'high_frequency': return <Zap className="w-4 h-4 text-orange-500" />;
      case 'concurrent_devices': return <Monitor className="w-4 h-4 text-purple-500" />;
      case 'fingerprint_change': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'burst_volume': return <TrendingUp className="w-4 h-4 text-yellow-500" />;
      case 'bot_detection': return <Target className="w-4 h-4 text-red-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getBrowserIcon = (browser: string) => {
    if (browser.includes('Chrome')) return <Monitor className="w-4 h-4" />;
    if (browser.includes('Safari')) return <Smartphone className="w-4 h-4" />;
    if (browser.includes('Firefox')) return <Monitor className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const handleTokenAction = (action: string, token: TokenAbuse) => {
    console.log(`Token action: ${action} for token ${token.tokenId}`);
    // In real implementation, this would make API calls
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const criticalTokens = filteredData.filter(t => t.riskScore >= 75).length;
  const warningTokens = filteredData.filter(t => t.riskScore >= 40 && t.riskScore < 75).length;
  const normalTokens = filteredData.filter(t => t.riskScore < 40).length;
  const activeAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Token Abuse Scanner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Token Abuse Scanner
            {realTimeEnabled && (
              <Badge className="bg-green-100 text-green-800 border-green-200 animate-pulse">
                Live
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {criticalTokens > 0 && (
              <Badge className={getRiskBadgeColor(85)}>
                🔴 {criticalTokens} critical
              </Badge>
            )}
            {warningTokens > 0 && (
              <Badge className={getRiskBadgeColor(60)}>
                🟡 {warningTokens} warning
              </Badge>
            )}
            {activeAlerts > 0 && (
              <Badge className="bg-red-100 text-red-800 border-red-200">
                🚨 {activeAlerts} alerts
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tokens" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tokens">Token Monitor</TabsTrigger>
            <TabsTrigger value="alerts">Live Alerts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Auto-Response</TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <Input
                  placeholder="Search tokens or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48"
                />
              </div>
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  <SelectItem value="high">High (75+)</SelectItem>
                  <SelectItem value="medium">Medium (40-74)</SelectItem>
                  <SelectItem value="low">Low (&lt;40)</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="killed">Killed</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Token List */}
            <div className="space-y-4">
              {filteredData.map((token) => (
                <Card key={token.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-6 h-6" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{token.username}</h3>
                            <Badge className={getStatusBadgeColor(token.status)}>
                              {token.status}
                            </Badge>
                            <Badge className={getRiskBadgeColor(token.riskScore)}>
                              Risk: {token.riskScore}/100
                            </Badge>
                            <span className="text-xs text-gray-500">Token: {token.tokenId.slice(0, 16)}...</span>
                          </div>
                          
                          {/* Risk Meter */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>Risk Score</span>
                              <span className="font-medium">{token.riskScore}/100</span>
                            </div>
                            <Progress 
                              value={token.riskScore} 
                              className="h-2"
                            />
                          </div>

                          {/* Metrics Row */}
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>📊 {token.metrics.apiRequestsPerMinute}/min</span>
                            <span>🌍 {token.geoLocations.length} locations</span>
                            <span>💻 {token.sessions.length} sessions</span>
                            <span>🕒 {formatTimeAgo(token.lastActivity)}</span>
                          </div>

                          {/* Violations */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Violations:</span>
                            {token.violations.map((violation, index) => (
                              <div key={index} className="flex items-center gap-1">
                                {getViolationIcon(violation)}
                                <span className="text-xs capitalize">{violation.replace('_', ' ')}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedToken(token)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Token Analysis - {token.username}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              {/* Header Info */}
                              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">{token.username}</h3>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span>Token: {token.tokenId}</span>
                                    <span>Created: {formatTimeAgo(token.createdAt)}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge className={getRiskBadgeColor(token.riskScore)}>
                                      Risk Score: {token.riskScore}/100
                                    </Badge>
                                    <Badge className={getStatusBadgeColor(token.status)}>
                                      {token.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              {/* Metrics Grid */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card className="p-3">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-red-600">{token.metrics.burstVolume}</div>
                                    <div className="text-xs text-gray-600">Burst Volume/min</div>
                                  </div>
                                </Card>
                                <Card className="p-3">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">{token.metrics.concurrentSessions}</div>
                                    <div className="text-xs text-gray-600">Concurrent Sessions</div>
                                  </div>
                                </Card>
                                <Card className="p-3">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">{token.metrics.geoSwitches}</div>
                                    <div className="text-xs text-gray-600">Geo Switches</div>
                                  </div>
                                </Card>
                                <Card className="p-3">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{token.metrics.fingerprintChanges}</div>
                                    <div className="text-xs text-gray-600">Fingerprint Changes</div>
                                  </div>
                                </Card>
                              </div>

                              {/* Sessions */}
                              <div className="space-y-3">
                                <h4 className="font-semibold">💻 Active Sessions</h4>
                                {token.sessions.map((session) => (
                                  <Card key={session.id} className="p-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        {getBrowserIcon(session.browser)}
                                        <div>
                                          <div className="font-medium">{session.location}</div>
                                          <div className="text-sm text-gray-600">
                                            {session.device} • {session.browser} • {session.requestCount} requests
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            IP: {session.ip} • Last seen: {formatTimeAgo(session.lastSeen)}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                          <Ban className="w-4 h-4 mr-1" />
                                          Kill
                                        </Button>
                                        <Button variant="outline" size="sm">
                                          <Lock className="w-4 h-4 mr-1" />
                                          Lock
                                        </Button>
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                              </div>

                              {/* Timeline */}
                              <div className="space-y-3">
                                <h4 className="font-semibold">🧾 Activity Timeline</h4>
                                {token.timeline.map((event, index) => (
                                  <div key={index} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                                    <div className="flex-shrink-0 mt-1">
                                      <Clock className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <p className="font-medium">{event.event}</p>
                                        <Badge className={getRiskBadgeColor(event.severity === 'critical' ? 90 : event.severity === 'high' ? 80 : event.severity === 'medium' ? 50 : 20)}>
                                          {event.severity}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-gray-600">
                                        🕒 {new Date(event.timestamp).toLocaleTimeString()} - 
                                        📍 {event.location} - 
                                        💻 {event.device}
                                      </p>
                                      {event.details && (
                                        <div className="mt-1 text-sm text-gray-500">
                                          {Object.entries(event.details).map(([key, value]) => (
                                            <span key={key} className="mr-3">
                                              {key}: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Admin Actions */}
                              <div className="flex flex-wrap gap-2 pt-4 border-t">
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleTokenAction('kill', token)}
                                >
                                  <Ban className="w-4 h-4 mr-2" />
                                  Kill Token
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleTokenAction('force_login', token)}
                                >
                                  <LogOut className="w-4 h-4 mr-2" />
                                  Force Login
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleTokenAction('session_lock', token)}
                                >
                                  <Lock className="w-4 h-4 mr-2" />
                                  Session Lock
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleTokenAction('export', token)}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Export Report
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredData.length === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No token abuse incidents found matching your filters.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">🚨 Live Security Alerts</h3>
              <Badge className="bg-red-100 text-red-800 border-red-200">
                {activeAlerts} Active
              </Badge>
            </div>

            <div className="space-y-3">
              {alerts.map((alert) => (
                <Alert key={alert.id} className={`border-l-4 ${
                  alert.severity === 'critical' ? 'border-l-red-500 bg-red-50' :
                  alert.severity === 'high' ? 'border-l-orange-500 bg-orange-50' :
                  alert.severity === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                  'border-l-blue-500 bg-blue-50'
                }`}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{alert.username} - {alert.message}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Token: {alert.tokenId.slice(0, 16)}... • {formatTimeAgo(alert.timestamp)}
                          {alert.autoAction && (
                            <span className="ml-2 text-blue-600">• Auto-action: {alert.autoAction}</span>
                          )}
                        </div>
                      </div>
                      <Badge className={getRiskBadgeColor(alert.severity === 'critical' ? 90 : alert.severity === 'high' ? 80 : alert.severity === 'medium' ? 50 : 20)}>
                        {alert.severity}
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Token Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>🟢 Normal ({normalTokens})</span>
                      <span>{Math.round((normalTokens / filteredData.length) * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🟡 Warning ({warningTokens})</span>
                      <span>{Math.round((warningTokens / filteredData.length) * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🔴 Critical ({criticalTokens})</span>
                      <span>{Math.round((criticalTokens / filteredData.length) * 100)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top Violations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>🌍 Geo Drift</span>
                      <span>3 cases</span>
                    </div>
                    <div className="flex justify-between">
                      <span>⚡ High Frequency</span>
                      <span>2 cases</span>
                    </div>
                    <div className="flex justify-between">
                      <span>💻 Concurrent Devices</span>
                      <span>1 case</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Auto-Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>🔴 Tokens Killed</span>
                      <span>0 today</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🚨 Alerts Sent</span>
                      <span>{alerts.length} today</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🔒 Sessions Locked</span>
                      <span>0 today</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Auto-Kill Tokens</h3>
                  <p className="text-sm text-gray-600">Automatically kill tokens that exceed critical risk thresholds</p>
                </div>
                <Switch checked={autoKillEnabled} onCheckedChange={setAutoKillEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Real-Time Monitoring</h3>
                  <p className="text-sm text-gray-600">Enable live token abuse detection and alerts</p>
                </div>
                <Switch checked={realTimeEnabled} onCheckedChange={setRealTimeEnabled} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">🚨 Alert Thresholds</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="api-threshold">API Requests/min</Label>
                      <Input id="api-threshold" type="number" defaultValue="30" className="w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="geo-time">Geo switch time (min)</Label>
                      <Input id="geo-time" type="number" defaultValue="5" className="w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="concurrent-sessions">Max concurrent sessions</Label>
                      <Input id="concurrent-sessions" type="number" defaultValue="3" className="w-20" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">⚙️ Auto-Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-flag">Auto-flag high risk tokens</Label>
                      <Switch id="auto-flag" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-notify">Send admin notifications</Label>
                      <Switch id="auto-notify" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-kill">Auto-kill critical tokens</Label>
                      <Switch id="auto-kill" checked={autoKillEnabled} onCheckedChange={setAutoKillEnabled} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="geo-lock">Lock sessions on geo drift</Label>
                      <Switch id="geo-lock" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};