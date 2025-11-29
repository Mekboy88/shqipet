import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadAnimationProps {
  isUploading: boolean;
  progress: number;
  type: 'avatar' | 'cover';
  children?: React.ReactNode;
}

const UploadAnimation: React.FC<UploadAnimationProps> = ({
  isUploading,
  progress,
  type,
  children
}) => {
  return (
    <div className="relative h-full w-full">
      {children}
      
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-full z-30"
          >
            <div className="text-center">
              {/* Circular progress indicator */}
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg 
                  className="w-16 h-16 transform -rotate-90" 
                  viewBox="0 0 64 64"
                >
                  {/* Background circle */}
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="4"
                    fill="none"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={175.929} // 2π * 28
                    initial={{ strokeDashoffset: 175.929 }}
                    animate={{ 
                      strokeDashoffset: 175.929 - (175.929 * progress / 100)
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </svg>
                
                {/* Upload icon in center */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <svg 
                    className="w-6 h-6 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </motion.div>
              </div>
              
              {/* Progress text */}
              <motion.div
                className="text-white text-sm font-medium"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {progress < 20 && `Preparing ${type}...`}
                {progress >= 20 && progress < 50 && 'Uploading to cloud...'}
                {progress >= 50 && progress < 80 && 'Processing image...'}
                {progress >= 80 && progress < 95 && 'Saving changes...'}
                {progress >= 95 && 'Almost done...'}
              </motion.div>
              
              {/* Progress percentage */}
              <div className="text-white/80 text-xs mt-1">
                {Math.round(progress)}%
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadAnimation;