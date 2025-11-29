
import { useEffect, RefObject } from 'react';

export const useMenuScrollIsolation = (
  isMenuOpen: boolean,
  popoverContentRef: RefObject<HTMLDivElement>
) => {
  useEffect(() => {
    if (!isMenuOpen) return;
    console.log('🎯 MENU DROPDOWN SCROLL ISOLATION - Isolating menu dropdown');
    
    const handleWheelEvent = (e: WheelEvent) => {
      const popoverContent = popoverContentRef.current;
      if (!popoverContent) return;

      const rect = popoverContent.getBoundingClientRect();
      const isInsideDropdown = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      
      if (isInsideDropdown) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const currentScroll = popoverContent.scrollTop;
        const maxScroll = popoverContent.scrollHeight - popoverContent.clientHeight;
        const newScroll = Math.max(0, Math.min(currentScroll + e.deltaY, maxScroll));
        
        if (maxScroll > 0) {
          popoverContent.scrollTop = newScroll;
        }
        console.log('✅ Menu dropdown scroll applied');
        return false;
      }
    };

    document.addEventListener('wheel', handleWheelEvent, {
      passive: false,
      capture: true
    });
    
    return () => {
      document.removeEventListener('wheel', handleWheelEvent, true);
      console.log('🔓 Menu dropdown scroll isolation removed');
    };
  }, [isMenuOpen, popoverContentRef]);
};
