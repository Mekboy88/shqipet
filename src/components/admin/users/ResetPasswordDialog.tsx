
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';

interface ResetPasswordDialogProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onResetPassword: (userId: string, reason: string) => Promise<void>;
}

export function ResetPasswordDialog({
  userId,
  isOpen,
  onClose,
  onResetPassword
}: ResetPasswordDialogProps) {
  const [reason, setReason] = useState('');

  const handleResetPassword = async () => {
    await onResetPassword(userId, reason);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset User Password</AlertDialogTitle>
          <AlertDialogDescription>
            This will send a password reset email to the user.
            The user will need to click the link in the email to set a new password.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for Password Reset</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for this password reset"
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              This reason will be logged in the system audit trail.
            </p>
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleResetPassword}>Send Reset Email</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
