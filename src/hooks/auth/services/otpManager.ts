
import { supabase } from '@/integrations/supabase/client';
import { generateOTP } from './otpGenerator';
import { verifyOTP as verifyOTPService } from './otpVerifier';
import { getPhoneVariations } from '../utils/phoneUtils';

interface OTPResult {
  success: boolean;
  error?: string;
  canResend?: boolean;
  timeLeft?: number;
  codeExpired?: boolean;
}

const OTP_COOLDOWN_TIME = 30; // Reduced to 30 seconds for better UX
const otpCooldowns = new Map<string, number>();

// Function to expire old OTPs before sending new ones
const expireOldOTPs = async (phoneNumber: string): Promise<void> => {
  try {
    const phoneVariations = getPhoneVariations(phoneNumber);
    
    // Mark all previous OTPs as expired/used for this phone number
    const { error } = await supabase
      .from('security_events')
      .update({ 
        metadata: { used: true, expired_at: new Date().toISOString() } as any
      })
      .eq('event_type', 'otp_generated')
      .in('metadata->>contact', phoneVariations)
      .or('metadata->>used.is.null,metadata->>used.eq.false');

    if (error) {
      console.error('⚠️ Error expiring old OTPs:', error);
    } else {
      console.log('✅ Successfully expired old OTPs for:', phoneNumber);
    }
  } catch (error) {
    console.error('❌ Error in expireOldOTPs:', error);
  }
};

export const sendOTPForLogin = async (
  phoneNumber: string,
  isGenerating: boolean,
  setIsGenerating: (value: boolean) => void
): Promise<OTPResult> => {
  try {
    console.log('🔐 sendOTPForLogin called with phone:', phoneNumber);
    
    // Normalize phone number for consistent handling
    const phoneVariations = getPhoneVariations(phoneNumber);
    const normalizedPhone = phoneVariations[0]; // Use the first (cleaned) variation
    console.log('📱 Normalized phone number:', normalizedPhone);

    // Check cooldown using normalized number
    const lastSent = otpCooldowns.get(normalizedPhone);
    const now = Date.now();
    
    if (lastSent && (now - lastSent) < OTP_COOLDOWN_TIME * 1000) {
      const timeLeft = Math.ceil((OTP_COOLDOWN_TIME * 1000 - (now - lastSent)) / 1000);
      console.log('⏰ OTP cooldown active, time left:', timeLeft);
      return {
        success: false,
        error: `Ju lutemi prisni ${timeLeft} sekonda para se të kërkoni një kod të ri.`,
        canResend: false,
        timeLeft
      };
    }

    console.log('✅ No cooldown, proceeding with OTP generation');
    
    // CRITICAL: Expire all old OTPs before generating new one
    await expireOldOTPs(phoneNumber);

    // Generate and send OTP using normalized phone number
    const result = await generateOTP(normalizedPhone, isGenerating, setIsGenerating);
    console.log('📤 OTP generation result:', result);
    
    if (result.success) {
      // Set cooldown using normalized number
      otpCooldowns.set(normalizedPhone, now);
      console.log('⏰ Set cooldown for:', normalizedPhone);
      
      // Clear cooldown after time expires
      setTimeout(() => {
        otpCooldowns.delete(normalizedPhone);
        console.log('🧹 Cleared cooldown for:', normalizedPhone);
      }, OTP_COOLDOWN_TIME * 1000);
    }

    return result;
  } catch (error: any) {
    console.error('❌ Error in sendOTPForLogin:', error);
    return {
      success: false,
      error: 'Gabim në dërgimin e kodit të verifikimit'
    };
  }
};

export const verifyOTPForLogin = async (
  phoneNumber: string,
  otpCode: string,
  setIsVerifying: (value: boolean) => void
): Promise<OTPResult> => {
  try {
    console.log('🔍 verifyOTPForLogin called with phone:', phoneNumber, 'OTP:', otpCode);
    
    // Use phone variations for verification
    const phoneVariations = getPhoneVariations(phoneNumber);
    const normalizedPhone = phoneVariations[0];
    console.log('📱 Normalized phone for verification:', normalizedPhone);
    
    const result = await verifyOTPService(normalizedPhone, otpCode, setIsVerifying);
    console.log('✅ OTP verification result:', result);
    
    if (result.success) {
      // Clear cooldown on successful verification
      otpCooldowns.delete(normalizedPhone);
      console.log('🧹 Cleared cooldown after successful verification');
    }
    
    return {
      success: result.success,
      error: result.error,
      codeExpired: result.codeExpired
    };
  } catch (error: any) {
    console.error('❌ Error in verifyOTPForLogin:', error);
    return {
      success: false,
      error: 'Gabim në verifikimin e kodit'
    };
  }
};

export const canResendOTP = (phoneNumber: string): { canResend: boolean; timeLeft: number } => {
  const phoneVariations = getPhoneVariations(phoneNumber);
  const normalizedPhone = phoneVariations[0];
  const lastSent = otpCooldowns.get(normalizedPhone);
  const now = Date.now();
  
  console.log('🔍 Checking resend eligibility for:', normalizedPhone, 'Last sent:', lastSent);
  
  if (!lastSent) {
    console.log('✅ No previous OTP found, can resend immediately');
    return { canResend: true, timeLeft: 0 };
  }
  
  const timePassed = now - lastSent;
  const timeLeft = Math.ceil((OTP_COOLDOWN_TIME * 1000 - timePassed) / 1000);
  
  const canResend = timeLeft <= 0;
  console.log('⏰ Resend check result:', { canResend, timeLeft });
  
  return {
    canResend,
    timeLeft: Math.max(0, timeLeft)
  };
};

// Force clear cooldown - useful for manual resend button
export const forceClearOTPCooldown = (phoneNumber: string): void => {
  const phoneVariations = getPhoneVariations(phoneNumber);
  const normalizedPhone = phoneVariations[0];
  otpCooldowns.delete(normalizedPhone);
  console.log('🧹 Force cleared cooldown for:', normalizedPhone);
};
