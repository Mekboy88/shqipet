import React from 'react';
import { useLocalization } from '@/hooks/useLocalization';

interface RTLLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const RTLLayout: React.FC<RTLLayoutProps> = ({ children, className = '' }) => {
  const { isRTL } = useLocalization();

  return (
    <div className={`
      ${isRTL ? 'rtl-layout' : 'ltr-layout'}
      ${className}
    `}>
      {children}
    </div>
  );
};

interface RTLAwareInputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  id?: string;
}

export const RTLAwareInput: React.FC<RTLAwareInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  id
}) => {
  const { isRTL } = useLocalization();

  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        ${isRTL ? 'text-right rtl-input' : 'text-left'}
        ${className}
      `}
      dir={isRTL ? 'rtl' : 'ltr'}
    />
  );
};

interface RTLAwareButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const RTLAwareButton: React.FC<RTLAwareButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false
}) => {
  const { isRTL } = useLocalization();

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg font-medium transition-colors
        focus:outline-none focus:ring-2 focus:ring-opacity-50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${isRTL ? 'rtl-button' : 'ltr-button'}
        ${className}
      `}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {children}
    </button>
  );
};

interface LocaleDetectionIndicatorProps {
  className?: string;
}

export const LocaleDetectionIndicator: React.FC<LocaleDetectionIndicatorProps> = ({ className = '' }) => {
  const { autoDetectedLanguage, currentLanguage, getCurrentLanguage, t } = useLocalization();

  if (!autoDetectedLanguage || autoDetectedLanguage !== currentLanguage) {
    return null;
  }

  const currentLang = getCurrentLanguage();

  return (
    <div className={`flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 ${className}`}>
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span className={currentLang.rtl ? 'font-arabic' : ''}>
        {t('language.detected', 'Auto-detected')}: {currentLang.nativeName}
      </span>
    </div>
  );
};