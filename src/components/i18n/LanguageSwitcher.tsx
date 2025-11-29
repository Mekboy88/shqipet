import React, { useState } from 'react';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { useLocalization, Language } from '@/hooks/useLocalization';

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact' | 'icon-only';
  showDetectedLabel?: boolean;
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'default',
  showDetectedLabel = true,
  className = ''
}) => {
  const {
    currentLanguage,
    autoDetectedLanguage,
    supportedLanguages,
    getCurrentLanguage,
    changeLanguage
  } = useLocalization();

  const [isOpen, setIsOpen] = useState(false);
  const currentLang = getCurrentLanguage();

  const handleLanguageSelect = (language: Language) => {
    changeLanguage(language.code);
    setIsOpen(false);
  };

  if (variant === 'icon-only') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label="Change language"
        >
          <Globe className="h-5 w-5 text-gray-600" />
        </button>
        
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="py-2">
              {supportedLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language)}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between ${
                    language.code === currentLanguage ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <span className={language.rtl ? 'font-arabic' : ''}>{language.nativeName}</span>
                  {language.code === currentLanguage && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <span className={currentLang.rtl ? 'font-arabic' : ''}>{currentLang.code.toUpperCase()}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="py-2">
              {supportedLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                    language.code === currentLanguage ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <span className={language.rtl ? 'font-arabic' : ''}>{language.nativeName}</span>
                  {language.code === currentLanguage && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <Globe className="h-5 w-5 text-gray-500" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`font-medium ${currentLang.rtl ? 'font-arabic' : ''}`}>
              {currentLang.nativeName}
            </span>
            {showDetectedLabel && autoDetectedLanguage === currentLanguage && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                Auto-detected
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500">{currentLang.name}</span>
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="py-2">
            {supportedLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between ${
                  language.code === currentLanguage ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <div>
                  <div className={`font-medium ${language.rtl ? 'font-arabic' : ''}`}>
                    {language.nativeName}
                  </div>
                  <div className="text-sm text-gray-500">{language.name}</div>
                </div>
                {language.code === currentLanguage && <Check className="h-5 w-5" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};