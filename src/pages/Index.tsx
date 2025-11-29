
import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import Feed from '@/components/Feed';
import Login from '@/pages/auth/Login';

const Index = () => {
  const isMobileHost = typeof window !== 'undefined' && window.location.hostname === 'm.shqipet.com';
  
  // Safe auth access with error handling
  let authContext;
  try {
    authContext = useAuth();
  } catch (error) {
    console.warn('Index: Auth context not ready yet');
    if (isMobileHost) {
      return <Login />;
    }
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }
  
  const { user, loading } = authContext;
  console.log('🏠 Index page - user:', !!user, 'loading:', loading);
  
  // Show loading while checking auth
  if (loading) {
    if (isMobileHost) {
      // Mobile: show login instantly to avoid spinner/flicker
      return <Login />;
    }
    // Desktop: keep spinner
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }
  
  // On mobile or desktop: show login at root when unauthenticated
  if (!user) {
    return <Login />;
  }
  
  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full max-w-none mx-auto">
        <Feed />
      </div>
    </div>
  );
};

export default Index;
