import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Languages, ChevronDown, Globe, Zap } from 'lucide-react';

interface TranslationSettings {
  autoTranslate: boolean;
  targetLanguages: string[];
  showOriginal: boolean;
}

interface TranslationOptionsProps {
  settings: TranslationSettings;
  onSettingsChange: (settings: TranslationSettings) => void;
  content: string;
  onContentChange: (translatedContent: { [key: string]: string }) => void;
}

const TranslationOptions: React.FC<TranslationOptionsProps> = ({ 
  settings, 
  onSettingsChange, 
  content,
  onContentChange 
}) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});

  const languages = [
    { code: 'en-US', name: 'Anglisht (SHBA)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'Anglisht (MB)', flag: '🇬🇧' },
    { code: 'en-CA', name: 'Anglisht (Kanada)', flag: '🇨🇦' },
    { code: 'en-AU', name: 'Anglisht (Australi)', flag: '🇦🇺' },
    { code: 'en-IE', name: 'Anglisht (Irlandë)', flag: '🇮🇪' },
    { code: 'en-NZ', name: 'Anglisht (Zelandë e Re)', flag: '🇳🇿' },
    { code: 'bs', name: 'Boshnjakisht', flag: '🇧🇦' },
    { code: 'bg', name: 'Bullgarisht', flag: '🇧🇬' },
    { code: 'hr', name: 'Kroatisht', flag: '🇭🇷' },
    { code: 'mk', name: 'Maqedonisht', flag: '🇲🇰' },
    { code: 'sl', name: 'Sllovenisht', flag: '🇸🇮' },
    { code: 'el', name: 'Greqisht', flag: '🇬🇷' },
    { code: 'ro', name: 'Rumanisht', flag: '🇷🇴' },
    { code: 'fr', name: 'Frëngjisht', flag: '🇫🇷' },
    { code: 'de', name: 'Gjermanisht', flag: '🇩🇪' },
    { code: 'it', name: 'Italisht', flag: '🇮🇹' },
    { code: 'es', name: 'Spanjisht', flag: '🇪🇸' },
    { code: 'pt', name: 'Portugalisht', flag: '🇵🇹' },
    { code: 'pl', name: 'Polonisht', flag: '🇵🇱' },
    { code: 'nl', name: 'Holandisht', flag: '🇳🇱' },
    { code: 'cs', name: 'Çekisht', flag: '🇨🇿' },
    { code: 'sk', name: 'Sllovakisht', flag: '🇸🇰' },
    { code: 'hu', name: 'Hungarisht', flag: '🇭🇺' },
    { code: 'sv', name: 'Suedisht', flag: '🇸🇪' },
    { code: 'da', name: 'Danisht', flag: '🇩🇰' },
    { code: 'no', name: 'Norvegjisht', flag: '🇳🇴' },
    { code: 'ru', name: 'Rusisht', flag: '🇷🇺' },
    { code: 'fi', name: 'Finlandisht', flag: '🇫🇮' },
    { code: 'uk', name: 'Ukrainisht', flag: '🇺🇦' },
    { code: 'tr', name: 'Turqisht', flag: '🇹🇷' },
    { code: 'ja', name: 'Japonisht', flag: '🇯🇵' },
    { code: 'zh', name: 'Kinezisht', flag: '🇨🇳' },
    { code: 'ko', name: 'Koreanisht', flag: '🇰🇷' },
    { code: 'hi', name: 'Hindisht', flag: '🇮🇳' },
    { code: 'th', name: 'Tajlandisht', flag: '🇹🇭' },
    { code: 'ar', name: 'Arabisht', flag: '🇸🇦' },
    { code: 'vi', name: 'Vietnamisht', flag: '🇻🇳' },
    { code: 'id', name: 'Indonezisht', flag: '🇮🇩' },
    { code: 'ms', name: 'Malajisht', flag: '🇲🇾' },
    { code: 'tl', name: 'Filipinisht', flag: '🇵🇭' },
    { code: 'bn', name: 'Bengalisht', flag: '🇧🇩' },
    { code: 'fa', name: 'Persianisht', flag: '🇮🇷' },
    { code: 'he', name: 'Hebraisht', flag: '🇮🇱' },
    { code: 'ur', name: 'Urdisht', flag: '🇵🇰' }
  ];

  const toggleLanguage = (languageCode: string) => {
    const newLanguages = settings.targetLanguages.includes(languageCode)
      ? settings.targetLanguages.filter(lang => lang !== languageCode)
      : [...settings.targetLanguages, languageCode];
    
    onSettingsChange({
      ...settings,
      targetLanguages: newLanguages
    });
  };

  const toggleAutoTranslate = () => {
    onSettingsChange({
      ...settings,
      autoTranslate: !settings.autoTranslate
    });
  };

  // Mock translation function
  const translateContent = async () => {
    if (!content.trim() || settings.targetLanguages.length === 0) return;

    setIsTranslating(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock translations (in real app, would call Google Translate or similar API)
      const mockTranslations: { [key: string]: string } = {};
      
      settings.targetLanguages.forEach(langCode => {
        const language = languages.find(lang => lang.code === langCode);
        if (language) {
          mockTranslations[langCode] = `[${language.name}] ${content} (This is a mock translation)`;
        }
      });
      
      setTranslations(mockTranslations);
      onContentChange(mockTranslations);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="space-y-3">
      {settings.targetLanguages.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {settings.targetLanguages.map(langCode => {
            const language = languages.find(lang => lang.code === langCode);
            if (!language) return null;
            
            return (
              <span
                key={langCode}
                className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-800 px-2 py-1 rounded-full text-xs"
              >
                <span>{language.flag}</span>
                {language.name}
                <button 
                  onClick={() => toggleLanguage(langCode)}
                  className="ml-1 hover:text-cyan-900"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      {settings.targetLanguages.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No target languages selected
        </div>
      )}

      {settings.autoTranslate && (
        <div className="text-sm p-2 bg-cyan-50 rounded-lg border border-cyan-200 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-600" />
          <span>Auto-translate enabled</span>
        </div>
      )}

      {Object.keys(translations).length > 0 && (
        <div className="space-y-2 border rounded-lg p-3 bg-card/50">
          <div className="text-sm font-medium flex items-center gap-2">
            <Languages className="w-4 h-4" />
            Translations Preview
          </div>
          {Object.entries(translations).map(([langCode, text]) => {
            const language = languages.find(lang => lang.code === langCode);
            return (
              <div key={langCode} className="bg-white/50 rounded p-2">
                <div className="flex items-center gap-1 text-xs font-medium mb-1">
                  <span>{language?.flag}</span>
                  <span>{language?.name}</span>
                </div>
                <p className="text-sm text-gray-700">{text}</p>
              </div>
            );
          })}
        </div>
      )}

      {isTranslating && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
          <span>Translating to {settings.targetLanguages.length} language{settings.targetLanguages.length !== 1 ? 's' : ''}...</span>
        </div>
      )}
    </div>
  );
};

export default TranslationOptions;