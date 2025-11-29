
import React from 'react';
import { Shield, Mail, Phone } from 'lucide-react';

interface VerificationHeaderProps {
  verificationMethod: string;
  contactInfo: string;
}

const VerificationHeader = ({ verificationMethod, contactInfo }: VerificationHeaderProps) => {
  const getVerificationIcon = () => {
    if (verificationMethod === 'phone') return <Phone className="h-6 w-6" />;
    if (verificationMethod === 'email') return <Mail className="h-6 w-6" />;
    return <Shield className="h-6 w-6" />;
  };

  const getVerificationText = () => {
    if (verificationMethod === 'phone') {
      return 'We\'ve sent a 6-digit verification code to your phone number.';
    }
    return 'We\'ve sent a 6-digit verification code to your email.';
  };

  const formatContactInfo = () => {
    if (verificationMethod === 'phone') {
      // Mask phone number for privacy: +355-XX-XXX-X123
      const phone = contactInfo;
      if (phone.length > 4) {
        const lastFour = phone.slice(-4);
        const prefix = phone.slice(0, 4);
        const masked = prefix + 'X'.repeat(phone.length - 8) + lastFour;
        return masked;
      }
      return phone;
    }
    
    // Mask email for privacy: ex***@example.com
    if (contactInfo.includes('@')) {
      const [local, domain] = contactInfo.split('@');
      if (local.length > 2) {
        const maskedLocal = local.slice(0, 2) + '*'.repeat(local.length - 2);
        return `${maskedLocal}@${domain}`;
      }
    }
    
    return contactInfo;
  };

  return (
    <>
      <div className="flex items-center justify-center mb-4">
        <div className="bg-blue-100 p-3 rounded-full">
          {getVerificationIcon()}
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-2">Verify Your Account</h1>
      <p className="text-facebook-gray mb-6 text-center">
        {getVerificationText()}
        <br />
        <span className="font-medium">{formatContactInfo()}</span>
        <br />
        Please enter it below to continue.
      </p>
    </>
  );
};

export default VerificationHeader;
