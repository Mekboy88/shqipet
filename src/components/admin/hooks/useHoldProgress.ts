
import { useState, useRef, useCallback } from 'react';

export const useHoldProgress = () => {
  const [isHolding, setIsHolding] = useState<string | null>(null);
  const [holdProgress, setHoldProgress] = useState<number>(0);
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startHoldProgress = useCallback((itemId: string) => {
    let progress = 0;
    setHoldProgress(0);
    
    progressIntervalRef.current = setInterval(() => {
      progress += 3.33;
      setHoldProgress(Math.min(progress, 100));
      
      if (progress >= 100) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      }
    }, 100);
  }, []);

  const stopHoldProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setHoldProgress(0);
  }, []);

  const clearHoldTimeout = useCallback(() => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
  }, []);

  return {
    isHolding,
    setIsHolding,
    holdProgress,
    holdTimeoutRef,
    startHoldProgress,
    stopHoldProgress,
    clearHoldTimeout
  };
};
