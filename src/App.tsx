
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInstantUpdates } from '@/hooks/useInstantUpdates';
import GlobalSessionRevocationMonitor from '@/components/auth/GlobalSessionRevocationMonitor';
import GlobalSkeleton from '@/components/ui/GlobalSkeleton';
import GlobalErrorBoundary from '@/components/ErrorBoundary/GlobalErrorBoundary';
import BulletproofErrorBoundary from '@/components/ErrorBoundary/BulletproofErrorBoundary';
import { ErrorRecoveryProvider } from '@/components/ErrorBoundary/ErrorRecoveryProvider';
// Removed toast system - using notification system instead
import { SessionsProvider } from './contexts/SessionsContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatSettingsProvider } from './contexts/ChatSettingsContext';
import { VideoSettingsProvider } from './contexts/VideoSettingsContext';
import { PostsProvider } from './contexts/PostsContext';
import { NotificationSettingsProvider } from './contexts/NotificationSettingsContext';
import { PublishingProgressProvider } from './contexts/PublishingProgressContext';
import { ProfileSettingsProvider } from './contexts/ProfileSettingsContext';
import AuthGuard from './components/auth/AuthGuard';
import InitialAuthCheck from './components/auth/InitialAuthCheck';
import RootAuthRedirect from './components/auth/RootAuthRedirect';
import CentralizedAuthGuard from './components/auth/CentralizedAuthGuard';
import Index from './pages/Index';
import Reels from './pages/Reels';
import Register from './pages/Register';
import Login from './pages/auth/Login';
import Verification from './pages/auth/Verification';
import Profile from './pages/Profile';
import ProfileSettings from './pages/ProfileSettings';
import PhotoGallery from './pages/PhotoGallery';
import Photos from './pages/Photos';
import Watch from './pages/Watch';
import LocationPreferences from './pages/LocationPreferences';
import ProfessionalPresentation from './pages/ProfessionalPresentation';
import AuthCallback from './pages/auth/AuthCallback';
import TermsOfUse from './pages/TermsOfUse';
import NotFound from './pages/NotFound';
import Marketplace from './pages/Marketplace';
import MarketplaceEntrance from './pages/MarketplaceEntrance';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDashboardContent from './pages/admin/AdminDashboardContent';
import AdminOverview from './pages/admin/AdminOverview';
import UsersManagement from './pages/admin/UsersManagement';
import SystemRequirementsStatusPage from './pages/admin/SystemRequirementsStatusPage';
import AIAnalyticsDashboard from './pages/admin/AIAnalyticsDashboard';
import LiveConnectionTopology from './pages/admin/core-platform/LiveConnectionTopology';
import AIAPIsConnection from './components/admin/AIAPIsConnection';
import AdminUserDashboard from './components/admin/users/AdminUserDashboard';
import AdminUploadMonitoring from './pages/AdminUploadMonitoring';
import CloudMonitoring from './pages/admin/cloud/CloudMonitoring';
import LiveOperationCounter from './pages/admin/cloud/LiveOperationCounter';
import CostEstimator from './pages/admin/cloud/CostEstimator';
import QueryLogsViewer from './pages/admin/cloud/QueryLogsViewer';
import RealTimeAlerts from './pages/admin/cloud/RealTimeAlerts';
import OptimizationSuggestions from './pages/admin/cloud/OptimizationSuggestions';
// New pages
import Albums from './pages/Albums';
import Dating from './pages/Dating';
import Hotels from './pages/Hotels';
import Restaurant from './pages/Restaurant';
import TakeoutFood from './pages/TakeoutFood';
import Games from './pages/Games';
import Forum from './pages/Forum';
import Movies from './pages/Movies';
import Jobs from './pages/Jobs';
import Offers from './pages/Offers';
import LearnTogether from './pages/LearnTogether';
import DiscoverPlaces from './pages/DiscoverPlaces';
import ProudOfTheCountry from './pages/ProudOfTheCountry';
import AnonymousReport from './pages/AnonymousReport';
import SocialNetworks from './pages/SocialNetworks';
import Applications from './pages/Applications';
import Travel from './pages/Travel';
import Music from './pages/Music';
import Books from './pages/Books';
import SavedPosts from './pages/SavedPosts';
import PopularPosts from './pages/PopularPosts';
import Memories from './pages/Memories';
import HowAreYou from './pages/HowAreYou';
import MyGroups from './pages/MyGroups';
import Messages from './pages/Messages';
import MyPages from './pages/MyPages';
import Blog from './pages/Blog';
import SharedThings from './pages/SharedThings';
import Fundraising from './pages/Fundraising';
import FindFriends from './pages/FindFriends';
import Information from './pages/Information';
import Directory from './pages/Directory';
import Events from './pages/Events';
import Tasks from './pages/Tasks';
import CreatePostDesktop from './pages/CreatePostDesktop';
import './App.css';
import DynamicAdminPortalManager from '@/components/admin/DynamicAdminPortalManager';
import GlobalNotificationsListener from '@/components/realtime/GlobalNotificationsListener';
import VideoSecurityBanner, { useVideoSecurityNotification } from '@/components/security/VideoSecurityBanner';
import { setVideoSecurityNotificationCallback } from '@/utils/videoSecurity';
import GlobalScrollIndicator from '@/components/ui/GlobalScrollIndicator';
import { sessionPersistenceService } from '@/services/sessionPersistence';
import { useGlobalElasticScrolling } from '@/hooks/useGlobalElasticScrolling';
import SessionBootstrapper from '@/components/sessions/SessionBootstrapper';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: (failureCount, error: any) => {
        console.error('Query failed:', error);
        // Don't retry on auth errors
        if (error?.code === '42501' || error?.message?.includes('permission')) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 8000),
    },
  },
});

// Wrapper that makes app background transparent on marketplace routes to avoid flash
const AppBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isMarketplace = location.pathname === '/marketplace' || location.pathname.startsWith('/marketplace/');

  React.useLayoutEffect(() => {
    if (isMarketplace) document.body.classList.add('marketplace-bg');
    else document.body.classList.remove('marketplace-bg');
  }, [isMarketplace]);

  return (
    <div data-elastic-container="true" className={`min-h-screen ${isMarketplace ? 'bg-transparent' : 'bg-background'}`}>
      {children}
    </div>
  );
};


function App() {
  // Enable instant updates and cache clearing
  useInstantUpdates();
  
  // Enable global elastic scrolling with momentum on all pages
  useGlobalElasticScrolling({ enabled: true, maxElasticDistance: 400, elasticityMultiplier: 13 });
  
  // Session revocation monitor moved under AuthProvider to access context
  
  // SECURITY: Clear any insecure admin portal data on app startup
  React.useEffect(() => {
    console.log('🔒 SECURITY: Clearing insecure admin portal data on app startup');
    localStorage.removeItem('adminPortals');
    localStorage.removeItem('adminPortalInitializerNotificationShown');
    if (window.adminPortalRoutes) {
      window.adminPortalRoutes = {};
    }
  }, []);

  // Initialize session persistence and security services
  React.useEffect(() => {
    console.log('🚀 CRITICAL FIX: Initializing session persistence and security services...');
    console.log('🔧 This will prevent user data from being lost on page refresh');
    
    // Initialize session persistence service for bulletproof session management
    sessionPersistenceService.initialize();
    
    console.log('✅ Session services initialized - user data should now persist across refreshes');
    
    return () => {
      // Cleanup on app unmount
      sessionPersistenceService.cleanup();
    };
  }, []);
  
  // Video security notification system
  const { blockedCount, showBanner, reportBlockedVideo, dismissBanner } = useVideoSecurityNotification();
  
  // Set up global video security notification callback
  React.useEffect(() => {
    setVideoSecurityNotificationCallback(reportBlockedVideo);
  }, [reportBlockedVideo]);

  return (
    <ErrorRecoveryProvider>
      <BulletproofErrorBoundary>
        <GlobalErrorBoundary>
          <QueryClientProvider client={queryClient}>
        <VideoSettingsProvider>
          <AuthProvider>
            <SessionsProvider>
              <SessionBootstrapper />
              <GlobalSessionRevocationMonitor />
              <ProfileSettingsProvider>
                <ThemeProvider>
                <ChatSettingsProvider>
                  <NotificationSettingsProvider>
                    <PublishingProgressProvider>
                      <PostsProvider>
                <Router>
                  <RootAuthRedirect>
                    <AppBackground>
                    {/* Removed toast system - using notification system */}
                     <DynamicAdminPortalManager />
                     {/* SECURITY: AdminPortalInitializer removed from global scope to prevent auto-admin creation */}
                    {/* Global security notifications */}
                    <VideoSecurityBanner 
                      blockedCount={blockedCount}
                      show={showBanner}
                      onDismiss={dismissBanner}
                    />
                    
                    {/* Global scroll indicator - detects active scroll container */}
                    <GlobalScrollIndicator />
                    
                     {/* Global real-time notifications listener - always on */}
                     <GlobalNotificationsListener />
                     
                     
                      <Routes>
                      {/* Public routes - NO AUTH CHECK */}
                      <Route path="/auth" element={<Navigate to="/" replace />} />
                      <Route path="/auth/login" element={<Navigate to="/" replace />} />
                      <Route path="/auth/register" element={<Register />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/auth/verification" element={<Verification />} />
                      <Route path="/auth/callback" element={<AuthCallback />} />
                      <Route path="/terms-of-use" element={<TermsOfUse />} />
                      <Route path="/privacy-policy" element={<TermsOfUse />} />
                      
                       {/* Protected routes - NO redundant auth checks, RootAuthRedirect handles it all */}
                       <Route path="/" element={<Index />} />
                       <Route path="/create-post" element={<CreatePostDesktop />} />
                       <Route path="/create-post/*" element={<CreatePostDesktop />} />
                       <Route path="/compose" element={<CreatePostDesktop />} />
                       <Route path="/compose/*" element={<CreatePostDesktop />} />
                       <Route path="/post/create" element={<CreatePostDesktop />} />
                       <Route path="/post/create/*" element={<CreatePostDesktop />} />
                       <Route path="/reels" element={<Reels />} />
                      <Route path="/interesante" element={<Reels />} />
                      <Route path="/watch" element={<Watch />} />
<Route path="/profile" element={<Profile />} />
                        <Route
                          path="/profile/settings"
                          element={<ProfileSettings />}
                        />
                       <Route path="/profile/settings/location" element={<LocationPreferences />} />
                       <Route path="/professional-presentation" element={<ProfessionalPresentation />} />
                        <Route path="/photos" element={<Photos />} />
                        <Route path="/photos/gallery" element={<PhotoGallery />} />
                       {/* Admin routes removed - backend disabled */}
                        <Route path="/marketplace" element={<MarketplaceEntrance />} />
                        <Route path="/marketplace/platform" element={<Marketplace />} />
                        <Route path="/marketplace/users" element={<Marketplace />} />
                       <Route path="*" element={<NotFound />} />
                    </Routes>
                    </AppBackground>
                  </RootAuthRedirect>
                </Router>
                </PostsProvider>
                  </PublishingProgressProvider>
                </NotificationSettingsProvider>
              </ChatSettingsProvider>
            </ThemeProvider>
            </ProfileSettingsProvider>
            </SessionsProvider>
          </AuthProvider>
          </VideoSettingsProvider>
        </QueryClientProvider>
      </GlobalErrorBoundary>
      </BulletproofErrorBoundary>
    </ErrorRecoveryProvider>
  );
}

export default App;
