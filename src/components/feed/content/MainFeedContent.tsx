import React, { useState, useCallback } from 'react';
import CreatePostCard from '../CreatePostCard';
import Stories from '../../Stories';
import ProgressivePost from '../../ProgressivePost';
import ScrollController from '../../ScrollController';
import { usePosts } from '@/contexts/PostsContext';
import type { Post as FeedPost } from '@/contexts/PostsContext';
import PostSkeleton from '../../PostSkeleton';
import CreatePostCardSkeleton from '../CreatePostCardSkeleton';
import LiveNowSection from '../../live/LiveNowSection';
import ReelsSection from '../../reels/ReelsSection';
import PeopleYouMayKnowSection from '../../people/PeopleYouMayKnowSection';
import InfiniteScroll from '../InfiniteScroll';
import '../../ui/skeleton-shimmer.css';
import { useLocalization } from '@/hooks/useLocalization';
interface MainFeedContentProps {
  showPiP?: boolean;
  scrollContainerRef?: React.RefObject<HTMLElement>;
}
const MainFeedContent: React.FC<MainFeedContentProps> = ({
  showPiP = false,
  scrollContainerRef
}) => {
  const {
    posts,
    isLoading,
    isLoadingMore,
    hasMorePosts,
    hasLoadedOnce,
    loadMorePosts,
    refreshPosts
  } = usePosts();
  const {
    t
  } = useLocalization({
    enableAutoDetection: false,
    fallbackLanguage: 'sq'
  });
  const [loadedPostIndices, setLoadedPostIndices] = useState<Set<number>>(new Set());
  const [currentLoadingPost, setCurrentLoadingPost] = useState<number | null>(null);
  const [prevPosts, setPrevPosts] = useState<FeedPost[]>([]);
  const handlePostLoadComplete = useCallback((index: number) => {
    setLoadedPostIndices(prev => new Set([...prev, index]));
    setCurrentLoadingPost(null);

    // Facebook-style: allow next post to load immediately after current one completes
    if (index < posts.length - 1) {
      setTimeout(() => {
        setCurrentLoadingPost(index + 1);
      }, 50); // Faster than before for Facebook-like flow
    }
  }, [posts.length]);

  // Start loading first post when posts are available
  React.useEffect(() => {
    if (posts.length > 0 && loadedPostIndices.size === 0 && currentLoadingPost === null) {
      setCurrentLoadingPost(0);
    }
  }, [posts.length, loadedPostIndices.size, currentLoadingPost]);

  // Preserve last successful posts so feed never goes empty visually
  React.useEffect(() => {
    if (posts && posts.length > 0) {
      setPrevPosts(posts);
    }
  }, [posts]);
  console.log('📊 MainFeedContent: Render state', {
    postsCount: posts.length,
    isLoading,
    isLoadingMore,
    hasMorePosts
  });

  // Facebook-style: Load more when user is ~3 posts from bottom
  const handleLoadMore = async () => {
    console.log('📥 MainFeedContent: Loading more posts (Facebook batch: 5-10)...');
    await loadMorePosts();
  };

  // Facebook-style initial skeleton (3-4 posts immediately)
  const FacebookSkeleton = () => <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3" style={{
    minHeight: '500px'
  }}>
      {/* Header - exactly 48px like Facebook */}
      <div className="p-4 pb-3">
        <div className="flex items-center space-x-3" style={{
        height: '48px'
      }}>
          <div className="h-10 w-10 rounded-full facebook-skeleton flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 facebook-skeleton rounded" />
            <div className="h-2 w-20 facebook-skeleton rounded" />
          </div>
        </div>
      </div>
      
      {/* Text content - Facebook style bars */}
      <div className="px-4 pb-3">
        <div className="space-y-2">
          <div className="h-3 w-full facebook-skeleton rounded" />
          <div className="h-3 w-4/5 facebook-skeleton rounded" />
          <div className="h-3 w-3/5 facebook-skeleton rounded" />
        </div>
      </div>
      
      {/* Media area - Facebook standard size */}
      <div className="w-full facebook-skeleton" style={{
      height: '300px'
    }} />
      
      {/* Action buttons - Facebook dimensions */}
      <div className="p-4 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="h-5 w-12 facebook-skeleton rounded" />
            <div className="h-5 w-16 facebook-skeleton rounded" />
            <div className="h-5 w-12 facebook-skeleton rounded" />
          </div>
        </div>
      </div>
    </div>;

  // Show Facebook-style skeleton for initial loading (3-4 posts)
  // Only show skeleton if we've never loaded posts before AND currently loading
  const showSkeleton = isLoading && posts.length === 0 && !hasLoadedOnce;
  if (showSkeleton) {
    return <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-4 px-0 py-4"> {/* Consistent spacing between sections */}
            {/* Stories - load immediately */}
            <Stories />
            <CreatePostCard />
            
            {/* Facebook initial skeleton: 4 posts immediately visible */}
            {[...Array(4)].map((_, i) => <FacebookSkeleton key={`facebook-skeleton-${i}`} />)}
          </div>
        </div>
      </div>;
  }
  return <ScrollController loadedPosts={loadedPostIndices.size} totalPosts={posts.length} isLoadingPost={currentLoadingPost !== null}>
      <InfiniteScroll hasMore={hasMorePosts} isLoading={isLoadingMore} onLoadMore={handleLoadMore} threshold={800} // Facebook loads when ~3 posts from bottom
    scrollContainerRef={scrollContainerRef} loadingComponent={
    // Facebook shows 2-3 skeleton posts while loading more
    <div className="space-y-4">
            {[...Array(2)].map((_, i) => <FacebookSkeleton key={`loading-skeleton-${i}`} />)}
          </div>}>
        <div className="space-y-4 py-0 px-0 mx-px my-[3px]"> {/* Aligned with sidebars */}
          {/* Load top sections immediately */}
          <Stories />
          <CreatePostCard />
          <LiveNowSection />
          
          {/* Facebook-style progressive posts loading */}
          {posts.length > 0 ? posts.map((post, index) => {
          // Facebook loads first 3-4 posts immediately, then progressively
          const shouldLoad = index <= 3 || loadedPostIndices.has(index - 1);

          // Add sections between posts (Facebook inserts content between posts)
          if (index === 2) {
            return <React.Fragment key={`post-section-${post.id}`}>
                    <ProgressivePost post={post} showPiP={showPiP} index={index} shouldLoad={shouldLoad} instantLoad={hasLoadedOnce} onLoadComplete={handlePostLoadComplete} />
                    <ReelsSection />
                  </React.Fragment>;
          }
          if (index === 5) {
            return <React.Fragment key={`post-section-${post.id}`}>
                    <ProgressivePost post={post} showPiP={showPiP} index={index} shouldLoad={shouldLoad} instantLoad={hasLoadedOnce} onLoadComplete={handlePostLoadComplete} />
                    <PeopleYouMayKnowSection />
                  </React.Fragment>;
          }
          return <ProgressivePost key={post.id} post={post} showPiP={showPiP} index={index} shouldLoad={shouldLoad} instantLoad={hasLoadedOnce} onLoadComplete={handlePostLoadComplete} />;
        }) : !isLoading && (prevPosts.length > 0 ? prevPosts.map((post, index) => <ProgressivePost key={`fallback-${post.id}`} post={post} showPiP={showPiP} index={index} shouldLoad={true} instantLoad={hasLoadedOnce} onLoadComplete={handlePostLoadComplete} />) : <>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <div className="text-gray-500 text-lg font-medium mb-2">
                      {t('feed.no_posts', 'No posts yet')}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {t('feed.no_posts_description', 'Be the first to share something!')}
                    </div>
                  </div>
                  <ReelsSection />
                  <PeopleYouMayKnowSection />
                </>)}
        </div>
      </InfiniteScroll>
    </ScrollController>;
};
export default MainFeedContent;