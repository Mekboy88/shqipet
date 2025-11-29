import React, { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import AvatarAndCoverForm from '@/components/profile/settings/AvatarAndCoverForm';

interface EditProfileDialogProps {
  onClose: () => void;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  onClose
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Prevent background scrolling when dialog is open
  useEffect(() => {
    // Store the current scroll position
    const scrollY = window.scrollY;
    
    // Store original styles to restore them later
    const originalBodyStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow
    };
    
    // Prevent scrolling on the body and html
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    // Prevent scrolling on the profile page container specifically
    const profileContainer = document.querySelector('[data-scroll-container="true"]');
    let originalProfileStyles = {};
    if (profileContainer) {
      const element = profileContainer as HTMLElement;
      originalProfileStyles = {
        overflow: element.style.overflow,
        position: element.style.position,
        width: element.style.width,
        height: element.style.height
      };
      element.style.setProperty('overflow', 'hidden', 'important');
      element.style.position = 'fixed';
      element.style.width = '100%';
      element.style.height = '100vh';
    }

    // Also prevent scrolling on any other scroll containers
    const allScrollContainers = document.querySelectorAll('.profile-scroll-container, .overflow-y-auto, .overflow-auto');
    const originalContainerStyles = new Map();
    allScrollContainers.forEach(container => {
      const element = container as HTMLElement;
      originalContainerStyles.set(element, element.style.overflow);
      element.style.setProperty('overflow', 'hidden', 'important');
    });
    
    return () => {
      // Use setTimeout to ensure cleanup happens after dialog close animation
      setTimeout(() => {
        // Restore body styles
        document.body.style.position = originalBodyStyles.position || '';
        document.body.style.top = originalBodyStyles.top || '';
        document.body.style.width = originalBodyStyles.width || '';
        document.body.style.overflow = originalBodyStyles.overflow || '';
        
        // Restore profile container scrolling
        if (profileContainer) {
          const element = profileContainer as HTMLElement;
          element.style.removeProperty('overflow');
          element.style.position = (originalProfileStyles as any).position || '';
          element.style.width = (originalProfileStyles as any).width || '';
          element.style.height = (originalProfileStyles as any).height || '';
        }

        // Restore other containers
        allScrollContainers.forEach(container => {
          const element = container as HTMLElement;
          element.style.removeProperty('overflow');
        });
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      }, 100);
    };
  }, []);

  // COMPLETE background scroll prevention - block ALL wheel events when dialog is open
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // If the scroll is happening inside the dialog content area, allow it
      if (dialogRef.current) {
        const dialogContent = dialogRef.current.querySelector('.flex-1[style*="overflow"]');
        if (dialogContent && dialogContent.contains(e.target as Node)) {
          // Allow scrolling inside the dialog content
          return;
        }
      }
      
      // Block ALL other wheel events to prevent background scrolling
      e.preventDefault();
      e.stopPropagation();
    };

    // Add wheel event listener to the entire document with highest priority
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    
    return () => {
      document.removeEventListener('wheel', handleWheel, { capture: true });
    };
  }, []);

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        ref={dialogRef}
        className="fixed z-[9999] w-[400px] h-[700px] bg-white border-0 p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg flex flex-col"
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.24)',
          position: 'fixed',
          left: 'calc(50% - 860px - 140px)', // Moved even more to the right
          top: '40px',
          overflow: 'hidden'
        }}
      >
        {/* Hidden DialogHeader for accessibility */}
        <DialogHeader className="sr-only">
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>

        {/* Custom Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Edit profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content - Use setProperty to force scroll with !important */}
        <div 
          ref={(element) => {
            if (element) {
              // Use setProperty to add !important to override global styles
              element.style.setProperty('overflow', 'auto', 'important');
              element.style.setProperty('overflow-y', 'scroll', 'important');
            }
          }}
          className="flex-1 p-6 space-y-8"
          style={{ 
            maxHeight: 'calc(90vh - 120px)',
            scrollbarWidth: 'thin',
            scrollbarColor: '#9ca3af #f3f4f6',
            WebkitOverflowScrolling: 'touch',
            position: 'relative',
            height: '100%',
            scrollBehavior: 'smooth'
          }}
          onWheel={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <AvatarAndCoverForm />

          {/* Bottom padding */}
          <div className="h-24"></div>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
