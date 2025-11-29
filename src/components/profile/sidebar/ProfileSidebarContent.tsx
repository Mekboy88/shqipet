
import React from 'react';
import ProfileSidebarComponent from './ProfileSidebarComponent';
import { ProfileSidebarComponentProps } from './types/ProfileSidebarTypes';

const ProfileSidebarContent: React.FC<ProfileSidebarComponentProps> = ({
  userData,
  transformedPhotos,
  transformedFriends,
  featuredPhotos,
  sidebarMarginLeft
}) => {
  return (
    <ProfileSidebarComponent 
      userData={userData}
      transformedPhotos={transformedPhotos}
      transformedFriends={transformedFriends}
      featuredPhotos={featuredPhotos}
      sidebarMarginLeft={sidebarMarginLeft}
    />
  );
};

export default ProfileSidebarContent;
