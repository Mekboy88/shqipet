
import React, { useRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type EmailTooltipProps = {
  email: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onShowExplanationDialog: (e: React.MouseEvent) => void;
};

const EmailTooltip = ({ email, onChange, onShowExplanationDialog }: EmailTooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimerRef = useRef<number | null>(null);

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);

    // Clear any existing timer
    if (tooltipTimerRef.current) {
      window.clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = null;
    }

    // If opening the tooltip, set a timer to close it after 5 seconds
    if (!showTooltip) {
      tooltipTimerRef.current = window.setTimeout(() => {
        setShowTooltip(false);
        tooltipTimerRef.current = null;
      }, 5000); // 5 seconds
    }
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);

    // Clear any existing timer
    if (tooltipTimerRef.current) {
      window.clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    // Set a timer to close the tooltip after mouse leaves
    tooltipTimerRef.current = window.setTimeout(() => {
      setShowTooltip(false);
      tooltipTimerRef.current = null;
    }, 5000); // 5 seconds
  };

  const handleKuptova = (e: React.MouseEvent) => {
    // Stop event propagation to prevent any parent handlers from being triggered
    e.preventDefault();
    e.stopPropagation();
    
    // Just close the tooltip
    setShowTooltip(false);
    
    // Clear any existing timer
    if (tooltipTimerRef.current) {
      window.clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = null;
    }
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (tooltipTimerRef.current) {
        window.clearTimeout(tooltipTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative group">
      <Input 
        type="email" 
        name="email" 
        placeholder="Adresa e emailit ose numri i telefonit" 
        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" 
        value={email} 
        onChange={onChange} 
        onFocus={toggleTooltip} 
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <TooltipProvider>
          <Tooltip open={showTooltip}>
            <TooltipTrigger asChild>
              <Info 
                className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" 
                onClick={toggleTooltip} 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave} 
              />
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs bg-gray-800 text-white border-gray-700 relative" sideOffset={400} align="start" alignOffset={-50}>
              <div className="absolute right-[-6px] top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-800 rotate-45 border-r border-t border-gray-700"></div>
              <div className="p-2">
                <p className="mb-3">Ju lutemi vini re: Nëse regjistroheni me një numër telefoni, duhet të filloni me kodin e prefiksit të vendit tuaj (p.sh., +355 për Shqipërinë).</p>
                <div className="flex space-x-2 mt-2">
                  <Button 
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-xs rounded" 
                    onClick={handleKuptova}>
                    Kuptova
                  </Button>
                  <Button className="bg-transparent border border-white text-white px-3 py-1 text-xs rounded hover:bg-gray-700" onClick={onShowExplanationDialog}>
                    Shpjego më shumë
                  </Button>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default EmailTooltip;
