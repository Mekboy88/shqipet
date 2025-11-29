
import React, { useEffect } from 'react';
import PhotoSelectionDialog from './PhotoSelectionDialog';
import EditProfileDialog from './EditProfileDialog';

interface ProfileDialogsProps {
  showPhotoDialog: boolean;
  showProfilePictureDialog: boolean;
  showEditProfileDialog: boolean;
  onClosePhotoDialog: () => void;
  onCloseProfilePictureDialog: () => void;
  onCloseEditProfileDialog: () => void;
  onProfilePhotoSelect: (photoUrl: string) => void;
}

const ProfileDialogs: React.FC<ProfileDialogsProps> = ({
  showPhotoDialog,
  showProfilePictureDialog,
  showEditProfileDialog,
  onClosePhotoDialog,
  onCloseProfilePictureDialog,
  onCloseEditProfileDialog,
  onProfilePhotoSelect
}) => {
  // Emit events when edit profile dialog state changes
  useEffect(() => {
    const event = new CustomEvent('editProfileDialogStateChange', {
      detail: { isOpen: showEditProfileDialog }
    });
    window.dispatchEvent(event);
  }, [showEditProfileDialog]);

  return (
    <>
      {/* Photo Selection Dialog for cover photo */}
      {showPhotoDialog && (
        <PhotoSelectionDialog 
          onClose={onClosePhotoDialog} 
          onUploadClick={() => console.log('Upload clicked')} 
          onPhotoSelect={(photoUrl) => onProfilePhotoSelect(photoUrl)} 
        />
      )}

      
      {/* Edit Profile Dialog */}
      {showEditProfileDialog && (
        <EditProfileDialog onClose={onCloseEditProfileDialog} />
      )}
    </>
  );
};

export default ProfileDialogs;
