
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusSquare, DollarSign, TrendingUp, Users, Gift, Info } from 'lucide-react';

interface MonetizationFormProps {
  userInfo: {}; // Add fields as necessary
  setUserInfo: React.Dispatch<React.SetStateAction<any>>;
}

const lightFocusStyles = "bg-white border-gray-300 focus:border-red-300 focus:ring-2 focus:ring-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/10 focus-visible:ring-offset-0";

const MonetizationForm: React.FC<MonetizationFormProps> = ({ userInfo, setUserInfo }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [duration, setDuration] = useState('weekly');
  const [description, setDescription] = useState('');

  const handleAddPackage = () => {
    // Logic to add package
    console.log({ title, price, currency, duration, description });
    setOpen(false); // Close dialog
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/20 rounded-2xl p-6 shadow-lg border border-primary/20">
        <h2 className="text-3xl font-bold text-primary mb-4">Monetizimi</h2>
        <p className="text-gray-700 text-lg">
          Shfrytëzoni potencialin tuaj për të fituar duke ofruar dhe shitur përmbajtjen tuaj ekskluzive
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Add New Package Card */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center gap-2">
                <PlusSquare className="w-5 h-5 text-primary" />
                Shto Paketë të Re
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <PlusSquare className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Krijo Paketë të Re</h3>
                      <p className="text-gray-600">Klikoni për të shtuar një paketë monetizimi</p>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                      Shto Paketë të Re
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <Card className="bg-white border border-gray-200/50">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-800">
                          Detajet e Paketës
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
                            Titulli i Paketës
                          </Label>
                          <Input 
                            id="title" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg"
                            placeholder="Shkruani titullin e paketës"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                            Përshkrimi
                          </Label>
                          <Textarea 
                            id="description" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg resize-none"
                            rows={3}
                            placeholder="Përshkruani përmbajtjen e paketës..."
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border border-gray-200/50">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-800">
                          Çmimi dhe Kohëzgjatja
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-2 block">
                              Çmimi
                            </Label>
                            <Input 
                              id="price" 
                              type="number" 
                              value={price} 
                              onChange={(e) => setPrice(e.target.value)} 
                              className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg"
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <Label htmlFor="currency" className="text-sm font-medium text-gray-700 mb-2 block">
                              Monedha
                            </Label>
                            <Select value={currency} onValueChange={setCurrency}>
                              <SelectTrigger className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg">
                                <SelectValue placeholder="Zgjidhni monedhën" />
                              </SelectTrigger>
                              <SelectContent className="bg-white shadow-lg border border-gray-200 z-50">
                                <SelectItem value="USD">USD ($)</SelectItem>
                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                <SelectItem value="JPY">JPY (¥)</SelectItem>
                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                <SelectItem value="RUB">RUB (₽)</SelectItem>
                                <SelectItem value="PLN">PLN (zł)</SelectItem>
                                <SelectItem value="ILS">ILS (₪)</SelectItem>
                                <SelectItem value="BRL">BRL (R$)</SelectItem>
                                <SelectItem value="INR">INR (₹)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="duration" className="text-sm font-medium text-gray-700 mb-2 block">
                            Kohëzgjatja
                          </Label>
                          <Select value={duration} onValueChange={setDuration}>
                            <SelectTrigger className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg">
                              <SelectValue placeholder="Zgjidhni kohëzgjatjen" />
                            </SelectTrigger>
                            <SelectContent className="bg-white shadow-lg border border-gray-200 z-50">
                              <SelectItem value="daily">Ditore</SelectItem>
                              <SelectItem value="weekly">Javore</SelectItem>
                              <SelectItem value="monthly">Mujore</SelectItem>
                              <SelectItem value="yearly">Vjetore</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleAddPackage} 
                      className="px-6 py-3 bg-primary hover:bg-primary/90 text-white border-0 font-medium transition-all duration-200 hover:shadow-lg"
                    >
                      Shto Paketën
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Monetization Info Card */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Përfitimet e Monetizimit
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-lg text-gray-700 font-medium leading-relaxed">
                  Zhbllokoni potencialin tuaj për të fituar duke ofruar dhe shitur përmbajtjen tuaj ekskluzive dhe postimet.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">Krijoni bazë besnikë pajtuesish</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Gift className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-700">Ofroni përmbajtje premium ekskluzive</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* How It Works Card */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Si Funksionon
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Krijoni Paketën</h4>
                    <p className="text-sm text-gray-600">Përcaktoni çmimin, kohëzgjatjen dhe përshkrimin e përmbajtjes suaj</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Promovoni</h4>
                    <p className="text-sm text-gray-600">Ndani paketën tuaj me ndjekësit dhe përdoruesit e tjerë</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Fitoni</h4>
                    <p className="text-sm text-gray-600">Merrni pagesë për çdo pajtues që blen paketën tuaj</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3">
                Këshilla për Sukses
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Përmbajtje Cilësore:</strong> Ofroni vlera të vërteta për pajtuesit tuaj
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-800">
                    <strong>Çmime të Arsyeshme:</strong> Vendosni çmime competitive por të drejta
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>Komunikim i Rregullt:</strong> Mbani kontakt me pajtuesit tuaj
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MonetizationForm;

