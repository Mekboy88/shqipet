import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Users, ChevronDown, Settings, UserCheck, UserX, MapPin, Briefcase, Calendar } from 'lucide-react';

interface AudienceSettings {
  privacy: string;
  excludedUsers: string[];
  specificUsers: string[];
  locationRestriction?: string;
  ageRange?: { min: number; max: number };
  interests?: string[];
}

interface AdvancedAudienceTargetingProps {
  settings: AudienceSettings;
  onSettingsChange: (settings: AudienceSettings) => void;
}

const AdvancedAudienceTargeting: React.FC<AdvancedAudienceTargetingProps> = ({ settings, onSettingsChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const privacyOptions = [
    { value: 'public', label: 'Public', description: 'Anyone can see this post' },
    { value: 'friends', label: 'Friends', description: 'Only friends can see' },
    { value: 'close_friends', label: 'Close Friends', description: 'Selected close friends only' },
    { value: 'family', label: 'Family', description: 'Family members only' },
    { value: 'work', label: 'Work Network', description: 'Colleagues and work contacts' },
    { value: 'custom', label: 'Custom', description: 'Specific audience settings' }
  ];

  const interestCategories = [
    'Technology', 'Sports', 'Music', 'Travel', 'Food', 'Art', 'Business', 'Health', 'Gaming', 'Photography'
  ];

  const locationOptions = [
    'Current City', 'Home Country', 'Nearby (50km)', 'Global'
  ];

  const updateSetting = (key: keyof AudienceSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const toggleInterest = (interest: string) => {
    const currentInterests = settings.interests || [];
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    updateSetting('interests', newInterests);
  };

  return (
    <div className="space-y-3">
      {settings.privacy && (
        <div className="text-sm p-2 bg-purple-50 rounded-lg border border-purple-200 flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-600" />
          <span>Audience: <strong className="capitalize">{settings.privacy}</strong></span>
        </div>
      )}

      {showAdvanced && (
        <div className="border rounded-lg p-3 space-y-3 bg-card/50">
          <div className="text-sm font-medium">Advanced Audience Settings</div>
          
          {/* Location Targeting */}
          <div className="space-y-2">
            <label className="text-xs font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Location Restriction
            </label>
            <select 
              value={settings.locationRestriction || ''}
              onChange={(e) => updateSetting('locationRestriction', e.target.value)}
              className="w-full text-xs border rounded px-2 py-1"
            >
              <option value="">No restriction</option>
              {locationOptions.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Age Range */}
          <div className="space-y-2">
            <label className="text-xs font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Age Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="13"
                max="100"
                placeholder="Min"
                value={settings.ageRange?.min || ''}
                onChange={(e) => updateSetting('ageRange', { 
                  ...settings.ageRange, 
                  min: parseInt(e.target.value) 
                })}
                className="flex-1 text-xs border rounded px-2 py-1"
              />
              <input
                type="number"
                min="13"
                max="100"
                placeholder="Max"
                value={settings.ageRange?.max || ''}
                onChange={(e) => updateSetting('ageRange', { 
                  ...settings.ageRange, 
                  max: parseInt(e.target.value) 
                })}
                className="flex-1 text-xs border rounded px-2 py-1"
              />
            </div>
          </div>

          {/* Interest Targeting */}
          <div className="space-y-2">
            <label className="text-xs font-medium flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              Interest Categories
            </label>
            <div className="grid grid-cols-2 gap-1">
              {interestCategories.map(interest => (
                <label key={interest} className="flex items-center space-x-1 text-xs">
                  <input
                    type="checkbox"
                    checked={settings.interests?.includes(interest) || false}
                    onChange={() => toggleInterest(interest)}
                    className="w-3 h-3"
                  />
                  <span>{interest}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Exclusions */}
          <div className="space-y-2">
            <label className="text-xs font-medium flex items-center gap-1">
              <UserX className="w-3 h-3" />
              Exclude Users
            </label>
            <input
              type="text"
              placeholder="@username, @another..."
              className="w-full text-xs border rounded px-2 py-1"
            />
          </div>
        </div>
      )}

      {/* Summary */}
      {(settings.locationRestriction || settings.ageRange || settings.interests?.length) && (
        <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
          <div className="font-medium mb-1">Targeting Summary:</div>
          <ul className="space-y-0.5">
            {settings.locationRestriction && (
              <li>• Location: {settings.locationRestriction}</li>
            )}
            {settings.ageRange && (
              <li>• Age: {settings.ageRange.min}-{settings.ageRange.max} years</li>
            )}
            {settings.interests?.length && (
              <li>• Interests: {settings.interests.slice(0, 3).join(', ')}{settings.interests.length > 3 ? '...' : ''}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdvancedAudienceTargeting;