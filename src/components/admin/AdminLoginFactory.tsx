
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationManager } from '@/utils/notificationManager';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useSecureRoles } from '@/hooks/users/use-secure-roles';
import { Shield } from 'lucide-react';
import { GlobalSkeleton } from '@/components/ui/GlobalSkeleton';
import "@/components/live/styles/animations.css";
import AdminLoginBackground from './factory/AdminLoginBackground';
import AdminProfileSection from './factory/AdminProfileSection';
import AdminLoginForm from './factory/AdminLoginForm';
import { getRoleBadgeConfig } from './factory/AdminRoleUtils';

interface AdminLoginFactoryProps {
  adminEmail: string;
  allowedRole: string;
  portalTitle: string;
  portalIcon: React.ReactNode;
  colorScheme: {
    primary: string;
    secondary: string;
    background: string;
  };
}

const AdminLoginFactory: React.FC<AdminLoginFactoryProps> = ({
  adminEmail,
  allowedRole,
  portalTitle,
  portalIcon,
  colorScheme
}) => {
  // State management
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const { user, signIn, signOut, userProfile, isAdmin, adminRole, getCurrentAuthUserId, loading: authLoading } = useAuth();
  const { checkUserRole, currentUserRole, loading: rolesLoading } = useSecureRoles();

  // SECURITY: This admin login page ALWAYS requires manual authentication
  // No automatic login or redirects allowed - even for authenticated users
  
  // No loading screens - show admin login immediately
  // Authentication checks are done only when user submits the form

  useEffect(() => {
    const wasLoggedOut = sessionStorage.getItem('adminLoggedOut');
    if (wasLoggedOut) {
      setIsLoggedOut(true);
      sessionStorage.removeItem('adminLoggedOut');
      notificationManager.showNotification(`Successfully logged out from ${allowedRole} dashboard`, { tag: 'success' });
      notificationManager.playSound('success');
    }

    // CRITICAL FIX: Fetch the ACTUAL user profile directly from database
    const fetchRealUserProfile = async () => {
      if (!user?.id) {
        console.log('⚠️ No authenticated user - waiting for authentication');
        return;
      }

      try {
        console.log('🔍 FETCHING REAL PROFILE for user:', user.id);
        
        // Fetch directly from database - GUARANTEED TO WORK
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error || !profile) {
          console.error('❌ Could not fetch user profile:', error);
          return;
        }

        console.log('✅ REAL PROFILE LOADED:', {
          id: profile.id,
          email: profile.email,
          role: profile.primary_role,
          name: `${profile.first_name} ${profile.last_name}`,
          avatar: profile.avatar_url
        });

        // SECURITY: Verify platform owner role
        if (profile.primary_role === 'platform_owner_root') {
          setAdminProfile(profile);
          console.log(`✅ PLATFORM OWNER VERIFIED: ${profile.first_name} ${profile.last_name}`);
        } else {
          console.error(`🚨 UNAUTHORIZED: User has role ${profile.primary_role}, not platform_owner_root`);
        }

      } catch (error) {
        console.error('💥 Error fetching real profile:', error);
      }
    };

    fetchRealUserProfile();
  }, [user?.id]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setPasswordError('Please enter your password');
      notificationManager.showNotification("Please enter your password", { tag: 'error' });
      notificationManager.playSound('alert');
      return;
    }

    try {
      setSubmitting(true);
      setPasswordError(null);
      console.log('🔐 SECURE ADMIN LOGIN: Starting authentication...');
      
      // Get current user email - CRITICAL: Must use the logged-in user's email
      const userEmail = user?.email || userProfile?.email || adminEmail;
      console.log('🔐 SECURITY CHECK: Authenticating email:', userEmail);

      // SECURITY: Authenticate with Supabase using the platform password
      const signResult: any = await signIn(userEmail, password);
      if (signResult?.error) {
        setPasswordError('Incorrect password. Please try again.');
        notificationManager.showNotification('Incorrect password. Please try again.', { tag: 'error' });
        notificationManager.playSound('alert');
        setSubmitting(false);
        return;
      }

      // CRITICAL FIX: Use the ACTUAL profile data we fetched
      if (!adminProfile) {
        setPasswordError('Profile not loaded. Please try again.');
        setSubmitting(false);
        return;
      }

      const userRole = adminProfile.primary_role;
      console.log('🔐 VERIFYING ROLE for authenticated user:', userRole);

      // SECURITY: Direct role verification - ONLY platform owners allowed  
      const isAuthorized = userRole === 'platform_owner_root';

      console.log('🔐 ROLE VERIFICATION:', {
        userRole,
        isAuthorized,
        requiredRole: 'platform_owner_root'
      });

      if (!isAuthorized) {
        console.error('🚨 SECURITY VIOLATION: Unauthorized access attempt by role:', userRole);
        notificationManager.showNotification(`Access denied. This portal is exclusively for Platform Owners.`, { tag: 'error' });
        notificationManager.playSound('alert');
        setPasswordError('Access denied. Platform Owner privileges required.');
        setSubmitting(false);
        return;
      }

      console.log('✅ SECURITY CLEARED: Platform Owner access granted');
      console.log(`🎉 SECURE LOGIN SUCCESS: ${adminProfile.first_name} ${adminProfile.last_name} (Platform Owner)`);
      
      notificationManager.showNotification(`Welcome back, ${adminProfile.first_name}! Platform Owner access granted.`, { tag: 'success' });
      notificationManager.playSound('success');
      
      // Show success state
      setLoginSuccess(true);
      setSubmitting(false);
      
      // Navigate to admin settings
      setTimeout(() => {
        navigate('/admin/settings', { replace: true });
      }, 800);
      notificationManager.playSound('success');
      
      // Show success state
      setLoginSuccess(true);
      setSubmitting(false);
      
      // Navigate to admin settings
      setTimeout(() => {
        navigate('/admin/settings', { replace: true });
      }, 800);

    } catch (error: any) {
      console.error(`🚨 ADMIN LOGIN ERROR:`, error);
      setPasswordError('Authentication failed. Please try again.');
      notificationManager.showNotification("Authentication failed. Please verify your credentials.", { tag: 'error' });
      notificationManager.playSound('alert');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-start justify-start relative">
      <AdminLoginBackground colorScheme={colorScheme} />
      
      {/* Top header text */}
      <div className="w-full z-20 pt-8 px-8 pointer-events-none select-none">
        <div className="text-center">
          <h2 className="text-6xl font-bold text-gray-800 font-cinzel uppercase tracking-wide mb-4">
            Admin Login Area
          </h2>
          {/* Beautiful decorative line */}
          <div className="flex items-center justify-center">
            <div className="flex items-end">
              {/* Left decorative curve going up */}
              <svg width="40" height="20" viewBox="0 0 40 20" className="text-gray-400">
                <path d="M 5 15 Q 15 5 25 10 Q 30 12 35 8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
              {/* Main line */}
              <div className="w-32 h-0.5 bg-gradient-to-r from-gray-300 via-gray-500 to-gray-300 mx-2"></div>
              {/* Center decorative element */}
              <div className="w-3 h-3 bg-gray-500 rounded-full mx-2"></div>
              {/* Main line */}
              <div className="w-32 h-0.5 bg-gradient-to-r from-gray-300 via-gray-500 to-gray-300 mx-2"></div>
              {/* Right decorative curve going down */}
              <svg width="40" height="20" viewBox="0 0 40 20" className="text-gray-400">
                <path d="M 5 8 Q 10 12 15 10 Q 25 5 35 15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div 
        className={`backdrop-blur-sm rounded-xl shadow-lg p-6 w-full max-w-md z-10 live-video-card transition-all ml-8 mt-72 ${
          loginSuccess 
            ? 'bg-green-100/95 animate-[fade-in_0.3s_ease-out,scale-in_0.2s_ease-out]' 
            : 'bg-white/95'
        }`}
        style={{ 
          maxHeight: "60vh",
          boxShadow: loginSuccess 
            ? `0 0 0 2px #22c55e40, 0 0 25px #22c55e60` 
            : `0 0 0 2px ${colorScheme.primary}20, 0 0 25px ${colorScheme.primary}40`,
          position: "relative",
          transform: isHovered ? "scale(1.005)" : "scale(1)",
          transition: "transform 0.2s ease, box-shadow 0.3s ease, background-color 0.3s ease"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {loginSuccess ? (
          <div className="text-center py-8">
            <div className="animate-pulse">
              <p className="text-green-600 font-semibold mb-2">Authentication Successful!</p>
              <p className="text-sm text-green-500">Redirecting to admin dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            <AdminProfileSection
              adminProfile={adminProfile}
              adminEmail={adminEmail}
              allowedRole={allowedRole}
              isLoggedOut={isLoggedOut}
              colorScheme={colorScheme}
            />

            <AdminLoginForm
              password={password}
              onPasswordChange={setPassword}
              onSubmit={handleLogin}
              allowedRole={allowedRole}
              colorScheme={colorScheme}
              errorMessage={passwordError || undefined}
              isSubmitting={submitting}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLoginFactory;
