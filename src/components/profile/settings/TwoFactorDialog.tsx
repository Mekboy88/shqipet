import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Smartphone, Mail, Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface TwoFactorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentMethod?: string;
  onMethodChanged?: (method: string) => void;
}

const TwoFactorDialog: React.FC<TwoFactorDialogProps> = ({
  isOpen,
  onOpenChange,
  currentMethod = 'email',
  onMethodChanged
}) => {
  const [selectedMethod, setSelectedMethod] = useState(currentMethod);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const handleMethodChange = (method: string) => {
    setSelectedMethod(method);
    setIsSetupComplete(false);
    setConfirmationCode('');
  };

  const handleSave = () => {
    if (selectedMethod === 'google' && !confirmationCode) {
      toast.error('Ju lutemi vendosni kodin e konfirmimit nga Google Authenticator');
      return;
    }

    onMethodChanged?.(selectedMethod);
    toast.success('Cilësimet e 2FA u ruajtën me sukses!');
    onOpenChange(false);
  };

  const copySecretKey = () => {
    navigator.clipboard.writeText('LOVABLE2FASECRET123456789');
    toast.success('Çelësi sekret u kopjua!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
            <Shield className="h-6 w-6 text-primary" />
            Vërtetimi me Dy Faktorë
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-1">
          {/* Method Selection */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Zgjidhni metodën e vërtetimit:
            </Label>
            <Select value={selectedMethod} onValueChange={handleMethodChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg border border-gray-200">
                <SelectItem value="email">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>E-mail</span>
                  </div>
                </SelectItem>
                <SelectItem value="google">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span>Google Authenticator</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email Method Info */}
          {selectedMethod === 'email' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Vërtetim me E-mail</span>
              </div>
              <p className="text-sm text-blue-800">
                Do të dërgojmë një kod verifikimi në adresën tuaj të email-it çdo herë që bëni hyrje.
              </p>
            </div>
          )}

          {/* Google Authenticator Setup */}
          {selectedMethod === 'google' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg 
                    viewBox="-3 0 262 262" 
                    version="1.1" 
                    xmlns="http://www.w3.org/2000/svg" 
                    xmlnsXlink="http://www.w3.org/1999/xlink" 
                    preserveAspectRatio="xMidYMid" 
                    className="h-6 w-6"
                  >
                    <g>
                      <path d="M255.878,133.451 C255.878,122.717 255.007,114.884 253.122,106.761 L130.55,106.761 L130.55,155.209 L202.497,155.209 C201.047,167.249 193.214,185.381 175.807,197.565 L175.563,199.187 L214.318,229.21 L217.003,229.478 C241.662,206.704 255.878,173.196 255.878,133.451" fill="#4285F4"></path>
                      <path d="M130.55,261.1 C165.798,261.1 195.389,249.495 217.003,229.478 L175.807,197.565 C164.783,205.253 149.987,210.62 130.55,210.62 C96.027,210.62 66.726,187.847 56.281,156.37 L54.75,156.5 L14.452,187.687 L13.925,189.152 C35.393,231.798 79.49,261.1 130.55,261.1" fill="#34A853"></path>
                      <path d="M56.281,156.37 C53.525,148.247 51.93,139.543 51.93,130.55 C51.93,121.556 53.525,112.853 56.136,104.73 L56.063,103 L15.26,71.312 L13.925,71.947 C5.077,89.644 0,109.517 0,130.55 C0,151.583 5.077,171.455 13.925,189.152 L56.281,156.37" fill="#FBBC05"></path>
                      <path d="M130.55,50.479 C155.064,50.479 171.6,61.068 181.029,69.917 L217.873,33.943 C195.245,12.91 165.798,0 130.55,0 C79.49,0 35.393,29.301 13.925,71.947 L56.136,104.73 C66.726,73.253 96.027,50.479 130.55,50.479" fill="#EB4335"></path>
                    </g>
                  </svg>
                  <span className="font-medium text-green-900">Google Authenticator</span>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center space-y-3 mb-4">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=otpauth://totp/Lovable:user@example.com?secret=LOVABLE2FASECRET123456789&issuer=Lovable"
                    alt="QR Code për Google Authenticator"
                    className="border-4 border-gray-300 p-2 rounded-lg bg-white"
                  />
                  
                  {/* Manual Secret Key */}
                  <div className="w-full">
                    <Label className="text-xs font-medium text-gray-600 mb-1 block">
                      Çelësi manual (nëse QR nuk funksionon):
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value="LOVABLE2FASECRET123456789"
                        readOnly
                        className="text-xs font-mono bg-gray-50"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={copySecretKey}
                        className="px-2"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="text-sm text-green-800 space-y-2">
                  <p><strong>Hapat për konfigurimin:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Shkarkoni Google Authenticator nga App Store ose Google Play Store</li>
                    <li>Hapni aplikacionin dhe shtoni një llogari të re</li>
                    <li>Skanoni QR kodin e mësipërm ose vendosni çelësin manual</li>
                    <li>Vendosni kodin 6-shifror nga aplikacioni më poshtë</li>
                  </ol>
                </div>
              </div>

              {/* Confirmation Code Input */}
              <div>
                <Label htmlFor="confirmation-code" className="text-sm font-medium text-gray-700 mb-2 block">
                  Kodi i konfirmimit nga Google Authenticator:
                </Label>
                <Input
                  id="confirmation-code"
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  placeholder="Vendosni kodin 6-shifror"
                  className="text-center text-lg font-mono"
                  maxLength={6}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Anulo
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Ruaj Cilësimet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorDialog;