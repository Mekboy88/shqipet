
import React from 'react';
import { HeartHandshake } from 'lucide-react';
import { UserDetails } from './UserDetails';

interface AboutFamilyRelationshipsProps {
  details: UserDetails;
}

const AboutFamilyRelationships: React.FC<AboutFamilyRelationshipsProps> = ({ details }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Family and Relationships</h3>
      <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
        <div className="bg-gray-100 p-2 rounded-md">
          <HeartHandshake className="h-5 w-5 text-gray-500" />
        </div>
        <div>
          <div>{details.relationship}</div>
          <div className="text-sm text-gray-500">Since {details.relationshipDate}</div>
        </div>
      </div>
    </div>
  );
};

export default AboutFamilyRelationships;
