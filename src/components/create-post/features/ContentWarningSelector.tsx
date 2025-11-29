import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { AlertTriangle, ChevronDown } from 'lucide-react';

interface ContentWarningSelectorProps {
  warnings: string[];
  onWarningsChange: (warnings: string[]) => void;
}

const ContentWarningSelector: React.FC<ContentWarningSelectorProps> = ({ warnings, onWarningsChange }) => {
  const warningOptions = [
    { value: 'sensitive', label: 'Sensitive Content', description: 'May contain mature themes' },
    { value: 'violence', label: 'Violence', description: 'Contains violent content' },
    { value: 'adult', label: 'Adult Content', description: 'Not suitable for minors' },
    { value: 'spoiler', label: 'Spoiler', description: 'Contains spoilers' },
    { value: 'flashing', label: 'Flashing Lights', description: 'May trigger epilepsy' },
    { value: 'medical', label: 'Medical Content', description: 'Contains medical imagery' },
    { value: 'political', label: 'Political Content', description: 'Contains political content' },
    { value: 'custom', label: 'Custom Warning', description: 'Add custom warning text' }
  ];

  const [customWarning, setCustomWarning] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const toggleWarning = (value: string) => {
    if (value === 'custom') {
      setShowCustomInput(!showCustomInput);
      return;
    }
    
    const newWarnings = warnings.includes(value) 
      ? warnings.filter(w => w !== value)
      : [...warnings, value];
    onWarningsChange(newWarnings);
  };

  const addCustomWarning = () => {
    if (customWarning.trim()) {
      onWarningsChange([...warnings, `custom:${customWarning.trim()}`]);
      setCustomWarning('');
      setShowCustomInput(false);
    }
  };

  const removeWarning = (warning: string) => {
    onWarningsChange(warnings.filter(w => w !== warning));
  };

  return (
    <div className="space-y-2">
      {warnings.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {warnings.map((warning, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs"
            >
              <AlertTriangle className="w-3 h-3" />
              {warning.startsWith('custom:') ? warning.substring(7) : warningOptions.find(opt => opt.value === warning)?.label || warning}
              <button 
                onClick={() => removeWarning(warning)}
                className="ml-1 hover:text-orange-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      
      {warnings.length === 0 && (
        <p className="text-sm text-muted-foreground">No content warnings selected</p>
      )}
    </div>
  );
};

export default ContentWarningSelector;