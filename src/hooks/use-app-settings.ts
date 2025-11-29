
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

import { toast } from 'sonner';

export type AppSettings = any;
export type AppSettingsUpdate = any;

const SETTINGS_QUERY_KEY = ['app-settings'];

export function useAppSettings() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: async () => {
      console.log('🔄 [DEBUG] Starting app settings fetch...');
      
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .eq('id', 1)
          .maybeSingle();
        
        if (error) {
          console.error('❌ [DEBUG] Supabase error:', error);
          throw new Error(`Database error: ${error.message}`);
        }
        
        if (!data) {
          console.warn('⚠️ [DEBUG] No app settings found, returning defaults');
          // Return default settings if no row exists
          return {
            id: 1,
            developer_mode: false,
            maintenance_countdown_enabled: false,
            maintenance_return_time: 2,
            maintenance_super_admin_bypass: true,
            maintenance_production_only: true,
            // Add other default values as needed
          };
        }
        
        console.log('✅ [DEBUG] App settings fetched successfully:', data);
        return data;
      } catch (error) {
        console.error('💥 [DEBUG] Fetch error:', error);
        throw error;
      }
    },
    retry: 1,
    retryDelay: 1000,
  });
}

export function useUpdateAppSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: AppSettingsUpdate) => {
      console.log('🔄 [DEBUG] Updating app settings...', settings);
      
      // Use upsert to insert if row doesn't exist, update if it does
      const { data, error } = await supabase
        .from('app_settings')
        .upsert({ id: 1, ...settings })
        .select()
        .single();
        
      if (error) {
        console.error('❌ [DEBUG] Error updating app settings:', error);
        throw new Error(error.message);
      }
      
      console.log('✅ [DEBUG] App settings updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
      toast.success('Settings updated successfully.');
    },
    onError: (error) => {
      console.error('❌ [DEBUG] Mutation error:', error);
      toast.error(`Failed to update settings: ${error.message}`);
    },
  });
}
