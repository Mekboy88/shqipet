
import React, { useState } from 'react';
import { UserProfile } from '@/types/user';
import { SectionTitle } from './SectionTitle';
import { toast } from 'sonner';
import { useSuperAdminCheck } from '@/hooks/users/use-super-admin-check';
import { useSecureRoles } from '@/hooks/users/use-secure-roles';
import { supabase } from '@/integrations/supabase/client';
import { FullPageRoleGranting } from '../FullPageRoleGranting';
import { PermissionStatusDisplay } from './permission-components/PermissionStatusDisplay';
import { UserRoleDisplay } from './permission-components/UserRoleDisplay';
import { PasswordVerificationDialog } from './permission-components/PasswordVerificationDialog';
import { GrantRoleButton } from './permission-components/GrantRoleButton';

interface UserPermissionsSectionProps {
  user: UserProfile;
  onRoleChange: (userId: string, role: string) => Promise<void>;
  isDarkTheme: boolean;
}

export function UserPermissionsSection({ user, onRoleChange, isDarkTheme }: UserPermissionsSectionProps) {
  const { superAdminExists, loading, refetch } = useSuperAdminCheck();
  const { currentUserRole, isSuperAdmin, isAdmin, getUserRoles } = useSecureRoles();
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [showFullPageRoleGranting, setShowFullPageRoleGranting] = useState(false);
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  React.useEffect(() => {
    const getCurrentUserInfo = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session?.user) {
          const userId = sessionData.session.user.id;
          const userEmail = sessionData.session.user.email;
          setCurrentUserId(userId);
          setCurrentUserEmail(userEmail || '');
          
          console.log('🔍 Getting current user info for ID:', userId);
          console.log('🔍 Getting current user email:', userEmail);
        }
      } catch (error) {
        console.error('🚨 ERROR: Error fetching current user info:', error);
      }
    };
    
    getCurrentUserInfo();
  }, []);

  // Get target user roles
  React.useEffect(() => {
    const fetchUserRoles = async () => {
      if (user.user_id) {
        const roles = await getUserRoles(user.user_id);
        setUserRoles(roles.map(r => r.role));
      }
    };
    
    fetchUserRoles();
  }, [user.user_id, getUserRoles]);

  // Permission checks
  const isTargetUserProtected = userRoles.includes('super_admin');
  const isViewingOwnSuperProfile = isSuperAdmin && (user.user_id === currentUserId);
  const canGrantRoles = isSuperAdmin || isAdmin;

  console.log('🔍 FINAL PERMISSION CHECK: Current user role:', currentUserRole);
  console.log('🔍 FINAL PERMISSION CHECK: Can grant roles?', canGrantRoles);

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
      setShowFullPageRoleGranting(true);
      setPassword('');
      toast.success('Password verified successfully');
      
    } catch (error) {
      console.error('Password verification error:', error);
      toast.error('Password verification failed');
      setPassword('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGrantRoleClick = () => {
    setShowPasswordPrompt(true);
  };

  const handleRoleGranted = () => {
    refetch();
    setShowFullPageRoleGranting(false);
    
    toast.success('🎉 SUCCESS: Admin role granted! New admin should appear in admin users list.');
    
    // Enhanced event dispatch with user details for portal creation
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('newAdminGranted', { 
        detail: { 
          userId: user.id, 
          userName: `${user.first_name} ${user.last_name}`,
          userEmail: user.email
        }
      }));
    }, 1000);
  };

  const handlePasswordPromptClose = () => {
    setShowPasswordPrompt(false);
    setPassword('');
  };

  // Styling variables
  const cardBg = isDarkTheme ? 'bg-white/5' : 'bg-[#F5F2E8]';
  const labelColor = isDarkTheme ? 'text-[#C7C7CC]' : 'text-[#8B7355]';

  if (loading) {
    return (
      <div>
        <SectionTitle isDarkTheme={isDarkTheme}>4️⃣ User Permissions</SectionTitle>
        <div className={`${cardBg} rounded-lg p-4 space-y-4`}>
          <div className="flex justify-between items-center">
            <p className={`${labelColor} text-sm font-sans`}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <SectionTitle isDarkTheme={isDarkTheme}>4️⃣ User Permissions</SectionTitle>
        <div className={`${cardBg} rounded-lg p-4 space-y-4`}>
          <PermissionStatusDisplay
            isSuperAdmin={isSuperAdmin}
            isRegularAdmin={isAdmin}
            isTargetUserProtected={isTargetUserProtected}
            isViewingOwnSuperProfile={isViewingOwnSuperProfile}
            isDarkTheme={isDarkTheme}
          />
          
          {/* User Roles Display */}
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

          <GrantRoleButton
            canGrantRoles={canGrantRoles}
            isTargetUserProtected={isTargetUserProtected}
            onClick={handleGrantRoleClick}
            isSuperAdmin={isSuperAdmin}
            isRegularAdmin={isAdmin}
            labelColor={labelColor}
          />
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

      <FullPageRoleGranting
        user={user}
        isOpen={showFullPageRoleGranting}
        onClose={() => setShowFullPageRoleGranting(false)}
        currentUserRole={currentUserRole}
        onRoleGranted={handleRoleGranted}
      />
    </>
  );
}
