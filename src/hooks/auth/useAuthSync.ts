
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthSync = () => {
  const { user, validateUserAccess, getCurrentAuthUserId } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Validate user access before setting up sync
    const currentAuthUserId = getCurrentAuthUserId();
    if (!currentAuthUserId || !validateUserAccess(currentAuthUserId)) {
      console.error('🚨 Auth sync blocked - invalid user access');
      return;
    }

    // Set up real-time listener for auth changes with security validation
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Validate session user matches current authenticated user
        if (session.user.id !== currentAuthUserId) {
          console.error('🚨 Token refresh user mismatch detected');
          toast.error('Session security violation detected');
          return;
        }
        
        console.log('🔄 Token refreshed, syncing profile...');
        // The sync is now handled in AuthContext directly with validation
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, validateUserAccess, getCurrentAuthUserId]);

  return null;
};
