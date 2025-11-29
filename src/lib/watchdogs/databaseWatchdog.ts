// Supabase Watchdog disabled - database integration removed
// This stub preserves app functionality without any Supabase dependency.
import { toast } from 'sonner';

class NoopWatchdog {
  registerChannel(_name: string, _channel: any) {}
  unregisterChannel(_name: string) {}
  resubscribeAllChannels() {}
  dispose() { toast.dismiss('supabase-reconnecting'); toast.dismiss('supabase-disconnect'); }
}

export const supabaseWatchdog = new NoopWatchdog();
export default supabaseWatchdog;
