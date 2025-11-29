import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useComments } from '@/hooks/comments/useComments';
import { useAuth } from '@/contexts/AuthContext';
import { useUniversalUser } from '@/hooks/useUniversalUser';
import PostCommentInput from './PostCommentInput';
import CommentItem from './CommentItem';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostActions from './PostActions';
import PostTextContent from './PostTextContent';
import CommentPhotoGrid from '@/components/shared/CommentPhotoGrid';
import { MessageCircle, X, Eye, ChevronLeft, ChevronRight, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { isSecureVideoFile } from '@/components/reels/utils/videoUtils';
import { WasabiImageDisplay } from '@/components/fallback/WasabiImageDisplay';
import UniversalPhotoGrid from '@/components/shared/UniversalPhotoGrid';
import { processWasabiUrl, isWasabiKey } from '@/services/media/LegacyMediaService';

interface InlineCommentsProps {
  postId: string;
  isVisible: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  postData: any; // Complete post data for rendering
  feedVideoComponent?: React.ReactNode; // The actual FeedVideoPlayer from the feed
}

const InlineComments: React.FC<InlineCommentsProps> = ({
  postId,
  isVisible,
  onClose,
  onOpen,
  postData,
  feedVideoComponent
}) => {
  // State for media viewer
  const [showIndividualView, setShowIndividualView] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [processedMediaItems, setProcessedMediaItems] = useState<any[]>([]);
  
  const [replyingTo, setReplyingTo] = useState<{ id: string; userName: string } | null>(null);
  const { data: comments = [], isLoading, error } = useComments(postId);
  // Instant comments - no loading state needed
  const { user } = useAuth();
  
  // Video detection for media viewer (same logic as Post.tsx)
  const allImages = postData?.content?.images || [];
  const videoUrlsFromArray = allImages.filter((url: string) => isSecureVideoFile(url));
  const singleImageVideo = postData?.content?.image && isSecureVideoFile(postData?.content?.image) ? postData?.content?.image : undefined;
  
  // Combine all video sources for complete consistency (same as Post.tsx)
  const allVideoUrls = singleImageVideo ? [singleImageVideo, ...videoUrlsFromArray] : videoUrlsFromArray;
  const hasVideo = allVideoUrls.length > 0;

  // Extract and process all media items
  useEffect(() => {
    const processMediaItems = async () => {
      if (!postData?.content) {
        setProcessedMediaItems([]);
        return;
      }
      
      const allImages = postData.content.images || [];
      const singleImage = postData.content.image;
      
      let allMedia: string[] = [];
      
      if (singleImage) {
        allMedia.push(singleImage);
      }
      
      allMedia = [...allMedia, ...allImages];
      
      try {
        // Process URLs for Wasabi keys
        const processed = await Promise.all(
          allMedia.map(async (url: string) => {
            try {
              const processedUrl = isWasabiKey(url) ? await processWasabiUrl(url, 900) : url;
              const isVideo = isSecureVideoFile(url);
              return {
                url: processedUrl,
                originalUrl: url,
                isVideo // Use original URL for detection
              };
            } catch (error) {
              console.error('❌ Failed to process URL:', url, error);
              return {
                url,
                originalUrl: url,
                isVideo: isSecureVideoFile(url)
              };
            }
          })
        );
        
        setProcessedMediaItems(processed);
      } catch (error) {
        console.error('❌ Error processing media items:', error);
        // Fallback to raw URLs
        const fallbackItems = allMedia.map((url: string) => ({
          url,
          originalUrl: url,
          isVideo: isSecureVideoFile(url)
        }));
        setProcessedMediaItems(fallbackItems);
      }
    };
    
    processMediaItems();
  }, [postData?.content]);

  // Handle media click - show the specific clicked item
  const handleMediaClick = useCallback((index: number) => {
    setSelectedMediaIndex(index); // Use the actual clicked index
    setShowIndividualView(true);
  }, []);
  
  // Handle "Shiko të gjitha" (View All) button click
  const handleViewAllClick = useCallback(() => {
    setShowIndividualView(true);
    setSelectedMediaIndex(0); // Always start from first photo
  }, []);
  
  // Handle back to grid view
  const handleBackToGrid = useCallback(() => {
    setShowIndividualView(false);
  }, []);
  
  // Navigation functions
  const goToNext = useCallback(() => {
    setSelectedMediaIndex((prev) => (prev < processedMediaItems.length - 1 ? prev + 1 : 0));
  }, [processedMediaItems.length]);
  
  const goToPrevious = useCallback(() => {
    setSelectedMediaIndex((prev) => (prev > 0 ? prev - 1 : processedMediaItems.length - 1));
  }, [processedMediaItems.length]);

  // Use Universal User Service for consistent data
  const { 
    displayName: userDisplayName, 
    avatarUrl: userAvatarUrl,
    loading: userLoading 
  } = useUniversalUser(postData?.user_id);

  // Handle comment submission - only clear reply state
  const handleCommentSubmit = () => {
    setReplyingTo(null);
  };

  const handleReply = (commentId: string, userName: string) => {
    setReplyingTo({ id: commentId, userName });
  };

  const handleReplySubmit = () => {
    setReplyingTo(null);
  };

  const mediaItems = processedMediaItems;
  const selectedMedia = mediaItems[selectedMediaIndex];

  // Prevent body scroll when comments are open - no loading delays
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-white/95 z-[9999] flex items-center justify-center">
      <div className="w-full max-w-7xl h-full mx-auto p-4 flex">
        <div className="bg-white rounded-lg w-full h-full flex overflow-hidden shadow-2xl border border-gray-200">
            {/* Left side - Media Content with light theme */}
            <div className="w-[55%] bg-gray-50 flex items-center justify-center rounded-lg">
              {showIndividualView ? (
              <div className="relative w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <button
                  onClick={handleBackToGrid}
                  className="absolute top-4 left-4 z-20 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full transition-colors shadow-md"
                >
                  <Grid className="w-5 h-5" />
                </button>
                
                {mediaItems.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevious}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full transition-colors shadow-md"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full transition-colors shadow-md"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                
                {selectedMedia?.isVideo ? (
                  // Create a proper video player for the selected video
                  <video
                    src={selectedMedia.url}
                    controls
                    autoPlay
                    className="w-full h-full object-cover rounded-lg"
                    style={{ backgroundColor: 'white' }}
                    onError={(e) => {
                      console.error('Video playback error:', e);
                    }}
                  />
                ) : (
                  <WasabiImageDisplay
                    url={selectedMedia?.url || ''}
                    alt={`Media ${selectedMediaIndex + 1}`}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                )}
                
                {/* Media Counter */}
                {mediaItems.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-white/90 text-gray-700 text-sm px-3 py-1 rounded-full shadow-md">
                    {selectedMediaIndex + 1} / {mediaItems.length}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full rounded-lg overflow-hidden">
                {/* Grid covers entire page vertically */}
                <div className="relative w-full h-full">
                  <CommentPhotoGrid 
                    media={mediaItems} // Pass the full media objects with isVideo info
                    onMediaClick={handleMediaClick}
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right side - Comments Section with light theme */}
          <div className="w-[45%] flex flex-col bg-white border-l border-gray-200">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
                <span className="text-sm text-gray-500">({comments.length})</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Post info section - Light theme */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <PostHeader
                user={{
                  name: userDisplayName || postData?.user?.name || 'User',
                  image: userAvatarUrl || postData?.user?.image || '',
                  verified: postData?.user?.verified
                }}
                time={postData?.time || ''}
                visibility={postData?.visibility}
                isSponsored={postData?.isSponsored}
                postId={postId}
                userId={postData?.user_id}
                onVisibilityChange={() => {}}
                onPostAction={() => {}}
              />

              {postData?.content?.text && (
                <div className="mt-3">
                  <PostTextContent text={postData.content.text} />
                </div>
              )}

              <div className="mt-3">
              <PostActions
                postId={postId}
                initialLikes={postData?.reactions?.count || 0}
                commentsCount={comments.length}
                sharesCount={postData?.shares || 0}
                hideCommentButton={true}
              />
              </div>
            </div>

            {/* Comments list - light theme */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
              {comments.length === 0 ? (
                // Empty state
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">No comments yet</p>
                  <p className="text-gray-400 text-xs">Be the first to comment!</p>
                </div>
              ) : (
                // Comments list - instant rendering
                comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    postId={postId}
                    onReply={handleReply}
                  />
                ))
              )}
            </div>

            {/* Comment input - sticky at bottom with light theme */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <PostCommentInput
                postId={postId}
                replyingTo={replyingTo}
                onReplySubmit={handleReplySubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InlineComments;