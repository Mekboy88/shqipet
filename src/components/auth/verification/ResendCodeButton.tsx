
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ResendCodeButtonProps {
  canResend: boolean;
  isLocked: boolean;
  timeLeft: number;
  onResend: () => void;
}

const ResendCodeButton = ({ canResend, isLocked, timeLeft, onResend }: ResendCodeButtonProps) => {
  const [isRotating, setIsRotating] = useState(false);

  const handleResend = async () => {
    if (!canResend || isLocked) return;
    
    setIsRotating(true);
    await onResend();
    
    // Stop rotation after animation completes
    setTimeout(() => {
      setIsRotating(false);
    }, 1000);
  };

  return (
    <div className="text-center">
      <p className="text-facebook-gray mb-4">
        Didn't receive the code? 
        {!canResend && !isLocked && timeLeft > 0 && (
          <span className="ml-1 text-muted-foreground">Resend in {timeLeft}s</span>
        )}
      </p>
      
      <Button
        type="button"
        variant={canResend && !isLocked ? "default" : "secondary"}
        size="lg"
        className={`
          ${canResend && !isLocked 
            ? 'bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-lg hover:shadow-xl' 
            : 'opacity-50 cursor-not-allowed bg-muted text-muted-foreground'
          } 
          flex items-center justify-center mx-auto px-6 py-3 rounded-full 
          transition-all duration-300 ease-in-out transform hover:scale-105
          ${canResend && !isLocked ? 'animate-fade-in' : ''}
        `}
        disabled={!canResend || isLocked}
        onClick={handleResend}
      >
        <RefreshCw 
          className={`mr-2 h-5 w-5 transition-transform duration-1000 ease-in-out ${
            isRotating ? 'animate-spin' : ''
          }`} 
        /> 
        <span className="font-medium">
          {isRotating ? 'Sending...' : 'Resend Code'}
        </span>
      </Button>
    </div>
  );
};

export default ResendCodeButton;
