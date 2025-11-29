import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileSettings } from '@/hooks/useProfileSettings';

export interface Post {
  id: string;
  user_id: string;
  user_name: string;
  user_image?: string;
  user_verified?: boolean;
  content: {
    text?: string;
    images?: string[];
  };
  reactions_count: number;
  comments_count: number;
  shares_count: number;
  reactions_types: string[];
  created_at: string;
  updated_at: string;
  is_sponsored?: boolean;
  is_anonymous?: boolean;
  location?: string;
  visibility: string;
  post_type: string;
  // Additional properties for component compatibility
  user: {
    name: string;
    image: string;
    verified?: boolean;
  };
  time: string;
  reactions: {
    count: number;
    types: string[];
  };
  comments: number;
  shares: number;
}

// Simplified interface for creating posts
export interface CreatePostData {
  user: {
    name: string;
    image: string;
    verified?: boolean;
  };
  time: string;
  visibility?: string;
  is_sponsored?: boolean;
  postType?: string;
  content: {
    text?: string;
    images?: string[];
  };
}

interface PostsContextType {
  posts: Post[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMorePosts: boolean;
  hasLoadedOnce: boolean;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  addPost: (post: CreatePostData) => Promise<void>;
  updatePost: (id: string, updates: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  loadMorePosts: () => Promise<void>;
  refreshPosts: () => Promise<void>;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

// Memoized helper functions to prevent recreating on every render
const mapVisibility = (visibility: string | null): string => {
  if (!visibility) return 'public';
  switch (visibility.toLowerCase()) {
    case 'everyone':
      return 'public';
    case 'friends':
      return 'friends';
    case 'only me':
      return 'private';
    default:
      return 'public';
  }
};

const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

export const PostsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const FEED_CACHE_PREFIX = 'feed_cache_';
  const getFeedCacheKey = (userId?: string | null) => `${FEED_CACHE_PREFIX}${userId || 'anon'}`;
  
  const { user, loading: authLoading } = useAuth();
  const { userInfo } = useProfileSettings();
  const initialLoadStartedRef = useRef(false);

  // Synchronous cache hydration to avoid first-paint flicker
  const initialCacheRaw = (() => {
    try { return localStorage.getItem(getFeedCacheKey(user?.id)); } catch { return null; }
  })();
  const initialCache = (() => {
    try { return initialCacheRaw ? JSON.parse(initialCacheRaw) : null; } catch { return null; }
  })();

  const [posts, setPosts] = useState<Post[]>(initialCache?.posts || []);
  const [isLoading, setIsLoading] = useState(!Boolean(initialCache?.posts?.length));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [lastPostId, setLastPostId] = useState<string | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(Boolean(initialCache?.posts?.length));
  

  console.log('🔍 PostsProvider: Render state', { 
    hasUser: !!user, 
    authLoading, 
    postsCount: posts.length,
    isLoadingPosts: isLoading 
  });

  const POSTS_PER_PAGE = 5; // Reduced from 10 for progressive loading

  // Memoized function to transform database posts
  const transformPosts = useCallback((dbPosts: any[]): Post[] => {
    return dbPosts.map(dbPost => {
      const img = dbPost.user_image || '';
      if (!img) {
        try {
          console.warn('🧪 PostsContextDebug: post has empty user_image (avatar missing in feed source). Will render fallback/avatar component.', {
            postId: String(dbPost.id).slice(0, 8),
            userId: dbPost.user_id,
            userName: dbPost.user_name
          });
          (window as any).__postsAvatarDebug = {
            lastEmpty: { postId: dbPost.id, userId: dbPost.user_id, ts: Date.now() }
          };
        } catch {}
      }
      return ({
        id: dbPost.id,
        user_id: dbPost.user_id,
        user_name: dbPost.user_name,
        user_image: dbPost.user_image,
        user_verified: dbPost.user_verified || false,
        content: {
          text: dbPost.content_text,
          images: dbPost.content_images || []
        },
        reactions_count: dbPost.reactions_count || 0,
        comments_count: dbPost.comments_count || 0,
        shares_count: dbPost.shares_count || 0,
        reactions_types: dbPost.reactions_types || [],
        created_at: dbPost.created_at,
        updated_at: dbPost.updated_at,
        is_sponsored: dbPost.is_sponsored || false,
        location: dbPost.location,
        visibility: mapVisibility(dbPost.visibility),
        post_type: dbPost.post_type || 'text',
        // Component compatibility properties
        user: {
          name: dbPost.user_name,
          image: img,
          verified: dbPost.user_verified || false
        },
        time: getRelativeTime(dbPost.created_at),
        reactions: {
          count: dbPost.reactions_count || 0,
          types: dbPost.reactions_types || []
        },
        comments: dbPost.comments_count || 0,
        shares: dbPost.shares_count || 0
      });
    });
  }, []);

  // Enhanced posts loading with robust error handling and auth validation
  const loadPosts = useCallback(async (isInitial = true, fromPostId?: string) => {
    console.log('🔍 PostsContext.loadPosts:', { 
      isInitial, 
      hasUser: !!user, 
      userId: user?.id,
      fromPostId: fromPostId?.slice(0, 8) 
    });

    if (!user?.id) {
      console.log('🚫 PostsContext: Skipping posts loading - no authenticated user');
      if (isInitial) {
        setIsLoading(false);
        setPosts([]);
      }
      return;
    }

    try {
      if (isInitial) {
        console.log('🔄 PostsContext: Loading initial posts from database...');
        setIsLoading(true);
      } else {
        console.log('🔄 PostsContext: Loading more posts from database...');
        setIsLoadingMore(true);
      }
      
      // Build query with comprehensive selection and proper ordering
      let query = supabase
        .from('posts')
        .select(`
          id,
          user_id,
          user_name,
          user_image,
          user_verified,
          content_text,
          content_images,
          reactions_count,
          comments_count,
          shares_count,
          reactions_types,
          created_at,
          updated_at,
          is_sponsored,
          location,
          visibility,
          post_type
        `)
        .not('created_at', 'is', null)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(POSTS_PER_PAGE + 1); // +1 to check if there are more posts

      // If loading more posts, use cursor pagination
      if (!isInitial && fromPostId) {
        // Get the creation date of the last post for cursor pagination
        try {
          const { data: lastPost } = await supabase
            .from('posts')
            .select('created_at')
            .eq('id', fromPostId)
            .not('created_at', 'is', null)
            .maybeSingle();
            
          if (lastPost?.created_at) {
            query = query.lt('created_at', lastPost.created_at);
          }
        } catch (cursorError) {
          console.warn('⚠️ PostsContext: Cursor pagination failed, loading from start:', cursorError);
        }
      }

      console.log('📡 PostsContext: Executing posts query...');
      const startTime = performance.now();
      const { data, error } = await query;
      const endTime = performance.now();
      
      console.log(`⏱️ PostsContext: Query completed in ${Math.round(endTime - startTime)}ms`);

      if (error) {
        console.error('❌ PostsContext: Database error loading posts:', error);
        throw error;
      }

      if (!data) {
        console.warn('⚠️ PostsContext: No posts data received from database');
        if (isInitial) {
          // Do not clear existing posts; keep UI stable and show skeletons instead
          setHasMorePosts(false);
        }
        return;
      }

      console.log(`📊 PostsContext: Received ${data.length} posts from database`);

      // Check if there are more posts (we fetched +1 extra)
      const hasMore = data.length > POSTS_PER_PAGE;
      const postsToAdd = hasMore ? data.slice(0, POSTS_PER_PAGE) : data;
      
      setHasMorePosts(hasMore);

      // Transform database posts to match component interface
      const transformedPosts = transformPosts(postsToAdd);
      
      if (isInitial) {
        setPosts(transformedPosts);
        setHasLoadedOnce(true);
        try {
          const cacheKey = getFeedCacheKey(user?.id);
          localStorage.setItem(cacheKey, JSON.stringify({ posts: transformedPosts, ts: Date.now() }));
        } catch {}
        console.log('✅ PostsContext: Successfully loaded initial posts:', transformedPosts.length);
        
        // Log first post details for debugging
        if (transformedPosts.length > 0) {
          const firstPost = transformedPosts[0];
          console.log('📝 PostsContext: First post preview:', {
            id: firstPost.id.slice(0, 8),
            user: firstPost.user_name,
            content: firstPost.content.text?.slice(0, 50) || 'No text',
            images: firstPost.content.images?.length || 0,
            time: firstPost.time
          });
        }
      } else {
        setPosts(prev => {
          const next = [...prev, ...transformedPosts];
          try {
            const cacheKey = getFeedCacheKey(user?.id);
            localStorage.setItem(cacheKey, JSON.stringify({ posts: next, ts: Date.now() }));
          } catch {}
          return next;
        });
        console.log('✅ PostsContext: Successfully loaded more posts:', transformedPosts.length);
      }

      // Update last post ID for pagination
      if (transformedPosts.length > 0) {
        setLastPostId(transformedPosts[transformedPosts.length - 1].id);
      }
      
    } catch (error) {
      console.error('❌ PostsContext: Critical error loading posts:', error);
      
      // More specific error handling
      if (error?.message?.includes('timeout')) {
        console.error('⏰ PostsContext: Request timed out - database may be slow');
      } else if (error?.code === '42501') {
        console.error('🔒 PostsContext: Permission denied - RLS policy issue');
      } else if (error?.code?.startsWith('42')) {
        console.error('🗄️ PostsContext: Database schema issue:', error.message);
      }
      
      if (isInitial) {
        // Keep existing posts to avoid empty feed on errors
        setHasMorePosts(false);
      }
    } finally {
      if (isInitial) {
        setIsLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  }, [transformPosts, POSTS_PER_PAGE, user]);


  // Load more posts function
  const loadMorePosts = useCallback(async () => {
    if (isLoadingMore || !hasMorePosts || !lastPostId) {
      return;
    }
    
    await loadPosts(false, lastPostId);
  }, [isLoadingMore, hasMorePosts, lastPostId, loadPosts]);

  // Refresh posts function
  const refreshPosts = useCallback(async () => {
    setLastPostId(null);
    setHasMorePosts(true);
    await loadPosts(true);
  }, [loadPosts]);

  // Optimized posts loading with better auth state handling
  useEffect(() => {
    const currentPath = window.location.pathname;
    
    console.log('🔍 PostsContext: Auth state check', {
      hasUser: !!user,
      userId: user?.id,
      path: currentPath,
      authLoading
    });
    
    // Skip loading for auth routes and admin routes
    if (currentPath.startsWith('/auth/') || currentPath.startsWith('/admin/')) {
      console.log('📋 PostsContext: Auth/Admin route detected, skipping posts');
      setIsLoading(false);
      setPosts([]);
      return;
    }
    
    // Wait for auth to complete before making decisions
    if (authLoading) {
      console.log('⏳ PostsContext: Waiting for auth to complete...');
      return;
    }
    
    // Auth is complete - make decisions based on user state
    if (user?.id) {
      // Hydrate from cache first to avoid flicker
      let hydrated = false;
      if (!hasLoadedOnce) {
        try {
          const cacheKey = getFeedCacheKey(user.id);
          const raw = localStorage.getItem(cacheKey);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.posts?.length) {
              setPosts(parsed.posts);
              setHasLoadedOnce(true);
              setIsLoading(false);
              hydrated = true;
              console.log('💾 PostsContext: Hydrated feed from cache:', parsed.posts.length);
            }
          }
        } catch {}
      }

      // If not hydrated, perform initial load
      if (!hydrated && !hasLoadedOnce && !initialLoadStartedRef.current) {
        initialLoadStartedRef.current = true;
        console.log('🚀 PostsContext: User authenticated, loading posts');
        loadPosts(true);
      } else {
        console.log('📋 PostsContext: Using cached posts without background refresh');
        setIsLoading(false);
      }
    } else {
      console.log('🚫 PostsContext: No user - clearing posts state');
      setPosts([]);
      setIsLoading(false);
      setHasMorePosts(true);
      setLastPostId(null);
      setHasLoadedOnce(false);
    }
  }, [user?.id, authLoading, hasLoadedOnce, loadPosts]);
  // Simplified real-time subscription - no automatic refreshes
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('posts-simple')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
          // Only add new posts to the top, don't refresh entire feed
          try {
            const newPost = transformPosts([payload.new])[0];
            if (newPost && payload.new.user_id !== user.id) {
              setPosts(prev => [newPost, ...prev]);
            }
          } catch (error) {
            console.error('Error adding new post:', error);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'posts' },
        (payload) => {
          // Update specific post without affecting scroll
          try {
            const updatedPost = transformPosts([payload.new])[0];
            if (updatedPost) {
              setPosts(prev => prev.map(post => 
                post.id === updatedPost.id ? updatedPost : post
              ));
            }
          } catch (error) {
            console.error('Error updating post:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, transformPosts]);

  // Optimized addPost function with better performance using safe database function
  const addPost = useCallback(async (newPostData: CreatePostData) => {
    if (!user) {
      console.error('❌ User not authenticated, cannot create post');
      return;
    }

    try {
      // Use current profile username or fallback to provided name
      const displayUserName = userInfo.username || newPostData.user.name || userInfo.first_name || 'User';
      
      console.log('📝 Creating post with safe function:', {
        user_id: user.id,
        user_name: displayUserName,
        content: newPostData.content
      });
      
      // PERFORMANCE FIX: Use safe database function to avoid foreign key constraints
      const result = await supabase.rpc('create_post_safe', {
        p_user_id: user.id,
        p_user_name: displayUserName,
        p_user_image: newPostData.user.image,
        p_user_verified: newPostData.user.verified || false,
        p_content_text: newPostData.content.text,
        p_content_images: newPostData.content.images,
        p_visibility: newPostData.visibility || 'public',
        p_is_sponsored: newPostData.is_sponsored || false,
        p_post_type: newPostData.postType || 'regular'
      });

      const { data, error } = result;

      if (error) {
        console.error('❌ Failed to save post to database:', error);
        throw error;
      }

      if (!data) {
        console.error('❌ No data returned from safe post creation');
        throw new Error('Post creation failed - no data returned');
      }

      console.log('✅ Post created successfully with safe function:', data.id);

      // Transform and add to local state immediately
      const newPost: Post = {
        id: data.id,
        user_id: data.user_id,
        user_name: data.user_name,
        user_image: data.user_image,
        user_verified: data.user_verified || false,
        content: {
          text: data.content_text,
          images: data.content_images || []
        },
        reactions_count: 0,
        comments_count: 0,
        shares_count: 0,
        reactions_types: [],
        created_at: data.created_at,
        updated_at: data.updated_at,
        is_sponsored: data.is_sponsored || false,
        location: data.location,
        visibility: data.visibility || 'public',
        post_type: data.post_type || 'text',
        user: newPostData.user,
        time: 'just now',
        reactions: {
          count: 0,
          types: []
        },
        comments: 0,
        shares: 0
      };

      // Add new post to the beginning (newest first) 
      setPosts(prev => [newPost, ...prev]);
      console.log('✅ Post permanently saved to database:', data.id);
      
    } catch (error) {
      console.error('❌ Failed to save post:', error);
      throw error;
    }
  }, [user, userInfo]);

  // Optimized update and delete functions
  const updatePost = useCallback(async (id: string, updates: Partial<Post>) => {
    try {
      // PERFORMANCE FIX: Direct database update without timeout
      const result = await supabase
        .from('posts')
        .update({
          content_text: updates.content?.text,
          content_images: updates.content?.images,
          reactions_count: updates.reactions_count,
          comments_count: updates.comments_count,
          shares_count: updates.shares_count,
          reactions_types: updates.reactions_types,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      const { error } = result;

      if (error) {
        console.error('❌ Failed to update post in database:', error);
        throw error;
      }

      // Update local state
      setPosts(prev => prev.map(post => 
        post.id === id 
          ? { ...post, ...updates, updated_at: new Date().toISOString() }
          : post
      ));
      console.log('✅ Post updated in database:', id);
      
    } catch (error) {
      console.error('❌ Failed to update post:', error);
    }
  }, []);

  const deletePost = useCallback(async (id: string) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      console.log('🔄 Attempting to delete post:', id, 'by user:', user.id);
      
      // Optimistically remove from UI immediately for better UX
      setPosts(prev => {
        const filtered = prev.filter(post => post.id !== id);
        console.log('🔄 Post removed from UI, remaining posts:', filtered.length);
        return filtered;
      });

      // Direct database deletion with proper ownership check - no timeout
      const { error, count } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Only delete if user owns the post

      if (error) {
        console.error('❌ Database deletion failed:', error);
        // Don't restore post to UI - keep it removed for better UX
        throw new Error('Failed to delete post from database');
      }

      if (count === 0) {
        console.warn('⚠️ No post was deleted - ownership check failed');
        throw new Error('You can only delete your own posts');
      }

      console.log('✅ Post permanently deleted from database:', id);
      
    } catch (error) {
      console.error('❌ Delete operation failed:', error);
      // Keep post removed from UI even on error to prevent confusion
      throw error;
    }
  }, [user?.id]);

  // Memoized context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    posts,
    isLoading,
    isLoadingMore,
    hasMorePosts,
    hasLoadedOnce,
    setPosts,
    addPost,
    updatePost,
    deletePost,
    loadMorePosts,
    refreshPosts,
  }), [posts, isLoading, isLoadingMore, hasMorePosts, hasLoadedOnce, addPost, updatePost, deletePost, loadMorePosts, refreshPosts]);

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};