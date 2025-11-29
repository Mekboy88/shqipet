
import { useEffect } from 'react';

export const usePhotoDialogEvents = (
  onClose: () => void,
  scrollContainerRef: React.RefObject<HTMLDivElement>,
  handleScrollActivity: () => void
) => {
  // Enhanced scroll prevention when dialog is open
  useEffect(() => {
    // Save current styles
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    
    const scrollY = window.scrollY;
    
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Track scroll activity for indicator visibility
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = (e: Event) => {
      // Allow this scroll event - it's within our dialog
      e.stopPropagation();
      handleScrollActivity();
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScrollActivity]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscapeKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Only prevent backdrop wheel events (outside the dialog content)
  const handleBackdropWheel = (e: React.WheelEvent) => {
    // Only prevent if the event is on the backdrop itself, not dialog content
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Allow internal scrolling but prevent page scrolling when at boundaries
  const handleContentScroll = (e: React.UIEvent) => {
    e.stopPropagation();
    handleScrollActivity();
  };

  // Simplified wheel handling - allow scrolling within dialog, prevent background scrolling
  const handleDialogWheel = (e: React.WheelEvent) => {
    // Stop propagation to prevent affecting the page behind the dialog
    e.stopPropagation();
    // Don't prevent default - allow normal scrolling within the dialog
  };

  return {
    handleBackdropClick,
    handleEscapeKey,
    handleBackdropWheel,
    handleContentScroll,
    handleDialogWheel
  };
};
