
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Cookie } from 'lucide-react';

interface CookiesActionButtonsProps {
  onAllowAll: () => void;
  onDeclineOptional: () => void;
}

const CookiesActionButtons: React.FC<CookiesActionButtonsProps> = ({ 
  onAllowAll, 
  onDeclineOptional 
}) => {
  return (
    <div className="flex flex-row justify-between gap-3 w-full sticky bottom-0 bg-white p-4 border-t border-gray-200">
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 py-3"
        onClick={onDeclineOptional}
      >
        <X className="h-4 w-4" />
        Decline optional cookies
      </Button>
      
      <Button
        className="w-full bg-facebook-primary hover:bg-facebook-hover flex items-center justify-center gap-2 py-3"
        onClick={onAllowAll}
      >
        <Check className="h-4 w-4" />
        Allow all cookies
      </Button>
    </div>
  );
};

export default CookiesActionButtons;
