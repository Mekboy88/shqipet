
import React, { useState } from 'react';
import { UserProfile } from '@/types/user';
import { SectionTitle } from './SectionTitle';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw, Key, Lock, Unlock, Ban, Clock, Shield, UserX } from 'lucide-react';
import { toast } from 'sonner';

interface SecurityActionsSectionProps {
  user: UserProfile;
  isDarkTheme: boolean;
}

export function SecurityActionsSection({ user, isDarkTheme }: SecurityActionsSectionProps) {
  const [suspendDuration, setSuspendDuration] = useState('1');

  const handleSecurityAction = async (action: string, duration?: string) => {
    try {
      console.log(`Performing security action: ${action} for user ${user.id}`, duration && `Duration: ${duration}`);
      toast.success(`${action} action initiated for user.`);
    } catch (error: any) {
      toast.error(`Failed to perform ${action}:`, error.message);
    }
  };

  const cardBg = isDarkTheme ? 'bg-white/5' : 'bg-[#F5F2E8]';
  const selectBg = isDarkTheme ? 'bg-[#3A3A3C] border-[#545458] text-white' : 'bg-white border-[#8B7355]/30 text-[#2C2928]';
  const selectContentBg = isDarkTheme ? 'bg-[#1E1E1E] text-white border-[#545458]' : 'bg-white text-[#2C2928] border-[#8B7355]/30';

  const getButtonClasses = (type: 'primary' | 'warning' | 'danger') => {
    if (isDarkTheme) {
      switch (type) {
        case 'primary': return 'bg-[#007AFF] hover:bg-[#0056CC] text-white';
        case 'warning': return 'bg-[#FF9500] hover:bg-[#E6850E] text-white';
        case 'danger': return 'bg-[#FF3B30] hover:bg-[#D70015] text-white';
      }
    } else {
      switch (type) {
        case 'primary': return 'bg-[#5A9FD4] hover:bg-[#4A8BC2] text-white';
        case 'warning': return 'bg-[#D4941A] hover:bg-[#B8820A] text-white';
        case 'danger': return 'bg-[#CC2A1F] hover:bg-[#A8221A] text-white';
      }
    }
  };

  return (
    <div>
      <SectionTitle isDarkTheme={isDarkTheme}>5️⃣ Security Actions</SectionTitle>
      <div className={`${cardBg} rounded-lg p-4 space-y-3`}>
        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={() => handleSecurityAction('Reset Password')}
            className={`h-11 ${getButtonClasses('primary')} font-medium flex items-center justify-start space-x-3`}
          >
            <RotateCcw size={18} />
            <span>Reset Password</span>
          </Button>
          
          <Button
            onClick={() => handleSecurityAction('Force Logout')}
            className={`h-11 ${getButtonClasses('primary')} font-medium flex items-center justify-start space-x-3`}
          >
            <Key size={18} />
            <span>Force Logout from All Devices</span>
          </Button>
          
          <Button
            onClick={() => handleSecurityAction('Lock Account')}
            className={`h-11 ${getButtonClasses('warning')} font-medium flex items-center justify-start space-x-3`}
          >
            <Lock size={18} />
            <span>Lock Account</span>
          </Button>
          
          <Button
            onClick={() => handleSecurityAction('Unlock Account')}
            className={`h-11 ${getButtonClasses('warning')} font-medium flex items-center justify-start space-x-3`}
          >
            <Unlock size={18} />
            <span>Unlock Account</span>
          </Button>
          
          <Button
            onClick={() => handleSecurityAction('Ban User')}
            className={`h-11 ${getButtonClasses('danger')} font-medium flex items-center justify-start space-x-3`}
          >
            <Ban size={18} />
            <span>Ban User (Permanent)</span>
          </Button>
          
          <div className="flex space-x-2">
            <Select value={suspendDuration} onValueChange={setSuspendDuration}>
              <SelectTrigger className={`flex-1 ${selectBg}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={selectContentBg}>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => handleSecurityAction('Temporary Suspend', suspendDuration)}
              className={`h-11 ${getButtonClasses('warning')} font-medium flex items-center space-x-2`}
            >
              <Clock size={18} />
              <span>Suspend</span>
            </Button>
          </div>
          
          <Button
            onClick={() => handleSecurityAction('Disable Login')}
            className={`h-11 ${getButtonClasses('warning')} font-medium flex items-center justify-start space-x-3`}
          >
            <UserX size={18} />
            <span>Disable Login Temporarily</span>
          </Button>
          
          <Button
            onClick={() => handleSecurityAction('Enable Manual Review')}
            className={`h-11 ${getButtonClasses('primary')} font-medium flex items-center justify-start space-x-3`}
          >
            <Shield size={18} />
            <span>Enable Manual Review Flag</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
