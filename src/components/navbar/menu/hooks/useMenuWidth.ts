
import { useState, useEffect } from 'react';

export const useMenuWidth = (initialWidth: number = 610) => {
  const [menuWidth, setMenuWidth] = useState(initialWidth);

  useEffect(() => {
    (window as any).setMenuWidth = (width: number) => {
      setMenuWidth(width);
      console.log(`🎛️ Menu width set to: ${width}px`);
    };
    (window as any).getMenuWidth = () => {
      console.log(`📏 Current menu width: ${menuWidth}px`);
      return menuWidth;
    };
    console.log('🎮 Menu width console functions available:');
    console.log('- setMenuWidth(width) - Set menu width in pixels');
    console.log('- getMenuWidth() - Get current menu width');
    return () => {
      delete (window as any).setMenuWidth;
      delete (window as any).getMenuWidth;
    };
  }, [menuWidth]);

  return { menuWidth, setMenuWidth };
};
