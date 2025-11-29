import React, { useMemo, useEffect } from 'react';
import SlidingWindow from './SlidingWindow';
import UniversalPhotoGrid from '@/components/shared/UniversalPhotoGrid';
import { Eye } from 'lucide-react';

interface PhotoPreviewSlidingWindowProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFiles: File[];
}

const PhotoPreviewSlidingWindow: React.FC<PhotoPreviewSlidingWindowProps> = ({
  isOpen,
  onClose,
  selectedFiles
}) => {
  // Memoize media items to prevent constant re-renders
  const mediaItems = useMemo(() => {
    return selectedFiles.map((file, index) => ({
      url: URL.createObjectURL(file),
      isVideo: file.type.startsWith('video/'),
      width: 1000,
      height: 1000
    }));
  }, [selectedFiles]);

  // Cleanup blob URLs only when component unmounts or files change
  useEffect(() => {
    return () => {
      // Only cleanup when the component unmounts or files actually change
      mediaItems.forEach(item => {
        if (item.url.startsWith('blob:')) {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, [selectedFiles]); // Changed dependency to selectedFiles instead of mediaItems

  return (
    <SlidingWindow
      isOpen={isOpen}
      onClose={onClose}
      title="Post Preview"
      icon={<Eye className="h-4 w-4" />}
      className="photo-preview-window"
      style={{
        width: '400px', // Match standard popup window width
        height: '700px' // Same level as create post window
      }}
    >
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          How your photos will appear in the post:
        </div>
        
        {selectedFiles.length > 0 ? (
          <div className="rounded-lg overflow-hidden border border-border">
            <UniversalPhotoGrid 
              media={mediaItems}
              onMediaClick={(index) => {
                console.log('Clicked photo:', index);
              }}
            />
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No photos selected yet</p>
            <p className="text-xs">Add photos to see the preview</p>
          </div>
        )}
        
        {selectedFiles.length > 0 && (
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <div className="font-medium mb-1">Preview Details:</div>
            <div>• {selectedFiles.length} photo{selectedFiles.length !== 1 ? 's' : ''}</div>
            <div>• Grid layout automatically optimized</div>
            <div>• Layout changes based on photo orientations</div>
          </div>
        )}
      </div>
    </SlidingWindow>
  );
};

export default PhotoPreviewSlidingWindow;