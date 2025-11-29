
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tv } from 'lucide-react';

interface TVShow {
  id: number;
  name: string;
  imageUrl: string;
}

interface TVShowsTabProps {
  shows: TVShow[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TVShowsTab: React.FC<TVShowsTabProps> = ({ shows, activeTab, setActiveTab }) => {
  const tabOptions = [
    { id: 'watched', label: 'Watched' },
    { id: 'tv-shows', label: 'TV Shows' }
  ];
  
  return (
    <div className="w-full">
      {/* TV Shows tabs navigation */}
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
      
      {/* TV Shows content */}
      {shows.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {shows.map(show => (
            <div key={show.id} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md cursor-pointer">
              <div className="h-14 w-14 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                {show.imageUrl ? (
                  <img src={show.imageUrl} alt={show.name} className="w-full h-full object-cover" />
                ) : (
                  <Tv className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{show.name}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <Tv size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500">No {activeTab === 'watched' ? 'watched TV shows' : 'TV shows'} to display</p>
        </div>
      )}
      
      {/* See all button */}
      {shows.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" className="w-full py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium">
            See all
          </Button>
        </div>
      )}
    </div>
  );
};

export default TVShowsTab;
