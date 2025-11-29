
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, PlusCircle, CreditCard, ArrowUpDown, Wallet, DollarSign, TrendingUp } from 'lucide-react';

interface WalletAndCreditsFormProps {
  userInfo: {
    walletBalance?: number;
  };
}

const WalletAndCreditsForm: React.FC<WalletAndCreditsFormProps> = ({ userInfo }) => {
  const balance = userInfo.walletBalance || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/20 rounded-2xl p-6 shadow-lg border border-primary/20">
        <h2 className="text-3xl font-bold text-primary mb-4">Portofoli & Kredite</h2>
        <p className="text-gray-700 text-lg">
          Menaxhoni bilancin tuaj, dërgoni para dhe shtoni fonde në portofolin tuaj
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Wallet Balance Card */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Bilanci i Portofolit
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full opacity-50"></div>
                <div className="absolute -bottom-8 -left-2 w-32 h-32 bg-indigo-100 rounded-full opacity-50"></div>
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-600 uppercase font-medium">Bilanci Total</p>
                    <p className="text-5xl font-bold text-gray-800 mt-2">${balance.toFixed(2)}</p>
                    <p className="text-gray-600 mt-2">Fonde të disponueshme</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Button 
                      variant="outline" 
                      className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300 font-medium transition-all duration-200 hover:shadow-md"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Dërgo Para
                    </Button>
                    <Button 
                      className="px-4 py-2 bg-primary hover:bg-primary/90 text-white border-0 font-medium transition-all duration-200 hover:shadow-lg"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Shto Fonde
                    </Button>
                    <Button 
                      variant="outline" 
                      className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200 font-medium transition-all duration-200 hover:shadow-md"
                    >
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      Tërheq
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">${balance.toFixed(2)}</p>
                  <p className="text-sm text-green-700">Të disponueshme</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">$0.00</p>
                  <p className="text-sm text-blue-700">Në pritje</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Veprime të Shpejta
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Dërgoni para:</strong> Transferoni fonde tek përdorues të tjerë menjëherë
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>Shtoni fonde:</strong> Rimbusheni portofolin tuaj me metoda të ndryshme pagese
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800">
                    <strong>Tërhiqni:</strong> Transferoni fondet tuaja në llogari bankare ose PayPal
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Transactions Card */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Transaksionet
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200/50">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto flex items-center justify-center mb-6">
                  <img 
                    src="/lovable-uploads/d724e4ae-5a03-4a43-a56e-d447f7dc2162.png" 
                    alt="Asnjë transaksion" 
                    className="w-16 h-16" 
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Asnjë Transaksion Ende</h3>
                <p className="text-gray-600">Duket sikur nuk keni asnjë transaksion ende!</p>
                <p className="text-sm text-gray-500 mt-2">Transaksionet tuaja do të shfaqen këtu pasi të filloni të përdorni portofolin</p>
              </div>
            </CardContent>
          </Card>

          {/* Security Info Card */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3">
                Siguria e Portofolit
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>Enkriptim i Sigurt:</strong> Të gjitha transaksionet janë të enkriptuara
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Verifikim 2FA:</strong> Aktivizoni vërtetimin me dy faktorë për siguri ekstra
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-800">
                    <strong>Monitorim 24/7:</strong> Monitorojmë aktivitetin e dyshimtë vazhdimisht
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

export default WalletAndCreditsForm;
