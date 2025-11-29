import React from 'react';
import '@/components/ui/skeleton-shimmer.css';

const ReelsGridSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-6">
      {/* Header skeleton */}
      <div className="text-center mb-8">
        <div className="h-8 w-64 facebook-skeleton rounded-lg mx-auto mb-2"></div>
        <div className="h-6 w-96 facebook-skeleton rounded-lg mx-auto"></div>
      </div>
      
      {/* Pinterest-style masonry grid skeleton */}
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 2xl:columns-7 gap-4 space-y-4">
        {Array.from({ length: 20 }).map((_, index) => (
          <div
            key={index}
            className="break-inside-avoid mb-4"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <div 
                className="w-full aspect-[9/16] facebook-skeleton"
              >
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Button skeleton */}
      <div className="text-center mt-12">
        <div className="bg-gray-200 animate-pulse h-12 w-48 rounded-full mx-auto"></div>
      </div>
    </div>
  );
};

export default ReelsGridSkeleton;