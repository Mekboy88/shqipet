
import React from 'react';
import { UserX, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Avatar from '@/components/Avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BlockedUser {
  id: string;
  name: string;
  avatar: string;
  time: string;
}

interface BlockedUsersFormProps {
  userInfo: {
    blockedUsers?: BlockedUser[];
  };
  setUserInfo: React.Dispatch<React.SetStateAction<any>>;
}

const BlockedUsersForm: React.FC<BlockedUsersFormProps> = ({ userInfo, setUserInfo }) => {
  const blockedUsers = userInfo.blockedUsers || [];

  const handleUnblock = (userId: string) => {
    setUserInfo((prev: any) => ({
      ...prev,
      blockedUsers: prev.blockedUsers.filter((user: BlockedUser) => user.id !== userId),
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3">
            Përdoruesit e Bllokuar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {blockedUsers.length === 0 ? (
            <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex flex-col items-center justify-center border border-gray-200/50">
              <ShieldX className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 font-medium">Nuk ka përdorues të bllokuar</p>
              <p className="text-sm text-gray-400 mt-2">Përdoruesit që bllokoni do të shfaqen këtu</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blockedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-200/50 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <Avatar 
                      size="lg"
                      src={user.avatar}
                      initials={user.name.charAt(0)}
                      className="img-locked"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.time}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleUnblock(user.id)}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border-red-200 font-medium transition-all duration-200 hover:shadow-md"
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Hiq Bllokimin
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockedUsersForm;
