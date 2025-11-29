
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface AboutSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const AboutSidebar: React.FC<AboutSidebarProps> = ({ activeSection, setActiveSection }) => {
  return (
    <div className="w-[340px] border-gray-200">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">About</h2>
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <button 
              key={item.id}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center transition-colors duration-200 ${
                activeSection === item.id 
                  ? 'bg-gradient-to-r from-red-50 to-red-100 shadow-sm' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className={activeSection === item.id ? 'bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-900 font-medium' : ''}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

// Sidebar items data
const sidebarItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'work', label: 'Work and education' },
  { id: 'places', label: 'Places lived' },
  { id: 'contact', label: 'Contact and basic info' },
  { id: 'family', label: 'Family and relationships' },
  { id: 'details', label: 'Details about you' },
  { id: 'events', label: 'Life events' },
];

export default AboutSidebar;
