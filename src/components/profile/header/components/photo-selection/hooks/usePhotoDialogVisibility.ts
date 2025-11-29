
import { useState, useEffect, useRef } from 'react';

export const usePhotoDialogVisibility = () => {
  const [isVisible, setIsVisible] = useState(true); // Start visible by default
  const [isHovered, setIsHovered] = useState(false);
  const visibilityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsVisible(true);
    if (visibilityTimeoutRef.current) {
      clearTimeout(visibilityTimeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Start fade out timer when not hovering
    visibilityTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 2000); // Hide after 2 seconds of no hover
  };

  const handleScrollActivity = () => {
    // Show indicator during scroll activity
    setIsVisible(true);
    if (visibilityTimeoutRef.current) {
      clearTimeout(visibilityTimeoutRef.current);
    }
    
    // Auto-hide after scroll stops (only if not hovering)
    if (!isHovered) {
      visibilityTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 1500);
    }
  };

  useEffect(() => {
    return () => {
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }
    };
  }, []);

  return {
    isVisible,
    handleMouseEnter,
    handleMouseLeave,
    handleScrollActivity
  };
};
