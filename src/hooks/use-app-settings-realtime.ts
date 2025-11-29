import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

import { toast } from 'sonner';

export type AppSettings = any;
export type AppSettingsUpdate = any;

const SETTINGS_QUERY_KEY = ['app-settings'];

export function useAppSettings() {
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('app_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'app_settings'
        },
        (payload) => {
          console.log('🔄 [DEBUG] Real-time app settings change:', payload);
          // Invalidate and refetch the query when data changes
          queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
        }
      )
      .subscribe();

    return () => {
      console.log('🔌 [DEBUG] Unsubscribing from app settings real-time channel');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

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
          console.warn('⚠️ [DEBUG] No app settings found, will be created on first update');
          return null;
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
    onSuccess: (data) => {
      // Update the query cache immediately with the new data
      queryClient.setQueryData(SETTINGS_QUERY_KEY, data);
      toast.success('Settings updated successfully.');
    },
    onError: (error) => {
      console.error('❌ [DEBUG] Mutation error:', error);
      toast.error(`Failed to update settings: ${error.message}`);
    },
  });
}