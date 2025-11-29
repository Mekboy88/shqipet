
import React from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import Avatar from '@/components/Avatar';
import { useUniversalUser } from '@/hooks/useUniversalUser';
import { headerConfig } from './headerConfig';

interface ProfileSettingsHeaderProps {
  activeSection: string;
  userInfo: {
    firstName?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    username?: string;
    earnings?: number;
    walletBalance?: number;
  };
  saving?: boolean;
}

const ProfileSettingsHeader: React.FC<ProfileSettingsHeaderProps> = ({ activeSection, userInfo, saving }) => {
  const { displayName } = useUniversalUser();
  const config = headerConfig[activeSection];

  if (!config) {
    return null;
  }

  const {
    headerText: headerTextOrFn,
    avatarStyles,
    containerClasses,
    Icon,
    isVerification,
  } = config;
  
const headerText = typeof headerTextOrFn === 'function' ? headerTextOrFn(userInfo) : headerTextOrFn;
// Prefer full name from settings (snake_case), then universal displayName, then fallbacks
const fullNameFromSettings = [userInfo.first_name, userInfo.last_name].filter(Boolean).join(' ').trim();
const usernameFallback = userInfo.username || (userInfo.email ? userInfo.email.split('@')[0] : '');
const name = fullNameFromSettings || displayName || userInfo.firstName || usernameFallback || 'User';

  const getHeaderGradient = (sectionId: string) => {
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
      case 'location-preferences':
        return 'bg-clip-text text-transparent bg-gradient-to-r from-[#758CA3] to-[#5a7184]';
      case 'delete-account':
        return 'bg-clip-text text-transparent bg-gradient-to-r from-[#FF3B30] to-[#89a3b8]';
      default:
        return 'text-black';
    }
  };

  const getBackgroundGradient = (sectionId: string) => {
    switch(sectionId) {
      case 'profile':
        return 'bg-gradient-to-r from-black/10 to-gray-300/20';
      case 'general':
        return 'bg-gradient-to-r from-[#45596B]/10 to-[#647F94]/20';
      case 'avatar-and-cover':
        return 'bg-gradient-to-r from-[#5C5D6E]/10 to-[#9BDCB4]/20';
      case 'social':
        return 'bg-gradient-to-r from-[#000000]/10 to-[#2ca9bc]/20';
      case 'notifications':
        return 'bg-gradient-to-r from-[#73D0F4]/10 to-[#3D6889]/20';
      case 'privacy':
        return 'bg-gradient-to-r from-[#fb8c00]/10 via-[#1e88e5]/15 to-[#424242]/10';
      case 'password':
        return 'bg-gradient-to-r from-[#FDAFA4]/10 to-[#0F277F]/20';
      case 'manage-sessions':
        return 'bg-gradient-to-r from-[#007BCE]/10 via-[#2EE5CA]/15 to-[#FF5AC8]/10';
      case 'two-factor':
        return 'bg-gradient-to-r from-[#EC1C24]/10 to-[#666666]/20';
      case 'blocked-users':
        return 'bg-gradient-to-r from-[#666666]/10 via-[#ff8282]/15 to-[#000000]/10';
      case 'information':
        return 'bg-gradient-to-r from-[#64BFA3]/10 to-[#040000]/10';
      case 'addresses':
        return 'bg-gradient-to-r from-[#F76D57]/10 to-[#394240]/20';
      case 'verification':
        return 'bg-gradient-to-r from-[#1C274C]/10 to-[#1C274C]/20';
      case 'monetization':
        return 'bg-gradient-to-r from-[#2D527C]/10 to-[#CEE8FA]/20';
      case 'earnings':
        return 'bg-gradient-to-r from-[#FD6A7E]/10 via-[#17B978]/15 via-[#8797EE]/15 to-[#41A6F9]/10';
      case 'affiliates':
        return 'bg-gradient-to-r from-[#152C70]/10 to-[#4296FF]/20';
      case 'my-points':
        return 'bg-gradient-to-r from-[#F44336]/10 to-[#FFCA28]/20';
      case 'wallet':
        return 'bg-gradient-to-r from-[#9E5523]/10 via-[#7EAF8A]/15 via-[#0093F7]/15 to-[#D39754]/10';
      case 'location-preferences':
        return 'bg-gradient-to-r from-[#758CA3]/10 to-[#5a7184]/20';
      case 'delete-account':
        return 'bg-gradient-to-r from-[#FF3B30]/10 to-[#89a3b8]/20';
      default:
        return 'bg-white';
    }
  };

  const nameColor = 'text-gray-600';
  const headerColor = getHeaderGradient(activeSection);

  return (
    <div className={`mb-6 p-4 rounded-lg ${getBackgroundGradient(activeSection)} ${containerClasses}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 justify-between">
        {/* Left side: Avatar and Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="relative flex-shrink-0">
            <Avatar 
              size="xl"
              className={`border-2 ${avatarStyles.border}`}
            />
          </div>

          <div>
            {isVerification ? (
              <>
                <div className="flex items-center gap-2">
                  <p className={`text-xl sm:text-2xl font-bold ${headerColor}`}>{name}</p>
                </div>
                <h1 className="text-gray-600">{headerText}</h1>
              </>
            ) : (
              <>
                <h1 className={`text-xl sm:text-2xl font-bold ${headerColor}`}>{headerText}</h1>
              </>
            )}
          </div>
        </div>

        {/* Right side: Saving Indicator */}
        {saving && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 border border-green-200 shadow-sm">
            <Loader2 className="h-4 w-4 animate-spin text-green-600" />
            <span className="text-sm font-medium text-green-700">Saving...</span>
          </div>
        )}

        {/* Contact Card Icon - Only show on Monetization page */}
        {activeSection === 'monetization' && !saving && (
          <div className="flex-shrink-0">
            <svg 
              height="72px" 
              width="72px" 
              viewBox="0 0 512 512" 
              className="w-16 h-16 sm:w-18 sm:h-18"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path style={{fill:"#E4EAF8"}} d="M476.69,406.069H35.31C15.809,406.069,0,390.26,0,370.759V105.931c0-19.501,15.809-35.31,35.31-35.31 H476.69c19.501,0,35.31,15.809,35.31,35.31v264.828C512,390.26,496.191,406.069,476.69,406.069z"/>
              <path style={{fill:"#D5DCED"}} d="M150.069,300.138c-43.879,0-79.448,35.57-79.448,79.448c0,9.301,1.681,18.188,4.618,26.483H224.9 c2.936-8.295,4.618-17.182,4.618-26.483C229.517,335.708,193.948,300.138,150.069,300.138z"/>
              <path style={{fill:"#AFB9D2"}} d="M256,370.759H44.138c-4.875,0-8.828-3.953-8.828-8.828V114.759c0-4.875,3.953-8.828,8.828-8.828H256 c4.875,0,8.828,3.953,8.828,8.828v247.172C264.828,366.806,260.875,370.759,256,370.759z"/>
              <path style={{fill:"#959CB5"}} d="M71.138,370.759H229c-4.395-39.72-38.039-70.621-78.931-70.621S75.534,331.039,71.138,370.759z"/>
              <path style={{fill:"#E4EAF8"}} d="M220.69,335.448c4.875,0,8.828-3.953,8.828-8.828v-22.585c0-7.599-4.863-14.346-12.072-16.749 l-34.871-11.624c-3.598-1.199-6.028-4.563-6.036-8.355l-0.033-15.698c5.511-2.755,9.187-8.184,9.698-14.325l1.929-21.021 c3.693-3.235,6.074-7.933,6.074-13.229v-44.138c0-4.875-3.953-8.828-8.828-8.828h-52.966c-14.626,0-26.483,11.857-26.483,26.483 v26.483c0,5.297,2.381,9.994,6.074,13.229l1.929,21.021c0.511,6.14,4.188,11.57,9.698,14.325l-0.033,15.698 c-0.008,3.793-2.438,7.157-6.036,8.355l-34.871,11.624c-7.209,2.403-12.072,9.15-12.072,16.749v22.585 c0,4.875,3.953,8.828,8.828,8.828H220.69z"/>
              <path style={{fill:"#7F8499"}} d="M423.724,132.414H300.138c-4.879,0-8.828-3.953-8.828-8.828c0-4.875,3.948-8.828,8.828-8.828h123.586 c4.879,0,8.828,3.953,8.828,8.828C432.552,128.461,428.604,132.414,423.724,132.414z"/>
              <path style={{fill:"#707487"}} d="M467.862,167.724H300.138c-4.879,0-8.828-3.953-8.828-8.828c0-4.875,3.948-8.828,8.828-8.828h167.724 c4.879,0,8.828,3.953,8.828,8.828C476.69,163.772,472.742,167.724,467.862,167.724z"/>
              <path style={{fill:"#959CB5"}} d="M467.862,291.31H353.103c-4.879,0-8.828-3.953-8.828-8.828s3.948-8.828,8.828-8.828h114.759 c4.879,0,8.828,3.953,8.828,8.828S472.742,291.31,467.862,291.31z"/>
              <path style={{fill:"#7F8499"}} d="M317.793,291.31h-17.655c-4.879,0-8.828-3.953-8.828-8.828s3.948-8.828,8.828-8.828h17.655 c4.879,0,8.828,3.953,8.828,8.828S322.673,291.31,317.793,291.31z"/>
              <path style={{fill:"#959CB5"}} d="M441.379,326.621h-88.276c-4.879,0-8.828-3.953-8.828-8.828s3.948-8.828,8.828-8.828h88.276 c4.879,0,8.828,3.953,8.828,8.828S446.259,326.621,441.379,326.621z"/>
              <path style={{fill:"#7F8499"}} d="M317.793,326.621h-17.655c-4.879,0-8.828-3.953-8.828-8.828s3.948-8.828,8.828-8.828h17.655 c4.879,0,8.828,3.953,8.828,8.828S322.673,326.621,317.793,326.621z"/>
              <path style={{fill:"#959CB5"}} d="M441.379,361.931h-88.276c-4.879,0-8.828-3.953-8.828-8.828s3.948-8.828,8.828-8.828h88.276 c4.879,0,8.828,3.953,8.828,8.828S446.259,361.931,441.379,361.931z"/>
              <path style={{fill:"#7F8499"}} d="M317.793,361.931h-17.655c-4.879,0-8.828-3.953-8.828-8.828s3.948-8.828,8.828-8.828h17.655 c4.879,0,8.828,3.953,8.828,8.828S322.673,361.931,317.793,361.931z"/>
              <circle style={{fill:"#9BF57D"}} cx="317.793" cy="220.69" r="22.069"/>
              <circle style={{fill:"#FFDC64"}} cx="388.414" cy="220.69" r="22.069"/>
              <circle style={{fill:"#FFDC64"}} cx="459.034" cy="220.69" r="22.069"/>
              <path style={{fill:"#D5DCED"}} d="M216.12,335.448c-14.253-21.288-38.509-35.31-66.051-35.31s-51.798,14.023-66.051,35.31H216.12z"/>
              <circle style={{fill:"#9BF57D"}} cx="150.069" cy="379.586" r="61.793"/>
              <path style={{fill:"#FFFFFF"}} d="M144.181,406.069c-2.044,0-4.086-0.703-5.741-2.125l-20.595-17.655 c-3.706-3.172-4.138-8.746-0.957-12.448c3.172-3.699,8.75-4.125,12.439-0.957l14.112,12.099l26.603-29.017 c3.293-3.599,8.871-3.832,12.474-0.543c3.595,3.297,3.837,8.879,0.543,12.474l-32.371,35.31 C148.948,405.103,146.569,406.069,144.181,406.069z"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettingsHeader;
