
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface VerificationFormFooterProps {
  verificationMethod: string;
}

const VerificationFormFooter = ({ verificationMethod }: VerificationFormFooterProps) => {
  return (
    <div className="mt-8 pt-4 border-t border-gray-200">
      <p className="text-xs text-gray-500 text-center">
        The verification code will expire in 5 minutes. If you don't receive a code,
        {verificationMethod === 'phone' 
          ? ' check your SMS messages or contact support.' 
          : ' check your spam folder or contact support.'
        }
      </p>
      <div className="flex justify-center mt-3">
        <Button variant="link" className="text-xs text-facebook-primary">
          Need help?
        </Button>
      </div>
      <div className="text-center mt-2">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-facebook-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerificationFormFooter;
