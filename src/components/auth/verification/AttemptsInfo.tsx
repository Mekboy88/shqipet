
import React from 'react';

interface AttemptsInfoProps {
  attempts: number;
  maxAttempts: number;
  isLocked: boolean;
}

const AttemptsInfo = ({ attempts, maxAttempts, isLocked }: AttemptsInfoProps) => {
  if (attempts === 0 || isLocked) return null;
  
  return (
    <p className="text-sm text-amber-600 mt-2">
      Attempt {attempts} of {maxAttempts}. {maxAttempts - attempts} attempts remaining.
    </p>
  );
};

export default AttemptsInfo;
