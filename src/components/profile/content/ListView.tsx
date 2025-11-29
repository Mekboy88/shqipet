
import React from 'react';
import Post from '@/components/Post';
import { PostData } from './types';

interface ListViewProps {
  posts: PostData[];
}
const ListView: React.FC<ListViewProps> = ({
  posts
}) => {
  return <div className="space-y-4 my-0">
      {posts.map(post => <Post key={post.id} post={post} />)}
    </div>;
};
export default ListView;
