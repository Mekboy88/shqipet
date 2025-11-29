
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  // Safe auth access with early return
  let authContext;
  try {
    authContext = useAuth();
  } catch (error) {
    console.warn('AuthGuard: Auth context not ready yet');
    return <Navigate to="/" replace />;
  }
  
  const { user } = authContext;

  // Immediate redirect if not authenticated - no loading states
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Render children immediately if authenticated
  return <>{children}</>;
};

export default AuthGuard;
