import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Shield, Users, Clock, AlertTriangle, TrendingUp, 
  Globe, Eye, CheckCircle, XCircle, Flag, 
  FileText, MapPin, Calendar, Mail, Settings,
  Database, Download, Filter, UserCheck, MessageSquare,
  Info, Ban, Zap, BarChart3, Activity, Key,
  Smartphone, Monitor, Fingerprint, Lock, Unlock,
  WifiOff, RotateCcw, AlertCircle, Search, Bell
} from 'lucide-react';

const TwoFASessionLogs: React.FC = () => {
  const [activeSection, setActiveSection] = useState('2fa-system');

  const sections = [
    { id: '2fa-system', label: '2FA System Panel', icon: Shield },
    { id: 'session-logs', label: 'Session Logs', icon: Activity },
    { id: 'risk-analysis', label: 'Risk Analysis', icon: AlertTriangle },
    { id: 'admin-tools', label: 'Admin Tools', icon: Settings },
    { id: 'optional-features', label: 'Advanced Features', icon: Zap },
    { id: 'visual-enhancements', label: 'Visual UX', icon: Eye },
    { id: 'backend-integration', label: 'Backend Integration', icon: Database }
  ];

  const InfoCircle = ({ title, description }: { title: string; description: string }) => (
    <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
      <div>
        <h4 className="font-medium text-blue-900 mb-1">{title}</h4>
        <p className="text-sm text-blue-700">
          <span className="font-semibold">CONSEQUENCES:</span> {description}
        </p>
      </div>
    </div>
  );

  const mfaCoverage = [
    { method: 'TOTP App', users: 1247, percentage: 62, color: 'bg-green-500' },
    { method: 'SMS', users: 456, percentage: 23, color: 'bg-blue-500' },
    { method: 'Email', users: 189, percentage: 9, color: 'bg-yellow-500' },
    { method: 'Hardware Key', users: 78, percentage: 4, color: 'bg-purple-500' },
    { method: 'Backup Codes', users: 34, percentage: 2, color: 'bg-gray-500' }
  ];

  const mfaUsers = [
    {
      user: 'john@example.com',
      method: 'TOTP App',
      status: 'Verified',
      lastVerified: '2025-07-24 13:22',
      riskFlag: 'Low',
      avatar: 'JD'
    },
    {
      user: 'maria@example.com',
      method: 'SMS',
      status: 'Not Set',
      lastVerified: '—',
      riskFlag: 'Medium',
      avatar: 'MS'
    },
    {
      user: 'admin@platform.com',
      method: 'U2F Key',
      status: 'Verified',
      lastVerified: '2025-07-22 09:02',
      riskFlag: 'Trusted',
      avatar: 'AD'
    }
  ];

  const sessionLogs = [
    {
      id: '1',
      user: 'john@example.com',
      avatar: 'JD',
      timestamp: '2025-07-26 14:30:22',
      ip: '192.168.1.100',
      location: 'San Francisco, CA',
      device: 'Chrome/Mac OS',
      mfaUsed: true,
      riskScore: '91%',
      status: 'Active',
      sessionDuration: '2h 15m'
    },
    {
      id: '2',
      user: 'maria@example.com',
      avatar: 'MS',
      timestamp: '2025-07-26 14:25:15',
      ip: '151.228.33.198',
      location: 'London, UK',
      device: 'Firefox/Windows',
      mfaUsed: false,
      riskScore: '67%',
      status: 'Suspicious',
      sessionDuration: '45m'
    },
    {
      id: '3',
      user: 'admin@platform.com',
      avatar: 'AD',
      timestamp: '2025-07-26 14:20:10',
      ip: '203.0.113.42',
      location: 'New York, NY',
      device: 'Safari/iOS',
      mfaUsed: true,
      riskScore: '98%',
      status: 'Active',
      sessionDuration: '1h 30m'
    }
  ];

  const riskCategories = [
    {
      type: 'Multiple Device Login',
      count: 12,
      description: 'More than 5 locations in under 60 mins',
      severity: 'high',
      color: 'bg-red-100 text-red-800'
    },
    {
      type: 'IP Mismatch',
      count: 8,
      description: 'Login from country never used before',
      severity: 'medium',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      type: 'Token Replay Detected',
      count: 3,
      description: 'Duplicate JWT token used from different IPs',
      severity: 'critical',
      color: 'bg-red-100 text-red-800'
    },
    {
      type: 'Suspicious Mouse Flow',
      count: 15,
      description: "Pattern doesn't match typical user behavior",
      severity: 'low',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      type: 'Device Emulation',
      count: 5,
      description: 'Browser spoofing, screen emulation detected',
      severity: 'high',
      color: 'bg-orange-100 text-orange-800'
    }
  ];

  const render2FASystem = () => (
    <div className="space-y-6">
      <InfoCircle
        title="2FA System Management"
        description="Weak 2FA implementation can lead to account takeovers, unauthorized access to sensitive data, and compliance violations. Ensure proper backup methods and monitor for authentication bypass attempts."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>2FA Coverage Summary</span>
            </CardTitle>
            <CardDescription>Distribution of 2FA methods across all users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mfaCoverage.map((method, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{method.method}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{method.users}</span>
                      <Badge variant="outline">{method.percentage}%</Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${method.color}`}
                      style={{ width: `${method.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>2FA Enforcement Settings</span>
            </CardTitle>
            <CardDescription>Platform-wide 2FA configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">2FA Enforcement</span>
              <Badge variant="default">Mandatory for Admins</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Risk-Based MFA</span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Session Expiry</span>
              <Badge variant="outline">7 days</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Backup Codes</span>
              <Badge variant="default">Required</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">MFA Failure Alerts</span>
              <Badge variant="default">Active</Badge>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-4 py-2 hover:scale-105 font-medium"
            >
              Configure Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>2FA Method Status by User</span>
          </CardTitle>
          <CardDescription>Real-time overview of user 2FA configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Verified</TableHead>
                <TableHead>Risk Flag</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mfaUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user.avatar}
                      </div>
                      <span className="text-sm">{user.user}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.method}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'Verified' ? 'default' : 'destructive'}>
                      {user.status === 'Verified' ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{user.lastVerified}</TableCell>
                  <TableCell>
                    <Badge variant={
                      user.riskFlag === 'Trusted' ? 'default' :
                      user.riskFlag === 'Low' ? 'secondary' : 'destructive'
                    }>
                      {user.riskFlag}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Ban className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderSessionLogs = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Session Log Monitoring"
        description="Unmonitored sessions can lead to persistent unauthorized access, account hijacking, and undetected malicious activities. Regular session auditing is critical for maintaining platform security."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">+12% from last hour</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suspicious Sessions</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Requires immediate review</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed Logins (24h)</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
              <XCircle className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">-5% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Session Activity Map</span>
          </CardTitle>
          <CardDescription>Real-time geographical distribution of active sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50"></div>
            <div className="relative z-10 text-center">
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Interactive session map would be displayed here</p>
              <p className="text-xs text-gray-400 mt-1">Shows active sessions by location with risk indicators</p>
            </div>
            {/* Mock location markers */}
            <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Live Session Logs</span>
          </CardTitle>
          <CardDescription>Real-time session monitoring and management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search Sessions
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter by Risk
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>IP & Location</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>2FA Used</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessionLogs.map((session) => (
                <TableRow key={session.id} className={
                  session.status === 'Suspicious' ? 'border-l-4 border-l-red-500 bg-red-50' :
                  session.riskScore && parseInt(session.riskScore) > 90 ? 'border-l-4 border-l-green-500' :
                  'border-l-4 border-l-yellow-500'
                }>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {session.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{session.user}</p>
                        <p className="text-xs text-gray-500">{session.sessionDuration}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{session.timestamp}</p>
                      <p className="text-xs text-gray-500">UTC+0</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-mono">{session.ip}</p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {session.location}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Monitor className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{session.device}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={session.mfaUsed ? 'default' : 'destructive'}>
                      {session.mfaUsed ? <Shield className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                      {session.mfaUsed ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      parseInt(session.riskScore) > 90 ? 'default' :
                      parseInt(session.riskScore) > 70 ? 'secondary' : 'destructive'
                    }>
                      {session.riskScore}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      session.status === 'Active' ? 'default' :
                      session.status === 'Suspicious' ? 'destructive' : 'secondary'
                    }>
                      {session.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Ban className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Flag className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderRiskAnalysis = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Risk Analysis & Monitoring"
        description="Inadequate risk analysis can result in missed attack patterns, false positives blocking legitimate users, and sophisticated attacks going undetected. Continuous refinement of risk models is essential."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Risk Categories Overview</span>
            </CardTitle>
            <CardDescription>Active security threats and anomalies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskCategories.map((category, index) => (
                <div key={index} className={`p-3 rounded-lg ${category.color}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{category.type}</h4>
                    <Badge variant="outline" className="ml-2">{category.count}</Badge>
                  </div>
                  <p className="text-xs opacity-80">{category.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-medium">Severity: {category.severity}</span>
                    <Button size="sm" variant="outline" className="h-6 text-xs">Investigate</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Risk Trends</span>
            </CardTitle>
            <CardDescription>Risk level changes over the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Risk analysis chart would be displayed here</p>
                <p className="text-xs text-gray-400 mt-1">Shows risk score trends and anomaly detection</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Automated Risk Response</span>
          </CardTitle>
          <CardDescription>Configure automatic responses to risk events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Threshold Settings</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">High Risk Threshold</span>
                  <Badge variant="destructive">75%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Auto-Block Threshold</span>
                  <Badge variant="destructive">90%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">MFA Trigger Threshold</span>
                  <Badge variant="secondary">60%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Admin Alert Threshold</span>
                  <Badge variant="default">80%</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Response Actions</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Auto-require 2FA</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Session Termination</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">IP Blocking</span>
                  <Badge variant="secondary">Manual Only</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Email Notifications</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2 mt-6">
            <Button 
              size="sm" 
              variant="outline"
              className="bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 border border-amber-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
            >
              Configure Thresholds
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="bg-gradient-to-r from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 text-cyan-700 border border-cyan-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
            >
              Test Response
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdminTools = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Admin Tools & Controls"
        description="Misuse of administrative tools can lead to service disruption, legitimate user lockouts, and security policy violations. Ensure proper authorization and audit trails for all administrative actions."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Session Filtering & Search</span>
            </CardTitle>
            <CardDescription>Advanced filtering options for session analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Search className="h-4 w-4 mr-2" />
                Search by User Email
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MapPin className="h-4 w-4 mr-2" />
                Filter by Location
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Monitor className="h-4 w-4 mr-2" />
                Filter by Device Type
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Filter by Risk Level
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Filter by Date Range
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Export & Reporting</span>
            </CardTitle>
            <CardDescription>Data export and compliance reporting tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Session Logs (CSV)
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Generate Security Report
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                2FA Compliance Report
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Activity className="h-4 w-4 mr-2" />
                Session Analytics JSON
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <AlertCircle className="h-4 w-4 mr-2" />
                Security Incident Log
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Ban className="h-5 w-5" />
            <span>Security Actions</span>
          </CardTitle>
          <CardDescription>Emergency response and blocking tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-red-700">Critical Actions</h4>
              <Button variant="destructive" size="sm" className="w-full">
                <Ban className="h-4 w-4 mr-2" />
                Block IP Address
              </Button>
              <Button variant="destructive" size="sm" className="w-full">
                <XCircle className="h-4 w-4 mr-2" />
                Terminate All Sessions
              </Button>
              <Button variant="destructive" size="sm" className="w-full">
                <Lock className="h-4 w-4 mr-2" />
                Emergency Lockdown
              </Button>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-yellow-700">Moderate Actions</h4>
              <Button variant="outline" size="sm" className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Force 2FA Next Login
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset User Sessions
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Flag className="h-4 w-4 mr-2" />
                Flag for Review
              </Button>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-blue-700">Monitoring</h4>
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Enable Enhanced Monitoring
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Bell className="h-4 w-4 mr-2" />
                Set Custom Alerts
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Rate Limit Configuration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Audit Trail</span>
          </CardTitle>
          <CardDescription>Administrative action logs and compliance tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">1,247</p>
                <p className="text-sm text-gray-600">Admin Actions (24h)</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">98.7%</p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">23</p>
                <p className="text-sm text-gray-600">Security Events</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full">View Complete Audit Log</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOptionalFeatures = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Advanced Security Features"
        description="Advanced features require careful implementation and testing. Improper configuration can create security vulnerabilities or user experience issues. Enable features progressively and monitor impact."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <span>Hardware Key Support</span>
            </CardTitle>
            <CardDescription>FIDO2/U2F hardware authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">U2F Support</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">FIDO2 WebAuthn</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Biometric Authentication</span>
                <Badge variant="secondary">Beta</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">YubiKey Integration</span>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full">Configure Hardware Keys</Button>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>AI Login Prediction</span>
            </CardTitle>
            <CardDescription>Machine learning-based anomaly detection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Behavioral Analysis</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Location Prediction</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Time Pattern Analysis</span>
                <Badge variant="secondary">Learning</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Device Fingerprinting</span>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full">View AI Models</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Login Confirmation Notifications</span>
          </CardTitle>
          <CardDescription>Multi-channel login verification alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Email Notifications</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">New Device Login</span>
                  <Badge variant="default">On</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Suspicious Activity</span>
                  <Badge variant="default">On</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Password Changes</span>
                  <Badge variant="default">On</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">SMS Alerts</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">High Risk Login</span>
                  <Badge variant="default">On</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Admin Access</span>
                  <Badge variant="default">On</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Account Lockout</span>
                  <Badge variant="default">On</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Push Notifications</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Real-time Alerts</span>
                  <Badge variant="secondary">Beta</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mobile App</span>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Phone</span>
                  <Badge variant="secondary">Planned</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Session Management Rules</span>
          </CardTitle>
          <CardDescription>Advanced session control and limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Session Limits</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Max Concurrent Sessions</span>
                  <Badge variant="outline">3</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Idle Timeout</span>
                  <Badge variant="outline">3 hours</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Absolute Timeout</span>
                  <Badge variant="outline">24 hours</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Remember Me Duration</span>
                  <Badge variant="outline">30 days</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Token Management</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Refresh Token Rotation</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Token Binding</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Replay Detection</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Abuse Monitoring</span>
                  <Badge variant="default">Active</Badge>
                </div>
              </div>
            </div>
          </div>
          <Button size="sm" variant="outline" className="w-full mt-4">Configure Session Rules</Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderVisualEnhancements = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Visual UX Enhancements"
        description="Poor visual design can lead to missed security alerts, delayed incident response, and administrative errors. Clear visual indicators and intuitive interfaces are crucial for effective security management."
      />

      <Card className="border-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Session Activity Timeline</span>
          </CardTitle>
          <CardDescription>Visual representation of user session patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 relative overflow-hidden">
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-end space-x-1">
                  <div className="w-2 h-8 bg-blue-500 rounded-sm"></div>
                  <div className="w-2 h-12 bg-green-500 rounded-sm"></div>
                  <div className="w-2 h-6 bg-yellow-500 rounded-sm"></div>
                  <div className="w-2 h-16 bg-red-500 rounded-sm"></div>
                  <div className="w-2 h-10 bg-purple-500 rounded-sm"></div>
                  <div className="w-2 h-14 bg-blue-500 rounded-sm"></div>
                  <div className="w-2 h-4 bg-green-500 rounded-sm"></div>
                </div>
              </div>
              <div className="absolute top-2 left-2">
                <p className="text-xs text-gray-600">Login → Browse → Admin → Logout</p>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Flag className="h-5 w-5" />
              <span>Risk Score Color Coding</span>
            </CardTitle>
            <CardDescription>Visual risk indicators for quick assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 border-l-4 border-l-green-500 bg-green-50 rounded">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm">Low Risk (0-30%)</span>
                <Badge className="bg-green-100 text-green-800">Safe</Badge>
              </div>
              <div className="flex items-center space-x-3 p-2 border-l-4 border-l-yellow-500 bg-yellow-50 rounded">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Medium Risk (31-70%)</span>
                <Badge className="bg-yellow-100 text-yellow-800">Monitor</Badge>
              </div>
              <div className="flex items-center space-x-3 p-2 border-l-4 border-l-orange-500 bg-orange-50 rounded">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="text-sm">High Risk (71-90%)</span>
                <Badge className="bg-orange-100 text-orange-800">Review</Badge>
              </div>
              <div className="flex items-center space-x-3 p-2 border-l-4 border-l-red-500 bg-red-50 rounded">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm">Critical Risk (91-100%)</span>
                <Badge className="bg-red-100 text-red-800">Block</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Hover Card Previews</span>
            </CardTitle>
            <CardDescription>Quick access to detailed session information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-3 bg-gray-50 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium">Session #12345</span>
                <Badge variant="outline">Active</Badge>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <p>📍 San Francisco, CA</p>
                <p>💻 Chrome on MacOS</p>
                <p>🔐 2FA: Enabled</p>
                <p>⚡ Risk: 12%</p>
              </div>
              <div className="flex space-x-1 mt-2">
                <Button size="sm" variant="outline" className="h-6 text-xs">View</Button>
                <Button size="sm" variant="outline" className="h-6 text-xs">Block</Button>
              </div>
            </div>
            <p className="text-xs text-gray-500">Hover over any session row to see quick actions</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Real-time Admin Alerts</span>
          </CardTitle>
          <CardDescription>Live security event notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">High Risk Login Detected</p>
                <p className="text-xs text-red-600">User: suspicious@email.com from Russia at 3:47 AM</p>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-gradient-to-r from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200 text-rose-700 border border-rose-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
              >
                Investigate
              </Button>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">Multiple Failed 2FA Attempts</p>
                <p className="text-xs text-yellow-600">User: admin@platform.com - 5 failed attempts in 10 minutes</p>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 border border-amber-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
              >
                Review
              </Button>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">New Device Login</p>
                <p className="text-xs text-blue-600">User: john@example.com verified via 2FA from iPhone</p>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
              >
                Acknowledge
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBackendIntegration = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Backend Integration & Database Schema"
        description="Improper database schema or integration issues can lead to data loss, security vulnerabilities, and system instability. Ensure proper indexing, relationships, and security policies are in place."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Database Tables</span>
            </CardTitle>
            <CardDescription>Core tables for 2FA and session management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800">session_logs</h4>
                <p className="text-xs text-blue-600">user_id, ip, device_info, status, created_at, risk_score, mfa_type</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800">mfa_settings</h4>
                <p className="text-xs text-green-600">user_id, mfa_method, last_verified, backup_code_used, u2f_id, token_expiry</p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-800">auth_logs</h4>
                <p className="text-xs text-purple-600">action_type, admin_id, user_id, timestamp, notes</p>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-medium text-orange-800">login_anomalies</h4>
                <p className="text-xs text-orange-600">session_id, pattern_match_score, location_anomaly, flag_reason</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Supabase Integration Status</span>
            </CardTitle>
            <CardDescription>Real-time connection and sync status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Auth Users Sync</span>
                <Badge variant="default">✓ Connected</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Session Tracking</span>
                <Badge variant="default">✓ Real-time</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">MFA Events</span>
                <Badge variant="default">✓ Logging</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Risk Analysis</span>
                <Badge variant="default">✓ Processing</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Audit Trails</span>
                <Badge variant="default">✓ Stored</Badge>
              </div>
            </div>
            <div className="pt-3 border-t">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-green-600">99.9%</p>
                  <p className="text-xs text-gray-600">Uptime</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-600">45ms</p>
                  <p className="text-xs text-gray-600">Avg Response</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Data Pipeline Configuration</span>
          </CardTitle>
          <CardDescription>Configure data flow and processing rules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Data Collection</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Session Events</span>
                  <Badge variant="default">On</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Login Attempts</span>
                  <Badge variant="default">On</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">2FA Events</span>
                  <Badge variant="default">On</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Risk Calculations</span>
                  <Badge variant="default">On</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Data Processing</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Real-time Analysis</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Batch Processing</span>
                  <Badge variant="secondary">Hourly</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">ML Risk Scoring</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Anomaly Detection</span>
                  <Badge variant="default">Active</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Data Retention</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Session Logs</span>
                  <Badge variant="outline">90 days</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Auth Events</span>
                  <Badge variant="outline">1 year</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Security Alerts</span>
                  <Badge variant="outline">2 years</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Audit Logs</span>
                  <Badge variant="outline">7 years</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>API Endpoints & Security</span>
          </CardTitle>
          <CardDescription>Available endpoints and security configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Available Endpoints</h4>
              <div className="space-y-2 font-mono text-xs">
                <div className="p-2 bg-blue-50 rounded">GET /api/sessions</div>
                <div className="p-2 bg-green-50 rounded">POST /api/sessions/terminate</div>
                <div className="p-2 bg-yellow-50 rounded">GET /api/mfa/status</div>
                <div className="p-2 bg-purple-50 rounded">POST /api/mfa/enforce</div>
                <div className="p-2 bg-red-50 rounded">GET /api/risk/analysis</div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Security Measures</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Rate Limiting</span>
                  <Badge variant="default">100/min</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Authentication</span>
                  <Badge variant="default">JWT + API Key</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Request Logging</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">IP Whitelisting</span>
                  <Badge variant="secondary">Configurable</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case '2fa-system': return render2FASystem();
      case 'session-logs': return renderSessionLogs();
      case 'risk-analysis': return renderRiskAnalysis();
      case 'admin-tools': return renderAdminTools();
      case 'optional-features': return renderOptionalFeatures();
      case 'visual-enhancements': return renderVisualEnhancements();
      case 'backend-integration': return renderBackendIntegration();
      default: return render2FASystem();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">2FA & Session Logs Management</h1>
        </div>
        <p className="text-gray-600">
          Monitor and manage two-factor authentication and session security with enterprise-grade controls and real-time monitoring.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg border">
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
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 font-medium border shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 ${
                activeSection === section.id
                  ? `${activeColorScheme} border-2`
                  : colorScheme
              }`}
            >
              <section.icon className="h-4 w-4" />
              <span>{section.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default TwoFASessionLogs;