
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface Reel {
  id: number;
  thumbnail: string;
  views?: string;
  title?: string;
}

interface ReelsTabProps {
  reels: Reel[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ReelsTab: React.FC<ReelsTabProps> = ({ reels, activeTab, setActiveTab }) => {
  const tabOptions = [
    { id: 'your-reels', label: 'Your Reels' },
    { id: 'saved-reels', label: 'Saved reels' }
  ];
  
  return (
    <div className="w-full">
      {/* Reels tabs navigation */}
      <div className="flex border-b mb-4">
        {tabOptions.map((tab) => (
          <Button 
            key={tab.id}
            variant="ghost"
            className={`py-2 px-4 rounded-none font-medium ${
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
      
      {/* Reels grid */}
      {reels.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {reels.map(reel => (
            <div key={reel.id} className="relative group cursor-pointer">
              <div className="aspect-video overflow-hidden rounded-md">
                <img 
                  src={reel.thumbnail} 
                  alt={`Reel ${reel.id}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="text-white h-10 w-10" />
                </div>
                {reel.views && (
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                    {reel.views} views
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <Play size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500">{activeTab === 'your-reels' ? "You haven't created any reels yet." : "No saved reels to display"}</p>
        </div>
      )}
      
      {/* See all button */}
      {reels.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" className="w-full py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium">
            See all
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReelsTab;
