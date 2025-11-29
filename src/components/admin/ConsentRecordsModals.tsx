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
  Scale, 
  Shield, 
  FileText, 
  Check, 
  X, 
  Clock, 
  Download, 
  Users, 
  BarChart3, 
  AlertTriangle,
  Eye,
  Calendar,
  Archive,
  Gavel,
  Globe,
  Lock,
  Search,
  Filter,
  TrendingUp
} from 'lucide-react';

interface ConsentRecordsInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsentRecordsInspectorModal: React.FC<ConsentRecordsInspectorModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedConsentType, setSelectedConsentType] = useState('all');
  const [dateRange, setDateRange] = useState('30d');
  const [consentStatus, setConsentStatus] = useState('all');

  // Mock data for demonstration
  const consentRecords = [
    { id: 1, user: 'john_doe', consent_type: 'GDPR', status: 'granted', version: 'v2.1', granted_at: '2024-01-20 14:30:00', expires_at: '2025-01-20' },
    { id: 2, user: 'jane_smith', consent_type: 'Marketing', status: 'revoked', version: 'v1.0', granted_at: '2024-01-15 10:20:00', revoked_at: '2024-01-19 16:45:00' },
    { id: 3, user: 'alice_wonder', consent_type: 'Cookies', status: 'granted', version: 'v3.0', granted_at: '2024-01-20 09:15:00', expires_at: '2025-01-20' },
    { id: 4, user: 'bob_builder', consent_type: 'Terms', status: 'pending', version: 'v2.0', granted_at: null, expires_at: null },
    { id: 5, user: 'charlie_brown', consent_type: 'CCPA', status: 'granted', version: 'v1.5', granted_at: '2024-01-18 11:30:00', expires_at: '2025-01-18' },
  ];

  const consentStats = {
    total_users: 15847,
    consented_users: 14523,
    pending_consent: 987,
    revoked_consent: 337,
    consent_rate: 91.6,
    types: {
      'GDPR': { granted: 12456, pending: 234, revoked: 89, rate: 95.2 },
      'Marketing': { granted: 8934, pending: 456, revoked: 2145, rate: 76.8 },
      'Cookies': { granted: 13245, pending: 123, revoked: 67, rate: 98.5 },
      'Terms': { granted: 14234, pending: 234, revoked: 45, rate: 97.8 },
      'CCPA': { granted: 9876, pending: 345, revoked: 123, rate: 92.1 }
    }
  };

  const versionHistory = [
    { version: 'v3.0', consent_type: 'Cookies', released: '2024-01-15', adopted: 8945, compliance: 'GDPR, CCPA' },
    { version: 'v2.1', consent_type: 'GDPR', released: '2024-01-10', adopted: 12456, compliance: 'GDPR' },
    { version: 'v2.0', consent_type: 'Terms', released: '2024-01-05', adopted: 14234, compliance: 'Universal' },
    { version: 'v1.5', consent_type: 'CCPA', released: '2023-12-20', adopted: 9876, compliance: 'CCPA' },
  ];

  const complianceAlerts = [
    { type: 'Expiring Consent', count: 234, severity: 'Medium', description: 'Consent records expiring in 30 days' },
    { type: 'Pending Consent', count: 987, severity: 'High', description: 'Users with pending consent requirements' },
    { type: 'Version Mismatch', count: 45, severity: 'Low', description: 'Users on outdated consent versions' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-cyan-600" />
            Consent Records Inspector
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schema">Schema & Fields</TabsTrigger>
            <TabsTrigger value="anomaly">Compliance Monitoring</TabsTrigger>
            <TabsTrigger value="security">Legal Requirements</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Consent Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Consent Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Users</span>
                      <span className="font-bold">{consentStats.total_users.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Consented</span>
                      <span className="font-bold text-green-600">{consentStats.consented_users.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pending</span>
                      <span className="font-bold text-amber-600">{consentStats.pending_consent.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Revoked</span>
                      <span className="font-bold text-red-600">{consentStats.revoked_consent.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm font-medium">Consent Rate</span>
                      <Badge variant="outline" className="text-green-700 border-green-300">
                        {consentStats.consent_rate}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    Compliance Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {complianceAlerts.map((alert, index) => (
                      <div key={index} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="text-amber-700 border-amber-300">
                            {alert.type}
                          </Badge>
                          <Badge variant={alert.severity === 'High' ? 'destructive' : alert.severity === 'Medium' ? 'secondary' : 'outline'}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <div className="text-sm font-medium">{alert.count} items</div>
                        <div className="text-xs text-muted-foreground">{alert.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Consent Analytics Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Consent Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-slate-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-cyan-600 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Consent Rate Trends</p>
                      <p className="text-xs text-muted-foreground">Daily consent analytics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Consent Types Breakdown */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Consent Types Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(consentStats.types).map(([type, stats]) => (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {type === 'GDPR' && <Globe className="h-4 w-4 text-blue-600" />}
                            {type === 'Marketing' && <Users className="h-4 w-4 text-purple-600" />}
                            {type === 'Cookies' && <Shield className="h-4 w-4 text-green-600" />}
                            {type === 'Terms' && <FileText className="h-4 w-4 text-gray-600" />}
                            {type === 'CCPA' && <Lock className="h-4 w-4 text-orange-600" />}
                            <span className="font-medium">{type}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-green-600">{stats.granted} granted</span>
                            <span className="text-sm text-amber-600">{stats.pending} pending</span>
                            <span className="text-sm text-red-600">{stats.revoked} revoked</span>
                            <Badge variant="outline">{stats.rate}%</Badge>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-cyan-600 h-2 rounded-full" 
                            style={{ width: `${stats.rate}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Version History */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Archive className="h-4 w-4" />
                    Version History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {versionHistory.map((version, index) => (
                      <div key={index} className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{version.version}</Badge>
                          <span className="text-xs text-muted-foreground">{version.released}</span>
                        </div>
                        <div className="text-sm font-medium">{version.consent_type}</div>
                        <div className="text-xs text-muted-foreground">{version.adopted.toLocaleString()} adoptions</div>
                        <div className="text-xs text-cyan-600">{version.compliance}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Records */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Consent Records
                  </CardTitle>
                  <div className="flex gap-2">
                    <Select value={consentStatus} onValueChange={setConsentStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="granted">Granted</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="revoked">Revoked</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedConsentType} onValueChange={setSelectedConsentType}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="GDPR">GDPR</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Cookies">Cookies</SelectItem>
                        <SelectItem value="Terms">Terms</SelectItem>
                        <SelectItem value="CCPA">CCPA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {consentRecords.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {record.status === 'granted' && <Check className="h-4 w-4 text-green-600" />}
                          {record.status === 'pending' && <Clock className="h-4 w-4 text-amber-600" />}
                          {record.status === 'revoked' && <X className="h-4 w-4 text-red-600" />}
                          <div>
                            <div className="font-medium text-sm">{record.user}</div>
                            <div className="text-xs text-muted-foreground">{record.consent_type} {record.version}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {record.granted_at ? record.granted_at.split(' ')[0] : 'N/A'}
                          </span>
                          <Badge variant={record.status === 'granted' ? 'default' : record.status === 'pending' ? 'secondary' : 'destructive'}>
                            {record.status}
                          </Badge>
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
                <CardTitle>Table Schema: consent_records</CardTitle>
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
                    <div>User who gave consent</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm py-2 border-b">
                    <div className="font-mono">consent_type</div>
                    <div>TEXT</div>
                    <div><Badge variant="outline">NOT NULL</Badge> <Badge variant="outline">ENUM</Badge></div>
                    <div>Type of consent (GDPR, cookies, marketing, terms)</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm py-2 border-b">
                    <div className="font-mono">granted_at</div>
                    <div>TIMESTAMPTZ</div>
                    <div><Badge variant="secondary">NULLABLE</Badge> <Badge variant="outline">INDEXED</Badge></div>
                    <div>When consent was given</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm py-2 border-b">
                    <div className="font-mono">version</div>
                    <div>TEXT</div>
                    <div><Badge variant="outline">NOT NULL</Badge></div>
                    <div>Version of consent terms</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm py-2 border-b">
                    <div className="font-mono">status</div>
                    <div>TEXT</div>
                    <div><Badge variant="outline">NOT NULL</Badge> <Badge variant="outline">ENUM</Badge></div>
                    <div>Current status (granted, revoked, pending)</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm py-2 border-b">
                    <div className="font-mono">expires_at</div>
                    <div>TIMESTAMPTZ</div>
                    <div><Badge variant="secondary">NULLABLE</Badge></div>
                    <div>When consent expires (if applicable)</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm py-2">
                    <div className="font-mono">audit_trail</div>
                    <div>JSONB</div>
                    <div><Badge variant="secondary">DEFAULT '{}'</Badge></div>
                    <div>Complete history of consent changes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Monitoring Tab */}
          <TabsContent value="anomaly" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gavel className="h-4 w-4 text-blue-600" />
                    GDPR Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Right to Access Requests</span>
                      <Badge variant="outline">0 pending</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Right to Deletion Requests</span>
                      <Badge variant="outline">3 pending</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data Portability Requests</span>
                      <Badge variant="outline">1 pending</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Consent Withdrawal Rate</span>
                      <Badge variant="outline">2.1%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-orange-600" />
                    CCPA Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Do Not Sell Requests</span>
                      <Badge variant="outline">12 processed</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Opt-Out Rate</span>
                      <Badge variant="outline">8.3%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Disclosure Requests</span>
                      <Badge variant="outline">2 pending</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sale Opt-In Rate</span>
                      <Badge variant="outline">91.7%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monitoring Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Consent Expiry Warning (days)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label>Version Update Grace Period (days)</Label>
                    <Input type="number" defaultValue="90" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Required Consent Types</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">GDPR</Badge>
                    <Badge variant="outline">Cookies</Badge>
                    <Badge variant="outline">Terms</Badge>
                    <Badge variant="secondary">Marketing (Optional)</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Legal Requirements Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-purple-600" />
                  Legal Framework Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Audit Requirements</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="audit-trail">Maintain complete audit trail</Label>
                        <Switch id="audit-trail" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="version-tracking">Track consent version changes</Label>
                        <Switch id="version-tracking" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="ip-logging">Log IP addresses for consent</Label>
                        <Switch id="ip-logging" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Data Subject Rights</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="access-requests">Enable data access requests</Label>
                        <Switch id="access-requests" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="deletion-requests">Enable deletion requests</Label>
                        <Switch id="deletion-requests" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="portability">Enable data portability</Label>
                        <Switch id="portability" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Retention Policies</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Consent Record Retention (years)</Label>
                      <Input type="number" defaultValue="7" />
                    </div>
                    <div>
                      <Label>Audit Log Retention (years)</Label>
                      <Input type="number" defaultValue="10" />
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
                    Compliance Export
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
                        <SelectItem value="audit">Audit Report</SelectItem>
                        <SelectItem value="gdpr">GDPR Compliance Report</SelectItem>
                        <SelectItem value="ccpa">CCPA Compliance Report</SelectItem>
                        <SelectItem value="consent">Consent Proof Export</SelectItem>
                        <SelectItem value="analytics">Consent Analytics</SelectItem>
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
                    <Label>Include Legal Signatures</Label>
                    <Switch defaultChecked />
                    <p className="text-xs text-muted-foreground">
                      Adds cryptographic signatures for legal validity
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Process Data Request</Label>
                    <div className="flex gap-2">
                      <Select>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Request type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="access">Data Access</SelectItem>
                          <SelectItem value="deletion">Data Deletion</SelectItem>
                          <SelectItem value="portability">Data Portability</SelectItem>
                          <SelectItem value="correction">Data Correction</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline">Process</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Revoke User Consent</Label>
                    <div className="flex gap-2">
                      <Input placeholder="User ID" className="flex-1" />
                      <Select>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="cookies">Cookies</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline">Revoke</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>View User Consent Status</Label>
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

interface ConsentRecordsAddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsentRecordsAddTableModal: React.FC<ConsentRecordsAddTableModalProps> = ({
  isOpen,
  onClose
}) => {
  const [sqlCommand, setSqlCommand] = useState(`-- Create consent type enum
CREATE TYPE consent_type AS ENUM ('GDPR', 'CCPA', 'Cookies', 'Marketing', 'Terms', 'Privacy_Policy', 'Data_Processing');

-- Create consent status enum
CREATE TYPE consent_status AS ENUM ('granted', 'revoked', 'pending', 'expired');

-- Create consent records table
CREATE TABLE consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  consent_type consent_type NOT NULL,
  status consent_status NOT NULL DEFAULT 'pending',
  version TEXT NOT NULL,
  granted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  legal_basis TEXT,
  purpose TEXT,
  audit_trail JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance and compliance queries
CREATE INDEX idx_consent_records_user_id ON consent_records(user_id);
CREATE INDEX idx_consent_records_type ON consent_records(consent_type);
CREATE INDEX idx_consent_records_status ON consent_records(status);
CREATE INDEX idx_consent_records_granted_at ON consent_records(granted_at);
CREATE INDEX idx_consent_records_expires_at ON consent_records(expires_at);

-- Create composite index for user consent lookup
CREATE INDEX idx_consent_records_user_type ON consent_records(user_id, consent_type);

-- Enable Row Level Security
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own consent records" 
ON consent_records FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own consent records" 
ON consent_records FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own consent records" 
ON consent_records FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all consent records" 
ON consent_records FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "System can insert consent records" 
ON consent_records FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_consent_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  
  -- Update audit trail
  NEW.audit_trail = COALESCE(NEW.audit_trail, '{}'::jsonb) || 
    jsonb_build_object(
      'updated_at', NOW(),
      'previous_status', OLD.status,
      'new_status', NEW.status,
      'ip_address', NEW.ip_address
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER consent_records_updated_at
  BEFORE UPDATE ON consent_records
  FOR EACH ROW
  EXECUTE FUNCTION update_consent_updated_at();

-- Create function to check consent expiry
CREATE OR REPLACE FUNCTION check_consent_expiry()
RETURNS void AS $$
BEGIN
  -- Update expired consents
  UPDATE consent_records 
  SET 
    status = 'expired',
    updated_at = NOW()
  WHERE 
    status = 'granted' 
    AND expires_at IS NOT NULL 
    AND expires_at < NOW();
    
  -- Log expired consents to security events
  INSERT INTO security_events (
    event_type,
    event_description,
    metadata,
    risk_level
  )
  SELECT 
    'consent_expired',
    'Consent records have expired',
    jsonb_build_object(
      'expired_count', COUNT(*),
      'consent_types', array_agg(DISTINCT consent_type)
    ),
    'medium'
  FROM consent_records 
  WHERE status = 'expired' 
    AND updated_at > NOW() - INTERVAL '1 hour'
  HAVING COUNT(*) > 0;
END;
$$ LANGUAGE plpgsql;

-- Create function for GDPR compliance check
CREATE OR REPLACE FUNCTION check_gdpr_compliance(user_uuid UUID)
RETURNS jsonb AS $$
DECLARE
  compliance_status jsonb;
BEGIN
  SELECT jsonb_build_object(
    'has_gdpr_consent', EXISTS(
      SELECT 1 FROM consent_records 
      WHERE user_id = user_uuid 
        AND consent_type = 'GDPR' 
        AND status = 'granted'
    ),
    'has_marketing_consent', EXISTS(
      SELECT 1 FROM consent_records 
      WHERE user_id = user_uuid 
        AND consent_type = 'Marketing' 
        AND status = 'granted'
    ),
    'has_cookies_consent', EXISTS(
      SELECT 1 FROM consent_records 
      WHERE user_id = user_uuid 
        AND consent_type = 'Cookies' 
        AND status = 'granted'
    ),
    'pending_consents', (
      SELECT array_agg(consent_type) 
      FROM consent_records 
      WHERE user_id = user_uuid 
        AND status = 'pending'
    ),
    'last_consent_update', (
      SELECT MAX(updated_at) 
      FROM consent_records 
      WHERE user_id = user_uuid
    )
  ) INTO compliance_status;
  
  RETURN compliance_status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-cyan-600" />
            Create Consent Records Table
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
                console.log('Creating consent_records table:', sqlCommand);
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