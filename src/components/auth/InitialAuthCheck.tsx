import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Simple loading spinner component
const AuthLoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-muted-foreground text-sm">Loading...</p>
    </div>
  </div>
);

const InitialAuthCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Safe auth access with early return
  let authContext;
  try {
    authContext = useAuth();
  } catch (error) {
    console.warn('InitialAuthCheck: Auth context not ready yet');
    return <AuthLoadingScreen />;
  }
  
  const { user, loading } = authContext;
  const location = useLocation();
  
  // Check if we're on an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  console.log('🔍 InitialAuthCheck - loading:', loading, 'user:', !!user, 'email:', user?.email, 'path:', location.pathname);
  
  // STEP 1: Show loading screen while determining auth state
  if (loading) {
    console.log('🚀 InitialAuthCheck - Showing loading screen');
    return <AuthLoadingScreen />;
  }
  
  // STEP 2: If user is authenticated, show protected content (DO NOT REDIRECT - PRESERVE CURRENT URL)
  if (user) {
    console.log('✅ InitialAuthCheck - User authenticated, preserving current path:', location.pathname);
    return <>{children}</>;
  }
  
  // STEP 3: Only redirect if user is NOT authenticated
  console.log('🚫 InitialAuthCheck - No user, redirecting to login from:', location.pathname);
  
  // Store the current path before redirecting to login
  if (location.pathname !== '/auth/login' && location.pathname !== '/auth/register') {
    sessionStorage.setItem('redirectAfterAuth', location.pathname + location.search + location.hash);
    console.log('💾 Stored path for after login:', location.pathname + location.search + location.hash);
  }
  
  if (isAdminRoute) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <Navigate to="/" replace />;
};

export default InitialAuthCheck;