
// Create the missing useGlobalConsole hook that's referenced in ViewSwitcher
import { useEffect } from 'react';

export const useGlobalConsole = () => {
  useEffect(() => {
    try {
      // Safely expose console access globally if needed
      if (typeof window !== 'undefined') {
        (window as any).__LOVABLE_CONSOLE__ = {
          log: console.log,
          error: console.error,
          warn: console.warn,
          info: console.info
        };
      }
    } catch (error) {
      console.warn('Failed to setup global console:', error);
    }
  }, []);
};
