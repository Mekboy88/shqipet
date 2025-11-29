
import React, { useState } from 'react';
import { UserProfile } from '@/types/user';
import { ActionPanelHeader } from './action-panel/ActionPanelHeader';
import { UserDetailsSection } from './action-panel/UserDetailsSection';
import { AccountStatusSection } from './action-panel/AccountStatusSection';
import { VerificationSection } from './action-panel/VerificationSection';
import { UserPermissionsSection } from './action-panel/UserPermissionsSection';
import { SecurityActionsSection } from './action-panel/SecurityActionsSection';
import { AdminNotesSection } from './action-panel/AdminNotesSection';
import { FinancialSection } from './action-panel/FinancialSection';
import { ContentActionsSection } from './action-panel/ContentActionsSection';
import { LegalSection } from './action-panel/LegalSection';
import { BackupActionsSection } from './action-panel/BackupActionsSection';
import { CommunicationSection } from './action-panel/CommunicationSection';

interface UserActionPanelProps {
  user: UserProfile | null;
  onClose: () => void;
  onStatusChange: (userId: string, status: string, reason: string) => Promise<void>;
  onRoleChange: (userId: string, role: string) => Promise<void>;
}

export function UserActionPanel({ user, onClose, onStatusChange, onRoleChange }: UserActionPanelProps) {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const themeClasses = isDarkTheme 
    ? 'bg-[#1E1E1E]' 
    : 'bg-[#FAF7F0]';

  return (
    <div className={`fixed inset-0 z-50 ${!user ? 'pointer-events-none' : ''}`}>
      {/* Overlay */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ease-in-out ${user ? 'bg-opacity-60' : 'bg-opacity-0'}`} 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-6xl ${themeClasses} rounded-l-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] transform transition-all duration-300 ease-in-out z-50 flex flex-col ${user ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {user && (
          <div className="p-6 lg:p-8 overflow-y-auto flex-grow" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            <ActionPanelHeader 
              title="Admin User Actions" 
              onClose={onClose}
              isDarkTheme={isDarkTheme}
              onToggleTheme={toggleTheme}
            />
            
            <div className="space-y-8">
              {/* Top Row - User Details and Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <UserDetailsSection user={user} isDarkTheme={isDarkTheme} />
                </div>
                <div className="space-y-6">
                  <AccountStatusSection user={user} onStatusChange={onStatusChange} isDarkTheme={isDarkTheme} />
                  <VerificationSection user={user} isDarkTheme={isDarkTheme} />
                  <UserPermissionsSection user={user} onRoleChange={onRoleChange} isDarkTheme={isDarkTheme} />
                </div>
              </div>

              {/* Divider */}
              <div className={`border-t ${isDarkTheme ? 'border-white/10' : 'border-[#8B7355]/20'}`}></div>

              {/* Security and Admin Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SecurityActionsSection user={user} isDarkTheme={isDarkTheme} />
                <AdminNotesSection user={user} isDarkTheme={isDarkTheme} />
              </div>

              {/* Divider */}
              <div className={`border-t ${isDarkTheme ? 'border-white/10' : 'border-[#8B7355]/20'}`}></div>

              {/* Financial and Content Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FinancialSection user={user} isDarkTheme={isDarkTheme} />
                <ContentActionsSection user={user} isDarkTheme={isDarkTheme} />
              </div>

              {/* Divider */}
              <div className={`border-t ${isDarkTheme ? 'border-white/10' : 'border-[#8B7355]/20'}`}></div>

              {/* Legal and System Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <LegalSection user={user} isDarkTheme={isDarkTheme} />
                <BackupActionsSection user={user} isDarkTheme={isDarkTheme} />
                <CommunicationSection user={user} isDarkTheme={isDarkTheme} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
