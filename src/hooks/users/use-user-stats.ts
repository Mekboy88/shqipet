
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const fetchUserStats = async () => {
  console.log('📊 Fetching user statistics...');
  
  const { count: femaleCount, error: femaleError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('gender', 'female');

  const { count: maleCount, error: maleError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('gender', 'male');

  const { count: activeCount, error: activeError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('account_status', 'active');

  const { count: inactiveCount, error: inactiveError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .not('account_status', 'eq', 'active');
  
  if (femaleError || maleError || activeError || inactiveError) {
    if (femaleError) console.error("Error fetching female users count", femaleError);
    if (maleError) console.error("Error fetching male users count", maleError);
    if (activeError) console.error("Error fetching active users count", activeError);
    if (inactiveError) console.error("Error fetching inactive users count", inactiveError);
    throw new Error('Could not fetch user statistics.');
  }

  const stats = {
    female: femaleCount || 0,
    male: maleCount || 0,
    active: activeCount || 0,
    inactive: inactiveCount || 0,
  };

  console.log('📊 User statistics fetched:', stats);
  return stats;
};

export const useUserStats = () => {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: fetchUserStats,
    refetchInterval: 30000, // Refetch every 30 seconds as backup
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};
