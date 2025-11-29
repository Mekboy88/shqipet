
import React from 'react';
import { Search, Filter, Download, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ActionsFiltersBarProps {
  search: string | undefined;
  onSearchChange: (value: string) => void;
  onFilterClick: (key: string, value: string) => void;
  onResetFilters: () => void;
  onExport: (format: 'csv' | 'excel' | 'pdf') => void;
}

export function ActionsFiltersBar({
  search,
  onSearchChange,
  onFilterClick,
  onResetFilters,
  onExport
}: ActionsFiltersBarProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
      <div className="relative w-full md:w-1/3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input 
          placeholder="Search by username, email, or action..." 
          className="pl-10"
          value={search || ''}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <Filter size={16} />
              Filter
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={() => onFilterClick('actionType', 'login')}>
              Authentication Actions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterClick('actionType', 'content')}>
              Content Actions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterClick('actionType', 'security')}>
              Security Actions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterClick('actionType', 'moderation')}>
              Moderation Actions
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onFilterClick('actionStatus', 'success')}>
              Successful Actions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterClick('actionStatus', 'warning')}>
              Warning Actions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterClick('actionStatus', 'failed')}>
              Failed Actions
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onResetFilters}>
              Clear All Filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <Download size={16} />
              Export
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={() => onExport('csv')}>
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('excel')}>
              Export as Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('pdf')}>
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
