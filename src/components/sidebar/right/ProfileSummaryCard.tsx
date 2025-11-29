
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Avatar from '@/components/Avatar';
import { useUniversalUser } from '@/hooks/useUniversalUser';
import { useAuth } from '@/contexts/AuthContext';
import NewCoverPhoto from '@/components/ui/NewCoverPhoto';
import NotificationPanelWrapper from '@/components/notifications/NotificationPanelWrapper';
import SlidingChatWindow from '@/components/chat/SlidingChatWindow';
import SlidingMenuPanel from '@/components/menu/SlidingMenuPanel';

const ProfileSummaryCard = () => {
  const { user, loading } = useAuth();
  // Use the universal user system for 100% consistency - NO LOADING STATES
  const { displayName, firstName, lastName, email, username } = useUniversalUser(user?.id);
  
  // Cover shown via NewCoverPhoto for consistency and no flicker


  // State for notification panel
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  
  // State for chat window
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  // State for menu panel
  const [isMenuPanelOpen, setIsMenuPanelOpen] = useState(false);

  // Use a global cache key that doesn't depend on user ID being available immediately
  const GLOBAL_PROFILE_CACHE_KEY = 'current_user_profile_name';
  
  const getInitialName = React.useMemo(() => {
    // Try to get from global cache first (works even when user ID isn't loaded yet)
    try {
      const globalCached = localStorage.getItem(GLOBAL_PROFILE_CACHE_KEY);
      if (globalCached) return globalCached;
    } catch {}
    
    // If we have user data immediately, use it
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (displayName && displayName.trim().includes(' ')) return displayName;
    
    return '';
  }, [firstName, lastName, displayName]);
  
  const [stableName, setStableName] = useState<string>(getInitialName);

  React.useEffect(() => {
    // Only update if we have actual user data (not loading states)
    if (!user?.id || loading) return;
    
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : '';
    const fallbackName = displayName && displayName.trim().includes(' ') ? displayName : '';
    const finalName = fullName || fallbackName;
    
    if (finalName && finalName !== stableName) {
      setStableName(finalName);
      // Store in both global cache and user-specific cache
      try { 
        localStorage.setItem(GLOBAL_PROFILE_CACHE_KEY, finalName);
        if (user?.id) {
          localStorage.setItem(`profile_name_${user.id}`, finalName);
        }
      } catch {}
    }
  }, [firstName, lastName, displayName, user?.id, loading, stableName]);

  return (
    <>
      <Card className="bg-card rounded-lg border border-border shadow-md overflow-hidden w-full">
        <div className="relative">
        <NewCoverPhoto userId={user?.id} height={96} className="rounded-none" />
          {/* Avatar positioned at the bottom of the cover, half out and half in */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
            <Avatar 
              size="lg" 
              className="w-12 h-12 border-2 border-white rounded-full shadow-md"
            />
          </div>
        </div>
        <div className="pt-8 pb-4 px-4 text-center">
          <h3 className="font-bold text-lg">{stableName}</h3>
          {/* Action buttons replacing the ID text */}
          <div className="flex justify-center space-x-2 mt-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-14 w-14"
              onClick={() => setIsMenuPanelOpen(true)}
            >
              <svg 
                className="h-14 w-14" 
                viewBox="0 0 482.8 482.8" 
                fill="currentColor"
              >
                <path d="M108.2,0.1H33c-18.2,0-33,14.8-33,33v75.1c0,18.2,14.8,33,33,33h75.1c18.2,0,33-14.8,33-33V33 C141.2,14.9,126.4,0.1,108.2,0.1z M114.2,108.2c0,3.3-2.7,6-6,6H33c-3.3,0-6-2.7-6-6V33c0-3.3,2.7-6,6-6h75.1c3.3,0,6,2.7,6,6 v75.2H114.2z"></path>
                <path d="M108.2,170.9H33c-18.2,0-33,14.8-33,33V279c0,18.2,14.8,33,33,33h75.1c18.2,0,33-14.8,33-33v-75.1 C141.2,185.7,126.4,170.9,108.2,170.9z M114.2,279c0,3.3-2.7,6-6,6H33c-3.3,0-6-2.7-6-6v-75.1c0-3.3,2.7-6,6-6h75.1 c3.3,0,6,2.7,6,6V279H114.2z"></path>
                <path d="M108.2,341.6H33c-18.2,0-33,14.8-33,33v75.1c0,18.2,14.8,33,33,33h75.1c18.2,0,33-14.8,33-33v-75.1 C141.2,356.4,126.4,341.6,108.2,341.6z M114.2,449.8c0,3.3-2.7,6-6,6H33c-3.3,0-6-2.7-6-6v-75.1c0-3.3,2.7-6,6-6h75.1 c3.3,0,6,2.7,6,6v75.1H114.2z"></path>
                <path d="M279,170.9h-75.1c-18.2,0-33,14.8-33,33V279c0,18.2,14.8,33,33,33H279c18.2,0,33-14.8,33-33v-75.1 C311.9,185.7,297.2,170.9,279,170.9z M284.9,279c0,3.3-2.7,6-6,6h-75.1c-3.3,0-6-2.7-6-6v-75.1c0-3.3,2.7-6,6-6h75.1 c3.3,0,6,2.7,6,6V279z"></path>
                <path d="M279,341.6h-75.1c-18.2,0-33,14.8-33,33v75.1c0,18.2,14.8,33,33,33H279c18.2,0,33-14.8,33-33v-75.1 C311.9,356.4,297.2,341.6,279,341.6z M284.9,449.8c0,3.3-2.7,6-6,6h-75.1c-3.3,0-6-2.7-6-6v-75.1c0-3.3,2.7-6,6-6h75.1 c3.3,0,6,2.7,6,6V449.8z"></path>
                <path d="M449.8,170.9h-75.1c-18.2,0-33,14.8-33,33V279c0,18.2,14.8,33,33,33h75.1c18.2,0,33-14.8,33-33v-75.1 C482.7,185.7,467.9,170.9,449.8,170.9z M455.7,279c0,3.3-2.7,6-6,6h-75.1c-3.3,0-6-2.7-6-6v-75.1c0-3.3,2.7-6,6-6h75.1 c3.3,0,6,2.7,6,6V279z"></path>
                <path d="M449.8,341.6h-75.1c-18.2,0-33,14.8-33,33v75.1c0,18.2,14.8,33,33,33h75.1c18.2,0,33-14.8,33-33v-75.1 C482.7,356.4,467.9,341.6,449.8,341.6z M455.7,449.8c0,3.3-2.7,6-6,6h-75.1c-3.3,0-6-2.7-6-6v-75.1c0-3.3,2.7-6,6-6h75.1 c3.3,0,6,2.7,6,6V449.8z"></path>
                <path d="M449.8,0.1h-75.1c-18.2,0-33,14.8-33,33v75.1c0,18.2,14.8,33,33,33h75.1c18.2,0,33-14.8,33-33V33 C482.7,14.9,467.9,0.1,449.8,0.1z M455.7,108.2c0,3.3-2.7,6-6,6h-75.1c-3.3,0-6-2.7-6-6V33c0-3.3,2.7-6,6-6h75.1c3.3,0,6,2.7,6,6 V108.2z"></path>
                <path d="M279,0.1h-75.1c-18.2,0-33,14.8-33,33v75.1c0,18.2,14.8,33,33,33H279c18.2,0,33-14.8,33-33V33 C311.9,14.9,297.2,0.1,279,0.1z M284.9,108.2c0,3.3-2.7,6-6,6h-75.1c-3.3,0-6-2.7-6-6V33c0-3.3,2.7-6,6-6h75.1c3.3,0,6,2.7,6,6 V108.2z"></path>
              </svg>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-14 w-14 hover:bg-primary/20 transition-all duration-200"
              onClick={() => {
                if (isChatMinimized) {
                  setIsChatMinimized(false);
                  setIsChatOpen(true);
                } else {
                  setIsChatOpen(true);
                }
              }}
            >
              <svg 
                className="h-14 w-14 text-primary hover:scale-110 transition-transform duration-200" 
                viewBox="0 0 32 32" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="10" y1="12" x2="19" y2="12"></line>
                <line x1="10" y1="16" x2="14" y2="16"></line>
                <path d="M11,4c-4.4,0-8,3.6-8,8v12v5l0,0c3.7-3.2,8.4-5,13.3-5H21c4.4,0,8-3.6,8-8v-4c0-4.4-3.6-8-8-8H11z"></path>
              </svg>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-14 w-14"
              onClick={() => setIsNotificationPanelOpen(true)}
            >
              <svg 
                width="28" 
                height="28" 
                viewBox="0 0 1800 1800" 
                fill="currentColor"
                className="h-14 w-14"
              >
                <path d="M942.432,362.391c28.336,0,78.253,16.538,120.884,52.848c33.173,28.25,72.71,77.44,72.71,151.333 c0,17.307,14.031,31.336,31.336,31.336c17.312,0,31.336-14.029,31.336-31.336c0-175.203-166.831-266.854-256.266-266.854 c-17.304,0-31.336,14.028-31.336,31.336C911.096,348.362,925.128,362.391,942.432,362.391z"></path>
                <path d="M1555.292,1240.33c-11.603-18.885-24.035-39.138-36.538-60.862c-1.408-5.24-4.108-9.945-7.79-13.722 c-49.513-88.479-97.741-200.637-97.741-344.862c0-339.747-187.438-622.592-438.45-681.168 c7.458-12.796,11.813-27.633,11.813-43.511c0-47.816-38.768-86.576-86.583-86.576c-47.813,0-86.581,38.759-86.581,86.576 c0,15.878,4.35,30.715,11.813,43.511c-251.011,58.576-438.455,341.421-438.455,681.168c0,188.204-82.117,321.858-142.074,419.446 c-47.275,76.945-81.431,132.54-53.413,182.688c34.706,62.133,150.24,84.154,527.356,89.08 c-11.577,25.247-18.085,53.287-18.085,82.834c0,109.974,89.466,199.439,199.438,199.439c109.971,0,199.432-89.466,199.432-199.439 c0-29.547-6.505-57.587-18.09-82.834c377.126-4.926,492.65-26.947,527.361-89.08 C1636.728,1372.87,1602.566,1317.275,1555.292,1240.33z M900.002,1731.698c-75.415,0-136.767-61.352-136.767-136.767 c0-30.793,10.234-59.236,27.477-82.121c34.47,0.25,70.82,0.385,109.26,0.424c0.021,0,0.039,0,0.061,0 c38.438-0.039,74.783-0.174,109.26-0.424c17.231,22.885,27.471,51.328,27.471,82.121 C1036.763,1670.347,975.412,1731.698,900.002,1731.698z M1553.997,1392.455c-5.909,10.575-33.067,30.156-148.601,42.466 c-80.962,8.635-194.844,13.343-368.712,14.981c-41.952,0.395-87.355,0.612-136.683,0.66c-49.33-0.048-94.734-0.266-136.688-0.66 c-173.864-1.639-287.75-6.347-368.713-14.981c-115.524-12.31-142.686-31.891-148.596-42.466 c-10.098-18.081,20.114-67.255,52.102-119.314c10.208-16.613,21.303-34.704,32.686-54.227h131.308 c17.307,0,31.335-14.029,31.335-31.336c0-17.309-14.029-31.337-31.335-31.337H365.03c44.478-87.962,84.421-199.001,84.421-335.357 c0-165.03,47.721-321.097,134.371-439.463c84.238-115.071,196.471-182.333,316.179-189.546 c119.712,7.213,231.939,74.476,316.182,189.546c86.646,118.366,134.367,274.434,134.367,439.463 c0,136.356,39.939,247.396,84.424,335.357H598.516c-17.308,0-31.336,14.028-31.336,31.337c0,17.307,14.028,31.336,31.336,31.336 h870.699c11.375,19.522,22.479,37.609,32.683,54.221C1533.88,1325.2,1564.098,1374.374,1553.997,1392.455z"></path>
              </svg>
            </Button>
          </div>
        </div>
        <div className="flex justify-around border-t p-2">
          <div className="text-center">
            <p className="font-bold">-</p>
            <p className="text-sm text-gray-500">Posts</p>
          </div>
          <div className="text-center">
            <p className="font-bold">-</p>
            <p className="text-sm text-gray-500">Following</p>
          </div>
          <div className="text-center">
            <p className="font-bold">-</p>
            <p className="text-sm text-gray-500">Followers</p>
          </div>
        </div>
      </Card>

      {/* Notification Panel */}
      <NotificationPanelWrapper 
        isOpen={isNotificationPanelOpen} 
        onClose={() => setIsNotificationPanelOpen(false)} 
      />

      {/* Sliding Chat Window */}
      <SlidingChatWindow 
        isOpen={isChatOpen}
        isMinimized={isChatMinimized}
        onClose={() => {
          setIsChatOpen(false);
          setIsChatMinimized(false);
        }}
        onMinimize={() => {
          setIsChatOpen(false);
          setIsChatMinimized(true);
        }}
        onMaximize={() => {
          setIsChatMinimized(false);
          setIsChatOpen(true);
        }}
      />

      {/* Sliding Menu Panel */}
      <SlidingMenuPanel 
        isOpen={isMenuPanelOpen}
        onClose={() => setIsMenuPanelOpen(false)}
      />
    </>
  );
};

export default ProfileSummaryCard;
