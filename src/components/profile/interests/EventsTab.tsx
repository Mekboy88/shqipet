
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

// Define the Event interface based on the InterestItem properties we're using
interface Event {
  id: number;
  name: string;
  location: string;
  date: string;
  imageUrl?: string;
  organizer?: string;
}

interface EventsTabProps {
  events: Event[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const EventsTab: React.FC<EventsTabProps> = ({ events, activeTab, setActiveTab }) => {
  const tabOptions = [
    { id: 'past', label: 'Past' }
  ];
  
  return (
    <div className="w-full">
      {/* Events tabs navigation */}
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
      
      {/* Events content */}
      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="flex border-b pb-4 mb-2 last:border-0 hover:bg-gray-50 p-2 rounded-md cursor-pointer">
              <div className="mr-3">
                <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Calendar className="text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm">{event.date}</p>
                <p className="font-medium">{event.name}</p>
                <p className="text-gray-600 text-sm">{event.location}</p>
                {event.organizer && (
                  <p className="text-gray-500 text-sm">Event by {event.organizer}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <Calendar size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500">No events to display</p>
        </div>
      )}
    </div>
  );
};

export default EventsTab;
