
import { useEffect } from 'react';

export const useProfileSidebarConsole = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.editProfileSidebar = (options: {
        marginTop?: number;
        marginBottom?: number;
        marginLeft?: number;
        marginRight?: number;
        paddingX?: number;
        paddingY?: number;
        width?: number | string;
        maxWidth?: number | string;
        height?: number | string;
        scale?: number;
        scaleX?: number;
        scaleY?: number;
        zIndex?: number;
        opacity?: number;
        backgroundColor?: string;
        borderRadius?: string;
        boxShadow?: string;
        transform?: string;
        position?: 'relative' | 'absolute' | 'fixed' | 'sticky';
        top?: number | string;
        bottom?: number | string;
        left?: number | string;
        right?: number | string;
      }) => {
        const sidebar = document.querySelector('.profile-sidebar') as HTMLElement;
        if (!sidebar) return;

        // Apply margin adjustments
        if (options.marginTop !== undefined) {
          sidebar.style.marginTop = `${options.marginTop}px`;
        }
        if (options.marginBottom !== undefined) {
          sidebar.style.marginBottom = `${options.marginBottom}px`;
        }
        if (options.marginLeft !== undefined) {
          sidebar.style.marginLeft = `${options.marginLeft}px`;
        }
        if (options.marginRight !== undefined) {
          sidebar.style.marginRight = `${options.marginRight}px`;
        }

        // Apply padding adjustments
        if (options.paddingX !== undefined) {
          sidebar.style.paddingLeft = `${options.paddingX}px`;
          sidebar.style.paddingRight = `${options.paddingX}px`;
        }
        if (options.paddingY !== undefined) {
          sidebar.style.paddingTop = `${options.paddingY}px`;
          sidebar.style.paddingBottom = `${options.paddingY}px`;
        }

        // Apply size adjustments
        if (options.width !== undefined) {
          sidebar.style.width = typeof options.width === 'number' ? `${options.width}px` : options.width;
        }
        if (options.maxWidth !== undefined) {
          sidebar.style.maxWidth = typeof options.maxWidth === 'number' ? `${options.maxWidth}px` : options.maxWidth;
        }
        if (options.height !== undefined) {
          sidebar.style.height = typeof options.height === 'number' ? `${options.height}px` : options.height;
        }

        // Apply transform and positioning
        let transformString = '';
        if (options.scaleX !== undefined) {
          transformString += `scaleX(${options.scaleX}) `;
        }
        if (options.scaleY !== undefined) {
          transformString += `scaleY(${options.scaleY}) `;
        }
        if (options.scale !== undefined) {
          transformString += `scale(${options.scale}) `;
        }
        if (transformString) {
          sidebar.style.transform = transformString.trim();
          sidebar.style.transformOrigin = 'left center';
        }
        if (options.transform !== undefined) {
          sidebar.style.transform = options.transform;
        }
        if (options.position !== undefined) {
          sidebar.style.position = options.position;
        }
        if (options.top !== undefined) {
          sidebar.style.top = typeof options.top === 'number' ? `${options.top}px` : options.top;
        }
        if (options.bottom !== undefined) {
          sidebar.style.bottom = typeof options.bottom === 'number' ? `${options.bottom}px` : options.bottom;
        }
        if (options.left !== undefined) {
          sidebar.style.left = typeof options.left === 'number' ? `${options.left}px` : options.left;
        }
        if (options.right !== undefined) {
          sidebar.style.right = typeof options.right === 'number' ? `${options.right}px` : options.right;
        }

        // Apply visual styling
        if (options.zIndex !== undefined) {
          sidebar.style.zIndex = options.zIndex.toString();
        }
        if (options.opacity !== undefined) {
          sidebar.style.opacity = options.opacity.toString();
        }
        if (options.backgroundColor !== undefined) {
          sidebar.style.backgroundColor = options.backgroundColor;
        }
        if (options.borderRadius !== undefined) {
          sidebar.style.borderRadius = options.borderRadius;
        }
        if (options.boxShadow !== undefined) {
          sidebar.style.boxShadow = options.boxShadow;
        }
        console.log('Profile sidebar updated with:', options);
      };

      // Quick preset functions for horizontal scaling
      window.makeSidebarWider = (scaleX: number = 1.2) => {
        window.editProfileSidebar({
          scaleX
        });
      };
      window.makeSidebarNarrower = (scaleX: number = 0.8) => {
        window.editProfileSidebar({
          scaleX
        });
      };
      window.setSidebarHorizontalSize = (percentage: number) => {
        const scaleX = percentage / 100;
        window.editProfileSidebar({
          scaleX
        });
      };

      // Quick preset functions
      window.moveSidebarUp = (pixels: number = 10) => {
        window.editProfileSidebar({
          marginTop: -20 - pixels
        });
      };
      window.moveSidebarDown = (pixels: number = 10) => {
        window.editProfileSidebar({
          marginTop: -20 + pixels
        });
      };
      window.makeSidebarBigger = (scale: number = 1.1) => {
        window.editProfileSidebar({
          scale
        });
      };
      window.makeSidebarSmaller = (scale: number = 0.9) => {
        window.editProfileSidebar({
          scale
        });
      };
      window.resetSidebar = () => {
        const sidebar = document.querySelector('.profile-sidebar') as HTMLElement;
        if (sidebar) {
          sidebar.style.cssText = '';
          sidebar.className = 'space-y-4 pr-4 mt-[-20px] transition-all duration-200 ease-in-out profile-sidebar my-[191px] py-[63px] px-[7px] mx-[182px]';
        }
      };

      // Log available functions
      console.log(`
🎯 Profile Sidebar Console Controls Available:

📍 POSITIONING:
- editProfileSidebar({ marginTop: -60 }) - Move up/down
- editProfileSidebar({ marginLeft: 200 }) - Move left/right
- editProfileSidebar({ position: 'absolute', top: 100, left: 50 }) - Absolute positioning

📏 SIZING:
- editProfileSidebar({ width: 400 }) - Change width
- editProfileSidebar({ scale: 1.2 }) - Scale bigger/smaller (both dimensions)
- editProfileSidebar({ scaleX: 1.5 }) - Scale horizontally only
- editProfileSidebar({ scaleY: 1.2 }) - Scale vertically only
- editProfileSidebar({ maxWidth: '500px' }) - Set max width

🔄 HORIZONTAL SIZE CONTROLS:
- makeSidebarWider(1.5) - Make 50% wider horizontally
- makeSidebarNarrower(0.8) - Make 20% narrower horizontally
- setSidebarHorizontalSize(150) - Set to 150% of original width
- setSidebarHorizontalSize(75) - Set to 75% of original width

🎨 STYLING:
- editProfileSidebar({ backgroundColor: '#f0f0f0' }) - Background color
- editProfileSidebar({ borderRadius: '10px' }) - Border radius
- editProfileSidebar({ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }) - Shadow
- editProfileSidebar({ opacity: 0.8 }) - Transparency

⚡ QUICK FUNCTIONS:
- moveSidebarUp(20) - Move up by pixels
- moveSidebarDown(10) - Move down by pixels
- makeSidebarBigger(1.2) - Scale bigger (both dimensions)
- makeSidebarSmaller(0.8) - Scale smaller (both dimensions)
- resetSidebar() - Reset to default

💡 HORIZONTAL SIZE EXAMPLES:
- makeSidebarWider(2.0) - Double the width
- setSidebarHorizontalSize(125) - 25% wider
- setSidebarHorizontalSize(200) - Double the width
- makeSidebarNarrower(0.5) - Half the width
      `);
    }

    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        delete window.editProfileSidebar;
        delete window.moveSidebarUp;
        delete window.moveSidebarDown;
        delete window.makeSidebarBigger;
        delete window.makeSidebarSmaller;
        delete window.makeSidebarWider;
        delete window.makeSidebarNarrower;
        delete window.setSidebarHorizontalSize;
        delete window.resetSidebar;
      }
    };
  }, []);
};
