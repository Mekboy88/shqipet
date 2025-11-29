
import React, { useEffect, useState } from 'react';
import Avatar from '@/components/Avatar';
import { useUniversalUser } from '@/hooks/useUniversalUser';
import { useCover } from '@/hooks/media/useCover';
import { useGlobalCoverPhoto } from '@/hooks/useGlobalCoverPhoto';
import CoverPhotoOverlay from './cover-photo/CoverPhotoOverlay';
import CoverPhotoControls from './cover-photo/CoverPhotoControls';
import { mediaService } from '@/services/media/MediaService';

interface CoverPhotoContentProps {
  coverPhotoUrl: string;
  isDragMode: boolean;
  isDragging: boolean;
  isSaving?: boolean;
  coverRef: React.RefObject<HTMLDivElement>;
  buttonColor: string;
  onDragModeToggle: () => void;
  onSaveChanges: () => void;
  onCancelChanges: () => void;
  onEditCoverClick: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onButtonColorChange: (color: string) => void;
  isOwnProfile?: boolean;
}

const CoverPhotoContent: React.FC<CoverPhotoContentProps> = ({
  coverPhotoUrl,
  isDragMode,
  isDragging,
  isSaving,
  coverRef,
  buttonColor,
  onDragModeToggle,
  onSaveChanges,
  onCancelChanges,
  onEditCoverClick,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onButtonColorChange,
  isOwnProfile = true
}) => {
  const { displayName } = useUniversalUser();
  const { position: coverPosition, isPositionChanging } = useCover();
  const { coverPhotoUrl: globalCoverUrl } = useGlobalCoverPhoto();
  
  // Use global cover photo URL directly - it's already preloaded and cached
  const displayUrl = globalCoverUrl || coverPhotoUrl;

  return (
    <div 
      ref={coverRef}
      className="h-[500px] relative rounded-b-2xl mx-auto max-w-[1200px] w-full" 
      style={{
        ...(displayUrl ? { 
          backgroundImage: `url(${displayUrl})`,
          backgroundColor: 'transparent'
        } : { 
          backgroundColor: 'hsl(var(--muted))' 
        }),
        backgroundSize: 'cover',
        backgroundPosition: displayUrl ? coverPosition : 'center',
        cursor: isDragMode ? (isDragging ? 'grabbing' : 'grab') : 'default',
        // Smooth transitions when not dragging or changing position
        transition: (isDragMode || isDragging || isPositionChanging) ? 'none' : 'background-position 0.3s ease, cursor 0.2s ease'
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <CoverPhotoOverlay isDragMode={isDragMode} />

      <CoverPhotoControls
        isDragMode={isDragMode}
        isSaving={isSaving ?? false}
        buttonColor={buttonColor}
        onDragModeToggle={onDragModeToggle}
        onSaveChanges={onSaveChanges}
        onCancelChanges={onCancelChanges}
        onEditCoverClick={onEditCoverClick}
        onMouseDown={onMouseDown}
        onButtonColorChange={onButtonColorChange}
        isOwnProfile={isOwnProfile}
      />

      {/* Profile Picture - positioned at bottom left with hover icons enabled */}
      <div className="absolute bottom-4 left-4">
        <Avatar 
          size="2xl"
          className="w-40 h-40 border-4 border-white"
          showCameraOverlay={true}
          enableUpload={isOwnProfile}
          isOwnProfile={isOwnProfile}
        />
      </div>

      {/* User Info - positioned on the right side next to profile picture */}
      <div className="absolute bottom-8 left-48 pt-4">
        <h1 className="font-bold text-white mb-1 text-3xl">
          {displayName || ''}
        </h1>
      </div>
    </div>
  );
};

export default CoverPhotoContent;
