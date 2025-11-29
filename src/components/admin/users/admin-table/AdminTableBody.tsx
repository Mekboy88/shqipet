
import React from 'react';
import { UserProfile } from '@/types/user';
import { TableBody } from '@/components/ui/table';
import { AdminTableRow } from './AdminTableRow';

interface AdminTableBodyProps {
  users: UserProfile[];
  selectedUsers: string[];
  onSelectUser: (userId: string, isSelected: boolean) => void;
  onViewDetails: (user: UserProfile) => void;
  onEditUser: (user: UserProfile) => void;
  onResetPassword: (userId: string) => void;
  onChangeStatus: (user: UserProfile) => void;
  onViewPermissions: (user: UserProfile) => void;
}

export function AdminTableBody({
  users,
  selectedUsers,
  onSelectUser,
  onViewDetails,
  onEditUser,
  onResetPassword,
  onChangeStatus,
  onViewPermissions
}: AdminTableBodyProps) {
  return (
    <TableBody>
      {users.map((user) => (
        <AdminTableRow
          key={user.id}
          user={user}
          isSelected={selectedUsers.includes(user.id)}
          onSelectUser={onSelectUser}
          onViewDetails={onViewDetails}
          onEditUser={onEditUser}
          onResetPassword={onResetPassword}
          onChangeStatus={onChangeStatus}
          onViewPermissions={onViewPermissions}
        />
      ))}
    </TableBody>
  );
}
