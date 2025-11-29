
import React from 'react';
import CoverPhotoSection from './CoverPhotoSection';

interface CoverPhotoProps {
  coverPhotoUrl: string;
  onEditClick: () => void;
}

const CoverPhoto: React.FC<CoverPhotoProps> = ({
  coverPhotoUrl,
  onEditClick
}) => {
  return (
    <CoverPhotoSection 
      coverPhotoUrl={coverPhotoUrl} 
      onEditClick={onEditClick} 
    />
  );
};

export default CoverPhoto;
