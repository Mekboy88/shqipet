
import React, { useState } from 'react';
import { UserProfile } from '@/types/user';
import { SectionTitle } from './SectionTitle';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Save, Plus, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface AdminNotesSectionProps {
  user: UserProfile;
  isDarkTheme: boolean;
}

export function AdminNotesSection({ user, isDarkTheme }: AdminNotesSectionProps) {
  const [notes, setNotes] = useState('');
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState(['VIP', 'Flagged']);

  const mockActivityLogs = [
    { date: '2024-06-15 14:30', action: 'Status changed to Active', admin: 'Admin User', critical: false },
    { date: '2024-06-15 14:25', action: 'Account suspended', admin: 'Admin User', critical: true },
    { date: '2024-06-14 09:15', action: 'Password reset', admin: 'System Admin', critical: false },
  ];

  const handleSaveNotes = () => {
    toast.success('Admin notes saved successfully.');
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
      toast.success('Tag added successfully.');
    }
  };

  const cardBg = isDarkTheme ? 'bg-white/5' : 'bg-[#F5F2E8]';
  const labelColor = isDarkTheme ? 'text-[#C7C7CC]' : 'text-[#8B7355]';
  const textColor = isDarkTheme ? 'text-white' : 'text-[#2C2928]';
  const inputBg = isDarkTheme ? 'bg-[#3A3A3C] border-[#545458] text-white' : 'bg-white border-[#8B7355]/30 text-[#2C2928]';
  const logItemBg = isDarkTheme ? 'bg-white/5' : 'bg-white/50';
  
  const getButtonClasses = (type: 'primary') => {
    return isDarkTheme 
      ? 'bg-[#007AFF] hover:bg-[#0056CC] text-white' 
      : 'bg-[#5A9FD4] hover:bg-[#4A8BC2] text-white';
  };

  const getBadgeClasses = () => {
    return isDarkTheme 
      ? 'bg-[#007AFF] text-white' 
      : 'bg-[#5A9FD4] text-white';
  };

  return (
    <div>
      <SectionTitle isDarkTheme={isDarkTheme}>6️⃣ Admin Notes & History</SectionTitle>
      <div className={`${cardBg} rounded-lg p-4 space-y-4`}>
        <div>
          <label className={`text-sm ${labelColor} block mb-2`}>Admin Notes</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add internal notes about this user..."
            className={`${inputBg} min-h-[100px]`}
          />
          <Button
            onClick={handleSaveNotes}
            className={`mt-2 h-11 ${getButtonClasses('primary')} font-medium flex items-center space-x-2`}
          >
            <Save size={18} />
            <span>Save Notes</span>
          </Button>
        </div>

        <div>
          <label className={`text-sm ${labelColor} block mb-2`}>Admin Private Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <Badge key={index} className={getBadgeClasses()}>
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add new tag..."
              className={inputBg}
            />
            <Button
              onClick={handleAddTag}
              className={`h-10 ${getButtonClasses('primary')} font-medium flex items-center space-x-2`}
            >
              <Plus size={16} />
              <span>Add</span>
            </Button>
          </div>
        </div>

        <div>
          <label className={`text-sm ${labelColor} block mb-2`}>Activity Logs</label>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {mockActivityLogs.map((log, index) => (
              <div key={index} className={`flex items-center space-x-3 p-2 ${logItemBg} rounded`}>
                {log.critical && <div className={`w-2 h-2 rounded-full ${isDarkTheme ? 'bg-[#FF3B30]' : 'bg-[#CC2A1F]'}`}></div>}
                <Clock size={14} className={labelColor} />
                <div className="flex-1">
                  <p className={`${textColor} text-sm`}>{log.action}</p>
                  <p className={`${labelColor} text-xs`}>{log.date} by {log.admin}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
