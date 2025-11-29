
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PhotoItem {
  id: number;
  image: string;
}

interface PhotosCardProps {
  photos: PhotoItem[];
  limit?: number;
  showSeeAllButton?: boolean;
}

const PhotosCard: React.FC<PhotosCardProps> = ({
  photos,
  limit = 9,
  showSeeAllButton = true
}) => {
  const displayPhotos = limit ? photos.slice(0, limit) : photos;
  
  return (
    <Card className="p-4 shadow-sm mb-4 bg-card border border-border">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Photos</h2>
        {showSeeAllButton && (
          <Button variant="link" className="text-blue-500 p-0">
            See all photos
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-1">
        {displayPhotos.map(photo => (
          <div key={photo.id} className="aspect-square overflow-hidden rounded-md">
            <img 
              src={photo.image} 
              alt={`Photo ${photo.id}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PhotosCard;
