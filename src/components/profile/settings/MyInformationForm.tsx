
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, FileText, Flag, Users, UserCheck, UserPlus, DownloadCloud, Box } from 'lucide-react';

const options = [
  { id: 'my-information', label: 'My Information', icon: User },
  { id: 'posts', label: 'Posts', icon: FileText },
  { id: 'pages', label: 'Pages', icon: Flag },
  { id: 'groups', label: 'Groups', icon: Users },
  { id: 'following', label: 'Following', icon: UserCheck },
  { id: 'followers', label: 'Followers', icon: UserPlus },
];

const MyInformationForm: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  const toggleSelection = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    console.log('Generating file with selected data:', selected);
    setIsGenerated(true);
  };

  const handleDownload = () => {
    console.log('Downloading file...');
    // Actual download logic would go here
  };

  if (isGenerated) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
          <CardContent className="p-6">
            <div className="text-center py-20 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl flex flex-col items-center justify-center border border-blue-200/50">
              <div className="relative mb-6">
                <Box className="w-24 h-24 text-blue-500" strokeWidth={1} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Skedari juaj është gati për shkarkimin!</h3>
              <p className="text-gray-600 mb-6">Të dhënat e zgjedhura janë përpunuar me sukses</p>
              <Button 
                onClick={handleDownload} 
                className="px-8 py-3 bg-primary hover:bg-primary/90 text-white border-0 font-medium transition-all duration-200 hover:shadow-lg"
              >
                <DownloadCloud className="w-5 h-5 mr-2" />
                Shkarko Skedarin
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/20 rounded-2xl p-6 shadow-lg border border-primary/20">
        <h2 className="text-3xl font-bold text-primary mb-4">Informacionet e Mia</h2>
        <p className="text-gray-700 text-lg">
          Zgjidhni informacionet që dëshironi të shkarkoni në skedarin tuaj personal
        </p>
      </div>

      {/* Selection Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Data Card */}
        <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3">
              Të Dhënat Personale
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {options.slice(0, 3).map(option => {
                const Icon = option.icon;
                const isSelected = selected.includes(option.id);
                return (
                  <div
                    key={option.id}
                    onClick={() => toggleSelection(option.id)}
                    className={`p-4 rounded-xl border-2 text-center cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'border-primary bg-primary/10 shadow-md' 
                        : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                      isSelected ? 'bg-primary/20' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-8 h-8 ${isSelected ? 'text-primary' : 'text-gray-500'}`} />
                    </div>
                    <span className={`font-medium ${isSelected ? 'text-primary' : 'text-gray-700'}`}>
                      {option.label === 'My Information' ? 'Informacioni Im' :
                       option.label === 'Posts' ? 'Postimet' :
                       option.label === 'Pages' ? 'Faqet' : option.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Social Data Card */}
        <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3">
              Të Dhënat Sociale
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {options.slice(3).map(option => {
                const Icon = option.icon;
                const isSelected = selected.includes(option.id);
                return (
                  <div
                    key={option.id}
                    onClick={() => toggleSelection(option.id)}
                    className={`p-4 rounded-xl border-2 text-center cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'border-primary bg-primary/10 shadow-md' 
                        : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                      isSelected ? 'bg-primary/20' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-8 h-8 ${isSelected ? 'text-primary' : 'text-gray-500'}`} />
                    </div>
                    <span className={`font-medium ${isSelected ? 'text-primary' : 'text-gray-700'}`}>
                      {option.label === 'Groups' ? 'Grupet' :
                       option.label === 'Following' ? 'Në Ndjekje' :
                       option.label === 'Followers' ? 'Ndjekësit' : option.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Button Card */}
      <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="mb-4">
              <p className="text-gray-600">
                Keni zgjedhur <span className="font-semibold text-primary">{selected.length}</span> nga {options.length} opsione
              </p>
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={selected.length === 0}
              className="px-10 py-3 bg-primary hover:bg-primary/90 text-white border-0 font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Gjenero Skedarin
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyInformationForm;
