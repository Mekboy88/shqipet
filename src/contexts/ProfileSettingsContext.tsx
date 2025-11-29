
import React, { createContext, useContext, useState } from 'react';

// Define the shape of the context data
interface ProfileSettingsContextType {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  openSettings: (sectionId?: string) => void;
  userInfo: any;
  setUserInfo: React.Dispatch<React.SetStateAction<any>>;
}

// Create the context with a default value
const ProfileSettingsContext = createContext<ProfileSettingsContextType | undefined>(undefined);

// Create a custom hook for using the context
export const useProfileSettings = () => {
  const context = useContext(ProfileSettingsContext);
  if (!context) {
    throw new Error('useProfileSettings must be used within a ProfileSettingsProvider');
  }
  return context;
};

export const ProfileSettingsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [userInfo, setUserInfo] = useState(null);

  const openSettings = (sectionId = 'profile') => {
    setActiveSection(sectionId);
    setIsSettingsOpen(true);
  };
  
  const value = {
    isSettingsOpen,
    setIsSettingsOpen,
    activeSection,
    setActiveSection,
    openSettings,
    userInfo,
    setUserInfo,
  };

  return (
    <ProfileSettingsContext.Provider value={value}>
      {children}
    </ProfileSettingsContext.Provider>
  );
};

export default ProfileSettingsContext;
