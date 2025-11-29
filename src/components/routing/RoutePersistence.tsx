import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * RoutePersistence
 * - Persists the last visited route in sessionStorage
 * - On hard refresh, restores the exact route (path + query + hash)
 * - Skips auth flows (/auth/*) to avoid breaking login/registration
 */
const RoutePersistence = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Persist route on every change
  useEffect(() => {
    // Skip persisting during a pending restore to avoid overwriting lastRoute
    try {
      const allowRestore = sessionStorage.getItem('allowRouteRestore') === '1';
      const alreadyRestored = sessionStorage.getItem('lastRoute-restored') === '1';
      if (allowRestore && !alreadyRestored) {
        return;
      }
    } catch {}

    const fullPath = location.pathname + location.search + location.hash;
    try {
      sessionStorage.setItem('lastRoute', fullPath);
    } catch (e) {
      console.warn('RoutePersistence: failed to save lastRoute', e);
    }
  }, [location]);

  // Before unload, mark that we can restore on next load
  useEffect(() => {
    const handler = () => {
      try {
        sessionStorage.setItem('allowRouteRestore', '1');
      } catch {}
    };
    window.addEventListener('beforeunload', handler);
    return () => {
      window.removeEventListener('beforeunload', handler);
    };
  }, []);

  // On reload, if allowed, restore last route exactly (skip auth pages)
  useEffect(() => {
    try {
      const allowRestore = sessionStorage.getItem('allowRouteRestore') === '1';
      const current = location.pathname + location.search + location.hash;
      const lastRoute = sessionStorage.getItem('lastRoute') || '';
      const alreadyRestored = sessionStorage.getItem('lastRoute-restored') === '1';

      if (
        allowRestore &&
        !alreadyRestored &&
        lastRoute &&
        lastRoute !== current &&
        !current.startsWith('/auth/') &&
        !lastRoute.startsWith('/auth/')
      ) {
        sessionStorage.setItem('lastRoute-restored', '1');
        sessionStorage.removeItem('allowRouteRestore');
        navigate(lastRoute, { replace: true });
      } else {
        // Clear the flag even if we didn't navigate to avoid sticky state
        sessionStorage.removeItem('allowRouteRestore');
      }

      // Allow future reloads to restore again
      setTimeout(() => {
        try { sessionStorage.removeItem('lastRoute-restored'); } catch {}
      }, 0);
    } catch (e) {
      console.warn('RoutePersistence: restore failed', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default RoutePersistence;
