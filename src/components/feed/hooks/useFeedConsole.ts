
import { useEffect } from 'react';

export const useFeedConsole = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Main feed positioning function
      window.moveFeedToRight = (pixels: number = 100) => {
        const feedContainer = document.querySelector('[data-feed-container]') as HTMLElement;
        if (feedContainer) {
          feedContainer.style.marginLeft = `${pixels}px`;
          console.log(`Feed moved ${pixels}px to the right`);
        }
      };

      window.moveFeedToLeft = (pixels: number = 100) => {
        const feedContainer = document.querySelector('[data-feed-container]') as HTMLElement;
        if (feedContainer) {
          feedContainer.style.marginRight = `${pixels}px`;
          console.log(`Feed moved ${pixels}px to the left`);
        }
      };

      window.centerFeed = () => {
        const feedContainer = document.querySelector('[data-feed-container]') as HTMLElement;
        if (feedContainer) {
          feedContainer.style.marginLeft = 'auto';
          feedContainer.style.marginRight = 'auto';
          console.log('Feed centered');
        }
      };

      window.adjustFeedPosition = (options: {
        marginLeft?: string | number;
        marginRight?: string | number;
        transform?: string;
        position?: 'relative' | 'absolute' | 'fixed';
        left?: string | number;
        right?: string | number;
        width?: string | number;
        maxWidth?: string | number;
      }) => {
        const feedContainer = document.querySelector('[data-feed-container]') as HTMLElement;
        if (!feedContainer) return;

        if (options.marginLeft !== undefined) {
          feedContainer.style.marginLeft = typeof options.marginLeft === 'number' ? `${options.marginLeft}px` : options.marginLeft;
        }
        if (options.marginRight !== undefined) {
          feedContainer.style.marginRight = typeof options.marginRight === 'number' ? `${options.marginRight}px` : options.marginRight;
        }
        if (options.transform !== undefined) {
          feedContainer.style.transform = options.transform;
        }
        if (options.position !== undefined) {
          feedContainer.style.position = options.position;
        }
        if (options.left !== undefined) {
          feedContainer.style.left = typeof options.left === 'number' ? `${options.left}px` : options.left;
        }
        if (options.right !== undefined) {
          feedContainer.style.right = typeof options.right === 'number' ? `${options.right}px` : options.right;
        }
        if (options.width !== undefined) {
          feedContainer.style.width = typeof options.width === 'number' ? `${options.width}px` : options.width;
        }
        if (options.maxWidth !== undefined) {
          feedContainer.style.maxWidth = typeof options.maxWidth === 'number' ? `${options.maxWidth}px` : options.maxWidth;
        }

        console.log('Feed position adjusted:', options);
      };

      window.resetFeedPosition = () => {
        const feedContainer = document.querySelector('[data-feed-container]') as HTMLElement;
        if (feedContainer) {
          feedContainer.style.cssText = '';
          console.log('Feed position reset to default');
        }
      };

      // Log available commands
      console.log(`
🎯 Feed Position Console Controls Available:

📍 QUICK POSITIONING:
- moveFeedToRight(200) - Move feed 200px to the right
- moveFeedToLeft(100) - Move feed 100px to the left  
- centerFeed() - Center the feed

🔧 ADVANCED POSITIONING:
- adjustFeedPosition({ marginLeft: 300 }) - Move right with margin
- adjustFeedPosition({ marginRight: 'auto', marginLeft: '200px' }) - Custom margins
- adjustFeedPosition({ transform: 'translateX(150px)' }) - Transform positioning
- adjustFeedPosition({ position: 'relative', left: 250 }) - Relative positioning

📏 SIZE ADJUSTMENTS:
- adjustFeedPosition({ width: 600, maxWidth: '80%' }) - Adjust width
- adjustFeedPosition({ marginLeft: 200, width: 500 }) - Move and resize

⚡ EXAMPLES:
- moveFeedToRight(300) - Move significantly to the right
- adjustFeedPosition({ marginLeft: 'auto', marginRight: 0 }) - Align to right edge
- adjustFeedPosition({ transform: 'translateX(25%)' }) - Move by percentage

🔄 RESET:
- resetFeedPosition() - Reset to default position
      `);
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete window.moveFeedToRight;
        delete window.moveFeedToLeft;
        delete window.centerFeed;
        delete window.adjustFeedPosition;
        delete window.resetFeedPosition;
      }
    };
  }, []);
};
