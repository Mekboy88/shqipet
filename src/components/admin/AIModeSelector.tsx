import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type AIModeType = 'luna_gpt5' | 'luna_only' | 'gpt5_only';

interface AIModeOption {
  value: AIModeType;
  label: string;
  description: string;
}

const AI_MODE_OPTIONS: AIModeOption[] = [
  {
    value: 'luna_gpt5',
    label: 'Luna AI & GPT 5',
    description: 'Luna learns from GPT 5 and collaborates'
  },
  {
    value: 'luna_only',
    label: 'Luna',
    description: 'Only Luna AI processes requests'
  },
  {
    value: 'gpt5_only',
    label: 'GPT 5',
    description: 'Only GPT 5 processes requests'
  }
];

interface AIModeProps {
  currentMode: AIModeType;
  onModeChange: (mode: AIModeType) => void;
}

const SparkleIcon = ({ className }: { className?: string }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 32 32" 
    className={className}
    fill="none"
  >
    <path 
      d="M17.9,9.9c-4.6,0.9-6,2.3-6.9,6.9c-0.9-4.6-2.3-6-6.9-6.9C8.7,9,10.1,7.6,11,3C11.9,7.6,13.3,9,17.9,9.9z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M21.8,25c-3.2,0.6-4.1,1.6-4.8,4.8c-0.6-3.2-1.6-4.1-4.8-4.8c3.2-0.6,4.1-1.6,4.8-4.8 C17.6,23.4,18.6,24.4,21.8,25z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M29,15c-2.6,0.5-3.4,1.3-3.9,3.9c-0.5-2.6-1.3-3.4-3.9-3.9c2.6-0.5,3.4-1.3,3.9-3.9C25.6,13.7,26.4,14.5,29,15z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <line x1="5" y1="23" x2="5" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="28" y1="6" x2="28" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const AIModeSelector: React.FC<AIModeProps> = ({ currentMode, onModeChange }) => {
  const currentOption = AI_MODE_OPTIONS.find(option => option.value === currentMode) || AI_MODE_OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors">
        <SparkleIcon className="flex-shrink-0 text-blue-500" />
        <div className="flex flex-col text-left">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentOption.label}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {currentOption.description}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
        {AI_MODE_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onModeChange(option.value)}
            className={`flex flex-col items-start gap-1 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
              currentMode === option.value ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
          >
            <div className="flex items-center gap-2 w-full">
              <span className="font-medium text-gray-900 dark:text-white">
                {option.label}
              </span>
              {currentMode === option.value && (
                <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto" />
              )}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {option.description}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AIModeSelector;