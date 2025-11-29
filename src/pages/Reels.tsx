import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useBreakpoint } from '@/hooks/use-mobile';
import ReelsViewer from '@/components/reels/ReelsViewer';
import { useInfiniteVideos } from '@/hooks/useInfiniteVideos';
import { VirtualizedVideoGrid } from '@/components/reels/VirtualizedVideoGrid';
import { InfiniteScrollSentinel } from '@/components/reels/InfiniteScrollSentinel';
import '@/components/ui/skeleton-shimmer.css';

const Reels = () => {
  const { isLaptopOrLarger } = useBreakpoint();
  const location = useLocation();
  const [showReelsViewer, setShowReelsViewer] = useState(false);
  const [initialReelIndex, setInitialReelIndex] = useState(0);
  const [initialOpenReelId, setInitialOpenReelId] = useState<string | null>(null);
  
  // Use the new infinite videos hook
  const { videos, loading, error, hasMore, loadMore, retry } = useInfiniteVideos();

  // Number formatter for views (Albanian format)
  const formatViews = (n: number): string => {
    if (n < 1000) return `${n}`;
    if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}K`;
    return `${(n / 1_000_000).toFixed(n < 10_000_000 ? 1 : 0)}M`;
  };

  // Check if we have navigation state (from ReelsSection click)
  const navigationState = location.state as { initialIndex?: number; reels?: any[] } | null;

  // If navigated from a reel click, remember which reel id to open
  useEffect(() => {
    if (navigationState?.reels && navigationState.initialIndex !== undefined) {
      const clicked = navigationState.reels[navigationState.initialIndex];
      if (clicked?.id) setInitialOpenReelId(clicked.id);
    }
  }, [navigationState]);

  // Open the viewer when we have videos and a target reel ID
  useEffect(() => {
    if (initialOpenReelId && videos.length > 0) {
      const idx = videos.findIndex((v: any) => v.id === initialOpenReelId);
      if (idx >= 0) {
        setInitialReelIndex(idx);
        setShowReelsViewer(true);
        setInitialOpenReelId(null);
      }
    }
  }, [initialOpenReelId, videos]);

  const handleOpenViewer = (index: number) => {
    setInitialReelIndex(index);
    setShowReelsViewer(true);
  };

  const handleCloseViewer = () => {
    setShowReelsViewer(false);
  };

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadMore();
    }
  }, [loading, hasMore, loadMore]);

  return (
    <div className="min-h-screen bg-gray-100 w-full relative border-r border-border">
      <div className="fixed top-4 left-4 z-50">
        <span className="px-3 py-1 rounded-full bg-white/80 border border-gray-200 text-gray-800 text-sm shadow-sm backdrop-blur">
          {videos.length || 0} video
        </span>
      </div>
      
      {/* Interesante text in top right corner */}
      <div className="fixed top-4 right-4 z-50">
        <h1 className="text-3xl font-bold font-cinzel">
          <span className="logo-text">
            {Array.from('Interesante').map((char, i) => (
              <span 
                key={i} 
                className="inline-block hover:text-rose-500 transition-colors"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {char}
              </span>
            ))}
          </span>
        </h1>
      </div>

      <div className="w-full max-w-none mx-auto">
        <div className="w-full py-[5px] mx-auto px-4">
          <div className="flex justify-center w-full">
            <div className="flex flex-row items-start justify-center w-full mx-auto px-4 sm:px-6 lg:px-8 gap-6 my-[60px]">
              
              {/* Main Reels Content - Full Width */}
              <div className="w-full space-y-6">
                {error ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className="text-center">
                      <div className="text-red-500 text-lg font-medium mb-4">{error}</div>
                      <button
                        onClick={retry}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Provo Përsëri
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">Zbulo Video të Shkurtra Interesante</h2>
                      <p className="text-gray-600 text-lg">Të gjitha videot e shkurtra nga 5 sekonda deri në 2 minuta • Vetëm Video, Pa Foto</p>
                      <p className="text-sm text-gray-500 mt-1">Duke treguar {videos.length || 0} video të shkurtra</p>
                    </div>
                    
                    {/* Virtualized Video Grid or initial skeletons */}
                    {videos.length === 0 ? (
                      <div className="w-full grid [grid-template-columns:repeat(auto-fit,minmax(15rem,1fr))] gap-4">
                     {Array.from({ length: 24 }).map((_, i) => (
                           <div key={i}>
                             <div className="relative rounded-2xl overflow-hidden shadow-lg">
                               <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden facebook-skeleton" />
                               <div className="p-3">
                                 <div className="h-4 w-2/3 rounded-md facebook-skeleton" />
                                 <div className="mt-2 h-4 w-1/3 rounded-md facebook-skeleton" />
                               </div>
                             </div>
                           </div>
                         ))}
                      </div>
                    ) : (
                      <>
                        <VirtualizedVideoGrid
                          videos={videos}
                          onVideoOpen={handleOpenViewer}
                          formatViews={formatViews}
                        />

                        {/* Infinite Scroll Sentinel - Hidden */}
                        <InfiniteScrollSentinel
                          onIntersect={handleLoadMore}
                          loading={loading}
                          hasMore={hasMore}
                        />
                      </>
                    )}

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reels Viewer */}
      {showReelsViewer && videos.length > 0 && (
        <ReelsViewer 
          reels={videos} 
          initialIndex={initialReelIndex} 
          onClose={handleCloseViewer} 
        />
      )}
    </div>
  );
};

export default Reels;