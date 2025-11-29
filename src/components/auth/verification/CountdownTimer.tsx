
import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  initialTime: number;
  onComplete: () => void;
  isActive?: boolean;
}

const CountdownTimer = ({ initialTime, onComplete, isActive = true }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  
  useEffect(() => {
    if (!isActive) return;
    
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft, onComplete, isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return <span>{formatTime(timeLeft)}</span>;
};

export default CountdownTimer;
