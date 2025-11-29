
import React from 'react';
import { TableHead, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

interface AdminTableHeaderProps {
  isAllSelected: boolean;
  onSelectAllUsers: (isSelected: boolean) => void;
  sortColumn: (column: string) => void;
  sortOrder: 'asc' | 'desc';
  sortBy: string;
}

export function AdminTableHeader({
  isAllSelected,
  onSelectAllUsers,
  sortColumn,
  sortOrder,
  sortBy
}: AdminTableHeaderProps) {
  const SortButton = ({ column, children }: { column: string; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      onClick={() => sortColumn(column)}
      className="h-auto p-0 font-medium hover:bg-transparent text-gray-700 hover:text-gray-900"
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <TableRow className="border-b border-gray-200">
      <TableHead className="w-12 text-center">
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={onSelectAllUsers}
        />
      </TableHead>
      <TableHead className="w-20 text-left">
        <SortButton column="id">ID</SortButton>
      </TableHead>
      <TableHead className="min-w-[200px]">
        <SortButton column="first_name">User</SortButton>
      </TableHead>
      <TableHead className="min-w-[200px]">
        <SortButton column="email">Email</SortButton>
      </TableHead>
      <TableHead className="w-32">
        <SortButton column="role">Role</SortButton>
      </TableHead>
      <TableHead className="w-24">
        <SortButton column="account_status">Status</SortButton>
      </TableHead>
      <TableHead className="w-32">
        <SortButton column="created_at">Created</SortButton>
      </TableHead>
      <TableHead className="w-32">
        <SortButton column="last_login">Last Login</SortButton>
      </TableHead>
      <TableHead className="w-32 text-right">Actions</TableHead>
    </TableRow>
  );
}
