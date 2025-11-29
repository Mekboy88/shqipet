
import React from 'react';
import { ThumbsUp } from 'lucide-react';

interface PostStatsProps {
  reactions: {
    count: number;
    types: string[];
  };
  comments: number;
  shares: number;
}

const PostStats: React.FC<PostStatsProps> = ({ reactions, comments, shares }) => {
  return (
    <div className="flex justify-between items-center text-sm text-gray-500 py-2">
        <div className="flex items-center space-x-1">
            {reactions.count > 0 && (
                <>
                    <div className="flex items-center -space-x-1">
                        <span className='bg-blue-500 text-white rounded-full p-0.5 z-10'>
                            <ThumbsUp size={12}/>
                        </span>
                    </div>
                    <span className="hover:underline cursor-pointer">{reactions.count}</span>
                </>
            )}
        </div>
        <div className="flex items-center space-x-4">
            {comments > 0 && <span className="hover:underline cursor-pointer">{comments} {comments === 1 ? "comment" : "comments"}</span>}
            {shares > 0 && <span className="hover:underline cursor-pointer">{shares} {shares === 1 ? "share" : "shares"}</span>}
        </div>
    </div>
  );
};

export default PostStats;
