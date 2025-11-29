
import { ElasticState } from './types';
import { updateIndicator, hideIndicator } from './indicator';
import { getMainContainer } from './domUtils';

export const createScrollHandler = (state: ElasticState) => {
  const handleScroll = () => {
    // Relaxed scroll protection: don't interrupt active elastic bounce
    if (state.isElasticActive) {
      // Let elastic finish; ignore this scroll event
      return;
    }

    // Mark scrolling active with gentle debounce
    state.isScrolling = true;

    // Show indicator subtly during normal scroll as well
    const scrollEl = (state.lastScrollEl as HTMLElement) || (getMainContainer() as HTMLElement) || document.documentElement;
    try {
      updateIndicator(scrollEl, 0);
    } catch {}

    // Clear any existing timeout
    if (state.scrollTimeout) {
      clearTimeout(state.scrollTimeout);
    }

    // Slightly longer debounce for smoother behavior (prevents flicker)
    state.scrollTimeout = setTimeout(() => {
      state.isScrolling = false;
      try {
        hideIndicator(scrollEl);
      } catch {}
    }, 150);
  };

  return { handleScroll };
};
