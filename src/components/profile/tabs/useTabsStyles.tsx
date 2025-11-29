
import { useEffect } from 'react';
import { TabsListStyles } from './types';

const useTabsStyles = (tabsListStyles: TabsListStyles) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Function for editing tabs styles
      window.editProfileTabs = (options: Partial<TabsListStyles>) => {
        const savedBorderWidth = localStorage.getItem('borderWidth');
        const savedMaxWidth = localStorage.getItem('borderMaxWidth');

        // Create a new style object
        const newStyles = {
          transparent: options.transparent ?? tabsListStyles.transparent,
          justifyContent: options.justifyContent ?? tabsListStyles.justifyContent,
          overflow: options.overflow ?? tabsListStyles.overflow,
          borderWidth: options.borderWidth ?? (savedBorderWidth ? Number(savedBorderWidth) : tabsListStyles.borderWidth),
          maxWidth: options.maxWidth ?? (savedMaxWidth ? Number(savedMaxWidth) : tabsListStyles.maxWidth)
        };

        // Update BorderLine if those properties are changed
        if (options.borderWidth !== undefined) {
          if (window.editBorderLine) {
            window.editBorderLine({
              borderWidth: options.borderWidth.toString() // Convert number to string
            });
            
            // Store in localStorage for persistence
            localStorage.setItem('borderWidth', options.borderWidth.toString());
          }
        }
        
        if (options.maxWidth !== undefined) {
          if (window.editBorderLine) {
            window.editBorderLine({
              width: options.maxWidth.toString() // Convert number to string
            });
            
            // Store in localStorage for persistence
            localStorage.setItem('borderMaxWidth', options.maxWidth.toString());
          }
        }
        
        console.log('Profile tabs styles updated:', newStyles);
      };
    }

    // Clean up function to remove the global properties when component unmounts
    return () => {
      if (typeof window !== 'undefined') {
        if ('editProfileTabs' in window) {
          // @ts-ignore - We need this to delete the property
          delete window.editProfileTabs;
        }
      }
    };
  }, [tabsListStyles]);
};

export default useTabsStyles;
