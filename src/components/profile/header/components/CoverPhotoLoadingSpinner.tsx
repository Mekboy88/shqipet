
import React from 'react';

interface CoverPhotoLoadingSpinnerProps {
  isRemoving?: boolean;
}

const CoverPhotoLoadingSpinner: React.FC<CoverPhotoLoadingSpinnerProps> = ({ isRemoving = false }) => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white rounded-lg flex items-center gap-3 z-40 py-4 px-6">
      <div className="text-sm">{isRemoving ? 'Duke hequr foton...' : 'Duke kontrolluar foton'}</div>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default CoverPhotoLoadingSpinner;
