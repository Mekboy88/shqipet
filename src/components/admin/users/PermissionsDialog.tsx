import React, { useState } from 'react';
import { UserProfile } from '@/types/user';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface PermissionsDialogProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePermissions: (permissions: Record<string, boolean>) => void;
  onRoleGranted?: () => void; // Add this optional prop
}

// Define permissions structure grouped by category
const permissionsGroups = [
  {
    name: 'User Management',
    permissions: [
      { id: 'user_view', label: 'View Users' },
      { id: 'user_create', label: 'Create Users' },
      { id: 'user_edit', label: 'Edit Users' },
      { id: 'user_delete', label: 'Delete Users' },
      { id: 'user_suspend', label: 'Suspend Users' },
    ]
  },
  {
    name: 'Admin Management',
    permissions: [
      { id: 'admin_view', label: 'View Admins' },
      { id: 'admin_create', label: 'Create Admins' },
      { id: 'admin_edit', label: 'Edit Admins' },
      { id: 'admin_delete', label: 'Delete Admins' },
    ]
  },
  {
    name: 'Content Moderation',
    permissions: [
      { id: 'content_view', label: 'View Content' },
      { id: 'content_approve', label: 'Approve Content' },
      { id: 'content_reject', label: 'Reject Content' },
      { id: 'content_edit', label: 'Edit Content' },
      { id: 'content_delete', label: 'Delete Content' },
    ]
  },
  {
    name: 'System Settings',
    permissions: [
      { id: 'settings_view', label: 'View Settings' },
      { id: 'settings_edit', label: 'Edit Settings' },
      { id: 'settings_backup', label: 'Backup System' },
      { id: 'settings_restore', label: 'Restore System' },
    ]
  },
  {
    name: 'Data Management',
    permissions: [
      { id: 'data_export', label: 'Export Data' },
      { id: 'data_import', label: 'Import Data' },
      { id: 'data_delete', label: 'Delete Data' },
    ]
  },
  {
    name: 'Security',
    permissions: [
      { id: 'security_logs', label: 'View Logs' },
      { id: 'security_2fa', label: 'Manage 2FA' },
      { id: 'security_reset_password', label: 'Reset Passwords' },
    ]
  },
];

// Predefined role templates
const roleTemplates = {
  super_admin: permissionsGroups.flatMap(group => group.permissions).reduce((acc, perm) => {
    acc[perm.id] = true;
    return acc;
  }, {} as Record<string, boolean>),
  
  admin: permissionsGroups.flatMap(group => group.permissions).reduce((acc, perm) => {
    // Admins cannot manage other admins or system settings
    const restricted = ['admin_create', 'admin_delete', 'settings_restore', 'settings_backup'];
    acc[perm.id] = !restricted.includes(perm.id);
    return acc;
  }, {} as Record<string, boolean>),
  
  moderator: permissionsGroups.flatMap(group => group.permissions).reduce((acc, perm) => {
    // Moderators can only manage content and view users
    const allowed = ['content_view', 'content_approve', 'content_reject', 'content_edit', 'user_view'];
    acc[perm.id] = allowed.includes(perm.id);
    return acc;
  }, {} as Record<string, boolean>),
  
  support: permissionsGroups.flatMap(group => group.permissions).reduce((acc, perm) => {
    // Support can only view content and users, and reset passwords
    const allowed = ['content_view', 'user_view', 'security_reset_password'];
    acc[perm.id] = allowed.includes(perm.id);
    return acc;
  }, {} as Record<string, boolean>),
};

export function PermissionsDialog({
  user,
  isOpen,
  onClose,
  onUpdatePermissions,
  onRoleGranted
}: PermissionsDialogProps) {
  // Get initial permissions based on user role or default to empty object
  const getInitialPermissions = () => {
    if (!user.role) return {};
    return roleTemplates[user.role as keyof typeof roleTemplates] || {};
  };

  const [permissions, setPermissions] = useState<Record<string, boolean>>(getInitialPermissions);
  const [isModified, setIsModified] = useState(false);

  const handlePermissionChange = (id: string, checked: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [id]: checked
    }));
    setIsModified(true);
  };

  const handleApplyTemplate = (role: string) => {
    if (roleTemplates[role as keyof typeof roleTemplates]) {
      setPermissions(roleTemplates[role as keyof typeof roleTemplates]);
      setIsModified(true);
    }
  };

  const handleSave = () => {
    onUpdatePermissions(permissions);
    // Call onRoleGranted if provided (for role granting scenarios)
    if (onRoleGranted) {
      onRoleGranted();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Permissions</DialogTitle>
          <DialogDescription>
            Configure permissions for {user.first_name} {user.last_name} ({user.role || 'No role'})
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Quick Templates</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleApplyTemplate('super_admin')}
              >
                Super Admin
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleApplyTemplate('admin')}
              >
                Admin
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleApplyTemplate('moderator')}
              >
                Moderator
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleApplyTemplate('support')}
              >
                Support
              </Button>
            </div>
          </div>

          {permissionsGroups.map((group) => (
            <div key={group.name} className="mb-6">
              <h3 className="text-md font-semibold mb-2">{group.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.permissions.map((perm) => (
                  <div key={perm.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={perm.id}
                      checked={permissions[perm.id] || false}
                      onCheckedChange={(checked) => handlePermissionChange(perm.id, !!checked)}
                    />
                    <label 
                      htmlFor={perm.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {perm.label}
                    </label>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
            </div>
          ))}
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div>
              {isModified && (
                <Badge variant="outline" className="bg-yellow-100">
                  Unsaved Changes
                </Badge>
              )}
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave}>Save Permissions</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
