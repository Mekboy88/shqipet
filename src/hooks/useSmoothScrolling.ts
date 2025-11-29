
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSmoothScrollingProps {
  containerRef: React.RefObject<HTMLDivElement>;
  scrollMultiplier?: number;
  showScrollIndicator?: boolean;
  hoverBasedVisibility?: boolean;
}

export const useSmoothScrolling = ({
  containerRef,
  scrollMultiplier = 3,
  showScrollIndicator = true,
  hoverBasedVisibility = false
}: UseSmoothScrollingProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(20);
  const [isVisible, setIsVisible] = useState(false);
  const [canScroll, setCanScroll] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateScrollProgress = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const maxScrollTop = scrollHeight - clientHeight;
    const progress = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
    
    setScrollProgress(Math.min(Math.max(progress, 0), 1));
    setCanScroll(maxScrollTop > 5);

    // Calculate thumb height as percentage of track
    const heightRatio = clientHeight / scrollHeight;
    const calculatedThumbHeight = Math.max(heightRatio * 100, 5);
    setThumbHeight(Math.min(calculatedThumbHeight, 95));
  }, [containerRef]);

  const handleScrollActivity = useCallback(() => {
    if (!showScrollIndicator) return;
    
    // If using hover-based visibility, only show when hovered
    if (hoverBasedVisibility) {
      if (isHovered) {
        setIsVisible(true);
      }
    } else {
      // Original behavior: show on scroll activity
      setIsVisible(true);
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        if (!isHovered) {
          setIsVisible(false);
        }
      }, 1000);
    }
  }, [isHovered, showScrollIndicator, hoverBasedVisibility]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (showScrollIndicator && canScroll) {
      setIsVisible(true);
    }
  }, [showScrollIndicator, canScroll]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    if (showScrollIndicator && hoverBasedVisibility) {
      // For hover-based visibility, hide immediately when leaving
      setIsVisible(false);
    } else if (showScrollIndicator) {
      // Original behavior with timeout
      scrollTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 800);
    }
  }, [showScrollIndicator, hoverBasedVisibility]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set native smooth scrolling behavior
    container.style.scrollBehavior = 'smooth';
    container.style.overflowY = 'auto';
    container.style.overflowX = 'hidden';

    const handleScroll = () => {
      requestAnimationFrame(updateScrollProgress);
      handleScrollActivity();
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Initial update
    updateScrollProgress();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [updateScrollProgress, handleScrollActivity, handleMouseEnter, handleMouseLeave]);

  return {
    scrollProgress,
    thumbHeight,
    isVisible,
    canScroll,
    isHovered,
    handleScrollActivity,
    handleMouseEnter,
    handleMouseLeave
  };
};
