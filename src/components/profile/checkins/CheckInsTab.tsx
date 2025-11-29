
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface CheckIn {
  id: number;
  location: string;
  area?: string;
  date: string;
  imageUrl?: string;
}

interface CheckInsTabProps {
  checkIns: CheckIn[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const CheckInsTab: React.FC<CheckInsTabProps> = ({ checkIns, activeTab, setActiveTab }) => {
  const tabOptions = [
    { id: 'recent', label: 'Recent' },
    { id: 'all-visits', label: 'All visits' }
  ];
  
  return (
    <div className="w-full">
      {/* CheckIns tabs navigation */}
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
      
      {/* CheckIns list */}
      {checkIns.length > 0 ? (
        <div className="space-y-4">
          {checkIns.map(checkIn => (
            <div key={checkIn.id} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md cursor-pointer">
              <div className="h-12 w-12 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                {checkIn.imageUrl ? (
                  <img src={checkIn.imageUrl} alt={checkIn.location} className="w-full h-full object-cover" />
                ) : (
                  <MapPin className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{checkIn.location}</p>
                {checkIn.area && <p className="text-sm text-gray-500">{checkIn.area}</p>}
                <p className="text-xs text-gray-400">Visited on {checkIn.date}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <MapPin size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500">No check-ins to display</p>
        </div>
      )}
      
      {/* See all button */}
      {checkIns.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" className="w-full py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium">
            See all
          </Button>
        </div>
      )}
    </div>
  );
};

export default CheckInsTab;
