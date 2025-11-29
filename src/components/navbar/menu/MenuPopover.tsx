
import React, { useState, useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import MenuContent from './MenuContent';
import MenuCreateSection from './MenuCreateSection';
import GridIcon from './GridIcon';
import { useMenuWidth } from './hooks/useMenuWidth';
import { useMenuScrollIsolation } from './hooks/useMenuScrollIsolation';
import { useMenuDropdownState } from './hooks/useMenuDropdownState';

const MenuPopover = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const popoverContentRef = useRef<HTMLDivElement>(null);

  // Custom hooks for managing different aspects of the menu
  const { menuWidth } = useMenuWidth();
  
  // Set up dropdown state and scroll isolation
  useMenuDropdownState(isMenuOpen);
  useMenuScrollIsolation(isMenuOpen, popoverContentRef);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full bg-facebook-light h-12 w-12" onClick={() => setIsMenuOpen(true)}>
                <GridIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              ref={popoverContentRef} 
              side="bottom" 
              align="end" 
              sideOffset={12} 
              onOpenAutoFocus={e => e.preventDefault()}
              style={{
                pointerEvents: 'auto',
                zIndex: 9999,
                width: `${menuWidth}px`
              }} 
              className="h-[calc(100vh-120px)] p-6 border-0 shadow-2xl rounded-xl relative overflow-y-auto py-0 bg-gray-100 my-[-10px] mx-[-170px] px-[15px]"
            >
              <div className="flex justify-between items-center mb-6 pt-6 sticky top-0 bg-gray-100 z-20 mx-0 py-[23px] my-0">
                <h2 className="text-2xl font-bold text-gray-900 my-[-11px]">Menu</h2>
              </div>
              
              <div style={{ pointerEvents: 'auto' }} className="flex gap-6 mx-0 px-0 pb-6 py-0 my-0">
                <MenuContent />
                <MenuCreateSection />
              </div>
            </PopoverContent>
          </Popover>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={10} align="center" className="bg-neutral-800/85 text-white border-none px-3 py-1.5 text-sm rounded backdrop-blur-sm">
          Menu
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MenuPopover;
