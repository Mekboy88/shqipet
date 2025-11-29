import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Role, UserRole, UserRoleWithDetails, RoleLevel } from '@/types/rbac';
import { toast } from 'sonner';

interface UseRoleManagementReturn {
  grantUserRole: (
    targetUserId: string, 
    roleId: string, 
    scopeType?: 'global' | 'regional' | 'resource',
    scopeValue?: string,
    resourceType?: string,
    resourceId?: string,
    expiresAt?: string
  ) => Promise<boolean>;
  revokeUserRole: (userRoleId: string) => Promise<boolean>;
  getUserRoles: (userId: string) => Promise<UserRoleWithDetails[]>;
  getAllRoles: () => Promise<Role[]>;
  updateRoleExpiry: (userRoleId: string, expiresAt: string | null) => Promise<boolean>;
  loading: boolean;
}

export const useRoleManagement = (): UseRoleManagementReturn => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const grantUserRole = useCallback(async (
    targetUserId: string,
    roleId: string,
    scopeType: 'global' | 'regional' | 'resource' = 'global',
    scopeValue?: string,
    resourceType?: string,
    resourceId?: string,
    expiresAt?: string
  ): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to grant roles');
      return false;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: targetUserId,
          role_id: roleId,
          scope_type: scopeType,
          scope_value: scopeValue,
          resource_type: resourceType,
          resource_id: resourceId,
          granted_by: user.id,
          expires_at: expiresAt,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('User already has this role with the specified scope');
        } else {
          toast.error(`Failed to grant role: ${error.message}`);
        }
        return false;
      }

      toast.success('Role granted successfully');
      return true;

    } catch (err) {
      console.error('Error granting role:', err);
      toast.error('Failed to grant role');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const revokeUserRole = useCallback(async (userRoleId: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to revoke roles');
      return false;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('user_roles')
        .update({ is_active: false })
        .eq('id', userRoleId);

      if (error) {
        toast.error(`Failed to revoke role: ${error.message}`);
        return false;
      }

      toast.success('Role revoked successfully');
      return true;

    } catch (err) {
      console.error('Error revoking role:', err);
      toast.error('Failed to revoke role');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getUserRoles = useCallback(async (userId: string): Promise<UserRoleWithDetails[]> => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          roles!inner(*)
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('granted_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as UserRoleWithDetails[];

    } catch (err) {
      console.error('Error fetching user roles:', err);
      toast.error('Failed to fetch user roles');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllRoles = useCallback(async (): Promise<Role[]> => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('level', { ascending: false });

      if (error) {
        throw error;
      }

      return data as Role[];

    } catch (err) {
      console.error('Error fetching roles:', err);
      toast.error('Failed to fetch roles');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRoleExpiry = useCallback(async (
    userRoleId: string, 
    expiresAt: string | null
  ): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to update role expiry');
      return false;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('user_roles')
        .update({ expires_at: expiresAt })
        .eq('id', userRoleId);

      if (error) {
        toast.error(`Failed to update role expiry: ${error.message}`);
        return false;
      }

      toast.success('Role expiry updated successfully');
      return true;

    } catch (err) {
      console.error('Error updating role expiry:', err);
      toast.error('Failed to update role expiry');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    grantUserRole,
    revokeUserRole,
    getUserRoles,
    getAllRoles,
    updateRoleExpiry,
    loading,
  };
};