import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Brain, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EngagementBoostSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [audienceType, setAudienceType] = useState('friends');

  return (
    <div className="border-t border-gray-200 pt-4 mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-all">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <Brain className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="font-semibold text-sm text-gray-800">Engagement Boost Tools</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 space-y-3 p-4 bg-white/50 rounded-xl"
          >
            {/* Schedule Post */}
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm flex-1">Schedule post later</span>
              <Button size="sm" variant="outline" className="h-8 text-xs">
                Set Time
              </Button>
            </div>

            {/* Tag Audience Type */}
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-purple-500" />
              <span className="text-sm flex-1">Audience Type</span>
              <Select value={audienceType} onValueChange={setAudienceType}>
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friends">Friends</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* AI Preview */}
            <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200/50">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-semibold text-amber-900">AI Engagement Prediction</span>
              </div>
              <p className="text-xs text-amber-800">
                This post feels <span className="font-semibold">friendly & inspirational</span>. 
                Expected reach: <span className="font-semibold">Medium-High</span>
              </p>
            </div>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default EngagementBoostSection;
