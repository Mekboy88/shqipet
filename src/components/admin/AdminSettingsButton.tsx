import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { openDashboardSettings } from './dashboard-settings/DashboardSettingsSheet';

const AdminSettingsButton: React.FC = () => {
  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={openDashboardSettings}
      className="flex items-center space-x-2"
    >
      <Settings className="h-4 w-4" />
      <span className="hidden md:inline">Settings</span>
    </Button>
  );
};

export default AdminSettingsButton;