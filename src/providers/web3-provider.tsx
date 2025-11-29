"use client";
import "@rainbow-me/rainbowkit/styles.css";
import React from "react";
import { WagmiProvider, http, useAccount, useChainId, useSwitchChain } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultConfig, darkTheme } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

const queryClient = new QueryClient();

// Monad testnet chain (configurable via env)
const MONAD_CHAIN_ID = Number(process.env.NEXT_PUBLIC_MONAD_CHAIN_ID || 20143);
const MONAD_RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "";

export const monadTestnet = defineChain({
  id: MONAD_CHAIN_ID,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: [MONAD_RPC_URL].filter(Boolean) as string[] },
    public: { http: [MONAD_RPC_URL].filter(Boolean) as string[] },
  },
});

const wagmiConfig = getDefaultConfig({
  appName: "PlotPredict",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(MONAD_RPC_URL ? MONAD_RPC_URL : undefined),
  },
  ssr: true,
}) as any;

function AutoSwitch({ targetChainId }: { targetChainId: number }) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  React.useEffect(() => {
    if (!isConnected) return;
    if (chainId === targetChainId) return;
    // Attempt silent switch; wallet may prompt the user
    switchChainAsync({ chainId: targetChainId }).catch(() => {
      // no-op: user declined or connector doesn't support auto switch
    });
  }, [isConnected, chainId, targetChainId, switchChainAsync]);

  return null;
}

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({ accentColor: "#7c3aed" })}>
          <AutoSwitch targetChainId={monadTestnet.id} />
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}