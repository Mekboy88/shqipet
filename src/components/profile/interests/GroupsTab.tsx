
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

// Update the Group interface to match what we're filtering in AboutTabSections
interface Group {
  id: number;
  name: string;
  members: string;  // This is required now
  imageUrl?: string;
  isPublic?: boolean;
}

interface GroupsTabProps {
  groups: Group[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const GroupsTab: React.FC<GroupsTabProps> = ({ groups, activeTab, setActiveTab }) => {
  const tabOptions = [
    { id: 'public', label: 'Public' }
  ];
  
  return (
    <div className="w-full">
      {/* Groups tabs navigation */}
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
      
      {/* Groups content */}
      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map(group => (
            <div key={group.id} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md cursor-pointer">
              <div className="h-16 w-16 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                {group.imageUrl ? (
                  <img src={group.imageUrl} alt={group.name} className="w-full h-full object-cover" />
                ) : (
                  <Users className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{group.name}</p>
                <div className="flex items-center text-xs text-gray-500">
                  {group.isPublic && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  )}
                  <span>
                    Public group • {group.members}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <Users size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500">No groups to display</p>
        </div>
      )}
      
      {/* See all button */}
      {groups.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" className="w-full py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium">
            See all
          </Button>
        </div>
      )}
    </div>
  );
};

export default GroupsTab;
