import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfileSettingsData } from '@/hooks/useProfileSettings';
import { useAuth } from '@/contexts/AuthContext';
import { languages } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { universalUserService } from '@/services/universalUserService';
import PhoneNumberPopup from './PhoneNumberPopup';
import ChangePhoneNumberDialog from './ChangePhoneNumberDialog';
import EnhancedEmailSetupDialog from './EnhancedEmailSetupDialog';
import ChangeNameDialog from './ChangeNameDialog';
import MobileCountrySelect from './MobileCountrySelect';
import MobileTimezoneSelect from './MobileTimezoneSelect';
import MobileTwoFactorDialog from './MobileTwoFactorDialog';
import { syncPhoneVerificationStatus, syncEmailVerificationStatus, refreshUserVerificationData } from '@/utils/verificationSync';
import { formatInTimeZone } from 'date-fns-tz';
import { format } from 'date-fns';
import { User, Lock, Phone, Globe, Heart, Clock } from 'lucide-react';

interface MobileGeneralSettingsFormProps {
  userInfo: ProfileSettingsData;
  setUserInfo: React.Dispatch<React.SetStateAction<ProfileSettingsData>>;
  onSave?: (data: Partial<ProfileSettingsData>) => Promise<boolean>;
  saving?: boolean;
  loading?: boolean;
}

const MobileGeneralSettingsForm: React.FC<MobileGeneralSettingsFormProps> = ({
  userInfo,
  setUserInfo,
  onSave,
  saving = false,
  loading = false
}) => {
  const { user } = useAuth();
  const [isPhonePopupOpen, setIsPhonePopupOpen] = useState(false);
  const [isChangePhoneDialogOpen, setIsChangePhoneDialogOpen] = useState(false);
  const [isChangeEmailDialogOpen, setIsChangeEmailDialogOpen] = useState(false);
  const [isTwoFactorDialogOpen, setIsTwoFactorDialogOpen] = useState(false);
  const [isChangeNameDialogOpen, setIsChangeNameDialogOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Country code to timezone mapping
  const countryCodeToTimezone: { [key: string]: string } = {
    'al': 'Europe/Tirane',
    'gb': 'Europe/London',
    'us': 'America/New_York',
    'de': 'Europe/Berlin',
    'fr': 'Europe/Paris',
    'it': 'Europe/Rome',
    'es': 'Europe/Madrid',
    'nl': 'Europe/Amsterdam',
    'at': 'Europe/Vienna',
    'be': 'Europe/Brussels',
    'bg': 'Europe/Sofia',
    'hr': 'Europe/Zagreb',
    'cz': 'Europe/Prague',
    'dk': 'Europe/Copenhagen',
    'ee': 'Europe/Tallinn',
    'fi': 'Europe/Helsinki',
    'gr': 'Europe/Athens',
    'hu': 'Europe/Budapest',
    'ie': 'Europe/Dublin',
    'lv': 'Europe/Riga',
    'lt': 'Europe/Vilnius',
    'lu': 'Europe/Luxembourg',
    'mt': 'Europe/Malta',
    'no': 'Europe/Oslo',
    'pl': 'Europe/Warsaw',
    'pt': 'Europe/Lisbon',
    'ro': 'Europe/Bucharest',
    'sk': 'Europe/Bratislava',
    'si': 'Europe/Ljubljana',
    'se': 'Europe/Stockholm',
    'ch': 'Europe/Zurich'
  };

  // Auto-select timezone based on country
  useEffect(() => {
    if (userInfo?.country && countryCodeToTimezone[userInfo.country]) {
      const suggestedTimezone = countryCodeToTimezone[userInfo.country];
      handleInputChange('timezone', suggestedTimezone);
    }
  }, [userInfo?.country]);

  // Sync user data
  useEffect(() => {
    const syncUserData = async () => {
      if (user && (!userInfo.phone_number || !userInfo.gender || !userInfo.birthday || !userInfo.username)) {
        try {
          const { data: authUser, error: authError } = await supabase.auth.getUser();
          
          if (authUser?.user) {
            const updates: Partial<ProfileSettingsData> = {};
            
            if (!userInfo.phone_number && authUser.user.phone) {
              updates.phone_number = authUser.user.phone;
            }
            
            if (!userInfo.gender && authUser.user.user_metadata?.gender) {
              updates.gender = authUser.user.user_metadata.gender;
            }

            if (!userInfo.birthday && authUser.user.user_metadata?.birth_date) {
              updates.birthday = authUser.user.user_metadata.birth_date;
            }

            if (!userInfo.username && authUser.user.user_metadata?.first_name && authUser.user.user_metadata?.last_name) {
              const firstInitial = authUser.user.user_metadata.first_name.charAt(0).toUpperCase();
              const lastInitial = authUser.user.user_metadata.last_name.charAt(0).toUpperCase();
              updates.username = `${firstInitial}${lastInitial}`;
            }
            
            if (Object.keys(updates).length > 0) {
              setUserInfo(prev => ({
                ...prev,
                ...updates
              }));
            }
          }
        } catch (error) {
          console.error('Error syncing user data:', error);
        }
      }
    };

    syncUserData();
  }, [user, userInfo.phone_number, userInfo.gender, userInfo.birthday, userInfo.username, setUserInfo]);

  const handleInputChange = async (field: keyof ProfileSettingsData, value: string | boolean) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value
    }));

    if (field === 'phone_number' || field === 'email') {
      return;
    }

    if (field === 'username' && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return;
    }

    if ((field === 'first_name' || field === 'last_name') && user) {
      try {
        const { error: metadataError } = await supabase.auth.updateUser({
          data: {
            [field]: value
          }
        });

        if (!metadataError) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ [field]: value })
            .eq('auth_user_id', user.id);
        }
      } catch (error) {
        console.error(`Error syncing ${field}:`, error);
      }
    }

    if (onSave) {
      try {
        const success = await onSave({ [field]: value });
        if (!success) {
          setUserInfo((prev) => ({
            ...prev,
            [field]: prev[field]
          }));
        }
      } catch (error) {
        console.error('Error saving field:', error);
      }
    }
  };

  const handleSave = async () => {
    if (onSave) {
      try {
        await onSave(userInfo);
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Header Section with Current Time */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/20 rounded-xl p-4 shadow-sm border border-primary/20">
        <h2 className="text-xl font-bold text-primary mb-3">Cilësimet e Përgjithshme</h2>
        <div className="space-y-2 text-sm">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 shadow-sm">
            <span className="font-medium text-gray-700">Koha Lokale:</span>
            <p className="text-gray-900">{currentTime.toLocaleString('sq-AL')}</p>
          </div>
          {userInfo?.timezone && (
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 shadow-sm">
              <span className="font-medium text-gray-700">Koha në {userInfo.timezone}:</span>
              <p className="text-gray-900">{formatInTimeZone(currentTime, userInfo.timezone, 'yyyy-MM-dd HH:mm:ss zzz')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200/50">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
          <User className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-800">Informacioni Personal</h3>
        </div>
        
        {/* Username */}
        <div className="mb-4">
          <Label htmlFor="username" className="text-sm font-medium text-gray-700 mb-2 block">
            Emri i Përdoruesit
          </Label>
          <Input
            id="username"
            type="text"
            value={userInfo?.username || ''}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className="w-full h-12"
            placeholder="Shkruani emrin e përdoruesit"
          />
        </div>

        {/* Email with Change Button */}
        <div className="mb-4">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
            Email-i
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="email"
              type="email"
              value={userInfo?.email || ''}
              readOnly
              className="flex-1 bg-gray-50 h-12"
              placeholder="Adresa e email-it"
            />
            <Button
              type="button"
              onClick={() => setIsChangeEmailDialogOpen(true)}
              variant="outline"
              className="px-3 py-2 h-12 bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 font-medium"
            >
              Ndrysho
            </Button>
          </div>
        </div>

        {/* Birthday */}
        <div className="mb-4">
          <Label htmlFor="birthday" className="text-sm font-medium text-gray-700 mb-2 block">
            Ditëlindja
          </Label>
          <Input
            id="birthday"
            type="date"
            value={userInfo?.birthday || ''}
            onChange={(e) => handleInputChange('birthday', e.target.value)}
            className="w-full h-12"
          />
        </div>

        {/* Gender */}
        <div className="mb-4">
          <Label htmlFor="gender" className="text-sm font-medium text-gray-700 mb-2 block">
            Gjinia
          </Label>
          <Select
            value={userInfo?.gender || ''}
            onValueChange={(value) => handleInputChange('gender', value)}
          >
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Zgjidhni gjininë" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-lg border border-gray-200">
              <SelectItem value="male">Mashkull</SelectItem>
              <SelectItem value="female">Femër</SelectItem>
              <SelectItem value="other">Tjetër</SelectItem>
              <SelectItem value="prefer_not_to_say">Preferon të mos e thom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Language */}
        <div className="mb-0">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Gjuha
          </Label>
          <Select
            value={userInfo?.language || ''}
            onValueChange={(value) => handleInputChange('language', value)}
          >
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Zgjidhni gjuhën" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-lg border border-gray-200">
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200/50">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
          <Lock className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-800">Siguria</h3>
        </div>

        {/* Authentication Options - 2FA */}
        <div className="mb-0">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Vërtetimi me Dy Faktorë (2FA)
          </Label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-50 rounded-md p-3 text-sm text-gray-600">
              {userInfo?.two_factor_method === 'google' ? (
                <div className="flex items-center gap-2">
                  <svg viewBox="-3 0 262 262" version="1.1" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                    <path d="M255.878,133.451 C255.878,122.717 255.007,114.884 253.122,106.761 L130.55,106.761 L130.55,155.209 L202.497,155.209 C201.047,167.249 193.214,185.381 175.807,197.565 L175.563,199.187 L214.318,229.21 L217.003,229.478 C241.662,206.704 255.878,173.196 255.878,133.451" fill="#4285F4" />
                    <path d="M130.55,261.1 C165.798,261.1 195.389,249.495 217.003,229.478 L175.807,197.565 C164.783,205.253 149.987,210.62 130.55,210.62 C96.027,210.62 66.726,187.847 56.281,156.37 L54.75,156.5 L14.452,187.687 L13.925,189.152 C35.393,231.798 79.49,261.1 130.55,261.1" fill="#34A853" />
                    <path d="M56.281,156.37 C53.525,148.247 51.93,139.543 51.93,130.55 C51.93,121.556 53.525,112.853 56.136,104.73 L56.063,103 L15.26,71.312 L13.925,71.947 C5.077,89.644 0,109.517 0,130.55 C0,151.583 5.077,171.455 13.925,189.152 L56.281,156.37" fill="#FBBC05" />
                    <path d="M130.55,50.479 C155.064,50.479 171.6,61.068 181.029,69.917 L217.873,33.943 C195.245,12.91 165.798,0 130.55,0 C79.49,0 35.393,29.301 13.925,71.947 L56.136,104.73 C66.726,73.253 96.027,50.479 130.55,50.479" fill="#EB4335" />
                  </svg>
                  <span className="text-green-700 font-medium">Google Authenticator i aktivizuar</span>
                </div>
              ) : userInfo?.two_factor_method === 'email' ? (
                <span className="text-blue-700 font-medium">Vërtetim me email i aktivizuar</span>
              ) : (
                <span className="text-gray-600">2FA nuk është aktivizuar</span>
              )}
            </div>
            <Button
              type="button"
              onClick={() => setIsTwoFactorDialogOpen(true)}
              variant="outline"
              className="px-3 py-2 h-12 bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 font-medium"
            >
              Konfiguro
            </Button>
          </div>
        </div>
      </div>

      {/* Contact & Location Section */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200/50">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
          <Phone className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-800">Kontakti & Vendndodhja</h3>
        </div>

        {/* Phone with Change Button */}
        <div className="mb-4">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Numri i Telefonit
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="tel"
              value={userInfo?.phone_number || ''}
              readOnly
              className="flex-1 bg-gray-50 h-12"
              placeholder="Numri i telefonit"
            />
            <Button
              type="button"
              onClick={() => setIsChangePhoneDialogOpen(true)}
              variant="outline"
              className="px-3 py-2 h-12 bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 font-medium"
            >
              Ndrysho
            </Button>
          </div>
        </div>

        {/* First Name with Change Button */}
        <div className="mb-4">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Emri
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={userInfo?.first_name || ''}
              readOnly
              className="flex-1 bg-gray-50 h-12"
              placeholder="Emri i parë"
            />
            <Button
              type="button"
              onClick={() => setIsChangeNameDialogOpen(true)}
              variant="outline"
              className="px-3 py-2 h-12 bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 font-medium"
            >
              Ndrysho
            </Button>
          </div>
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Mbiemri
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={userInfo?.last_name || ''}
              readOnly
              className="flex-1 bg-gray-50 h-12"
              placeholder="Mbiemri"
            />
            <Button
              type="button"
              onClick={() => setIsChangeNameDialogOpen(true)}
              variant="outline"
              className="px-3 py-2 h-12 bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 font-medium"
            >
              Ndrysho
            </Button>
          </div>
        </div>

        {/* Country */}
        <div className="mb-4">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Shteti
          </Label>
          <MobileCountrySelect
            value={userInfo?.country || ''}
            onValueChange={(value) => handleInputChange('country', value)}
            placeholder="Zgjidhni shtetin ku jetoni"
          />
        </div>

        {/* Timezone */}
        <div className="mb-0">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Zona Kohore
          </Label>
          <MobileTimezoneSelect
            value={userInfo?.timezone || ''}
            onValueChange={(value) => handleInputChange('timezone', value)}
            placeholder="Zgjidhni zonën kohore"
          />
        </div>
      </div>

      {/* Relationship Status Section */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200/50">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
          <Heart className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-800">Statusi i Marrëdhënies</h3>
        </div>
        
        <div className="mb-0">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Marrëdhënia
          </Label>
          <Select
            value={userInfo?.relationship_status || ''}
            onValueChange={(value) => handleInputChange('relationship_status', value)}
          >
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Zgjidhni statusin e marrëdhënies" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-lg border border-gray-200">
              <SelectItem value="None">Asnjë</SelectItem>
              <SelectItem value="Single">Beqar/e</SelectItem>
              <SelectItem value="In a relationship">Në një marrëdhënie</SelectItem>
              <SelectItem value="Engaged">I/E fejuar</SelectItem>
              <SelectItem value="Married">I/E martuar</SelectItem>
              <SelectItem value="Complicated">Është e komplikuar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center pt-4 pb-8">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Duke ruajtur...
            </>
          ) : (
            'Ruaj Ndryshimet'
          )}
        </Button>
      </div>

      {/* Dialog Components */}
      <PhoneNumberPopup
        isOpen={isPhonePopupOpen}
        onOpenChange={setIsPhonePopupOpen}
        onPhoneAdded={async (newPhoneNumber) => {
          await refreshUserVerificationData();
          console.log('Phone number added:', newPhoneNumber);
        }}
      />

      <ChangePhoneNumberDialog
        isOpen={isChangePhoneDialogOpen}
        onOpenChange={setIsChangePhoneDialogOpen}
        currentPhoneNumber={userInfo?.phone_number || ''}
        onPhoneChanged={async (newPhoneNumber) => {
          await refreshUserVerificationData();
          console.log('Phone number changed to:', newPhoneNumber);
        }}
      />

      <EnhancedEmailSetupDialog
        isOpen={isChangeEmailDialogOpen}
        onOpenChange={setIsChangeEmailDialogOpen}
        currentEmail={userInfo?.email || ''}
        onEmailChanged={async (newEmail) => {
          await refreshUserVerificationData();
          console.log('Email changed to:', newEmail);
        }}
      />

      <ChangeNameDialog
        isOpen={isChangeNameDialogOpen}
        onOpenChange={setIsChangeNameDialogOpen}
        currentFirstName={userInfo?.first_name || ''}
        currentLastName={userInfo?.last_name || ''}
        onNameChanged={async (firstName, lastName) => {
          await refreshUserVerificationData();
          console.log('Name changed to:', firstName, lastName);
        }}
      />

      <MobileTwoFactorDialog
        isOpen={isTwoFactorDialogOpen}
        onOpenChange={setIsTwoFactorDialogOpen}
        currentMethod={userInfo?.two_factor_method || 'email'}
        onMethodChanged={(method) => {
          handleInputChange('two_factor_method', method);
          console.log('2FA method changed to:', method);
        }}
      />
    </div>
  );
};

export default MobileGeneralSettingsForm;