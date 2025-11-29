
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type PhoneFormatExplanationProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const PhoneFormatExplanation = ({ open, onOpenChange }: PhoneFormatExplanationProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white p-6 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Informacion për Formatin e Numrit të Telefonit</DialogTitle>
        </DialogHeader>
        <DialogDescription className="space-y-4 text-gray-700">
          <p className="font-medium text-black">
            Informacion i rëndësishëm për regjistrimin me numër telefoni:
          </p>
          
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Gjithmonë përdorni prefiksin e kodit të vendit</strong> me një shenjë "+" përpara numrit tuaj të telefonit (p.sh., +355 për Shqipërinë, +1 për SHBA, +44 për Britaninë e Madhe).
            </li>
            <li>
              Shërbimi ynë mbështet regjistrimin nga të gjitha vendet e botës (mbi 200 vende).
            </li>
            <li>
              Mos përfshini hapësira, viza ose kllapa në numrin tuaj të telefonit.
            </li>
            <li>
              Shembull i formatit të saktë: +355692345678
            </li>
            <li>
              Shembull i formatit të pasaktë: 355 69 234 5678 ose 069 234 5678
            </li>
          </ul>
          
          <p>
            Nëse nuk jeni të sigurt për kodin e vendit tuaj, këtu janë disa shembuj të zakonshëm:
          </p>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <span className="mr-2 text-xl">🇦🇱</span>
              • Shqipëria: +355
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-xl">🇺🇸</span>
              • SHBA: +1
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-xl">🇬🇧</span>
              • Britania e Madhe: +44
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-xl">🇩🇪</span>
              • Gjermania: +49
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-xl">🇮🇹</span>
              • Italia: +39
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-xl">🇬🇷</span>
              • Greqia: +30
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-xl">🇽🇰</span>
              • Kosova: +383
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-xl">🇲🇰</span>
              • Maqedonia e Veriut: +389
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-xl">🇲🇪</span>
              • Mali i Zi: +382
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-xl">🇫🇷</span>
              • Franca: +33
            </div>
          </div>
          
          <p className="font-medium mt-2">
            Përdorimi i formatit të saktë të numrit të telefonit siguron që do të merrni mesazhe verifikimi dhe njoftime të rëndësishme nga shërbimi ynë.
          </p>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneFormatExplanation;
