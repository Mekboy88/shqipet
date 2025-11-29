
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import PostSettingsHeader from './post-settings/PostSettingsHeader';
import ViewToggle from './post-settings/ViewToggle';
import GridView from './post-settings/GridView';
import ListView from './post-settings/ListView';
import { postsByMonth } from './post-settings/postData';

const PostSettingsCard: React.FC = () => {
  const [activeView, setActiveView] = useState<'list' | 'grid'>('grid'); // Default to grid view

  return <div className="flex flex-col gap-8">
      {/* Post settings card - completely separate from grid content */}
      <Card className="p-4 shadow-sm bg-white rounded-lg">
        <PostSettingsHeader />
        <ViewToggle activeView={activeView} setActiveView={setActiveView} />
      </Card>

      {/* Grid display section with consistent gaps */}
      {activeView === 'grid' && <GridView postsByMonth={postsByMonth} />}

      {/* List view implementation */}
      {activeView === 'list' && <ListView postsByMonth={postsByMonth} />}
    </div>;
};

export default PostSettingsCard;
