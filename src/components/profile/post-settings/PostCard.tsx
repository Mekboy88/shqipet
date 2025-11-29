
import React, { useState } from 'react';
import Avatar from '@/components/Avatar';
import { Globe, Check } from 'lucide-react';
import PhotoGrid from './PhotoGrid';
import { Post } from './types';

interface PostProps {
  post: Post;
}

const PostCard: React.FC<PostProps> = ({ post }) => {
  const [isSelected, setIsSelected] = useState(false);

  const toggleSelection = () => {
    setIsSelected(!isSelected);
  };

  return (
    <div 
      key={post.id} 
      className={`bg-white rounded-lg border ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} shadow-sm p-4 mb-8 last:mb-0 cursor-pointer relative transition-all duration-200`}
      onClick={toggleSelection}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}

      {/* Photo grid layout with Facebook-style collage */}
      <PhotoGrid photos={post.photos} />
      
      {/* Post Info - Moved below photos like in Facebook */}
      <div className="flex items-center mt-3">
        <Avatar 
          size="sm"
          src={post.user.image}
          initials={`${post.user.name.charAt(0)}${post.user.name.split(' ')[1]?.charAt(0) || ''}`}
          className="mr-2 img-locked"
        />
        <div className="flex-1">
          <div className="text-sm font-semibold">{post.content}</div>
          <div className="flex items-center text-xs text-gray-500">
            <span>{post.date}</span>
            <span className="mx-1">·</span>
            <Globe className="h-3 w-3 inline mr-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
