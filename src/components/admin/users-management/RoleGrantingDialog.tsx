
import React, { useState } from 'react';
import { UserProfile, userRoleOptions } from '@/types/user';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import supabase from '@/lib/relaxedSupabase';
import { Shield, Eye, EyeOff, Copy, CheckCircle } from 'lucide-react';
import { validatePassword } from '@/utils/security/inputValidation';
import { useSecureRoles } from '@/hooks/users/use-secure-roles';

interface RoleGrantingDialogProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: string;
  onRoleGranted: () => void;
}

export function RoleGrantingDialog({
  user,
  isOpen,
  onClose,
  currentUserRole,
  onRoleGranted,
}: RoleGrantingDialogProps) {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [tempPassword, setTempPassword] = useState<string>('');
  const [isGranting, setIsGranting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const { grantRole } = useSecureRoles();

  // Generate a secure temporary password
  const generateTempPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setTempPassword(password);
    setPasswordCopied(false);
  };

  // Copy password to clipboard
  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(tempPassword);
      setPasswordCopied(true);
      toast.success('Password copied to clipboard!');
      setTimeout(() => setPasswordCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy password');
    }
  };

  const handleRoleGrant = async () => {
    if (!selectedRole) {
      toast.error('Please select a role to grant');
      return;
    }

    if (!tempPassword) {
      toast.error('Please generate a temporary password');
      return;
    }

    const passwordValidation = validatePassword(tempPassword);
    if (!passwordValidation.isValid) {
      toast.error(`Password validation failed: ${passwordValidation.error}`);
      return;
    }

    if (!user?.auth_user_id) {
      toast.error('User ID not found');
      return;
    }

    setIsGranting(true);

    try {
      console.log(`🔒 Secure role grant: ${selectedRole} to user ${user.auth_user_id}`);

      // Use the new secure role granting function with comprehensive audit logging
      const { data, error } = await supabase.rpc('secure_grant_role', {
        target_user_uuid: user.auth_user_id,
        role_to_grant: selectedRole,
        reason: `Role granted via admin interface with temporary password - User: ${user.first_name} ${user.last_name}`
      });

      if (error) {
        console.error('🚨 Secure role grant error:', error);
        toast.error(`Failed to grant role: ${error.message}`);
        return;
      }

      if (data === true) {
        toast.success(`✅ Successfully granted ${selectedRole} role to ${user.first_name} ${user.last_name}!`);
        
        // Log successful operation for audit trail
        console.log(`✅ Secure role grant successful: ${selectedRole} granted to ${user.auth_user_id} by ${currentUserRole}`);
        
        onRoleGranted();
        onClose();
      } else {
        toast.error('🚫 Role granting was denied. Please check your permissions and role hierarchy.');
        console.warn(`⚠️ Role grant denied: ${currentUserRole} attempted to grant ${selectedRole} to ${user.auth_user_id}`);
      }
    } catch (error: any) {
      console.error('🚨 Critical error during role grant:', error);
      toast.error(error.message || 'A critical error occurred while granting the role');
    } finally {
      setIsGranting(false);
    }
  };

  const handleClose = () => {
    setSelectedRole('');
    setTempPassword('');
    setPasswordCopied(false);
    onClose();
  };

  // Filter available roles based on current user's role
  const getAvailableRoles = () => {
    const allRoles = userRoleOptions.filter(role => role.value !== 'user');
    
    if (currentUserRole === 'super_admin') {
      return allRoles; // Super admin can grant any role
    } else if (currentUserRole === 'admin') {
      return allRoles.filter(role => role.value !== 'super_admin'); // Admin cannot grant super_admin
    }
    return [];
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Grant Administrative Role
          </DialogTitle>
          <DialogDescription>
            Grant administrative privileges to {user.first_name} {user.last_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role-select">Select Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a role..." />
              </SelectTrigger>
              <SelectContent>
                {getAvailableRoles().map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Temporary Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Temporary Password</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateTempPassword}
              >
                Generate
              </Button>
            </div>
            
            {tempPassword && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={tempPassword}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={copyPassword}
                    disabled={passwordCopied}
                  >
                    {passwordCopied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  This password will be used for their first admin login.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isGranting}>
            Cancel
          </Button>
          <Button
            onClick={handleRoleGrant}
            disabled={!selectedRole || !tempPassword || isGranting}
          >
            {isGranting ? 'Granting...' : 'Grant Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
