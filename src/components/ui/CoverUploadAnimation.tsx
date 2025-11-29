import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface CoverUploadAnimationProps {
  isUploading: boolean;
  progress: number;
}

const CoverUploadAnimation: React.FC<CoverUploadAnimationProps> = ({
  isUploading,
  progress
}) => {
  if (!isUploading) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          className="bg-card/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-border/50 max-w-sm w-full mx-4"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              animate={{ 
                rotate: [0, 180, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-primary/60 rounded-full flex items-center justify-center"
            >
              <svg 
                className="w-8 h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </motion.div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Uploading Cover Photo
            </h3>
            <p className="text-sm text-muted-foreground">
              Please wait while we process your image...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">
                {progress < 20 && 'Preparing image...'}
                {progress >= 20 && progress < 40 && 'Uploading to cloud...'}
                {progress >= 40 && progress < 70 && 'Processing image...'}
                {progress >= 70 && progress < 90 && 'Optimizing quality...'}
                {progress >= 90 && 'Finalizing...'}
              </span>
              <span className="text-sm font-bold text-primary">
                {Math.round(progress)}%
              </span>
            </div>
            
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Animated Dots */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Upload Statistics */}
          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Speed: Fast</span>
              <span>Quality: High</span>
              <span>Format: Optimized</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default CoverUploadAnimation;