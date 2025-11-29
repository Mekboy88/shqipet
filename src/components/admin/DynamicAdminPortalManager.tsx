
import React, { useEffect, useState } from 'react';
import supabase from '@/lib/relaxedSupabase';
import { notificationManager } from '@/utils/notificationManager';
import { Shield, Crown, Users, Headphones, Code } from 'lucide-react';
import { useSecureRoles } from '@/hooks/users/use-secure-roles';

interface AdminPortal {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  portalId: string;
  colorScheme: {
    primary: string;
    secondary: string;
    background: string;
  };
  icon: React.ReactNode;
}

const roleConfigs = {
  super_admin: {
    colorScheme: { primary: '#E17B7B', secondary: '#D16B6B', background: '#fff8f8' },
    icon: <Crown className="h-6 w-6" />
  },
  admin: {
    colorScheme: { primary: '#FFB3A3', secondary: '#FF9F8C', background: '#fff5f3' },
    icon: <Shield className="h-6 w-6" />
  },
  moderator: {
    colorScheme: { primary: '#A3C4F3', secondary: '#8AB4F8', background: '#f0f4ff' },
    icon: <Users className="h-6 w-6" />
  },
  support: {
    colorScheme: { primary: '#B3E5B3', secondary: '#9DDBA4', background: '#f0fff0' },
    icon: <Headphones className="h-6 w-6" />
  },
  developer: {
    colorScheme: { primary: '#D4B3F0', secondary: '#C79CE6', background: '#faf5ff' },
    icon: <Code className="h-6 w-6" />
  }
};

const DynamicAdminPortalManager: React.FC = () => {
  const [adminPortals, setAdminPortals] = useState<AdminPortal[]>([]);
  const { getUserRoles } = useSecureRoles();

  // Initialize global routes object and perform security cleanup
  useEffect(() => {
    if (!window.adminPortalRoutes) {
      window.adminPortalRoutes = {};
    }
    
    // SECURITY: Clean up ALL admin portal data immediately
    console.log('🔒 SECURITY: DynamicAdminPortalManager performing complete security cleanup');
    localStorage.removeItem('adminPortals');
    localStorage.removeItem('adminPortalNotificationShown');
    localStorage.removeItem('adminPortalInitializerNotificationShown');
    
    // Clear all global routes
    window.adminPortalRoutes = {};
    
    console.log('🛡️ SECURITY: Admin portal system secured - all data cleared');
  }, []);

  const generatePortalId = (userId: string, role: string) => {
    return `${role}-${userId}-${Date.now()}`;
  };

  const createAdminPortal = async (user: any) => {
    try {
      // Get user roles from the secure role system
      const userRoles = await getUserRoles(user.user_id || user.id);
      const adminRoles = userRoles.filter(roleObj => 
        ['super_admin', 'admin', 'moderator', 'support', 'developer'].includes(roleObj.role)
      );

      if (adminRoles.length === 0) {
        console.log(`⚠️ User has no admin roles, skipping portal creation`);
        return;
      }

      // Create portal for the highest role
      const highestRole = adminRoles[0].role; // roles are returned in hierarchy order
      const portalId = generatePortalId(user.user_id || user.id, highestRole);
      const config = roleConfigs[highestRole as keyof typeof roleConfigs];

      const newPortal: AdminPortal = {
        userId: user.user_id || user.id,
        email: user.email,
        firstName: user.first_name || 'Admin',
        lastName: user.last_name || 'User',
        role: highestRole,
        portalId,
        colorScheme: config.colorScheme,
        icon: config.icon
      };

      // Add to state
      setAdminPortals(prev => {
        const filtered = prev.filter(p => p.userId !== newPortal.userId);
        return [...filtered, newPortal];
      });

      // Add to global routes
      const routePath = `/admin/portal/${portalId}`;
      window.adminPortalRoutes[routePath] = newPortal;

      // Store in localStorage for persistence
      const existingPortals = JSON.parse(localStorage.getItem('adminPortals') || '[]');
      const updatedPortals = existingPortals.filter((p: AdminPortal) => p.userId !== newPortal.userId);
      updatedPortals.push(newPortal);
      localStorage.setItem('adminPortals', JSON.stringify(updatedPortals));

      // Show success notification with portal link
      notificationManager.showNotification(
        `🎉 Admin Portal Created for ${newPortal.firstName} ${newPortal.lastName}!`,
        { 
          body: `Portal URL: ${window.location.origin}${routePath}`,
          tag: 'admin-portal'
        }
      );
      notificationManager.playSound('success');

      console.log(`✅ Admin portal created for ${newPortal.firstName} ${newPortal.lastName} (${newPortal.role})`);
      console.log(`🔗 Portal URL: ${window.location.origin}${routePath}`);

      return newPortal;
    } catch (error) {
      console.error('Error creating admin portal:', error);
    }
  };

  const removeAdminPortal = (userId: string) => {
    setAdminPortals(prev => {
      const portal = prev.find(p => p.userId === userId);
      if (portal) {
        // Remove from global routes
        Object.keys(window.adminPortalRoutes).forEach(route => {
          if (window.adminPortalRoutes[route].userId === userId) {
            delete window.adminPortalRoutes[route];
          }
        });

        // Remove from localStorage
        const existingPortals = JSON.parse(localStorage.getItem('adminPortals') || '[]');
        const updatedPortals = existingPortals.filter((p: AdminPortal) => p.userId !== userId);
        localStorage.setItem('adminPortals', JSON.stringify(updatedPortals));

        notificationManager.showNotification(`Admin portal removed for ${portal.firstName} ${portal.lastName}`, { tag: 'success' });
        notificationManager.playSound('success');
        console.log(`🗑️ Admin portal removed for ${portal.firstName} ${portal.lastName}`);
      }
      return prev.filter(p => p.userId !== userId);
    });
  };

  // Listen for new admin role grants (manual grants from admin panel)
  useEffect(() => {
    const handleNewAdminGranted = (event: CustomEvent) => {
      const { userId, userName, userEmail } = event.detail;
      console.log('🎯 New admin granted event received:', { userId, userName, userEmail });
      
      // Fetch the updated user profile to get the new role
      setTimeout(async () => {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

          if (error) {
            console.error('Error fetching updated profile:', error);
            return;
          }

          if (profile) {
            console.log(`📋 Creating portal for newly granted admin role`);
            await createAdminPortal(profile);
          } else {
            console.log('⚠️ No profile found for user after role grant');
          }
        } catch (error) {
          console.error('Error in handleNewAdminGranted:', error);
        }
      }, 1000);
    };

    window.addEventListener('newAdminGranted', handleNewAdminGranted as EventListener);

    return () => {
      window.removeEventListener('newAdminGranted', handleNewAdminGranted as EventListener);
    };
  }, []);

  // Listen for real-time role changes from database
  useEffect(() => {
    const channel = supabase
      .channel('admin-role-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles',
          filter: 'role=in.(super_admin,admin,moderator,support,developer)'
        },
        async (payload) => {
          console.log('🔄 Admin role change detected:', payload);
          
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            // Role granted - get profile and create portal
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', payload.new.user_id)
              .single();
              
            if (profile) {
              console.log(`📈 Role ${payload.new.role} granted, creating portal`);
              await createAdminPortal(profile);
            }
          } else if (payload.eventType === 'DELETE') {
            // Role removed - check if user still has admin roles
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', payload.old.user_id)
              .single();
              
            if (profile) {
              const userRoles = await getUserRoles(profile.id);
              const hasAdminRole = userRoles.some(roleObj => 
                ['super_admin', 'admin', 'moderator', 'support', 'developer'].includes(roleObj.role)
              );
              
              if (!hasAdminRole) {
                console.log(`📉 No admin roles remaining, removing portal for user ${profile.id}`);
                removeAdminPortal(profile.id);
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [getUserRoles]);

  // Load any existing portals from localStorage
  useEffect(() => {
    const savedPortals = JSON.parse(localStorage.getItem('adminPortals') || '[]');
    
    if (savedPortals.length > 0) {
      console.log(`📋 Restoring ${savedPortals.length} saved admin portals from localStorage`);
      
      // Restore portals to state and global routes
      savedPortals.forEach((portal: AdminPortal) => {
        // Restore icon if it's missing (happens when loaded from localStorage)
        if (!portal.icon) {
          const config = roleConfigs[portal.role as keyof typeof roleConfigs];
          if (config) {
            portal.icon = config.icon;
          }
        }
        
        setAdminPortals(prev => {
          const filtered = prev.filter(p => p.userId !== portal.userId);
          return [...filtered, portal];
        });
        
        const routePath = `/admin/portal/${portal.portalId}`;
        window.adminPortalRoutes[routePath] = portal;
      });
    } else {
      console.log('📋 No existing admin portals found in localStorage');
    }
  }, []);

  return null;
};

export default DynamicAdminPortalManager;
