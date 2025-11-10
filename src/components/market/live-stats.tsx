import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { useMarketStream } from '@/hooks/use-market-stream';
import { TrendingUp, Users, DollarSign } from 'lucide-react';

interface LiveStatsProps {
  marketId: string;
  initialVolume?: number;
  initialBets?: number;
}

export const LiveStats: React.FC<LiveStatsProps> = ({
  marketId,
  initialVolume = 0,
  initialBets = 0,
}) => {
  const [volume, setVolume] = useState(initialVolume);
  const [betCount, setBetCount] = useState(initialBets);
  const [recentActivity, setRecentActivity] = useState(false);

  const { isStreaming } = useMarketStream({
    marketId,
    onBetPlaced: (data) => {
      // Update stats when new bet comes in
      setBetCount(prev => prev + 1);
      
      // Flash animation
      setRecentActivity(true);
      setTimeout(() => setRecentActivity(false), 2000);
      
      console.log('📊 Stats updated:', { betCount: betCount + 1 });
    },
  });

  // Sync with initial values
  useEffect(() => {
    console.log('📊 LiveStats received props:', { initialVolume, initialBets });
    setVolume(initialVolume);
    setBetCount(initialBets);
  }, [initialVolume, initialBets]);

  return (
    <div className="flex items-center space-x-4">
      {/* Live Indicator */}
      {isStreaming && (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
          LIVE
        </Badge>
      )}

      {/* Bet Count */}
      <div className={`flex items-center space-x-2 transition-all duration-300 ${
        recentActivity ? 'scale-110 text-[#9b87f5]' : 'text-gray-400'
      }`}>
        <Users className="h-4 w-4" />
        <span className="text-sm font-medium">{betCount} bets</span>
      </div>

      {/* Volume */}
      <div className="flex items-center space-x-2 text-gray-400">
        <DollarSign className="h-4 w-4" />
        <span className="text-sm font-medium">{volume.toFixed(2)} STT</span>
      </div>
    </div>
  );
};
