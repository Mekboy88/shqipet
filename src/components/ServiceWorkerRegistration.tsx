/**
 * ServiceWorkerRegistration - Registers avatar cache service worker
 */

import { useEffect } from 'react';
import { useServiceWorker } from '@/hooks/useServiceWorker';

const ServiceWorkerRegistration = () => {
  // This hook handles the registration
  const { isOfflineReady, needRefresh } = useServiceWorker();

  useEffect(() => {
    if (isOfflineReady) {
      console.log('✅ Avatar cache service worker ready');
    }
  }, [isOfflineReady]);

  useEffect(() => {
    if (needRefresh) {
      console.log('🔄 New service worker version available');
    }
  }, [needRefresh]);

  return null; // This is a bootstrap component, renders nothing
};

export default ServiceWorkerRegistration;
