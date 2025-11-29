import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Info, MapPin, Clock, Shield, Globe, AlertTriangle, Settings, Eye, Zap } from 'lucide-react';

const GeoFencing: React.FC = () => {
  const [activeSection, setActiveSection] = useState('geo-rules');

  const sections = [
    { id: 'geo-rules', label: 'Geo-Fencing Rules', icon: MapPin },
    { id: 'time-access', label: 'Time-Based Access', icon: Clock },
    { id: 'ip-controls', label: 'IP Controls', icon: Shield },
    { id: 'admin-panel', label: 'Admin Control Panel', icon: Settings },
    { id: 'visual-map', label: 'Visual Geo Map', icon: Globe },
    { id: 'settings-panel', label: 'Settings Panel', icon: Eye },
    { id: 'elite-security', label: 'Elite Security Add-Ons', icon: Zap }
  ];

  const InfoCard = ({ title, children, consequence }: { title: string; children: React.ReactNode; consequence: string }) => (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-secondary/10">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-full bg-info/10 border border-info/20">
            <Info className="w-4 h-4 text-info" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mt-2">
          <p className="text-sm font-medium text-warning-foreground">
            <span className="font-bold">CONSEQUENCES:</span> {consequence}
          </p>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );

  const renderGeoRules = () => (
    <div className="space-y-6">
      <InfoCard 
        title="🌍 Geo-Fencing Rules" 
        consequence="Unrestricted geographic access can lead to unauthorized logins from high-risk regions, increased security breaches, and potential compliance violations in regulated industries."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-success/20 rounded-lg bg-success/5">
              <h4 className="font-semibold text-success mb-2">🌐 Allowed Countries</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="bg-success/10">UK</Badge>
                <Badge variant="outline" className="bg-success/10">Germany</Badge>
                <Badge variant="outline" className="bg-success/10">Albania</Badge>
              </div>
              <Button size="sm" variant="outline">Add Country</Button>
            </div>
            
            <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
              <h4 className="font-semibold text-destructive mb-2">🚫 Blocked Regions</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="destructive">Russia</Badge>
                <Badge variant="destructive">North Korea</Badge>
                <Badge variant="destructive">Unknown IPs</Badge>
              </div>
              <Button size="sm" variant="destructive">Add Blocked Region</Button>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-3">🌆 City/IP Range Controls</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-secondary/10 rounded">
                <span>London IP Pool Access</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-2 bg-secondary/10 rounded">
                <span>VPN/TOR Detection</span>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-3">🔒 Feature Restrictions</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Disable critical features when accessing from outside allowed zones
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Badge variant="outline">Payout System</Badge>
              <Badge variant="outline">Storefront Edit</Badge>
              <Badge variant="outline">Admin Dashboard</Badge>
              <Badge variant="outline">User Management</Badge>
            </div>
          </div>
        </div>
      </InfoCard>
    </div>
  );

  const renderTimeAccess = () => (
    <div className="space-y-6">
      <InfoCard 
        title="🕐 Time-Based Access Rules" 
        consequence="Without time restrictions, accounts remain vulnerable 24/7, increasing exposure to automated attacks during off-hours and compromising audit trails for compliance requirements."
      >
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-3">⏰ Login Windows</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Time</label>
                <input type="time" defaultValue="07:00" className="w-full p-2 border rounded mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">End Time</label>
                <input type="time" defaultValue="23:00" className="w-full p-2 border rounded mt-1" />
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-3">🗓️ Day Restrictions</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-secondary/10 rounded">
                <span>Block Sunday Night Logins</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-2 bg-secondary/10 rounded">
                <span>Block Public Holidays</span>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-3">📦 Feature Availability Windows</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-secondary/10 rounded">
                <span>Storefront Editing: 08:00-20:00</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-secondary/10 rounded">
                <span>Financial Operations: 09:00-17:00</span>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>
          </div>
        </div>
      </InfoCard>
    </div>
  );

  const renderIpControls = () => (
    <div className="space-y-6">
      <InfoCard 
        title="🛡️ IP Whitelist & Blacklist Controls" 
        consequence="Inadequate IP filtering allows malicious actors to exploit compromised credentials from untrusted networks, bypass geographic restrictions, and conduct brute force attacks from botnets."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-success/20 rounded-lg bg-success/5">
              <h4 className="font-semibold text-success mb-2">✅ IP Whitelist</h4>
              <div className="space-y-2 mb-3">
                <div className="text-sm bg-white/50 p-2 rounded">192.168.1.0/24</div>
                <div className="text-sm bg-white/50 p-2 rounded">10.0.0.0/8</div>
              </div>
              <Button size="sm" variant="outline">Add IP Range</Button>
            </div>
            
            <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
              <h4 className="font-semibold text-destructive mb-2">🚫 IP Blacklist</h4>
              <div className="space-y-2 mb-3">
                <div className="text-sm bg-white/50 p-2 rounded">203.0.113.0/24</div>
                <div className="text-sm bg-white/50 p-2 rounded">198.51.100.0/24</div>
              </div>
              <Button size="sm" variant="destructive">Add Blocked IP</Button>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-3">🛰️ Advanced IP Detection</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-secondary/10 rounded">
                <span>Auto-detect VPN Services</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-2 bg-secondary/10 rounded">
                <span>Block TOR Exit Nodes</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-2 bg-secondary/10 rounded">
                <span>Detect Datacenter IPs</span>
                <Switch />
              </div>
            </div>
          </div>
        </div>
      </InfoCard>
    </div>
  );

  const renderAdminPanel = () => (
    <div className="space-y-6">
      <InfoCard 
        title="🔍 Admin Control Panel" 
        consequence="Without centralized monitoring and control, security incidents go undetected, response times increase dramatically, and administrators lose visibility into access patterns and potential threats."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-2">📋 Rule Builder</h4>
              <p className="text-sm text-muted-foreground mb-3">Create custom access rules</p>
              <Button size="sm" className="w-full">Open Builder</Button>
            </Card>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-2">📊 Access Log</h4>
              <p className="text-sm text-muted-foreground mb-3">View failed attempts</p>
              <Button size="sm" variant="outline" className="w-full">View Logs</Button>
            </Card>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-2">🚨 Alert Panel</h4>
              <p className="text-sm text-muted-foreground mb-3">Real-time breach alerts</p>
              <Button size="sm" variant="secondary" className="w-full">Configure Alerts</Button>
            </Card>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-3">🔄 Auto-Fallback Options</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-secondary/10 rounded">
                <span>Allow ID Verification Override</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-2 bg-secondary/10 rounded">
                <span>Temporary Access Grants</span>
                <Switch />
              </div>
            </div>
          </div>
        </div>
      </InfoCard>
    </div>
  );

  const renderVisualMap = () => (
    <div className="space-y-6">
      <InfoCard 
        title="🗺️ Visual Geo Map & Analytics" 
        consequence="Lack of visual monitoring tools prevents quick identification of geographical attack patterns, makes it difficult to spot coordinated threats, and hampers strategic security decision-making."
      >
        <div className="space-y-4">
          <div className="p-6 border rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5">
            <h4 className="font-semibold mb-3">🌍 Real-Time Access Map</h4>
            <div className="bg-secondary/20 rounded-lg p-8 text-center">
              <Globe className="w-16 h-16 mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Interactive world map showing live access attempts</p>
              <p className="text-sm text-muted-foreground mt-2">Green: Allowed | Red: Blocked | Yellow: Suspicious</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-2">📊 Access Statistics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Requests Today</span>
                  <Badge>1,247</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Blocked Attempts</span>
                  <Badge variant="destructive">23</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Top Country</span>
                  <Badge variant="secondary">UK (45%)</Badge>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-2">⚠️ Security Alerts</h4>
              <div className="space-y-2">
                <div className="p-2 bg-warning/10 border border-warning/20 rounded text-sm">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  VPN detected from China
                </div>
                <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-sm">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  Multiple failed attempts
                </div>
              </div>
            </Card>
          </div>
        </div>
      </InfoCard>
    </div>
  );

  const renderSettingsPanel = () => (
    <div className="space-y-6">
      <InfoCard 
        title="🔧 Settings Panel Configuration" 
        consequence="Misconfigured access controls can either be too restrictive (blocking legitimate users) or too permissive (allowing unauthorized access), both leading to business disruption and security vulnerabilities."
      >
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-3">🧩 Apply Rules To</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Admin Panel</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Storefront Builder</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Creator Dashboard</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Financial Operations</span>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-3">🧠 Smart Suggestions</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-secondary/10 rounded">
                <span>AI-Based Access Pattern Analysis</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-2 bg-secondary/10 rounded">
                <span>Auto-suggest Security Rules</span>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-3">👥 Time Zone Management</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-secondary/10 rounded">
                <span>Auto-detect User Time Zones</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-2 bg-secondary/10 rounded">
                <span>VPN-Resistant Time Zone Detection</span>
                <Switch />
              </div>
            </div>
          </div>
        </div>
      </InfoCard>
    </div>
  );

  const renderEliteSecurity = () => (
    <div className="space-y-6">
      <InfoCard 
        title="⚡ Elite Security Add-Ons" 
        consequence="Basic access controls are insufficient for high-value targets and sophisticated threats. Without advanced security features, organizations remain vulnerable to state-sponsored attacks and advanced persistent threats."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 border-2 border-primary/20">
              <h4 className="font-semibold mb-2">📍 GeoLock Per Feature</h4>
              <p className="text-sm text-muted-foreground mb-3">Control access to individual buttons and sections</p>
              <Badge className="mb-2">Super Pro</Badge>
              <div className="space-y-1 text-xs">
                <div>• Button-level geo restrictions</div>
                <div>• Page section locking</div>
                <div>• API endpoint geo-fencing</div>
              </div>
            </Card>
            
            <Card className="p-4 border-2 border-secondary/20">
              <h4 className="font-semibold mb-2">🎯 Regional Redirection</h4>
              <p className="text-sm text-muted-foreground mb-3">Smart geo-based user routing</p>
              <Badge variant="secondary" className="mb-2">Enterprise</Badge>
              <div className="space-y-1 text-xs">
                <div>• Custom landing pages</div>
                <div>• Compliance-aware routing</div>
                <div>• Regional policy display</div>
              </div>
            </Card>
            
            <Card className="p-4 border-2 border-warning/20">
              <h4 className="font-semibold mb-2">🧠 AI Breach Predictor</h4>
              <p className="text-sm text-muted-foreground mb-3">Predictive threat analysis</p>
              <Badge variant="outline" className="mb-2">AI Enhanced</Badge>
              <div className="space-y-1 text-xs">
                <div>• Pattern-based threat detection</div>
                <div>• Preemptive blocking</div>
                <div>• Risk score calculation</div>
              </div>
            </Card>
            
            <Card className="p-4 border-2 border-success/20">
              <h4 className="font-semibold mb-2">🔐 Geo-Retry Defense</h4>
              <p className="text-sm text-muted-foreground mb-3">Smart fallback mechanisms</p>
              <Badge variant="outline" className="mb-2">Military Grade</Badge>
              <div className="space-y-1 text-xs">
                <div>• Phone OTP confirmation</div>
                <div>• Identity verification</div>
                <div>• Multi-factor override</div>
              </div>
            </Card>
          </div>

          <div className="p-4 border-2 border-destructive/20 rounded-lg bg-destructive/5">
            <h4 className="font-semibold text-destructive mb-2">🛡️ Government-Grade Security</h4>
            <p className="text-sm mb-3">
              Military-standard access control with advanced threat intelligence integration
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div>• State-sponsored threat detection</div>
              <div>• Zero-trust architecture</div>
              <div>• Advanced persistent threat (APT) protection</div>
              <div>• Real-time threat intelligence feeds</div>
            </div>
          </div>
        </div>
      </InfoCard>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'geo-rules': return renderGeoRules();
      case 'time-access': return renderTimeAccess();
      case 'ip-controls': return renderIpControls();
      case 'admin-panel': return renderAdminPanel();
      case 'visual-map': return renderVisualMap();
      case 'settings-panel': return renderSettingsPanel();
      case 'elite-security': return renderEliteSecurity();
      default: return renderGeoRules();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            🌍 Geo-Fencing & Time-Based Access
          </h1>
          <p className="text-lg text-muted-foreground">
            Military-grade contextual access control for maximum platform security
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-3 mb-8 p-4 bg-card border border-border rounded-lg">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            
            // Define different color schemes for each button
            const colorSchemes = [
              'bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border-blue-200',
              'bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 border-emerald-200',
              'bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border-purple-200',
              'bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 border-amber-200',
              'bg-gradient-to-r from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200 text-rose-700 border-rose-200',
              'bg-gradient-to-r from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 text-cyan-700 border-cyan-200',
              'bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700 border-indigo-200'
            ];
            
            const activeColorSchemes = [
              'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300',
              'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300',
              'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300',
              'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300',
              'bg-gradient-to-r from-rose-100 to-rose-200 text-rose-800 border-rose-300',
              'bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800 border-cyan-300',
              'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border-indigo-300'
            ];

            const colorScheme = colorSchemes[index % colorSchemes.length];
            const activeColorScheme = activeColorSchemes[index % activeColorSchemes.length];

            return (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 font-medium border shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 ${
                  activeSection === section.id
                    ? `${activeColorScheme} border-2`
                    : colorScheme
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {section.label}
              </Button>
            );
          })}
        </div>

        {/* Content */}
        {renderSection()}
      </div>
    </div>
  );
};

export default GeoFencing;