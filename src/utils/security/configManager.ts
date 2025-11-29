/**
 * Centralized Configuration Manager
 * Security fix: Consolidate hardcoded credentials and configuration
 */

// Supabase configuration - centralized source of truth
// SECURITY: Use environment variables, never hardcode credentials
export const SUPABASE_CONFIG = {
  URL: import.meta.env.VITE_SUPABASE_URL || "",
  ANON_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ""
} as const;

// Application security settings
export const SECURITY_CONFIG = {
  // Session configuration
  SESSION: {
    MAX_AGE_HOURS: 24,
    VALIDATION_INTERVAL_MINUTES: 5,
    PREFIX: 'shqipet-secure-session'
  },
  
  // Rate limiting
  RATE_LIMIT: {
    MAX_LOGIN_ATTEMPTS: 5,
    LOGIN_WINDOW_MINUTES: 15,
    MAX_API_REQUESTS_PER_MINUTE: 60,
    MAX_UPLOAD_REQUESTS_PER_HOUR: 10
  },
  
  // Input validation
  INPUT_VALIDATION: {
    MAX_TEXT_LENGTH: 5000,
    MAX_EMAIL_LENGTH: 254,
    MAX_PHONE_LENGTH: 20,
    MAX_URL_LENGTH: 2048,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    MAX_FILE_SIZE_MB: 10
  },
  
  // Password requirements
  PASSWORD: {
    MIN_LENGTH: 12,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SYMBOLS: true,
    ENABLE_LEAKED_PROTECTION: true
  },
  
  // CORS and domain configuration
  DOMAINS: {
    ALLOWED_ORIGINS: [
      'https://shqipet.com',
      'https://www.shqipet.com',
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ],
    PRODUCTION_DOMAIN: 'shqipet.com'
  }
} as const;

// Environment detection
export const ENV_CONFIG = {
  isDevelopment: () => typeof window !== 'undefined' && 
    (window.location.hostname.includes('localhost') || 
     window.location.hostname.includes('127.0.0.1') ||
     window.location.hostname.includes('preview')),
  
  isProduction: () => typeof window !== 'undefined' && 
    window.location.hostname === SECURITY_CONFIG.DOMAINS.PRODUCTION_DOMAIN,
  
  isHireEnvironment: () => typeof window !== 'undefined' && 
    (window.location.hostname.includes('hire') || 
     window.location.hostname.includes('hiring'))
} as const;

// API endpoints configuration
export const API_CONFIG = {
  SUPABASE: {
    BASE_URL: SUPABASE_CONFIG.URL,
    FUNCTIONS_BASE: `${SUPABASE_CONFIG.URL}/functions/v1`,
    EDGE_FUNCTIONS: {
      S3_UPLOAD: '/s3-upload',
      SEND_EMAIL: '/send-verification-email',
      PASSWORD_RESET: '/password-reset',
      LUNA_AI_CHAT: '/luna-ai-chat',
      EXCHANGE_RATES: '/exchange-rates'
    }
  }
} as const;

// Content Security Policy configuration
export const CSP_CONFIG = {
  DEFAULT_SRC: "'self'",
  SCRIPT_SRC: "'self' 'unsafe-inline'",
  STYLE_SRC: "'self' 'unsafe-inline'",
  IMG_SRC: "'self' data: https:",
  CONNECT_SRC: `'self' ${SUPABASE_CONFIG.URL}`,
  FONT_SRC: "'self'",
  OBJECT_SRC: "'none'",
  MEDIA_SRC: "'self'",
  FRAME_SRC: "'none'"
} as const;

/**
 * Get configuration based on environment
 */
export const getConfig = () => {
  const isDev = ENV_CONFIG.isDevelopment();
  const isProd = ENV_CONFIG.isProduction();
  
  return {
    ...SECURITY_CONFIG,
    SUPABASE: SUPABASE_CONFIG,
    API: API_CONFIG,
    CSP: CSP_CONFIG,
    DEBUG_MODE: isDev,
    STRICT_MODE: isProd,
    ENVIRONMENT: isProd ? 'production' : isDev ? 'development' : 'staging'
  };
};

/**
 * Validate configuration on startup
 */
export const validateConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check required configuration
  if (!SUPABASE_CONFIG.URL) {
    errors.push('SUPABASE_URL is required');
  }
  
  if (!SUPABASE_CONFIG.ANON_KEY) {
    errors.push('SUPABASE_ANON_KEY is required');
  }
  
  // Validate URLs
  try {
    new URL(SUPABASE_CONFIG.URL);
  } catch {
    errors.push('Invalid SUPABASE_URL format');
  }
  
  // Check security settings
  if (SECURITY_CONFIG.PASSWORD.MIN_LENGTH < 8) {
    errors.push('Password minimum length too low (minimum 8 characters required)');
  }
  
  if (SECURITY_CONFIG.RATE_LIMIT.MAX_LOGIN_ATTEMPTS < 3) {
    errors.push('Login rate limit too restrictive (minimum 3 attempts required)');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export default {
  SUPABASE_CONFIG,
  SECURITY_CONFIG,
  ENV_CONFIG,
  API_CONFIG,
  CSP_CONFIG,
  getConfig,
  validateConfig
};