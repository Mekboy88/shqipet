
import React from 'react';
import { Card } from '@/components/ui/card';
import PostCard from './PostCard';
import { MonthSection as MonthSectionType } from './types';

interface MonthSectionProps {
  section: MonthSectionType;
}

const MonthSection: React.FC<MonthSectionProps> = ({ section }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <h3 className="text-xl font-bold">{section.month} {section.year}</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {section.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default MonthSection;
