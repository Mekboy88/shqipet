import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import PostCommentInput from './PostCommentInput';
import CommentItem from './CommentItem';
import { useComments } from '@/hooks/comments/useComments';
import { Skeleton } from '@/components/ui/skeleton';

interface CommentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

const CommentDrawer: React.FC<CommentDrawerProps> = ({
  isOpen,
  onClose,
  postId
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: string; userName: string } | null>(null);
  const { data: comments = [], isLoading, error } = useComments(postId);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReply = (commentId: string, userName: string) => {
    setReplyingTo({ id: commentId, userName });
  };

  const handleReplySubmit = () => {
    setReplyingTo(null);
  };

  return (
    <>
      {/* Backdrop - Darker shade */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      
      {/* Drawer - Positioned on left side */}
      <div className={`
        fixed z-50 bg-card flex flex-col border border-border shadow-2xl rounded-xl
        top-[40px] 
        w-[400px] h-[700px]
        ${isOpen 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-full opacity-0 scale-95'
        }
        transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
      `}
      style={{ left: 'calc(50% - 860px - 140px)' }}>
        {/* Handle for mobile */}
        {isMobile && (
          <div className="flex justify-center pt-3 pb-2 bg-card">
            <div className="w-12 h-1 bg-muted rounded-full" />
          </div>
        )}
        
        {/* Header - Must be fully visible */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card flex-shrink-0 sticky top-0 z-10">
          <h3 className="text-lg font-semibold text-foreground">Komentet</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Comments List - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {/* Comment Skeleton Loading */}
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex space-x-3 animate-pulse">
                  {/* Avatar skeleton */}
                  <div className="w-8 h-8 bg-muted rounded-full flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    {/* Username skeleton */}
                    <div className="h-3 bg-muted rounded w-20"></div>
                    {/* Comment text skeleton - multiple lines */}
                    <div className="space-y-1">
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-4/5"></div>
                      {index % 2 === 0 && <div className="h-3 bg-muted rounded w-3/5"></div>}
                    </div>
                    {/* Time and actions skeleton */}
                    <div className="flex items-center space-x-4 pt-1">
                      <div className="h-2 bg-muted rounded w-12"></div>
                      <div className="h-2 bg-muted rounded w-8"></div>
                      <div className="h-2 bg-muted rounded w-10"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length > 0 ? (
            comments.map(comment => (
              <CommentItem 
                key={comment.id} 
                comment={comment} 
                postId={postId}
                onReply={handleReply}
              />
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <div className="text-4xl mb-2">💬</div>
              <p>Nuk ka komente ende</p>
              <p className="text-sm">Jini të parët që komentoni!</p>
            </div>
          )}
        </div>
        
        {/* Comment Input - Fixed at bottom */}
        <div className="border-t border-border p-4 bg-card flex-shrink-0">
          <PostCommentInput 
            postId={postId}
            replyingTo={replyingTo}
            onReplySubmit={handleReplySubmit}
          />
        </div>
      </div>
    </>
  );
};

export default CommentDrawer;