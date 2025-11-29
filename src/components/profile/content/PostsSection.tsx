
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import ProfileIntroCard from '../ProfileIntroCard';
import PhotosCard from '../PhotosCard';
import FriendsCard from '../FriendsCard';
import Post from '@/components/Post';
import CreatePostCard from '@/components/feed/CreatePostCard';
import { usePostsData } from '@/contexts/posts/usePostsData';
import { useAuth } from '@/contexts/AuthContext';

const PostsSection: React.FC = () => {
  const { posts, isLoading, fetchPosts } = usePostsData();
  const { user } = useAuth();
  
  // Load posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  
  const userPosts = posts.filter(p => p.user_id === user?.id);

  const mockUserDetails = {
    location: 'San Francisco, CA',
    workplace: 'Lovable',
    education: 'University of AI',
    relationship: 'Single',
    joined: '2024',
    hometown: 'Internet',
  };

  const mockPhotos = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    image: `https://picsum.photos/id/${i + 10}/200/200`,
  }));

  const mockFriends = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    name: `Friend ${i + 1}`,
    image: `https://i.pravatar.cc/150?img=${i + 1}`,
  }));


  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-5 space-y-4">
        <ProfileIntroCard />
        <PhotosCard photos={mockPhotos} />
        <FriendsCard friends={mockFriends} totalCount={123} />
      </div>
      <div className="col-span-12 lg:col-span-7 space-y-4">
        <CreatePostCard />
        {isLoading ? (
            <div className="bg-white rounded-lg border border-gray-100 p-4 text-center text-muted-foreground">
              Posts loading...
            </div>
        ) : userPosts.length > 0 ? (
          userPosts.map(post => <Post key={post.id} post={post} />)
        ) : (
          <Card className="p-4 text-center text-muted-foreground bg-white border-gray-100">
            You haven't created your first post at Shqipet yet, please.
          </Card>
        )}
      </div>
    </div>
  );
};

export default PostsSection;
