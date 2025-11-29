
import { useRef } from 'react';

export const useProfileRefs = () => {
  const pageScrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarScrollRef = useRef<HTMLDivElement>(null);
  const rightSideContentRef = useRef<HTMLDivElement>(null);

  return {
    pageScrollRef,
    headerRef,
    mainContentRef,
    sidebarRef,
    sidebarScrollRef,
    rightSideContentRef
  };
};
