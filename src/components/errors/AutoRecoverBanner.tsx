// DO NOT EDIT — Auto-recovery banner for transient errors.
// Removing this re-introduces full-screen refresh prompts.

import React, { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface AutoRecoverBannerProps {
  isRecovering: boolean;
  attemptCount: number;
  maxAttempts: number;
  onManualRetry?: () => void;
  showManualRetry?: boolean;
}

export function AutoRecoverBanner({
  isRecovering,
  attemptCount,
  maxAttempts,
  onManualRetry,
  showManualRetry = false
}: AutoRecoverBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [countdown, setCountdown] = useState(0);

  // Calculate next retry delay
  const getRetryDelay = (attempt: number) => {
    const delays = [2, 4, 8, 16];
    return delays[Math.min(attempt, delays.length - 1)];
  };

  useEffect(() => {
    if (isRecovering && attemptCount > 0) {
      const delay = getRetryDelay(attemptCount - 1);
      setCountdown(delay);
      
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRecovering, attemptCount]);

  // Auto-hide banner after successful recovery
  useEffect(() => {
    if (!isRecovering && attemptCount > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isRecovering, attemptCount]);

  if (!isVisible) return null;

  const getMessageContent = () => {
    if (attemptCount >= maxAttempts) {
      return {
        title: "Ndodhi një gabim i përsëritur",
        body: "Sistemi nuk arriti të rikthehet automatikisht. Ju lutemi provoni përsëri."
      };
    }

    if (isRecovering) {
      if (countdown > 0) {
        return {
          title: "Ndodhi një gabim i përkohshëm",
          body: `Po përpiqemi të rikthehemi automatikisht në ${countdown}s... (përpjekja ${attemptCount}/${maxAttempts})`
        };
      }
      return {
        title: "Ndodhi një gabim i përkohshëm",
        body: `Po përpiqemi të rikthehemi automatikisht... (përpjekja ${attemptCount}/${maxAttempts})`
      };
    }

    return {
      title: "Sistemi u rikthye",
      body: "Të dhënat u ringarkuan me sukses."
    };
  };

  const { title, body } = getMessageContent();
  const isError = attemptCount >= maxAttempts;
  const isSuccess = !isRecovering && attemptCount > 0;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 shadow-lg">
      <Alert className={`rounded-none border-x-0 border-t-0 ${
        isError 
          ? 'border-red-200 bg-red-50' 
          : isSuccess 
            ? 'border-green-200 bg-green-50'
            : 'border-amber-200 bg-amber-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isRecovering ? (
              <RefreshCw className={`h-4 w-4 ${isError ? 'text-red-600' : 'text-amber-600'} ${isRecovering ? 'animate-spin' : ''}`} />
            ) : isSuccess ? (
              <div className="h-4 w-4 rounded-full bg-green-600 flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            
            <div>
              <div className={`font-medium text-sm ${
                isError 
                  ? 'text-red-900' 
                  : isSuccess 
                    ? 'text-green-900'
                    : 'text-amber-900'
              }`}>
                {title}
              </div>
              <AlertDescription className={`text-xs ${
                isError 
                  ? 'text-red-700' 
                  : isSuccess 
                    ? 'text-green-700'
                    : 'text-amber-700'
              }`}>
                {body}
              </AlertDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showManualRetry && onManualRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onManualRetry}
                className="text-xs h-6 px-2"
              >
                Provo përsëri tani
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </Alert>
    </div>
  );
}