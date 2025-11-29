
import React from 'react';

interface CoverPhotoOverlayProps {
  isDragMode: boolean;
}

const CoverPhotoOverlay: React.FC<CoverPhotoOverlayProps> = ({ isDragMode }) => {
  return (
    <>
      {/* Drag Mode Guiding Text - Albanian */}
      {isDragMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm font-medium z-10">
          Kliko dhe zvarrit vertikalisht për të rregulluar pozicionin e fotos së kapakut
        </div>
      )}
    </>
  );
};

export default CoverPhotoOverlay;
