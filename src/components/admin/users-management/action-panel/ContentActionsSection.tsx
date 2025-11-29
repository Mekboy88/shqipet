
import React from 'react';
import { UserProfile } from '@/types/user';
import { SectionTitle } from './SectionTitle';
import { Button } from '@/components/ui/button';
import { Eye, Image, MessageSquare, Trash2, Download, Flag } from 'lucide-react';
import { toast } from 'sonner';

interface ContentActionsSectionProps {
  user: UserProfile;
  isDarkTheme: boolean;
}

export function ContentActionsSection({ user, isDarkTheme }: ContentActionsSectionProps) {
  const handleContentAction = (action: string) => {
    toast.success(`${action} initiated for user content.`);
  };

  const cardBg = isDarkTheme ? 'bg-white/5' : 'bg-[#F5F2E8]';
  const labelColor = isDarkTheme ? 'text-[#C7C7CC]' : 'text-[#8B7355]';
  const textColor = isDarkTheme ? 'text-white' : 'text-[#2C2928]';
  const dangerColor = isDarkTheme ? '#FF3B30' : '#CC2A1F';

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

  return (
    <div>
      <SectionTitle isDarkTheme={isDarkTheme}>8️⃣ Content Actions</SectionTitle>
      <div className={`${cardBg} rounded-lg p-4 space-y-3`}>
        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={() => handleContentAction('Review Posts')}
            className={`h-11 ${getButtonClasses('primary')} font-medium flex items-center justify-start space-x-3`}
          >
            <Eye size={18} />
            <span>Review User Posts</span>
          </Button>
          
          <Button
            onClick={() => handleContentAction('Review Media')}
            className={`h-11 ${getButtonClasses('primary')} font-medium flex items-center justify-start space-x-3`}
          >
            <Image size={18} />
            <span>Review Uploaded Media</span>
          </Button>
          
          <Button
            onClick={() => handleContentAction('Review Comments')}
            className={`h-11 ${getButtonClasses('primary')} font-medium flex items-center justify-start space-x-3`}
          >
            <MessageSquare size={18} />
            <span>Review Comments</span>
          </Button>
          
          <Button
            onClick={() => handleContentAction('Delete All Content')}
            className={`h-11 ${getButtonClasses('danger')} font-medium flex items-center justify-start space-x-3`}
          >
            <Trash2 size={18} />
            <span>Delete All Content</span>
          </Button>
          
          <div className="flex space-x-2">
            <Button
              onClick={() => handleContentAction('Export JSON')}
              className={`flex-1 h-11 ${getButtonClasses('primary')} font-medium flex items-center justify-center space-x-2`}
            >
              <Download size={18} />
              <span>JSON</span>
            </Button>
            <Button
              onClick={() => handleContentAction('Export CSV')}
              className={`flex-1 h-11 ${getButtonClasses('primary')} font-medium flex items-center justify-center space-x-2`}
            >
              <Download size={18} />
              <span>CSV</span>
            </Button>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <span className={`${labelColor} text-sm`}>Content Flagged Count</span>
            <div className="flex items-center space-x-2">
              <Flag size={16} style={{ color: dangerColor }} />
              <span className={`${textColor} text-sm`}>3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
