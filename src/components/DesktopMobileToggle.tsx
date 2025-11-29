import { Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRealDeviceDetection } from '@/hooks/useRealDeviceDetection';
import { isOnPrimaryDomain, isMobileSubdomain, buildUrlFor } from '@/utils/domainConfig';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const DesktopMobileToggle = () => {
  const { isRealMobile, isRealTablet } = useRealDeviceDetection();
  const isMobileDevice = isRealMobile || isRealTablet;
  const onMobileSubdomain = isMobileSubdomain();
  const onPrimaryDomain = isOnPrimaryDomain();
  const prefersDesktop = localStorage.getItem('prefersDesktop') === '1';

  // Show toggle on mobile devices on primary domain, or on mobile subdomain
  const shouldShowToggle = (isMobileDevice && onPrimaryDomain) || onMobileSubdomain;

  if (!shouldShowToggle) return null;

  const handleViewDesktop = async () => {
    try {
      // Set localStorage preference
      localStorage.setItem('prefersDesktop', '1');
      
      // Update database if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ prefers_desktop: true })
          .eq('id', user.id);
      }

      // Redirect to primary domain if on mobile subdomain
      if (onMobileSubdomain) {
        window.location.href = buildUrlFor('shqipet.com');
      } else {
        // Just reload to apply preference
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to set desktop preference:', error);
      toast.error('Failed to switch to desktop view');
    }
  };

  const handleViewMobile = async () => {
    try {
      // Clear localStorage preference
      localStorage.removeItem('prefersDesktop');
      
      // Update database if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ prefers_desktop: false })
          .eq('id', user.id);
      }

      // Redirect to mobile subdomain if on primary domain
      if (onPrimaryDomain) {
        window.location.href = buildUrlFor('m.shqipet.com');
      } else {
        // Just reload to apply preference
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to set mobile preference:', error);
      toast.error('Failed to switch to mobile view');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {prefersDesktop || onMobileSubdomain ? (
        <Button
          variant="secondary"
          size="sm"
          onClick={handleViewMobile}
          className="shadow-lg gap-2"
        >
          <Smartphone className="h-4 w-4" />
          Use mobile site
        </Button>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          onClick={handleViewDesktop}
          className="shadow-lg gap-2"
        >
          <Monitor className="h-4 w-4" />
          View desktop site
        </Button>
      )}
    </div>
  );
};
