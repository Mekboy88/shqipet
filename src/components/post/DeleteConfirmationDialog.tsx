import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isDeleting = false
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md mx-4 sm:mx-auto">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full flex-shrink-0">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div className="min-w-0 flex-1">
              <AlertDialogTitle className="text-lg font-semibold text-gray-900">
                Delete Post
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-gray-600 text-sm leading-relaxed">
            Are you sure you want to delete this post? The post will be hidden from your profile and the feed, but can be recovered within 30 days. After 30 days, it will be permanently deleted.
          </AlertDialogDescription>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Recovery Period:</strong> You have 30 days to restore this post if you change your mind.
            </p>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
          <AlertDialogCancel 
            className="w-full sm:flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border-0 order-2 sm:order-1"
            disabled={isDeleting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full sm:flex-1 bg-red-600 hover:bg-red-700 text-white border-0 focus:ring-red-500 order-1 sm:order-2"
          >
            {isDeleting ? 'Deleting...' : 'Delete Post'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;