import { useCallback, useRef } from 'react';

interface UseHorizontalScrollOptions {
  scrollMultiplier?: number;
  preventVerticalScroll?: boolean;
}

export const useHorizontalScroll = (options: UseHorizontalScrollOptions = {}) => {
  const { scrollMultiplier = 1, preventVerticalScroll = false } = options;
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    
    // Check if this is primarily horizontal or vertical movement
    const isHorizontalMovement = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    const isVerticalMovement = Math.abs(e.deltaY) > Math.abs(e.deltaX);
    
    // Handle direct horizontal scroll (trackpad horizontal swipe)
    if (isHorizontalMovement && Math.abs(e.deltaX) > 0) {
      e.preventDefault();
      e.stopPropagation();
      container.scrollLeft += e.deltaX * scrollMultiplier;
      console.log('🔄 Direct horizontal scroll:', e.deltaX);
      return;
    }
    
    // Convert vertical wheel to horizontal scroll when preventVerticalScroll is true
    if (isVerticalMovement && preventVerticalScroll && Math.abs(e.deltaY) > 0) {
      e.preventDefault();
      e.stopPropagation();
      container.scrollLeft += e.deltaY * scrollMultiplier;
      console.log('🔄 Vertical-to-horizontal scroll:', e.deltaY);
      return;
    }
    
    // For vertical movement when preventVerticalScroll is false, allow it to bubble
    if (isVerticalMovement && !preventVerticalScroll) {
      console.log('🔄 Allowing vertical scroll to bubble up');
      // Don't prevent default or stop propagation - let it bubble to global handler
      return;
    }
  }, [scrollMultiplier, preventVerticalScroll]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const touch = e.touches[0];
    container.dataset.touchStartX = touch.clientX.toString();
    container.dataset.touchStartY = touch.clientY.toString();
    container.dataset.touchStartScrollLeft = container.scrollLeft.toString();
    container.dataset.touchStartTime = Date.now().toString();
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const touch = e.touches[0];
    const startX = parseFloat(container.dataset.touchStartX || '0');
    const startY = parseFloat(container.dataset.touchStartY || '0');
    const startScrollLeft = parseFloat(container.dataset.touchStartScrollLeft || '0');
    
    if (startX && startY) {
      const deltaX = startX - touch.clientX;
      const deltaY = startY - touch.clientY;
      
      // Determine if this is primarily horizontal or vertical movement
      const isHorizontalMovement = Math.abs(deltaX) > Math.abs(deltaY);
      
      if (isHorizontalMovement) {
        // Prevent vertical scrolling when we're doing horizontal scroll
        e.preventDefault();
        container.scrollLeft = startScrollLeft + deltaX;
        console.log('🔄 Horizontal touch scroll:', deltaX);
      } else if (preventVerticalScroll) {
        // Convert vertical touch to horizontal if preventVerticalScroll is true
        e.preventDefault();
        container.scrollLeft = startScrollLeft + deltaY;
        console.log('🔄 Vertical-to-horizontal touch scroll:', deltaY);
      }
      // Otherwise, let vertical movement bubble up for global scroll handling
    }
  }, [preventVerticalScroll]);

  return {
    containerRef,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    scrollProps: {
      onWheel: handleWheel,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
    }
  };
};
