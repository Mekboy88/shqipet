
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Home, Trash2, MapPin } from 'lucide-react';

interface Address {
  id: string;
  name: string;
  phone: string;
  country: string;
  city: string;
  zipCode: string;
  address: string;
}

interface MyAddressesFormProps {
  userInfo: {
    addresses?: Address[];
    firstName?: string;
  };
  setUserInfo: React.Dispatch<React.SetStateAction<any>>;
}

const lightFocusStyles = "bg-white border-gray-300 focus:border-red-300 focus:ring-2 focus:ring-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/10 focus-visible:ring-offset-0";

const MyAddressesForm: React.FC<MyAddressesFormProps> = ({ userInfo, setUserInfo }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: userInfo.firstName || 'Padington',
    phone: '',
    country: '',
    city: '',
    zipCode: '',
    address: '',
  });

  const addresses = userInfo.addresses || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewAddress(prev => ({ ...prev, [id]: value }));
  };

  const handleAddAddress = () => {
    if (Object.values(newAddress).some(field => field === '' && field !== newAddress.name)) {
        // You might want to show a toast message here
        console.error("Please fill all fields");
        return;
    }
    setUserInfo((prev: any) => ({
      ...prev,
      addresses: [...(prev.addresses || []), { ...newAddress, id: new Date().toISOString() }],
    }));
    setNewAddress({
      name: userInfo.firstName || 'Padington',
      phone: '',
      country: '',
      city: '',
      zipCode: '',
      address: '',
    });
    setIsDialogOpen(false);
  };
  
  const handleDeleteAddress = (id: string) => {
    setUserInfo((prev: any) => ({
      ...prev,
      addresses: prev.addresses.filter((address: Address) => address.id !== id),
    }));
  };
  
  const AddressFormFields = (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Të Dhënat Personale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                Emri i Plotë
              </Label>
              <Input 
                id="name" 
                value={newAddress.name} 
                onChange={handleInputChange} 
                className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg"
                placeholder="Shkruani emrin e plotë"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                Numri i Telefonit
              </Label>
              <Input 
                id="phone" 
                value={newAddress.phone} 
                onChange={handleInputChange} 
                className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg"
                placeholder="Shkruani numrin e telefonit"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Vendndodhja
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country" className="text-sm font-medium text-gray-700 mb-2 block">
                Shteti
              </Label>
              <Input 
                id="country" 
                value={newAddress.country} 
                onChange={handleInputChange} 
                className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg"
                placeholder="Shkruani shtetin"
              />
            </div>
            <div>
              <Label htmlFor="city" className="text-sm font-medium text-gray-700 mb-2 block">
                Qyteti
              </Label>
              <Input 
                id="city" 
                value={newAddress.city} 
                onChange={handleInputChange} 
                className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg"
                placeholder="Shkruani qytetin"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700 mb-2 block">
                Kodi Postar
              </Label>
              <Input 
                id="zipCode" 
                value={newAddress.zipCode} 
                onChange={handleInputChange} 
                className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg"
                placeholder="Shkruani kodin postar"
              />
            </div>
            <div>
              <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 block">
                Adresa e Plotë
              </Label>
              <Input 
                id="address" 
                value={newAddress.address} 
                onChange={handleInputChange} 
                className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg"
                placeholder="Shkruani adresën e plotë"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleAddAddress} 
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-white border-0 font-medium transition-all duration-200 hover:shadow-lg"
        >
          Shto Adresën
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/20 rounded-2xl p-6 shadow-lg border border-primary/20">
        <h2 className="text-3xl font-bold text-primary mb-4">Adresat e Mia</h2>
        <p className="text-gray-700 text-lg">
          Menaxhoni adresat tuaja për dërgesa dhe faturime të përshpejtuara
        </p>
      </div>

      {addresses.length === 0 ? (
        <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
          <CardContent className="p-6">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex flex-col items-center justify-center border border-gray-200/50 cursor-pointer hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10 transition-all duration-200">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <PlusCircle className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Shto Adresën e Parë</h3>
                  <p className="text-gray-600">Klikoni për të shtuar adresën tuaj të parë</p>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-gray-800">
                    Shto Adresë të Re
                  </DialogTitle>
                </DialogHeader>
                {AddressFormFields}
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Existing Addresses */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3">
                Adresat e Ruajtura
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-200/50 transition-all duration-200 hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full flex items-center justify-center h-12 w-12">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{addr.name}</p>
                        <p className="text-sm text-gray-600">{`${addr.address}, ${addr.city}`}</p>
                        <p className="text-sm text-gray-600">{`${addr.zipCode}, ${addr.country}`}</p>
                        <p className="text-sm text-gray-500">Tel: {addr.phone}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add New Address Button */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardContent className="p-6">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full py-3 bg-primary hover:bg-primary/90 text-white border-0 font-medium transition-all duration-200 hover:shadow-lg">
                    <PlusCircle className="w-5 h-5 mr-2" /> 
                    Shto Adresë të Re
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                      Shto Adresë të Re
                    </DialogTitle>
                  </DialogHeader>
                  {AddressFormFields}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MyAddressesForm;

