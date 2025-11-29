
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';

interface Like {
  id: number;
  name: string;
  imageUrl: string;
  category?: string;
}

interface LikesTabProps {
  likes: Like[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const LikesTab: React.FC<LikesTabProps> = ({ likes, activeTab, setActiveTab }) => {
  const tabOptions = [
    { id: 'all-likes', label: 'All Likes' },
    { id: 'movies', label: 'Movies' },
    { id: 'tv-shows', label: 'TV Shows' },
    { id: 'artists', label: 'Artists' },
    { id: 'books', label: 'Books' },
    { id: 'sports-teams', label: 'Sports Teams' },
    { id: 'athletes', label: 'Athletes' },
    { id: 'people', label: 'People' },
    { id: 'restaurants', label: 'Restaurants' },
    { id: 'apps-and-games', label: 'Apps and Games' }
  ];
  
  // Filter likes based on active tab if needed
  const filteredLikes = activeTab === 'all-likes' 
    ? likes 
    : likes.filter(like => like.category === activeTab);
  
  return (
    <div className="w-full">
      {/* Likes tabs navigation - scrollable horizontally */}
      <div className="overflow-x-auto pb-2">
        <div className="flex border-b min-w-max">
          {tabOptions.map((tab) => (
            <Button 
              key={tab.id}
              variant="ghost"
              className={`py-2 px-4 rounded-none font-medium whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Likes content */}
      {filteredLikes.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {filteredLikes.map(like => (
            <div key={like.id} className="flex flex-col items-center text-center space-y-2 p-2 cursor-pointer">
              <div className="h-24 w-24 bg-gray-100 rounded-md overflow-hidden">
                {like.imageUrl ? (
                  <img src={like.imageUrl} alt={like.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ThumbsUp className="text-gray-400" />
                  </div>
                )}
              </div>
              <p className="font-medium text-sm">{like.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <ThumbsUp size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500">No likes to display</p>
        </div>
      )}
      
      {/* See all button */}
      {filteredLikes.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" className="w-full py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium">
            See all
          </Button>
        </div>
      )}
    </div>
  );
};

export default LikesTab;
