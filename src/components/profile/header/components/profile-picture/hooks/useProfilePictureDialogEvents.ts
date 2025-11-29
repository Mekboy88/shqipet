
import { RefObject } from 'react';

interface UseProfilePictureDialogEventsProps {
  onClose: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
  onPhotoSelect: (photoUrl: string) => void;
  setSelectedPhoto: (photo: string | null) => void;
  setShowPhotoEdit: (show: boolean) => void;
}

export const useProfilePictureDialogEvents = ({
  onClose,
  fileInputRef,
  onPhotoSelect,
  setSelectedPhoto,
  setShowPhotoEdit
}: UseProfilePictureDialogEventsProps) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePhotoClick = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
    setShowPhotoEdit(true);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const photoUrl = URL.createObjectURL(file);
      setSelectedPhoto(photoUrl);
      setShowPhotoEdit(true);
    }
  };

  const handlePhotoEditSave = (photoUrl: string) => {
    if (onPhotoSelect) {
      onPhotoSelect(photoUrl);
    }
    setShowPhotoEdit(false);
    onClose();
  };

  const handlePhotoEditCancel = () => {
    setShowPhotoEdit(false);
    setSelectedPhoto(null);
  };

  const handlePhotoEditDiscard = () => {
    setShowPhotoEdit(false);
    setSelectedPhoto(null);
    onClose();
  };

  const handleContentWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleBackdropWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return {
    handleBackdropClick,
    handlePhotoClick,
    handleUploadClick,
    handleFileChange,
    handlePhotoEditSave,
    handlePhotoEditCancel,
    handlePhotoEditDiscard,
    handleContentWheel,
    handleBackdropWheel
  };
};
