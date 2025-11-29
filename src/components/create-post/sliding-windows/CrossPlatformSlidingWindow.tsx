import React from 'react';
import SlidingWindow from './SlidingWindow';
import CrossPlatformSharing from '../features/CrossPlatformSharing';

interface CrossPlatformSlidingWindowProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlatforms: string[];
  onPlatformsChange: (platforms: string[]) => void;
  icon?: React.ReactNode;
}

const CrossPlatformSlidingWindow: React.FC<CrossPlatformSlidingWindowProps> = ({
  isOpen,
  onClose,
  selectedPlatforms,
  onPlatformsChange,
  icon
}) => {
  return (
    <SlidingWindow
      isOpen={isOpen}
      onClose={onClose}
      title="Cross-Platform Sharing"
      icon={icon}
      className=""
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Share your post across multiple social media platforms simultaneously.
        </p>
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">SOCIAL PLATFORMS</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Facebook', 'Twitter', 'Instagram', 'LinkedIn',
              'TikTok', 'YouTube', 'Pinterest', 'Reddit'
            ].map((platform) => (
              <button
                key={platform}
                onClick={() => {
                  const newPlatforms = selectedPlatforms.includes(platform)
                    ? selectedPlatforms.filter(p => p !== platform)
                    : [...selectedPlatforms, platform];
                  onPlatformsChange(newPlatforms);
                }}
                className={`h-12 w-full rounded-full border transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium ${
                  selectedPlatforms.includes(platform)
                    ? 'bg-blue-100 border-blue-300 text-blue-700 shadow-md scale-105'
                    : 'border-border hover:bg-blue-50 hover:border-blue-200 hover:scale-105'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>
        
        <CrossPlatformSharing 
          selectedPlatforms={selectedPlatforms}
          onPlatformsChange={onPlatformsChange}
        />
      </div>
    </SlidingWindow>
  );
};

export default CrossPlatformSlidingWindow;