import { useAuth } from '@/contexts/AuthContext';

export type UserRole = string | null;

export const useUserRole = () => {
  // Use centralized auth context instead of independent fetching
  const authContext = useAuth();
  
  return {
    userRole: authContext.userRole,
    userLevel: authContext.userLevel,
    loading: authContext.loading,
    error: null,
    isSuperAdmin: authContext.isSuperAdmin,
    isAdmin: authContext.isAdmin,
    isModerator: authContext.isModerator,
    isPlatformOwner: authContext.isPlatformOwner,
    canManageUsers: authContext.canManageUsers
  };
};