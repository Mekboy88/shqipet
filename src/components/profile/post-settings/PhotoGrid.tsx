
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { PostPhoto } from './types';

interface PhotoGridProps {
  photos: PostPhoto[];
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos }) => {
  if (!photos.length) return null;

  // Facebook-style dynamic layouts based on number of photos
  if (photos.length === 1) {
    // Single photo - full width/height display, larger aspect ratio
    return (
      <div className="rounded-md overflow-hidden">
        <AspectRatio ratio={4/3} className="bg-gray-100">
          <img src={photos[0].url} alt="Post" className="w-full h-full object-cover" />
        </AspectRatio>
      </div>
    );
  } else if (photos.length === 2) {
    // Two photos - side by side horizontally
    return (
      <div className="grid grid-cols-2 gap-1">
        <div className="rounded-md overflow-hidden">
          <AspectRatio ratio={1/1} className="bg-gray-100">
            <img src={photos[0].url} alt="Post" className="w-full h-full object-cover" />
          </AspectRatio>
        </div>
        <div className="rounded-md overflow-hidden">
          <AspectRatio ratio={1/1} className="bg-gray-100">
            <img src={photos[1].url} alt="Post" className="w-full h-full object-cover" />
          </AspectRatio>
        </div>
      </div>
    );
  } else if (photos.length === 3) {
    // 3 photos - Facebook style: one large left, two stacked right
    return (
      <div className="grid grid-cols-2 gap-1">
        <div className="rounded-md overflow-hidden row-span-2">
          <AspectRatio ratio={1/2} className="bg-gray-100 h-full">
            <img src={photos[0].url} alt="Post" className="w-full h-full object-cover" />
          </AspectRatio>
        </div>
        <div className="rounded-md overflow-hidden">
          <AspectRatio ratio={1/1} className="bg-gray-100">
            <img src={photos[1].url} alt="Post" className="w-full h-full object-cover" />
          </AspectRatio>
        </div>
        <div className="rounded-md overflow-hidden">
          <AspectRatio ratio={1/1} className="bg-gray-100">
            <img src={photos[2].url} alt="Post" className="w-full h-full object-cover" />
          </AspectRatio>
        </div>
      </div>
    );
  } else if (photos.length === 4) {
    // 4 photos - 2x2 grid
    return (
      <div className="grid grid-cols-2 gap-1">
        {photos.map((photo, index) => (
          <div key={photo.id} className="rounded-md overflow-hidden">
            <AspectRatio ratio={1/1} className="bg-gray-100">
              <img src={photo.url} alt={`Post photo ${index + 1}`} className="w-full h-full object-cover" />
            </AspectRatio>
          </div>
        ))}
      </div>
    );
  } else if (photos.length === 5) {
    // 5 photos - Facebook style: 2 on top row, 3 on bottom row
    return (
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-1">
          <div className="rounded-md overflow-hidden">
            <AspectRatio ratio={1/1} className="bg-gray-100">
              <img src={photos[0].url} alt="Post photo 1" className="w-full h-full object-cover" />
            </AspectRatio>
          </div>
          <div className="rounded-md overflow-hidden">
            <AspectRatio ratio={1/1} className="bg-gray-100">
              <img src={photos[1].url} alt="Post photo 2" className="w-full h-full object-cover" />
            </AspectRatio>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {photos.slice(2, 5).map((photo, index) => (
            <div key={photo.id} className="rounded-md overflow-hidden">
              <AspectRatio ratio={1/1} className="bg-gray-100">
                <img src={photo.url} alt={`Post photo ${index + 3}`} className="w-full h-full object-cover" />
              </AspectRatio>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    // 6+ photos - Show 5 photos with overlay on the 5th
    const displayPhotos = photos.slice(0, 5);
    const remainingCount = photos.length > 5 ? photos.length - 5 : 0;
    
    return (
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-1">
          <div className="rounded-md overflow-hidden">
            <AspectRatio ratio={1/1} className="bg-gray-100">
              <img src={displayPhotos[0].url} alt="Post photo 1" className="w-full h-full object-cover" />
            </AspectRatio>
          </div>
          <div className="rounded-md overflow-hidden">
            <AspectRatio ratio={1/1} className="bg-gray-100">
              <img src={displayPhotos[1].url} alt="Post photo 2" className="w-full h-full object-cover" />
            </AspectRatio>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {displayPhotos.slice(2, 5).map((photo, index) => (
            <div key={photo.id} className="rounded-md overflow-hidden relative">
              <AspectRatio ratio={1/1} className="bg-gray-100">
                <img src={photo.url} alt={`Post photo ${index + 3}`} className="w-full h-full object-cover" />
                
                {/* Overlay for the last visible photo if there are more */}
                {index === 2 && remainingCount > 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold text-xl">+{remainingCount}</span>
                  </div>
                )}
              </AspectRatio>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default PhotoGrid;
