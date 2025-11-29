import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Shield, Users, Clock, AlertTriangle, TrendingUp, 
  FileText, Eye, CheckCircle, XCircle, Flag, 
  Building2, Star, Award, Crown, Info, Download,
  Search, Filter, Calendar, Mail, Settings,
  Database, Lock, UserCheck, MessageSquare
} from 'lucide-react';

const VerifiedUsers: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'requests', label: 'Verification Requests', icon: Users },
    { id: 'types', label: 'Verification Types', icon: Award },
    { id: 'tools', label: 'Review Tools', icon: Eye },
    { id: 'metrics', label: 'Trust Metrics', icon: Shield },
    { id: 'badges', label: 'Badge Management', icon: Star },
    { id: 'access', label: 'Access Control', icon: Lock },
    { id: 'audit', label: 'Audit Logs', icon: Database },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'security', label: 'Security & Compliance', icon: Settings }
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

  const verificationStats = [
    { label: 'Verified Users', value: '2,847', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Pending Reviews', value: '156', icon: Clock, color: 'text-yellow-600' },
    { label: 'Flagged Documents', value: '23', icon: AlertTriangle, color: 'text-red-600' },
    { label: 'Weekly Approvals', value: '189', icon: TrendingUp, color: 'text-blue-600' }
  ];

  const verificationTypes = [
    { type: 'Standard', badge: '✅', icon: CheckCircle, requirements: 'ID document + face selfie', color: 'bg-blue-100 text-blue-800' },
    { type: 'Business', badge: '🏢', icon: Building2, requirements: 'Business registration, domain email, address proof', color: 'bg-purple-100 text-purple-800' },
    { type: 'Creator', badge: '⭐', icon: Star, requirements: 'Follower threshold (10K+), content proof, ID', color: 'bg-yellow-100 text-yellow-800' },
    { type: 'Government', badge: '🛡️', icon: Shield, requirements: 'Official credentials', color: 'bg-green-100 text-green-800' },
    { type: 'Brand', badge: '💼', icon: Crown, requirements: 'Trademark certificate, social presence, website match', color: 'bg-indigo-100 text-indigo-800' }
  ];

  const pendingRequests = [
    { id: 1, user: 'john.doe@email.com', submitted: '2024-01-15', docType: 'Passport', aiRisk: '12%', status: 'Pending', reviewer: 'Unassigned' },
    { id: 2, user: 'jane.smith@email.com', submitted: '2024-01-14', docType: 'Driver License', aiRisk: '5%', status: 'Approved', reviewer: 'Admin1' },
    { id: 3, user: 'business@company.com', submitted: '2024-01-13', docType: 'Business Reg', aiRisk: '89%', status: 'Flagged', reviewer: 'Admin2' }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Verification Dashboard Controls"
        description="Improper management of user verification can lead to fraudulent accounts, legal compliance issues, and loss of platform trust. Ensure all verification decisions are properly documented and follow security protocols."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {verificationStats.map((stat, index) => (
          <Card key={index} className="border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Weekly Verification Trends</span>
          </CardTitle>
          <CardDescription>Verification approval rate over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Verification trends chart would be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRequests = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Verification Request Management"
        description="Delayed or incorrect verification decisions can result in legitimate users being denied access while fraudulent accounts gain platform privileges. Implement proper review workflows and maintain audit trails."
      />

      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Pending Verification Requests</span>
          </CardTitle>
          <CardDescription>Review and manage user verification submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>AI Risk Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.user}</TableCell>
                  <TableCell>{request.submitted}</TableCell>
                  <TableCell>{request.docType}</TableCell>
                  <TableCell>
                    <Badge variant={parseInt(request.aiRisk) > 50 ? 'destructive' : 'secondary'}>
                      {request.aiRisk}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      request.status === 'Approved' ? 'default' :
                      request.status === 'Flagged' ? 'destructive' : 'secondary'
                    }>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{request.reviewer}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <XCircle className="h-4 w-4" />
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

  const renderTypes = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Verification Type Configuration"
        description="Misconfigured verification types can create security loopholes or prevent legitimate users from accessing appropriate features. Ensure each type has proper requirements and validation criteria."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {verificationTypes.map((type, index) => (
          <Card key={index} className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <type.icon className="h-5 w-5" />
                <span>{type.type}</span>
                <Badge className={type.color}>{type.badge}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{type.requirements}</p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle>Add New Verification Type</CardTitle>
          <CardDescription>Create custom verification categories for specific user groups</CardDescription>
        </CardHeader>
        <CardContent>
          <Button>
            <Award className="h-4 w-4 mr-2" />
            Create New Type
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderTools = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Auto & Manual Verification Tools"
        description="Relying solely on AI without human oversight can result in false positives/negatives. Manual review bypass can lead to security vulnerabilities. Maintain balanced verification workflows."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>AI Document Scanning</span>
            </CardTitle>
            <CardDescription>Automated document verification and fraud detection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>OCR Text Extraction</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Watermark Detection</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Facial Recognition</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Tampering Detection</span>
              <Badge variant="default">Active</Badge>
            </div>
            <Button size="sm" variant="outline">Configure AI Settings</Button>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Manual Review Panel</span>
            </CardTitle>
            <CardDescription>Human oversight and verification controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Side-by-side Comparison</span>
              <Button size="sm" variant="outline">Open</Button>
            </div>
            <div className="flex justify-between items-center">
              <span>Reviewer Assignment</span>
              <Button size="sm" variant="outline">Manage</Button>
            </div>
            <div className="flex justify-between items-center">
              <span>Approval Templates</span>
              <Button size="sm" variant="outline">Edit</Button>
            </div>
            <div className="flex justify-between items-center">
              <span>Review History</span>
              <Button size="sm" variant="outline">View</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Smart Verification Suggestions</span>
          </CardTitle>
          <CardDescription>AI-powered verification enhancement recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm">Domain ownership verification available</span>
              <Button size="sm">Enable</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm">Social media cross-reference</span>
              <Button size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-sm">Media publication verification</span>
              <Button size="sm">Setup</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMetrics = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Trust Metrics Configuration"
        description="Poorly weighted trust metrics can create unfair verification processes or security gaps. Incorrect scoring can deny legitimate users or approve fraudulent ones. Regular calibration is essential."
      />

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Trust Score Calculation</span>
          </CardTitle>
          <CardDescription>Configure trust metrics and weightings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Document Validity (40%)</span>
              <Badge variant="default">Weighted</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Facial Match Confidence (30%)</span>
              <Badge variant="default">Weighted</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Social Media Match (20%)</span>
              <Badge variant="secondary">Optional</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Engagement Quality (10%)</span>
              <Badge variant="secondary">Optional</Badge>
            </div>
            <Button size="sm" variant="outline">Adjust Weights</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle>Trust Score Analytics</CardTitle>
          <CardDescription>Monitor trust score distribution and effectiveness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Trust score analytics dashboard would be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBadges = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Verified Badge Management"
        description="Mismanaged verification badges can undermine platform credibility and user trust. Expired or revoked badges not properly handled can create confusion and security risks."
      />

      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Badge Configuration</span>
          </CardTitle>
          <CardDescription>Manage verification badge display and expiration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Display Badge on Profile</span>
            <Button size="sm" variant="outline">Configure</Button>
          </div>
          <div className="flex justify-between items-center">
            <span>Badge Design Selector</span>
            <Button size="sm" variant="outline">Customize</Button>
          </div>
          <div className="flex justify-between items-center">
            <span>Badge Expiration (12 months)</span>
            <Button size="sm" variant="outline">Edit</Button>
          </div>
          <div className="flex justify-between items-center">
            <span>Certificate Generator</span>
            <Button size="sm" variant="outline">Generate</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle>Badge Analytics</CardTitle>
          <CardDescription>Track badge distribution and renewal rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">2,847</p>
              <p className="text-sm text-gray-600">Active Badges</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">156</p>
              <p className="text-sm text-gray-600">Expiring Soon</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">89%</p>
              <p className="text-sm text-gray-600">Renewal Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">23</p>
              <p className="text-sm text-gray-600">Revoked</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAccess = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Access Control for Verified Users"
        description="Improper access control can lead to unauthorized users gaining privileged access or verified users being denied appropriate permissions. Ensure role assignments match verification levels."
      />

      <Card className="border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Gated Area Access</span>
          </CardTitle>
          <CardDescription>Configure access to premium features and areas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Pro Forums Access</span>
            <Badge variant="default">Enabled</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Business Groups</span>
            <Badge variant="default">Enabled</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Premium Content</span>
            <Badge variant="secondary">Configurable</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Advanced Features</span>
            <Badge variant="secondary">Configurable</Badge>
          </div>
          <Button size="sm" variant="outline">Configure Access Rules</Button>
        </CardContent>
      </Card>

      <Card className="border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5" />
            <span>Role Assignment</span>
          </CardTitle>
          <CardDescription>Automatic role assignment based on verification type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm">Standard Verified → Trusted User</span>
              <Button size="sm">Edit</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-sm">Business Verified → Business User</span>
              <Button size="sm">Edit</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm">Creator Verified → Creator Role</span>
              <Button size="sm">Edit</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-indigo-200">
        <CardHeader>
          <CardTitle>Verification Abuse Detection</CardTitle>
          <CardDescription>Monitor and prevent verification system abuse</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Account Selling Detection</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Document Swapping Alerts</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Suspicious Activity Monitoring</span>
              <Badge variant="default">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAudit = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Audit Log System"
        description="Inadequate audit logging can result in compliance violations, inability to trace security incidents, and loss of accountability. Maintain comprehensive logs for all verification activities."
      />

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Verification Audit Trail</span>
          </CardTitle>
          <CardDescription>Complete log of all verification activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Document Upload Logs</span>
              <Button size="sm" variant="outline">View</Button>
            </div>
            <div className="flex justify-between items-center">
              <span>Approval/Rejection History</span>
              <Button size="sm" variant="outline">View</Button>
            </div>
            <div className="flex justify-between items-center">
              <span>Admin Action Logs</span>
              <Button size="sm" variant="outline">View</Button>
            </div>
            <div className="flex justify-between items-center">
              <span>System Event Logs</span>
              <Button size="sm" variant="outline">View</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Admin Accountability</CardTitle>
          <CardDescription>Track admin actions and decisions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target User</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Admin1</TableCell>
                <TableCell>Approved</TableCell>
                <TableCell>john.doe@email.com</TableCell>
                <TableCell>2024-01-15 14:30</TableCell>
                <TableCell>Standard verification approved</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Admin2</TableCell>
                <TableCell>Rejected</TableCell>
                <TableCell>fake.user@email.com</TableCell>
                <TableCell>2024-01-15 14:25</TableCell>
                <TableCell>Fraudulent document detected</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderCommunication = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Communication Tools"
        description="Poor communication regarding verification status can lead to user frustration, support ticket overload, and reduced platform trust. Ensure clear, timely communication at all stages."
      />

      <Card className="border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Email Templates</span>
          </CardTitle>
          <CardDescription>Manage verification communication templates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Verification Approved</span>
            <Button size="sm" variant="outline">Edit Template</Button>
          </div>
          <div className="flex justify-between items-center">
            <span>Verification Rejected</span>
            <Button size="sm" variant="outline">Edit Template</Button>
          </div>
          <div className="flex justify-between items-center">
            <span>Additional Documents Required</span>
            <Button size="sm" variant="outline">Edit Template</Button>
          </div>
          <div className="flex justify-between items-center">
            <span>Verification Reminder</span>
            <Button size="sm" variant="outline">Edit Template</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Predefined Messages</span>
          </CardTitle>
          <CardDescription>Quick response options for common scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">Document Quality Issues</p>
              <p className="text-xs text-gray-600">Your document appears blurry or unclear. Please upload a clearer image.</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">Missing Information</p>
              <p className="text-xs text-gray-600">Please ensure all required fields are visible and complete.</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">Document Expired</p>
              <p className="text-xs text-gray-600">The provided document has expired. Please submit a current document.</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="mt-4">Add New Message</Button>
        </CardContent>
      </Card>

      <Card className="border-teal-200">
        <CardHeader>
          <CardTitle>Automated Reminders</CardTitle>
          <CardDescription>Configure automatic follow-up communications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Incomplete Verification (3 days)</span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Pending Review (7 days)</span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Expiring Verification (30 days)</span>
              <Badge variant="secondary">Disabled</Badge>
            </div>
            <Button size="sm" variant="outline">Configure Reminders</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <InfoCircle
        title="Security & Compliance Settings"
        description="Non-compliance with data protection regulations can result in significant fines and legal issues. Inadequate security measures can lead to data breaches and loss of user trust."
      />

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Data Protection Compliance</span>
          </CardTitle>
          <CardDescription>GDPR, CCPA, and other privacy regulation settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>GDPR Compliance Mode</span>
            <Badge variant="default">Enabled</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>CCPA Compliance Mode</span>
            <Badge variant="default">Enabled</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Data Retention Period (180 days)</span>
            <Button size="sm" variant="outline">Configure</Button>
          </div>
          <div className="flex justify-between items-center">
            <span>Right to be Forgotten</span>
            <Badge variant="default">Enabled</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Document Expiration</span>
          </CardTitle>
          <CardDescription>Automatic cleanup and retention policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Auto-delete after 180 days</span>
            <Badge variant="default">Enabled</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Secure deletion method</span>
            <Badge variant="default">AES-256</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Backup retention (30 days)</span>
            <Button size="sm" variant="outline">Configure</Button>
          </div>
          <div className="flex justify-between items-center">
            <span>Deletion audit logs</span>
            <Badge variant="default">Enabled</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Data Request Features</span>
          </CardTitle>
          <CardDescription>User data download and transparency features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>User Data Export</span>
              <Button size="sm" variant="outline">Configure</Button>
            </div>
            <div className="flex justify-between items-center">
              <span>Verification History Download</span>
              <Button size="sm" variant="outline">Enable</Button>
            </div>
            <div className="flex justify-between items-center">
              <span>Data Processing Summary</span>
              <Button size="sm" variant="outline">Setup</Button>
            </div>
            <div className="flex justify-between items-center">
              <span>Automated Report Generation</span>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'requests': return renderRequests();
      case 'types': return renderTypes();
      case 'tools': return renderTools();
      case 'metrics': return renderMetrics();
      case 'badges': return renderBadges();
      case 'access': return renderAccess();
      case 'audit': return renderAudit();
      case 'communication': return renderCommunication();
      case 'security': return renderSecurity();
      default: return renderDashboard();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Verified Users Management</h1>
        </div>
        <p className="text-gray-600">
          Manage user verification requests, configure verification types, and monitor platform trust metrics.
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

export default VerifiedUsers;