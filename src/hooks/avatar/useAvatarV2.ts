import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { avatarStore, AvatarV2State } from '@/services/avatar/AvatarStore';

export const useAvatarV2 = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id || null;
  const [state, setState] = useState<AvatarV2State | null>(null);

  useEffect(() => {
    if (!targetUserId) return;
    const unsub = avatarStore.subscribe(targetUserId, setState);
    avatarStore.load(targetUserId);
    return () => unsub();
  }, [targetUserId]);

  const upload = useCallback(async (file: File) => {
    if (!targetUserId) throw new Error('No user');
    return avatarStore.upload(targetUserId, file);
  }, [targetUserId]);

  const reload = useCallback(() => {
    if (!targetUserId) return;
    avatarStore.load(targetUserId);
  }, [targetUserId]);

  return {
    userId: targetUserId,
    url: state?.url || null,
    key: state?.key || null,
    loading: !!state?.loading,
    uploading: !!state?.uploading,
    uploadProgress: state?.uploadProgress || 0,
    lastGoodUrl: state?.lastGoodUrl || null,
    error: state?.error || null,
    upload,
    reload,
  };
};
