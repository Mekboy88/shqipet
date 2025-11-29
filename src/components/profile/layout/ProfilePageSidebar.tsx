
import React, { RefObject } from 'react';
import { UserData } from '../data/userData';

interface ProfilePageSidebarProps {
  sidebarRef: RefObject<HTMLDivElement>;
  sidebarScrollRef: RefObject<HTMLDivElement>;
  isNavigationSticky: boolean;
  userData: UserData;
  transformedPhotos: Array<{ id: number; url: string; }>;
  transformedFriends: Array<{ id: number; name: string; imageUrl: string; }>;
  featuredPhotos: Array<{ id: number; url: string; }>;
  sidebarMarginLeft: number;
}

const ProfilePageSidebar: React.FC<ProfilePageSidebarProps> = ({
  sidebarRef,
  sidebarScrollRef
}) => {
  return (
    <div className="w-full lg:w-[450px] flex-shrink-0">
      <div 
        ref={sidebarRef}
        className="relative"
      >
        <div
          ref={sidebarScrollRef}
          className="mx-[-170px] px-0"
        >
          {/* All sidebar content removed as requested */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePageSidebar;
