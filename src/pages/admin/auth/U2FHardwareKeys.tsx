import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Info, Shield, Key, Users, Database, Zap, BarChart3, ShieldCheck, Smartphone, Settings, Clock, AlertTriangle } from 'lucide-react';

const U2FHardwareKeys: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'U2F Overview', icon: Shield },
    { id: 'registration', label: 'Key Registration', icon: Key },
    { id: 'login-flow', label: 'Login Flow', icon: ShieldCheck },
    { id: 'admin-controls', label: 'Admin Controls', icon: Settings },
    { id: 'integration', label: 'WebAuthn Integration', icon: Database },
    { id: 'advanced', label: 'Advanced Features', icon: Zap },
    { id: 'analytics', label: 'Analytics View', icon: BarChart3 }
  ];

  const InfoCard = ({ title, children, variant = 'info' }: { title: string; children: React.ReactNode; variant?: 'info' | 'warning' | 'success' }) => {
    const bgColor = variant === 'warning' ? 'bg-yellow-50' : variant === 'success' ? 'bg-green-50' : 'bg-blue-50';
    const borderColor = variant === 'warning' ? 'border-yellow-200' : variant === 'success' ? 'border-green-200' : 'border-blue-200';
    const iconColor = variant === 'warning' ? 'text-yellow-600' : variant === 'success' ? 'text-green-600' : 'text-blue-600';
    
    return (
      <div className={`${bgColor} ${borderColor} border rounded-lg p-4 mb-4`}>
        <div className="flex items-start gap-3">
          <Info className={`h-5 w-5 ${iconColor} mt-0.5 flex-shrink-0`} />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
            <div className="text-sm text-gray-700">{children}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderOverviewSection = () => (
    <div className="space-y-6">
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Shield className="h-5 w-5" />
            What is U2F / FIDO2?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            A modern authentication method where users must touch a physical security key (USB/NFC/Bluetooth) during login to complete access.
          </p>
          <InfoCard title="CONSEQUENCES:" variant="info">
            <p><strong>Security Impact:</strong> Eliminates phishing attacks, session hijacking, and password-based breaches.</p>
            <p><strong>User Experience:</strong> Requires physical hardware key for every login - may slow down access but drastically improves security.</p>
            <p><strong>Cost Consideration:</strong> Users must purchase compatible hardware keys ($20-50 each).</p>
          </InfoCard>
        </CardContent>
      </Card>

      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <ShieldCheck className="h-5 w-5" />
            Why It's Important
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Phishing Protection</h4>
              <p className="text-sm text-gray-700">Even sophisticated phishing sites cannot bypass hardware keys</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Uncloneable</h4>
              <p className="text-sm text-gray-700">Physical keys cannot be duplicated or stolen remotely</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Zero Secrets</h4>
              <p className="text-sm text-gray-700">No shared secrets stored on servers that can be breached</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Clock className="h-5 w-5" />
            Enforcement Point
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Appears after username/password verification and before session starts. Prevents fake redirects or token abuse.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderRegistrationSection = () => (
    <div className="space-y-6">
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Key className="h-5 w-5" />
            User Hardware Key Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Supported Key Types:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['YubiKey', 'Google Titan', 'SoloKey', 'Feitian Bio'].map((key) => (
                  <Badge key={key} variant="secondary" className="justify-center py-2">
                    {key}
                  </Badge>
                ))}
              </div>
            </div>
            
            <InfoCard title="CONSEQUENCES:" variant="warning">
              <p><strong>User Responsibility:</strong> Users must purchase and maintain physical hardware keys.</p>
              <p><strong>Recovery Risk:</strong> Lost keys can lock users out - backup methods essential.</p>
              <p><strong>Device Compatibility:</strong> Requires modern browsers with WebAuthn support.</p>
            </InfoCard>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Registration Flow:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">1</div>
                  <span>User clicks "Register U2F Key" button</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">2</div>
                  <span>Browser prompts to insert & tap key</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">3</div>
                  <span>Key securely registered and associated with profile</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLoginFlowSection = () => (
    <div className="space-y-6">
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <ShieldCheck className="h-5 w-5" />
            User Login Flow with U2F Key
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
                <h4 className="font-semibold text-green-800 mb-1">Credentials</h4>
                <p className="text-xs text-gray-600">Email + Password</p>
                <Badge variant="default" className="mt-2 bg-green-100 text-green-800">✅ Verified</Badge>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
                <h4 className="font-semibold text-yellow-800 mb-1">U2F Prompt</h4>
                <p className="text-xs text-gray-600">Waiting for key</p>
                <Badge variant="secondary" className="mt-2 bg-yellow-100 text-yellow-800">🔄 Pending</Badge>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
                <h4 className="font-semibold text-blue-800 mb-1">Key Touch</h4>
                <p className="text-xs text-gray-600">Hardware verification</p>
                <Badge variant="default" className="mt-2 bg-blue-100 text-blue-800">🔐 Authenticated</Badge>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">4</div>
                <h4 className="font-semibold text-purple-800 mb-1">Session</h4>
                <p className="text-xs text-gray-600">Access granted</p>
                <Badge variant="default" className="mt-2 bg-purple-100 text-purple-800">✅ Active</Badge>
              </div>
            </div>

            <InfoCard title="CONSEQUENCES:" variant="warning">
              <p><strong>Timeout Risk:</strong> Users have 10-60 seconds to respond with hardware key.</p>
              <p><strong>Failure Impact:</strong> Failed key authentication denies login completely.</p>
              <p><strong>Device Dependency:</strong> Users must have their registered key present for every login.</p>
            </InfoCard>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdminControlsSection = () => (
    <div className="space-y-6">
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Settings className="h-5 w-5" />
            Admin Controls Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">U2F Enforcement</h4>
                    <p className="text-sm text-gray-600">Set requirement level</p>
                  </div>
                  <select className="border rounded px-3 py-2">
                    <option>Optional</option>
                    <option>Mandatory</option>
                    <option>Role-based</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Allow Backup Methods</h4>
                    <p className="text-sm text-gray-600">OTP app or email fallback</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Audit Logging</h4>
                    <p className="text-sm text-gray-600">Track key usage & attempts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Role Requirements</h4>
                  <div className="space-y-2">
                    {['Super Admin', 'Admin', 'Moderator', 'Premium User', 'Free User'].map((role) => (
                      <div key={role} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{role}</span>
                        <Switch defaultChecked={role.includes('Admin')} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <InfoCard title="CONSEQUENCES:" variant="info">
              <p><strong>Mandatory Enforcement:</strong> All affected users must register keys or lose access.</p>
              <p><strong>Role-based Requirements:</strong> Can create user experience fragmentation.</p>
              <p><strong>Backup Method Risks:</strong> Fallbacks may weaken overall security if compromised.</p>
            </InfoCard>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderIntegrationSection = () => (
    <div className="space-y-6">
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Database className="h-5 w-5" />
            Supabase + WebAuthn Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <h4 className="text-green-400 mb-2">// Database Schema</h4>
              <pre className="text-sm">
{`CREATE TABLE webauthn_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  key_label TEXT NOT NULL,
  credential_id TEXT UNIQUE NOT NULL,
  public_key TEXT NOT NULL,
  last_used_at TIMESTAMP WITH TIME ZONE,
  device_type TEXT CHECK (device_type IN ('USB', 'NFC', 'BLE')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
              </pre>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Client Library</h4>
                <p className="text-sm text-gray-700">@simplewebauthn/browser</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Server Library</h4>
                <p className="text-sm text-gray-700">@simplewebauthn/server</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Edge Functions</h4>
                <p className="text-sm text-gray-700">U2F verification & fallback</p>
              </div>
            </div>

            <InfoCard title="CONSEQUENCES:" variant="warning">
              <p><strong>Implementation Complexity:</strong> Requires WebAuthn protocol knowledge and careful key management.</p>
              <p><strong>Browser Support:</strong> Limited to modern browsers - may exclude some users.</p>
              <p><strong>Data Security:</strong> Credential storage must be encrypted and properly managed.</p>
            </InfoCard>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdvancedSection = () => (
    <div className="space-y-6">
      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Zap className="h-5 w-5" />
            Advanced Features (Super Pro Only)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="h-4 w-4 text-yellow-600" />
                  <h4 className="font-semibold text-yellow-800">Multi-Key Support</h4>
                </div>
                <p className="text-sm text-gray-700">Add multiple backup keys (home & office)</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <h4 className="font-semibold text-red-800">Key Lost Recovery</h4>
                </div>
                <p className="text-sm text-gray-700">Secure fallback with ID re-verification</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="h-4 w-4 text-green-600" />
                  <h4 className="font-semibold text-green-800">Mobile U2F Support</h4>
                </div>
                <p className="text-sm text-gray-700">NFC key support on iOS & Android</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Signed Session Tokens</h4>
                </div>
                <p className="text-sm text-gray-700">Cryptographically tied to key signature</p>
              </div>
            </div>

            <InfoCard title="CONSEQUENCES:" variant="info">
              <p><strong>Feature Complexity:</strong> Advanced features increase implementation and support complexity.</p>
              <p><strong>User Training:</strong> Multiple keys and recovery flows require user education.</p>
              <p><strong>Cost Impact:</strong> Advanced features may increase infrastructure and support costs.</p>
            </InfoCard>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalyticsSection = () => (
    <div className="space-y-6">
      <Card className="border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <BarChart3 className="h-5 w-5" />
            Admin Panel Analytics View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg text-center">
                <h4 className="text-2xl font-bold text-indigo-800">1,285</h4>
                <p className="text-sm text-gray-600">U2F-enabled Users</p>
                <Badge variant="default" className="mt-1 bg-green-100 text-green-800">✅ Active</Badge>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h4 className="text-2xl font-bold text-blue-800">2,147</h4>
                <p className="text-sm text-gray-600">Keys Registered</p>
                <Badge variant="secondary" className="mt-1">📊 Growing</Badge>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h4 className="text-2xl font-bold text-green-800">423</h4>
                <p className="text-sm text-gray-600">Daily U2F Auths</p>
                <Badge variant="default" className="mt-1 bg-blue-100 text-blue-800">🔐 Secure</Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <h4 className="text-2xl font-bold text-yellow-800">6</h4>
                <p className="text-sm text-gray-600">Failed Attempts (7d)</p>
                <Badge variant="outline" className="mt-1 border-yellow-600 text-yellow-800">⚠️ Monitor</Badge>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <h4 className="text-2xl font-bold text-purple-800">1.7</h4>
                <p className="text-sm text-gray-600">Devices per User (avg)</p>
                <Badge variant="secondary" className="mt-1">📱 Optimal</Badge>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <h4 className="text-2xl font-bold text-red-800">12</h4>
                <p className="text-sm text-gray-600">Lost Key Recovery Cases</p>
                <Badge variant="outline" className="mt-1 border-red-600 text-red-800">🆘 Support</Badge>
              </div>
            </div>

            <InfoCard title="CONSEQUENCES:" variant="success">
              <p><strong>Monitoring Benefits:</strong> Real-time visibility into U2F adoption and security incidents.</p>
              <p><strong>Support Insights:</strong> Track common issues like lost keys and failed authentications.</p>
              <p><strong>Security Intelligence:</strong> Identify patterns in authentication failures and potential attacks.</p>
            </InfoCard>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview': return renderOverviewSection();
      case 'registration': return renderRegistrationSection();
      case 'login-flow': return renderLoginFlowSection();
      case 'admin-controls': return renderAdminControlsSection();
      case 'integration': return renderIntegrationSection();
      case 'advanced': return renderAdvancedSection();
      case 'analytics': return renderAnalyticsSection();
      default: return renderOverviewSection();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🔐 U2F Hardware Login Keys</h1>
          <p className="text-gray-600 mt-1">FIDO2 / U2F Hardware Key Authentication Enforcement</p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-lg border">
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
              <Icon className="h-4 w-4" />
              {section.label}
            </Button>
          );
        })}
      </div>

      {/* Active Section Content */}
      <div className="min-h-[400px]">
        {renderActiveSection()}
      </div>
    </div>
  );
};

export default U2FHardwareKeys;