import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RealTimeSwitchProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => Promise<void>;
  disabled?: boolean;
  isUpdating?: boolean;
  className?: string;
}

export const RealTimeSwitch: React.FC<RealTimeSwitchProps> = ({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  isUpdating = false,
  className
}) => {
  const [localUpdating, setLocalUpdating] = useState(false);

  const handleChange = async (newChecked: boolean) => {
    setLocalUpdating(true);
    try {
      await onCheckedChange(newChecked);
    } finally {
      setLocalUpdating(false);
    }
  };

  const isLoading = isUpdating || localUpdating;

  return (
    <div className={cn("flex items-center justify-between space-x-2", className)}>
      <div className="space-y-0.5">
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
      </div>
      <div className="flex items-center space-x-2">
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={handleChange}
          disabled={disabled || isLoading}
        />
      </div>
    </div>
  );
};