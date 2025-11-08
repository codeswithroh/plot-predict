import { useEffect, useState, useCallback, useRef } from 'react';
import { useSomniaStreams } from '@/providers/somnia-streams-provider';
import { PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI } from '@/lib/contracts/prediction-market';
import { toast } from 'sonner';

interface MarketEvent {
  id: string; // Unique identifier for deduplication
  type: 'BET_PLACED' | 'MARKET_RESOLVED' | 'MARKET_CREATED';
  marketId: string;
  data: any;
  timestamp: number;
}

interface UseMarketStreamOptions {
  marketId?: string;
  onBetPlaced?: (data: any) => void;
  onMarketResolved?: (data: any) => void;
  onMarketCreated?: (data: any) => void;
}

export function useMarketStream(options: UseMarketStreamOptions = {}) {
  const { publicClient, isConnected } = useSomniaStreams();
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const processedEventIdsRef = useRef<Set<string>>(new Set());

  const handleEvent = useCallback((eventType: MarketEvent['type'], data: any, blockNumber?: bigint, logIndex?: number) => {
    // Create unique ID from block number, log index, and event data
    const eventId = `${blockNumber}-${logIndex}-${eventType}-${data.marketId?.toString() || ''}-${data.user?.toString() || ''}`;
    
    // Check if we've already processed this event
    if (processedEventIdsRef.current.has(eventId)) {
      console.log('⏭️ Skipping duplicate event:', eventId);
      return;
    }

    // Mark as processed
    processedEventIdsRef.current.add(eventId);

    // Use blockchain timestamp if available (BetPlaced has timestamp field)
    const timestamp = data.timestamp ? Number(data.timestamp) * 1000 : Date.now();

    const event: MarketEvent = {
      id: eventId,
      type: eventType,
      marketId: data.marketId?.toString() || options.marketId || 'all',
      data,
      timestamp,
    };

    setEvents(prev => [event, ...prev].slice(0, 50)); // Keep last 50 events

    // Call specific handlers
    switch (eventType) {
      case 'BET_PLACED':
        options.onBetPlaced?.(data);
        console.log('🎯 New bet placed:', data);
        break;
      case 'MARKET_RESOLVED':
        options.onMarketResolved?.(data);
        toast.success('Market resolved!');
        console.log('⚖️ Market resolved:', data);
        break;
      case 'MARKET_CREATED':
        options.onMarketCreated?.(data);
        console.log('🆕 New market created:', data);
        break;
    }
  }, [options]);

  const loadHistory = useCallback(async () => {
    if (!publicClient) {
      console.log('❌ No public client available');
      return;
    }

    try {
      setIsLoadingHistory(true);
      console.log('📚 Loading historical events...');

      const currentBlock = await publicClient.getBlockNumber();
      
      // Somnia RPC allows max 1000 blocks per request
      // Let's try multiple ranges if needed
      const allBetPlacedLogs: any[] = [];
      const allMarketResolvedLogs: any[] = [];
      const allMarketCreatedLogs: any[] = [];
      
      // Try last 5000 blocks in chunks of 1000
      const totalBlocks = 5000;
      const chunkSize = 1000;
      const chunks = Math.ceil(totalBlocks / chunkSize);
      
      for (let i = 0; i < chunks; i++) {
        const toBlock = currentBlock - BigInt(i * chunkSize);
        const fromBlock = toBlock - BigInt(chunkSize);
        
        console.log(`📚 Checking block range ${i + 1}/${chunks}:`, {
          from: fromBlock.toString(),
          to: toBlock.toString(),
        });

        try {
          // Get BetPlaced events for this range
          const betPlacedLogs = await publicClient.getContractEvents({
            address: PREDICTION_MARKET_ADDRESS,
            abi: PREDICTION_MARKET_ABI,
            eventName: 'BetPlaced',
            fromBlock,
            toBlock,
          });
          allBetPlacedLogs.push(...betPlacedLogs);

          // Get MarketResolved events for this range
          const marketResolvedLogs = await publicClient.getContractEvents({
            address: PREDICTION_MARKET_ADDRESS,
            abi: PREDICTION_MARKET_ABI,
            eventName: 'MarketResolved',
            fromBlock,
            toBlock,
          });
          allMarketResolvedLogs.push(...marketResolvedLogs);

          // Get MarketCreated events for this range
          const marketCreatedLogs = await publicClient.getContractEvents({
            address: PREDICTION_MARKET_ADDRESS,
            abi: PREDICTION_MARKET_ABI,
            eventName: 'MarketCreated',
            fromBlock,
            toBlock,
          });
          allMarketCreatedLogs.push(...marketCreatedLogs);
          
          console.log(`📚 Found in range ${i + 1}: ${betPlacedLogs.length} bets, ${marketResolvedLogs.length} resolutions, ${marketCreatedLogs.length} markets`);
        } catch (error) {
          console.error(`❌ Error fetching range ${i + 1}:`, error);
        }
      }

      console.log('📚 Total events found:', {
        bets: allBetPlacedLogs.length,
        resolutions: allMarketResolvedLogs.length,
        markets: allMarketCreatedLogs.length,
      });

      // Process historical events
      const historicalEvents: MarketEvent[] = [];

      // Get block timestamps for accurate event times
      const blockTimestamps = new Map<bigint, number>();
      
      for (const log of allBetPlacedLogs) {
        if (!blockTimestamps.has(log.blockNumber)) {
          try {
            const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
            blockTimestamps.set(log.blockNumber, Number(block.timestamp) * 1000);
          } catch (error) {
            console.error('Failed to get block timestamp:', error);
          }
        }
      }

      allBetPlacedLogs.forEach((log: any) => {
        const eventId = `${log.blockNumber}-${log.logIndex}-BET_PLACED-${log.args.marketId?.toString() || ''}-${log.args.user?.toString() || ''}`;
        if (!processedEventIdsRef.current.has(eventId)) {
          // Use block timestamp for accurate time
          const timestamp = blockTimestamps.get(log.blockNumber) || Date.now();
          historicalEvents.push({
            id: eventId,
            type: 'BET_PLACED',
            marketId: log.args.marketId?.toString() || 'unknown',
            data: log.args,
            timestamp,
          });
          processedEventIdsRef.current.add(eventId);
        }
      });

      allMarketResolvedLogs.forEach((log: any) => {
        const eventId = `${log.blockNumber}-${log.logIndex}-MARKET_RESOLVED-${log.args.marketId?.toString() || ''}`;
        if (!processedEventIdsRef.current.has(eventId)) {
          // MarketResolved doesn't have timestamp in event, use current time
          historicalEvents.push({
            id: eventId,
            type: 'MARKET_RESOLVED',
            marketId: log.args.marketId?.toString() || 'unknown',
            data: log.args,
            timestamp: Date.now(),
          });
          processedEventIdsRef.current.add(eventId);
        }
      });

      allMarketCreatedLogs.forEach((log: any) => {
        const eventId = `${log.blockNumber}-${log.logIndex}-MARKET_CREATED-${log.args.marketId?.toString() || ''}`;
        if (!processedEventIdsRef.current.has(eventId)) {
          // MarketCreated doesn't have timestamp in event, use current time
          historicalEvents.push({
            id: eventId,
            type: 'MARKET_CREATED',
            marketId: log.args.marketId?.toString() || 'unknown',
            data: log.args,
            timestamp: Date.now(),
          });
          processedEventIdsRef.current.add(eventId);
        }
      });

      // Add historical events to existing events
      setEvents(prev => [...prev, ...historicalEvents].slice(0, 50));
      console.log('✅ Loaded', historicalEvents.length, 'historical events');
    } catch (error) {
      console.error('❌ Failed to load history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [publicClient]);

  useEffect(() => {
    if (!publicClient || !isConnected) {
      console.log('⏳ Waiting for Somnia Streams SDK...');
      return;
    }

    const unwatchFunctions: (() => void)[] = [];

    const setupStream = () => {
      try {
        setIsStreaming(true);
        console.log('🔴 Starting market stream for contract:', PREDICTION_MARKET_ADDRESS);

        // Now watch for new events
        // Watch BetPlaced events
        const unwatchBetPlaced = publicClient.watchContractEvent({
          address: PREDICTION_MARKET_ADDRESS,
          abi: PREDICTION_MARKET_ABI,
          eventName: 'BetPlaced',
          onLogs: (logs: any[]) => {
            logs.forEach((log: any) => {
              console.log('🎯 BetPlaced event detected!', log);
              handleEvent('BET_PLACED', log.args, log.blockNumber, log.logIndex);
            });
          },
          pollingInterval: 2000, // Increased to 2 seconds to reduce duplicate checks
        });
        unwatchFunctions.push(unwatchBetPlaced);

        // Watch MarketResolved events
        const unwatchMarketResolved = publicClient.watchContractEvent({
          address: PREDICTION_MARKET_ADDRESS,
          abi: PREDICTION_MARKET_ABI,
          eventName: 'MarketResolved',
          onLogs: (logs: any[]) => {
            logs.forEach((log: any) => {
              console.log('⚖️ MarketResolved event detected!', log);
              handleEvent('MARKET_RESOLVED', log.args, log.blockNumber, log.logIndex);
            });
          },
          pollingInterval: 2000,
        });
        unwatchFunctions.push(unwatchMarketResolved);

        // Watch MarketCreated events
        const unwatchMarketCreated = publicClient.watchContractEvent({
          address: PREDICTION_MARKET_ADDRESS,
          abi: PREDICTION_MARKET_ABI,
          eventName: 'MarketCreated',
          onLogs: (logs: any[]) => {
            logs.forEach((log: any) => {
              console.log('🆕 MarketCreated event detected!', log);
              handleEvent('MARKET_CREATED', log.args, log.blockNumber, log.logIndex);
            });
          },
          pollingInterval: 2000,
        });
        unwatchFunctions.push(unwatchMarketCreated);

        console.log('✅ Market stream active with contract address:', PREDICTION_MARKET_ADDRESS);
      } catch (error) {
        console.error('❌ Failed to setup market stream:', error);
        setIsStreaming(false);
      }
    };

    setupStream();

    return () => {
      unwatchFunctions.forEach(unwatch => unwatch());
      console.log('🔴 Market stream stopped');
      setIsStreaming(false);
    };
  }, [publicClient, isConnected, handleEvent]);

  return {
    events,
    isStreaming,
    isConnected,
    isLoadingHistory,
    loadHistory,
  };
}
