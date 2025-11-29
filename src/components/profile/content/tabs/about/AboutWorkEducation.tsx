
import React from 'react';
import { Briefcase, School } from 'lucide-react';
import { UserDetails } from './UserDetails';

interface AboutWorkEducationProps {
  details: UserDetails;
}

const AboutWorkEducation: React.FC<AboutWorkEducationProps> = ({ details }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Work and Education</h3>
      <div className="space-y-4">
        <div className="pb-4">
          <h4 className="text-md font-medium mb-2">Work</h4>
          <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
            <div className="bg-gray-100 p-2 rounded-md">
              <Briefcase className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <div>{details.position} at <span className="font-semibold">{details.workplace}</span></div>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <h4 className="text-md font-medium mb-2">Education</h4>
          <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
            <div className="bg-gray-100 p-2 rounded-md">
              <School className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <div>Studies at <span className="font-semibold">{details.education}</span></div>
              <div className="text-sm text-gray-500">Started in {details.startYear}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutWorkEducation;
