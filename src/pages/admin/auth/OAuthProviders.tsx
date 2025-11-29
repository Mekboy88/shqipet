import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Info, Settings, Eye, Trash2, Plus, AlertTriangle, CheckCircle, XCircle, TrendingUp, Globe, Smartphone, Monitor, Shield, Key, Activity, BarChart3 } from 'lucide-react';

const OAuthProviders: React.FC = () => {
  const [activeSection, setActiveSection] = useState(1);

  const sections = [
    { id: 1, title: "Overview Summary", icon: BarChart3 },
    { id: 2, title: "Provider List", icon: Globe },
    { id: 3, title: "Configuration", icon: Settings },
    { id: 4, title: "Region & Device", icon: Smartphone },
    { id: 5, title: "Login Logs", icon: Activity },
    { id: 6, title: "Developer Tools", icon: Key },
    { id: 7, title: "Analytics", icon: TrendingUp },
    { id: 8, title: "API Management", icon: Shield }
  ];

  const providerData = [
    { name: 'Google', status: 'active', platforms: ['Web', 'iOS', 'Android'], clientValid: true, failures: 1, logo: '🔴' },
    { name: 'Apple', status: 'active', platforms: ['iOS'], clientValid: true, failures: 0, logo: '🍏' },
    { name: 'Facebook', status: 'active', platforms: ['Web', 'Android'], clientValid: false, failures: 12, logo: '🔵' },
    { name: 'Instagram', status: 'inactive', platforms: [], clientValid: false, failures: 0, logo: '📷' }
  ];

  const loginLogs = [
    { user: 'David Influencer', provider: 'Google', timestamp: '2025-07-25 14:22', ip: '82.34.xxx.xxx', device: 'iPhone 14', status: 'success' },
    { user: 'Elira Artist', provider: 'Facebook', timestamp: '2025-07-25 11:03', ip: '185.xxx.xx.xx', device: 'Chrome MacOS', status: 'failed' },
    { user: 'Alex CEO', provider: 'Apple', timestamp: '2025-07-24 20:17', ip: '77.55.xxx.xx', device: 'Safari iOS', status: 'success' }
  ];

  const renderOverviewSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Info className="w-4 h-4 text-primary" />
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-destructive">CONSEQUENCES:</span> OAuth provider health directly impacts user login success rates and platform trust
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active OAuth Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 / 4</div>
            <p className="text-xs text-muted-foreground">Google, Apple, Facebook enabled</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Login Split</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-sm">Google: 48%</div>
              <div className="text-sm">Apple: 33%</div>
              <div className="text-sm">Facebook: 19%</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">OAuth Session Failures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">13</div>
            <p className="text-xs text-muted-foreground">Failed redirects today</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-xs">🧠</span>
            </div>
            <span className="font-medium">Smart Suggestion:</span>
            <span className="text-sm">Facebook usage dropped 60% this week, consider hiding it from login options.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProviderListSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Info className="w-4 h-4 text-primary" />
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-destructive">CONSEQUENCES:</span> Disabled providers block user access, while misconfigured ones cause authentication failures
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            OAuth Provider Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Platform Scope</TableHead>
                <TableHead>Client ID Valid</TableHead>
                <TableHead>Failures Today</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providerData.map((provider, index) => (
                <TableRow key={index}>
                  <TableCell className="flex items-center gap-2">
                    <span className="text-lg">{provider.logo}</span>
                    <span className="font-medium">{provider.name}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={provider.status === 'active' ? 'default' : 'secondary'}>
                      {provider.status === 'active' ? '✅ On' : '❌ Off'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {provider.platforms.map((platform, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {provider.clientValid ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">✅ Yes</Badge>
                    ) : (
                      <Badge variant="destructive">❗ Expiring Soon</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={provider.failures > 5 ? 'text-destructive font-bold' : ''}>{provider.failures}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl hover:scale-105"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 border border-emerald-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl hover:scale-105"
                      >
                        <Settings className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-gradient-to-r from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200 text-rose-700 border border-rose-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl hover:scale-105"
                      >
                        <Trash2 className="w-3 h-3" />
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

  const renderConfigurationSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Info className="w-4 h-4 text-primary" />
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-destructive">CONSEQUENCES:</span> Incorrect OAuth configuration can expose user data or break authentication flows
        </div>
      </div>

      {/* Environment Separation */}
      <Card className="border-l-4 border-l-indigo-500">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            📁 Environment Separation
            <Badge variant="outline" className="ml-auto">DEV | STAGING | PROD</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button 
              size="sm" 
              variant="default"
              className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl hover:scale-105 font-medium"
            >
              Development
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 border border-amber-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl hover:scale-105 font-medium"
            >
              Staging
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="bg-gradient-to-r from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 text-cyan-700 border border-cyan-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl hover:scale-105 font-medium"
            >
              Production
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Separate OAuth credentials per environment prevent dev/prod credential mix-ups
          </div>
        </CardContent>
      </Card>

      {/* OAuth Provider Key Rotation Log */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            🔒 OAuth Provider Key Rotation Log
            <Button 
              size="sm" 
              variant="outline" 
              className="ml-auto bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700 border border-indigo-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl hover:scale-105 font-medium"
            >
              View Full History
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Performed By</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Google</TableCell>
                <TableCell><Badge>Rotate Secret</Badge></TableCell>
                <TableCell>admin@shqipet.com</TableCell>
                <TableCell>2025-07-25 14:30</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Apple</TableCell>
                <TableCell><Badge variant="outline">Update Scopes</Badge></TableCell>
                <TableCell>admin@shqipet.com</TableCell>
                <TableCell>2025-07-24 09:15</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Scope Management Interface */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="text-lg">📦 Scope Management Interface (Per Provider)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-2">Google OAuth Scopes</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">✔ email</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">✔ profile</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">✖ calendar.readonly</span>
                  <Switch />
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-2">Apple OAuth Scopes</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">✔ email</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">✔ name</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credential Expiry Monitoring */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="text-lg">⚠️ Credential Expiry Monitoring with Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-800">Apple</span>
              </div>
              <div className="text-sm text-red-600">⚠ Expires in 4 days</div>
              <Button 
                size="sm" 
                variant="destructive" 
                className="mt-2 bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl hover:scale-105 font-medium"
              >
                🔁 Rotate Key
              </Button>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800">Google</span>
              </div>
              <div className="text-sm text-green-600">Valid for 26 days</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-800">Facebook</span>
              </div>
              <div className="text-sm text-gray-600">Inactive</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm">🔔 Admin Email Alert</span>
              <Switch />
            </div>
            <span className="text-xs text-muted-foreground">Alert when expiration &lt; 7 days</span>
          </div>
        </CardContent>
      </Card>

      {/* OAuth Usage Analytics */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="text-lg">📊 OAuth Usage Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">OAuth Usage (Last 30 Days)</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Google</span>
                  <span className="text-sm font-medium">71%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '71%' }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Apple</span>
                  <span className="text-sm font-medium">21%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '21%' }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Facebook</span>
                  <span className="text-sm font-medium">8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '8%' }}></div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Drop-off & Error Rates</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Click but don't finish</span>
                  <span className="text-sm text-red-600">12%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Invalid redirect URI</span>
                  <span className="text-sm text-red-600">3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Secret mismatch</span>
                  <span className="text-sm text-red-600">1%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provider Blocklist */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="text-lg">🚫 Blocklist Certain Providers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-2">Geographic Restrictions</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">🇪🇺 Block Facebook in EU</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">🇨🇳 Block Apple in China</span>
                  <Switch />
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-2">Regional Override</div>
              <div className="text-sm text-muted-foreground">
                Automatically hide/show providers based on user location and compliance requirements
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PKCE & Advanced Security */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="text-lg">🔐 PKCE & Proof-of-Token Handling (Advanced Security)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div>
              <div className="text-sm font-medium">Enable PKCE</div>
              <div className="text-xs text-muted-foreground">Protects against auth code injection on mobile clients</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium mb-1">ℹ️ Info Badge</div>
            <div className="text-xs text-muted-foreground">
              PKCE protects against auth code injection on mobile clients and is recommended for all OAuth flows.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI OAuth Risk Score */}
      <Card className="border-l-4 border-l-pink-500">
        <CardHeader>
          <CardTitle className="text-lg">🧠 AI OAuth Risk Score (Optional Elite Feature)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Risk Detected</span>
              </div>
              <div className="text-sm text-yellow-700">User logged in with 3 providers in 10 mins</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-800">Phishing Alert</span>
              </div>
              <div className="text-sm text-red-700">Cloned OAuth flow detected</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multi-Tenant Provider Scoping */}
      <Card className="border-l-4 border-l-cyan-500">
        <CardHeader>
          <CardTitle className="text-lg">👥 Multi-Tenant Provider Scoping</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg">
            <div className="font-medium mb-2">Tenant-Specific OAuth Config</div>
            <div className="text-sm text-muted-foreground mb-3">
              Different client IDs/secrets per tenant (org ID or domain)
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Google Client ID</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Enterprise Org</TableCell>
                  <TableCell>company.com</TableCell>
                  <TableCell>ent-xxx...xxx</TableCell>
                  <TableCell><Badge>Active</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>SMB Org</TableCell>
                  <TableCell>startup.io</TableCell>
                  <TableCell>smb-xxx...xxx</TableCell>
                  <TableCell><Badge variant="outline">Setup Required</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Bonus UI Enhancements */}
      <Card className="border-l-4 border-l-emerald-500">
        <CardHeader>
          <CardTitle className="text-lg">🧠 Bonus UI Enhancements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg">
              <div className="font-medium text-sm mb-1">👁 Field Tooltips</div>
              <div className="text-xs text-muted-foreground">Helps junior admins understand each config field</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-medium text-sm mb-1">📝 Test Button</div>
              <div className="text-xs text-muted-foreground">Verifies redirect flow & logs result next to each provider</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-medium text-sm mb-1">🔄 Sync with Provider</div>
              <div className="text-xs text-muted-foreground">Auto-fetch metadata (only if supported)</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-medium text-sm mb-1">🌍 Geo Visualization</div>
              <div className="text-xs text-muted-foreground">Map showing where OAuth logins happened</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-medium text-sm mb-1">✅ Verify Setup</div>
              <div className="text-xs text-muted-foreground">Show all passed validations with green checks</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-medium text-sm mb-1">🎯 Smart Suggestions</div>
              <div className="text-xs text-muted-foreground">AI-powered config optimization recommendations</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRegionDeviceSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Info className="w-4 h-4 text-primary" />
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-destructive">CONSEQUENCES:</span> Region locks can block legitimate users while demographic targeting affects user experience
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              🌍 Region Targeting Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="font-medium text-sm">Region Lock</div>
              <div className="text-xs text-muted-foreground">Only show Facebook login in Southeast Asia, hide in UK</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="font-medium text-sm">Language Match</div>
              <div className="text-xs text-muted-foreground">Auto-show providers that match device language</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="font-medium text-sm">Demographic Targeting</div>
              <div className="text-xs text-muted-foreground">Age 13–18 → Instagram; Age 30+ → Google/Apple</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              📱 Device Scope Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="font-medium text-sm">Device Scope</div>
              <div className="text-xs text-muted-foreground">Only show Apple on iOS devices</div>
            </div>
            <div className="p-3 bg-pink-50 rounded-lg">
              <div className="font-medium text-sm">Platform Detection</div>
              <div className="text-xs text-muted-foreground">Auto-detect mobile vs desktop capabilities</div>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <div className="font-medium text-sm">Browser Compatibility</div>
              <div className="text-xs text-muted-foreground">Hide unsupported OAuth methods</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderLoginLogsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Info className="w-4 h-4 text-primary" />
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-destructive">CONSEQUENCES:</span> Login logs contain sensitive user data and must be monitored for security breaches
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            OAuth Login Activity Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loginLogs.map((log, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.provider}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.timestamp}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.ip}</TableCell>
                  <TableCell className="text-sm">{log.device}</TableCell>
                  <TableCell>
                    {log.status === 'success' ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">✅ Success</Badge>
                    ) : (
                      <Badge variant="destructive">❌ Failed</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm">🔎 Filter by Provider</Button>
        <Button variant="outline" size="sm">🌍 Filter by Region</Button>
        <Button variant="outline" size="sm">📤 Export CSV</Button>
        <Button variant="outline" size="sm">🚨 View Suspicious Patterns</Button>
      </div>
    </div>
  );

  const renderDeveloperToolsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Info className="w-4 h-4 text-primary" />
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-destructive">CONSEQUENCES:</span> Developer tools access sensitive tokens and should only be used by authorized administrators
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              🔐 JWT Inspection Tool
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">View token payload generated from OAuth session</p>
            <Button variant="outline" className="w-full">Inspect Active Tokens</Button>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              🔄 Refresh Token Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Monitor token expiration and revocation status</p>
            <Button variant="outline" className="w-full">Check Token Health</Button>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              📡 Webhook Test Utility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Trigger manual post-login webhook for testing</p>
            <Button variant="outline" className="w-full">Test Webhooks</Button>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              🧠 Session Debugger
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Trace login flow from click → redirect → token → session</p>
            <Button variant="outline" className="w-full">Debug Session Flow</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAnalyticsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Info className="w-4 h-4 text-primary" />
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-destructive">CONSEQUENCES:</span> Analytics track user behavior patterns and must comply with privacy regulations
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            OAuth Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>This Week</TableHead>
                <TableHead>Last Week</TableHead>
                <TableHead>Δ Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Total OAuth Logins</TableCell>
                <TableCell>12,455</TableCell>
                <TableCell>10,784</TableCell>
                <TableCell className="text-green-600">+15.5% ↗️</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">OAuth Errors</TableCell>
                <TableCell>57</TableCell>
                <TableCell>44</TableCell>
                <TableCell className="text-red-600">+29.5% ↗️</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Token Refresh Failures</TableCell>
                <TableCell>3</TableCell>
                <TableCell>2</TableCell>
                <TableCell className="text-red-600">+50% ↗️</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Highest Performing Provider</TableCell>
                <TableCell>Google (48%)</TableCell>
                <TableCell>Google (52%)</TableCell>
                <TableCell className="text-red-600">▼ 4%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Drop-off at Consent Screen</TableCell>
                <TableCell>1.3%</TableCell>
                <TableCell>0.7%</TableCell>
                <TableCell className="text-red-600">+0.6% ↗️</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">🎓 OAuth Flow Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Internal documentation and best practices</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">🧠 AI Provider Suggestion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Auto-enable trending authentication methods</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">🧬 User Behavior Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Login button interaction patterns</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAPIManagementSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Info className="w-4 h-4 text-primary" />
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-destructive">CONSEQUENCES:</span> API key management affects authentication security and service availability
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              🔐 Supabase Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">auth.users Table</div>
              <div className="text-xs text-muted-foreground">Stores OAuth-linked user accounts</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">user_sessions Table</div>
              <div className="text-xs text-muted-foreground">Refresh tokens and session data</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">oauth_logs Table</div>
              <div className="text-xs text-muted-foreground">Custom login event tracking</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              🌐 Redirect URI Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="font-medium text-sm">Web Redirect</div>
              <div className="text-xs text-muted-foreground font-mono">https://yourapp.com/auth/callback</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="font-medium text-sm">iOS Deep Link</div>
              <div className="text-xs text-muted-foreground font-mono">yourapp://auth/callback</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="font-medium text-sm">Android Intent</div>
              <div className="text-xs text-muted-foreground font-mono">com.yourapp://auth/callback</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🧪 Edge Function Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-sm mb-2">Post-Login Logic</div>
              <div className="text-xs text-muted-foreground">Custom reward systems and user onboarding</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-sm mb-2">Analytics Webhook</div>
              <div className="text-xs text-muted-foreground">Send login events to external analytics</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-sm mb-2">Security Validation</div>
              <div className="text-xs text-muted-foreground">Additional fraud detection checks</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 1: return renderOverviewSection();
      case 2: return renderProviderListSection();
      case 3: return renderConfigurationSection();
      case 4: return renderRegionDeviceSection();
      case 5: return renderLoginLogsSection();
      case 6: return renderDeveloperToolsSection();
      case 7: return renderAnalyticsSection();
      case 8: return renderAPIManagementSection();
      default: return renderOverviewSection();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          🌐 OAuth Providers
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage OAuth login methods, security settings, and authentication analytics across all platforms
        </p>
      </div>

      <div className="flex flex-wrap gap-3 p-4 bg-card border border-border rounded-lg">
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
              <Icon className="w-4 h-4" />
              {section.title}
            </Button>
          );
        })}
      </div>

      <Card className="border-border">
        <CardContent className="p-6">
          {renderSection()}
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthProviders;