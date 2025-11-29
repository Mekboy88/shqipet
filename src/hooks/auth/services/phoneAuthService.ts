
import { supabase } from '@/integrations/supabase/client';
import { perTabSupabase } from '@/integrations/supabase/perTabClient';
import { toast } from 'sonner';
import { getPhoneVariations } from '../utils/phoneUtils';

interface PhoneLoginResult {
  success: boolean;
  error?: string;
  user?: any;
  session?: any;
}

export const loginWithPhone = async (phoneNumber: string): Promise<PhoneLoginResult> => {
  try {
    console.log('🔐 Starting phone login for existing user:', phoneNumber);
    
    const phoneVariations = getPhoneVariations(phoneNumber);
    console.log('📱 Checking ALL phone variations:', phoneVariations);
    
    // STEP 1: Verify user exists in profiles table with extensive debugging
    console.log('🔍 CRITICAL: About to search profiles table with variations:', phoneVariations);
    
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .in('phone_number', phoneVariations);

    console.log('📋 CRITICAL: Raw profiles query result:', { profiles, error: profileError, variationsUsed: phoneVariations });

    if (profileError) {
      console.error('❌ Database error during profile lookup:', profileError);
      return {
        success: false,
        error: `Database error: ${profileError.message}`
      };
    }

    if (!profiles || profiles.length === 0) {
      console.error('❌ CRITICAL: No profiles found with phone variations:', phoneVariations);
      console.error('❌ This means the phone number does not exist in our database');
      
      // Try a broader search to debug
      const { data: allProfiles, error: allError } = await supabase
        .from('profiles')
        .select('phone_number, first_name, last_name')
        .not('phone_number', 'is', null);
      
      console.log('📋 ALL phone numbers in database for debugging:', allProfiles?.map(p => p.phone_number));
      
      return {
        success: false,
        error: 'Nuk u gjet asnjë llogari me këtë numër telefoni. Ju lutemi regjistrohuni fillimisht.'
      };
    }

    const profile = profiles[0];
    console.log('✅ Found existing user profile:', {
      id: profile.id,
      auth_user_id: profile.auth_user_id,
      phone: profile.phone_number,
      email: profile.email,
      name: `${profile.first_name} ${profile.last_name}`
    });

    // Check account status
    if (profile.account_status !== 'active') {
      return {
        success: false,
        error: 'Llogaria juaj nuk është aktive. Ju lutemi kontaktoni mbështetjen.'
      };
    }

    // STEP 2: Get current session to check authentication state
    const { data: { session: currentSession } } = await perTabSupabase.auth.getSession();
    
    if (currentSession?.user?.id === profile.auth_user_id) {
      console.log('✅ User already signed in with correct account');
      return {
        success: true,
        user: profile,
        session: currentSession
      };
    }

    // STEP 3: If different user is signed in, sign them out first
    if (currentSession?.user && currentSession.user.id !== profile.auth_user_id) {
      console.log('🔄 Different user signed in, signing out first');
      await perTabSupabase.auth.signOut({ scope: 'local' });
    }

    // STEP 4: The user should already be authenticated via OTP at this point
    // Just get the session and validate it matches our expected user
    const { data: { session }, error: sessionError } = await perTabSupabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      console.error('❌ No valid session found after OTP verification:', sessionError);
      return {
        success: false,
        error: 'Sesioni i hyrjes nuk u krijua. Ju lutemi provoni përsëri.'
      };
    }

    // STEP 5: Validate that the session belongs to the correct user
    if (session.user.id !== profile.auth_user_id) {
      console.error('🚨 Session user mismatch:', {
        sessionUserId: session.user.id,
        expectedUserId: profile.auth_user_id
      });
      
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Gabim në verifikimin e identitetit. Ju lutemi provoni përsëri.'
      };
    }

    console.log('✅ Successfully logged into existing phone account');
    return {
      success: true,
      user: profile,
      session: session
    };

  } catch (error: any) {
    console.error('❌ Phone login error:', error);
    return {
      success: false,
      error: error.message || 'Gabim në hyrje me numrin e telefonit'
    };
  }
};

export const createPhoneUser = async (userData: {
  phoneNumber: string;
  firstName: string;
  lastName: string;
}): Promise<PhoneLoginResult> => {
  try {
    console.log('Creating phone user via Supabase Auth:', userData);
    
    // Use Supabase Auth to create the user with phone
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      phone: userData.phoneNumber,
      password: Math.random().toString(36), // Random password for phone-only users
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          registration_method: 'phone'
        }
      }
    });

    if (signUpError) {
      console.error('Phone user creation failed:', signUpError);
      return {
        success: false,
        error: signUpError.message || 'Gabim në krijimin e llogarisë'
      };
    }

    console.log('✅ Phone user created successfully');
    return {
      success: true,
      user: signUpData.user,
      session: signUpData.session
    };
  } catch (error: any) {
    console.error('Phone user creation error:', error);
    return {
      success: false,
      error: error.message || 'Gabim në krijimin e llogarisë'
    };
  }
};

export const checkPhoneUserExists = async (phoneNumber: string): Promise<{ exists: boolean; user?: any }> => {
  try {
    const phoneVariations = getPhoneVariations(phoneNumber);
    console.log('🔍 EXTREME DEBUG: Checking if phone user exists');
    console.log('📱 Input phone number:', phoneNumber);
    console.log('📱 Generated variations:', phoneVariations);
    
    // Search in profiles table with all variations
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .in('phone_number', phoneVariations);

    console.log('📋 EXTREME DEBUG: Database query result:', {
      profiles: profiles,
      error: error,
      profilesCount: profiles?.length || 0,
      variationsSearched: phoneVariations
    });

    if (error) {
      console.error('❌ Error checking phone user existence:', error);
      return { exists: false };
    }

    const exists = !!profiles && profiles.length > 0;
    const user = profiles?.[0] || null;
    
    console.log(`📋 EXTREME DEBUG: Phone user exists: ${exists}`);
    if (exists) {
      console.log('👤 Found user:', {
        id: user.id,
        phone: user.phone_number,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email
      });
    } else {
      console.log('❌ NO USER FOUND with any of these phone variations:', phoneVariations);
      
      // Additional debugging - show what phone numbers DO exist
      const { data: allUsers } = await supabase
        .from('profiles')
        .select('phone_number, first_name, last_name')
        .not('phone_number', 'is', null)
        .limit(10);
      
      console.log('📋 Sample of existing phone numbers in database:', 
        allUsers?.map(u => u.phone_number) || []);
    }
    
    return { exists, user };
  } catch (error) {
    console.error('❌ Error in checkPhoneUserExists:', error);
    return { exists: false };
  }
};
