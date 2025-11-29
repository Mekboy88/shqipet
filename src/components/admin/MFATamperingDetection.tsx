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
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  Eye, 
  Ban, 
  Flag, 
  Download,
  Filter,
  Search,
  Activity,
  MapPin,
  Smartphone,
  CreditCard,
  Mail,
  Lock,
  Unlock,
  Trash2,
  User,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface MFAEvent {
  id: string;
  userId: string;
  username: string;
  timestamp: string;
  action: string;
  eventType: 'mfa_disabled' | 'mfa_enabled' | 'post_deleted' | 'credit_transfer' | 'password_change' | 'email_change' | 'ip_change' | 'device_change';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: any;
  ipAddress: string;
  deviceInfo: string;
  location: string;
}

interface TamperingIncident {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  riskScore: number;
  status: 'active' | 'resolved' | 'monitoring';
  mfaDisabledAt: string;
  criticalActionsCount: number;
  lastActionAt: string;
  deviceInfo: string;
  ipAddress: string;
  location: string;
  timeline: MFAEvent[];
  flaggedActions: string[];
  automationTriggered: boolean;
}

export const MFATamperingDetection: React.FC = () => {
  const [incidents, setIncidents] = useState<TamperingIncident[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<TamperingIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<TamperingIncident | null>(null);
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoMonitoringEnabled, setAutoMonitoringEnabled] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  // Mock data - in real implementation, this would come from API
  useEffect(() => {
    const mockIncidents: TamperingIncident[] = [
      {
        id: '1',
        userId: 'user-123',
        username: 'JohnD',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnD',
        riskScore: 84,
        status: 'active',
        mfaDisabledAt: '2024-01-26T14:02:00Z',
        criticalActionsCount: 3,
        lastActionAt: '2024-01-26T14:10:00Z',
        deviceInfo: 'Chrome on MacBook',
        ipAddress: '185.23.45.67',
        location: 'London, UK',
        flaggedActions: ['credit_transfer', 'post_deletion', 'ip_change'],
        automationTriggered: true,
        timeline: [
          {
            id: 'evt1',
            userId: 'user-123',
            username: 'JohnD',
            timestamp: '2024-01-26T14:02:00Z',
            action: 'MFA Disabled',
            eventType: 'mfa_disabled',
            severity: 'medium',
            details: { reason: 'User request' },
            ipAddress: '185.23.45.67',
            deviceInfo: 'Chrome on MacBook',
            location: 'London, UK'
          },
          {
            id: 'evt2',
            userId: 'user-123',
            username: 'JohnD',
            timestamp: '2024-01-26T14:04:00Z',
            action: 'Deleted 2 posts',
            eventType: 'post_deleted',
            severity: 'medium',
            details: { postCount: 2 },
            ipAddress: '185.23.45.67',
            deviceInfo: 'Chrome on MacBook',
            location: 'London, UK'
          },
          {
            id: 'evt3',
            userId: 'user-123',
            username: 'JohnD',
            timestamp: '2024-01-26T14:07:00Z',
            action: 'Transferred 400 credits',
            eventType: 'credit_transfer',
            severity: 'high',
            details: { amount: 400, recipient: 'user-456' },
            ipAddress: '185.23.45.67',
            deviceInfo: 'Chrome on MacBook',
            location: 'London, UK'
          },
          {
            id: 'evt4',
            userId: 'user-123',
            username: 'JohnD',
            timestamp: '2024-01-26T14:08:00Z',
            action: 'IP switched to new country',
            eventType: 'ip_change',
            severity: 'high',
            details: { newLocation: 'Berlin, DE' },
            ipAddress: '92.124.33.89',
            deviceInfo: 'Chrome on MacBook',
            location: 'Berlin, DE'
          },
          {
            id: 'evt5',
            userId: 'user-123',
            username: 'JohnD',
            timestamp: '2024-01-26T14:10:00Z',
            action: 'MFA Re-enabled',
            eventType: 'mfa_enabled',
            severity: 'low',
            details: { method: 'authenticator' },
            ipAddress: '92.124.33.89',
            deviceInfo: 'Chrome on MacBook',
            location: 'Berlin, DE'
          }
        ]
      },
      {
        id: '2',
        userId: 'user-456',
        username: 'SarahM',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahM',
        riskScore: 45,
        status: 'monitoring',
        mfaDisabledAt: '2024-01-26T12:15:00Z',
        criticalActionsCount: 1,
        lastActionAt: '2024-01-26T12:20:00Z',
        deviceInfo: 'Safari on iPhone',
        ipAddress: '203.45.67.89',
        location: 'Sydney, AU',
        flaggedActions: ['password_change'],
        automationTriggered: false,
        timeline: [
          {
            id: 'evt6',
            userId: 'user-456',
            username: 'SarahM',
            timestamp: '2024-01-26T12:15:00Z',
            action: 'MFA Disabled',
            eventType: 'mfa_disabled',
            severity: 'medium',
            details: { reason: 'Lost device' },
            ipAddress: '203.45.67.89',
            deviceInfo: 'Safari on iPhone',
            location: 'Sydney, AU'
          },
          {
            id: 'evt7',
            userId: 'user-456',
            username: 'SarahM',
            timestamp: '2024-01-26T12:20:00Z',
            action: 'Password changed',
            eventType: 'password_change',
            severity: 'high',
            details: { method: 'email_link' },
            ipAddress: '203.45.67.89',
            deviceInfo: 'Safari on iPhone',
            location: 'Sydney, AU'
          }
        ]
      }
    ];

    setIncidents(mockIncidents);
    setFilteredIncidents(mockIncidents);
    setLoading(false);
  }, []);

  // Filter incidents based on search and filters
  useEffect(() => {
    let filtered = incidents;

    if (searchQuery) {
      filtered = filtered.filter(incident => 
        incident.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.userId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterRisk !== 'all') {
      filtered = filtered.filter(incident => {
        const score = incident.riskScore;
        switch (filterRisk) {
          case 'low': return score < 40;
          case 'medium': return score >= 40 && score < 75;
          case 'high': return score >= 75;
          default: return true;
        }
      });
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(incident => incident.status === filterStatus);
    }

    setFilteredIncidents(filtered);
  }, [incidents, searchQuery, filterRisk, filterStatus]);

  const getRiskBadgeColor = (score: number) => {
    if (score < 40) return 'bg-green-100 text-green-800 border-green-200';
    if (score < 75) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800 border-red-200';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'mfa_disabled': return <Unlock className="w-4 h-4 text-red-500" />;
      case 'mfa_enabled': return <Lock className="w-4 h-4 text-green-500" />;
      case 'post_deleted': return <Trash2 className="w-4 h-4 text-orange-500" />;
      case 'credit_transfer': return <CreditCard className="w-4 h-4 text-purple-500" />;
      case 'password_change': return <Settings className="w-4 h-4 text-blue-500" />;
      case 'email_change': return <Mail className="w-4 h-4 text-indigo-500" />;
      case 'ip_change': return <MapPin className="w-4 h-4 text-red-500" />;
      case 'device_change': return <Smartphone className="w-4 h-4 text-gray-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleAdminAction = (action: string, incident: TamperingIncident) => {
    console.log(`Admin action: ${action} for incident ${incident.id}`);
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

  const criticalIncidents = filteredIncidents.filter(i => i.riskScore >= 75).length;
  const warningIncidents = filteredIncidents.filter(i => i.riskScore >= 40 && i.riskScore < 75).length;
  const normalIncidents = filteredIncidents.filter(i => i.riskScore < 40).length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            MFA Tampering Detection
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
            MFA Tampering Detection
          </div>
          <div className="flex items-center gap-2">
            {criticalIncidents > 0 && (
              <Badge className={getRiskBadgeColor(85)}>
                🔴 {criticalIncidents} flagged
              </Badge>
            )}
            {warningIncidents > 0 && (
              <Badge className={getRiskBadgeColor(60)}>
                🟡 {warningIncidents} suspicious
              </Badge>
            )}
            {normalIncidents > 0 && (
              <Badge className={getRiskBadgeColor(20)}>
                🟢 {normalIncidents} normal
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="incidents" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="incidents">Active Incidents</TabsTrigger>
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            <TabsTrigger value="settings">Automation Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="incidents" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <Input
                  placeholder="Search users..."
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
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Incidents List */}
            <div className="space-y-4">
              {filteredIncidents.map((incident) => (
                <Card key={incident.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {incident.avatar ? (
                            <img src={incident.avatar} alt={incident.username} className="w-full h-full rounded-full" />
                          ) : (
                            <User className="w-6 h-6" />
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{incident.username}</h3>
                            <Badge className={getStatusBadgeColor(incident.status)}>
                              {incident.status}
                            </Badge>
                            <Badge className={getRiskBadgeColor(incident.riskScore)}>
                              Risk: {incident.riskScore}/100
                            </Badge>
                            {incident.automationTriggered && (
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                Auto-flagged
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center gap-4">
                              <span>📱 {incident.deviceInfo}</span>
                              <span>🌍 {incident.location}</span>
                              <span>🕒 MFA disabled: {formatTimeAgo(incident.mfaDisabledAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>🔴 {incident.criticalActionsCount} critical actions</span>
                              <span>⚠️ Flagged: {incident.flaggedActions.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedIncident(incident)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Timeline
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>MFA Tampering Timeline - {incident.username}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                  {incident.avatar ? (
                                    <img src={incident.avatar} alt={incident.username} className="w-full h-full rounded-full" />
                                  ) : (
                                    <User className="w-8 h-8" />
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg">{incident.username}</h3>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span>📱 {incident.deviceInfo}</span>
                                    <span>🌍 {incident.location}</span>
                                    <span>📍 {incident.ipAddress}</span>
                                  </div>
                                   <div className="mt-1">
                                     <Badge className={getRiskBadgeColor(incident.riskScore)}>
                                       Risk Score: {incident.riskScore}/100
                                     </Badge>
                                   </div>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <h4 className="font-semibold">🧾 Action Timeline:</h4>
                                {incident.timeline.map((event, index) => (
                                  <div key={event.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                                    <div className="flex-shrink-0">
                                      {getEventIcon(event.eventType)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <p className="font-medium">{event.action}</p>
                                        <Badge className={getRiskBadgeColor(event.severity === 'critical' ? 90 : event.severity === 'high' ? 80 : event.severity === 'medium' ? 50 : 20)}>
                                          {event.severity}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-gray-600">
                                        🕒 {new Date(event.timestamp).toLocaleTimeString()} - 
                                        📍 {event.location} - 
                                        💻 {event.deviceInfo}
                                      </p>
                                      {event.details && (
                                        <div className="mt-1 text-sm text-gray-500">
                                          {JSON.stringify(event.details, null, 2)}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="flex flex-wrap gap-2 pt-4 border-t">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleAdminAction('view_audit', incident)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Full Audit
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleAdminAction('require_mfa', incident)}
                                >
                                  <Lock className="w-4 h-4 mr-2" />
                                  Require MFA
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleAdminAction('kill_session', incident)}
                                >
                                  <Ban className="w-4 h-4 mr-2" />
                                  Kill Session
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleAdminAction('flag_monitoring', incident)}
                                >
                                  <Flag className="w-4 h-4 mr-2" />
                                  Flag for Monitoring
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

            {filteredIncidents.length === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No MFA tampering incidents found matching your filters.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Alert>
              <Activity className="h-4 w-4" />
              <AlertDescription>
                Timeline view shows chronological MFA events across all users in the selected timeframe.
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center gap-4">
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              {filteredIncidents.flatMap(incident => incident.timeline)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 20)
                .map((event, index) => (
                <div key={`${event.id}-${index}`} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0">
                    {getEventIcon(event.eventType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{event.username} - {event.action}</p>
                      <span className="text-sm text-gray-500">{formatTimeAgo(event.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{event.location} • {event.deviceInfo}</p>
                  </div>
                  <Badge className={getRiskBadgeColor(event.severity === 'critical' ? 90 : event.severity === 'high' ? 80 : event.severity === 'medium' ? 50 : 20)}>
                    {event.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Auto-Monitoring</h3>
                  <p className="text-sm text-gray-600">Automatically detect and flag suspicious MFA tampering patterns</p>
                </div>
                <Switch checked={autoMonitoringEnabled} onCheckedChange={setAutoMonitoringEnabled} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">🚦 Risk Thresholds</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="high-risk">High Risk Score</Label>
                      <Input id="high-risk" type="number" defaultValue="75" className="w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="medium-risk">Medium Risk Score</Label>
                      <Input id="medium-risk" type="number" defaultValue="40" className="w-20" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">⏰ Time Windows</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="critical-window">Critical Action Window</Label>
                      <Input id="critical-window" type="number" defaultValue="15" className="w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="monitoring-duration">Monitoring Duration</Label>
                      <Input id="monitoring-duration" type="number" defaultValue="24" className="w-20" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">🔁 Automation Triggers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-kill">Auto kill session on critical risk</Label>
                      <Switch id="auto-kill" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-notify">Auto notify admins on high risk</Label>
                      <Switch id="auto-notify" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-flag">Auto flag for monitoring</Label>
                      <Switch id="auto-flag" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-mfa">Force MFA revalidation</Label>
                      <Switch id="auto-mfa" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};