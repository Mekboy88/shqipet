
import { useState, useEffect } from 'react';
import { defaultUserData, UserData } from '@/components/profile/data/userData';
import { setupWindowUtils, cleanupWindowUtils, loadSavedPreferences } from '@/components/profile/utils/profileUtils';

export const useProfileState = () => {
  // User data and state
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(defaultUserData.coverPhotoUrl);

  // Layout settings
  const [sectionsMaxWidth, setSectionsMaxWidth] = useState('1300px');
  const [sidebarMarginLeft, setSidebarMarginLeft] = useState(150);

  // Tab states
  const [activeFriendCategory, setActiveFriendCategory] = useState('all');
  const [activePhotoTab, setActivePhotoTab] = useState('of-you');
  const [activeVideoTab, setActiveVideoTab] = useState('your-videos');
  const [activeReelsTab, setActiveReelsTab] = useState('your-reels');
  const [activeCheckInsTab, setActiveCheckInsTab] = useState('recent');
  const [activeSportsTab, setActiveSportsTab] = useState('sports-teams');
  const [activeMusicTab, setActiveMusicTab] = useState('artists');
  const [activeMovieTab, setActiveMovieTab] = useState('watched');
  const [activeShowTab, setActiveShowTab] = useState('watched');
  const [activeBookTab, setActiveBookTab] = useState('read');
  const [activeAppTab, setActiveAppTab] = useState('apps-and-games');
  const [activeLikeTab, setActiveLikeTab] = useState('all-likes');
  const [activeEventTab, setActiveEventTab] = useState('past');
  const [activeReviewTab, setActiveReviewTab] = useState('all-reviews');
  const [activeGroupTab, setActiveGroupTab] = useState('public');

  // Set up window utilities and load preferences
  useEffect(() => {
    setupWindowUtils(setSectionsMaxWidth, setSidebarMarginLeft);
    loadSavedPreferences(setSectionsMaxWidth, setSidebarMarginLeft);
    return () => cleanupWindowUtils();
  }, []);

  // Event handlers
  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setCoverPhotoUrl(objectUrl);
    }
  };
  
  const handleTabChange = (tab: string) => {
    console.log('Tab changed to:', tab);
    setActiveTab(tab);
  };

  return {
    // User data
    userData,
    setUserData,
    activeTab,
    setActiveTab,
    isEditingCover,
    setIsEditingCover,
    coverPhotoUrl,
    setCoverPhotoUrl,

    // Layout settings
    sectionsMaxWidth,
    setSectionsMaxWidth,
    sidebarMarginLeft,
    setSidebarMarginLeft,

    // Tab states
    activeFriendCategory,
    setActiveFriendCategory,
    activePhotoTab,
    setActivePhotoTab,
    activeVideoTab,
    setActiveVideoTab,
    activeReelsTab,
    setActiveReelsTab,
    activeCheckInsTab,
    setActiveCheckInsTab,
    activeSportsTab,
    setActiveSportsTab,
    activeMusicTab,
    setActiveMusicTab,
    activeMovieTab,
    setActiveMovieTab,
    activeShowTab,
    setActiveShowTab,
    activeBookTab,
    setActiveBookTab,
    activeAppTab,
    setActiveAppTab,
    activeLikeTab,
    setActiveLikeTab,
    activeEventTab,
    setActiveEventTab,
    activeReviewTab,
    setActiveReviewTab,
    activeGroupTab,
    setActiveGroupTab,

    // Event handlers
    handleCoverPhotoChange,
    handleTabChange
  };
};
