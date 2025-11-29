import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Avatar from '@/components/Avatar';
import { Camera, Shield, Check, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBreakpoint } from '@/hooks/use-mobile';
import MobileTwoFactorDialog from './MobileTwoFactorDialog';
import MobileCountrySelect from './MobileCountrySelect';
import MobileTimezoneSelect from './MobileTimezoneSelect';

interface ProfileSettingsData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  website: string;
  country: string;
  timezone: string;
  two_factor_enabled: boolean;
  two_factor_method: string;
  avatar_url?: string;
}

interface MobileGeneralSettingsFormProps {
  userInfo: ProfileSettingsData | null;
  setUserInfo: React.Dispatch<React.SetStateAction<ProfileSettingsData | null>>;
  onSave: (data: ProfileSettingsData) => Promise<void>;
  saving: boolean;
  loading: boolean;
}

const MobileGeneralSettingsForm: React.FC<MobileGeneralSettingsFormProps> = ({
  userInfo,
  setUserInfo,
  onSave,
  saving,
  loading
}) => {
  const [isTwoFactorDialogOpen, setIsTwoFactorDialogOpen] = useState(false);
  const { toast } = useToast();
  const { isMobile } = useBreakpoint();

  const handleInputChange = (field: keyof ProfileSettingsData, value: string) => {
    setUserInfo(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSave = async () => {
    if (!userInfo) return;
    
    try {
      await onSave(userInfo);
      toast({
        title: "Settings saved",
        description: "Your profile settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTwoFactorEnable = (secretKey: string, verificationCode: string) => {
    // In a real app, you would verify the code with your backend
    setUserInfo(prev => prev ? {
      ...prev,
      two_factor_enabled: true,
      two_factor_method: 'google_authenticator'
    } : null);
  };

  const handleTwoFactorDisable = () => {
    setUserInfo(prev => prev ? {
      ...prev,
      two_factor_enabled: false,
      two_factor_method: ''
    } : null);
    toast({
      title: "2FA Disabled",
      description: "Two-factor authentication has been disabled.",
    });
  };

  if (loading || !userInfo) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Profile Header - Mobile Optimized */}
      <div className="text-center space-y-4 pb-6 border-b">
        <div className="relative inline-block">
          <Avatar 
            size="2xl"
            src={userInfo.avatar_url}
            initials={`${userInfo.firstName?.[0] || ''}${userInfo.lastName?.[0] || ''}`}
            className="mx-auto img-locked"
          />
          <Button 
            size="sm" 
            className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0"
            variant="secondary"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <h3 className="text-lg font-semibold">
            {userInfo.firstName} {userInfo.lastName}
          </h3>
          <p className="text-sm text-gray-600">{userInfo.email}</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          Personal Information
        </h4>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
            <Input
              id="firstName"
              type="text"
              value={userInfo.firstName || ''}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              value={userInfo.lastName || ''}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={userInfo.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={userInfo.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="h-12"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
            <textarea
              id="bio"
              value={userInfo.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm font-medium">Website</Label>
            <Input
              id="website"
              type="url"
              value={userInfo.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="h-12"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      </div>

      {/* Location Settings */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Location Settings</h4>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Country</Label>
            <MobileCountrySelect
              value={userInfo.country}
              onValueChange={(value) => handleInputChange('country', value)}
              placeholder="Select your country"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Timezone</Label>
            <MobileTimezoneSelect
              value={userInfo.timezone}
              onValueChange={(value) => handleInputChange('timezone', value)}
              placeholder="Select your timezone"
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Security Settings
        </h4>

        {/* Two-Factor Authentication */}
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h5 className="font-medium">Two-Factor Authentication</h5>
                {userInfo.two_factor_enabled && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    <Check className="h-3 w-3" />
                    Enabled
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {userInfo.two_factor_enabled 
                  ? `Protected with ${userInfo.two_factor_method === 'google_authenticator' ? 'Google Authenticator' : '2FA'}`
                  : 'Add an extra layer of security to your account'
                }
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
          
          <div className="mt-4 flex gap-2">
            {userInfo.two_factor_enabled ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleTwoFactorDisable}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Disable 2FA
              </Button>
            ) : (
              <Button 
                size="sm"
                onClick={() => setIsTwoFactorDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Enable 2FA
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Save Button - Sticky on Mobile */}
      <div className="sticky bottom-0 bg-white border-t p-4 -mx-4 mt-8">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="w-full h-12 text-base font-medium"
        >
          {saving ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </div>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>

      {/* Two-Factor Dialog */}
      <MobileTwoFactorDialog
        isOpen={isTwoFactorDialogOpen}
        onClose={() => setIsTwoFactorDialogOpen(false)}
        onEnable={handleTwoFactorEnable}
      />
    </div>
  );
};

export default MobileGeneralSettingsForm;