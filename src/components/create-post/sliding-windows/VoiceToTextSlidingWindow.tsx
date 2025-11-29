import React from 'react';
import SlidingWindow from './SlidingWindow';
import VoiceToTextDictation from '../features/VoiceToTextDictation';

interface VoiceToTextSlidingWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onTextGenerated: (text: string) => void;
  icon?: React.ReactNode;
}

const VoiceToTextSlidingWindow: React.FC<VoiceToTextSlidingWindowProps> = ({
  isOpen,
  onClose,
  onTextGenerated,
  icon
}) => {
  return (
    <SlidingWindow
      isOpen={isOpen}
      onClose={onClose}
      title="Voice to Text"
      icon={icon}
      className=""
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Use voice dictation to convert your speech into text for your post.
        </p>
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">VOICE CONTROLS</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Start Recording', action: 'start' },
              { label: 'Stop Recording', action: 'stop' },
              { label: 'Pause/Resume', action: 'pause' },
              { label: 'Clear Text', action: 'clear' }
            ].map((control) => (
              <button
                key={control.action}
                onClick={() => {
                  // Handle voice control actions
                  if (control.action === 'clear') {
                    onTextGenerated('');
                  }
                }}
                className="h-12 w-full rounded-full border border-border hover:bg-green-50 hover:border-green-200 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
              >
                {control.label}
              </button>
            ))}
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">LANGUAGE OPTIONS</h4>
            {[
              'English (US)', 'English (UK)', 'Spanish', 'French',
              'German', 'Italian', 'Portuguese', 'Chinese'
            ].map((language) => (
              <button
                key={language}
                className="h-10 w-full rounded-full border border-border hover:bg-green-50 hover:border-green-200 hover:scale-105 transition-all duration-200 flex items-center justify-center text-sm"
              >
                {language}
              </button>
            ))}
          </div>
        </div>
        
        <VoiceToTextDictation 
          onTextGenerated={onTextGenerated}
        />
      </div>
    </SlidingWindow>
  );
};

export default VoiceToTextSlidingWindow;