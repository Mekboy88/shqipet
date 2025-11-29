
import React, { useRef, useState } from 'react';
import { GraduationCap, Home, MapPin, Heart, ChevronRight, ChevronLeft } from 'lucide-react';
import Avatar from '@/components/Avatar';
import '../sidebar/featured-photos.css';

interface IntroSectionProps {
  school: string;
  location: string;
  hometown: string;
  relationship: string;
  featuredPhotos: Array<{
    id: string;
    url: string;
  }>;
}

const IntroSection: React.FC<IntroSectionProps> = ({
  school,
  location,
  hometown,
  relationship,
  featuredPhotos
}) => {
  // Scroll functionality
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);

  // Function to scroll the container left or right
  const scrollPhotos = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });

      // After scrolling right, we should show the left button
      if (direction === 'right') {
        setShowLeftButton(true);
      }

      // If we scroll to the beginning, hide the left button
      if (direction === 'left' && scrollContainerRef.current.scrollLeft + scrollAmount <= 0) {
        setShowLeftButton(false);
      }
    }
  };

  // Handle scroll event to determine if left button should be visible
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setShowLeftButton(scrollContainerRef.current.scrollLeft > 0);
    }
  };

  // Show only the first featured photo
  const singlePhoto = featuredPhotos.length > 0 ? [featuredPhotos[0]] : [];

  return (
    <div className="bg-card rounded-xl shadow-sm overflow-hidden">
      {/* Intro section with reduced padding */}
      <div className="p-2.5 py-[18px]">
        <h2 className="text-[18px] font-bold mb-0.5">Intro</h2>
        
        <button className="w-full bg-[#E4E6EB] hover:bg-[#D8DADF] text-black py-1 px-3 rounded-lg font-medium text-[14px] mt-1.5 transition-colors">
          Add bio
        </button>
        
        <div className="mt-2 space-y-[6px]">
          <div className="flex items-center py-[5px]">
            <div className="text-[#65676B] w-5">
              <GraduationCap className="h-[16px] w-[16px]" />
            </div>
            <div className="ml-1">
              <p className="text-[14.3px] py-[8px]">Studies at <span className="font-semibold hover:underline cursor-pointer">{school}</span></p>
            </div>
          </div>
          
          <div className="flex items-center py-[5px]">
            <div className="text-[#65676B] w-5">
              <Home className="h-[16px] w-[16px]" />
            </div>
            <div className="ml-1">
              <p className="text-[14.3px] py-[6px]">Lives in <span className="font-semibold hover:underline cursor-pointer">{location}</span></p>
            </div>
          </div>
          
          <div className="flex items-center py-[10px]">
            <div className="text-[#65676B] w-5">
              <MapPin className="h-[16px] w-[16px]" />
            </div>
            <div className="ml-1">
              <p className="text-[14.3px]">From <span className="font-semibold hover:underline cursor-pointer">{hometown}</span></p>
            </div>
          </div>
          
          <div className="flex items-center py-[10px]">
            <div className="text-[#65676B] w-5">
              <Heart className="h-[16px] w-[16px]" />
            </div>
            <div className="ml-1">
              <p className="text-[14.3px]">Married to <span className="font-semibold hover:underline cursor-pointer">{relationship}</span></p>
            </div>
          </div>
        </div>
        
        <button className="w-full bg-[#E4E6EB] hover:bg-[#D8DADF] text-black py-1 px-3 rounded-lg font-medium text-[14px] mt-2 transition-colors">
          Edit details
        </button>
      </div>

      {/* Featured photos section with single photo and lighter background */}
      <div className="bg-muted/30 relative">
        {/* Navigation buttons removed since we only have one photo */}
        
        {/* Single photo container with lighter, more transparent styling */}
        <div ref={scrollContainerRef} onScroll={handleScroll} className="flex pb-4 px-4 overflow-x-auto hide-scrollbar my-[-15px] py-[9px]" style={{ backgroundColor: 'rgba(248, 250, 252, 0.2)' }}>
          {singlePhoto.map(photo => (
            <div key={photo.id} className="flex-shrink-0 mr-3 flex flex-col" style={{
              height: "320px",
              width: "160px"
            }}>
              {/* Image container with lighter, more transparent overlay */}
              <div className="relative rounded-lg overflow-hidden" style={{ 
                height: "270px",
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid rgba(229, 231, 235, 0.3)'
              }}>
                <Avatar
                  className="w-full h-full rounded-lg opacity-80"
                  style={{ borderRadius: '8px' }}
                />
              </div>
              {/* Collection text with no opacity/shade */}
              <div style={{ height: "50px" }} className="flex items-center justify-center my-[12px]">
                <p className="text-sm font-medium text-gray-500">Collection</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-2.5 pb-2 pt-1 py-[6px]">
          <button className="w-full bg-[#E4E6EB] hover:bg-[#D8DADF] text-black py-1 px-3 rounded-lg font-medium text-[14px] transition-colors opacity-80">
            Edit featured
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
