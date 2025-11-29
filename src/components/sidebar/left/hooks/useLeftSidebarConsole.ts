
import { useEffect } from 'react';

export const useLeftSidebarConsole = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Main left sidebar positioning function
      window.moveLeftSidebarRight = (pixels: number = 100) => {
        const leftSidebar = document.querySelector('.w-\\[280px\\].h-screen.fixed.left-0') as HTMLElement;
        if (leftSidebar) {
          leftSidebar.style.left = `${pixels}px`;
          console.log(`Left sidebar moved ${pixels}px to the right`);
        }
      };

      window.moveLeftSidebarLeft = (pixels: number = 100) => {
        const leftSidebar = document.querySelector('.w-\\[280px\\].h-screen.fixed.left-0') as HTMLElement;
        if (leftSidebar) {
          leftSidebar.style.left = `-${pixels}px`;
          console.log(`Left sidebar moved ${pixels}px to the left`);
        }
      };

      window.resetLeftSidebarPosition = () => {
        const leftSidebar = document.querySelector('.w-\\[280px\\].h-screen.fixed.left-0') as HTMLElement;
        if (leftSidebar) {
          leftSidebar.style.left = '0px';
          console.log('Left sidebar position reset to default');
        }
      };

      window.adjustLeftSidebarPosition = (options: {
        left?: string | number;
        marginLeft?: string | number;
        transform?: string;
        width?: string | number;
        zIndex?: number;
        opacity?: number;
        backgroundColor?: string;
        borderRadius?: string;
        boxShadow?: string;
      }) => {
        const leftSidebar = document.querySelector('.w-\\[280px\\].h-screen.fixed.left-0') as HTMLElement;
        if (!leftSidebar) return;

        if (options.left !== undefined) {
          leftSidebar.style.left = typeof options.left === 'number' ? `${options.left}px` : options.left;
        }
        if (options.marginLeft !== undefined) {
          leftSidebar.style.marginLeft = typeof options.marginLeft === 'number' ? `${options.marginLeft}px` : options.marginLeft;
        }
        if (options.transform !== undefined) {
          leftSidebar.style.transform = options.transform;
        }
        if (options.width !== undefined) {
          leftSidebar.style.width = typeof options.width === 'number' ? `${options.width}px` : options.width;
        }
        if (options.zIndex !== undefined) {
          leftSidebar.style.zIndex = options.zIndex.toString();
        }
        if (options.opacity !== undefined) {
          leftSidebar.style.opacity = options.opacity.toString();
        }
        if (options.backgroundColor !== undefined) {
          leftSidebar.style.backgroundColor = options.backgroundColor;
        }
        if (options.borderRadius !== undefined) {
          leftSidebar.style.borderRadius = options.borderRadius;
        }
        if (options.boxShadow !== undefined) {
          leftSidebar.style.boxShadow = options.boxShadow;
        }

        console.log('Left sidebar position adjusted:', options);
      };

      // Log available commands
      console.log(`
🎯 Left Sidebar Position Console Controls Available:

📍 QUICK POSITIONING:
- moveLeftSidebarRight(200) - Move left sidebar 200px to the right
- moveLeftSidebarLeft(100) - Move left sidebar 100px to the left  
- resetLeftSidebarPosition() - Reset to default position (left: 0)

🔧 ADVANCED POSITIONING:
- adjustLeftSidebarPosition({ left: 300 }) - Move to specific position
- adjustLeftSidebarPosition({ marginLeft: 200 }) - Add margin
- adjustLeftSidebarPosition({ transform: 'translateX(150px)' }) - Transform positioning

📏 SIZE AND STYLING:
- adjustLeftSidebarPosition({ width: 320 }) - Adjust width
- adjustLeftSidebarPosition({ opacity: 0.8 }) - Adjust transparency
- adjustLeftSidebarPosition({ backgroundColor: '#f0f0f0' }) - Background color
- adjustLeftSidebarPosition({ borderRadius: '10px' }) - Border radius
- adjustLeftSidebarPosition({ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }) - Shadow

⚡ EXAMPLES:
- moveLeftSidebarRight(300) - Move significantly to the right
- adjustLeftSidebarPosition({ left: 400, width: 320 }) - Move and resize
- adjustLeftSidebarPosition({ transform: 'translateX(25%)' }) - Move by percentage

🔄 RESET:
- resetLeftSidebarPosition() - Reset to default position
      `);
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete window.moveLeftSidebarRight;
        delete window.moveLeftSidebarLeft;
        delete window.resetLeftSidebarPosition;
        delete window.adjustLeftSidebarPosition;
      }
    };
  }, []);
};
