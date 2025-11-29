
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationButtonsProps {
  showLeftButton: boolean;
  isHovering: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  showLeftButton,
  isHovering,
  onScrollLeft,
  onScrollRight
}) => {
  return (
    <>
      {showLeftButton && (
        <button 
          className="live-nav-button live-nav-button-left transition-none" 
          onClick={onScrollLeft}
          aria-label="View previous videos"
        >
          <ChevronLeft />
        </button>
      )}
      
      {isHovering && (
        <button 
          className="live-nav-button live-nav-button-right transition-none" 
          onClick={onScrollRight}
          aria-label="View more videos"
        >
          <ChevronRight />
        </button>
      )}
    </>
  );
};

export default NavigationButtons;
