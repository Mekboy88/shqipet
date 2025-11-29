import React from 'react';
import { NotificationSettingsProvider } from '@/contexts/NotificationSettingsContext';
import NotificationPanel from './NotificationPanel';

interface NotificationPanelWrapperProps {
  isOpen: boolean;
  onClose: () => void;
}

// This wrapper ensures the NotificationPanel always has access to the NotificationSettings context
const NotificationPanelWrapper: React.FC<NotificationPanelWrapperProps> = ({ isOpen, onClose }) => {
  return (
    <NotificationSettingsProvider>
      <NotificationPanel isOpen={isOpen} onClose={onClose} />
    </NotificationSettingsProvider>
  );
};

export default NotificationPanelWrapper;