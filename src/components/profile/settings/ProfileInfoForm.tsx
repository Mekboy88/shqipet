import React, { useEffect, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import { toast } from 'sonner';
import { PersonalIntroductionCard } from '@/components/profile/PersonalIntroductionCard';
import GenderSelection from '@/components/auth/register/GenderSelection';
import OTPEmailDialog from './OTPEmailDialog';
import OTPPhoneDialog from './OTPPhoneDialog';
import { Phone, Mail, Globe, Info, Calendar, Clock, Shield, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import AdminRoleBadge from '@/components/admin/factory/AdminRoleBadge';
import { useUniversalUser } from '@/hooks/useUniversalUser';

const ProfileInfoForm: React.FC = () => {
  const { user, userRole } = useAuth();
  const { userInfo, setUserInfo, saveSettings } = useProfileSettings();
  const { role: universalRole } = useUniversalUser(user?.id);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);

  // Local DOB parts state (DD, MM, YYYY)
  const [dob, setDob] = useState<{ day: string; month: string; year: string }>({ day: '', month: '', year: '' });
  // Sync local DOB from userInfo (supports both date_of_birth and legacy birthday)
  useEffect(() => {
    const src = (userInfo as any).date_of_birth || (userInfo as any).birthday;
    if (!src) return;

    const setFromParts = (y: string, m: string, d: string) =>
      setDob({ day: d.padStart(2, '0'), month: m.padStart(2, '0'), year: y.padStart(4, '0') });

    if (typeof src === 'string') {
      // Expecting YYYY-MM-DD from DB; avoid Date() to prevent timezone shifts
      const m = src.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (m) {
        setFromParts(m[1], m[2], m[3]);
        return;
      }
    }
    // Fallback for Date objects or other formats
    try {
      const d = new Date(src as any);
      if (!isNaN(d.getTime())) {
        setFromParts(String(d.getFullYear()), String(d.getMonth() + 1), String(d.getDate()));
      }
    } catch {}
  }, [(userInfo as any).date_of_birth, (userInfo as any).birthday]);

  // Fetch DOB from DB if not present in userInfo - SEPARATE from gender loading
  useEffect(() => {
    if (!user || (userInfo as any).date_of_birth || (userInfo as any).birthday) return;
    (async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('date_of_birth')
        .eq('id', user.id)
        .maybeSingle();
      if (!error && data?.date_of_birth) {
        const val = data.date_of_birth as string;
        setUserInfo((prev: any) => ({ ...prev, date_of_birth: val, birthday: val }));
      }
    })();
  }, [user?.id, setUserInfo]);

  // Ensure first and last name are populated and persisted
  useEffect(() => {
    if (!user) return;
    const meta: any = (user as any)?.user_metadata || {};
    const missingFirst = !userInfo?.first_name || userInfo.first_name.trim() === '';
    const missingLast = !userInfo?.last_name || userInfo.last_name.trim() === '';
    if (!missingFirst && !missingLast) return;

    const first = userInfo?.first_name || meta.first_name || '';
    const last = userInfo?.last_name || meta.last_name || '';

    // Update UI immediately
    setUserInfo((prev: any) => ({ ...prev, first_name: first, last_name: last }));

    // Persist to database (own row allowed by RLS)
    (async () => {
      try {
        await supabase
          .from('profiles')
          .upsert({ id: user.id, first_name: first, last_name: last, updated_at: new Date().toISOString() }, { onConflict: 'id' });
      } catch (e) {
        console.warn('Name upsert failed:', e);
      }
    })();
  }, [user?.id]);


  // Debounced auto-save function for real-time updates
  const debouncedSave = useCallback(
    (() => {
      let timeoutId: ReturnType<typeof setTimeout>;
      return (field: string, value: any) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          try {
             const fieldMapping: Record<string, string> = {
               username: 'username',
               first_name: 'first_name', 
               last_name: 'last_name',
               location: 'location',
               school: 'school',
               birthday: 'date_of_birth',
               city_location: 'city_location',
               email: 'email',
               phone_number: 'phone_number',
               gender: 'gender'
             };
            
            const dbField = fieldMapping[field] || field;
            console.log(`🔄 Auto-saving field "${field}" with value "${value}" to "${dbField}"`);
            
            // For location and school, also set visibility to public so they show up
            const updateData: any = { [dbField]: value };
            if (field === 'location') {
              updateData.location_visibility = 'public';
            }
            if (field === 'school') {
              updateData.school_visibility = 'public';
            }
            
            await saveSettings(updateData);
            console.log(`✅ Successfully saved field "${field}"`);
          } catch (error) {
            console.error('❌ Error auto-saving field:', field, error);
          }
        }, 500); // 500ms delay for debouncing
      };
    })(),
    [saveSettings]
  );

  // Handle real-time input changes with auto-save
  const handleInputChange = useCallback((field: string, value: any) => {
    // Update local state immediately for responsive UI
    setUserInfo(prev => ({ ...prev, [field]: value }));
    
            // Auto-save for critical fields and profile info fields
            if (['username', 'first_name', 'last_name', 'location', 'school', 'birthday', 'city_location', 'email', 'phone_number', 'gender'].includes(field)) {
              debouncedSave(field, value);
            }
  }, [setUserInfo, debouncedSave]);

  const smokeFocusStyles = "focus:ring-1 focus:ring-gray-300/50 focus:border-gray-400 focus:shadow-sm focus:shadow-gray-200/50 focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-300/50 focus-visible:ring-offset-0";

  const handleEmailUpdated = (email: string, verified: boolean) => {
    setUserInfo((prev: any) => ({ ...prev, email, email_verified: verified }));
  };

  const handlePhoneUpdated = (phone: string, verified: boolean) => {
    setUserInfo((prev: any) => ({ ...prev, phone_number: phone, phone_verified: verified }));
  };

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) return email;
    return localPart.charAt(0) + '••••' + '@' + domain;
  };

  const maskPhone = (phone: string) => {
    if (phone.length <= 4) return phone;
    return phone.slice(0, 3) + ' •••• ' + phone.slice(-4);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Personal Information Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-3">
              <svg fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xmlSpace="preserve" className="h-5 w-5 text-primary">
                <g>
                  <g>
                    <path d="M20.494,25.218c0-2.852-2.312-5.164-5.164-5.164h-1.333c-0.692,0-1.253-0.561-1.253-1.253 c0-0.257,0.104-0.503,0.287-0.683c0.775-0.756,1.427-1.77,1.899-2.862c0.096,0.071,0.199,0.122,0.315,0.122 c0.749,0,1.628-1.654,1.628-2.782s-0.104-2.042-0.854-2.042c-0.088,0-0.183,0.015-0.278,0.039 c-0.053-3.058-0.826-6.873-5.495-6.873c-4.872,0-5.441,3.808-5.495,6.863c-0.068-0.013-0.138-0.028-0.201-0.028 c-0.749,0-0.853,0.914-0.853,2.042s0.879,2.782,1.628,2.782c0.092,0,0.178-0.026,0.258-0.072c0.47,1.075,1.114,2.07,1.878,2.813 c0.184,0.18,0.287,0.426,0.287,0.683c0,0.692-0.561,1.253-1.253,1.253H5.164C2.312,20.054,0,22.366,0,25.218v1.432 c0,0.9,0.73,1.631,1.631,1.631h17.232c0.902,0,1.632-0.73,1.632-1.631L20.494,25.218L20.494,25.218z"></path>
                    <path d="M16.34,5.886c0.417,0.923,0.715,2.059,0.84,3.465c0.309,0.19,0.539,0.498,0.729,0.869h12.883 C31.459,10.22,32,9.679,32,9.012V7.095c0-0.667-0.541-1.208-1.208-1.208L16.34,5.886L16.34,5.886z"></path>
                    <path d="M15.857,16.784c-0.034,0.063-0.075,0.119-0.11,0.183v1.147h15.045c0.667,0,1.208-0.541,1.208-1.207V14.99 c0-0.667-0.541-1.208-1.208-1.208H18.204C17.863,15.073,17.02,16.423,15.857,16.784z"></path>
                    <path d="M21.994,25.218v0.794h8.798c0.667,0,1.208-0.541,1.208-1.208v-1.917c0-0.667-0.541-1.208-1.208-1.208h-9.825 C21.613,22.704,21.994,23.915,21.994,25.218z"></path>
                  </g>
                </g>
              </svg>
              <h3 className="text-xl font-semibold text-gray-800">
                Personal Information
              </h3>
            </div>
            
            <div className="mb-6">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700 mb-2 block">
                Username
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  value={
                    userInfo.username || 
                    (userInfo.first_name && userInfo.last_name 
                      ? `@${userInfo.first_name.toLowerCase()}${userInfo.last_name.toLowerCase()}`
                      : userInfo.email 
                        ? `@${userInfo.email.split('@')[0]}`
                        : user?.email 
                          ? `@${user.email.split('@')[0]}`
                          : '@username'
                    )
                  }
                  onChange={e => {
                    let value = e.target.value;
                    // Ensure @ prefix is always present
                    if (!value.startsWith('@')) {
                      value = '@' + value;
                    }
                    handleInputChange('username', value);
                  }}
                  className={`w-full transition-all duration-200 hover:shadow-md ${smokeFocusStyles}`}
                  placeholder="@username"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-2 block">
                First name
              </Label>
              <Input
                id="firstName"
                value={userInfo.first_name || ''}
                onChange={e => handleInputChange('first_name', e.target.value)}
                className={`w-full transition-all duration-200 hover:shadow-md ${smokeFocusStyles}`}
                placeholder="Enter your first name"
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-2 block">
                Last name
              </Label>
              <Input
                id="lastName"
                value={userInfo.last_name || ''}
                onChange={e => handleInputChange('last_name', e.target.value)}
                className={`w-full transition-all duration-200 hover:shadow-md ${smokeFocusStyles}`}
                placeholder="Enter your last name"
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="dob-day" className="text-sm font-medium text-gray-700 mb-2 block">
                Date of Birth
              </Label>
               <div className="grid grid-cols-3 gap-3">
                <Input
                  id="dob-day"
                  placeholder="DD"
                  value={dob.day}
                  readOnly
                  tabIndex={-1}
                  className="text-sm bg-gray-50 cursor-default pointer-events-none select-none focus:ring-0 focus:outline-none focus:border-transparent focus-visible:ring-0 focus-visible:outline-none"
                  inputMode="numeric"
                  maxLength={2}
                />
                <Input
                  id="dob-month"
                  placeholder="MM"
                  value={dob.month}
                  readOnly
                  tabIndex={-1}
                  className="text-sm bg-gray-50 cursor-default pointer-events-none select-none focus:ring-0 focus:outline-none focus:border-transparent focus-visible:ring-0 focus-visible:outline-none"
                  inputMode="numeric"
                  maxLength={2}
                />
                <Input
                  id="dob-year"
                  placeholder="YYYY"
                  value={dob.year}
                  readOnly
                  tabIndex={-1}
                  className="text-sm bg-gray-50 cursor-default pointer-events-none select-none focus:ring-0 focus:outline-none focus:border-transparent focus-visible:ring-0 focus-visible:outline-none"
                  inputMode="numeric"
                  maxLength={4}
                />
              </div>
            </div>

            {/* Contact Platform Note for Date of Birth Changes */}
            <div className="mb-6">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Need to Update Date of Birth?
              </Label>
              <Button
                variant="ghost"
                className="flex-1 p-4 bg-gradient-to-r from-red-500/10 to-gray-800/10 rounded-xl border border-red-200"
                onClick={() => {
                  console.log('Contact platform button clicked - popup will be implemented later');
                  // TODO: Implement popup/modal functionality
                }}
              >
                Kontaktoni platformën për ndryshim
              </Button>
            </div>

          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Contact Information Card */}
          <Card className="shadow-lg border border-gray-200/50">
            <CardHeader className="border-b border-gray-200 pb-4">
              <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                <svg fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 32.666 32.666" xmlSpace="preserve" className="h-5 w-5 text-primary">
                  <g>
                    <path d="M28.189,16.504h-1.666c0-5.437-4.422-9.858-9.856-9.858l-0.001-1.664C23.021,4.979,28.189,10.149,28.189,16.504z M16.666,7.856L16.665,9.52c3.853,0,6.983,3.133,6.981,6.983l1.666-0.001C25.312,11.735,21.436,7.856,16.666,7.856z M16.333,0 C7.326,0,0,7.326,0,16.334c0,9.006,7.326,16.332,16.333,16.332c0.557,0,1.007-0.45,1.007-1.006c0-0.559-0.45-1.01-1.007-1.01 c-7.896,0-14.318-6.424-14.318-14.316c0-7.896,6.422-14.319,14.318-14.319c7.896,0,14.317,6.424,14.317,14.319 c0,3.299-1.756,6.568-4.269,7.954c-0.913,0.502-1.903,0.751-2.959,0.761c0.634-0.377,1.183-0.887,1.591-1.529 c0.08-0.121,0.186-0.228,0.238-0.359c0.328-0.789,0.357-1.684,0.555-2.518c0.243-1.064-4.658-3.143-5.084-1.814 c-0.154,0.492-0.39,2.048-0.699,2.458c-0.275,0.366-0.953,0.192-1.377-0.168c-1.117-0.952-2.364-2.351-3.458-3.457l0.002-0.001 c-0.028-0.029-0.062-0.061-0.092-0.092c-0.031-0.029-0.062-0.062-0.093-0.092v0.002c-1.106-1.096-2.506-2.34-3.457-3.459 c-0.36-0.424-0.534-1.102-0.168-1.377c0.41-0.311,1.966-0.543,2.458-0.699c1.326-0.424-0.75-5.328-1.816-5.084 c-0.832,0.195-1.727,0.227-2.516,0.553c-0.134,0.057-0.238,0.16-0.359,0.24c-2.799,1.774-3.16,6.082-0.428,9.292 c1.041,1.228,2.127,2.416,3.245,3.576l-0.006,0.004c0.031,0.031,0.063,0.06,0.095,0.09c0.03,0.031,0.059,0.062,0.088,0.095 l0.006-0.006c1.16,1.118,2.535,2.765,4.769,4.255c4.703,3.141,8.312,2.264,10.438,1.098c3.67-2.021,5.312-6.338,5.312-9.719 C32.666,7.326,25.339,0,16.333,0z"></path>
                  </g>
                </svg>
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Email Section */}
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900">
                      {userInfo.email ? maskEmail(userInfo.email) : 'Not set'}
                    </span>
                    {userInfo.email && (
                      <VerificationBadge 
                        isVerified={userInfo.email_verified ?? false} 
                        isPending={userInfo.otp_email_pending}
                      />
                    )}
                  </div>
                </div>
                {userInfo.otp_email_pending && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
                    <div className="flex items-center justify-between">
                      <span>Verification pending</span>
                      <Button
                        onClick={() => setEmailDialogOpen(true)}
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs text-amber-700 hover:text-amber-800"
                      >
                        Finish verification
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Phone Section */}
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900">
                      {userInfo.phone_number ? maskPhone(userInfo.phone_number) : 'Not set'}
                    </span>
                    {userInfo.phone_number && (
                      <VerificationBadge 
                        isVerified={userInfo.phone_verified ?? false} 
                        isPending={userInfo.otp_phone_pending}
                      />
                    )}
                  </div>
                </div>
                {userInfo.otp_phone_pending && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
                    <div className="flex items-center justify-between">
                      <span>Verification pending</span>
                      <Button
                        onClick={() => setPhoneDialogOpen(true)}
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs text-amber-700 hover:text-amber-800"
                      >
                        Finish verification
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    onClick={() => setEmailDialogOpen(true)}
                    variant="outline"
                    size="sm"
                    className="bg-primary/5 hover:bg-primary/10 text-primary border-primary/30"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    {userInfo.email ? 'Change Email' : 'Add Email'}
                  </Button>
                  <Button
                    onClick={() => setPhoneDialogOpen(true)}
                    variant="outline"
                    size="sm"
                    className="bg-primary/5 hover:bg-primary/10 text-primary border-primary/30"
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    {userInfo.phone_number ? 'Change Phone' : 'Add Phone'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Status Overview */}
          <Card className="shadow-lg border border-gray-200/50">
            <CardHeader className="border-b border-gray-200 pb-4">
              <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="currentColor" className="h-5 w-5 text-primary">
                  <title>check-verified</title>
                  <desc>Created with sketchtool.</desc>
                  <g id="web-app" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="check-verified" fill="currentColor">
                      <path d="M4.25203497,14 L4,14 C2.8954305,14 2,13.1045695 2,12 C2,10.8954305 2.8954305,10 4,10 L4.25203497,10 C4.44096432,9.26595802 4.73145639,8.57268879 5.10763818,7.9360653 L4.92893219,7.75735931 C4.1478836,6.97631073 4.1478836,5.70998077 4.92893219,4.92893219 C5.70998077,4.1478836 6.97631073,4.1478836 7.75735931,4.92893219 L7.9360653,5.10763818 C8.57268879,4.73145639 9.26595802,4.44096432 10,4.25203497 L10,4 C10,2.8954305 10.8954305,2 12,2 C13.1045695,2 14,2.8954305 14,4 L14,4.25203497 C14.734042,4.44096432 15.4273112,4.73145639 16.0639347,5.10763818 L16.2426407,4.92893219 C17.0236893,4.1478836 18.2900192,4.1478836 19.0710678,4.92893219 C19.8521164,5.70998077 19.8521164,6.97631073 19.0710678,7.75735931 L18.8923618,7.9360653 C19.2685436,8.57268879 19.5590357,9.26595802 19.747965,10 L20,10 C21.1045695,10 22,10.8954305 22,12 C22,13.1045695 21.1045695,14 20,14 L19.747965,14 C19.5590357,14.734042 19.2685436,15.4273112 18.8923618,16.0639347 L19.0710678,16.2426407 C19.8521164,17.0236893 19.8521164,18.2900192 19.0710678,19.0710678 C18.2900192,19.8521164 17.0236893,19.8521164 16.2426407,19.0710678 L16.0639347,18.8923618 C15.4273112,19.2685436 14.734042,19.5590357 14,19.747965 L14,20 C14,21.1045695 13.1045695,22 12,22 C10.8954305,22 10,21.1045695 10,20 L10,19.747965 C9.26595802,19.5590357 8.57268879,19.2685436 7.9360653,18.8923618 L7.75735931,19.0710678 C6.97631073,19.8521164 5.70998077,19.8521164 4.92893219,19.0710678 C4.1478836,18.2900192 4.1478836,17.0236893 4.92893219,16.2426407 L5.10763818,16.0639347 C4.73145639,15.4273112 4.44096432,14.734042 4.25203497,14 Z M9,10 L7,12 L11,16 L17,10 L15,8 L11,12 L9,10 Z" id="Shape"></path>
                    </g>
                  </g>
                </svg>
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Account Status
                </div>
                <div className="flex items-center gap-2">
                  {(() => {
                    const status = userInfo.account_status || 'active';
                    const statusLower = status.toLowerCase();
                    
                    const getStatusDisplay = (status: string) => {
                      switch (status) {
                        case 'active': return { text: 'Active', class: 'bg-green-50 text-green-700 border-green-200' };
                        case 'suspended': return { text: 'Suspended', class: 'bg-red-50 text-red-700 border-red-200' };
                        case 'deactivated': return { text: 'Deactivated', class: 'bg-gray-50 text-gray-700 border-gray-200' };
                        case 'pending': return { text: 'Pending Verification', class: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
                        case 'banned': return { text: 'Banned', class: 'bg-red-50 text-red-700 border-red-200' };
                        case 'locked': return { text: 'Locked', class: 'bg-orange-50 text-orange-700 border-orange-200' };
                        default: return { text: 'Active', class: 'bg-green-50 text-green-700 border-green-200' };
                      }
                    };

                    const statusDisplay = getStatusDisplay(statusLower);

                    return (
                      <div className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 border ${statusDisplay.class}`}>
                        {statusDisplay.text}
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Role</div>
                <div className="flex items-center gap-2">
                  {(() => {
                    const displayRole = universalRole || userRole || userInfo.role || 'user';
                    return <AdminRoleBadge role={displayRole} />;
                  })()}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Account Created
                </div>
                <div className="text-gray-900">
                  {(() => {
                    const created = (userInfo as any).created_at || user?.created_at;
                    return created ? format(new Date(created), 'MMMM dd, yyyy \'at\' h:mm a') : 'Unknown';
                  })()}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Last Login
                </div>
                <div className="text-gray-900">
                  {(() => {
                    const last = (userInfo as any).last_sign_in_at || (userInfo as any).last_login || (user as any)?.last_sign_in_at;
                    return last ? format(new Date(last), 'MMMM dd, yyyy \'at\' h:mm a') : 'Unknown';
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Personal Introduction Card */}
      <div className="mt-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">
            Personal Introduction
          </h3>
          <PersonalIntroductionCard />
        </div>
      </div>

      {/* OTP Dialogs */}
      <OTPEmailDialog
        isOpen={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        currentEmail={userInfo.email || ''}
        onEmailUpdated={handleEmailUpdated}
      />

      <OTPPhoneDialog
        isOpen={phoneDialogOpen}
        onOpenChange={setPhoneDialogOpen}
        currentPhone={userInfo.phone_number || ''}
        onPhoneUpdated={handlePhoneUpdated}
      />
    </div>
  );
};

// Verification Badge Component
const VerificationBadge: React.FC<{ isVerified?: boolean; isPending?: boolean }> = ({ 
  isVerified, 
  isPending 
}) => {
  if (isPending) {
    return (
      <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
        Pending
      </Badge>
    );
  }
  
  if (isVerified) {
    return (
      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
        Verified
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
      Not verified
    </Badge>
  );
};

export default ProfileInfoForm;
