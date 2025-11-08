"use client";
import "@rainbow-me/rainbowkit/styles.css";
import React from "react";
import { WagmiProvider, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultConfig, darkTheme } from "@rainbow-me/rainbowkit";
import { somniaTestnet } from "@/config/somnia";

const queryClient = new QueryClient();

// Add safety check for somniaTestnet
if (!somniaTestnet) {
  console.error("somniaTestnet is undefined");
  throw new Error("somniaTestnet configuration is missing");
}

console.log("somniaTestnet config:", somniaTestnet);

const wagmiConfig = getDefaultConfig({
  appName: "Somnia Predict",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
  chains: [somniaTestnet as any],
  transports: {
    [somniaTestnet.id]: http(somniaTestnet.rpcUrls.default.http[0]),
  },
  ssr: true,
}) as any;

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({ accentColor: "#7c3aed" })}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}