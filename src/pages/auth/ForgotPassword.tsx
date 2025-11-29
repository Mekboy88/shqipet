
import React from 'react';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import LoginLogo from '@/components/auth/LoginLogo';

const ForgotPassword = () => {
  return (
    <div className="h-screen w-screen fixed inset-0 flex overflow-hidden">
      {/* Left side with rich red gradient background */}
      <div className="flex-1 flex flex-col justify-center items-start px-16 bg-gradient-to-r from-red-500 via-red-600 to-red-900 relative">
        {/* Metallic highlight overlay for glossy effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-400/30 via-transparent to-red-950/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-red-500/10 to-transparent"></div>
      </div>
      
      {/* Right side forgot password form with logo at the top */}
      <div className="w-[510px] bg-white flex flex-col">
        <div className="pt-8 px-8">
          <LoginLogo />
        </div>
        <div className="flex-1 flex items-center justify-center px-8">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
