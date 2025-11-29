import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Avatar from '@/components/Avatar';
import { Settings, User, Link, Bell, Palette, Shield, Lock, Users, ShieldCheck, UserCheck, MapPin, Verified, DollarSign, Gift, CreditCard, Trash2 } from 'lucide-react';
import { useUniversalUser } from '@/hooks/useUniversalUser';
import MyEarningsForm from '../settings/MyEarningsForm';

interface GeneralSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const GeneralSettingsDialog: React.FC<GeneralSettingsDialogProps> = ({
  isOpen,
  onOpenChange
}) => {
  const { displayName } = useUniversalUser();
  const [selectedSection, setSelectedSection] = useState('general');
  const [userInfo, setUserInfo] = useState({
    username: '1749076401791277_405642',
    email: 'a.mekizvani@hotmail.com',
    phone: '',
    birthday: '31-12-00-2',
    country: 'Select Country',
    gender: 'Male'
  });

  const menuItems = [{
    id: 'general',
    label: 'General',
    icon: Settings,
    color: 'text-blue-600'
  }, {
    id: 'profile',
    label: 'Profile',
    icon: User,
    color: 'text-green-600'
  }, {
    id: 'social',
    label: 'Social Links',
    icon: Link,
    color: 'text-blue-500'
  }, {
    id: 'notifications',
    label: 'Notification Settings',
    icon: Bell,
    color: 'text-purple-600'
  }, {
    id: 'design',
    label: 'Design',
    icon: Palette,
    color: 'text-green-500'
  }, {
    id: 'avatar',
    label: 'Avatar & Cover',
    icon: Shield,
    color: 'text-blue-400'
  }, {
    id: 'privacy',
    label: 'Privacy',
    icon: Lock,
    color: 'text-purple-500'
  }, {
    id: 'password',
    label: 'Password',
    icon: ShieldCheck,
    color: 'text-blue-600'
  }, {
    id: 'sessions',
    label: 'Manage Sessions',
    icon: Users,
    color: 'text-purple-400'
  }, {
    id: 'twofactor',
    label: 'Two-factor authentication',
    icon: UserCheck,
    color: 'text-blue-500'
  }, {
    id: 'blocked',
    label: 'Blocked Users',
    icon: UserCheck,
    color: 'text-red-500'
  }, {
    id: 'information',
    label: 'My Information',
    icon: MapPin,
    color: 'text-gray-600'
  }, {
    id: 'addresses',
    label: 'My Addresses',
    icon: MapPin,
    color: 'text-blue-600'
  }, {
    id: 'verification',
    label: 'Verification',
    icon: Verified,
    color: 'text-purple-600'
  }, {
    id: 'monetization',
    label: 'Monetization',
    icon: DollarSign,
    color: 'text-purple-500'
  }, {
    id: 'earnings',
    label: 'My Earnings',
    icon: DollarSign,
    color: 'text-green-500'
  }, {
    id: 'affiliates',
    label: 'My Affiliates',
    icon: Gift,
    color: 'text-orange-500'
  }, {
    id: 'points',
    label: 'My Points',
    icon: Gift,
    color: 'text-orange-600'
  }, {
    id: 'wallet',
    label: 'Wallet & Credits',
    icon: CreditCard,
    color: 'text-blue-600'
  }, {
    id: 'delete',
    label: 'Delete Account',
    icon: Trash2,
    color: 'text-red-600'
  }];

  const handleSave = () => {
    console.log('Saving settings:', userInfo);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[80vh] p-0">
        <div className="flex h-full">
          {/* Left Sidebar */}
          <div className="w-80 bg-gray-50 border-r overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-4">Settings</h3>
              <div className="space-y-1">
                {menuItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedSection === item.id ? 'bg-white shadow-sm border' : 'hover:bg-white/50'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 flex flex-col">
            {/* Only show header on general page */}
            {selectedSection === 'general' && (
              <DialogHeader className="p-6">
                {/* Everything inside the border */}
                <div className="border-2 border-gray-300 rounded-lg p-4 flex items-center gap-6 bg-gray-100">
                  {/* Avatar with Settings Icon Overlay */}
                  <div className="relative flex-shrink-0">
                    <Avatar 
                      size="2xl"
                      src=""
                      initials={displayName?.[0]?.toUpperCase() || 'U'}
                      className="border-4 border-orange-200 img-locked"
                    />
                    {/* Small settings icon overlay */}
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-black rounded-full flex items-center justify-center">
                      <Settings className="w-4 h-4 text-white" />
                    </div>
                  </div>

                   {/* Title Section */}
                  <div>
                    <p className="text-gray-600 text-lg">{displayName || 'User'}</p>
                    <DialogTitle className="text-3xl font-bold text-black">General Setting</DialogTitle>
                  </div>
                </div>
              </DialogHeader>
            )}

            <div className="flex-1 p-6 overflow-y-auto">
              {selectedSection === 'general' && (
                <div className="max-w-2xl space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={userInfo.username}
                        onChange={e => setUserInfo(prev => ({
                          ...prev,
                          username: e.target.value
                        }))}
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={userInfo.phone}
                        onChange={e => setUserInfo(prev => ({
                          ...prev,
                          phone: e.target.value
                        }))}
                        className="bg-gray-50"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userInfo.email}
                      onChange={e => setUserInfo(prev => ({
                        ...prev,
                        email: e.target.value
                      }))}
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="birthday">Birthday</Label>
                      <Input
                        id="birthday"
                        value={userInfo.birthday}
                        onChange={e => setUserInfo(prev => ({
                          ...prev,
                          birthday: e.target.value
                        }))}
                        className="bg-gray-50"
                        placeholder="DD-MM-YY-G"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={userInfo.country}
                        onValueChange={value => setUserInfo(prev => ({
                          ...prev,
                          country: value
                        }))}
                      >
                        <SelectTrigger className="bg-gray-50">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="al">Albania</SelectItem>
                          <SelectItem value="de">Germany</SelectItem>
                          <SelectItem value="fr">France</SelectItem>
                          <SelectItem value="it">Italy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={userInfo.gender}
                      onValueChange={value => setUserInfo(prev => ({
                        ...prev,
                        gender: value
                      }))}
                    >
                      <SelectTrigger className="bg-gray-50 max-w-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4">
                    <Button onClick={handleSave} className="bg-red-500 hover:bg-red-600 text-white px-8">
                      Save
                    </Button>
                  </div>
                </div>
              )}

              {selectedSection === 'earnings' && (
                <MyEarningsForm 
                  userInfo={{
                    email: userInfo.email || '',
                    paymentHistory: []
                  }}
                  setUserInfo={setUserInfo}
                />
              )}

              {selectedSection !== 'general' && selectedSection !== 'earnings' && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Settings className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {menuItems.find(item => item.id === selectedSection)?.label}
                  </h3>
                  <p className="text-gray-500">This section is under development</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GeneralSettingsDialog;
