import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface PhotoDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const PhotoDeleteDialog: React.FC<PhotoDeleteDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isDeleting
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[520px] w-full">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold text-base text-center">
            Fshi foton
          </AlertDialogTitle>
          <div className="w-full border-t border-border my-4"></div>
          <AlertDialogDescription className="font-medium text-base text-foreground">
            Jeni të sigurt që doni të fshini këtë foto? Fotoja do të fshihet përgjithmonë dhe nuk mund të rikuperohet.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isDeleting}
            className="border-0 focus:border-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:border-0"
          >
            Anuloj
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={isDeleting} 
            className="bg-gradient-to-r from-red-600 via-red-700 to-red-900 hover:from-red-700 hover:via-red-800 hover:to-red-950 text-white shadow-lg border border-red-800/20 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-500/30 before:via-transparent before:to-red-900/30 before:opacity-50 hover:before:opacity-70 transition-all duration-200 hover:shadow-xl hover:shadow-red-900/25"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2 relative z-10">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Duke fshirë...
              </div>
            ) : (
              <span className="relative z-10">Fshi</span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PhotoDeleteDialog;
