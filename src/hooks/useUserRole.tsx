// Stub for frontend compatibility
export type UserRole = string | null;

export const useUserRole = () => {
  return {
    userRole: null,
    userLevel: 0,
    loading: false,
    error: null,
    isSuperAdmin: false,
    isAdmin: false,
    isModerator: false,
    isPlatformOwner: false,
    canManageUsers: false
  };
};
