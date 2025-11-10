import { useEffect, useState, useCallback, useRef } from 'react';
import { useSomniaStreams } from '@/providers/somnia-streams-provider';
import { PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI } from '@/lib/contracts/prediction-market';
import { toast } from 'sonner';
import { formatEther } from 'viem';

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

// Global set to track processed events across all hook instances
const globalProcessedEventIds = new Set<string>();

export function useMarketStream(options: UseMarketStreamOptions = {}) {
  const { publicClient, isConnected } = useSomniaStreams();
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const lastCheckedBlockRef = useRef<bigint>(BigInt(0));

  const handleEvent = useCallback(async (eventType: MarketEvent['type'], data: any, blockNumber?: bigint, logIndex?: number) => {
    // Create unique ID from block number, log index, and event data
    const eventId = `${blockNumber}-${logIndex}-${eventType}-${data.marketId?.toString() || ''}-${data.user?.toString() || ''}`;
    
    // Check if we've already processed this event (BEFORE showing notification)
    if (globalProcessedEventIds.has(eventId)) {
      console.log('⏭️ Skipping duplicate event:', eventId);
      return;
    }

    // Mark as processed
    globalProcessedEventIds.add(eventId);

    // Fetch market details first
    let marketTitle = `Market #${data.marketId?.toString()}`;
    try {
      if (publicClient && data.marketId) {
        console.log('🔍 Fetching market title for:', data.marketId?.toString());
        const marketData = await publicClient.readContract({
          address: PREDICTION_MARKET_ADDRESS,
          abi: PREDICTION_MARKET_ABI,
          functionName: 'getMarket',
          args: [data.marketId],
        }) as any;
        
        console.log('📊 Market data received:', marketData);
        
        if (marketData && marketData.title) {
          marketTitle = marketData.title;
          console.log('✅ Market title set to:', marketTitle);
        } else {
          console.log('⚠️ No title in market data');
        }
      }
    } catch (error) {
      console.error('❌ Failed to fetch market title:', error);
    }

    // Use blockchain timestamp if available (BetPlaced has timestamp field)
    const timestamp = data.timestamp ? Number(data.timestamp) * 1000 : Date.now();

    const event: MarketEvent = {
      id: eventId,
      type: eventType,
      marketId: data.marketId?.toString() || options.marketId || 'all',
      data: {
        ...data,
        marketTitle, // Add market title to event data
      },
      timestamp,
    };

    console.log('📦 Event created with data:', { marketTitle, eventType, marketId: event.marketId });

    setEvents(prev => [event, ...prev].slice(0, 50)); // Keep last 50 events

    // Call specific handlers and show notifications (AFTER duplicate check)
    switch (eventType) {
      case 'BET_PLACED':
        const amount = data.amount ? (Number(data.amount) / 1e18).toFixed(2) : '?';
        const outcome = data.outcome === 0 ? 'Yes' : 'No';
        
        toast.success(`New bet: ${amount} STT on ${outcome}`, {
          description: marketTitle,
        });
        options.onBetPlaced?.(data);
        console.log('🎯 New bet placed:', data);
        break;
      case 'MARKET_RESOLVED':
        const winner = data.winningOutcome === 0 ? 'Yes' : 'No';
        
        // Fetch market title for resolved notification
        let resolvedMarketTitle = `Market #${data.marketId?.toString()}`;
        try {
          if (publicClient && data.marketId) {
            const marketData = await publicClient.readContract({
              address: PREDICTION_MARKET_ADDRESS,
              abi: PREDICTION_MARKET_ABI,
              functionName: 'getMarket',
              args: [data.marketId],
            }) as any;
            
            if (marketData && marketData.title) {
              resolvedMarketTitle = marketData.title;
            }
          }
        } catch (error) {
          console.error('Failed to fetch market title:', error);
        }
        
        toast.success(`Market Resolved: ${resolvedMarketTitle}`, {
          description: `Winner: ${winner}`,
        });
        options.onMarketResolved?.(data);
        console.log('⚖️ Market resolved:', data);
        break;
      case 'MARKET_CREATED':
        // For created events, title is in the event data
        const createdTitle = data.title || `Market #${data.marketId?.toString()}`;
        toast.info('New Market Created!', {
          description: createdTitle,
        });
        options.onMarketCreated?.(data);
        console.log('🆕 New market created:', data);
        break;
    }
  }, [options, publicClient]);

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

      // Fetch market titles for all unique markets
      const uniqueMarketIds = new Set(allBetPlacedLogs.map((log: any) => log.args.marketId?.toString()).filter(Boolean));
      const marketTitles = new Map<string, string>();
      
      for (const marketId of Array.from(uniqueMarketIds)) {
        try {
          const marketData = await publicClient.readContract({
            address: PREDICTION_MARKET_ADDRESS,
            abi: PREDICTION_MARKET_ABI,
            functionName: 'getMarket',
            args: [BigInt(marketId)],
          }) as any;
          
          if (marketData && marketData.title) {
            marketTitles.set(marketId, marketData.title);
          }
        } catch (error) {
          console.error(`Failed to fetch title for market ${marketId}:`, error);
        }
      }

      allBetPlacedLogs.forEach((log: any) => {
        const eventId = `${log.blockNumber}-${log.logIndex}-BET_PLACED-${log.args.marketId?.toString() || ''}-${log.args.user?.toString() || ''}`;
        if (!globalProcessedEventIds.has(eventId)) {
          const marketId = log.args.marketId?.toString() || 'unknown';
          const marketTitle = marketTitles.get(marketId) || `Market #${marketId}`;
          
          // Use block timestamp for accurate time
          const timestamp = blockTimestamps.get(log.blockNumber) || Date.now();
          historicalEvents.push({
            id: eventId,
            type: 'BET_PLACED',
            marketId,
            data: {
              ...log.args,
              marketTitle,
            },
            timestamp,
          });
          globalProcessedEventIds.add(eventId);
        }
      });

      allMarketResolvedLogs.forEach((log: any) => {
        const eventId = `${log.blockNumber}-${log.logIndex}-MARKET_RESOLVED-${log.args.marketId?.toString() || ''}`;
        if (!globalProcessedEventIds.has(eventId)) {
          // MarketResolved doesn't have timestamp in event, use current time
          historicalEvents.push({
            id: eventId,
            type: 'MARKET_RESOLVED',
            marketId: log.args.marketId?.toString() || 'unknown',
            data: log.args,
            timestamp: Date.now(),
          });
          globalProcessedEventIds.add(eventId);
        }
      });

      allMarketCreatedLogs.forEach((log: any) => {
        const eventId = `${log.blockNumber}-${log.logIndex}-MARKET_CREATED-${log.args.marketId?.toString() || ''}`;
        if (!globalProcessedEventIds.has(eventId)) {
          // MarketCreated doesn't have timestamp in event, use current time
          historicalEvents.push({
            id: eventId,
            type: 'MARKET_CREATED',
            marketId: log.args.marketId?.toString() || 'unknown',
            data: log.args,
            timestamp: Date.now(),
          });
          globalProcessedEventIds.add(eventId);
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

    const setupStream = async () => {
      try {
        setIsStreaming(true);
        console.log('🔴 Starting market stream for contract:', PREDICTION_MARKET_ADDRESS);

        // Initialize lastCheckedBlock if not set
        if (lastCheckedBlockRef.current === BigInt(0)) {
          lastCheckedBlockRef.current = await publicClient.getBlockNumber();
          console.log('📍 Starting from block:', lastCheckedBlockRef.current.toString());
        }

        // Manual polling: Check for new events every 1 second
        const pollInterval = setInterval(async () => {
          try {
            
            const currentBlock = await publicClient.getBlockNumber();
            
            const lastBlock = lastCheckedBlockRef.current;
            
            if (currentBlock > lastBlock) {
              console.log('🔍 Checking blocks', lastBlock.toString(), 'to', currentBlock.toString());
              
              // Get new BetPlaced events
              const newBets = await publicClient.getContractEvents({
                address: PREDICTION_MARKET_ADDRESS,
                abi: PREDICTION_MARKET_ABI,
                eventName: 'BetPlaced',
                fromBlock: lastBlock + BigInt(1),
                toBlock: currentBlock,
              });

              if (newBets.length > 0) {
                console.log('🎯 Found', newBets.length, 'new bet(s)!');
                
                // Process each bet
                for (const log of newBets) {
                  try {
                    console.log('📦 Processing bet from block:', log.blockNumber.toString());
                    await handleEvent('BET_PLACED', log.args, log.blockNumber, log.logIndex);
                  } catch (error) {
                    console.error('Error processing bet:', error);
                  }
                }
              }

              lastCheckedBlockRef.current = currentBlock;
            }
          } catch (error) {
            console.error('❌ Polling error:', error);
          }
        }, 1000); // Check every 1 second for faster updates

        unwatchFunctions.push(() => clearInterval(pollInterval));
        console.log('✅ Manual polling started (every 1 second)');

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
