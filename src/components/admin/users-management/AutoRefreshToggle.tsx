// DO NOT EDIT: Critical Admin auto-refresh control. Prevents manual refresh dependency.

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RefreshCw } from 'lucide-react';
import { useAutoRefresh } from '@/hooks/admin/useAdminQuery';

interface AutoRefreshToggleProps {
  className?: string;
}

/**
 * Auto-refresh toggle that replaces manual refresh buttons
 * Enables background data fetching every 30s when active
 */
export function AutoRefreshToggle({ className }: AutoRefreshToggleProps) {
  const { isAutoRefreshEnabled, setIsAutoRefreshEnabled } = useAutoRefresh();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <RefreshCw className={`h-4 w-4 text-muted-foreground ${isAutoRefreshEnabled ? 'animate-spin' : ''}`} />
      <Switch
        id="auto-refresh"
        checked={isAutoRefreshEnabled}
        onCheckedChange={setIsAutoRefreshEnabled}
      />
      <Label htmlFor="auto-refresh" className="text-sm text-muted-foreground">
        Auto-refresh {isAutoRefreshEnabled ? 'ON' : 'OFF'}
      </Label>
    </div>
  );
}