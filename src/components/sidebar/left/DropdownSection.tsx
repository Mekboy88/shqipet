
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface DropdownSectionProps {
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  onDropdownItemClick: (item: string) => void;
}

const dropdownItems = [{
  label: 'Social Networks',
  icon: '/lovable-uploads/aafcb32d-4a0b-471b-a6cc-0c60041d3c9e.png'
}, {
  label: 'Applications',
  icon: '/lovable-uploads/06e59606-71fc-4f7c-be92-8fb551229fe9.png'
}, {
  label: 'Travel',
  icon: '/lovable-uploads/3bdc13b1-767a-4404-9b19-0d499df1c69d.png'
}, {
  label: 'Music',
  icon: '/lovable-uploads/8ceddbfc-ac3f-4f6c-bbf3-48c2e928d107.png'
}, {
  label: 'Books',
  icon: '/lovable-uploads/76678b2d-7f13-4d76-8001-6e8d8f2067b2.png'
}, {
  label: 'Saved Posts',
  icon: '/lovable-uploads/aafcb32d-4a0b-471b-a6cc-0c60041d3c9e.png'
}, {
  label: 'Popular Posts',
  icon: '/lovable-uploads/06e59606-71fc-4f7c-be92-8fb551229fe9.png'
}, {
  label: 'Memories',
  icon: '/lovable-uploads/3bdc13b1-767a-4404-9b19-0d499df1c69d.png'
}, {
  label: 'How Are You',
  icon: '/lovable-uploads/8ceddbfc-ac3f-4f6c-bbf3-48c2e928d107.png'
}, {
  label: 'My Groups',
  icon: '/lovable-uploads/76678b2d-7f13-4d76-8001-6e8d8f2067b2.png'
}, {
  label: 'My Pages',
  icon: '/lovable-uploads/579e4864-4f73-4f6a-8b33-2bd8c80606d9.png'
}, {
  label: 'Blog',
  icon: '/lovable-uploads/8374c6cb-4336-4483-a905-b36f6c468c3a.png'
}, {
  label: 'Shared Things',
  icon: '/lovable-uploads/aafcb32d-4a0b-471b-a6cc-0c60041d3c9e.png'
}, {
  label: 'Fundraising',
  icon: '/lovable-uploads/06e59606-71fc-4f7c-be92-8fb551229fe9.png'
}, {
  label: 'Find Friends',
  icon: '/lovable-uploads/3bdc13b1-767a-4404-9b19-0d499df1c69d.png'
}, {
  label: 'Information',
  icon: '/lovable-uploads/8ceddbfc-ac3f-4f6c-bbf3-48c2e928d107.png'
}, {
  label: 'Directory',
  icon: '/lovable-uploads/76678b2d-7f13-4d76-8001-6e8d8f2067b2.png'
}, {
  label: 'Events',
  icon: '/lovable-uploads/579e4864-4f73-4f6a-8b33-2bd8c80606d9.png'
}];

const DropdownSection: React.FC<DropdownSectionProps> = ({
  isDropdownOpen,
  setIsDropdownOpen,
  onDropdownItemClick
}) => {
  const navigate = useNavigate();

  const handleDropdownNavigation = (item: string) => {
    const routeMap: { [key: string]: string } = {
      'Social Networks': '/social-networks',
      'Applications': '/applications',
      'Travel': '/travel',
      'Music': '/music',
      'Books': '/books',
      'Saved Posts': '/saved-posts',
      'Popular Posts': '/popular-posts',
      'Memories': '/memories',
      'How Are You': '/how-are-you',
      'My Groups': '/my-groups',
      'My Pages': '/my-pages',
      'Blog': '/blog',
      'Shared Things': '/shared-things',
      'Fundraising': '/fundraising',
      'Find Friends': '/find-friends',
      'Information': '/information',
      'Directory': '/directory',
      'Events': '/events'
    };

    const route = routeMap[item];
    if (route) {
      navigate(route);
    }
    onDropdownItemClick(item);
  };

  return (
    <div className="p-3 border-b border-gray-200">
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-between h-10 text-sm font-medium text-gray-800 hover:bg-gray-100 py-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0">
            <span>More</span>
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier"> 
                <rect width="48" height="48" fill="white" fillOpacity="0.01"></rect> 
                <rect x="4" y="4" width="16" height="16" rx="2" fill="#e35431" stroke="#000000" strokeWidth="4" strokeLinejoin="round"></rect> 
                <rect x="4" y="28" width="16" height="16" rx="2" fill="#e35431" stroke="#000000" strokeWidth="4" strokeLinejoin="round"></rect> 
                <rect x="28" y="4" width="16" height="16" rx="2" fill="#e35431" stroke="#000000" strokeWidth="4" strokeLinejoin="round"></rect> 
                <path d="M28 28H44" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path> 
                <path d="M36 36H44" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path> 
                <path d="M28 44H44" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path> 
              </g>
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          style={{
            width: 'var(--radix-dropdown-menu-trigger-width)'
          }} 
          align="start" 
          sideOffset={12} 
          className="bg-white border border-gray-200 shadow-lg z-50"
        >
          {dropdownItems.map((item, index) => (
            <DropdownMenuItem 
              key={index} 
              onClick={() => handleDropdownNavigation(item.label)} 
              className="text-sm font-medium text-gray-800 hover:bg-gray-100 cursor-pointer px-3 py-2 flex items-center gap-3"
            >
              <img src={item.icon} alt={item.label} className="w-5 h-5 rounded-md flex-shrink-0" />
              <span className="text-left flex-1">{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropdownSection;
