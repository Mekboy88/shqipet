
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PhotoItem {
  id: number;
  image: string;
}

interface FeaturedCardProps {
  photos: PhotoItem[];
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ photos }) => {
  if (!photos || photos.length === 0) return null;
  
  return (
    <Card className="p-4 shadow-sm mb-4 bg-card border border-border">
      <div className="flex flex-col space-y-4">
        <div className="flex gap-1 overflow-x-auto pb-2">
          {photos.map(photo => (
            <div key={photo.id} className="flex-shrink-0 w-[120px]">
              <div className="aspect-[4/5] overflow-hidden rounded-lg">
                <img 
                  src={photo.image} 
                  alt={`Featured ${photo.id}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-center mt-1 text-gray-600">Collection</p>
            </div>
          ))}
        </div>
        
        <Button variant="outline" className="w-full py-2 h-auto font-medium">
          Edit featured
        </Button>
      </div>
    </Card>
  );
};

export default FeaturedCard;
