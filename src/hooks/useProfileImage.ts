
import { useGlobalAvatar } from '@/hooks/useGlobalAvatar';
import { useState } from 'react';

export const useProfileImage = () => {
  const { avatarUrl, uploadAvatar } = useGlobalAvatar();
  const [loading, setLoading] = useState(false);

  const uploadProfileImage = async (file: File): Promise<string | null> => {
    setLoading(true);
    try {
      return await uploadAvatar(file);
    } finally {
      setLoading(false);
    }
  };

  return {
    profileImageUrl: avatarUrl,
    loading,
    uploadProfileImage,
    refreshProfile: () => {} // No longer needed with global system
  };
};
