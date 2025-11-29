
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface NewMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewMessageDialog: React.FC<NewMessageDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-sm text-gray-500">Messaging feature coming soon...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageDialog;
