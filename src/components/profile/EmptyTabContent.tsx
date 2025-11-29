
import React from 'react';
import { Card } from '@/components/ui/card';

interface EmptyTabContentProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const EmptyTabContent: React.FC<EmptyTabContentProps> = ({ title, description, icon }) => {
  return (
    <Card className="p-6 shadow">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="flex flex-col items-center justify-center py-10">
        {icon}
        <h3 className="text-xl font-medium">{title}</h3>
        <p className="text-gray-500 mt-2">{description}</p>
      </div>
    </Card>
  );
};

export default EmptyTabContent;
