
import React, { useState } from 'react';
import { UserProfile } from '@/types/user';
import { TableRow, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  KeyRound, 
  UserCheck, 
  Settings,
  Shield,
  Plus
} from 'lucide-react';
import { RoleGrantingDialog } from '../../users-management/RoleGrantingDialog';
import { AdminTableRoleCell } from './AdminTableRoleCell';
import { useSecureRoles } from '@/hooks/users/use-secure-roles';

interface AdminTableRowProps {
  user: UserProfile;
  isSelected: boolean;
  onSelectUser: (userId: string, isSelected: boolean) => void;
  onViewDetails: (user: UserProfile) => void;
  onEditUser: (user: UserProfile) => void;
  onResetPassword: (userId: string) => void;
  onChangeStatus: (user: UserProfile) => void;
  onViewPermissions: (user: UserProfile) => void;
}

export function AdminTableRow({
  user,
  isSelected,
  onSelectUser,
  onViewDetails,
  onEditUser,
  onResetPassword,
  onChangeStatus,
  onViewPermissions
}: AdminTableRowProps) {
  const [showRoleGranting, setShowRoleGranting] = useState(false);
  const { currentUserRole, isSuperAdmin, isAdmin } = useSecureRoles();

  // Permission checks
  const userRole = (user as any).role || 'user'; // Get role from user object (added by useUsers hook)
  const isTargetUserProtected = userRole === 'super_admin';
  const canGrantRoles = isSuperAdmin || isAdmin;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'deactivated':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get first 8 characters of ID for display
  const displayId = user.id.split('-')[0];

  return (
    <>
      <TableRow className="hover:bg-gray-50 border-b border-gray-100">
        <TableCell className="text-center">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelectUser(user.id, !!checked)}
          />
        </TableCell>
        
        <TableCell className="font-mono text-xs text-gray-500">
          {displayId}
        </TableCell>
        
        <TableCell>
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.profile_image_url || ''} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {user.first_name?.[0]}{user.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-sm text-gray-500 truncate">@{user.username}</p>
            </div>
          </div>
        </TableCell>
        
        <TableCell>
          <div className="text-gray-900 truncate" title={user.email}>
            {user.email}
          </div>
        </TableCell>
        
        <TableCell>
          <AdminTableRoleCell role={userRole} />
        </TableCell>
        
        <TableCell>
          <Badge className={`${getStatusBadgeColor(user.account_status || 'active')} text-xs px-2 py-1`}>
            {user.account_status || 'active'}
          </Badge>
        </TableCell>
        
        <TableCell className="text-sm text-gray-600">
          {user.created_at ? formatDate(user.created_at) : 'N/A'}
        </TableCell>
        
        <TableCell className="text-sm text-gray-600">
          {user.last_login ? formatDate(user.last_login) : 'Never'}
        </TableCell>
        
        <TableCell>
          <div className="flex items-center justify-end space-x-2">
            {canGrantRoles && userRole === 'user' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowRoleGranting(true)}
                className="flex items-center gap-1 text-xs"
              >
                <Plus className="h-3 w-3" />
                <Shield className="h-3 w-3" />
                Grant
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onViewDetails(user)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditUser(user)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit User
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onResetPassword(user.id)}>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Reset Password
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onChangeStatus(user)}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Change Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewPermissions(user)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Permissions
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>

      <RoleGrantingDialog
        user={user}
        isOpen={showRoleGranting}
        onClose={() => setShowRoleGranting(false)}
        currentUserRole={currentUserRole}
        onRoleGranted={() => {
          setShowRoleGranting(false);
          console.log('Role granted - Auto-refresh prevented!');
          // Never reload automatically
        }}
      />
    </>
  );
}
