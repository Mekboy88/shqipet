
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface OTPVerificationFlowProps {
  userProfile: {
    email?: string;
    phone_number?: string;
  };
  selectedMethod: string;
  setSelectedMethod: (method: string) => void;
  otpSent: boolean;
  setOtpSent: (sent: boolean) => void;
  otpVerified: boolean;
  otpCode: string;
  setOtpCode: (code: string) => void;
  onSendOTP: () => void;
  onVerifyOTP: () => void;
  onReset: () => void;
  isGenerating: boolean;
  isVerifying: boolean;
}

export const OTPVerificationFlow: React.FC<OTPVerificationFlowProps> = ({
  userProfile,
  selectedMethod,
  setSelectedMethod,
  otpSent,
  setOtpSent,
  otpVerified,
  otpCode,
  setOtpCode,
  onSendOTP,
  onVerifyOTP,
  onReset,
  isGenerating,
  isVerifying
}) => {
  if (!otpSent) {
    return (
      <div className="space-y-4">
        <Label>Zgjidhni metodën e verifikimit:</Label>
        <div className="space-y-3">
          {userProfile.email ? (
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="email-method"
                name="verification-method"
                value="email"
                checked={selectedMethod === 'email'}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-4 h-4"
              />
              <label htmlFor="email-method" className="text-sm">
                Email: <span className="font-medium text-blue-600">{userProfile.email}</span>
              </label>
            </div>
          ) : (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700">
                <strong>Email i mungon!</strong> Ju rekomandojmë fuqishëm të shtoni një email në profilin tuaj për më shumë siguri dhe për të përdorur funksionet e verifikimit.
              </p>
            </div>
          )}
          
          {userProfile.phone_number ? (
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="phone-method"
                name="verification-method"
                value="phone"
                checked={selectedMethod === 'phone'}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-4 h-4"
              />
              <label htmlFor="phone-method" className="text-sm">
                Telefon: <span className="font-medium text-green-600">{userProfile.phone_number}</span>
              </label>
            </div>
          ) : (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700">
                <strong>Numri i telefonit mungon!</strong> Ju rekomandojmë fuqishëm të shtoni një numër telefoni në profilin tuaj për më shumë siguri dhe për të përdorur funksionet e verifikimit.
              </p>
            </div>
          )}

          {!userProfile.email && !userProfile.phone_number && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">
                <strong>Asnjë kontakt nuk është shtuar!</strong> Ju duhet të shtoni të paktën një email ose numër telefoni në profilin tuaj për të përdorur funksionin e rikuperimit të fjalëkalimit.
              </p>
            </div>
          )}
        </div>
        
        <Button 
          onClick={onSendOTP}
          disabled={!selectedMethod || isGenerating || (!userProfile.email && !userProfile.phone_number)}
          className="w-full"
        >
          {isGenerating ? 'Duke dërguar...' : 'Dërgo kodin e verifikimit'}
        </Button>
      </div>
    );
  }

  if (!otpVerified) {
    return (
      <div className="space-y-4">
        <Label>Shkruani kodin e verifikimit:</Label>
        <p className="text-sm text-gray-600">
          Kodi është dërguar në: {' '}
          <span className="font-medium">
            {selectedMethod === 'email' ? userProfile.email : userProfile.phone_number}
          </span>
        </p>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={setOtpCode}
            className="gap-2"
          >
            <InputOTPGroup className="gap-2">
              <InputOTPSlot 
                index={0} 
                className="w-12 h-12 text-lg font-mono border-2 border-gray-300 rounded-md bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
              />
              <InputOTPSlot 
                index={1} 
                className="w-12 h-12 text-lg font-mono border-2 border-gray-300 rounded-md bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
              />
              <InputOTPSlot 
                index={2} 
                className="w-12 h-12 text-lg font-mono border-2 border-gray-300 rounded-md bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
              />
              <InputOTPSlot 
                index={3} 
                className="w-12 h-12 text-lg font-mono border-2 border-gray-300 rounded-md bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
              />
              <InputOTPSlot 
                index={4} 
                className="w-12 h-12 text-lg font-mono border-2 border-gray-300 rounded-md bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
              />
              <InputOTPSlot 
                index={5} 
                className="w-12 h-12 text-lg font-mono border-2 border-gray-300 rounded-md bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
              />
            </InputOTPGroup>
          </InputOTP>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={onVerifyOTP}
            disabled={isVerifying || otpCode.length !== 6}
            className="flex-1"
          >
            {isVerifying ? 'Duke verifikuar...' : 'Verifiko kodin'}
          </Button>
          <Button variant="outline" onClick={() => setOtpSent(false)}>
            Kthehu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-green-600 font-medium">
        Kodi u verifikua me sukses! Mund të shkruani fjalëkalimin e ri:
      </p>
    </div>
  );
};
