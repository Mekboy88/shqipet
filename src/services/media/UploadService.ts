/**
 * UploadService - Handles all media uploads to Wasabi
 * Validates files and coordinates with Wasabi upload function
 */

import { supabase } from '@/integrations/supabase/client';
import heic2any from 'heic2any';

export type MediaType = 'avatar' | 'cover' | 'post-image' | 'post-video';

interface UploadResult {
  key: string;
  success: boolean;
}

interface ValidationRules {
  maxSizeMB: number;
  allowedTypes: string[];
  dimensions?: {
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
  };
}

const VALIDATION_RULES: Record<MediaType, ValidationRules> = {
  avatar: {
    maxSizeMB: 10,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/jfif', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'image/heif'],
    dimensions: { minWidth: 100, minHeight: 100, maxWidth: 4000, maxHeight: 4000 }
  },
  cover: {
    maxSizeMB: 10,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/jfif', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'image/heif'],
    // Skip client-side dimension checks for cover to support HEIC/AVIF and let server validate
    dimensions: undefined
  },
  'post-image': {
    maxSizeMB: 20,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/jfif', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'image/heif']
  },
  'post-video': {
    maxSizeMB: 50,
    allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime']
  }
};

class UploadService {
  /**
   * Validate file before upload
   */
  async validate(file: File, mediaType: MediaType): Promise<void> {
    const rules = VALIDATION_RULES[mediaType];
    
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > rules.maxSizeMB) {
      throw new Error(`File too large. Maximum size: ${rules.maxSizeMB}MB`);
    }

    // Extract file extension
    const extension = file.name.toLowerCase().split('.').pop();
    
    // Check file type - with extension fallback for HEIC/AVIF/iPhone photos
    const isValidMimeType = rules.allowedTypes.includes(file.type);
    const isValidExtension = extension && (
      (mediaType === 'avatar' || mediaType === 'cover' || mediaType === 'post-image') && 
      ['jpg', 'jpeg', 'png', 'webp', 'avif', 'heic', 'heif'].includes(extension)
    ) || (
      mediaType === 'post-video' && 
      ['mp4', 'webm', 'mov'].includes(extension)
    );
    
    // HEIC/AVIF files may have inconsistent MIME types, so check extension as fallback
    if (!isValidMimeType && !isValidExtension) {
      console.error('File validation failed:', { 
        fileName: file.name, 
        mimeType: file.type, 
        extension, 
        allowedTypes: rules.allowedTypes 
      });
      throw new Error(`Invalid file type. Allowed formats: JPG, PNG, WEBP, AVIF, HEIC for images; MP4, WEBM, MOV for videos.`);
    }

    // Check dimensions for images
    if (file.type.startsWith('image/') && rules.dimensions) {
      await this.validateImageDimensions(file, rules.dimensions);
    }
  }

  /**
   * Upload file to Wasabi and return key
   */
  async upload(file: File, mediaType: MediaType, userId?: string): Promise<UploadResult> {
    try {
      // Convert unsupported mobile formats (HEIC/HEIF) to JPEG before validation/upload
      let workingFile = file;
      const lowerName = file.name.toLowerCase();
      const isHeic = file.type === 'image/heic' || file.type === 'image/heif' || /(heic|heif)$/.test(lowerName);
      if (isHeic) {
        try {
          const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 });
          const blob = converted as Blob; // heic2any returns Blob
          const newName = lowerName.replace(/\.(heic|heif)$/i, '.jpg') || `${lowerName}.jpg`;
          workingFile = new File([blob], newName, { type: 'image/jpeg' });
          console.log('🔁 Converted HEIC/HEIF to JPEG for compatibility:', { originalType: file.type, newType: workingFile.type, newSizeMB: (workingFile.size/1024/1024).toFixed(2) });
        } catch (convErr) {
          console.warn('HEIC/HEIF conversion failed, proceeding with original file (server may reject):', convErr);
        }
      }

      // Validate after conversion
      await this.validate(workingFile, mediaType);

      console.log(`📤 Uploading ${mediaType}:`, {
        name: workingFile.name,
        size: `${(workingFile.size / 1024 / 1024).toFixed(2)}MB`,
        type: workingFile.type
      });

      // Get authenticated session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('Authentication required for upload');
      }

      // Use FormData for file upload with metadata
      const formData = new FormData();
      formData.append('file', workingFile);
      formData.append('mediaType', mediaType);
      formData.append('updateProfile', 'true'); // Allow profile updates for real uploads
      if (userId) {
        formData.append('userId', userId);
      }

      // Upload directly to wasabi-upload edge function using multipart/form-data
      const baseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const apiKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
      const response = await fetch(`${baseUrl}/functions/v1/wasabi-upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          apikey: apiKey,
          // DO NOT set Content-Type for FormData; browser will set proper boundary
        },
        body: formData,
      });

      const data: any = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        console.error('wasabi-upload error:', data);
        throw new Error(`Upload failed: ${data?.error || response.statusText || 'Unknown error'}`);
      }

      const returnedKey = data.key;
      if (!returnedKey) {
        console.error('Missing key in response:', data);
        throw new Error('Invalid response from upload service: missing key');
      }

      console.log('✅ Upload successful:', returnedKey);

      return {
        key: returnedKey,
        success: true
      };

    } catch (error) {
      console.error('❌ Upload failed:', error);
      throw error;
    }
  }

  /**
   * Validate image dimensions
   */
  private async validateImageDimensions(file: File, dimensions: NonNullable<ValidationRules['dimensions']>): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        
        const { naturalWidth: width, naturalHeight: height } = img;
        
        if (dimensions.minWidth && width < dimensions.minWidth) {
          reject(new Error(`Image width too small. Minimum: ${dimensions.minWidth}px`));
          return;
        }
        
        if (dimensions.minHeight && height < dimensions.minHeight) {
          reject(new Error(`Image height too small. Minimum: ${dimensions.minHeight}px`));
          return;
        }
        
        if (dimensions.maxWidth && width > dimensions.maxWidth) {
          reject(new Error(`Image width too large. Maximum: ${dimensions.maxWidth}px`));
          return;
        }
        
        if (dimensions.maxHeight && height > dimensions.maxHeight) {
          reject(new Error(`Image height too large. Maximum: ${dimensions.maxHeight}px`));
          return;
        }
        
        resolve();
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        console.warn('Skipping client-side dimension check (browser cannot decode this format). Server will validate.');
        resolve();
      };
      img.src = url;
    });
  }

  /**
   * Get file extension from filename
   */
  private getFileExtension(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ext || 'bin';
  }

  /**
   * Get folder name for media type
   */
  private getFolderForMediaType(mediaType: MediaType): string {
    switch (mediaType) {
      case 'avatar':
        // Use 'uploads' to align with existing signing/proxy functions
        return 'uploads';
      case 'cover':
        return 'covers';
      case 'post-image':
        return 'posts/images';
      case 'post-video':
        return 'posts/videos';
      default:
        return 'uploads';
    }
  }
}

// Export singleton
export const uploadService = new UploadService();