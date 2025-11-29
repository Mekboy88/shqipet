
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CoverPhotoDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  coverHeight: number;
  setCoverHeight: (height: number) => void;
  coverImageUrl: string;
  onCoverPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

const CoverPhotoDialog: React.FC<CoverPhotoDialogProps> = ({
  isOpen,
  onOpenChange,
  coverHeight,
  setCoverHeight,
  coverImageUrl,
  onCoverPhotoChange,
  onSave
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle className="text-center">Edit Cover Photo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Upload New Photo</label>
            <input 
              type="file" 
              accept="image/jpeg,image/jpg,image/png,image/webp,image/avif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.avif,.heic,.heif"
              onChange={onCoverPhotoChange}
              className="border p-2 rounded-md" 
            />
            
            {coverImageUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Preview</p>
                <div 
                  className="w-full h-32 rounded-md bg-cover bg-center overflow-hidden"
                  style={{ backgroundImage: `url(${coverImageUrl})` }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Colors will be automatically extracted from your image to create the gradient
                </p>
              </div>
            )}
          </div>
            
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Adjust Height (pixels)</label>
            <div className="flex space-x-4 items-center">
              <input 
                type="number" 
                value={coverHeight} 
                onChange={e => setCoverHeight(Number(e.target.value))} 
                className="border p-2 rounded-md w-24" 
                min="200" 
                max="600" 
              />
              <div className="flex-1">
                <input 
                  type="range" 
                  min="200" 
                  max="600" 
                  value={coverHeight} 
                  onChange={e => setCoverHeight(Number(e.target.value))} 
                  className="w-full" 
                />
              </div>
            </div>
          </div>
            
          <div className="flex justify-between space-x-4 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
              Cancel
            </Button>
            <Button onClick={onSave} className="w-full">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoverPhotoDialog;
