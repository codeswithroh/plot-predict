import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface BetStats {
  totalBets: number;
  uniqueTraders: number;
}

export function useBetStats() {
  const [stats, setStats] = useState<BetStats>({ totalBets: 0, uniqueTraders: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBetStats = async () => {
      try {
        setIsLoading(true);
        console.log('📊 Fetching bet statistics from Supabase...');

        // Get total bet count
        const { count: totalBets, error: countError } = await supabase
          .from('bet_activities')
          .select('*', { count: 'exact', head: true });

        if (countError) {
          console.error('Failed to fetch bet count:', countError);
          return;
        }

        // Get unique traders
        const { data: uniqueUsers, error: usersError } = await supabase
          .from('bet_activities')
          .select('user_address');

        if (usersError) {
          console.error('Failed to fetch unique traders:', usersError);
          return;
        }

        // Calculate unique traders
        const uniqueTraders = new Set(
          uniqueUsers?.map(bet => bet.user_address.toLowerCase()) || []
        ).size;

        const betStats = {
          totalBets: totalBets || 0,
          uniqueTraders,
        };

        console.log('✅ Bet statistics from Supabase:', betStats);
        setStats(betStats);
      } catch (error) {
        console.error('❌ Failed to fetch bet stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBetStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchBetStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return { stats, isLoading };
}
