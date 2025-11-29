
import React from 'react';
import { Input } from '@/components/ui/input';

type NameInputsProps = {
  firstName: string;
  lastName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const NameInputs = ({ firstName, lastName, onChange }: NameInputsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Input 
        type="text" 
        name="firstName" 
        placeholder="First name" 
        className="fb-input" 
        value={firstName} 
        onChange={onChange} 
      />
      <Input 
        type="text" 
        name="lastName" 
        placeholder="Last name" 
        className="fb-input" 
        value={lastName} 
        onChange={onChange} 
      />
    </div>
  );
};

export default NameInputs;
