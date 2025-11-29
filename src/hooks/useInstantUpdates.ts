// Hook to ensure instant updates by clearing caches and forcing refreshes
import { useEffect } from 'react';
import { clearAllCaches, enableInstantUpdates, forceComponentRefresh } from '@/utils/instantUpdates';

export const useInstantUpdates = () => {
  useEffect(() => {
    // Clear any existing local storage for avatar/cover data on startup
    try {
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.includes('avatar') || key.includes('cover') || key.includes('_v2')
      );
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log('🧹 Cleared avatar/cover localStorage on startup');
    } catch (e) {
      console.warn('Failed to clear localStorage:', e);
    }
    
    // Initialize instant updates system only in development
    if (import.meta.env.DEV) {
      enableInstantUpdates();
      
      // Force component refresh on mount
      forceComponentRefresh();
      
      // Clear all caches periodically in development
      clearAllCaches().catch(console.error);
      
      // Set up periodic cache clearing
      const interval = setInterval(() => {
        clearAllCaches().catch(console.error);
      }, 30000); // Every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, []);

  return {};
};