
import React from 'react';
import { UserProfile } from '@/types/user';
import { SectionTitle } from './SectionTitle';
import { DetailItem } from './DetailItem';
import { Badge } from '@/components/ui/badge';

interface FinancialSectionProps {
  user: UserProfile;
  isDarkTheme: boolean;
}

export function FinancialSection({ user, isDarkTheme }: FinancialSectionProps) {
  const cardBg = isDarkTheme ? 'bg-white/5' : 'bg-[#F5F2E8]';
  const successColor = isDarkTheme ? '#34C759' : '#4A7C3B';
  const warningColor = isDarkTheme ? '#FF9500' : '#D4941A';
  
  const getSuccessBadgeClasses = () => {
    return isDarkTheme 
      ? 'bg-[#34C759] text-white' 
      : 'bg-[#4A7C3B] text-white';
  };

  return (
    <div>
      <SectionTitle isDarkTheme={isDarkTheme}>7️⃣ Financial Section</SectionTitle>
      <div className={`${cardBg} rounded-lg p-4 space-y-2`}>
        <DetailItem 
          label="Total Payments Made" 
          value={<span style={{ color: successColor }}>$2,450.00</span>} 
          isDarkTheme={isDarkTheme}
        />
        <DetailItem 
          label="Active Subscriptions" 
          value={<Badge className={getSuccessBadgeClasses()}>Premium Plan</Badge>} 
          isDarkTheme={isDarkTheme}
        />
        <DetailItem label="Last Payment Date" value="June 10, 2024" isDarkTheme={isDarkTheme} />
        <DetailItem 
          label="Payment Status" 
          value={<Badge className={getSuccessBadgeClasses()}>Active</Badge>} 
          isDarkTheme={isDarkTheme}
        />
        <DetailItem 
          label="Outstanding Invoices" 
          value={<span style={{ color: warningColor }}>$0.00</span>} 
          isDarkTheme={isDarkTheme}
        />
        <DetailItem label="Linked Payment Methods" value="Visa ***4242" isDarkTheme={isDarkTheme} />
      </div>
    </div>
  );
}
