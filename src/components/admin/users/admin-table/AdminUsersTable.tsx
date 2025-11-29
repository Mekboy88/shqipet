
import React from 'react';
import { UserProfile } from '@/types/user';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { AdminTableRow } from './AdminTableRow';
import { AdminTableActions } from './AdminTableActions';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminUsersTableProps {
  users: UserProfile[];
  selectedUsers: string[];
  onSelectUser: (userId: string, isSelected: boolean) => void;
  onSelectAllUsers: (isSelected: boolean) => void;
  onViewDetails: (user: UserProfile) => void;
  onEditUser: (user: UserProfile) => void;
  onResetPassword: (userId: string) => void;
  onChangeStatus: (user: UserProfile) => void;
  onViewPermissions: (user: UserProfile) => void;
  isAllSelected: boolean;
  sortColumn: (column: string) => void;
  sortOrder: 'asc' | 'desc';
  sortBy: string;
  loading: boolean;
}

export function AdminUsersTable({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAllUsers,
  onViewDetails,
  onEditUser,
  onResetPassword,
  onChangeStatus,
  onViewPermissions,
  isAllSelected,
  sortColumn,
  sortOrder,
  sortBy,
  loading,
}: AdminUsersTableProps) {
  const SortableHeader = ({ column, children }: { column: string; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      onClick={() => sortColumn(column)}
      className="h-auto p-0 font-semibold text-gray-900 hover:text-gray-700"
    >
      <span className="flex items-center gap-1">
        {children}
        {sortBy === column ? (
          sortOrder === 'asc' ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-50" />
        )}
      </span>
    </Button>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b border-gray-200">
            <TableHead className="text-center w-12">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={onSelectAllUsers}
              />
            </TableHead>
            <TableHead className="w-24 text-gray-600 font-semibold">ID</TableHead>
            <TableHead className="text-gray-600 font-semibold">
              <SortableHeader column="first_name">User</SortableHeader>
            </TableHead>
            <TableHead className="text-gray-600 font-semibold">
              <SortableHeader column="email">Email</SortableHeader>
            </TableHead>
            <TableHead className="text-gray-600 font-semibold">Role</TableHead>
            <TableHead className="text-gray-600 font-semibold">
              <SortableHeader column="account_status">Status</SortableHeader>
            </TableHead>
            <TableHead className="text-gray-600 font-semibold">
              <SortableHeader column="created_at">Created</SortableHeader>
            </TableHead>
            <TableHead className="text-gray-600 font-semibold">
              <SortableHeader column="last_login">Last Login</SortableHeader>
            </TableHead>
            <TableHead className="text-right text-gray-600 font-semibold w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <td colSpan={9} className="text-center py-8 text-gray-500">
                No admin users found matching your criteria.
              </td>
            </TableRow>
          ) : (
            users.map((user) => (
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
