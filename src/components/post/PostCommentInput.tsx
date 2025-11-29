import React, { useState, useRef, useEffect } from 'react';
import { Smile, Image as ImageIcon, Mic, Star, X } from 'lucide-react';
import Avatar from '@/components/Avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useCommentActions } from '@/hooks/comments/useCommentActions';
import { Button } from '@/components/ui/button';

interface PostCommentInputProps {
  postId: string;
  replyingTo?: { id: string; userName: string } | null;
  onReplySubmit?: () => void;
}

const PostCommentInput: React.FC<PostCommentInputProps> = ({ 
  postId, 
  replyingTo, 
  onReplySubmit 
}) => {
  const { user } = useAuth();
  const { addComment, isAddingComment } = useCommentActions(postId);
  const [isExpanded, setIsExpanded] = useState(false);
  const [comment, setComment] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-expand when replying to a comment
  useEffect(() => {
    if (replyingTo) {
      setIsExpanded(true);
    }
  }, [replyingTo]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (comment.trim() === '') {
          setIsExpanded(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [comment]);

  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    setComment(textarea.value);
  };

  const handleSend = () => {
    if (!user?.id) {
      console.error('❌ No user found');
      return;
    }
    
    const trimmedComment = comment.trim();
    if (!trimmedComment) {
      console.error('❌ Empty comment');
      return;
    }
    
    console.log('✅ Calling addComment with:', {
      content: trimmedComment,
      parentCommentId: replyingTo?.id,
      postId
    });
    
    addComment({ 
      content: trimmedComment, 
      parentCommentId: replyingTo?.id 
    });
    
    // Clear form immediately for better UX
    setComment('');
    setIsExpanded(false);
    onReplySubmit?.();
  };

  const handleCancelReply = () => {
    onReplySubmit?.();
  };

  if (!user) {
    return (
      <div className="text-center text-gray-500 text-sm py-4">
        Please log in to comment
      </div>
    );
  }

  if (!isExpanded) {
    return (
      <div 
        className="flex items-center space-x-3 cursor-pointer"
        onClick={() => setIsExpanded(true)}
      >
        <Avatar userId={user.id} size="sm" />
        <div className="flex-1 text-gray-500 text-sm border border-gray-300 rounded-full px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors">
          {replyingTo ? `Reply to ${replyingTo.userName}...` : 'Write a comment...'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3" ref={containerRef}>
      {replyingTo && (
        <div className="flex items-center justify-between flex-1 p-4 bg-gradient-to-r from-red-500/10 to-gray-800/10 rounded-xl border border-red-200">
          <span className="text-sm text-red-700">
            Replying to {replyingTo.userName}
          </span>
          <button 
            onClick={handleCancelReply}
            className="text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="flex items-start space-x-3">
        <Avatar userId={user.id} size="sm" />
        <div className="flex-1">
          <div className="bg-gray-100 rounded-2xl p-3">
            <textarea 
              placeholder={replyingTo ? `Reply to ${replyingTo.userName}...` : "Write a comment..."}
              className="w-full bg-transparent border-0 focus:border-0 focus:ring-0 focus:ring-transparent outline-0 focus:outline-0 focus-visible:outline-0 resize-none text-sm"
              value={comment}
              onInput={handleTextareaInput}
              rows={1}
              autoFocus
              maxLength={500}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
                if (e.key === 'Escape' && comment.trim() === '') {
                  setIsExpanded(false);
                }
              }}
            />
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center space-x-2 text-gray-500">
                <button className="h-6 w-6 flex items-center justify-center text-xs border border-gray-400 rounded hover:bg-gray-200">
                  GIF
                </button>
                <Star className="h-4 w-4 cursor-pointer hover:text-yellow-500" />
                <Smile className="h-4 w-4 cursor-pointer hover:text-yellow-500" />
                <ImageIcon className="h-4 w-4 cursor-pointer hover:text-blue-500" />
                <Mic className="h-4 w-4 cursor-pointer hover:text-red-500" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {comment.length}/500
            </span>
            <Button 
              size="sm"
              disabled={!comment.trim() || isAddingComment}
              onClick={handleSend}
              type="button"
              className="flex items-center gap-1"
            >
              {isAddingComment ? 'Sending...' : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                    <path d="M20.7639 12H10.0556M3 8.00003H5.5M4 12H5.5M4.5 16H5.5M9.96153 12.4896L9.07002 15.4486C8.73252 16.5688 8.56376 17.1289 8.70734 17.4633C8.83199 17.7537 9.08656 17.9681 9.39391 18.0415C9.74792 18.1261 10.2711 17.8645 11.3175 17.3413L19.1378 13.4311C20.059 12.9705 20.5197 12.7402 20.6675 12.4285C20.7961 12.1573 20.7961 11.8427 20.6675 11.5715C20.5197 11.2598 20.059 11.0295 19.1378 10.5689L11.3068 6.65342C10.2633 6.13168 9.74156 5.87081 9.38789 5.95502C9.0808 6.02815 8.82627 6.24198 8.70128 6.53184C8.55731 6.86569 8.72427 7.42461 9.05819 8.54246L9.96261 11.5701C10.0137 11.7411 10.0392 11.8266 10.0493 11.9137C10.0583 11.991 10.0582 12.069 10.049 12.1463C10.0387 12.2334 10.013 12.3188 9.96153 12.4896Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Send
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCommentInput;