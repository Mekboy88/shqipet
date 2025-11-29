import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trash2 } from 'lucide-react';
import { usePostsData } from '@/contexts/posts/usePostsData';
import supabase from '@/lib/relaxedSupabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface DeletedPost {
  id: string;
  content_text: string;
  deleted_at: string;
  user_name: string;
}

const DeletedPostsSection: React.FC = () => {
  const [deletedPosts, setDeletedPosts] = useState<DeletedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { restorePost } = usePostsData();
  const { user } = useAuth();

  const fetchDeletedPosts = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('id, content_text, deleted_at, user_name')
        .eq('user_id', user.id)
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false });

      if (error) {
        console.error('Error fetching deleted posts:', error);
        return;
      }

      setDeletedPosts(data || []);
    } catch (error) {
      console.error('Error fetching deleted posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedPosts();
  }, [user]);

  const handleRestorePost = async (postId: string) => {
    try {
      await restorePost(postId);
      // Remove from deleted posts list
      setDeletedPosts(prev => prev.filter(post => post.id !== postId));
      toast.success('Post restored successfully!');
    } catch (error) {
      console.error('Error restoring post:', error);
      toast.error('Failed to restore post');
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    return 'Over 30 days ago (will be permanently deleted soon)';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Recently Deleted Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Loading deleted posts...</p>
        </CardContent>
      </Card>
    );
  }

  if (deletedPosts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Recently Deleted Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No deleted posts found.</p>
          <p className="text-xs text-gray-400 mt-2">
            Posts are kept for 30 days after deletion and can be restored during this period.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Recently Deleted Posts ({deletedPosts.length})
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          You have {deletedPosts.length} deleted post(s) that can be restored within 30 days.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {deletedPosts.map((post) => (
          <div
            key={post.id}
            className="flex items-start justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 line-clamp-2 mb-2">
                {post.content_text?.substring(0, 100) || 'No text content'}
                {post.content_text && post.content_text.length > 100 && '...'}
              </p>
              <p className="text-xs text-gray-500">
                Deleted: {formatRelativeTime(post.deleted_at)}
              </p>
            </div>
            <Button
              onClick={() => handleRestorePost(post.id)}
              size="sm"
              variant="outline"
              className="ml-3 flex-shrink-0 border-green-200 hover:bg-green-50 text-green-700 hover:text-green-800"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Restore
            </Button>
          </div>
        ))}
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> Posts are automatically permanently deleted after 30 days. 
            Restored posts will appear back on your profile and in the feed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeletedPostsSection;