
import React from 'react';
import IntroSection from './IntroSection';
import PhotosSection from './PhotosSection';
import FriendsSection from './FriendsSection';
import Footer from './Footer';
import ProfileSidebarStyles from './ProfileSidebarStyles';
import OnlineStatusSection from './sections/OnlineStatusSection';
import RecentActivitySection from './sections/RecentActivitySection';
import EnhancedPhotosSection from './sections/EnhancedPhotosSection';
import { convertPhotoIdsToString } from '../utils/profileUtils';
import { useProfileSidebarConsole } from './hooks/useProfileSidebarConsole';
import { ProfileSidebarComponentProps } from './types/ProfileSidebarTypes';

const ProfileSidebarComponent: React.FC<ProfileSidebarComponentProps> = ({
  userData,
  transformedPhotos,
  transformedFriends,
  featuredPhotos,
  sidebarMarginLeft
}) => {
  // Format photos for IntroSection which needs string IDs
  const convertedFeaturedPhotos = convertPhotoIdsToString(featuredPhotos);

  // Start with empty friends array - no demo friends
  const actualFriends: Array<{
    id: number;
    name: string;
    imageUrl: string;
  }> = [];

  // Setup console editing functions
  useProfileSidebarConsole();
  
  return (
    <div 
      style={{
        marginLeft: `${sidebarMarginLeft}px`,
        width: '150%',
        transformOrigin: 'left center'
      }} 
      className="space-y-4 pr mt-[40px] transition-all duration-200 ease-in-out profile-sidebar mx-[150px] py-[3px] px-px my-[46px]"
    >
      <OnlineStatusSection />
      <RecentActivitySection />
      <EnhancedPhotosSection photos={Array.isArray(transformedPhotos) ? transformedPhotos.map((photo: any) => typeof photo === 'string' ? photo : photo.url) : []} />
      
      <IntroSection 
        school={userData.details.education} 
        location={userData.details.location} 
        hometown={userData.details.hometown} 
        relationship={userData.details.relationship} 
        featuredPhotos={convertedFeaturedPhotos} 
      />
      
      <FriendsSection friends={actualFriends} totalCount="0" />
      
      <Footer />

      <ProfileSidebarStyles />
    </div>
  );
};

export default ProfileSidebarComponent;
