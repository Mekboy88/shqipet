
import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, User, Upload, Shield } from 'lucide-react';

interface VerificationFormProps {
  userInfo: {
    username: string;
    firstName: string;
  };
  setUserInfo: React.Dispatch<React.SetStateAction<any>>;
}

const lightFocusStyles = "bg-white border-gray-300 focus:border-red-300 focus:ring-2 focus:ring-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/10 focus-visible:ring-offset-0";

const FileUploadBox: React.FC<{
  icon: React.ReactNode;
  label: string;
  onFileSelect: (file: File | null) => void;
  fileName: string | null;
}> = ({ icon, label, onFileSelect, fileName }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBoxClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    } else {
      onFileSelect(null);
    }
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 flex flex-col items-center justify-center h-40 bg-gray-50/50"
      onClick={handleBoxClick}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf"
      />
      {fileName ? (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm font-medium text-gray-700 break-all text-center">{fileName}</p>
          <p className="text-xs text-green-600 mt-1">Skedari u ngarkua</p>
        </div>
      ) : (
        <>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-xs text-gray-500 mt-1">Klikoni për të ngarkuar</p>
        </>
      )}
    </div>
  );
};


const VerificationForm: React.FC<VerificationFormProps> = ({ userInfo, setUserInfo }) => {
  const [message, setMessage] = useState('');
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [pictureFile, setPictureFile] = useState<File | null>(null);

  const handleSubmit = () => {
    // Handle form submission logic
    console.log({
      username: userInfo.username,
      message,
      passportFile,
      pictureFile,
    });
    // You can add API call here to submit for verification
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/20 rounded-2xl p-6 shadow-lg border border-primary/20">
        <h2 className="text-3xl font-bold text-primary mb-4">Vërtetimi i Llogarisë</h2>
        <p className="text-gray-700 text-lg">
          Dërgoni dokumentet tuaja për të vërtetuar identitetin dhe për të marrë më shumë të drejta në platformë
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Username Card */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Emri i Përdoruesit
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700 mb-2 block">
                Emri i Përdoruesit Aktual
              </Label>
              <Input 
                id="username" 
                value={userInfo.username} 
                readOnly 
                className="w-full bg-gray-50 transition-all duration-200"
                placeholder="Emri i përdoruesit"
              />
              <p className="text-xs text-gray-500 mt-2">
                Ky është emri juaj aktual i përdoruesit që do të vërtetohet
              </p>
            </CardContent>
          </Card>

          {/* Message Card */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Mesazhi për Administratorët
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2 block">
                Shkruani një mesazh
              </Label>
              <Textarea
                id="message"
                placeholder="Shkruani një mesazh për administratorët që përshkruan arsyen e kërkesës suaj për vërtetim..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                Ky mesazh do t'u dërgohet administratorëve së bashku me dokumentet
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upload Documents Card */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Ngarko Dokumentet
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-6">
                Ju lutemi ngarkoni një foto me pasaportën/ID-në tuaj dhe një foto të qartë personale
              </p>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Kopja e Pasaportës ose ID-së
                  </Label>
                  <FileUploadBox
                    icon={<FileText className="w-6 h-6 text-gray-500" />}
                    label="Kopja e pasaportës ose kartës së identitetit"
                    onFileSelect={setPassportFile}
                    fileName={passportFile?.name || null}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Fotoja Juaj Personale
                  </Label>
                  <FileUploadBox
                    icon={<User className="w-6 h-6 text-gray-500" />}
                    label="Fotoja juaj personale e qartë"
                    onFileSelect={setPictureFile}
                    fileName={pictureFile?.name || null}
                  />
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Shënim:</strong> Të gjitha dokumentet do të mbahen të sigurta dhe do të përdoren vetëm për procesin e vërtetimit.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button Card */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="mb-4">
                  <p className="text-gray-600">
                    Pasi të keni plotësuar të gjitha fushat, klikoni "Dërgo" për të nisur procesin e vërtetimit
                  </p>
                </div>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!message.trim() || !passportFile || !pictureFile}
                  className="px-10 py-3 bg-primary hover:bg-primary/90 text-white border-0 font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Dërgo për Vërtetim
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VerificationForm;

