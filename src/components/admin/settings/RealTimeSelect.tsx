import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface RealTimeSelectProps {
  id: string;
  label: string;
  description?: string;
  value: string;
  onValueChange: (value: string) => Promise<void>;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  isUpdating?: boolean;
  className?: string;
}

export const RealTimeSelect: React.FC<RealTimeSelectProps> = ({
  id,
  label,
  description,
  value,
  onValueChange,
  options,
  placeholder,
  disabled = false,
  isUpdating = false,
  className
}) => {
  const [localUpdating, setLocalUpdating] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);

  const handleChange = async (newValue: string) => {
    if (newValue === value) return;
    
    setLocalUpdating(true);
    try {
      await onValueChange(newValue);
      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 2000);
    } finally {
      setLocalUpdating(false);
    }
  };

  const isLoading = isUpdating || localUpdating;

  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={id}
        className={cn(
          "text-base",
          disabled && "opacity-50"
        )}
      >
        {label}
      </Label>
      {description && (
        <p className={cn(
          "text-sm text-muted-foreground",
          disabled && "opacity-50"
        )}>
          {description}
        </p>
      )}
      <div className="relative">
        <Select
          value={value}
          onValueChange={handleChange}
          disabled={disabled || isLoading}
        >
          <SelectTrigger 
            className={cn(
              "pr-8",
              justUpdated && "border-green-500",
              isLoading && "opacity-75"
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="absolute inset-y-0 right-8 flex items-center pr-3 pointer-events-none">
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {justUpdated && !isLoading && (
            <Check className="h-4 w-4 text-green-500" />
          )}
        </div>
      </div>
    </div>
  );
};