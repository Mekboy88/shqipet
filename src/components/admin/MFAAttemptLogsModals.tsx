import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Smartphone, 
  Mail, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Download, 
  TrendingUp,
  Users,
  Clock,
  BarChart3,
  Filter,
  Search,
  Calendar,
  Activity,
  Zap,
  Eye,
  Settings
} from 'lucide-react';

interface MFAAttemptLogsInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MFAAttemptLogsInspectorModal: React.FC<MFAAttemptLogsInspectorModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [dateRange, setDateRange] = useState('24h');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for demonstration
  const mfaAttempts = [
    { id: 1, user: 'john_doe', method: 'TOTP', status: 'success', timestamp: '2024-01-20 14:30:00', ip: '192.168.1.1' },
    { id: 2, user: 'jane_smith', method: 'SMS', status: 'failure', timestamp: '2024-01-20 14:25:00', ip: '10.0.0.1' },
    { id: 3, user: 'john_doe', method: 'TOTP', status: 'failure', timestamp: '2024-01-20 14:24:00', ip: '192.168.1.1' },
    { id: 4, user: 'alice_wonder', method: 'Email', status: 'success', timestamp: '2024-01-20 14:20:00', ip: '172.16.0.1' },
    { id: 5, user: 'bob_builder', method: 'Push', status: 'success', timestamp: '2024-01-20 14:15:00', ip: '192.168.2.1' },
  ];

  const bruteForceAlerts = [
    { user: 'jane_smith', attempts: 5, method: 'SMS', timespan: '3 minutes', severity: 'High' },
    { user: 'test_user', attempts: 3, method: 'TOTP', timespan: '1 minute', severity: 'Medium' },
  ];

  const mfaStats = {
    total_attempts: 1247,
    successful: 1156,
    failed: 91,
    success_rate: 92.7,
    methods: {
      TOTP: { attempts: 623, success_rate: 95.2 },
      SMS: { attempts: 387, success_rate: 88.9 },
      Email: { attempts: 167, success_rate: 94.1 },
      Push: { attempts: 70, success_rate: 97.1 }
    }
  };

  const topUsers = [
    { user: 'john_doe', attempts: 45, success_rate: 97.8, last_method: 'TOTP' },
    { user: 'jane_smith', attempts: 38, success_rate: 84.2, last_method: 'SMS' },
    { user: 'alice_wonder', attempts: 32, success_rate: 100, last_method: 'Push' },
    { user: 'bob_builder', attempts: 28, success_rate: 92.9, last_method: 'TOTP' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            MFA Attempt Logs Inspector
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schema">Schema & Fields</TabsTrigger>
            <TabsTrigger value="anomaly">Anomaly Detection</TabsTrigger>
            <TabsTrigger value="security">Security Triggers</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* MFA Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    MFA Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Attempts</span>
                      <span className="font-bold">{mfaStats.total_attempts.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Successful</span>
                      <span className="font-bold text-green-600">{mfaStats.successful.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Failed</span>
                      <span className="font-bold text-red-600">{mfaStats.failed.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm font-medium">Success Rate</span>
                      <Badge variant="outline" className="text-green-700 border-green-300">
                        {mfaStats.success_rate}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Method Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Method Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(mfaStats.methods).map(([method, stats]) => (
                      <div key={method} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {method === 'TOTP' && <Smartphone className="h-4 w-4 text-blue-600" />}
                            {method === 'SMS' && <Smartphone className="h-4 w-4 text-green-600" />}
                            {method === 'Email' && <Mail className="h-4 w-4 text-purple-600" />}
                            {method === 'Push' && <Zap className="h-4 w-4 text-orange-600" />}
                            <span className="text-sm font-medium">{method}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{stats.attempts}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-emerald-600 h-2 rounded-full" 
                            style={{ width: `${stats.success_rate}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground">{stats.success_rate}% success rate</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Timeline Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Activity Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-slate-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-emerald-600 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">MFA Activity Timeline</p>
                      <p className="text-xs text-muted-foreground">Attempts over time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Users */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Top MFA Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topUsers.map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-emerald-700">{index + 1}</span>
                          </div>
                          <div>
                            <div className="font-medium text-sm">{user.user}</div>
                            <div className="text-xs text-muted-foreground">Last: {user.last_method}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-sm font-medium">{user.attempts}</div>
                            <div className="text-xs text-muted-foreground">attempts</div>
                          </div>
                          <Badge variant={user.success_rate > 95 ? 'default' : user.success_rate > 90 ? 'secondary' : 'destructive'}>
                            {user.success_rate}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Attempts */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Attempts
                  </CardTitle>
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="failure">Failure</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Methods</SelectItem>
                        <SelectItem value="TOTP">TOTP</SelectItem>
                        <SelectItem value="SMS">SMS</SelectItem>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="Push">Push</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mfaAttempts.slice(0, 5).map((attempt) => (
                      <div key={attempt.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          {attempt.status === 'success' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <div>
                            <div className="font-medium text-sm">{attempt.user}</div>
                            <div className="text-xs text-muted-foreground">{attempt.method}</div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {attempt.timestamp.split(' ')[1]}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Schema Tab */}
          <TabsContent value="schema" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Table Schema: mfa_attempt_logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 font-medium text-sm border-b pb-2">
                    <div>Field Name</div>
                    <div>Data Type</div>
                    <div>Constraints</div>
                    <div>Purpose</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm py-2 border-b">
                    <div className="font-mono">user_id</div>
                    <div>UUID</div>
                    <div><Badge variant="outline">NOT NULL</Badge> <Badge variant="outline">INDEXED</Badge></div>
                    <div>User who tried MFA</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm py-2 border-b">
                    <div className="font-mono">method</div>
                    <div>TEXT</div>
                    <div><Badge variant="outline">NOT NULL</Badge> <Badge variant="outline">ENUM</Badge></div>
                    <div>MFA method (TOTP, SMS, Email, Push)</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm py-2 border-b">
                    <div className="font-mono">status</div>
                    <div>TEXT</div>
                    <div><Badge variant="outline">NOT NULL</Badge> <Badge variant="outline">ENUM</Badge></div>
                    <div>Result: success or failure</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm py-2 border-b">
                    <div className="font-mono">timestamp</div>
                    <div>TIMESTAMPTZ</div>
                    <div><Badge variant="outline">NOT NULL</Badge> <Badge variant="outline">INDEXED</Badge></div>
                    <div>When the attempt occurred</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm py-2 border-b">
                    <div className="font-mono">ip_address</div>
                    <div>INET</div>
                    <div><Badge variant="secondary">NULLABLE</Badge></div>
                    <div>Source IP of attempt</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm py-2">
                    <div className="font-mono">device_fingerprint</div>
                    <div>TEXT</div>
                    <div><Badge variant="secondary">NULLABLE</Badge></div>
                    <div>Device identification</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Anomaly Detection Tab */}
          <TabsContent value="anomaly" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    Brute Force Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bruteForceAlerts.map((alert, index) => (
                      <div key={index} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-amber-700 border-amber-300">
                            MFA Brute Force
                          </Badge>
                          <Badge variant={alert.severity === 'High' ? 'destructive' : 'secondary'}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <div className="text-sm font-medium">{alert.user}</div>
                        <div className="text-xs text-muted-foreground">
                          {alert.attempts} failed {alert.method} attempts in {alert.timespan}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detection Rules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Failed Attempt Threshold</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Max attempts in time window</span>
                      <Input type="number" defaultValue="5" className="w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Time window (minutes)</span>
                      <Input type="number" defaultValue="5" className="w-20" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Method-Specific Rules</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">SMS failures before alert</span>
                        <Input type="number" defaultValue="3" className="w-20" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">TOTP failures before alert</span>
                        <Input type="number" defaultValue="5" className="w-20" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Success Rate Monitoring</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Min success rate (%)</span>
                      <Input type="number" defaultValue="85" className="w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Triggers Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  Automated Security Responses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Account Protection</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="lock-after-failures">Lock account after failures</Label>
                        <Switch id="lock-after-failures" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="require-cooldown">Require cooldown period</Label>
                        <Switch id="require-cooldown" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="escalate-to-admin">Escalate to admin on repeated failures</Label>
                        <Switch id="escalate-to-admin" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">MFA Enforcement</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="recommend-mfa">Recommend MFA for unprotected accounts</Label>
                        <Switch id="recommend-mfa" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="enforce-mfa-admins">Enforce MFA for admin accounts</Label>
                        <Switch id="enforce-mfa-admins" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="backup-codes">Generate backup codes automatically</Label>
                        <Switch id="backup-codes" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Alert Thresholds</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Failed Attempts Threshold</Label>
                      <Input type="number" defaultValue="5" />
                    </div>
                    <div>
                      <Label>Time Window (minutes)</Label>
                      <Input type="number" defaultValue="5" />
                    </div>
                    <div>
                      <Label>Account Lock Duration (hours)</Label>
                      <Input type="number" defaultValue="1" />
                    </div>
                    <div>
                      <Label>Minimum Success Rate (%)</Label>
                      <Input type="number" defaultValue="85" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export & Audit Tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Export Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select export type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All MFA Attempts</SelectItem>
                        <SelectItem value="failures">Failed Attempts Only</SelectItem>
                        <SelectItem value="method">Filter by Method</SelectItem>
                        <SelectItem value="user">Filter by User</SelectItem>
                        <SelectItem value="audit">Audit Log with Signatures</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="date" placeholder="Start date" />
                      <Input type="date" placeholder="End date" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Include Audit Signature</Label>
                    <Switch defaultChecked />
                    <p className="text-xs text-muted-foreground">
                      Adds cryptographic signature for compliance audits
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export JSON
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    MFA Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Reset User MFA</Label>
                    <div className="flex gap-2">
                      <Input placeholder="Enter user ID" className="flex-1" />
                      <Button variant="outline">Reset</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Generate Backup Codes</Label>
                    <div className="flex gap-2">
                      <Input placeholder="Enter user ID" className="flex-1" />
                      <Button variant="outline">Generate</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Force MFA Setup</Label>
                    <div className="flex gap-2">
                      <Input placeholder="Enter user ID" className="flex-1" />
                      <Button variant="outline">Enforce</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>View User MFA Status</Label>
                    <div className="flex gap-2">
                      <Input placeholder="Enter user ID" className="flex-1" />
                      <Button variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

interface MFAAttemptLogsAddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MFAAttemptLogsAddTableModal: React.FC<MFAAttemptLogsAddTableModalProps> = ({
  isOpen,
  onClose
}) => {
  const [sqlCommand, setSqlCommand] = useState(`-- Create MFA method enum
CREATE TYPE mfa_method AS ENUM ('TOTP', 'SMS', 'Email', 'Push', 'Backup_Code');

-- Create MFA status enum
CREATE TYPE mfa_status AS ENUM ('success', 'failure', 'expired', 'invalid');

-- Create MFA attempt logs table
CREATE TABLE mfa_attempt_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  method mfa_method NOT NULL,
  status mfa_status NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address INET,
  device_fingerprint TEXT,
  user_agent TEXT,
  error_code TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_mfa_attempt_logs_user_id ON mfa_attempt_logs(user_id);
CREATE INDEX idx_mfa_attempt_logs_timestamp ON mfa_attempt_logs(timestamp);
CREATE INDEX idx_mfa_attempt_logs_status ON mfa_attempt_logs(status);
CREATE INDEX idx_mfa_attempt_logs_method ON mfa_attempt_logs(method);
CREATE INDEX idx_mfa_attempt_logs_ip ON mfa_attempt_logs(ip_address);

-- Create composite index for brute force detection
CREATE INDEX idx_mfa_attempt_logs_user_time ON mfa_attempt_logs(user_id, timestamp);

-- Enable Row Level Security
ALTER TABLE mfa_attempt_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own MFA attempts" 
ON mfa_attempt_logs FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all MFA attempts" 
ON mfa_attempt_logs FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "System can insert MFA attempts" 
ON mfa_attempt_logs FOR INSERT 
WITH CHECK (true);

-- Create trigger for brute force detection
CREATE OR REPLACE FUNCTION detect_mfa_brute_force()
RETURNS TRIGGER AS $$
DECLARE
  failed_count INTEGER;
  time_window INTERVAL := '5 minutes';
  max_failures INTEGER := 5;
BEGIN
  -- Only check for failed attempts
  IF NEW.status = 'failure' THEN
    -- Count failed attempts in the time window
    SELECT COUNT(*)
    INTO failed_count
    FROM mfa_attempt_logs
    WHERE user_id = NEW.user_id
      AND status = 'failure'
      AND timestamp > NOW() - time_window;
    
    -- If threshold exceeded, create alert
    IF failed_count >= max_failures THEN
      INSERT INTO security_events (
        user_id,
        event_type,
        event_description,
        metadata,
        risk_level
      ) VALUES (
        NEW.user_id,
        'mfa_brute_force_detected',
        'Multiple failed MFA attempts detected',
        jsonb_build_object(
          'failed_attempts', failed_count,
          'method', NEW.method,
          'time_window_minutes', EXTRACT(EPOCH FROM time_window) / 60,
          'ip_address', NEW.ip_address
        ),
        'high'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mfa_brute_force_trigger
  AFTER INSERT ON mfa_attempt_logs
  FOR EACH ROW
  EXECUTE FUNCTION detect_mfa_brute_force();`);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            Create MFA Attempt Logs Table
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="sql-command">SQL Command</Label>
            <Textarea
              id="sql-command"
              value={sqlCommand}
              onChange={(e) => setSqlCommand(e.target.value)}
              className="h-96 font-mono text-sm"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                console.log('Creating mfa_attempt_logs table:', sqlCommand);
                onClose();
              }}
            >
              Create Table
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};