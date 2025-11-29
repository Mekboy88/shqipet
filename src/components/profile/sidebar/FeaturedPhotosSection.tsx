
import React, { useRef, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Photo {
  id: number;
  url: string;
}

interface FeaturedPhotosSectionProps {
  photos: Photo[];
}

const FeaturedPhotosSection: React.FC<FeaturedPhotosSectionProps> = ({
  photos
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  // Check if we need to show navigation buttons
  useEffect(() => {
    checkScrollButtons();
    
    // Add scroll event listener to container
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollButtons);
    }
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScrollButtons);
      }
    };
  }, [photos]);

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
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;
      
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  return (
    <Card className="shadow-sm bg-card rounded-lg">
      <div className="relative">
        {showLeftButton && (
          <button 
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-card rounded-full shadow-md p-1"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
        )}
        
        {showRightButton && (
          <button 
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-card rounded-full shadow-md p-1"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        )}
        
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto hide-scrollbar pb-2 px-4 pt-4 gap-2"
        >
          {photos.map(photo => (
            <div key={photo.id} className="flex-none w-[calc(33.333%-8px)] min-w-[120px] space-y-1">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img 
                  src={photo.url} 
                  alt={`Featured photo ${photo.id}`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-center text-sm font-medium py-1">Collection</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="px-4 pb-4 pt-1">
        <Button variant="outline" className="w-full rounded-md h-12 text-base font-medium">
          Edit featured
        </Button>
      </div>
    </Card>
  );
};

export default FeaturedPhotosSection;
