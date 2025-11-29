import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  Lock, 
  UserX, 
  Activity,
  ExternalLink,
  MapPin,
  Clock,
  Ban
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface SecurityMetrics {
  suspiciousLogins: number;
  blockedLogins: number;
  rateLimitedUsers: number;
  bannedUsers: number;
  securityAlerts: Array<{
    id: string;
    type: 'suspicious' | 'blocked' | 'banned' | 'rate-limited';
    message: string;
    timestamp: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
}

const threatData = [
  { time: '00:00', suspicious: 2, blocked: 5, rateLimited: 1 },
  { time: '04:00', suspicious: 1, blocked: 3, rateLimited: 2 },
  { time: '08:00', suspicious: 8, blocked: 12, rateLimited: 4 },
  { time: '12:00', suspicious: 15, blocked: 8, rateLimited: 6 },
  { time: '16:00', suspicious: 12, blocked: 10, rateLimited: 3 },
  { time: '20:00', suspicious: 6, blocked: 7, rateLimited: 2 }
];

const geoThreatData = [
  { country: 'Unknown/VPN', attempts: 45, blocked: 42 },
  { country: 'Russia', attempts: 23, blocked: 23 },
  { country: 'China', attempts: 18, blocked: 16 },
  { country: 'Brazil', attempts: 12, blocked: 8 },
  { country: 'India', attempts: 9, blocked: 4 }
];

const SecurityDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    suspiciousLogins: 23,
    blockedLogins: 67,
    rateLimitedUsers: 12,
    bannedUsers: 8,
    securityAlerts: [
      {
        id: '1',
        type: 'suspicious',
        message: 'Multiple login attempts from different countries for user @john_doe',
        timestamp: '2 minutes ago',
        severity: 'high'
      },
      {
        id: '2',
        type: 'blocked',
        message: 'IP 192.168.1.100 blocked after 5 failed login attempts',
        timestamp: '15 minutes ago',
        severity: 'medium'
      },
      {
        id: '3',
        type: 'rate-limited',
        message: 'API rate limit exceeded for user @api_user_123',
        timestamp: '32 minutes ago',
        severity: 'low'
      },
      {
        id: '4',
        type: 'banned',
        message: 'User account @spam_bot_456 permanently banned for policy violation',
        timestamp: '1 hour ago',
        severity: 'critical'
      }
    ]
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        suspiciousLogins: prev.suspiciousLogins + (Math.random() > 0.8 ? 1 : 0),
        blockedLogins: prev.blockedLogins + (Math.random() > 0.9 ? 1 : 0),
        rateLimitedUsers: prev.rateLimitedUsers + (Math.random() > 0.85 ? 1 : 0)
      }));
    }, 20000); // Update every 20 seconds

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'suspicious': return <AlertTriangle className="h-4 w-4" />;
      case 'blocked': return <Lock className="h-4 w-4" />;
      case 'banned': return <UserX className="h-4 w-4" />;
      case 'rate-limited': return <Activity className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const handleOpenSecurityLogs = () => {
    console.log('Opening security logs dashboard...');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">🔐 Security Snapshot</h1>
          <p className="text-muted-foreground">Real-time security monitoring and threat detection</p>
        </div>
        <Button 
          onClick={handleOpenSecurityLogs}
          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
        >
          🛡️ Open Security Logs
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Suspicious Logins</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">{metrics.suspiciousLogins}</div>
            <p className="text-xs text-orange-600 mt-1">
              Detected in last 24h
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Blocked Logins</CardTitle>
            <Lock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">{metrics.blockedLogins}</div>
            <p className="text-xs text-red-600 mt-1">
              Failed attempts blocked
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Rate Limited</CardTitle>
            <Activity className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800">{metrics.rateLimitedUsers}</div>
            <p className="text-xs text-yellow-600 mt-1">
              Users rate limited
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Banned Users</CardTitle>
            <UserX className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">{metrics.bannedUsers}</div>
            <p className="text-xs text-purple-600 mt-1">
              This week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Threat Timeline</CardTitle>
            <CardDescription>24-hour security event monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={threatData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="suspicious" stackId="1" stroke="#F59E0B" fill="#FEF3C7" />
                <Area type="monotone" dataKey="blocked" stackId="1" stroke="#EF4444" fill="#FEE2E2" />
                <Area type="monotone" dataKey="rateLimited" stackId="1" stroke="#8B5CF6" fill="#F3E8FF" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Threats</CardTitle>
            <CardDescription>Login attempts by country/region</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={geoThreatData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="country" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="attempts" fill="#F59E0B" name="Attempts" />
                <Bar dataKey="blocked" fill="#EF4444" name="Blocked" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-red-600" />
            <span>Recent Security Alerts</span>
          </CardTitle>
          <CardDescription>Latest security events and threats detected</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.securityAlerts.map((alert) => (
              <Alert key={alert.id} className="border-l-4 border-l-red-500">
                <div className="flex items-start space-x-3">
                  {getTypeIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <AlertDescription className="font-medium">
                        {alert.message}
                      </AlertDescription>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{alert.timestamp}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>IP: 192.168.1.100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Security Actions</CardTitle>
          <CardDescription>Immediate security response tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <Ban className="mr-2 h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Ban IP Address</div>
                <div className="text-xs text-muted-foreground">Block suspicious IPs</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <UserX className="mr-2 h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Suspend Account</div>
                <div className="text-xs text-muted-foreground">Temporarily disable user</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <Activity className="mr-2 h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Reset Rate Limits</div>
                <div className="text-xs text-muted-foreground">Clear API restrictions</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <AlertTriangle className="mr-2 h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Security Scan</div>
                <div className="text-xs text-muted-foreground">Run vulnerability check</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;