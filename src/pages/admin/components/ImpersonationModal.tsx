
import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SimpleUserProfile, ImpersonateReasons } from '../types/impersonation-types';
import { toast } from 'sonner';

interface ImpersonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: SimpleUserProfile | null;
  onStartImpersonation: (reason: string) => void;
  impersonateReasons: ImpersonateReasons;
}

export const ImpersonationModal: React.FC<ImpersonationModalProps> = ({
  isOpen,
  onClose,
  selectedUser,
  onStartImpersonation,
  impersonateReasons
}) => {
  const [impersonationReason, setImpersonationReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [requireTwoFactor, setRequireTwoFactor] = useState(true);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [confirmationChecked, setConfirmationChecked] = useState(false);

  const handleStartImpersonation = () => {
    // Validate form
    if (!impersonationReason) {
      toast.error('Please select a reason for impersonation');
      return;
    }
    
    if (impersonationReason === 'other' && !customReason) {
      toast.error('Please specify a custom reason');
      return;
    }
    
    if (requireTwoFactor && !twoFactorCode) {
      toast.error('Please enter your 2FA code');
      return;
    }
    
    if (!confirmationChecked) {
      toast.error('Please confirm you understand the implications');
      return;
    }
    
    // The reason to store in audit log
    const finalReason = impersonationReason === 'other' 
      ? customReason 
      : impersonateReasons[impersonationReason as keyof ImpersonateReasons];
    
    onStartImpersonation(finalReason);
    
    // Reset form
    setImpersonationReason('');
    setCustomReason('');
    setTwoFactorCode('');
    setConfirmationChecked(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ShieldAlert className="h-5 w-5 mr-2 text-yellow-500" />
            Secure Impersonation Confirmation
          </DialogTitle>
          <DialogDescription>
            You are about to log in as {selectedUser?.username || selectedUser?.email}.
            All actions performed will be logged for auditing purposes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">
              Reason for Impersonation <span className="text-red-500">*</span>
            </label>
            <Select value={impersonationReason} onValueChange={setImpersonationReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(impersonateReasons).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {impersonationReason === 'other' && (
            <div className="space-y-2">
              <label htmlFor="customReason" className="text-sm font-medium">
                Please specify <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="customReason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Provide detailed reason for this impersonation session"
                className="min-h-[100px]"
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="requireTwoFactor"
                checked={requireTwoFactor}
                onCheckedChange={(checked) => setRequireTwoFactor(checked as boolean)}
              />
              <label htmlFor="requireTwoFactor" className="text-sm font-medium">
                Require two-factor authentication
              </label>
            </div>

            {requireTwoFactor && (
              <Input
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="Enter your 2FA code"
                className="mt-2"
              />
            )}
          </div>

          <div className="flex items-start gap-2 pt-4 border-t">
            <Checkbox 
              id="confirmation" 
              checked={confirmationChecked}
              onCheckedChange={(checked) => setConfirmationChecked(checked as boolean)}
            />
            <label htmlFor="confirmation" className="text-sm">
              I understand that all actions performed while impersonating this user will be logged 
              and I am responsible for any changes made during this session.
            </label>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          
          <Button
            disabled={
              !impersonationReason || 
              (impersonationReason === 'other' && !customReason) || 
              (requireTwoFactor && !twoFactorCode) || 
              !confirmationChecked
            }
            onClick={handleStartImpersonation}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            <ShieldAlert className="h-4 w-4 mr-2" />
            Start Impersonation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
