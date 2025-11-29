
import React from 'react';
import { Circle, MoreHorizontal } from 'lucide-react';

export interface InfoItemProps {
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const InfoItem: React.FC<InfoItemProps> = ({ icon, children }) => {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
      <div className="flex items-center">
        <div className="bg-gray-100 p-2 rounded-md mr-4">
          {icon}
        </div>
        <div>{children}</div>
      </div>
      <div className="flex gap-1">
        <button className="p-2 hover:bg-gray-200 rounded-full">
          <Circle className="h-1 w-1 text-gray-500" />
        </button>
        <button className="p-2 hover:bg-gray-200 rounded-full">
          <MoreHorizontal className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default InfoItem;
