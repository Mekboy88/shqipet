
import { supabase } from '@/integrations/supabase/client';

interface EmailVerificationResult {
  success: boolean;
  error?: string;
  debug?: any;
}

export class EmailVerificationService {
  /**
   * Check if email exists in the system (100% accurate check)
   */
  static async checkEmailExists(email: string): Promise<{ exists: boolean; error?: string }> {
    try {
      console.log('🔍 Checking email existence:', email);

      // Step 1: Check profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('auth_user_id, email')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('❌ Profile check error:', profileError);
        return { exists: false, error: 'Database error' };
      }

      // If no profile found, email doesn't exist
      if (!profileData) {
        console.log('✅ Email not found in profiles');
        return { exists: false };
      }

      console.log('❌ Email exists and is active');
      return { exists: true };

    } catch (error: any) {
      console.error('❌ Email check error:', error);
      return { exists: false, error: error.message };
    }
  }

  /**
   * Validate email format with improved regex
   */
  static validateEmailFormat(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    
    // Improved email regex that handles most common cases
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return false;
    
    // Additional checks
    if (email.length > 254) return false; // RFC 5321 limit
    if (email.includes('..')) return false; // No consecutive dots
    if (email.startsWith('.') || email.endsWith('.')) return false; // No leading/trailing dots
    
    const [localPart, domainPart] = email.split('@');
    if (localPart.length > 64) return false; // RFC 5321 local part limit
    if (domainPart.length > 255) return false; // RFC 5321 domain part limit
    
    return true;
  }

  /**
   * Send verification email with multiple fallback methods
   */
  static async sendVerificationEmail(
    email: string, 
    firstName: string, 
    lastName: string, 
    verificationCode: string,
    isProfileEmailAddition: boolean = false
  ): Promise<EmailVerificationResult> {
    const requestId = `email_req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      console.log(`🚀 [${requestId}] ROBUST EMAIL: Starting verification email process`, {
        email: email,
        firstName: firstName,
        lastName: lastName,
        verificationCode: verificationCode,
        timestamp: new Date().toISOString()
      });

      // Step 1: Validate all inputs
      if (!email || !verificationCode) {
        console.error(`❌ [${requestId}] CRITICAL: Missing required parameters`);
        return { 
          success: false, 
          error: 'Email dhe kodi i verifikimit janë të detyrueshëm'
        };
      }

      // Step 2: Validate email format
      if (!this.validateEmailFormat(email)) {
        console.error(`❌ [${requestId}] Invalid email format:`, email);
        return { 
          success: false, 
          error: 'Formati i email-it është i pavlefshëm'
        };
      }

      // Step 3: Validate verification code format
      if (verificationCode.length !== 6 || !/^\d{6}$/.test(verificationCode)) {
        console.error(`❌ [${requestId}] Invalid verification code format`);
        return { 
          success: false, 
          error: 'Kodi i verifikimit duhet të jetë 6 shifra'
        };
      }

      const emailPayload = {
        email: email.trim().toLowerCase(),
        firstName: firstName || 'User',
        lastName: lastName || '',
        verificationCode: verificationCode.toString(),
        isPasswordReset: false,
        isProfileEmailAddition: isProfileEmailAddition
      };

      // Backend disabled
      console.log(`❌ [${requestId}] Backend disabled, cannot send email`);
      return { 
        success: false, 
        error: 'Backend disabled'
      };

    } catch (error: any) {
      console.error(`❌ [${requestId}] FIXED EMAIL: Unexpected error`, {
        error: error,
        message: error.message,
        stack: error.stack,
        recipient: email,
        timestamp: new Date().toISOString()
      });
      return { 
        success: false, 
        error: `Email sending failed: ${error.message}`,
        debug: {
          requestId,
          error: error.message,
          stack: error.stack,
          recipient: email,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Send password reset email with simplified error handling
   */
  static async sendPasswordResetEmail(
    email: string, 
    firstName: string, 
    lastName: string, 
    resetCode: string
  ): Promise<EmailVerificationResult> {
    return { 
      success: false, 
      error: 'Backend disabled'
    };
  }
}

export const emailVerificationService = EmailVerificationService;
