
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { RegistrationService } from '@/services/registrationService';

export const useVerificationForm = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState('email');
  const [contactInfo, setContactInfo] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Component tracking for debugging
  const componentId = useRef(`comp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`);
  const initializationAttempts = useRef(0);

  // Single initialization effect - NO OTP GENERATION HERE
  useEffect(() => {
    const performInitialization = async () => {
      initializationAttempts.current += 1;
      const currentAttempt = initializationAttempts.current;
      
      console.log(`🚀 Verification Init Attempt ${currentAttempt} - Component: ${componentId.current}`);
      
      // Prevent multiple initialization attempts
      if (isInitialized) {
        console.log('✅ Already initialized, skipping');
        return;
      }

      // Prevent too many initialization attempts
      if (currentAttempt > 1) {
        console.log(`🚫 Too many initialization attempts (${currentAttempt}), skipping`);
        return;
      }

      const verificationType = localStorage.getItem('verificationType') || 'email';
      const verificationEmail = localStorage.getItem('verificationEmail') || '';
      const verificationPhone = localStorage.getItem('verificationPhone') || '';
      
      setVerificationMethod(verificationType);
      const contact = verificationType === 'phone' ? verificationPhone : verificationEmail;
      setContactInfo(contact);
      
      console.log(`📋 Verification Setup - Type: ${verificationType}, Contact: ${contact}`);
      console.log('⚠️ OTP already sent during registration - ready for verification');
      
      // Start countdown timer since OTP was already sent during registration
      setTimeLeft(60);
      setCanResend(false);
      
      setIsInitialized(true);
      console.log(`✅ Verification initialization complete - Component: ${componentId.current}`);
    };

    // Add a small delay to prevent race conditions
    const timer = setTimeout(performInitialization, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, []); // Empty dependency array - only run once on mount

  // Countdown timer for resend code
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(numericValue);
  };

  const handleResend = async () => {
    if (!canResend || isGenerating || !contactInfo) return;
    
    console.log(`🔄 Resending OTP to: ${contactInfo} - Component: ${componentId.current}`);
    setIsGenerating(true);
    
    try {
      if (verificationMethod === 'phone') {
        // Get user data from localStorage to resend OTP
        const tempUserData = localStorage.getItem('tempUserData');
        if (tempUserData) {
          const userData = JSON.parse(tempUserData);
          
          // Use RegistrationService to resend phone OTP
          const result = await RegistrationService.initiatePhoneRegistration({
            phoneNumber: contactInfo,
            firstName: userData.firstName,
            lastName: userData.lastName,
            additionalData: userData
          });
          
          if (result.success) {
            setTimeLeft(60);
            setCanResend(false);
            setOtp(''); // Clear current OTP when resending
            toast.success('Verification code resent to your phone');
            console.log('✅ Phone OTP resent successfully');
          } else {
            toast.error(result.error || 'Failed to resend code');
            console.error('❌ Phone OTP resend failed:', result.error);
          }
        } else {
          toast.error('Registration data not found. Please start registration again.');
        }
      } else {
        toast.error('Email resend not implemented yet');
      }
    } catch (error: any) {
      toast.error('Failed to resend code');
      console.error('❌ Resend error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all OTP fields are filled
    if (otp.length < 6) {
      toast.error('Please enter the complete 6-digit verification code');
      return;
    }
    
    console.log(`🔐 Verifying OTP: ${otp} for contact: ${contactInfo} - Component: ${componentId.current}`);
    setIsVerifying(true);
    
    try {
      if (verificationMethod === 'phone') {
        // Use the RegistrationService for phone verification
        const result = await RegistrationService.verifyPhoneRegistration(contactInfo, otp);
        
        if (result.success && result.session) {
          toast.success('Phone verification successful!');
          
          // Clear verification data from localStorage
          localStorage.removeItem('verificationEmail');
          localStorage.removeItem('verificationPhone');
          localStorage.removeItem('verificationType');
          localStorage.removeItem('tempUserData');
          localStorage.removeItem('isNewUser');
          
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          toast.error(result.error || 'Invalid verification code');
        }
      } else {
        // Email verification not implemented yet
        toast.error('Email verification not implemented yet');
      }
    } catch (error: any) {
      console.error('❌ Verification error:', error);
      toast.error('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return {
    otp,
    timeLeft,
    canResend,
    verificationMethod,
    contactInfo,
    isVerifying,
    isGenerating,
    handleOtpChange,
    handleResend,
    handleSubmit,
    formatTime
  };
};
