import React from 'react';
import { ProfileSettingsSkeleton } from '../skeletons/ProfileSkeleton';
import { useProfileSettings } from '@/hooks/useProfileSettings';

interface ProfileSettingsWithSkeletonProps {
  children: React.ReactNode;
}

const ProfileSettingsWithSkeleton: React.FC<ProfileSettingsWithSkeletonProps> = ({ children }) => {
  const { loading } = useProfileSettings();

  if (loading) {
    return <ProfileSettingsSkeleton />;
  }

  return <>{children}</>;
};

export default ProfileSettingsWithSkeleton;