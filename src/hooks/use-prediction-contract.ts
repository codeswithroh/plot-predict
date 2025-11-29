import { useWriteContract, useReadContract, useReadContracts, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther, type Address } from 'viem';
import { MARKET_FACTORY_ABI, MARKET_ABI, FACTORY_ADDRESS } from '@/lib/contracts/plotpredict';
import { Market } from '@/types/market';
import { useState } from 'react';
import { toast } from 'sonner';

export const usePredictionContract = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Place Bet Function
  const placeBet = async (marketId: string, option: 0 | 1, amount: string) => {
    try {
      setIsLoading(true);
      console.log('🎯 Placing bet:', { marketId, option, amount });
      // Resolve market address by id via factory
      const marketAddress = await (async () => {
        const res = await (window as any).wagmi?.config?.getClient?.()?.readContract?.({
          address: FACTORY_ADDRESS,
          abi: MARKET_FACTORY_ABI,
          functionName: 'marketById',
          args: [BigInt(marketId)],
        });
        return res as Address;
      })();

      const fn = option === 0 ? 'placeYes' : 'placeNo';
      const result = await writeContract({
        address: marketAddress,
        abi: MARKET_ABI,
        functionName: fn,
        args: [],
        value: parseEther(amount),
      });
      
      toast.success('Bet transaction submitted!');
      return result;
    } catch (error: any) {
      console.error('❌ Error placing bet:', error);
      toast.error(error?.message || 'Failed to place bet');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Resolve Market (Admin only)
  const resolveMarket = async (marketId: string, outcome: 0 | 1) => {
    try {
      setIsLoading(true);
      console.log('⚖️ Resolving market:', { marketId, outcome });
      const marketAddress = await (async () => {
        const res = await (window as any).wagmi?.config?.getClient?.()?.readContract?.({
          address: FACTORY_ADDRESS,
          abi: MARKET_FACTORY_ABI,
          functionName: 'marketById',
          args: [BigInt(marketId)],
        });
        return res as Address;
      })();
      const fn = outcome === 0 ? 'resolveYes' : 'resolveNo';
      const result = await writeContract({
        address: marketAddress,
        abi: MARKET_ABI,
        functionName: fn,
        args: [],
      });
      
      toast.success('Market resolution submitted!');
      return result;
    } catch (error: any) {
      console.error('❌ Error resolving market:', error);
      toast.error(error?.message || 'Failed to resolve market');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create Market (Admin only)
  const createMarket = async (marketData: {
    title: string;
    description: string;
    optionA: string;
    optionB: string;
    category: number;
    endTime: number;
    minBet: string;
    maxBet: string;
    imageUrl: string;
  }) => {
    try {
      setIsLoading(true);
      console.log('🏗️ Creating market:', marketData);
      // Map to factory.createMarket(question,imageUrl,lockTime)
      const result = await writeContract({
        address: FACTORY_ADDRESS,
        abi: MARKET_FACTORY_ABI,
        functionName: 'createMarket',
        args: [
          marketData.title,
          marketData.imageUrl,
          BigInt(marketData.endTime),
        ],
      });
      
      toast.success('Market creation submitted!');
      return result;
    } catch (error: any) {
      console.error('❌ Error creating market:', error);
      toast.error(error?.message || 'Failed to create market');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Claim Winnings Function
  const claimWinnings = async (marketId: string) => {
    try {
      setIsLoading(true);
      console.log('💰 Claiming winnings for market:', marketId);
      const marketAddress = await (async () => {
        const res = await (window as any).wagmi?.config?.getClient?.()?.readContract?.({
          address: FACTORY_ADDRESS,
          abi: MARKET_FACTORY_ABI,
          functionName: 'marketById',
          args: [BigInt(marketId)],
        });
        return res as Address;
      })();
      const result = await writeContract({
        address: marketAddress,
        abi: MARKET_ABI,
        functionName: 'claim',
        args: [],
      });
      
      toast.success('Winnings claimed successfully!');
      return result;
    } catch (error: any) {
      console.error('❌ Error claiming winnings:', error);
      toast.error(error?.message || 'Failed to claim winnings');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    placeBet,
    resolveMarket,
    createMarket,
    claimWinnings,
    isLoading: isLoading || isPending || isConfirming,
    isSuccess,
    hash,
    error,
  };
};

// Hook to read contract data
export const usePredictionContractRead = () => {
  // Get all market addresses
  const { data: marketAddresses, isLoading: allMarketsLoading, refetch: refetchAllMarkets } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: MARKET_FACTORY_ABI,
    functionName: 'markets',
  });

  // Batch read getInfo from each market
  const addresses = (marketAddresses as Address[] | undefined) || [];
  const contracts = addresses.map((addr) => ({ address: addr, abi: MARKET_ABI, functionName: 'getInfo' as const }));
  const { data: infos, isLoading: infosLoading, refetch: refetchInfos } = useReadContracts({
    contracts,
    allowFailure: true,
  });

  // Transform contract data to Market type
  const transformContractMarket = (contractMarket: any, address?: Address): Market => {
    const totalPool = formatEther(contractMarket._totalPool ?? contractMarket.totalPool);
    console.log('🔍 Transform Market:', {
      id: (contractMarket._id ?? contractMarket.id).toString(),
      title: contractMarket._question ?? contractMarket.title,
      totalPoolRaw: (contractMarket._totalPool ?? contractMarket.totalPool).toString(),
      totalPoolFormatted: totalPool,
      totalOptionAShares: formatEther(contractMarket._totalYes ?? contractMarket.totalOptionAShares ?? BigInt(0)),
      totalOptionBShares: formatEther(contractMarket._totalNo ?? contractMarket.totalOptionBShares ?? BigInt(0)),
    });
    
    return {
      id: (contractMarket._id ?? contractMarket.id).toString(),
      title: contractMarket._question ?? contractMarket.title,
      description: '',
      category: 3,
      optionA: 'YES',
      optionB: 'NO',
      creator: address || '0x0000000000000000000000000000000000000000',
      createdAt: '0',
      endTime: (contractMarket._lockTime ?? contractMarket.endTime)?.toString?.() ?? '0',
      minBet: '0',
      maxBet: '0',
      status: (contractMarket._resolved ?? contractMarket.resolved) ? 2 : 0,
      outcome: (contractMarket._resolved ?? contractMarket.resolved)
        ? Number(contractMarket._outcome ?? contractMarket.outcome)
        : null,
      resolved: Boolean(contractMarket._resolved ?? contractMarket.resolved),
      totalOptionAShares: formatEther(contractMarket._totalYes ?? BigInt(0)),
      totalOptionBShares: formatEther(contractMarket._totalNo ?? BigInt(0)),
      totalPool: totalPool,
      imageURI: contractMarket._imageUrl ?? contractMarket.imageUrl,
    };
  };

  // Get single market by id via factory.marketById(id) then market.getInfo()
  const getMarket = (marketId: string) => {
    const { data: marketAddress } = useReadContract({
      address: FACTORY_ADDRESS,
      abi: MARKET_FACTORY_ABI,
      functionName: 'marketById',
      args: [BigInt(marketId)],
    });
    const { data: info, isLoading, refetch } = useReadContract({
      address: (marketAddress as Address) || undefined,
      abi: MARKET_ABI,
      functionName: 'getInfo',
      query: { enabled: Boolean(marketAddress) },
    });

    return {
      market: info ? transformContractMarket((info as any)[0] ?? info, marketAddress as Address) : null,
      isLoading,
      refetch,
    };
  };

  // Get user position
  const getUserPosition = (userAddress: string, marketId: string) => {
    // Position is derived from ERC1155 balances; for now, leave zeroes (can be enhanced)
    const positionData = null as any;
    const isLoading = false;
    const refetch = async () => {};

    return {
      position: null,
      isLoading,
      refetch,
    };
  };

  return {
    allMarkets: infos ? (infos as any[]).map((x, i) => x?.result ? transformContractMarket((x as any).result[0] ?? (x as any).result, addresses[i]) : null).filter(Boolean) as Market[] : [],
    activeMarkets: infos
      ? (infos as any[])
          .map((x, i) => (x?.result ? transformContractMarket((x as any).result[0] ?? (x as any).result, addresses[i]) : null))
          .filter((m: any) => {
            if (!m) return false;
            const now = Math.floor(Date.now() / 1000);
            const end = Number(m.endTime || 0);
            return !m.resolved && end > now;
          }) as Market[]
      : [],
    allMarketsLoading: allMarketsLoading || infosLoading,
    activeMarketsLoading: allMarketsLoading || infosLoading,
    refetchAllMarkets: async () => { await refetchAllMarkets(); await refetchInfos(); },
    refetchActiveMarkets: async () => { await refetchAllMarkets(); await refetchInfos(); },
    getMarket,
    getUserPosition,
  };
};