import React, { useState, useRef, useEffect } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useLanguage, languages } from '@/contexts/LanguageContext';

const CustomLanguageIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g>
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M4 0H6V2H10V4H8.86807C8.57073 5.66996 7.78574 7.17117 6.6656 8.35112C7.46567 8.73941 8.35737 8.96842 9.29948 8.99697L10.2735 6H12.7265L15.9765 16H13.8735L13.2235 14H9.77647L9.12647 16H7.0235L8.66176 10.9592C7.32639 10.8285 6.08165 10.3888 4.99999 9.71246C3.69496 10.5284 2.15255 11 0.5 11H0V9H0.5C1.5161 9 2.47775 8.76685 3.33437 8.35112C2.68381 7.66582 2.14629 6.87215 1.75171 6H4.02179C4.30023 6.43491 4.62904 6.83446 4.99999 7.19044C5.88743 6.33881 6.53369 5.23777 6.82607 4H0V2H4V0ZM12.5735 12L11.5 8.69688L10.4265 12H12.5735Z" 
        fill="currentColor"
      />
    </g>
  </svg>
);
const RightSidebarFooter = () => {
  const { currentLanguage, setLanguage, t, getCurrentLanguage } = useLanguage();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [dropDirection, setDropDirection] = useState<'up' | 'down'>('up');
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkDropDirection = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        // If there's more space above and we're in the bottom 40% of screen, drop up
        setDropDirection(spaceAbove > spaceBelow && rect.top > window.innerHeight * 0.6 ? 'up' : 'down');
      }
    };

    checkDropDirection();
    window.addEventListener('resize', checkDropDirection);
    window.addEventListener('scroll', checkDropDirection);

    return () => {
      window.removeEventListener('resize', checkDropDirection);
      window.removeEventListener('scroll', checkDropDirection);
    };
  }, [isLanguageOpen]);

  const currentLang = getCurrentLanguage();

  return <div className="text-sm text-gray-500 mt-4 px-2">
      <div className="flex justify-between items-center mb-4 border-b pb-4">
        <span>© 2025 shqipet.com</span>
        <DropdownMenu open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              ref={buttonRef}
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-gray-500 hover:text-gray-800 p-1 h-auto"
            >
              <CustomLanguageIcon className="w-4 h-4" />
              <div className="flex flex-col text-xs">
                <span>{t('language')}</span>
                <span className="flex items-center gap-1">
                  <span>{currentLang.flag}</span>
                  <span>{currentLang.nativeName}</span>
                </span>
              </div>
              {isLanguageOpen ? (
                dropDirection === 'up' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
              ) : (
                dropDirection === 'up' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="dark:bg-[hsl(0,0%,5%)] w-64 bg-popover border shadow-lg z-50 max-h-80 overflow-y-auto"
            side={dropDirection === 'up' ? 'top' : 'bottom'}
            align="end"
            sideOffset={4}
          >
            {languages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => {
                  setLanguage(language.code);
                  setIsLanguageOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                  currentLanguage === language.code ? 'bg-gray-100' : ''
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{language.nativeName}</span>
                  <span className="text-xs text-gray-500">{language.name}</span>
                </div>
                {currentLanguage === language.code && (
                  <span className="ml-auto text-blue-600">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-500">
        <button className="hover:underline hover:text-gray-800" onClick={(e) => e.preventDefault()}>{t('about')}</button>
        <button className="hover:underline hover:text-gray-800" onClick={(e) => e.preventDefault()}>Directory</button>
        <button className="hover:underline hover:text-gray-800" onClick={(e) => e.preventDefault()}>Blog</button>
        <button className="hover:underline hover:text-gray-800" onClick={(e) => e.preventDefault()}>{t('contact')}</button>
        <button className="hover:underline hover:text-gray-800" onClick={(e) => e.preventDefault()}>Developers</button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-1 p-0 h-auto text-gray-500 hover:text-gray-800">
              <span>{t('more')}</span>
              <ChevronUp className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="dark:bg-[hsl(0,0%,5%)] w-48 bg-popover" side="top" align="end">
            <DropdownMenuItem asChild>
              <button onClick={(e) => e.preventDefault()} className="w-full cursor-pointer text-left">{t('privacy')} Policy</button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <button onClick={(e) => e.preventDefault()} className="w-full cursor-pointer text-left">{t('terms')} of Use</button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <button onClick={(e) => e.preventDefault()} className="w-full cursor-pointer text-left">Request a Refund</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>;
};
export default RightSidebarFooter;