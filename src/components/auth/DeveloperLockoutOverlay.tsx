import React, { useState, useEffect } from 'react';
import { Construction, Wrench, Clock } from 'lucide-react';

interface DeveloperLockoutOverlayProps {
  showCountdown?: boolean;
  returnTimeHours?: number;
}

const DeveloperLockoutOverlay: React.FC<DeveloperLockoutOverlayProps> = ({ 
  showCountdown = false, 
  returnTimeHours = 2 
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!showCountdown) return;

    const targetTime = new Date();
    targetTime.setHours(targetTime.getHours() + returnTimeHours);

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetTime.getTime() - now.getTime();
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft('00:00:00');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [showCountdown, returnTimeHours]);

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center overflow-hidden">
      {/* Animated Construction Icons */}
      <div className="relative mb-6 sm:mb-8">
        <div className="flex space-x-3 sm:space-x-4 animate-pulse">
          <Construction className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500" />
          <Wrench className="w-12 h-12 sm:w-16 sm:h-16 text-orange-600" />
        </div>
        <div className="absolute -inset-3 sm:-inset-4 bg-orange-100 rounded-full opacity-20 animate-ping"></div>
      </div>

      {/* Albanian Message */}
      <div className="mb-4 sm:mb-6 px-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-3 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-lg sm:text-2xl md:text-3xl">🔧</span>
          <span className="text-center leading-tight">Shqipet.com është nën mirëmbajtje aktualisht</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto leading-relaxed">
          Ju lutemi kthehuni më vonë pasi po bëjmë përditësime dhe përmirësime.
        </p>
      </div>

      {/* English Message */}
      <div className="mb-6 sm:mb-8 px-2">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-base sm:text-lg">🚧</span>
          <span className="text-center leading-tight">Shqipet.com is currently under maintenance</span>
        </h2>
        <p className="text-sm sm:text-base text-gray-500 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto leading-relaxed">
          Please check back soon while we perform updates and improvements.
        </p>
      </div>

      {/* Countdown Timer */}
      {showCountdown && timeLeft && (
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl border-2 border-orange-200 w-full max-w-sm sm:max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            <span className="text-xs sm:text-sm font-medium text-orange-800">Website returns in:</span>
          </div>
          <div className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-orange-700 tracking-wider">
            {timeLeft}
          </div>
        </div>
      )}

      {/* Decorative Elements */}
      <div className="flex space-x-2 opacity-60 mb-4 sm:mb-0">
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 sm:bottom-8 text-xs text-gray-400 px-4 text-center">
        Faleminderit për durimin tuaj • Thank you for your patience
      </div>
    </div>
  );
};

export default DeveloperLockoutOverlay;