import React, { useState, useEffect } from 'react';
import { Check, X, AlertTriangle, Shield, FileCheck, Upload, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PublishingProgressIndicatorProps {
  isVisible: boolean;
  onComplete: () => void;
  postContent: string;
  hasFiles: boolean;
  files?: File[];
}

interface ProgressStage {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  duration: number;
  status: 'pending' | 'active' | 'completed' | 'error';
}

const PublishingProgressIndicator: React.FC<PublishingProgressIndicatorProps> = ({
  isVisible,
  onComplete,
  postContent,
  hasFiles,
  files = []
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasError, setHasError] = useState(false);

  const stages: ProgressStage[] = [
    {
      id: 'upload',
      label: 'Uploading Files',
      description: hasFiles ? 'Uploading media files to secure storage...' : 'Preparing content...',
      icon: <Upload className="w-4 h-4" />,
      duration: hasFiles ? 2000 : 500,
      status: 'pending'
    },
    {
      id: 'validation',
      label: 'File Validation',
      description: hasFiles ? 'Checking file formats and security...' : 'Validating content...',
      icon: <Shield className="w-4 h-4" />,
      duration: 1000,
      status: 'pending'
    },
    {
      id: 'processing',
      label: 'Processing',
      description: 'Optimizing content and generating metadata...',
      icon: <FileCheck className="w-4 h-4" />,
      duration: 1000,
      status: 'pending'
    },
    {
      id: 'publishing',
      label: 'Publishing',
      description: 'Making your post live to your audience...',
      icon: <Clock className="w-4 h-4" />,
      duration: 800,
      status: 'pending'
    }
  ];

  // Real file format validation
  const validateFileFormats = async (files: File[]): Promise<{ isValid: boolean; blockedFiles: string[] }> => {
    const dangerousExtensions = [
      '.exe', '.bat', '.cmd', '.scr', '.vbs', '.js', '.jar',
      '.com', '.pif', '.application', '.gadget', '.msi', '.msp',
      '.hta', '.cpl', '.msc', '.wsf', '.wsh', '.ps1', '.psm1', 
      '.psd1', '.ps1xml', '.psc1', '.psc2', '.msh', '.msh1', 
      '.msh2', '.mshxml', '.msh1xml', '.msh2xml'
    ];
    
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/mov', 'video/avi', 'video/quicktime', 'video/x-msvideo'];
    const allowedAudioTypes = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg', 'audio/x-wav'];
    
    let blockedFiles: string[] = [];
    
    for (const file of files) {
      const fileName = file.name.toLowerCase();
      const fileType = file.type.toLowerCase();
      
      // Check for dangerous extensions
      const hasDangerousExtension = dangerousExtensions.some(ext => fileName.endsWith(ext));
      
      // Check if file type is allowed
      const isAllowedType = allowedImageTypes.includes(fileType) || 
                           allowedVideoTypes.includes(fileType) || 
                           allowedAudioTypes.includes(fileType);
      
      if (hasDangerousExtension || (!isAllowedType && fileType !== '')) {
        blockedFiles.push(file.name);
      }
    }
    
    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      isValid: blockedFiles.length === 0,
      blockedFiles
    };
  };

  // Content moderation for text (simplified real check)
  const performContentModeration = async (content: string): Promise<boolean> => {
    // Only check for clearly inappropriate content
    const bannedWords = ['spam', 'scam', 'hate', 'violence', 'abuse', 'threat'];
    const lowercaseContent = content.toLowerCase();
    
    // Check for banned words
    const hasBannedWords = bannedWords.some(word => lowercaseContent.includes(word));
    
    // Simulate AI moderation delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return !hasBannedWords;
  };

  useEffect(() => {
    if (!isVisible) {
      setCurrentStageIndex(0);
      setOverallProgress(0);
      setIsCompleted(false);
      setHasError(false);
      return;
    }

    const processStages = async () => {
      for (let i = 0; i < stages.length; i++) {
        setCurrentStageIndex(i);
        
        // Special handling for validation stage
        if (stages[i].id === 'validation') {
          try {
            // Validate files if any
            if (hasFiles && files.length > 0) {
              const fileValidation = await validateFileFormats(files);
              if (!fileValidation.isValid) {
                setHasError(true);
                return;
              }
            }
            
            // Validate content
            const moderationPassed = await performContentModeration(postContent);
            if (!moderationPassed) {
              setHasError(true);
              return;
            }
          } catch (error) {
            setHasError(true);
            return;
          }
        }
        
        // Simulate stage progress
        const stageStart = Date.now();
        const stageDuration = stages[i].duration;
        
        while (Date.now() - stageStart < stageDuration) {
          const elapsed = Date.now() - stageStart;
          const stageProgress = Math.min(elapsed / stageDuration, 1);
          const totalProgress = ((i + stageProgress) / stages.length) * 100;
          setOverallProgress(totalProgress);
          
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
      
      // Complete
      setOverallProgress(100);
      setIsCompleted(true);
      
      // Auto close after success message
      setTimeout(() => {
        onComplete();
      }, 2000);
    };

    processStages();
  }, [isVisible, postContent, hasFiles, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`fixed top-16 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mx-4 transition-all duration-500 ease-out ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className="relative">
        {/* More visible background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/85 backdrop-blur-md border border-border/30 rounded-2xl shadow-2xl" />
        
        {/* Content */}
        <div className="relative p-6 space-y-4">
          {/* Status indicator */}
          <div className="text-center">
            {hasError ? (
              <div className="flex items-center justify-center space-x-2 text-destructive">
                <X className="w-6 h-6" />
                <span className="font-semibold">Content Review Failed</span>
              </div>
            ) : isCompleted ? (
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <Check className="w-6 h-6" />
                <span className="font-semibold">Your post is published successfully!</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2 text-primary">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
                <span className="font-semibold">Your post will be published soon</span>
              </div>
            )}
          </div>

          {/* Progress circle and bar */}
          {!hasError && (
            <div className="space-y-3">
              {/* Circular progress */}
              <div className="flex justify-center">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - overallProgress / 100)}`}
                      className={`transition-all duration-300 ${
                        isCompleted ? 'text-green-500' : 'text-primary'
                      }`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-lg font-bold ${
                      isCompleted ? 'text-green-600' : 'text-primary'
                    }`}>
                      {Math.round(overallProgress)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Linear progress */}
              <Progress 
                value={overallProgress} 
                className="h-2 bg-muted/30"
              />
            </div>
          )}

          {/* Current stage info */}
          {!hasError && !isCompleted && (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 text-foreground">
                {stages[currentStageIndex]?.icon}
                <span className="font-medium">{stages[currentStageIndex]?.label}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {stages[currentStageIndex]?.description}
              </p>
            </div>
          )}

          {/* Error details */}
          {hasError && (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm">Content doesn't meet our community guidelines</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Please review your content and try again
              </p>
            </div>
          )}

          {/* Stages list */}
          {!hasError && (
            <div className="space-y-2">
              {stages.map((stage, index) => (
                <div
                  key={stage.id}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-all ${
                    index < currentStageIndex
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : index === currentStageIndex
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted/50 text-muted-foreground'
                  }`}
                >
                  <div className={`flex-shrink-0 ${
                    index < currentStageIndex ? 'text-green-600 dark:text-green-400' : 
                    index === currentStageIndex ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {index < currentStageIndex ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      stage.icon
                    )}
                  </div>
                  <span className="text-sm font-medium">{stage.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublishingProgressIndicator;