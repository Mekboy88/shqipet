
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, FilePlus2, Smile, FileText, Info, Diamond, Trophy, Zap, Award } from 'lucide-react';

interface PointItemProps {
  icon: React.ElementType;
  text: string;
  iconBgColor: string;
}

const PointItem: React.FC<PointItemProps> = ({ icon: Icon, text, iconBgColor }) => (
  <div className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-xl border border-gray-200/50 transition-all duration-200 hover:shadow-md">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBgColor} shadow-sm`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <span className="text-gray-700 font-medium">{text}</span>
  </div>
);

interface MyPointsFormProps {
  userInfo: {
    points?: number;
  };
}

const MyPointsForm: React.FC<MyPointsFormProps> = ({ userInfo }) => {
  const points = userInfo.points || 0;

  const pointItems = [
    { icon: MessageSquare, text: 'Fitoni 10 pikë duke komentuar në postime', bgColor: 'bg-green-500' },
    { icon: FilePlus2, text: 'Fitoni 20 pikë duke krijuar një postim të ri', bgColor: 'bg-blue-500' },
    { icon: Smile, text: 'Fitoni 5 pikë duke reaguar në postime', bgColor: 'bg-yellow-500' },
    { icon: FileText, text: 'Fitoni 15 pikë duke krijuar një blog të ri', bgColor: 'bg-purple-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/20 rounded-2xl p-6 shadow-lg border border-primary/20">
        <h2 className="text-3xl font-bold text-primary mb-4">Pikat e Mia</h2>
        <p className="text-gray-700 text-lg">
          Fitoni pikë duke qenë aktiv në platformë dhe konvertojeni ato në kredite
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Points Balance Card */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Bilanci i Pikëve
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 uppercase font-medium">Pikat Tuaja</p>
                  <p className="text-5xl font-bold text-primary mt-2">{points}</p>
                  <p className="text-gray-600 mt-2">Pikë të fituara gjithsej</p>
                </div>
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                  <Diamond className="w-12 h-12 text-primary" />
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200/50">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-blue-800 font-medium text-sm">Konvertimi Automatik</p>
                    <p className="text-blue-700 text-xs mt-1">
                      Pikat tuaja do të shkojnë automatikisht në{' '}
                      <a href="#" onClick={(e) => e.preventDefault()} className="font-semibold hover:underline">Portofolin</a>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Informacion i Rëndësishëm
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>Aktivitet i Rregullt:</strong> Sa më aktiv të jeni, aq më shumë pikë fitoni
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Konvertim Automatik:</strong> Pikat konvertohen automatikisht në kredite
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-800">
                    <strong>Asnjë Skadim:</strong> Pikat tuaja nuk skadojnë kurrë
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Points Earning Rules Card */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Rregullat e Fitimit të Pikëve
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {pointItems.map((item, index) => (
                  <PointItem key={index} icon={item.icon} text={item.text} iconBgColor={item.bgColor} />
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="flex items-start gap-3">
                  <Trophy className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 font-medium text-sm">Këshillë për më shumë pikë</p>
                    <p className="text-yellow-700 text-xs mt-1">
                      Qëndroni aktiv çdo ditë për të maksimizuar pikat tuaja!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyPointsForm;
