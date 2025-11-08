"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SDK } from '@somnia-chain/streams';
import { createPublicClient, http } from 'viem';
import { somniaTestnet } from '@/config/somnia';

interface SomniaStreamsContextType {
  sdk: SDK | null;
  publicClient: any;
  isConnected: boolean;
}

const SomniaStreamsContext = createContext<SomniaStreamsContextType>({
  sdk: null,
  publicClient: null,
  isConnected: false,
});

export const useSomniaStreams = () => {
  const context = useContext(SomniaStreamsContext);
  if (!context) {
    throw new Error('useSomniaStreams must be used within SomniaStreamsProvider');
  }
  return context;
};

export function SomniaStreamsProvider({ children }: { children: React.ReactNode }) {
  const [sdk, setSdk] = useState<SDK | null>(null);
  const [publicClient, setPublicClient] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    try {
      // Create public client for Somnia
      // Note: Using HTTP transport with polling interval for real-time updates
      const client = createPublicClient({
        chain: somniaTestnet,
        transport: http('https://dream-rpc.somnia.network', {
          batch: true,
          retryCount: 3,
        }),
        pollingInterval: 1000, // Poll every 1 second for new blocks
      });

      // Initialize Somnia Streams SDK
      const streamsSDK = new SDK({ public: client });
      
      setSdk(streamsSDK);
      setPublicClient(client);
      setIsConnected(true);
      
      console.log('✅ Somnia Streams SDK initialized with HTTP polling');
    } catch (error) {
      console.error('❌ Failed to initialize Somnia Streams SDK:', error);
      setIsConnected(false);
    }
  }, []);

  return (
    <SomniaStreamsContext.Provider value={{ sdk, publicClient, isConnected }}>
      {children}
    </SomniaStreamsContext.Provider>
  );
}
