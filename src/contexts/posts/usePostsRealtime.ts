
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Post } from './types';
import { convertSupabasePost } from './utils';

export const usePostsRealtime = (setPosts: React.Dispatch<React.SetStateAction<Post[]>>) => {
  useEffect(() => {
    console.log('🔄 [REAL-TIME] Setting up posts realtime subscription...');
    let backoff = 1000;
    let retryTimer: number | null = null;
    let channel = createChannel();

    function createChannel() {
      const newChannel = supabase
        .channel('posts-realtime')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'posts' },
          (payload) => {
            console.log('🆕 [REAL-TIME] New post received:', payload);
            const newPost = convertSupabasePost(payload.new);
            setPosts(prev => [newPost, ...prev]);
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'posts' },
          (payload) => {
            console.log('✏️ [REAL-TIME] Post updated:', payload);
            const updatedPost = convertSupabasePost(payload.new);
            setPosts(prev => prev.map(post => post.id === updatedPost.id ? updatedPost : post));
          }
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'posts' },
          (payload) => {
            console.log('🗑️ [REAL-TIME] Post deleted:', payload);
            setPosts(prev => prev.filter(post => post.id !== payload.old.id));
          }
        )
        .subscribe((status) => {
          console.log('🔌 [REAL-TIME] Posts channel status:', status);
          if (status === 'SUBSCRIBED') {
            backoff = 1000; // reset backoff on success
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            if (retryTimer) window.clearTimeout(retryTimer);
            retryTimer = window.setTimeout(() => {
              try { supabase.removeChannel(newChannel); } catch {}
              channel = createChannel();
            }, backoff);
            backoff = Math.min(backoff * 2, 30000);
          }
        });

      return newChannel;
    }

    return () => {
      console.log('🧹 [REAL-TIME] Cleaning up posts realtime subscription');
      if (retryTimer) window.clearTimeout(retryTimer);
      try { supabase.removeChannel(channel); } catch {}
    };
  }, [setPosts]);
};
