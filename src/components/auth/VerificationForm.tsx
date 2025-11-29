
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { RegistrationService } from '@/services/registrationService';
import { emailVerificationService } from '@/services/emailVerificationService';

const FORM_STORAGE_KEY = 'registrationFormData';

const VerificationForm = () => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Get verification data with better error handling
  const getVerificationData = () => {
    try {
      const verificationType = localStorage.getItem('verificationType');
      const verificationEmail = localStorage.getItem('verificationEmail');
      const verificationPhone = localStorage.getItem('verificationPhone');
      const tempEmailUserData = localStorage.getItem('tempEmailUserData');
      
      console.log('📋 SIMPLIFIED VERIFICATION FORM: Retrieved verification data', {
        verificationType,
        verificationEmail,
        verificationPhone,
        hasTempEmailData: !!tempEmailUserData,
        timestamp: new Date().toISOString()
      });
      
      return {
        verificationType,
        verificationEmail,
        verificationPhone,
        tempEmailUserData,
        contactInfo: verificationType === 'email' ? verificationEmail : verificationPhone
      };
    } catch (error) {
      console.error('❌ SIMPLIFIED VERIFICATION FORM: Error reading localStorage:', error);
      return { verificationType: null, verificationEmail: null, verificationPhone: null, tempEmailUserData: null, contactInfo: null };
    }
  };

  const { verificationType, verificationEmail, verificationPhone, tempEmailUserData, contactInfo } = getVerificationData();

  // Clear saved form data when verification is successful
  const clearSavedFormData = () => {
    try {
      localStorage.removeItem(FORM_STORAGE_KEY);
      console.log('🗑️ SIMPLIFIED VERIFICATION FORM: Cleared saved registration form data after successful verification');
    } catch (error) {
      console.error('❌ SIMPLIFIED VERIFICATION FORM: Failed to clear saved form data:', error);
    }
  };

  useEffect(() => {
    console.log('🚀 SIMPLIFIED VERIFICATION FORM: Component mounted, checking verification state');
    
    // Enhanced validation for pending verification
    const hasEmailVerification = verificationType === 'email' && verificationEmail && tempEmailUserData;
    const hasPhoneVerification = verificationType === 'phone' && verificationPhone;
    
    console.log('📊 SIMPLIFIED VERIFICATION FORM: Validation check', {
      verificationType,
      verificationEmail,
      verificationPhone,
      hasTempEmailData: !!tempEmailUserData,
      hasEmailVerification,
      hasPhoneVerification
    });
    
    if (!hasEmailVerification && !hasPhoneVerification) {
      console.log('❌ SIMPLIFIED VERIFICATION FORM: No valid pending verification found');
      console.log('📊 SIMPLIFIED VERIFICATION FORM: Verification data:', { 
        verificationType, 
        verificationEmail, 
        verificationPhone, 
        tempEmailUserData: !!tempEmailUserData 
      });
      
      // Show a more helpful message and redirect back to registration
      toast.error('Nuk ka verifikim në pritje. Ju lutem plotësoni regjistrimin përsëri.');
      
      // Delay navigation to let user see the message
      setTimeout(() => {
        navigate('/auth/register');
      }, 2000);
      return;
    }

    console.log('✅ SIMPLIFIED VERIFICATION FORM: Valid verification session found:', { 
      verificationType, 
      contactInfo,
      hasEmailData: !!tempEmailUserData
    });

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [verificationType, contactInfo, navigate, verificationEmail, verificationPhone, tempEmailUserData]);

  const handleVerify = async () => {
    const verifyId = `verify_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    
    console.log(`🔐 [${verifyId}] SIMPLIFIED VERIFICATION FORM: Starting verification process`);
    
    if (!verificationCode.trim()) {
      console.log(`❌ [${verifyId}] Empty verification code`);
      toast.error('Ju lutemi vendosni kodin e verifikimit');
      return;
    }

    if (verificationCode.length !== 6) {
      console.log(`❌ [${verifyId}] Invalid code length: ${verificationCode.length}`);
      toast.error('Kodi i verifikimit duhet të jetë 6 shifra');
      return;
    }

    setIsVerifying(true);

    try {
      console.log(`🔐 [${verifyId}] SIMPLIFIED VERIFICATION FORM: Processing verification`, { 
        verificationType, 
        contactInfo, 
        code: verificationCode
      });

      if (verificationType === 'email' && verificationEmail) {
        console.log(`📧 [${verifyId}] SIMPLIFIED VERIFICATION FORM: Verifying email code...`);
        const result = await RegistrationService.verifyEmailRegistration(verificationEmail, verificationCode);

        console.log(`📨 [${verifyId}] SIMPLIFIED VERIFICATION FORM: Email verification result`, {
          success: result.success,
          error: result.error,
          hasSession: !!result.session
        });

        if (result.success) {
          // Clear all verification data and saved form data immediately
          localStorage.removeItem('verificationType');
          localStorage.removeItem('verificationEmail');
          localStorage.removeItem('verificationPhone');
          localStorage.removeItem('tempEmailUserData');
          clearSavedFormData();
          
          console.log(`✅ [${verifyId}] SIMPLIFIED VERIFICATION FORM: Email verification successful, navigating to home`);
          toast.success('Llogaria u verifikua me sukses! Mirë se erdhe në Shqipet!');
          
          // Navigate directly to home page without any delay
          navigate('/', { replace: true });
        } else {
          console.error(`❌ [${verifyId}] SIMPLIFIED VERIFICATION FORM: Email verification failed:`, result.error);
          toast.error(result.error || 'Verifikimi dështoi. Ju lutemi provoni përsëri.');
        }
      } else if (verificationType === 'phone' && verificationPhone) {
        console.log(`🔐 [${verifyId}] SIMPLIFIED VERIFICATION FORM: Verifying phone registration code`);
        const result = await RegistrationService.verifyPhoneRegistration(verificationPhone, verificationCode);

        console.log(`📱 [${verifyId}] SIMPLIFIED VERIFICATION FORM: Phone verification result`, {
          success: result.success,
          error: result.error,
          hasSession: !!result.session
        });

        if (result.success) {
          localStorage.removeItem('verificationType');
          localStorage.removeItem('verificationEmail');
          localStorage.removeItem('verificationPhone');
          localStorage.removeItem('tempEmailUserData');
          clearSavedFormData();
          
          console.log(`✅ [${verifyId}] SIMPLIFIED VERIFICATION FORM: Phone verification successful`);
          toast.success('Llogaria u verifikua me sukses! Mirë se erdhe në Shqipet!');
          navigate('/', { replace: true });
        } else {
          console.error(`❌ [${verifyId}] SIMPLIFIED VERIFICATION FORM: Phone verification failed:`, result.error);
          toast.error(result.error || 'Verifikimi dështoi');
        }
      } else {
        console.error(`❌ [${verifyId}] SIMPLIFIED VERIFICATION FORM: Invalid verification type`);
        throw new Error('Lloji i verifikimit i pavlefshëm');
      }
    } catch (error: any) {
      console.error(`❌ [${verifyId}] SIMPLIFIED VERIFICATION FORM: Verification error:`, error);
      toast.error('Verifikimi dështoi. Ju lutemi provoni përsëri.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    const resendId = `resend_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    
    if (!canResend || isResending) {
      console.log(`🚫 [${resendId}] SIMPLIFIED VERIFICATION FORM: Resend blocked - canResend: ${canResend}, isResending: ${isResending}`);
      return;
    }

    console.log(`🔄 [${resendId}] SIMPLIFIED VERIFICATION FORM: Starting resend process`);
    setIsResending(true);

    try {
      if (verificationType === 'email' && verificationEmail) {
        console.log(`📧 [${resendId}] SIMPLIFIED VERIFICATION FORM: Resending email verification`);
        
        const tempData = localStorage.getItem('tempEmailUserData');
        if (tempData) {
          const userData = JSON.parse(tempData);
          
          const newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
          console.log(`🔢 [${resendId}] SIMPLIFIED VERIFICATION FORM: Generated new code:`, newVerificationCode);
          
          const updatedUserData = {
            ...userData,
            verificationCode: newVerificationCode,
            verificationExpiry: Date.now() + 15 * 60 * 1000
          };
          
          localStorage.setItem('tempEmailUserData', JSON.stringify(updatedUserData));
          
          console.log(`📧 [${resendId}] SIMPLIFIED VERIFICATION FORM: Sending new verification email directly`);
          const result = await emailVerificationService.sendVerificationEmail(
            verificationEmail,
            userData.firstName || 'Përdorues',
            userData.lastName || '',
            newVerificationCode
          );

          console.log(`📨 [${resendId}] SIMPLIFIED VERIFICATION FORM: Resend email result`, {
            success: result.success,
            error: result.error,
            debug: result.debug
          });

          if (result.success) {
            toast.success('Kodi i ri i verifikimit u dërgua në emailin tuaj!');
            setCountdown(60);
            setCanResend(false);
            setVerificationCode(''); // Clear the current input
            console.log(`✅ [${resendId}] SIMPLIFIED VERIFICATION FORM: Email resent successfully`);
          } else {
            console.error(`❌ [${resendId}] SIMPLIFIED VERIFICATION FORM: Email resend failed:`, result.error);
            toast.error(result.error || 'Dështoi dërgimi i kodit të verifikimit. Ju lutemi provoni përsëri.');
          }
        } else {
          console.error(`❌ [${resendId}] SIMPLIFIED VERIFICATION FORM: No temp email data found`);
          toast.error('Sesioni i verifikimit ka skaduar. Ju lutemi regjistrohuni përsëri.');
          navigate('/auth/register');
        }
      } else if (verificationType === 'phone' && verificationPhone) {
        console.log(`📱 [${resendId}] SIMPLIFIED VERIFICATION FORM: Resending phone verification`);
        
        const result = await RegistrationService.initiatePhoneRegistration({
          phoneNumber: verificationPhone,
          firstName: 'Përdorues',
          lastName: ''
        });

        console.log(`📱 [${resendId}] SIMPLIFIED VERIFICATION FORM: Phone resend result`, {
          success: result.success,
          error: result.error
        });

        if (result.success) {
          toast.success('Kodi i ri i verifikimit u dërgua në telefonin tuaj!');
          setCountdown(60);
          setCanResend(false);
          setVerificationCode(''); // Clear the current input
          console.log(`✅ [${resendId}] SIMPLIFIED VERIFICATION FORM: Phone code resent successfully`);
        } else {
          console.error(`❌ [${resendId}] SIMPLIFIED VERIFICATION FORM: Phone resend failed:`, result.error);
          toast.error(result.error || 'Dështoi dërgimi i kodit të verifikimit');
        }
      }
    } catch (error: any) {
      console.error(`❌ [${resendId}] SIMPLIFIED VERIFICATION FORM: Resend error:`, error);
      toast.error('Dështoi dërgimi i kodit të verifikimit');
    } finally {
      setIsResending(false);
    }
  };

  // Show loading state while checking verification data
  if (!contactInfo) {
    console.log('⏳ SIMPLIFIED VERIFICATION FORM: Showing loading state - no contact info');
    return (
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Duke kontrolluar verifikimin...</h1>
          <p className="text-gray-600 text-sm">Ju lutem prisni një moment</p>
        </div>
      </div>
    );
  }

  console.log('🎨 SIMPLIFIED VERIFICATION FORM: Rendering form for:', { verificationType, contactInfo });

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-red-500 mb-2">Verifikoni Llogarinë Tuaj</h1>
        <p className="text-gray-600 text-sm">
          Kemi dërguar një kod verifikimi në {verificationType === 'email' ? 'emailin' : 'telefonin'} tuaj
        </p>
        <p className="text-gray-500 text-sm mt-1">{contactInfo}</p>
        <p className="text-xs text-blue-600 mt-2">
          Kontrolloni {verificationType === 'email' ? 'kutinë e emailit tuaj (duke përfshirë dosjen e spam-it)' : 'mesazhet e telefonit tuaj'}
        </p>
      </div>
      
      <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} className="space-y-4" data-allow-submit="true">
        <div>
          <label className="block text-sm text-gray-600 mb-3 font-medium">Kodi i Verifikimit</label>
          <Input 
            type="text" 
            placeholder="000000"
            className="w-full px-4 py-6 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500 text-center text-4xl font-black tracking-[0.5em] font-mono bg-gray-50 hover:bg-white transition-all duration-200" 
            value={verificationCode} 
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            required 
            autoComplete="one-time-code"
            style={{
              letterSpacing: '0.5em',
              textIndent: '0.25em'
            }}
          />
          <p className="text-xs text-gray-500 mt-2 text-center">
            Vendosni kodin 6-shifror që u dërgua në {verificationType === 'email' ? 'emailin' : 'telefonin'} tuaj
          </p>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-red-400 hover:bg-red-500 text-white py-3 px-4 rounded-lg font-medium transition-colors text-base" 
          disabled={isVerifying || verificationCode.length !== 6}
        >
          {isVerifying ? "Duke Verifikuar..." : "Verifikoni Llogarinë"}
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 mb-2">Nuk e morët kodin?</p>
          <Button
            type="button"
            variant="link"
            onClick={handleResendCode}
            disabled={!canResend || isResending}
            className="text-red-500 hover:text-red-600 font-medium text-sm p-0"
          >
            {isResending ? 'Duke Dërguar...' : canResend ? 'Ridërgo Kodin' : `Ridërgo për ${countdown}s`}
          </Button>
        </div>
        
        <div className="text-center mt-4">
          <Button
            type="button"
            variant="link"
            onClick={() => navigate('/auth/register')}
            className="text-gray-500 hover:text-gray-600 text-sm p-0"
          >
            Kthehu tek Regjistrimi
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VerificationForm;
