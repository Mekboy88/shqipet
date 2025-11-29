
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { SimpleUserProfile } from '../types/impersonation-types';

export const useImpersonationActions = () => {
  // Log impersonation action to audit trail
  const logImpersonationAction = async (
    userId: string, 
    actionType: 'start' | 'end', 
    reason: string
  ) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const adminId = sessionData.session?.user.id;
      
      if (!adminId) throw new Error("Admin ID not found");
      
      const { error } = await supabase
        .from('admin_actions')
        .insert({
          actor_id: adminId,
          target_user_id: userId,
          action_type: actionType === 'start' ? 'impersonation_started' : 'impersonation_ended',
          reason: reason
        });
        
      if (error) throw error;
      
    } catch (error: any) {
      console.error('Error logging impersonation action:', error);
      toast.error('Failed to log impersonation action', { 
        description: error.message 
      });
    }
  };

  // Check if user is currently being impersonated
  const checkCurrentImpersonation = () => {
    const storedImpersonation = localStorage.getItem('admin_impersonation');
    if (storedImpersonation) {
      try {
        const impersonationData = JSON.parse(storedImpersonation);
        return {
          isImpersonating: true,
          currentUser: impersonationData.user
        };
      } catch (e) {
        localStorage.removeItem('admin_impersonation');
        return {
          isImpersonating: false,
          currentUser: null
        };
      }
    }
    return {
      isImpersonating: false,
      currentUser: null
    };
  };

  return {
    logImpersonationAction,
    checkCurrentImpersonation,
  };
};
