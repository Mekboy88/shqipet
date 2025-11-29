import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Edit3, Lightbulb, Hash, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FloatingAIButtonProps {
  onTextImprove?: (text: string) => void;
  onIdeaBoost?: () => void;
  onHashtagHelper?: () => void;
}

const FloatingAIButton: React.FC<FloatingAIButtonProps> = ({
  onTextImprove,
  onIdeaBoost,
  onHashtagHelper
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const { toast } = useToast();

  const aiTools = [
    {
      icon: Edit3,
      label: 'Rewrite or Improve',
      description: 'Refines text, corrects grammar',
      color: 'text-blue-500',
      action: () => {
        toast({ title: "✍️ Improving your text..." });
        onTextImprove?.("improved text");
        setShowPopup(false);
      }
    },
    {
      icon: Lightbulb,
      label: 'Idea Boost',
      description: 'Get suggestions & inspiration',
      color: 'text-yellow-500',
      action: () => {
        toast({ title: "💡 Generating ideas..." });
        onIdeaBoost?.();
        setShowPopup(false);
      }
    },
    {
      icon: Hash,
      label: 'Hashtag Helper',
      description: 'Generate relevant hashtags',
      color: 'text-pink-500',
      action: () => {
        toast({ title: "🔥 Finding hashtags..." });
        onHashtagHelper?.();
        setShowPopup(false);
      }
    }
  ];

  return (
    <div className="relative">
      {/* Floating AI Button */}
      <motion.button
        onClick={() => setShowPopup(!showPopup)}
        className="relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulsing Glow Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-200 to-teal-300 opacity-75 blur-md animate-pulse" />
        
        {/* Main Button */}
        <div className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-200 to-teal-300 rounded-full shadow-lg">
          <Sparkles className="w-5 h-5 text-gray-700 animate-pulse" />
          <span className="font-semibold text-gray-700 text-sm">AI Suggestion</span>
        </div>
      </motion.button>

      {/* Compact AI Tools Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full mb-2 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200/60 p-4 w-80 z-50"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-gray-800">AI Post Tools</h3>
              <button onClick={() => setShowPopup(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              {aiTools.map((tool, idx) => (
                <motion.button
                  key={idx}
                  onClick={tool.action}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all text-left group"
                >
                  <div className={`${tool.color} mt-0.5`}>
                    <tool.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-800 group-hover:text-gray-900">{tool.label}</p>
                    <p className="text-xs text-gray-500">{tool.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingAIButton;
