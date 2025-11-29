import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DuplicateDetectionService } from '@/services/duplicateDetectionService';
import { validatePhoneNumber } from '@/utils/phoneValidation';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ChangePhoneNumberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentPhoneNumber: string;
  onPhoneChanged: (phoneNumber: string) => void;
}

const ChangePhoneNumberDialog: React.FC<ChangePhoneNumberDialogProps> = ({
  isOpen,
  onOpenChange,
  currentPhoneNumber,
  onPhoneChanged
}) => {
  const { user } = useAuth();
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [sentOtp, setSentOtp] = useState('');

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Isolated input change handler that NEVER triggers auto-save
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent event bubbling
    setNewPhoneNumber(e.target.value);
  };

  // Isolated OTP input change handler that NEVER triggers auto-save
  const handleOtpInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent event bubbling
    setOtpCode(e.target.value);
  };

  const handlePhoneSubmit = async () => {
    if (!newPhoneNumber.trim()) {
      toast.error('Ju lutemi shkruani numrin e ri të telefonit');
      return;
    }

    // Check if it's the same number
    if (newPhoneNumber === currentPhoneNumber) {
      toast.error('Numri i ri duhet të jetë i ndryshëm nga ai aktual');
      return;
    }

    // Validate phone number format
    const validation = validatePhoneNumber(newPhoneNumber);
    if (!validation.isValid) {
      toast.error(validation.error || 'Format i gabuar i numrit të telefonit');
      return;
    }

    setIsLoading(true);
    
    try {
      // Check if phone number already exists
      console.log('🔍 Checking if new phone number exists:', validation.normalizedNumber);
      const duplicateCheck = await DuplicateDetectionService.checkDuplicate(validation.normalizedNumber, true);
      
      if (duplicateCheck.exists) {
        toast.error('Ky numër ekziston në një llogari tjetër. Ju lutemi përdorni një numër tjetër.');
        setIsLoading(false);
        return;
      }

      // Generate OTP and send via Twilio
      setIsGenerating(true);
      const otp = generateOTP();
      setSentOtp(otp);
      
      console.log('📱 Sending SMS OTP via Twilio to:', validation.normalizedNumber);
      
      const { data, error } = await supabase.functions.invoke('send-sms-otp', {
        body: {
          phoneNumber: validation.normalizedNumber,
          otpCode: otp,
          message: `Kodi juaj i verifikimit për ndryshimin e numrit të telefonit është: ${otp}. Ky kod është i vlefshëm për 5 minuta.`
        }
      });

      if (error) {
        console.error('❌ SMS sending error:', error);
        toast.error('Gabim në dërgimin e kodit të verifikimit. Ju lutemi provoni përsëri.');
        setIsGenerating(false);
        setIsLoading(false);
        return;
      }

      if (data?.success) {
        console.log('✅ SMS sent successfully');
        setStep('otp');
        setIsGenerating(false);
        toast.success('Kodi i verifikimit u dërgua në telefonin tuaj të ri');
      } else {
        console.error('❌ SMS sending failed:', data);
        toast.error('Gabim në dërgimin e kodit të verifikimit. Ju lutemi provoni përsëri.');
        setIsGenerating(false);
      }

    } catch (error) {
      console.error('Error sending SMS OTP:', error);
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
      toast.error('Ju duhet të jeni të kyçur për të ndryshuar numrin e telefonit');
      return;
    }

    // Verify OTP matches the sent one
    if (otpCode.trim() !== sentOtp) {
      toast.error('Kodi i verifikimit është i gabuar. Ju lutemi kontrolloni dhe provoni përsëri.');
      return;
    }

    setIsVerifying(true);

    try {
      const validation = validatePhoneNumber(newPhoneNumber);
      
      console.log('✅ OTP verified successfully, updating phone number...');
      console.log('🔄 Removing old phone number:', currentPhoneNumber);
      console.log('📱 Adding new verified phone number:', validation.normalizedNumber);
      
      // Use our enhanced edge function to update phone verification
      const { error: updateError } = await supabase.functions.invoke('update-phone-verification', {
        body: { 
          userId: user.id, 
          phoneNumber: validation.normalizedNumber, 
          verified: true 
        }
      });

      if (updateError) {
        console.error('Error updating phone verification via edge function:', updateError);
        throw new Error('Failed to update phone verification');
      }

      console.log('✅ Phone verification updated successfully via edge function');

      // Success
      toast.success('Numri i telefonit u ndryshua dhe u verifikua me sukses!');
      onPhoneChanged(validation.normalizedNumber);
      
      // Close dialog after success
      setTimeout(() => {
        handleClose();
      }, 1000);
        
    } catch (error) {
      console.error('Error during phone number change:', error);
      toast.error('Gabim në ndryshimin e numrit të telefonit');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    setNewPhoneNumber('');
    setOtpCode('');
    setSentOtp('');
    setStep('phone');
    onOpenChange(false);
  };

  // Prevent any event propagation when dialog opens
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    } else {
      // Reset state when opening
      setNewPhoneNumber('');
      setOtpCode('');
      setSentOtp('');
      setStep('phone');
      setIsLoading(false);
      setIsGenerating(false);
      setIsVerifying(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="bg-white p-6 max-w-md" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {step === 'phone' ? 'Ndrysho Numrin e Telefonit' : 'Verifiko Numrin e Ri'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
          {step === 'phone' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="currentPhone">Numri Aktual</Label>
                <Input
                  id="currentPhone"
                  value={currentPhoneNumber}
                  readOnly
                  className="bg-gray-100 text-gray-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPhoneInput">Numri i Ri i Telefonit</Label>
                <Input
                  id="newPhoneInput"
                  value={newPhoneNumber}
                  onChange={handlePhoneInputChange}
                  placeholder="+355 69 123 4567"
                  className="bg-gray-50 focus:border-black focus:ring-black"
                  onClick={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                  onBlur={(e) => e.stopPropagation()}
                />
              </div>
              
              <Button 
                onClick={handlePhoneSubmit}
                disabled={isLoading || isGenerating}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading || isGenerating ? 'Duke dërguar kodin...' : 'Dërgo Kodin e Verifikimit'}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="otpInput">Kodi i Verifikimit</Label>
                <p className="text-sm text-gray-600">
                  Shkruani kodin e verifikimit që u dërgua në {newPhoneNumber}
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
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => setStep('phone')}
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

export default ChangePhoneNumberDialog;
