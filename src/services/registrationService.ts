
import { supabase } from '@/integrations/supabase/client';
import { AuthOtpResponse, AuthResponse } from '@supabase/supabase-js';
import { EmailVerificationService } from './emailVerificationService';

export interface RegistrationResult {
  success: boolean;
  error?: string;
  requiresVerification?: boolean;
  session?: any;
}

export interface PhoneRegistrationData {
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  additionalData?: Record<string, any>;
}

export interface EmailRegistrationData {
  email: string;
  password?: string; // Optional for magic link flow
  firstName?: string;
  lastName?: string;
  additionalData?: Record<string, any>;
}

export class RegistrationService {
  /**
   * Phone Registration Flow - Step 1: Send OTP via Supabase Auth (Passwordless)
   */
  static async initiatePhoneRegistration(data: PhoneRegistrationData): Promise<RegistrationResult> {
    try {
      console.log('🔐 PRODUCTION: Starting phone registration for:', data.phoneNumber);
      
      const tempUserData = {
        phoneNumber: data.phoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        registrationMethod: 'phone_otp_only',
        ...data.additionalData
      };
      
      localStorage.setItem('tempUserData', JSON.stringify(tempUserData));
      console.log('💾 Stored temporary user data for registration');

      const { data: otpData, error: otpError } = await supabase.auth.signInWithOtp({
        phone: data.phoneNumber,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            registration_method: 'phone_otp_only',
            ...data.additionalData
          }
        }
      });

      if (otpError) {
        console.error('❌ Supabase Auth OTP error:', otpError);
        localStorage.removeItem('tempUserData');
        return { 
          success: false, 
          error: otpError.message || 'Failed to send verification code'
        };
      }

      console.log('✅ Phone OTP sent successfully');
      return { 
        success: true, 
        requiresVerification: true 
      };

    } catch (error: any) {
      console.error('❌ Phone registration failed:', error);
      localStorage.removeItem('tempUserData');
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.' 
      };
    }
  }

  /**
   * Phone Registration Flow - Step 2: Verify OTP via Supabase Auth (Passwordless)
   */
  static async verifyPhoneRegistration(phoneNumber: string, otpCode: string): Promise<RegistrationResult> {
    try {
      console.log('🔐 PRODUCTION: Verifying phone OTP for:', phoneNumber);

      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otpCode,
        type: 'sms'
      });

      if (verifyError) {
        console.error('❌ OTP verification failed:', verifyError);
        return { 
          success: false, 
          error: verifyError.message || 'Invalid verification code'
        };
      }

      if (verifyData.session) {
        console.log('✅ Phone verification successful with session');
        localStorage.removeItem('tempUserData');
        return { 
          success: true, 
          session: verifyData.session 
        };
      } else {
        console.error('❌ No session returned after verification');
        return { 
          success: false, 
          error: 'Verification failed - no session created'
        };
      }

    } catch (error: any) {
      console.error('❌ Phone OTP verification failed:', error);
      return { 
        success: false, 
        error: error.message || 'Verification failed. Please try again.' 
      };
    }
  }

  /**
   * Email Registration Flow - ENHANCED EMAIL + PASSWORD REGISTRATION
   */
  static async initiateEmailPasswordRegistration(data: EmailRegistrationData): Promise<RegistrationResult> {
    const registrationId = `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      console.log(`🚀 [${registrationId}] ENHANCED REGISTRATION: Starting email+password registration`, {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        timestamp: new Date().toISOString()
      });
      
      if (!data.password) {
        console.error(`❌ [${registrationId}] Password is required`);
        return { 
          success: false, 
          error: 'Password is required for email registration' 
        };
      }

      // Step 1: Check email availability
      console.log(`🔍 [${registrationId}] Checking email existence...`);
      const emailCheck = await EmailVerificationService.checkEmailExists(data.email);
      
      if (emailCheck.error) {
        console.error(`❌ [${registrationId}] Email check failed:`, emailCheck.error);
        return { 
          success: false, 
          error: 'Failed to verify email availability' 
        };
      }
      
      if (emailCheck.exists) {
        console.log(`❌ [${registrationId}] Email already exists`);
        return { 
          success: false, 
          error: 'Ky email është tashmë i regjistruar' 
        };
      }

      console.log(`✅ [${registrationId}] Email is available for registration`);

      // Step 2: Generate verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`🔢 [${registrationId}] Generated verification code:`, verificationCode);

      // Step 3: Store temporary user data
      const tempUserData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        verificationCode: verificationCode,
        verificationExpiry: Date.now() + 15 * 60 * 1000, // 15 minutes
        registrationMethod: 'email_password',
        registrationId: registrationId,
        ...data.additionalData
      };

      localStorage.setItem('tempEmailUserData', JSON.stringify(tempUserData));
      console.log(`💾 [${registrationId}] Stored temporary email user data`);

      // Step 4: Send verification email - ENHANCED CALL
      console.log(`📧 [${registrationId}] ENHANCED: Sending verification email...`);
      
      const emailResult = await EmailVerificationService.sendVerificationEmail(
        data.email,
        data.firstName || 'User',
        data.lastName || '',
        verificationCode
      );

      console.log(`📨 [${registrationId}] ENHANCED: Email send result`, {
        success: emailResult.success,
        error: emailResult.error,
        debug: emailResult.debug,
        timestamp: new Date().toISOString()
      });

      if (!emailResult.success) {
        console.error(`❌ [${registrationId}] ENHANCED: Email sending failed`, {
          error: emailResult.error,
          debug: emailResult.debug
        });
        localStorage.removeItem('tempEmailUserData');
        
        // Provide more specific error messages to users
        let userError = 'Failed to send verification email. Please try again.';
        if (emailResult.error?.includes('temporarily unavailable')) {
          userError = 'Email service is temporarily unavailable. Please try again in a few minutes.';
        } else if (emailResult.error?.includes('not properly configured')) {
          userError = 'There\'s a technical issue with our email service. Please contact support or try again later.';
        } else if (emailResult.error?.includes('Network')) {
          userError = 'Network connection issue. Please check your internet connection and try again.';
        }
        
        return { 
          success: false, 
          error: userError
        };
      }

      console.log(`✅ [${registrationId}] ENHANCED: Email verification sent successfully`);
      
      // Step 5: Set verification state
      localStorage.setItem('verificationType', 'email');
      localStorage.setItem('verificationEmail', data.email);
      
      return { 
        success: true, 
        requiresVerification: true 
      };

    } catch (error: any) {
      console.error(`❌ [${registrationId}] ENHANCED: Registration failed`, {
        error: error,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      localStorage.removeItem('tempEmailUserData');
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.' 
      };
    }
  }

  /**
   * Verify Email Registration Code and Complete Registration - ENHANCED VERSION
   */
  static async verifyEmailRegistration(email: string, verificationCode: string): Promise<RegistrationResult> {
    const verificationId = `verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      console.log(`🔐 [${verificationId}] ENHANCED VERIFY: Starting email verification`, {
        email: email,
        code: verificationCode,
        timestamp: new Date().toISOString()
      });

      // Step 1: Get stored user data
      const tempData = localStorage.getItem('tempEmailUserData');
      if (!tempData) {
        console.error(`❌ [${verificationId}] No pending verification found`);
        return { 
          success: false, 
          error: 'No pending verification found. Please start registration again.' 
        };
      }

      const userData = JSON.parse(tempData);
      console.log(`📋 [${verificationId}] Retrieved user data:`, {
        email: userData.email,
        hasPassword: !!userData.password,
        hasCode: !!userData.verificationCode,
        expiry: userData.verificationExpiry,
        currentTime: Date.now()
      });

      // Step 2: Validate email match
      if (userData.email !== email) {
        console.error(`❌ [${verificationId}] Email mismatch:`, {
          expected: userData.email,
          provided: email
        });
        return { 
          success: false, 
          error: 'Email does not match pending verification' 
        };
      }

      // Step 3: Check expiry
      if (Date.now() > userData.verificationExpiry) {
        console.error(`❌ [${verificationId}] Verification code expired`);
        localStorage.removeItem('tempEmailUserData');
        return { 
          success: false, 
          error: 'Verification code has expired. Please register again.' 
        };
      }

      // Step 4: Validate verification code
      if (userData.verificationCode !== verificationCode) {
        console.error(`❌ [${verificationId}] Invalid verification code:`, {
          expected: userData.verificationCode,
          provided: verificationCode
        });
        return { 
          success: false, 
          error: 'Invalid verification code' 
        };
      }

      console.log(`✅ [${verificationId}] Verification code valid, creating Supabase account`);

      // Step 5: Final email availability check
      const finalEmailCheck = await EmailVerificationService.checkEmailExists(userData.email);
      if (finalEmailCheck.exists) {
        console.error(`❌ [${verificationId}] Email taken during verification process`);
        localStorage.removeItem('tempEmailUserData');
        return { 
          success: false, 
          error: 'Ky email është tashmë i regjistruar' 
        };
      }

      console.log(`🚀 [${verificationId}] ENHANCED: Creating Supabase account...`);
      
      // Step 6: Create the account
      const { data: signUpData, error: signUpError }: AuthResponse = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            registration_method: 'email_password_verified',
            email_verified: true,
            verification_method: 'sendgrid_custom',
            birth_date: userData.birth_date,
            gender: userData.gender
          }
        }
      });

      if (signUpError) {
        console.error(`❌ [${verificationId}] Supabase account creation error:`, signUpError);
        
        if (signUpError.message?.includes('already') || signUpError.message?.includes('exists')) {
          return { 
            success: false, 
            error: 'Ky email është tashmë i regjistruar' 
          };
        }
        
        return { 
          success: false, 
          error: signUpError.message || 'Failed to create account' 
        };
      }

      if (!signUpData.user) {
        console.error(`❌ [${verificationId}] Account creation failed - no user created`);
        return { 
          success: false, 
          error: 'Account creation failed - no user created' 
        };
      }

      // Step 7: Clean up
      localStorage.removeItem('tempEmailUserData');

      console.log(`✅ [${verificationId}] ENHANCED: Email registration completed successfully`, {
        userId: signUpData.user.id,
        hasSession: !!signUpData.session,
        timestamp: new Date().toISOString()
      });
      
      return { 
        success: true, 
        session: signUpData.session 
      };

    } catch (error: any) {
      console.error(`❌ [${verificationId}] ENHANCED VERIFY: Unexpected error`, {
        error: error,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      return { 
        success: false, 
        error: error.message || 'Verification failed' 
      };
    }
  }
}
