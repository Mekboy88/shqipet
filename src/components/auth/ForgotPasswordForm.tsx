// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ArrowLeft, Shield, Smartphone, User } from 'lucide-react';
import supabase from '@/lib/relaxedSupabase';
import { useLanguage } from '@/contexts/LanguageContext';
import OTPInput from './verification/OTPInput';

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [contact, setContact] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentStep, setCurrentStep] = useState<'email' | 'code' | 'password' | 'success'>('email');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [verificationToken, setVerificationToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contactError, setContactError] = useState('');

  const checkUserExists = async () => {
    // Clear previous error
    setContactError('');
    
    if (!contact) {
      setContactError('Ju lutemi shkruani adresën tuaj të emailit ose numrin e telefonit');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+[1-9]\d{0,3})?[-.\s]?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/;
    
    const isEmail = emailRegex.test(contact);
    const isPhone = phoneRegex.test(contact);
    
    if (!isEmail && !isPhone) {
      setContactError('Ju lutemi shkruani një adresë emaili ose numër telefoni të vlefshëm');
      return;
    }

    setIsLoading(true);
    try {
      let profileData = null;
      
      if (isEmail) {
        // Check by email
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, phone_number, profile_image_url, auth_user_id')
          .eq('email', contact.toLowerCase().trim())
          .single();
          
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        profileData = data;
      } else {
        // Check by phone number
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, phone_number, profile_image_url, auth_user_id')
          .eq('phone_number', contact.trim())
          .single();
          
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        profileData = data;
      }

      if (!profileData) {
        setContactError('Nuk u gjet asnjë llogari me këtë email ose numër telefoni');
        return;
      }

      // Set user data
      setUserData({
        id: profileData.id,
        email: profileData.email || contact,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        profileImage: profileData.profile_image_url
      });

      // Don't automatically send verification code, let user see their info first
    } catch (error: any) {
      console.error('Error checking user:', error);
      setContactError('Nuk u gjet asnjë llogari me këtë email ose numër telefoni');
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationCode = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Attempting to send verification code to:', userData?.email || contact);
      console.log('🔄 Supabase URL:', 'https://rvwopaofedyieydwbghs.supabase.co');
      
      // Make direct fetch call to ensure proper request handling
      const response = await fetch('https://rvwopaofedyieydwbghs.supabase.co/functions/v1/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d29wYW9mZWR5aWV5ZHdiZ2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDYzNDMsImV4cCI6MjA2NDYyMjM0M30.WpJtBt49SJanUECQbIbnMmZWzTmZm5e9UhjiCylAlLc`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d29wYW9mZWR5aWV5ZHdiZ2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDYzNDMsImV4cCI6MjA2NDYyMjM0M30.WpJtBt49SJanUECQbIbnMmZWzTmZm5e9UhjiCylAlLc',
          'x-client-info': 'supabase-js-web/2.50.0'
        },
        body: JSON.stringify({ action: 'send_code', contact: contact })
      });

      const data = await response.json();
      console.log('📨 Response from password-reset function:', data);

      if (!response.ok) {
        console.error('❌ HTTP error:', response.status, data);
        toast.error(data?.error || 'Gabim në dërgimin e kodit');
        return;
      }

      if (data && data.success) {
        console.log('✅ Verification code sent successfully');
        setCurrentStep('code');
        toast.success('Kodi i verifikimit u dërgua në emailin tuaj me sukses!');
      } else {
        const errorMessage = data?.error || 'Gabim i panjohur në dërgimin e kodit';
        console.error('❌ Function returned error:', errorMessage);
        toast.error(`Gabim: ${errorMessage}`);
      }
    } catch (error: any) {
      console.error('❌ Network/parsing error:', error);
      toast.error(`Gabim rrjeti: ${error.message || 'Gabim në lidhjen me serverin'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code) {
      toast.error('Ju lutemi shkruani kodin e verifikimit');
      return;
    }

    console.log('🔍 Starting verification with code:', code, 'and email:', userData?.email || contact);
    setIsLoading(true);
    try {
      console.log('📤 Calling password-reset function for verification...');
      
      // Use direct fetch call like sendVerificationCode for consistency
      const response = await fetch('https://rvwopaofedyieydwbghs.supabase.co/functions/v1/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d29wYW9mZWR5aWV5ZHdiZ2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDYzNDMsImV4cCI6MjA2NDYyMjM0M30.WpJtBt49SJanUECQbIbnMmZWzTmZm5e9UhjiCylAlLc`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d29wYW9mZWR5aWV5ZHdiZ2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDYzNDMsImV4cCI6MjA2NDYyMjM0M30.WpJtBt49SJanUECQbIbnMmZWzTmZm5e9UhjiCylAlLc',
          'x-client-info': 'supabase-js-web/2.50.0'
        },
        body: JSON.stringify({ action: 'verify_code', contact: contact, code })
      });

      const data = await response.json();
      console.log('📨 Verification response:', data);

      if (!response.ok) {
        console.error('❌ HTTP error:', response.status, data);
        toast.error(data?.error || 'Gabim në verifikimin e kodit');
        return;
      }

      if (data && data.success) {
        console.log('✅ Code verified successfully, token:', data.token);
        setVerificationToken(data.token);
        setCurrentStep('password');
        toast.success('Kodi u verifikua me sukses');
      } else {
        console.error('❌ Verification failed:', data);
        toast.error(data?.error || 'Kodi i verifikimit është i gabuar');
      }
    } catch (error: any) {
      console.error('❌ Verification error:', error);
      const errorMessage = error?.message || 'Gabim në verifikimin e kodit';
      toast.error(`Gabim rrjeti: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error('Ju lutemi plotësoni të gjitha fushat');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Fjalëkalimet nuk përputhen');
      return;
    }

    if (password.length < 12) {
      toast.error('Fjalëkalimi duhet të jetë së paku 12 karaktere');
      return;
    }

    console.log('🔒 Starting password reset with token:', verificationToken);
    setIsLoading(true);
    try {
      console.log('📤 Calling password-reset function for password reset...');
      
      // Use direct fetch call for consistency
      const response = await fetch('https://rvwopaofedyieydwbghs.supabase.co/functions/v1/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d29wYW9mZWR5aWV5ZHdiZ2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDYzNDMsImV4cCI6MjA2NDYyMjM0M30.WpJtBt49SJanUECQbIbnMmZWzTmZm5e9UhjiCylAlLc',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d29wYW9mZWR5aWV5ZHdiZ2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDYzNDMsImV4cCI6MjA2NDYyMjM0M30.WpJtBt49SJanUECQbIbnMmZWzTmZm5e9UhjiCylAlLc',
          'x-client-info': 'supabase-js-web/2.50.0'
        },
        body: JSON.stringify({ action: 'reset_password', token: verificationToken, password })
      });

      const data = await response.json();
      console.log('📨 Password reset response:', data);

      if (!response.ok) {
        console.error('❌ HTTP error:', response.status, data);
        toast.error(data?.error || 'Gabim në ndryshimin e fjalëkalimit');
        return;
      }

      if (data && data.success) {
        console.log('✅ Password reset successfully');
        setCurrentStep('success');
        toast.success('Fjalëkalimi u ndryshua me sukses!');
      } else {
        console.error('❌ Password reset failed:', data);
        toast.error(data?.error || 'Gabim në ndryshimin e fjalëkalimit');
      }
    } catch (error: any) {
      console.error('❌ Password reset error:', error);
      const errorMessage = error?.message || 'Gabim në ndryshimin e fjalëkalimit';
      toast.error(`Gabim rrjeti: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <>
      {/* Icon positioned outside container for maximum upward movement */}
      {userData && (
        <div className="flex justify-center mb-8 -mt-32">
          <img 
            src="/lovable-uploads/9f72c58c-e224-49e8-93ac-4ca10cd39e01.png" 
            alt="Email verification icon"
            className="w-48 h-48"
          />
        </div>
      )}
      
      <div className="mb-8">
        {!userData ? (
          <>
            <h1 className="text-3xl font-bold text-red-500 mb-2">Gjeni llogarinë tuaj</h1>
            <p className="text-gray-600">
              Ju lutemi shkruani adresën tuaj të emailit ose numrin e telefonit për të kërkuar llogarinë tuaj.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-red-500 mb-2">Konfirmoni llogarinë tuaj</h1>
            <p className="text-gray-600">
              Ju lutemi konfirmoni nëse kjo është llogaria juaj dhe kërkoni kodin e verifikimit për të rivendosur fjalëkalimin.
            </p>
          </>
        )}
      </div>


      {/* Show user avatar when email is verified */}
      {userData && (
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-green-400 shadow-lg">
              {userData.profileImage ? (
                <img 
                  src={userData.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-gray-500" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {userData && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="font-medium text-green-900 mb-1">
            {userData.firstName} {userData.lastName}
          </p>
          <p className="text-sm text-green-700">{userData.email}</p>
          <p className="text-xs text-green-600 mt-2">✓ Llogaria u gjet me sukses</p>
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresa e emailit ose numri i telefonit
          </label>
          <Input
            type="text"
            placeholder="email@example.com ose +355-XX-XXX-XXXX"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${contactError ? 'border-red-500' : userData ? 'border-green-500' : 'border-gray-300'}`}
            value={contact}
            onChange={(e) => {
              setContact(e.target.value);
              if (contactError) setContactError(''); // Clear error when user types
              if (userData) setUserData(null); // Clear user data when typing new contact
            }}
            autoComplete="email"
            disabled={isLoading}
          />
          {contactError && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <span className="mr-2">⚠️</span>
              {contactError}
            </p>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/')}
            className="px-6 py-3"
            disabled={isLoading}
          >
            Anulo
          </Button>
          {!userData ? (
            <Button 
              type="button" 
              onClick={checkUserExists}
              className="bg-red-400 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Po kontrollon...' : 'Gjej llogarinë'}
            </Button>
          ) : (
            <Button 
              type="button" 
              onClick={() => sendVerificationCode()}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Po dërgon...' : 'Dërgo kodin'}
            </Button>
          )}
        </div>
      </div>

    </>
  );

  const renderCodeStep = () => (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-red-500 mb-2">Verifikoni kodin</h1>
        <p className="text-gray-600">
          Ne dërguam një kod verifikimi në <strong>{contact}</strong>. 
          Ju lutemi shkruani kodin për të vazhduar.
        </p>
      </div>

      {userData && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {userData.profileImage ? (
                <img 
                  src={userData.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-gray-500" />
              )}
            </div>
            <div>
              <p className="font-medium text-green-900">
                {userData.firstName} {userData.lastName}
              </p>
              <p className="text-sm text-green-700">{userData.email}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
            Kodi i verifikimit
          </label>
          <OTPInput
            value={code}
            onChange={setCode}
            disabled={isLoading}
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setCurrentStep('email')}
            className="px-6 py-3"
            disabled={isLoading}
          >
            Mbrapa
          </Button>
          <Button 
            type="button" 
            onClick={verifyCode}
            className="bg-red-400 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Po verifikon...' : 'Verifiko kodin'}
          </Button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Button
          type="button"
          variant="link"
          onClick={sendVerificationCode}
          disabled={isLoading}
          className="text-red-500 hover:text-red-600"
        >
          Dërgo kodin përsëri
        </Button>
      </div>
    </>
  );

  const renderPasswordStep = () => (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-red-500 mb-2">Ndryshoni fjalëkalimin</h1>
        <p className="text-gray-600">
          Shkruani fjalëkalimin tuaj të ri për llogarinë.
        </p>
      </div>

      {userData && (
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-red-100">
            {userData.profileImage ? (
              <img 
                src={userData.profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-gray-500" />
            )}
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fjalëkalimi i ri
          </label>
          <Input
            type="password"
            placeholder="Shkruani fjalëkalimin e ri"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Konfirmoni fjalëkalimin
          </label>
          <Input
            type="password"
            placeholder="Shkruani përsëri fjalëkalimin e ri"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setCurrentStep('code')}
            className="px-6 py-3"
            disabled={isLoading}
          >
            Mbrapa
          </Button>
          <Button 
            type="button" 
            onClick={resetPassword}
            className="bg-red-400 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Po ndryshohet...' : 'Ndrysho fjalëkalimin'}
          </Button>
        </div>
      </div>
    </>
  );

  const renderSuccessStep = () => (
    <div className="space-y-6 animate-fade-in text-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-500 mb-2">Fjalëkalimi u ndryshua!</h1>
        <p className="text-gray-600">
          Fjalëkalimi juaj u ndryshua me sukses. Tani duhet të identifikoheni përsëri me fjalëkalimin e ri.
        </p>
      </div>

      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-green-900 mb-1">Siguria e llogarisë</h3>
            <p className="text-sm text-green-700 mb-2">
              Për siguri shtesë, konsideroni:
            </p>
            <ul className="text-xs text-green-600 space-y-1">
              <li>• Shtimi i numrit të telefonit në profil</li>
              <li>• Aktivizimi i verifikimit me dy faktorë</li>
              <li>• Përdorimi i një fjalëkalimi të fortë dhe unik</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <Button 
          type="button"
          className="flex items-center space-x-2 w-full justify-center py-3 bg-red-400 hover:bg-red-500"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} />
          <span>Shkoni tek Identifikimi</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto px-8">
      {currentStep === 'email' && renderEmailStep()}
      {currentStep === 'code' && renderCodeStep()}
      {currentStep === 'password' && renderPasswordStep()}
      {currentStep === 'success' && renderSuccessStep()}
    </div>
  );
};

export default ForgotPasswordForm;
