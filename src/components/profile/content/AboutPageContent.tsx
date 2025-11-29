
import React, { RefObject } from 'react';
import AboutTabSections from '../tabs/AboutTabSections';
import { UserData } from '../data/userData';

interface AboutPageContentProps {
  mainContentRef: RefObject<HTMLDivElement>;
  isNavigationSticky: boolean;
  userData: UserData;
  // About tab state props
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

const AboutPageContent: React.FC<AboutPageContentProps> = ({
  mainContentRef,
  isNavigationSticky,
  userData,
  sectionsMaxWidth = "800px",
  activeFriendCategory = "all",
  setActiveFriendCategory = () => {},
  activePhotoTab = "photos-of-you",
  setActivePhotoTab = () => {},
  activeVideoTab = "videos-of-you",
  setActiveVideoTab = () => {},
  activeReelsTab = "your-reels",
  setActiveReelsTab = () => {},
  activeCheckInsTab = "all-checkins",
  setActiveCheckInsTab = () => {},
  activeSportsTab = "teams",
  setActiveSportsTab = () => {},
  activeMusicTab = "artists",
  setActiveMusicTab = () => {},
  activeMovieTab = "favorites",
  setActiveMovieTab = () => {},
  activeShowTab = "favorites",
  setActiveShowTab = () => {},
  activeBookTab = "read",
  setActiveBookTab = () => {},
  activeAppTab = "apps",
  setActiveAppTab = () => {},
  activeLikeTab = "all-likes",
  setActiveLikeTab = () => {},
  activeEventTab = "upcoming",
  setActiveEventTab = () => {},
  activeReviewTab = "places",
  setActiveReviewTab = () => {},
  activeGroupTab = "your-groups",
  setActiveGroupTab = () => {}
}) => {
  return (
    <div className="flex-1 min-w-0 relative" style={{ zIndex: isNavigationSticky ? 5 : 5 }}>
      <div
        ref={mainContentRef}
        className={`transition-all duration-300 ${
          isNavigationSticky 
            ? 'h-[calc(100vh-80px)] overflow-y-auto' 
            : 'overflow-y-auto'
        }`}
        style={{
          scrollbarWidth: 'none',
          scrollbarColor: 'transparent transparent',
          scrollBehavior: 'auto',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <AboutTabSections
          sectionsMaxWidth={sectionsMaxWidth}
          activeFriendCategory={activeFriendCategory}
          setActiveFriendCategory={setActiveFriendCategory}
          activePhotoTab={activePhotoTab}
          setActivePhotoTab={setActivePhotoTab}
          activeVideoTab={activeVideoTab}
          setActiveVideoTab={setActiveVideoTab}
          activeReelsTab={activeReelsTab}
          setActiveReelsTab={setActiveReelsTab}
          activeCheckInsTab={activeCheckInsTab}
          setActiveCheckInsTab={setActiveCheckInsTab}
          activeSportsTab={activeSportsTab}
          setActiveSportsTab={setActiveSportsTab}
          activeMusicTab={activeMusicTab}
          setActiveMusicTab={setActiveMusicTab}
          activeMovieTab={activeMovieTab}
          setActiveMovieTab={setActiveMovieTab}
          activeShowTab={activeShowTab}
          setActiveShowTab={setActiveShowTab}
          activeBookTab={activeBookTab}
          setActiveBookTab={setActiveBookTab}
          activeAppTab={activeAppTab}
          setActiveAppTab={setActiveAppTab}
          activeLikeTab={activeLikeTab}
          setActiveLikeTab={setActiveLikeTab}
          activeEventTab={activeEventTab}
          setActiveEventTab={setActiveEventTab}
          activeReviewTab={activeReviewTab}
          setActiveReviewTab={setActiveReviewTab}
          activeGroupTab={activeGroupTab}
          setActiveGroupTab={setActiveGroupTab}
        />
      </div>
    </div>
  );
};

export default AboutPageContent;
