
import React from 'react';
import type { Photo } from './photoData';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick?: (photo: Photo) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoClick }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
      width: '100%'
    }}>
      {photos.map((photo) => (
        <div 
          key={photo.id}
          style={{
            aspectRatio: '1',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            backgroundImage: `url(${photo.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onClick={() => onPhotoClick?.(photo)}
        ></div>
      ))}
    </div>
  );
};

export default PhotoGrid;
