import React from 'react';

const VideoModalSkeleton = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex">
      {/* Video Player - Left Half */}
      <div className="w-1/2 h-full flex items-center justify-center p-6 bg-black">
        <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
          <div className="absolute top-4 right-4 z-10 h-10 w-10 facebook-skeleton rounded-lg" />
          <div className="w-full h-full facebook-skeleton flex items-center justify-center">
            <div className="w-16 h-16 facebook-skeleton rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Video Grid - Right Half */}
      <div className="w-1/2 h-full overflow-y-auto p-6 bg-gray-50">
        <div className="space-y-6">
          <div className="h-8 w-28 facebook-skeleton rounded" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-video facebook-skeleton rounded-lg relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 facebook-skeleton rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModalSkeleton;