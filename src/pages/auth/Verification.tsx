
import React from 'react';
import VerificationForm from '@/components/auth/VerificationForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Verification = () => {
  return (
    <div className="h-screen w-screen fixed inset-0 flex overflow-hidden">
      {/* Left side with rich red gradient background */}
      <div className="flex-1 flex flex-col justify-center items-start px-16 bg-gradient-to-r from-red-500 via-red-600 to-red-900 relative">
        {/* Metallic highlight overlay for glossy effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-400/30 via-transparent to-red-950/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-red-500/10 to-transparent"></div>
      </div>
      
      {/* Right side verification form */}
      <div className="w-[510px] bg-white flex flex-col justify-center px-8">
        <div className="w-full max-w-md mx-auto space-y-4">
          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700 text-sm">
              Për arsye sigurie, ky hap verifikimi ndihmon në mbrojtjen e llogarisë suaj.
            </AlertDescription>
          </Alert>
          
          <VerificationForm />
        </div>
      </div>
    </div>
  );
};

export default Verification;
