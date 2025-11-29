
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { usePosts } from "@/contexts/PostsContext";
import ReelItem from "./ReelItem";
import ReelsEmptyState from "./ReelsEmptyState";
import ReelsViewer from "./ReelsViewer";
import { isSecureVideoFile } from "@/utils/videoSecurity";
import { processWasabiUrl } from "@/services/media/LegacyMediaService";

const MAX_REELS = 6;

const ReelsSection = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isTouching, setIsTouching] = useState(false);
  const [reels, setReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReelsViewer, setShowReelsViewer] = useState(false);
  const [initialReelIndex, setInitialReelIndex] = useState(0);
  const { posts } = usePosts();

  // Enhanced reels processing with better error handling and logging
  useEffect(() => {
    const processReels = async () => {
      setLoading(true);
      try {
        console.log('🎬 ReelsSection - Processing posts:', posts.length);
        
        if (posts.length === 0) {
          console.log('📭 ReelsSection - No posts available');
          setReels([]);
          return;
        }

        // Log first few posts for debugging
        posts.slice(0, 3).forEach((post, index) => {
          console.log(`📝 Post ${index}:`, {
            id: post.id.slice(0, 8),
            images: post.content.images?.length || 0,
            hasImages: !!post.content.images?.length,
            firstImage: post.content.images?.[0]?.slice(0, 50) || 'none'
          });
        });

        // Filter for posts with videos (but no photos)
        const videoPosts = posts.filter(post => {
          const images = post.content.images || [];
          const single = (post.content as any).image ? [(post.content as any).image] : [];
          const sources = [...images, ...single].filter(url => url && url.trim() !== '');
          
          if (sources.length === 0) return false;
          
          // Check each source
          const videoSources = sources.filter(url => isSecureVideoFile(url));
          const photoSources = sources.filter(url => !isSecureVideoFile(url));
          
          const hasVideo = videoSources.length > 0;
          const hasPhoto = photoSources.length > 0;
          
          console.log(`🔍 Post ${post.id.slice(0, 8)} - Videos: ${videoSources.length}, Photos: ${photoSources.length}`);
          
          // Return posts that have at least one video (can also have photos)
          return hasVideo;
        });

        console.log(`🎥 ReelsSection - Found ${videoPosts.length} video-only posts`);
        
        if (videoPosts.length === 0) {
          console.log('📭 ReelsSection - No video-only posts found');
          setReels([]);
          return;
        }

        // Sort by creation date (newest first)
        const sortedPosts = [...videoPosts].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        // Prepare candidates for URL resolution
        const candidates = sortedPosts
          .map(post => {
            const images = post.content.images || [];
            const single = (post.content as any).image ? [(post.content as any).image] : [];
            const sources = [...images, ...single].filter(url => url && url.trim() !== '');
            
            // Get the first video URL
            const rawUrl = sources.find(url => isSecureVideoFile(url));
            
            if (!rawUrl) {
              console.warn(`⚠️ Post ${post.id.slice(0, 8)} - No video URL found despite filtering`);
              return null;
            }
            
            console.log(`✅ Post ${post.id.slice(0, 8)} - Using video: ${rawUrl.slice(0, 50)}...`);
            return { post, rawUrl, thumbRaw: rawUrl };
          })
          .filter(Boolean);

        console.log(`🔗 ReelsSection - Processing ${candidates.length} video URLs`);

        // Resolve URLs with better error handling
        const resolvedResults = await Promise.allSettled(
          candidates.map(async ({ post, rawUrl, thumbRaw }) => {
            console.log(`🔄 Processing video for post ${post.id.slice(0, 8)}...`);
            try {
              // Fallback to raw key if resolution fails (ensures something loads)
              const url = await processWasabiUrl(rawUrl).catch(() => rawUrl);
              const thumb = thumbRaw
                ? await processWasabiUrl(thumbRaw).catch(() => url)
                : url;
              console.log(`✅ Resolved URLs for post ${post.id.slice(0, 8)}`);
              return { post, url, thumb };
            } catch (error) {
              console.warn(`⚠️ Falling back to raw URL for post ${post.id.slice(0, 8)} due to error:`, error);
              return { post, url: rawUrl, thumb: thumbRaw || rawUrl };
            }
          })
        );

        // Process resolved results
        const successfulReels = resolvedResults
          .filter((result): result is PromiseFulfilledResult<{ post: any; url: string; thumb: string }> => {
            if (result.status === 'fulfilled') {
              return true;
            } else {
              console.warn('❌ URL resolution failed:', result.reason);
              return false;
            }
          })
          .map(result => ({
            id: result.value.post.id,
            videoUrl: result.value.url,
            thumbnail: result.value.thumb,
            creator: result.value.post.user.name,
            creatorId: result.value.post.user_id,
            views: `${Math.floor(Math.random() * 10 + 1)}K`,
            title: result.value.post.content.text || 'Video Reel',
            caption: result.value.post.content.text || ''
          }));

        console.log(`🎬 ReelsSection - Successfully processed ${successfulReels.length} reels`);

        // Ensure we have the right number of reels
        const finalReels = successfulReels.slice(0, MAX_REELS);
        
        // If we have fewer reels than MAX_REELS, duplicate some to fill the space
        if (finalReels.length > 0 && finalReels.length < MAX_REELS) {
          const filledReels = [...finalReels];
          let duplicateIndex = 0;
          
          while (filledReels.length < MAX_REELS) {
            const originalReel = successfulReels[duplicateIndex % successfulReels.length];
            filledReels.push({
              ...originalReel,
              id: `${originalReel.id}-dup-${filledReels.length}`
            });
            duplicateIndex++;
          }
          
          setReels(filledReels);
          console.log(`🔄 ReelsSection - Filled to ${filledReels.length} reels with duplicates`);
        } else {
          setReels(finalReels);
          console.log(`✅ ReelsSection - Set ${finalReels.length} reels`);
        }

      } catch (error) {
        console.error('❌ ReelsSection - Critical error processing reels:', error);
        setReels([]);
      } finally {
        setLoading(false);
      }
    };

    processReels();
  }, [posts]);

  const scrollReels = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleReelClick = (index: number) => {
    // Stop all videos in the current page
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach(video => {
      (video as HTMLVideoElement).pause();
      (video as HTMLVideoElement).currentTime = 0;
    });

    const clicked = reels[index];
    if (!clicked || !clicked.videoUrl) return;

    const realReels = reels.filter(r => !!r.videoUrl);
    const realIndex = realReels.findIndex(r => r.id === clicked.id);

    // Open ReelsViewer directly instead of navigating
    setInitialReelIndex(realIndex >= 0 ? realIndex : 0);
    setShowReelsViewer(true);
  };

  const handleCloseViewer = () => {
    setShowReelsViewer(false);
  };

  return (
    <>
      {/* Heading above reels section */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 px-4">Video Interesante</h2>
      </div>
      
      <div className="rounded-lg shadow overflow-hidden mb-4">
        
        {reels.length > 0 ? (
          <div className="relative" data-horizontal-scroll="true">
            <div 
              data-horizontal-scroll="true" 
              className="flex overflow-x-auto hide-scrollbar px-4 pb-3 pt-1 h-[528px]" 
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                overscrollBehaviorX: 'contain'
              }} 
              ref={scrollContainerRef}
              onTouchStart={() => setIsTouching(true)} 
              onTouchEnd={() => setIsTouching(false)}
            >
              {reels.map((reel, index) => (
                <ReelItem
                  key={reel.id}
                  reel={reel}
                  index={index}
                  onClick={() => handleReelClick(index)}
                />
              ))}
            </div>
          </div>
        ) : (
          <ReelsEmptyState />
        )}
      </div>

      {/* Reels Viewer Modal */}
      {showReelsViewer && reels.length > 0 && (
        <ReelsViewer 
          reels={reels.filter(r => !!r.videoUrl)} 
          initialIndex={initialReelIndex} 
          onClose={handleCloseViewer} 
        />
      )}
    </>
  );
};

export default ReelsSection;
