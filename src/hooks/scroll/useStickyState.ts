
import { useState, useCallback, useRef } from 'react';

export const useStickyState = () => {
  const [isNavigationSticky, setIsNavigationSticky] = useState(false);
  const lastStickyState = useRef(false);

  // Completely instant response with no debounce at all
  const updateStickyState = useCallback((shouldBeSticky: boolean) => {
    // Only update if the state actually changed
    if (lastStickyState.current !== shouldBeSticky) {
      // Completely instant response - no timeout at all
      lastStickyState.current = shouldBeSticky;
      setIsNavigationSticky(shouldBeSticky);
    }
  }, []);

  return {
    isNavigationSticky,
    updateStickyState
  };
};
