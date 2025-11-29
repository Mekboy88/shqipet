
import React from 'react';
import { Info, HelpCircle, Settings, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const CookiesInfoCards = () => {
  const infoCards = [
    {
      title: "What are cookies?",
      description: "Cookies are small files placed on your browser to help websites and apps provide better user experiences.",
      icon: <Info className="h-8 w-8 text-blue-500" />,
    },
    {
      title: "Why do we use cookies?",
      description: "Cookies allow us to understand your preferences, provide personalized content, enhance security, and improve our services.",
      icon: <HelpCircle className="h-8 w-8 text-blue-500" />,
    },
    {
      title: "What are Shqipet Products?",
      description: "Shqipet Products include Shqipet social media platform, messaging, advertising tools, marketplace, and other services designed for our users.",
      icon: <Settings className="h-8 w-8 text-blue-500" />,
    },
    {
      title: "Your cookie choices",
      description: "You can control, accept, or reject cookies anytime. Your settings will apply across all Shqipet products you use.",
      icon: <Shield className="h-8 w-8 text-blue-500" />,
    }
  ];

  // Colors for the empty illustration windows
  const illustrationColors = [
    "bg-[#F2FCE2]", // Soft Green
    "bg-[#FEF7CD]", // Soft Yellow
    "bg-[#FEC6A1]", // Soft Orange
    "bg-[#E5DEFF]", // Soft Purple
  ];

  return (
    <div className="py-4">
      {/* Empty windows for illustrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {illustrationColors.map((color, index) => (
          <div 
            key={`illustration-${index}`} 
            className={`${color} rounded-lg h-40 border border-gray-100 shadow-sm`}
            aria-label={`Illustration placeholder ${index + 1}`}
          />
        ))}
      </div>
      
      <h2 className="text-lg font-medium text-gray-900 mb-4">About cookies</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoCards.map((card, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow flex flex-col h-full">
            <div className="flex items-center space-x-3 mb-2">
              {card.icon}
              <h3 className="font-medium text-gray-800">{card.title}</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 flex-grow">
              {card.description}
            </p>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="mt-auto self-start">
                    Learn more
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">
                    Additional details about {card.title.toLowerCase()}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CookiesInfoCards;
