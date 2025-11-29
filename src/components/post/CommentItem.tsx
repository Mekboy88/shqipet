import React, { useState } from 'react';
import { Heart, Reply, MoreHorizontal, Edit2, Trash2, Flag, Link } from 'lucide-react';
import Avatar from '@/components/Avatar';
import { formatTimeAgo } from '@/lib/utils/timeUtils';
import { Comment } from '@/hooks/comments/useComments';
import { useCommentActions } from '@/hooks/comments/useCommentActions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  isReply?: boolean;
  onReply?: (commentId: string, userName: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  postId, 
  isReply = false, 
  onReply 
}) => {
  const { user } = useAuth();
  const { toggleLike, deleteComment, editComment, isTogglingLike } = useCommentActions(postId);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleLike = () => {
    if (!isTogglingLike) {
      toggleLike(comment.id);
    }
  };

  const handleReply = () => {
    onReply?.(comment.id, comment.user_name);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== comment.content) {
      editComment({ commentId: comment.id, content: editContent.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      deleteComment(comment.id);
    }
  };

  const handleCopyLink = async () => {
    const commentUrl = `${window.location.href}#comment-${comment.id}`;
    try {
      await navigator.clipboard.writeText(commentUrl);
      // Could add a toast here
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const isOwner = user?.id === comment.user_id;

  return (
    <div 
      id={`comment-${comment.id}`}
      className={`${isReply ? 'ml-12 mt-3 relative' : 'mb-4'}`}
    >
      {/* Enhanced thread connector lines for replies */}
      {isReply && (
        <>
          {/* Vertical connector line */}
          <div className="absolute left-6 top-0 bottom-4 w-0.5 bg-gradient-to-b from-primary/20 via-primary/30 to-transparent rounded-full shadow-sm animate-fade-in" />
          
          {/* Corner connector */}
          <div className="absolute left-6 top-4 w-6 h-0.5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-full animate-fade-in" />
          
          {/* Connection dot */}
          <div className="absolute left-5 top-4 w-2 h-2 bg-primary/40 rounded-full border border-primary/20 shadow-sm animate-scale-in" />
        </>
      )}
      
      <div className="flex space-x-3 relative">
        <Avatar userId={comment.user_id} size="sm" className="z-10 relative" />
        <div className="flex-1">
          <div className="bg-white rounded-2xl px-4 py-3 border border-primary/10 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 relative backdrop-blur-sm">
            <div className="font-semibold text-sm">{comment.user_name}</div>
            {isEditing ? (
              <div className="mt-1">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full text-sm bg-white border border-gray-200 rounded p-2 resize-none"
                  rows={2}
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={handleSaveEdit}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-800 mt-1">
                {comment.content}
                {comment.is_edited && (
                  <span className="text-xs text-gray-500 ml-2">(edited)</span>
                )}
              </div>
            )}
          </div>
          
          {!isEditing && (
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <span>{formatTimeAgo(comment.created_at)}</span>
              
              <button 
                className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${
                  comment.user_has_liked ? 'text-red-500' : ''
                } ${isTogglingLike ? 'opacity-50' : ''}`}
                onClick={handleLike}
                disabled={isTogglingLike}
              >
                <Heart className={`w-3 h-3 ${comment.user_has_liked ? 'fill-current' : ''} ${
                  isTogglingLike ? 'animate-pulse' : ''
                }`} />
                <span>{comment.like_count > 0 ? comment.like_count : 'Pëlqej'}</span>
              </button>
              
              <button 
                className="hover:text-red-500 transition-colors"
                onClick={handleReply}
              >
                Përgjigju
              </button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hover:text-gray-700 transition-colors">
                    <MoreHorizontal className="w-3 h-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isOwner && (
                    <>
                      <DropdownMenuItem onClick={handleEdit}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <Link className="w-4 h-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                  {!isOwner && (
                    <DropdownMenuItem className="text-orange-600">
                      <Flag className="w-4 h-4 mr-2" />
                      Report
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
      
      {comment.replies?.map(reply => (
        <CommentItem 
          key={reply.id} 
          comment={reply} 
          postId={postId} 
          isReply={true} 
          onReply={onReply}
        />
      ))}
    </div>
  );
};

export default CommentItem;