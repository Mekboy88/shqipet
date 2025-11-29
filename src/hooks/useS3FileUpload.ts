import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { s3EdgeUpload } from '@/services/s3EdgeUpload';
import { useUploadTracking } from '@/hooks/useUploadTracking';

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  filePath?: string;
  fileName?: string;
  fileSize?: number;
  uploadId?: string;
  error?: string;
  details?: string;
}

export interface EnhancedUploadProgress {
  uploadId: string;
  fileName: string;
  progress: number;
  percentage: number;
  stage: 'preparing' | 'uploading' | 'processing' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  fileSize: number;
  uploadedBytes: number;
  speed?: number;
  timeRemaining?: number;
  error?: string;
}

interface FileUploadHookReturn {
  uploadFile: (file: File, options?: { filePath?: string }) => Promise<string>;
  uploadProgress: EnhancedUploadProgress | null;
  isUploading: boolean;
  error: string | null;
  uploadHistory: UploadResult[];
  clearHistory: () => void;
  testConnection: (showToast?: boolean) => Promise<boolean>;
  s3Status: {
    enabled: boolean;
    configured: boolean;
    lastTest?: Date;
  };
  connectionStatus: { isOnline: boolean; connectionQuality: string; };
}

export const useS3FileUpload = (): FileUploadHookReturn => {
  const [uploadProgress, setUploadProgress] = useState<EnhancedUploadProgress | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
const [uploadHistory, setUploadHistory] = useState<UploadResult[]>([]);

  const { startUploadTracking, updateUploadProgress, completeUploadTracking, failUploadTracking } = useUploadTracking();

  const generateUploadId = () => `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const updateProgress = useCallback((updates: Partial<EnhancedUploadProgress>) => {
    setUploadProgress(prev => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  }, []);

  const uploadFile = useCallback(async (file: File, options?: { filePath?: string }): Promise<string> => {
    console.log('🚀 Starting S3 upload for:', file.name);
    
    // Basic file size validation (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      throw new Error('File size must be less than 50MB');
    }
    
    const uploadId = generateUploadId();
    const startTime = new Date();
    
    const initialProgress: EnhancedUploadProgress = {
      uploadId,
      fileName: file.name,
      progress: 0,
      percentage: 0,
      stage: 'preparing',
      startTime,
      fileSize: file.size,
      uploadedBytes: 0
    };
    
    setUploadProgress(initialProgress);
    setIsUploading(true);
setError(null);

    // DB tracking id for upload_logs
    let logId: string | null = null;

    try {
      // Stage 1: Preparing
      updateProgress({ stage: 'preparing', progress: 10 });
      
// Stage 2: Uploading to S3 (tracked)
      updateProgress({ stage: 'uploading', progress: 20 });

      // Start DB tracking
      logId = await startUploadTracking({ fileName: file.name, fileSize: file.size, fileType: file.type });

      const finalUrl = await s3EdgeUpload.uploadFile(file, {
        folder: 'posts',
        filename: file.name,
        onProgress: (p) => {
          updateProgress({
            stage: 'uploading',
            progress: 20 + Math.round((p.percentage || 0) * 0.6),
            percentage: p.percentage,
            uploadedBytes: p.loaded
          });
          if (logId) {
            updateUploadProgress(logId, p.percentage);
          }
        }
      });

      // Stage 3: Processing
      updateProgress({ stage: 'processing', progress: 85 });
      await new Promise(resolve => setTimeout(resolve, 300));

      if (logId) {
        await completeUploadTracking(logId, finalUrl, true);
      }

      // Stage 4: Completed
      updateProgress({ 
        stage: 'completed', 
        progress: 100,
        uploadedBytes: file.size,
        percentage: 100,
        endTime: new Date()
      });
      
const uploadResult: UploadResult = {
        success: true,
        fileUrl: finalUrl,
        fileName: file.name,
        fileSize: file.size,
        uploadId,
      };
      
      setUploadHistory(prev => [...prev, uploadResult]);
      
toast.success('File uploaded successfully!', {
        description: `${file.name} uploaded to S3`,
        duration: 3000,
      });
      
      console.log('✅ S3 upload completed:', finalUrl);
      return finalUrl;
      
    } catch (error: any) {
console.error('❌ S3 upload failed:', error);
      updateProgress({ stage: 'failed', progress: 0 });
      setError(error.message || 'Upload failed');
      
      if (logId) {
        await failUploadTracking(logId, error.message || 'Upload failed');
      }
      
      toast.error('Upload failed', {
        description: error.message || 'Failed to upload file to S3',
        duration: 5000,
      });
      
      throw error;
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(null), 3000);
    }
  }, [updateProgress]);

  const testConnection = useCallback(async (showToast = false): Promise<boolean> => {
try {
      const ok = await s3EdgeUpload.testConnection();
      if (showToast) {
        toast[ok ? 'success' : 'error'](ok ? 'S3 connection successful!' : 'S3 connection failed!');
      }
      return ok;
    } catch (error) {
      console.error('S3 connection test failed:', error);
      if (showToast) {
        toast.error('S3 connection failed! Check your credentials.');
      }
      return false;
    }
  }, []);

  const clearHistory = useCallback(() => {
    setUploadHistory([]);
    toast.info('Upload history cleared');
  }, []);

  return {
    uploadFile,
    uploadProgress,
    isUploading,
    error,
    uploadHistory,
    clearHistory,
    testConnection,
    s3Status: {
      enabled: true,
      configured: true,
      lastTest: new Date()
    },
    connectionStatus: { isOnline: true, connectionQuality: 'excellent' }
  };
};