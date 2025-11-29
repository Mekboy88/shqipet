import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  user_id: string;
  auth_user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  phone_number?: string;
  email_verified: boolean;
  phone_verified: boolean;
  account_status: string;
  primary_role: string;
  nationality?: string;
  location?: string;
  bio?: string;
  website?: string;
  profile_image_url?: string;
  cover_photo_url?: string;
  verification_status: string;
  subscription_status: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
  role?: string;
  roles?: string[];
}

export interface UserStats {
  posts_count: number;
  comments_count: number;
  reactions_count: number;
  login_count: number;
}

export interface EnhancedUser extends UserProfile {
  display_name: string;
  is_online: boolean;
  status: 'active' | 'unverified' | 'banned' | 'suspended';
  status_text: string;
  status_color: string;
  stats?: UserStats;
}

export const useUsers = () => {
  const [users, setUsers] = useState<EnhancedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users with proper joins and data transformation
  const fetchUsers = useCallback(async (): Promise<EnhancedUser[]> => {
    try {
      console.log('🔄 Fetching users from Supabase...');
      
      // First, get all profiles (excluding hidden system users and platform owner)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          primary_role,
          created_at,
          updated_at,
          is_hidden
        `)
        .eq('is_hidden', false) // SECURITY: Never show hidden users
        .neq('primary_role', 'platform_owner_root') // SECURITY: Never show platform owner
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('❌ Error fetching profiles:', profilesError);
        throw profilesError;
      }

      if (!profiles || profiles.length === 0) {
        console.log('⚠️ No profiles found');
        return [];
      }

      console.log(`✅ Fetched ${profiles.length} profiles`);

      // Get user roles for all users with role details
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role_id,
          roles!inner(code, name, level)
        `)
        .eq('is_active', true);

      if (rolesError) {
        console.warn('⚠️ Error fetching user roles:', rolesError);
      }

      // Create a map of user roles for quick lookup
      const rolesMap = new Map<string, { code: string; name: string; level: number }[]>();
      userRoles?.forEach(ur => {
        // ur.roles is a single role object from the join, not an array
        const roleData = ur.roles as any as { code: string; name: string; level: number };
        const existing = rolesMap.get(ur.user_id) || [];
        rolesMap.set(ur.user_id, [...existing, roleData]);
      });

      // Transform profiles to enhanced users
      const enhancedUsers: EnhancedUser[] = profiles.map(profile => {
        const userRolesList = rolesMap.get(profile.user_id) || [];
        const highestRole = userRolesList.reduce((highest, role) => 
          role.level > (highest?.level || 0) ? role : highest, userRolesList[0] || { code: 'user', name: 'User', level: 0 });

        // Use primary_role from profile or highest assigned role
        const primaryRole = profile.primary_role || highestRole.code;

        // Simplified status - we'll need proper account_status column
        let status: 'active' | 'unverified' | 'banned' | 'suspended' = 'active';
        let statusText = 'Active';
        let statusColor = 'bg-green-100 text-green-800 border border-green-200';

        // Create display name from profile ID for now (until we have proper user data)
        const displayName = `User ${profile.id.slice(0, 8)}`;

        return {
          ...profile,
          role: primaryRole,
          roles: userRolesList.map(r => r.code),
          display_name: displayName,
          is_online: false, // We'll need to track this properly
          status,
          status_text: statusText,
          status_color: statusColor,
          // Add missing required fields
          auth_user_id: profile.user_id,
          email: `user-${profile.id.slice(0, 8)}@example.com`, // Temporary
          account_status: 'active',
          primary_role: primaryRole,
          email_verified: true,
          phone_verified: false,
          verification_status: 'verified',
          subscription_status: 'free'
        } as EnhancedUser;
      });

      console.log(`✅ Successfully processed ${enhancedUsers.length} enhanced users`);
      return enhancedUsers;

    } catch (err: any) {
      console.error('❌ Error in fetchUsers:', err);
      throw new Error(`Failed to fetch users: ${err.message}`);
    }
  }, []);

  // Get user stats (posts, comments, reactions)
  const fetchUserStats = useCallback(async (userId: string): Promise<UserStats> => {
    try {
      const [postsResult, commentsResult, reactionsResult] = await Promise.all([
        supabase.from('posts').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('comments').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('reactions').select('id', { count: 'exact', head: true }).eq('user_id', userId)
      ]);

      return {
        posts_count: postsResult.count || 0,
        comments_count: commentsResult.count || 0,
        reactions_count: reactionsResult.count || 0,
        login_count: 0 // This would need to be tracked separately
      };
    } catch (err) {
      console.error('Error fetching user stats:', err);
      return {
        posts_count: 0,
        comments_count: 0,
        reactions_count: 0,
        login_count: 0
      };
    }
  }, []);

  // Load all users
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
      console.log(`✅ Successfully loaded ${fetchedUsers.length} users`);
    } catch (err: any) {
      console.error('❌ Error loading users:', err);
      setError(err.message);
      toast.error(`Failed to load users: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  // Refresh users data
  const refreshUsers = useCallback(() => {
    console.log('🔄 Refreshing users data...');
    loadUsers();
  }, [loadUsers]);

  // Get user by ID
  const getUserById = useCallback((userId: string): EnhancedUser | undefined => {
    return users.find(user => user.id === userId || user.auth_user_id === userId);
  }, [users]);

  // Get users by role
  const getUsersByRole = useCallback((role: string): EnhancedUser[] => {
    return users.filter(user => user.roles?.includes(role) || user.role === role);
  }, [users]);

  // Get users by status
  const getUsersByStatus = useCallback((status: string): EnhancedUser[] => {
    return users.filter(user => user.status === status);
  }, [users]);

  // Update user status
  const updateUserStatus = useCallback(async (userId: string, status: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ account_status: status, updated_at: new Date().toISOString() })
        .eq('auth_user_id', userId);

      if (error) throw error;

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.auth_user_id === userId 
            ? { ...user, account_status: status }
            : user
        )
      );

      toast.success(`User status updated to ${status}`);
      return true;
    } catch (err: any) {
      console.error('Error updating user status:', err);
      toast.error(`Failed to update user status: ${err.message}`);
      return false;
    }
  }, []);

  // Initialize users on mount
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    users,
    loading,
    error,
    refreshUsers,
    fetchUsers,
    fetchUserStats,
    getUserById,
    getUsersByRole,
    getUsersByStatus,
    updateUserStatus,
    loadUsers
  };
};