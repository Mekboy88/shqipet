
import { useState, useEffect, useRef } from 'react';

export const usePhotoDialogScroll = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateScrollProgress = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      
      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
      
      console.log('Scroll update:', { 
        scrollTop, 
        scrollHeight, 
        clientHeight, 
        maxScroll, 
        progress,
        canScroll: maxScroll > 5
      });
      
      setScrollProgress(Math.min(Math.max(progress, 0), 1));
      setCanScroll(maxScroll > 5); // Only show if there's more than 5px to scroll
    };

    // Initial check
    updateScrollProgress();

    // Immediate scroll handler for instant response
    const handleScroll = () => {
      // Use requestAnimationFrame for smooth 60fps updates
      requestAnimationFrame(updateScrollProgress);
    };

    // Remove scroll behavior override - let it be natural
    container.style.scrollBehavior = 'auto';

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also check on resize in case content changes
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateScrollProgress);
    });
    resizeObserver.observe(container);

    // Force a recheck after a short delay to ensure content is loaded
    const recheckTimeout = setTimeout(() => {
      updateScrollProgress();
    }, 100);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      clearTimeout(recheckTimeout);
    };
  }, []);

  return {
    scrollProgress,
    canScroll,
    scrollContainerRef
  };
};
