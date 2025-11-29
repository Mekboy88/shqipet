
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, User, Shield, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { immediateLogoutService } from '@/utils/auth/immediateLogoutService';
import { getRoleBadgeConfig } from '@/components/admin/factory/AdminRoleUtils';
import Avatar from '@/components/Avatar';
import { useNavigate } from 'react-router-dom';

const AdminSettings: React.FC = () => {
  const { user, userRole, adminRole } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    console.log('🚪 Admin Settings logout clicked - redirecting to admin login');
    
    // Mark admin logout in session storage
    sessionStorage.setItem('adminLoggedOut', 'true');
    
    // Instant client-side redirect (no white blank page)
    navigate('/admin/login', { replace: true });
  };

  const handleQuickLogin = () => {
    navigate('/admin/login');
  };

  const currentRole = userRole || adminRole || 'user';
  const roleConfig = getRoleBadgeConfig(currentRole);

  return (
    <div className="min-h-screen max-h-screen w-full max-w-full overflow-x-hidden overflow-y-auto bg-background">
      <div className="w-full max-w-full h-full p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="w-full">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2 sm:mb-4">Admin Settings</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage your admin account and access settings.</p>
          </div>

          {/* Current User Card */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Current Admin User
              </CardTitle>
              <CardDescription>
                Your current admin session information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Avatar userId={user?.id} size="lg" className="h-12 w-12 ring-2 ring-primary/20" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {currentRole === 'platform_owner_root' && user?.email 
                      ? `********.${user.email.split('.').pop()}`
                      : user?.email || 'Admin User'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Role: <span className="font-medium" style={{ color: roleConfig.color }}>
                      {roleConfig.text}
                    </span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-muted-foreground">Active Session</span>
                  </div>
                </div>
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          {/* Session Management Card */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Session Management
              </CardTitle>
              <CardDescription>
                Manage your admin session and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  variant="destructive"
                  className="w-full h-12 text-base font-medium"
                >
                  {isLoggingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Logging Out...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout from Admin
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleQuickLogin}
                  variant="outline"
                  className="w-full h-12 text-base font-medium"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Quick Login Page
                </Button>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
                <p className="text-sm text-muted-foreground">
                  <strong>Admin Logout:</strong> This will redirect you back to the admin login page while keeping your platform authentication intact. 
                  You'll remain logged into the platform but exit the admin area.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
