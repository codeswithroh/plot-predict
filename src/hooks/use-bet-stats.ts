import { useEffect, useState } from 'react';
import { getActivities } from '@/lib/mock/activity';

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
        const activities = await getActivities();
        const totalBets = activities.length;
        const uniqueTraders = new Set(
          activities.map(a => a.user_address?.toLowerCase()).filter(Boolean)
        ).size;
        setStats({ totalBets, uniqueTraders });
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
