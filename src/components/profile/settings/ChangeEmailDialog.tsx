
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { emailVerificationService } from '@/services/emailVerificationService';

interface ChangeEmailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentEmail: string;
  onEmailChanged: (email: string) => void;
}

const ChangeEmailDialog: React.FC<ChangeEmailDialogProps> = ({
  isOpen,
  onOpenChange,
  currentEmail,
  onEmailChanged
}) => {
  const { user } = useAuth();
  const [newEmail, setNewEmail] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [sentOtp, setSentOtp] = useState('');

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Isolated input change handler that NEVER triggers auto-save
  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setNewEmail(e.target.value);
  };

  // Isolated OTP input change handler that NEVER triggers auto-save
  const handleOtpInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setOtpCode(e.target.value);
  };

  const handleEmailSubmit = async () => {
    if (!newEmail.trim()) {
      toast.error('Ju lutemi shkruani email e ri');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast.error('Format i gabuar i email');
      return;
    }

    // Check if it's the same email
    if (newEmail === currentEmail) {
      toast.error('Email i ri duhet të jetë i ndryshëm nga ai aktual');
      return;
    }

    setIsLoading(true);
    
    try {
      // Check if email already exists
      console.log('🔍 Checking if new email exists:', newEmail);
      const duplicateCheck = await emailVerificationService.checkEmailExists(newEmail);
      
      if (duplicateCheck.exists) {
        toast.error('Ky email ekziston në një llogari tjetër. Ju lutemi përdorni një email tjetër.');
        setIsLoading(false);
        return;
      }

      // Generate OTP and send via email
      setIsGenerating(true);
      const otp = generateOTP();
      setSentOtp(otp);
      
      console.log('📧 Sending email OTP to:', newEmail);
      
      const emailResult = await emailVerificationService.sendVerificationEmail(
        newEmail,
        user?.user_metadata?.first_name || 'User',
        user?.user_metadata?.last_name || '',
        otp,
        true // This is profile email addition, not registration
      );

      if (!emailResult.success) {
        console.error('❌ Email sending error:', emailResult.error);
        toast.error('Gabim në dërgimin e kodit të verifikimit. Ju lutemi provoni përsëri.');
        setIsGenerating(false);
        setIsLoading(false);
        return;
      }

      console.log('✅ Email sent successfully');
      setStep('otp');
      setIsGenerating(false);
      toast.success('Kodi i verifikimit u dërgua në email tuaj të ri. Kontrolloni edhe dosjen SPAM nëse nuk e shihni.');

    } catch (error) {
      console.error('Error sending email OTP:', error);
      toast.error('Gabim në dërgimin e kodit të verifikimit');
      setIsGenerating(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otpCode.trim()) {
      toast.error('Ju lutemi shkruani kodin e verifikimit');
      return;
    }

    if (!user) {
      toast.error('Ju duhet të jeni të kyçur për të ndryshuar email');
      return;
    }

    // Verify OTP matches the sent one
    if (otpCode.trim() !== sentOtp) {
      toast.error('Kodi i verifikimit është i gabuar. Ju lutemi kontrolloni dhe provoni përsëri.');
      return;
    }

    setIsVerifying(true);

    try {
      console.log('✅ OTP verified successfully, updating email...');
      console.log('🔄 Removing old email:', currentEmail);
      console.log('📧 Adding new verified email:', newEmail);
      
      // Use our enhanced edge function to update email verification
      const { error: updateError } = await supabase.functions.invoke('update-email-verification', {
        body: { 
          userId: user.id, 
          email: newEmail, 
          verified: true 
        }
      });

      if (updateError) {
        console.error('Error updating email verification via edge function:', updateError);
        throw new Error('Failed to update email verification');
      }

      console.log('✅ Email verification updated successfully via edge function');

      // Success
      toast.success('Email u ndryshua dhe u verifikua me sukses!');
      onEmailChanged(newEmail);
      
      // Close dialog after success
      setTimeout(() => {
        handleClose();
      }, 1000);
        
    } catch (error) {
      console.error('Error during email change:', error);
      toast.error('Gabim në ndryshimin e email');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    setNewEmail('');
    setOtpCode('');
    setSentOtp('');
    setStep('email');
    onOpenChange(false);
  };

  // Prevent any event propagation when dialog opens
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    } else {
      // Reset state when opening
      setNewEmail('');
      setOtpCode('');
      setSentOtp('');
      setStep('email');
      setIsLoading(false);
      setIsGenerating(false);
      setIsVerifying(false);
    }
    onOpenChange(open);
  };

  const isAddingEmail = !currentEmail;

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="bg-white p-6 max-w-md" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {step === 'email' 
              ? (isAddingEmail ? 'Shto Email' : 'Ndrysho Email') 
              : 'Verifiko Email e Ri'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
          {step === 'email' ? (
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
                <Input
                  id="newEmailInput"
                  type="email"
                  value={newEmail}
                  onChange={handleEmailInputChange}
                  placeholder="email@example.com"
                  className="bg-gray-50 focus:border-black focus:ring-black"
                  onClick={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                  onBlur={(e) => e.stopPropagation()}
                />
              </div>

              {isAddingEmail && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <strong>📧 Më shumë opsione për kyçje:</strong> Duke shtuar email, do të keni një mënyrë shtesë për t'u kyçur në llogarinë tuaj.
                  </p>
                </div>
              )}
              
              <Button 
                onClick={handleEmailSubmit}
                disabled={isLoading || isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading || isGenerating ? 'Duke dërguar kodin...' : 'Dërgo Kodin e Verifikimit'}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="otpInput">Kodi i Verifikimit</Label>
                <p className="text-sm text-gray-600">
                  Shkruani kodin e verifikimit që u dërgua në {newEmail}
                </p>
                <Input
                  id="otpInput"
                  value={otpCode}
                  onChange={handleOtpInputChange}
                  placeholder="Shkruani kodin 6-shifror"
                  maxLength={6}
                  className="bg-gray-50 focus:border-black focus:ring-black"
                  onClick={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                  onBlur={(e) => e.stopPropagation()}
                />
              </div>
              
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-700">
                  <strong>🔐 Më shumë opsione për autentifikim:</strong> Pas verifikimit, ky email do të jetë një metodë e re për kyçje dhe sigurinë e llogarisë tuaj.
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => setStep('email')}
                  variant="outline"
                  className="flex-1"
                  disabled={isVerifying}
                >
                  Kthehu
                </Button>
                <Button 
                  onClick={handleOtpSubmit}
                  disabled={isVerifying}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isVerifying ? 'Duke verifikuar...' : 'Verifiko dhe Ruaj'}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeEmailDialog;
