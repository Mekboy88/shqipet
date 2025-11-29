
import React, { useState } from 'react';
import { UserProfile } from '@/types/user';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import supabase from '@/lib/relaxedSupabase';
import { Shield, Eye, EyeOff, Copy, CheckCircle } from 'lucide-react';
import { validatePassword } from '@/utils/security/inputValidation';
// Removed useSecureRoles - now using direct secure database functions

interface FullPageRoleGrantingProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: string;
  onRoleGranted: () => void;
}

export function FullPageRoleGranting({
  user,
  isOpen,
  onClose,
  currentUserRole,
  onRoleGranted,
}: FullPageRoleGrantingProps) {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [tempPassword, setTempPassword] = useState<string>('');
  const [isGranting, setIsGranting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  // Using direct secure database functions instead of client-side hooks

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
      console.log(`🔒 Secure full-page role grant: ${selectedRole} to user ${user.auth_user_id}`);

      // Use the new secure role granting function with comprehensive audit logging
      const { data, error } = await supabase.rpc('secure_grant_role', {
        target_user_uuid: user.auth_user_id,
        role_to_grant: selectedRole,
        reason: `Role granted via full-page admin interface - User: ${user.first_name} ${user.last_name}`
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

  // Available roles based on current user's role
  const getAvailableRoles = () => {
    if (currentUserRole === 'super_admin') {
      return [
        { value: 'admin', label: 'Admin' },
        { value: 'moderator', label: 'Moderator' },
        { value: 'super_admin', label: 'Super Admin' }
      ];
    } else if (currentUserRole === 'admin') {
      return [
        { value: 'admin', label: 'Admin' },
        { value: 'moderator', label: 'Moderator' }
      ];
    }
    return [];
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl font-bold text-center flex items-center justify-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              Grant Admin Role
            </DialogTitle>
            <DialogDescription className="text-center text-lg text-gray-600 mt-4">
              You are about to grant administrative privileges to {user.first_name} {user.last_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8">
            {/* User Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">User Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                  <p className="font-medium">{user.first_name} {user.last_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Username</Label>
                  <p className="font-medium">@{user.username}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Current Status</Label>
                  <p className="font-medium capitalize">{user.account_status}</p>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-4">
              <Label htmlFor="role-select" className="text-lg font-semibold">
                Select Administrative Role
              </Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Choose a role to grant..." />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableRoles().map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        {role.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Temporary Password Generation */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Temporary Access Password</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateTempPassword}
                  className="flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Generate Password
                </Button>
              </div>
              
              {tempPassword && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-800">Generated Password:</span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="h-8 w-8 p-0"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={copyPassword}
                        className="h-8 w-8 p-0"
                        disabled={passwordCopied}
                      >
                        {passwordCopied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={tempPassword}
                    readOnly
                    className="font-mono text-sm bg-white"
                  />
                  <p className="text-xs text-blue-600 mt-2">
                    This password will be used for their first admin login. They can change it after logging in.
                  </p>
                </div>
              )}
            </div>

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800">Important Security Notice</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Granting administrative privileges will give this user elevated permissions. 
                    Ensure they understand their responsibilities and have proper security training.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isGranting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleRoleGrant}
                disabled={!selectedRole || !tempPassword || isGranting}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isGranting ? 'Granting Role...' : `Grant ${selectedRole} Role`}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
