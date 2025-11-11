import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMarketStream } from '@/hooks/use-market-stream';
import { Activity, TrendingUp, CheckCircle, Loader2, History } from 'lucide-react';

interface LiveActivityFeedProps {
  marketId?: string;
  onNewBet?: () => void;
}

export const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({ 
  marketId,
  onNewBet 
}) => {
  const { events, isStreaming, isConnected, isLoadingHistory, loadHistory } = useMarketStream({
    marketId,
    onBetPlaced: (data) => {
      console.log('🎯 Live bet detected:', data);
      onNewBet?.();
    },
  });

  return (
    <Card className="bg-gradient-to-r from-[#1A1F2C] to-[#151923] border-gray-800/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-[#9b87f5]" />
            <h3 className="text-lg font-semibold text-white">Live Activity</h3>
          </div>
          
          {isConnected && isStreaming ? (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
              LIVE
            </Badge>
          ) : (
            <Badge variant="outline" className="text-gray-400 border-gray-600">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Connecting...
            </Badge>
          )}
        </div>

        {events.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Waiting for live activity...</p>
            <p className="text-xs mt-1 mb-4">Events will appear here in real-time</p>
            <Button
              onClick={loadHistory}
              disabled={isLoadingHistory}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              {isLoadingHistory ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <History className="h-4 w-4 mr-2" />
                  Load History
                </>
              )}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-2">
              <Button
                onClick={loadHistory}
                disabled={isLoadingHistory}
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-800/50"
              >
                {isLoadingHistory ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <History className="h-3 w-3 mr-1" />
                    Load More
                  </>
                )}
              </Button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {events.map((event) => {
                // Extract event details
                const amount = event.data?.amount ? (Number(event.data.amount) / 1e18).toFixed(2) : '?';
                const optionA = event.data?.optionA || 'Yes';
                const optionB = event.data?.optionB || 'No';
                // BetPlaced uses 'option', MarketResolved uses 'outcome'
                const selectedOption = event.data?.option !== undefined ? event.data.option : event.data?.outcome;
                const outcome = selectedOption === 0 ? optionA : optionB;
                const user = event.data?.user ? `${event.data.user.slice(0, 6)}...${event.data.user.slice(-4)}` : 'Unknown';
                const marketTitleText = event.data?.marketTitle || `Market #${event.marketId}`;
                
                return (
                  <div
                    key={event.id || `${event.timestamp}`}
                    className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50 animate-in slide-in-from-top duration-300"
                  >
                    {event.type === 'BET_PLACED' && (
                      <>
                        <div className="flex items-center space-x-2 mb-1">
                          <TrendingUp className="h-4 w-4 text-[#9b87f5]" />
                          <span className="text-sm text-white font-medium">New Bet</span>
                        </div>
                        <div className="text-xs text-gray-300 space-y-0.5">
                          <div className="text-xs text-[#9b87f5] font-medium mb-1 truncate">
                            {marketTitleText}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400">Amount:</span>
                            <span className="text-[#9b87f5] font-semibold">{amount} STT</span>
                            <span className="text-gray-400">on</span>
                            <span className="text-white font-medium">{outcome}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400">By:</span>
                            <span className="text-gray-300">{user}</span>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {event.type === 'MARKET_RESOLVED' && (
                      <>
                        <div className="flex items-center space-x-2 mb-1">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-sm text-white font-medium">Market Resolved</span>
                        </div>
                        <div className="text-xs text-gray-300">
                          <span className="text-gray-400">Winner:</span>
                          <span className="text-green-400 font-semibold ml-1">
                            {event.data?.winningOutcome === 0 ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </>
                    )}
                    
                    {event.type === 'MARKET_CREATED' && (
                      <>
                        <div className="flex items-center space-x-2 mb-1">
                          <Activity className="h-4 w-4 text-blue-400" />
                          <span className="text-sm text-white font-medium">New Market</span>
                        </div>
                        <div className="text-xs text-gray-300">
                          <span className="text-gray-400">Market ID:</span>
                          <span className="text-blue-400 font-semibold ml-1">#{event.marketId}</span>
                        </div>
                      </>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-1.5">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
