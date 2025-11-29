import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';

interface AISmartSummaryProps {
  content: string;
}

const AISmartSummary: React.FC<AISmartSummaryProps> = ({ content }) => {
  const [summary, setSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (content.trim().length > 20) {
      // Simulate AI analysis
      const timer = setTimeout(() => {
        const words = content.trim().split(' ');
        const topic = words.length > 3 ? words.slice(0, 3).join(' ') : 'your thoughts';
        setSummary(`Your post shares a thoughtful update about ${topic}. Want to make it more engaging?`);
        setShowSummary(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowSummary(false);
    }
  }, [content]);

  return (
    <AnimatePresence>
      {showSummary && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="mb-4 p-4 bg-accent/15 dark:bg-accent/25 rounded-2xl border border-accent/40 dark:border-accent/60 shadow-md ring-1 ring-accent/20 dark:ring-accent/30 backdrop-blur-xl"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-accent/30 dark:bg-accent/35 rounded-xl shadow-sm border border-accent/50 dark:border-accent/60">
              <Sparkles className="w-4 h-4 text-accent-foreground animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold text-foreground">AI Smart Summary</h4>
                <div className="flex items-center gap-1 text-xs text-green-600 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  <span>High Quality</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{summary}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AISmartSummary;
