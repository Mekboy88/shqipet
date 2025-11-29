import React from 'react';
import SlidingWindow from './SlidingWindow';
import AdvancedAudienceTargeting from '../features/AdvancedAudienceTargeting';

interface AudienceTargetingSlidingWindowProps {
  isOpen: boolean;
  onClose: () => void;
  settings: any;
  onSettingsChange: (settings: any) => void;
  icon?: React.ReactNode;
}

const AudienceTargetingSlidingWindow: React.FC<AudienceTargetingSlidingWindowProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  icon
}) => {
  return (
    <SlidingWindow
      isOpen={isOpen}
      onClose={onClose}
      title="Audience Targeting"
      icon={icon}
      className=""
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Target specific audiences with advanced demographic and interest-based filters.
        </p>
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">AUDIENCE TYPES</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Everyone', 'Friends Only', 'Specific Users', 'Age Groups',
              'Location Based', 'Interest Groups', 'Professional', 'Students'
            ].map((audience) => (
              <button
                key={audience}
                onClick={() => {
                  onSettingsChange({
                    ...settings,
                    selectedAudience: audience
                  });
                }}
                className={`h-12 w-full rounded-full border transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium ${
                  settings.selectedAudience === audience
                    ? 'bg-purple-100 border-purple-300 text-purple-700 shadow-md scale-105'
                    : 'border-border hover:bg-purple-50 hover:border-purple-200 hover:scale-105'
                }`}
              >
                {audience}
              </button>
            ))}
          </div>
        </div>
        
        <AdvancedAudienceTargeting 
          settings={settings}
          onSettingsChange={onSettingsChange}
        />
      </div>
    </SlidingWindow>
  );
};

export default AudienceTargetingSlidingWindow;