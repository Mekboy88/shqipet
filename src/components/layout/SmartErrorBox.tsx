import React, { useState, useEffect } from 'react';
import { AlertCircle, X, CheckCircle, AlertTriangle } from 'lucide-react';

interface SmartErrorBoxProps {
  error: string | null;
  type?: 'error' | 'warning' | 'success';
  className?: string;
  maxHeight?: string;
  onDismiss?: () => void;
}

export const SmartErrorBox: React.FC<SmartErrorBoxProps> = ({
  error,
  type = 'error',
  className = '',
  maxHeight = 'max-h-32',
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (error) {
      setShouldRender(true);
      // Small delay to trigger the animation
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      // Keep rendered for exit animation
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!shouldRender) return null;

  const typeConfig = {
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-500',
      icon: AlertCircle
    },
    warning: {
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200', 
      textColor: 'text-orange-800',
      iconColor: 'text-orange-500',
      icon: AlertTriangle
    },
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800', 
      iconColor: 'text-green-500',
      icon: CheckCircle
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={`
      overflow-hidden transition-all duration-300 ease-in-out
      ${isVisible ? `${maxHeight} opacity-100 mb-4` : 'max-h-0 opacity-0 mb-0'}
      ${className}
    `}>
      <div className={`
        ${config.bgColor} ${config.borderColor} ${config.textColor}
        border rounded-lg p-3
        transform transition-transform duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : '-translate-y-2'}
      `}>
        <div className="flex items-start gap-3">
          <Icon className={`h-5 w-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm leading-relaxed break-words">
              {error}
            </p>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className={`${config.iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface ErrorDemoProps {
  className?: string;
}

export const ErrorDemo: React.FC<ErrorDemoProps> = ({ className = '' }) => {
  const [currentError, setCurrentError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'error' | 'warning' | 'success'>('error');

  const demoErrors = {
    error: "Invalid email format. Please enter a valid email address.",
    warning: "Password should be at least 8 characters long for better security.",
    success: "Email verified successfully! You can now proceed.",
    long: "This is a very long error message that demonstrates how the error box handles lengthy content gracefully. It should wrap properly and maintain good readability while preventing the interface from breaking due to overflow. The box will expand vertically but maintain its maximum height constraint to prevent it from taking over the entire screen."
  };

  const showError = (key: keyof typeof demoErrors, type: 'error' | 'warning' | 'success' = 'error') => {
    setErrorType(type);
    setCurrentError(demoErrors[key]);
  };

  const clearError = () => setCurrentError(null);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => showError('error', 'error')}
          className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
        >
          Show Error
        </button>
        <button
          onClick={() => showError('warning', 'warning')}
          className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm hover:bg-orange-200"
        >
          Show Warning
        </button>
        <button
          onClick={() => showError('success', 'success')}
          className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
        >
          Show Success
        </button>
        <button
          onClick={() => showError('long', 'error')}
          className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200"
        >
          Long Message
        </button>
        <button
          onClick={clearError}
          className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
        >
          Clear
        </button>
      </div>

      <SmartErrorBox
        error={currentError}
        type={errorType}
        onDismiss={clearError}
      />

      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        Watch how the error box smoothly animates in/out without causing layout shifts.
        The height adjusts automatically while maintaining visual stability.
      </div>
    </div>
  );
};
