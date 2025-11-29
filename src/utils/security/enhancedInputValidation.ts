/**
 * Enhanced Input Validation Utility
 * Security fix: Comprehensive input sanitization and validation
 */

export interface ValidationResult {
  isValid: boolean;
  sanitizedValue?: string;
  errors: string[];
  warnings: string[];
}

export interface ValidationOptions {
  allowHtml?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: RegExp;
  stripTags?: boolean;
  preventXss?: boolean;
  allowedTags?: string[];
  allowedAttributes?: string[];
}

// XSS prevention patterns
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /onload\s*=/gi,
  /onerror\s*=/gi,
  /onclick\s*=/gi,
  /onmouseover\s*=/gi,
  /onfocus\s*=/gi,
  /onblur\s*=/gi,
  /onchange\s*=/gi,
  /onsubmit\s*=/gi,
  /onkeyup\s*=/gi,
  /onkeydown\s*=/gi,
  /onmousedown\s*=/gi,
  /onmouseup\s*=/gi,
  /onmouseout\s*=/gi,
  /expression\s*\(/gi,
  /@import/gi,
  /url\s*\(/gi,
  /data:text\/html/gi,
];

// SQL Injection patterns
const SQL_INJECTION_PATTERNS = [
  /union\s+select/gi,
  /select\s+.*\s+from/gi,
  /insert\s+into/gi,
  /update\s+.*\s+set/gi,
  /delete\s+from/gi,
  /drop\s+table/gi,
  /create\s+table/gi,
  /alter\s+table/gi,
  /exec\s*\(/gi,
  /execute\s*\(/gi,
  /--/g,
  /\/\*/g,
  /\*\//g,
  /;/g
];

// Command injection patterns
const COMMAND_INJECTION_PATTERNS = [
  /[;&|`$()]/g,
  /\.\.\//g,
  /\/etc\/passwd/gi,
  /\/bin\/sh/gi,
  /cmd\.exe/gi,
  /powershell/gi,
];

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (input: string, options: ValidationOptions = {}): string => {
  if (!input) return '';

  let sanitized = input;

  // Remove dangerous script tags and event handlers
  XSS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  // If stripTags is enabled, remove all HTML tags
  if (options.stripTags) {
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  } else if (options.allowedTags && options.allowedTags.length > 0) {
    // Only allow specific HTML tags
    const allowedTagsPattern = new RegExp(
      `<(?!\/?(?:${options.allowedTags.join('|')})(?:\s|>))[^>]*>`,
      'gi'
    );
    sanitized = sanitized.replace(allowedTagsPattern, '');
  }

  // Remove potentially dangerous attributes
  if (options.allowedAttributes && options.allowedAttributes.length > 0) {
    const dangerousAttributesPattern = new RegExp(
      `\\s(?!(?:${options.allowedAttributes.join('|')})\\s*=)[a-zA-Z-]+\\s*=\\s*["\'][^"\']*["\']`,
      'gi'
    );
    sanitized = sanitized.replace(dangerousAttributesPattern, '');
  }

  return sanitized;
};

/**
 * Check for SQL injection attempts
 */
export const detectSqlInjection = (input: string): boolean => {
  return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(input));
};

/**
 * Check for command injection attempts
 */
export const detectCommandInjection = (input: string): boolean => {
  return COMMAND_INJECTION_PATTERNS.some(pattern => pattern.test(input));
};

/**
 * Enhanced input validation with comprehensive security checks
 */
export const validateInput = (
  input: string,
  options: ValidationOptions = {}
): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  if (!input) {
    if (options.minLength && options.minLength > 0) {
      result.isValid = false;
      result.errors.push('Input is required');
    }
    return result;
  }

  // Length validation
  if (options.maxLength && input.length > options.maxLength) {
    result.isValid = false;
    result.errors.push(`Input exceeds maximum length of ${options.maxLength} characters`);
  }

  if (options.minLength && input.length < options.minLength) {
    result.isValid = false;
    result.errors.push(`Input must be at least ${options.minLength} characters`);
  }

  // Pattern validation
  if (options.pattern && !options.pattern.test(input)) {
    result.isValid = false;
    result.errors.push('Input format is invalid');
  }

  // Security checks
  if (options.preventXss !== false) {
    // SQL injection detection
    if (detectSqlInjection(input)) {
      result.isValid = false;
      result.errors.push('Potentially dangerous SQL patterns detected');
    }

    // Command injection detection
    if (detectCommandInjection(input)) {
      result.isValid = false;
      result.errors.push('Potentially dangerous command patterns detected');
    }

    // XSS detection
    const hasXssPatterns = XSS_PATTERNS.some(pattern => pattern.test(input));
    if (hasXssPatterns) {
      if (options.allowHtml) {
        result.warnings.push('HTML content detected - will be sanitized');
      } else {
        result.isValid = false;
        result.errors.push('Potentially dangerous script content detected');
      }
    }
  }

  // Sanitize the input
  result.sanitizedValue = sanitizeHtml(input, options);

  return result;
};

/**
 * Validate email with enhanced security
 */
export const validateSecureEmail = (email: string): ValidationResult => {
  const basicEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return validateInput(email, {
    maxLength: 254, // RFC standard
    minLength: 5,
    pattern: basicEmailPattern,
    preventXss: true,
    stripTags: true,
  });
};

/**
 * Validate phone number with enhanced security
 */
export const validateSecurePhoneNumber = (phone: string): ValidationResult => {
  const phonePattern = /^\+?[\d\s\-\(\)]{10,}$/;
  
  return validateInput(phone, {
    maxLength: 20,
    minLength: 10,
    pattern: phonePattern,
    preventXss: true,
    stripTags: true,
  });
};

/**
 * Validate URL with enhanced security
 */
export const validateSecureUrl = (url: string): ValidationResult => {
  const result = validateInput(url, {
    maxLength: 2048,
    preventXss: true,
    stripTags: true,
  });

  try {
    const urlObj = new URL(url);
    
    // Only allow safe protocols
    const allowedProtocols = ['http:', 'https:', 'ftp:', 'mailto:'];
    if (!allowedProtocols.includes(urlObj.protocol)) {
      result.isValid = false;
      result.errors.push('URL protocol not allowed');
    }

    // Prevent localhost/internal network access in production
    if (urlObj.hostname === 'localhost' || 
        urlObj.hostname === '127.0.0.1' || 
        urlObj.hostname.startsWith('192.168.') ||
        urlObj.hostname.startsWith('10.') ||
        urlObj.hostname.startsWith('172.16.')) {
      result.warnings.push('Internal network URL detected');
    }

  } catch (error) {
    result.isValid = false;
    result.errors.push('Invalid URL format');
  }

  return result;
};

/**
 * Rate limiting helper for validation
 */
export class ValidationRateLimit {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 60000 // 1 minute
  ) {}

  checkRateLimit(key: string): boolean {
    const now = Date.now();
    const entry = this.attempts.get(key);

    if (!entry || now > entry.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (entry.count >= this.maxAttempts) {
      return false;
    }

    entry.count++;
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export default {
  validateInput,
  sanitizeHtml,
  validateSecureEmail,
  validateSecurePhoneNumber,
  validateSecureUrl,
  detectSqlInjection,
  detectCommandInjection,
  ValidationRateLimit,
};