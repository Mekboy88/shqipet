import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Megaphone, MessageCircle, Image, Sparkles, Folder, X } from 'lucide-react';

interface PostIntentSectionProps {
  selectedIntent: string;
  onSelectIntent: (intent: string) => void;
}

const PostIntentSection: React.FC<PostIntentSectionProps> = ({ selectedIntent, onSelectIntent }) => {
  const [showPopup, setShowPopup] = useState(false);

  const intents = [
    { id: 'emotion', label: 'Emotion / Opinion', icon: Heart, color: 'text-pink-500' },
    { id: 'announcement', label: 'Announcement', icon: Megaphone, color: 'text-blue-500' },
    { id: 'discussion', label: 'Discussion', icon: MessageCircle, color: 'text-purple-500' },
    { id: 'showcase', label: 'Showcase', icon: Image, color: 'text-amber-500' },
    { id: 'thankfulness', label: 'Thankfulness', icon: Sparkles, color: 'text-green-500' },
  ];

  const selectedIntentData = intents.find(i => i.id === selectedIntent);

  return (
    <div className="relative">
      {/* Single Category Button */}
      <motion.button
        onClick={() => setShowPopup(!showPopup)}
        className="relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulsing Glow Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-200 to-purple-300 opacity-75 blur-md animate-pulse" />
        
        {/* Main Button */}
        <div className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-200 to-purple-300 rounded-full shadow-lg">
          <Folder className="w-5 h-5 text-gray-700 animate-pulse" />
          <span className="font-semibold text-gray-700 text-sm">Category</span>
        </div>
      </motion.button>

      {/* Compact Category Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full mb-2 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200/60 p-4 w-80 z-50"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-gray-800">Select Post Category</h3>
              <button onClick={() => setShowPopup(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              {intents.map((intent) => (
                <motion.button
                  key={intent.id}
                  onClick={() => {
                    onSelectIntent(intent.id);
                    setShowPopup(false);
                  }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left group ${
                    selectedIntent === intent.id
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`${intent.color} mt-0.5`}>
                    <intent.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${
                      selectedIntent === intent.id ? 'text-blue-900' : 'text-gray-800 group-hover:text-gray-900'
                    }`}>
                      {intent.label}
                    </p>
                  </div>
                  {selectedIntent === intent.id && (
                    <span className="text-blue-600">✓</span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostIntentSection;
