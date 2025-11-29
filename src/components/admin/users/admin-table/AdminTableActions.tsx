
import React from 'react';
import { UserProfile } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Lock, Shield, AlertTriangle, Settings } from 'lucide-react';

interface AdminTableActionsProps {
  user: UserProfile;
  onViewDetails: (user: UserProfile) => void;
  onEditUser: (user: UserProfile) => void;
  onResetPassword: (userId: string) => void;
  onChangeStatus: (user: UserProfile) => void;
  onViewPermissions: (user: UserProfile) => void;
}

export function AdminTableActions({
  user,
  onViewDetails,
  onEditUser,
  onResetPassword,
  onChangeStatus,
  onViewPermissions
}: AdminTableActionsProps) {
  return (
    <div className="flex justify-end space-x-1">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onViewDetails(user)}
        title="View Admin Details"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onEditUser(user)}
        title="Edit Admin"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onResetPassword(user.id)}
        title="Reset Password"
      >
        <Lock className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onViewPermissions(user)}
        title="Manage Permissions"
      >
        <Settings className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onChangeStatus(user)}
        title={user.account_status === 'active' ? "Suspend/Deactivate" : "Activate"}
      >
        {user.account_status === 'active' ? (
          <AlertTriangle className="h-4 w-4" />
        ) : (
          <Shield className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
