
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const lightFocusStyles = "bg-white border-gray-300 focus:border-red-300 focus:ring-2 focus:ring-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/10 focus-visible:ring-offset-0";

const TwoFactorAuthForm: React.FC = () => {
  const [authMethod, setAuthMethod] = useState('email');
  const [confirmationCode, setConfirmationCode] = useState('');

  const handleSave = () => {
    console.log('Saving 2FA settings:', {
      authMethod,
      ...(authMethod === 'google' && { confirmationCode }),
    });
    // API call to save settings would go here
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Two-Factor Authentication Settings Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">
              Two-Factor Authentication Settings
            </h3>
            
            <div className="mb-6">
              <Label htmlFor="auth-method" className="text-sm font-medium text-gray-700 mb-2 block">
                Authentication method
              </Label>
              <Select value={authMethod} onValueChange={setAuthMethod}>
                <SelectTrigger className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg">
                  <SelectValue placeholder="Select authentication method" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg border border-gray-200">
                  <SelectItem value="email">E-mail verification</SelectItem>
                  <SelectItem value="google">Google Authenticator</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-2">
                Choose how you want to receive verification codes for enhanced security. Email is easier to set up, while Google Authenticator provides better security.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {authMethod === 'google' && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">
                Google Authenticator Setup
              </h3>
              
              <div className="space-y-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl transition-all duration-200 hover:shadow-md">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=Lovable"
                      alt="QR Code for Google Authenticator"
                      className="border-2 border-gray-200 rounded-lg"
                    />
                  </div>
                  
                  <div className="w-full">
                    <Label htmlFor="confirmation-code" className="text-sm font-medium text-gray-700 mb-2 block">
                      Confirmation code
                    </Label>
                    <Input
                      id="confirmation-code"
                      type="text"
                      value={confirmationCode}
                      onChange={(e) => setConfirmationCode(e.target.value)}
                      className="w-full text-center transition-all duration-200 hover:shadow-md focus:shadow-lg"
                      placeholder="Enter 6-digit code"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Enter the 6-digit code from your Google Authenticator app
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-3 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Setup Instructions:</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">1.</span> Download Google Authenticator from the App Store or Google Play Store.</p>
                    <p><span className="font-medium">2.</span> Open the app and scan the QR code above.</p>
                    <p><span className="font-medium">3.</span> Enter the 6-digit verification code from the app.</p>
                    <p><span className="font-medium">4.</span> Save your settings to enable two-factor authentication.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {authMethod === 'email' && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">
                Email Verification
              </h3>
              
              <div className="text-sm text-gray-600 space-y-3 bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">How it works:</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">1.</span> When you log in, we'll send a verification code to your email.</p>
                  <p><span className="font-medium">2.</span> Check your email for the 6-digit code.</p>
                  <p><span className="font-medium">3.</span> Enter the code to complete your login.</p>
                  <p><span className="font-medium">4.</span> Your session will be secure and verified.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuthForm;

