
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Lock, Globe, Users, UserPlus, Briefcase } from 'lucide-react';
import AnonymousIcon from '@/components/icons/AnonymousIcon';
import '../animations.css';

interface CreatePostPrivacySelectorProps {
  privacy: string;
  setPrivacy: (privacy: string) => void;
}

const CreatePostPrivacySelector: React.FC<CreatePostPrivacySelectorProps> = ({ privacy, setPrivacy }) => {
  const privacyOptions = [
    { value: 'Only me', label: 'Only me', icon: Lock },
    { value: 'Everyone', label: 'Everyone', icon: Globe },
    { value: 'People I Follow', label: 'People I Follow', icon: Users },
    { value: 'People Follow Me', label: 'People Follow Me', icon: UserPlus },
    { value: 'Anonymous', label: 'Anonymous', icon: AnonymousIcon },
    { value: 'Monetized', label: 'Monetized', icon: Briefcase },
  ];

  const selectedPrivacyOption = privacyOptions.find(option => option.label === privacy) || privacyOptions[1];
  const PrivacyIcon = selectedPrivacyOption.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-gray-600">
          <PrivacyIcon className={`w-4 h-4 mr-2 ${privacy === 'Anonymous' ? 'text-gray-600' : ''}`} />
          {privacy}
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {privacyOptions.map((option) => {
          const Icon = option.icon;
          const colorClass =
            option.label === 'Everyone'
              ? 'edge-smoke-green'
              : option.label === 'Only me'
              ? 'edge-smoke-red'
              : option.label.includes('Follow')
              ? 'edge-smoke-orange'
              : '';
          return (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => setPrivacy(option.label)}
              className={`edge-smoke-hover ${colorClass} rounded-lg smoke-ring-rounded hover:bg-transparent focus:bg-transparent data-[highlighted]:bg-transparent`}
            >
              <Icon className={`w-4 h-4 mr-2 ${option.label === 'Anonymous' ? 'text-gray-600' : ''}`} />
              <span>{option.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CreatePostPrivacySelector;
