import React, { useState } from 'react';
import '@/components/ui/skeleton-shimmer.css';
import ProfileSidebar from './sidebar/ProfileSidebar';
import PostCreationArea from './content/PostCreationArea';
import SamplePostsFeed from './content/SamplePostsFeed';
import CreatePostCard from '@/components/feed/CreatePostCard';
import { Card } from '@/components/ui/card';
import { CheckCircle, PlusCircle, X, Play, Trash2 } from 'lucide-react';
import ProgressivePost from '@/components/ProgressivePost';
import { useUniversalUser } from '@/hooks/useUniversalUser';
import { useGlobalAvatar } from '@/hooks/useGlobalAvatar';
import { PersonalIntroductionCard } from "./PersonalIntroductionCard";
import { WasabiImageDisplay } from '@/components/fallback/WasabiImageDisplay';
import MobileResponsiveStyles from './MobileResponsiveStyles';
import { processWasabiUrl, isWasabiKey } from '@/services/media/LegacyMediaService';
import { 
  ProfilePhotosGridSkeleton, 
  ProfileVideosGridSkeleton, 
  ProfileTimelineSkeleton,
  ProfileSidebarSkeleton 
} from './skeletons/ProfileSkeleton';
import { useUserPhotos } from '@/hooks/useUserPhotos';
import { useAuth } from '@/contexts/AuthContext';
import PhotoDeleteDialog from './dialogs/PhotoDeleteDialog';
import { toast } from 'sonner';

// Component for handling video URLs that might need presigning
const WasabiVideoPlayer: React.FC<{ url: string; className: string; controls?: boolean; autoPlay?: boolean; onLoaded?: () => void }> = ({ url, className, controls = false, autoPlay = false, onLoaded }) => {
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [hasLoaded, setHasLoaded] = React.useState(false);

  React.useEffect(() => {
    const generateVideoUrl = async () => {
      try {
        const processedUrl = await processWasabiUrl(url, 900);
        setVideoUrl(processedUrl);
      } catch (error) {
        console.error('❌ Failed to generate video URL:', error);
        setVideoUrl(url); // Fallback to original
      } finally {
        setLoading(false);
      }
    };

    generateVideoUrl();
  }, [url]);

  const handleLoadedData = () => {
    setHasLoaded(true);
    // Hide parent skeleton when video loads
    setTimeout(() => {
      const videoElement = document.querySelector(`video[data-video-url="${url}"]`);
      if (videoElement) {
        const container = videoElement.closest('.relative');
        const skeleton = container?.querySelector('.facebook-skeleton');
        if (skeleton) skeleton.remove();
      }
    }, 100);
  };

  if (loading || !videoUrl) {
    return null; // Let parent skeleton show
  }

  return (
    <video
      src={videoUrl}
      className={`${className} ${hasLoaded ? 'opacity-100' : 'opacity-0'}`}
      muted
      playsInline
      preload="metadata"
      controls={controls}
      autoPlay={autoPlay}
      onLoadedData={handleLoadedData}
      data-video-url={url}
    />
  );
};


const VideoGridItem: React.FC<{ url: string; isActive: boolean; onClick: () => void }> = ({ url, isActive, onClick }) => {
  return (
    <div
      className={`aspect-video overflow-hidden rounded-lg hover-scale cursor-pointer relative group ${isActive ? 'ring-4 ring-blue-500' : ''}`}
      onClick={onClick}
    >
      <WasabiVideoPlayer 
        url={url}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Play className="w-12 h-12 text-white" />
      </div>
    </div>
  );
};

interface ProfileContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: any;
  profilePosts: any[];
  friendSuggestions: any[];
  photoItems: any[];
  videoItems: any[];
  isMobile: boolean;
  onCompletionItemClick: (sectionId: string) => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  activeTab,
  userProfile,
  profilePosts,
  friendSuggestions,
  photoItems,
  videoItems,
  isMobile,
  onCompletionItemClick
}) => {
  const { displayName } = useUniversalUser();
  const { avatarUrl: profileImageUrl, isLoading: avatarLoading } = useGlobalAvatar();
  const { user } = useAuth();
  const { deletePhoto } = useUserPhotos(user?.id);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<{ id: string; index: number } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedPhotoIndices, setDeletedPhotoIndices] = useState<Set<number>>(new Set());
  
  // Per-card loading state for grids
  const [loadedPhotoIndices, setLoadedPhotoIndices] = useState<Set<number>>(new Set());
  const [loadedVideoIndices, setLoadedVideoIndices] = useState<Set<number>>(new Set());
  
  // Profile timeline states - same as feed
  const [loadedPostIndices, setLoadedPostIndices] = useState<Set<number>>(new Set());
  const [currentLoadingPost, setCurrentLoadingPost] = useState<number | null>(null);

  // Feed-style post loading handlers
  const handlePostLoadComplete = React.useCallback((index: number) => {
    setLoadedPostIndices(prev => new Set([...prev, index]));
    setCurrentLoadingPost(null);
  }, []);

  // Progressive loading logic - same as feed
  React.useEffect(() => {
    if (profilePosts.length > 0 && loadedPostIndices.size < profilePosts.length && currentLoadingPost === null) {
      const nextUnloadedIndex = Array.from({length: profilePosts.length}, (_, i) => i)
        .find(i => !loadedPostIndices.has(i));
      if (nextUnloadedIndex !== undefined) {
        setCurrentLoadingPost(nextUnloadedIndex);
      }
    }
  }, [profilePosts.length, loadedPostIndices.size, currentLoadingPost]);
  
  // Enhanced completion detection logic
  const completionItems = [
    { 
      id: 'item-1', 
      text: "Shto foton e profilit", 
      completed: !!(profileImageUrl || userProfile.profile_image_url || userProfile.avatar_url), 
      sectionId: 'avatar-and-cover' 
    },
    { 
      id: 'item-2', 
      text: "Shto emrin tënd", 
      completed: !!(userProfile.firstName || userProfile.first_name || userProfile.displayName || userProfile.display_name), 
      sectionId: 'profile' 
    },
    { 
      id: 'item-3', 
      text: "Shto vendin e punës", 
      completed: !!(userProfile.workingAt || userProfile.working_at || userProfile.workplace || userProfile.work_place), 
      sectionId: 'profile' 
    },
    { 
      id: 'item-4', 
      text: "Shto vendin tënd", 
      completed: !!(userProfile.country && userProfile.country !== 'Select Country'), 
      sectionId: 'general' 
    },
    { 
      id: 'item-5', 
      text: "Shto adresën", 
      completed: !!(userProfile.addresses && userProfile.addresses.length > 0), 
      sectionId: 'addresses' 
    }
  ];

  const completedCount = completionItems.filter(item => item.completed).length;
  const completionPercentage = Math.round((completedCount / completionItems.length) * 100);

  // Real online/offline status detection
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [lastSeen, setLastSeen] = React.useState(new Date());

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setLastSeen(new Date());
    };

    // Listen to browser online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Track user activity to determine if they're actively using the page
    let activityTimer: ReturnType<typeof setTimeout>;
    const resetActivityTimer = () => {
      clearTimeout(activityTimer);
      if (navigator.onLine) {
        setIsOnline(true);
      }
      // Set user as inactive after 5 minutes of no activity
      activityTimer = setTimeout(() => {
        if (navigator.onLine) {
          // Still connected but inactive
          setLastSeen(new Date());
        }
      }, 5 * 60 * 1000); // 5 minutes
    };

    // Activity events
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach(event => {
      document.addEventListener(event, resetActivityTimer, { passive: true });
    });

    // Initialize activity timer
    resetActivityTimer();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(activityTimer);
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetActivityTimer);
      });
    };
  }, []);

  // Improved video file detection logic
  const isVideoFile = (url: string) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.m4v', '.3gp', '.ogg', '.ogv', '.flv', '.wmv'];
    const lowerUrl = url.toLowerCase();
    
    // Check for video extensions
    const hasVideoExtension = videoExtensions.some(ext => lowerUrl.endsWith(ext) || lowerUrl.includes(ext + '?'));
    
    // Check for video indicators in URL
    const hasVideoIndicator = lowerUrl.includes('/video/') || lowerUrl.includes('video-');
    
    // Check for specific video MIME types
    const hasMimeType = lowerUrl.includes('video/');
    
    return hasVideoExtension || hasVideoIndicator || hasMimeType;
  };

  // Improved photo file detection logic
  const isPhotoFile = (url: string) => {
    if (!url) return false;
    
    // First check if it's a video file - if so, it's not a photo
    if (isVideoFile(url)) return false;
    
    const photoExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.ico'];
    const lowerUrl = url.toLowerCase();
    
    // Check for photo extensions
    const hasPhotoExtension = photoExtensions.some(ext => lowerUrl.endsWith(ext) || lowerUrl.includes(ext + '?'));
    
    // Check for image indicators in URL
    const hasImageIndicator = lowerUrl.includes('/image/') || lowerUrl.includes('image-');
    
    // Check for specific image MIME types
    const hasMimeType = lowerUrl.includes('image/');
    
    return hasPhotoExtension || hasImageIndicator || hasMimeType;
  };

  // Get post count
  const postCount = profilePosts.length;
  
  // Accurate video count logic
  const videoCount = profilePosts.filter(post => {
    // Check if post type is specifically video
    if (post.post_type === 'video' || post.post_type === 'video_post' || post.post_type === 'reel') return true;
    
    // Check content_images array for video files
    if (post.content_images && Array.isArray(post.content_images)) {
      return post.content_images.some(url => isVideoFile(url));
    }
    
    // Check legacy content.images structure
    if (post.content && post.content.images && Array.isArray(post.content.images)) {
      return post.content.images.some(url => isVideoFile(url));
    }
    
    return false;
  }).length;

  // Fixed photo count logic - count posts that have actual photo files
  const photoCount = profilePosts.filter(post => {
    // For posts with image post type
    if (post.post_type === 'image') return true;
    
    // For media posts, check if they contain photos (but not videos)
    if (post.post_type === 'media') {
      // Check content_images array for photo files (excluding videos)
      if (post.content_images && Array.isArray(post.content_images)) {
        return post.content_images.some(url => isPhotoFile(url));
      }
      
      // Check legacy content.images structure
      if (post.content && post.content.images && Array.isArray(post.content.images)) {
        return post.content.images.some(url => isPhotoFile(url));
      }
    }
    
    // For regular posts, check if they have photo content
    if (post.post_type === 'regular' || !post.post_type) {
      // Check content_images array
      if (post.content_images && Array.isArray(post.content_images)) {
        return post.content_images.some(url => isPhotoFile(url));
      }
      
      // Check legacy content.images structure
      if (post.content && post.content.images && Array.isArray(post.content.images)) {
        return post.content.images.some(url => isPhotoFile(url));
      }
    }
    
    return false;
  }).length;

  console.log('📊 Updated Profile counts debug:', {
    totalPosts: profilePosts.length,
    videoCount,
    photoCount,
    posts: profilePosts.map(post => ({
      id: post.id,
      postType: post.post_type,
      contentImages: post.content_images,
      legacyContentImages: post.content?.images,
      hasVideo: post.post_type === 'video' || post.post_type === 'video_post' || post.post_type === 'reel' || 
        (post.content_images && post.content_images.some(url => isVideoFile(url))) ||
        (post.content?.images && post.content.images.some(url => isVideoFile(url))),
      hasPhoto: post.post_type === 'image' || 
        (post.content_images && post.content_images.some(url => isPhotoFile(url))) ||
        (post.content?.images && post.content.images.some(url => isPhotoFile(url)))
    }))
  });

  const gender = userProfile.gender || 'male';
  const genderTextColor = gender.toLowerCase() === 'female' ? 'text-pink-400' : 'text-blue-400';

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 -mt-6 sm:-mt-12 profile-content" style={{ minWidth: 'auto', flexShrink: 1 }}>
      <MobileResponsiveStyles />
      
      {/* Personal Introduction Section */}
      <div className="mb-4 sm:mb-6">
        <PersonalIntroductionCard isDisplayMode={true} />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 relative profile-content-grid">
        {/* Video Player Modal - Fixed top positioning and improved layout */}
        {selectedVideo && (
          <div className="fixed top-14 left-0 right-0 bottom-0 bg-white z-50 flex">
            {/* Video Player - Left Half */}
            <div className="w-1/2 h-full flex items-center justify-center p-6 bg-black">
              <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-lg shadow-lg shadow-black/30 hover:bg-opacity-75 hover:shadow-xl hover:shadow-black/40 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
                <WasabiVideoPlayer 
                  url={selectedVideo}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                />
              </div>
            </div>
            
            {/* Video Grid - Right Half */}
            <div className="w-1/2 h-full overflow-y-auto p-6 bg-gray-50">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Videos</h2>
                {videoItems.length > 0 ? (
                  (() => {
                    const groups = [];
                    for (let i = 0; i < videoItems.length; i += 3) {
                      groups.push(videoItems.slice(i, i + 3));
                    }
                    return groups.map((groupVideos, groupIndex) => (
                      <div key={groupIndex} className="grid grid-cols-3 gap-4">
                        {groupVideos.map((video, index) => (
                          <VideoGridItem
                            key={`${groupIndex}-${index}`}
                            url={video}
                            isActive={selectedVideo === video}
                            onClick={() => setSelectedVideo(video)}
                          />
                        ))}
                      </div>
                    ));
                  })()
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg">No videos yet</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Photo Viewer Modal - Fixed positioning to show full page */}
        {selectedPhoto && (
          <div className="fixed top-14 left-0 right-0 bottom-0 bg-white z-50 flex">
            {/* Photo Viewer - Left Half */}
            <div className="w-1/2 h-full flex items-center justify-center p-6 bg-black">
              <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-lg shadow-lg shadow-black/30 hover:bg-opacity-75 hover:shadow-xl hover:shadow-black/40 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
                <WasabiImageDisplay
                  url={selectedPhoto}
                  alt="Selected photo"
                  className="w-full h-full object-contain"
                  aspectRatio="w-full h-full"
                />
              </div>
            </div>
            
            {/* Photo Grid - Right Half */}
            <div className="w-1/2 h-full overflow-y-auto p-6 bg-gray-50">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Photos</h2>
                {photoItems.filter(photo => {
                  const photoType = typeof photo === 'object' ? (photo.type || photo.photo_type) : null;
                  return photoType !== 'profile' && photoType !== 'cover';
                }).length > 0 ? (
                  <div className="space-y-6">
                    {(() => {
                      // Filter out profile and cover photos
                      const galleryPhotos = photoItems.filter(photo => {
                        const photoType = typeof photo === 'object' ? (photo.type || photo.photo_type) : null;
                        return photoType !== 'profile' && photoType !== 'cover';
                      });
                      
                      return Array.from({ length: Math.ceil(galleryPhotos.length / 33) }).map((_, groupIndex) => {
                        const startIndex = groupIndex * 33;
                        const groupPhotos = galleryPhotos.map(item => typeof item === 'string' ? item : item.url).slice(startIndex, startIndex + 33);
                      
                      return (
                        <div key={groupIndex} className="space-y-4">
                          {/* 32 photos in 4x8 grid */}
                          {groupPhotos.slice(0, 32).length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                              {groupPhotos.slice(0, 32).map((photo, index) => (
                                <div 
                                  key={`${groupIndex}-small-${index}`} 
                                  className={`aspect-square overflow-hidden rounded-lg bg-gray-100 hover:opacity-90 transition-opacity duration-200 cursor-pointer ${
                                    selectedPhoto === photo ? 'ring-4 ring-blue-500' : ''
                                  }`}
                                  onClick={() => setSelectedPhoto(photo)}
                                >
                                  <WasabiImageDisplay
                                    url={photo} 
                                    alt={`Photo ${startIndex + index + 1}`}
                                    className="w-full h-full object-cover"
                                    aspectRatio="aspect-square"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Big photo (33rd photo) - size equivalent to 8 small cards */}
                          {groupPhotos[32] && (
                            <div 
                              className={`w-full overflow-hidden rounded-lg hover-scale cursor-pointer ${
                                selectedPhoto === groupPhotos[32] ? 'ring-4 ring-blue-500' : ''
                              }`} 
                              style={{ aspectRatio: '2/1' }}
                              onClick={() => setSelectedPhoto(groupPhotos[32])}
                            >
                              <WasabiImageDisplay
                                url={groupPhotos[32]} 
                                alt={`Photo ${startIndex + 33}`}
                                className="w-full h-full object-cover"
                                aspectRatio="2/1"
                              />
                            </div>
                          )}
                        </div>
                      );
                    });
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg">No photos yet</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="w-full order-2 lg:order-1 overflow-hidden" style={{ minWidth: '0', flexShrink: 1, maxWidth: '100%' }}>
          {activeTab === 'timeline' ? (
            <>
              {/* Create Post Section - same as feed */}
              <CreatePostCard />

              {/* Posts list with progressive loading - identical to feed */}
              {profilePosts.length > 0 ? (
                <div className="space-y-4 mt-4 pb-20">
                  {profilePosts.map((post, index) => {
                    // Determine if this post should load - same logic as feed
                    const shouldLoad = loadedPostIndices.has(index) || index === currentLoadingPost || index === 0;
                    
                    return (
                      <ProgressivePost 
                        key={`profile-post-${index}-${post.id}`} 
                        post={post} 
                        showPiP={false}
                        index={index}
                        shouldLoad={shouldLoad}
                        onLoadComplete={handlePostLoadComplete}
                      />
                    );
                  })}
                </div>
              ) : (
                <Card className="p-4 text-center text-muted-foreground bg-white border-gray-100 mt-4">
                  Ende nuk keni krijuar postimin tuaj të parë në Shqipet.
                </Card>
              )}
            </>
          ) : activeTab === 'photos' ? (
            <div className="mt-4">
              {photoItems.filter((photo, idx) => {
                if (deletedPhotoIndices.has(idx)) return false;
                // Filter out profile and cover photos - only show gallery photos
                const photoType = typeof photo === 'object' ? (photo.type || photo.photo_type) : null;
                return photoType !== 'profile' && photoType !== 'cover';
              }).length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {photoItems.map((photo, index) => {
                    const photoUrl = typeof photo === 'string' ? photo : photo.url;
                    const photoId = typeof photo === 'object' ? photo.photoId : null;
                    const photoType = typeof photo === 'object' ? (photo.type || photo.photo_type) : null;
                    
                    // Skip deleted photos and profile/cover photos
                    if (deletedPhotoIndices.has(index)) return null;
                    if (photoType === 'profile' || photoType === 'cover') return null;
                    
                    return (
                      <div 
                        key={index} 
                        className="aspect-square relative overflow-hidden rounded-md group"
                      >
                        {!loadedPhotoIndices.has(index) && (
                          <div className="facebook-skeleton absolute inset-0" />
                        )}
                        <WasabiImageDisplay
                          url={photoUrl}
                          alt={`Photo ${index + 1}`}
                          className="relative z-10 w-full h-full object-cover rounded-md transition-opacity duration-300"
                          aspectRatio="w-full h-full"
                          onClick={() => setSelectedPhoto(photoUrl)}
                          onLoaded={() => setLoadedPhotoIndices(prev => new Set([...prev, index]))}
                        />
                        {photoId && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPhotoToDelete({ id: photoId, index });
                            }}
                            className="absolute top-2 right-2 z-20 p-2 rounded-full bg-red-50/90 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            aria-label="Delete photo"
                          >
                            <svg 
                              width="16" 
                              height="16" 
                              viewBox="0 0 1000 1000" 
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-red-400"
                            >
                              <path 
                                fill="currentColor" 
                                d="M767 336H233q-12 0-21 9t-9 21l38 505q1 13 12 21.5t30 8.5h434q18 0 29-8.5t13-21.5l38-505q0-12-9-21t-21-9zM344 841q-10 0-18-9t-8-21l-26-386q0-12 9-20.5t21-8.5 21 8.5 9 20.5l18 386q0 12-7.5 21t-18.5 9zm182-31q0 13-7.5 22t-18.5 9-18.5-9-7.5-22l-4-385q0-12 9-20.5t21-8.5 21 8.5 9 20.5zm156 1q0 12-8 21t-18 9q-11 0-18.5-9t-7.5-21l18-386q0-12 9-20.5t21-8.5 21 8.5 9 20.5zm101-605l-179-30q-12-2-15-15l-8-33q-4-20-14-26-6-3-22-3h-90q-16 0-23 3-10 6-13 26l-8 33q-2 13-15 15l-179 30q-19 3-31.5 14.5T173 249v28q0 9 6.5 15t15.5 6h610q9 0 15.5-6t6.5-15v-28q0-17-12.5-28.5T783 206z"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-6 sm:p-8 bg-white text-center">
                  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" fill="#000000" className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-400"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill:"#F4F4F4"}} d="M120.108,260.222V57.074c0-14.434,11.701-26.135,26.135-26.135h216.493 c14.434,0,26.135,11.701,26.135,26.135v203.147H120.108z"></path> <path style={{fill:"#C8C6CD"}} d="M388.872,260.222V134.09L285.593,94.115c-15.464-5.985-32.852,1.699-38.838,17.163l-57.65,148.945 L388.872,260.222z"></path> <rect x="157.919" y="68.915" style={{fill:"#F09EA0"}} width="193.178" height="137.925"></rect> <path style={{fill:"#EF8990"}} d="M351.095,206.839v-87.372l-65.502-25.354c-15.464-5.985-32.852,1.699-38.838,17.163l-36.989,95.562 H351.095z"></path> <path style={{fill:"#F4F4F4"}} d="M172.072,359.624l87.515-226.102c5.211-13.461,20.346-20.15,33.807-14.94l201.897,78.147 c13.461,5.211,20.15,20.346,14.94,33.807L432.081,432.44c-5.209,13.458-20.34,20.148-33.8,14.942l-226.001-87.401L172.072,359.624z"></path> <polyline style={{fill:"#F9DE8F"}} points="253.66,253.961 290.771,158.081 470.922,227.809 415.402,371.251 318.241,333.643 "></polyline> <g> <circle style={{fill:"#F7CF6D"}} cx="327.767" cy="225.242" r="22.876"></circle> <circle style={{fill:"#F7CF6D"}} cx="396.73" cy="254.1" r="22.876"></circle> </g> <path style={{fill:"#F9DE8F"}} d="M291.905,481.059H23.939C10.718,481.059,0,470.342,0,457.121V278.043 c0-13.221,10.718-23.939,23.939-23.939h267.968c13.221,0,23.939,10.718,23.939,23.939v179.079 C315.844,470.342,305.126,481.059,291.905,481.059z"></path> <path style={{fill:"#F7CF6D"}} d="M291.905,254.104h-21.219c13.221,0,23.939,10.718,23.939,23.939v179.079 c0,13.221-10.718,23.938-23.939,23.938h21.219c13.221,0,23.939-10.718,23.939-23.938V278.043 C315.844,264.822,305.126,254.104,291.905,254.104z"></path> <path style={{fill:"#F9DE8F"}} d="M203.781,288.888h-91.717c-13.221,0-23.939-10.718-23.939-23.939v-20.191 c0-13.221,10.718-23.939,23.939-23.939h91.717c13.221,0,23.939,10.718,23.939,23.939v20.191 C227.718,278.17,217.001,288.888,203.781,288.888z"></path> <path style={{fill:"#F7CF6D"}} d="M203.781,220.819h-20.63c13.221,0,23.939,10.718,23.939,23.938v20.191 c0,13.221-10.717,23.939-23.939,23.939h20.63c13.221,0,23.939-10.718,23.939-23.939v-20.191 C227.718,231.537,217.001,220.819,203.781,220.819z"></path> <path style={{fill:"#88E2E2"}} d="M65.753,288.888H36.666c-5.438,0-9.846-4.409-9.846-9.846v-28.184c0-5.438,4.409-9.846,9.846-9.846 h29.087c5.438,0,9.846,4.409,9.846,9.846v28.184C75.598,284.479,71.191,288.888,65.753,288.888z"></path> <g> <path style={{fill:"#F09EA0"}} d="M315.844,288.888H0v-10.845c0-13.221,10.718-23.939,23.939-23.939h267.968 c13.221,0,23.939,10.718,23.939,23.939v10.845H315.844z"></path> <path style={{fill:"#F09EA0"}} d="M0,446.276h315.844v10.845c0,13.221-10.718,23.939-23.939,23.939H23.939 C10.718,481.059,0,470.342,0,457.121V446.276z"></path> </g> <g> <path style={{fill:"#EF8990"}} d="M310.378,262.815c-4.39-5.32-11.035-8.712-18.471-8.712h-21.219 c13.221,0,23.939,10.718,23.939,23.939v10.845h21.219v-10.845C315.844,272.258,313.792,266.953,310.378,262.815z"></path> <path style={{fill:"#EF8990"}} d="M294.625,457.121c0,13.221-10.718,23.938-23.939,23.938h21.219c10.742,0,19.832-7.075,22.863-16.82 c0.699-2.249,1.076-4.64,1.076-7.119v-10.845h-21.219V457.121z"></path> </g> <circle style={{fill:"#F4F4F4"}} cx="157.919" cy="358.24" r="82.323"></circle> <circle style={{fill:"#59D3C4"}} cx="157.919" cy="358.24" r="61.3"></circle> <circle style={{fill:"#88E2E2"}} cx="157.919" cy="358.24" r="40.116"></circle> <circle style={{fill:"#F4F4F4"}} cx="267.163" cy="289.678" r="15.718"></circle> </g></svg>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    Nuk ka foto të disponueshme
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Posto foto për t'i parë këtu
                  </p>
                </Card>
              )}
            </div>
          ) : activeTab === 'videos' ? (
            <div className="mt-4">
              {videoItems.length > 0 ? (
                <div className="space-y-4">
                  {Array.from({ length: Math.ceil(videoItems.length / 3) }).map((_, groupIndex) => {
                    const startIndex = groupIndex * 3;
                    const groupVideos = videoItems.slice(startIndex, startIndex + 3);
                    
                    return (
                      <div key={groupIndex} className="grid grid-cols-3 gap-4">
                        {groupVideos.map((video, index) => (
                          <div 
                            key={`${groupIndex}-${index}`} 
                            className="aspect-video overflow-hidden rounded-lg hover-scale cursor-pointer relative group"
                            onClick={() => setSelectedVideo(video)}
                          >
                            {!loadedVideoIndices.has(startIndex + index) && (
                              <div className="facebook-skeleton absolute inset-0" />
                            )}
                            <WasabiVideoPlayer
                              url={video} 
                              className="relative z-10 w-full h-full object-cover transition-opacity duration-300"
                              onLoaded={() => setLoadedVideoIndices(prev => new Set([...prev, startIndex + index]))}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                              <Play className="w-12 h-12 text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-6 sm:p-8 bg-white text-center">
                  <svg height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512.001 512.001" xmlSpace="preserve" fill="#000000" className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-400"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path style={{fill:"#FCD051"}} d="M186.508,126.728l62.513-13.707l62.516-13.704l62.513-13.707l62.511-13.704l31.269-6.856 l-4.59-20.928c-5.015-22.873-27.831-37.482-50.706-32.467L58.107,89.361c-22.877,5.015-37.489,27.831-32.474,50.702l4.59,20.928 l31.257-6.854l62.512-13.707L186.508,126.728z"></path> <g> <polygon style={{fill:"#ED8C18"}} points="61.48,154.139 30.224,160.992 39.359,202.67 476.965,106.728 467.828,65.051 "></polygon> <polygon style={{fill:"#ED8C18"}} points="114.027,202.67 39.359,202.67 39.359,245.336 487.359,245.336 487.359,202.67 "></polygon> </g> <path style={{fill:"#FCD051"}} d="M391.35,245.336h-63.996h-63.998h-64h-63.996H71.357H39.359V458.76 c0,23.416,19.158,42.574,42.576,42.574h362.848c23.416,0,42.576-19.158,42.576-42.574V288.003v-42.667H455.35H391.35 L391.35,245.336z M224.426,335.14c0-8.768,7.107-15.876,15.874-15.876c3.286,0,6.338,0.999,8.869,2.708l32.16,18.568l0.815,0.506 l32.217,18.6c7.57,4.351,10.18,14.015,5.832,21.581c-1.488,2.585-3.592,4.592-6.024,5.94l-32.855,18.972l0.015,0.026 l-33.091,19.105c-7.57,4.383-17.26,1.802-21.645-5.768c-1.448-2.505-2.136-5.239-2.133-7.939h-0.033v-38.211L224.426,335.14 L224.426,335.14z"></path> <path style={{fill:"#D12D4E"}} d="M281.329,340.54l-32.16-18.568c-2.531-1.71-5.583-2.708-8.869-2.708 c-8.768,0-15.874,7.11-15.874,15.876v38.212v38.211h0.033c-0.002,2.7,0.686,5.434,2.133,7.939 c4.385,7.57,14.076,10.152,21.645,5.768l33.091-19.105l-0.015-0.026l32.855-18.972c2.431-1.347,4.536-3.355,6.024-5.94 c4.348-7.567,1.738-17.23-5.832-21.581l-32.217-18.6L281.329,340.54z"></path> </g> <g> <path style={{fill:"#000003"}} d="M487.359,192.002H370.026c-0.004,0-0.009,0-0.011,0H178.03c-0.004,0-0.009,0-0.011,0h-40.191 l341.419-74.853c2.763-0.606,5.174-2.285,6.698-4.668c1.528-2.382,2.044-5.273,1.438-8.037l-9.132-41.65 c-0.002-0.009-0.002-0.018-0.004-0.027c-0.002-0.009-0.006-0.018-0.009-0.027l-4.582-20.902C468.343,17.596,446.451,0,421.604,0 c-3.803,0-7.622,0.415-11.355,1.233L55.821,78.941c-28.675,6.287-46.893,34.732-40.607,63.407l13.478,61.478V458.76 c0,29.357,23.885,53.241,53.243,53.241h362.848c29.359,0,53.243-23.884,53.243-53.241V202.67 C498.026,196.778,493.249,192.002,487.359,192.002z M417.104,234.669l21.333-21.332h33.828l-21.333,21.332H417.104z M353.107,234.669l21.331-21.332h33.825l-21.333,21.332H353.107z M289.109,234.669l21.333-21.332h33.823l-21.331,21.332H289.109z M225.108,234.669l21.333-21.332h33.828l-21.333,21.332H225.108z M161.112,234.669l21.331-21.332h33.825l-21.333,21.332H161.112z M97.114,234.669l21.333-21.332h33.823l-21.331,21.332H97.114z M50.027,234.669v-21.332h38.247l-21.333,21.332H50.027z M59.448,165.505l25.406,16.268l-37.358,8.19l-4.569-20.837L59.448,165.505z M121.964,151.8l25.403,16.269l-33.042,7.243 l-25.403-16.268L121.964,151.8z M246.989,124.389l25.406,16.269l-33.045,7.244l-25.403-16.268L246.989,124.389z M372.017,96.978 l25.406,16.268l-33.042,7.244l-25.406-16.268L372.017,96.978z M434.528,83.273l25.408,16.268l-33.04,7.244L401.49,90.516 L434.528,83.273z M309.503,110.683l25.406,16.268l-33.042,7.244l-25.405-16.269L309.503,110.683z M184.476,138.095l25.403,16.268 l-33.04,7.244l-25.406-16.269L184.476,138.095z M60.39,99.781l354.428-77.708c2.234-0.49,4.517-0.738,6.786-0.738 c14.901,0,28.029,10.544,31.213,25.072l2.304,10.51l-20.843,4.57c-0.002,0-0.004,0.001-0.006,0.002l-62.503,13.702 c-0.004,0.001-0.009,0.002-0.013,0.003l-125.006,27.406c-0.009,0.002-0.019,0.004-0.027,0.006l-124.986,27.403 c-0.019,0.004-0.037,0.009-0.057,0.013l-62.479,13.698c-0.002,0.001-0.004,0.001-0.009,0.002l-20.835,4.568l-2.304-10.508 C32.288,120.594,43.206,103.549,60.39,99.781z M444.783,490.665H81.935c-13.853,0-25.667-8.876-30.067-21.238l42.604,0.003l0,0 c5.892,0,10.667-4.776,10.667-10.667c0-5.891-4.776-10.667-10.665-10.667l-44.447-0.003V256.004h426.665v21.332h-68.657 c-5.892,0-10.667,4.776-10.667,10.667s4.776,10.667,10.667,10.667h68.657v160.088C476.691,476.353,462.376,490.665,444.783,490.665 z"></path> <path style={{fill:"#000003"}} d="M319.694,350.407l-31.967-18.455c-0.356-0.23-0.717-0.45-1.065-0.651l-31.878-18.404 c-4.313-2.816-9.312-4.302-14.486-4.302c-14.639,0-26.546,11.908-26.546,26.544v76.423c0,0.382,0.021,0.76,0.061,1.132 c0.183,4.262,1.401,8.44,3.546,12.151c4.724,8.158,13.518,13.227,22.954,13.227c4.646,0,9.234-1.235,13.257-3.564l33.091-19.105 c0.242-0.14,0.475-0.287,0.702-0.443l32.071-18.515c4.162-2.331,7.62-5.754,10.001-9.9c3.526-6.131,4.45-13.267,2.606-20.095 C330.2,359.622,325.808,353.921,319.694,350.407z M310.94,375.915c-0.473,0.824-1.128,1.471-1.944,1.924 c-0.052,0.029-0.107,0.059-0.158,0.089l-32.857,18.969c-0.242,0.14-0.477,0.288-0.704,0.443l-32.385,18.699 c-0.802,0.464-1.668,0.699-2.577,0.699c-1.875,0-3.552-0.964-4.488-2.578c-0.465-0.805-0.702-1.679-0.702-2.596 c0-0.293-0.013-0.585-0.035-0.873v-75.55c0-2.872,2.337-5.209,5.211-5.209c1.316,0,2.302,0.478,2.896,0.879 c0.208,0.141,0.421,0.274,0.64,0.399l32.194,18.587c0.079,0.045,0.151,0.095,0.227,0.144c0.181,0.119,0.367,0.234,0.555,0.342 l32.234,18.61c1.607,0.924,2.196,2.35,2.402,3.118C311.654,372.78,311.862,374.307,310.94,375.915z"></path> <path style={{fill:"#000003"}} d="M377.39,277.34h-0.254c-5.892,0-10.667,4.776-10.667,10.667c0,5.892,4.776,10.667,10.667,10.667 h0.254c5.889,0,10.667-4.776,10.667-10.667C388.058,282.115,383.281,277.34,377.39,277.34z"></path> <path style={{fill:"#000003"}} d="M125.37,448.101h-0.252c-5.892,0-10.667,4.776-10.667,10.667c0,5.892,4.776,10.667,10.667,10.667 h0.252c5.892,0,10.667-4.776,10.667-10.667C136.037,452.877,131.263,448.101,125.37,448.101z"></path> </g> </g></svg>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    Nuk ka video të disponueshme
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Posto video për t'i parë këtu
                  </p>
                </Card>
              )}
            </div>
          ) : (
            <Card className="p-6 sm:p-8 bg-white text-center mt-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Përmbajtja do të shtohet së shpejti
              </h3>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0 order-1 lg:order-2">
          {/* Info Card */}
          <Card className="p-3 sm:p-4 mb-4 bg-white">
            <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Informacione</h3>
            <div className="border-b border-gray-200 mb-2 sm:mb-3"></div>
            
            <div className="flex items-center text-xs sm:text-sm mb-2">
              <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
              {!isOnline && (
                <span className="text-gray-400 ml-2">
                  (Para {Math.floor((new Date().getTime() - lastSeen.getTime()) / 60000)} minutash)
                </span>
              )}
            </div>
            
            <div className="text-xs sm:text-sm text-gray-600 mb-1">
              {postCount} {postCount === 1 ? 'postim' : 'postime'}
            </div>
            
            <div className="text-xs sm:text-sm text-gray-600 mb-1">
              {videoCount} {videoCount === 1 ? 'video' : 'video'}
            </div>

            <div className="text-xs sm:text-sm text-gray-600 mb-1">
              {photoCount} {photoCount === 1 ? 'foto' : 'foto'}
            </div>
            
          </Card>

          <Card className="p-3 sm:p-4 mb-4 bg-white">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Albumet (0)</h3>
            </div>
            <div className="text-center py-6 sm:py-8 text-gray-500 text-xs sm:text-sm">
              Nuk ka albume për të treguar
            </div>
          </Card>

          <Card className="p-3 sm:p-4 mb-4 bg-white">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Duke ndjekur (1)</h3>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full mr-2 sm:mr-3"></div>
              <div>
                <div className="font-medium text-gray-900 text-sm sm:text-base">Deen Doughouz</div>
              </div>
            </div>
          </Card>

          <Card className="p-3 sm:p-4 mb-4 bg-white">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Ndjekësit (0)</h3>
            </div>
            <div className="text-center py-6 sm:py-8 text-gray-500 text-xs sm:text-sm">
              Nuk ka ndjekës për të treguar
            </div>
          </Card>

          <Card className="p-3 sm:p-4 bg-white">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Pëlqimet (0)</h3>
            </div>
            <div className="text-center py-6 sm:py-8 text-gray-500 text-xs sm:text-sm">
              Nuk ka pëlqime për të treguar
            </div>
          </Card>
        </div>
      </div>
      
      <PhotoDeleteDialog
        isOpen={!!photoToDelete}
        onOpenChange={(open) => !open && setPhotoToDelete(null)}
        onConfirm={async () => {
          if (!photoToDelete) return;
          setIsDeleting(true);
          try {
            await deletePhoto(photoToDelete.id);
            // Immediately remove from UI
            setDeletedPhotoIndices(prev => new Set([...prev, photoToDelete.index]));
            toast.success('Fotoja u fshi me sukses');
            setPhotoToDelete(null);
          } catch (error) {
            console.error('Error deleting photo:', error);
            toast.error('Dështoi fshirja e fotos');
          } finally {
            setIsDeleting(false);
          }
        }}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ProfileContent;
