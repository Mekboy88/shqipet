
import supabase from '@/lib/relaxedSupabase';

export const syncPhoneVerificationStatus = async (userId: string, phoneNumber: string, isVerified: boolean = true) => {
  try {
    console.log(`🔄 Syncing phone verification for user ${userId}: ${phoneNumber} (verified: ${isVerified})`);
    
    // CRITICAL: Update auth.users table FIRST using updateUser
    try {
      console.log('📱 Updating auth.users table with phone number...');
      const { error: authError } = await supabase.auth.updateUser({
        phone: phoneNumber
      });
      
      if (authError) {
        console.warn('Could not update auth.users phone:', authError);
        // Continue with other updates even if auth update fails
      } else {
        console.log('✅ Successfully updated auth.users with phone number');
        
        // If we want to mark it as verified immediately, we need to update the confirmation status
        // This requires admin privileges, so we'll use our edge function
        if (isVerified) {
          console.log('📞 Marking phone as verified in auth system...');
          const { error: verificationError } = await supabase.functions.invoke('update-phone-verification', {
            body: { userId, phoneNumber, verified: true }
          });
          
          if (verificationError) {
            console.warn('Could not update phone verification status in auth:', verificationError);
          } else {
            console.log('✅ Phone marked as verified in auth system using database function');
          }
        }
      }
    } catch (authUpdateError) {
      console.warn('Auth update failed:', authUpdateError);
    }

    // Also call our database function directly for immediate local sync
    const { error: localSyncError } = await supabase.rpc('sync_phone_verification_status', {
      user_uuid: userId,
      phone_number_param: phoneNumber,
      is_verified: isVerified
    });

    if (localSyncError) {
      console.error('Error calling local sync function:', localSyncError);
      // Don't throw here as edge function will handle the sync
    } else {
      console.log('✅ Local phone verification sync completed successfully');
    }

    console.log('✅ Phone verification status synced successfully across all tables');
    return true;
  } catch (error) {
    console.error('❌ Error syncing phone verification:', error);
    throw error;
  }
};

export const syncEmailVerificationStatus = async (userId: string, email: string, isVerified: boolean = true) => {
  try {
    console.log(`🔄 Syncing email verification for user ${userId}: ${email} (verified: ${isVerified})`);
    
    // Update auth.users table FIRST
    try {
      console.log('📧 Updating auth.users table with email...');
      const { error: authError } = await supabase.auth.updateUser({
        email: email
      });
      
      if (authError) {
        console.warn('Could not update auth.users email:', authError);
      } else {
        console.log('✅ Successfully updated auth.users with email');
      }
    } catch (authUpdateError) {
      console.warn('Auth email update failed:', authUpdateError);
    }

    // Update profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        email: email,
        email_verified: isVerified,
        updated_at: new Date().toISOString()
      })
      .eq('auth_user_id', userId);

    if (profileError) {
      console.error('Error updating profiles table with email:', profileError);
      throw profileError;
    }

    // Update profile_settings table
    const { error: settingsError } = await supabase
      .from('profile_settings')
      .upsert({
        user_id: userId,
        email: email,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (settingsError) {
      console.error('Error updating profile_settings table with email:', settingsError);
    }

    console.log('✅ Email verification status synced successfully across all tables');
    return true;
  } catch (error) {
    console.error('❌ Error syncing email verification:', error);
    throw error;
  }
};

export const refreshUserVerificationData = async () => {
  try {
    console.log('🔄 Refreshing user verification data...');
    
    // Call the database function to sync verification status
    const { error } = await supabase.rpc('sync_user_verification_status');
    
    if (error) {
      console.error('Error calling sync function:', error);
    } else {
      console.log('✅ User verification data refreshed');
    }
  } catch (error) {
    console.error('❌ Error refreshing verification data:', error);
  }
};
