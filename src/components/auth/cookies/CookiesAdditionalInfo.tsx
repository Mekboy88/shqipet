
import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CookiesAdditionalInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="space-y-3">
      <Collapsible open={isOpen}>
        <CollapsibleTrigger 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-gray-700 hover:text-gray-900 text-sm"
        >
          {isOpen ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
          Other ways you can control your information
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-3 pl-6">
          <div className="text-sm text-gray-600">
            <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline block">
              Manage your ad experience in Shqipet Settings
            </a>
            <p className="mt-1">
              Control your ad preferences through your account settings for more personalized experiences.
            </p>
          </div>
          
          <div className="text-sm text-gray-600">
            <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline block">
              More information about online advertising
            </a>
            <p className="mt-1">
              Learn about how online advertising works and your options across the internet.
            </p>
          </div>
          
          <div className="text-sm text-gray-600">
            <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline block">
              Controlling cookies with browser settings
            </a>
            <p className="mt-1">
              You can manage cookies directly in your browser settings to have more control.
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CookiesAdditionalInfo;
