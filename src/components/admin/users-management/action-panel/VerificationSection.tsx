
import React from 'react';
import { UserProfile } from '@/types/user';
import { SectionTitle } from './SectionTitle';
import { CheckCircle2, XCircle } from 'lucide-react';

interface VerificationSectionProps {
  user: UserProfile;
  isDarkTheme: boolean;
}

const VerificationItem: React.FC<{ label: string; isVerified?: boolean; isDarkTheme: boolean }> = ({ label, isVerified, isDarkTheme }) => {
  const labelColor = isDarkTheme ? 'text-[#C7C7CC]' : 'text-[#8B7355]';
  const textColor = isDarkTheme ? 'text-white' : 'text-[#2C2928]';
  const successColor = isDarkTheme ? '#34C759' : '#4A7C3B';
  const errorColor = isDarkTheme ? '#FF3B30' : '#CC2A1F';

  return (
    <div className="flex justify-between items-center py-2">
      <p className={`${labelColor} text-sm font-sans`}>{label}</p>
      <div className="flex items-center space-x-2">
        {isVerified ? (
          <>
            <CheckCircle2 size={18} style={{ color: successColor }} />
            <span className={`${textColor} text-sm`}>Yes</span>
          </>
        ) : (
          <>
            <XCircle size={18} style={{ color: errorColor }} />
            <span className={`${textColor} text-sm`}>No</span>
          </>
        )}
      </div>
    </div>
  );
};

export function VerificationSection({ user, isDarkTheme }: VerificationSectionProps) {
  const cardBg = isDarkTheme ? 'bg-white/5' : 'bg-[#F5F2E8]';
  const dividerColor = isDarkTheme ? 'divide-white/10' : 'divide-[#8B7355]/20';

  return (
    <div>
      <SectionTitle isDarkTheme={isDarkTheme}>3️⃣ Verification</SectionTitle>
      <div className={`${cardBg} rounded-lg p-4 divide-y ${dividerColor}`}>
        <VerificationItem label="Email Verified" isVerified={user.email_verified} isDarkTheme={isDarkTheme} />
        <VerificationItem label="Phone Verified" isVerified={user.phone_verified} isDarkTheme={isDarkTheme} />
        <VerificationItem label="2FA Enabled" isVerified={user.two_factor_enabled} isDarkTheme={isDarkTheme} />
        <VerificationItem label="KYC Verification" isVerified={false} isDarkTheme={isDarkTheme} />
      </div>
    </div>
  );
}
