
import React from 'react';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import { useUniversalUser } from '@/hooks/useUniversalUser';

interface ProfileDetailsProps {
  friendCount: string;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  friendCount
}) => {
  const { userInfo, loading } = useProfileSettings();
  const { displayName } = useUniversalUser();

  // Prefer full name (first + last); then displayName; then username; then first_name
  const fullName = [userInfo.first_name, userInfo.last_name].filter(Boolean).join(' ').trim();
  const nameToShow = fullName || displayName || userInfo.username || userInfo.first_name || '';

  return (
    <div>
      <h1 className="text-3xl font-bold">{nameToShow}</h1>
      <p className="text-gray-500">{friendCount} miq</p>
    </div>
  );
};

export default ProfileDetails;
