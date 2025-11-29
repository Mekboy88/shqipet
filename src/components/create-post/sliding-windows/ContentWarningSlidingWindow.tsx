import React, { useState } from 'react';
import SlidingWindow from './SlidingWindow';
import ContentWarningSelector from '../features/ContentWarningSelector';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ContentWarningSlidingWindowProps {
  isOpen: boolean;
  onClose: () => void;
  warnings: string[];
  onWarningsChange: (warnings: string[]) => void;
  icon?: React.ReactNode;
}

const ContentWarningSlidingWindow: React.FC<ContentWarningSlidingWindowProps> = ({
  isOpen,
  onClose,
  warnings,
  onWarningsChange,
  icon
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customWarningText, setCustomWarningText] = useState('');

  const handleAddCustomWarning = () => {
    if (customWarningText.trim()) {
      onWarningsChange([...warnings, `Custom: ${customWarningText.trim()}`]);
      setCustomWarningText('');
      setShowCustomInput(false);
    }
  };

  return (
    <SlidingWindow
      isOpen={isOpen}
      onClose={onClose}
      title="Content Warning Settings"
      icon={icon}
      className=""
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Add content warnings to help users make informed decisions about viewing your post.
        </p>
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">WARNING TYPES</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Violence', 'Adult Content', 'Sensitive Topic', 'Graphic Content',
              'Disturbing', 'Political', 'Religious', 'Medical Content',
              'Spoilers', 'Flashing Lights', 'Loud Sounds', 'Mental Health',
              'Self Harm', 'Substance Use', 'Death/Injury', 'Animal Cruelty'
            ].map((warning) => (
              <button
                key={warning}
                onClick={() => {
                  const newWarnings = warnings.includes(warning)
                    ? warnings.filter(w => w !== warning)
                    : [...warnings, warning];
                  onWarningsChange(newWarnings);
                }}
                className={`h-12 w-full rounded-full border transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium ${
                  warnings.includes(warning)
                    ? 'bg-orange-100 border-orange-300 text-orange-700 shadow-md scale-105'
                    : 'border-border hover:bg-orange-50 hover:border-orange-200 hover:scale-105'
                }`}
              >
                {warning}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">ADDITIONAL OPTIONS</h4>
          <div className="grid grid-cols-1 gap-2">
            {!showCustomInput ? (
              <button
                onClick={() => setShowCustomInput(true)}
                className="h-10 w-full rounded-full border border-border hover:bg-orange-50 hover:border-orange-200 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
              >
                + Add Custom Warning
              </button>
            ) : (
              <div className="space-y-2 p-3 border border-orange-200 rounded-lg bg-orange-50">
                <label className="text-sm font-medium text-orange-800">Custom Warning Text:</label>
                <Input
                  value={customWarningText}
                  onChange={(e) => setCustomWarningText(e.target.value)}
                  placeholder="Enter your custom warning message..."
                  className="w-full"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomWarning()}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddCustomWarning}
                    disabled={!customWarningText.trim()}
                    className="flex-1 h-8 text-sm"
                    size="sm"
                  >
                    Add Warning
                  </Button>
                  <Button
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomWarningText('');
                    }}
                    variant="outline"
                    className="flex-1 h-8 text-sm"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            <button
              onClick={() => onWarningsChange([])}
              className="h-10 w-full rounded-full border border-border hover:bg-red-50 hover:border-red-200 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium text-red-600"
            >
              Clear All Warnings
            </button>
          </div>
        </div>
        
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-xs text-orange-800">
          <p className="font-medium mb-1">Why use content warnings?</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Help users avoid content that might be distressing</li>
            <li>Improve accessibility for sensitive viewers</li>
            <li>Build trust with your audience</li>
            <li>Comply with platform guidelines</li>
          </ul>
        </div>
        
        <ContentWarningSelector 
          warnings={warnings}
          onWarningsChange={onWarningsChange}
        />
      </div>
    </SlidingWindow>
  );
};

export default ContentWarningSlidingWindow;