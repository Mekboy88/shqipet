
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileSettingsDialog from '@/components/profile/settings/ProfileSettingsDialog';
import { useProfileSettings } from '@/contexts/ProfileSettingsContext';
import { ProfileSettingsSkeleton } from '@/components/profile/skeletons/ProfileSkeleton';
import { useProfileSettings as useProfileSettingsHook } from '@/hooks/useProfileSettings';

const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, loadSettings } = useProfileSettingsHook(); // Get loading and loader from settings hook
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    activeSection,
    setActiveSection,
    userInfo,
    setUserInfo,
  } = useProfileSettings();

  useEffect(() => {
    // Always open settings when component mounts, regardless of state
    // This ensures that refreshing the page keeps the settings open
    setIsSettingsOpen(true);
    
    // Read the section from URL parameters and update activeSection
    const searchParams = new URLSearchParams(location.search);
    const sectionFromUrl = searchParams.get('section');
    if (sectionFromUrl) {
      console.log('Setting active section from URL:', sectionFromUrl);
      setActiveSection(sectionFromUrl);
    }
  }, [setIsSettingsOpen, location.search, setActiveSection]);

  // Initial data load handled by useProfileSettings hook to avoid duplicate fetches

  const handleClose = () => {
    setIsSettingsOpen(false);
    
    // Navigate back to profile without settings query params and reset scroll
    navigate('/profile', { replace: true });
    
    // Reset scroll position to top
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  // Keep dialog mounted; loading handled inside content to avoid page flicker

  return (
    <ProfileSettingsDialog
      isOpen={true}
      onClose={handleClose}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      userInfo={userInfo}
      setUserInfo={setUserInfo}
    />
  );
};

export default ProfileSettings;
