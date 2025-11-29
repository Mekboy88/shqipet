
import React, { RefObject } from 'react';
import CoverPhotoSection from './components/CoverPhotoSection';
import { UserData } from '../data/userData';

interface ProfilePageHeaderProps {
  headerRef: RefObject<HTMLDivElement>;
  userData: UserData;
  coverPhotoUrl: string;
  onEditCoverClick: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  isOwnProfile?: boolean;
}

const ProfilePageHeader: React.FC<ProfilePageHeaderProps> = ({
  headerRef,
  userData,
  coverPhotoUrl,
  onEditCoverClick,
  activeTab,
  setActiveTab,
  isOwnProfile = true
}) => {
  return (
    <div ref={headerRef} className="relative bg-white shadow-sm mx-0">
      <CoverPhotoSection 
        coverPhotoUrl={coverPhotoUrl} 
        onEditCoverClick={onEditCoverClick}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOwnProfile={isOwnProfile}
      />
    </div>
  );
};

export default ProfilePageHeader;
