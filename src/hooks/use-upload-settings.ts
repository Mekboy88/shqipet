import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { notificationManager } from '@/utils/notificationManager';
import { useCallback, useEffect, useState } from 'react';

export interface UploadSettings {
  // General upload settings
  file_upload_enabled?: boolean;
  video_upload_enabled?: boolean;
  reels_upload_enabled?: boolean;
  audio_upload_enabled?: boolean;
  
  // File type settings
  allowed_extensions?: string;
  blocked_extensions?: string;
  allowed_mime_types?: string;
  allowed_video_extensions?: string;
  
  // Security settings
  malware_scanning?: boolean;
  ai_threat_detection?: boolean;
  exif_stripping_enabled?: boolean;
  video_metadata_sanitization?: boolean;
  uuid_filenames?: boolean;
  private_storage?: boolean;
  
  // Size limits
  max_image_size?: number;
  max_video_size?: number;
  max_document_size?: number;
  max_audio_size?: number;
  
  // Image settings
  image_resolution_limit?: boolean;
  max_image_resolution?: string;
  compression_level?: string;
  
  // Video processing
  ffmpeg_transcoding?: boolean;
  hls_adaptive_streaming?: boolean;
  thumbnail_generation?: boolean;
  thumbnail_count?: number;
  
  // Storage and CDN
  storage_provider?: string;
  cdn_distribution?: string;
  signed_url_expiry?: number;
  multi_cdn_routing?: boolean;
  primary_cdn?: string;
  fallback_cdn?: string;
  
  // User quotas
  free_user_quota?: number;
  premium_user_quota?: number;
  admin_user_quota?: number;
  quota_enforcement?: boolean;
  retention_days?: number;
  auto_cleanup?: boolean;
  
  // Silent quota system
  silent_quota_enabled?: boolean;
  free_daily_limit?: number;
  premium_daily_limit?: number;
  
  // Abuse detection
  abuse_detection_enabled?: boolean;
  rapid_upload_threshold?: number;
  
  // Auto archive
  auto_archive_enabled?: boolean;
  archive_after_days?: number;
  
  // Moderation
  manual_moderation?: boolean;
  auto_approve_images?: boolean;
  auto_approve_videos?: boolean;
  auto_approve_audio?: boolean;
  user_based_auto_approve?: boolean;
  auto_approve_verified?: boolean;
  auto_approve_premium?: boolean;
  
  // Versioning
  versioning_enabled?: boolean;
  max_versions?: number;
  premium_max_versions?: number;
  
  // Upload experience
  progress_bar_enabled?: boolean;
  chunk_size_mode?: string;
  resumable_uploads?: boolean;
  parallel_uploads?: boolean;
  upload_notifications?: boolean;
  
  // Audit and logging
  audit_logging?: boolean;
  log_retention?: number;
  log_detail?: string;
  
  // AWS S3 Integration
  s3_enabled?: boolean;
  s3_bucket_name?: string;
  s3_aws_region?: string;
  s3_access_key_id?: string;
  s3_secret_access_key?: string;
  s3_use_signed_urls?: boolean;
  s3_signed_url_expiry?: number;
  s3_save_photos?: boolean;
  s3_save_videos?: boolean;
  s3_save_audio?: boolean;
  s3_save_documents?: boolean;
  s3_fallback_to_supabase?: boolean;
  
  // Audit fields
  last_saved_at?: string;
  last_saved_by_name?: string;
  last_saved_by_role?: string;
  last_saved_config_hash?: string;
  last_saved_fingerprint?: string;
}

const UPLOAD_SETTINGS_QUERY_KEY = ['upload-settings'];

export function useUploadSettings() {
  const queryClient = useQueryClient();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastHeartbeat, setLastHeartbeat] = useState<Date>(new Date());

  const query = useQuery({
    queryKey: UPLOAD_SETTINGS_QUERY_KEY,
    queryFn: async () => {
      console.log('🔄 Fetching upload settings...');
      
      try {
        const { data, error } = await supabase.rpc('get_upload_configuration');
        
        if (error) {
          console.error('❌ Database error:', error);
          throw new Error(`Database error: ${error.message}`);
        }
        
        console.log('✅ Settings loaded successfully');
        setLastHeartbeat(new Date());
        setConnectionStatus('connected');
        return data as UploadSettings;
      } catch (error) {
        console.error('❌ Fetch error:', error);
        setConnectionStatus('disconnected');
        throw error;
      }
    },
    retry: 2,
    retryDelay: 2000,
    refetchOnWindowFocus: false, // Reduce unnecessary refetches
    refetchOnReconnect: true,
    staleTime: 60000, // Cache for 1 minute to reduce load
    gcTime: 300000, // Keep cache for 5 minutes
  });

  // Set up optimized real-time subscription
  useEffect(() => {
    console.log('📡 Setting up real-time connection...');
    
    // Don't start as connected until actually subscribed
    setConnectionStatus('reconnecting');
    setLastHeartbeat(new Date());
    
    const channel = supabase
      .channel('upload-config-instant', {
        config: {
          broadcast: { self: true },
          presence: { key: 'admin-config' }
        }
      })
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'upload_configuration' 
        },
        (payload) => {
          console.log('🚀 [INSTANT-SYNC] INSTANT database change detected:', payload);
          setLastHeartbeat(new Date());
          
          // Force immediate refresh - no delays
          queryClient.invalidateQueries({ queryKey: UPLOAD_SETTINGS_QUERY_KEY });
          queryClient.refetchQueries({ queryKey: UPLOAD_SETTINGS_QUERY_KEY });
          
          // Show instant notification
          notificationManager.showNotification('Configuration Updated Instantly', { 
            body: `Changed: ${Object.keys(payload.new || {}).join(', ')}` 
          });
          notificationManager.playSound('success');
        }
      )
      .subscribe((status) => {
        console.log('📡 [INSTANT-SYNC] Connection status:', status);
        
        switch (status) {
          case 'SUBSCRIBED':
            setConnectionStatus('connected');
            setLastHeartbeat(new Date());
            setReconnectAttempts(0);
            console.log('✅ [INSTANT-SYNC] Real-time updates ACTIVE');
            break;
          case 'CHANNEL_ERROR':
          case 'TIMED_OUT':
          case 'CLOSED':
            setConnectionStatus('reconnecting');
            setReconnectAttempts(prev => prev + 1);
            console.warn('⚠️ [INSTANT-SYNC] Connection issue, reconnecting...');
            break;
        }
      });

    // Reduced heartbeat frequency to prevent platform overload
    const heartbeatInterval = setInterval(() => {
      setLastHeartbeat(new Date());
      
      // Only send heartbeat if connection is active, with much reduced frequency
      if (connectionStatus === 'connected') {
        channel.send({
          type: 'broadcast',
          event: 'heartbeat',
          payload: { timestamp: Date.now() }
        });
      }
    }, 30000); // Every 30 seconds instead of every second

    return () => {
      console.log('🧹 [INSTANT-SYNC] Cleaning up real-time connection...');
      clearInterval(heartbeatInterval);
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { 
    ...query, 
    connectionStatus,
    reconnectAttempts,
    lastHeartbeat 
  };
}

export function useUpdateUploadSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      console.log('⚡ [REAL-TIME] Updating upload setting:', key, '=', value);
      
      const settingsData = { [key]: value };
      
      const { data, error } = await supabase.rpc('update_upload_configuration', {
        config_data: settingsData
      });
        
      if (error) {
        console.error('❌ [REAL-TIME] Error updating upload setting:', error);
        throw new Error(error.message);
      }
      
      console.log('✅ [REAL-TIME] Upload setting updated successfully:', data);
      return data;
    },
    onMutate: async (variables) => {
      console.log('⚡ [INSTANT-SYNC] IMMEDIATE optimistic update for:', variables.key, '=', variables.value);
      
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: UPLOAD_SETTINGS_QUERY_KEY });
      
      // Snapshot the previous value
      const previousData = queryClient.getQueryData(UPLOAD_SETTINGS_QUERY_KEY);
      
      // Optimistically update to the new value
      queryClient.setQueryData(UPLOAD_SETTINGS_QUERY_KEY, (old: any) => ({
        ...old,
        [variables.key]: variables.value,
        updated_at: new Date().toISOString(),
        last_saved_by_name: 'You (updating...)',
        last_saved_by_role: 'admin'
      }));
      
      // Show immediate feedback
      notificationManager.showNotification('Applying Change...', { 
        body: `Setting ${variables.key.replace(/_/g, ' ')} instantly` 
      });
      
      return { previousData };
    },
    onSuccess: async (_, variables) => {
      console.log('✅ [INSTANT-SYNC] Database confirmed update for:', variables.key);
      
      // Force immediate data refresh to sync with database
      await queryClient.invalidateQueries({ queryKey: UPLOAD_SETTINGS_QUERY_KEY });
      await queryClient.refetchQueries({ queryKey: UPLOAD_SETTINGS_QUERY_KEY });
      
      const title = `${variables.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Updated Instantly`;
      notificationManager.showNotification(title, { body: 'Database synchronized in real-time!' });
      notificationManager.playSound('success');
      
      // Log the change for admin audit
      try {
        await supabase.from('admin_notifications').insert({
          title,
          message: `Real-time change: ${variables.key} = ${variables.value}`,
          notification_type: 'instant_sync',
          read: false,
        });
      } catch (logError) {
        console.warn('Failed to log admin notification:', logError);
      }
    },
    onError: (error, variables, context) => {
      console.error('❌ [INSTANT-SYNC] Database rejected change:', error);
      
      // Rollback optimistic update immediately
      if (context?.previousData) {
        queryClient.setQueryData(UPLOAD_SETTINGS_QUERY_KEY, context.previousData);
      }
      
      const failTitle = `Failed: ${variables.key.replace(/_/g, ' ')}`;
      notificationManager.showNotification(failTitle, { 
        body: `Error: ${error.message || 'Real-time sync failed - changes rolled back'}` 
      });
      notificationManager.playSound('warning');
    },
  });
}

export function useRealTimeUploadSettings() {
  const { data: settings, isLoading, error, connectionStatus, reconnectAttempts, lastHeartbeat } = useUploadSettings();
  const updateSetting = useUpdateUploadSetting();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [changeHistory, setChangeHistory] = useState<Array<{
    id: string;
    timestamp: Date;
    user: { name: string | null; role: string | null };
    action: string;
    setting: string;
    value: any;
    enabled: boolean;
  }>>([]);

  // Extract admin information from settings
  const lastSavedBy = settings ? {
    name: settings.last_saved_by_name || null,
    role: settings.last_saved_by_role || null
  } : null;

  const updateValue = useCallback(async (key: string, value: any) => {
    console.log('⚡ [INSTANT-SYNC] Triggering real-time update for:', key, '=', value);
    
    // Get current user info for change tracking
    const { data: { user } } = await supabase.auth.getUser();
    const currentUser = {
      name: user?.user_metadata?.first_name && user?.user_metadata?.last_name 
        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}` 
        : user?.email || 'Admin User',
      role: 'admin', // Could be enhanced to get actual role
      email: user?.email
    };
    
    try {
      // INSTANT NOTIFICATION - Show change immediately
      const changeTitle = `${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} ${typeof value === 'boolean' ? (value ? 'Enabled' : 'Disabled') : 'Updated'}`;
      notificationManager.showNotification(`⚡ ${changeTitle}`, { 
        body: `Changed by: ${currentUser.name} | Value: ${typeof value === 'boolean' ? (value ? 'ON' : 'OFF') : value}` 
      });
      notificationManager.playSound('success');
      
      await updateSetting.mutateAsync({ key, value });
      setLastUpdated(new Date());
      
      // Add to change history with full user info
      const newChange = {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        user: currentUser,
        action: typeof value === 'boolean' ? 
          `${value ? '✅ Enabled' : '❌ Disabled'} ${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}` :
          `🔧 Changed ${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} to "${value}"`,
        setting: key,
        value: value,
        enabled: typeof value === 'boolean' ? value : true
      };
      
      setChangeHistory(prev => [newChange, ...prev].slice(0, 50)); // Keep more history
      
      // INSTANT BROADCAST to other admin sessions
      const channel = supabase.channel('admin-changes-broadcast');
      await channel.send({
        type: 'broadcast',
        event: 'setting_changed',
        payload: {
          change: newChange,
          timestamp: Date.now(),
          user: currentUser
        }
      });
      
      // INSTANT ADMIN NOTIFICATION
      await supabase.from('admin_notifications').insert({
        title: `⚡ ${changeTitle}`,
        message: `Real-time change by ${currentUser.name}: ${key} = ${value}`,
        notification_type: 'instant_change',
        read: false,
        metadata: {
          setting: key,
          old_value: settings?.[key as keyof typeof settings],
          new_value: value,
          changed_by: currentUser,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (error) {
      console.error('❌ [INSTANT-SYNC] Failed to update setting:', error);
      notificationManager.showNotification('❌ Change Failed', { 
        body: `Failed to update ${key}: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
      notificationManager.playSound('warning');
    }
  }, [updateSetting, settings]);

  // Use database timestamp if available, fallback to local timestamp
  const effectiveLastUpdated = settings?.last_saved_at 
    ? new Date(settings.last_saved_at) 
    : lastUpdated;

  return {
    settings: settings || {},
    isLoading,
    error,
    updateValue,
    isUpdating: updateSetting.isPending,
    connectionStatus: connectionStatus || 'disconnected',
    reconnectAttempts,
    lastHeartbeat,
    lastUpdated: effectiveLastUpdated,
    lastSavedBy,
    changeHistory
  };
}