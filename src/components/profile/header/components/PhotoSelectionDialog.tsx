
import React from 'react';
import { usePhotoSelectionDialog } from './photo-selection/hooks/usePhotoSelectionDialog';
import PhotoSelectionHeader from './photo-selection/PhotoSelectionHeader';
import PhotoSelectionTabs from './photo-selection/PhotoSelectionTabs';
import PhotoDialogBackdrop from './photo-selection/PhotoDialogBackdrop';
import PhotoDialogContainer from './photo-selection/PhotoDialogContainer';
import PhotoDialogContent from './photo-selection/PhotoDialogContent';
import type { Photo } from './photo-selection/photoData';
import { useRef } from 'react';

interface PhotoSelectionDialogProps {
  onClose: () => void;
  onUploadClick: () => void;
  onPhotoSelect?: (photoUrl: string) => void;
}

const PhotoSelectionDialog: React.FC<PhotoSelectionDialogProps> = ({
  onClose,
  onUploadClick,
  onPhotoSelect
}) => {
  const {
    activeTab,
    setActiveTab,
    selectedAlbum,
    isSliding,
    handleAlbumClick,
    handleBackClick
  } = usePhotoSelectionDialog();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscapeKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleContentScroll = () => {
    // Handle scroll without tracking
  };

  const handleBackdropWheel = (e: React.WheelEvent) => {
    // Handle wheel events on backdrop
  };

  const handleMouseEnter = () => {
    // Handle mouse enter
  };

  const handleMouseLeave = () => {
    // Handle mouse leave
  };

  const handleDialogWheel = (e: React.WheelEvent) => {
    // Handle wheel events on dialog
  };

  const handlePhotoClick = (photo: Photo) => {
    if (onPhotoSelect) {
      onPhotoSelect(photo.url);
      onClose();
    }
  };

  return (
    <PhotoDialogBackdrop
      onBackdropClick={handleBackdropClick}
      onEscapeKey={handleEscapeKey}
      onBackdropWheel={handleBackdropWheel}
    >
      <PhotoDialogContainer
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onWheel={handleDialogWheel}
      >
        <PhotoSelectionHeader
          selectedAlbum={selectedAlbum}
          onBackClick={handleBackClick}
          onClose={onClose}
        />
        
        <PhotoSelectionTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedAlbum={selectedAlbum}
        />
        
        <PhotoDialogContent
          activeTab={activeTab}
          selectedAlbum={selectedAlbum}
          isSliding={isSliding}
          scrollContainerRef={scrollContainerRef}
          onAlbumClick={handleAlbumClick}
          onContentScroll={handleContentScroll}
          onPhotoClick={handlePhotoClick}
        />
      </PhotoDialogContainer>
    </PhotoDialogBackdrop>
  );
};

export default PhotoSelectionDialog;
