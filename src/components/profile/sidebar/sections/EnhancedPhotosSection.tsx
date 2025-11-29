import React, { useState } from 'react';
import { useUserPhotos } from '@/hooks/useUserPhotos';
import { AvatarImage } from '@/components/ui/avatar';
import { Camera, Plus, Grid, MoreHorizontal } from 'lucide-react';

interface EnhancedPhotosSectionProps {
  photos: string[];
}

const EnhancedPhotosSection: React.FC<EnhancedPhotosSectionProps> = ({ 
  photos: propPhotos = [] 
}) => {
  const { photos: userPhotos, loading, getPhotosForDisplay } = useUserPhotos();
  const [showAll, setShowAll] = useState(false);
  
  // Use database photos if available, otherwise use prop photos
  const databasePhotos = getPhotosForDisplay();
  const photoUrls = databasePhotos.length > 0 
    ? databasePhotos.map(p => p.url)
    : propPhotos;
  
  // Don't use sample photos - show empty state when no real photos
  const displayPhotos = photoUrls;
  const visiblePhotos = showAll ? displayPhotos : displayPhotos.slice(0, 9);
  const hasMore = displayPhotos.length > 9;

  if (loading) {
    return (
      <div className="bg-card rounded-lg shadow-sm border border-border p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Camera className="w-5 h-5 mr-2 text-blue-500" />
            Loading Photos...
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={`loading-${i}`} className="aspect-square bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Camera className="w-5 h-5 mr-2 text-blue-500" />
          Albumet ({displayPhotos.length})
        </h3>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Grid className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {displayPhotos.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-semibold mb-2">Nuk ka foto të disponueshme</p>
          <p className="text-gray-400 text-sm">Posto foto për t'i parë këtu</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            {visiblePhotos.map((photo, index) => (
              <div 
                key={index} 
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-90 cursor-pointer transition-opacity group relative"
              >
                <AvatarImage
                  src={photo} 
                  className="w-full h-full object-cover transition-opacity duration-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {hasMore && (
            <div className="mt-4 pt-3 border-t border-gray-100 text-center">
              <button 
                onClick={() => setShowAll(!showAll)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {showAll ? 'Show Less' : `See All (${displayPhotos.length})`}
              </button>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-gray-100">
            <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
              <Plus className="w-4 h-4 mr-2" />
              Add new photos
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EnhancedPhotosSection;