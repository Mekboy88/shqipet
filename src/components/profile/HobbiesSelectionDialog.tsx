import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, SheetPortal } from '@/components/ui/sheet';
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Check, X } from 'lucide-react';
import { hobbiesByCategory, Hobby } from '@/data/hobbies';

const allHobbies = Object.values(hobbiesByCategory).flat();

interface HobbiesSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHobbies: string[];
  onHobbyToggle: (hobby: Hobby) => void;
}

const HobbiesSelectionDialog: React.FC<HobbiesSelectionDialogProps> = ({
  isOpen,
  onClose,
  selectedHobbies,
  onHobbyToggle
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleHobbySelect = (hobby: Hobby) => {
    onHobbyToggle(hobby);
  };

  const filteredCategories = Object.entries(hobbiesByCategory).reduce((acc, [category, hobbies]) => {
    const filtered = hobbies.filter(hobby => 
      hobby.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, Hobby[]>);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      {/* Custom Portal without overlay */}
      <SheetPortal>
        <SheetPrimitive.Content
          className="fixed top-[57px] right-0 z-[10003] h-[calc(100vh-57px)] w-full sm:max-w-lg border-0 bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right animate-fade-in"
        >
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl font-semibold">Zgjidh Hobi & Interesa</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {/* Search Bar */}
          <div className="relative flex-shrink-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Kërko hobi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected Hobbies */}
          {selectedHobbies.length > 0 && (
            <div className="space-y-2 flex-shrink-0 mt-4">
              <h4 className="text-sm font-medium text-gray-700">Hobi të Zgjedhur ({selectedHobbies.length})</h4>
              <div className="flex flex-wrap gap-2">
                {selectedHobbies.map(hobby => {
                  const hobbyData = allHobbies.find(h => h.name === hobby);
                  return (
                    <Badge 
                      key={hobby} 
                      variant="secondary" 
                      className="bg-primary/10 text-primary border border-primary/30 cursor-pointer"
                      onClick={() => handleHobbySelect(hobbyData!)}
                    >
                      <span className="text-sm mr-1">{hobbyData?.emoji || '🎯'}</span>
                      {hobby}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Scrollable Hobbies List */}
          <div className="flex-1 overflow-y-auto mt-4 space-y-4">
            {Object.entries(filteredCategories).map(([category, hobbies]) => (
              <div key={category} className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 border-b pb-1">{category}</h4>
                <div className="grid grid-cols-3 gap-2">
                  {hobbies.map(hobby => {
                    const isSelected = selectedHobbies.includes(hobby.name);
                    return (
                      <div
                        key={hobby.id}
                        onClick={() => handleHobbySelect(hobby)}
                        className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${
                          isSelected 
                            ? 'bg-primary/10 text-primary border-primary/30' 
                            : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-sm">{hobby.emoji}</span>
                        <span className="text-xs font-medium">{hobby.name}</span>
                        {isSelected && (
                          <Check className="w-3 h-3 text-primary ml-auto" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Fixed Footer Button */}
          <div className="border-t pt-0 pb-8 flex-shrink-0 bg-white">
            <Button onClick={onClose} className="w-full mt-1">
              Përfundo ({selectedHobbies.length} të zgjedhur)
            </Button>
          </div>
          </div>
        </SheetPrimitive.Content>
      </SheetPortal>
    </Sheet>
  );
};

export default HobbiesSelectionDialog;