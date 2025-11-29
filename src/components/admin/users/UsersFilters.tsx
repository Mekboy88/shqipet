
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { 
  accountStatusOptions, 
  userRoleOptions,
  verificationStatusOptions 
} from '@/types/user';

interface UsersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: string, value: string) => void;
  onDateChange: (key: string, date: Date | null) => void;
  onResetFilters: () => void;
  accountStatus: string;
  emailVerification: string;
  phoneVerification: string;
  role: string;
  dateStart: Date | null;
  dateEnd: Date | null;
}

export function UsersFilters({
  search,
  onSearchChange,
  onFilterChange,
  onDateChange,
  onResetFilters,
  accountStatus,
  emailVerification,
  phoneVerification,
  role,
  dateStart,
  dateEnd
}: UsersFiltersProps) {
  return (
    <div className="space-y-4 bg-white p-4 rounded-md border">
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, email, ID..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        {/* Account Status Filter */}
        <div className="w-40">
          <Select 
            value={accountStatus} 
            onValueChange={(value) => onFilterChange('accountStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {accountStatusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Email Verification Filter */}
        <div className="w-40">
          <Select 
            value={emailVerification} 
            onValueChange={(value) => onFilterChange('emailVerification', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Email Status" />
            </SelectTrigger>
            <SelectContent>
              {verificationStatusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Phone Verification Filter */}
        <div className="w-40">
          <Select 
            value={phoneVerification} 
            onValueChange={(value) => onFilterChange('phoneVerification', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Phone Status" />
            </SelectTrigger>
            <SelectContent>
              {verificationStatusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Role Filter */}
        <div className="w-40">
          <Select 
            value={role} 
            onValueChange={(value) => onFilterChange('role', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {userRoleOptions.map((role) => (
                <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 items-center">
        {/* Date Range Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">From:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={`w-[180px] justify-start text-left font-normal ${!dateStart && 'text-muted-foreground'}`}
              >
                {dateStart ? format(dateStart, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateStart}
                onSelect={(date) => onDateChange('dateStart', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <span className="text-sm text-muted-foreground">To:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={`w-[180px] justify-start text-left font-normal ${!dateEnd && 'text-muted-foreground'}`}
              >
                {dateEnd ? format(dateEnd, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateEnd}
                onSelect={(date) => onDateChange('dateEnd', date)}
                initialFocus
                disabled={(date) => dateStart ? date < dateStart : false}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Reset Button */}
        <Button 
          variant="outline" 
          onClick={onResetFilters}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
