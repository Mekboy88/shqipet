
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DuplicateDetectionService } from '@/services/duplicateDetectionService';
import { validatePhoneNumber } from '@/utils/phoneValidation';
import { toast } from 'sonner';
import supabase from '@/lib/relaxedSupabase';
import { useAuth } from '@/contexts/AuthContext';

interface PhoneNumberPopupProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPhoneAdded: (phoneNumber: string) => void;
}

const PhoneNumberPopup: React.FC<PhoneNumberPopupProps> = ({
  isOpen,
  onOpenChange,
  onPhoneAdded
}) => {
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [sentOtp, setSentOtp] = useState('');

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) {
      toast.error('Ju lutemi shkruani numrin e telefonit');
      return;
    }

    // Validate phone number format
    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.isValid) {
      toast.error(validation.error || 'Format i gabuar i numrit të telefonit');
      return;
    }

    setIsLoading(true);
    
    try {
      // Check if phone number already exists
      console.log('🔍 Checking if phone number exists:', validation.normalizedNumber);
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
          message: `Kodi juaj i verifikimit është: ${otp}. Ky kod është i vlefshëm për 5 minuta.`
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
        toast.success('Kodi i verifikimit u dërgua në telefonin tuaj');
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
      toast.error('Ju duhet të jeni të kyçur për të shtuar numrin e telefonit');
      return;
    }

    // Verify OTP matches the sent one
    if (otpCode.trim() !== sentOtp) {
      toast.error('Kodi i verifikimit është i gabuar. Ju lutemi kontrolloni dhe provoni përsëri.');
      return;
    }

    setIsVerifying(true);

    try {
      const validation = validatePhoneNumber(phoneNumber);
      
      console.log('✅ OTP verified successfully, updating user profile...');
      
      // Update auth.users table with phone number
      const { error: authUpdateError } = await supabase.auth.updateUser({
        phone: validation.normalizedNumber
      });

      if (authUpdateError) {
        console.error('Error updating auth.users:', authUpdateError);
        // Continue anyway as this might not be critical
      }
      
      // Update existing user profile with phone_verified = true
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          phone_number: validation.normalizedNumber,
          phone_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Error updating profiles table:', profileError);
        throw new Error('Failed to update profile');
      }

      console.log('✅ Profile updated with VERIFIED phone number');

      // Update profile_settings table with verified status
      const { error: settingsError } = await supabase
        .from('profile_settings')
        .upsert({
          user_id: user.id,
          phone_number: validation.normalizedNumber,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (settingsError) {
        console.error('Error updating profile_settings table:', settingsError);
      } else {
        console.log('✅ Profile settings updated with verified phone');
      }

      // Success
      toast.success('Numri i telefonit u shtua dhe u verifikua me sukses!');
      onPhoneAdded(validation.normalizedNumber);
      
      // Close dialog after success
      setTimeout(() => {
        handleClose();
      }, 1000);
        
    } catch (error) {
      console.error('Error during phone number verification:', error);
      toast.error('Gabim në verifikimin e numrit të telefonit');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    setPhoneNumber('');
    setOtpCode('');
    setSentOtp('');
    setStep('phone');
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white p-6 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {step === 'phone' ? 'Shto Numrin e Telefonit' : 'Verifiko Numrin e Telefonit'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {step === 'phone' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="phoneInput">Numri i Telefonit</Label>
                <p className="text-sm text-gray-600">
                  Shtoni numrin tuaj të telefonit si metodë e dytë kyçjeje
                </p>
                <Input
                  id="phoneInput"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+355 69 123 4567"
                  className="bg-gray-50 focus:border-black focus:ring-black"
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
                  Shkruani kodin e verifikimit që u dërgua në {phoneNumber}
                </p>
                <Input
                  id="otpInput"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Shkruani kodin 6-shifror"
                  maxLength={6}
                  className="bg-gray-50 focus:border-black focus:ring-black"
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
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
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

export default PhoneNumberPopup;
