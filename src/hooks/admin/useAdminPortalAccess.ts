
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AdminPortalAccess {
  hasAccess: boolean;
  portalUrl: string | null;
  role: string | null;
  loading: boolean;
}

export const useAdminPortalAccess = (): AdminPortalAccess => {
  const { user, userProfile, adminRole, isAdmin } = useAuth();
  const [portalAccess, setPortalAccess] = useState<AdminPortalAccess>({
    hasAccess: false,
    portalUrl: null,
    role: null,
    loading: true
  });

  useEffect(() => {
    const checkPortalAccess = async () => {
      if (!user || !userProfile) {
        setPortalAccess({
          hasAccess: false,
          portalUrl: null,
          role: null,
          loading: false
        });
        return;
      }

      if (isAdmin && adminRole) {
        // Check if portal exists for this user in localStorage
        const savedPortals = JSON.parse(localStorage.getItem('adminPortals') || '[]');
        const userPortal = savedPortals.find((p: any) => 
          p.userId === (userProfile.user_id || userProfile.id) && 
          p.role === adminRole
        );

        if (userPortal) {
          setPortalAccess({
            hasAccess: true,
            portalUrl: `/admin/portal/${userPortal.portalId}`,
            role: adminRole,
            loading: false
          });
        } else {
          // User has admin role but no portal exists yet
          // This can happen if the role was just granted but portal hasn't been created
          console.log('🔄 User has admin role but no portal exists yet, triggering portal creation');
          
          // Trigger portal creation event
          window.dispatchEvent(new CustomEvent('newAdminGranted', { 
            detail: { 
              userId: userProfile.id, 
              userName: `${userProfile.first_name} ${userProfile.last_name}`,
              userEmail: userProfile.email
            }
          }));
          
          setPortalAccess({
            hasAccess: true,
            portalUrl: null, // Will be set once portal is created
            role: adminRole,
            loading: false
          });
        }
      } else {
        setPortalAccess({
          hasAccess: false,
          portalUrl: null,
          role: null,
          loading: false
        });
      }
    };

    checkPortalAccess();

    // Listen for portal updates
    const handlePortalUpdate = () => {
      setTimeout(checkPortalAccess, 500);
    };

    window.addEventListener('storage', handlePortalUpdate);
    window.addEventListener('newAdminGranted', handlePortalUpdate);

    return () => {
      window.removeEventListener('storage', handlePortalUpdate);
      window.removeEventListener('newAdminGranted', handlePortalUpdate);
    };
  }, [user, userProfile]);

  return portalAccess;
};
