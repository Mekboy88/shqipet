
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { validateEmail, validatePassword, rateLimitCheck } from '@/utils/security/inputValidation';
import { useOTPVerification } from './useOTPVerification';
import { toast } from 'sonner';

export const useSecureAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { verifyOTP } = useOTPVerification();

  const secureLogin = async (email: string, password: string, verificationCode?: string) => {
    setIsLoading(true);
    
    try {
      console.log('⚡ Ultra-fast secure login for:', email);
      
      // Basic email format check only (no complex validation)
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      if (!password) {
        throw new Error('Password is required');
      }

      // Direct login attempt without verification codes for faster login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('🔴 Login error:', error);
        throw error;
      }

      console.log('✅ Secure login successful');
      return { success: true, data };
    } catch (error: any) {
      console.error('❌ Secure login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const secureSignUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    
    try {
      // Rate limiting check
      if (!rateLimitCheck(`signup_${email}`, 3, 60 * 60 * 1000)) {
        throw new Error('Too many signup attempts. Please try again in 1 hour.');
      }

      // Input validation
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error);
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.error);
      }

      // Sign up with proper redirect URL
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (error) throw error;

      // Log signup attempt
      await supabase
        .from('security_events')
        .insert({
          user_id: data.user?.id,
          event_type: 'signup_attempt',
          event_description: 'User signup attempt',
          metadata: { 
            email,
            timestamp: new Date().toISOString()
          },
          risk_level: 'low'
        });

      return { success: true, data };
    } catch (error: any) {
      console.error('Secure signup error:', error);
      toast.error(error.message || 'Signup failed');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    secureLogin,
    secureSignUp,
    isLoading
  };
};
