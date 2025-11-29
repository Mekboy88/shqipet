import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';

interface RealTimeInputProps {
  id: string;
  label: string;
  description?: string;
  value: string | number;
  onValueChange: (value: string | number) => Promise<void>;
  type?: 'text' | 'number' | 'email' | 'password';
  placeholder?: string;
  disabled?: boolean;
  isUpdating?: boolean;
  className?: string;
  debounceMs?: number;
  min?: number;
  max?: number;
}

export const RealTimeInput: React.FC<RealTimeInputProps> = ({
  id,
  label,
  description,
  value,
  onValueChange,
  type = 'text',
  placeholder,
  disabled = false,
  isUpdating = false,
  className,
  debounceMs = 1000,
  min,
  max
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [localUpdating, setLocalUpdating] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);
  const debouncedValue = useDebounce(localValue, debounceMs);

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Handle debounced updates
  useEffect(() => {
    if (debouncedValue !== value && !localUpdating) {
      handleUpdate(debouncedValue);
    }
  }, [debouncedValue, value]);

  const handleUpdate = async (newValue: string | number) => {
    if (newValue === value) return;
    
    setLocalUpdating(true);
    try {
      const finalValue = type === 'number' ? Number(newValue) : newValue;
      await onValueChange(finalValue);
      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 2000);
    } finally {
      setLocalUpdating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
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
        <Input
          id={id}
          type={type}
          value={localValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          min={min}
          max={max}
          className={cn(
            "pr-8",
            justUpdated && "border-green-500",
            isLoading && "opacity-75"
          )}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
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