import React from 'react';

const PhotoModalSkeleton = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex">
      {/* Photo Viewer - Left Half */}
      <div className="w-1/2 h-full flex items-center justify-center p-6 bg-black">
        <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
          <div className="absolute top-4 right-4 z-10 h-10 w-10 facebook-skeleton rounded-lg" />
          <div className="w-full h-full facebook-skeleton" />
        </div>
      </div>
      
      {/* Photo Grid - Right Half */}
      <div className="w-1/2 h-full overflow-y-auto p-6 bg-gray-50">
        <div className="space-y-6">
          <div className="h-8 w-32 facebook-skeleton rounded" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="aspect-square facebook-skeleton rounded-lg" />
            ))}
          </div>
          <div className="w-full facebook-skeleton rounded-lg" style={{ aspectRatio: '2/1' }} />
        </div>
      </div>
    </div>
  );
};

export default PhotoModalSkeleton;