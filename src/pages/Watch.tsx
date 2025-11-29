import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '@/hooks/use-mobile';
import LeftNavigationSidebar from '@/components/sidebar/LeftNavigationSidebar';
import PostActions from '@/components/post/PostActions';
import PostTextContent from '@/components/post/PostTextContent';
import { Separator } from '@/components/ui/separator';
import { usePosts } from '@/contexts/PostsContext';
import Avatar from '@/components/Avatar';
import { useUniversalUser } from '@/hooks/useUniversalUser';
import FeedVideoPlayer from '@/components/watch/FeedVideoPlayer';
import PictureInPictureWindow from '@/components/watch/PictureInPictureWindow';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';
import { processWasabiUrl } from '@/services/media/LegacyMediaService';
import { useComments } from '@/hooks/comments/useComments';
import InlineComments from '@/components/post/InlineComments';
import { isSecureVideoFile } from '@/utils/videoSecurity';
const Watch = () => {
  const navigate = useNavigate();
  const {
    isLaptopOrLarger
  } = useBreakpoint();
  const {
    posts,
    isLoading
  } = usePosts();
  const {
    displayName
  } = useUniversalUser();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Use the custom video player hook for PiP functionality
  const {
    isPlaying,
    isMuted,
    showPiP,
    currentTime,
    duration,
    showControls,
    showMainProgress,
    isHoveringMainProgress,
    isHoveringPipProgress,
    mainProgressHoverX,
    pipProgressHoverX,
    hoverTime,
    pipHoverTime,
    isDraggingMain,
    isDraggingPip,
    mainVideoRef,
    pipVideoRef,
    mainProgressRef,
    pipProgressRef,
    setIsPlaying,
    setIsMuted,
    setShowPiP,
    setCurrentTime,
    setDuration,
    setShowControls,
    setShowMainProgress,
    setIsHoveringMainProgress,
    setIsHoveringPipProgress,
    setMainProgressHoverX,
    setPipProgressHoverX,
    setHoverTime,
    setPipHoverTime,
    setIsDraggingMain,
    setIsDraggingPip,
    formatTime,
    syncVideoTime,
    togglePlay,
    toggleMute,
    togglePiP,
    toggleFullscreen
  } = useVideoPlayer();

  // SECURE SHQIPET PLATFORM VIDEO DETECTION - ONLY APPROVED SOURCES
  const isVideoFile = isSecureVideoFile;

  // Filter posts to show ALL videos - be very inclusive and maintain chronological order
  const videoPosts = posts.filter(post => {
    if (!post.content.images || post.content.images.length === 0) {
      return false;
    }
    const hasVideo = post.content.images.some(url => isVideoFile(url));
    if (hasVideo) {
      console.log('Video post found:', {
        id: post.id,
        images: post.content.images,
        videoUrls: post.content.images.filter(isVideoFile)
      });
    }
    return hasVideo;
  }).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  console.log('Watch Page Debug:', {
    totalPosts: posts.length,
    videoPosts: videoPosts.length,
    isLoading,
    allPostsWithImages: posts.filter(p => p.content.images && p.content.images.length > 0).length,
    videoPostIds: videoPosts.map(p => p.id),
    sampleUrls: posts.slice(0, 3).map(p => ({
      id: p.id,
      images: p.content.images,
      hasImages: !!p.content.images
    }))
  });
  const handleBackClick = () => {
    navigate('/');
  };
  // Comment state - moved to individual VideoPostCard components

  // Get current video URL and post for PiP
  const currentPost = videoPosts[currentVideoIndex];
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  
  // Process current video URL with Wasabi
  useEffect(() => {
    const processCurrentVideoUrl = async () => {
      if (currentPost?.content.images) {
        const rawUrl = currentPost.content.images.find(url => isVideoFile(url));
        if (rawUrl) {
          try {
            const processedUrl = await processWasabiUrl(rawUrl);
            setCurrentVideoUrl(processedUrl);
            console.log('🎬 Watch page - processed current video URL:', { rawUrl, processedUrl });
          } catch (error) {
            console.error('❌ Failed to process current video URL:', error);
            setCurrentVideoUrl(rawUrl); // Fallback
          }
        }
      }
    };
    
    processCurrentVideoUrl();
  }, [currentPost]);

  // PiP Progress handlers
  const handlePipProgressMouseEnter = () => {
    setIsHoveringPipProgress(true);
  };
  const handlePipProgressMouseLeave = () => {
    setIsHoveringPipProgress(false);
    setIsDraggingPip(false);
  };
  const handlePipProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pipProgressRef.current) return;
    const rect = pipProgressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, clickX / rect.width * 100));
    const time = percent / 100 * duration;
    setPipProgressHoverX(clickX);
    setPipHoverTime(time);
  };
  const handlePipProgressMouseDown = () => {
    setIsDraggingPip(true);
  };
  const handlePipProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pipProgressRef.current || !pipVideoRef.current) return;
    const rect = pipProgressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, clickX / rect.width * 100));
    const time = percent / 100 * duration;
    
    // Update PiP video time
    pipVideoRef.current.currentTime = time;
    setCurrentTime(time);
    
    // Sync to main video as well using the hook's sync function
    setTimeout(() => {
      syncVideoTime();
    }, 50);
  };

  // Single video post component for consistency
  const VideoPostCard = ({
    post,
    index
  }: {
    post: any;
    index: number;
  }) => {
    const [videoUrl, setVideoUrl] = useState('');
    const [isProcessing, setIsProcessing] = useState(true);
    
    // Get comments for this post - individual per video
    const { data: comments = [] } = useComments(post.id);
    
    // Individual comment state for each video (same as feed news)
    const [showComments, setShowComments] = useState(false);
    
    const handleComment = () => {
      console.log('💬 Comment button clicked - toggling inline comments');
      
      // Store video state and PAUSE original video when opening comments (exactly like PiP)
      if (!showComments) {
        const videos = document.querySelectorAll(`[data-post-id="${post.id}"] video`) as NodeListOf<HTMLVideoElement>;
        videos.forEach(video => {
          if (video && !video.paused) {
            // Store current video state in sessionStorage (like PiP does)
            sessionStorage.setItem('commentVideoData', JSON.stringify({
              src: video.src,
              currentTime: video.currentTime,
              isPlaying: !video.paused,
              isMuted: video.muted,
              postId: post.id
            }));
            
            // CRITICAL: Pause the video and mark it as controlled to prevent autoplay
            video.pause();
            video.setAttribute('data-comment-controlled', 'true');
            console.log('🛑 Paused original video for comments and stored state at time:', video.currentTime);
          }
        });
      }
      
      if (showComments) {
        // If already open, close it
        setShowComments(false);
      } else {
        // If closed, open it
        setShowComments(true);
      }
    };

    const handleCloseComments = () => {
      // Restore video state to original position (exactly like PiP close)
      const storedData = sessionStorage.getItem('commentVideoData');
      if (storedData) {
        try {
          const videoData = JSON.parse(storedData);
          if (videoData.postId === post.id) {
            const videos = document.querySelectorAll(`[data-post-id="${post.id}"] video`) as NodeListOf<HTMLVideoElement>;
            videos.forEach(video => {
              if (video.src === videoData.src || video.getAttribute('data-comment-controlled')) {
                video.removeAttribute('data-comment-controlled');
                
                // Get the current time from the comment modal video if it exists
                const commentModalVideo = document.querySelector('.comment-modal-video') as HTMLVideoElement;
                const currentTime = commentModalVideo ? commentModalVideo.currentTime : videoData.currentTime;
                
                video.currentTime = currentTime;
                video.muted = videoData.isMuted;
                if (videoData.isPlaying) {
                  video.play().catch(error => {
                    console.log('Video play failed:', error);
                  });
                }
                console.log('🔄 Restored video state from comments at time:', currentTime);
              }
            });
            
            // Clear stored data
            sessionStorage.removeItem('commentVideoData');
          }
        } catch (error) {
          console.error('Error restoring video state:', error);
        }
      }
      
      setShowComments(false);
    };
    
    const rawVideoUrl = post.content.images?.find(url => isVideoFile(url));
    
    // Process video URL with Wasabi
    useEffect(() => {
      const processVideoUrl = async () => {
        if (!rawVideoUrl) {
          setIsProcessing(false);
          return;
        }
        
        try {
          setIsProcessing(true);
          const processedUrl = await processWasabiUrl(rawVideoUrl);
          setVideoUrl(processedUrl);
          console.log('🎬 VideoPostCard - processed video URL:', { rawVideoUrl, processedUrl });
        } catch (error) {
          console.error('❌ Failed to process video URL:', error);
          setVideoUrl(rawVideoUrl); // Fallback
        } finally {
          setIsProcessing(false);
        }
      };
      
      processVideoUrl();
    }, [rawVideoUrl]);
    
    if (!rawVideoUrl || isProcessing) return null;
    
    return <div className="bg-white rounded-lg shadow-sm border border-gray-200" data-post-id={post.id}>
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Avatar userId={post.user?.id || post.user_id || post.author_id} size="md" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-gray-900 hover:underline cursor-pointer">
                  {displayName || "User"}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <span className="hover:underline cursor-pointer">
                  {post.time}
                </span>
                <span>•</span>
                <span className="hover:underline cursor-pointer" title="Public">
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 64 64" 
                    fill="currentColor" 
                    className="inline-block"
                  >
                    <path d="M32,0C15.776,0,2.381,12.077,0.292,27.729c-0.002,0.016-0.004,0.031-0.006,0.047 c-0.056,0.421-0.106,0.843-0.146,1.269c-0.019,0.197-0.029,0.396-0.045,0.594c-0.021,0.28-0.044,0.56-0.058,0.842 C0.014,30.983,0,31.49,0,32c0,17.673,14.327,32,32,32s32-14.327,32-32S49.673,0,32,0z M33.362,58.502 c-0.72,0.787-1.901,1.414-2.675,0.67c-0.653-0.644-0.099-1.44,0-2.353c0.125-1.065-0.362-2.345,0.666-2.676 c0.837-0.259,1.468,0.322,2.009,1.012C34.187,56.175,34.239,57.526,33.362,58.502z M43.446,49.87 c-1.18,0.608-2.006,0.494-3.323,0.673c-2.454,0.309-4.394,1.52-6.333,0c-0.867-0.695-0.978-1.451-1.65-2.341 c-1.084-1.364-1.355-3.879-3.01-3.322c-1.058,0.356-1.026,1.415-1.654,2.335c-0.81,1.156-0.607,2.793-2.005,2.993 c-0.974,0.138-1.499-0.458-2.321-1c-0.922-0.614-1.104-1.348-2.002-1.993c-0.934-0.689-1.69-0.693-2.654-1.334 c-0.694-0.463-0.842-1.304-1.673-1.334c-0.751-0.022-1.289,0.346-1.664,0.996c-0.701,1.214-0.942,4.793-2.988,4.665 c-1.516-0.103-4.758-3.509-5.994-4.327c-0.405-0.273-0.78-0.551-1.158-0.763c-1.829-3.756-2.891-7.952-2.997-12.385 c0.614-0.515,1.239-0.769,1.819-1.493c0.927-1.13,0.481-2.507,1.673-3.335c0.886-0.604,1.602-0.507,2.669-0.658 c1.529-0.222,2.491-0.422,3.988,0c1.459,0.409,2.016,1.246,3.326,1.992c1.415,0.81,2.052,1.766,3.66,2.001 c1.166,0.165,1.966-0.901,2.988-0.337c0.824,0.458,1.406,1.066,1.341,2.001c-0.1,1.218-2.522,0.444-2.659,1.662 c-0.183,1.558,2.512-0.194,3.992,0.33c0.974,0.355,2.241,0.294,2.325,1.334c0.081,1.156-1.608,0.837-2.657,1.335 c-1.162,0.541-1.771,0.996-3.004,1.329c-1.125,0.298-2.312-0.628-2.987,0.329c-0.53,0.742-0.343,1.489,0,2.335 c0.787,1.931,3.349,1.352,5.322,0.657c1.383-0.488,1.641-1.726,2.997-2.329c1.438-0.641,2.554-1.335,3.981-0.663 c1.178,0.556,0.849,2.05,2.006,2.663c1.253,0.668,2.432-0.729,3.663,0c0.957,0.569,0.887,1.521,1.655,2.327 c0.894,0.942,1.41,1.702,2.668,2c1.286,0.299,2.072-1.071,3.327-0.671c0.965,0.315,1.755,0.68,1.987,1.672 C46.465,48.634,44.744,49.198,43.446,49.87z M45.839,33.841c-1.154,1.16-2.156,1.539-3.771,1.893c-1.433,0.315-3.443,1.438-3.772,0 c-0.251-1.148,1.029-1.558,1.893-2.359c0.959-0.895,1.854-0.983,2.826-1.892c0.87-0.802,0.756-2.031,1.893-2.359 c1.109-0.32,2.182-0.019,2.825,0.947C48.652,31.438,47.006,32.681,45.839,33.841z M59.989,29.319 c-0.492,0.508-0.462,1.044-0.965,1.542c-0.557,0.539-1.331,0.307-1.738,0.968c-0.358,0.577-0.13,1.057-0.194,1.735 c-0.041,0.387-1.924,1.256-2.313,0.385c-0.214-0.481,0.281-0.907,0-1.353c-0.263-0.401-0.555-0.195-0.899,0.181 c-0.359,0.388-0.772,0.958-1.221,1.172c-0.589,0.273-0.196-2.25-0.395-3.088c-0.146-0.663,0.01-1.08,0.198-1.736 c0.25-0.91,0.938-1.206,1.155-2.125c0.194-0.806,0.033-1.295,0-2.123c-0.039-0.906-0.015-1.427-0.188-2.314 c-0.192-0.937-0.252-1.525-0.771-2.316c-0.418-0.624-0.694-1.001-1.354-1.352c-0.16-0.088-0.31-0.146-0.452-0.191 c-0.34-0.113-0.659-0.128-1.098-0.193c-0.888-0.132-1.522,0.432-2.314,0c-0.462-0.255-0.606-0.575-0.96-0.967 c-0.404-0.434-0.511-0.789-0.967-1.158c-0.341-0.276-0.552-0.437-0.965-0.581c-0.79-0.263-1.342-0.082-2.126,0.196 c-0.77,0.268-1.058,0.707-1.739,1.155c-0.522,0.303-0.893,0.371-1.348,0.774c-0.276,0.242-1.59,1.177-2.127,1.155 c-0.544-0.021-0.851-0.343-1.338-0.382c-0.065-0.008-0.13-0.008-0.204,0c0,0,0,0-0.005,0c-0.473,0.036-0.696,0.269-1.146,0.382 c-1.107,0.276-1.812-0.115-2.905,0.197c-0.712,0.2-0.993,0.766-1.73,0.771c-0.841,0.005-1.125-0.743-1.932-0.968 c-0.442-0.118-0.702-0.129-1.157-0.19c-0.749-0.108-1.178-0.119-1.926-0.191H24.86c-0.016,0.006-0.591,0.058-0.688,0 c-0.422-0.286-0.722-0.521-1.244-0.773c-0.575-0.283-0.919-0.428-1.547-0.584l0.026-0.381c0,0,0-0.847-0.121-1.207 c-0.115-0.361-0.24-0.361,0-1.086c0.248-0.722,0.679-1.182,0.679-1.182c0.297-0.228,0.516-0.305,0.769-0.58 c0.51-0.539,0.717-0.998,0.774-1.739c0.067-0.972-1.205-1.367-0.97-2.316c0.209-0.826,0.904-0.98,1.547-1.543 c0.779-0.67,1.468-0.758,2.12-1.542c0.501-0.593,0.911-0.965,0.97-1.738c0.053-0.657-0.23-1.068-0.57-1.538 C28.356,2.175,30.157,2,32,2c14.919,0,27.29,10.893,29.605,25.158c-0.203,0.352-0.001,0.796-0.27,1.193 C60.979,28.894,60.436,28.85,59.989,29.319z"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4">
          <PostTextContent text={post.content.text || "Video Post"} />
        </div>

        <div className="relative w-full h-[600px] overflow-hidden rounded-lg">
          <FeedVideoPlayer 
            src={videoUrl} 
            className="w-full h-full" 
            disableScrollPause={showPiP && currentVideoIndex === index}
            showPipOverlay={showPiP && currentVideoIndex === index}
            onPictureInPicture={() => {
              // CRITICAL: Find the actual video element from FeedVideoPlayer and store its state
              const videos = document.querySelectorAll('video');
              let targetVideo = null;
              
              // Find the video element that matches our current URL
              videos.forEach(video => {
                if (video.src === videoUrl && !video.hasAttribute('data-pip-video')) {
                  targetVideo = video;
                }
              });
              
              if (targetVideo) {
                const videoData = {
                  src: videoUrl,
                  currentTime: targetVideo.currentTime,
                  isPlaying: !targetVideo.paused,
                  isMuted: targetVideo.muted
                };
                sessionStorage.setItem('pipVideoData', JSON.stringify(videoData));
                console.log('🎬 WATCH PAGE: Stored video data before opening PiP:', videoData);
                
                // CRITICAL: Connect this video element to mainVideoRef for synchronization
                if (mainVideoRef) {
                  mainVideoRef.current = targetVideo;
                  console.log('🔗 Connected mainVideoRef to actual video element');
                }
              }
              
              setCurrentVideoIndex(index);
              togglePiP();
            }}
          />
        </div>

        <div className="p-4 md:p-6">
          {/* Advertising Window */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium">
                    SPONSORED
                  </div>
                  <span className="text-blue-600 text-sm font-medium">Premium Services</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Professional Construction Solutions
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  From foundation repairs to waterproofing - Get expert construction services with lifetime warranty. Free consultation available.
                </p>
                <div className="flex items-center space-x-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Get Quote
                  </button>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Learn More
                  </button>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        <div className="px-4">
          <Separator />
        </div>

        <div className="py-1 px-2">
          <PostActions 
            postId={post.id} 
            initialLikes={post.reactions.count} 
            commentsCount={comments.length}
            onComment={handleComment} 
          />
        </div>
        
        {/* Comments handled by InlineComments component */}
        <InlineComments
          postId={post.id}
          postData={post}
          isVisible={showComments}
          onClose={handleCloseComments}
          onOpen={() => setShowComments(true)}
        />
      </div>;
  };

  // Don't show anything while loading - prevent the "No Videos Available" flash
  if (isLoading) {
    console.log('Watch page is loading, not rendering content yet');
    return null;
  }

  // Only show "No Videos Available" when loading is complete AND there are no videos
  if (videoPosts.length === 0) {
    return <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Videos Available</h2>
          <p className="text-gray-600 mb-4">Share a video to see it here!</p>
          <p className="text-sm text-gray-500 mb-4">Total posts: {posts.length}</p>
          <button onClick={handleBackClick} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Go Back to Feed
          </button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-100 w-full border-r border-border">
      <div className="w-full max-w-none mx-auto">
        {/* Left Sidebar - Fixed position like in Feed */}
        {isLaptopOrLarger && <div className="w-[280px] h-screen fixed left-0 top-0 z-40">
            <LeftNavigationSidebar />
          </div>}

        <div className="w-full max-w-[1440px] py-[5px] mx-auto px-4">
          <div className="flex justify-center w-full mx-[-110px]">
            <div className="flex flex-row items-start justify-center w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 gap-6 my-[60px]">
              
              {/* Spacer for left sidebar */}
              {isLaptopOrLarger && <div className="w-[280px] flex-shrink-0"></div>}
              
              {/* Main Video Content - Centered */}
              <div className="w-full max-w-[720px] space-y-6">
                {/* All Videos - Each Independent */}
                {videoPosts.map((post, index) => <VideoPostCard key={post.id} post={post} index={index} />)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Picture-in-Picture Window with enhanced UI */}
      {showPiP && currentVideoUrl && (
        <PictureInPictureWindow 
          currentVideoUrl={currentVideoUrl} 
          currentPost={currentPost} 
          isPlaying={isPlaying} 
          isMuted={isMuted} 
          currentTime={currentTime} 
          duration={duration} 
          isHoveringPipProgress={isHoveringPipProgress} 
          isDraggingPip={isDraggingPip} 
          pipHoverTime={pipHoverTime} 
          pipProgressHoverX={pipProgressHoverX} 
          pipProgressRef={pipProgressRef} 
          pipVideoRef={pipVideoRef} 
          onTogglePlay={togglePlay} 
          onToggleMute={toggleMute} 
          onTogglePiP={togglePiP} 
          onPipProgressMouseEnter={handlePipProgressMouseEnter} 
          onPipProgressMouseLeave={handlePipProgressMouseLeave} 
          onPipProgressMouseMove={handlePipProgressMouseMove} 
          onPipProgressMouseDown={handlePipProgressMouseDown} 
          onPipProgressClick={handlePipProgressClick} 
          formatTime={formatTime} 
        />
      )}
    </div>;
};
export default Watch;