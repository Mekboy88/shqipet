
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import Post from '@/components/Post';
import ViewToggle from '@/components/profile/post-settings/ViewToggle';
import { Filter, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ListView from '@/components/profile/post-settings/ListView';
import GridView from '@/components/profile/post-settings/GridView';
import { MonthSection } from '@/components/profile/post-settings/types';

interface PostsTabProps {
  userProfile: any;
  profilePosts: any[];
}

const PostsTab: React.FC<PostsTabProps> = ({ userProfile, profilePosts }) => {
  const [activeView, setActiveView] = useState<'list' | 'grid'>('list');
  
  // Transform user posts to match MonthSection format for grid view
  const transformToGridFormat = (posts: any[]): MonthSection[] => {
    if (posts.length === 0) return [];
    
    const postsByMonth: { [key: string]: MonthSection } = posts.reduce((acc: { [key: string]: MonthSection }, post) => {
      const date = new Date(post.created_at);
      const monthKey = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: date.toLocaleString('default', { month: 'long' }),
          year: date.getFullYear().toString(),
          posts: []
        };
      }
      
      acc[monthKey].posts.push({
        id: post.id,
        user: {
          name: post.user_name,
          image: post.user_image || post.user.image
        },
        date: date.toLocaleDateString('default', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        content: post.content.text,
        photos: post.content.images?.map((img: string, index: number) => ({
          id: index + 1,
          url: img
        })) || [],
        privacy: post.visibility || 'public'
      });
      
      return acc;
    }, {});
    
    return Object.values(postsByMonth);
  };
  
  const userPostsByMonth = transformToGridFormat(profilePosts);
  
  return (
    <div className="space-y-4">
      {/* Posts filters section */}
      <Card className="p-4 shadow-sm bg-white border border-gray-200 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold">Posts</h3>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700 font-medium text-sm flex items-center gap-1">
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>
            <Button variant="outline" className="bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700 font-medium text-sm flex items-center gap-1">
              <Settings className="h-4 w-4 mr-1" />
              Manage posts
            </Button>
          </div>
        </div>
        
        <ViewToggle activeView={activeView} setActiveView={setActiveView} />
      </Card>

      {/* Conditional rendering based on view type */}
      {profilePosts.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          <p className="text-lg">Ende nuk keni krijuar postimin tuaj të parë në Shqipet.</p>
          
        </Card>
      ) : activeView === 'list' ? (
        // List view - standard post cards
        <div className="space-y-4">
          {profilePosts.map(post => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      ) : (
        // Grid view - using user posts instead of static data
        <GridView postsByMonth={userPostsByMonth} />
      )}
    </div>
  );
};

export default PostsTab;
