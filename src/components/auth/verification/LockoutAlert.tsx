
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LockoutAlertProps {
  lockTimeLeft: number;
}

const LockoutAlert = ({ lockTimeLeft }: LockoutAlertProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertDescription>
        Account temporarily locked due to too many failed attempts. 
        Please try again in {formatTime(lockTimeLeft)}.
      </AlertDescription>
    </Alert>
  );
};

export default LockoutAlert;
