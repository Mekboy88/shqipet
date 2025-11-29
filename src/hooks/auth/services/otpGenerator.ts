
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isPhoneNumber, getPhoneVariations } from '../utils/phoneUtils';
import { OTPVerificationResult } from '../types/otpTypes';

// Global session-based OTP generation tracking
const SESSION_KEY = 'otp_generation_session';
const GENERATION_LOCK_KEY = 'otp_generation_lock';

// Initialize session tracking
const getSessionId = () => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `otp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

// Global lock management with session persistence
const isGenerationLocked = () => {
  const lockData = sessionStorage.getItem(GENERATION_LOCK_KEY);
  if (!lockData) return false;
  
  try {
    const { timestamp, sessionId } = JSON.parse(lockData);
    const currentSession = getSessionId();
    
    // Lock expires after 30 seconds or if it's from a different session
    const isExpired = Date.now() - timestamp > 30000;
    const isDifferentSession = sessionId !== currentSession;
    
    if (isExpired || isDifferentSession) {
      sessionStorage.removeItem(GENERATION_LOCK_KEY);
      return false;
    }
    
    return true;
  } catch {
    sessionStorage.removeItem(GENERATION_LOCK_KEY);
    return false;
  }
};

const setGenerationLock = () => {
  const lockData = {
    timestamp: Date.now(),
    sessionId: getSessionId()
  };
  sessionStorage.setItem(GENERATION_LOCK_KEY, JSON.stringify(lockData));
};

const clearGenerationLock = () => {
  sessionStorage.removeItem(GENERATION_LOCK_KEY);
};

// Check if OTP was already sent for this contact in this session (with expiry)
const wasOTPAlreadySent = (contact: string) => {
  const key = `otp_sent_${contact}_${getSessionId()}`;
  const sentData = sessionStorage.getItem(key);
  
  if (!sentData) return false;
  
  try {
    const { timestamp } = JSON.parse(sentData);
    // OTP tracking expires after 5 minutes (same as OTP expiry)
    const isExpired = Date.now() - timestamp > 5 * 60 * 1000;
    
    if (isExpired) {
      sessionStorage.removeItem(key);
      return false;
    }
    
    return true;
  } catch {
    sessionStorage.removeItem(key);
    return false;
  }
};

const markOTPAsSent = (contact: string) => {
  const key = `otp_sent_${contact}_${getSessionId()}`;
  const sentData = {
    timestamp: Date.now(),
    sessionId: getSessionId()
  };
  sessionStorage.setItem(key, JSON.stringify(sentData));
};

// Clean up OTP tracking for a specific contact
export const clearOTPTracking = (contact: string) => {
  const sessionId = getSessionId();
  const key = `otp_sent_${contact}_${sessionId}`;
  sessionStorage.removeItem(key);
  console.log(`🧹 Cleared OTP tracking for contact: ${contact}`);
};

// Clean up all expired OTP tracking data
export const cleanupExpiredOTPTracking = () => {
  const sessionId = getSessionId();
  
  for (let i = sessionStorage.length - 1; i >= 0; i--) {
    const key = sessionStorage.key(i);
    if (key && key.startsWith(`otp_sent_`) && key.includes(sessionId)) {
      const sentData = sessionStorage.getItem(key);
      if (sentData) {
        try {
          const { timestamp } = JSON.parse(sentData);
          const isExpired = Date.now() - timestamp > 5 * 60 * 1000;
          if (isExpired) {
            sessionStorage.removeItem(key);
            console.log(`🧹 Removed expired OTP tracking: ${key}`);
          }
        } catch {
          sessionStorage.removeItem(key);
        }
      }
    }
  }
};

export const generateOTP = async (
  contact: string,
  isGenerating: boolean,
  setIsGenerating: (value: boolean) => void
): Promise<OTPVerificationResult> => {
  const sessionId = getSessionId();
  console.log(`🔐 OTP Generation Request - Session: ${sessionId}, Contact: ${contact}`);
  
  // Clean up expired tracking data first
  cleanupExpiredOTPTracking();
  
  // Multiple layers of protection against duplicate OTP generation
  if (isGenerating) {
    console.log('🚫 OTP generation blocked - local state indicates already generating');
    return { success: false, error: 'Gjenerimi i kodit është në proces' };
  }

  if (isGenerationLocked()) {
    console.log('🚫 OTP generation blocked - global session lock active');
    return { success: false, error: 'Gjenerimi i kodit është në proces' };
  }

  // Remove the "already sent" check to always allow sending new OTP
  // Users can request new codes as needed

  // Set all locks immediately
  setIsGenerating(true);
  setGenerationLock();
  
  try {
    const contactType = isPhoneNumber(contact) ? 'phone' : 'email';
    console.log(`🔐 Generating OTP for ${contactType}: ${contact} (Session: ${sessionId})`);
    
    if (contactType === 'phone') {
      // Use the dedicated SMS edge function for better reliability
      console.log('📲 Using dedicated SMS edge function to send OTP...');
      
      // Get the primary phone format
      const phoneVariations = getPhoneVariations(contact);
      const primaryPhone = phoneVariations[0]; // Use the first (normalized) variation
      
      console.log(`📱 Sending OTP to primary phone format: ${primaryPhone}`);
      
      // Generate OTP code manually since we're using custom SMS function
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const message = `Kodi juaj i verifikimit për Shqipet është: ${otp}. Ky kod skadon pas 5 minutash.`;
      
      try {
        // Use the SMS edge function
        const { data, error } = await supabase.functions.invoke('send-sms-otp', {
          body: {
            phoneNumber: primaryPhone,
            message: message,
            retryAttempt: 0
          }
        });

        if (error) {
          console.error('❌ SMS edge function error:', error);
          
          // Fallback to Supabase Auth OTP
          console.log('🔄 Falling back to Supabase Auth OTP...');
          const { data: authData, error: authError } = await supabase.auth.signInWithOtp({
            phone: primaryPhone,
            options: {
              shouldCreateUser: true,
            }
          });

          if (authError) {
            console.error('❌ Both SMS methods failed:', authError);
            return { 
              success: false, 
              error: 'Gabim në dërgimin e kodit të verifikimit. Ju lutemi kontrolloni numrin tuaj të telefonit.'
            };
          }
          
          console.log('✅ Fallback Supabase Auth OTP sent successfully');
        } else {
          console.log('✅ SMS edge function sent successfully:', data);
          
          // Store OTP for verification when using custom SMS
          const otpMetadata = {
            otp_hash: btoa(otp), // Basic encoding
            contact: primaryPhone,
            contact_type: contactType,
            expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
            used: false,
            created_at: new Date().toISOString(),
            session_id: sessionId
          };

          await supabase
            .from('security_events')
            .insert({
              event_type: 'otp_generated',
              event_description: `Custom SMS OTP generated for ${contactType}: ${primaryPhone} (Session: ${sessionId})`,
              metadata: otpMetadata as any,
              risk_level: 'low'
            });

          console.log('💾 Custom SMS OTP record stored for verification');
        }
      } catch (smsError) {
        console.error('❌ SMS sending failed, trying Supabase Auth fallback:', smsError);
        
        // Final fallback to Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithOtp({
          phone: primaryPhone,
          options: {
            shouldCreateUser: true,
          }
        });

        if (authError) {
          console.error('❌ All SMS methods failed:', authError);
          return { 
            success: false, 
            error: 'Gabim në dërgimin e kodit të verifikimit. Ju lutemi kontrolloni numrin tuaj të telefonit.'
          };
        }
        
        console.log('✅ Final fallback Supabase Auth OTP sent successfully');
      }
      
      // Mark OTP as sent for this session
      markOTPAsSent(contact);
      
      return { success: true };
    } else {
      // For email, use Supabase Auth as well
      const { data, error } = await supabase.auth.signInWithOtp({
        email: contact,
        options: {
          shouldCreateUser: true,
        }
      });

      if (error) {
        console.error('❌ Email OTP sending error:', error);
        return { 
          success: false, 
          error: 'Gabim në dërgimin e kodit të verifikimit në email'
        };
      }

      console.log('📧 Email OTP sent successfully');
      markOTPAsSent(contact);
      
      return { success: true };
    }
  } catch (error: any) {
    console.error('❌ Error generating OTP:', error);
    return { success: false, error: 'Gabim në gjenerimin e kodit të verifikimit' };
  } finally {
    // Always clear locks in the finally block
    setIsGenerating(false);
    clearGenerationLock();
  }
};

// Cleanup function to call when leaving verification page
export const cleanupOTPSession = () => {
  console.log('🧹 Cleaning up OTP session data');
  const sessionId = getSessionId();
  
  // Remove all session-specific data
  for (let i = sessionStorage.length - 1; i >= 0; i--) {
    const key = sessionStorage.key(i);
    if (key && (key.includes(sessionId) || key === GENERATION_LOCK_KEY)) {
      sessionStorage.removeItem(key);
    }
  }
  
  // Remove the session itself
  sessionStorage.removeItem(SESSION_KEY);
};
