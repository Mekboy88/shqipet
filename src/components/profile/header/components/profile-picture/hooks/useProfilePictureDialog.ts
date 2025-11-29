
import { useState, useEffect, useRef } from 'react';

export const useProfilePictureDialog = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'frame'>('upload');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showPhotoEdit, setShowPhotoEdit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return {
    activeTab,
    setActiveTab,
    selectedPhoto,
    setSelectedPhoto,
    showPhotoEdit,
    setShowPhotoEdit,
    fileInputRef
  };
};
