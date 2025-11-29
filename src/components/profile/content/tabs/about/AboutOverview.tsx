
import React from 'react';
import { Briefcase, School, MapPin, HeartHandshake, Home } from 'lucide-react';
import { InfoItem } from './InfoItem';
import { UserDetails } from './UserDetails';

interface AboutOverviewProps {
  details: UserDetails;
}

const AboutOverview: React.FC<AboutOverviewProps> = ({ details }) => {
  return (
    <div className="space-y-4">
      {/* Workplace info */}
      <InfoItem icon={<Briefcase className="h-5 w-5 text-gray-500" />}>
        <span>Internship at </span>
        <span className="font-semibold">{details.workplace}</span>
      </InfoItem>
      
      {/* Education info */}
      <InfoItem icon={<School className="h-5 w-5 text-gray-500" />}>
        <div>
          <span>Studies at </span>
          <span className="font-semibold">{details.education}</span>
        </div>
        <div className="text-xs text-gray-500">Started in {details.startYear}</div>
      </InfoItem>
      
      {/* Location info */}
      <InfoItem icon={<MapPin className="h-5 w-5 text-gray-500" />}>
        <span>Lives in </span>
        <span className="font-semibold">{details.location}</span>
      </InfoItem>
      
      {/* Hometown info */}
      <InfoItem icon={<Home className="h-5 w-5 text-gray-500" />}>
        <span>From </span>
        <span className="font-semibold">{details.hometown}</span>
      </InfoItem>
      
      {/* Relationship info */}
      <InfoItem icon={<HeartHandshake className="h-5 w-5 text-gray-500" />}>
        <div>
          <span>{details.relationship}</span>
        </div>
        <div className="text-xs text-gray-500">Since {details.relationshipDate}</div>
      </InfoItem>
    </div>
  );
};

export default AboutOverview;
