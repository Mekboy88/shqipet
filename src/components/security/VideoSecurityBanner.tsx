import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoSecurityBannerProps {
  blockedCount?: number;
  show?: boolean;
  onDismiss?: () => void;
}

const VideoSecurityBanner: React.FC<VideoSecurityBannerProps> = ({
  blockedCount = 0,
  show = false,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed security notices
    const dismissed = localStorage.getItem('videoSecurityBannerDismissed');
    if (dismissed) {
      setHasBeenDismissed(true);
    }
  }, []);

  useEffect(() => {
    if (show && !hasBeenDismissed) {
      setIsVisible(true);
    }
  }, [show, hasBeenDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setHasBeenDismissed(true);
    localStorage.setItem('videoSecurityBannerDismissed', 'true');
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 mx-4">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                🛡️ Shqipet Security Protection Active
              </h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Only platform videos are allowed to play for your security
                </p>
                {blockedCount > 0 && (
                  <p className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="font-medium">{blockedCount}</span> external video{blockedCount !== 1 ? 's' : ''} blocked
                  </p>
                )}
                <p className="text-xs text-blue-700">
                  This protects you from external content and ensures authentic Shqipet platform experience.
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 -mt-1 -mr-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Hook to manage video security notifications
export const useVideoSecurityNotification = () => {
  const [blockedCount, setBlockedCount] = useState(0);
  const [showBanner, setShowBanner] = useState(false);

  const reportBlockedVideo = (url: string) => {
    console.log('🚫 SECURITY: Reporting blocked video:', url);
    setBlockedCount(prev => prev + 1);
    setShowBanner(true);
    
    // Auto-hide banner after 10 seconds if not manually dismissed
    setTimeout(() => {
      setShowBanner(false);
    }, 10000);
  };

  const dismissBanner = () => {
    setShowBanner(false);
  };

  const resetCount = () => {
    setBlockedCount(0);
    setShowBanner(false);
  };

  return {
    blockedCount,
    showBanner,
    reportBlockedVideo,
    dismissBanner,
    resetCount
  };
};

export default VideoSecurityBanner;