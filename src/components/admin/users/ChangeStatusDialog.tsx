
import React, { useState } from 'react';
import { UserProfile, accountStatusOptions } from '@/types/user';
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ChangeStatusDialogProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (userId: string, status: string, reason: string) => Promise<void>;
}

export function ChangeStatusDialog({
  user,
  isOpen,
  onClose,
  onStatusChange
}: ChangeStatusDialogProps) {
  const [status, setStatus] = useState(user?.account_status || 'active');
  const [reason, setReason] = useState('');

  if (!user) return null;

  const handleStatusChange = async () => {
    await onStatusChange(user.id, status, reason);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change User Status</AlertDialogTitle>
          <AlertDialogDescription>
            Update the status for user {user.username || user.email || user.id}.
            This action will be logged and affect the user's ability to access the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">New Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {accountStatusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for Change</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for this status change"
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              This reason will be logged in the system audit trail.
            </p>
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleStatusChange}>Change Status</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
