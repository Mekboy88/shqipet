
import React from 'react';
import { format } from 'date-fns';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  UserCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SimpleUserProfile } from '../types/impersonation-types';

interface ImpersonationTableProps {
  users: SimpleUserProfile[];
  loading: boolean;
  isImpersonating: boolean;
  onImpersonateClick: (user: SimpleUserProfile) => void;
}

export const ImpersonationTable: React.FC<ImpersonationTableProps> = ({
  users,
  loading,
  isImpersonating,
  onImpersonateClick
}) => {
  const renderAccountStatus = (status?: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Active</Badge>;
      case 'suspended':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-800"><AlertTriangle className="h-3 w-3 mr-1" /> Suspended</Badge>;
      case 'deactivated':
        return <Badge className="bg-red-100 text-red-800 border-red-800"><XCircle className="h-3 w-3 mr-1" /> Deactivated</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email Address</TableHead>
            <TableHead>Account Status</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-8 w-28 float-right" /></TableCell>
              </TableRow>
            ))
          ) : users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-xs">
                  {user.id.substring(0, 8)}...
                </TableCell>
                <TableCell>
                  {user.first_name || ''} {user.last_name || ''}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{user.username || 'N/A'}</span>
                </TableCell>
                <TableCell>{user.email || 'N/A'}</TableCell>
                <TableCell>{renderAccountStatus(user.account_status)}</TableCell>
                <TableCell>
                  {user.last_login ? (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-gray-500" />
                      {format(new Date(user.last_login), 'MMM dd, yyyy')}
                    </div>
                  ) : 'Never'}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => onImpersonateClick(user)}
                    variant="secondary"
                    size="sm"
                    disabled={isImpersonating}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Impersonate User
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No users found. Try adjusting your search or filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
