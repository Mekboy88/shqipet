
import React from 'react';
import MonthSection from './MonthSection';
import { MonthSection as MonthSectionType } from './types';

interface ListViewProps {
  postsByMonth: MonthSectionType[];
}

const ListView: React.FC<ListViewProps> = ({
  postsByMonth
}) => {
  if (postsByMonth.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        <p>No posts available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {postsByMonth.map((section, index) => (
        <MonthSection key={`${section.month}-${section.year}-${index}`} section={section} />
      ))}
    </div>
  );
};

export default ListView;
