/**
 * useGlobalAvatar - Routes to unified AvatarV2 system
 * Single source of truth for all avatar functionality
 */

import { useAvatarV2 } from './avatar/useAvatarV2';
import { useEffect } from 'react';

export const useGlobalAvatar = (userId?: string) => {
  const { url, lastGoodUrl, loading, uploading, upload, uploadProgress } = useAvatarV2(userId);
  
  
  return {
    avatarUrl: url || lastGoodUrl,
    isLoading: loading || uploading,
    uploadProgress,
    uploadAvatar: upload,
    updateAvatar: async (newUrl: string | null) => {
      console.warn('updateAvatar with URL not supported - use uploadAvatar with File');
    }
  };
};