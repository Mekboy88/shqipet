
import React from 'react';
import { Label } from '@/components/ui/label';

type GenderSelectionProps = {
  gender: string;
  onGenderChange: (gender: string) => void;
};

const GenderSelection = ({ gender, onGenderChange }: GenderSelectionProps) => {
  return (
    <div>
      <Label className="text-xs text-facebook-gray">Gender</Label>
      <div className="grid grid-cols-2 gap-3 mt-1">
        <label className="flex items-center justify-between border border-border rounded-md p-3 cursor-pointer hover:bg-accent/5 transition-colors">
          <span className="text-sm font-medium">Female</span>
          <input 
            type="radio" 
            name="gender" 
            value="female" 
            onChange={() => onGenderChange('female')} 
            className="w-4 h-4 text-primary focus:ring-primary border-border" 
            checked={gender === 'female'} 
          />
        </label>
        
        <label className="flex items-center justify-between border border-border rounded-md p-3 cursor-pointer hover:bg-accent/5 transition-colors">
          <span className="text-sm font-medium">Male</span>
          <input 
            type="radio" 
            name="gender" 
            value="male" 
            onChange={() => onGenderChange('male')} 
            className="w-4 h-4 text-primary focus:ring-primary border-border" 
            checked={gender === 'male'} 
          />
        </label>
      </div>
    </div>
  );
};

export default GenderSelection;
