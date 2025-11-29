
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface CoverPhotoProps {
  responsiveCoverHeight: number;
  coverGradient: string;
  coverImageUrl: string;
  onEditClick: () => void;
}

const CoverPhoto: React.FC<CoverPhotoProps> = ({
  responsiveCoverHeight,
  coverGradient,
  coverImageUrl,
  onEditClick
}) => {
  return (
      <div 
        className="w-full relative" 
        style={{ 
          height: `${responsiveCoverHeight}px`,
          ...(coverImageUrl
            ? { backgroundImage: `url(${coverImageUrl})` }
            : (coverGradient && coverGradient.includes('gradient')
                ? { backgroundImage: coverGradient }
                : { backgroundColor: coverGradient }
              )
          ),
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
      <Button
        variant="secondary"
        className="absolute bottom-4 right-4 bg-white hover:bg-gray-100 flex items-center gap-1 rounded-md"
        onClick={onEditClick}
      >
        <Camera className="w-5 h-5 mr-1" />
        Edit cover photo
      </Button>
    </div>
  );
};

export default CoverPhoto;
