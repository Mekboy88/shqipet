
import React from 'react';
import ProfileInfoForm from './ProfileInfoForm';
import NotificationSettingsForm from './NotificationSettingsForm';
import DesignSettingsForm from './DesignSettingsForm';
import AvatarAndCoverForm from './AvatarAndCoverForm';
import PrivacySettingsForm from './PrivacySettingsForm';
import PasswordSettingsForm from './PasswordSettingsForm';
import ManageSessionsForm from './ManageSessionsForm';
import TwoFactorAuthForm from './TwoFactorAuthForm';
import BlockedUsersForm from './BlockedUsersForm';
import MyInformationForm from './MyInformationForm';
import MyAddressesForm from './MyAddressesForm';
import VerificationForm from './VerificationForm';
import MonetizationForm from './MonetizationForm';
import MyEarningsForm from './MyEarningsForm';
import MyAffiliatesForm from './MyAffiliatesForm';
import MyPointsForm from './MyPointsForm';
import WalletAndCreditsForm from './WalletAndCreditsForm';
import DeleteAccountForm from './DeleteAccountForm';
import LocationPreferencesForm from './LocationPreferencesForm';


export const settingsComponentMap: { [key: string]: React.ComponentType<any> } = {
  profile: ProfileInfoForm,
  notifications: NotificationSettingsForm,
  design: DesignSettingsForm,
  'avatar-and-cover': AvatarAndCoverForm,
  privacy: PrivacySettingsForm,
  password: PasswordSettingsForm,
  'manage-sessions': ManageSessionsForm,
  'two-factor': TwoFactorAuthForm,
  'blocked-users': BlockedUsersForm,
  information: MyInformationForm,
  addresses: MyAddressesForm,
  verification: VerificationForm,
  monetization: MonetizationForm,
  earnings: MyEarningsForm,
  affiliates: MyAffiliatesForm,
  'my-points': MyPointsForm,
  wallet: WalletAndCreditsForm,
  'delete-account': DeleteAccountForm,
  'location-preferences': LocationPreferencesForm,
};
