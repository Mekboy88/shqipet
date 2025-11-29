
import React from 'react';
import { UserProfile } from '@/types/user';
import { SectionTitle } from './SectionTitle';
import { Button } from '@/components/ui/button';
import { Download, FileText, Database } from 'lucide-react';
import { toast } from 'sonner';

interface BackupActionsSectionProps {
  user: UserProfile;
  isDarkTheme: boolean;
}

export function BackupActionsSection({ user, isDarkTheme }: BackupActionsSectionProps) {
  const handleBackupAction = (action: string) => {
    toast.success(`${action} initiated.`);
  };

  const cardBg = isDarkTheme ? 'bg-white/5' : 'bg-[#F5F2E8]';

  const getButtonClasses = () => {
    return isDarkTheme 
      ? 'bg-[#007AFF] hover:bg-[#0056CC] text-white' 
      : 'bg-[#5A9FD4] hover:bg-[#4A8BC2] text-white';
  };

  return (
    <div>
      <SectionTitle isDarkTheme={isDarkTheme}>🔟 Backup Actions</SectionTitle>
      <div className={`${cardBg} rounded-lg p-4 space-y-3`}>
        <Button
          onClick={() => handleBackupAction('Export Full Profile')}
          className={`w-full h-11 ${getButtonClasses()} font-medium flex items-center justify-start space-x-3`}
        >
          <FileText size={18} />
          <span>Export Full User Profile (JSON)</span>
        </Button>
        
        <Button
          onClick={() => handleBackupAction('Backup Activity Logs')}
          className={`w-full h-11 ${getButtonClasses()} font-medium flex items-center justify-start space-x-3`}
        >
          <Database size={18} />
          <span>Backup Activity Logs (CSV)</span>
        </Button>
      </div>
    </div>
  );
}
