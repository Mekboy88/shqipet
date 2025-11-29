
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Settings } from 'lucide-react';

const PostSettingsHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold">Posts</h2>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" className="bg-gray-100 hover:bg-gray-200 border-0 flex gap-2 items-center text-gray-700">
          <Filter className="h-5 w-5" />
          <span className="font-medium">Filters</span>
        </Button>
        
        <Button variant="outline" className="bg-gray-100 hover:bg-gray-200 border-0 flex gap-2 items-center text-gray-700">
          <Settings className="h-5 w-5" />
          <span className="font-medium">Manage posts</span>
        </Button>
      </div>
    </div>
  );
};

export default PostSettingsHeader;
