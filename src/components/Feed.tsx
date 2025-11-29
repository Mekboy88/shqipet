import React, { useEffect, useRef, useState } from 'react';
import FeedContainer from './feed/content/FeedContainer';
import FeedContent from './feed/content/FeedContent';
import RightSidebar from './sidebar/right/RightSidebar';
import LeftSidebarContainer from './sidebar/left/LeftSidebarContainer';
import { useBreakpoint } from '@/hooks/use-mobile';
import PictureInPictureWindow from '@/components/watch/PictureInPictureWindow';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';
import { usePosts } from '@/contexts/PostsContext';
import { useFeedConsole } from './feed/hooks/useFeedConsole';
import { isReelsSuitable } from '@/components/reels/utils/videoDurationUtils';
import PublishingProgressIndicator from './feed/PublishingProgressIndicator';
import { usePublishingProgress } from '@/contexts/PublishingProgressContext';
import { isSecureVideoFile } from '@/utils/videoSecurity';
const Feed: React.FC = () => {
  const {
    isMobile,
    isTablet,
    isLaptop,
    isDesktop
  } = useBreakpoint();
  const {
    posts
  } = usePosts();
  const {
    isPublishing,
    publishingData,
    stopPublishing
  } = usePublishingProgress();
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const [reels, setReels] = useState<any[]>([]);

  // Enable console controls for feed positioning
  useFeedConsole();

  // Use the same video player hook as Watch page for unified PiP
  const {
    isPlaying,
    isMuted,
    showPiP,
    currentTime,
    duration,
    isHoveringPipProgress,
    isDraggingPip,
    pipHoverTime,
    pipProgressHoverX,
    pipProgressRef,
    pipVideoRef,
    formatTime,
    togglePlay,
    toggleMute,
    togglePiP
  } = useVideoPlayer();

  // SECURE SHQIPET PLATFORM VIDEO DETECTION - ONLY APPROVED SOURCES
  const isVideoFile = isSecureVideoFile;

  // Get current video for PiP (same logic as Watch page)
  const videoPosts = posts.filter(post => {
    if (!post.content.images || post.content.images.length === 0) {
      return false;
    }
    return post.content.images.some(url => isVideoFile(url));
  });
  const [currentPost, setCurrentPost] = useState(videoPosts[0]);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(videoPosts[0]?.content.images?.find(url => isVideoFile(url)) || '');

  // Global PiP handler for videos in feed
  useEffect(() => {
    window.feedPipHandler = (videoUrl: string, post: any) => {
      console.log('🎬 Opening PiP for video:', videoUrl);
      setCurrentVideoUrl(videoUrl);
      setCurrentPost(post);
      togglePiP();
    };
    return () => {
      window.feedPipHandler = undefined;
    };
  }, [togglePiP]);

  // Process reels with duration filtering (for left sidebar)
  useEffect(() => {
    const processReels = async () => {
      const videoPostsForReels = posts.filter(post => post.content.images?.some(url => isVideoFile(url)));
      const suitableReels = [];
      for (const post of videoPostsForReels) {
        const videoUrl = post.content.images?.find(url => isVideoFile(url));
        if (videoUrl) {
          const isSuitable = await isReelsSuitable(videoUrl);
          if (isSuitable) {
            suitableReels.push({
              id: post.id,
              videoUrl: videoUrl,
              thumbnail: videoUrl,
              creator: post.user.name,
              views: `${Math.floor(Math.random() * 10)}K`,
              title: post.content.text || 'Video Reel',
              caption: post.content.text || 'Amazing content! 🎥'
            });
          }
        }
      }
      setReels(suitableReels.slice(0, 6));
    };
    processReels();
  }, [posts]);

  // PiP Progress handlers (same as Watch page)
  const handlePipProgressMouseEnter = () => {
    // Set hovering state if needed
  };
  const handlePipProgressMouseLeave = () => {
    // Handle mouse leave if needed
  };
  const handlePipProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pipProgressRef.current) return;
    const rect = pipProgressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, clickX / rect.width * 100));
    const time = percent / 100 * duration;

    // Update hover state if needed
  };
  const handlePipProgressMouseDown = () => {
    // Handle mouse down if needed
  };
  const handlePipProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pipProgressRef.current || !pipVideoRef.current) return;
    const rect = pipProgressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, clickX / rect.width * 100));
    const time = percent / 100 * duration;
    pipVideoRef.current.currentTime = time;
  };

  // Unified scrolling system - DISABLED to prevent elastic conflicts
  useEffect(() => {
    // Completely disabled to allow elastic scrolling to work properly
    console.log('📝 Unified scroll system disabled for elastic compatibility');
  }, [isMobile, isTablet]);

  // Mobile/Tablet layout
  if (isMobile || isTablet) {
    return <div className="min-h-screen bg-muted w-full">
        {/* Publishing Progress Indicator */}
        <PublishingProgressIndicator isVisible={isPublishing} onComplete={stopPublishing} postContent={publishingData?.content || ''} hasFiles={publishingData?.hasFiles || false} files={publishingData?.files || []} />
        
        <div className="w-full max-w-none mx-auto">
          <FeedContainer>
            <div className="flex justify-center w-full mt-2">
              <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
                <FeedContent showPiP={showPiP} />
              </div>
            </div>

            {/* PiP Window */}
            {showPiP && currentVideoUrl && <PictureInPictureWindow currentVideoUrl={currentVideoUrl} currentPost={currentPost} isPlaying={isPlaying} isMuted={isMuted} currentTime={currentTime} duration={duration} isHoveringPipProgress={isHoveringPipProgress} isDraggingPip={isDraggingPip} pipHoverTime={pipHoverTime} pipProgressHoverX={pipProgressHoverX} pipProgressRef={pipProgressRef} pipVideoRef={pipVideoRef} onTogglePlay={togglePlay} onToggleMute={toggleMute} onTogglePiP={togglePiP} onPipProgressMouseEnter={handlePipProgressMouseEnter} onPipProgressMouseLeave={handlePipProgressMouseLeave} onPipProgressMouseMove={handlePipProgressMouseMove} onPipProgressMouseDown={handlePipProgressMouseDown} onPipProgressClick={handlePipProgressClick} formatTime={formatTime} />}
          </FeedContainer>
        </div>
      </div>;
  }

  // Desktop/Laptop layout with right sidebar scrolling with feed
  return <div ref={mainScrollRef} className="min-h-screen bg-muted w-full overflow-y-auto overflow-x-hidden" style={{
    height: '100vh',
    scrollBehavior: 'auto'
  }}>
      {/* Publishing Progress Indicator */}
      <PublishingProgressIndicator isVisible={isPublishing} onComplete={stopPublishing} postContent={publishingData?.content || ''} hasFiles={publishingData?.hasFiles || false} files={publishingData?.files || []} />
      
      <div className="w-full max-w-none mx-auto">
        <FeedContainer>
          {/* Flex layout with left sidebar fixed, right sidebar scrolling with feed */}
          <div className="flex justify-center w-full max-w-[1450px] mx-auto px-4">
            
            {/* Left Sidebar - Fixed positioning, doesn't scroll with content */}
            <div className="w-64 flex-shrink-0 mr-4">
              <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
                <LeftSidebarContainer showReelsViewer={false} onCloseReelsViewer={() => {}} reels={reels} />
              </div>
            </div>
            
            {/* Main Feed Content - Aligned with sidebars */}
            <div className="w-full max-w-[650px] flex-shrink-0 mr-4">
              <FeedContent showPiP={showPiP} scrollContainerRef={mainScrollRef} />
            </div>
            
            {/* Right Sidebar - Scrolls with the feed content */}
            <div className="w-80 flex-shrink-0">
              <RightSidebar />
            </div>
            
          </div>

          {/* PiP Window */}
          {showPiP && currentVideoUrl && <PictureInPictureWindow currentVideoUrl={currentVideoUrl} currentPost={currentPost} isPlaying={isPlaying} isMuted={isMuted} currentTime={currentTime} duration={duration} isHoveringPipProgress={isHoveringPipProgress} isDraggingPip={isDraggingPip} pipHoverTime={pipHoverTime} pipProgressHoverX={pipProgressHoverX} pipProgressRef={pipProgressRef} pipVideoRef={pipVideoRef} onTogglePlay={togglePlay} onToggleMute={toggleMute} onTogglePiP={togglePiP} onPipProgressMouseEnter={handlePipProgressMouseEnter} onPipProgressMouseLeave={handlePipProgressMouseLeave} onPipProgressMouseMove={handlePipProgressMouseMove} onPipProgressMouseDown={handlePipProgressMouseDown} onPipProgressClick={handlePipProgressClick} formatTime={formatTime} />}
        </FeedContainer>
      </div>
    </div>;
};
export default Feed;