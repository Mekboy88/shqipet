
import React from 'react';

interface ManualOTPInputProps {
  phoneNumber: string;
  onManualOTPSet: (otpCode: string) => void;
}

const ManualOTPInput = ({ phoneNumber, onManualOTPSet }: ManualOTPInputProps) => {
  // Component is disabled - doesn't render anything
  return null;
};

export default ManualOTPInput;
