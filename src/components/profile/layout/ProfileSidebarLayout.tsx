
import React from 'react';
import ProfileSidebarContent from '../sidebar/ProfileSidebarContent';
import { UserData } from '../data/userData';

interface ProfileSidebarLayoutProps {
  userData: UserData;
  transformedPhotos: Array<{
    id: number;
    url: string;
  }>;
  transformedFriends: Array<{
    id: number;
    name: string;
    imageUrl: string;
  }>;
  featuredPhotos: Array<{
    id: number;
    url: string;
  }>;
  sidebarMarginLeft: number;
}

const ProfileSidebarLayout: React.FC<ProfileSidebarLayoutProps> = (props) => {
  return (
    <div className="w-full lg:w-[450px] flex-shrink-0">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="h-full overflow-y-auto">
          <ProfileSidebarContent {...props} />
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebarLayout;
