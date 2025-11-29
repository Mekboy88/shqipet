import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Clock, AlertCircle, Shield } from 'lucide-react';
import OTPInput from '../../../components/auth/verification/OTPInput';
import ResendCodeButton from '../../../components/auth/verification/ResendCodeButton';

interface OTPEmailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentEmail: string;
  onEmailUpdated: (email: string, verified: boolean) => void;
}

const OTPEmailDialog: React.FC<OTPEmailDialogProps> = ({
  isOpen,
  onOpenChange,
  currentEmail,
  onEmailUpdated
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [newEmail, setNewEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts] = useState(5);
  const [isLocked, setIsLocked] = useState(false);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Countdown timer for expiry and cooldown
  useEffect(() => {
    if (!expiresAt && cooldownTime <= 0) return;

    const timer = setInterval(() => {
      const now = new Date();
      
      if (expiresAt && now >= expiresAt) {
        toast.error('Verification code has expired. Please request a new one.');
        setStep('email');
        setExpiresAt(null);
      }

      if (cooldownTime > 0) {
        setCooldownTime(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setCanResend(true);
            return 0;
          }
          return newTime;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, cooldownTime]);

  const isAddingEmail = !currentEmail;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc('check_auth_user_email', { email_to_check: email });
      
      if (error) throw error;
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking email existence:', error);
      return false;
    }
  };

  const handleEmailSubmit = async () => {
    if (!newEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (!validateEmail(newEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (newEmail === currentEmail) {
      toast.error('New email must be different from current email');
      return;
    }

    setIsLoading(true);
    setIsGenerating(true);

    try {
      // Check if email already exists
      const exists = await checkEmailExists(newEmail);
      if (exists) {
        toast.error('This email is already registered to another account');
        setIsLoading(false);
        setIsGenerating(false);
        return;
      }

      // Send OTP via SendGrid
      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: {
          email: newEmail,
          firstName: user?.user_metadata?.first_name || 'User',
          lastName: user?.user_metadata?.last_name || '',
          isProfileUpdate: true
        }
      });

      if (error) {
        console.error('Error sending OTP:', error);
        toast.error('Failed to send verification code. Please try again.');
        return;
      }

      // Update profile with pending status
      await supabase
        .from('profiles')
        .update({
          otp_email_pending: true,
          otp_email_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
          otp_attempts_email: 0
        })
        .eq('id', user?.id);

      setExpiresAt(new Date(Date.now() + 10 * 60 * 1000));
      setStep('otp');
      setAttempts(0);
      setCooldownTime(60); // 60 second cooldown
      setCanResend(false);
      toast.success('Verification code sent to your email');

    } catch (error) {
      console.error('Error in email submission:', error);
      toast.error('Failed to send verification code');
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }

    if (isLocked) {
      toast.error('Too many failed attempts. Please try again later.');
      return;
    }

    setIsVerifying(true);

    try {
      // Verify OTP with Supabase Auth
      const { data, error } = await supabase.auth.verifyOtp({
        email: newEmail,
        token: otpCode,
        type: 'email'
      });

      if (error) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        // Update attempts in database
        await supabase
          .from('profiles')
          .update({ otp_attempts_email: newAttempts })
          .eq('id', user?.id);

        if (newAttempts >= maxAttempts) {
          setIsLocked(true);
          toast.error('Maximum attempts exceeded. Please request a new code.');
          setTimeout(() => {
            setStep('email');
            setIsLocked(false);
            setAttempts(0);
          }, 30000); // 30 second lockout
        } else {
          toast.error(`Invalid code. ${maxAttempts - newAttempts} attempts remaining.`);
        }
        return;
      }

      // Update email verification status
      const { error: updateError } = await supabase.functions.invoke('update-email-verification', {
        body: {
          userId: user?.id,
          email: newEmail,
          verified: true
        }
      });

      if (updateError) {
        console.error('Error updating email verification:', updateError);
        toast.error('Failed to update email verification');
        return;
      }

      // Clear pending status
      await supabase
        .from('profiles')
        .update({
          otp_email_pending: false,
          otp_email_expires_at: null,
          otp_attempts_email: 0,
          email_verified_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      toast.success('Email verified successfully!');
      onEmailUpdated(newEmail, true);
      handleClose();

    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Failed to verify code');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend || cooldownTime > 0) return;

    setIsGenerating(true);
    setCooldownTime(60);
    setCanResend(false);

    try {
      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: {
          email: newEmail,
          firstName: user?.user_metadata?.first_name || 'User',
          lastName: user?.user_metadata?.last_name || '',
          isProfileUpdate: true
        }
      });

      if (error) {
        toast.error('Failed to resend code');
        setCooldownTime(0);
        setCanResend(true);
        return;
      }

      // Reset expiry time
      const newExpiry = new Date(Date.now() + 10 * 60 * 1000);
      setExpiresAt(newExpiry);
      
      await supabase
        .from('profiles')
        .update({
          otp_email_expires_at: newExpiry.toISOString(),
          otp_attempts_email: 0
        })
        .eq('id', user?.id);

      setAttempts(0);
      setIsLocked(false);
      toast.success('Verification code resent');

    } catch (error) {
      console.error('Error resending code:', error);
      toast.error('Failed to resend code');
      setCooldownTime(0);
      setCanResend(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setStep('email');
    setNewEmail('');
    setOtpCode('');
    setAttempts(0);
    setIsLocked(false);
    setExpiresAt(null);
    setCooldownTime(0);
    setCanResend(true);
    onOpenChange(false);
  };

  const formatTimeLeft = (date: Date | null): string => {
    if (!date) return '';
    const diff = Math.max(0, Math.floor((date.getTime() - Date.now()) / 1000));
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {step === 'email' 
              ? (isAddingEmail ? 'Add Email' : 'Change Email')
              : 'Verify Email'
            }
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {step === 'email' ? (
            <>
              {!isAddingEmail && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Current Email</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md text-gray-600">
                    {currentEmail}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="newEmail" className="text-sm font-medium text-gray-700">
                  {isAddingEmail ? 'Email Address' : 'New Email Address'}
                </Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Email Verification Required</p>
                    <p className="text-xs text-blue-700 mt-1">
                      A verification code will be sent to your email address. Please check your inbox and spam folder.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleEmailSubmit}
                disabled={isLoading || !newEmail.trim()}
                className="w-full"
              >
                {isLoading ? 'Sending Code...' : 'Send Verification Code'}
              </Button>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Email Verification
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Enter the 6-digit code sent to <strong>{newEmail}</strong>
                </p>
                {expiresAt && (
                  <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    Expires in {formatTimeLeft(expiresAt)}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Verification Code
                </Label>
                <OTPInput
                  value={otpCode}
                  onChange={setOtpCode}
                  disabled={isVerifying || isLocked}
                />
                {attempts > 0 && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                    <AlertCircle className="h-3 w-3" />
                    Attempt {attempts} of {maxAttempts}
                  </div>
                )}
              </div>

              {isLocked && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">
                    Too many failed attempts. Please wait 30 seconds before trying again.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  onClick={handleOtpSubmit}
                  disabled={isVerifying || isLocked || otpCode.length !== 6}
                  className="w-full"
                >
                  {isVerifying ? 'Verifying...' : 'Verify & Save'}
                </Button>

                <ResendCodeButton
                  canResend={canResend && !isLocked}
                  isLocked={isLocked}
                  timeLeft={cooldownTime}
                  onResend={handleResendCode}
                />

                <Button
                  onClick={() => setStep('email')}
                  variant="outline"
                  className="w-full"
                  disabled={isVerifying}
                >
                  Back to Email
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OTPEmailDialog;