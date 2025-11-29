
import React from 'react';
import { Input } from '@/components/ui/input';

interface OTPInputSectionProps {
  otp: string;
  onOtpChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLocked: boolean;
  isVerifying: boolean;
  verificationMethod: string;
}

const OTPInputSection = ({ 
  otp, 
  onOtpChange, 
  isLocked, 
  isVerifying, 
  verificationMethod 
}: OTPInputSectionProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700">
        Verification Code
      </label>
      <Input
        id="verification-code"
        type="text"
        value={otp}
        onChange={onOtpChange}
        placeholder="Enter 6-digit code"
        className="text-center text-lg tracking-widest font-mono"
        disabled={isLocked || isVerifying}
        maxLength={6}
        autoComplete="one-time-code"
      />
      <p className="text-xs text-gray-500 text-center">
        Enter the 6-digit code sent to your {verificationMethod}
      </p>
    </div>
  );
};

export default OTPInputSection;
