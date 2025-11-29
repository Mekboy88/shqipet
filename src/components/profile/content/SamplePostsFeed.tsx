import React from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, Globe } from 'lucide-react';

const SamplePostsFeed: React.FC = () => {
  const samplePosts = [
    {
      id: 1,
      author: 'Përdoruesi',
      time: '2 orë më parë',
      content: 'Sot fillova një projekt të ri në React dhe TypeScript. Ëndrra e programuesit është të shkruaj kod të pastër dhe efikas! 💻✨',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
      likes: 24,
      comments: 5,
      shares: 2,
      privacy: 'public'
    },
    {
      id: 2,
      author: 'Përdoruesi',
      time: '1 ditë më parë',
      content: 'Bukuria e natyrës në Kosovë është vërtet magjepsëse! 🏔️🌲 #Kosovo #Nature',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      likes: 58,
      comments: 12,
      shares: 8,
      privacy: 'public'
    },
    {
      id: 3,
      author: 'Përdoruesi',
      time: '3 ditë më parë',
      content: 'Çdo ditë është një mundësi e re për të mësuar diçka të re. Sot mësova për Web Components dhe jam i mahnitur! 🚀',
      likes: 31,
      comments: 7,
      shares: 4,
      privacy: 'public'
    }
  ];

  return (
    <div className="space-y-6">
      {samplePosts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Post Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                P
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{post.author}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{post.time}</span>
                  <span>•</span>
                  <Globe className="w-3 h-3" />
                </div>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Post Content */}
          <div className="px-4 pb-3">
            <p className="text-gray-800 leading-relaxed">{post.content}</p>
          </div>

          {/* Post Image */}
          {post.image && (
            <div className="px-4 pb-3">
              <img 
                src={post.image} 
                alt="Post content" 
                className="w-full rounded-lg object-cover max-h-80"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Post Stats */}
          <div className="px-4 py-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{post.likes} pëlqime</span>
              <div className="flex items-center space-x-4">
                <span>{post.comments} komente</span>
                <span>{post.shares} ndarje</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-4 py-3 border-t border-gray-100">
            <div className="flex items-center justify-around">
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 flex-1 justify-center">
                <Heart className="w-5 h-5" />
                <span className="font-medium">Pëlqej</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200 flex-1 justify-center">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">Komento</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all duration-200 flex-1 justify-center">
                <Share className="w-5 h-5" />
                <span className="font-medium">Ndaj</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SamplePostsFeed;