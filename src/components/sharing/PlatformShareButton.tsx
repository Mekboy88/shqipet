import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface PlatformShareButtonProps {
  platform: string;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'secondary';
}

const PlatformShareButton: React.FC<PlatformShareButtonProps> = ({
  platform,
  icon: Icon,
  label,
  onClick,
  disabled = false,
  variant = 'outline'
}) => {
  const getPlatformColor = () => {
    switch (platform) {
      case 'facebook':
        return 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600';
      case 'twitter':
        return 'hover:bg-sky-50 hover:border-sky-200 hover:text-sky-600';
      case 'linkedin':
        return 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700';
      case 'whatsapp':
        return 'hover:bg-green-50 hover:border-green-200 hover:text-green-600';
      case 'telegram':
        return 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-500';
      case 'instagram':
        return 'hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600';
      case 'copy':
        return 'hover:bg-gray-50 hover:border-gray-200 hover:text-gray-700';
      default:
        return 'hover:bg-gray-50 hover:border-gray-200 hover:text-gray-700';
    }
  };

  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center h-20 text-xs gap-2 transition-all duration-200 ${getPlatformColor()}`}
    >
      <Icon className="w-5 h-5" />
      <span className="leading-tight text-center">{label}</span>
    </Button>
  );
};

export default PlatformShareButton;