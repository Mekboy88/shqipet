import React, { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BlurPrompt } from './BlurPrompt';
import { CompletionHints } from './CompletionHints';
import { useFormIntelligence, FormIntelligenceOptions } from '@/hooks/useFormIntelligence';

interface IntelligentInputProps {
  id: string;
  type?: 'input' | 'textarea';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  options?: FormIntelligenceOptions;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
}

export const IntelligentInput: React.FC<IntelligentInputProps> = ({
  id,
  type = 'input',
  placeholder,
  value,
  onChange,
  required = false,
  className = '',
  options,
  inputProps,
  textareaProps
}) => {
  const {
    blurPrompt,
    completionHints,
    handleFocus,
    handleBlur,
    handleChange,
    dismissBlurPrompt,
    applyHint,
    registerField,
    getFieldClassName
  } = useFormIntelligence(options);

  const [internalValue, setInternalValue] = useState(value);
  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Register field reference
  useEffect(() => {
    registerField(id, fieldRef.current);
    return () => registerField(id, null);
  }, [id, registerField]);

  // Sync internal value with prop value
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleInternalChange = (newValue: string) => {
    setInternalValue(newValue);
    onChange(newValue);
    handleChange(id, newValue);
  };

  const handleInternalFocus = () => {
    handleFocus(id);
  };

  const handleInternalBlur = () => {
    handleBlur(id, internalValue, required);
  };

  const handleHintApply = (hintValue: string) => {
    handleInternalChange(hintValue);
    applyHint(id, hintValue);
  };

  const fieldClassName = getFieldClassName(
    id, 
    `${className} ${blurPrompt.show && blurPrompt.fieldId === id ? 'border-orange-300' : ''}`
  );

  const showBlurPrompt = blurPrompt.show && blurPrompt.fieldId === id;
  const showHints = completionHints[id]?.length > 0;

  return (
    <div className="relative">
      {type === 'textarea' ? (
        <Textarea
          ref={fieldRef as React.RefObject<HTMLTextAreaElement>}
          placeholder={placeholder}
          value={internalValue}
          onChange={(e) => handleInternalChange(e.target.value)}
          onFocus={handleInternalFocus}
          onBlur={handleInternalBlur}
          className={fieldClassName}
          {...textareaProps}
        />
      ) : (
        <Input
          ref={fieldRef as React.RefObject<HTMLInputElement>}
          placeholder={placeholder}
          value={internalValue}
          onChange={(e) => handleInternalChange(e.target.value)}
          onFocus={handleInternalFocus}
          onBlur={handleInternalBlur}
          className={fieldClassName}
          {...inputProps}
        />
      )}

      {/* Blur-aware prompt */}
      {showBlurPrompt && (
        <BlurPrompt
          show={showBlurPrompt}
          message={blurPrompt.message}
          fieldId={id}
          onDismiss={dismissBlurPrompt}
        />
      )}

      {/* Completion hints */}
      {showHints && (
        <CompletionHints
          hints={completionHints[id]}
          onApply={handleHintApply}
          fieldId={id}
        />
      )}
    </div>
  );
};