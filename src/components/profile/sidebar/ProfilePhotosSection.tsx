
import React, { useRef, useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { useUserPhotos } from '@/hooks/useUserPhotos';
import './featured-photos.css';

interface Photo {
  id: number;
  url: string;
}

interface ProfilePhotosSectionProps {
  photos: Photo[];
  userStories?: Photo[];
  showHeading?: boolean;
  isEmbedded?: boolean;
}

const ProfilePhotosSection: React.FC<ProfilePhotosSectionProps> = ({
  photos,
  userStories = [],
  showHeading = true,
  isEmbedded = false
}) => {
  const { getPhotosForDisplay } = useUserPhotos();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const { scrollProps } = useHorizontalScroll({ 
    scrollMultiplier: 1, 
    preventVerticalScroll: true 
  });
  
  // Use database photos if available, otherwise use prop photos
  const databasePhotos = getPhotosForDisplay();
  const displayItems = userStories.length > 0 
    ? userStories 
    : (databasePhotos.length > 0 ? databasePhotos : photos);

  useEffect(() => {
    checkScrollButtons();
    
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollButtons);
    }
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScrollButtons);
      }
    };
  }, [displayItems]);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setShowLeftButton(container.scrollLeft > 0);
    setShowRightButton(container.scrollLeft < (container.scrollWidth - container.clientWidth - 10));
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    container.scrollTo({
      left: direction === 'left' ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount,
      behavior: 'smooth'
    });
  };

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${isEmbedded ? 'mt-0' : 'mt-4'} ${isEmbedded ? 'mb-0' : 'mb-2'}`}>
      {showHeading && <h3 className="text-lg font-semibold mb-3 px-1">Featured</h3>}
      
      <div className={`relative ${isEmbedded ? 'photo-scroll-embedded' : 'photo-scroll-container'}`}>
        {showLeftButton && (
          <button 
            className="nav-button absolute left-2 top-1/2 -translate-y-1/2 z-10"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
        )}
        
        {showRightButton && (
          <button 
            className="nav-button absolute right-2 top-1/2 -translate-y-1/2 z-10"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        )}
        
        <div 
          ref={scrollContainerRef}
          data-horizontal-scroll="true"
          className="flex overflow-x-auto hide-scrollbar py-1 gap-2"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorX: 'contain',
            overscrollBehaviorY: 'none'
          }}
          {...scrollProps}
        >
          {displayItems.map(item => (
            <div key={item.id} className="flex-none w-[calc(33.333%-8px)] min-w-[120px] space-y-1">
              <div className="photo-card aspect-square rounded-lg overflow-hidden">
                <img 
                  src={item.url} 
                  alt={`Photo ${item.id}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center text-sm font-medium py-1">Collection</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotosSection;
