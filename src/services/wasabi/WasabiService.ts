import { supabase } from '@/integrations/supabase/client';

export interface WasabiUploadOptions {
  filename: string;
  contentType: string;
  fileSize: number;
  metadata?: Record<string, string>;
  isPublic?: boolean;
  bucketName?: string;
}

export interface WasabiDownloadOptions {
  fileId?: string;
  fileKey?: string;
  directDownload?: boolean;
}

export interface WasabiListOptions {
  prefix?: string;
  maxKeys?: number;
  continuationToken?: string;
  includeMetadata?: boolean;
  userFilesOnly?: boolean;
  source?: 'database' | 'storage' | 'both';
}

export interface WasabiMetadataOptions {
  fileId?: string;
  fileKey?: string;
  metadata?: Record<string, string>;
  updateStorage?: boolean;
  source?: 'database' | 'storage' | 'both';
}

export interface WasabiPermissionOptions {
  fileId: string;
  targetUserId?: string;
  permissionType?: 'read' | 'write' | 'delete' | 'admin';
  expiresAt?: string;
}

export class WasabiService {
  /**
   * Upload a file to Wasabi storage
   */
  static async uploadFile(file: File, options: Partial<WasabiUploadOptions> = {}): Promise<any> {
    try {
      console.log('🚀 Starting Wasabi upload:', file.name);

      const uploadOptions: WasabiUploadOptions = {
        filename: file.name,
        contentType: file.type,
        fileSize: file.size,
        isPublic: false,
        bucketName: 'default',
        ...options
      };

      // Get presigned URL from our edge function
      const { data: uploadData, error } = await supabase.functions.invoke('wasabi-upload', {
        body: uploadOptions
      });

      if (error || !uploadData.success) {
        throw new Error(uploadData?.error || 'Failed to prepare upload');
      }

      // Upload file using presigned URL
      const uploadResponse = await fetch(uploadData.presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        }
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      // Update upload status to completed
      await supabase
        .from('wasabi_files')
        .update({ upload_status: 'completed' })
        .eq('id', uploadData.fileId);

      console.log('✅ File uploaded successfully');
      
      return {
        success: true,
        fileId: uploadData.fileId,
        fileKey: uploadData.fileKey,
        fileUrl: uploadData.fileUrl
      };

    } catch (error: any) {
      console.error('❌ Upload failed:', error);
      throw error;
    }
  }

  /**
   * Download a file from Wasabi storage
   */
  static async downloadFile(options: WasabiDownloadOptions): Promise<any> {
    try {
      console.log('📥 Starting Wasabi download');

      const { data, error } = await supabase.functions.invoke('wasabi-download', {
        body: options
      });

      if (error || !data.success) {
        throw new Error(data?.error || 'Download failed');
      }

      console.log('✅ Download URL generated');
      return data;

    } catch (error: any) {
      console.error('❌ Download failed:', error);
      throw error;
    }
  }

  /**
   * Delete a file from Wasabi storage
   */
  static async deleteFile(fileId?: string, fileKey?: string, forceDelete = false): Promise<any> {
    try {
      console.log('🗑️ Starting Wasabi delete');

      const { data, error } = await supabase.functions.invoke('wasabi-delete', {
        body: { fileId, fileKey, forceDelete }
      });

      if (error || !data.success) {
        throw new Error(data?.error || 'Delete failed');
      }

      console.log('✅ File deleted successfully');
      return data;

    } catch (error: any) {
      console.error('❌ Delete failed:', error);
      throw error;
    }
  }

  /**
   * List files from Wasabi storage
   */
  static async listFiles(options: WasabiListOptions = {}): Promise<any> {
    try {
      console.log('📋 Listing Wasabi files');

      const searchParams = new URLSearchParams();
      if (options.prefix) searchParams.append('prefix', options.prefix);
      if (options.maxKeys) searchParams.append('maxKeys', options.maxKeys.toString());
      if (options.continuationToken) searchParams.append('continuationToken', options.continuationToken);
      if (options.includeMetadata) searchParams.append('includeMetadata', 'true');
      if (options.userFilesOnly) searchParams.append('userFilesOnly', 'true');
      if (options.source) searchParams.append('source', options.source);

      const { data, error } = await supabase.functions.invoke('wasabi-list?' + searchParams.toString());

      if (error || !data.success) {
        throw new Error(data?.error || 'List failed');
      }

      console.log('✅ Files listed successfully');
      return data;

    } catch (error: any) {
      console.error('❌ List failed:', error);
      throw error;
    }
  }

  /**
   * Get file metadata
   */
  static async getMetadata(options: WasabiMetadataOptions): Promise<any> {
    try {
      console.log('🏷️ Getting file metadata');

      const searchParams = new URLSearchParams();
      if (options.fileId) searchParams.append('fileId', options.fileId);
      if (options.fileKey) searchParams.append('fileKey', options.fileKey);
      if (options.source) searchParams.append('source', options.source);

      const { data, error } = await supabase.functions.invoke('wasabi-metadata?' + searchParams.toString());

      if (error || !data.success) {
        throw new Error(data?.error || 'Failed to get metadata');
      }

      console.log('✅ Metadata retrieved successfully');
      return data;

    } catch (error: any) {
      console.error('❌ Get metadata failed:', error);
      throw error;
    }
  }

  /**
   * Update file metadata
   */
  static async updateMetadata(options: WasabiMetadataOptions): Promise<any> {
    try {
      console.log('🏷️ Updating file metadata');

      const { data, error } = await supabase.functions.invoke('wasabi-metadata', {
        body: options
      });

      if (error || !data.success) {
        throw new Error(data?.error || 'Failed to update metadata');
      }

      console.log('✅ Metadata updated successfully');
      return data;

    } catch (error: any) {
      console.error('❌ Update metadata failed:', error);
      throw error;
    }
  }

  /**
   * Delete metadata keys
   */
  static async deleteMetadata(fileId: string, fileKey: string, metadataKeys: string[]): Promise<any> {
    try {
      console.log('🗑️ Deleting file metadata');

      const response = await fetch(`https://axctozdoysadqvmtdawm.supabase.co/functions/v1/wasabi-metadata`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId, fileKey, metadataKeys })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || 'Failed to delete metadata');
      }

      console.log('✅ Metadata deleted successfully');
      return data;

    } catch (error: any) {
      console.error('❌ Delete metadata failed:', error);
      throw error;
    }
  }

  /**
   * Check file permissions
   */
  static async checkPermission(fileId: string): Promise<any> {
    try {
      console.log('🔐 Checking file permissions');

      const { data, error } = await supabase.functions.invoke('wasabi-security?action=check&fileId=' + fileId);

      if (error || !data.success) {
        throw new Error(data?.error || 'Permission check failed');
      }

      console.log('✅ Permission check completed');
      return data;

    } catch (error: any) {
      console.error('❌ Permission check failed:', error);
      throw error;
    }
  }

  /**
   * Grant file permission to user
   */
  static async grantPermission(options: WasabiPermissionOptions): Promise<any> {
    try {
      console.log('🔐 Granting file permission');

      const { data, error } = await supabase.functions.invoke('wasabi-security', {
        body: options
      });

      if (error || !data.success) {
        throw new Error(data?.error || 'Failed to grant permission');
      }

      console.log('✅ Permission granted successfully');
      return data;

    } catch (error: any) {
      console.error('❌ Grant permission failed:', error);
      throw error;
    }
  }

  /**
   * Update file visibility (public/private)
   */
  static async updateVisibility(fileId: string, isPublic: boolean): Promise<any> {
    try {
      console.log('🔐 Updating file visibility');

      const response = await fetch(`https://axctozdoysadqvmtdawm.supabase.co/functions/v1/wasabi-security`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId, isPublic })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || 'Failed to update visibility');
      }

      console.log('✅ Visibility updated successfully');
      return data;

    } catch (error: any) {
      console.error('❌ Update visibility failed:', error);
      throw error;
    }
  }

  /**
   * Revoke file permission from user
   */
  static async revokePermission(fileId: string, targetUserId: string, permissionType?: string): Promise<any> {
    try {
      console.log('🔐 Revoking file permission');

      const response = await fetch(`https://axctozdoysadqvmtdawm.supabase.co/functions/v1/wasabi-security`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId, targetUserId, permissionType })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error || 'Failed to revoke permission');
      }

      console.log('✅ Permission revoked successfully');
      return data;

    } catch (error: any) {
      console.error('❌ Revoke permission failed:', error);
      throw error;
    }
  }

  /**
   * Get user files with pagination
   */
  static async getUserFiles(userId?: string, options: Partial<WasabiListOptions> = {}) {
    return this.listFiles({
      userFilesOnly: true,
      source: 'database',
      ...options
    });
  }

  /**
   * Get public files
   */
  static async getPublicFiles(options: Partial<WasabiListOptions> = {}) {
    return this.listFiles({
      userFilesOnly: false,
      source: 'database',
      ...options
    });
  }

  /**
   * Search files by filename
   */
  static async searchFiles(searchTerm: string, options: Partial<WasabiListOptions> = {}) {
    // This could be enhanced with full-text search in the future
    const files = await this.listFiles(options);
    
    if (files.success && files.files) {
      const filteredFiles = files.files.filter((file: any) => 
        file.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.fileKey?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return {
        ...files,
        files: filteredFiles,
        summary: {
          ...files.summary,
          totalFiles: filteredFiles.length,
          searchTerm
        }
      };
    }
    
    return files;
  }
}