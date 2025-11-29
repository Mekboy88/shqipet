
import React from 'react';
import { X, Sun, Moon } from 'lucide-react';

interface ActionPanelHeaderProps {
  title: string;
  onClose: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

export function ActionPanelHeader({ title, onClose, isDarkTheme, onToggleTheme }: ActionPanelHeaderProps) {
  const textColor = isDarkTheme ? 'text-white' : 'text-[#2C2928]';
  const iconColor = isDarkTheme ? 'text-gray-400 hover:text-white' : 'text-[#8B7355] hover:text-[#2C2928]';
  const borderColor = isDarkTheme ? 'border-white/10' : 'border-[#8B7355]/20';

  return (
    <div className={`flex justify-between items-center pb-4 mb-4 border-b ${borderColor}`}>
      <h2 className={`text-xl font-semibold ${textColor} font-sans`}>{title}</h2>
      
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-lg transition-all duration-300 ${
            isDarkTheme 
              ? 'bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white' 
              : 'bg-[#8B7355]/10 hover:bg-[#8B7355]/20 text-[#8B7355] hover:text-[#2C2928]'
          }`}
          aria-label="Toggle theme"
        >
          {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className={`${iconColor} transition-colors`}
          aria-label="Close panel"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
