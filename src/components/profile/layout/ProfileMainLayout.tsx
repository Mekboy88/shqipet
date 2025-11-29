
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import { UserData } from '../data/userData';

interface ProfileMainLayoutProps {
  activeTab: string;
  isNavigationSticky: boolean;
  userData: UserData;
  posts: any[];
  transformedFriends: Array<{
    id: number;
    name: string;
    imageUrl: string;
  }>;
  transformedPhotos: Array<{
    id: number;
    url: string;
  }>;
  featuredPhotos: Array<{
    id: number;
    url: string;
  }>;
  sidebarMarginLeft: number;
  sidebarRef: React.RefObject<HTMLDivElement>;
  sidebarScrollRef: React.RefObject<HTMLDivElement>;
  mainContentRef: React.RefObject<HTMLDivElement>;
  rightSideContentRef: React.RefObject<HTMLDivElement>;
  pageScrollRef: React.RefObject<HTMLDivElement>;
  sectionsMaxWidth: string;
  activeFriendCategory: string;
  setActiveFriendCategory: (category: string) => void;
  activePhotoTab: string;
  setActivePhotoTab: (tab: string) => void;
  activeVideoTab: string;
  setActiveVideoTab: (tab: string) => void;
  activeReelsTab: string;
  setActiveReelsTab: (tab: string) => void;
  activeCheckInsTab: string;
  setActiveCheckInsTab: (tab: string) => void;
  activeSportsTab: string;
  setActiveSportsTab: (tab: string) => void;
  activeMusicTab: string;
  setActiveMusicTab: (tab: string) => void;
  activeMovieTab: string;
  setActiveMovieTab: (tab: string) => void;
  activeShowTab: string;
  setActiveShowTab: (tab: string) => void;
  activeBookTab: string;
  setActiveBookTab: (tab: string) => void;
  activeAppTab: string;
  setActiveAppTab: (tab: string) => void;
  activeLikeTab: string;
  setActiveLikeTab: (tab: string) => void;
  activeEventTab: string;
  setActiveEventTab: (tab: string) => void;
  activeReviewTab: string;
  setActiveReviewTab: (tab: string) => void;
  activeGroupTab: string;
  setActiveGroupTab: (tab: string) => void;
}

const ProfileMainLayout: React.FC<ProfileMainLayoutProps> = () => {
  return (
    <div className="max-w-[1300px] mx-auto relative">
      {/* Empty content - all sections removed as requested */}
    </div>
  );
};

export default ProfileMainLayout;
