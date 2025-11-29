import React from 'react';
import SlidingWindow from './SlidingWindow';
import ContentModerationPreview from '../features/ContentModerationPreview';

interface ContentModerationSlidingWindowProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  files: File[];
  icon?: React.ReactNode;
}

const ContentModerationSlidingWindow: React.FC<ContentModerationSlidingWindowProps> = ({
  isOpen,
  onClose,
  content,
  files,
  icon
}) => {
  return (
    <SlidingWindow
      isOpen={isOpen}
      onClose={onClose}
      title="Content Moderation Preview"
      icon={icon}
      className=""
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Preview how your content will be moderated and see potential issues before posting.
        </p>
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">MODERATION CHECKS</h4>
          <div className="space-y-2">
            {[
              { label: 'Spam Detection', status: 'safe' },
              { label: 'Inappropriate Content', status: 'safe' },
              { label: 'Copyright Issues', status: 'safe' },
              { label: 'Hate Speech', status: 'safe' },
              { label: 'Violence Detection', status: 'safe' },
              { label: 'Adult Content', status: 'safe' }
            ].map((check) => (
              <div
                key={check.label}
                className="h-12 w-full rounded-full border border-border bg-green-50 flex items-center justify-between px-4 text-sm font-medium"
              >
                <span>{check.label}</span>
                <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs">
                  ✓ Safe
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <button className="h-12 w-full rounded-full border border-amber-200 bg-amber-50 hover:bg-amber-100 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium text-amber-700">
              Run Full Content Analysis
            </button>
          </div>
        </div>
        
        <ContentModerationPreview 
          content={content}
          files={files}
        />
      </div>
    </SlidingWindow>
  );
};

export default ContentModerationSlidingWindow;