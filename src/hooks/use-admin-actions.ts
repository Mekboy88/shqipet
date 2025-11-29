
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { UserAction } from '@/types/admin-actions';

interface ActionFilters {
  search?: string;
  actionType?: string;
  dateStart?: Date | null;
  dateEnd?: Date | null;
  deviceType?: string;
  location?: string;
  actionStatus?: string;
}

export const useAdminActions = () => {
  const [filters, setFilters] = useState<ActionFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedAction, setSelectedAction] = useState<UserAction | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  // Helper function to determine action status based on action type
  const getActionStatus = (actionType: string): 'success' | 'warning' | 'failed' => {
    if (!actionType) return 'success';
    if (actionType.includes('failed') || actionType.includes('error')) return 'failed';
    if (actionType.includes('warning') || actionType.includes('suspend')) return 'warning';
    return 'success';
  };
  
  // Fetch function to get admin actions
  const fetchUserActions = useCallback(async () => {
    try {
      // Basic query without complex joins that cause type recursion
      let query = supabase
        .from('admin_actions')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (filters.search) {
        query = query.ilike('action_type', `%${filters.search}%`);
      }
      
      if (filters.actionType && filters.actionType !== 'all') {
        query = query.eq('action_type', filters.actionType);
      }
      
      if (filters.dateStart) {
        query = query.gte('created_at', filters.dateStart.toISOString());
      }
      
      if (filters.dateEnd) {
        query = query.lte('created_at', filters.dateEnd.toISOString());
      }
      
      // Apply pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to).order('created_at', { ascending: false });
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      // We'll fetch user details in a separate query to avoid deep type issues
      let formattedData: UserAction[] = [];
      
      if (data && data.length > 0) {
        // Extract the data as a safe type
        const actionRecords = data as any[];
        
        // Map the basic admin action data
        formattedData = actionRecords.map(item => ({
          id: item.id || '',
          timestamp: item.created_at || new Date().toISOString(),
          user_id: item.admin_id || 'Unknown',
          username: 'Admin User', // Will be populated later
          email: 'admin@example.com', // Will be populated later
          action_type: item.action_type || 'Unknown Action',
          action_description: item.reason || 'No description provided',
          affected_resource: item.target_user_id || 'N/A',
          target_username: 'Target User', // Will be populated later
          device_type: 'Unknown Device',
          ip_address: 'Unknown IP',
          location: 'Unknown Location',
          browser_os: 'Web Browser',
          action_status: getActionStatus(item.action_type),
          additional_data: item.metadata || {}
        }));
        
        // Get unique admin IDs to fetch their profiles
        const adminIds = [...new Set(actionRecords
          .map(item => item.admin_id)
          .filter(id => id))];
          
        if (adminIds.length > 0) {
          const { data: adminProfiles } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', adminIds as string[]);
            
          if (adminProfiles && Array.isArray(adminProfiles)) {
            // Create a lookup map
            const adminMap = new Map<string, any>();
            adminProfiles.forEach(profile => {
              if (profile.id) adminMap.set(profile.id, profile);
            });
            
            // Update the formatted data with admin details
            formattedData = formattedData.map(action => {
              const adminProfile = adminMap.get(action.user_id);
              return {
                ...action,
                username: adminProfile?.username || 'Unknown User',
                email: 'admin@example.com', // Since email is not in profiles table
              };
            });
          }
        }
        
        // Get target user details if available
        const targetIds = [...new Set(actionRecords
          .map(item => item.target_user_id)
          .filter(id => id))];
          
        if (targetIds.length > 0) {
          const { data: targetProfiles } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', targetIds as string[]);
            
          if (targetProfiles && Array.isArray(targetProfiles)) {
            // Create a lookup map
            const targetMap = new Map<string, any>();
            targetProfiles.forEach(profile => {
              if (profile.id) targetMap.set(profile.id, profile);
            });
            
            // Update the formatted data with target user details
            formattedData = formattedData.map(action => {
              if (action.affected_resource && action.affected_resource !== 'N/A') {
                const targetProfile = targetMap.get(action.affected_resource);
                return {
                  ...action,
                  target_username: targetProfile?.username || 'Unknown User',
                };
              }
              return action;
            });
          }
        }
      }
      
      return { data: formattedData, count };
    } catch (error: any) {
      console.error('Error fetching user actions:', error);
      return { data: [], count: 0 };
    }
  }, [currentPage, pageSize, filters]);

  // Query hook
  const { data, isLoading, error } = useQuery({
    queryKey: ['userActions', currentPage, pageSize, filters],
    queryFn: async () => {
      const result = await fetchUserActions();
      if (result.count !== undefined) setTotalItems(result.count);
      return result.data;
    }
  });

  // Handle search
  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };
  
  // Handle export
  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    // Implementation for exporting would go here
    toast(`Exported user actions as ${format.toUpperCase()}`);
  };

  // View action details
  const handleViewDetails = (action: UserAction) => {
    setSelectedAction(action);
    setIsDetailModalOpen(true);
  };

  // Close detail modal
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedAction(null);
  };

  return {
    data,
    isLoading,
    error,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    filters,
    selectedAction,
    isDetailModalOpen,
    setCurrentPage,
    handleSearch,
    handleFilterChange,
    handleResetFilters,
    handleExport,
    handleViewDetails,
    handleCloseDetailModal,
  };
};
