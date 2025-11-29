
import React from 'react';
import ProfileAvatar from './components/ProfileAvatar';
import ProfileDetails from './components/ProfileDetails';
import ProfileActions from './components/ProfileActions';

interface ProfileInfoProps {
  onCameraClick: () => void;
  onSeeProfilePicture: () => void;
  onChooseProfilePicture: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  onCameraClick,
  onSeeProfilePicture,
  onChooseProfilePicture
}) => {
  // Placeholder handlers for the actions
  const handleAddStoryClick = () => {
    console.log('Add story clicked');
  };

  const handleEditProfileClick = () => {
    console.log('Edit profile clicked');
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
      <ProfileAvatar
        onCameraClick={onCameraClick}
        onSeeProfilePicture={onSeeProfilePicture}
        onChooseProfilePicture={onChooseProfilePicture}
      />
      
      <div className="flex-1 text-center md:text-left">
        <ProfileDetails friendCount="0" />
        <ProfileActions 
          onAddStoryClick={handleAddStoryClick}
          onEditProfileClick={handleEditProfileClick}
        />
      </div>
    </div>
  );
};

export default ProfileInfo;
