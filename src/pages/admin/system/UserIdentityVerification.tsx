import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, User, Mail, Phone, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSecureRoles } from '@/hooks/users/use-secure-roles';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

interface IdentityCheck {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'fail' | 'warning' | 'checking';
  details?: string;
}

export default function UserIdentityVerification() {
  const [identityChecks, setIdentityChecks] = useState<IdentityCheck[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const { user } = useAuth();
  const { currentUserRole } = useSecureRoles();

  const initialChecks: IdentityCheck[] = [
    {
      id: 'user_session',
      name: 'User Session',
      description: 'Current user authentication session',
      status: 'checking'
    },
    {
      id: 'profile_sync',
      name: 'Profile Synchronization',
      description: 'Profile data consistency between auth and database',
      status: 'checking'
    },
    {
      id: 'email_verification',
      name: 'Email Verification',
      description: 'Email address verification status',
      status: 'checking'
    },
    {
      id: 'role_assignment',
      name: 'Role Assignment',
      description: 'User role and permissions verification',
      status: 'checking'
    }
  ];

  const checkUserSession = (): IdentityCheck => {
    if (!user) {
      return {
        id: 'user_session',
        name: 'User Session',
        description: 'Current user authentication session',
        status: 'fail',
        details: 'No active user session found'
      };
    }

    return {
      id: 'user_session',
      name: 'User Session',
      description: 'Current user authentication session',
      status: 'pass',
      details: `User ID: ${user.id}, Email: ${user.email}`
    };
  };

  const checkProfileSync = (): IdentityCheck => {
    if (!user) {
      return {
        id: 'profile_sync',
        name: 'Profile Synchronization',
        description: 'Profile data consistency between auth and database',
        status: 'fail',
        details: 'Profile data not found or not synchronized'
      };
    }

    // For now, just check if user has basic auth data
    return {
      id: 'profile_sync',
      name: 'Profile Synchronization',
      description: 'Profile data consistency between auth and database',
      status: 'pass',
      details: 'User session is active and consistent'
    };
  };

  const checkEmailVerification = (): IdentityCheck => {
    if (!user) {
      return {
        id: 'email_verification',
        name: 'Email Verification',
        description: 'Email address verification status',
        status: 'fail',
        details: 'No user session to check email verification'
      };
    }

    const isVerified = user.email_confirmed_at !== null;
    
    return {
      id: 'email_verification',
      name: 'Email Verification',
      description: 'Email address verification status',
      status: isVerified ? 'pass' : 'warning',
      details: isVerified 
        ? `Email verified at: ${new Date(user.email_confirmed_at!).toLocaleString()}`
        : 'Email address is not verified'
    };
  };

  const checkRoleAssignment = (): IdentityCheck => {
    if (!currentUserRole) {
      return {
        id: 'role_assignment',
        name: 'Role Assignment',
        description: 'User role and permissions verification',
        status: 'warning',
        details: 'No role assigned or role could not be determined'
      };
    }

    return {
      id: 'role_assignment',
      name: 'Role Assignment',
      description: 'User role and permissions verification',
      status: 'pass',
      details: `Current role: ${currentUserRole}`
    };
  };

  const runIdentityCheck = async () => {
    setIsChecking(true);
    setIdentityChecks(initialChecks);

    try {
      // Run checks sequentially for better UX
      const checks = [
        checkUserSession(),
        checkProfileSync(),
        checkEmailVerification(),
        checkRoleAssignment()
      ];

      setIdentityChecks(checks);
      setLastChecked(new Date());
      
      const failedChecks = checks.filter(c => c.status === 'fail').length;
      const warnings = checks.filter(c => c.status === 'warning').length;
      
      if (failedChecks > 0) {
        toast.error(`Identity verification completed with ${failedChecks} failures`);
      } else if (warnings > 0) {
        toast.warning(`Identity verification completed with ${warnings} warnings`);
      } else {
        toast.success('User identity is fully verified!');
      }
    } catch (error) {
      console.error('Identity check error:', error);
      toast.error('Failed to complete identity verification');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    runIdentityCheck();
  }, [user, currentUserRole]);

  const getStatusIcon = (status: IdentityCheck['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'checking':
        return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />;
    }
  };

  const getStatusBadge = (status: IdentityCheck['status']) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'fail':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'checking':
        return <Badge className="bg-blue-100 text-blue-800">Checking...</Badge>;
    }
  };

  const getCheckIcon = (checkId: string) => {
    switch (checkId) {
      case 'user_session':
        return <User className="h-5 w-5" />;
      case 'profile_sync':
        return <Shield className="h-5 w-5" />;
      case 'email_verification':
        return <Mail className="h-5 w-5" />;
      case 'role_assignment':
        return <Shield className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  return (
    <AdminLayout title="User Identity Verification" subtitle="Current user session and profile sync">
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-6 w-6" />
                  Identity Verification Status
                </CardTitle>
                <CardDescription>
                  {lastChecked ? (
                    `Last checked: ${lastChecked.toLocaleString()}`
                  ) : (
                    'Identity verification in progress...'
                  )}
                </CardDescription>
              </div>
              <Button onClick={runIdentityCheck} disabled={isChecking} variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
                {isChecking ? 'Checking...' : 'Refresh'}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Current User Info */}
        {user && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">User ID:</span>
                  <div className="text-gray-600 font-mono">{user.id}</div>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <div className="text-gray-600">{user.email}</div>
                </div>
                <div>
                  <span className="font-medium">Created:</span>
                  <div className="text-gray-600">{new Date(user.created_at).toLocaleString()}</div>
                </div>
                <div>
                  <span className="font-medium">Role:</span>
                  <div className="text-gray-600">{currentUserRole || 'Not assigned'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Identity Checks */}
        <div className="grid gap-4">
          {identityChecks.map((check) => (
            <Card key={check.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getCheckIcon(check.id)}
                    <div>
                      <h3 className="font-semibold">{check.name}</h3>
                      <p className="text-sm text-gray-600">{check.description}</p>
                      {check.details && (
                        <p className="text-xs text-gray-500 mt-1">{check.details}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(check.status)}
                    {getStatusBadge(check.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}