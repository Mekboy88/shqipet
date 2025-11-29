import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import OTPInput from '@/components/auth/verification/OTPInput';
import ResendCodeButton from '@/components/auth/verification/ResendCodeButton';
import { RegistrationService } from '@/services/registrationService';
import { EmailVerificationService } from '@/services/emailVerificationService';
// import { useAuth } from '@/contexts/AuthContext'; // Not needed for session-based auth

interface EmailRegistrationFlowProps {
  email: string;
  firstName: string;
  lastName: string;
  onBack: () => void;
}

const EmailRegistrationFlow = ({ email, firstName, lastName, onBack }: EmailRegistrationFlowProps) => {
  const navigate = useNavigate();
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleVerifyCode = async (codeParam?: string) => {
    const codeToUse = (codeParam ?? otpCode).replace(/\D/g, '').slice(0, 6);
    if (codeToUse.length !== 6) {
      // Guard: only show this toast when actually missing 6 digits
      toast.error('Ju lutemi shkruani kodin 6-shifror');
      return;
    }

    setIsVerifying(true);
    try {
      console.log('🔐 Verifying email registration code:', { email, code: codeToUse });

      const result = await RegistrationService.verifyEmailRegistration(email, codeToUse);

      if (result.success) {
        toast.success('Regjistrimi u krye me sukses! Mirë se vini!');
        // Clear any stored verification data
        localStorage.removeItem('verificationEmail');
        localStorage.removeItem('verificationType');
        localStorage.removeItem('tempEmailUserData');
        localStorage.removeItem('isNewUser');
        // Go directly to home
        navigate('/');
      } else {
        toast.error(result.error || 'Kodi i verifikimit është i gabuar');
      }
    } catch (error: any) {
      console.error('Email verification error:', error);
      toast.error(error.message || 'Gabim në verifikimin e kodit');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      console.log('📧 Resending verification email to:', email);
      
      // Get stored user data to resend with same info
      const tempData = localStorage.getItem('tempEmailUserData');
      if (!tempData) {
        toast.error('Ju lutemi filloni regjistrimin përsëri');
        onBack();
        return;
      }

      const userData = JSON.parse(tempData);
      
      // Generate new verification code
      const newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Update stored data with new code and expiry
      const updatedUserData = {
        ...userData,
        verificationCode: newVerificationCode,
        verificationExpiry: Date.now() + 15 * 60 * 1000 // 15 minutes
      };
      
      localStorage.setItem('tempEmailUserData', JSON.stringify(updatedUserData));

      const emailResult = await EmailVerificationService.sendVerificationEmail(
        email,
        firstName,
        lastName,
        newVerificationCode
      );

      if (emailResult.success) {
        toast.success('Kodi i ri u dërgua në emailin tuaj!');
        setTimeLeft(60);
        setCanResend(false);
        setOtpCode(''); // Clear current input
      } else {
        toast.error(emailResult.error || 'Gabim në dërgimin e kodit të ri');
      }
    } catch (error: any) {
      console.error('Resend error:', error);
      toast.error('Gabim në dërgimin e kodit të ri');
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (value: string) => {
    const sanitized = value.replace(/\D/g, '').slice(0, 6);
    setOtpCode(sanitized);
    // Auto-verify when 6 digits are entered
    if (sanitized.length === 6) {
      handleVerifyCode(sanitized);
    }
  };
  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <Mail className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-red-500 mb-2">Verifikoni Emailin</h1>
        <p className="text-gray-600 text-sm">
          Kemi dërguar një kod verifikimi në<br />
          <span className="font-medium text-gray-800">{email}</span>
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            Shkruani kodin 6-shifror
          </label>
          <OTPInput
            value={otpCode}
            onChange={handleOtpChange}
            disabled={isVerifying}
          />
        </div>

        <Button
          onClick={() => handleVerifyCode(otpCode)}
          disabled={otpCode.length !== 6 || isVerifying}
           className="w-full bg-red-400 hover:bg-red-500 text-white py-3 px-4 rounded-lg font-medium transition-colors text-base"
        >
          {isVerifying ? 'Duke verifikuar...' : 'Verifikoni'}
        </Button>

        <ResendCodeButton
          canResend={canResend}
          isLocked={isResending}
          timeLeft={timeLeft}
          onResend={handleResendCode}
        />

        <div className="flex items-center justify-center space-x-2 pt-4">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500">
            Kodi skadon pas 15 minutash
          </span>
        </div>

        <div className="text-center">
          <Button
            variant="link"
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 font-medium text-sm flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kthehu tek regjistrimi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailRegistrationFlow;