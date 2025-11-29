import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DesktopLayout from '@/components/layout/DesktopLayout';
import NavbarNoTooltip from '@/components/NavbarNoTooltip';
import { useAuth } from '@/contexts/AuthContext';
import Home from "@/pages/Home";

// Guard component to prevent navbar rendering for unauthenticated users
const GuardedNavbar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return <>{user ? <><NavbarNoTooltip />{children}</> : <>{children}</>}</>;
};
import Watch from "@/pages/Watch";
import Reels from "@/pages/Reels";
import Marketplace from "@/pages/Marketplace";
// import MarketplaceEntrance from "@/pages/MarketplaceEntrance";
import Groups from "@/pages/Groups";
import Gaming from "@/pages/Gaming";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Verification from "@/pages/auth/Verification";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import Welcome from "@/pages/Welcome";
import NotFound from "@/pages/NotFound";
import Photos from "@/pages/Photos";
import Tasks from "@/pages/Tasks";
import UnderConstructionWithRefresh from "@/components/UnderConstructionWithRefresh";
import UnderConstruction from '@/pages/admin/UnderConstruction';
import BehavioralBiometrics from '@/pages/admin/auth/BehavioralBiometrics';
import U2FHardwareKeys from '@/pages/admin/auth/U2FHardwareKeys';
import GeoFencing from '@/pages/admin/auth/GeoFencing';
import IdentityVerification from '@/pages/admin/auth/IdentityVerification';
import VerifiedUsers from '@/pages/admin/auth/VerifiedUsers';
import PendingAccounts from '@/pages/admin/auth/PendingAccounts';
import TwoFASessionLogs from '@/pages/admin/auth/TwoFASessionLogs';
import LoginSettings from '@/pages/admin/auth/LoginSettings';
import OAuthProviders from '@/pages/admin/auth/OAuthProviders';
import LowProUserSettings from '@/pages/admin/LowProUserSettings';
import MediumProUserSettings from '@/pages/admin/MediumProUserSettings';
import MediumProAdminManagement from '@/pages/admin/MediumProAdminManagement';
import SuperProUserSettings from '@/pages/admin/SuperProUserSettings';
import ProSystemSettings from '@/pages/admin/ProSystemSettings';
import ProFeatureToggles from '@/pages/admin/ProFeatureToggles';
import ProTierManagement from '@/pages/admin/ProTierManagement';
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminOverview from "@/pages/admin/AdminOverview";
import PlatformActivityDashboard from "@/pages/admin/dashboard/PlatformActivityDashboard";
import FinancialDashboard from "@/pages/admin/dashboard/FinancialDashboard";
import SystemHealthDashboard from "@/pages/admin/dashboard/SystemHealthDashboard";
import SecurityDashboard from "@/pages/admin/dashboard/SecurityDashboard";
import QuickActionsDashboard from "@/pages/admin/dashboard/QuickActionsDashboard";
import AISystemDashboard from "@/pages/admin/dashboard/AISystemDashboard";
import AuditTrailDashboard from "@/pages/admin/dashboard/AuditTrailDashboard";
import ContentModerationDashboard from "@/pages/admin/dashboard/ContentModerationDashboard";
import GeoActivityDashboard from "@/pages/admin/dashboard/GeoActivityDashboard";
import UserBehaviorDashboard from "@/pages/admin/dashboard/UserBehaviorDashboard";
import UsersManagement from "@/pages/admin/UsersManagement";
import AdminUsers from "@/pages/admin/AdminUsers";
import RoleManagement from "@/pages/admin/RoleManagement";
import AdminUserActions from "@/pages/admin/AdminUserActions";
import AdminUserImpersonate from "@/pages/admin/AdminUserImpersonate";
import GeneralConfiguration from "@/pages/admin/GeneralConfiguration";
import PostSettings from "@/pages/admin/PostSettings";
import GeneralGlobalSettingsPage from "@/pages/admin/GeneralGlobalSettingsPage";
import GeneralModuleControlPage from "@/pages/admin/GeneralModuleControlPage";
import AIModerationSettings from "@/pages/admin/AIModerationSettings";
import GeneralPlatformBrandingPage from "@/pages/admin/GeneralPlatformBrandingPage";
import SystemRequirementsStatus from "@/pages/admin/SystemRequirementsStatus";
import BackendHealthCheck from "@/pages/admin/system/BackendHealthCheck";
import UserIdentityVerification from "@/pages/admin/system/UserIdentityVerification";
import Profile from '@/pages/Profile';
import ProfileSettings from '@/pages/ProfileSettings';
import HistoryPage from '@/components/history/HistoryPage';
import CorePlatformAuthentication from '@/pages/admin/core-platform/CorePlatformAuthentication';
import CorePlatformRealTimeSync from '@/pages/admin/core-platform/CorePlatformRealTimeSync';
import CorePlatformAnalytics from '@/pages/admin/core-platform/CorePlatformAnalytics';
import CorePlatformNotifications from '@/pages/admin/core-platform/CorePlatformNotifications';
import CorePlatformPayments from '@/pages/admin/core-platform/CorePlatformPayments';
import CorePlatformVisuals from '@/pages/admin/core-platform/CorePlatformVisuals';
import CorePlatformAI from '@/pages/admin/core-platform/CorePlatformAI';
import CorePlatformAdminTools from '@/pages/admin/core-platform/CorePlatformAdminTools';
import CorePlatformChat from '@/pages/admin/core-platform/CorePlatformChat';
import CorePlatformFeatureModules from '@/pages/admin/core-platform/CorePlatformFeatureModules';
import CorePlatformNavigation from '@/pages/admin/core-platform/CorePlatformNavigation';
import CorePlatformDeepLinking from '@/pages/admin/core-platform/CorePlatformDeepLinking';
import CorePlatformSecurityModules from '@/pages/admin/core-platform/CorePlatformSecurityModules';
import LiveConnectionTopology from '@/pages/admin/core-platform/LiveConnectionTopology';
import ChatGPTIntegration from '@/pages/admin/integrations/ChatGPTIntegration';
import OAuthProvidersConfig from '@/pages/admin/integrations/OAuthProvidersConfig';
import LocalizationCurrencyPage from '@/pages/admin/localization/LocalizationCurrencyPage';
import AIAPIsConnection from '@/components/admin/AIAPIsConnection';
import AdminUserDashboard from '@/components/admin/users/AdminUserDashboard';
import WasabiCloudPage from '@/pages/admin/api/WasabiCloudPage';
import CloudMonitoring from '@/pages/admin/cloud/CloudMonitoring';
import LiveOperationCounter from '@/pages/admin/cloud/LiveOperationCounter';
import CostEstimator from '@/pages/admin/cloud/CostEstimator';
import QueryLogsViewer from '@/pages/admin/cloud/QueryLogsViewer';
import RealTimeAlerts from '@/pages/admin/cloud/RealTimeAlerts';
import OptimizationSuggestions from '@/pages/admin/cloud/OptimizationSuggestions';

import TimePage from '@/pages/admin/localization/TimePage';
import CurrencySettingsPage from '@/pages/admin/localization/CurrencySettingsPage';
import PrivacyPage from '@/pages/admin/localization/PrivacyPage';
import LocalizationPage from '@/pages/admin/localization/LocalizationPage';
import { TranslationEditorPage } from '@/components/admin/localization/TranslationEditorPage';
import ProfessionalPresentation from '@/pages/ProfessionalPresentation';
import CreatePostDesktop from '@/pages/CreatePostDesktop';
import Messages from '@/pages/Messages';

const DesktopApp: React.FC = () => {
  return (
    <DesktopLayout>
      <div className="relative">
        <Routes>
          <Route path="/" element={<GuardedNavbar><Home /></GuardedNavbar>} />
          <Route path="/reels" element={<><NavbarNoTooltip /><Reels /></>} />
          <Route path="/interesante" element={<><NavbarNoTooltip /><Reels /></>} />
          <Route path="/watch" element={<><NavbarNoTooltip /><Watch /></>} />
          {/* <Route path="/marketplace" element={<><NavbarNoTooltip /><MarketplaceEntrance /></>} /> */}
          <Route path="/marketplace" element={<><NavbarNoTooltip /><Marketplace /></>} />
          <Route path="/marketplace/platform" element={<><NavbarNoTooltip /><Marketplace /></>} />
          <Route path="/marketplace/users" element={<><NavbarNoTooltip /><Marketplace /></>} />
          <Route path="/groups" element={<><NavbarNoTooltip /><Groups /></>} />
          <Route path="/gaming" element={<><NavbarNoTooltip /><Gaming /></>} />
          <Route path="/tasks" element={<><NavbarNoTooltip /><Tasks /></>} />
          <Route path="/profile" element={<><NavbarNoTooltip /><Profile /></>} />
          <Route path="/profile/settings" element={<><NavbarNoTooltip /><Profile /><ProfileSettings /></>} />
          <Route path="/profile/*" element={<><NavbarNoTooltip /><Profile /></>} />
          <Route path="/professional-presentation" element={<ProfessionalPresentation />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/create-post" element={<><NavbarNoTooltip /><CreatePostDesktop /></>} />
          <Route path="/create-post/*" element={<><NavbarNoTooltip /><CreatePostDesktop /></>} />
          <Route path="/compose" element={<><NavbarNoTooltip /><CreatePostDesktop /></>} />
          <Route path="/post/create" element={<><NavbarNoTooltip /><CreatePostDesktop /></>} />
          <Route path="/history" element={<><NavbarNoTooltip /><HistoryPage /></>} />
          <Route path="/messages" element={<><NavbarNoTooltip /><div className="pt-14"><Messages /></div></>} />
          <Route path="/messages/standalone" element={<Messages />} />
      <Route path="/auth" element={<Navigate to="/" replace />} />
      <Route path="/auth/login" element={<Navigate to="/" replace />} />
      <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/verification" element={<Verification />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Admin Dashboard with nested routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />}>
            <Route index element={<AdminOverview />} />
            <Route path="activity" element={<PlatformActivityDashboard />} />
            <Route path="financial" element={<FinancialDashboard />} />
            <Route path="health" element={<SystemHealthDashboard />} />
            <Route path="security" element={<SecurityDashboard />} />
            <Route path="actions" element={<QuickActionsDashboard />} />
            <Route path="ai-system" element={<AISystemDashboard />} />
            <Route path="audit-trail" element={<AuditTrailDashboard />} />
            <Route path="content-moderation" element={<ContentModerationDashboard />} />
            <Route path="geo-activity" element={<GeoActivityDashboard />} />
            <Route path="user-behavior" element={<UserBehaviorDashboard />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="*" element={<UnderConstructionWithRefresh />} />
          </Route>

          {/* Direct route for Admin User Table */}
          <Route path="/admin/users/profiles" element={<AdminDashboard />}>
            <Route index element={<AdminUserDashboard />} />
          </Route>

          {/* Direct route for Wasabi Cloud Page */}
          <Route path="/admin/api/cloud" element={<AdminDashboard />}>
            <Route index element={<WasabiCloudPage />} />
          </Route>

          {/* Direct route for AdminUsers */}
          <Route path="/admin/users/admins" element={<AdminDashboard />}>
            <Route index element={<AdminUsers />} />
          </Route>
          
          {/* Route for Role Management */}
          <Route path="/admin/users/roles" element={<AdminDashboard />}>
            <Route index element={<RoleManagement />} />
          </Route>
          
          {/* Route for User Actions */}
          <Route path="/admin/users/actions" element={<AdminDashboard />}>
            <Route index element={<AdminUserActions />} />
          </Route>
          
          {/* Route for User Impersonation */}
          <Route path="/admin/users/impersonate" element={<AdminDashboard />}>
            <Route index element={<AdminUserImpersonate />} />
          </Route>

          {/* General Configuration routes - all use the comprehensive GeneralConfiguration component */}
          <Route path="/admin/general-config" element={<AdminDashboard />}>
            <Route index element={<GeneralConfiguration />} />
          </Route>
          
          <Route path="/admin/general-config/global-settings" element={<AdminDashboard />}>
            <Route index element={<GeneralConfiguration />} />
          </Route>
          
          <Route path="/admin/general-config/user-settings" element={<AdminDashboard />}>
            <Route index element={<GeneralConfiguration />} />
          </Route>
          
          <Route path="/admin/general-config/login-registration" element={<AdminDashboard />}>
            <Route index element={<GeneralConfiguration />} />
          </Route>
          
          <Route path="/admin/general-config/notifications" element={<AdminDashboard />}>
            <Route index element={<GeneralConfiguration />} />
          </Route>
          
          <Route path="/admin/general-config/modules" element={<AdminDashboard />}>
            <Route index element={<GeneralConfiguration />} />
          </Route>
          
          <Route path="/admin/general-config/other-settings" element={<AdminDashboard />}>
            <Route index element={<GeneralConfiguration />} />
          </Route>
          
          <Route path="/admin/general-config/system-settings" element={<AdminDashboard />}>
            <Route index element={<GeneralConfiguration />} />
          </Route>
          
          <Route path="/admin/general-config/security-compliance" element={<AdminDashboard />}>
            <Route index element={<GeneralConfiguration />} />
          </Route>
          
          <Route path="/admin/general-config/interface-display" element={<AdminDashboard />}>
            <Route index element={<GeneralConfiguration />} />
          </Route>
          
          <Route path="/admin/general-config/cdn-delivery" element={<AdminDashboard />}>
            <Route index element={<GeneralConfiguration />} />
          </Route>
          
          <Route path="/admin/general-config/broadcast-notifications" element={<AdminDashboard />}>
            <Route index element={<GeneralConfiguration />} />
          </Route>
          
          <Route path="/admin/general-config/multi-tenant" element={<AdminDashboard />}>
            <Route index element={<GeneralConfiguration />} />
          </Route>
          
          <Route path="/admin/general-config/translation-overrides" element={<AdminDashboard />}>
            <Route index element={<GeneralConfiguration />} />
          </Route>
          
          {/* Pro User Settings routes */}
          <Route path="/admin/general-config/low-pro" element={<AdminDashboard />}>
            <Route index element={<LowProUserSettings />} />
          </Route>
          
          <Route path="/admin/general-config/medium-pro" element={<AdminDashboard />}>
            <Route index element={<MediumProUserSettings />} />
          </Route>
          
          <Route path="/admin/general-config/medium-pro-admin" element={<AdminDashboard />}>
            <Route index element={<MediumProAdminManagement />} />
          </Route>
          
          <Route path="/admin/general-config/super-pro" element={<AdminDashboard />}>
            <Route index element={<SuperProUserSettings />} />
          </Route>
          
          <Route path="/admin/general-config/branding" element={<AdminDashboard />}>
            <Route index element={<GeneralConfiguration />} />
          </Route>

          {/* Post Settings routes */}
          <Route path="/admin/posts/management" element={<AdminDashboard />}>
            <Route index element={<PostSettings />} />
          </Route>

          {/* AI & Automation routes */}
          <Route path="/admin/ai/moderation" element={<AdminDashboard />}>
            <Route index element={<AIModerationSettings />} />
          </Route>

          {/* System Requirements & Status routes */}
          <Route path="/admin/system/requirements-status" element={<AdminDashboard />}>
            <Route index element={<SystemRequirementsStatus />} />
            <Route path="backend-health" element={<BackendHealthCheck />} />
            <Route path="user-identity" element={<UserIdentityVerification />} />
            <Route path="database-integrity" element={<UnderConstructionWithRefresh />} />
            <Route path="security-auth" element={<UnderConstructionWithRefresh />} />
            <Route path="ui-validation" element={<UnderConstructionWithRefresh />} />
            <Route path="test-tools" element={<UnderConstructionWithRefresh />} />
          </Route>

          {/* Platform Settings route */}
          <Route path="/admin/settings/*" element={<AdminDashboard />}>
            <Route index element={<Navigate to="/admin/settings/domain" replace />} />
            <Route path="domain" element={<UnderConstructionWithRefresh />} />
            <Route path="scripts" element={<UnderConstructionWithRefresh />} />
            <Route path="maintenance" element={<UnderConstructionWithRefresh />} />
            <Route path="analytics" element={<UnderConstructionWithRefresh />} />
            <Route path="seo" element={<UnderConstructionWithRefresh />} />
            <Route path="*" element={<UnderConstructionWithRefresh />} />
          </Route>
          
          {/* Redirect '/admin/users/all' to '/admin/dashboard/users' */}
          <Route path="/admin/users/all" element={<Navigate to="/admin/dashboard/users" replace />} />

          {/* Pro System routes */}
          <Route path="/admin/pro-system/*" element={<AdminDashboard />}>
            <Route index element={<Navigate to="/admin/pro-system/settings" replace />} />
            <Route path="settings" element={<ProSystemSettings />} />
            <Route path="features" element={<ProFeatureToggles />} />
            <Route path="tiers" element={<ProTierManagement />} />
            <Route path="*" element={<UnderConstructionWithRefresh />} />
          </Route>

          {/* Core Platform routes */}
          <Route path="/admin/core-platform/*" element={<AdminDashboard />}>
            <Route path="authentication" element={<CorePlatformAuthentication />} />
            <Route path="realtime-sync" element={<CorePlatformRealTimeSync />} />
            <Route path="analytics" element={<CorePlatformAnalytics />} />
            <Route path="notifications" element={<CorePlatformNotifications />} />
            <Route path="payments" element={<CorePlatformPayments />} />
            <Route path="visuals" element={<CorePlatformVisuals />} />
            <Route path="ai" element={<CorePlatformAI />} />
            <Route path="admin-tools" element={<CorePlatformAdminTools />} />
            <Route path="chat" element={<CorePlatformChat />} />
            <Route path="feature-modules" element={<CorePlatformFeatureModules />} />
            <Route path="navigation" element={<CorePlatformNavigation />} />
            <Route path="deep-linking" element={<CorePlatformDeepLinking />} />
            <Route path="security-modules" element={<CorePlatformSecurityModules />} />
            <Route path="live-connection-topology" element={<LiveConnectionTopology />} />
            <Route path="*" element={<UnderConstructionWithRefresh />} />
          </Route>

          {/* Admin Auth routes */}
          <Route path="/admin/auth/*" element={<AdminDashboard />}>
            <Route path="behavioral-biometrics" element={<BehavioralBiometrics />} />
            <Route path="u2f-hardware-keys" element={<U2FHardwareKeys />} />
            <Route path="geo-fencing" element={<GeoFencing />} />
            <Route path="identity-verification" element={<IdentityVerification />} />
            <Route path="verified" element={<VerifiedUsers />} />
            <Route path="pending" element={<PendingAccounts />} />
            <Route path="logs" element={<TwoFASessionLogs />} />
            <Route path="settings" element={<LoginSettings />} />
            <Route path="oauth" element={<OAuthProviders />} />
            <Route path="*" element={<UnderConstructionWithRefresh />} />
          </Route>

          <Route path="/admin/integrations/*" element={<AdminDashboard />}>
            <Route path="chatgpt" element={<ChatGPTIntegration />} />
            <Route path="oauth" element={<OAuthProvidersConfig />} />
            <Route path="*" element={<UnderConstructionWithRefresh />} />
          </Route>

          {/* Admin Localization routes */}
          <Route path="/admin/localization" element={<AdminDashboard />}>
            <Route index element={<LocalizationPage />} />
            <Route path="multi" element={<LocalizationPage />} />
            <Route path="translate" element={<TranslationEditorPage />} />
          </Route>
          <Route path="/admin/localization/currency" element={<AdminDashboard />}>
            <Route index element={<LocalizationCurrencyPage />} />
          </Route>
          <Route path="/admin/localization/time" element={<AdminDashboard />}>
            <Route index element={<TimePage />} />
          </Route>
          <Route path="/admin/localization/currency-settings" element={<AdminDashboard />}>
            <Route index element={<CurrencySettingsPage />} />
          </Route>
          <Route path="/admin/localization/privacy" element={<AdminDashboard />}>
            <Route index element={<PrivacyPage />} />
          </Route>

          {/* AI APIs Connection */}
          <Route path="/admin/api/ai" element={<AdminDashboard />}>
            <Route index element={<AIAPIsConnection />} />
          </Route>

          {/* Cloud Monitoring routes */}
          <Route path="/admin/cloud" element={<AdminDashboard />}>
            <Route index element={<CloudMonitoring />} />
            <Route path="operations" element={<LiveOperationCounter />} />
            <Route path="costs" element={<CostEstimator />} />
            <Route path="logs" element={<QueryLogsViewer />} />
            <Route path="alerts" element={<RealTimeAlerts />} />
            <Route path="optimizations" element={<OptimizationSuggestions />} />
            <Route path="optimization" element={<Navigate to="/admin/cloud/optimizations" replace />} />
          </Route>

          {/* Handle any other admin route */}
          <Route path="/admin/*" element={<AdminDashboard />}>
            <Route path="*" element={<UnderConstructionWithRefresh />} />
          </Route>
          
          <Route path="*" element={<><NavbarNoTooltip /><NotFound /></>} />
        </Routes>
      </div>
    </DesktopLayout>
  );
};

export default DesktopApp;
