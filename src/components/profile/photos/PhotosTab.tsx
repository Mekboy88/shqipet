
import React from 'react';
import { Button } from '@/components/ui/button';
import { Image, Pencil } from 'lucide-react';

interface Photo {
  id: number;
  url: string;
}

interface PhotosTabProps {
  photos: Photo[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const PhotosTab: React.FC<PhotosTabProps> = ({ photos, activeTab, setActiveTab }) => {
  const tabOptions = [
    { id: 'of-you', label: 'Photos of You' },
    { id: 'your-photos', label: 'Your photos' },
    { id: 'albums', label: 'Albums' }
  ];

  // Display 12 photos in the grid (6 horizontal × 2 vertical)
  const displayPhotos = photos.slice(0, 12);
  
  return (
    <div className="w-full">
      {/* Photo tabs navigation */}
      <div className="flex border-b mb-4 w-full">
        {tabOptions.map((tab) => (
          <Button 
            key={tab.id}
            variant="ghost"
            className={`py-2 px-4 rounded-none font-medium ${
              activeTab === tab.id 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      
      {/* Photos grid - updated to 6×2 grid layout with slightly smaller photos */}
      {displayPhotos.length > 0 ? (
        <div className="grid grid-cols-6 gap-1.5 w-full">
          {displayPhotos.map(photo => (
            <div key={photo.id} className="relative aspect-square overflow-hidden rounded-md scale-[0.98]">
              <img 
                src={photo.url} 
                alt={`Photo ${photo.id}`} 
                className="w-full h-full object-cover rounded-md"
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-60 p-1.5 rounded-full">
                <Pencil size={16} className="text-white" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 w-full">
          <Image size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500">No photos to display</p>
        </div>
      )}
      
      {/* See all button - modified to full width */}
      <div className="mt-4 flex justify-center w-full">
        <Button 
          variant="outline" 
          className="w-full py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium rounded-md"
        >
          See all
        </Button>
      </div>
    </div>
  );
};

export default PhotosTab;
