
import React from 'react';
import { Button } from '@/components/ui/button';
import { Film } from 'lucide-react';

interface Movie {
  id: number;
  name: string;
  imageUrl: string;
}

interface MoviesTabProps {
  movies: Movie[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MoviesTab: React.FC<MoviesTabProps> = ({ movies, activeTab, setActiveTab }) => {
  const tabOptions = [
    { id: 'watched', label: 'Watched' },
    { id: 'movies', label: 'Movies' }
  ];
  
  return (
    <div className="w-full">
      {/* Movies tabs navigation */}
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
      
      {/* Movie content */}
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {movies.map(movie => (
            <div key={movie.id} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md cursor-pointer">
              <div className="h-14 w-14 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                {movie.imageUrl ? (
                  <img src={movie.imageUrl} alt={movie.name} className="w-full h-full object-cover" />
                ) : (
                  <Film className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{movie.name}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <Film size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500">No {activeTab === 'watched' ? 'watched movies' : 'movies'} to display</p>
        </div>
      )}
      
      {/* See all button */}
      {movies.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" className="w-full py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium">
            See all
          </Button>
        </div>
      )}
    </div>
  );
};

export default MoviesTab;
