
import { useState } from 'react';
import { generateOTP as generateOTPService } from './services/otpGenerator';
import { verifyOTP as verifyOTPService } from './services/otpVerifier';
import { OTPVerificationResult } from './types/otpTypes';

export const useOTPVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateOTP = async (contact: string): Promise<OTPVerificationResult> => {
    return generateOTPService(contact, isGenerating, setIsGenerating);
  };

  const verifyOTP = async (contact: string, inputOTP: string): Promise<OTPVerificationResult> => {
    return verifyOTPService(contact, inputOTP, setIsVerifying);
  };

  return {
    generateOTP,
    verifyOTP,
    isVerifying,
    isGenerating
  };
};
