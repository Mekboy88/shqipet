import React, { useState } from 'react';
import { X, ArrowLeft, Settings, User, Bell, Shield, Palette, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfileSettings } from '@/contexts/ProfileSettingsContext';
import { useBreakpoint } from '@/hooks/use-mobile';
import MobileGeneralSettingsForm from './MobileGeneralSettingsForm';

interface MobileProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const settingsSections = [
  {
    id: 'general',
    title: 'General',
    description: 'Basic profile information and personal details',
    icon: User,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Manage your notification preferences',
    icon: Bell,
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Password, 2FA, and security settings',
    icon: Shield,
  },
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Theme, display, and accessibility options',
    icon: Palette,
  },
  {
    id: 'language',
    title: 'Language & Region',
    description: 'Language, timezone, and regional settings',
    icon: Globe,
  },
];

const MobileProfileSettings: React.FC<MobileProfileSettingsProps> = ({
  isOpen,
  onClose
}) => {
  const [currentView, setCurrentView] = useState<'menu' | 'section'>('menu');
  const [activeSection, setActiveSection] = useState('general');
  const { userInfo, setUserInfo } = useProfileSettings();
  const { isMobile } = useBreakpoint();

  // Mock save function - replace with actual implementation
  const handleSave = async (data: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Saving data:', data);
  };

  if (!isOpen) return null;

  const handleSectionSelect = (sectionId: string) => {
    setActiveSection(sectionId);
    setCurrentView('section');
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
  };

  const currentSection = settingsSections.find(s => s.id === activeSection);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          {currentView === 'section' && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToMenu}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <h1 className="text-lg font-semibold">
              {currentView === 'menu' ? 'Settings' : currentSection?.title}
            </h1>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {currentView === 'menu' ? (
          /* Settings Menu */
          <div className="h-full overflow-y-auto">
            <div className="p-4 space-y-2">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionSelect(section.id)}
                    className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">{section.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{section.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Info */}
            <div className="p-4 border-t bg-gray-50 mt-8">
              <p className="text-xs text-gray-500 text-center">
                Version 1.0.0 • Made with ❤️ by Lovable
              </p>
            </div>
          </div>
        ) : (
          /* Section Content */
          <div className="h-full overflow-y-auto">
            {activeSection === 'general' && (
              <MobileGeneralSettingsForm
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                onSave={handleSave}
                saving={false}
                loading={false}
              />
            )}
            
            {activeSection === 'notifications' && (
              <div className="p-4">
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Notifications</h3>
                  <p className="text-gray-500">Notification settings coming soon...</p>
                </div>
              </div>
            )}
            
            {activeSection === 'security' && (
              <div className="p-4">
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Security</h3>
                  <p className="text-gray-500">Advanced security settings coming soon...</p>
                </div>
              </div>
            )}
            
            {activeSection === 'appearance' && (
              <div className="p-4">
                <div className="text-center py-12">
                  <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Appearance</h3>
                  <p className="text-gray-500">Theme and appearance settings coming soon...</p>
                </div>
              </div>
            )}
            
            {activeSection === 'language' && (
              <div className="p-4">
                <div className="text-center py-12">
                  <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Language & Region</h3>
                  <p className="text-gray-500">Language and regional settings coming soon...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileProfileSettings;