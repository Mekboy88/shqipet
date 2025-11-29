
import React, { useRef } from 'react';
import { Plus } from 'lucide-react';
import { useSmoothScrolling } from '@/hooks/useSmoothScrolling';

interface ProfilePictureDialogContentProps {
  activeTab: 'upload' | 'frame';
  onPhotoClick: (photoUrl: string) => void;
  onContentWheel: (e: React.WheelEvent) => void;
}

export const ProfilePictureDialogContent: React.FC<ProfilePictureDialogContentProps> = ({
  activeTab,
  onPhotoClick,
  onContentWheel
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    scrollProgress,
    thumbHeight,
    isVisible,
    canScroll
  } = useSmoothScrolling({
    containerRef,
    scrollMultiplier: 3,
    showScrollIndicator: true,
    hoverBasedVisibility: true // Enable hover-based visibility
  });

  // Sample photos for different sections
  const suggestedPhotos = ['https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150&h=150&fit=crop', 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=150&h=150&fit=crop', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop', 'https://images.unsplash.com/photo-1494790108755-2616b612b401?w=150&h=150&fit=crop'];
  const uploadPhotos = ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=150&h=150&fit=crop', 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop'];
  const photosOfYou = ['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop', 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=150&h=150&fit=crop'];
  
  const renderPhotoGrid = (photos: string[]) => <div className="grid grid-cols-6 gap-1 px-4">
      {photos.map((photo, index) => <div key={index} className="aspect-square cursor-pointer hover:opacity-80 transition-opacity rounded overflow-hidden" onClick={() => onPhotoClick(photo)}>
          <img src={photo} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
        </div>)}
    </div>;

  // Handle wheel events to prevent global scroll interference
  const handleWheel = (e: React.WheelEvent) => {
    // Stop the event from bubbling up to parent components
    e.stopPropagation();
    // Allow the scroll to happen within this container
    // Don't prevent default so the container can scroll normally
  };

  return <div className="flex-1 overflow-hidden relative" onWheel={handleWheel} data-scroll-isolation="true">
      <div ref={containerRef} className="h-[400px] overflow-y-auto scrollbar-hide" style={{
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      // Ensure this container is isolated from global scroll detection
      isolation: 'isolate'
    }} data-scroll-container="profile-picture-dialog">
        {activeTab === 'upload' && <div className="pb-8">
            {/* Suggested Photos Section */}
            <div className="py-4">
              <div className="px-4 mb-3">
                <h3 className="text-sm font-medium text-gray-900">Fotot e sugjeruara</h3>
              </div>
              {renderPhotoGrid(suggestedPhotos)}
            </div>

            {/* Separator with See more button */}
            <div className="h-6 bg-gray-100 flex items-center justify-center mx-4 rounded-lg mb-4 my-0 py-0">
              <button className="text-sm font-medium text-gray-900 hover:underline">
                Shiko më shumë
              </button>
            </div>

            {/* Uploads Section */}
            <div className="py-4">
              <div className="px-4 mb-3">
                <h3 className="text-sm font-medium text-gray-900">Ngarkimet</h3>
              </div>
              {renderPhotoGrid(uploadPhotos)}
            </div>

            {/* Separator with See more button */}
            <div className="h-6 bg-gray-100 flex items-center justify-center mx-4 rounded-lg mb-4">
              <button className="text-sm font-medium text-gray-900 hover:underline">
                Shiko më shumë
              </button>
            </div>

            {/* Photos of You Section */}
            <div className="py-4">
              <div className="px-4 mb-3">
                <h3 className="text-sm font-medium text-gray-900">Fotot e tua</h3>
              </div>
              {renderPhotoGrid(photosOfYou)}
            </div>
            
            {/* Additional content to ensure scrolling */}
            <div className="py-4">
              <div className="px-4 mb-3">
                <h3 className="text-sm font-medium text-gray-900">Foto të tjera</h3>
              </div>
              {renderPhotoGrid(suggestedPhotos)}
            </div>
            
            {/* Even more content to ensure proper scrolling */}
            <div className="py-4">
              <div className="px-4 mb-3">
                <h3 className="text-sm font-medium text-gray-900">Fotot e fundit</h3>
              </div>
              {renderPhotoGrid(uploadPhotos)}
            </div>
            
            {/* Additional white space at bottom */}
            <div className="h-16"></div>
          </div>}

        {activeTab === 'frame' && <div className="p-8 text-center">
            <div className="mb-4">
              <Plus className="w-12 h-12 text-gray-900 mx-auto" />
            </div>
            <p className="text-sm font-medium text-gray-900">Opsionet e kornizës do të shfaqen këtu</p>
          </div>}
      </div>

      {/* Scroll Indicator has been removed */}
    </div>;
};
