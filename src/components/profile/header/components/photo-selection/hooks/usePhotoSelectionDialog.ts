
import { useState } from 'react';
import type { Album } from '../photoData';

export const usePhotoSelectionDialog = () => {
  const [activeTab, setActiveTab] = useState<'recent' | 'albums'>('recent');
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isSliding, setIsSliding] = useState(false);

  const handleAlbumClick = (album: Album) => {
    setIsSliding(true);
    setTimeout(() => {
      setSelectedAlbum(album);
      setIsSliding(false);
    }, 150);
  };

  const handleBackClick = () => {
    setIsSliding(true);
    setTimeout(() => {
      setSelectedAlbum(null);
      setIsSliding(false);
    }, 150);
  };

  return {
    activeTab,
    setActiveTab,
    selectedAlbum,
    isSliding,
    handleAlbumClick,
    handleBackClick
  };
};
