import React from 'react';
import ProfileSettingsSidebar from './ProfileSettingsSidebar';
import ProfileSettingsContent from './ProfileSettingsContent';
interface ProfileSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  userInfo: any; // This is now unused but kept for compatibility
  setUserInfo: React.Dispatch<React.SetStateAction<any>>; // This is now unused but kept for compatibility
}
const ProfileSettingsDialog: React.FC<ProfileSettingsDialogProps> = ({
  isOpen,
  onClose,
  activeSection,
  setActiveSection
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-30 overflow-hidden pointer-events-none">
      {/* Wallpaper layer - behind everything, starts below top bar */}
      <div className="absolute top-[57px] left-0 right-0 bottom-0 bg-gray-100 pointer-events-none"></div>
      
      {/* Windows container */}
      <div className="relative w-[1040px] h-[calc(100vh-120px)] overflow-visible absolute left-1/2 transform -translate-x-1/2 z-10 pointer-events-auto" style={{ top: '80px' }}>
        <div className="w-full h-full flex flex-row">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden w-80 flex-shrink-0 -ml-2 h-full">
            <ProfileSettingsSidebar activeSection={activeSection} setActiveSection={setActiveSection} onClose={onClose} />
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex-1 ml-4 h-full relative z-30 pointer-events-auto">
            <ProfileSettingsContent activeSection={activeSection} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileSettingsDialog;