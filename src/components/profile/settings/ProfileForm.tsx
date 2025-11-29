
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ProfileSettingsData } from '@/hooks/useProfileSettings';

interface ProfileFormProps {
  userInfo: ProfileSettingsData;
  setUserInfo: React.Dispatch<React.SetStateAction<ProfileSettingsData>>;
  onSave?: (data: Partial<ProfileSettingsData>) => Promise<boolean>;
  saving?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ 
  userInfo, 
  setUserInfo, 
  onSave,
  saving = false 
}) => {
  const handleSave = async () => {
    if (onSave) {
      await onSave({
        about_me: userInfo.about_me,
        location: userInfo.location,
        school: userInfo.school,
        school_completed: userInfo.school_completed,
        working_at: userInfo.working_at,
        city_location: userInfo.city_location,
        website: userInfo.website
      });
    }
  };

  const handleInputChange = (field: keyof ProfileSettingsData, value: string | boolean) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="about_me">About Me</Label>
        <Textarea
          id="about_me"
          value={userInfo?.about_me || ''}
          onChange={(e) => handleInputChange('about_me', e.target.value)}
          className="bg-gray-50 focus:border-black focus:ring-black min-h-[100px]"
          placeholder="Tell us about yourself..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Current Location</Label>
        <Input
          id="location"
          value={userInfo?.location || ''}
          onChange={(e) => handleInputChange('location', e.target.value)}
          className="bg-gray-50 focus:border-black focus:ring-black"
          placeholder="City, Country"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="school">School/University</Label>
        <Input
          id="school"
          value={userInfo?.school || ''}
          onChange={(e) => handleInputChange('school', e.target.value)}
          className="bg-gray-50 focus:border-black focus:ring-black"
          placeholder="Your school or university"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="school_completed"
          checked={userInfo?.school_completed || false}
          onCheckedChange={(checked) => handleInputChange('school_completed', !!checked)}
        />
        <Label htmlFor="school_completed">Completed Education</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="working_at">Currently Working At</Label>
        <Input
          id="working_at"
          value={userInfo?.working_at || ''}
          onChange={(e) => handleInputChange('working_at', e.target.value)}
          className="bg-gray-50 focus:border-black focus:ring-black"
          placeholder="Company name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city_location">City you live</Label>
        <Input
          id="city_location"
          value={userInfo?.city_location || ''}
          onChange={(e) => handleInputChange('city_location', e.target.value)}
          className="bg-gray-50 focus:border-black focus:ring-black"
          placeholder="Enter the city where you live"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Personal Website</Label>
        <Input
          id="website"
          type="url"
          value={userInfo?.website || ''}
          onChange={(e) => handleInputChange('website', e.target.value)}
          className="bg-gray-50 focus:border-black focus:ring-black"
          placeholder="https://yourwebsite.com"
        />
      </div>

      <div className="pt-4">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-red-500 hover:bg-red-600 text-white px-8"
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default ProfileForm;
