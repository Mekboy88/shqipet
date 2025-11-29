import React from 'react';
import { DynamicTokenSecurityDashboard } from '@/components/security/DynamicTokenSecurityDashboard';
import { RealTimeSecurityMonitor } from '@/components/admin/security/RealTimeSecurityMonitor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, Lock, Smartphone, AlertTriangle, CheckCircle } from 'lucide-react';

const SecurityDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Dynamic Token Security System
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced role-based token lifetime management with device fingerprinting and MFA integration
          </p>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="text-center">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Dynamic Lifetimes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Token expiry adapts based on user role and device trust level
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Smartphone className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Device Trust</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Advanced fingerprinting detects new devices and adjusts security
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Lock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Smart MFA</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                MFA required automatically for high-risk scenarios
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Role Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Admin roles get shorter lifetimes for enhanced security
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Token Lifetime Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Token Lifetime Rules
            </CardTitle>
            <CardDescription>
              How token expiry times are calculated based on role and device status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Role</th>
                    <th className="text-left p-3">New Device</th>
                    <th className="text-left p-3">Trusted Device</th>
                    <th className="text-left p-3">MFA Required</th>
                    <th className="text-left p-3">Security Level</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3">
                      <Badge variant="destructive">Super Admin</Badge>
                    </td>
                    <td className="p-3">10 minutes</td>
                    <td className="p-3">15 minutes</td>
                    <td className="p-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </td>
                    <td className="p-3">
                      <Badge className="bg-red-500">Critical</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">
                      <Badge className="bg-orange-500">Admin</Badge>
                    </td>
                    <td className="p-3">15 minutes</td>
                    <td className="p-3">30 minutes</td>
                    <td className="p-3">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    </td>
                    <td className="p-3">
                      <Badge className="bg-orange-500">High</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">
                      <Badge className="bg-blue-500">Moderator</Badge>
                    </td>
                    <td className="p-3">20 minutes</td>
                    <td className="p-3">30 minutes</td>
                    <td className="p-3">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    </td>
                    <td className="p-3">
                      <Badge className="bg-yellow-500">Medium</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">
                      <Badge variant="secondary">User</Badge>
                    </td>
                    <td className="p-3">20 minutes</td>
                    <td className="p-3">30 minutes</td>
                    <td className="p-3">-</td>
                    <td className="p-3">
                      <Badge className="bg-green-500">Low</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <Badge variant="outline">Guest</Badge>
                    </td>
                    <td className="p-3">5 minutes</td>
                    <td className="p-3">10 minutes</td>
                    <td className="p-3">-</td>
                    <td className="p-3">
                      <Badge className="bg-green-500">Low</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Live Security Dashboard */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Live Security Dashboard
          </h2>
          <DynamicTokenSecurityDashboard />
        </div>

        {/* Real-Time Security Monitor */}
        <div className="space-y-4">
          <RealTimeSecurityMonitor />
        </div>

        {/* Implementation Details */}
        <Card>
          <CardHeader>
            <CardTitle>Implementation Details</CardTitle>
            <CardDescription>
              Key features implemented in this dynamic token security system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600">✅ Implemented Features</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Role-based token lifetime calculation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Device fingerprinting and trust management
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Automatic MFA triggering for new devices
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Session analytics and security tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Real-time security monitoring dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Automatic token refresh scheduling
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-600">🔧 Technical Components</h4>
                <ul className="space-y-2 text-sm">
                  <li>• DynamicTokenManager service</li>
                  <li>• Session analytics database tables</li>
                  <li>• Device trust history tracking</li>
                  <li>• Secure database functions (RLS protected)</li>
                  <li>• Real-time security event logging</li>
                  <li>• React hooks for UI integration</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h5 className="font-semibold text-blue-800 mb-2">Security Benefits</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Reduces exposure time for compromised tokens</li>
                <li>• Adaptive security based on user privilege level</li>
                <li>• Automatic detection and response to suspicious activity</li>
                <li>• Comprehensive audit trail for security analysis</li>
                <li>• Zero-trust approach for new devices</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityDemoPage;