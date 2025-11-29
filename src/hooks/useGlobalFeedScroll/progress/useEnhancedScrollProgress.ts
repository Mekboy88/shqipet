
import { useRef, useCallback, useEffect } from 'react';

interface UseEnhancedScrollProgressProps {
  feedContainerRef: React.RefObject<HTMLDivElement>;
  setScrollProgress: (progress: number) => void;
}

export const useEnhancedScrollProgress = ({ 
  feedContainerRef, 
  setScrollProgress 
}: UseEnhancedScrollProgressProps) => {
  const lastProgressUpdate = useRef(0);
  const animationFrameRef = useRef<number>();
  const mutationObserver = useRef<MutationObserver>();
  const resizeObserver = useRef<ResizeObserver>();

  const updateScrollProgress = useCallback(() => {
    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const container = feedContainerRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const maxScrollTop = scrollHeight - clientHeight;
      
      if (maxScrollTop <= 0) {
        if (lastProgressUpdate.current !== 0) {
          lastProgressUpdate.current = 0;
          setScrollProgress(0);
        }
        return;
      }
      
      // Ultra-precise progress calculation
      const rawProgress = scrollTop / maxScrollTop;
      const smoothProgress = Math.max(0, Math.min(rawProgress, 1));
      
      // Update with sub-pixel precision
      const changeThreshold = 0.00001; // Even finer precision
      if (Math.abs(smoothProgress - lastProgressUpdate.current) > changeThreshold) {
        lastProgressUpdate.current = smoothProgress;
        setScrollProgress(smoothProgress);
      }
    });
  }, [feedContainerRef, setScrollProgress]);

  // Set up observers for dynamic content changes
  useEffect(() => {
    const container = feedContainerRef.current;
    if (!container) return;

    // Mutation observer for DOM changes (new content loading)
    mutationObserver.current = new MutationObserver(() => {
      updateScrollProgress();
    });

    mutationObserver.current.observe(container, {
      childList: true,
      subtree: true,
      attributes: false
    });

    // Resize observer for layout changes
    resizeObserver.current = new ResizeObserver(() => {
      updateScrollProgress();
    });

    resizeObserver.current.observe(container);

    return () => {
      if (mutationObserver.current) {
        mutationObserver.current.disconnect();
      }
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, [updateScrollProgress]);

  const cleanup = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (mutationObserver.current) {
      mutationObserver.current.disconnect();
    }
    if (resizeObserver.current) {
      resizeObserver.current.disconnect();
    }
  };

  return { updateScrollProgress, cleanup };
};
