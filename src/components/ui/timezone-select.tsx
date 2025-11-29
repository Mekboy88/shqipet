import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, Clock } from 'lucide-react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from './command';
import { cn } from '@/lib/utils';

interface TimezoneSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Complete list of world timezones with display names
const TIMEZONES = [
  // Europe
  { value: 'Europe/Tirane', label: 'Tirana (CET)', region: 'Europa' },
  { value: 'Europe/London', label: 'Londra (GMT)', region: 'Europa' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)', region: 'Europa' },
  { value: 'Europe/Paris', label: 'Paris (CET)', region: 'Europa' },
  { value: 'Europe/Rome', label: 'Roma (CET)', region: 'Europa' },
  { value: 'Europe/Madrid', label: 'Madrid (CET)', region: 'Europa' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET)', region: 'Europa' },
  { value: 'Europe/Vienna', label: 'Vjena (CET)', region: 'Europa' },
  { value: 'Europe/Brussels', label: 'Bruksel (CET)', region: 'Europa' },
  { value: 'Europe/Prague', label: 'Praga (CET)', region: 'Europa' },
  { value: 'Europe/Budapest', label: 'Budapesti (CET)', region: 'Europa' },
  { value: 'Europe/Warsaw', label: 'Varshava (CET)', region: 'Europa' },
  { value: 'Europe/Athens', label: 'Athinë (EET)', region: 'Europa' },
  { value: 'Europe/Istanbul', label: 'Stamboll (TRT)', region: 'Europa' },
  { value: 'Europe/Moscow', label: 'Moskë (MSK)', region: 'Europa' },
  { value: 'Europe/Stockholm', label: 'Stokholm (CET)', region: 'Europa' },
  { value: 'Europe/Oslo', label: 'Oslo (CET)', region: 'Europa' },
  { value: 'Europe/Copenhagen', label: 'Kopenhagen (CET)', region: 'Europa' },
  { value: 'Europe/Helsinki', label: 'Helsinki (EET)', region: 'Europa' },
  { value: 'Europe/Dublin', label: 'Dublin (GMT)', region: 'Europa' },
  { value: 'Europe/Zurich', label: 'Cyrih (CET)', region: 'Europa' },
  { value: 'Europe/Lisbon', label: 'Lisbona (WET)', region: 'Europa' },
  { value: 'Europe/Bucharest', label: 'Bukureshti (EET)', region: 'Europa' },
  { value: 'Europe/Sofia', label: 'Sofia (EET)', region: 'Europa' },

  // North America
  { value: 'America/New_York', label: 'New York (EST)', region: 'Amerika e Veriut' },
  { value: 'America/Chicago', label: 'Chicago (CST)', region: 'Amerika e Veriut' },
  { value: 'America/Denver', label: 'Denver (MST)', region: 'Amerika e Veriut' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST)', region: 'Amerika e Veriut' },
  { value: 'America/Toronto', label: 'Toronto (EST)', region: 'Amerika e Veriut' },
  { value: 'America/Vancouver', label: 'Vancouver (PST)', region: 'Amerika e Veriut' },
  { value: 'America/Mexico_City', label: 'Mexico City (CST)', region: 'Amerika e Veriut' },

  // Asia
  { value: 'Asia/Tokyo', label: 'Tokio (JST)', region: 'Azia' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)', region: 'Azia' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)', region: 'Azia' },
  { value: 'Asia/Singapore', label: 'Singapor (SGT)', region: 'Azia' },
  { value: 'Asia/Seoul', label: 'Seoul (KST)', region: 'Azia' },
  { value: 'Asia/Bangkok', label: 'Bangkok (ICT)', region: 'Azia' },
  { value: 'Asia/Jakarta', label: 'Jakarta (WIB)', region: 'Azia' },
  { value: 'Asia/Manila', label: 'Manila (PHT)', region: 'Azia' },
  { value: 'Asia/Kuala_Lumpur', label: 'Kuala Lumpur (MYT)', region: 'Azia' },
  { value: 'Asia/Kolkata', label: 'Kolkata (IST)', region: 'Azia' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)', region: 'Azia' },
  { value: 'Asia/Tehran', label: 'Tehran (IRST)', region: 'Azia' },

  // Australia & Oceania
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)', region: 'Australia' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEDT)', region: 'Australia' },
  { value: 'Australia/Brisbane', label: 'Brisbane (AEST)', region: 'Australia' },
  { value: 'Australia/Perth', label: 'Perth (AWST)', region: 'Australia' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZDT)', region: 'Oqeania' },
  { value: 'Pacific/Fiji', label: 'Fiji (FJT)', region: 'Oqeania' },
];

export const TimezoneSelect: React.FC<TimezoneSelectProps> = ({
  value,
  onValueChange,
  placeholder = "Zgjidhni zonën kohore",
  className
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get selected timezone
  const selectedTimezone = useMemo(() => {
    return value ? TIMEZONES.find(tz => tz.value === value) : null;
  }, [value]);

  // Filter and sort timezones based on search query
  const filteredTimezones = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) {
      return TIMEZONES;
    }
    
    const query = searchQuery.toLowerCase().trim();
    
    return TIMEZONES.filter(timezone => {
      const label = timezone.label.toLowerCase();
      const value = timezone.value.toLowerCase();
      const region = timezone.region.toLowerCase();
      
      return label.includes(query) || 
             value.includes(query) ||
             region.includes(query);
    }).sort((a, b) => {
      // Prioritize exact matches and then alphabetical order
      const aLabel = a.label.toLowerCase();
      const bLabel = b.label.toLowerCase();
      
      const aStarts = aLabel.startsWith(query);
      const bStarts = bLabel.startsWith(query);
      
      if (aStarts !== bStarts) return aStarts ? -1 : 1;
      
      return aLabel.localeCompare(bLabel);
    });
  }, [searchQuery]);

  const handleSelect = (timezoneValue: string) => {
    onValueChange?.(timezoneValue);
    setOpen(false);
    setSearchQuery('');
  };

  // Group timezones by region
  const groupedTimezones = useMemo(() => {
    const groups: { [key: string]: typeof TIMEZONES } = {};
    
    filteredTimezones.forEach(timezone => {
      if (!groups[timezone.region]) {
        groups[timezone.region] = [];
      }
      groups[timezone.region].push(timezone);
    });
    
    return groups;
  }, [filteredTimezones]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between transition-all duration-200 hover:shadow-md focus:shadow-lg",
            className
          )}
        >
          {selectedTimezone ? (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium">{selectedTimezone.label}</span>
            </div>
          ) : (
            <span className="text-muted-foreground font-normal">{placeholder}</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-full p-0 bg-white shadow-lg border border-gray-200" 
        align="start"
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <Command className="w-full" shouldFilter={false}>
          <div className="flex items-center border-b border-gray-200 px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Kërkoni zonën kohore..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground border-0 focus:ring-0"
            />
          </div>
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty className="py-6 text-center text-sm text-gray-500">
              Nuk u gjet asnjë zonë kohore.
            </CommandEmpty>
            
            {Object.entries(groupedTimezones).map(([region, timezones]) => (
              <div key={region}>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">
                  {region}
                </div>
                {timezones.map((timezone) => (
                  <CommandItem
                    key={timezone.value}
                    value={timezone.value}
                    onSelect={() => handleSelect(timezone.value)}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-50 last:border-b-0"
                  >
                    <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="font-medium text-gray-900">{timezone.label}</span>
                    {value === timezone.value && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                    )}
                  </CommandItem>
                ))}
              </div>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};