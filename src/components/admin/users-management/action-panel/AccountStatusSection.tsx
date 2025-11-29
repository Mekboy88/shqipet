
import React from 'react';
import { UserProfile, accountStatusOptions } from '@/types/user';
import { SectionTitle } from './SectionTitle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, XCircle, Ban, Clock, Lock, ShieldQuestion } from 'lucide-react';
import { toast } from 'sonner';

interface AccountStatusSectionProps {
  user: UserProfile;
  onStatusChange: (userId: string, status: string, reason: string) => Promise<void>;
  isDarkTheme: boolean;
}

const statusVisuals: { [key: string]: { icon: React.ElementType, color: string, label: string } } = {
  active: { icon: CheckCircle2, color: '#34C759', label: 'Active' },
  suspended: { icon: XCircle, color: '#FF3B30', label: 'Suspended' },
  banned: { icon: Ban, color: '#A40000', label: 'Banned' },
  pending: { icon: Clock, color: '#FF9500', label: 'Pending Verification' },
  locked: { icon: Lock, color: '#FFD60A', label: 'Locked' },
  deactivated: { icon: XCircle, color: '#8E8E93', label: 'Deactivated' },
};

export function AccountStatusSection({ user, onStatusChange, isDarkTheme }: AccountStatusSectionProps) {
  const currentStatus = user.account_status || 'pending';
  const visual = statusVisuals[currentStatus] || { icon: ShieldQuestion, color: '#8E8E93', label: 'Unknown' };
  const Icon = visual.icon;

  // Check if user is super admin - disable status changes for super admins
  const isProtectedUser = user.role === 'super_admin' || user.role === 'supreme_super_admin';

  const handleStatusChange = async (newStatus: string) => {
    if (isProtectedUser) {
      toast.error('Cannot change status of Super Admin users');
      return;
    }
    
    try {
      await onStatusChange(user.id, newStatus, `Status changed to ${newStatus} from admin panel.`);
      toast.success(`User status updated to ${newStatus}.`);
    } catch (error: any) {
      toast.error('Failed to update status:', error.message);
    }
  };

  const cardBg = isDarkTheme ? 'bg-white/5' : 'bg-[#F5F2E8]';
  const textColor = isDarkTheme ? 'text-white' : 'text-[#2C2928]';
  const labelColor = isDarkTheme ? 'text-[#C7C7CC]' : 'text-[#8B7355]';
  const selectBg = isDarkTheme ? 'bg-[#3A3A3C] border-[#545458] text-white' : 'bg-white border-[#8B7355]/30 text-[#2C2928]';
  const selectContentBg = isDarkTheme ? 'bg-[#1E1E1E] text-white border-[#545458]' : 'bg-white text-[#2C2928] border-[#8B7355]/30';
  
  return (
    <div>
      <SectionTitle isDarkTheme={isDarkTheme}>2️⃣ Account Status</SectionTitle>
      <div className={`${cardBg} rounded-lg p-4 space-y-4`}>
        <div className="flex items-center space-x-3">
          <div 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: visual.color }}
          />
          <Icon 
            size={24} 
            style={{ color: visual.color }} 
          />
          <span className={`${textColor} font-semibold`}>{visual.label}</span>
          {isProtectedUser && (
            <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full border border-red-500/30">
              Protected
            </span>
          )}
        </div>
        <div>
          <label className={`text-sm ${labelColor} block mb-2`}>
            Change Status {isProtectedUser && '(Disabled - Super Admin)'}
          </label>
          <Select 
            value={currentStatus} 
            onValueChange={handleStatusChange}
            disabled={isProtectedUser}
          >
            <SelectTrigger className={`w-full ${selectBg} ${isProtectedUser ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent className={selectContentBg}>
              {accountStatusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
