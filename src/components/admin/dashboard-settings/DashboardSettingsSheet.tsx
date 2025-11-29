import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Settings } from "lucide-react";
import DashboardSettingsContent from './DashboardSettingsContent';

// Global state for the settings sheet
let isSettingsSheetOpen = false;
let setSettingsSheetOpenGlobal: ((open: boolean) => void) | null = null;

export const openDashboardSettings = () => {
  if (setSettingsSheetOpenGlobal) {
    setSettingsSheetOpenGlobal(true);
  }
};

const DashboardSettingsSheet: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('layout');

  // Set the global function reference
  React.useEffect(() => {
    setSettingsSheetOpenGlobal = setIsOpen;
    return () => {
      setSettingsSheetOpenGlobal = null;
    };
  }, []);

  // Prevent accidental closing by managing state more carefully
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center">
            <div>
              <SheetTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Dashboard Settings</span>
              </SheetTitle>
              <SheetDescription>
                Configure your admin dashboard appearance, data sources, and behavior
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        
        <div className="h-[calc(100vh-120px)] overflow-hidden">
          {isOpen && (
            <DashboardSettingsContent 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DashboardSettingsSheet;