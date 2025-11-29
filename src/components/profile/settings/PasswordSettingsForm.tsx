import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PasswordInputField } from './password/PasswordInputField';
import { validatePassword } from '@/utils/security/inputValidation';

const PasswordSettingsForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [logoutOthers, setLogoutOthers] = useState(true);
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Caps lock detection
  const [capsLockOn, setCapsLockOn] = useState(false);

  const handleKeyEvent = (e: React.KeyboardEvent) => {
    setCapsLockOn(e.getModifierState('CapsLock'));
  };

  // Validation rules
  const passwordValidation = validatePassword(newPassword);
  const meetsPolicy = passwordValidation.isValid;
  const notSameAsCurrent = newPassword && currentPassword && newPassword !== currentPassword;
  const confirmMatches = newPassword === confirmPassword && confirmPassword.length > 0;

  // Password strength score (0-5)
  const getPasswordStrength = (): number => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 12) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[a-z]/.test(newPassword)) score++;
    if (/\d/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    return score;
  };

  const canSubmit = meetsPolicy && notSameAsCurrent && confirmMatches && !isSaving;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      setIsSaving(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Session expired. Please log in again.');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/change_password_secure`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            logoutOthers
          })
        }
      );

      const result = await response.json();

      switch (result.code) {
        case 'OK':
          toast.success('Password updated successfully.');
          setNewPassword('');
          setConfirmPassword('');
          setCurrentPassword('');
          break;
        case 'POLICY_FAILED':
          toast.error("Password doesn't meet requirements.");
          break;
        case 'BREACHED_PASSWORD':
          toast.error('This password appears in known breaches. Choose a different one.');
          break;
        case 'UNABLE_TO_CHANGE':
          toast.error('Unable to change password. Check your current password and try again.');
          break;
        case 'RATE_LIMITED':
          toast.error('Too many attempts. Please try again later.');
          break;
        case 'UNAUTHORIZED':
          toast.error('Session expired. Please log in again.');
          break;
        default:
          toast.error('Something went wrong.');
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast.error('Unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    handleKeyEvent(e);
    if (e.key === 'Enter' && canSubmit) {
      handleSubmit();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Change Password Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">
              Change Password
            </h3>
            
            <div className="space-y-6">
              <div>
                <PasswordInputField
                  id="current-password"
                  label="Current Password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  showPassword={showCurrentPassword}
                  onToggleVisibility={() => setShowCurrentPassword(!showCurrentPassword)}
                  onKeyDown={handleKeyPress}
                  autoComplete="current-password"
                />
                {capsLockOn && (
                  <p className="text-xs text-orange-600 mt-1">⚠ Caps Lock is on</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <PasswordInputField
                    id="new-password"
                    label="New Password"
                    value={newPassword}
                    onChange={setNewPassword}
                    showPassword={showNewPassword}
                    onToggleVisibility={() => setShowNewPassword(!showNewPassword)}
                    onKeyDown={handleKeyPress}
                    autoComplete="new-password"
                  />
                  {capsLockOn && (
                    <p className="text-xs text-orange-600 mt-1">⚠ Caps Lock is on</p>
                  )}
                  {newPassword && !meetsPolicy && (
                    <p className="text-xs text-red-600 mt-1">{passwordValidation.error}</p>
                  )}
                  {newPassword && currentPassword && !notSameAsCurrent && (
                    <p className="text-xs text-red-600 mt-1">New password must be different</p>
                  )}
                </div>
                
                <div>
                  <PasswordInputField
                    id="confirm-password"
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    showPassword={showConfirmPassword}
                    onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                    onKeyDown={handleKeyPress}
                    autoComplete="new-password"
                  />
                  {capsLockOn && (
                    <p className="text-xs text-orange-600 mt-1">⚠ Caps Lock is on</p>
                  )}
                  {confirmPassword && !confirmMatches && (
                    <p className="text-xs text-red-600 mt-1">Passwords don't match</p>
                  )}
                </div>
              </div>
              
              <div className="pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  variant="ghost"
                  className="flex-1 p-4 bg-gradient-to-r from-red-500/10 to-gray-800/10 rounded-xl border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Security Settings Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">
              Security Settings
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="logout-others" className="text-sm font-medium text-gray-700">
                  Log out other devices
                </label>
                <Switch
                  id="logout-others"
                  checked={logoutOthers}
                  onCheckedChange={setLogoutOthers}
                />
              </div>
              
              {newPassword && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                  <ul className="text-xs space-y-1">
                    <li className={newPassword.length >= 12 ? 'text-green-600' : 'text-gray-500'}>
                      ✓ At least 12 characters
                    </li>
                    <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                      ✓ Contains uppercase letter
                    </li>
                    <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                      ✓ Contains lowercase letter
                    </li>
                    <li className={/\d/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                      ✓ Contains number
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                      ✓ Contains special character
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordSettingsForm;
