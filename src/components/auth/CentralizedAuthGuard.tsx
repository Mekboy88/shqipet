import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { GlobalSkeleton } from '@/components/ui/GlobalSkeleton';

interface CentralizedAuthGuardProps {
  children: React.ReactNode;
}

const publicRoutes = [
  '/', // Allow root path (mobile login renders here)
  '/auth',
  '/auth/login', 
  '/auth/register', 
  '/register', 
  '/auth/verification', 
  '/auth/callback', 
  '/terms-of-use', 
  '/privacy-policy',
  '/auth/forgot-password',
  // Public compose routes
  '/create-post',
  '/compose',
  '/post/create',
  // Messages routes
  '/messages',
  '/messages/standalone'
];

const CentralizedAuthGuard: React.FC<CentralizedAuthGuardProps> = ({ children }) => {
  // Safe auth access with early return
  let authContext;
  try {
    authContext = useAuth();
  } catch (error) {
    console.warn('CentralizedAuthGuard: Auth context not ready yet');
    // Redirect to root for login
    return <Navigate to="/" replace />;
  }
  
  const { user, loading } = authContext;
  const location = useLocation();
  const [forceRender, setForceRender] = React.useState(false);
  
  // Enhanced logging for debugging
  console.log('🛡️ CentralizedAuthGuard:', {
    loading,
    hasUser: !!user,
    userEmail: user?.email,
    path: location.pathname,
    forceRender,
    timestamp: new Date().toISOString()
  });

  // Reduced timeout and better handling
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('⚠️ CentralizedAuthGuard: Auth taking too long, showing fallback');
        setForceRender(true);
      }
    }, 1500); // Reduced from 3 seconds

    return () => clearTimeout(timeout);
  }, [loading]);

  // Add a useEffect to track loading state changes
  React.useEffect(() => {
    console.log('🔄 CentralizedAuthGuard: Loading state changed to:', loading);
    if (!loading) {
      setForceRender(false); // Reset force render when loading completes normally
    }
  }, [loading]);

  React.useEffect(() => {
    console.log('👤 CentralizedAuthGuard: User state changed to:', !!user, user?.email);
  }, [user]);
  
  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(location.pathname);
  // Routes where we must not flash the skeleton (render immediately)
  const noSkeletonRoutes = [
    '/', // Root can be login on mobile
    '/professional-presentation', 
    '/create-post', 
    '/compose', 
    '/post/create',
    '/auth',
    '/auth/login',
    '/auth/register',
    '/register',
    '/auth/verification',
    '/auth/callback',
    '/auth/forgot-password'
  ];
  
// CRITICAL: While auth initializes, avoid skeleton on public routes
if (loading && !forceRender) {
  console.log('⏳ CentralizedAuthGuard: Auth still loading', { path: location.pathname });

  // If not on a public route, navigate to root (login renders there)
  if (!isPublicRoute) {
    try {
      const fullPath = location.pathname + location.search + location.hash;
      sessionStorage.setItem('redirectAfterAuth', fullPath);
    } catch {}
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (noSkeletonRoutes.includes(location.pathname)) {
    // Render page content immediately to avoid flicker on fast paths
    return <>{children}</>;
  }

  // Other cases can show the global skeleton
  return <GlobalSkeleton />;
}
  
  // If we're force rendering due to timeout, treat as if auth completed
  if (forceRender) {
    console.log('🚨 CentralizedAuthGuard: Force rendering due to timeout');
  }
  
  // If user is authenticated and on auth pages, redirect to preserved path or home
  if (
    user &&
    (location.pathname === '/auth' || location.pathname.startsWith('/auth/') || location.pathname === '/welcome')
  ) {
    console.log('🔄 CentralizedAuthGuard: Authenticated user on auth page, checking for preserved path');
    const redirectPath = sessionStorage.getItem('redirectAfterAuth');
    if (redirectPath && redirectPath !== '/auth/login' && redirectPath !== '/auth/register') {
      sessionStorage.removeItem('redirectAfterAuth');
      console.log('🔄 Redirecting to preserved path:', redirectPath);
      return <Navigate to={redirectPath} replace />;
    }
    // Only redirect to home from auth pages, not from other protected pages
    return <Navigate to="/" replace />;
  }
  
  // If user is not authenticated and on protected route, redirect to root
  if (!user && !isPublicRoute && !forceRender) {
    console.log('🚫 CentralizedAuthGuard: Unauthenticated user on protected route, redirecting to root');
    try {
      const fullPath = location.pathname + location.search + location.hash;
      sessionStorage.setItem('redirectAfterAuth', fullPath);
    } catch {}
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  
  // Render children for all other cases
  console.log('✅ CentralizedAuthGuard: Rendering children');
  return <>{children}</>;
};

export default CentralizedAuthGuard;