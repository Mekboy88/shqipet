import React, { useState } from 'react';
import { X, ArrowLeft, Lock, Mail, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MobileTwoFactorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentMethod: string;
  onMethodChanged: (method: string) => void;
}

const MobileTwoFactorDialog: React.FC<MobileTwoFactorDialogProps> = ({
  isOpen,
  onOpenChange,
  currentMethod,
  onMethodChanged
}) => {
  const [currentView, setCurrentView] = useState<'method-selection' | 'email-setup' | 'google-setup'>('method-selection');
  const [emailCode, setEmailCode] = useState('');
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false);
  const [googleCode, setGoogleCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    onOpenChange(false);
    setCurrentView('method-selection');
    setEmailCode('');
    setGoogleCode('');
    setQrCodeGenerated(false);
  };

  const handleBack = () => {
    if (currentView === 'email-setup' || currentView === 'google-setup') {
      setCurrentView('method-selection');
    }
  };

  const handleEmailSetup = async () => {
    setIsLoading(true);
    try {
      // Simulate sending verification email
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Email verification sent');
    } catch (error) {
      console.error('Error sending email verification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerification = async () => {
    if (emailCode.length === 6) {
      setIsLoading(true);
      try {
        // Simulate email verification
        await new Promise(resolve => setTimeout(resolve, 1000));
        onMethodChanged('email');
        handleClose();
      } catch (error) {
        console.error('Error verifying email code:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSetup = async () => {
    setIsLoading(true);
    try {
      // Simulate QR code generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setQrCodeGenerated(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleVerification = async () => {
    if (googleCode.length === 6) {
      setIsLoading(true);
      try {
        // Simulate Google Authenticator verification
        await new Promise(resolve => setTimeout(resolve, 1000));
        onMethodChanged('google');
        handleClose();
      } catch (error) {
        console.error('Error verifying Google code:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'method-selection':
        return 'Vërtetimi me Dy Faktorë';
      case 'email-setup':
        return 'Aktivizo 2FA me Email';
      case 'google-setup':
        return 'Aktivizo Google Authenticator';
      default:
        return 'Vërtetimi me Dy Faktorë';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          {currentView !== 'method-selection' && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            <h1 className="text-lg font-semibold">{getTitle()}</h1>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {currentView === 'method-selection' && (
          <div className="p-4 space-y-4">
            {/* Current Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-900">Statusi Aktual</h3>
              </div>
              <p className="text-sm text-blue-700">
                {currentMethod === 'google' ? (
                  'Google Authenticator është aktivizuar'
                ) : currentMethod === 'email' ? (
                  'Vërtetimi me email është aktivizuar'
                ) : (
                  '2FA nuk është aktivizuar'
                )}
              </p>
            </div>

            {/* Method Selection */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900">Zgjidhni Metodën</h3>
              
              {/* Email Method */}
              <button
                onClick={() => setCurrentView('email-setup')}
                className="w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900">Vërtetim me Email</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Merrni kode verifikimi në email-in tuaj
                  </p>
                </div>
                {currentMethod === 'email' && (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                )}
              </button>

              {/* Google Authenticator Method */}
              <button
                onClick={() => setCurrentView('google-setup')}
                className="w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg viewBox="-3 0 262 262" version="1.1" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
                    <path d="M255.878,133.451 C255.878,122.717 255.007,114.884 253.122,106.761 L130.55,106.761 L130.55,155.209 L202.497,155.209 C201.047,167.249 193.214,185.381 175.807,197.565 L175.563,199.187 L214.318,229.21 L217.003,229.478 C241.662,206.704 255.878,173.196 255.878,133.451" fill="#4285F4" />
                    <path d="M130.55,261.1 C165.798,261.1 195.389,249.495 217.003,229.478 L175.807,197.565 C164.783,205.253 149.987,210.62 130.55,210.62 C96.027,210.62 66.726,187.847 56.281,156.37 L54.75,156.5 L14.452,187.687 L13.925,189.152 C35.393,231.798 79.49,261.1 130.55,261.1" fill="#34A853" />
                    <path d="M56.281,156.37 C53.525,148.247 51.93,139.543 51.93,130.55 C51.93,121.556 53.525,112.853 56.136,104.73 L56.063,103 L15.26,71.312 L13.925,71.947 C5.077,89.644 0,109.517 0,130.55 C0,151.583 5.077,171.455 13.925,189.152 L56.281,156.37" fill="#FBBC05" />
                    <path d="M130.55,50.479 C155.064,50.479 171.6,61.068 181.029,69.917 L217.873,33.943 C195.245,12.91 165.798,0 130.55,0 C79.49,0 35.393,29.301 13.925,71.947 L56.136,104.73 C66.726,73.253 96.027,50.479 130.55,50.479" fill="#EB4335" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900">Google Authenticator</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Më i sigurt - përdorni aplikacionin Google Authenticator
                  </p>
                </div>
                {currentMethod === 'google' && (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                )}
              </button>
            </div>

            {/* Disable 2FA */}
            {currentMethod !== '' && (
              <div className="pt-4 border-t border-gray-200">
                <Button
                  onClick={() => onMethodChanged('')}
                  variant="outline"
                  className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50"
                >
                  Çaktivizo 2FA
                </Button>
              </div>
            )}
          </div>
        )}

        {currentView === 'email-setup' && (
          <div className="p-4 space-y-6">
            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">Aktivizimi i 2FA me Email</h3>
                  <p className="text-sm text-blue-700">
                    Do t'ju dërgojmë një kod verifikimi në email-in tuaj për të aktivizuar 2FA.
                  </p>
                </div>
              </div>
            </div>

            {/* Send Code Button */}
            <Button
              onClick={handleEmailSetup}
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Duke dërguar kod...
                </>
              ) : (
                'Dërgo Kod Verifikimi'
              )}
            </Button>

            {/* Verification Code Input */}
            <div className="space-y-3">
              <Label htmlFor="email-code" className="text-sm font-medium text-gray-700">
                Shkruani kodin 6-shifror nga email-i
              </Label>
              <Input
                id="email-code"
                type="text"
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full h-12 text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleEmailVerification}
              disabled={emailCode.length !== 6 || isLoading}
              className="w-full h-12 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Duke verifikuar...
                </>
              ) : (
                'Verifiko dhe Aktivo'
              )}
            </Button>
          </div>
        )}

        {currentView === 'google-setup' && (
          <div className="p-4 space-y-6">
            {!qrCodeGenerated ? (
              <>
                {/* Info */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-900 mb-1">Google Authenticator Setup</h3>
                      <p className="text-sm text-green-700">
                        Instaloni aplikacionin Google Authenticator në telefonin tuaj para se të vazhdoni.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Generate QR Code */}
                <Button
                  onClick={handleGoogleSetup}
                  disabled={isLoading}
                  className="w-full h-12 bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Duke gjeneruar QR kod...
                    </>
                  ) : (
                    'Gjenero QR Kod'
                  )}
                </Button>
              </>
            ) : (
              <>
                {/* QR Code Display */}
                <div className="text-center space-y-4">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6 inline-block">
                    <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      {/* Placeholder for QR Code */}
                      <div className="text-center">
                        <div className="w-32 h-32 bg-black mx-auto mb-2 rounded" style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23000'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23fff'/%3E%3Crect x='30' y='10' width='10' height='10' fill='%23fff'/%3E%3C/svg%3E")`,
                          backgroundSize: 'cover'
                        }}></div>
                        <p className="text-xs text-gray-500">QR Kod</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 max-w-sm mx-auto">
                    Skanoni këtë QR kod me aplikacionin Google Authenticator në telefonin tuaj
                  </p>
                </div>

                {/* Manual Code */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Kodi manual (nëse nuk mund të skanoni QR kodin):
                  </Label>
                  <code className="block w-full bg-white border rounded p-3 text-sm text-center font-mono">
                    JBSWY3DPEHPK3PXP
                  </code>
                </div>

                {/* Verification Code Input */}
                <div className="space-y-3">
                  <Label htmlFor="google-code" className="text-sm font-medium text-gray-700">
                    Shkruani kodin nga Google Authenticator
                  </Label>
                  <Input
                    id="google-code"
                    type="text"
                    value={googleCode}
                    onChange={(e) => setGoogleCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="w-full h-12 text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>

                {/* Verify Button */}
                <Button
                  onClick={handleGoogleVerification}
                  disabled={googleCode.length !== 6 || isLoading}
                  className="w-full h-12 bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Duke verifikuar...
                    </>
                  ) : (
                    'Verifiko dhe Aktivo'
                  )}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileTwoFactorDialog;