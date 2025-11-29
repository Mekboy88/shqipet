import React, { useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import ProgressBar from './ProgressBar';
import PostActions from '@/components/post/PostActions';
import { Separator } from '@/components/ui/separator';
import Avatar from '@/components/Avatar';
import { useUniversalUser } from '@/hooks/useUniversalUser';
import VolumeControl from './components/VolumeControl';
import VideoSettingsPanel from './components/VideoSettingsPanel';

interface PictureInPictureWindowProps {
  currentVideoUrl: string;
  currentPost: any;
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  isHoveringPipProgress: boolean;
  isDraggingPip: boolean;
  pipHoverTime: number;
  pipProgressHoverX: number;
  pipProgressRef: React.RefObject<HTMLDivElement>;
  pipVideoRef: React.RefObject<HTMLVideoElement>;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onTogglePiP: () => void;
  onPipProgressMouseEnter: () => void;
  onPipProgressMouseLeave: () => void;
  onPipProgressMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onPipProgressMouseDown: () => void;
  onPipProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  formatTime: (time: number) => string;
}

const PictureInPictureWindow: React.FC<PictureInPictureWindowProps> = ({
  currentVideoUrl,
  currentPost,
  isPlaying,
  isMuted,
  currentTime,
  duration,
  isHoveringPipProgress,
  isDraggingPip,
  pipHoverTime,
  pipProgressHoverX,
  pipProgressRef,
  pipVideoRef,
  onTogglePlay,
  onToggleMute,
  onTogglePiP,
  onPipProgressMouseEnter,
  onPipProgressMouseLeave,
  onPipProgressMouseMove,
  onPipProgressMouseDown,
  onPipProgressClick,
  formatTime
}) => {
  const { displayName } = useUniversalUser();
  const [pipCurrentTime, setPipCurrentTime] = React.useState(currentTime);
  const [pipDuration, setPipDuration] = React.useState(duration);

  // Sync video time when PiP opens and PAUSE original video
  useEffect(() => {
    if (pipVideoRef.current && currentVideoUrl) {
      // CRITICAL: Pause ALL other videos when PiP opens and prevent future autoplay
      const allVideos = document.querySelectorAll('video');
      allVideos.forEach(video => {
        if (video !== pipVideoRef.current && video.src === currentVideoUrl) {
          video.pause();
          // Mark video as "controlled by PiP" to prevent intersection observer autoplay
          video.setAttribute('data-pip-controlled', 'true');
          console.log('🛑 Paused original video for PiP and marked as PiP-controlled');
        }
      });

      const storedData = sessionStorage.getItem('pipVideoData');
      if (storedData) {
        try {
          const videoData = JSON.parse(storedData);
          if (videoData.src === currentVideoUrl || videoData.currentTime !== undefined) {
            pipVideoRef.current.currentTime = videoData.currentTime;
            pipVideoRef.current.muted = videoData.isMuted;
            
            // SEAMLESS TRANSITION: Start PiP video immediately without any pause
            pipVideoRef.current.play().then(() => {
              console.log('🔄 PiP video started seamlessly at time:', videoData.currentTime);
            }).catch(console.error);
          }
        } catch (error) {
          console.error('Error parsing stored video data:', error);
        }
      }
    }
  }, [currentVideoUrl, pipVideoRef]);
  
  const handleClosePiP = () => {
    if (pipVideoRef.current) {
      const pipTime = pipVideoRef.current.currentTime;
      const wasPlaying = !pipVideoRef.current.paused;
      
      // Find the original video and sync directly
      const allVideos = document.querySelectorAll('video');
      allVideos.forEach((video) => {
        if (video !== pipVideoRef.current && video.src === currentVideoUrl) {
          video.removeAttribute('data-pip-controlled');
          video.currentTime = pipTime;
          if (wasPlaying) {
            video.play();
          }
        }
      });
    }
    
    onTogglePiP();
  };

  const handleComment = () => {
    console.log('Comment clicked from PiP');
  };

  const handleAddFriend = () => {
    console.log('Add friend clicked from PiP');
  };

  // Get user data - handle multiple possible data structures
  const getUserData = () => {
    if (!currentPost) return { avatarUrl: "/placeholder.svg", displayName: displayName || "User" };
    
    // Try different possible structures
    const user = currentPost.user || currentPost;
    const avatarUrl = user?.avatarUrl || user?.image || user?.user_image || "/placeholder.svg";
    const userName = user?.displayName || user?.name || user?.user_name || displayName || "User";
    
    return { avatarUrl, displayName: userName };
  };

  const { avatarUrl, displayName: postUserName } = getUserData();

  return (
    <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-50 w-80 md:w-96 bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-200">
      {/* Video Section - Better aspect ratio and cropping */}
      <div className="relative w-full h-48 md:h-56 bg-black overflow-hidden">
        <video 
          ref={pipVideoRef}
          src={currentVideoUrl}
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center' }}
          autoPlay={isPlaying}
          muted={isMuted}
          loop
          onPlay={() => {}}
          onPause={() => {}}
          onTimeUpdate={(e) => {
            const video = e.currentTarget;
            setPipCurrentTime(video.currentTime);
            setPipDuration(video.duration || 0);
          }}
          onLoadedMetadata={(e) => {
            const video = e.currentTarget;
            setPipDuration(video.duration || 0);
          }}
        />

        {/* Close Button */}
        <div className="absolute top-2 right-2 z-10">
          <button 
            onClick={handleClosePiP}
            className="text-white hover:text-gray-300 text-xs bg-black/50 rounded-full w-6 h-6 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Video Controls Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              onClick={onTogglePlay}
              className="bg-black/50 hover:bg-black/70 rounded-full p-3 transition-all"
            >
              {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
            </button>
          </div>

          {/* Bottom Controls - ALL controls inside video like big window */}
          <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
            {/* Left side - Play button, time, progress bar (mini) */}
            <div className="flex items-center gap-1 flex-1 mr-2">
              {/* Mini Play/Pause Button */}
              <button
                onClick={onTogglePlay}
                className="bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition-colors flex-shrink-0"
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              </button>

              {/* Mini Time Display */}
              <div className="bg-black/70 text-white px-1 py-0.5 rounded text-xs font-medium flex-shrink-0">
                {formatTime(pipCurrentTime)} / {formatTime(pipDuration)}
              </div>

              {/* Mini Progress Bar */}
              <div className="flex-1 min-w-0">
                <div 
                  className="relative cursor-pointer group py-1"
                  onMouseDown={onPipProgressMouseDown}
                  onMouseMove={onPipProgressMouseMove}
                  onMouseEnter={onPipProgressMouseEnter}
                  onMouseLeave={onPipProgressMouseLeave}
                  onClick={onPipProgressClick}
                >
                  <div 
                    ref={pipProgressRef}
                    className="relative h-0.5 bg-gray-600 rounded overflow-hidden"
                  >
                    <div
                      className="absolute top-0 left-0 h-full bg-red-400 transition-all duration-150"
                      style={{ width: `${pipDuration > 0 ? (pipCurrentTime / pipDuration) * 100 : 0}%` }}
                    />
                    
                    {/* Mini handle */}
                    <div 
                      className="absolute top-1/2 w-1 h-1 bg-red-400 rounded-full transform -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ left: `${pipDuration > 0 ? (pipCurrentTime / pipDuration) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Volume, Settings, PiP close (mini) */}
            <div className="flex gap-1 items-center">
              <VolumeControl
                volume={1}
                videoRef={pipVideoRef}
                onVolumeChange={() => {}}
                videoId="pip-video"
              />
              
              <VideoSettingsPanel
                videoRef={pipVideoRef}
                mini={true}
              />
              
              <button
                onClick={handleClosePiP}
                className="bg-black/60 hover:bg-black/80 text-white p-1 rounded transition-colors"
                title="Close Picture-in-Picture"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                  <rect x="14" y="14" width="4" height="4" rx="1"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Video Post Text - Match main window styling exactly */}
      <div className="p-2">
        <h2 className="text-xs font-semibold text-gray-900 mb-2">
          {(() => {
            const text = currentPost?.content?.text || "From cracks in walls to foundation damage, we strengthen your structure with lasting solutions.";
            const words = text.split(' ');
            return words.length > 6 ? words.slice(0, 6).join(' ') + '...' : text;
          })()}
        </h2>
        
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar userId={(currentPost?.user && (currentPost.user.id || currentPost.user.user_id)) || currentPost?.user_id || currentPost?.author_id || currentPost?.created_by} size="md" className="flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">{postUserName}</h3>
                <p className="text-gray-600 text-sm">Bathroom Waterproofing Contractors in Quindy</p>
              </div>
            </div>
            <button 
              onClick={handleAddFriend}
              className="bg-transparent border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-50"
            >
              Follow
            </button>
          </div>
      </div>


    </div>
  );
};

export default PictureInPictureWindow;