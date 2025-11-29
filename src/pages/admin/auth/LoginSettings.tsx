import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Info, Shield, Users, Settings, Eye, Code, Palette, AlertTriangle, CheckCircle, Clock, Globe, Smartphone, Mail, Key, Zap } from 'lucide-react';

const LoginSettings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'methods', label: 'Login Methods', icon: Key },
    { id: 'experience', label: 'UX Experience', icon: Palette },
    { id: 'policies', label: 'Security Policies', icon: Shield },
    { id: 'monitoring', label: 'Monitoring & Logs', icon: Eye },
    { id: 'developer', label: 'Developer Controls', icon: Code },
    { id: 'advanced', label: 'Advanced Features', icon: Settings }
  ];

  const InfoCard = ({ title, content, consequence }: { title: string; content: string; consequence: string }) => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="bg-blue-100 rounded-full p-2 mt-1">
          <Info className="h-4 w-4 text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-blue-900 mb-2">{title}</h4>
          <p className="text-sm text-blue-800 mb-3">{content}</p>
          <div className="bg-blue-100 rounded-md p-3">
            <p className="text-xs font-medium text-blue-700">
              <span className="font-bold">CONSEQUENCES:</span> {consequence}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const OverviewSection = () => (
    <div className="space-y-6">
      <InfoCard
        title="Login Settings Overview"
        content="This panel controls all authentication methods, security policies, and user experience settings for platform login."
        consequence="Changes here affect all users immediately. Test thoroughly before applying to production."
      />
      
      <Card className="border-green-200">
        <CardHeader className="border-b border-green-100 bg-green-50">
          <CardTitle className="text-green-800 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Platform Login Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">6</div>
              <div className="text-sm text-blue-700">Active Methods</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">1,247</div>
              <div className="text-sm text-green-700">Today's Logins</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <div className="text-sm text-yellow-700">Suspicious Attempts</div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Login Methods Enabled:</span>
              <div className="flex gap-1">
                <Badge variant="secondary">Email</Badge>
                <Badge variant="secondary">Phone</Badge>
                <Badge variant="secondary">Google</Badge>
                <Badge variant="secondary">Apple</Badge>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">MFA Status:</span>
              <Badge className="bg-orange-100 text-orange-800">Optional</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Rate Limits:</span>
              <span className="text-sm text-gray-600">5 attempts per 10 mins</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const LoginMethodsSection = () => (
    <div className="space-y-6">
      <InfoCard
        title="Login Method Configuration"
        content="Enable or disable different authentication methods available to users during login process."
        consequence="Disabling methods may lock out users who only use that method. Ensure alternative access before disabling."
      />

      <Card className="border-blue-200">
        <CardHeader className="border-b border-blue-100 bg-blue-50">
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Key className="h-5 w-5" />
            Available Login Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[
              { icon: Mail, name: 'Email', desc: 'Standard email/password login', status: true },
              { icon: Smartphone, name: 'Phone', desc: 'SMS code authentication', status: true },
              { icon: Globe, name: 'Username', desc: 'Username-only login option', status: true },
              { icon: Settings, name: 'Google OAuth', desc: 'Google account integration', status: true },
              { icon: Settings, name: 'Apple Sign-In', desc: 'Apple ID authentication', status: true },
              { icon: Settings, name: 'Phone Number', desc: 'SMS message authentication', status: false },
              { icon: Zap, name: 'Magic Link', desc: 'One-click email/SMS login', status: false },
              { icon: Shield, name: 'Hardware Key', desc: 'FIDO2/U2F security keys', status: false }
            ].map((method, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <method.icon className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-gray-600">{method.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={method.status} />
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
                  >
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const UXExperienceSection = () => (
    <div className="space-y-6">
      <InfoCard
        title="User Experience Customization"
        content="Customize the login interface appearance, flow order, animations, and user-facing messages."
        consequence="Poor UX settings can confuse users and increase support tickets. Test changes with real users."
      />

      <Card className="border-purple-200">
        <CardHeader className="border-b border-purple-100 bg-purple-50">
          <CardTitle className="text-purple-800 flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Login Experience Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Login Flow Order</Label>
                <Select defaultValue="email-first">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email-first">Email → Phone → OAuth</SelectItem>
                    <SelectItem value="phone-first">Phone → Email → OAuth</SelectItem>
                    <SelectItem value="oauth-first">OAuth → Email → Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>UI Theme</Label>
                <Select defaultValue="light">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light Theme</SelectItem>
                    <SelectItem value="dark">Dark Theme</SelectItem>
                    <SelectItem value="auto">System Preference</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Animation Style</Label>
                <Select defaultValue="fade">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fade">Fade In/Out</SelectItem>
                    <SelectItem value="slide">Slide Transitions</SelectItem>
                    <SelectItem value="none">No Animations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Custom Login Placeholder</Label>
                <Input placeholder="Enter your email or phone..." />
              </div>
              <div>
                <Label>Error Message Style</Label>
                <Select defaultValue="friendly">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">User-Friendly</SelectItem>
                    <SelectItem value="technical">Technical Details</SelectItem>
                    <SelectItem value="minimal">Minimal Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Auto-Focus Input</Label>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SecurityPoliciesSection = () => (
    <div className="space-y-6">
      <InfoCard
        title="Security & Access Policies"
        content="Configure authentication security rules, rate limiting, token management, and risk-based protections."
        consequence="Overly strict policies may lock out legitimate users. Too lenient policies increase security risks."
      />

      <Card className="border-red-200">
        <CardHeader className="border-b border-red-100 bg-red-50">
          <CardTitle className="text-red-800 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Max Login Attempts</Label>
                <Select defaultValue="5">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 attempts</SelectItem>
                    <SelectItem value="5">5 attempts</SelectItem>
                    <SelectItem value="10">10 attempts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Lockout Duration</Label>
                <Select defaultValue="10">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Session Timeout</Label>
                <Select defaultValue="120">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="480">8 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>AI-Based Risk Detection</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Device Fingerprinting</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>IP Blocklist Check</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Terms Re-acceptance</Label>
                <Switch />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const MonitoringSection = () => (
    <div className="space-y-6">
      <InfoCard
        title="Login Monitoring & Analytics"
        content="View real-time login statistics, geographic distribution, failed attempts, and security alerts."
        consequence="Monitoring helps detect attacks early. Disable only if storage space is critical concern."
      />

      <Card className="border-green-200">
        <CardHeader className="border-b border-green-100 bg-green-50">
          <CardTitle className="text-green-800 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Login Monitoring Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-blue-600">1,247</div>
              <div className="text-sm text-blue-700">Login Attempts Today</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-red-600">23</div>
              <div className="text-sm text-red-700">Failed Attempts</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-green-600">98.1%</div>
              <div className="text-sm text-green-700">Success Rate</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Login Attempt Logging</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Geographic Activity Map</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>High-Risk Pattern Alerts</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Anonymous Session Tracking</Label>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const DeveloperControlsSection = () => (
    <div className="space-y-6">
      <InfoCard
        title="Developer & API Settings"
        content="Configure webhooks, JWT tokens, session storage, API rate limits, and custom authentication logic."
        consequence="Incorrect API settings can break integrations. Changes require developer coordination."
      />

      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-100 bg-gray-50">
          <CardTitle className="text-gray-800 flex items-center gap-2">
            <Code className="h-5 w-5" />
            Developer Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Webhook on Login Success</Label>
              <Input placeholder="https://api.yoursite.com/webhooks/login" />
            </div>
            <div>
              <Label>JWT Token Expiry</Label>
              <Select defaultValue="2h">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="2h">2 hours</SelectItem>
                  <SelectItem value="24h">24 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Session Storage Type</Label>
              <Select defaultValue="local">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local Storage</SelectItem>
                  <SelectItem value="cookie">Secure Cookies</SelectItem>
                  <SelectItem value="db">Encrypted Database</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>Device Binding</Label>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <Label>API Rate Limiting</Label>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AdvancedFeaturesSection = () => (
    <div className="space-y-6">
      <InfoCard
        title="Advanced Authentication Features"
        content="Enable cutting-edge security features like behavioral biometrics, AI prediction, and deep linking support."
        consequence="Advanced features may require additional setup and can impact performance. Test thoroughly."
      />

      <Card className="border-indigo-200">
        <CardHeader className="border-b border-indigo-100 bg-indigo-50">
          <CardTitle className="text-indigo-800 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Advanced Security Features
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Behavioral Biometrics</div>
                <div className="text-sm text-gray-600">Typing speed and mouse pattern analysis</div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">ID Verification Prompt</div>
                <div className="text-sm text-gray-600">Require ID upload for flagged users</div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">AI Login Prediction</div>
                <div className="text-sm text-gray-600">Real-time risk assessment during login</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Deep Linking Support</div>
                <div className="text-sm text-gray-600">Redirect to specific pages after login</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Modular Login Experience</div>
                <div className="text-sm text-gray-600">Different UIs for web vs mobile</div>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview': return <OverviewSection />;
      case 'methods': return <LoginMethodsSection />;
      case 'experience': return <UXExperienceSection />;
      case 'policies': return <SecurityPoliciesSection />;
      case 'monitoring': return <MonitoringSection />;
      case 'developer': return <DeveloperControlsSection />;
      case 'advanced': return <AdvancedFeaturesSection />;
      default: return <OverviewSection />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 rounded-lg p-3">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🔐 Login Settings</h1>
            <p className="text-gray-600">Manage authentication methods, security policies, and user experience</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-3">
          {sections.map((section, index) => {
            const Icon = section.icon;
            
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
                className={`flex items-center gap-2 font-medium border shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 ${
                  activeSection === section.id
                    ? `${activeColorScheme} border-2`
                    : colorScheme
                }`}
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Active Section Content */}
      {renderActiveSection()}
    </div>
  );
};

export default LoginSettings;