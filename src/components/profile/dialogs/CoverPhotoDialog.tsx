
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Image } from 'lucide-react';
import UploadAnimation from '@/components/ui/UploadAnimation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useGlobalCoverPhoto, notifyGlobalCoverLoadingChange, notifyGlobalCoverPhotoChange } from '@/hooks/useGlobalCoverPhoto';
import { extractColorsFromImage, createGradientFromColors } from '@/components/profile/utils/colorExtraction';
import { useCover } from '@/hooks/media/useCover';

interface CoverPhotoDialogProps {
  isOpen: boolean;
  coverPhotoUrl: string;
  onClose: () => void;
  onCoverPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCoverPhotoUpdate: (url: string) => void;
}

const CoverPhotoDialog: React.FC<CoverPhotoDialogProps> = ({ 
  isOpen, 
  coverPhotoUrl, 
  onClose, 
  onCoverPhotoChange,
  onCoverPhotoUpdate
}) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Use global cover photo system for synchronization
  const { coverPhotoUrl: globalCoverUrl, coverPosition, updateCoverGradient } = useGlobalCoverPhoto();
  const { updateCover, refresh } = useCover();
  
  // Always use global cover photo URL and position to ensure sync
  const currentCoverUrl = globalCoverUrl;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Reset preview when dialog opens to show current cover photo
  useEffect(() => {
    if (isOpen) {
      setPreviewUrl(null); // Reset to show current cover photo
    }
  }, [isOpen]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) {
      if (!user) {
        toast.error('Duhet të jeni të loguar për të ngarkuar foto');
      }
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Ju lutemi zgjidhni një skedar imazhi të vlefshëm');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Imazhi duhet të jetë më i vogël se 10MB');
      return;
    }

    // Store file and create preview URL
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    setUploadProgress(0);
    notifyGlobalCoverLoadingChange(true);

    try {
      console.log('🔄 Uploading cover photo via unified cover system');
      setUploadProgress(20);

      // Use the new unified hook to upload and persist to DB
      const key = await updateCover(selectedFile);
      setUploadProgress(70);

      // Extract colors from preview (blob) and persist gradient
      if (previewUrl) {
        try {
          const colors = await extractColorsFromImage(previewUrl);
          const gradient = createGradientFromColors(colors);
          await updateCoverGradient(gradient);
          setUploadProgress(90);
        } catch (e) {
          console.warn('Gradient extraction failed:', e);
        }
      }

      // Update local state
      onCoverPhotoUpdate(key);
      setUploadProgress(100);
      toast.success('Fotoja e kapakut u përditësua me sukses!');

      // Force refresh to re-read from DB and sync everywhere
      try { await refresh(); } catch {}
      
      // Clean up
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setSelectedFile(null);
      
    } catch (error: any) {
      console.error('❌ Gabim në ngarkimin e fotos së kapakut:', error);
      const message = typeof error?.message === 'string' ? error.message : 'Dështoi ngarkimi i fotos së kapakut';
      toast.error(message);
      // Revert optimistic state and stop loading
      notifyGlobalCoverLoadingChange(false);
      notifyGlobalCoverPhotoChange(currentCoverUrl || null, coverPosition);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      notifyGlobalCoverLoadingChange(false);
    }
  };

  const handleSave = async () => {
    // Close instantly and show optimistic preview while uploading
    if (selectedFile && previewUrl) {
      notifyGlobalCoverLoadingChange(true);
      notifyGlobalCoverPhotoChange(previewUrl, coverPosition);
    }
    onClose();
    if (selectedFile) {
      await handleUpload();
    }
  };

  const handleCancel = () => {
    // Clean up preview and selected file without saving
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    onClose();
  };

  // Display URL: show preview if uploading, otherwise show current cover photo
  const displayUrl = previewUrl || currentCoverUrl;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ndrysho Foton e Kapakut</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Ngarko Foto të Re</label>
            
            {/* Custom styled file input */}
            <div className="relative">
              <input 
                type="file" 
                accept="image/jpeg,image/jpg,image/png,image/webp,image/avif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.avif,.heic,.heif" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                id="cover-photo-input"
                disabled={uploading}
              />
              <div className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-colors duration-200 cursor-pointer ${
                uploading 
                  ? 'border-blue-400 bg-blue-50 cursor-not-allowed' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 bg-gray-50'
              }`}>
                <div className="flex flex-col items-center space-y-2 text-gray-500">
                  <Upload className="w-8 h-8" />
                  <div className="text-center">
                    <p className="text-sm font-medium">Kliko për të ngarkuar</p>
                    <p className="text-xs">JPG, PNG, WEBP, AVIF, HEIC deri në 10MB</p>
                  </div>
                </div>
              </div>
            </div>
            
            {displayUrl && (
              <div className="mt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Image className="w-4 h-4 text-gray-600" />
                  <p className="text-sm font-medium text-gray-700">
                    {previewUrl ? 'Parapamja e fotos së re' : 'Fotoja aktuale e kapakut'}
                  </p>
                </div>
                
                {uploading ? (
                  <UploadAnimation
                    isUploading={true}
                    progress={uploadProgress}
                    type="cover"
                  >
                    <div 
                      className="w-full h-32 rounded-lg bg-cover bg-center border border-gray-200 shadow-sm" 
                      style={{ 
                        backgroundImage: `url(${displayUrl})`,
                        backgroundPosition: coverPosition
                      }} 
                    />
                  </UploadAnimation>
                ) : (
                  <div 
                    className="w-full h-32 rounded-lg bg-cover bg-center border border-gray-200 shadow-sm" 
                    style={{ 
                      backgroundImage: `url(${displayUrl})`,
                      backgroundPosition: coverPosition
                    }} 
                  />
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel} className="px-6" disabled={uploading}>
              Anulo
            </Button>
            <Button 
              onClick={handleSave} 
              variant={selectedFile ? "ghost" : "outline"}
              className={`${!selectedFile ? 'px-6 bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : 'flex-1 p-4 bg-gradient-to-r from-red-500/10 to-gray-800/10 rounded-xl border border-red-200'}`}
              disabled={uploading || !selectedFile}
            >
              {uploading ? 'Duke ngarkuar...' : 'Ruaj Ndryshimet'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoverPhotoDialog;
