
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';

interface ViewToggleProps {
  activeView: 'list' | 'grid';
  setActiveView: (view: 'list' | 'grid') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="flex justify-center border-t border-gray-200 pt-2">
      <div className="flex rounded-md overflow-hidden border border-gray-200">
        <Button
          type="button"
          variant="ghost"
          className={`rounded-none px-16 py-1 h-8 ${
            activeView === 'list'
              ? 'bg-blue-50 text-blue-600'
              : 'bg-white text-gray-500'
          }`}
          onClick={() => setActiveView('list')}
        >
          <div className="flex items-center gap-1">
            <List className="h-4 w-4 mr-1" />
            List view
          </div>
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          className={`rounded-none px-16 py-1 h-8 ${
            activeView === 'grid'
              ? 'bg-blue-50 text-blue-600'
              : 'bg-white text-gray-500'
          }`}
          onClick={() => setActiveView('grid')}
        >
          <div className="flex items-center gap-1">
            <Grid className="h-4 w-4 mr-1" />
            Grid view
          </div>
        </Button>
      </div>
    </div>
  );
};

export default ViewToggle;
