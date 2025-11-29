
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { ThumbsUp, MessageCircle, Share2, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import supabase from '@/lib/relaxedSupabase';
import { useAuth } from '@/contexts/AuthContext';
import ShareDialog from '@/components/sharing/ShareDialog';
import { formatNumberAlbanian } from '@/utils/numberFormatter';

interface PostActionsProps {
  postId?: string;
  initialLikes?: number;
  commentsCount?: number;
  sharesCount?: number;
  onLike?: (postId: string) => void;
  onComment?: () => void;
  postContent?: {
    text?: string;
    images?: string[];
    videoUrl?: string;
  };
  postType?: 'text' | 'image' | 'video' | 'reshare';
  hideCommentButton?: boolean;
}

const PostActions: React.FC<PostActionsProps> = ({ 
  postId = '', 
  initialLikes = 0,
  commentsCount = 0,
  sharesCount = 0,
  onLike,
  onComment,
  postContent = {},
  postType = 'text',
  hideCommentButton = false
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if user has already liked this post
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!user || !postId) return;

      try {
        const { data, error } = await supabase
          .from('reactions')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .eq('reaction_type', 'like')
          .maybeSingle();

        if (!error && data) {
          setIsLiked(true);
        }
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkLikeStatus();
  }, [user, postId]);

  // Fetch current likes count
  useEffect(() => {
    const fetchLikesCount = async () => {
      if (!postId) return;

      try {
        const { data, error } = await supabase
          .from('reactions')
          .select('id')
          .eq('post_id', postId)
          .eq('reaction_type', 'like');

        if (!error && data) {
          setLikesCount(data.length);
        }
      } catch (error) {
        console.error('Error fetching likes count:', error);
      }
    };

    fetchLikesCount();
  }, [postId]);

  const handleLike = async () => {
    if (!user) {
      toast.error('Duhet të jeni të kyçur për të reaguar në postime');
      return;
    }

    if (!postId) {
      toast.error('ID e postimit nuk u gjet');
      return;
    }

    try {
      if (isLiked) {
        // Remove like
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .eq('reaction_type', 'like');

        if (error) {
          console.error('Error removing like:', error);
          toast.error('Nuk u arrit të hiqet pëlqimi');
          return;
        }

        setIsLiked(false);
        setLikesCount(prev => prev - 1);

        // Update posts table reactions count
        await supabase
          .from('posts')
          .update({ reactions_count: likesCount - 1 })
          .eq('id', postId);

      } else {
        // Add like
        const { error } = await supabase
          .from('reactions')
          .insert({
            post_id: postId,
            user_id: user.id,
            reaction_type: 'like'
          });

        if (error) {
          console.error('Error adding like:', error);
          toast.error('Nuk u arrit të shtohet pëlqimi');
          return;
        }

        setIsLiked(true);
        setLikesCount(prev => prev + 1);

        // Update posts table reactions count
        await supabase
          .from('posts')
          .update({ reactions_count: likesCount + 1 })
          .eq('id', postId);
      }

      if (onLike) {
        onLike(postId);
      }
    } catch (error) {
      console.error('Error handling like:', error);
      toast.error('Ndodhi një gabim gjatë reagimit');
    }
  };

  const handleComment = () => {
    // console.log('🔥 PostActions handleComment called - Comment button clicked!', {
    //   onCommentProp: typeof onComment,
    //   hasOnComment: !!onComment
    // });
    
    if (onComment) {
      // console.log('✅ Calling onComment prop from PostActions');
      onComment();
    } else {
      console.error('❌ onComment prop is missing in PostActions');
    }
  };

  const handleShare = async (platform: string) => {
    if (!postId) {
      toast.error('ID e postimit nuk u gjet');
      return;
    }

    try {
      // Record share in database
      if (user) {
        await supabase
          .from('shares')
          .insert({
            post_id: postId,
            user_id: user.id,
            share_type: platform
          });

      // Update shares count in posts table
      const { data: currentPost } = await supabase
        .from('posts')
        .select('shares_count')
        .eq('id', postId)
        .maybeSingle();

      if (currentPost) {
          await supabase
            .from('posts')
            .update({ shares_count: (currentPost.shares_count || 0) + 1 })
            .eq('id', postId);
        }
      }
    } catch (error) {
      console.error('Error recording share:', error);
    }
  };

  const shareToFacebook = async () => {
    const url = encodeURIComponent(window.location.href);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    await handleShare('facebook');
    toast({
      title: "Postimi u nda",
      description: "Postimi u nda me sukses në Facebook."
    });
  };

  const shareToPhone = async () => {
    const text = encodeURIComponent('Shiko këtë postim interesant!');
    const url = encodeURIComponent(window.location.href);
    const smsUrl = `sms:?body=${text}%20${url}`;
    window.open(smsUrl, '_blank');
    await handleShare('phone');
    toast({
      title: "Postimi u nda",
      description: "Postimi u nda me sukses via SMS."
    });
  };

  const shareToX = async () => {
    const text = encodeURIComponent('Shiko këtë postim interesant!');
    const url = encodeURIComponent(window.location.href);
    const xUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(xUrl, '_blank', 'width=600,height=400');
    await handleShare('x');
    toast({
      title: "Postimi u nda",
      description: "Postimi u nda me sukses në X."
    });
  };

  const resharePost = async () => {
    if (!postId) {
      toast.error('ID e postimit nuk u gjet');
      return;
    }

    try {
    // Get the original post data
    const { data: originalPost, error: postError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .maybeSingle();

    if (postError || !originalPost) {
        console.error('Error fetching original post:', postError);
        toast.error('Nuk u arrit të merret postimi origjinal');
        return;
      }

      // Create a new post as a reshare
      const { data: newPost, error: createError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          user_name: user.user_metadata?.first_name + ' ' + user.user_metadata?.last_name || 'User',
          user_image: user.user_metadata?.avatar_url || '',
          content_text: `Reshared from ${originalPost.user_name}: ${originalPost.content_text || ''}`,
          content_images: originalPost.content_images,
          post_type: 'reshare',
          visibility: 'public'
        })
        .select()
        .maybeSingle();

      if (createError || !newPost) {
        console.error('Error creating reshare:', createError);
        toast.error('Nuk u arrit të krijohet reshare');
        return;
      }

      // Record share in shares table
      await supabase
        .from('shares')
        .insert({
          post_id: postId,
          user_id: user.id,
          share_type: 'reshare',
          shared_post_id: newPost.id
        });

    // Update shares count
    const { data: currentPost } = await supabase
      .from('posts')
      .select('shares_count')
      .eq('id', postId)
      .maybeSingle();

    if (currentPost) {
        await supabase
          .from('posts')
          .update({ shares_count: (currentPost.shares_count || 0) + 1 })
          .eq('id', postId);
      }

      toast({
        title: "Postimi u ri-nda",
        description: "Postimi u ri-nda me sukses në profilin tuaj."
      });

    } catch (error) {
      console.error('Error resharing post:', error);
      toast.error('Ndodhi një gabim gjatë ri-ndarjes së postimit');
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      await handleShare('link');
      toast({
        title: "Lidhja u kopjua",
        description: "Lidhja e postimit u kopjua në clipboard."
      });
    } catch (error) {
      console.error('Error copying link:', error);
      toast.error('Nuk u arrit të kopjohet lidhja');
    }
  };

  return (
    <div className="flex justify-around">
      <button 
        onClick={handleLike}
        className={`flex items-center justify-between rounded-md p-2 w-full transition-colors duration-200 ${
          isLiked 
            ? 'text-red-600 hover:bg-red-50' 
            : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'
        }`}
      >
        <div className={`flex items-center space-x-2 ${
          isLiked 
            ? 'px-2 py-1 bg-gradient-to-r from-red-500/10 to-gray-800/10 rounded-lg border border-red-200' 
            : ''
        }`}>
          <svg 
            className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`}
            viewBox="0 0 489.543 489.543" 
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
          >
            <path d="M270.024,0c-22.6,0-15,48.3-15,48.3s-48.3,133.2-94.5,168.7c-9.9,10.4-16.1,21.9-20,31.3l0,0l0,0 c-0.9,2.3-1.7,4.5-2.4,6.5c-3.1,6.3-9.7,16-23.8,24.5l46.2,200.9c0,0,71.5,9.3,143.2,7.8c28.7,2.3,59.1,2.5,83.3-2.7 c82.2-17.5,61.6-74.8,61.6-74.8c44.3-33.3,19.1-74.9,19.1-74.9c39.4-41.1,0.7-75.6,0.7-75.6s21.3-33.2-6.2-58.3 c-34.3-31.4-127.4-10.5-127.4-10.5l0,0c-6.5,1.1-13.4,2.5-20.8,4.3c0,0-32.2,15,0-82.7C346.324,15.1,292.624,0,270.024,0z"/>
            <path d="M127.324,465.7l-35-166.3c-2-9.5-11.6-17.3-21.3-17.3h-66.8l-0.1,200.8h109.1C123.024,483,129.324,475.2,127.324,465.7z"/>
          </svg>
          <span className="font-medium text-sm">Pëlqej</span>
        </div>
        {likesCount > 0 && (
          <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded-full">
            {formatNumberAlbanian(likesCount)}
          </span>
        )}
      </button>

      {!hideCommentButton && (
        <button 
          onClick={handleComment}
          className="flex items-center justify-between text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md p-2 w-full transition-colors duration-200"
        >
          <div className="flex items-center space-x-2">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M4.32698 6.63803L5.21799 7.09202L4.32698 6.63803ZM4.7682 20.2318L4.06109 19.5247H4.06109L4.7682 20.2318ZM18.362 16.673L18.816 17.564L18.816 17.564L18.362 16.673ZM19.673 15.362L20.564 15.816L20.564 15.816L19.673 15.362ZM19.673 6.63803L20.564 6.18404L20.564 6.18404L19.673 6.63803ZM18.362 5.32698L18.816 4.43597L18.816 4.43597L18.362 5.32698ZM5.63803 5.32698L6.09202 6.21799L5.63803 5.32698ZM7.70711 17.2929L7 16.5858L7.70711 17.2929ZM5 9.8C5 8.94342 5.00078 8.36113 5.03755 7.91104C5.07337 7.47262 5.1383 7.24842 5.21799 7.09202L3.43597 6.18404C3.18868 6.66937 3.09012 7.18608 3.04419 7.74817C2.99922 8.2986 3 8.97642 3 9.8H5ZM5 12V9.8H3V12H5ZM3 12V17H5V12H3ZM3 17V19.9136H5V17H3ZM3 19.9136C3 21.2054 4.56185 21.8524 5.4753 20.9389L4.06109 19.5247C4.40757 19.1782 5 19.4236 5 19.9136H3ZM5.4753 20.9389L8.41421 18L7 16.5858L4.06109 19.5247L5.4753 20.9389ZM15.2 16H8.41421V18H15.2V16ZM17.908 15.782C17.7516 15.8617 17.5274 15.9266 17.089 15.9624C16.6389 15.9992 16.0566 16 15.2 16V18C16.0236 18 16.7014 18.0008 17.2518 17.9558C17.8139 17.9099 18.3306 17.8113 18.816 17.564L17.908 15.782ZM18.782 14.908C18.5903 15.2843 18.2843 15.5903 17.908 15.782L18.816 17.564C19.5686 17.1805 20.1805 16.5686 20.564 15.816L18.782 14.908ZM19 12.2C19 13.0566 18.9992 13.6389 18.9624 14.089C18.9266 14.5274 18.8617 14.7516 18.782 14.908L20.564 15.816C20.8113 15.3306 20.9099 14.8139 20.9558 14.2518C21.0008 13.7014 21 13.0236 21 12.2H19ZM19 9.8V12.2H21V9.8H19ZM18.782 7.09202C18.8617 7.24842 18.9266 7.47262 18.9624 7.91104C18.9992 8.36113 19 8.94342 19 9.8H21C21 8.97642 21.0008 8.2986 20.9558 7.74817C20.9099 7.18608 20.8113 6.66937 20.564 6.18404L18.782 7.09202ZM17.908 6.21799C18.2843 6.40973 18.5903 6.71569 18.782 7.09202L20.564 6.18404C20.1805 5.43139 19.5686 4.81947 18.816 4.43597L17.908 6.21799ZM15.2 6C16.0566 6 16.6389 6.00078 17.089 6.03755C17.5274 6.07337 17.7516 6.1383 17.908 6.21799L18.816 4.43597C18.3306 4.18868 17.8139 4.09012 17.2518 4.04419C16.7014 3.99922 16.0236 4 15.2 4V6ZM8.8 6H15.2V4H8.8V6ZM6.09202 6.21799C6.24842 6.1383 6.47262 6.07337 6.91104 6.03755C7.36113 6.00078 7.94342 6 8.8 6V4C7.97642 4 7.2986 3.99922 6.74817 4.04419C6.18608 4.09012 5.66937 4.18868 5.18404 4.43597L6.09202 6.21799ZM5.21799 7.09202C5.40973 6.71569 5.71569 6.40973 6.09202 6.21799L5.18404 4.43597C4.43139 4.81947 3.81947 5.43139 3.43597 6.18404L5.21799 7.09202ZM8.41421 18V16C7.88378 16 7.37507 16.2107 7 16.5858L8.41421 18Z" fill="currentColor"></path>
                <path d="M8 9L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M8 13L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </g>
            </svg>
            <span className="font-medium text-sm">Komentoni</span>
          </div>
          {commentsCount > 0 && (
            <span className="text-sm font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {formatNumberAlbanian(commentsCount)}
            </span>
          )}
        </button>
      )}


      <button 
        onClick={() => setShowShareDialog(true)}
        className="flex items-center justify-between text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md p-2 w-full transition-colors duration-200"
      >
        <div className="flex items-center space-x-2">
          <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" enableBackground="new 0 0 52 52" xmlSpace="preserve" className="w-6 h-6">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <g>
                <path d="M41,15.9h7.8c0.4,0,0.7-0.5,0.4-0.9l-8.3-8.3c-0.4-0.3-0.9,0-0.9,0.4v7.8C40,15.5,40.4,15.9,41,15.9z M49,19.9H38c-1.1,0-2-0.9-2-2v-11c0-0.6-0.4-1-1-1H21.5c-0.8,0-1.5,0.7-1.5,1.5v4c0,0.4,0.2,0.8,0.4,1.1l5.6,5.6 c0.8,0.8,1.4,1.9,1.6,3.1c0.2,1.6-0.3,3.1-1.4,4.3L24.6,27c-0.5,0.5-1,0.8-1.6,1.1c0.7,0.3,1.5,0.5,2.3,0.6 c2.6,0.2,4.7,2.4,4.7,5.1V36c0,1.4-0.7,2.8-1.7,3.7c-1,1-2.5,1.4-3.9,1.3c-1.1-0.1-2.1-0.3-3.2-0.5c-0.6-0.2-1.2,0.3-1.2,1v3.1 c0,0.8,0.7,1.5,1.5,1.5h27c0.8,0,1.5-0.7,1.5-1.5V21C50,20.4,49.6,20,49,19.9z M26,35.8v-2.2c0-0.6-0.5-1-1.1-1.1 c-5.4-0.5-9.9-5.1-9.9-10.8v-1.2c0-0.6,0.8-1,1.2-0.5l4,4c0.4,0.4,1.1,0.4,1.5,0l1.5-1.5c0.4-0.4,0.4-1.1,0-1.5l-9.7-9.7 c-0.4-0.4-1.1-0.4-1.5,0l-9.7,9.7c-0.4,0.4-0.4,1.1,0,1.5l1.5,1.5c0.4,0.4,1.1,0.5,1.5,0.1l4.2-4c0.5-0.5,1.4-0.1,1.4,0.5v1.9 c0,7.2,6.3,13.8,13.9,14.4C25.5,36.9,26,36.4,26,35.8z"></path>
              </g>
            </g>
          </svg>
          <span className="font-medium text-sm">Shpërndaj</span>
        </div>
        {sharesCount > 0 && (
          <span className="text-sm font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
            {formatNumberAlbanian(sharesCount)}
          </span>
        )}
      </button>

      {/* Enhanced Share Dialog */}
      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        postId={postId}
        content={postContent}
        postType={postType}
      />
    </div>
  );
};

export default PostActions;
