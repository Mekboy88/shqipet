
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { SimpleUserProfile } from '../types/impersonation-types';

export const useImpersonationLogic = () => {
  const [selectedUser, setSelectedUser] = useState<SimpleUserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [currentUser, setCurrentUser] = useState<SimpleUserProfile | null>(null);

  // Check current impersonation status
  useEffect(() => {
    const checkImpersonation = () => {
      const stored = localStorage.getItem('admin_impersonation');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setIsImpersonating(true);
          setCurrentUser(data.user);
        } catch (e) {
          localStorage.removeItem('admin_impersonation');
        }
      }
    };
    
    checkImpersonation();
  }, []);

  const openModal = useCallback((user: SimpleUserProfile) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(null);
  }, []);

  const startImpersonation = useCallback(async (reason: string, adminId: string) => {
    if (!selectedUser) return;

    try {
      // Log the action
      const { error } = await supabase
        .from('admin_actions')
        .insert({
          actor_id: adminId,
          target_user_id: selectedUser.id,
          action_type: 'impersonation_started',
          reason: reason
        });

      if (error) throw error;

      // Store impersonation data
      const impersonationData = {
        user: selectedUser,
        startTime: new Date().toISOString(),
        reason: reason,
        adminId: adminId
      };

      localStorage.setItem('admin_impersonation', JSON.stringify(impersonationData));

      setIsImpersonating(true);
      setCurrentUser(selectedUser);
      setIsModalOpen(false);
      
      toast.success('Impersonation started', {
        description: `You are now impersonating ${selectedUser.username || selectedUser.email}`
      });
    } catch (error: any) {
      console.error('Error starting impersonation:', error);
      toast.error('Failed to start impersonation', { 
        description: error.message 
      });
    }
  }, [selectedUser]);

  const endImpersonation = useCallback(async () => {
    if (!currentUser) return;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const adminId = sessionData.session?.user.id;

      if (adminId) {
        await supabase
          .from('admin_actions')
          .insert({
            actor_id: adminId,
            target_user_id: currentUser.id,
            action_type: 'impersonation_ended',
            reason: "Impersonation ended by admin"
          });
      }

      localStorage.removeItem('admin_impersonation');
      setIsImpersonating(false);
      setCurrentUser(null);
      
      toast.success('Impersonation ended', {
        description: 'You have returned to your admin account'
      });
    } catch (error: any) {
      console.error('Error ending impersonation:', error);
      toast.error('Failed to end impersonation', { 
        description: error.message 
      });
    }
  }, [currentUser]);

  return {
    selectedUser,
    isModalOpen,
    isImpersonating,
    currentUser,
    openModal,
    closeModal,
    startImpersonation,
    endImpersonation
  };
};
