
import React from 'react';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const CheckInsTab: React.FC = () => {
  return (
    <Card className="p-6 shadow mt-4 text-center">
      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">Check-ins</h3>
      <p className="text-gray-600">No check-ins to show right now.</p>
    </Card>
  );
};

export default CheckInsTab;
