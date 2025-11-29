import React, { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command';
import { LANGUAGES, Language } from '@/data/languages';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/hooks/useLocalization';

interface LanguageSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const LanguageSelect: React.FC<LanguageSelectProps> = ({
  value,
  onValueChange,
  placeholder = "Zgjidhni gjuhën tuaj të preferuar",
  className
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentLanguage } = useLocalization();

  // Get selected language
  const selectedLanguage = useMemo(() => {
    return value ? LANGUAGES.find(language => language.code === value) : null;
  }, [value]);

  // Sort languages alphabetically and filter based on search query
  const filteredLanguages = useMemo(() => {
    // First sort all languages alphabetically by name
    const sortedLanguages = [...LANGUAGES].sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

    // If no search query, return all sorted languages
    if (!searchQuery || !searchQuery.trim()) {
      return sortedLanguages;
    }
    
    const query = searchQuery.toLowerCase().trim();
    
    // Filter and sort by relevance: exact matches first, then starts-with, then contains
    const filtered = sortedLanguages.filter(language => {
      const name = language.name.toLowerCase();
      const nativeName = language.nativeName.toLowerCase();
      const code = language.code.toLowerCase();
      
      return name.startsWith(query) || 
             nativeName.startsWith(query) ||
             name.includes(query) ||
             nativeName.includes(query) ||
             code.startsWith(query);
    });

    // Sort filtered results by relevance
    return filtered.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const aNative = a.nativeName.toLowerCase();
      const aCode = a.code.toLowerCase();
      const bName = b.name.toLowerCase();
      const bNative = b.nativeName.toLowerCase();
      const bCode = b.code.toLowerCase();

      // Exact matches first
      const aExact = aName === query || aNative === query || aCode === query;
      const bExact = bName === query || bNative === query || bCode === query;
      if (aExact !== bExact) return aExact ? -1 : 1;

      // Then starts-with matches
      const aStarts = aName.startsWith(query) || aNative.startsWith(query) || aCode.startsWith(query);
      const bStarts = bName.startsWith(query) || bNative.startsWith(query) || bCode.startsWith(query);
      if (aStarts !== bStarts) return aStarts ? -1 : 1;

      // Finally alphabetical order for the rest
      return aName.localeCompare(bName);
    });
  }, [searchQuery]);

  const handleSelect = (languageCode: string) => {
    onValueChange?.(languageCode);
    setOpen(false);
    setSearchQuery('');
  };

  const displayName = (language: Language) => {
    return currentLanguage === 'sq' ? language.nativeName : language.name;
  };

  const getCountryName = (language: Language) => {
    // Extract country name from flag or provide country mapping
    const countryMapping: { [key: string]: string } = {
      '🇦🇱': 'Albania',
      '🇬🇧': 'United Kingdom', 
      '🇩🇪': 'Germany',
      '🇫🇷': 'France',
      '🇮🇹': 'Italy',
      '🇪🇸': 'Spain',
      '🇵🇹': 'Portugal',
      '🇳🇱': 'Netherlands',
      '🇵🇱': 'Poland',
      '🇷🇺': 'Russia',
      '🇭🇷': 'Croatia',
      '🇷🇸': 'Serbia',
      '🇧🇦': 'Bosnia and Herzegovina',
      '🇲🇰': 'North Macedonia',
      '🇲🇪': 'Montenegro',
      '🇸🇮': 'Slovenia',
      '🇧🇬': 'Bulgaria',
      '🇬🇷': 'Greece',
      '🇹🇷': 'Turkey',
      '🇷🇴': 'Romania',
      '🇨🇳': 'China',
      '🇹🇼': 'Taiwan',
      '🇯🇵': 'Japan',
      '🇰🇷': 'South Korea',
      '🇮🇳': 'India',
      '🇧🇩': 'Bangladesh',
      '🇵🇰': 'Pakistan',
      '🇸🇦': 'Saudi Arabia',
      '🇮🇷': 'Iran',
      '🇹🇭': 'Thailand',
      '🇻🇳': 'Vietnam',
      '🇮🇩': 'Indonesia',
      '🇲🇾': 'Malaysia',
      '🇵🇭': 'Philippines',
      '🇳🇵': 'Nepal',
      '🇱🇰': 'Sri Lanka',
      '🇲🇲': 'Myanmar',
      '🇰🇭': 'Cambodia',
      '🇱🇦': 'Laos',
      '🇲🇳': 'Mongolia',
      '🇬🇪': 'Georgia',
      '🇦🇲': 'Armenia',
      '🇦🇿': 'Azerbaijan',
      '🇰🇿': 'Kazakhstan',
      '🇰🇬': 'Kyrgyzstan',
      '🇹🇯': 'Tajikistan',
      '🇹🇲': 'Turkmenistan',
      '🇺🇿': 'Uzbekistan',
      '🇦🇫': 'Afghanistan',
      '🇲🇻': 'Maldives',
      '🇹🇿': 'Tanzania',
      '🇿🇦': 'South Africa',
      '🇪🇹': 'Ethiopia',
      '🇳🇬': 'Nigeria',
      '🇸🇴': 'Somalia',
      '🇲🇬': 'Madagascar',
      '🇷🇼': 'Rwanda',
      '🇧🇮': 'Burundi',
      '🇺🇬': 'Uganda',
      '🇪🇷': 'Eritrea',
      '🇲🇼': 'Malawi',
      '🇿🇼': 'Zimbabwe',
      '🇸🇿': 'Eswatini',
      '🇧🇼': 'Botswana',
      '🇱🇸': 'Lesotho',
      '🇸🇳': 'Senegal',
      '🇬🇳': 'Guinea',
      '🇲🇱': 'Mali',
      '🇬🇭': 'Ghana',
      '🇨🇩': 'Democratic Republic of Congo',
      '🇮🇱': 'Israel',
      '🇮🇶': 'Iraq',
      '🇧🇷': 'Brazil',
      '🇲🇽': 'Mexico',
      '🇦🇷': 'Argentina',
      '🇨🇦': 'Canada',
      '🇵🇪': 'Peru',
      '🇵🇾': 'Paraguay',
      '🇧🇴': 'Bolivia',
      '🇭🇹': 'Haiti',
      '🇨🇼': 'Curaçao',
      '🇳🇿': 'New Zealand',
      '🇫🇯': 'Fiji',
      '🇹🇴': 'Tonga',
      '🇼🇸': 'Samoa',
      '🇰🇮': 'Kiribati',
      '🇵🇼': 'Palau',
      '🇲🇭': 'Marshall Islands',
      '🇳🇷': 'Nauru',
      '🇹🇻': 'Tuvalu',
      '🇻🇺': 'Vanuatu',
      '🇵🇬': 'Papua New Guinea',
      '🇨🇭': 'Switzerland',
      '🇱🇺': 'Luxembourg',
      '🇫🇴': 'Faroe Islands',
      '🇬🇱': 'Greenland',
      '🇹🇱': 'East Timor',
      '🇧🇹': 'Bhutan',
      '🇲🇦': 'Morocco',
      '🇹🇳': 'Tunisia',
      '🇩🇿': 'Algeria',
      '🇪🇬': 'Egypt',
      '🇱🇾': 'Libya',
      '🇸🇩': 'Sudan',
      '🇻🇦': 'Vatican City',
      '🌍': 'International',
      '🌐': 'International',
      '🤖': 'Constructed',
      '🏛️': 'Historical'
    };
    return countryMapping[language.flag] || 'Unknown';
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
          {selectedLanguage ? (
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedLanguage.flag}</span>
              <div className="flex flex-col items-start">
                <span className="font-medium">{displayName(selectedLanguage)}</span>
                <span className="text-xs text-gray-500">
                  {getCountryName(selectedLanguage)}
                  {selectedLanguage.nativeName !== selectedLanguage.name && 
                   displayName(selectedLanguage) !== (currentLanguage === 'sq' ? selectedLanguage.name : selectedLanguage.nativeName) && (
                    <span> ~ {currentLanguage === 'sq' ? selectedLanguage.name : selectedLanguage.nativeName}</span>
                  )}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground font-normal">{placeholder}</span>
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
              placeholder={currentLanguage === 'sq' ? "Kërkoni gjuhën..." : "Search language..."}
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground border-0 focus:ring-0"
            />
          </div>
          <CommandList className="max-h-[300px] overflow-y-auto border-2 border-gray-200 rounded-b-md">
            <CommandEmpty className="py-6 text-center text-sm text-gray-500">
              {currentLanguage === 'sq' ? "Nuk u gjet asnjë gjuhë." : "No language found."}
            </CommandEmpty>
            <CommandGroup>
              {filteredLanguages.map((language) => (
                <CommandItem
                  key={language.code}
                  value={language.code}
                  onSelect={() => handleSelect(language.code)}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-lg flex-shrink-0">{language.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {displayName(language)}
                    </span>
                    {currentLanguage === 'sq' && language.nativeName !== language.name && (
                      <span className="text-xs text-gray-500">{language.name}</span>
                    )}
                    {currentLanguage === 'en' && language.nativeName !== language.name && (
                      <span className="text-xs text-gray-500">{language.nativeName}</span>
                    )}
                  </div>
                  {value === language.code && (
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