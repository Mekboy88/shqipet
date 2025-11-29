import { useAuth as useAuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  const context = useAuthContext();
  
  return {
    user: context.user,
    userRole: context.userRole || 'user',
    userLevel: context.userLevel,
    loading: context.loading,
    isSuperAdmin: context.isSuperAdmin,
    isAdmin: context.isAdmin,
    isModerator: context.isModerator,
    isPlatformOwner: context.isPlatformOwner,
    canManageUsers: context.canManageUsers,
    adminRole: context.adminRole,
  };
};