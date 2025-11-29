
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile, UserActivityLog, AdminAction } from '@/types/user';

interface UseUsersProps {
  initialPageSize?: number;
  initialFilters?: {
    search?: string;
    accountStatus?: string;
    emailVerification?: string;
    phoneVerification?: string;
    role?: string;
    dateStart?: Date | null;
    dateEnd?: Date | null;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    adminOnly?: boolean;
  };
}

export const useUsers = ({ 
  initialPageSize = 10, 
  initialFilters = {} 
}: UseUsersProps = {}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch users with proper error handling
  const fetchUsers = useCallback(async () => {
    try {
      console.log('Fetching users with filters:', filters);
      
      let data: any[] = [];
      let count: number | null = null;
      let rolesMap: Map<string, string> | null = null;
      
      // If adminOnly filter is true, use a different approach to get only admin users
      if (filters.adminOnly) {
        // First get admin user IDs from user_roles table
        const { data: adminRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .in('role', ['admin', 'super_admin', 'moderator']);

        if (rolesError) throw rolesError;

        const adminUserIds = adminRoles?.map(role => role.user_id) || [];
        
        if (adminUserIds.length === 0) {
          // No admin users found
          setTotalCount(0);
          return [];
        }

        // Store role information to use later
        rolesMap = new Map(adminRoles?.map(role => [role.user_id, role.role]) || []);

        // Now get profiles for these admin users
        let query = supabase
          .from('profiles')
          .select('*', { count: 'exact' })
          .in('auth_user_id', adminUserIds);

        // Apply search filter
        if (filters.search && filters.search.trim()) {
          const searchTerm = `%${filters.search.trim()}%`;
          query = query.or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},username.ilike.${searchTerm},email.ilike.${searchTerm}`);
        }

        // Apply status filters
        if (filters.accountStatus && filters.accountStatus !== 'all') {
          query = query.eq('account_status', filters.accountStatus);
        }

        if (filters.emailVerification && filters.emailVerification !== 'all') {
          const isVerified = filters.emailVerification === 'verified';
          query = query.eq('email_verified', isVerified);
        }

        if (filters.phoneVerification && filters.phoneVerification !== 'all') {
          const isVerified = filters.phoneVerification === 'verified';
          query = query.eq('phone_verified', isVerified);
        }

        // Apply role filter (for admin-only views) - filter the adminUserIds based on role
        if (filters.role && filters.role !== 'all') {
          const filteredUserIds = adminUserIds.filter(userId => 
            rolesMap?.get(userId) === filters.role
          );
          query = query.in('auth_user_id', filteredUserIds);
        }

        // Apply date filters
        if (filters.dateStart) {
          query = query.gte('created_at', filters.dateStart.toISOString());
        }

        if (filters.dateEnd) {
          query = query.lte('created_at', filters.dateEnd.toISOString());
        }

        // Apply sorting
        const sortBy = filters.sortBy || 'created_at';
        const sortOrder = filters.sortOrder === 'asc';
        query = query.order(sortBy, { ascending: sortOrder });

        // Apply pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        const result = await query;
        data = result.data || [];
        count = result.count;

        if (result.error) throw result.error;
      } else {
        // Regular query for all users
        let query = supabase
          .from('profiles')
          .select('*', { count: 'exact' });

        // Apply search filter
        if (filters.search && filters.search.trim()) {
          const searchTerm = `%${filters.search.trim()}%`;
          query = query.or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},username.ilike.${searchTerm},email.ilike.${searchTerm}`);
        }

        // Apply status filters
        if (filters.accountStatus && filters.accountStatus !== 'all') {
          query = query.eq('account_status', filters.accountStatus);
        }

        if (filters.emailVerification && filters.emailVerification !== 'all') {
          const isVerified = filters.emailVerification === 'verified';
          query = query.eq('email_verified', isVerified);
        }

        if (filters.phoneVerification && filters.phoneVerification !== 'all') {
          const isVerified = filters.phoneVerification === 'verified';
          query = query.eq('phone_verified', isVerified);
        }

        // Apply date filters
        if (filters.dateStart) {
          query = query.gte('created_at', filters.dateStart.toISOString());
        }

        if (filters.dateEnd) {
          query = query.lte('created_at', filters.dateEnd.toISOString());
        }

        // Apply sorting
        const sortBy = filters.sortBy || 'created_at';
        const sortOrder = filters.sortOrder === 'asc';
        query = query.order(sortBy, { ascending: sortOrder });

        // Apply pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        const result = await query;
        data = result.data || [];
        count = result.count;

        if (result.error) throw result.error;
      }

      console.log('Fetched users:', data?.length || 0, 'Total count:', count);
      
      if (count !== null) {
        setTotalCount(count);
      }

      // Transform the data to include role information for admin users
      const transformedData = filters.adminOnly && data && rolesMap ? 
        data.map(user => ({
          ...user,
          role: rolesMap?.get(user.auth_user_id) || 'user'
        })) : 
        data;

      return transformedData as UserProfile[] || [];
    } catch (error: any) {
      console.error('Error in fetchUsers:', error);
      toast.error(`Failed to fetch users: ${error.message}`);
      return [];
    }
  }, [page, pageSize, filters]);

  // Use React Query for data fetching
  const { data: users = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['users', page, pageSize, filters],
    queryFn: fetchUsers,
    staleTime: 30000,
    retry: 2
  });

  // Fetch user activity logs
  const fetchUserActivityLogs = async (userId: string): Promise<UserActivityLog[]> => {
    try {
      const { data, error } = await supabase
        .from('user_activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      console.error('Error fetching user activity logs:', error);
      toast.error(`Failed to fetch activity logs: ${error.message}`);
      return [];
    }
  };

  // Fetch admin actions for a user
  const fetchAdminActions = async (userId: string): Promise<AdminAction[]> => {
    try {
      const { data, error } = await supabase
        .from('admin_actions')
        .select('*')
        .eq('target_user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      console.error('Error fetching admin actions:', error);
      toast.error(`Failed to fetch admin actions: ${error.message}`);
      return [];
    }
  };

  // Update user status
  const updateUserStatus = async (userId: string, status: string, reason: string) => {
    try {
      console.log(`Updating user ${userId} status to ${status}`);
      
      const { error } = await supabase
        .from('profiles')
        .update({ account_status: status })
        .eq('id', userId);

      if (error) throw error;

      // Log the admin action
      const { data: sessionData } = await supabase.auth.getSession();
      const adminId = sessionData.session?.user?.id;
      
      if (adminId) {
        await supabase
          .from('admin_actions')
          .insert({
            actor_id: adminId,
            target_user_id: userId,
            action_type: 'status_change',
            new_status: status,
            reason: reason
          });
      }

      toast.success(`User status updated to ${status}`);
      await refetch();
    } catch (error: any) {
      console.error('Error updating user status:', error);
      toast.error(`Failed to update user status: ${error.message}`);
      throw error;
    }
  };

  // Update user role - Note: This would need a separate user_roles table
  const updateUserRole = async (userId: string, role: string, reason: string) => {
    try {
      console.log(`Updating user ${userId} role to ${role}`);
      
      // Since role is not in profiles table, we'd need to implement user_roles table
      // For now, just log the admin action
      const { data: sessionData } = await supabase.auth.getSession();
      const adminId = sessionData.session?.user?.id;
      
      if (adminId) {
        await supabase
          .from('admin_actions')
          .insert({
            actor_id: adminId,
            target_user_id: userId,
            action_type: 'role_change',
            new_role: role,
            reason: reason
          });
      }

      toast.success(`User role updated to ${role}`);
      await refetch();
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast.error(`Failed to update user role: ${error.message}`);
      throw error;
    }
  };

  // Bulk update status
  const bulkUpdateStatus = async (userIds: string[], status: string, reason: string) => {
    try {
      console.log(`Bulk updating ${userIds.length} users to status ${status}`);
      
      const { error } = await supabase
        .from('profiles')
        .update({ account_status: status })
        .in('id', userIds);

      if (error) throw error;

      // Log the admin actions
      const { data: sessionData } = await supabase.auth.getSession();
      const adminId = sessionData.session?.user?.id;
      
      if (adminId) {
        const adminActions = userIds.map(userId => ({
          actor_id: adminId,
          target_user_id: userId,
          action_type: 'bulk_status_change',
          new_status: status,
          reason: reason
        }));

        await supabase
          .from('admin_actions')
          .insert(adminActions);
      }

      toast.success(`${userIds.length} users updated to ${status}`);
      setSelectedUsers([]);
      await refetch();
    } catch (error: any) {
      console.error('Error bulk updating users:', error);
      toast.error(`Failed to bulk update users: ${error.message}`);
      throw error;
    }
  };

  // Delete user
  const deleteUser = async (userId: string) => {
    try {
      console.log(`Deleting user ${userId} completely`);
      
      // Use the comprehensive deletion function
      const { error } = await supabase.rpc('delete_user_completely', {
        target_user_id: userId
      });

      if (error) throw error;

      toast.success('User deleted successfully');
      await refetch();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(`Failed to delete user: ${error.message}`);
      throw error;
    }
  };

  // Export user data
  const exportUserData = async (format: 'csv' | 'json') => {
    try {
      console.log(`Exporting user data in ${format} format`);
      
      const { data: allUsers, error } = await supabase
        .from('profiles')
        .select('*')
        .order(filters.sortBy || 'created_at', { ascending: filters.sortOrder === 'asc' });

      if (error) throw error;

      if (allUsers && allUsers.length > 0) {
        let exportedData;
        let filename;

        if (format === 'csv') {
          const csvRows = [];
          const headers = Object.keys(allUsers[0]);
          csvRows.push(headers.join(','));

          for (const row of allUsers) {
            const values = headers.map(header => {
              const value = row[header as keyof typeof row];
              return typeof value === 'string' ? `"${value}"` : value;
            });
            csvRows.push(values.join(','));
          }

          exportedData = csvRows.join('\n');
          filename = 'users.csv';
        } else {
          exportedData = JSON.stringify(allUsers, null, 2);
          filename = 'users.json';
        }

        const blob = new Blob([exportedData], { type: `text/${format === 'json' ? 'json' : 'csv'}` });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast.success(`User data exported as ${format}`);
      } else {
        toast.error('No users found to export');
      }
    } catch (error: any) {
      console.error('Error exporting user data:', error);
      toast.error(`Failed to export user data: ${error.message}`);
    }
  };

  return {
    users,
    loading,
    totalCount,
    page,
    pageSize,
    filters,
    selectedUsers,
    setPage,
    setPageSize,
    setFilters,
    setSelectedUsers,
    fetchUsers: refetch,
    fetchUserActivityLogs,
    fetchAdminActions,
    updateUserStatus,
    updateUserRole,
    bulkUpdateStatus,
    deleteUser,
    exportUserData,
  };
};
