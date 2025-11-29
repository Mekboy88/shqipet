import React from 'react';
import SlidingWindow from './SlidingWindow';
import PostExpirationSelector from '../features/PostExpirationSelector';

interface PostExpirationSlidingWindowProps {
  isOpen: boolean;
  onClose: () => void;
  expiration: any;
  onExpirationChange: (expiration: any) => void;
  icon?: React.ReactNode;
}

const PostExpirationSlidingWindow: React.FC<PostExpirationSlidingWindowProps> = ({
  isOpen,
  onClose,
  expiration,
  onExpirationChange,
  icon
}) => {
  return (
    <SlidingWindow
      isOpen={isOpen}
      onClose={onClose}
      title="Post Expiration Settings"
      icon={icon}
      className=""
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Set when this post should automatically expire and be removed.
        </p>
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">EXPIRATION OPTIONS</h4>
          <div className="space-y-2">
            {[
              { label: '1 Hour', value: '1h' },
              { label: '24 Hours', value: '24h' },
              { label: '7 Days', value: '7d' },
              { label: '30 Days', value: '30d' },
              { label: 'Never Expire', value: 'never' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => onExpirationChange(option.value === 'never' ? null : option.value)}
                className={`h-12 w-full rounded-full border transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium ${
                  (expiration === option.value) || (option.value === 'never' && !expiration)
                    ? 'bg-red-100 border-red-300 text-red-700 shadow-md scale-105'
                    : 'border-border hover:bg-red-50 hover:border-red-200 hover:scale-105'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        <PostExpirationSelector 
          expiration={expiration}
          onExpirationChange={onExpirationChange}
        />
      </div>
    </SlidingWindow>
  );
};

export default PostExpirationSlidingWindow;