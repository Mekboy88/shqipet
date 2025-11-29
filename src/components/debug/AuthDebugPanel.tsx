/**
 * AuthDebugPanel - Quick auth status checker for debugging
 */

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import supabase from '@/lib/relaxedSupabase';

interface DebugResult {
  sessionExists: boolean;
  userRole: string | null;
  profileExists: boolean;
  profileData: any;
  errors: string[];
}

const AuthDebugPanel: React.FC = () => {
  const { user, session, userProfile, loading } = useAuth();
  const [checking, setChecking] = useState(false);
  const [debugResult, setDebugResult] = useState<DebugResult | null>(null);

  const checkAuthStatus = async () => {
    setChecking(true);
    const errors: string[] = [];
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('Session check:', { session: !!session, error });
      
      if (error) errors.push(`Session error: ${error.message}`);
      
      let userRole: string | null = null;
      let profileData: any = null;
      
      if (session) {
        // Check user role
        const { data, error: rpcError } = await supabase.rpc('get_current_user_role');
        console.log('User role check:', { data, error: rpcError });
        
        if (rpcError) {
          errors.push(`Role error: ${rpcError.message}`);
        } else {
          userRole = data;
        }
        
        // Check profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, email, first_name, last_name')
          .eq('id', session.user.id)
          .maybeSingle();
        
        console.log('Profile check:', { profileData: profile, profileError });
        
        if (profileError) {
          errors.push(`Profile error: ${profileError.message}`);
        } else {
          profileData = profile;
        }
      }
      
      setDebugResult({
        sessionExists: !!session,
        userRole,
        profileExists: !!profileData,
        profileData,
        errors
      });
      
    } catch (error) {
      console.error('Auth debug error:', error);
      errors.push(`General error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setDebugResult({
        sessionExists: false,
        userRole: null,
        profileExists: false,
        profileData: null,
        errors
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-50 max-w-sm max-h-96 overflow-auto">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="text-sm space-y-1 mb-3">
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>User: {user ? 'Yes' : 'No'}</p>
        <p>Session: {session ? 'Yes' : 'No'}</p>
        <p>Profile: {userProfile ? 'Yes' : 'No'}</p>
        {user && <p>User ID: {user.id.substring(0, 8)}...</p>}
      </div>
      
      <Button 
        onClick={checkAuthStatus}
        size="sm" 
        className="w-full mb-2"
        disabled={checking}
      >
        {checking ? 'Checking...' : 'Check Auth'}
      </Button>
      
      {debugResult && (
        <div className="text-xs space-y-2 bg-gray-50 dark:bg-gray-700 p-2 rounded">
          <h4 className="font-semibold">Debug Results:</h4>
          <div className="space-y-1">
            <p>Session: {debugResult.sessionExists ? '✅' : '❌'}</p>
            <p>Role: {debugResult.userRole || 'None'}</p>
            <p>Profile: {debugResult.profileExists ? '✅' : '❌'}</p>
            {debugResult.profileData && (
              <p>Email: {debugResult.profileData.email || 'None'}</p>
            )}
            {debugResult.errors.length > 0 && (
              <div className="text-red-600 dark:text-red-400">
                <p className="font-semibold">Errors:</p>
                {debugResult.errors.map((error, i) => (
                  <p key={i} className="text-xs">{error}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthDebugPanel;