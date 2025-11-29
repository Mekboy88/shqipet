
import React, { forwardRef } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const OTPInput = ({ value, onChange, disabled = false }: OTPInputProps) => {
  const handleChange = (val: string) => {
    const sanitized = val.replace(/\D/g, '').slice(0, 6);
    onChange(sanitized);
  };

  return (
    <div className="flex justify-center">
      <InputOTP
        maxLength={6}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        autoFocus
        containerClassName="gap-2"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
};

export default OTPInput;
