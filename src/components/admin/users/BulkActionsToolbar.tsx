
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown } from 'lucide-react';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onActivateUsers: (reason: string) => void;
  onSuspendUsers: (reason: string) => void;
  onDeactivateUsers: (reason: string) => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onClearSelection: () => void;
}

export function BulkActionsToolbar({
  selectedCount,
  onActivateUsers,
  onSuspendUsers,
  onDeactivateUsers,
  onExportCSV,
  onExportJSON,
  onClearSelection
}: BulkActionsToolbarProps) {
  const [isBulkActionDialogOpen, setIsBulkActionDialogOpen] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<'activate' | 'suspend' | 'deactivate'>('activate');
  const [reason, setReason] = useState('');

  const handleBulkAction = (type: 'activate' | 'suspend' | 'deactivate') => {
    setBulkActionType(type);
    setReason('');
    setIsBulkActionDialogOpen(true);
  };

  const handleConfirmBulkAction = () => {
    switch (bulkActionType) {
      case 'activate':
        onActivateUsers(reason);
        break;
      case 'suspend':
        onSuspendUsers(reason);
        break;
      case 'deactivate':
        onDeactivateUsers(reason);
        break;
    }
    setIsBulkActionDialogOpen(false);
  };

  const getActionTitle = () => {
    switch (bulkActionType) {
      case 'activate':
        return 'Activate Users';
      case 'suspend':
        return 'Suspend Users';
      case 'deactivate':
        return 'Deactivate Users';
    }
  };

  const getActionDescription = () => {
    switch (bulkActionType) {
      case 'activate':
        return `You are about to activate ${selectedCount} users. This will re-enable their accounts.`;
      case 'suspend':
        return `You are about to suspend ${selectedCount} users. They will not be able to access their accounts until they are reactivated.`;
      case 'deactivate':
        return `You are about to deactivate ${selectedCount} users. Their accounts will be temporarily disabled.`;
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium">{selectedCount} users selected</span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>User Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
              Activate Accounts ✅
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkAction('suspend')}>
              Suspend Accounts 🚫
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkAction('deactivate')}>
              Deactivate Accounts ⚠️
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Export Data</DropdownMenuLabel>
            <DropdownMenuItem onClick={onExportCSV}>
              Export as CSV 📄
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportJSON}>
              Export as JSON 📊
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          Clear Selection
        </Button>
      </div>

      <AlertDialog open={isBulkActionDialogOpen} onOpenChange={setIsBulkActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{getActionTitle()}</AlertDialogTitle>
            <AlertDialogDescription>
              {getActionDescription()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium mb-2" htmlFor="reason">
              Reason for action (will be logged)
            </label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for this action"
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmBulkAction}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
