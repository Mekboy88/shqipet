import React from 'react';
import { useSessionRevocationMonitor } from '@/hooks/useSessionRevocationMonitor';

const GlobalSessionRevocationMonitor: React.FC = () => {
  // Hook subscribes to realtime revocation and session delete events
  useSessionRevocationMonitor();
  return null;
};

export default GlobalSessionRevocationMonitor;
