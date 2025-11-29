import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCommentActions = (postId: string) => {
  const queryClient = useQueryClient();

  const addCommentMutation = useMutation({
    mutationFn: async ({ content, parentCommentId }: { content: string; parentCommentId?: string }) => {
      console.log('🚀 addCommentMutation starting:', { postId, content, parentCommentId });
      
      // Check auth session first
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔐 Auth session check:', { 
        hasSession: !!session,
        userId: session?.user?.id,
        sessionExpiry: session?.expires_at 
      });
      
      if (!session?.user) {
        console.error('❌ No authenticated user found');
        throw new Error('Authentication required');
      }

      console.log('🔄 Calling add_comment RPC with:', {
        post_uuid: postId,
        comment_content: content,
        parent_comment_uuid: parentCommentId || null,
        authUserId: session.user.id
      });
      
      const { data, error } = await supabase.rpc('add_comment', {
        post_uuid: postId,
        comment_content: content,
        parent_comment_uuid: parentCommentId || null
      });

      console.log('📋 add_comment RPC response:', { 
        data, 
        error: error ? {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        } : null, 
        postId,
        dataType: typeof data,
        dataValue: data
      });

      if (error) {
        console.error('❌ Comment RPC error:', {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }
      
      console.log('✅ Comment added successfully - RPC returned:', data);
      return data;
    },
    onSuccess: () => {
      console.log('✅ Comment added successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.success('Comment added successfully!');
    },
    onError: (error) => {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  });

  const editCommentMutation = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      const { data, error } = await supabase.rpc('edit_comment', {
        comment_uuid: commentId,
        new_content: content
      });

      if (error) {
        console.error('❌ Edit comment error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.success('Comment updated successfully!');
    },
    onError: (error) => {
      console.error('Error editing comment:', error);
      toast.error('Failed to edit comment');
    }
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { data, error } = await supabase.rpc('delete_comment', {
        comment_uuid: commentId
      });

      if (error) {
        console.error('❌ Delete comment error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.success('Comment deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  });

  const toggleLikeMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { data, error } = await supabase.rpc('toggle_comment_like', {
        comment_uuid: commentId
      });

      if (error) {
        console.error('❌ Toggle like error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
    onError: (error) => {
      console.error('Error toggling comment like:', error);
      toast.error('Failed to like comment');
    }
  });

  return {
    addComment: addCommentMutation.mutate,
    editComment: editCommentMutation.mutate,
    deleteComment: deleteCommentMutation.mutate,
    toggleLike: toggleLikeMutation.mutate,
    isAddingComment: addCommentMutation.isPending,
    isEditingComment: editCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending,
    isTogglingLike: toggleLikeMutation.isPending,
  };
};