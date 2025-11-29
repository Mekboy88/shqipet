
import React from 'react';
import GeneralSettingsForm from './GeneralSettingsForm';
import ProfileInfoForm from './ProfileInfoForm'; // Use ProfileInfoForm instead of ProfileForm
import SocialLinksForm from './SocialLinksForm';
import NotificationSettingsForm from './NotificationSettingsForm';
import PasswordSettingsForm from './PasswordSettingsForm';
import TwoFactorAuthForm from './TwoFactorAuthForm';
import AvatarAndCoverForm from './AvatarAndCoverForm';
import LocationPreferencesForm from './LocationPreferencesForm'; // Import the actual component
import { ProfileSettingsData } from '@/hooks/useProfileSettings';

// Placeholder components for sections not yet implemented
const PlaceholderComponent: React.FC<{ userInfo: any; setUserInfo: any }> = () => (
  <div className="text-center py-12">
    <div className="text-gray-400 mb-4">
      <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
        <span className="text-2xl">⚙️</span>
      </div>
    </div>
    <h3 className="text-lg font-semibold text-gray-600 mb-2">Under Development</h3>
    <p className="text-gray-500">This section is currently being developed</p>
  </div>
);

// My Points component
const MyPointsComponent: React.FC<{ userInfo: ProfileSettingsData; setUserInfo: any }> = ({ userInfo }) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-6 rounded-lg">
      <h3 className="text-xl font-bold text-orange-800 mb-2">My Points</h3>
      <div className="text-3xl font-bold text-orange-600">{userInfo.points || 0} Points</div>
      <p className="text-orange-700 mt-2">Earn points by being active on the platform!</p>
    </div>
    
    <div className="space-y-4">
      <h4 className="font-semibold">How to earn points:</h4>
      <ul className="space-y-2 text-sm text-gray-600">
        <li>• Create a post: 5 points</li>
        <li>• Receive a like: 1 point</li>
        <li>• Receive a comment: 2 points</li>
        <li>• Complete profile: 50 points</li>
        <li>• Daily login: 10 points</li>
      </ul>
    </div>
  </div>
);

// Wallet component
const WalletComponent: React.FC<{ userInfo: ProfileSettingsData; setUserInfo: any }> = ({ userInfo }) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-lg">
      <h3 className="text-xl font-bold text-green-800 mb-2">Wallet & Credits</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-2xl font-bold text-green-600">${userInfo.wallet_balance || 0}</div>
          <p className="text-green-700">Wallet Balance</p>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-600">${userInfo.earnings || 0}</div>
          <p className="text-blue-700">Total Earnings</p>
        </div>
      </div>
    </div>
    
    <div className="space-y-4">
      <h4 className="font-semibold">Payment History</h4>
      {userInfo.paymentHistory && userInfo.paymentHistory.length > 0 ? (
        <div className="space-y-2">
          {userInfo.paymentHistory.map((payment: any, index: number) => (
            <div key={index} className="flex justify-between p-3 bg-gray-50 rounded">
              <span>{payment.description || 'Payment'}</span>
              <span className="font-semibold">${payment.amount}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No payment history available</p>
      )}
    </div>
  </div>
);

// Affiliates component
const AffiliatesComponent: React.FC<{ userInfo: ProfileSettingsData; setUserInfo: any }> = ({ userInfo }) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg">
      <h3 className="text-xl font-bold text-purple-800 mb-2">Affiliate Program</h3>
      <p className="text-purple-700">Share your link and earn commissions!</p>
    </div>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Affiliate Link
        </label>
        <div className="flex">
          <input
            type="text"
            value={userInfo.affiliate_link || ''}
            readOnly
            className="flex-1 px-3 py-2 border rounded-l bg-gray-50"
          />
          <button className="px-4 py-2 bg-purple-600 text-white rounded-r hover:bg-purple-700">
            Copy
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-gray-50 rounded">
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-gray-600">Referrals</div>
        </div>
        <div className="p-4 bg-gray-50 rounded">
          <div className="text-2xl font-bold">$0</div>
          <div className="text-sm text-gray-600">Commissions</div>
        </div>
        <div className="p-4 bg-gray-50 rounded">
          <div className="text-2xl font-bold">0%</div>
          <div className="text-sm text-gray-600">Conversion Rate</div>
        </div>
      </div>
    </div>
  </div>
);

export const settingsComponentMap: Record<string, React.ComponentType<any>> = {
  general: GeneralSettingsForm,
  profile: ProfileInfoForm, // Use ProfileInfoForm instead of ProfileForm
  social: SocialLinksForm,
  notifications: NotificationSettingsForm,
  design: PlaceholderComponent,
  'avatar-and-cover': AvatarAndCoverForm,
  privacy: PlaceholderComponent,
  password: PasswordSettingsForm,
  sessions: PlaceholderComponent,
  'two-factor': TwoFactorAuthForm,
  blocked: PlaceholderComponent,
  information: PlaceholderComponent,
  addresses: PlaceholderComponent,
  'location-preferences': LocationPreferencesForm,
  verification: PlaceholderComponent,
  monetization: PlaceholderComponent,
  earnings: PlaceholderComponent,
  affiliates: AffiliatesComponent,
  'my-points': MyPointsComponent,
  wallet: WalletComponent,
  delete: PlaceholderComponent
};
