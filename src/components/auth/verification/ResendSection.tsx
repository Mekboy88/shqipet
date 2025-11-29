
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ResendSectionProps {
  canResend: boolean;
  timeLeft: number;
  onResend: () => void;
  isGenerating: boolean;
}

const ResendSection = ({ 
  canResend, 
  timeLeft, 
  onResend, 
  isGenerating
}: ResendSectionProps) => {
  return (
    <div className="text-center space-y-2">
      <p className="text-facebook-gray">
        Didn't receive the code? 
        {!canResend && timeLeft > 0 && (
          <span className="ml-1">Resend in {timeLeft}s</span>
        )}
      </p>
      
      <Button
        type="button"
        variant="link"
        className={`fb-link ${!canResend || isGenerating ? 'opacity-50 cursor-not-allowed' : ''} flex items-center justify-center mx-auto`}
        disabled={!canResend || isGenerating}
        onClick={onResend}
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} /> 
        {isGenerating ? 'Sending...' : 'Resend Code'}
      </Button>
    </div>
  );
};

export default ResendSection;
