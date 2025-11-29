
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface TwoFactorAuthSectionProps {
  twoFactor: string;
  setTwoFactor: (value: string) => void;
}

export const TwoFactorAuthSection: React.FC<TwoFactorAuthSectionProps> = ({
  twoFactor,
  setTwoFactor
}) => {
  return (
    <div>
      <Label htmlFor="two-factor">Vërtetimi me dy faktorë</Label>
      <div className="mt-2 mb-3">
        <p className="text-sm text-gray-600 font-medium">
          Ne rekomandojmë fuqishëm që ta aktivizoni këtë për sigurinë tuaj.
        </p>
      </div>
      <div className="flex gap-3 mt-1">
        <Button
          onClick={() => setTwoFactor('disable')}
          className={`flex-1 ${
            twoFactor === 'disable'
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-300'
          }`}
        >
          Çaktivizo
        </Button>
        <Button
          onClick={() => setTwoFactor('enable')}
          className={`flex-1 ${
            twoFactor === 'enable'
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-green-100 hover:bg-green-200 text-green-700 border border-green-300'
          }`}
        >
          Aktivizo
        </Button>
      </div>
    </div>
  );
};
