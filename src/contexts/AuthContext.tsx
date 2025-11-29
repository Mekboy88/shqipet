import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { perTabSupabase } from '@/integrations/supabase/perTabClient';
import { immediateLogoutService } from '@/utils/auth/immediateLogoutService';
import { userDataSynchronizer } from '@/services/userDataSynchronizer';
import { sessionProtection } from '@/utils/auth/sessionProtection';
import { instantMediaPreloader } from '@/services/media/InstantMediaPreloader';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  account_status?: string;
  profile_image_url?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  adminRole: string | null;
  userRole: string | null;
  userLevel: number;
  isSuperAdmin: boolean;
  isModerator: boolean;
  isPlatformOwner: boolean;
  canManageUsers: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  adminOnlyLogout: () => Promise<void>;
  validateUserAccess: (userId: string) => boolean;
  getCurrentAuthUserId: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userLevel, setUserLevel] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authDataCached, setAuthDataCached] = useState(false);

  // Role hierarchy levels (from RBAC types)
  const ROLE_LEVELS = {
    'user': 1,
    'global_content_moderator': 25,
    'user_directory_admin': 35,
    'access_admin': 85,
    'admin': 90,
    'super_admin': 95,
    'platform_owner_root': 100
  };

  const isAdmin = userRole && ['admin', 'super_admin', 'moderator', 'support', 'developer', 'access_admin', 'platform_owner_root'].includes(userRole);
  const adminRole = isAdmin ? userRole : null;
  const isSuperAdmin = userRole === 'super_admin' || userRole === 'platform_owner_root';
  const isModerator = userLevel >= ROLE_LEVELS.global_content_moderator;
  const isPlatformOwner = userRole === 'platform_owner_root';
  const canManageUsers = userLevel >= ROLE_LEVELS.user_directory_admin;

  useEffect(() => {
    let isMounted = true;
    console.log('🚀 AuthProvider: Starting auth initialization...');

    const initializeAuth = async () => {
      try {
        // Set up auth state listener FIRST to catch any auth events
        // Use unified supabase client for consistent auth
        console.log('🔐 AuthProvider: Setting up auth listener with unified client');
        const { data: { subscription } } = perTabSupabase.auth.onAuthStateChange(
          (event, session) => {
            if (!isMounted) return;
            
            console.log('🔄 AuthProvider: Auth state changed:', event, !!session?.user);
            
            // CRITICAL: Synchronous updates only - NO async operations in callback
            if (event === 'SIGNED_OUT') {
              console.log('🚪 User explicitly signed out');
              setSession(null);
              setUser(null);
              setUserProfile(null);
              setUserRole(null);
              setUserLevel(0);
              setAuthDataCached(false);
              userDataSynchronizer.clearUserData();
              return;
            }
            
            // Update auth state immediately (synchronous)
            if (session?.user) {
              console.log('✅ Setting session and user (synchronous)');
              setSession(session);
              setUser(session.user);
              
              // Set loading to false on any auth event
              if (authInitialized) {
                setLoading(false);
              }
              
              // Defer profile/role fetch to avoid blocking the callback
              setTimeout(() => {
                if (!isMounted) return;
                
                // Only fetch if not cached or on fresh login/refresh
                if (!authDataCached || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                  console.log('📥 Deferred: Fetching user profile and role...');
                  
                  // Fetch profile
                  fetchUserProfile(session.user.id).catch(console.warn);
                  // Fetch role
                  fetchUserRole(session.user.id).catch(console.warn);
                  // Prefetch settings
                  import('@/lib/profileSettingsCache').then(m => m.prefetchProfileSettings(session.user!.id)).catch(console.warn);
                  // Sync user data
                  userDataSynchronizer.syncUserData(session.user.id).catch(console.warn);
                  // Preload media
                  instantMediaPreloader.preloadUserMedia(session.user.id).catch(() => {});
                }
              }, 0);
            }
          }
        );

        // Store subscription for cleanup
        const cleanupSubscription = () => subscription.unsubscribe();
        
        // Then get initial session
        const { data: { session }, error } = await perTabSupabase.auth.getSession();
        
        if (error) {
          console.error('❌ AuthProvider: Session check error:', error);
          throw error;
        }

        if (!isMounted) {
          cleanupSubscription();
          return;
        }

        // Set auth state immediately
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        setAuthInitialized(true);

        console.log('✅ AuthProvider: Auth initialized -', !!session?.user ? 'User found' : 'No user');

        // Fetch user data in background if user exists and not already cached
        if (session?.user && !authDataCached) {
          fetchUserProfile(session.user.id).catch(console.warn);
          fetchUserRole(session.user.id).catch(console.warn);
          // Prefetch profile settings eagerly on app load
          import('@/lib/profileSettingsCache').then(m => m.prefetchProfileSettings(session.user!.id)).catch(console.warn);
          // Immediately synchronize all user data for instant loading
          userDataSynchronizer.syncUserData(session.user.id).catch(console.warn);
          // INSTANT MEDIA: Preload avatar and cover immediately on app load
          instantMediaPreloader.preloadUserMedia(session.user.id).catch(() => {});
          // CRITICAL: Start session protection to prevent automatic logouts
          sessionProtection.startProtection();
          console.log('🛡️ Session protection started for user');
        } else if (!session?.user) {
          // Clear user data if no session
          userDataSynchronizer.clearUserData();
          setAuthDataCached(false);
          
          // Stop session protection when no user
          sessionProtection.stopProtection();
        }

        return cleanupSubscription;

      } catch (error) {
        console.error('❌ AuthProvider: Auth initialization failed:', error);
        if (isMounted) {
          setSession(null);
          setUser(null);
          setUserProfile(null);
          setUserRole(null);
          setUserLevel(0);
          setLoading(false);
          setAuthInitialized(true);
          setAuthDataCached(false);
        }
      }
    };

    // Start initialization and get cleanup function
    const cleanup = initializeAuth();

    return () => {
      console.log('🧹 AuthProvider: Cleaning up...');
      isMounted = false;
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then(cleanupFn => cleanupFn?.()).catch(console.warn);
      }
    };
  }, []);

  const fetchUserProfile = async (userId: string): Promise<void> => {
    if (!userId) {
      console.warn('⚠️ fetchUserProfile: No userId provided');
      return;
    }
    
    const started = performance.now();
    try {
      console.log('🔍 fetchUserProfile: Fetching profile for user:', userId);
      
      // Fetch from public.profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('⚠️ fetchUserProfile: Database error:', error);
        setUserProfile(null);
        return;
      }

      if (data) {
        console.log('✅ fetchUserProfile: Profile found in', Math.round(performance.now() - started), 'ms');
        setUserProfile({
          id: data.id,
          user_id: data.id,
          email: data.email || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          profile_image_url: data.avatar_url
        } as UserProfile);
        setAuthDataCached(true);
      } else {
        console.log('⚠️ fetchUserProfile: No profile found for user:', userId);
        setUserProfile(null);
        setAuthDataCached(true);
      }
    } catch (error: any) {
      console.error('❌ fetchUserProfile: Exception:', error?.message || error);
    }
  };

  const fetchUserRole = async (userId: string): Promise<void> => {
    if (!userId) {
      console.warn('⚠️ fetchUserRole: No userId provided');
      setUserRole('user');
      setUserLevel(1);
      return;
    }

    const started = performance.now();
    try {
      console.log('🔍 fetchUserRole: Fetching role for user:', userId);
      
      // FIRST: Check profiles.primary_role (the source of truth)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('primary_role')
        .eq('id', userId)
        .maybeSingle();

      if (!profileError && profileData?.primary_role) {
        const role = profileData.primary_role;
        const level = ROLE_LEVELS[role as keyof typeof ROLE_LEVELS] || 1;
        console.log('✅ fetchUserRole: Role found in profile:', role, 'level:', level, 'in', Math.round(performance.now() - started), 'ms');
        setUserRole(role);
        setUserLevel(level);
        setAuthDataCached(true);
        return;
      }

      // FALLBACK: Check user_roles table if primary_role is null
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn('⚠️ fetchUserRole: Database error:', error);
        setUserRole('user');
        setUserLevel(1);
        setAuthDataCached(true);
        return;
      }

      if (data?.role) {
        const role = data.role;
        const level = ROLE_LEVELS[role as keyof typeof ROLE_LEVELS] || 1;
        console.log('✅ fetchUserRole: Role found in user_roles:', role, 'level:', level, 'in', Math.round(performance.now() - started), 'ms');
        setUserRole(role);
        setUserLevel(level);
      } else {
        console.log('ℹ️ fetchUserRole: No role found, defaulting to user');
        setUserRole('user');
        setUserLevel(1);
      }
      setAuthDataCached(true);
    } catch (error: any) {
      console.error('❌ fetchUserRole: Exception:', error?.message || error);
      setUserRole('user');
      setUserLevel(1);
      setAuthDataCached(true);
    }
  };
  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 BULLETPROOF LOGIN: Starting authentication for:', email);
      
      // Clean the email input
      const cleanEmail = email.trim().toLowerCase();
      
      // Validate inputs
      if (!cleanEmail || !password) {
        throw new Error('Email dhe fjalëkalimi janë të detyrueshme');
      }
      
      if (!cleanEmail.includes('@')) {
        throw new Error('Formati i email-it nuk është valid');
      }
      
      // Attempt authentication with per-tab client
      const { data, error } = await perTabSupabase.auth.signInWithPassword({ 
        email: cleanEmail, 
        password 
      });
      
      if (error) {
        console.error('🔴 Authentication failed:', error);
        
        // Map common errors to user-friendly messages
        let userMessage = 'Email ose fjalëkalim i pasaktë';
        if (error.message.includes('Invalid login credentials')) {
          userMessage = 'Email ose fjalëkalim i pasaktë';
        } else if (error.message.includes('Email not confirmed')) {
          userMessage = 'Ju lutemi konfirmoni email-in tuaj para se të identifikoheni';
        } else if (error.message.includes('Too many requests')) {
          userMessage = 'Shumë përpjekje për t\'u identifikuar. Provoni përsëri pas disa minutash';
        }
        
        throw new Error(userMessage);
      }
      
      if (!data.user || !data.session) {
        throw new Error('Gabim në sistem. Ju lutemi provoni përsëri');
      }
      
      console.log('✅ BULLETPROOF LOGIN: Authentication successful');
      
      // Update states immediately for instant UI response
      setUser(data.user);
      setSession(data.session);
      
    } catch (error: any) {
      console.error('❌ BULLETPROOF LOGIN: Failed with error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await perTabSupabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('❌ SignUp error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    console.log('🚪 User explicitly requested sign out - TAB-ONLY logout');
    
    try {
      // Stop session protection first
      sessionProtection.stopProtection();
      
      // Clear states immediately
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setUserRole(null);
      setUserLevel(0);
      setAuthDataCached(false);
      
      // Perform TAB-ONLY logout (keeps other tabs logged in)
      await immediateLogoutService.performTabOnlyLogout();
      
      console.log('✅ Sign out completed');
    } catch (error) {
      console.error('❌ Sign out error:', error);
    }
  };

  const adminOnlyLogout = async () => {
    await immediateLogoutService.performAdminOnlyLogout();
  };

  const validateUserAccess = (requestedUserId: string): boolean => {
    return user?.id === requestedUserId;
  };

  const getCurrentAuthUserId = (): string | null => {
    return user?.id || null;
  };

  const value = {
    user,
    session,
    userProfile,
    loading,
    isAdmin,
    adminRole,
    userRole,
    userLevel,
    isSuperAdmin,
    isModerator,
    isPlatformOwner,
    canManageUsers,
    signIn,
    signUp,
    signOut,
    adminOnlyLogout,
    validateUserAccess,
    getCurrentAuthUserId,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
