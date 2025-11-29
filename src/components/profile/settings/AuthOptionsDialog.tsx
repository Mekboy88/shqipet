
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface AuthOptionsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthOptionsDialog: React.FC<AuthOptionsDialogProps> = ({
  isOpen,
  onOpenChange
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleClose = () => {
    setSelectedOption('');
    onOpenChange(false);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    // Add logic here based on the selected option
    toast.info(`Keni zgjedhur: ${option}`);
  };

  const authOptions = [
    {
      id: 'two_factor',
      title: 'Autentifikim Dy-Faktor',
      description: 'Aktivizoni autentifikimin dy-faktor për siguri shtesë',
      icon: '🔐',
      action: () => handleOptionSelect('Autentifikim Dy-Faktor')
    },
    {
      id: 'backup_codes',
      title: 'Kodet e Rezervës',
      description: 'Gjeneroni kode rezervë për qasje emergjente',
      icon: '🔑',
      action: () => handleOptionSelect('Kodet e Rezervës')
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white p-6 max-w-md" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Opsione Shtesë Autentifikimi
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>🔒 Rritni sigurinë e llogarisë:</strong> Zgjidhni opsione shtesë autentifikimi për të siguruar llogarinë tuaj dhe për të pasur më shumë mënyra për t'u kyçur.
            </p>
          </div>

          <div className="space-y-3">
            {authOptions.map((option) => (
              <div key={option.id}>
                <button
                  onClick={option.action}
                  className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">{option.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{option.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    </div>
                    <span className="text-blue-600 text-sm">→</span>
                  </div>
                </button>
              </div>
            ))}
          </div>

          <Separator />

          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-700">
              <strong>💡 Këshillë:</strong> Rekomandojmë të aktivizoni të paktën një metodë shtesë autentifikimi për sigurinë maksimale të llogarisë tuaj.
            </p>
          </div>
          
          <Button 
            onClick={handleClose}
            variant="outline"
            className="w-full"
          >
            Mbyll
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthOptionsDialog;
