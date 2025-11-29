import React, { useState, useEffect } from 'react';
import { useProfileImage } from '@/hooks/useProfileImage';
import { PhotoEditDialogHeader } from './photo-edit/PhotoEditDialogHeader';
import { PhotoDescriptionSection } from './photo-edit/PhotoDescriptionSection';
import { PhotoPreviewSection } from './photo-edit/PhotoPreviewSection';
import { PhotoActionButtons } from './photo-edit/PhotoActionButtons';
import { DiscardConfirmationDialog } from './photo-edit/DiscardConfirmationDialog';
interface PhotoEditDialogProps {
  photoUrl: string;
  onSave: (photoUrl: string) => void;
  onCancel: () => void;
  onDiscard?: () => void;
}
const PhotoEditDialog: React.FC<PhotoEditDialogProps> = ({
  photoUrl,
  onSave,
  onCancel,
  onDiscard
}) => {
  const [isTemporary, setIsTemporary] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(50);
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const {
    uploadProfileImage
  } = useProfileImage();

  // Prevent body scroll when dialog is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowDiscardDialog(true);
    }
  };
  const handleCloseClick = () => {
    setShowDiscardDialog(true);
  };
  const handleDiscardConfirm = () => {
    // Close all dialogs completely
    setShowDiscardDialog(false);
    if (onDiscard) {
      onDiscard();
    } else {
      onCancel();
    }
  };
  const handleDiscardCancel = () => {
    setShowDiscardDialog(false);
  };
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (photoUrl.startsWith('blob:')) {
        const response = await fetch(photoUrl);
        const blob = await response.blob();
        const file = new File([blob], 'profile-image.jpg', {
          type: 'image/jpeg'
        });
        const uploadedUrl = await uploadProfileImage(file);
        if (uploadedUrl) {
          onSave(uploadedUrl);
        }
      } else {
        onSave(photoUrl);
      }
    } catch (error) {
      console.error('Error saving profile photo:', error);
    } finally {
      setIsSaving(false);
    }
  };
  const handleBackdropWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  return <>
      <div onClick={handleBackdropClick} onWheel={handleBackdropWheel} className="fixed inset-0 z-50 bg-white/[0.73]">
        <div className="bg-white rounded-lg shadow-xl w-[400px] h-[700px] flex flex-col border-b-2 border-gray-200 absolute" style={{ left: 'calc(50% - 860px - 140px)', top: '40px' }} onClick={e => e.stopPropagation()}>
          <PhotoEditDialogHeader onClose={handleCloseClick} />
          
          <PhotoDescriptionSection description={description} onDescriptionChange={setDescription} />

          <PhotoPreviewSection photoUrl={photoUrl} zoomLevel={zoomLevel} onZoomChange={setZoomLevel} />

          <PhotoActionButtons isTemporary={isTemporary} onTemporaryToggle={() => setIsTemporary(!isTemporary)} />

          {/* Bottom Buttons with Border */}
          <div className="border-t border-gray-200 p-4 bg-white">
            {/* Privacy Notice - moved to bottom section */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <img src="/lovable-uploads/d724e4ae-5a03-4a43-a56e-d447f7dc2162.png" alt="Globe icon" className="w-5 h-5" />
              Your profile picture is public.
            </div>
            
            <div className="flex items-center gap-3 justify-end">
              <button onClick={onCancel} disabled={isSaving} className="px-6 py-2 text-sm font-medium text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-300 hover:bg-gray-200">
                Anuloj
              </button>
              <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 text-sm font-medium text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" style={{
              background: 'linear-gradient(to right, #DC2626, #7F1D1D)',
              backgroundSize: '200% 100%',
              backgroundPosition: '0% 50%',
              boxShadow: '0 6px 20px rgba(220, 38, 38, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.2)'
            }} onMouseEnter={e => {
              e.currentTarget.style.backgroundPosition = '100% 50%';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.5), inset 0 2px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.3)';
            }} onMouseLeave={e => {
              e.currentTarget.style.backgroundPosition = '0% 50%';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(220, 38, 38, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.2)';
            }}>
                {isSaving ? 'Duke ruajtur...' : 'Ruaj'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <DiscardConfirmationDialog isOpen={showDiscardDialog} onConfirm={handleDiscardConfirm} onCancel={handleDiscardCancel} />
    </>;
};
export default PhotoEditDialog;