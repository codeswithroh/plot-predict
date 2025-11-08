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
              {events.map((event) => (
              <div
                key={event.id || `${event.timestamp}`}
                className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50 animate-in slide-in-from-top duration-300"
              >
                <div className="flex items-center space-x-2">
                  {event.type === 'BET_PLACED' && (
                    <>
                      <TrendingUp className="h-4 w-4 text-[#9b87f5]" />
                      <span className="text-sm text-white font-medium">New Bet Placed</span>
                    </>
                  )}
                  {event.type === 'MARKET_RESOLVED' && (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-white font-medium">Market Resolved</span>
                    </>
                  )}
                  {event.type === 'MARKET_CREATED' && (
                    <>
                      <Activity className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-white font-medium">New Market</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </p>
              </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
