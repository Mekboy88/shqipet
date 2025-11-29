
import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { extractColorsFromImage, createGradientFromColors } from './utils/colorExtraction';
import CoverPhoto from './CoverPhoto/CoverPhoto';
import ProfileInfo from './CoverPhoto/ProfileInfo';
import CoverPhotoDialog from './CoverPhoto/CoverPhotoDialog';

interface ProfileHeaderProps {
  userProfile: {
    name: string;
    profileImage: string;
    stats: {
      friends: number;
    };
  };
  coverHeight: number;
  setCoverHeight: (height: number) => void;
  isEditingCover: boolean;
  setIsEditingCover: (isEditing: boolean) => void;
  coverGradient: string;
  setCoverGradient: (gradient: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userProfile,
  coverHeight,
  setCoverHeight,
  isEditingCover,
  setIsEditingCover,
  coverGradient,
  setCoverGradient
}) => {
  const isMobile = useIsMobile();
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  
  // Responsive cover height (smaller on mobile)
  const responsiveCoverHeight = isMobile ? Math.min(coverHeight * 0.7, 280) : coverHeight;
  
  const handleCoverPhotoChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      
      // Create URL for preview
      const objectUrl = URL.createObjectURL(file);
      setCoverImageUrl(objectUrl);
      
      try {
        // Extract colors from the selected image with enhanced algorithm
        const extractedColors = await extractColorsFromImage(objectUrl);
        const newGradient = createGradientFromColors(extractedColors);
        setCoverGradient(newGradient);
        
        toast.success("Cover photo colors extracted!");
      } catch (error) {
        console.error("Error processing cover photo:", error);
        toast.error("Failed to process cover photo colors");
      }
    }
  }, [setCoverGradient]);
  
  const handleSaveChanges = useCallback(() => {
    setIsEditingCover(false);
    toast.success("Cover photo updated!");
  }, [setIsEditingCover]);
  
  return (
    <>
      {/* Cover Photo Section */}
      <CoverPhoto 
        responsiveCoverHeight={responsiveCoverHeight}
        coverGradient={coverGradient}
        coverImageUrl={coverImageUrl}
        onEditClick={() => setIsEditingCover(true)}
      />
      
      {/* Profile Info Section */}
      <ProfileInfo userProfile={userProfile} />
      
      {/* Dialog for Cover Photo Editing */}
      <CoverPhotoDialog
        isOpen={isEditingCover}
        onOpenChange={setIsEditingCover}
        coverHeight={coverHeight}
        setCoverHeight={setCoverHeight}
        coverImageUrl={coverImageUrl}
        onCoverPhotoChange={handleCoverPhotoChange}
        onSave={handleSaveChanges}
      />
    </>
  );
};

export default ProfileHeader;
