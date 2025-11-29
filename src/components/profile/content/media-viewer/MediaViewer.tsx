import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaItemProps } from '../photo-layouts/types';
import { WasabiImageDisplay } from '@/components/fallback/WasabiImageDisplay';
import { processWasabiUrl } from '@/services/media/LegacyMediaService';
import { useVideoSettings } from '@/contexts/VideoSettingsContext';
import VideoPlayerControls from '@/components/watch/components/VideoPlayerControls';

interface MediaViewerProps {
  media: MediaItemProps[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

const MediaViewer: React.FC<MediaViewerProps> = ({
  media,
  initialIndex = 0,
  isOpen,
  onClose
}) => {
  const { settings, activeVideoId, setActiveVideo, setModalVideo } = useVideoSettings();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [showControls, setShowControls] = useState(true); // Always show controls in modal
  const [volume, setVolume] = useState(1);

  const currentMedia = media[currentIndex];
  const isVideo = currentMedia?.isVideo;
  const videoId = isVideo ? `modal-video-${currentMedia?.url?.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'unknown'}` : null;

  // Take control of video playback when modal opens
  useEffect(() => {
    if (isOpen && isVideo && videoId) {
      console.log('🎭 Modal opened - establishing video priority:', videoId);
      
      // Set modal video priority to block feed videos from taking control
      setModalVideo(videoId);
      
      // AGGRESSIVELY pause and mute ALL feed videos
      const allVideos = document.querySelectorAll('video') as NodeListOf<HTMLVideoElement>;
      console.log('🔍 Controlling all videos - found:', allVideos.length);
      
      allVideos.forEach((video, index) => {
        const isModalVideo = video.getAttribute('data-modal-video') === 'true';
        
        // Force pause and mute all non-modal videos
        if (!isModalVideo) {
          console.log(`🛑 Pausing feed video ${index}:`, video.src);
          video.pause();
          video.muted = true;
        }
      });
    }
  }, [isOpen, isVideo, videoId, setModalVideo]);

  // Reset modal priority when modal closes
  useEffect(() => {
    if (!isOpen && videoId) {
      console.log('🚪 Modal closed - clearing modal priority:', videoId);
      setModalVideo(null);
      if (activeVideoId === videoId) {
        setActiveVideo(null);
      }
    }
  }, [isOpen, videoId, activeVideoId, setActiveVideo, setModalVideo]);

  // Process video URL when current media changes
  useEffect(() => {
    const processVideoUrl = async () => {
      if (isVideo && currentMedia?.url) {
        try {
          const processed = await processWasabiUrl(currentMedia.url);
          setProcessedVideoUrl(processed);
        } catch (error) {
          console.log('Video processing note:', error);
          setProcessedVideoUrl(currentMedia.url);
        }
      }
    };

    if (isVideo) {
      processVideoUrl();
    }
  }, [currentMedia?.url, isVideo]);

  // Reset current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNext();
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
        case ' ':
          event.preventDefault();
          if (isVideo) {
            togglePlayPause();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, isVideo, isPlaying]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
  }, [media.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
  }, [media.length]);

  const togglePlayPause = useCallback(() => {
    if (videoRef && videoId) {
      console.log('🎮 Modal video control - current state:', { isPlaying, videoId });
      
      if (isPlaying) {
        console.log('⏸️ Modal video pause');
        videoRef.pause();
        setIsPlaying(false);
      } else {
        console.log('▶️ Modal video play - enforcing control');
        
        // Ensure modal priority is set
        setModalVideo(videoId);
        
        // FORCE pause and mute ALL other videos
        const allVideos = document.querySelectorAll('video') as NodeListOf<HTMLVideoElement>;
        allVideos.forEach((video) => {
          if (video !== videoRef) {
            video.pause();
            video.muted = true;
          }
        });
        
        // Play modal video
        videoRef.play().then(() => {
          setIsPlaying(true);
          console.log('✅ Modal video playing successfully');
        }).catch(console.error);
      }
    }
  }, [isPlaying, videoRef, videoId, setModalVideo]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (videoRef) {
      videoRef.volume = newVolume;
    }
  }, [videoRef]);

  const togglePictureInPicture = useCallback(async () => {
    if (videoRef) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.requestPictureInPicture();
        }
      } catch (error) {
        console.log('Picture-in-Picture not supported:', error);
      }
    }
  }, [videoRef]);

  if (!isOpen || !currentMedia) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      {/* Close button with square shade */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 h-10 w-10"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Navigation arrows - Always visible with circular white shade */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/30 w-14 h-14"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-8 w-8" strokeWidth={3} />
          </Button>
        </div>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/30 w-14 h-14"
            onClick={goToNext}
          >
            <ChevronRight className="h-8 w-8" strokeWidth={3} />
          </Button>
        </div>
      </div>

      {/* Media content */}
      <div className="w-full h-full flex items-center justify-center p-4">
        {isVideo ? (
          <div className="relative max-w-full max-h-full">
            {processedVideoUrl && (
              <>
                <video
                  ref={(video) => {
                    setVideoRef(video);
                    if (video && videoId) {
                      console.log('🎬 Modal video ref set:', videoId);
                      video.setAttribute('data-video-id', videoId);
                      video.setAttribute('data-modal-video', 'true');
                      
                      // Establish modal priority immediately
                      setModalVideo(videoId);
                      
                      // Apply global settings
                      video.muted = settings.globalMuted;
                      video.volume = volume;
                      
                      console.log('🔊 Modal video mute state:', settings.globalMuted);
                    }
                  }}
                  src={processedVideoUrl}
                  className="max-w-full max-h-full rounded-lg"
                  controls={false}
                  autoPlay
                  onPlay={() => {
                    console.log('▶️ Modal video started playing:', videoId);
                    setIsPlaying(true);
                    if (videoId) {
                      // Ensure modal priority and active status
                      setModalVideo(videoId);
                      
                      // FORCE control of ALL other videos
                      const allVideos = document.querySelectorAll('video') as NodeListOf<HTMLVideoElement>;
                      allVideos.forEach((video) => {
                        if (video !== videoRef) {
                          video.pause();
                          video.muted = true;
                        }
                      });
                      
                      // Apply current mute state to modal video
                      if (videoRef) {
                        videoRef.muted = settings.globalMuted;
                        console.log('🔊 Modal video mute applied:', settings.globalMuted);
                      }
                    }
                  }}
                  onPause={() => {
                    console.log('⏸️ Modal video paused');
                    setIsPlaying(false);
                  }}
                  onVolumeChange={() => {
                    if (videoRef) {
                      setVolume(videoRef.volume);
                    }
                  }}
                  onLoadedMetadata={() => {
                    if (videoRef && videoId) {
                      console.log('📱 Modal video loaded, establishing priority:', videoId);
                      setModalVideo(videoId);
                      videoRef.muted = settings.globalMuted;
                    }
                  }}
                />
                
                {/* Video Player Controls */}
                {showControls && (
                  <VideoPlayerControls
                    volume={volume}
                    videoRef={{ current: videoRef }}
                    onVolumeChange={handleVolumeChange}
                    onPictureInPicture={togglePictureInPicture}
                    videoId={videoId || 'modal-video'}
                  />
                )}
                
                {/* Custom play/pause overlay */}
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-transparent hover:bg-black/10 transition-all cursor-pointer rounded-lg"
                  onClick={togglePlayPause}
                >
                  {!isPlaying && (
                    <div className="w-20 h-20 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-10 h-10 text-white ml-1" fill="white" />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <WasabiImageDisplay
            url={currentMedia.url}
            alt={`Media ${currentIndex + 1}`}
            className="max-w-full max-h-full rounded-lg object-contain"
          />
        )}
      </div>

      {/* Media counter */}
      {media.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {media.length}
        </div>
      )}

      {/* Navigation dots */}
      {media.length > 1 && media.length <= 10 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
          {media.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white' : 'bg-white/40'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaViewer;