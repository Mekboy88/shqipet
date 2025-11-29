import { useState, useEffect } from 'react';
import { supabase } from '@/lib/cloud';
import { toast } from 'sonner';

export interface UserRole {
  id: string;
  user_id: string;
  role?: 'user' | 'moderator' | 'admin' | 'super_admin' | 'platform_owner_root'; // backward compat
  role_code?: string; // roles.code (new schema)
  granted_by?: string;
  granted_at?: string;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
}

export const useSecureRoles = () => {
  const [currentUserRole, setCurrentUserRole] = useState<string>('user');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrentUserRole = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.log('🔐 No user session found');
        setCurrentUserRole('user');
        return;
      }

      console.log('🔐 Current auth user ID:', session.user.id);

      // Use API schema function first
      const { data: role, error: roleError } = await supabase.rpc('get_current_user_role');

      if (!roleError && role) {
        console.log('🔐 Current user role from API:', role);
        setCurrentUserRole(role as string);
        return;
      }

      console.warn('⚠️ Fallback to profile.primary_role due to RPC error:', roleError?.message);
      // Fallback: check profile.primary_role
      const { data: profile, error: profErr } = await supabase
        .from('profiles')
        .select('primary_role')
        .maybeSingle();

      if (!profErr && profile?.primary_role) {
        setCurrentUserRole(profile.primary_role as string);
        return;
      }

      setCurrentUserRole('user');

    } catch (err: any) {
      console.error('Error in getCurrentUserRole:', err);
      setError(err.message || 'Unknown error');
      setCurrentUserRole('user');
    } finally {
      setLoading(false);
    }
  };

  const checkUserRole = async (userId: string, requiredRole: string): Promise<boolean> => {
    try {
      const { data: maxLevel, error } = await supabase.rpc('get_user_max_role_level', {
        _user_id: userId,
      });
      if (error) {
        console.error('Error checking user role level:', error);
        return false;
      }
      const level = Number(maxLevel) || 0;
      const thresholds: Record<string, number> = {
        platform_owner_root: 100,
        super_admin: 90,
        admin: 80,
        moderator: 50,
        user: 0,
      };
      const required = thresholds[requiredRole] ?? 999;
      return level >= required;
    } catch (err) {
      console.error('Error in checkUserRole:', err);
      return false;
    }
  };

  const grantRole = async (userId: string, role: string, grantedBy?: string): Promise<boolean> => {
    try {
      // Validate role before casting
      const validRoles = ['user', 'moderator', 'admin', 'super_admin'];
      if (!validRoles.includes(role)) {
        console.error('Invalid role:', role);
        toast.error(`Invalid role: ${role}`);
        return false;
      }

      // Only super admins can grant roles (enforced by RLS)
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: role as 'user' | 'moderator' | 'admin' | 'super_admin',
          granted_by: grantedBy
        });

      if (error) {
        console.error('Error granting role:', error);
        toast.error(`Failed to grant role: ${error.message}`);
        return false;
      }

      toast.success(`Role ${role} granted successfully`);
      return true;
    } catch (err: any) {
      console.error('Error in grantRole:', err);
      toast.error(`Error granting role: ${err.message}`);
      return false;
    }
  };

  const revokeRole = async (userId: string, role: string): Promise<boolean> => {
    try {
      // Validate role before using it
      const validRoles = ['user', 'moderator', 'admin', 'super_admin'];
      if (!validRoles.includes(role)) {
        console.error('Invalid role:', role);
        toast.error(`Invalid role: ${role}`);
        return false;
      }

      // Only super admins can revoke roles (enforced by RLS)
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role as 'user' | 'moderator' | 'admin' | 'super_admin');

      if (error) {
        console.error('Error revoking role:', error);
        toast.error(`Failed to revoke role: ${error.message}`);
        return false;
      }

      toast.success(`Role ${role} revoked successfully`);
      return true;
    } catch (err: any) {
      console.error('Error in revokeRole:', err);
      toast.error(`Error revoking role: ${err.message}`);
      return false;
    }
  };

  const getUserRoles = async (userId: string): Promise<UserRole[]> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error in getUserRoles:', err);
      return [];
    }
  };

  // Role hierarchy check
  const canManageRole = (currentRole: string, targetRole: string): boolean => {
    const hierarchy = {
      'super_admin': 4,
      'admin': 3,
      'moderator': 2,
      'user': 1
    };

    const currentLevel = hierarchy[currentRole as keyof typeof hierarchy] || 0;
    const targetLevel = hierarchy[targetRole as keyof typeof hierarchy] || 0;

    // Can only manage roles at or below your level
    return currentLevel >= targetLevel;
  };

  // Permission checks
  const isSuperAdmin = currentUserRole === 'super_admin' || currentUserRole === 'platform_owner_root';
  const isAdmin = currentUserRole === 'admin' || isSuperAdmin;
  const isModerator = currentUserRole === 'moderator' || isAdmin;

  useEffect(() => {
    console.log('🔐 useSecureRoles: Starting authentication check');
    getCurrentUserRole();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Auth state changed:', { event, hasSession: !!session });
      getCurrentUserRole();
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    currentUserRole,
    loading,
    error,
    isSuperAdmin,
    isAdmin,
    isModerator,
    getCurrentUserRole,
    checkUserRole,
    grantRole,
    revokeRole,
    getUserRoles,
    canManageRole
  };
};
