import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import MediaViewer from './MediaViewer';
import { MediaItemProps } from '../photo-layouts/types';

interface MediaViewerModalProps {
  media: MediaItemProps[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

const MediaViewerModal: React.FC<MediaViewerModalProps> = ({
  media,
  initialIndex = 0,
  isOpen,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-none w-screen h-screen p-0 bg-transparent border-none">
        <MediaViewer
          media={media}
          initialIndex={initialIndex}
          isOpen={isOpen}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MediaViewerModal;