import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCallback, useEffect } from 'react';

export interface PostSettings {
  // Basic settings
  max_post_length?: number;
  min_post_length?: number;
  allow_empty_posts?: boolean;
  character_counter_enabled?: boolean;
  auto_save_drafts?: boolean;
  draft_save_interval?: number;
  
  // Media settings
  allow_images?: boolean;
  allow_videos?: boolean;
  allow_audio?: boolean;
  allow_files?: boolean;
  max_images_per_post?: number;
  max_videos_per_post?: number;
  max_files_per_post?: number;
  max_image_size_mb?: number;
  max_video_size_mb?: number;
  max_file_size_mb?: number;
  
  // Visibility and privacy
  default_visibility?: string;
  allow_visibility_change?: boolean;
  require_approval_for_public?: boolean;
  allow_anonymous_posts?: boolean;
  
  // Moderation
  auto_moderation_enabled?: boolean;
  profanity_filter_enabled?: boolean;
  spam_detection_enabled?: boolean;
  manual_review_enabled?: boolean;
  auto_delete_flagged?: boolean;
  moderation_sensitivity?: string;
  
  // Engagement
  allow_reactions?: boolean;
  allow_comments?: boolean;
  allow_shares?: boolean;
  allow_saves?: boolean;
  max_reactions_per_user?: number;
  require_login_for_reactions?: boolean;
  nested_comments_enabled?: boolean;
  max_comment_depth?: number;
  
  // AI Features
  ai_summaries_enabled?: boolean;
  ai_content_classifier_enabled?: boolean;
  smart_mention_suggestions_enabled?: boolean;
  auto_hashtag_generator_enabled?: boolean;
  
  // Advanced features
  thread_posts_enabled?: boolean;
  polls_enabled?: boolean;
  collaborative_posts_enabled?: boolean;
  location_posts_enabled?: boolean;
  voice_to_text_enabled?: boolean;
  
  // Rate limiting
  rate_limiting_enabled?: boolean;
  max_posts_per_hour?: number;
  max_posts_per_day?: number;
  
  // Translation
  auto_translation_enabled?: boolean;
  supported_languages?: string[];
  default_translation_language?: string;
  translate_comments?: boolean;
  translate_captions?: boolean;
  
  // Post scheduling
  post_scheduling_enabled?: boolean;
  bulk_operations_enabled?: boolean;
  post_analytics_enabled?: boolean;
  export_data_enabled?: boolean;
  
  // API and webhooks
  api_access_enabled?: boolean;
  webhook_notifications_enabled?: boolean;
}

const POST_SETTINGS_QUERY_KEY = ['post-settings'];

export function usePostSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: POST_SETTINGS_QUERY_KEY,
    queryFn: async () => {
      console.log('🔄 [DEBUG] Starting post settings fetch...');
      
      try {
        const { data, error } = await supabase.rpc('get_post_settings');
        
        if (error) {
          console.error('❌ [DEBUG] Supabase error:', error);
          throw new Error(`Database error: ${error.message}`);
        }
        
        console.log('✅ [DEBUG] Post settings fetched successfully:', data);
        return data as PostSettings;
      } catch (error) {
        console.error('💥 [DEBUG] Fetch error:', error);
        throw error;
      }
    },
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('post-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_settings'
        },
        (payload) => {
          console.log('🔄 Real-time post settings update:', payload);
          queryClient.invalidateQueries({ queryKey: POST_SETTINGS_QUERY_KEY });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

export function useUpdatePostSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      console.log('🔄 [DEBUG] Updating post setting:', key, '=', value);
      
      const settingsData = { [key]: value };
      
      const { data, error } = await supabase.rpc('update_post_settings', {
        settings_data: settingsData
      });
        
      if (error) {
        console.error('❌ [DEBUG] Error updating post setting:', error);
        throw new Error(error.message);
      }
      
      console.log('✅ [DEBUG] Post setting updated successfully:', data);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: POST_SETTINGS_QUERY_KEY });
      toast.success(`${variables.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} updated successfully.`);
    },
    onError: (error, variables) => {
      console.error('❌ [DEBUG] Mutation error:', error);
      toast.error(`Failed to update ${variables.key.replace(/_/g, ' ')}: ${error.message}`);
    },
  });
}

export function useRealTimePostSettings() {
  const { data: settings, isLoading, error } = usePostSettings();
  const updateSetting = useUpdatePostSetting();

  const updateValue = useCallback(async (key: string, value: any) => {
    try {
      await updateSetting.mutateAsync({ key, value });
    } catch (error) {
      console.error('Failed to update setting:', error);
    }
  }, [updateSetting]);

  return {
    settings: settings || {},
    isLoading,
    error,
    updateValue,
    isUpdating: updateSetting.isPending
  };
}