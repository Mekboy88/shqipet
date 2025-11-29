import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Clock, 
  Smartphone, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  RefreshCw,
  Eye,
  Timer,
  Lock
} from 'lucide-react';
import { useDynamicTokenSecurity } from '@/hooks/useDynamicTokenSecurity';
import { toast } from 'sonner';

export const DynamicTokenSecurityDashboard: React.FC = () => {
  const {
    securityStatus,
    trustCurrentDevice,
    getSecurityAnalytics,
    forceTokenRefresh,
    getFormattedTimeRemaining,
    clearMFARequirement
  } = useDynamicTokenSecurity();

  const [analytics, setAnalytics] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const data = await getSecurityAnalytics();
    setAnalytics(data);
  };

  const handleTrustDevice = async () => {
    const success = await trustCurrentDevice();
    if (success) {
      loadAnalytics(); // Refresh analytics
    }
  };

  const handleRefreshToken = async () => {
    await forceTokenRefresh();
    toast.info('Token refresh initiated');
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDeviceStatusIcon = (status: string) => {
    switch (status) {
      case 'trusted': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'new': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'untrusted': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getProgressPercentage = () => {
    if (!securityStatus.tokenConfig) return 0;
    const totalSeconds = securityStatus.tokenConfig.lifetimeMinutes * 60;
    const remainingSeconds = securityStatus.timeUntilRefresh;
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  };

  if (securityStatus.loading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading security information...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Main Security Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <CardTitle>Dynamic Token Security</CardTitle>
            </div>
            <Badge variant="outline" className={`${getSecurityLevelColor(securityStatus.securityLevel)} text-white`}>
              {securityStatus.securityLevel.toUpperCase()}
            </Badge>
          </div>
          <CardDescription>
            Real-time session security monitoring with dynamic token lifetime management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* MFA Required Alert */}
          {securityStatus.mfaRequired && (
            <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold text-orange-800">MFA Verification Required</h4>
              </div>
              <p className="text-orange-700 text-sm mb-3">
                Multi-factor authentication is required for this session due to: {securityStatus.mfaReason}
              </p>
              <Button 
                size="sm" 
                onClick={clearMFARequirement}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Complete MFA Verification
              </Button>
            </div>
          )}

          {/* Token Lifetime Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4" />
                <span className="font-medium">Token Expiry</span>
              </div>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {getFormattedTimeRemaining()}
              </span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Session started</span>
              <span>{securityStatus.tokenConfig?.lifetimeMinutes} min total</span>
            </div>
          </div>

          <Separator />

          {/* Security Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Device Trust Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <span className="text-sm font-medium">Device Status</span>
              </div>
              <div className="flex items-center gap-2">
                {getDeviceStatusIcon(securityStatus.deviceTrustStatus)}
                <span className="text-sm capitalize">{securityStatus.deviceTrustStatus}</span>
              </div>
              {securityStatus.deviceTrustStatus === 'new' && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleTrustDevice}
                  className="w-full mt-2"
                >
                  Trust This Device
                </Button>
              )}
            </div>

            {/* Role & Permissions */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Role</span>
              </div>
              <Badge variant="secondary">
                {securityStatus.tokenConfig?.role || 'Unknown'}
              </Badge>
              {securityStatus.tokenConfig?.requiresMFA && (
                <div className="text-xs text-orange-600">MFA Required</div>
              )}
            </div>

            {/* Session Actions */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm font-medium">Actions</span>
              </div>
              <div className="space-y-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleRefreshToken}
                  className="w-full"
                >
                  Refresh Token
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {showDetails ? 'Hide' : 'Show'} Details
                </Button>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          {showDetails && securityStatus.tokenConfig && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold">Session Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Token Lifetime:</span>
                    <div className="font-mono">{securityStatus.tokenConfig.lifetimeMinutes} minutes</div>
                  </div>
                  <div>
                    <span className="text-gray-500">New Device:</span>
                    <div>{securityStatus.tokenConfig.isNewDevice ? 'Yes' : 'No'}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Device Trusted:</span>
                    <div>{securityStatus.tokenConfig.isDeviceTrusted ? 'Yes' : 'No'}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">MFA Required:</span>
                    <div>{securityStatus.tokenConfig.requiresMFA ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Analytics Card */}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Security Analytics
            </CardTitle>
            <CardDescription>
              Historical security metrics for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Total Sessions:</span>
                <div className="font-semibold">{analytics.totalSessions}</div>
              </div>
              <div>
                <span className="text-gray-500">Avg Token Lifetime:</span>
                <div className="font-semibold">{Math.round(analytics.avgTokenLifetime)} min</div>
              </div>
              <div>
                <span className="text-gray-500">New Device %:</span>
                <div className="font-semibold">{Math.round(analytics.newDevicePercentage)}%</div>
              </div>
              <div>
                <span className="text-gray-500">MFA Required %:</span>
                <div className="font-semibold">{Math.round(analytics.mfaRequiredPercentage)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};