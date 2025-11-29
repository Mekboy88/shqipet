
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { RegistrationService } from '@/services/registrationService';
import { useNavigate } from 'react-router-dom';
import OTPInput from '@/components/auth/verification/OTPInput';

interface PhoneRegistrationFlowProps {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  gender: 'male' | 'female' | '';
  onBack: () => void;
}

const PhoneRegistrationFlow: React.FC<PhoneRegistrationFlowProps> = ({
  phoneNumber,
  firstName,
  lastName,
  birthDay,
  birthMonth,
  birthYear,
  gender,
  onBack
}) => {
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  // Timer for resend functionality
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Helper function to create a valid birth date
  const createValidBirthDate = (day: string, month: string, year: string): string | null => {
    if (!day || !month || !year || day === '' || month === '' || year === '') {
      return null;
    }
    
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900 || yearNum > new Date().getFullYear()) {
      return null;
    }
    
    const formattedDate = `${yearNum}-${monthNum.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
    
    const testDate = new Date(formattedDate);
    if (isNaN(testDate.getTime())) {
      return null;
    }
    
    return formattedDate;
  };

  // Helper function to generate username from initials
  const generateUsername = (firstName: string, lastName: string): string => {
    const firstInitial = firstName.trim().charAt(0).toUpperCase();
    const lastInitial = lastName.trim().charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  const handleSendOTP = async () => {
    setIsLoading(true);
    try {
      const validBirthDate = createValidBirthDate(birthDay, birthMonth, birthYear);
      const generatedUsername = generateUsername(firstName, lastName);
      
      const result = await RegistrationService.initiatePhoneRegistration({
        phoneNumber,
        firstName,
        lastName,
        additionalData: {
          birth_date: validBirthDate,
          gender,
          username: generatedUsername,
          registration_method: 'phone_otp_only'
        }
      });

      if (result.success && result.requiresVerification) {
        setOtpSent(true);
        setResendTimer(60);
        toast.success('Kodi i verifikimit është dërguar në numrin tuaj të telefonit!');
      } else {
        toast.error(result.error || 'Gabim në dërgimin e kodit të verifikimit');
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast.error('Gabim në dërgimin e kodit të verifikimit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const sanitized = otpCode.replace(/\D/g, '');
    if (!sanitized || sanitized.length !== 6) {
      toast.error('Ju lutemi shkruani një kod 6-shifror të vlefshëm');
      return;
    }

    setIsLoading(true);
    try {
      const result = await RegistrationService.verifyPhoneRegistration(phoneNumber, sanitized);
      
      if (result.success) {
        toast.success('Regjistrimi u krye me sukses!');
        localStorage.removeItem('isNewUser');
        navigate('/');
      } else {
        toast.error(result.error || 'Kodi i verifikimit është i gabuar');
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast.error('Gabim në verifikimin e kodit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) {
      toast.error(`Ju lutemi prisni ${resendTimer} sekonda para se të kërkoni një kod të ri.`);
      return;
    }
    await handleSendOTP();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-red-500 mb-2">Verifikoni numrin e telefonit</h2>
        <p className="text-gray-600 text-sm">
          Do t'ju dërgojmë një kod verifikimi në: <strong>{phoneNumber}</strong>
        </p>
      </div>

      {!otpSent ? (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium text-black mb-2">Kontrolli i numrit</h3>
            <p className="text-sm text-gray-700">
              Numri juaj i telefonit do të kontrollohët për verifikim. Ju do të merrni një mesazh me kod 6-shifror që duhet të shkruani këtu.
            </p>
          </div>
          
          <Button 
            onClick={handleSendOTP}
            disabled={isLoading}
            className="w-full bg-red-400 hover:bg-red-500 text-white py-3 px-4 rounded-lg font-medium transition-colors text-base"
          >
            {isLoading ? 'Duke dërguar...' : 'Dërgo kodin e verifikimit'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onBack}
            className="w-full"
          >
            Kthehu prapa
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center text-sm text-green-600 bg-green-50 p-3 rounded-lg">
            Kodi i verifikimit është dërguar në numrin tuaj të telefonit
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shkruani kodin e verifikimit
            </label>
            <OTPInput
              value={otpCode}
              onChange={(v) => setOtpCode(v.replace(/\D/g, ''))}
              disabled={isLoading}
            />
          </div>
          
          <Button 
            onClick={handleVerifyOTP}
            disabled={isLoading || otpCode.length !== 6}
            className="w-full bg-red-400 hover:bg-red-500 text-white py-3 px-4 rounded-lg font-medium transition-colors text-base"
          >
            {isLoading ? 'Duke verifikuar...' : 'Verifikoni kodin'}
          </Button>
          
          {resendTimer > 0 ? (
            <div className="text-center text-sm text-gray-500">
              Mund të kërkoni një kod të ri pas {resendTimer} sekondash
            </div>
          ) : (
            <div className="text-center">
              <Button
                variant="link"
                onClick={handleResendOTP}
                disabled={isLoading}
                className="text-red-500 hover:text-red-600"
              >
                {isLoading ? 'Duke dërguar...' : 'Dërgo kodin përsëri'}
              </Button>
            </div>
          )}
          
          <Button 
            variant="outline" 
            onClick={onBack}
            className="w-full"
          >
            Kthehu prapa
          </Button>
        </div>
      )}
    </div>
  );
};

export default PhoneRegistrationFlow;
