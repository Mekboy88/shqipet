import React, { useRef, useEffect, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Minimize2, Maximize2, Crop, Expand } from "lucide-react";
import UniversalPhotoGrid from "@/components/shared/UniversalPhotoGrid";
import CommentPhotoGrid from "@/components/shared/CommentPhotoGrid";
import { processWasabiUrl, isWasabiKey } from '@/services/media/LegacyMediaService';
import { isSecureVideoFile } from '@/utils/videoSecurity';
import { Skeleton } from '@/components/ui/skeleton';

interface PostContentProps {
  content: {
    text?: string;
    image?: string;
    images?: string[];
    secondaryImage?: string;
  };
  postType?: string;
  postId?: string; // Add postId to make each post unique
  onMediaClick?: (index: number) => void; // Add onMediaClick prop
  isCommentContext?: boolean; // Add flag for comment context
}

// Global shared mute state for ALL videos across the entire application
let globalMuteState = true; // Default to muted
const globalMuteStateCallbacks: Set<(muted: boolean) => void> = new Set();

const PostContent: React.FC<PostContentProps> = ({ content, postType, postId, onMediaClick, isCommentContext = false }) => {
  // Process images to generate presigned URLs when needed
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  const rawImages = content.images || (content.image ? [content.image] : []);
  
  // Create unique keys for each video by combining postId with index
  const createVideoKey = (index: number) => `${postId || 'unknown'}-${index}`;
  
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const [isMuted, setIsMuted] = useState<boolean>(globalMuteState); // Always sync with global state
  const [showPiP, setShowPiP] = useState<{ [key: string]: boolean }>({});
  const [isCropped, setIsCropped] = useState<{ [key: string]: boolean }>({});
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});


  // Process all image/video URLs instantly - no loading delays
  useEffect(() => {
    let isMounted = true;

    const processImages = async () => {
      try {
        if (rawImages.length === 0) {
          if (isMounted) {
            setProcessedImages([]);
            setLoadingImages(false);
          }
          return;
        }
        
        // Instant processing - no timeouts or delays
        const processed = await Promise.all(
          rawImages.map(async (url) => {
            try {
              if (isWasabiKey(url)) {
                return await processWasabiUrl(url, 900);
              }
              return url;
            } catch (error) {
              console.error('❌ Failed to process URL:', url, error);
              return url; // Fallback to original
            }
          })
        );
        
        if (isMounted) {
          setProcessedImages(processed.filter(Boolean));
          setLoadingImages(false); // Set false immediately after processing
        }
      } catch (error) {
        console.error('❌ Error processing images:', error);
        if (isMounted) {
          setProcessedImages(rawImages);
          setLoadingImages(false); // Always set false to prevent stuck loading
        }
      }
    };

    processImages();

    return () => {
      isMounted = false;
    };
  }, [rawImages.length, rawImages[0]]);

  // Subscribe to global mute state changes and immediately apply to all videos
  useEffect(() => {
    const callback = (muted: boolean) => {
      console.log(`PostContent ${postId} received global mute change:`, muted);
      setIsMuted(muted);
      // Immediately apply to ALL videos in this component
      Object.values(videoRefs.current).forEach(video => {
        if (video) {
          video.muted = muted;
          console.log(`Applied mute ${muted} to video in post ${postId}`);
        }
      });
    };
    
    globalMuteStateCallbacks.add(callback);
    
    return () => {
      globalMuteStateCallbacks.delete(callback);
    };
  }, [postId]);

  // Initialize video cropping state to true (cropped by default)
  useEffect(() => {
    const videoIndices = processedImages.map((url, index) => ({ url, index }))
      .filter(({ url }) => isSecureVideoFile(url))
      .map(({ index }) => index);
    
    if (videoIndices.length > 0) {
      const initialCroppedState: { [key: string]: boolean } = {};
      videoIndices.forEach(index => {
        const videoKey = createVideoKey(index);
        initialCroppedState[videoKey] = true; // Default to cropped
      });
      setIsCropped(initialCroppedState);
    }
  }, [processedImages, postId]);

  // Apply global mute state to all videos when they load
  useEffect(() => {
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        video.muted = globalMuteState;
      }
    });
  }, []);

  // Auto-play when video comes into view with PROPER mute state
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoKey = entry.target.getAttribute('data-video-key');
          const video = videoKey ? videoRefs.current[videoKey] : null;
          
          if (video && entry.isIntersecting) {
            // CRITICAL: Always apply global mute state and normal speed before auto-playing
            video.muted = globalMuteState;
            video.playbackRate = 1.0; // Always ensure normal speed
            console.log(`Auto-playing video ${videoKey} with mute: ${globalMuteState}`);
            
            // Auto-play when video is visible
            video.play().then(() => {
              setIsPlaying(prev => ({ ...prev, [videoKey]: true }));
            }).catch(error => {
              console.log("Auto-play failed:", error);
            });
          } else if (video && !entry.isIntersecting) {
            // Pause when video is not visible
            video.pause();
            setIsPlaying(prev => ({ ...prev, [videoKey]: false }));
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe all video elements
    Object.entries(videoRefs.current).forEach(([videoKey, video]) => {
      if (video) {
        video.setAttribute('data-video-key', videoKey);
        observer.observe(video);
      }
    });

    return () => observer.disconnect();
  }, [processedImages, postId]);

  const imagesToShow = processedImages;

  const handleVideoPlay = (index: number) => {
    const videoKey = createVideoKey(index);
    const video = videoRefs.current[videoKey];
    if (video) {
      if (isPlaying[videoKey]) {
        video.pause();
      } else {
        // ALWAYS apply global mute state and normal speed before playing
        video.muted = globalMuteState;
        video.playbackRate = 1.0; // Always ensure normal speed
        video.play().catch(error => {
          console.log("Video play failed:", error);
        });
      }
      setIsPlaying(prev => ({ ...prev, [videoKey]: !prev[videoKey] }));
    }
  };

  const handleMute = (index: number) => {
    // Update global mute state
    globalMuteState = !globalMuteState;
    
    console.log(`Global mute state changed to: ${globalMuteState} by post ${postId}`);
    
    // Notify ALL components about the mute state change
    globalMuteStateCallbacks.forEach(callback => callback(globalMuteState));
  };

  const handlePiP = async (index: number) => {
    const videoKey = createVideoKey(index);
    const video = videoRefs.current[videoKey];
    if (video && document.pictureInPictureEnabled && !video.disablePictureInPicture) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
          setShowPiP(prev => ({ ...prev, [videoKey]: false }));
        } else {
          await video.requestPictureInPicture();
          setShowPiP(prev => ({ ...prev, [videoKey]: true }));
        }
      } catch (error) {
        console.error("Picture-in-Picture failed:", error);
      }
    }
  };

  const handleFullscreen = (index: number) => {
    const videoKey = createVideoKey(index);
    const video = videoRefs.current[videoKey];
    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    }
  };

  const toggleCropping = (index: number) => {
    const videoKey = createVideoKey(index);
    setIsCropped(prev => ({ ...prev, [videoKey]: !prev[videoKey] }));
  };

  // Identify videos using original URLs for proper detection
  const videosInGrid = rawImages.filter(url => isSecureVideoFile(url));

  // Use all media (images AND videos) together - DISPLAY ALL CONTENT
  const allMediaContent = imagesToShow;

  console.log('📷 PostContent Media Debug:', {
    postId,
    totalRawImages: rawImages.length,
    totalProcessedImages: processedImages.length,
    allMediaToShow: allMediaContent.length,
    videoCount: videosInGrid.length,
    imageCount: allMediaContent.length - videosInGrid.length,
    allUrls: allMediaContent,
    postType,
    loadingImages
  });

  // NO intermediate loading - skeleton handles all loading
  // Removed: gray loading state that appeared after skeleton

  // Early return if no media to show
  if (!loadingImages && allMediaContent.length === 0) {
    return null;
  }

  // Only show content when fully loaded - no intermediate states
  if (loadingImages) {
    return null; // Let skeleton handle loading in parent component
  }

  return (
    <>
      {/* Post media content - DISPLAY ALL PHOTOS AND VIDEOS TOGETHER */}
      {allMediaContent.length > 0 && (
        <div className="w-full">
          {isCommentContext ? (
            <CommentPhotoGrid 
              media={allMediaContent}
              videos={rawImages.filter(url => isSecureVideoFile(url))}
              onMediaClick={onMediaClick}
              className="w-full"
            />
          ) : (
            <UniversalPhotoGrid 
              media={allMediaContent}
              videos={rawImages.filter(url => isSecureVideoFile(url))}
              onMediaClick={onMediaClick}
              className="w-full"
            />
          )}
        </div>
      )}

      {/* REMOVED: Video stats section - only FeedVideoPlayer shows video stats */}
    </>
  );
};

export default PostContent;
