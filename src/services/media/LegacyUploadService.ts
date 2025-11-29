/**
 * LegacyUploadService - Backward compatibility layer
 * Provides same API as old wasabiUpload for existing components
 */

import { uploadService } from './UploadService';

/**
 * Legacy upload function for backward compatibility
 */
export const uploadToWasabi = async (file: File): Promise<{ key: string; url: string }> => {
  const result = await uploadService.upload(file, 'cover');
  return {
    key: result.key,
    url: result.key // Store raw key; resolvers will sign
  };
};