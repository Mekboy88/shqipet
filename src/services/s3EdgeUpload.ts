/**
 * S3 Upload Service using Supabase Edge Function
 * Integrates with the working s3-upload-fixed edge function
 */

import { supabase } from '@/integrations/supabase/client';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface S3UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

export interface S3EdgeUploadOptions {
  folder?: string;
  filename?: string;
  onProgress?: (progress: UploadProgress) => void;
}

export class S3EdgeUpload {
  private static instance: S3EdgeUpload;
  
  static getInstance(): S3EdgeUpload {
    if (!S3EdgeUpload.instance) {
      S3EdgeUpload.instance = new S3EdgeUpload();
    }
    return S3EdgeUpload.instance;
  }

  /**
   * Upload file using the working s3-upload-fixed edge function
   */
  async uploadFile(file: File, options: S3EdgeUploadOptions = {}): Promise<string> {
    const { folder = 'uploads', filename = file.name, onProgress } = options;

    console.log('🚀 S3EdgeUpload: Starting upload for file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      folder,
      filename
    });

    try {
      // Step 1: Get presigned URL from edge function
      console.log('📡 Calling s3-upload-fixed edge function...');
      const presignedResponse = await supabase.functions.invoke('s3-upload-fixed', {
        body: {
          key: filename,
          contentType: file.type,
          folder: folder,
          fileSize: file.size
        }
      });

      console.log('📡 Edge function response:', presignedResponse);

      if (presignedResponse.error) {
        console.error('❌ Edge function error:', presignedResponse.error);
        throw new Error(`Failed to get presigned URL: ${presignedResponse.error.message}`);
      }

      const { presignedUrl, key } = presignedResponse.data;

      if (!presignedUrl) {
        console.error('❌ No presigned URL in response:', presignedResponse.data);
        throw new Error('No presigned URL received from edge function');
      }

      console.log('✅ Got presigned URL, uploading to S3...', {
        key,
        urlPrefix: presignedUrl.substring(0, 50) + '...'
      });

      // Step 2: Upload file to S3 using presigned URL with progress tracking
      await this.uploadWithProgress(file, presignedUrl, onProgress);

      // Step 3: Return the public URL
      const publicUrl = `https://shqipet.s3.eu-west-2.amazonaws.com/${key}`;
      
      console.log('✅ Upload complete:', publicUrl);
      return publicUrl;

    } catch (error: any) {
      console.error('❌ S3 Edge upload failed:', error);
      throw new Error(error.message || 'Failed to upload file to S3');
    }
  }

  /**
   * Upload file with progress tracking
   */
  private uploadWithProgress(
    file: File,
    presignedUrl: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('📤 Starting XMLHttpRequest upload to S3...');
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100)
          };
          console.log('📊 Upload progress:', progress);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        console.log('📤 Upload response status:', xhr.status);
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('✅ S3 upload successful');
          resolve();
        } else {
          console.error('❌ S3 upload failed with status:', xhr.status, xhr.responseText);
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', (event) => {
        console.error('❌ Network error during S3 upload:', event);
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('timeout', () => {
        console.error('❌ S3 upload timeout');
        reject(new Error('Upload timeout'));
      });

      console.log('📤 Opening PUT request to S3...');
      xhr.open('PUT', presignedUrl);
      xhr.timeout = 300000; // 5 minutes timeout
      
      // CRITICAL FIX: Do NOT set Content-Type header manually!
      // The presigned URL already includes Content-Type in its signature
      // Setting it manually will cause a signature mismatch (403 error)
      console.log('🚫 NOT setting Content-Type header - using presigned URL signature');
      
      console.log('📤 Sending file to S3...', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });
      
      xhr.send(file);
    });
  }

  /**
   * Check file size limits based on file type
   */
  validateFileSize(file: File): { valid: boolean; error?: string } {
    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? 500 * 1024 * 1024 : 100 * 1024 * 1024; // 500MB for videos, 100MB for others
    
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return {
        valid: false,
        error: `File size exceeds ${maxSizeMB}MB limit for ${isVideo ? 'videos' : 'files'}`
      };
    }
    
    return { valid: true };
  }

  /**
   * Upload multiple files
   */
  async uploadMultiple(
    files: File[],
    options: S3EdgeUploadOptions = {}
  ): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, options));
    return Promise.all(uploadPromises);
  }

  /**
   * Test S3 connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await supabase.functions.invoke('test-s3-connection');
      return !response.error;
    } catch (error) {
      console.error('S3 connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const s3EdgeUpload = S3EdgeUpload.getInstance();

// Export convenience function
export const uploadToS3Edge = (file: File, options?: S3EdgeUploadOptions): Promise<string> => {
  return s3EdgeUpload.uploadFile(file, options);
};