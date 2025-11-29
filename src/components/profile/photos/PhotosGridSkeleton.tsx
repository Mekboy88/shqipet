import React from 'react';

const PhotosGridSkeleton = () => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-2">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="aspect-square facebook-skeleton rounded-md" />
      ))}
    </div>
  );
};

export default PhotosGridSkeleton;