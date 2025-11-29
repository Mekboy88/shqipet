
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserActivityLog, AdminAction } from '@/types/user';

interface Filters {
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
}

interface UseUserQueriesProps {
  setUsers: (users: UserProfile[]) => void;
  setLoading: (loading: boolean) => void;
  setTotalCount: (count: number) => void;
  page: number;
  pageSize: number;
  filters: Filters;
}

export const useUserQueries = (props?: Partial<UseUserQueriesProps>) => {
  const {
    setUsers = () => {},
    setLoading = () => {},
    setTotalCount = () => {},
    page = 1,
    pageSize = 10,
    filters = {} as Filters,
  } = props || {};

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
      toast.error(error.message || 'An unknown error occurred');
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
      toast.error(error.message || 'An unknown error occurred');
      return [];
    }
  };

  // Export user data in CSV or JSON format
  const exportUserData = async (format: string) => {
    try {
      console.log(`Exporting user data in ${format} format`);
      setLoading(true);
      
      // Fetch all users without pagination
      const { data: allUsers, error } = await supabase
        .from('profiles')
        .select('*')
        .order(filters.sortBy || 'created_at', { ascending: filters.sortOrder === 'asc' });

      if (error) throw error;

      if (allUsers) {
        let exportedData;
        let filename;

        if (format === "csv") {
          // Convert JSON data to CSV format
          const csvRows = [];
          const headers = Object.keys(allUsers[0]);
          csvRows.push(headers.join(','));

          for (const row of allUsers) {
            const values = headers.map(header => {
              const value = row[header as keyof typeof row];
              return typeof value === 'string' ? `"${value}"` : value; // Quote strings
            });
            csvRows.push(values.join(','));
          }

          exportedData = csvRows.join('\n');
          filename = 'users.csv';
        } else if (format === "json") {
          exportedData = JSON.stringify(allUsers, null, 2);
          filename = 'users.json';
        } else {
          throw new Error("Invalid format specified");
        }

        // Create a Blob from the data
        const blob = new Blob([exportedData], { type: `text/${format === "json" ? 'json' : 'csv'}` });
        const url = window.URL.createObjectURL(blob);

        // Create a link to download the data
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast(`User data has been exported in ${format} format.`);
      }
    } catch (error: any) {
      console.error('Error exporting user data:', error);
      toast.error(error.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchUserActivityLogs,
    fetchAdminActions,
    exportUserData
  };
};
