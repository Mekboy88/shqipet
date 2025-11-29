
import React from 'react';
import { UserProfile } from '@/types/user';
import { UsersTable } from '@/components/admin/users/UsersTable';

interface UsersTableSectionProps {
  users: UserProfile[];
  selectedUsers: string[];
  onSelectUser: (userId: string, isSelected: boolean) => void;
  onSelectAllUsers: (isSelected: boolean) => void;
  onViewDetails: (user: UserProfile) => void;
  onEditUser: (user: UserProfile) => void;
  onDeleteUser: (userId: string) => void;
  onResetPassword: (userId: string) => void;
  onChangeStatus: (user: UserProfile) => void;
  isAllSelected: boolean;
  sortColumn: (column: string) => void;
  sortOrder: 'asc' | 'desc';
  sortBy: string;
  loading: boolean;
}

export function UsersTableSection(props: UsersTableSectionProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden w-full">
      <div className="w-full overflow-x-auto">
        <UsersTable
          users={props.users}
          selectedUsers={props.selectedUsers}
          onSelectUser={props.onSelectUser}
          onSelectAllUsers={props.onSelectAllUsers}
          onViewDetails={props.onViewDetails}
          onEditUser={props.onEditUser}
          onDeleteUser={props.onDeleteUser}
          onResetPassword={props.onResetPassword}
          onChangeStatus={props.onChangeStatus}
          isAllSelected={props.isAllSelected}
          sortColumn={props.sortColumn}
          sortOrder={props.sortOrder}
          sortBy={props.sortBy}
          loading={props.loading}
        />
      </div>
    </div>
  );
}
