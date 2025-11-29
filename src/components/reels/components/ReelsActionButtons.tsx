
import React from 'react';
import { Heart, MessageCircle, Share, MoreVertical } from 'lucide-react';

interface ReelsActionButtonsProps {
  liked: boolean;
  views: string;
  onLike: () => void;
}

const ReelsActionButtons: React.FC<ReelsActionButtonsProps> = ({ liked, views, onLike }) => {
  return (
    <div className="absolute bottom-20 right-4 flex flex-col items-center space-y-6">
      <button 
        className="flex flex-col items-center"
        onClick={(e) => {
          e.stopPropagation();
          onLike();
        }}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${liked ? 'bg-red-500' : 'bg-white/20'}`}>
          <Heart className={`w-6 h-6 ${liked ? 'text-white fill-current' : 'text-white'}`} />
        </div>
        <span className="text-white text-xs mt-1">{liked ? parseInt(views) + 1 + 'K' : views}</span>
      </button>

      <button className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <span className="text-white text-xs mt-1">{Math.floor(Math.random() * 100)}</span>
      </button>

      <button className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <Share className="w-6 h-6 text-white" />
        </div>
        <span className="text-white text-xs mt-1">{Math.floor(Math.random() * 50)}</span>
      </button>

      <button className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <MoreVertical className="w-6 h-6 text-white" />
        </div>
      </button>
    </div>
  );
};

export default ReelsActionButtons;
