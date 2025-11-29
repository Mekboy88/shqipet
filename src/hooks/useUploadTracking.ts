import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UploadTrackingData {
  id?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  postId?: string;
}

export const useUploadTracking = () => {
  const [isTracking, setIsTracking] = useState(false);

  const startUploadTracking = useCallback(async (data: UploadTrackingData) => {
    try {
      setIsTracking(true);
      
      const { data: logData, error } = await supabase
        .from('upload_logs')
        .insert({
          file_name: data.fileName,
          file_size: data.fileSize,
          file_type: data.fileType,
          post_id: data.postId,
          upload_status: 'pending',
          progress: 0,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to start upload tracking:', error);
        return null;
      }

      console.log('Upload tracking started:', logData);
      return logData.id;
    } catch (error) {
      console.error('Error starting upload tracking:', error);
      return null;
    }
  }, []);

  const updateUploadProgress = useCallback(async (logId: string, progress: number) => {
    try {
      const { error } = await supabase
        .from('upload_logs')
        .update({
          progress,
          upload_status: progress === 100 ? 'completed' : 'uploading'
        })
        .eq('id', logId);

      if (error) {
        console.error('Failed to update upload progress:', error);
      }
    } catch (error) {
      console.error('Error updating upload progress:', error);
    }
  }, []);

  const completeUploadTracking = useCallback(async (
    logId: string, 
    uploadUrl: string,
    success: boolean = true
  ) => {
    try {
      const { error } = await supabase
        .from('upload_logs')
        .update({
          upload_status: success ? 'completed' : 'failed',
          upload_url: uploadUrl,
          progress: success ? 100 : 0,
          completed_at: new Date().toISOString()
        })
        .eq('id', logId);

      if (error) {
        console.error('Failed to complete upload tracking:', error);
      }

      setIsTracking(false);
    } catch (error) {
      console.error('Error completing upload tracking:', error);
      setIsTracking(false);
    }
  }, []);

  const failUploadTracking = useCallback(async (logId: string, errorMessage: string) => {
    try {
      const { error } = await supabase
        .from('upload_logs')
        .update({
          upload_status: 'failed',
          error_message: errorMessage,
          completed_at: new Date().toISOString()
        })
        .eq('id', logId);

      if (error) {
        console.error('Failed to log upload failure:', error);
      }

      setIsTracking(false);
      toast.error('Upload failed', { description: errorMessage });
    } catch (error) {
      console.error('Error logging upload failure:', error);
      setIsTracking(false);
    }
  }, []);

  return {
    isTracking,
    startUploadTracking,
    updateUploadProgress,
    completeUploadTracking,
    failUploadTracking
  };
};
