import { useEffect } from 'react';
import { useMarketStream } from './use-market-stream';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

export function useLiveNotifications() {
  const { address } = useAccount();
  
  useMarketStream({
    onMarketResolved: (data) => {
      // Show notification when market resolves
      toast.success('🎉 Market Resolved!', {
        description: 'Check if you won and claim your winnings',
        duration: 5000,
      });
    },
    
    onBetPlaced: (data) => {
      // Optional: Show notification for large bets
      // You can parse the bet amount from data and show if it's significant
      console.log('💰 New bet detected:', data);
    },
    
    onMarketCreated: (data) => {
      // Show notification for new markets
      toast.info('🆕 New Market Created!', {
        description: 'Check out the latest prediction market',
        duration: 4000,
      });
    },
  });
}
