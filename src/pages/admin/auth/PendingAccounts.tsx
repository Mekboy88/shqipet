import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Clock, Users, Search, AlertTriangle, TrendingUp, 
  Shield, Eye, CheckCircle, XCircle, Flag, 
  FileText, MapPin, Calendar, Mail, Settings,
  Database, Download, Filter, UserCheck, MessageSquare,
  Info, Ban, Zap, BarChart3, Globe, Activity, Crown
} from 'lucide-react';

const PendingAccounts: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview Metrics', icon: BarChart3 },
    { id: 'table', label: 'Pending Table', icon: Users },
    { id: 'categories', label: 'Status Categories', icon: Flag },
    { id: 'drilldown', label: 'Profile Drill-Down', icon: Eye },
    { id: 'resolution', label: 'Resolution Options', icon: Settings },
    { id: 'filters', label: 'Filters & Bulk Actions', icon: Filter },
    { id: 'exports', label: 'Logging & Exports', icon: Download },
    { id: 'visual', label: 'Visual UX', icon: Activity },
    { id: 'modules', label: 'Connected Modules', icon: Database }
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

  const overviewMetrics = [
    { label: 'Total Pending', value: '1,247', icon: Clock, color: 'text-orange-600', change: '+23 today' },
    { label: 'Under Review', value: '89', icon: Search, color: 'text-blue-600', change: '12 assigned' },
    { label: 'Rejected (30d)', value: '156', icon: XCircle, color: 'text-red-600', change: '-8% vs last month' },
    { label: 'Auto-Blocked', value: '34', icon: Ban, color: 'text-red-600', change: '5 high risk' },
    { label: 'Avg Resolution', value: '2.4h', icon: TrendingUp, color: 'text-green-600', change: '15min faster' },
    { label: 'AI Flagged Queue', value: '67', icon: Shield, color: 'text-purple-600', change: '8 critical' }
  ];

  const pendingAccounts = [
    {
      id: 'user_1a2b3c',
      username: 'john.doe2024',
      email: 'john.doe@email.com',
      phone: '+1-555-0123',
      signupDate: '2024-01-15 14:30',
      status: 'Email Pending',
      aiRisk: '12%',
      location: 'US, California',
      pendingDocs: 'Email Confirmation',
      behaviorScore: '85%'
    },
    {
      id: 'user_4d5e6f',
      username: 'suspicious.user',
      email: 'temp123@tempmail.com',
      phone: '+1-555-0456',
      signupDate: '2024-01-15 14:25',
      status: 'ID Upload Required',
      aiRisk: '89%',
      location: 'Unknown VPN',
      pendingDocs: 'Government ID',
      behaviorScore: '23%'
    },
    {
      id: 'user_7g8h9i',
      username: 'jane.smith',
      email: 'jane.smith@company.com',
      phone: '+44-20-1234-5678',
      signupDate: '2024-01-15 13:45',
      status: 'Manual Review',
      aiRisk: '5%',
      location: 'UK, London',
      pendingDocs: 'Admin Approval',
      behaviorScore: '92%'
    }
  ];

  const statusCategories = [
    {
      category: 'Verification-Based',
      color: 'bg-blue-100 text-blue-800',
      items: [
        { status: 'Pending Email Confirmation', count: 423, description: 'Users who have not clicked email verification link' },
        { status: 'Pending Phone Code', count: 156, description: 'SMS verification code not entered' },
        { status: 'Pending ID Upload', count: 89, description: 'Government ID document required' },
        { status: 'Pending Facial Match', count: 23, description: 'Video call or selfie verification needed' }
      ]
    },
    {
      category: 'Risk-Based',
      color: 'bg-red-100 text-red-800',
      items: [
        { status: 'AI-Flagged High Risk', count: 67, description: 'Automated systems detected suspicious patterns' },
        { status: 'Same IP as Banned User', count: 34, description: 'IP address matches previously banned accounts' },
        { status: 'Failed Login Attempts', count: 45, description: 'Too many incorrect password attempts' },
        { status: 'Anomalous Location', count: 28, description: 'Unusual device fingerprint or location' }
      ]
    },
    {
      category: 'Time-Based Delays',
      color: 'bg-yellow-100 text-yellow-800',
      items: [
        { status: 'Inactive after Signup', count: 312, description: 'No activity for 7+ days after registration' },
        { status: 'Pending Payment', count: 78, description: 'Payment verification required for premium features' },
        { status: 'Manual Admin Hold', count: 56, description: 'Manually flagged for administrative review' }
      ]
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Pending Accounts Overview Dashboard"
        description="Delayed resolution of pending accounts can result in legitimate users abandoning the platform while allowing fraudulent accounts to slip through verification processes. Monitor queue health and resolution times carefully."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {overviewMetrics.map((metric, index) => (
          <Card key={index} className="border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
                <Badge variant="secondary" className="text-xs">{metric.change}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Pending Account Trends</span>
          </CardTitle>
          <CardDescription>Account resolution patterns over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Pending accounts trend chart would be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTable = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Smart Pending Table Management"
        description="Inefficient table management can lead to overlooked high-risk accounts or unnecessary delays for legitimate users. Implement proper filtering and prioritization to maintain security while ensuring good user experience."
      />

      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Pending Accounts Queue</span>
          </CardTitle>
          <CardDescription>Review and manage accounts awaiting approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search Accounts
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter by Risk
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Queue
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Details</TableHead>
                <TableHead>Account ID</TableHead>
                <TableHead>Signup Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>AI Risk</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Pending Docs</TableHead>
                <TableHead>Behavior</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingAccounts.map((account) => (
                <TableRow key={account.id} className={
                  parseInt(account.aiRisk) > 50 ? 'border-l-4 border-l-red-500' :
                  parseInt(account.aiRisk) > 20 ? 'border-l-4 border-l-yellow-500' :
                  'border-l-4 border-l-green-500'
                }>
                  <TableCell>
                    <div>
                      <p className="font-medium">{account.username}</p>
                      <p className="text-sm text-gray-500">{account.email}</p>
                      <p className="text-xs text-gray-400">{account.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{account.id}</TableCell>
                  <TableCell>{account.signupDate}</TableCell>
                  <TableCell>
                    <Badge variant={
                      account.status.includes('Pending') ? 'secondary' :
                      account.status.includes('Manual') ? 'default' : 'secondary'
                    }>
                      {account.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      parseInt(account.aiRisk) > 50 ? 'destructive' :
                      parseInt(account.aiRisk) > 20 ? 'secondary' : 'default'
                    }>
                      {account.aiRisk}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{account.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>{account.pendingDocs}</TableCell>
                  <TableCell>
                    <Badge variant={
                      parseInt(account.behaviorScore) > 80 ? 'default' :
                      parseInt(account.behaviorScore) > 50 ? 'secondary' : 'destructive'
                    }>
                      {account.behaviorScore}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <XCircle className="h-3 w-3" />
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

  const renderCategories = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Pending Status Categories"
        description="Miscategorized pending accounts can lead to inappropriate handling procedures, either blocking legitimate users or allowing risky accounts to proceed. Ensure proper categorization logic and regular review of category definitions."
      />

      {statusCategories.map((category, categoryIndex) => (
        <Card key={categoryIndex} className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Flag className="h-5 w-5" />
              <span>{category.category}</span>
              <Badge className={category.color}>
                {category.items.reduce((sum, item) => sum + item.count, 0)} total
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.status}</p>
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">{item.count}</Badge>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderDrilldown = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Profile Drill-Down Analysis"
        description="Insufficient profile analysis can miss sophisticated fraud attempts or unfairly flag legitimate users. Comprehensive drill-down analysis is essential for making accurate approval decisions while maintaining user privacy."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5" />
              <span>Identity Overview</span>
            </CardTitle>
            <CardDescription>Complete user identity information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-600">Full Name</p>
                <p>John Alexander Doe</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Email</p>
                <p>john.doe@email.com</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Phone</p>
                <p>+1-555-0123</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Date of Birth</p>
                <p>March 15, 1992</p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="font-medium text-gray-600 mb-2">Uploaded Documents</p>
              <div className="flex space-x-2">
                <Badge variant="outline">Driver License</Badge>
                <Badge variant="outline">Selfie Photo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Location & Device History</span>
            </CardTitle>
            <CardDescription>Geographic and device analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-600">Primary Location</p>
                <p>San Francisco, CA, United States</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">IP Address</p>
                <p>192.168.1.100 (Residential)</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Device Type</p>
                <p>Desktop - Chrome/Mac OS</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Login Attempts</p>
                <p>3 successful, 0 failed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Engagement & Behavior</span>
            </CardTitle>
            <CardDescription>User activity patterns and engagement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-600">Profile Completion</p>
                <p>85% Complete</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Messages Sent</p>
                <p>0 (Pending approval)</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Groups Joined</p>
                <p>0 (Pending approval)</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Referral Source</p>
                <p>Google Search</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>AI Risk Analysis</span>
            </CardTitle>
            <CardDescription>Automated security assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Overall Risk Score</span>
                <Badge variant="default">12% (Low)</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Document Authenticity</span>
                <Badge variant="default">96% Genuine</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Behavioral Analysis</span>
                <Badge variant="default">Human Pattern</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">IP Reputation</span>
                <Badge variant="default">Clean</Badge>
              </div>
            </div>
            <div className="pt-4 border-t">
              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 border border-emerald-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-4 py-2 hover:scale-105 font-medium"
              >
                Generate Detailed Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Admin Notes & Actions</span>
          </CardTitle>
          <CardDescription>Internal moderation notes and action history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-3 bg-gray-50">
              <p className="text-sm font-medium">Admin1 - 2024-01-15 14:35</p>
              <p className="text-sm text-gray-600">Initial review completed. Documents appear authentic. Awaiting email verification.</p>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Account
              </Button>
              <Button size="sm" variant="outline">
                <XCircle className="h-4 w-4 mr-2" />
                Reject & Block
              </Button>
              <Button size="sm" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Send Reminder
              </Button>
              <Button size="sm" variant="outline">
                <Flag className="h-4 w-4 mr-2" />
                Flag for Review
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderResolution = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Automated & Manual Resolution Options"
        description="Improper resolution settings can create security vulnerabilities or user experience issues. Automated systems must be carefully calibrated, and manual override processes must be clearly documented and audited."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Automated Resolution</span>
            </CardTitle>
            <CardDescription>Configure automatic account processing rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Timed Auto-Clear (7 days)</span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">AI Auto-Approve (Low Risk)</span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Auto-Reject Temp Emails</span>
              <Badge variant="destructive">Enabled</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Auto-Block VPN Users</span>
              <Badge variant="secondary">Disabled</Badge>
            </div>
            <Button size="sm" variant="outline" className="w-full">Configure Rules</Button>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5" />
              <span>Manual Resolution</span>
            </CardTitle>
            <CardDescription>Human oversight and intervention tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Manual Review Queue</span>
              <Badge variant="secondary">67 pending</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Admin Assignment</span>
              <Button size="sm" variant="outline">Manage</Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Escalation Rules</span>
              <Button size="sm" variant="outline">Configure</Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Override Permissions</span>
              <Button size="sm" variant="outline">Set Roles</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Communication & Reminders</span>
          </CardTitle>
          <CardDescription>Automated user communication settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Email Reminders</h4>
              <div className="flex justify-between items-center">
                <span className="text-sm">Day 3: Verification Reminder</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Day 7: Final Notice</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Document Resubmission</span>
                <Badge variant="secondary">Configurable</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">SMS Notifications</h4>
              <div className="flex justify-between items-center">
                <span className="text-sm">Phone Verification</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Account Status Updates</span>
                <Badge variant="secondary">Optional</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Security Alerts</span>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Activity Audit Trail</span>
          </CardTitle>
          <CardDescription>Complete logging of all resolution activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-600">Logged Events</p>
                <p className="text-lg font-bold">12,847</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Auto-Resolutions</p>
                <p className="text-lg font-bold">8,956</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Manual Overrides</p>
                <p className="text-lg font-bold">234</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full">View Complete Audit Log</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFilters = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Admin Filters & Bulk Actions"
        description="Misuse of bulk actions can result in accidentally approving fraudulent accounts or rejecting legitimate users en masse. Implement proper safeguards, confirmation dialogs, and audit trails for all bulk operations."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Advanced Filters</span>
            </CardTitle>
            <CardDescription>Filter pending accounts by various criteria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Country/Region</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="outline">United States (423)</Badge>
                  <Badge variant="outline">United Kingdom (156)</Badge>
                  <Badge variant="outline">Canada (89)</Badge>
                  <Badge variant="outline">Unknown (67)</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Verification Type</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="outline">Email Pending (423)</Badge>
                  <Badge variant="outline">ID Upload (156)</Badge>
                  <Badge variant="outline">Phone Verify (89)</Badge>
                  <Badge variant="outline">Manual Review (67)</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">AI Risk Score</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="outline" className="bg-green-50">0-20% (234)</Badge>
                  <Badge variant="outline" className="bg-yellow-50">21-50% (156)</Badge>
                  <Badge variant="outline" className="bg-orange-50">51-75% (89)</Badge>
                  <Badge variant="outline" className="bg-red-50">76-100% (45)</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Bulk Actions</span>
            </CardTitle>
            <CardDescription>Perform actions on multiple accounts simultaneously</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Selected (Safe Accounts)
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <XCircle className="h-4 w-4 mr-2" />
                Reject Expired Requests
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Flag className="h-4 w-4 mr-2" />
                Flag IP Range for Review
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Ban className="h-4 w-4 mr-2" />
                Block Temp Email Domains
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <UserCheck className="h-4 w-4 mr-2" />
                Assign to Admin Queue
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Send Bulk Reminders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-indigo-200">
        <CardHeader>
          <CardTitle>Smart Bulk Operations</CardTitle>
          <CardDescription>AI-assisted bulk action recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-800">Ready for Auto-Approval</p>
                  <p className="text-sm text-green-600">234 accounts with low risk scores and complete verification</p>
                </div>
                <Button size="sm" variant="outline">Review & Approve</Button>
              </div>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-yellow-800">Requires Manual Review</p>
                  <p className="text-sm text-yellow-600">67 accounts flagged for suspicious activity patterns</p>
                </div>
                <Button size="sm" variant="outline">Assign Reviewers</Button>
              </div>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-800">High Risk - Consider Blocking</p>
                  <p className="text-sm text-red-600">23 accounts with multiple fraud indicators</p>
                </div>
                <Button size="sm" variant="outline">Review Details</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderExports = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Logging, Exports & Integrations"
        description="Inadequate logging and export capabilities can hinder compliance audits, security investigations, and operational analysis. Ensure comprehensive data capture while maintaining user privacy and regulatory compliance."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-teal-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Data Export Options</span>
            </CardTitle>
            <CardDescription>Export pending accounts data for analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Export Queue as CSV
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Database className="h-4 w-4 mr-2" />
                Export Risk Analysis JSON
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Security Team Report
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Compliance Audit Log
              </Button>
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500">
                All exports are encrypted and logged for audit purposes. Personal data is anonymized where required by regulations.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-teal-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Real-time Integrations</span>
            </CardTitle>
            <CardDescription>Connect with external security and compliance tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Webhook Notifications</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">SIEM Integration</span>
                <Badge variant="secondary">Configurable</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Slack Alerts</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Email Notifications</span>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full">Configure Integrations</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Supabase Integration Status</span>
          </CardTitle>
          <CardDescription>Real-time database synchronization and health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Auth Users</p>
              <p className="text-lg font-bold text-green-600">✓ Synced</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Profiles</p>
              <p className="text-lg font-bold text-green-600">✓ Synced</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Verification Logs</p>
              <p className="text-lg font-bold text-green-600">✓ Synced</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Security Events</p>
              <p className="text-lg font-bold text-green-600">✓ Synced</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-teal-200">
        <CardHeader>
          <CardTitle>Audit Trail Configuration</CardTitle>
          <CardDescription>Configure comprehensive logging and retention policies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Log Retention Period</label>
                <div className="mt-1">
                  <Badge variant="outline">365 days</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Log Detail Level</label>
                <div className="mt-1">
                  <Badge variant="outline">Comprehensive</Badge>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                className="bg-gradient-to-r from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 text-cyan-700 border border-cyan-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
              >
                Configure Settings
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700 border border-indigo-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
              >
                View Full Audit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderVisual = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Visual UX Enhancements"
        description="Poor visual design can lead to missed critical information, delayed responses to high-risk accounts, and administrative errors. Clear visual indicators and intuitive interfaces are essential for effective account management."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Risk Heat Indicators</span>
            </CardTitle>
            <CardDescription>Visual risk assessment display</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 border-l-4 border-l-green-500 bg-green-50 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Low Risk (0-20%)</span>
                  <Badge className="bg-green-100 text-green-800">234 accounts</Badge>
                </div>
                <p className="text-xs text-green-600">Automatic approval candidate</p>
              </div>
              <div className="p-3 border-l-4 border-l-yellow-500 bg-yellow-50 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Medium Risk (21-50%)</span>
                  <Badge className="bg-yellow-100 text-yellow-800">156 accounts</Badge>
                </div>
                <p className="text-xs text-yellow-600">Standard review required</p>
              </div>
              <div className="p-3 border-l-4 border-l-orange-500 bg-orange-50 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">High Risk (51-75%)</span>
                  <Badge className="bg-orange-100 text-orange-800">89 accounts</Badge>
                </div>
                <p className="text-xs text-orange-600">Enhanced verification needed</p>
              </div>
              <div className="p-3 border-l-4 border-l-red-500 bg-red-50 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Critical Risk (76-100%)</span>
                  <Badge className="bg-red-100 text-red-800">23 accounts</Badge>
                </div>
                <p className="text-xs text-red-600">Immediate admin review required</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Inline Analytics</span>
            </CardTitle>
            <CardDescription>Embedded charts and trends</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">Country Distribution</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>United States</span>
                    <span>42.3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div className="bg-blue-600 h-1 rounded-full" style={{ width: '42.3%' }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>United Kingdom</span>
                    <span>23.1%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div className="bg-green-600 h-1 rounded-full" style={{ width: '23.1%' }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Canada</span>
                    <span>15.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div className="bg-purple-600 h-1 rounded-full" style={{ width: '15.2%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Status Indicators & Loading States</span>
          </CardTitle>
          <CardDescription>Real-time processing and status display</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Processing States</h4>
              <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                <span className="text-sm">Document Processing...</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded">
                <Clock className="h-3 w-3 text-yellow-600" />
                <span className="text-sm">Review Pending</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span className="text-sm">Verification Complete</span>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Lock Indicators</h4>
              <div className="flex items-center space-x-2 p-2 bg-red-50 rounded">
                <Shield className="h-3 w-3 text-red-600" />
                <span className="text-sm">Compliance Lock</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded">
                <Flag className="h-3 w-3 text-orange-600" />
                <span className="text-sm">Admin Review Required</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <Ban className="h-3 w-3 text-gray-600" />
                <span className="text-sm">Temporarily Suspended</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderModules = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Connected Platform Modules"
        description="Disconnected or poorly integrated modules can lead to inconsistent user experiences, security gaps, and operational inefficiencies. Ensure proper module integration and data synchronization across all platform components."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Authentication System</span>
            </CardTitle>
            <CardDescription>Integration with core authentication modules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Email Verification</span>
                <Badge variant="default">Connected</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Phone Verification</span>
                <Badge variant="default">Connected</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">2FA Integration</span>
                <Badge variant="secondary">Available</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">OAuth Providers</span>
                <Badge variant="default">Connected</Badge>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full">Manage Integration</Button>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>System Logs & Monitoring</span>
            </CardTitle>
            <CardDescription>Connection to platform logging systems</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Security Event Logs</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Audit Trail</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Performance Monitoring</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Error Tracking</span>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full">View System Logs</Button>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="h-5 w-5" />
              <span>Pro User Tools</span>
            </CardTitle>
            <CardDescription>Integration with premium user management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Pro Tier Verification</span>
                <Badge variant="default">Available</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Premium Features</span>
                <Badge variant="secondary">Gated</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Business Accounts</span>
                <Badge variant="default">Supported</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Creator Verification</span>
                <Badge variant="default">Available</Badge>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full">Configure Pro Settings</Button>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Notification System</span>
            </CardTitle>
            <CardDescription>Automated communication and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Email Notifications</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">SMS Alerts</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Push Notifications</span>
                <Badge variant="secondary">Available</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Admin Alerts</span>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full">Notification Settings</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Ban className="h-5 w-5" />
            <span>Ban & Restriction System</span>
          </CardTitle>
          <CardDescription>Integration with platform-wide moderation tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Auto-Ban Rules</p>
              <p className="text-lg font-bold">12 active</p>
              <p className="text-xs text-gray-500">3x rejection = ban</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">IP Restrictions</p>
              <p className="text-lg font-bold">245 blocked</p>
              <p className="text-xs text-gray-500">VPN and proxy IPs</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Domain Blocks</p>
              <p className="text-lg font-bold">89 domains</p>
              <p className="text-xs text-gray-500">Temporary email services</p>
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <Button 
              size="sm" 
              variant="outline"
              className="bg-gradient-to-r from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200 text-rose-700 border border-rose-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
            >
              Manage Ban Rules
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 border border-amber-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
            >
              View Blocked IPs
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
            >
              Domain Blacklist
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'table': return renderTable();
      case 'categories': return renderCategories();
      case 'drilldown': return renderDrilldown();
      case 'resolution': return renderResolution();
      case 'filters': return renderFilters();
      case 'exports': return renderExports();
      case 'visual': return renderVisual();
      case 'modules': return renderModules();
      default: return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-6 w-6 text-orange-600" />
          <h1 className="text-2xl font-bold text-gray-900">Pending Accounts Management</h1>
        </div>
        <p className="text-gray-600">
          Monitor and manage accounts awaiting approval, verification, or administrative review to maintain platform security and user experience.
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

export default PendingAccounts;