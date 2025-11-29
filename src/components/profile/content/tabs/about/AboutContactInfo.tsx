
import React from 'react';
import { Phone, Mail, Globe } from 'lucide-react';
import { UserDetails } from './UserDetails';

interface AboutContactInfoProps {
  details: UserDetails;
}

const AboutContactInfo: React.FC<AboutContactInfoProps> = ({ details }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Contact and Basic Info</h3>
      <div className="space-y-4">
        <div>
          <h4 className="text-md font-medium mb-2">Contact Info</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
              <div className="bg-gray-100 p-2 rounded-md">
                <Phone className="h-5 w-5 text-gray-500" />
              </div>
              <span>{details.phone}</span>
            </div>
            
            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
              <div className="bg-gray-100 p-2 rounded-md">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <span>{details.email}</span>
            </div>
            
            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
              <div className="bg-gray-100 p-2 rounded-md">
                <Globe className="h-5 w-5 text-gray-500" />
              </div>
              <span>{details.website}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutContactInfo;
