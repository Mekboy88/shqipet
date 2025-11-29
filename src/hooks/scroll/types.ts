
import { RefObject } from 'react';

export interface ScrollManagerProps {
  pageScrollRef: RefObject<HTMLDivElement>;
  headerRef: RefObject<HTMLDivElement>;
  sidebarScrollRef?: RefObject<HTMLDivElement>;
  rightSideScrollRef?: RefObject<HTMLDivElement>;
  mainContentRef?: RefObject<HTMLDivElement>;
}

export interface ScrollState {
  isNavigationSticky: boolean;
}
