import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { emailVerificationService } from '@/services/emailVerificationService';
import { Eye, EyeOff, Shield, Mail, Phone, Check, X, Loader2 } from 'lucide-react';

interface EnhancedEmailSetupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentEmail: string;
  onEmailChanged: (email: string) => void;
}

type Step = 'email' | 'otp' | 'password' | 'success';

const EnhancedEmailSetupDialog: React.FC<EnhancedEmailSetupDialogProps> = ({
  isOpen,
  onOpenChange,
  currentEmail,
  onEmailChanged
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('email');
  const [newEmail, setNewEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sentOtp, setSentOtp] = useState('');
  
  // Email validation states
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Real-time email validation (similar to registration page)
  useEffect(() => {
    const checkEmailAvailability = async () => {
      if (!newEmail.trim() || newEmail.length < 5) {
        setEmailError('');
        setIsEmailValid(false);
        setIsCheckingEmail(false);
        return;
      }

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmail)) {
        setEmailError('Format i gabuar i email adresës');
        setIsEmailValid(false);
        setIsCheckingEmail(false);
        return;
      }

      // Check if same as current email
      if (newEmail === currentEmail) {
        setEmailError('Email i ri duhet të jetë i ndryshëm nga ai aktual');
        setIsEmailValid(false);
        setIsCheckingEmail(false);
        return;
      }

      setIsCheckingEmail(true);
      setEmailError('');

      try {
        const duplicateCheck = await emailVerificationService.checkEmailExists(newEmail);

        if (duplicateCheck.exists) {
          setEmailError('Ky email ekziston tashmë në një llogari tjetër');
          setIsEmailValid(false);
        } else {
          setEmailError('');
          setIsEmailValid(true);
        }
      } catch (error) {
        console.error('Error checking email:', error);
        setEmailError('');
        setIsEmailValid(false);
      } finally {
        setIsCheckingEmail(false);
      }
    };

    const timeoutId = setTimeout(checkEmailAvailability, 500); // Debounce 500ms
    return () => clearTimeout(timeoutId);
  }, [newEmail, currentEmail]);

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleEmailSubmit = async () => {
    if (!newEmail.trim()) {
      toast.error('Ju lutemi shkruani email adresën');
      return;
    }

    if (!isEmailValid) {
      toast.error('Ju lutemi zgjidhni problemet me email adresën');
      return;
    }

    setIsLoading(true);
    
    try {
      // Show immediate feedback
      toast.info('Duke kontrolluar email adresën...');
      
      const duplicateCheck = await emailVerificationService.checkEmailExists(newEmail);
      
      if (duplicateCheck.exists) {
        toast.error('Ky email ekziston në një llogari tjetër. Ju lutemi përdorni një email tjetër.');
        setIsLoading(false);
        return;
      }

      // Show sending feedback
      toast.info('Duke dërguar kodin e verifikimit...');
      
      const otp = generateOTP();
      setSentOtp(otp);
      
      console.log('🔍 About to send email with OTP:', otp, 'to:', newEmail);
      
      const emailResult = await emailVerificationService.sendVerificationEmail(
        newEmail,
        user?.user_metadata?.first_name || 'User',
        user?.user_metadata?.last_name || '',
        otp,
        true
      );

      console.log('📧 Email service result:', emailResult);

      if (!emailResult.success) {
        console.error('❌ Email sending failed:', emailResult.error);
        toast.error(`Gabim në dërgimin e kodit: ${emailResult.error || 'Provoni përsëri.'}`);
        setIsLoading(false);
        return;
      }

      console.log('✅ Email sent successfully, proceeding to OTP step');
      setStep('otp');
      toast.success('Kodi i verifikimit u dërgua me sukses!', {
        description: 'Kontrolloni email tuaj dhe dosjen SPAM/JUNK. Emails mund të vonohen deri në 2 minuta.'
      });
      
    } catch (error) {
      console.error('💥 Unexpected error in email sending:', error);
      toast.error('Gabim i papritur në dërgimin e kodit. Ju lutemi provoni përsëri.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otpCode.trim()) {
      toast.error('Ju lutemi shkruani kodin e verifikimit');
      return;
    }

    if (otpCode.trim() !== sentOtp) {
      toast.error('Kodi i verifikimit është i gabuar.');
      return;
    }

    setStep('password');
    toast.success('Email u verifikua me sukses! Tani krijoni një fjalëkalim.');
  };

  const handlePasswordSubmit = async () => {
    if (!password || !confirmPassword) {
      toast.error('Ju lutemi plotësoni të dy fushat e fjalëkalimit');
      return;
    }

    if (password.length < 12) {
      toast.error('Fjalëkalimi duhet të ketë të paktën 12 karaktere');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Fjalëkalimet nuk përputhen');
      return;
    }

    setIsLoading(true);

    try {
      // Update email in auth and profiles with improved error handling
      console.log('🔄 Updating email verification for user:', user?.id, 'email:', newEmail);
      
      let updateSuccess = false;
      
      // Try direct HTTP call first (more reliable)
      try {
        const response = await fetch(`https://rvwopaofedyieydwbghs.supabase.co/functions/v1/update-email-verification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d29wYW9mZWR5aWV5ZHdiZ2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDYzNDMsImV4cCI6MjA2NDYyMjM0M30.WpJtBt49SJanUECQbIbnMmZWzTmZm5e9UhjiCylAlLc`
          },
          body: JSON.stringify({ 
            userId: user?.id, 
            email: newEmail, 
            verified: true 
          })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            updateSuccess = true;
            console.log('✅ Email verification updated via direct HTTP');
          }
        } else {
          console.warn('⚠️ Direct HTTP call failed with status:', response.status);
        }
      } catch (httpError) {
        console.warn('⚠️ Direct HTTP call failed:', httpError);
      }

      // Fallback to Supabase functions invoke
      if (!updateSuccess) {
        console.log('🔄 Trying Supabase functions invoke as fallback...');
        const { error: updateError } = await supabase.functions.invoke('update-email-verification', {
          body: { 
            userId: user?.id, 
            email: newEmail, 
            verified: true 
          }
        });

        if (updateError) {
          console.error('❌ Supabase function invoke failed:', updateError);
          throw new Error('Failed to update email verification via both methods');
        }
        
        console.log('✅ Email verification updated via Supabase function invoke');
      }

      // Update user password in Supabase Auth
      const { error: passwordError } = await supabase.auth.updateUser({
        password: password
      });

      if (passwordError) {
        console.error('Password update error:', passwordError);
        // Don't fail the whole process if password update fails
        toast.warning('Email u shtua me sukses, por pati një problem me ruajtjen e fjalëkalimit.');
      }

      onEmailChanged(newEmail);
      setStep('success');
      
    } catch (error) {
      console.error('Error during email setup:', error);
      toast.error('Gabim në procesin e shtimit të email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNewEmail('');
    setOtpCode('');
    setPassword('');
    setConfirmPassword('');
    setSentOtp('');
    setStep('email');
    setShowPassword(false);
    setShowConfirmPassword(false);
    onOpenChange(false);
  };

  const isAddingEmail = !currentEmail;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white p-6 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {step === 'email' && (isAddingEmail ? 'Shto Email për Kyçje' : 'Ndrysho Email')}
            {step === 'otp' && 'Verifiko Email'}
            {step === 'password' && 'Krijo Fjalëkalim për Email'}
            {step === 'success' && 'Kyçja me Email u Aktivizua!'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {step === 'email' && (
            <>
              {!isAddingEmail && (
                <div className="space-y-2">
                  <Label htmlFor="currentEmail">Email Aktual</Label>
                  <Input
                    id="currentEmail"
                    value={currentEmail}
                    readOnly
                    className="bg-gray-100 text-gray-600"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="newEmailInput">{isAddingEmail ? 'Email Adresa' : 'Email i Ri'}</Label>
                <div className="relative">
                  <Input
                    id="newEmailInput"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="email@example.com"
                    className={`bg-gray-50 focus:border-blue-500 focus:ring-blue-500 pr-10 ${
                      emailError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' :
                      isEmailValid ? 'border-green-300 focus:border-green-500 focus:ring-green-500' : ''
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isCheckingEmail ? (
                      <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                    ) : emailError ? (
                      <X className="h-4 w-4 text-red-500" />
                    ) : isEmailValid && newEmail.trim() ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : null}
                  </div>
                </div>
                {emailError && (
                  <p className="text-xs text-red-600">{emailError}</p>
                )}
                {isEmailValid && !emailError && newEmail.trim() && (
                  <p className="text-xs text-green-600">✓ Email është i disponueshëm</p>
                )}
              </div>

              {isAddingEmail && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Pse të shtoni email?</h4>
                      <p className="text-sm text-blue-700">
                        Duke shtuar email, do të keni një mënyrë alternative për kyçje nëse nuk mund të përdorni verifikimin me telefon. 
                        Kjo rrit sigurinë dhe lehtësinë e qasjes në llogarinë tuaj.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={handleEmailSubmit}
                disabled={isLoading || !isEmailValid || !!emailError || isCheckingEmail}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Duke dërguar...</span>
                  </div>
                ) : (
                  'Dërgo Kodin e Verifikimit'
                )}
              </Button>
              
              {isLoading && (
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Ju lutemi prisni, po dërgojmë kodin në email tuaj...
                  </p>
                </div>
              )}
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="otpInput">Kodi i Verifikimit</Label>
                <p className="text-sm text-gray-600">
                  Shkruani kodin 6-shifror që u dërgua në <strong>{newEmail}</strong>
                </p>
                <Input
                  id="otpInput"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="bg-gray-50 focus:border-blue-500 focus:ring-blue-500 text-center text-lg tracking-widest"
                />
              </div>
              
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-700">
                  <strong>⚠️ Nuk e merrni kodin?</strong><br/>
                  • Kontrolloni dosjen SPAM/JUNK në email<br/>
                  • Emails mund të vonohen deri në 2-5 minuta<br/>
                  • Klikoni "Dërgo Përsëri" nëse ka kaluar 2 minuta
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => setStep('email')}
                  variant="outline"
                  className="flex-1"
                >
                  Kthehu
                </Button>
                <Button 
                  onClick={handleEmailSubmit}
                  variant="outline"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? 'Duke dërguar...' : 'Dërgo Përsëri'}
                </Button>
                <Button 
                  onClick={handleOtpSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Verifiko
                </Button>
              </div>
            </>
          )}

          {step === 'password' && (
            <>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-900 mb-1">Krijoni një fjalëkalim</h4>
                    <p className="text-sm text-amber-700">
                      Ky fjalëkalim do të përdoret për kyçje me email nëse nuk mund të përdorni verifikimin me telefon. 
                      Mbajeni të sigurt dhe të lehtë për t'u mbajtur mend.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordInput">Fjalëkalim (minimum 6 karaktere)</Label>
                <div className="relative">
                  <Input
                    id="passwordInput"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Shkruani fjalëkalimin"
                    className="bg-gray-50 focus:border-blue-500 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPasswordInput">Konfirmo Fjalëkalimin</Label>
                <div className="relative">
                  <Input
                    id="confirmPasswordInput"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Shkruani përsëri fjalëkalimin"
                    className="bg-gray-50 focus:border-blue-500 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => setStep('otp')}
                  variant="outline"
                  className="flex-1"
                  disabled={isLoading}
                >
                  Kthehu
                </Button>
                <Button 
                  onClick={handlePasswordSubmit}
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? 'Duke ruajtur...' : 'Ruaj dhe Përfundo'}
                </Button>
              </div>
            </>
          )}

          {step === 'success' && (
            <>
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Email u shtua me sukses!
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Tani mund të kyçeni në llogarinë tuaj me dy mënyra të ndryshme:
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <p className="font-medium text-blue-900">Me Email</p>
                      <p className="text-sm text-blue-700">{newEmail}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div className="text-left">
                      <p className="font-medium text-green-900">Me Telefon</p>
                      <p className="text-sm text-green-700">Verifikim me kod SMS</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleClose}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Mbyll
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedEmailSetupDialog;