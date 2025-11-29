
import React, { useState, useEffect } from "react";
import { usePostsData } from '@/contexts/posts/usePostsData';
import { useAuth } from '@/contexts/AuthContext';
import { useUniversalUser } from '@/hooks/useUniversalUser';
import { useComments } from '@/hooks/comments/useComments';
import { toast } from 'sonner';
import PostHeader from "./post/PostHeader";
import PostContent from "./post/PostContent";
import PostActions from "./post/PostActions";
import PostCommentInput from "./post/PostCommentInput";
import PostTextContent from "./post/PostTextContent";
import CommentItem from "./post/CommentItem";
import SharedPostCard from "./post/SharedPostCard";
import InlineComments from "./post/InlineComments";
import { Separator } from "@/components/ui/separator";
import Avatar from '@/components/Avatar';
import FeedVideoPlayer from '@/components/watch/FeedVideoPlayer';
// Database integration removed - placeholder for future Cloud integration
import { isSecureVideoFile } from '@/utils/videoSecurity';
import { processWasabiUrl } from '@/services/media/LegacyMediaService';
import "./reactions.css";

interface PostProps {
  post: {
    id: string;
    user_id?: string;
    user: {
      name: string;
      image: string;
      verified?: boolean;
    };
    time: string;
    isSponsored?: boolean;
    visibility?: string;
    is_anonymous?: boolean;
    content: {
      text?: string;
      image?: string;
      images?: string[];
      secondaryImage?: string;
    };
    sponsoredInfo?: {
      url: string;
      title: string;
      description: string;
      cta: string;
    };
    reactions: {
      count: number;
      types: string[];
    };
    comments: number;
    shares: number;
    post_type?: string;
  };
  showPiP?: boolean;
}

const Post: React.FC<PostProps> = ({
  post,
  showPiP = false
}) => {
  const { deletePost } = usePostsData();
  const { user: currentUser } = useAuth();
  
  // Use Universal User Service for consistent data
  const { 
    displayName: userDisplayName, 
    avatarUrl: userAvatarUrl,
    loading: userLoading 
  } = useUniversalUser(post.user_id);
  
  const [showComments, setShowComments] = useState(false);
  const [showInlineInput, setShowInlineInput] = useState(false);
  const [originalPost, setOriginalPost] = useState<any>(null);
  
  // Don't fetch comments initially - load on demand
  const [comments, setComments] = useState<any[]>([]);
  
  // console.log('📊 Comments data:', { postId: post.id, commentsCount: comments.length, isLoading: commentsLoading, error: commentsError });
  
  // Show inline input if no comments exist, otherwise open drawer
  const shouldShowInlineInput = comments.length === 0;
  const shouldOpenDrawer = comments.length > 0;
  
  // Check if this is a reshared post and fetch original post data
  useEffect(() => {
    const fetchOriginalPost = async () => {
      if (post.post_type === 'reshare') {
        try {
          // Look for the original post ID in the content_text
          const reshareMatch = post.content?.text?.match(/Reshared from (.+?):/);
          if (reshareMatch) {
            // This is a simple approach - in a real app you'd want to store the original post ID
            // For now, we'll just display it as a regular post with reshare indicator
            setOriginalPost(null);
          }
        } catch (error) {
          console.error('Error fetching original post:', error);
        }
      }
    };

    fetchOriginalPost();
  }, [post.post_type, post.content?.text]);


  // Check if this post contains videos - CRITICAL: Use consistent detection with InlineComments
  const allImages = post.content.images || [];
  const videoUrlsFromArray = allImages.filter(url => isSecureVideoFile(url));
  const singleImageVideo = post.content.image && isSecureVideoFile(post.content.image) ? post.content.image : undefined;
  
  // Combine all video sources for complete consistency (same as InlineComments)
  const allVideoUrls = singleImageVideo ? [singleImageVideo, ...videoUrlsFromArray] : videoUrlsFromArray;
  const hasVideo = allVideoUrls.length > 0;
  const videoUrl = allVideoUrls[0];
  
  // NEW: Check if this is ONLY videos (no photos) vs mixed content
  const allMediaUrls = allImages.concat(singleImageVideo ? [singleImageVideo] : []);
  const nonVideoUrls = allMediaUrls.filter(url => !isSecureVideoFile(url));
  const isVideoOnly = hasVideo && nonVideoUrls.length === 0; // Only show video player when there are ONLY videos
  const hasMixedContent = hasVideo && nonVideoUrls.length > 0; // Mixed photos and videos
  
  // console.log('🎬 Post video detection:', {
  //   postId: post.id,
  //   allImages: allImages.length,
  //   videoUrlsFromArray: videoUrlsFromArray.length,
  //   singleImageVideo,
  //   allVideoUrls: allVideoUrls.length,
  //   hasVideo,
  //   videoUrl
  // });

  // State for processed video URL only
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);

  // Process video URL through Wasabi system - No error states
  useEffect(() => {
    const processVideoUrl = async () => {
      if (videoUrl) {
        try {
          // console.log('🎬 Processing video URL for Post:', videoUrl);
          const processed = await processWasabiUrl(videoUrl);
          // console.log('✅ Video URL processed successfully:', processed);
          setProcessedVideoUrl(processed);
        } catch (error) {
          // console.log('Video processing note:', error);
          setProcessedVideoUrl(videoUrl); // Always fallback to original URL
        }
      }
    };
    
    processVideoUrl();
  }, [videoUrl]);
  
  // Check if this is a reshared post
  const isResharedPost = post.post_type === 'reshare' && post.content?.text?.includes('Reshared from');
  
  const handleLike = (postId: string) => {
    // console.log('Liked post:', postId);
  };
  
  const handleComment = async () => {
    // IMMEDIATELY toggle comments to show instant response
    const willShowComments = !showComments;
    setShowComments(willShowComments);
    setShowInlineInput(false);
    
    if (willShowComments) {
      // Fetch comments in background while UI shows instantly
      const fetchCommentsAsync = async () => {
        try {
          // Database call removed - placeholder for future Cloud integration
          const data = [];
          if (data) {
            const commentsMap = new Map();
            const rootComments: any[] = [];
            
            data.forEach((comment: any) => {
              const commentObj = {
                id: comment.id,
                content: comment.content,
                created_at: comment.created_at,
                user_name: comment.user_name || 'Unknown User',
                user_image: comment.user_image,
                like_count: Number(comment.like_count),
                user_has_liked: comment.user_has_liked,
                parent_comment_id: comment.parent_comment_id,
                replies: []
              };
              commentsMap.set(comment.id, commentObj);
            });
            
            commentsMap.forEach((comment) => {
              if (comment.parent_comment_id) {
                const parent = commentsMap.get(comment.parent_comment_id);
                if (parent) parent.replies.push(comment);
              } else {
                rootComments.push(comment);
              }
            });
            
            setComments(rootComments);
          }
        } catch (error) {
          console.error('Error loading comments:', error);
          setComments([]);
        }
      };
      
      // Start fetching comments in background
      fetchCommentsAsync();
    }
    
    // IMMEDIATELY pause ALL feed videos when opening comments
    if (willShowComments) {
      // Find the specific feed video for this post
      const postContainer = document.querySelector(`[data-post-id="${post.id}"]`);
      
      if (postContainer) {
        const feedVideo = postContainer.querySelector('video[data-feed-video="true"]') as HTMLVideoElement;
        
        if (feedVideo && !feedVideo.paused) {
          // Store current video state BEFORE pausing
          const videoData = {
            src: feedVideo.src,
            currentTime: feedVideo.currentTime,
            isPlaying: !feedVideo.paused,
            isMuted: feedVideo.muted,
            postId: post.id
          };
          
          sessionStorage.setItem('commentVideoData', JSON.stringify(videoData));
          
          // IMMEDIATELY pause the feed video
          feedVideo.pause();
          feedVideo.setAttribute('data-comment-controlled', 'true');
        }
      }
    }
  };

  const handleCloseComments = () => {
    console.log('🚪 Closing comments for post:', post.id);
    
    // Find the comment modal video to get current time
    const commentVideo = document.querySelector('video[data-comment-video="true"]') as HTMLVideoElement;
    
    // Find the feed video for this post
    const postContainer = document.querySelector(`[data-post-id="${post.id}"]`);
    const feedVideo = postContainer?.querySelector('video[data-feed-video="true"]') as HTMLVideoElement;
    
    if (feedVideo && commentVideo) {
      console.log('🔄 Syncing comment video time back to feed video');
      
      // Sync time and state from comment video to feed video
      feedVideo.currentTime = commentVideo.currentTime;
      feedVideo.muted = commentVideo.muted;
      
      // Remove the controlled attribute
      feedVideo.removeAttribute('data-comment-controlled');
      
      // If comment video was playing, resume feed video
      if (!commentVideo.paused) {
        feedVideo.play().then(() => {
          console.log('▶️ Feed video resumed at time:', feedVideo.currentTime);
        }).catch(console.log);
      }
    }
    
    // Clear stored data
    sessionStorage.removeItem('commentVideoData');
    
    setShowComments(false);
    setShowInlineInput(false);
  };
  
  const handleVisibilityChange = (visibility: string) => {
    console.log('Visibility changed to:', visibility);
  };
  
  const handlePostAction = async (action: string) => {
    console.log('Post action:', action);
    if (action === 'delete') {
      // Validate ownership before allowing deletion
      if (!currentUser?.id || currentUser.id !== post.user_id) {
        toast.error('You can only delete your own posts');
        throw new Error('Unauthorized delete attempt');
      }
      
      try {
        console.log('Deleting post:', post.id);
        await deletePost(post.id);
        console.log('✅ Post deleted successfully:', post.id);
      } catch (error) {
        console.error('❌ Failed to delete post:', error);
        throw error; // Re-throw for the PostHeader to handle
      }
    }
  };

  // Use real user name from Universal User Service
  const userWithRealName = {
    ...post.user,
    name: userDisplayName || post.user.name
  };

  // If this is a reshared post, show it with special formatting - FULL SIZE
  if (isResharedPost) {
    return (
      <div className="relative bg-card border border-border rounded-lg p-4 mb-4 w-full" data-post-id={post.id}>
        {/* Reshare Header */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar userId={post.user_id} size="sm" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">{userDisplayName || post.user.name}</span>
              <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v1h-2V4H7v1H5V4zM4 7a1 1 0 011-1h10a1 1 0 011 1v8a2 2 0 01-2 2H6a2 2 0 01-2-2V7zm2 1v6h8V8H6z"/>
                <path d="M11 11l-3 3-1.5-1.5"/>
              </svg>
              <span className="text-xs text-muted-foreground">shared</span>
            </div>
          </div>
        </div>

        {/* Original Content Display */}
        <div className="border border-border rounded-lg p-4 bg-muted/30">
          {/* Remove separate video handling - now handled in unified PhotoGrid */}
          {post.content?.text && (
            <p className="text-foreground mb-3">{post.content.text}</p>
          )}
          
          {/* Unified Media Content - Photos and Videos together */}
          <PostContent
            content={post.content}
            postType={post.post_type}
            postId={post.id}
            onMediaClick={handleComment}
          />
        </div>

        {/* Post Actions */}
        <div className="mt-4 border-t pt-4">
          <PostActions
            postId={post.id}
            initialLikes={post.reactions?.count || 0}
            commentsCount={comments.length}
            sharesCount={post.shares || 0}
            onLike={() => handleLike(post.id)}
            onComment={handleComment}
          />
        </div>
        
        {/* Comments are now handled by InlineComments component */}
        
        <InlineComments
          postId={post.id}
          isVisible={showComments}
          onClose={handleCloseComments}
          onOpen={() => setShowComments(true)}
          postData={post}
          feedVideoComponent={showComments && hasVideo ? (
            <FeedVideoPlayer
              src={processedVideoUrl!}
              className="w-full rounded-lg"
              onClick={() => {}}
              onPictureInPicture={() => {
                if (window.feedPipHandler) {
                  window.feedPipHandler(processedVideoUrl!, post);
                }
              }}
            />
          ) : undefined}
        />
      </div>
    );
  }

  // If this is a video-ONLY post (no photos), render it like the Watch page - FULL SIZE
  if (isVideoOnly && processedVideoUrl && !isResharedPost) {
    return (
      <div className="relative bg-card rounded-lg shadow-sm border border-border mb-4 w-full" data-post-id={post.id}>
        <div className="bg-card p-4 rounded-t-lg">
          <PostHeader 
            user={userWithRealName} 
            time={post.time} 
            visibility={post.visibility} 
            isSponsored={post.isSponsored}
            isAnonymous={post.is_anonymous}
            postId={post.id}
            userId={post.user_id}
            onVisibilityChange={handleVisibilityChange} 
            onPostAction={handlePostAction} 
          />
        </div>

        <div className="px-4 pb-4">
          <PostTextContent 
            text={post.content.text || "From cracks in walls to foundation damage, we strengthen your structure with lasting solutions."} 
          />
        </div>

        {/* Video with proper background - FULL SIZE DISPLAY */}
        {!showComments && (
          <div className="relative w-full h-[800px] overflow-hidden rounded-lg bg-background">
            <FeedVideoPlayer 
              src={processedVideoUrl} 
              className="w-full h-full" 
              onClick={handleComment}
              disableScrollPause={showPiP}
              showPipOverlay={showPiP}
              onPictureInPicture={() => {
                // Trigger PiP functionality - will be handled by parent components
                if (window.feedPipHandler) {
                  window.feedPipHandler(processedVideoUrl, post);
                }
              }}
            />
          </div>
        )}
        
        {/* When comments are open, show light themed placeholder */}
        {showComments && (
          <div className="relative w-full h-[800px] bg-background/10 flex items-center justify-center border border-border rounded-lg">
            <div className="w-6 h-6 border-2 border-muted/30 border-t-primary/40 rounded-full animate-spin" />
          </div>
        )}

        <div className="px-4 pt-4">
          <Separator />
        </div>

        <div className="py-3 px-2">
          <PostActions 
            postId={post.id} 
            initialLikes={post.reactions.count} 
            commentsCount={comments.length}
            sharesCount={post.shares || 0}
            onComment={handleComment} 
          />
        </div>

        {/* Comments handled by InlineComments component */}

        <InlineComments
          postId={post.id}
          isVisible={showComments}
          onClose={handleCloseComments}
          onOpen={() => setShowComments(true)}
          postData={post}
          feedVideoComponent={showComments ? (
            <FeedVideoPlayer 
              src={processedVideoUrl} 
              className="w-full h-full" 
              onClick={() => {}} 
              disableScrollPause={true}
              showPipOverlay={false}
              onPictureInPicture={() => {
                if (window.feedPipHandler) {
                  window.feedPipHandler(processedVideoUrl, post);
                }
              }}
            />
          ) : undefined}
        />
      </div>
    );
  }

  // For non-video posts, use the original layout - FULL SIZE
  return (
    <div className="relative bg-card rounded-lg shadow-sm border border-border mb-6 w-full" data-post-id={post.id}>
      <PostHeader
        user={userWithRealName} 
        time={post.time} 
        visibility={post.visibility} 
        isSponsored={post.isSponsored}
        isAnonymous={post.is_anonymous}
        postId={post.id}
        userId={post.user_id} 
        onVisibilityChange={handleVisibilityChange} 
        onPostAction={handlePostAction} 
      />
      
      <div className="px-4 pb-4">
        <PostTextContent 
          text={post.content.text || ""} 
        />
      </div>
      
      <PostContent 
        content={post.content} 
        postType={post.post_type} 
        postId={post.id} 
        onMediaClick={handleComment}
      />
      
      <div className="px-4 pt-2">
        <Separator />
      </div>
      
      <PostActions 
        postId={post.id} 
        initialLikes={post.reactions.count} 
        commentsCount={comments.length}
        sharesCount={post.shares || 0}
        onComment={handleComment}
        postContent={{
          text: post.content?.text,
          images: post.content?.images || (post.content?.image ? [post.content.image] : []),
          videoUrl: isSecureVideoFile(post.content?.image || '') ? post.content?.image : undefined
        }}
        postType={
          post.post_type === 'reshare' ? 'reshare' :
          isSecureVideoFile(post.content?.image || '') ? 'video' :
          (post.content?.images && post.content.images.length > 0) || post.content?.image ? 'image' : 'text'
        }
      />
      
      {/* Comments handled by InlineComments component */}
      
      <InlineComments
        postId={post.id}
        isVisible={showComments}
        onClose={handleCloseComments}
        onOpen={() => setShowComments(true)}
        postData={post}
      />
    </div>
  );
};

export default Post;
