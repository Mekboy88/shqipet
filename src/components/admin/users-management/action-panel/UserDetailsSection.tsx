
import React from 'react';
import { UserProfile } from '@/types/user';
import { DetailItem } from './DetailItem';
import { format } from 'date-fns';
import { SectionTitle } from './SectionTitle';

interface UserDetailsSectionProps {
  user: UserProfile;
  isDarkTheme: boolean;
}

export function UserDetailsSection({ user, isDarkTheme }: UserDetailsSectionProps) {
  return (
    <div className="mb-6">
      <SectionTitle isDarkTheme={isDarkTheme}>1️⃣ User Details</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <div>
          <DetailItem 
            label="Full Name" 
            value={`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A'} 
            isDarkTheme={isDarkTheme}
          />
          <DetailItem label="Username" value={user.username} isDarkTheme={isDarkTheme} />
          <DetailItem 
            label="User ID (UUID)" 
            value={user.id ? <span className="font-mono text-xs">{user.id}</span> : 'N/A'} 
            isDarkTheme={isDarkTheme}
          />
          <DetailItem label="Email" value={user.email} isDarkTheme={isDarkTheme} />
          <DetailItem label="Phone Number" value={user.phone_number} isDarkTheme={isDarkTheme} />
        </div>
        <div>
          <DetailItem 
            label="Date of Registration" 
            value={user.created_at ? format(new Date(user.created_at), 'MMM dd, yyyy, p') : 'N/A'} 
            isDarkTheme={isDarkTheme}
          />
          <DetailItem 
            label="Date of Last Login" 
            value={user.last_login ? format(new Date(user.last_login), 'MMM dd, yyyy, p') : 'N/A'} 
            isDarkTheme={isDarkTheme}
          />
          <DetailItem label="Total Login Count" value="N/A" isDarkTheme={isDarkTheme} />
          <DetailItem label="User IP (Last Login)" value={user.last_ip_address} isDarkTheme={isDarkTheme} />
          <DetailItem label="Device Used (Last Login)" value={user.last_device} isDarkTheme={isDarkTheme} />
        </div>
      </div>
    </div>
  );
}
