/**
 * NewCoverUploader - Clean cover uploader using new media system
 * Facebook-style cover upload with drag positioning
 */

import React, { useRef, useState, useEffect } from 'react';
import { Camera, Move, Save, Eye } from 'lucide-react';
import { useCover } from '@/hooks/media/useCover';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import NewCoverPhoto from '@/components/ui/NewCoverPhoto';
import LoadingDots from '@/components/ui/LoadingDots';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCoverControlsPreference } from '@/hooks/useCoverControlsPreference';

interface NewCoverUploaderProps {
  height?: number;
  className?: string;
  children?: React.ReactNode;
  userId?: string;
}

const NewCoverUploader: React.FC<NewCoverUploaderProps> = ({
  height = 500,
  className,
  children,
  userId
}) => {
  const { updateCover, updatePosition, position, resolvedUrl, loading } = useCover(userId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragMode, setIsDragMode] = useState(false);
  const [dragPosition, setDragPosition] = useState(position);
  const [isSaving, setIsSaving] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [showSavedChip, setShowSavedChip] = useState(false);
  const [DebugHUD, setDebugHUD] = useState<React.ComponentType | null>(null);
  const { value: showCoverControls } = useCoverControlsPreference();

  useEffect(() => {
    const handler = () => {
      setShowSavedChip(true);
      setTimeout(() => setShowSavedChip(false), 2000);
    };
    // @ts-ignore - custom event
    window.addEventListener('cover-persisted', handler as any);
    return () => {
      // @ts-ignore - custom event
      window.removeEventListener('cover-persisted', handler as any);
    };
  }, []);

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      if (p.get('coverDebug') === '1') {
        import('@/components/debug/CoverDebugHUD')
          .then(m => setDebugHUD(() => m.default))
          .catch(() => {});
      }
    } catch {}
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await updateCover(file);
      toast.success('Cover photo updated successfully');
    } catch (error) {
      console.error('❌ Cover upload failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update cover photo');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const rafRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragMode) return;

    // Cancel any pending animation frame to avoid queuing up updates
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    // Use requestAnimationFrame for smooth 60fps updates
    rafRef.current = requestAnimationFrame(() => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Use 1 decimal precision for smooth sub-pixel positioning (not rounded integers)
      setDragPosition(`center ${y.toFixed(1)}%`);
    });
  };

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const saveDragPosition = async () => {
    setIsSaving(true);
    try {
      await updatePosition(dragPosition, true);
      setIsDragMode(false);
      toast.success('Cover position updated');
    } catch (error) {
      console.error('❌ Failed to save position:', error);
      toast.error('Failed to save cover position');
      setDragPosition(position); // Reset to original
    } finally {
      setIsSaving(false);
    }
  };
  const toggleDragMode = () => {
    if (isDragMode) {
      setDragPosition(position); // Reset to original if canceling
    }
    setIsDragMode(!isDragMode);
  };

  return (
    <div className="relative group">
      <NewCoverPhoto 
        userId={userId}
        height={height}
        className={className}
        overridePosition={isDragMode ? dragPosition : undefined}
        isDragging={isDragMode}
        onMouseMove={handleMouseMove}
        style={{
          cursor: isDragMode ? 'grabbing' : 'grab'
        }}
      >
        {/* Debug HUD */}
        {DebugHUD && <DebugHUD />}

        {showSavedChip && (
          <div className="absolute top-4 left-4 z-20 rounded-md px-2 py-1 text-xs border bg-background/80 text-foreground shadow">
            Cover saved ✓
          </div>
        )}

        {/* Drag mode overlay */}
        {isDragMode && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Move className="w-4 h-4" />
              <span className="text-sm">Click to position cover photo</span>
            </div>
          </div>
        )}

        {/* Controls overlay - top right */}
        {showCoverControls && (
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {isDragMode ? (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={saveDragPosition}
                  className="bg-white/90 text-black hover:bg-white"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleDragMode}
                  className="bg-white/90 text-black hover:bg-white"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setViewerOpen(true)}
                  className="bg-white/90 text-black hover:bg-white"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={triggerUpload}
                  className="bg-white/90 text-black hover:bg-white"
                >
                  <Camera className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleDragMode}
                  className="bg-white/90 text-black hover:bg-white"
                >
                  <Move className="w-4 h-4 mr-1" />
                  Reposition
                </Button>
              </>
            )}
          </div>
        )}

        {/* Saving/uploading overlays */}
        {isSaving && (
          <LoadingDots message="Saving cover position..." variant="light" size="md" />
        )}
        {loading && (
          <LoadingDots message="Updating cover photo..." variant="light" size="md" />
        )}
        {/* Pass through children (avatar, etc.) */}
        {children}
      </NewCoverPhoto>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/avif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.avif,.heic,.heif"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Viewer dialog */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Cover photo</DialogTitle>
          </DialogHeader>
          {resolvedUrl && (
            <img src={resolvedUrl} alt="Cover photo full size" className="w-full h-auto rounded-md" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewCoverUploader;