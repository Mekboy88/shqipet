
import { useEffect } from "react";

interface UseFeedConsoleProps {
  feedContainerRef: React.RefObject<HTMLDivElement>;
  isInScrollZone: boolean;
  activeZone: string | null;
}

export const useFeedConsole = ({ feedContainerRef, isInScrollZone, activeZone }: UseFeedConsoleProps) => {
  // Expose the feed container to the global window object for console access
  useEffect(() => {
    if (feedContainerRef.current) {
      (window as any).feedContainer = feedContainerRef.current;
      console.log("🎯 Feed container accessible via 'window.feedContainer'");
      console.log("🔄 MEGA ZONE STATUS:", { isInScrollZone, activeZone });

      // Console functions for debugging only (horizontal scrolling disabled)
      (window as any).getFeedScrollInfo = () => {
        const container = feedContainerRef.current;
        if (container) {
          const info = {
            scrollLeft: container.scrollLeft,
            scrollWidth: container.scrollWidth,
            clientWidth: container.clientWidth,
            maxScrollLeft: container.scrollWidth - container.clientWidth
          };
          console.log("📱 Feed scroll info:", info);
          return info;
        }
      };

      console.log("🎮 Console functions available:");
      console.log("- getFeedScrollInfo() - Get current scroll information");
    }
    
    return () => {
      delete (window as any).feedContainer;
      delete (window as any).getFeedScrollInfo;
    };
  }, [isInScrollZone, activeZone]);
};
