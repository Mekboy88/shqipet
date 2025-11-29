
import { useState, useEffect } from 'react';
import { useSecureRoles } from './use-secure-roles';

export function useSuperAdminCheck() {
  const { currentUserRole, loading: roleLoading } = useSecureRoles();
  const [superAdminExists, setSuperAdminExists] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkSuperAdminStatus = async () => {
    try {
      setLoading(true);
      
      // Check if current user is super admin
      const isSuperAdmin = currentUserRole === 'super_admin';
      setSuperAdminExists(isSuperAdmin);
      
    } catch (error) {
      console.error('Error checking super admin status:', error);
      setSuperAdminExists(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!roleLoading) {
      checkSuperAdminStatus();
    }
  }, [currentUserRole, roleLoading]);

  const refetch = () => {
    checkSuperAdminStatus();
  };

  return {
    superAdminExists,
    loading: loading || roleLoading,
    refetch
  };
}
