
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
interface CoverPhotoRemoveDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}
const CoverPhotoRemoveDialog: React.FC<CoverPhotoRemoveDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading
}) => {
  return <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[520px] w-full">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold text-base mx-[147px] px-0 my-0">Hiq foton e kopertinës</AlertDialogTitle>
          {/* Full width border line above the description */}
          <div className="w-full border-t border-gray-400 my-4"></div>
          <AlertDialogDescription className="font-medium text-base text-gray-700">
            Jeni të sigurt që doni të hiqni foton tuaj të kopertinës?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} className="border-0 focus:border-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:border-0">
            Anuloj
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={isLoading} 
            className="bg-gradient-to-r from-red-600 via-red-700 to-red-900 hover:from-red-700 hover:via-red-800 hover:to-red-950 text-white shadow-lg border border-red-800/20 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-500/30 before:via-transparent before:to-red-900/30 before:opacity-50 hover:before:opacity-70 transition-all duration-200 hover:shadow-xl hover:shadow-red-900/25"
          >
            {isLoading ? <div className="flex items-center gap-2 relative z-10">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Duke hequr...
              </div> : <span className="relative z-10">Konfirmo</span>}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>;
};
export default CoverPhotoRemoveDialog;
