
import { useCallback, useRef, RefObject } from 'react';

export const useScrollThreshold = (pageScrollRef: RefObject<HTMLDivElement>) => {
  const stickyThreshold = useRef(0);

  const getBorderLinePosition = useCallback(() => {
    // Find the specific border line element at the bottom of ProfileInfo section
    const borderElement = document.querySelector('.border-b.bg-gray-350');
    if (borderElement) {
      const rect = borderElement.getBoundingClientRect();
      const pageScroll = pageScrollRef.current;
      if (pageScroll) {
        // Calculate the exact position where the border should stick
        const borderTop = rect.top + pageScroll.scrollTop;
        // We want to stop when the border reaches the navigation position
        return borderTop - 60; // Increased buffer to prevent shaking
      }
    }
    return 0;
  }, [pageScrollRef]);

  const getThreshold = useCallback(() => {
    if (stickyThreshold.current === 0) {
      stickyThreshold.current = getBorderLinePosition();
    }
    return stickyThreshold.current;
  }, [getBorderLinePosition]);

  return {
    getThreshold,
    resetThreshold: () => { stickyThreshold.current = 0; }
  };
};
