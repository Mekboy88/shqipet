
import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/user';
import { SectionTitle } from './SectionTitle';
import { toast } from 'sonner';
import { useSecureRoles } from '@/hooks/users/use-secure-roles';
import { supabase } from '@/integrations/supabase/client';
import { PermissionStatusDisplay } from './permission-components/PermissionStatusDisplay';
import { UserRoleDisplay } from './permission-components/UserRoleDisplay';
import { PasswordVerificationDialog } from './permission-components/PasswordVerificationDialog';
import { GrantRoleButton } from './permission-components/GrantRoleButton';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle } from 'lucide-react';

interface SecureUserPermissionsSectionProps {
  user: UserProfile;
  onRoleChange: (userId: string, role: string) => Promise<void>;
  isDarkTheme: boolean;
}

export function SecureUserPermissionsSection({ user, onRoleChange, isDarkTheme }: SecureUserPermissionsSectionProps) {
  const { 
    currentUserRole, 
    loading, 
    isSuperAdmin, 
    isAdmin, 
    grantRole, 
    revokeRole, 
    getUserRoles,
    canManageRole 
  } = useSecureRoles();
  
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [targetRole, setTargetRole] = useState<string>('');

  useEffect(() => {
    const getCurrentUserInfo = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session?.user) {
          setCurrentUserEmail(sessionData.session.user.email || '');
        }
      } catch (error) {
        console.error('Error fetching current user info:', error);
      }
    };
    
    getCurrentUserInfo();
  }, []);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (user.user_id) {
        const roles = await getUserRoles(user.user_id);
        setUserRoles(roles.map(r => r.role));
      }
    };
    
    fetchUserRoles();
  }, [user.user_id, getUserRoles]);

  const handlePasswordVerification = async () => {
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setIsVerifying(true);
    
    try {
      // Verify password by attempting to sign in
      const { error } = await supabase.auth.signInWithPassword({
        email: currentUserEmail,
        password: password,
      });

      if (error) {
        toast.error('Incorrect password. Please try again.');
        setPassword('');
        return;
      }

      // Password verified successfully
      setShowPasswordPrompt(false);
      setPassword('');
      
      // Proceed with role granting/revoking
      await handleRoleAction();
      
    } catch (error) {
      console.error('Password verification error:', error);
      toast.error('Password verification failed');
      setPassword('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRoleAction = async () => {
    if (!targetRole || !user.user_id) return;

    try {
      const hasRole = userRoles.includes(targetRole);
      let success = false;

      if (hasRole) {
        // Revoke role
        success = await revokeRole(user.user_id, targetRole);
      } else {
        // Grant role
        success = await grantRole(user.user_id, targetRole);
      }

      if (success) {
        // Refresh user roles
        const roles = await getUserRoles(user.user_id);
        setUserRoles(roles.map(r => r.role));
        
        // Call the parent callback
        await onRoleChange(user.user_id, targetRole);
        
        toast.success(`Role ${hasRole ? 'revoked' : 'granted'} successfully`);
      }
    } catch (error) {
      console.error('Error in role action:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleGrantRoleClick = (role: string) => {
    if (!canManageRole(currentUserRole, role)) {
      toast.error('You do not have permission to manage this role');
      return;
    }

    setTargetRole(role);
    setShowPasswordPrompt(true);
  };

  const handlePasswordPromptClose = () => {
    setShowPasswordPrompt(false);
    setPassword('');
    setTargetRole('');
  };

  // Styling variables
  const cardBg = isDarkTheme ? 'bg-white/5' : 'bg-[#F5F2E8]';
  const labelColor = isDarkTheme ? 'text-[#C7C7CC]' : 'text-[#8B7355]';

  if (loading) {
    return (
      <div>
        <SectionTitle isDarkTheme={isDarkTheme}>🔐 Secure User Permissions</SectionTitle>
        <div className={`${cardBg} rounded-lg p-4 space-y-4`}>
          <div className="flex justify-between items-center">
            <p className={`${labelColor} text-sm font-sans`}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const isTargetUserProtected = userRoles.includes('super_admin');
  const canGrantRoles = isSuperAdmin || isAdmin;

  return (
    <>
      <div>
        <SectionTitle isDarkTheme={isDarkTheme}>🔐 Secure User Permissions</SectionTitle>
        <div className={`${cardBg} rounded-lg p-4 space-y-4`}>
          
          {/* Current User Status */}
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-blue-500" />
            <span className={`${labelColor} text-sm`}>
              Your Role: <strong className="text-blue-600">{currentUserRole}</strong>
            </span>
          </div>

          {/* Target User Roles */}
          <div className="space-y-2">
            <p className={`${labelColor} text-sm font-sans`}>User Roles:</p>
            <div className="flex flex-wrap gap-2">
              {userRoles.length > 0 ? (
                userRoles.map(role => (
                  <span key={role} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {role}
                  </span>
                ))
              ) : (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  user (default)
                </span>
              )}
            </div>
          </div>

          {/* Security Warning for Protected Users */}
          {isTargetUserProtected && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-yellow-800 text-sm">
                This user has super admin privileges. Exercise extreme caution.
              </span>
            </div>
          )}

          {/* Role Management Buttons */}
          {canGrantRoles && !isTargetUserProtected && (
            <div className="space-y-2">
              <p className={`${labelColor} text-sm font-sans`}>Manage Roles:</p>
              <div className="flex flex-wrap gap-2">
                {['admin', 'moderator'].map(role => (
                  <Button
                    key={role}
                    size="sm"
                    variant={userRoles.includes(role) ? "destructive" : "default"}
                    onClick={() => handleGrantRoleClick(role)}
                    disabled={!canManageRole(currentUserRole, role)}
                    className="text-xs"
                  >
                    {userRoles.includes(role) ? `Revoke ${role}` : `Grant ${role}`}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Permissions Summary */}
          <div className={`${labelColor} text-xs space-y-1`}>
            <p>• Only super admins can grant/revoke roles</p>
            <p>• All role changes are logged for security</p>
            <p>• Password verification required for role changes</p>
          </div>
        </div>
      </div>

      <PasswordVerificationDialog
        isOpen={showPasswordPrompt}
        onClose={handlePasswordPromptClose}
        currentUserEmail={currentUserEmail}
        password={password}
        setPassword={setPassword}
        onVerify={handlePasswordVerification}
        isVerifying={isVerifying}
      />
    </>
  );
}
