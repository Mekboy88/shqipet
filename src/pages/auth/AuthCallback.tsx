
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔐 Processing auth callback...');
        
        // Extract tokens from URL parameters
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');

        if (type === 'signup' || type === 'magiclink') {
          // Handle email verification callback
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('❌ Auth callback error:', error);
            toast.error('Email verification failed');
            navigate('/');
            return;
          }

          if (data.session && data.session.user) {
            console.log('✅ Email verification successful');
            
            // Check if this is a phone user with placeholder email
            const user = data.session.user;
            const isPhoneUser = user.user_metadata?.registration_method === 'phone' || 
                               user.user_metadata?.phone_only_registration === true;
            
            if (isPhoneUser) {
              toast.success('Phone verification successful! Welcome!');
            } else {
              toast.success('Email verified successfully! Welcome!');
            }
            
            navigate('/');
          } else {
            console.log('⚠️ No active session found');
            toast.error('Verification failed - please try again');
            navigate('/');
          }
        } else {
          // Handle other auth callback types if needed
          console.log('🔄 Processing other auth callback type:', type);
          navigate('/');
        }
      } catch (error: any) {
        console.error('❌ Auth callback processing failed:', error);
        toast.error('Authentication failed');
        navigate('/');
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verifying your account...
          </h2>
          <p className="text-gray-600">
            Please wait while we complete your registration.
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
