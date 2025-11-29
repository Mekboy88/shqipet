
import { supabase } from '@/integrations/supabase/client';
import { getPhoneVariations } from '../utils/phoneUtils';

interface OTPVerificationResult {
  success: boolean;
  error?: string;
  needsAccountCreation?: boolean;
  codeExpired?: boolean;
}

interface OTPMetadata {
  contact: string;
  used?: boolean;
  expires_at: string;
  otp_hash: string;
  used_at?: string;
}

// Type guard function to validate OTP metadata
function isValidOTPMetadata(metadata: any): metadata is OTPMetadata {
  return (
    metadata &&
    typeof metadata === 'object' &&
    !Array.isArray(metadata) &&
    typeof metadata.contact === 'string' &&
    typeof metadata.expires_at === 'string' &&
    typeof metadata.otp_hash === 'string'
  );
}

export const verifyOTP = async (
  contact: string,
  otpCode: string,
  setIsVerifying: (value: boolean) => void
): Promise<OTPVerificationResult> => {
  try {
    console.log('🔐 Starting OTP verification for:', contact, 'with OTP:', otpCode);
    setIsVerifying(true);

    // Determine contact type
    const contactType = contact.includes('@') ? 'email' : 'phone';
    console.log('📱 Contact type determined as:', contactType);

    if (contactType === 'phone') {
      // CRITICAL: Use Supabase Auth OTP verification to create session
      console.log('🔐 Verifying OTP with Supabase Auth for session creation...');
      
      // Get all phone variations to try verification
      const phoneFormats = getPhoneVariations(contact);
      console.log('📱 Trying verification with phone variations:', phoneFormats);
      
      let verifyData = null;
      let verifyError = null;
      
      // Try verification with the primary phone format first
      for (const phoneNumber of phoneFormats) {
        console.log(`🔍 Attempting verification with phone: ${phoneNumber}`);
        
        const { data, error } = await supabase.auth.verifyOtp({
          phone: phoneNumber,
          token: otpCode.trim(), // Remove any whitespace
          type: 'sms'
        });

        if (!error && data?.session) {
          console.log(`✅ Verification successful with phone: ${phoneNumber}`);
          verifyData = data;
          verifyError = null;
          break;
        } else if (error) {
          console.log(`❌ Verification failed with phone ${phoneNumber}:`, error.message);
          verifyError = error;
        }
      }

      // If all variations failed, return error
      if (verifyError && !verifyData?.session) {
        console.error('❌ Supabase OTP verification failed for all phone variations:', verifyError);
        
        // Provide specific error messages based on error type
        let errorMessage = 'Kodi i verifikimit është i gabuar ose ka skaduar';
        let isExpired = false;
        
        if (verifyError.message?.includes('expired')) {
          errorMessage = 'Kodi i verifikimit ka skaduar. Ju lutemi kërkoni një kod të ri.';
          isExpired = true;
        } else if (verifyError.message?.includes('invalid')) {
          errorMessage = 'Kodi i verifikimit është i gabuar. Ju lutemi kontrolloni dhe provoni përsëri.';
        } else if (verifyError.message?.includes('too_many_requests')) {
          errorMessage = 'Shumë tentativa të dështuara. Ju lutemi prisni dhe provoni përsëri.';
        }
        
        return {
          success: false,
          error: errorMessage,
          codeExpired: isExpired
        };
      }

      // Check if session was created
      if (!verifyData?.session) {
        console.error('❌ CRITICAL: OTP verified but no session created');
        return {
          success: false,
          error: 'Gabim në krijimin e sesionit të hyrjes. Ju lutemi provoni përsëri.'
        };
      }

      console.log('✅ Supabase OTP verification succeeded with session:', {
        access_token: verifyData.session.access_token ? 'present' : 'missing',
        userId: verifyData.user?.id,
        phone: verifyData.user?.phone
      });

      // Now also mark our manual OTP record as used for consistency (optional)
      const manualOtpPhoneVariations = getPhoneVariations(contact);
      console.log('🔍 Searching for manual OTP record to mark as used:', manualOtpPhoneVariations);

      try {
        const { data: otpRecords, error: otpError } = await supabase
          .from('security_events')
          .select('*')
          .eq('event_type', 'otp_generated')
          .in('metadata->>contact', manualOtpPhoneVariations)
          .order('created_at', { ascending: false });

        if (otpRecords && otpRecords.length > 0) {
          // Find the most recent valid OTP record to mark as used
          for (const record of otpRecords) {
            if (!isValidOTPMetadata(record.metadata)) {
              continue;
            }

            const metadata = record.metadata;
            
            if (metadata.used) {
              continue;
            }

            const expiresAt = new Date(metadata.expires_at);
            const now = new Date();
            
            if (now <= expiresAt) {
              // Mark this OTP as used
              const updatedMetadata = {
                contact: metadata.contact,
                used: true,
                expires_at: metadata.expires_at,
                otp_hash: metadata.otp_hash,
                used_at: new Date().toISOString()
              };

              await supabase
                .from('security_events')
                .update({
                  metadata: updatedMetadata
                })
                .eq('id', record.id);
              
              console.log('✅ Marked manual OTP record as used:', record.id);
              break;
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ Could not update manual OTP record, but verification succeeded:', error);
      }

      // CRITICAL: Update profile phone verification status after successful OTP
      if (verifyData?.session?.user?.id) {
        console.log('📱 Updating phone verification status in profile...');
        
        try {
          const { error: syncError } = await supabase.rpc('sync_phone_verification_status', {
            user_uuid: verifyData.session.user.id,
            phone_number_param: contact,
            is_verified: true
          });
          
          if (syncError) {
            console.error('Error syncing phone verification:', syncError);
          } else {
            console.log('✅ Phone verification status synced successfully');
          }
        } catch (syncErr) {
          console.error('Error calling sync function:', syncErr);
        }
      }

      console.log('🎉 OTP verification completed successfully with session');
      return { success: true };

    } else {
      // Handle email OTP verification (existing logic)
      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        email: contact,
        token: otpCode.trim(),
        type: 'email'
      });

      if (verifyError) {
        console.error('❌ Email OTP verification failed:', verifyError);
        return {
          success: false,
          error: 'Kodi i verifikimit është i gabuar ose ka skaduar'
        };
      }

      if (!verifyData.session) {
        console.error('❌ Email OTP verified but no session created');
        return {
          success: false,
          error: 'Gabim në krijimin e sesionit të hyrjes'
        };
      }

      return { success: true };
    }

  } catch (error: any) {
    console.error('❌ Error in OTP verification:', error);
    return {
      success: false,
      error: 'Gabim në verifikimin e kodit. Ju lutemi provoni përsëri.'
    };
  } finally {
    setIsVerifying(false);
  }
};
