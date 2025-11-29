import React from 'react';
import SlidingWindow from './SlidingWindow';
import TranslationOptions from '../features/TranslationOptions';

interface TranslationSlidingWindowProps {
  isOpen: boolean;
  onClose: () => void;
  settings: any;
  onSettingsChange: (settings: any) => void;
  content: string;
  onContentChange: (translatedContent: { [key: string]: string }) => void;
  icon?: React.ReactNode;
}

const TranslationSlidingWindow: React.FC<TranslationSlidingWindowProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  content,
  onContentChange,
  icon
}) => {
  return (
    <SlidingWindow
      isOpen={isOpen}
      onClose={onClose}
      title="Translation Options"
      icon={icon}
      className=""
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Translate your content into different languages to reach a broader audience.
        </p>
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">TARGET LANGUAGES</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Spanish', 'French', 'German', 'Italian',
              'Portuguese', 'Chinese', 'Japanese', 'Korean',
              'Arabic', 'Russian', 'Hindi', 'Dutch'
            ].map((language) => (
              <button
                key={language}
                onClick={() => {
                  const newLanguages = settings.targetLanguages?.includes(language)
                    ? settings.targetLanguages.filter((l: string) => l !== language)
                    : [...(settings.targetLanguages || []), language];
                  onSettingsChange({
                    ...settings,
                    targetLanguages: newLanguages
                  });
                }}
                className={`h-12 w-full rounded-full border transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium ${
                  settings.targetLanguages?.includes(language)
                    ? 'bg-cyan-100 border-cyan-300 text-cyan-700 shadow-md scale-105'
                    : 'border-border hover:bg-cyan-50 hover:border-cyan-200 hover:scale-105'
                }`}
              >
                {language}
              </button>
            ))}
          </div>
          
          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">TRANSLATION OPTIONS</h4>
            <button
              onClick={() => onSettingsChange({
                ...settings,
                autoTranslate: !settings.autoTranslate
              })}
              className={`h-12 w-full rounded-full border transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium ${
                settings.autoTranslate
                  ? 'bg-cyan-100 border-cyan-300 text-cyan-700 shadow-md scale-105'
                  : 'border-border hover:bg-cyan-50 hover:border-cyan-200 hover:scale-105'
              }`}
            >
              Auto-Translate Posts
            </button>
          </div>
        </div>
        
        <TranslationOptions 
          settings={settings}
          onSettingsChange={onSettingsChange}
          content={content}
          onContentChange={onContentChange}
        />
      </div>
    </SlidingWindow>
  );
};

export default TranslationSlidingWindow;