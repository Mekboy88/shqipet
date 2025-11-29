
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from '@/types/user';

export const useUserMutations = () => {
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: async (updatedUser: UserProfile) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          username: updatedUser.username,
          phone_number: updatedUser.phone_number,
          phone_verified: updatedUser.phone_verified,
          gender: updatedUser.gender,
          nationality: updatedUser.nationality,
          account_status: updatedUser.account_status,
          primary_role: updatedUser.primary_role,
          two_factor_enabled: updatedUser.two_factor_enabled,
          languages: updatedUser.languages,
        })
        .eq('id', updatedUser.id);

      if (error) throw error;
      return updatedUser;
    },
    onSuccess: () => {
      toast.success('User information has been successfully updated.');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      console.error('Error updating user:', error);
      toast.error(`Failed to update user: ${error.message}`);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      const { data: sessionData } = await supabase.auth.getSession();
      const adminId = sessionData.session?.user?.id;
      if (!adminId) throw new Error('Admin user not found.');

      // Log the admin action
      await supabase
        .from('admin_actions')
        .insert({
          actor_id: adminId,
          target_user_id: userId,
          action_type: 'password_reset',
          reason: reason
        });
      
      // Get user email first
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();
        
      if (userError) throw userError;
      if (!userData?.email) throw new Error('User email could not be found.');
      
      // Send password reset email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(userData.email);
      if (resetError) throw resetError;
      
      return { userId, email: userData.email };
    },
    onSuccess: () => {
      toast.success('A password reset email has been sent to the user.');
    },
    onError: (error: any) => {
      console.error('Error sending reset email:', error);
      toast.error(`Failed to send reset email: ${error.message}`);
    },
  });

  return {
    updateUser: updateUserMutation.mutate,
    updateUserAsync: updateUserMutation.mutateAsync,
    isUpdatingUser: updateUserMutation.isPending,
    resetPassword: resetPasswordMutation.mutate,
    resetPasswordAsync: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,
  };
};
