
import React, { useEffect, useRef, useState } from 'react';
import ProfileSettingsHeader from './ProfileSettingsHeader';
import { settingsSections } from './settingsData';
import { settingsComponentMap } from './settingsSectionsMap';
import { useProfileSettings as useProfileSettingsHook } from '@/hooks/useProfileSettings';
import SettingsSkeleton from './SettingsSkeleton';
import ProfileSettingsSkeleton from './ProfileSettingsSkeleton';

interface ProfileSettingsContentProps {
  activeSection: string;
}

const ProfileSettingsContent: React.FC<ProfileSettingsContentProps> = ({
  activeSection
}) => {
  const { userInfo, setUserInfo, saving, saveSettings, loading } = useProfileSettingsHook();
  const hasLoadedOnceRef = useRef(false);
  const [childSaving, setChildSaving] = useState(false);
  
  useEffect(() => {
    if (!loading) hasLoadedOnceRef.current = true;
  }, [loading]);
  const stableLoading = hasLoadedOnceRef.current ? false : loading;

  // Determine section robustly and default to 'profile' if the activeSection is invalid.
  const resolveSection = (section?: string) => {
    if (!section) return 'profile';
    const s = section.toLowerCase();
    if (settingsComponentMap[s]) return s;
    const norm = s.replace(/_/g, '-');
    if (settingsComponentMap[norm]) return norm;
    if (s.includes('avatar') && s.includes('cover') && settingsComponentMap['avatar-and-cover']) return 'avatar-and-cover';
    if (s.includes('session') && (settingsComponentMap['manage-sessions'] || settingsComponentMap['sessions'])) {
      return settingsComponentMap['manage-sessions'] ? 'manage-sessions' : 'sessions';
    }
    return 'profile';
  };
  const currentSection = resolveSection(activeSection);
  const Component = settingsComponentMap[currentSection];

  if (loading && !hasLoadedOnceRef.current) {
    if (currentSection === 'profile') {
      return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto border-l border-gray-200 lg:border-l-0 max-h-[calc(100vh-2rem)]">
            <ProfileSettingsSkeleton />
          </div>
        </div>
      );
    }
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto border-l border-gray-200 lg:border-l-0 max-h-[calc(100vh-2rem)]">
          <SettingsSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden pointer-events-auto isolate">
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto border-l border-gray-200 lg:border-l-0 max-h-[calc(100vh-2rem)]">
        <ProfileSettingsHeader 
          activeSection={currentSection} 
          userInfo={userInfo}
          saving={currentSection === 'privacy' ? childSaving : saving}
        />
        
        <div className="w-full pb-8">
          {Component ? (
            <Component 
              userInfo={userInfo} 
              setUserInfo={setUserInfo}
              onSave={saveSettings}
              saving={saving}
              loading={stableLoading}
              onSavingChange={currentSection === 'privacy' ? setChildSaving : undefined}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsContent;
