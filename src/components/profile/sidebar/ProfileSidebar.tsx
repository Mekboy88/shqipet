
import React from 'react';
import ProfileIntroCard from '../ProfileIntroCard';
import FriendsCard from '../FriendsCard';
import PhotosCard from '../PhotosCard';
import FeaturedCard from '../FeaturedCard';

interface ProfileSidebarProps {
  userProfile: any;
  photoItems: any[];
  friendSuggestions: any[];
  isMobile: boolean;
  hideIntroAndFeatured?: boolean; // New prop to hide redundant sections
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  userProfile,
  photoItems,
  friendSuggestions,
  isMobile,
  hideIntroAndFeatured = false
}) => {
  return (
    <div className="space-y-4">
      {/* Only show these if not hidden */}
      {!hideIntroAndFeatured && (
        <>
          {/* User Intro Card */}
          <ProfileIntroCard />

          {/* Featured Card - Images that can be edited */}
          <FeaturedCard photos={photoItems.slice(0, 3)} />
        </>
      )}
      
      {/* Photos Card */}
      <PhotosCard photos={photoItems} limit={9} showSeeAllButton={true} />
      
      {/* Friends Card */}
      <FriendsCard
        friends={friendSuggestions}
        totalCount={userProfile.stats.friends}
        limit={9}
        showSeeAllButton={true}
        gridCols={3}
      />
    </div>
  );
};

export default ProfileSidebar;
