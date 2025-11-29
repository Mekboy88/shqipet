
import React from 'react';
import { Button } from '@/components/ui/button';

const VerificationFooter = () => {
  return (
    <div className="mt-8 pt-4 border-t border-gray-200">
      <p className="text-xs text-gray-500 text-center">
        The verification code will expire in 10 minutes. If you don't receive a code,
        check your spam folder or contact support.
      </p>
      <div className="flex justify-center mt-3">
        <Button variant="link" className="text-xs text-facebook-primary">
          Need help?
        </Button>
      </div>
    </div>
  );
};

export default VerificationFooter;
