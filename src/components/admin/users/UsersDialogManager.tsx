
import React from 'react';
import { UserProfile } from '@/types/user';
import { UserDetailsDialog } from '@/components/admin/users/UserDetailsDialog';
import { EditUserDialog } from '@/components/admin/users/EditUserDialog';
import { ChangeStatusDialog } from '@/components/admin/users/ChangeStatusDialog';
import { ResetPasswordDialog } from '@/components/admin/users/ResetPasswordDialog';
import { toast } from '@/hooks/use-toast';

interface UsersDialogManagerProps {
  viewingUser: UserProfile | null;
  editingUser: UserProfile | null;
  statusChangeUser: UserProfile | null;
  resetPasswordUserId: string | null;
  onCloseViewDialog: () => void;
  onCloseEditDialog: () => void;
  onCloseStatusDialog: () => void;
  onCloseResetDialog: () => void;
  onEditUser: (user: UserProfile) => void;
  onSaveUser: (updatedUser: UserProfile) => Promise<void>;
  onResetPassword: (userId: string, reason: string) => Promise<void>;
  onStatusChange: (userId: string, status: string, reason: string) => Promise<void>;
}

export function UsersDialogManager({
  viewingUser,
  editingUser,
  statusChangeUser,
  resetPasswordUserId,
  onCloseViewDialog,
  onCloseEditDialog,
  onCloseStatusDialog,
  onCloseResetDialog,
  onEditUser,
  onSaveUser,
  onResetPassword,
  onStatusChange,
}: UsersDialogManagerProps) {
  const handleError = (action: string, error: Error) => {
    console.error(`Error ${action}:`, error);
    toast({
      variant: 'destructive',
      title: `Error ${action}`,
      description: error.message || 'An unknown error occurred',
    });
  };

  const handleSaveUser = async (user: UserProfile) => {
    try {
      await onSaveUser(user);
      toast({
        title: 'User updated',
        description: 'User information has been successfully updated.',
      });
    } catch (error: any) {
      handleError('updating user', error);
    }
  };

  const handleResetPassword = async (userId: string, reason: string) => {
    try {
      await onResetPassword(userId, reason);
    } catch (error: any) {
      handleError('resetting password', error);
    }
  };

  const handleStatusChange = async (userId: string, status: string, reason: string) => {
    try {
      await onStatusChange(userId, status, reason);
    } catch (error: any) {
      handleError('changing status', error);
    }
  };

  return (
    <>
      {/* User Details Dialog */}
      <UserDetailsDialog
        user={viewingUser}
        isOpen={!!viewingUser}
        onClose={onCloseViewDialog}
        onEdit={onEditUser}
      />
      
      {/* Edit User Dialog */}
      <EditUserDialog
        user={editingUser}
        isOpen={!!editingUser}
        onClose={onCloseEditDialog}
        onSave={handleSaveUser}
      />
      
      {/* Change Status Dialog */}
      <ChangeStatusDialog
        user={statusChangeUser}
        isOpen={!!statusChangeUser}
        onClose={onCloseStatusDialog}
        onStatusChange={handleStatusChange}
      />
      
      {/* Reset Password Dialog */}
      <ResetPasswordDialog
        userId={resetPasswordUserId || ''}
        isOpen={!!resetPasswordUserId}
        onClose={onCloseResetDialog}
        onResetPassword={handleResetPassword}
      />
    </>
  );
}
