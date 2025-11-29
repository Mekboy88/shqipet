
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dumbbell } from 'lucide-react';

interface Sport {
  id: number;
  name: string;
  imageUrl: string;
}

interface SportsTabProps {
  sports: Sport[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SportsTab: React.FC<SportsTabProps> = ({ sports, activeTab, setActiveTab }) => {
  const tabOptions = [
    { id: 'sports-teams', label: 'Sports Teams' },
    { id: 'athletes', label: 'Athletes' }
  ];
  
  return (
    <div className="w-full">
      {/* Sports tabs navigation */}
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
      
      {/* Sports grid */}
      {sports.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {sports.map(sport => (
            <div key={sport.id} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md cursor-pointer">
              <div className="h-14 w-14 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                {sport.imageUrl ? (
                  <img src={sport.imageUrl} alt={sport.name} className="w-full h-full object-cover" />
                ) : (
                  <Dumbbell className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium line-clamp-2">{sport.name}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <Dumbbell size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500">No sports to display</p>
        </div>
      )}
      
      {/* See all button */}
      {sports.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" className="w-full py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium">
            See all
          </Button>
        </div>
      )}
    </div>
  );
};

export default SportsTab;
