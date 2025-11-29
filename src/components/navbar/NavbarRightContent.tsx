import React, { useEffect, useState } from 'react';
import NavbarActionButtons from './NavbarActionButtons';
import UserProfileDropdown from '@/components/UserProfileDropdown';
import ProfessionalPresentationSettingsDropdown from './ProfessionalPresentationSettingsDropdown';
import MobilePreviewModal from './MobilePreviewModal';
import { mediaService } from '@/services/media/MediaService';
import { useLocation } from 'react-router-dom';
import { Smartphone } from 'lucide-react';
interface NavbarRightContentProps {
  professionalEditMode?: boolean;
  setProfessionalEditMode?: (value: boolean) => void;
  professionalSections?: {
    home: boolean;
    skills: boolean;
    portfolio: boolean;
    blogs: boolean;
    contact: boolean;
    cv: boolean;
  };
  setProfessionalSections?: React.Dispatch<React.SetStateAction<{
    home: boolean;
    skills: boolean;
    portfolio: boolean;
    blogs: boolean;
    contact: boolean;
    cv: boolean;
  }>>;
  professionalSocials?: Array<{
    label: string;
    url: string;
    icon?: string;
  }>;
  setProfessionalSocials?: React.Dispatch<React.SetStateAction<Array<{
    label: string;
    url: string;
    icon?: string;
  }>>>;
  professionalHireButton?: {
    enabled: boolean;
    text: string;
    url: string;
    email: string;
  };
  setProfessionalHireButton?: React.Dispatch<React.SetStateAction<{
    enabled: boolean;
    text: string;
    url: string;
    email: string;
  }>>;
  professionalProfile?: {
    firstName: string;
    lastName: string;
    presentation: string;
    photoUrl: string;
    aboutMe: string;
    highlights: string[];
  };
  isOwner?: boolean;
  hireButtonLoaded?: boolean;
  isSavingHireButton?: boolean;
}

const NavbarRightContent: React.FC<NavbarRightContentProps> = ({ 
  professionalEditMode, 
  setProfessionalEditMode,
  professionalSections,
  setProfessionalSections,
  professionalSocials,
  setProfessionalSocials,
  professionalHireButton,
  setProfessionalHireButton,
  professionalProfile,
  isOwner = false,
  hireButtonLoaded,
  isSavingHireButton
}) => {
  const location = useLocation();
  const isProfessionalPresentation = location.pathname === '/professional-presentation';
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  console.log('🔍 NavbarRightContent rendering with enhanced console controls');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Enhanced function to move search bar with precise control
      window.moveSearchBar = (direction: 'left' | 'right', amount: number = 1) => {
        const searchContainer = document.querySelector('.search-bar-container') as HTMLElement;
        if (searchContainer) {
          const currentTransform = searchContainer.style.transform || 'translateX(0px)';
          const currentX = parseFloat(currentTransform.match(/translateX\(([^)]+)px\)/)?.[1] || '0');
          const newX = direction === 'right' ? currentX + amount : currentX - amount;
          searchContainer.style.transform = `translateX(${newX}px)`;
          console.log(`🎯 Search bar moved ${amount}px to the ${direction}. Current position: ${newX}px`);
        }
      };

      // Set exact position function
      window.setSearchBarPosition = (pixels: number) => {
        const searchContainer = document.querySelector('.search-bar-container') as HTMLElement;
        if (searchContainer) {
          searchContainer.style.transform = `translateX(${pixels}px)`;
          console.log(`🎯 Search bar set to exact position: ${pixels}px`);
        }
      };

      // Preset movement functions with flexible amounts
      window.moveSearchBarLeft = (amount = 10) => {
        if (window.moveSearchBar) {
          window.moveSearchBar('left', amount);
        }
      };
      window.moveSearchBarRight = (amount = 10) => {
        if (window.moveSearchBar) {
          window.moveSearchBar('right', amount);
        }
      };

      // Fine adjustment functions
      window.moveSearchBarLeftTiny = (amount = 1) => {
        if (window.moveSearchBar) {
          window.moveSearchBar('left', amount);
        }
      };
      window.moveSearchBarRightTiny = (amount = 1) => {
        if (window.moveSearchBar) {
          window.moveSearchBar('right', amount);
        }
      };

      // Large movement functions
      window.moveSearchBarLeftBig = (amount = 50) => {
        if (window.moveSearchBar) {
          window.moveSearchBar('left', amount);
        }
      };
      window.moveSearchBarRightBig = (amount = 50) => {
        if (window.moveSearchBar) {
          window.moveSearchBar('right', amount);
        }
      };

      // Reset function
      window.resetSearchBarPosition = () => {
        const searchContainer = document.querySelector('.search-bar-container') as HTMLElement;
        if (searchContainer) {
          searchContainer.style.transform = 'translateX(0px)';
          console.log('🔄 Search bar position reset to default');
        }
      };

      // Get current position function
      window.getSearchBarPosition = () => {
        const searchContainer = document.querySelector('.search-bar-container') as HTMLElement;
        if (searchContainer) {
          const currentTransform = searchContainer.style.transform || 'translateX(0px)';
          const currentX = parseFloat(currentTransform.match(/translateX\(([^)]+)px\)/)?.[1] || '0');
          console.log(`📍 Current search bar position: ${currentX}px`);
          return currentX;
        }
        return 0;
      };

      // Apply custom CSS positioning
      window.setSearchBarCSS = (cssProperties: Record<string, string>) => {
        const searchContainer = document.querySelector('.search-bar-container') as HTMLElement;
        if (searchContainer) {
          Object.entries(cssProperties).forEach(([property, value]) => {
            searchContainer.style[property as any] = value;
          });
          console.log('🎨 Applied custom CSS to search bar:', cssProperties);
        }
      };

      // Remove all custom positioning
      window.clearSearchBarStyles = () => {
        const searchContainer = document.querySelector('.search-bar-container') as HTMLElement;
        if (searchContainer) {
          searchContainer.style.transform = '';
          searchContainer.style.marginLeft = '';
          searchContainer.style.marginRight = '';
          searchContainer.style.position = '';
          searchContainer.style.left = '';
          searchContainer.style.right = '';
          console.log('🧹 Cleared all custom search bar styles');
        }
      };
      console.log(`
🎮 ENHANCED SEARCH BAR CONSOLE CONTROLS:

📍 BASIC POSITIONING:
- moveSearchBarLeft(pixels)         - Move left (default: 10px)
- moveSearchBarRight(pixels)        - Move right (default: 10px)
- setSearchBarPosition(pixels)      - Set exact position

🔧 FINE & LARGE MOVEMENTS:
- moveSearchBarLeftTiny(pixels)     - Move left tiny (default: 1px)
- moveSearchBarRightTiny(pixels)    - Move right tiny (default: 1px)
- moveSearchBarLeftBig(pixels)      - Move left big (default: 50px)
- moveSearchBarRightBig(pixels)     - Move right big (default: 50px)

⚡ ADVANCED CONTROLS:
- moveSearchBar('left'|'right', px) - Custom direction & amount
- setSearchBarCSS({prop: 'value'})  - Apply custom CSS
- clearSearchBarStyles()            - Remove all custom styles

📊 UTILITIES:
- getSearchBarPosition()            - Get current position
- resetSearchBarPosition()          - Reset to default

💡 EXAMPLES:
- moveSearchBarLeft(25)             - Move 25px left
- setSearchBarPosition(-100)        - Position 100px to the left
- setSearchBarCSS({marginLeft: '20px', position: 'relative'})
- moveSearchBar('right', 75)        - Move 75px right

🎯 Full control - position the search bar exactly where you want!
          `);

      // ============== Avatar Debug Tools ==============
      (window as any).avatarDebug = {
        help() {
          console.log(`\n🛠️ Avatar Debug Tools:\n- avatarDebug.print([userId])\n- avatarDebug.reload([userId])\n- avatarDebug.clearCache(userId)\n- avatarDebug.clearAllCaches()\n- avatarDebug.showLocalCache(userId)\n- avatarDebug.removeLocalCache(userId)\n`);
        },
        print(userId?: string) {
          const map = (window as any).__avatarDebugMap || {};
          console.log('🧪 __avatarDebugMap:', map);
          if (userId) {
            const entry = map[userId];
            const ls = localStorage.getItem(`avatar_cache_${userId}`);
            console.log('🧾 user entry:', entry);
            console.log('🗄️ localStorage:', ls ? JSON.parse(ls) : null);
          }
        },
        reload(userId?: string) {
          const detail = userId ? { userId } : undefined;
          window.dispatchEvent(new CustomEvent('avatar:reload', { detail } as any));
          console.log('🔄 Dispatched avatar:reload', detail || '(all mounted hooks)');
        },
        clearCache(userId: string) {
          localStorage.removeItem(`avatar_cache_${userId}`);
          console.log('🧹 Cleared avatar local cache for', userId);
        },
        clearAllCaches() {
          try { mediaService.clearAllCaches(); console.log('🧹 Cleared media service caches'); } catch {}
          // Clear all avatar local caches
          Object.keys(localStorage).forEach(k => { if (k.startsWith('avatar_cache_')) localStorage.removeItem(k); });
          console.log('🧼 Cleared all avatar_* local caches');
        },
        showLocalCache(userId: string) {
          const v = localStorage.getItem(`avatar_cache_${userId}`);
          console.log('🗄️ avatar_cache value:', v ? JSON.parse(v) : null);
        },
        removeLocalCache(userId: string) {
          localStorage.removeItem(`avatar_cache_${userId}`);
          console.log('🗑️ Removed avatar_cache for', userId);
        }
      };
      (window as any).avatarDebug.help();
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window.moveSearchBar;
        delete window.moveSearchBarLeft;
        delete window.moveSearchBarRight;
        delete window.moveSearchBarLeftTiny;
        delete window.moveSearchBarRightTiny;
        delete window.moveSearchBarLeftBig;
        delete window.moveSearchBarRightBig;
        delete window.resetSearchBarPosition;
        delete window.setSearchBarPosition;
        delete window.getSearchBarPosition;
        delete window.setSearchBarCSS;
        delete window.clearSearchBarStyles;
      }
    };
  }, []);
  return (
    <>
      <div className="flex items-center justify-end w-full">
        {/* Action Buttons and User Profile */}
        <div className="flex items-center gap-2">
          <NavbarActionButtons />
          {isProfessionalPresentation && isOwner && professionalEditMode !== undefined && setProfessionalEditMode && professionalSections && setProfessionalSections && professionalSocials && setProfessionalSocials && professionalHireButton && setProfessionalHireButton && (
            <>
              {/* Mobile Preview Button */}
              <button
                onClick={() => setShowMobilePreview(true)}
                className="h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-100 flex items-center justify-center"
                aria-label="Mobile Preview"
              >
                <svg height="18px" width="18px" version="1.1" viewBox="0 0 512 512">
                  <path fill="#2D2D2D" d="M384,512H128c-8.448,0-15.36-6.912-15.36-15.36V15.36C112.64,6.912,119.552,0,128,0h256 c8.448,0,15.36,6.912,15.36,15.36v481.28C399.36,505.088,392.448,512,384,512z"/>
                  <rect x="128" y="40.96" fill="#E0E0E0" width="256" height="409.6"/>
                  <path fill="#999999" d="M286.72,25.76h-61.44c-2.816,0-5.12-2.304-5.12-5.12l0,0c0-2.816,2.304-5.12,5.12-5.12h61.44 c2.816,0,5.12,2.304,5.12,5.12l0,0C291.84,23.456,289.536,25.76,286.72,25.76z"/>
                  <path fill="#999999" d="M286.72,481.28h-61.44c-2.816,0-5.12-2.304-5.12-5.12l0,0c0-2.816,2.304-5.12,5.12-5.12h61.44 c2.816,0,5.12,2.304,5.12,5.12l0,0C291.84,478.976,289.536,481.28,286.72,481.28z"/>
                  <rect x="153.6" y="83.88" fill="#2D2D2D" width="204.8" height="172.128"/>
                  <rect x="237.952" y="373.52" fill="#999999" width="120.48" height="10.24"/>
                  <rect x="237.952" y="394" fill="#999999" width="120.48" height="10.24"/>
                  <circle fill="#FFFFFF" cx="256" cy="134.736" r="30.304"/>
                  <path fill="#FFFFFF" d="M254.568,235.464L225.288,172c0,0-30.712,0.408-30.712,28.664s0,34.808,0,34.808 S254.768,235.464,254.568,235.464z"/>
                  <path fill="#FFFFFF" d="M257.432,235.464L286.712,172c0,0,30.712,0.408,30.712,28.664s0,34.808,0,34.808 S257.232,235.464,257.432,235.464z"/>
                  <polygon fill="#FFFFFF" points="256,172 234.912,172 256,218.68 277.088,172"/>
                  <rect x="153.52" y="290.112" fill="#DB2B42" width="64.16" height="53.888"/>
                  <circle fill="#FFFFFF" cx="185.68" cy="306.08" r="9.488"/>
                  <path fill="#FFFFFF" d="M185.208,337.576l-9.168-19.872c0,0-9.616,0.128-9.616,8.976s0,10.896,0,10.896 S185.272,337.576,185.208,337.576z"/>
                  <path fill="#FFFFFF" d="M186.104,337.576l9.168-19.872c0,0,9.616,0.128,9.616,8.976s0,10.896,0,10.896 S186.04,337.576,186.104,337.576z"/>
                  <polygon fill="#FFFFFF" points="185.656,317.704 179.056,317.704 185.656,332.32 192.264,317.704"/>
                  <rect x="153.52" y="361.952" fill="#DB2B42" width="64.16" height="53.888"/>
                  <circle fill="#FFFFFF" cx="185.68" cy="377.84" r="9.488"/>
                  <path fill="#FFFFFF" d="M185.208,409.392l-9.168-19.872c0,0-9.616,0.128-9.616,8.976c0,8.848,0,10.896,0,10.896 S185.272,409.392,185.208,409.392z"/>
                  <path fill="#FFFFFF" d="M186.104,409.392l9.168-19.872c0,0,9.616,0.128,9.616,8.976c0,8.848,0,10.896,0,10.896 S186.04,409.392,186.104,409.392z"/>
                  <polygon fill="#FFFFFF" points="185.656,389.52 179.056,389.52 185.656,404.136 192.264,389.52"/>
                  <rect x="237.952" y="301.704" fill="#999999" width="120.48" height="10.24"/>
                  <rect x="237.952" y="322.16" fill="#999999" width="120.48" height="10.24"/>
                </svg>
              </button>
              
              <ProfessionalPresentationSettingsDropdown 
                editMode={professionalEditMode} 
                setEditMode={setProfessionalEditMode}
                sections={professionalSections}
                setSections={setProfessionalSections}
                socials={professionalSocials}
                setSocials={setProfessionalSocials}
                hireButton={professionalHireButton}
                setHireButton={setProfessionalHireButton}
                hireButtonLoaded={hireButtonLoaded}
                isSavingHireButton={isSavingHireButton}
              />
            </>
          )}
          <UserProfileDropdown />
        </div>
      </div>

      {/* Mobile Preview Modal */}
      {isProfessionalPresentation && professionalProfile && professionalSections && professionalSocials && (
        <MobilePreviewModal
          isOpen={showMobilePreview}
          onClose={() => setShowMobilePreview(false)}
          profile={professionalProfile}
          socials={professionalSocials}
          sections={professionalSections}
        />
      )}
    </>
  );
};
export default NavbarRightContent;