
import React from 'react';
import { UserProfile } from '@/types/user';
import { UsersDialogManager } from '@/components/admin/users/UsersDialogManager';

interface UsersDialogSectionProps {
  viewingUser: UserProfile | null;
  editingUser: UserProfile | null;
  statusChangeUser: UserProfile | null;
  resetPasswordUserId: string | null;
  onCloseViewDialog: () => void;
  onCloseEditDialog: () => void;
  onCloseStatusDialog: () => void;
  onCloseResetDialog: () => void;
  onEditUser: (user: UserProfile) => void;
  onSaveUser: (user: UserProfile) => Promise<void>;
  onStatusChange: (userId: string, status: string, reason: string) => Promise<void>;
  onResetPassword: (userId: string, reason: string) => Promise<void>;
}

export function UsersDialogSection({
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
  onStatusChange,
  onResetPassword,
}: UsersDialogSectionProps) {
  return (
    <UsersDialogManager
      viewingUser={viewingUser}
      editingUser={editingUser}
      statusChangeUser={statusChangeUser}
      resetPasswordUserId={resetPasswordUserId}
      onCloseViewDialog={onCloseViewDialog}
      onCloseEditDialog={onCloseEditDialog}
      onCloseStatusDialog={onCloseStatusDialog}
      onCloseResetDialog={onCloseResetDialog}
      onEditUser={onEditUser}
      onSaveUser={onSaveUser}
      onResetPassword={onResetPassword}
      onStatusChange={onStatusChange}
    />
  );
}
