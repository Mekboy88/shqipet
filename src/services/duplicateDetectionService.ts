
import { supabase } from '@/integrations/supabase/client';
import { getPhoneVariations } from '@/hooks/auth/utils/phoneUtils';

export class DuplicateDetectionService {
  /**
   * Check if email or phone number already exists in the system
   */
  static async checkDuplicate(contact: string, isPhone: boolean): Promise<{ exists: boolean; user?: any; error?: string }> {
    try {
      console.log('🔍 Checking duplicate for:', contact, 'isPhone:', isPhone);

      if (isPhone) {
        // Check phone number with all variations
        const phoneVariations = getPhoneVariations(contact);
        console.log('📱 Checking phone variations:', phoneVariations);
        
        for (const variation of phoneVariations) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('auth_user_id, first_name, last_name, profile_image_url, phone_number')
            .eq('phone_number', variation)
            .maybeSingle();

          if (profileError && profileError.code !== 'PGRST116') {
            console.error('❌ Profile check error:', profileError);
            continue;
          }

          if (profileData) {
            console.log('❌ Phone number exists in profiles:', variation);
            return { 
              exists: true, 
              user: {
                firstName: profileData.first_name,
                lastName: profileData.last_name,
                profileImage: profileData.profile_image_url,
                contact: variation
              }
            };
          }
        }

        console.log('✅ Phone number not found in profiles');
        return { exists: false };
      } else {
        // Check email - first check in profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('auth_user_id, first_name, last_name, profile_image_url, email')
          .eq('email', contact.toLowerCase().trim())
          .maybeSingle();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('❌ Profile email check error:', profileError);
          return { exists: false, error: 'Database error' };
        }

        if (profileData) {
          console.log('❌ Email exists in profiles:', contact);
          return { 
            exists: true, 
            user: {
              firstName: profileData.first_name,
              lastName: profileData.last_name,
              profileImage: profileData.profile_image_url,
              contact: contact
            }
          };
        }

        console.log('✅ Email not found in profiles');
        return { exists: false };
      }

    } catch (error: any) {
      console.error('❌ Duplicate check error:', error);
      return { exists: false, error: error.message };
    }
  }
}
