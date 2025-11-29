import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  edited_at: string | null;
  parent_comment_id: string | null;
  user_id: string;
  user_name: string;
  user_image: string | null;
  like_count: number;
  user_has_liked: boolean;
  replies?: Comment[];
}

export const useComments = (postId: string) => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['comments', postId],
    queryFn: async (): Promise<Comment[]> => {
      const { data, error } = await supabase.rpc('get_post_comments', {
        post_uuid: postId
      });

      if (error) {
        console.error('Error fetching comments:', error);
        return []; // Return empty array instead of throwing
      }

      // Organize comments into parent-child structure
      const commentsMap = new Map<string, Comment>();
      const rootComments: Comment[] = [];

      // First pass: create all comment objects
      data?.forEach((comment: any) => {
        const commentObj: Comment = {
          id: comment.id,
          content: comment.content,
          created_at: comment.created_at,
          updated_at: comment.updated_at,
          is_edited: comment.is_edited,
          edited_at: comment.edited_at,
          parent_comment_id: comment.parent_comment_id,
          user_id: comment.user_id,
          user_name: comment.user_name || 'Unknown User',
          user_image: comment.user_image,
          like_count: Number(comment.like_count),
          user_has_liked: comment.user_has_liked,
          replies: []
        };
        commentsMap.set(comment.id, commentObj);
      });

      // Second pass: organize into parent-child structure
      commentsMap.forEach((comment) => {
        if (comment.parent_comment_id) {
          const parent = commentsMap.get(comment.parent_comment_id);
          if (parent) {
            parent.replies!.push(comment);
          }
        } else {
          rootComments.push(comment);
        }
      });

      console.log('✅ Comments organized:', { rootCount: rootComments.length, totalCount: commentsMap.size });
      return rootComments;
    },
    enabled: !!postId,
    staleTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Set up realtime subscription for new comments
  useEffect(() => {
    if (!postId) return;

    console.log('🔄 Setting up realtime subscription for post:', postId);
    
    const channel = supabase
      .channel(`comments-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`
        },
        (payload) => {
          console.log('🔄 Realtime comment update:', payload);
          // Invalidate and refetch comments when there's a change
          queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        }
      )
      .subscribe();

    return () => {
      console.log('🔄 Cleaning up realtime subscription for post:', postId);
      supabase.removeChannel(channel);
    };
  }, [postId, queryClient]);

  return query;
};