
import React, { useState } from 'react';
import { UserProfile } from '@/types/user';
import { SectionTitle } from './SectionTitle';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Mail, Smartphone, Bell } from 'lucide-react';
import { toast } from 'sonner';

interface CommunicationSectionProps {
  user: UserProfile;
  isDarkTheme: boolean;
}

export function CommunicationSection({ user, isDarkTheme }: CommunicationSectionProps) {
  const [emailTemplate, setEmailTemplate] = useState('');
  const [smsTemplate, setSmsTemplate] = useState('');

  const handleCommunicationAction = (action: string, template?: string) => {
    toast.success(`${action} ${template ? `using ${template} template` : ''} initiated.`);
  };

  const cardBg = isDarkTheme ? 'bg-white/5' : 'bg-[#F5F2E8]';
  const selectBg = isDarkTheme ? 'bg-[#3A3A3C] border-[#545458] text-white' : 'bg-white border-[#8B7355]/30 text-[#2C2928]';
  const selectContentBg = isDarkTheme ? 'bg-[#1E1E1E] text-white border-[#545458]' : 'bg-white text-[#2C2928] border-[#8B7355]/30';

  const getButtonClasses = (type: 'primary' | 'warning') => {
    if (isDarkTheme) {
      switch (type) {
        case 'primary': return 'bg-[#007AFF] hover:bg-[#0056CC] text-white';
        case 'warning': return 'bg-[#FF9500] hover:bg-[#E6850E] text-white';
      }
    } else {
      switch (type) {
        case 'primary': return 'bg-[#5A9FD4] hover:bg-[#4A8BC2] text-white';
        case 'warning': return 'bg-[#D4941A] hover:bg-[#B8820A] text-white';
      }
    }
  };

  return (
    <div>
      <SectionTitle isDarkTheme={isDarkTheme}>1️⃣1️⃣ Communication Actions</SectionTitle>
      <div className={`${cardBg} rounded-lg p-4 space-y-3`}>
        <Button
          onClick={() => handleCommunicationAction('Direct Message')}
          className={`w-full h-11 ${getButtonClasses('primary')} font-medium flex items-center justify-start space-x-3`}
        >
          <MessageSquare size={18} />
          <span>Send Direct Admin Message</span>
        </Button>
        
        <div className="flex space-x-2">
          <Select value={emailTemplate} onValueChange={setEmailTemplate}>
            <SelectTrigger className={`flex-1 ${selectBg}`}>
              <SelectValue placeholder="Email Template" />
            </SelectTrigger>
            <SelectContent className={selectContentBg}>
              <SelectItem value="welcome">Welcome Email</SelectItem>
              <SelectItem value="warning">Warning Notice</SelectItem>
              <SelectItem value="suspension">Suspension Notice</SelectItem>
              <SelectItem value="custom">Custom Message</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => handleCommunicationAction('Email Notification', emailTemplate)}
            className={`h-11 ${getButtonClasses('primary')} font-medium flex items-center space-x-2`}
          >
            <Mail size={18} />
            <span>Send</span>
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Select value={smsTemplate} onValueChange={setSmsTemplate}>
            <SelectTrigger className={`flex-1 ${selectBg}`}>
              <SelectValue placeholder="SMS Template" />
            </SelectTrigger>
            <SelectContent className={selectContentBg}>
              <SelectItem value="verification">Verification Code</SelectItem>
              <SelectItem value="alert">Security Alert</SelectItem>
              <SelectItem value="reminder">Payment Reminder</SelectItem>
              <SelectItem value="custom">Custom SMS</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => handleCommunicationAction('SMS Notification', smsTemplate)}
            className={`h-11 ${getButtonClasses('primary')} font-medium flex items-center space-x-2`}
          >
            <Smartphone size={18} />
            <span>Send</span>
          </Button>
        </div>
        
        <Button
          onClick={() => handleCommunicationAction('Admin Reminder')}
          className={`w-full h-11 ${getButtonClasses('warning')} font-medium flex items-center justify-start space-x-3`}
        >
          <Bell size={18} />
          <span>Add Admin Reminder</span>
        </Button>
      </div>
    </div>
  );
}
