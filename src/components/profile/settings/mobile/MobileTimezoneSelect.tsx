import React, { useState, useMemo } from 'react';
import { Check, ChevronDown, Search, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TimezoneGroup {
  region: string;
  timezones: Timezone[];
}

interface Timezone {
  value: string;
  label: string;
  offset: string;
}

interface MobileTimezoneSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

const timezoneGroups: TimezoneGroup[] = [
  {
    region: "North America",
    timezones: [
      { value: "America/New_York", label: "Eastern Time", offset: "UTC-5" },
      { value: "America/Chicago", label: "Central Time", offset: "UTC-6" },
      { value: "America/Denver", label: "Mountain Time", offset: "UTC-7" },
      { value: "America/Los_Angeles", label: "Pacific Time", offset: "UTC-8" },
      { value: "America/Anchorage", label: "Alaska Time", offset: "UTC-9" },
      { value: "Pacific/Honolulu", label: "Hawaii Time", offset: "UTC-10" },
      { value: "America/Toronto", label: "Toronto", offset: "UTC-5" },
      { value: "America/Vancouver", label: "Vancouver", offset: "UTC-8" },
    ]
  },
  {
    region: "Europe",
    timezones: [
      { value: "Europe/London", label: "London", offset: "UTC+0" },
      { value: "Europe/Paris", label: "Paris", offset: "UTC+1" },
      { value: "Europe/Berlin", label: "Berlin", offset: "UTC+1" },
      { value: "Europe/Rome", label: "Rome", offset: "UTC+1" },
      { value: "Europe/Madrid", label: "Madrid", offset: "UTC+1" },
      { value: "Europe/Amsterdam", label: "Amsterdam", offset: "UTC+1" },
      { value: "Europe/Stockholm", label: "Stockholm", offset: "UTC+1" },
      { value: "Europe/Moscow", label: "Moscow", offset: "UTC+3" },
    ]
  },
  {
    region: "Asia",
    timezones: [
      { value: "Asia/Tokyo", label: "Tokyo", offset: "UTC+9" },
      { value: "Asia/Shanghai", label: "Shanghai", offset: "UTC+8" },
      { value: "Asia/Seoul", label: "Seoul", offset: "UTC+9" },
      { value: "Asia/Dubai", label: "Dubai", offset: "UTC+4" },
      { value: "Asia/Kolkata", label: "Mumbai", offset: "UTC+5:30" },
      { value: "Asia/Singapore", label: "Singapore", offset: "UTC+8" },
      { value: "Asia/Bangkok", label: "Bangkok", offset: "UTC+7" },
      { value: "Asia/Jakarta", label: "Jakarta", offset: "UTC+7" },
    ]
  },
  {
    region: "Australia & Pacific",
    timezones: [
      { value: "Australia/Sydney", label: "Sydney", offset: "UTC+10" },
      { value: "Australia/Melbourne", label: "Melbourne", offset: "UTC+10" },
      { value: "Australia/Perth", label: "Perth", offset: "UTC+8" },
      { value: "Pacific/Auckland", label: "Auckland", offset: "UTC+12" },
      { value: "Pacific/Fiji", label: "Fiji", offset: "UTC+12" },
    ]
  },
  {
    region: "South America",
    timezones: [
      { value: "America/Sao_Paulo", label: "São Paulo", offset: "UTC-3" },
      { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires", offset: "UTC-3" },
      { value: "America/Lima", label: "Lima", offset: "UTC-5" },
      { value: "America/Bogota", label: "Bogotá", offset: "UTC-5" },
      { value: "America/Santiago", label: "Santiago", offset: "UTC-3" },
    ]
  },
  {
    region: "Africa",
    timezones: [
      { value: "Africa/Cairo", label: "Cairo", offset: "UTC+2" },
      { value: "Africa/Johannesburg", label: "Johannesburg", offset: "UTC+2" },
      { value: "Africa/Lagos", label: "Lagos", offset: "UTC+1" },
      { value: "Africa/Nairobi", label: "Nairobi", offset: "UTC+3" },
    ]
  }
];

const MobileTimezoneSelect: React.FC<MobileTimezoneSelectProps> = ({
  value,
  onValueChange,
  placeholder = "Select timezone"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedTimezone = useMemo(() => {
    for (const group of timezoneGroups) {
      const timezone = group.timezones.find(tz => tz.value === value);
      if (timezone) return timezone;
    }
    return null;
  }, [value]);

  const filteredGroups = useMemo(() => {
    if (!searchTerm) return timezoneGroups;
    
    return timezoneGroups.map(group => ({
      ...group,
      timezones: group.timezones.filter(timezone =>
        timezone.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        timezone.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        timezone.offset.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(group => group.timezones.length > 0);
  }, [searchTerm]);

  const handleSelect = (timezoneValue: string) => {
    onValueChange(timezoneValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="w-full justify-between h-12 px-4"
      >
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-gray-500" />
          {selectedTimezone ? (
            <div className="text-left">
              <span>{selectedTimezone.label}</span>
              <span className="text-sm text-gray-500 ml-2">({selectedTimezone.offset})</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>

      {/* Mobile Fullscreen Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold">Select Timezone</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setIsOpen(false);
                setSearchTerm('');
              }}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search timezones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
                autoFocus
              />
            </div>
          </div>

          {/* Timezones List */}
          <div className="flex-1 overflow-y-auto">
            {filteredGroups.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No timezones found</p>
              </div>
            ) : (
              <div>
                {filteredGroups.map((group) => (
                  <div key={group.region} className="border-b border-gray-100 last:border-b-0">
                    <div className="px-4 py-3 bg-gray-50">
                      <h3 className="font-medium text-gray-900">{group.region}</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {group.timezones.map((timezone) => (
                        <button
                          key={timezone.value}
                          onClick={() => handleSelect(timezone.value)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                        >
                          <div className="text-left">
                            <p className="font-medium">{timezone.label}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm text-gray-500">{timezone.offset}</p>
                              <p className="text-xs text-gray-400">{timezone.value}</p>
                            </div>
                          </div>
                          {value === timezone.value && (
                            <Check className="h-5 w-5 text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileTimezoneSelect;