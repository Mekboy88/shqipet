
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { settingsSections as originalSettingsSections } from './settingsData';
import { Award, ChevronDown } from 'lucide-react';
import CustomProfileIcon from './CustomProfileIcon';
import CustomMyPointsIcon from './CustomMyPointsIcon';
import CustomGeneralIcon from './CustomGeneralIcon';
import CustomAvatarCoverIcon from './CustomAvatarCoverIcon';
import CustomSocialLinksIcon from './CustomSocialLinksIcon';
import CustomNotificationIcon from './CustomNotificationIcon';
import CustomPrivacyIcon from './CustomPrivacyIcon';
import CustomPasswordIcon from './CustomPasswordIcon';
import CustomSessionsIcon from './CustomSessionsIcon';
import CustomTwoFactorIcon from './CustomTwoFactorIcon';
import CustomBlockedUsersIcon from './CustomBlockedUsersIcon';
import CustomMyInformationIcon from './CustomMyInformationIcon';
import CustomMyAddressesIcon from './CustomMyAddressesIcon';
import CustomVerificationIcon from './CustomVerificationIcon';
import CustomMonetizationIcon from './CustomMonetizationIcon';
import CustomMyEarningsIcon from './CustomMyEarningsIcon';
import CustomMyAffiliatesIcon from './CustomMyAffiliatesIcon';
import CustomWalletIcon from './CustomWalletIcon';
import CustomDeleteAccountIcon from './CustomDeleteAccountIcon';
import CustomLocationIcon from './CustomLocationIcon';

interface ProfileSettingsSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onClose: () => void;
}
const ProfileSettingsSidebar: React.FC<ProfileSettingsSidebarProps> = ({
  activeSection,
  setActiveSection,
  onClose
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (navRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = navRef.current;
        const isScrollable = scrollHeight > clientHeight;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
        setShowScrollIndicator(isScrollable && !isAtBottom);
      }
    };

    checkScroll();
    const nav = navRef.current;
    if (nav) {
      nav.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }

    return () => {
      if (nav) {
        nav.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      }
    };
  }, []);
  const myPointsSection = {
    id: 'my-points',
    label: 'My Points',
    icon: Award,
    color: 'text-orange-500',
    divider: false,
  };

  const affiliatesIndex = originalSettingsSections.findIndex(s => s.id === 'affiliates');
  const settingsSections = [...originalSettingsSections];
  
  if (affiliatesIndex !== -1) {
    settingsSections.splice(affiliatesIndex + 1, 0, myPointsSection);
  } else {
    settingsSections.push(myPointsSection);
  }

  const walletSection = settingsSections.find(s => s.id === 'wallet');
  if (walletSection) {
    walletSection.divider = true;
  }

  return <div className="w-full lg:w-80 bg-white flex-shrink-0 h-full">
      <div className="relative h-full">
        {/* Header Text */}
        <div className="absolute top-0 left-0 w-full h-12 flex items-center justify-between px-4 border-b border-gray-200">
          <svg 
            viewBox="0 0 16 16" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="#000000" 
            stroke="#000000"
            className="w-9 h-9 cursor-pointer hover:opacity-70 transition-opacity"
            onClick={onClose}
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path fill="#000000" fillRule="evenodd" d="M4.297105,3.29289 L0.59,7 L4.297105,10.7071 C4.687635,11.0976 5.320795,11.0976 5.711315,10.7071 C6.101845,10.3166 6.101845,9.68342 5.711315,9.29289 L4.418425,8 L11.504215,8 C12.332615,8 13.004215,8.67157 13.004215,9.5 C13.004215,10.3284 12.332615,11 11.504215,11 L10.004215,11 C9.451935,11 9.004215,11.4477 9.004215,12 C9.004215,12.5523 9.451935,13 10.004215,13 L11.504215,13 C13.437215,13 15.004215,11.433 15.004215,9.5 C15.004215,7.567 13.437215,6 11.504215,6 L4.418425,6 L5.711315,4.70711 C6.101845,4.31658 6.101845,3.68342 5.711315,3.29289 C5.320795,2.90237 4.687635,2.90237 4.297105,3.29289 Z"></path>
            </g>
          </svg>
          <h2 className="text-gray-800 mx-0 px-0 py-0 mt-2 mb-[9px] text-4xl font-normal absolute left-1/2 transform -translate-x-1/2">Cilësimet</h2>
          <div className="w-9 h-9"></div> {/* Spacer to keep text centered */}
        </div>
        
        {/* Settings Navigation Menu */}
        <nav ref={navRef} className="absolute top-12 left-2 right-2 bottom-0 overflow-y-auto py-1">
          {settingsSections.map(section => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          const iconColor = section.color;
          const circleBgColor = iconColor.includes('gray') ? 'bg-gray-200' : iconColor.replace('text-', 'bg-').replace(/-\d+$/, '-100');
          const activeBorderColor = iconColor.replace('text-', 'border-');
          
          // Special styling for profile, general, avatar-cover, notifications, privacy, and password sections
          const isProfileSection = section.id === 'profile';
          const isGeneralSection = section.id === 'general';
          const isAvatarCoverSection = section.id === 'avatar-and-cover';
          const isNotificationsSection = section.id === 'notifications';
          const isPrivacySection = section.id === 'privacy';
          const isPasswordSection = section.id === 'password';
          const isSessionsSection = section.id === 'manage-sessions';
          const isTwoFactorSection = section.id === 'two-factor';
          const isBlockedUsersSection = section.id === 'blocked-users';
          const isMyInformationSection = section.id === 'information';
          const isMyAddressesSection = section.id === 'addresses';
          const isLocationPreferencesSection = section.id === 'location-preferences';
          const isVerificationSection = section.id === 'verification';
          const isMonetizationSection = section.id === 'monetization';
          const isMyEarningsSection = section.id === 'earnings';
          const isAffiliatesSection = section.id === 'affiliates';
          const isMyPointsSection = section.id === 'my-points';
          const isWalletSection = section.id === 'wallet';
          const isDeleteAccountSection = section.id === 'delete-account';
          
          const getTextGradient = (sectionId: string, isActive: boolean) => {
            if (!isActive) return 'text-gray-700';
            
            switch(sectionId) {
              case 'profile':
                return 'bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-600';
              case 'general':
                return 'bg-clip-text text-transparent bg-gradient-to-r from-[#45596B] to-[#647F94]';
              case 'avatar-and-cover':
                return 'bg-clip-text text-transparent bg-gradient-to-r from-[#5C5D6E] to-[#9BDCB4]';
              case 'social':
                return 'bg-clip-text text-transparent bg-gradient-to-r from-[#000000] to-[#2ca9bc]';
              case 'notifications':
                return 'bg-clip-text text-transparent bg-gradient-to-r from-[#73D0F4] to-[#3D6889]';
              case 'privacy':
                return 'bg-clip-text text-transparent bg-gradient-to-r from-[#fb8c00] via-[#1e88e5] to-[#424242]';
              case 'password':
                return 'bg-clip-text text-transparent bg-gradient-to-r from-[#FDAFA4] to-[#0F277F]';
              case 'manage-sessions':
                return 'bg-clip-text text-transparent bg-gradient-to-r from-[#007BCE] via-[#2EE5CA] to-[#FF5AC8]';
              case 'two-factor':
                return 'bg-clip-text text-transparent bg-gradient-to-r from-[#EC1C24] to-[#666666]';
              case 'blocked-users':
                return 'bg-clip-text text-transparent bg-gradient-to-r from-[#666666] via-[#ff8282] to-[#000000]';
              case 'information':
                return 'bg-clip-text text-transparent bg-gradient-to-r from-[#64BFA3] to-[#040000]';
              case 'addresses':
                return 'bg-clip-text text-transparent bg-gradient-to-r from-[#F76D57] to-[#394240]';
              case 'location-preferences':
                return 'bg-clip-text text-transparent bg-gradient-to-r from-[#758CA3] to-[#5a7184]';
              case 'verification':
                return 'bg-clip-text text-transparent bg-gradient-to-r from-[#1C274C] to-[#1C274C]';
              case 'monetization':
                return 'bg-clip-text text-transparent bg-gradient-to-r from-[#2D527C] to-[#CEE8FA]';
              case 'earnings':
                return 'bg-clip-text text-transparent bg-gradient-to-r from-[#FD6A7E] via-[#17B978] via-[#8797EE] to-[#41A6F9]';
              case 'affiliates':
                return 'bg-clip-text text-transparent bg-gradient-to-r from-[#152C70] to-[#4296FF]';
              case 'my-points':
                return 'bg-clip-text text-transparent bg-gradient-to-r from-[#F44336] to-[#FFCA28]';
              case 'wallet':
                return 'bg-clip-text text-transparent bg-gradient-to-r from-[#9E5523] via-[#7EAF8A] via-[#0093F7] to-[#D39754]';
              case 'delete-account':
                return 'bg-clip-text text-transparent bg-gradient-to-r from-[#FF3B30] to-[#89a3b8]';
              default:
                return iconColor;
          }
          };
          
          const getBorderGradient = (sectionId: string) => {
            switch(sectionId) {
              case 'profile':
                return 'border-l-4 border-gray-600';
              case 'general':
                return 'border-l-4 border-[#647F94]';
              case 'avatar-and-cover':
                return 'border-l-4 border-[#9BDCB4]';
              case 'social':
                return 'border-l-4 border-[#2ca9bc]';
              case 'notifications':
                return 'border-l-4 border-[#73D0F4]';
              case 'privacy':
                return 'border-l-4 border-[#fb8c00]';
              case 'password':
                return 'border-l-4 border-[#0F277F]';
              case 'manage-sessions':
                return 'border-l-4 border-[#2EE5CA]';
              case 'two-factor':
                return 'border-l-4 border-[#EC1C24]';
              case 'blocked-users':
                return 'border-l-4 border-[#ff8282]';
              case 'information':
                return 'border-l-4 border-[#64BFA3]';
              case 'addresses':
                return 'border-l-4 border-[#F76D57]';
              case 'location-preferences':
                return 'border-l-4 border-[#758CA3]';
              case 'verification':
                return 'border-l-4 border-[#1C274C]';
              case 'monetization':
                return 'border-l-4 border-[#2D527C]';
              case 'earnings':
                return 'border-l-4 border-[#17B978]';
              case 'affiliates':
                return 'border-l-4 border-[#4296FF]';
              case 'my-points':
                return 'border-l-4 border-[#FFCA28]';
              case 'wallet':
                return 'border-l-4 border-[#0093F7]';
              case 'delete-account':
                return 'border-l-4 border-[#FF3B30]';
              default:
                return `border-l-4 ${activeBorderColor}`;
            }
          };
           
           let specialBgStyle = circleBgColor;
          if (isProfileSection) {
            specialBgStyle = 'bg-gradient-to-r from-black/20 to-gray-300/40';
          } else if (isGeneralSection) {
            specialBgStyle = 'bg-gradient-to-r from-[#45596B]/30 to-[#647F94]/30';
          } else if (isAvatarCoverSection) {
            specialBgStyle = 'bg-gradient-to-r from-[#5C5D6E]/20 to-[#9BDCB4]/30';
          } else if (isNotificationsSection) {
            specialBgStyle = 'bg-gradient-to-r from-[#73D0F4]/30 to-[#3D6889]/30';
          } else if (isPrivacySection) {
            specialBgStyle = 'bg-gradient-to-r from-[#fb8c00]/30 via-[#efebe9]/30 to-[#424242]/30 via-[#1e88e5]/30';
          } else if (isPasswordSection) {
            specialBgStyle = 'bg-gradient-to-r from-[#FDAFA4]/30 to-[#0F277F]/30';
          } else if (isSessionsSection) {
            specialBgStyle = 'bg-gradient-to-r from-[#007BCE]/30 via-[#2EE5CA]/20 to-[#FF5AC8]/20 via-[#20585E]/30';
          } else if (isTwoFactorSection) {
            specialBgStyle = 'bg-gradient-to-r from-[#EC1C24]/20 to-[#FFFFFF]/30';
          } else if (isBlockedUsersSection) {
            specialBgStyle = 'bg-gradient-to-r from-[#666666]/20 via-[#ff8282]/20 to-[#ffffff]/20 via-[#000000]/10';
          } else if (isMyInformationSection) {
            specialBgStyle = 'bg-gradient-to-r from-[#64BFA3]/20 to-[#040000]/10';
          } else if (isMyAddressesSection) {
            specialBgStyle = 'bg-gradient-to-r from-[#F76D57]/20 to-[#394240]/20';
          } else if (isLocationPreferencesSection) {
            specialBgStyle = 'bg-gradient-to-r from-[#758CA3]/20 to-[#5a7184]/20';
          } else if (isVerificationSection) {
            specialBgStyle = 'bg-gradient-to-r from-[#1C274C]/20 to-[#1C274C]/10';
          } else if (isMonetizationSection) {
            specialBgStyle = 'bg-gradient-to-r from-[#2D527C]/20 to-[#CEE8FA]/20';
          } else if (isMyEarningsSection) {
            specialBgStyle = 'bg-gradient-to-r from-[#FD6A7E]/20 from-0% via-[#17B978]/20 via-12.5% via-[#8797EE]/20 via-25% via-[#41A6F9]/20 via-37.5% to-[#37E0FF]/20 to-50% via-[#2FD9B9]/20 via-62.5% via-[#F498BD]/20 via-75% via-[#FFDF1D]/20 via-87.5% to-[#C6C9CC]/10 to-100%';
          } else if (isAffiliatesSection) {
            specialBgStyle = 'bg-gradient-to-r from-[#152C70]/30 to-[#4296FF]/20';
          } else if (isMyPointsSection) {
            specialBgStyle = 'bg-gradient-to-r from-[#F44336]/30 to-[#FFCA28]/30';
          } else if (isWalletSection) {
            specialBgStyle = 'bg-gradient-to-r from-[#9E5523]/20 via-[#7EAF8A]/15 via-[#0093F7]/15 via-[#24D1FF]/15 via-[#12DB55]/15 via-[#29EF66]/15 to-[#D39754]/20';
          } else if (isDeleteAccountSection) {
            specialBgStyle = 'bg-gradient-to-r from-[#FF3B30]/30 to-[#89a3b8]/20';
          }
           
           return (
             <div key={section.id}>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Update active section first
                    setActiveSection(section.id);
                    
                    // Only navigate if section actually changed; use replace to avoid history bloat
                    const newUrl = `/profile/settings?section=${section.id}`;
                    const currentParams = new URLSearchParams(location.search);
                    const currentSection = currentParams.get('section');
                    if (location.pathname !== '/profile/settings' || currentSection !== section.id) {
                      navigate(newUrl, { replace: true });
                    }
                  }}
                   className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-all duration-200 mb-1 ${
                     isActive ? `bg-gray-50 ${getBorderGradient(section.id)}` : 'text-gray-700 hover:bg-gray-50'
                   }`}
                >
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center ${specialBgStyle}`}>
                     {isProfileSection ? (
                       <CustomProfileIcon className="w-5 h-5" />
                     ) : isGeneralSection ? (
                       <CustomGeneralIcon className="w-5 h-5" />
                     ) : isAvatarCoverSection ? (
                       <CustomAvatarCoverIcon className="w-5 h-5" />
                     ) : isNotificationsSection ? (
                       <CustomNotificationIcon className="w-5 h-5" />
                     ) : isPrivacySection ? (
                       <CustomPrivacyIcon className="w-5 h-5" />
                      ) : isPasswordSection ? (
                        <CustomPasswordIcon className="w-5 h-5" />
                      ) : isSessionsSection ? (
                        <CustomSessionsIcon className="w-5 h-5" />
                      ) : isTwoFactorSection ? (
                        <CustomTwoFactorIcon className="w-5 h-5" />
                      ) : isBlockedUsersSection ? (
                        <CustomBlockedUsersIcon className="w-5 h-5" />
                      ) : isMyInformationSection ? (
                        <CustomMyInformationIcon className="w-5 h-5" />
                      ) : isMyAddressesSection ? (
                        <CustomMyAddressesIcon className="w-5 h-5" />
                      ) : isLocationPreferencesSection ? (
                        <CustomLocationIcon className="w-5 h-5" />
                      ) : isVerificationSection ? (
                        <CustomVerificationIcon className="w-5 h-5" />
                       ) : isMonetizationSection ? (
                         <CustomMonetizationIcon className="w-5 h-5" />
                       ) : isMyEarningsSection ? (
                         <CustomMyEarningsIcon className="w-5 h-5" />
                        ) : isAffiliatesSection ? (
                          <CustomMyAffiliatesIcon className="w-5 h-5" />
                         ) : isMyPointsSection ? (
                           <CustomMyPointsIcon className="w-5 h-5" />
                          ) : isWalletSection ? (
                            <CustomWalletIcon className="w-5 h-5" />
                          ) : isDeleteAccountSection ? (
                            <CustomDeleteAccountIcon className="w-5 h-5" />
                          ) : (
                            <Icon className={`w-5 h-5 ${iconColor}`} />
                          )}
                 </div>
                  <span className={`text-sm font-medium ${getTextGradient(section.id, isActive)}`}>
                    {section.label}
                  </span>
               </button>
               {'divider' in section && section.divider && (
                 <hr className="my-1 border-gray-200" />
               )}
             </div>
           );
         })}
         </nav>

        {/* Glassmorphic Scroll Indicator */}
        {showScrollIndicator && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
            <div className="relative">
              <div className="w-12 h-12 rounded-full backdrop-blur-xl bg-white/10 border border-white/30 shadow-2xl flex items-center justify-center animate-bounce">
                <ChevronDown className="w-6 h-6 text-gray-800 animate-pulse" strokeWidth={2.5} />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent blur-md -z-10"></div>
            </div>
          </div>
        )}
      </div>
    </div>;
};
export default ProfileSettingsSidebar;
