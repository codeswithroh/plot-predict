// Export Somnia chain definitions for wagmi/viem
export const somniaTestnet = {
  id: 50312,
  name: "Somnia Testnet",
  nativeCurrency: { name: "Somnia Test Token", symbol: "STT", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://dream-rpc.somnia.network"],
      webSocket: ["wss://dream-rpc.somnia.network"],
    },
    public: {
      http: ["https://dream-rpc.somnia.network"],
      webSocket: ["wss://dream-rpc.somnia.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://somnia-testnet.blockscout.com",
    },
  },
} as const;

export type SomniaChain = typeof somniaTestnet;

// Backward compatibility exports
export const creditcoinTestnet = somniaTestnet;
export type CreditcoinChain = typeof somniaTestnet;
