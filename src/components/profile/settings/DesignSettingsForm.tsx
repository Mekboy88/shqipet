
import React from 'react';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';

const DesignSettingsForm: React.FC = () => {
  const handleSave = () => {
    console.log('Saving design settings');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
          <div className="flex items-center justify-center w-full h-48 bg-gray-50 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
            <div className="text-center">
              <Image className="mx-auto h-12 w-12 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-start pt-4">
        <Button onClick={handleSave} className="bg-red-500 hover:bg-red-600 text-white px-8">
          Save
        </Button>
      </div>
    </div>
  );
};

export default DesignSettingsForm;
