import { useEffect, useState } from 'react';
import { Workbox } from 'workbox-window';
import { useToast } from '@/hooks/use-toast';

export function useServiceWorker() {
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Only register SW in production for avatar caching
    if (import.meta.env.DEV) {
      console.log('⚡ Development mode: Service worker disabled for instant updates');
      return;
    }

    if ('serviceWorker' in navigator) {
      const wb = new Workbox('/sw.js');

      wb.addEventListener('installed', (event) => {
        if (event.isUpdate) {
          setNeedRefresh(true);
          toast({
            title: 'Update Available',
            description: 'A new version is available. Refresh to update.',
          });
        } else {
          setIsOfflineReady(true);
          console.log('✅ Avatar cache ready');
        }
      });

      wb.addEventListener('activated', () => {
        console.log('✅ Service worker activated');
        setIsOfflineReady(true);
      });

      wb.register().catch(error => {
        console.warn('Service worker registration failed:', error);
      });

      // Expose SW for preloading
      (window as any).__avatarSW = wb;
    }
  }, [toast]);

  return {
    isOfflineReady,
    needRefresh,
  };
}