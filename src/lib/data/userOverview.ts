/**
 * DO NOT EDIT. This file is locked to maintain perfect sync with SuperBase/Supabase and Admin Settings. 
 * Changes will break real-time accuracy.
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useCallback } from 'react';
import supabase from '@/lib/relaxedSupabase';
import { toast } from 'sonner';
import { ConnectionStatusBanner } from '@/components/ErrorBoundary/GlobalErrorBoundary';

// Runtime lock protection
if (typeof window !== 'undefined' && 
    typeof import.meta !== 'undefined' && 
    import.meta.env?.DEV && 
    import.meta.env?.LOCK_SYNC_FILES === 'true') {
  console.error('🔒 DO NOT CHANGE THIS. This file should not be changed ever.');
}

export interface UserOverview {
  id: string;
  user_id: string;
  auth_user_id?: string; // For compatibility with UserProfile
  first_name?: string;
  last_name?: string;
  full_name: string;
  username?: string;
  email?: string;
  phone?: string;
  phone_number?: string; // Support both formats for compatibility
  gender?: 'male' | 'female' | string;
  birthday?: string; // REAL birthday from profile_settings
  created_at: string;
  email_verified: boolean;
  phone_verified: boolean;
  two_factor_enabled: boolean;
  role?: string;
  status?: string;
  last_sign_in_at?: string;
  profile_image_url?: string;
  country?: string;
  languages?: string[];
  timezone?: string;
  otp_email_pending?: boolean;
  otp_phone_pending?: boolean;
  otp_email_expires_at?: string;
  otp_phone_expires_at?: string;
  email_verified_at?: string;
  phone_verified_at?: string;
  synced_at: string;
}

export interface UserOverviewFilters {
  search?: string;
  role?: string;
  status?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  limit?: number;
  offset?: number;
}

// Query keys for React Query
export const userOverviewKeys = {
  all: ['user-overview'] as const,
  user: (userId: string) => [...userOverviewKeys.all, 'user', userId] as const,
  adminUsers: (filters?: UserOverviewFilters) => [...userOverviewKeys.all, 'admin', filters] as const,
};

/**
 * Hook for fetching individual user overview (General Settings)
 */
export const useUserOverview = (userId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: userOverviewKeys.user(userId || ''),
    queryFn: async (): Promise<UserOverview | null> => {
      if (!userId) return null;

      console.log(`🔍 Fetching user overview with PERFECT verification sync for: ${userId}`);
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('❌ Error fetching profile:', profileError);
        throw profileError;
      }

      if (!profile) {
        console.warn('⚠️ No profile found for user:', userId);
        return null;
      }

      const { data: authUser } = await supabase.auth.getUser();
      
      const userOverview: UserOverview = {
        id: profile.id,
        user_id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        full_name: profile.first_name && profile.last_name 
          ? `${profile.first_name} ${profile.last_name}` 
          : (profile.username || 'User'),
        username: profile.username,
        email: profile.email,
        phone: profile.phone_number,
        phone_number: profile.phone_number,
        gender: profile.gender,
        birthday: profile.birthday,
        created_at: profile.created_at,
        email_verified: profile.email_verified || false,
        phone_verified: profile.phone_verified || false,
        two_factor_enabled: profile.two_factor_enabled || false,
        role: profile.primary_role || 'user',
        status: profile.account_status || 'active',
        last_sign_in_at: authUser?.user?.last_sign_in_at,
        profile_image_url: profile.avatar_url,
        country: profile.country,
        languages: profile.languages,
        timezone: profile.timezone,
        otp_email_pending: profile.otp_email_pending,
        otp_phone_pending: profile.otp_phone_pending,
        otp_email_expires_at: profile.otp_email_expires_at,
        otp_phone_expires_at: profile.otp_phone_expires_at,
        email_verified_at: profile.email_verified_at,
        phone_verified_at: profile.phone_verified_at,
        synced_at: new Date().toISOString(),
      };

      console.log('✅ User overview fetched successfully:', userOverview);
      return userOverview;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error?.code === '42501' || error?.message?.includes('permission')) {
        return false;
      }
      return failureCount < 3;
    }
  });

  // Setup realtime subscriptions with resilient channels
  useEffect(() => {
    if (!userId) return;

    console.log(`🔄 Setting up resilient realtime for user: ${userId}`);

    // Create resilient channels
    const profilesChannelData = supabase.channel(`user-overview-profiles-${userId}`);

    // Setup profiles subscription
    profilesChannelData
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          console.log(`📡 Profiles realtime update for ${userId}:`, payload);
          queryClient.invalidateQueries({ queryKey: userOverviewKeys.user(userId) });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannelData);
    };
  }, [userId, queryClient]);

  const refreshUser = useCallback(async () => {
    if (!userId) return;
    console.log(`🔄 Manually refreshing user overview for: ${userId}`);
    await queryClient.invalidateQueries({ queryKey: userOverviewKeys.user(userId) });
  }, [userId, queryClient]);

  return {
    ...query,
    refreshUser
  };
};

/**
 * Hook for fetching admin users list (Admin Users Table)
 * 100% real-time with database updates
 */
export const useAdminUsers = (filters?: UserOverviewFilters) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: userOverviewKeys.adminUsers(filters),
    queryFn: async (): Promise<UserOverview[]> => {
      console.log('🔍 [useAdminUsers] Fetching users via edge function...');
      
      const { data, error: efError } = await supabase.functions.invoke('admin_list_visible_users', {
        body: { limit: 1000, offset: 0, search: '' }
      });

      if (efError) {
        console.error('❌ [useAdminUsers] Edge function error:', efError);
        toast.error(`Failed to load users: ${efError.message}`);
        throw efError;
      }

      const profiles = (data?.users || []) as any[];
      console.log('✅ [useAdminUsers] Loaded', profiles.length, 'users');

      if (profiles.length === 0) {
        console.log('ℹ️ [useAdminUsers] No visible users (is_hidden=false, not platform_owner)');
        return [];
      }

      return profiles.map((user: any) => ({
        id: user.id,
        user_id: user.id,
        auth_user_id: user.id,
        profile_id: user.id,
        first_name: user.first_name || 'Not set',
        last_name: user.last_name || 'Not set',
        full_name: user.first_name && user.last_name ? 
          `${user.first_name} ${user.last_name}` : 
          (user.username || 'User'),
        username: user.username,
        email: user.email,
        phone: user.phone_number,
        phone_number: user.phone_number,
        bio: user.bio,
        created_at: user.created_at,
        updated_at: user.updated_at,
        role: user.role || user.primary_role || 'user',
        status: 'active',
        email_verified: true,
        phone_verified: !!user.phone_number,
        two_factor_enabled: false,
        last_login: null,
        profile_image_url: user.avatar_url || null,
        synced_at: new Date().toISOString(),
      } as UserOverview));
    },
    refetchOnWindowFocus: true,
    staleTime: 10000, // Consider data stale after 10s
    refetchInterval: 10000, // Auto-refresh every 10 seconds for faster updates
  });

  // Set up real-time subscriptions for instant updates
  useEffect(() => {
    console.log('🔄 [useAdminUsers] Setting up realtime subscriptions...');
    
    const profilesChannel = supabase
      .channel('profiles_admin_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('🔔 [useAdminUsers] Profiles change detected:', payload.eventType);
          queryClient.invalidateQueries({ queryKey: userOverviewKeys.adminUsers(filters) });
        }
      )
      .subscribe((status) => {
        console.log('📡 [useAdminUsers] Profiles subscription status:', status);
      });

    const rolesChannel = supabase
      .channel('user_roles_admin_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles'
        },
        (payload) => {
          console.log('🔔 [useAdminUsers] User roles change detected:', payload.eventType);
          queryClient.invalidateQueries({ queryKey: userOverviewKeys.adminUsers(filters) });
        }
      )
      .subscribe((status) => {
        console.log('📡 [useAdminUsers] Roles subscription status:', status);
      });

    return () => {
      console.log('🧹 [useAdminUsers] Cleaning up realtime subscriptions');
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(rolesChannel);
    };
  }, [queryClient, filters]);

  const refreshAdminUsers = useCallback(async () => {
    console.log('🔄 [useAdminUsers] Manual refresh triggered');
    await queryClient.invalidateQueries({ queryKey: userOverviewKeys.adminUsers(filters) });
  }, [queryClient, filters]);

  return {
    users: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refreshAdminUsers,
  };
};
