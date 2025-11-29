
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Settings, UserCog, Crown } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { notificationManager } from '@/utils/notificationManager';
import { useSecureAdminAccess } from '@/hooks/admin/useSecureAdminAccess';

// AdminPortal interface removed - no longer using client-side portal management

const AdminAccessManager: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { hasAccess: hasAdminAccess, role: adminRole, loading, accessValidated } = useSecureAdminAccess();

  // Role configuration
  const roleConfig = {
    super_admin: {
      icon: <Crown className="h-5 w-5" />,
      color: '#E17B7B',
      background: '#fff8f8',
      title: 'Super Admin'
    },
    admin: {
      icon: <Settings className="h-5 w-5" />,
      color: '#dc2626',
      background: '#fef2f2',
      title: 'Admin'
    },
    moderator: {
      icon: <Shield className="h-5 w-5" />,
      color: '#2563eb',
      background: '#eff6ff',
      title: 'Moderator'
    },
    support: {
      icon: <UserCog className="h-5 w-5" />,
      color: '#059669',
      background: '#f0fdf4',
      title: 'Support'
    },
    developer: {
      icon: <Settings className="h-5 w-5" />,
      color: '#7c3aed',
      background: '#faf5ff',
      title: 'Developer'
    }
  };

  // Removed client-side admin access validation 
  // Now using secure server-side validation through useSecureAdminAccess hook

  const handleAdminAccess = () => {
    if (hasAdminAccess && accessValidated) {
      navigate('/admin/dashboard');
      notificationManager.showNotification(`Welcome to the admin dashboard, ${adminRole}!`, { tag: 'success' });
      notificationManager.playSound('success');
      console.log(`✅ Secure admin dashboard access granted for ${adminRole}: ${user?.id}`);
    } else {
      notificationManager.showNotification('You do not have admin privileges. Please contact an administrator.', { tag: 'error' });
      notificationManager.playSound('alert');
      console.warn(`🚫 Admin dashboard access denied for user: ${user?.id}`);
    }
  };

  // SECURITY: Demo admin access has been removed for security reasons
  // All admin roles must now be granted through secure database functions

  if (!user) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-amber-800">Please log in to check admin access.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Validating admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Status */}
      <div className={`p-4 rounded-lg border ${hasAdminAccess ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${hasAdminAccess ? 'bg-green-100' : 'bg-gray-100'}`}>
            {hasAdminAccess && adminRole ? 
              roleConfig[adminRole as keyof typeof roleConfig]?.icon || <Shield className="h-5 w-5" />
              : <Shield className="h-5 w-5 text-gray-400" />
            }
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {hasAdminAccess ? `${roleConfig[adminRole as keyof typeof roleConfig]?.title || 'Admin'} Access` : 'No Admin Access'}
            </h3>
            <p className="text-sm text-gray-600">
              {hasAdminAccess 
                ? `Secure access validated for ${adminRole}`
                : 'You do not have administrative privileges'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Access Button */}
      <div className="flex gap-3">
        <Button 
          onClick={handleAdminAccess}
          disabled={!hasAdminAccess}
          className={hasAdminAccess ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          <Shield className="h-4 w-4 mr-2" />
          Access Admin Dashboard
        </Button>

        {/* Security Notice for Non-Admin Users */}
        {!hasAdminAccess && (
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            <p className="font-medium">Security Notice</p>
            <p className="text-xs mt-1">
              Admin access is managed through database-level security functions. Contact your system administrator to request admin privileges.
            </p>
          </div>
        )}
      </div>

      {/* Security Status */}
      {hasAdminAccess && accessValidated && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">Security Status</h4>
          <div className="text-sm text-green-800">
            <p>✅ Admin access validated through secure database functions</p>
            <p>✅ Role-based access control enforced</p>
            <p>✅ All actions logged for audit trail</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccessManager;
