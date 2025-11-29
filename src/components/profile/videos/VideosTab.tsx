
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface Video {
  id: number;
  thumbnail: string;
  duration: string;
  title?: string;
}

interface VideosTabProps {
  videos: Video[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const VideosTab: React.FC<VideosTabProps> = ({ videos, activeTab, setActiveTab }) => {
  const tabOptions = [
    { id: 'your-videos', label: 'Your Videos' },
    { id: 'saved-videos', label: 'Saved videos' }
  ];
  
  return (
    <div className="w-full">
      {/* Video tabs navigation */}
      <div className="flex border-b mb-4 w-full">
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
      
      {/* Videos grid */}
      {videos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 w-full">
          {videos.map(video => (
            <div key={video.id} className="relative group cursor-pointer">
              <div className="aspect-video overflow-hidden rounded-md">
                <img 
                  src={video.thumbnail} 
                  alt={`Video ${video.id}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="text-white h-10 w-10" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                  {video.duration}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 w-full">
          <Play size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500">No videos to display</p>
        </div>
      )}
      
      {/* See all button */}
      {videos.length > 0 && (
        <div className="mt-4 flex justify-center w-full">
          <Button variant="outline" className="w-full py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium">
            See all
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideosTab;
