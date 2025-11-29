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
  MapPin, 
  Globe, 
  AlertTriangle, 
  Shield, 
  Download, 
  Ban, 
  Eye,
  Clock,
  Users,
  TrendingUp,
  Filter,
  Search,
  Calendar,
  BarChart3,
  Map
} from 'lucide-react';

interface GeoLoginAuditInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeoLoginAuditInspectorModal: React.FC<GeoLoginAuditInspectorModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [dateRange, setDateRange] = useState('24h');
  const [riskFilter, setRiskFilter] = useState('all');

  // Mock data for demonstration
  const loginData = [
    { id: 1, user: 'john_doe', country: 'United States', city: 'New York', ip: '192.168.1.1', timestamp: '2024-01-20 14:30:00', risk: 'low' },
    { id: 2, user: 'jane_smith', country: 'United Kingdom', city: 'London', ip: '10.0.0.1', timestamp: '2024-01-20 14:25:00', risk: 'medium' },
    { id: 3, user: 'john_doe', country: 'Brazil', city: 'São Paulo', ip: '172.16.0.1', timestamp: '2024-01-20 14:32:00', risk: 'high' },
  ];

  const anomalies = [
    { type: 'Location Jump', user: 'john_doe', details: 'US → Brazil in 2 minutes', severity: 'High' },
    { type: 'New Country', user: 'alice_wonder', details: 'First login from Russia', severity: 'Medium' },
    { type: 'Rapid Succession', user: 'bob_builder', details: '5 logins from different cities', severity: 'High' },
  ];

  const topCountries = [
    { country: 'United States', logins: 1247, percentage: 45 },
    { country: 'United Kingdom', logins: 623, percentage: 22 },
    { country: 'Germany', logins: 387, percentage: 14 },
    { country: 'France', logins: 298, percentage: 11 },
    { country: 'Brazil', logins: 223, percentage: 8 },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-indigo-600" />
            Geo Login Audit Inspector
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* World Map Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-4 w-4" />
                    Global Login Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Globe className="h-12 w-12 text-indigo-600 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Interactive world map visualization</p>
                      <p className="text-xs text-muted-foreground">Login density by country</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Countries */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Top Login Countries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topCountries.map((country, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                          <span className="text-sm font-medium">{country.country}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{country.logins}</span>
                          <Badge variant="outline">{country.percentage}%</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Login Timeline */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Login Activity
                  </CardTitle>
                  <div className="flex gap-2">
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">Last Hour</SelectItem>
                        <SelectItem value="24h">Last 24h</SelectItem>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={riskFilter} onValueChange={setRiskFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Risk</SelectItem>
                        <SelectItem value="high">High Risk</SelectItem>
                        <SelectItem value="medium">Medium Risk</SelectItem>
                        <SelectItem value="low">Low Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {loginData.map((login) => (
                      <div key={login.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-indigo-600" />
                          <div>
                            <div className="font-medium text-sm">{login.user}</div>
                            <div className="text-xs text-muted-foreground">{login.country}, {login.city}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{login.timestamp}</span>
                          <Badge variant={login.risk === 'high' ? 'destructive' : login.risk === 'medium' ? 'secondary' : 'outline'}>
                            {login.risk}
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
                <CardTitle>Table Schema: geo_login_audit</CardTitle>
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
                    <div>Identifies which user is logging in</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm py-2 border-b">
                    <div className="font-mono">ip</div>
                    <div>INET</div>
                    <div><Badge variant="outline">NOT NULL</Badge></div>
                    <div>Public IP address used for login</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm py-2 border-b">
                    <div className="font-mono">country</div>
                    <div>TEXT</div>
                    <div><Badge variant="outline">INDEXED</Badge></div>
                    <div>Resolved country from IP</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm py-2 border-b">
                    <div className="font-mono">city</div>
                    <div>TEXT</div>
                    <div><Badge variant="secondary">NULLABLE</Badge></div>
                    <div>City location from IP</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm py-2 border-b">
                    <div className="font-mono">timestamp</div>
                    <div>TIMESTAMPTZ</div>
                    <div><Badge variant="outline">NOT NULL</Badge> <Badge variant="outline">INDEXED</Badge></div>
                    <div>When the login happened</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm py-2">
                    <div className="font-mono">risk_score</div>
                    <div>INTEGER</div>
                    <div><Badge variant="secondary">DEFAULT 0</Badge></div>
                    <div>Calculated risk score (0-100)</div>
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
                    Active Anomalies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {anomalies.map((anomaly, index) => (
                      <div key={index} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-amber-700 border-amber-300">
                            {anomaly.type}
                          </Badge>
                          <Badge variant={anomaly.severity === 'High' ? 'destructive' : 'secondary'}>
                            {anomaly.severity}
                          </Badge>
                        </div>
                        <div className="text-sm font-medium">{anomaly.user}</div>
                        <div className="text-xs text-muted-foreground">{anomaly.details}</div>
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
                    <Label>Location Jump Detection</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Distance threshold (km)</span>
                      <Input type="number" defaultValue="1000" className="w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Time window (minutes)</span>
                      <Input type="number" defaultValue="5" className="w-20" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Rapid Login Detection</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Max logins per hour</span>
                      <Input type="number" defaultValue="10" className="w-20" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>High-Risk Countries</Label>
                    <Textarea 
                      placeholder="Enter country codes (e.g., CN, RU, KP)"
                      className="h-20"
                    />
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
                    <h4 className="font-medium">MFA Enforcement</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="mfa-location-jump">Require MFA on location jump</Label>
                        <Switch id="mfa-location-jump" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="mfa-new-country">Require MFA for new countries</Label>
                        <Switch id="mfa-new-country" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="mfa-high-risk">Require MFA for high-risk countries</Label>
                        <Switch id="mfa-high-risk" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Session Management</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-logout">Auto-logout on suspicious activity</Label>
                        <Switch id="auto-logout" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="blacklist-session">Auto-blacklist suspicious sessions</Label>
                        <Switch id="blacklist-session" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notify-admins">Notify admins on high-risk logins</Label>
                        <Switch id="notify-admins" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Trigger Thresholds</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Risk Score Threshold</Label>
                      <Input type="number" defaultValue="70" placeholder="0-100" />
                    </div>
                    <div>
                      <Label>Max Distance Jump (km)</Label>
                      <Input type="number" defaultValue="1000" />
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
                    Export Tools
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
                        <SelectItem value="all">All Login Data</SelectItem>
                        <SelectItem value="country">Filter by Country</SelectItem>
                        <SelectItem value="risk">Filter by Risk Score</SelectItem>
                        <SelectItem value="anomalies">Anomalies Only</SelectItem>
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
                    <Shield className="h-4 w-4" />
                    Live Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Block IP Address</Label>
                    <div className="flex gap-2">
                      <Input placeholder="Enter IP address" className="flex-1" />
                      <Button variant="destructive">
                        <Ban className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Force User Logout</Label>
                    <div className="flex gap-2">
                      <Input placeholder="Enter user ID" className="flex-1" />
                      <Button variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Update Risk Score</Label>
                    <div className="flex gap-2">
                      <Input placeholder="User ID" className="flex-1" />
                      <Input placeholder="Risk score" className="w-20" />
                      <Button variant="outline">Update</Button>
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

interface GeoLoginAuditAddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeoLoginAuditAddTableModal: React.FC<GeoLoginAuditAddTableModalProps> = ({
  isOpen,
  onClose
}) => {
  const [sqlCommand, setSqlCommand] = useState(`CREATE TABLE geo_login_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  ip INET NOT NULL,
  country TEXT,
  city TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  risk_score INTEGER DEFAULT 0,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_geo_login_audit_user_id ON geo_login_audit(user_id);
CREATE INDEX idx_geo_login_audit_timestamp ON geo_login_audit(timestamp);
CREATE INDEX idx_geo_login_audit_country ON geo_login_audit(country);
CREATE INDEX idx_geo_login_audit_ip ON geo_login_audit(ip);

-- Enable Row Level Security
ALTER TABLE geo_login_audit ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own geo login audit" 
ON geo_login_audit FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all geo login audit" 
ON geo_login_audit FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "System can insert geo login audit" 
ON geo_login_audit FOR INSERT 
WITH CHECK (true);`);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-indigo-600" />
            Create Geo Login Audit Table
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
                console.log('Creating geo_login_audit table:', sqlCommand);
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