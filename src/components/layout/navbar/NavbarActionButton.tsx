
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { LucideIcon } from 'lucide-react';
import Avatar from '@/components/Avatar';

interface NavbarActionButtonProps {
  icon?: LucideIcon;
  tooltip: string;
  onClick?: () => void;
  isUserAvatar?: boolean;
}

const NavbarActionButton: React.FC<NavbarActionButtonProps> = ({ 
  icon: Icon, 
  tooltip, 
  onClick, 
  isUserAvatar = false 
}) => {
// Using GlobalUserAvatar for consistent display across app

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-facebook-light h-12 w-12"
            onClick={onClick}
          >
            {isUserAvatar ? (
              <Avatar size="md" className="h-10 w-10" />
            ) : Icon ? (
              <Icon className="h-6 w-6" />
            ) : null}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={10} align="center" className="bg-neutral-800/85 text-white border-none px-3 py-1.5 text-sm rounded backdrop-blur-sm">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NavbarActionButton;
