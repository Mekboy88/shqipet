import React, { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command';
import { COUNTRIES, Country } from '@/data/countries';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/hooks/useLocalization';

interface CountrySelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onValueChange,
  placeholder = "Zgjidhni vendin ku jetoni",
  className
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentLanguage } = useLocalization();

  // Get selected country
  const selectedCountry = useMemo(() => {
    return value ? COUNTRIES.find(country => country.code === value) : null;
  }, [value]);

  // Sort countries alphabetically and filter based on search query
  const filteredCountries = useMemo(() => {
    // First sort all countries alphabetically by Albanian name
    const sortedCountries = [...COUNTRIES].sort((a, b) => {
      const nameA = currentLanguage === 'sq' ? a.nameAlbanian : a.name;
      const nameB = currentLanguage === 'sq' ? b.nameAlbanian : b.name;
      return nameA.toLowerCase().localeCompare(nameB.toLowerCase());
    });

    // If no search query, return all sorted countries
    if (!searchQuery || !searchQuery.trim()) {
      return sortedCountries;
    }
    
    const query = searchQuery.toLowerCase().trim();
    
    // Filter and sort by relevance: exact matches first, then starts-with, then contains
    const filtered = sortedCountries.filter(country => {
      const albanianName = country.nameAlbanian.toLowerCase();
      const englishName = country.name.toLowerCase();
      const countryCode = country.code.toLowerCase();
      
      return albanianName.startsWith(query) || 
             englishName.startsWith(query) ||
             albanianName.includes(query) ||
             englishName.includes(query) ||
             countryCode.startsWith(query);
    });

    // Sort filtered results by relevance
    return filtered.sort((a, b) => {
      const aAlbanian = a.nameAlbanian.toLowerCase();
      const aEnglish = a.name.toLowerCase();
      const aCode = a.code.toLowerCase();
      const bAlbanian = b.nameAlbanian.toLowerCase();
      const bEnglish = b.name.toLowerCase();
      const bCode = b.code.toLowerCase();

      // Exact matches first
      const aExact = aAlbanian === query || aEnglish === query || aCode === query;
      const bExact = bAlbanian === query || bEnglish === query || bCode === query;
      if (aExact !== bExact) return aExact ? -1 : 1;

      // Then starts-with matches
      const aStarts = aAlbanian.startsWith(query) || aEnglish.startsWith(query) || aCode.startsWith(query);
      const bStarts = bAlbanian.startsWith(query) || bEnglish.startsWith(query) || bCode.startsWith(query);
      if (aStarts !== bStarts) return aStarts ? -1 : 1;

      // Finally alphabetical order for the rest
      const nameA = currentLanguage === 'sq' ? aAlbanian : aEnglish;
      const nameB = currentLanguage === 'sq' ? bAlbanian : bEnglish;
      return nameA.localeCompare(nameB);
    });
  }, [searchQuery, currentLanguage]);

  const handleSelect = (countryCode: string) => {
    onValueChange?.(countryCode);
    setOpen(false);
    setSearchQuery('');
  };

  const displayName = (country: Country) => {
    return currentLanguage === 'sq' ? country.nameAlbanian : country.name;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between border-2 border-gray-300 bg-gray-50 hover:bg-gray-50 focus:border-primary focus:ring-primary",
            className
          )}
        >
          {selectedCountry ? (
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="font-medium">{displayName(selectedCountry)}</span>
            </div>
          ) : (
            <span className="text-muted-foreground font-normal">Zgjidhni vendin ku jetoni</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-full p-0 border-2 border-gray-300" 
        align="start"
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <Command className="w-full" shouldFilter={false}>
          <div className="flex items-center border-b border-gray-200 px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder={currentLanguage === 'sq' ? "Kërkoni vendin..." : "Search country..."}
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground border-0 focus:ring-0"
            />
          </div>
          <CommandList className="max-h-[300px] overflow-y-auto border-2 border-gray-200 rounded-b-md">
            <CommandEmpty className="py-6 text-center text-sm text-gray-500">
              {currentLanguage === 'sq' ? "Nuk u gjet asnjë vend." : "No country found."}
            </CommandEmpty>
            <CommandGroup>
              {filteredCountries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={country.code}
                  onSelect={() => handleSelect(country.code)}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-lg flex-shrink-0">{country.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {displayName(country)}
                    </span>
                    {currentLanguage === 'sq' && country.nameAlbanian !== country.name && (
                      <span className="text-xs text-gray-500">{country.name}</span>
                    )}
                  </div>
                  {value === country.code && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};