
export interface PasswordValidation {
  isValid: boolean;
  error?: string;
  strength: 'weak' | 'medium' | 'strong';
}

export interface EmailValidation {
  isValid: boolean;
  error?: string;
}

export interface PhoneValidation {
  isValid: boolean;
  error?: string;
}

// Rate limiting storage
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimitCheck = (key: string, maxAttempts: number, windowMs: number): boolean => {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // Reset or initialize
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= maxAttempts) {
    return false;
  }

  entry.count++;
  return true;
};

export const validatePassword = (password: string): PasswordValidation => {
  if (!password) {
    return {
      isValid: false,
      error: 'Password is required',
      strength: 'weak'
    };
  }

  if (password.length < 12) {
    return {
      isValid: false,
      error: 'Password must be at least 12 characters long',
      strength: 'weak'
    };
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password);

  const criteriaCount = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;

  if (criteriaCount < 4) {
    return {
      isValid: false,
      error: 'Password must contain uppercase, lowercase, numbers, and symbols',
      strength: criteriaCount >= 3 ? 'medium' : 'weak'
    };
  }

  return {
    isValid: true,
    strength: 'strong'
  };
};

export const validateEmail = (email: string): EmailValidation => {
  if (!email) {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  
  return {
    isValid,
    error: isValid ? undefined : 'Please enter a valid email address'
  };
};

export const validatePhoneNumber = (phone: string): PhoneValidation => {
  if (!phone) {
    return {
      isValid: false,
      error: 'Phone number is required'
    };
  }

  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  const isValid = phoneRegex.test(phone);
  
  return {
    isValid,
    error: isValid ? undefined : 'Please enter a valid phone number'
  };
};
