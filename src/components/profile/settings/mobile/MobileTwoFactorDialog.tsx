import React, { useState } from 'react';
import { X, QrCode, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface MobileTwoFactorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEnable: (secretKey: string, verificationCode: string) => void;
}

const MobileTwoFactorDialog: React.FC<MobileTwoFactorDialogProps> = ({
  isOpen,
  onClose,
  onEnable
}) => {
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [verificationCode, setVerificationCode] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Generate a mock secret key (in real app, this would come from backend)
  const secretKey = 'JBSWY3DPEHPK3PXP';
  const qrCodeUrl = `otpauth://totp/YourApp:user@example.com?secret=${secretKey}&issuer=YourApp`;

  if (!isOpen) return null;

  const handleCopySecret = async () => {
    try {
      await navigator.clipboard.writeText(secretKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Secret key copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy secret key",
        variant: "destructive",
      });
    }
  };

  const handleVerify = () => {
    if (verificationCode.length === 6) {
      onEnable(secretKey, verificationCode);
      onClose();
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been successfully enabled",
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-md sm:rounded-lg sm:max-h-[90vh] flex flex-col">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 sm:rounded-t-lg">
          <h2 className="text-lg font-semibold">Enable 2FA</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {step === 'setup' && (
            <div className="space-y-6">
              {/* Google Authenticator Section */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <svg 
                    viewBox="-3 0 262 262" 
                    version="1.1" 
                    xmlns="http://www.w3.org/2000/svg" 
                    xmlnsXlink="http://www.w3.org/1999/xlink" 
                    preserveAspectRatio="xMidYMid" 
                    className="h-8 w-8"
                  >
                    <g>
                      <path d="M255.878,133.451 C255.878,122.717 255.007,114.884 253.122,106.761 L130.55,106.761 L130.55,155.209 L202.497,155.209 C201.047,167.249 193.214,185.381 175.807,197.565 L175.563,199.187 L214.318,229.21 L217.003,229.478 C241.662,206.704 255.878,173.196 255.878,133.451" fill="#4285F4"></path>
                      <path d="M130.55,261.1 C165.798,261.1 195.389,249.495 217.003,229.478 L175.807,197.565 C164.783,205.253 149.987,210.62 130.55,210.62 C96.027,210.62 66.726,187.847 56.281,156.37 L54.75,156.5 L14.452,187.687 L13.925,189.152 C35.393,231.798 79.49,261.1 130.55,261.1" fill="#34A853"></path>
                      <path d="M56.281,156.37 C53.525,148.247 51.93,139.543 51.93,130.55 C51.93,121.556 53.525,112.853 56.136,104.73 L56.063,103 L15.26,71.312 L13.925,71.947 C5.077,89.644 0,109.517 0,130.55 C0,151.583 5.077,171.455 13.925,189.152 L56.281,156.37" fill="#FBBC05"></path>
                      <path d="M130.55,50.479 C155.064,50.479 171.6,61.068 181.029,69.917 L217.873,33.943 C195.245,12.91 165.798,0 130.55,0 C79.49,0 35.393,29.301 13.925,71.947 L56.136,104.73 C66.726,73.253 96.027,50.479 130.55,50.479" fill="#EB4335"></path>
                    </g>
                  </svg>
                  <span className="font-semibold text-green-900 text-lg">Google Authenticator</span>
                </div>
                <p className="text-green-800 text-sm mb-4">
                  Download and install Google Authenticator on your mobile device, then scan the QR code or enter the secret key manually.
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Download Google Authenticator</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Install the app from App Store or Google Play Store
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Scan QR code or enter key manually</p>
                    
                    {/* QR Code Placeholder */}
                    <div className="mt-3 p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg text-center">
                      <QrCode className="h-32 w-32 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">QR Code would appear here</p>
                      <p className="text-xs text-gray-400 mt-1">
                        In production, generate QR from: {qrCodeUrl}
                      </p>
                    </div>

                    {/* Manual Entry */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium mb-2">Or enter this key manually:</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-white px-3 py-2 rounded border text-sm font-mono">
                          {secretKey}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopySecret}
                          className="flex-shrink-0"
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Verify the setup</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Enter the 6-digit code from your authenticator app
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'verify' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Enter Verification Code</h3>
                <p className="text-sm text-gray-600">
                  Enter the 6-digit code from your Google Authenticator app
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-xl tracking-widest font-mono"
                  maxLength={6}
                />
                <p className="text-xs text-gray-500 text-center">
                  The code refreshes every 30 seconds
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Footer */}
        <div className="p-4 border-t bg-gray-50 sm:rounded-b-lg">
          <div className="flex gap-3">
            {step === 'setup' && (
              <>
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={() => setStep('verify')} className="flex-1">
                  Continue
                </Button>
              </>
            )}
            {step === 'verify' && (
              <>
                <Button variant="outline" onClick={() => setStep('setup')} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleVerify} 
                  disabled={verificationCode.length !== 6}
                  className="flex-1"
                >
                  Enable 2FA
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileTwoFactorDialog;