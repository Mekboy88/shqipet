import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Search, Filter, X } from 'lucide-react';
import { AlertSeverity, AlertSource } from '@/hooks/useRealtimeAlerts';

interface AlertFiltersProps {
  filters: {
    severity: AlertSeverity[];
    status: string[];
    source: AlertSource[];
    timeRange: string;
    search: string;
  };
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  onClearFilterSection?: (section: string) => void;
}

export const AlertFilters = ({ filters, onFilterChange, onClearFilters, onClearFilterSection }: AlertFiltersProps) => {
  const severityOptions: AlertSeverity[] = ['critical', 'high', 'medium', 'low', 'info'];
  const statusOptions = ['open', 'resolved', 'dismissed'];
  const sourceOptions: AlertSource[] = ['admin_notifications', 'security_events', 'system_issues', 'brute_force_alerts', 'notifications'];
  const timeRangeOptions = [
    { value: '1h', label: 'Last 1h' },
    { value: '6h', label: 'Last 6h' },
    { value: '24h', label: 'Last 24h' },
    { value: '7d', label: 'Last 7d' },
    { value: '30d', label: 'Last 30d' },
  ];

  const toggleFilter = (key: string, value: AlertSeverity | string | AlertSource) => {
    const current = filters[key as keyof typeof filters];
    if (Array.isArray(current)) {
      const newValue = (current as any[]).includes(value)
        ? (current as any[]).filter((v: any) => v !== value)
        : [...current, value];
      onFilterChange(key, newValue);
    } else {
      onFilterChange(key, value);
    }
  };

  const activeFilterCount = 
    filters.severity.length +
    filters.status.length +
    filters.source.length +
    (filters.timeRange ? 1 : 0) +
    (filters.search ? 1 : 0);

  return (
    <div className="space-y-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search alerts..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Active Filters Badge & Clear All */}
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="text-xs">
          <Filter className="w-3 h-3 mr-1" />
          {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
        </Badge>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClearFilters}
                disabled={activeFilterCount === 0}
                className="text-xs h-7 disabled:opacity-50"
              >
                <X className="w-3 h-3 mr-1" />
                Clear all
              </Button>
            </TooltipTrigger>
            {activeFilterCount === 0 && (
              <TooltipContent>
                <p>No active filters to clear</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Time Range */}
      <div>
        <label className="text-sm font-medium mb-2 block">Time Range</label>
        <div className="flex flex-wrap gap-2">
          {timeRangeOptions.map(option => (
            <Button
              key={option.value}
              size="sm"
              variant={filters.timeRange === option.value ? 'default' : 'outline'}
              onClick={() => onFilterChange('timeRange', filters.timeRange === option.value ? '' : option.value)}
              className="h-8"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Severity */}
      <div>
        <label className="text-sm font-medium mb-2 block">Severity</label>
        <div className="flex flex-wrap gap-2">
          {severityOptions.map(severity => (
            <Button
              key={severity}
              size="sm"
              variant={filters.severity.includes(severity) ? 'default' : 'outline'}
              onClick={() => toggleFilter('severity', severity)}
              className="h-8 capitalize"
            >
              {severity}
            </Button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="text-sm font-medium mb-2 block">Status</label>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(status => (
            <Button
              key={status}
              size="sm"
              variant={filters.status.includes(status) ? 'default' : 'outline'}
              onClick={() => toggleFilter('status', status)}
              className="h-8 capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Source */}
      <div>
        <label className="text-sm font-medium mb-2 block">Source</label>
        <div className="flex flex-wrap gap-2">
          {sourceOptions.map(source => (
            <Button
              key={source}
              size="sm"
              variant={filters.source.includes(source) ? 'default' : 'outline'}
              onClick={() => toggleFilter('source', source)}
              className="h-8 text-xs"
            >
              {source.replace(/_/g, ' ')}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
