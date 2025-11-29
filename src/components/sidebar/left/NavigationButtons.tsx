
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface NavigationButtonsProps {
  onItemClick: (item: string) => void;
}

const navigationItems = [
  'Albums', 'Watch', 'Reels', 'Marketplace', 'Dating', 
  'Hotels', 'Restaurant', 'Takeout Food', 'Games', 'Forum', 'Movies', 'Jobs', 'Offers', 'Learn Together', 
  'Discover Places', 'Proud of the Country', 'Anonymous Report'
];

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ onItemClick }) => {
  const navigate = useNavigate();

  const handleNavigation = (item: string) => {
    const routeMap: { [key: string]: string } = {
      'Albums': '/albums',
      'Watch': '/watch',
      'Reels': '/reels',
      'Marketplace': '/marketplace',
      'Dating': '/dating',
      'Hotels': '/hotels',
      'Restaurant': '/restaurant',
      'Takeout Food': '/takeout-food',
      'Games': '/games',
      'Forum': '/forum',
      'Movies': '/movies',
      'Jobs': '/jobs',
      'Offers': '/offers',
      'Learn Together': '/learn-together',
      'Discover Places': '/discover-places',
      'Proud of the Country': '/proud-of-the-country',
      'Anonymous Report': '/anonymous-report'
    };

    const route = routeMap[item];
    if (route) {
      navigate(route);
    }
    onItemClick(item);
  };

  return (
    <div className="p-4 space-y-1 mx-0 px-0 py-0">
      {navigationItems.map((item, index) => (
        <Button 
          key={index} 
          variant="ghost" 
          onClick={() => handleNavigation(item)} 
          className="w-full justify-start text-left h-10 text-sm font-medium text-gray-800 hover:bg-gray-100 px-3"
        >
          <span className="truncate">{item}</span>
        </Button>
      ))}
    </div>
  );
};

export default NavigationButtons;
