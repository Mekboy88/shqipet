import React, { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface BlurPromptProps {
  show: boolean;
  message: string;
  fieldId: string;
  onDismiss: () => void;
}

export const BlurPrompt: React.FC<BlurPromptProps> = ({ show, message, fieldId, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div className={`absolute top-full left-0 mt-1 z-50 transition-all duration-300 ${
      show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
    }`}>
      <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 shadow-lg max-w-xs">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
          <p className="text-sm text-orange-700 flex-1">{message}</p>
          <button
            onClick={onDismiss}
            className="text-orange-400 hover:text-orange-600 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
        {/* Pointer */}
        <div className="absolute -top-2 left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-orange-200"></div>
      </div>
    </div>
  );
};