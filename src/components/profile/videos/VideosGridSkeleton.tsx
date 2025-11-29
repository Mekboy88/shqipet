import React from 'react';

const VideosGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="aspect-video facebook-skeleton rounded-lg relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 facebook-skeleton rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideosGridSkeleton;