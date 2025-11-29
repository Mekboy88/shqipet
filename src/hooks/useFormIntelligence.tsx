import { useState, useCallback, useRef, useEffect } from 'react';

export interface FormIntelligenceOptions {
  enableBlurPrompts?: boolean;
  enableCompletionHints?: boolean;
  enableAnimatedBorders?: boolean;
  cacheKey?: string;
}

interface BlurPromptData {
  show: boolean;
  message: string;
  fieldId: string;
}

interface CompletionHint {
  value: string;
  type: 'cached' | 'profile' | 'suggested';
}

export const useFormIntelligence = (options: FormIntelligenceOptions = {}) => {
  const {
    enableBlurPrompts = true,
    enableCompletionHints = true,
    enableAnimatedBorders = true,
    cacheKey = 'form-intelligence'
  } = options;

  const [blurPrompt, setBlurPrompt] = useState<BlurPromptData>({ show: false, message: '', fieldId: '' });
  const [completionHints, setCompletionHints] = useState<Record<string, CompletionHint[]>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [cachedValues, setCachedValues] = useState<Record<string, string>>({});

  const fieldRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement>>({});
  const blurTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Load cached values on mount
  useEffect(() => {
    if (enableCompletionHints) {
      const stored = localStorage.getItem(cacheKey);
      if (stored) {
        try {
          setCachedValues(JSON.parse(stored));
        } catch (e) {
          console.warn('Failed to parse cached form values');
        }
      }
    }
  }, [cacheKey, enableCompletionHints]);

  // Save values to cache
  const cacheValue = useCallback((fieldId: string, value: string) => {
    if (!enableCompletionHints || !value.trim()) return;
    
    setCachedValues(prev => {
      const updated = { ...prev, [fieldId]: value };
      localStorage.setItem(cacheKey, JSON.stringify(updated));
      return updated;
    });
  }, [cacheKey, enableCompletionHints]);

  // Generate completion hints
  const generateHints = useCallback((fieldId: string, currentValue: string): CompletionHint[] => {
    if (!enableCompletionHints) return [];

    const hints: CompletionHint[] = [];
    
    // Add cached value if it exists and differs from current
    const cached = cachedValues[fieldId];
    if (cached && cached !== currentValue && cached.toLowerCase().includes(currentValue.toLowerCase())) {
      hints.push({ value: cached, type: 'cached' });
    }

    // Add common suggestions based on field type
    if (fieldId.includes('email') && currentValue.includes('@')) {
      const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
      const [local] = currentValue.split('@');
      domains.forEach(domain => {
        const suggestion = `${local}@${domain}`;
        if (suggestion !== currentValue) {
          hints.push({ value: suggestion, type: 'suggested' });
        }
      });
    }

    return hints.slice(0, 3); // Limit to 3 hints
  }, [cachedValues, enableCompletionHints]);

  // Handle field focus
  const handleFocus = useCallback((fieldId: string) => {
    if (!enableAnimatedBorders) return;
    
    setFocusedField(fieldId);
    
    // Clear any pending blur timeout
    if (blurTimeouts.current[fieldId]) {
      clearTimeout(blurTimeouts.current[fieldId]);
      delete blurTimeouts.current[fieldId];
    }
    
    // Hide blur prompt
    setBlurPrompt(prev => prev.fieldId === fieldId ? { show: false, message: '', fieldId: '' } : prev);
  }, [enableAnimatedBorders]);

  // Handle field blur
  const handleBlur = useCallback((fieldId: string, value: string, isRequired: boolean = false) => {
    setFocusedField(null);
    
    if (enableBlurPrompts && isRequired && !value.trim()) {
      // Delay showing blur prompt slightly
      blurTimeouts.current[fieldId] = setTimeout(() => {
        setBlurPrompt({
          show: true,
          message: 'This field is required',
          fieldId
        });
      }, 500);
    }
    
    // Cache the value if it's not empty
    if (value.trim()) {
      cacheValue(fieldId, value);
    }
  }, [enableBlurPrompts, cacheValue]);

  // Handle input change
  const handleChange = useCallback((fieldId: string, value: string) => {
    // Update completion hints
    const hints = generateHints(fieldId, value);
    setCompletionHints(prev => ({ ...prev, [fieldId]: hints }));
    
    // Hide blur prompt if user starts typing
    if (blurPrompt.fieldId === fieldId && value.trim()) {
      setBlurPrompt({ show: false, message: '', fieldId: '' });
    }
  }, [generateHints, blurPrompt.fieldId]);

  // Dismiss blur prompt
  const dismissBlurPrompt = useCallback(() => {
    setBlurPrompt({ show: false, message: '', fieldId: '' });
  }, []);

  // Apply completion hint
  const applyHint = useCallback((fieldId: string, value: string) => {
    const field = fieldRefs.current[fieldId];
    if (field) {
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
    }
    setCompletionHints(prev => ({ ...prev, [fieldId]: [] }));
  }, []);

  // Register field ref
  const registerField = useCallback((fieldId: string, ref: HTMLInputElement | HTMLTextAreaElement | null) => {
    if (ref) {
      fieldRefs.current[fieldId] = ref;
    } else {
      delete fieldRefs.current[fieldId];
    }
  }, []);

  // Get field class names for styling
  const getFieldClassName = useCallback((fieldId: string, baseClassName: string = '') => {
    let className = baseClassName;
    
    if (enableAnimatedBorders && focusedField === fieldId) {
      className += ' ring-2 ring-blue-400 ring-opacity-50 border-blue-400 shadow-lg transition-all duration-300';
    } else {
      className += ' transition-all duration-300';
    }
    
    return className;
  }, [focusedField, enableAnimatedBorders]);

  return {
    // State
    blurPrompt,
    completionHints,
    focusedField,
    
    // Handlers
    handleFocus,
    handleBlur,
    handleChange,
    dismissBlurPrompt,
    applyHint,
    registerField,
    getFieldClassName,
    
    // Utils
    isFieldFocused: (fieldId: string) => focusedField === fieldId
  };
};