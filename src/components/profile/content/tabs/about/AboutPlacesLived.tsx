
import React from 'react';
import { MapPin, Home } from 'lucide-react';
import { UserDetails } from './UserDetails';

interface AboutPlacesLivedProps {
  details: UserDetails;
}

const AboutPlacesLived: React.FC<AboutPlacesLivedProps> = ({ details }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Places Lived</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
          <div className="bg-gray-100 p-2 rounded-md">
            <MapPin className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <div>Lives in <span className="font-semibold">{details.location}</span></div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
          <div className="bg-gray-100 p-2 rounded-md">
            <Home className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <div>From <span className="font-semibold">{details.hometown}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPlacesLived;
