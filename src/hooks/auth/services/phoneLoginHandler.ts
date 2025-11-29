
import { supabase } from '@/integrations/supabase/client';
import { getPhoneVariations } from '../utils/phoneUtils';

interface PhoneLoginResult {
  success: boolean;
  error?: string;
  user?: any;
  session?: any;
}

export const handleExistingUserPhoneLogin = async (phoneNumber: string): Promise<PhoneLoginResult> => {
  try {
    console.log('🔐 CRITICAL: Handling existing user phone login for:', phoneNumber);
    
    const phoneVariations = getPhoneVariations(phoneNumber);
    console.log('📱 Phone variations to check:', phoneVariations);
    
    // Check if this phone number exists in profiles table with phone_verified = true
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .in('phone_number', phoneVariations)
      .eq('phone_verified', true)
      .single();
    
    if (profileError || !existingProfile) {
      console.log('❌ Phone number not found in verified profiles');
      return {
        success: false,
        error: 'Ky numër telefoni nuk është i regjistruar ose i verifikuar në sistem'
      };
    }
    
    console.log('✅ Found existing verified profile:', existingProfile.id);
    
    // Since OTP was already verified by Supabase Auth, the user should already be logged in
    // We just need to confirm they have a session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('❌ No active session found after OTP verification');
      return {
        success: false,
        error: 'Sesioni i kyçjes nuk u gjet. Ju lutemi provoni përsëri.'
      };
    }
    
    console.log('✅ Active session found for user:', session.user.id);
    
    // Verify that the session user matches the profile
    if (session.user.id !== existingProfile.auth_user_id) {
      console.error('❌ Session user ID does not match profile auth_user_id');
      return {
        success: false,
        error: 'Gabim në verifikimin e identitetit'
      };
    }
    
    console.log('📞 Phone login successful for user:', session.user.id);
    
    return {
      success: true,
      user: session.user,
      session: session
    };
    
  } catch (error: any) {
    console.error('❌ CRITICAL ERROR in phone login:', error);
    return {
      success: false,
      error: 'Gabim në kyçjen me telefon: ' + (error.message || 'Unknown error')
    };
  }
};

// Function to check if phone number is available for registration
export const isPhoneAvailableForRegistration = async (phoneNumber: string): Promise<boolean> => {
  try {
    const phoneVariations = getPhoneVariations(phoneNumber);
    
    const { data: existingProfile, error } = await supabase
      .from('profiles')
      .select('id')
      .in('phone_number', phoneVariations)
      .single();
    
    // If no profile found, phone is available
    return !existingProfile;
    
  } catch (error) {
    console.error('Error checking phone availability:', error);
    return false; // Assume not available on error for safety
  }
};
