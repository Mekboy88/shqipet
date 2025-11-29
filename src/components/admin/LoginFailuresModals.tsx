import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Copy, Download, Shield, AlertTriangle, Users, Database, Activity, FileText, Trash2, CheckCircle, Clock, Monitor, MapPin, Ban, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface LoginFailuresInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginFailuresInspectorModal: React.FC<LoginFailuresInspectorModalProps> = ({ isOpen, onClose }) => {
  // Mock data for demonstration
  const failureData = {
    totalFailures: 2847,
    uniqueIPs: 156,
    blockedIPs: 23,
    affectedUsers: 89,
    last24hFailures: 342,
    avgFailuresPerIP: 18.2,
    peakHour: '14:00-15:00'
  };

  const topFailingIPs = [
    { ip: '185.220.101.42', attempts: 127, country: 'RU', status: 'blocked', last_attempt: '2025-07-30T14:23:00Z' },
    { ip: '91.242.217.99', attempts: 89, country: 'CN', status: 'flagged', last_attempt: '2025-07-30T14:15:00Z' },
    { ip: '151.228.33.198', attempts: 67, country: 'IT', status: 'watching', last_attempt: '2025-07-30T14:10:00Z' }
  ];

  const topFailingUsers = [
    { user_email: 'admin@example.com', attempts: 45, ip_count: 12, status: 'locked' },
    { user_email: 'test@domain.com', attempts: 23, ip_count: 3, status: 'active' },
    { user_email: 'user123@site.org', attempts: 18, ip_count: 1, status: 'active' }
  ];

  const anomalies = [
    { type: 'Brute Force Attack', count: 15, severity: 'critical', description: 'Same IP attempting 50+ logins in 10 minutes' },
    { type: 'Credential Stuffing', count: 8, severity: 'high', description: 'Multiple accounts targeted from single IP' },
    { type: 'Distributed Attack', count: 3, severity: 'medium', description: 'Coordinated attack from multiple IPs' }
  ];

  const handleExport = (format: 'csv' | 'json', type: 'failures' | 'blocklist') => {
    let data: string;
    if (type === 'blocklist') {
      const blockedIPs = topFailingIPs.filter(ip => ip.status === 'blocked').map(ip => ip.ip);
      data = format === 'csv' 
        ? blockedIPs.join('\n')
        : JSON.stringify(blockedIPs, null, 2);
    } else {
      data = format === 'csv' 
        ? topFailingIPs.map(d => `${d.ip},${d.attempts},${d.country},${d.status},${d.last_attempt}`).join('\n')
        : JSON.stringify(topFailingIPs, null, 2);
    }
    
    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `login_${type}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`${type} exported as ${format.toUpperCase()}`);
  };

  const handleCopySQL = (sql: string) => {
    navigator.clipboard.writeText(sql);
    toast.success('SQL copied to clipboard');
  };

  const handleBanIP = (ip: string) => {
    toast.success(`IP ${ip} has been banned`);
  };

  const handleUnbanIP = (ip: string) => {
    toast.success(`IP ${ip} has been unbanned`);
  };

  const handleLockUser = (email: string) => {
    toast.success(`User ${email} account has been locked`);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'blocked': return 'destructive';
      case 'flagged': return 'secondary';
      case 'watching': return 'outline';
      case 'locked': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Inspect Table: login_failures
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schema">Schema & Fields</TabsTrigger>
            <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
            <TabsTrigger value="security">Security Triggers</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4 space-y-4 overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{failureData.totalFailures}</div>
                <div className="text-sm text-red-700">Total Failures</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{failureData.uniqueIPs}</div>
                <div className="text-sm text-orange-700">Unique IPs</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{failureData.blockedIPs}</div>
                <div className="text-sm text-gray-700">Blocked IPs</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{failureData.last24hFailures}</div>
                <div className="text-sm text-blue-700">Last 24h</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white border rounded-lg p-4">
                <h5 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Top Failing IPs
                </h5>
                <div className="space-y-2">
                  {topFailingIPs.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm">{item.ip}</span>
                        <Badge variant="outline">{item.country}</Badge>
                        <Badge variant={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-red-600">{item.attempts} attempts</span>
                        <div className="flex gap-1">
                          {item.status === 'blocked' ? (
                            <Button 
                              onClick={() => handleUnbanIP(item.ip)}
                              variant="outline" 
                              size="sm"
                              className="text-xs"
                            >
                              <EyeOff className="w-3 h-3" />
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => handleBanIP(item.ip)}
                              variant="destructive" 
                              size="sm"
                              className="text-xs"
                            >
                              <Ban className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h5 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Top Failing Users
                </h5>
                <div className="space-y-2">
                  {topFailingUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <span className="text-sm">{user.user_email}</span>
                        <Badge variant={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">{user.attempts} attempts</span>
                        <span className="text-xs text-gray-600">{user.ip_count} IPs</span>
                        {user.status !== 'locked' && (
                          <Button 
                            onClick={() => handleLockUser(user.user_email)}
                            variant="destructive" 
                            size="sm"
                            className="text-xs"
                          >
                            <Ban className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h5 className="font-semibold mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Attack Pattern Analysis
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium">Peak Attack Time</div>
                  <div className="text-gray-600">{failureData.peakHour}</div>
                </div>
                <div>
                  <div className="font-medium">Avg Attempts per IP</div>
                  <div className="text-gray-600">{failureData.avgFailuresPerIP}</div>
                </div>
                <div>
                  <div className="font-medium">Affected Users</div>
                  <div className="text-gray-600">{failureData.affectedUsers}</div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Schema Tab */}
          <TabsContent value="schema" className="mt-4 space-y-4 overflow-y-auto max-h-[70vh]">
            <div className="space-y-3">
              <h5 className="font-semibold">Table Schema</h5>
              <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-medium">Field</th>
                      <th className="text-left p-3 font-medium">Type</th>
                      <th className="text-left p-3 font-medium">Nullable</th>
                      <th className="text-left p-3 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-3 font-mono">ip_address</td>
                      <td className="p-3"><Badge variant="outline">inet</Badge></td>
                      <td className="p-3"><Badge variant="destructive">No</Badge></td>
                      <td className="p-3 text-sm">Source IP of failed attempt</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">user_id</td>
                      <td className="p-3"><Badge variant="outline">uuid</Badge></td>
                      <td className="p-3"><Badge variant="secondary">Yes</Badge></td>
                      <td className="p-3 text-sm">Target user (if provided)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">attempted_email</td>
                      <td className="p-3"><Badge variant="outline">text</Badge></td>
                      <td className="p-3"><Badge variant="secondary">Yes</Badge></td>
                      <td className="p-3 text-sm">Email used in attempt</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">attempt_count</td>
                      <td className="p-3"><Badge variant="outline">integer</Badge></td>
                      <td className="p-3"><Badge variant="destructive">No</Badge></td>
                      <td className="p-3 text-sm">Number of consecutive failures</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">timestamp</td>
                      <td className="p-3"><Badge variant="outline">timestamp</Badge></td>
                      <td className="p-3"><Badge variant="destructive">No</Badge></td>
                      <td className="p-3 text-sm">When the failure occurred</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">blocked_until</td>
                      <td className="p-3"><Badge variant="outline">timestamp</Badge></td>
                      <td className="p-3"><Badge variant="secondary">Yes</Badge></td>
                      <td className="p-3 text-sm">Temporary block expiration</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">failure_reason</td>
                      <td className="p-3"><Badge variant="outline">text</Badge></td>
                      <td className="p-3"><Badge variant="secondary">Yes</Badge></td>
                      <td className="p-3 text-sm">Type of authentication failure</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-2">
              <h6 className="font-medium">Indexes & Performance</h6>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Primary Key</Badge>
                  <span>id (uuid)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Index</Badge>
                  <span>ip_address (for fast IP lookups)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Index</Badge>
                  <span>timestamp (for time-based queries)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Composite Index</Badge>
                  <span>ip_address, timestamp (for rate limiting)</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Anomalies Tab */}
          <TabsContent value="anomalies" className="mt-4 space-y-4 overflow-y-auto max-h-[70vh]">
            <div className="space-y-4">
              <h5 className="font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Attack Pattern Detection
              </h5>
              
              {anomalies.map((anomaly, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(anomaly.severity)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{anomaly.type}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={anomaly.severity === 'critical' ? 'destructive' : anomaly.severity === 'high' ? 'secondary' : 'default'}>
                        {anomaly.count} detected
                      </Badge>
                      <Badge variant="outline">
                        {anomaly.severity}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm">{anomaly.description}</p>
                </div>
              ))}

              <div className="bg-white border rounded-lg p-4">
                <h6 className="font-medium mb-3">Detection Thresholds</h6>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Brute Force Detection</div>
                      <div className="text-xs text-gray-600">Trigger when IP exceeds attempts in time window</div>
                    </div>
                    <div className="text-sm">
                      <Badge variant="destructive">10 attempts / 5 min</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Credential Stuffing</div>
                      <div className="text-xs text-gray-600">Multiple usernames from single IP</div>
                    </div>
                    <div className="text-sm">
                      <Badge variant="secondary">5+ users / IP</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Distributed Attack</div>
                      <div className="text-xs text-gray-600">Coordinated attempts across IPs</div>
                    </div>
                    <div className="text-sm">
                      <Badge variant="default">Pattern detection</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-4 space-y-4 overflow-y-auto max-h-[70vh]">
            <div className="space-y-4">
              <h5 className="font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security Automation
              </h5>

              <div className="grid gap-4">
                <div className="p-4 bg-white border rounded-lg">
                  <h6 className="font-medium mb-3">Auto-Response Rules</h6>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Auto IP Ban</div>
                        <div className="text-xs text-gray-600">Block IP after threshold breached</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Account Lockout</div>
                        <div className="text-xs text-gray-600">Lock account after multiple failures</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Rate Limiting</div>
                        <div className="text-xs text-gray-600">Slow down repeated attempts</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Admin Alerts</div>
                        <div className="text-xs text-gray-600">Notify on attack patterns</div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border rounded-lg">
                  <h6 className="font-medium mb-3">Current Thresholds</h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>IP Ban Threshold</span>
                      <Badge variant="destructive">10 attempts</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Account Lock Threshold</span>
                      <Badge variant="secondary">5 attempts</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Ban Duration</span>
                      <Badge variant="outline">1 hour</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Lock Duration</span>
                      <Badge variant="outline">30 minutes</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border rounded-lg">
                  <h6 className="font-medium mb-3">Row Level Security</h6>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">RLS Enabled</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded font-mono">
                      CREATE POLICY "Admins can view all failures" ON login_failures<br/>
                      FOR SELECT USING (has_role(auth.uid(), 'admin'));
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="mt-4 space-y-4 overflow-y-auto max-h-[70vh]">
            <div className="space-y-4">
              <h5 className="font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Management Actions
              </h5>

              <div className="grid gap-4">
                <div className="p-4 bg-white border rounded-lg">
                  <h6 className="font-medium mb-3">Export Data</h6>
                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={() => handleExport('csv', 'failures')} variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Export Failures CSV
                    </Button>
                    <Button onClick={() => handleExport('json', 'failures')} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export Failures JSON
                    </Button>
                    <Button onClick={() => handleExport('csv', 'blocklist')} variant="outline" size="sm">
                      <Ban className="w-4 h-4 mr-2" />
                      Export Blocklist
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-white border rounded-lg">
                  <h6 className="font-medium mb-3">SQL Queries</h6>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Create table SQL</span>
                      <Button 
                        onClick={() => handleCopySQL(`CREATE TABLE login_failures (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address inet NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  attempted_email text,
  attempt_count integer NOT NULL DEFAULT 1,
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  blocked_until timestamp with time zone,
  failure_reason text
);

CREATE INDEX idx_login_failures_ip ON login_failures(ip_address);
CREATE INDEX idx_login_failures_timestamp ON login_failures(timestamp);
CREATE INDEX idx_login_failures_ip_timestamp ON login_failures(ip_address, timestamp);`)}
                        variant="outline" 
                        size="sm"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy SQL
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">RLS policies SQL</span>
                      <Button 
                        onClick={() => handleCopySQL(`ALTER TABLE login_failures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view all failures" ON login_failures FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert failures" ON login_failures FOR INSERT WITH CHECK (true);`)}
                        variant="outline" 
                        size="sm"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy SQL
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border rounded-lg">
                  <h6 className="font-medium mb-3">Bulk Actions</h6>
                  <div className="space-y-2">
                    <Button variant="destructive" size="sm" className="w-full justify-start">
                      <Ban className="w-4 h-4 mr-2" />
                      Ban All Flagged IPs
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <EyeOff className="w-4 h-4 mr-2" />
                      Clear Old Records (90+ days)
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Reset All Account Locks
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Archive Resolved Incidents
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Add Table Modal
interface LoginFailuresAddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginFailuresAddTableModal: React.FC<LoginFailuresAddTableModalProps> = ({ isOpen, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = React.useState('security');
  const [enableRLS, setEnableRLS] = React.useState(true);
  const [enableIndexes, setEnableIndexes] = React.useState(true);
  const [enableTriggers, setEnableTriggers] = React.useState(true);

  const templates = {
    basic: {
      name: 'Basic Login Failures',
      fields: ['ip_address', 'attempted_email', 'timestamp'],
      description: 'Simple failure tracking'
    },
    security: {
      name: 'Security-Focused',
      fields: ['ip_address', 'user_id', 'attempted_email', 'attempt_count', 'timestamp', 'blocked_until'],
      description: 'Advanced security monitoring with blocking'
    },
    forensic: {
      name: 'Forensic Analysis',
      fields: ['ip_address', 'user_id', 'attempted_email', 'attempt_count', 'timestamp', 'blocked_until', 'failure_reason', 'user_agent', 'country_code'],
      description: 'Comprehensive tracking for investigation'
    }
  };

  const handleCreateTable = () => {
    const template = templates[selectedTemplate as keyof typeof templates];
    toast.success(`Creating ${template.name} with ${template.fields.length} fields...`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Create login_failures Table
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Choose Template</h4>
            <div className="space-y-2">
              {Object.entries(templates).map(([key, template]) => (
                <div
                  key={key}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(key)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-gray-600">{template.description}</div>
                    </div>
                    <Badge variant="outline">{template.fields.length} fields</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Enable Row Level Security</div>
                <div className="text-sm text-gray-600">Add admin-only access policies</div>
              </div>
              <Switch checked={enableRLS} onCheckedChange={setEnableRLS} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Create Performance Indexes</div>
                <div className="text-sm text-gray-600">Optimize for IP and timestamp queries</div>
              </div>
              <Switch checked={enableIndexes} onCheckedChange={setEnableIndexes} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Auto-Cleanup Triggers</div>
                <div className="text-sm text-gray-600">Automatically remove old records</div>
              </div>
              <Switch checked={enableTriggers} onCheckedChange={setEnableTriggers} />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleCreateTable}>Create Table</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Add Field Modal
interface LoginFailuresAddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  missingField: string;
}

export const LoginFailuresAddFieldModal: React.FC<LoginFailuresAddFieldModalProps> = ({ 
  isOpen, 
  onClose, 
  missingField 
}) => {
  const [fieldType, setFieldType] = React.useState('text');
  const [nullable, setNullable] = React.useState(true);
  const [defaultValue, setDefaultValue] = React.useState('');

  const fieldSuggestions: Record<string, any> = {
    attempt_count: { type: 'integer', nullable: false, default: '1' },
    blocked_until: { type: 'timestamp', nullable: true, default: '' },
    failure_reason: { type: 'text', nullable: true, default: '' },
    user_agent: { type: 'text', nullable: true, default: '' },
    country_code: { type: 'text', nullable: true, default: '' }
  };

  React.useEffect(() => {
    if (missingField && fieldSuggestions[missingField]) {
      const suggestion = fieldSuggestions[missingField];
      setFieldType(suggestion.type);
      setNullable(suggestion.nullable);
      setDefaultValue(suggestion.default);
    }
  }, [missingField]);

  const handleAddField = () => {
    toast.success(`Adding field ${missingField} (${fieldType}) to login_failures table...`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Field: {missingField}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Data Type</label>
            <select 
              value={fieldType} 
              onChange={(e) => setFieldType(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
            >
              <option value="text">text</option>
              <option value="integer">integer</option>
              <option value="timestamp">timestamp with time zone</option>
              <option value="inet">inet</option>
              <option value="uuid">uuid</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Nullable</label>
            <Switch checked={nullable} onCheckedChange={setNullable} />
          </div>

          {(nullable || defaultValue) && (
            <div>
              <label className="text-sm font-medium">Default Value</label>
              <input 
                type="text"
                value={defaultValue}
                onChange={(e) => setDefaultValue(e.target.value)}
                className="w-full mt-1 p-2 border rounded"
                placeholder="Enter default value (optional)"
              />
            </div>
          )}

          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm">
              <strong>SQL Preview:</strong>
              <div className="font-mono mt-1 text-xs">
                ALTER TABLE login_failures ADD COLUMN {missingField} {fieldType}
                {!nullable ? ' NOT NULL' : ''}
                {defaultValue ? ` DEFAULT ${defaultValue}` : ''};
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleAddField}>Add Field</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};