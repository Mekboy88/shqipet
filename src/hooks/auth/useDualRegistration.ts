
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { RegistrationService, PhoneRegistrationData, EmailRegistrationData, RegistrationResult } from '@/services/registrationService';
import { useAuth } from '@/contexts/AuthContext';

export type RegistrationMethod = 'phone' | 'email_password';

export interface DualRegistrationState {
  isLoading: boolean;
  currentMethod: RegistrationMethod | null;
  requiresVerification: boolean;
  pendingPhone?: string;
  pendingEmail?: string;
}

export const useDualRegistration = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [state, setState] = useState<DualRegistrationState>({
    isLoading: false,
    currentMethod: null,
    requiresVerification: false
  });

  /**
   * Start phone registration flow
   */
  const startPhoneRegistration = async (data: PhoneRegistrationData): Promise<RegistrationResult> => {
    setState(prev => ({ ...prev, isLoading: true, currentMethod: 'phone' }));
    
    try {
      const result = await RegistrationService.initiatePhoneRegistration(data);
      
      if (result.success && result.requiresVerification) {
        setState(prev => ({ 
          ...prev, 
          requiresVerification: true,
          pendingPhone: data.phoneNumber 
        }));
        toast.success('Verification code sent to your phone!');
      } else if (!result.success) {
        toast.error(result.error || 'Registration failed');
        setState(prev => ({ ...prev, currentMethod: null }));
      }
      
      return result;
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      setState(prev => ({ ...prev, currentMethod: null }));
      return { success: false, error: error.message };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  /**
   * Verify phone registration OTP
   */
  const verifyPhoneRegistration = async (otpCode: string): Promise<RegistrationResult> => {
    if (!state.pendingPhone) {
      const error = 'No pending phone verification';
      toast.error(error);
      return { success: false, error };
    }

    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const result = await RegistrationService.verifyPhoneRegistration(state.pendingPhone, otpCode);
      
      if (result.success && result.session) {
        // Registration completed successfully
        setState(prev => ({ 
          ...prev, 
          requiresVerification: false,
          pendingPhone: undefined,
          currentMethod: null
        }));
        
        toast.success('Registration completed successfully!');
        navigate('/');
      } else if (!result.success) {
        toast.error(result.error || 'Verification failed');
      }
      
      return result;
    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
      return { success: false, error: error.message };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  /**
   * Start email + password registration
   */
  const startEmailPasswordRegistration = async (data: EmailRegistrationData): Promise<RegistrationResult> => {
    setState(prev => ({ ...prev, isLoading: true, currentMethod: 'email_password' }));
    
    try {
      const result = await RegistrationService.initiateEmailPasswordRegistration(data);
      
      if (result.success) {
        if (result.session) {
          // Registration completed immediately (email confirmation disabled)
          setState(prev => ({ 
            ...prev, 
            requiresVerification: false,
            currentMethod: null
          }));
          toast.success('Registration completed successfully!');
          navigate('/');
        } else if (result.requiresVerification) {
          // Email confirmation required
          setState(prev => ({ 
            ...prev, 
            requiresVerification: true,
            pendingEmail: data.email 
          }));
          toast.success('Please check your email to confirm your account!');
        }
      } else {
        toast.error(result.error || 'Registration failed');
        setState(prev => ({ ...prev, currentMethod: null }));
      }
      
      return result;
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      setState(prev => ({ ...prev, currentMethod: null }));
      return { success: false, error: error.message };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  /**
   * Reset registration state
   */
  const resetRegistration = () => {
    setState({
      isLoading: false,
      currentMethod: null,
      requiresVerification: false,
      pendingPhone: undefined,
      pendingEmail: undefined
    });
  };

  return {
    // State
    ...state,
    
    // Phone registration
    startPhoneRegistration,
    verifyPhoneRegistration,
    
    // Email registration
    startEmailPasswordRegistration,
    
    // Utilities
    resetRegistration
  };
};
