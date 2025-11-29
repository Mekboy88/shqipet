
import React from 'react';
import { UserProfile } from '@/types/user';
import { UserDetailsDialog } from './UserDetailsDialog';
import { EditUserDialog } from './EditUserDialog';
import { ChangeStatusDialog } from './ChangeStatusDialog';
import { ResetPasswordDialog } from './ResetPasswordDialog';
import { PermissionsDialog } from './PermissionsDialog';

interface AdminUsersDialogManagerProps {
  viewingUser: UserProfile | null;
  editingUser: UserProfile | null;
  statusChangeUser: UserProfile | null;
  resetPasswordUserId: string | null;
  permissionsUser: UserProfile | null;
  onCloseViewDialog: () => void;
  onCloseEditDialog: () => void;
  onCloseStatusDialog: () => void;
  onCloseResetDialog: () => void;
  onClosePermissionsDialog: () => void;
  onEditUser: (user: UserProfile) => void;
  onSaveUser: (user: UserProfile) => Promise<void>;
  onResetPassword: (userId: string, reason: string) => Promise<void>;
  onStatusChange: (userId: string, status: string, reason: string) => Promise<void>;
  onUpdatePermissions: (userId: string, permissions: Record<string, boolean>) => Promise<void>;
  onRoleGranted?: () => void; // Enhanced callback for role granting
}

export function AdminUsersDialogManager({
  viewingUser,
  editingUser,
  statusChangeUser,
  resetPasswordUserId,
  permissionsUser,
  onCloseViewDialog,
  onCloseEditDialog,
  onCloseStatusDialog,
  onCloseResetDialog,
  onClosePermissionsDialog,
  onEditUser,
  onSaveUser,
  onResetPassword,
  onStatusChange,
  onUpdatePermissions,
  onRoleGranted
}: AdminUsersDialogManagerProps) {
  return (
    <>
      {/* User Details Dialog */}
      {viewingUser && (
        <UserDetailsDialog
          user={viewingUser}
          isOpen={!!viewingUser}
          onClose={onCloseViewDialog}
          onEdit={onEditUser}
        />
      )}

      {/* User Edit Dialog */}
      {editingUser && (
        <EditUserDialog
          user={editingUser}
          isOpen={!!editingUser}
          onClose={onCloseEditDialog}
          onSave={onSaveUser}
        />
      )}

      {/* User Status Change Dialog */}
      {statusChangeUser && (
        <ChangeStatusDialog
          user={statusChangeUser}
          isOpen={!!statusChangeUser}
          onClose={onCloseStatusDialog}
          onStatusChange={onStatusChange}
        />
      )}

      {/* User Reset Password Dialog */}
      {resetPasswordUserId && (
        <ResetPasswordDialog
          userId={resetPasswordUserId}
          isOpen={!!resetPasswordUserId}
          onClose={onCloseResetDialog}
          onResetPassword={onResetPassword}
        />
      )}

      {/* User Permissions Dialog - Enhanced with role granting callback */}
      {permissionsUser && (
        <PermissionsDialog
          user={permissionsUser}
          isOpen={!!permissionsUser}
          onClose={onClosePermissionsDialog}
          onUpdatePermissions={(permissions) => onUpdatePermissions(permissionsUser.id, permissions)}
          onRoleGranted={onRoleGranted}
        />
      )}
    </>
  );
}
