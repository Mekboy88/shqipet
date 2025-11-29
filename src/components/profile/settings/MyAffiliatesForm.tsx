
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Facebook, Twitter, Linkedin, Copy, Users, Gift, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface MyAffiliatesFormProps {
  userInfo: {
    affiliateLink?: string;
  };
}

const lightFocusStyles = "bg-white border-gray-300 focus:border-red-300 focus:ring-2 focus:ring-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/10 focus-visible:ring-offset-0";

const MyAffiliatesForm: React.FC<MyAffiliatesFormProps> = ({ userInfo }) => {
  const { toast } = useToast();

  const copyToClipboard = () => {
    if (userInfo.affiliateLink) {
      navigator.clipboard.writeText(userInfo.affiliateLink);
      toast({
        title: "Copied!",
        description: "Affiliate link copied to clipboard.",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/20 rounded-2xl p-6 shadow-lg border border-primary/20">
        <h2 className="text-3xl font-bold text-primary mb-4">Programi i Afiliacionit</h2>
        <p className="text-gray-700 text-lg">
          Fitoni deri në $0.10 për çdo përdorues që referoni tek ne dhe ndani lidhjen tuaj të afiliacionit
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Affiliate Link Card */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Lidhja e Afiliacionit
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-10 h-10 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Fitoni deri në $0.10
                  </h3>
                  <p className="text-gray-600">
                    Për çdo përdorues që referoni tek ne!
                  </p>
                </div>
                
                <div>
                  <label htmlFor="affiliate-link" className="text-sm font-medium text-gray-700 mb-2 block">
                    Lidhja Juaj e Afiliacionit
                  </label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="affiliate-link" 
                      type="text" 
                      value={userInfo.affiliateLink || 'https://platform.com/ref/YOUR_CODE'} 
                      readOnly 
                      className="flex-1 bg-gray-50 transition-all duration-200"
                    />
                    <Button 
                      size="icon" 
                      variant="outline" 
                      onClick={copyToClipboard}
                      className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 transition-all duration-200 hover:shadow-md"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Klikoni butonin për të kopjuar lidhjen tuaj të afiliacionit
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">$0.10</p>
                    <p className="text-sm text-green-700">Për referim</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">0</p>
                    <p className="text-sm text-blue-700">Referime totale</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50/50 p-6 rounded-b-2xl">
              <div className="w-full text-center">
                <p className="text-sm font-semibold text-gray-700 mb-4">Ndajeni në</p>
                <div className="flex justify-center items-center gap-3">
                  <a 
                    href="#" 
                    className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 hover:shadow-lg"
                    title="Ndaj në Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 hover:shadow-lg"
                    title="Ndaj në Twitter"
                  >
                    <Twitter size={20} />
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 hover:shadow-lg"
                    title="Ndaj në WhatsApp"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.655 4.398 1.908 6.161l-1.217 4.432 4.515-1.185z"/>
                    </svg>
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 hover:shadow-lg"
                    title="Ndaj në Pinterest"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.152,0C5.43,0,0,5.337,0,11.96c0,4.94,3.212,9.165,7.665,10.995C7.552,21.94,7.5,20.89,7.74,19.865c0.264-1.126,1.752-7.366,1.752-7.366s-0.456-0.903-0.456-2.234c0-2.1,1.233-3.66,2.775-3.66c1.311,0,1.938,0.984,1.938,2.152c0,1.299-0.84,3.243-1.272,5.031c-0.354,1.47,0.735,2.664,2.226,2.664c2.664,0,4.689-3.447,4.689-7.518c0-3.15-2.259-5.495-5.385-5.495c-3.6,0-5.715,2.673-5.715,5.553c0,1.011,0.387,2.121,0.864,2.736c0.096,0.126,0.108,0.24,0.072,0.372C9.174,15.4,9.02,15.93,8.97,16.125c-0.06,0.228-0.216,0.288-0.468,0.18C6.33,15.367,5.32,13.633,5.32,11.66c0-2.859,2.022-6.048,6.84-6.048c3.54,0,6.237,2.5,6.237,5.823c0,3.582-2.121,6.489-5.106,6.489c-1.056,0-2.052-0.54-2.388-1.164c0,0-0.522,2.052-0.636,2.508c-0.18,0.72-0.51,1.548-0.756,2.076C10.225,23.522,11.16,24,12.152,24c6.723,0,12.152-5.337,12.152-12.04C24.304,5.337,18.873,0,12.152,0z"/>
                    </svg>
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 rounded-full bg-blue-800 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 hover:shadow-lg"
                    title="Ndaj në LinkedIn"
                  >
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* How It Works Card */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
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
                    <h4 className="font-semibold text-gray-800 mb-1">Kopjoni Lidhjen</h4>
                    <p className="text-sm text-gray-600">Kopjoni lidhjen tuaj unike të afiliacionit nga fusha e mësipërme</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Ndajeni</h4>
                    <p className="text-sm text-gray-600">Ndajeni me miqtë, familjen dhe në rrjetet sociale</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Fitoni</h4>
                    <p className="text-sm text-gray-600">Merrni $0.10 për çdo person që regjistrohet përmes lidhjes suaj</p>
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
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Ndajeni në rrjetet sociale:</strong> Më shumë njerëz, më shumë mundësi për referime
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>Përshkruani përfitimet:</strong> Tregojuni njerëzve pse duhet të bashkohen
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-800">
                    <strong>Qëndroni aktiv:</strong> Sa më shumë të ndani, aq më shumë fitoni
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

export default MyAffiliatesForm;
