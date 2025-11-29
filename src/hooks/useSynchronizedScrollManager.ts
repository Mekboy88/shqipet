
import { RefObject } from 'react';

interface ScrollManagerProps {
  pageScrollRef: RefObject<HTMLDivElement>;
  headerRef: RefObject<HTMLDivElement>;
  sidebarScrollRef: RefObject<HTMLDivElement>;
  rightSideScrollRef: RefObject<HTMLDivElement>;
  mainContentRef: RefObject<HTMLDivElement>;
}

// This hook is completely disabled - returns static values only
export const useSynchronizedScrollManager = (_props: ScrollManagerProps) => {
  return {
    isNavigationSticky: false
  };
};
