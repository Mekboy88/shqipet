
import React from 'react';
import { UserProfile } from '@/types/user';
import { SectionTitle } from './SectionTitle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Trash2, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface LegalSectionProps {
  user: UserProfile;
  isDarkTheme: boolean;
}

export function LegalSection({ user, isDarkTheme }: LegalSectionProps) {
  const handleLegalAction = (action: string) => {
    toast.success(`${action} request initiated.`);
  };

  const cardBg = isDarkTheme ? 'bg-white/5' : 'bg-[#F5F2E8]';
  const labelColor = isDarkTheme ? 'text-[#C7C7CC]' : 'text-[#8B7355]';

  const getButtonClasses = (type: 'primary' | 'danger') => {
    if (isDarkTheme) {
      switch (type) {
        case 'primary': return 'bg-[#007AFF] hover:bg-[#0056CC] text-white';
        case 'danger': return 'bg-[#FF3B30] hover:bg-[#D70015] text-white';
      }
    } else {
      switch (type) {
        case 'primary': return 'bg-[#5A9FD4] hover:bg-[#4A8BC2] text-white';
        case 'danger': return 'bg-[#CC2A1F] hover:bg-[#A8221A] text-white';
      }
    }
  };

  const getSuccessBadgeClasses = () => {
    return isDarkTheme 
      ? 'bg-[#34C759] text-white' 
      : 'bg-[#4A7C3B] text-white';
  };

  return (
    <div>
      <SectionTitle isDarkTheme={isDarkTheme}>9️⃣ Legal Section</SectionTitle>
      <div className={`${cardBg} rounded-lg p-4 space-y-3`}>
        <Button
          onClick={() => handleLegalAction('GDPR Download')}
          className={`w-full h-11 ${getButtonClasses('primary')} font-medium flex items-center justify-start space-x-3`}
        >
          <Download size={18} />
          <span>GDPR Download All Data</span>
        </Button>
        
        <Button
          onClick={() => handleLegalAction('GDPR Delete')}
          className={`w-full h-11 ${getButtonClasses('danger')} font-medium flex items-center justify-start space-x-3`}
        >
          <Trash2 size={18} />
          <span>GDPR Delete All Data</span>
        </Button>
        
        <div className="flex items-center justify-between py-2">
          <span className={`${labelColor} text-sm`}>GDPR Consent Status</span>
          <Badge className={getSuccessBadgeClasses()}>
            <Shield size={14} className="mr-1" />
            Granted
          </Badge>
        </div>
      </div>
    </div>
  );
}
