import React from 'react';
import { Card } from '@/components/ui/card';
import { WasabiImageDisplay } from '@/components/fallback/WasabiImageDisplay';

interface PhotosTabProps {
  photoItems: any[];
}

const PhotosTab: React.FC<PhotosTabProps> = ({ photoItems }) => {
  const [loadedImages, setLoadedImages] = React.useState<Set<number>>(new Set());

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set([...prev, index]));
  };

  return (
    <Card className="p-4 md:p-6 shadow">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">Photos</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {photoItems.map((photo, index) => (
          <div key={photo.id || index} className="aspect-square rounded-md overflow-hidden relative">
            {!loadedImages.has(index) && (
              <div className="facebook-skeleton absolute inset-0 rounded-md" />
            )}
            <WasabiImageDisplay
              url={photo.image || photo}
              alt={`Photo ${photo.id || index}`}
              className="relative z-10 w-full h-full object-cover"
              aspectRatio="w-full h-full"
              onLoaded={() => handleImageLoad(index)}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PhotosTab;
