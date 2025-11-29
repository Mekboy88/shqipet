
import React, { useState, useMemo, useEffect } from "react";
import { X, Video, File, Play, FileText, Music, Image } from "lucide-react";
import { getFileCategory, formatFileSize } from "@/utils/contentFilter";
import UniversalPhotoGrid from "@/components/shared/UniversalPhotoGrid";

// Helpers to robustly detect media types (only preview known-safe formats)
const getExtension = (name: string) => name.split('.').pop()?.toLowerCase() || '';
const IMAGE_EXTS = new Set(['jpg','jpeg','png','gif','webp','bmp','svg']);
const VIDEO_EXTS = new Set(['mp4','webm']); // keep previewable and widely supported
const SUPPORTED_IMAGE_MIME = new Set(['image/jpeg','image/jpg','image/png','image/gif','image/webp','image/bmp','image/svg+xml']);
const SUPPORTED_VIDEO_MIME = new Set(['video/mp4','video/webm']);

const isPreviewableImage = (file: File) => SUPPORTED_IMAGE_MIME.has(file.type) || IMAGE_EXTS.has(getExtension(file.name));
const isPreviewableVideo = (file: File) => SUPPORTED_VIDEO_MIME.has(file.type) || VIDEO_EXTS.has(getExtension(file.name));

interface CreatePostFilePreviewProps {
  files: File[];
  onRemoveFile: (index: number) => void;
}

const CreatePostFilePreview: React.FC<CreatePostFilePreviewProps> = ({
  files,
  onRemoveFile
}) => {
  const [showAll, setShowAll] = useState(false);

  if (files.length === 0) return null;

  // Separate media files (photos/videos) from other files
  const mediaFiles = files.filter(file => isPreviewableImage(file) || isPreviewableVideo(file));

  const otherFiles = files.filter(file => !(isPreviewableImage(file) || isPreviewableVideo(file)));

  // Build preview items: images as Data URLs (no revoke issues), videos as blob URLs
  const [mediaItems, setMediaItems] = useState<Array<{ url: string; isVideo: boolean; width: number; height: number }>>([]);

  useEffect(() => {
    let cancelled = false;
    const videoUrls: string[] = [];

    const readAsDataUrl = (file: File) => new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => resolve(URL.createObjectURL(file)); // fallback to blob URL
      reader.readAsDataURL(file);
    });

    const build = async () => {
      const items = await Promise.all(mediaFiles.map(async (file) => {
        if (isPreviewableVideo(file)) {
          const url = URL.createObjectURL(file);
          videoUrls.push(url);
          return { url, isVideo: true, width: 1000, height: 1000 };
        }
        const url = await readAsDataUrl(file);
        return { url, isVideo: false, width: 1000, height: 1000 };
      }));
      if (!cancelled) setMediaItems(items);
    };

    build();

    return () => {
      cancelled = true;
      // Revoke only video blob URLs
      videoUrls.forEach((u) => {
        if (u.startsWith('blob:')) URL.revokeObjectURL(u);
      });
    };
  }, [mediaFiles.length, mediaFiles.map(f => f.name + f.size).join(',')]);

  const displayOtherFiles = showAll ? otherFiles : otherFiles.slice(0, 4);
  const remainingOtherCount = otherFiles.length - 4;

  const getFileIcon = (file: File) => {
    const category = getFileCategory(file);
    switch (category) {
      case 'image': return <Image className="w-5 h-5 text-blue-500" />;
      case 'video': return <Video className="w-5 h-5 text-red-500" />;
      case 'audio': return <Music className="w-5 h-5 text-green-500" />;
      case 'document': return <FileText className="w-5 h-5 text-orange-500" />;
      default: return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  // Find and remove media files when clicked in the grid
  const handleMediaRemove = (mediaIndex: number) => {
    const fileToRemove = mediaFiles[mediaIndex];
    const originalIndex = files.findIndex(f => f === fileToRemove);
    if (originalIndex !== -1) {
      onRemoveFile(originalIndex);
    }
  };

  return (
    <div className="relative space-y-4">
      {/* Media Grid - using UniversalPhotoGrid for photos/videos */}
      {mediaFiles.length > 0 && (
        <div className="bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl border border-border/50 p-4 shadow-lg backdrop-blur-sm">
          <div className="rounded-lg overflow-hidden border border-border">
            <UniversalPhotoGrid 
              media={mediaItems}
              onMediaClick={handleMediaRemove}
              stablePreview
            />
          </div>
        </div>
      )}

      {/* Other Files Grid - for non-media files */}
      {otherFiles.length > 0 && (
        <div className="bg-gradient-to-br from-card via-card/95 to-card/90 rounded-xl border border-border/50 p-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-card-foreground">Other Files</h3>
            {otherFiles.length > 4 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-xs text-primary hover:text-primary/80 font-medium"
              >
                {showAll ? 'Show Less' : `See All (${otherFiles.length})`}
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {displayOtherFiles.map((file, index) => {
              const originalIndex = files.findIndex(f => f === file);
              
              return (
                <div 
                  key={index} 
                  className="relative group bg-background/50 border border-border/30 rounded-lg overflow-hidden hover:border-primary/30 transition-all duration-200 hover:shadow-md"
                >
                  <button
                    onClick={() => onRemoveFile(originalIndex)}
                    className="absolute top-1 right-1 z-10 bg-destructive/90 text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  
                  <div className="aspect-square relative">
                    <div className="w-full h-full bg-gradient-to-br from-muted/50 to-muted/80 flex flex-col items-center justify-center p-2">
                      {getFileIcon(file)}
                      <div className="text-[10px] text-muted-foreground mt-1 text-center">
                        {file.name.split('.').pop()?.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-1.5 bg-background/80 border-t border-border/30">
                    <p className="text-[10px] text-muted-foreground truncate font-medium">
                      {file.name}
                    </p>
                    <p className="text-[9px] text-muted-foreground/70">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
              );
            })}
            
            {!showAll && remainingOtherCount > 0 && (
              <button
                onClick={() => setShowAll(true)}
                className="aspect-square bg-gradient-to-br from-muted/50 to-muted/80 border border-dashed border-border/50 rounded-lg flex flex-col items-center justify-center hover:from-primary/10 hover:to-primary/20 hover:border-primary/50 transition-all duration-200"
              >
                <div className="text-2xl font-bold text-primary">+{remainingOtherCount}</div>
                <div className="text-xs text-muted-foreground">More</div>
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default CreatePostFilePreview;
