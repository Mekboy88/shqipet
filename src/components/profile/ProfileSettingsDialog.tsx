
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface TabsListStyles {
  transparent: boolean;
  justifyContent: string;
  overflow: string;
  borderWidth: number;
  maxWidth: number;
}

interface ProfileSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tabsListStyles: TabsListStyles;
  setTabsListStyles: React.Dispatch<React.SetStateAction<TabsListStyles>>;
}

const ProfileSettingsDialog: React.FC<ProfileSettingsDialogProps> = ({
  isOpen,
  onOpenChange,
  tabsListStyles,
  setTabsListStyles
}) => {
  // Function to update styles and persist to localStorage
  const updateStyles = (update: Partial<TabsListStyles>) => {
    setTabsListStyles(prev => {
      const newStyles = { ...prev, ...update };
      
      // Save borderWidth and maxWidth to localStorage
      if (update.borderWidth !== undefined) {
        localStorage.setItem('borderWidth', update.borderWidth.toString());
      }
      
      if (update.maxWidth !== undefined) {
        localStorage.setItem('borderMaxWidth', update.maxWidth.toString());
      }
      
      return newStyles;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">Profile Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Border Width (%)</label>
            <div className="flex space-x-4 items-center">
              <input 
                type="number" 
                value={tabsListStyles.borderWidth} 
                onChange={e => updateStyles({borderWidth: Number(e.target.value)})} 
                className="border p-2 rounded-md w-24" 
                min="10" 
                max="100" 
              />
              <div className="flex-1">
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  value={tabsListStyles.borderWidth} 
                  onChange={e => updateStyles({borderWidth: Number(e.target.value)})} 
                  className="w-full" 
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Max Width (px)</label>
            <div className="flex space-x-4 items-center">
              <input 
                type="number" 
                value={tabsListStyles.maxWidth} 
                onChange={e => updateStyles({maxWidth: Number(e.target.value)})} 
                className="border p-2 rounded-md w-24" 
                min="400" 
                max="1200" 
              />
              <div className="flex-1">
                <input 
                  type="range" 
                  min="400" 
                  max="1200" 
                  value={tabsListStyles.maxWidth} 
                  onChange={e => updateStyles({maxWidth: Number(e.target.value)})} 
                  className="w-full" 
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Tab Background</label>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="transparent-bg" 
                checked={tabsListStyles.transparent} 
                onChange={e => updateStyles({transparent: e.target.checked})}
                className="rounded" 
              />
              <label htmlFor="transparent-bg">Transparent Background</label>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Tab Alignment</label>
            <select 
              value={tabsListStyles.justifyContent} 
              onChange={e => updateStyles({justifyContent: e.target.value as any})}
              className="border p-2 rounded-md"
            >
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
              <option value="between">Space Between</option>
              <option value="around">Space Around</option>
              <option value="evenly">Space Evenly</option>
            </select>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Overflow Behavior</label>
            <select 
              value={tabsListStyles.overflow} 
              onChange={e => updateStyles({overflow: e.target.value as any})}
              className="border p-2 rounded-md"
            >
              <option value="auto">Auto (scroll when needed)</option>
              <option value="hidden">Hidden (clip content)</option>
              <option value="visible">Visible (show all content)</option>
            </select>
          </div>
          
          <div className="flex justify-between space-x-4 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
              Cancel
            </Button>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettingsDialog;
