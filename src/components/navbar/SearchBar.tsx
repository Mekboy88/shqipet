import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent } from '@/components/ui/popover';
import * as PopoverPrimitive from '@radix-ui/react-popover';

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState<number>(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  console.log('🔍 SearchBar component rendering - query:', searchQuery);

  // Measure input width for dropdown
  useEffect(() => {
    if (inputRef.current && isDropdownOpen) {
      setDropdownWidth(inputRef.current.offsetWidth);
    }
  }, [isDropdownOpen]);

  // Keep width in sync on window resize
  useEffect(() => {
    const handleResize = () => {
      if (inputRef.current) {
        setDropdownWidth(inputRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div ref={searchRef} className="relative w-80 max-w-md">
      <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen} modal={false}>
        <PopoverPrimitive.Anchor asChild>
          <div className="relative">
            {/* Search icon positioned inside the input field */}
            <div className="absolute inset-y-0 -left-1 flex items-center pointer-events-none z-10">
              <svg className="h-4 w-4 text-gray-800 dark:text-white" fill="currentColor" stroke="currentColor" strokeWidth="0.5" version="1.1" viewBox="0 0 41.551 41.55" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <g>
                    <path d="M23.839,12.646c-1.976,0-3.51,2.168-3.791,5.181H5.29c-0.552,0-1,0.447-1,1c0,0.553,0.448,1,1,1h1.757v2.175 c0,0.553,0.448,1,1,1c0.552,0,1-0.447,1-1v-2.175h1.844v2.593c0,0.553,0.448,1,1,1c0.552,0,1-0.447,1-1v-2.593h7.158 c0.281,3.013,1.814,5.181,3.791,5.181c2.189,0,3.841-2.656,3.841-6.181S26.027,12.646,23.839,12.646z M23.839,23.006 c-0.75,0-1.841-1.629-1.841-4.181c0-2.552,1.09-4.181,1.841-4.181s1.841,1.629,1.841,4.181 C25.68,21.377,24.589,23.006,23.839,23.006z"></path>
                    <path d="M16.152,2.673C7.246,2.673,0,9.919,0,18.826s7.246,16.152,16.152,16.152c4.803,0,9.11-2.119,12.072-5.459l11.712,9.146 c0.182,0.143,0.399,0.212,0.614,0.212c0.297,0,0.591-0.132,0.789-0.385c0.34-0.435,0.263-1.063-0.172-1.403l-11.701-9.137 c1.788-2.6,2.839-5.741,2.839-9.127C32.304,9.919,25.058,2.673,16.152,2.673z M16.152,32.978C8.348,32.978,2,26.629,2,18.827 C2,11.023,8.349,4.674,16.152,4.674s14.152,6.349,14.152,14.152C30.304,26.629,23.956,32.978,16.152,32.978z"></path>
                  </g>
                </g>
              </svg>
            </div>
            <Input
              ref={inputRef}
              type="text"
              placeholder="Kërko në Shqipet"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleFocus}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:ring-0 focus:border-gray-400 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none hover:border-gray-400 transition-colors bg-white -ml-6"
            />
          </div>
        </PopoverPrimitive.Anchor>
        <PopoverContent 
          side="bottom" 
          align="start" 
          sideOffset={6}
          alignOffset={-23}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            const target = e.target as Node;
            if (searchRef.current?.contains(target)) {
              e.preventDefault();
            }
          }}
          onFocusOutside={(e) => {
            const target = e.target as Node;
            if (searchRef.current?.contains(target)) {
              e.preventDefault();
            }
          }}
          onPointerDownOutside={(e) => {
            const target = e.target as Node;
            if (searchRef.current?.contains(target)) {
              e.preventDefault();
            }
          }}
          className="z-[110000] p-0 border border-gray-200 rounded-lg shadow-lg bg-white"
          style={{ width: dropdownWidth > 0 ? `${dropdownWidth}px` : '320px' }}
        >
          <div className="p-4 max-h-80 overflow-y-auto">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-800">Kërko në Shqipet</h3>
              
              {searchQuery ? (
                <div className="space-y-2">
                  <p className="text-xs text-gray-600">Rezultatet për: "{searchQuery}"</p>
                  <div className="text-xs text-gray-500">
                    Nuk u gjetën rezultate për këtë kërkim.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-1">Kërkime të fundit</h4>
                    <div className="text-xs text-gray-500">
                      Nuk ka kërkime të fundit.
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-1">Sugjerime</h4>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600 hover:bg-gray-50 p-1.5 rounded cursor-pointer">
                        Njerëz
                      </div>
                      <div className="text-xs text-gray-600 hover:bg-gray-50 p-1.5 rounded cursor-pointer">
                        Postime
                      </div>
                      <div className="text-xs text-gray-600 hover:bg-gray-50 p-1.5 rounded cursor-pointer">
                        Grupe
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchBar;
