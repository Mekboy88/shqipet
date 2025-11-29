import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ChangeNameDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentFirstName: string;
  currentLastName: string;
  onNameChanged: (firstName: string, lastName: string) => void;
}

const ChangeNameDialog: React.FC<ChangeNameDialogProps> = ({
  isOpen,
  onOpenChange,
  currentFirstName,
  currentLastName,
  onNameChanged
}) => {
  const [firstName, setFirstName] = useState(currentFirstName);
  const [lastName, setLastName] = useState(currentLastName);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('Ju lutem mbushni të dyja fushat e emrit');
      return;
    }

    setIsLoading(true);
    try {
      await onNameChanged(firstName.trim(), lastName.trim());
      toast.success('Emri u ndryshua me sukses!');
      onOpenChange(false);
    } catch (error) {
      console.error('Error changing name:', error);
      toast.error('Ndodhi një gabim gjatë ndryshimit të emrit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset to current values when closing
    setFirstName(currentFirstName);
    setLastName(currentLastName);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ndrysho Emrin</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-base font-semibold text-gray-700 border border-gray-300 rounded-md p-3 bg-gray-50">
            Emri aktual: <span className="font-bold">{currentFirstName} {currentLastName}</span>
          </div>
          
          <div className="text-sm text-gray-700">
            Si do të dëshironit që njerëzit t'ju thërrasin?
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="first_name_change">Emri</Label>
              <Input
                id="first_name_change"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Shkruani emrin"
                className="focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name_change">Mbiemri</Label>
              <Input
                id="last_name_change"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Shkruani mbiemrin"
                className="focus:border-primary focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Anulo
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'Po ruhet...' : 'Ruaj Ndryshimet'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeNameDialog;