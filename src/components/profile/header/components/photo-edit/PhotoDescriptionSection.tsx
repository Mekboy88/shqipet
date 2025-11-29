
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface PhotoDescriptionSectionProps {
  description: string;
  onDescriptionChange: (value: string) => void;
}

export const PhotoDescriptionSection: React.FC<PhotoDescriptionSectionProps> = ({
  description,
  onDescriptionChange
}) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <label className="block text-sm text-gray-600 mb-2">Përshkrimi</label>
      <Textarea 
        value={description} 
        onChange={(e) => onDescriptionChange(e.target.value)} 
        placeholder="Shto një përshkrim..." 
        className="w-full h-16 resize-none text-sm focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
      />
    </div>
  );
};
