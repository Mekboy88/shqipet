
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDualRegistration } from '@/hooks/auth/useDualRegistration';

// Example of how to integrate the dual registration system with existing UI
const RegistrationIntegrationExample: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailOrPhone: '',
    password: '',
    otpCode: ''
  });

  const {
    isLoading,
    currentMethod,
    requiresVerification,
    pendingPhone,
    pendingEmail,
    startPhoneRegistration,
    startEmailPasswordRegistration,
    verifyPhoneRegistration
  } = useDualRegistration();

  // Detect if input is phone number or email
  const isPhoneNumber = (input: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(input.replace(/\s/g, ''));
  };

  const handleRegistration = async () => {
    const { emailOrPhone, firstName, lastName, password } = formData;
    
    if (isPhoneNumber(emailOrPhone)) {
      // Phone registration flow
      const result = await startPhoneRegistration({
        phoneNumber: emailOrPhone,
        firstName,
        lastName
      });
      
      console.log('Phone registration result:', result);
    } else {
      // Email registration flow
      const result = await startEmailPasswordRegistration({
        email: emailOrPhone,
        password,
        firstName,
        lastName
      });
      
      console.log('Email registration result:', result);
    }
  };

  const handleVerifyOTP = async () => {
    if (currentMethod === 'phone' && pendingPhone) {
      const result = await verifyPhoneRegistration(formData.otpCode);
      console.log('OTP verification result:', result);
    }
  };

  if (requiresVerification && currentMethod === 'phone') {
    // Show OTP verification form
    return (
      <div className="space-y-4">
        <h3>Enter verification code sent to {pendingPhone}</h3>
        <Input
          placeholder="6-digit code"
          value={formData.otpCode}
          onChange={(e) => setFormData(prev => ({ ...prev, otpCode: e.target.value }))}
          maxLength={6}
        />
        <Button onClick={handleVerifyOTP} disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </Button>
      </div>
    );
  }

  if (requiresVerification && currentMethod === 'email_password') {
    // Show email verification message
    return (
      <div className="space-y-4">
        <h3>Check your email</h3>
        <p>We've sent a verification link to {pendingEmail}</p>
        <p>Click the link in your email to complete registration.</p>
      </div>
    );
  }

  // Show registration form
  return (
    <div className="space-y-4">
      <Input
        placeholder="First Name"
        value={formData.firstName}
        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
      />
      <Input
        placeholder="Last Name"
        value={formData.lastName}
        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
      />
      <Input
        placeholder="Email or Phone Number"
        value={formData.emailOrPhone}
        onChange={(e) => setFormData(prev => ({ ...prev, emailOrPhone: e.target.value }))}
      />
      {!isPhoneNumber(formData.emailOrPhone) && (
        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
        />
      )}
      
      <Button onClick={handleRegistration} disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Register'}
      </Button>
    </div>
  );
};

export default RegistrationIntegrationExample;
