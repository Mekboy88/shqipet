
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PasswordVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail: string;
  password: string;
  setPassword: (password: string) => void;
  onVerify: () => void;
  isVerifying: boolean;
}

export function PasswordVerificationDialog({
  isOpen,
  onClose,
  currentUserEmail,
  password,
  setPassword,
  onVerify,
  isVerifying
}: PasswordVerificationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-center text-center">
            <Lock className="h-5 w-5 text-blue-600" />
            Password Verification
          </DialogTitle>
          <DialogDescription className="text-center">
            Please enter your password to access role granting
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="current-email" className="text-sm font-medium">
              Your Email
            </Label>
            <Input
              id="current-email"
              type="email"
              value={currentUserEmail}
              disabled
              className="bg-gray-100 text-gray-600"
            />
          </div>
          
          <div>
            <Label htmlFor="verify-password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="verify-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="focus:outline-none border-gray-300 focus:border-gray-400 shadow-none focus:ring-0 focus:shadow-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onVerify();
                }
              }}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onVerify}
            disabled={!password || isVerifying}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isVerifying ? 'Verifying...' : 'Verify & Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
