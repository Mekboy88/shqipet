
import React, { RefObject } from 'react';
import { UserData } from '../data/userData';

interface ProfilePageContentProps {
  mainContentRef: RefObject<HTMLDivElement>;
  rightSideContentRef: RefObject<HTMLDivElement>;
  pageScrollRef: RefObject<HTMLDivElement>;
  activeTab: string;
  isNavigationSticky: boolean;
  userData: UserData;
  posts: any[];
  transformedFriends: Array<{ id: number; name: string; imageUrl: string; }>;
  transformedPhotos: Array<{ id: number; url: string; }>;
  sectionsMaxWidth?: string;
  activeFriendCategory?: string;
  setActiveFriendCategory?: (category: string) => void;
  activePhotoTab?: string;
  setActivePhotoTab?: (tab: string) => void;
  activeVideoTab?: string;
  setActiveVideoTab?: (tab: string) => void;
  activeReelsTab?: string;
  setActiveReelsTab?: (tab: string) => void;
  activeCheckInsTab?: string;
  setActiveCheckInsTab?: (tab: string) => void;
  activeSportsTab?: string;
  setActiveSportsTab?: (tab: string) => void;
  activeMusicTab?: string;
  setActiveMusicTab?: (tab: string) => void;
  activeMovieTab?: string;
  setActiveMovieTab?: (tab: string) => void;
  activeShowTab?: string;
  setActiveShowTab?: (tab: string) => void;
  activeBookTab?: string;
  setActiveBookTab?: (tab: string) => void;
  activeAppTab?: string;
  setActiveAppTab?: (tab: string) => void;
  activeLikeTab?: string;
  setActiveLikeTab?: (tab: string) => void;
  activeEventTab?: string;
  setActiveEventTab?: (tab: string) => void;
  activeReviewTab?: string;
  setActiveReviewTab?: (tab: string) => void;
  activeGroupTab?: string;
  setActiveGroupTab?: (tab: string) => void;
}

const ProfilePageContent: React.FC<ProfilePageContentProps> = ({
  mainContentRef,
  rightSideContentRef
}) => {
  return (
    <div className="flex-1 min-w-0 relative">
      <div
        ref={mainContentRef}
        className="overflow-y-auto"
        style={{
          maxHeight: 'calc(100vh - 200px)',
          scrollBehavior: 'smooth'
        }}
      >
        {/* All content removed as requested */}
      </div>
      <div
        ref={rightSideContentRef}
        className="overflow-y-auto"
        style={{
          maxHeight: 'calc(100vh - 200px)',
          scrollBehavior: 'smooth'
        }}
      >
        {/* All content removed as requested */}
      </div>
    </div>
  );
};

export default ProfilePageContent;
