
import { useEffect } from 'react';

export const useMenuDropdownState = (isMenuOpen: boolean) => {
  useEffect(() => {
    (window as any).__dropdownOpen = isMenuOpen;
    console.log(`🎛️ Menu Dropdown state: ${isMenuOpen ? 'OPEN' : 'CLOSED'}`);
    return () => {
      if (!isMenuOpen) {
        (window as any).__dropdownOpen = false;
      }
    };
  }, [isMenuOpen]);
};
