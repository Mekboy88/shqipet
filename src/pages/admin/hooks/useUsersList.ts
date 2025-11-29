
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { SimpleUserProfile, UserFilters } from '../types/impersonation-types';

export const useUsersList = () => {
  const [users, setUsers] = useState<SimpleUserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<UserFilters>({});
  
  const pageSize = 10;

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [filters]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      // Build query with only existing columns
      let query = supabase
        .from('profiles')
        .select(`
          id,
          username,
          email,
          first_name,
          last_name,
          account_status,
          last_login,
          created_at,
          primary_role
        `, { count: 'exact' })
        .eq('is_hidden', false) // SECURITY: Never show hidden users
        .neq('primary_role', 'platform_owner_root'); // SECURITY: Never show platform owner
      
      // Apply filters
      if (memoizedFilters.search) {
        const searchTerm = `%${memoizedFilters.search}%`;
        query = query.or(`username.ilike.${searchTerm},first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},email.ilike.${searchTerm}`);
      }
      
      if (memoizedFilters.accountStatus && memoizedFilters.accountStatus !== 'all') {
        query = query.eq('account_status', memoizedFilters.accountStatus);
      }
      
      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to).order('created_at', { ascending: false });
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      // Transform data to match our interface (security filtering already done at DB level)
      const transformedUsers: SimpleUserProfile[] = (data || []).map((user: any) => ({
        id: user.id as string,
        username: user.username as string | null,
        email: user.email as string | null,
        first_name: user.first_name as string | null,
        last_name: user.last_name as string | null,
        account_status: user.account_status as string | null,
        role: null, // Set default since role doesn't exist in profiles
        last_login: user.last_login as string | null,
        created_at: user.created_at as string | null,
      }));
      
      setUsers(transformedUsers);
      setTotalCount(count || 0);
      
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users', {
        description: error.message
      });
      setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, memoizedFilters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateFilters = useCallback((newFilters: UserFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  return {
    users,
    loading,
    totalCount,
    page,
    pageSize,
    filters,
    setPage,
    updateFilters
  };
};
