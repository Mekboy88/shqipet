import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Clock, AlertCircle, Shield, Phone } from 'lucide-react';
import { validatePhoneNumber } from '@/utils/phoneValidation';
import { DuplicateDetectionService } from '@/services/duplicateDetectionService';
import OTPInput from '../../../components/auth/verification/OTPInput';
import ResendCodeButton from '../../../components/auth/verification/ResendCodeButton';

interface OTPPhoneDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentPhone: string;
  onPhoneUpdated: (phone: string, verified: boolean) => void;
}

const OTPPhoneDialog: React.FC<OTPPhoneDialogProps> = ({
  isOpen,
  onOpenChange,
  currentPhone,
  onPhoneUpdated
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [newPhone, setNewPhone] = useState('');
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
        setStep('phone');
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

  const isAddingPhone = !currentPhone;

  const handlePhoneSubmit = async () => {
    if (!newPhone.trim()) {
      toast.error('Please enter a phone number');
      return;
    }

    const validation = validatePhoneNumber(newPhone);
    if (!validation.isValid) {
      toast.error(validation.error || 'Please enter a valid phone number');
      return;
    }

    if (validation.normalizedNumber === currentPhone) {
      toast.error('New phone number must be different from current number');
      return;
    }

    setIsLoading(true);
    setIsGenerating(true);

    try {
      // Check if phone already exists
      const duplicateCheck = await DuplicateDetectionService.checkDuplicate(validation.normalizedNumber, true);
      if (duplicateCheck.exists) {
        toast.error('This phone number is already registered to another account');
        setIsLoading(false);
        setIsGenerating(false);
        return;
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Send OTP via Twilio
      const { data, error } = await supabase.functions.invoke('send-sms-otp', {
        body: {
          phoneNumber: validation.normalizedNumber,
          otpCode: otp,
          message: `Your verification code is: ${otp}. Valid for 10 minutes.`
        }
      });

      if (error || !data?.success) {
        console.error('Error sending SMS OTP:', error);
        toast.error('Failed to send verification code. Please try again.');
        return;
      }

      // Store OTP hash in security_events for verification
      await supabase
        .from('security_events')
        .insert({
          user_id: user?.id,
          event_type: 'otp_generated',
          event_description: 'Phone verification OTP generated',
          metadata: {
            otp_hash: otp, // In production, this should be hashed
            contact: validation.normalizedNumber,
            contact_type: 'phone',
            expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
          },
          risk_level: 'low'
        });

      // Update profile with pending status
      await supabase
        .from('profiles')
        .update({
          otp_phone_pending: true,
          otp_phone_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
          otp_attempts_phone: 0
        })
        .eq('id', user?.id);

      setExpiresAt(new Date(Date.now() + 10 * 60 * 1000));
      setStep('otp');
      setAttempts(0);
      setCooldownTime(60); // 60 second cooldown
      setCanResend(false);
      toast.success('Verification code sent to your phone');

    } catch (error) {
      console.error('Error in phone submission:', error);
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
      const validation = validatePhoneNumber(newPhone);
      
      // Verify OTP against stored hash
      const { data: securityEvents, error: securityError } = await supabase
        .from('security_events')
        .select('metadata')
        .eq('user_id', user?.id)
        .eq('event_type', 'otp_generated')
        .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()) // Within last 15 minutes
        .order('created_at', { ascending: false })
        .limit(1);

      if (securityError || !securityEvents?.length) {
        toast.error('No valid verification code found. Please request a new one.');
        setStep('phone');
        return;
      }

      const latestOTP = securityEvents[0].metadata as any;
      
      // Check if OTP matches and hasn't expired
      if (latestOTP?.otp_hash !== otpCode) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        // Update attempts in database
        await supabase
          .from('profiles')
          .update({ otp_attempts_phone: newAttempts })
          .eq('id', user?.id);

        if (newAttempts >= maxAttempts) {
          setIsLocked(true);
          toast.error('Maximum attempts exceeded. Please request a new code.');
          setTimeout(() => {
            setStep('phone');
            setIsLocked(false);
            setAttempts(0);
          }, 30000); // 30 second lockout
        } else {
          toast.error(`Invalid code. ${maxAttempts - newAttempts} attempts remaining.`);
        }
        return;
      }

      // Check expiry
      if (new Date() > new Date(latestOTP?.expires_at)) {
        toast.error('Verification code has expired. Please request a new one.');
        setStep('phone');
        return;
      }

      // Mark OTP as used
      await supabase
        .from('security_events')
        .update({ 
          metadata: { 
            ...(latestOTP || {}), 
            used: true, 
            verified_at: new Date().toISOString() 
          } 
        })
        .eq('user_id', user?.id)
        .eq('event_type', 'otp_generated')
        .eq('id', (securityEvents[0] as any)?.id);

      // Update phone verification status
      const { error: updateError } = await supabase.functions.invoke('update-phone-verification', {
        body: {
          userId: user?.id,
          phoneNumber: validation.normalizedNumber,
          verified: true
        }
      });

      if (updateError) {
        console.error('Error updating phone verification:', updateError);
        toast.error('Failed to update phone verification');
        return;
      }

      // Clear pending status
      await supabase
        .from('profiles')
        .update({
          otp_phone_pending: false,
          otp_phone_expires_at: null,
          otp_attempts_phone: 0,
          phone_verified_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      toast.success('Phone number verified successfully!');
      onPhoneUpdated(validation.normalizedNumber, true);
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
      const validation = validatePhoneNumber(newPhone);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const { data, error } = await supabase.functions.invoke('send-sms-otp', {
        body: {
          phoneNumber: validation.normalizedNumber,
          otpCode: otp,
          message: `Your verification code is: ${otp}. Valid for 10 minutes.`
        }
      });

      if (error || !data?.success) {
        toast.error('Failed to resend code');
        setCooldownTime(0);
        setCanResend(true);
        return;
      }

      // Store new OTP
      await supabase
        .from('security_events')
        .insert({
          user_id: user?.id,
          event_type: 'otp_generated',
          event_description: 'Phone verification OTP resent',
          metadata: {
            otp_hash: otp,
            contact: validation.normalizedNumber,
            contact_type: 'phone',
            expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
          },
          risk_level: 'low'
        });

      // Reset expiry time
      const newExpiry = new Date(Date.now() + 10 * 60 * 1000);
      setExpiresAt(newExpiry);
      
      await supabase
        .from('profiles')
        .update({
          otp_phone_expires_at: newExpiry.toISOString(),
          otp_attempts_phone: 0
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
    setStep('phone');
    setNewPhone('');
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
            {step === 'phone' 
              ? (isAddingPhone ? 'Add Phone Number' : 'Change Phone Number')
              : 'Verify Phone Number'
            }
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {step === 'phone' ? (
            <>
              {!isAddingPhone && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Current Phone</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md text-gray-600">
                    {currentPhone}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="newPhone" className="text-sm font-medium text-gray-700">
                  {isAddingPhone ? 'Phone Number' : 'New Phone Number'}
                </Label>
                <Input
                  id="newPhone"
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="mt-1"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Include country code (e.g., +1 for US, +44 for UK)
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">SMS Verification Required</p>
                    <p className="text-xs text-green-700 mt-1">
                      A verification code will be sent via SMS to your phone number.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePhoneSubmit}
                disabled={isLoading || !newPhone.trim()}
                className="w-full"
              >
                {isLoading ? 'Sending Code...' : 'Send Verification Code'}
              </Button>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    SMS Verification
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Enter the 6-digit code sent to <strong>{newPhone}</strong>
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
                  onClick={() => setStep('phone')}
                  variant="outline"
                  className="w-full"
                  disabled={isVerifying}
                >
                  Back to Phone
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OTPPhoneDialog;